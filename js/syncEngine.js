// Moteur de synchronisation entre la timeline et la carte
// Définit comment la carte se met à jour lorsque la timeline change

// Variables globales pour gérer l'état de la carte
let map;
let stationLayerGroup;
let lineLayerGroup;
let currentDisplayedDate = '1900-01-01';
let visibleStations = new Set(); // Pour suivre les stations déjà affichées

/**
 * Initialise le moteur de synchronisation
 * @param {Object} mapInstance - Instance Leaflet de la carte
 */
function initSyncEngine(mapInstance) {
    map = mapInstance;
    
    // Groupes de calques pour gérer stations et lignes
    stationLayerGroup = L.layerGroup().addTo(map);
    lineLayerGroup = L.layerGroup().addTo(map);
    
    console.log('Moteur de synchronisation initialisé');
}

/**
 * Met à jour la carte en fonction d'une date cible
 * @param {string} targetDateString - Date cible au format YYYY-MM-DD
 */
function updateMapToDate(targetDateString) {
    if (!map || !stationLayerGroup) {
        console.error('Moteur non initialisé. Appelez initSyncEngine() d\'abord.');
        return;
    }
    
    // Mettre à jour la date affichée
    currentDisplayedDate = targetDateString;
    document.getElementById('date-text').textContent = targetDateString.substring(0, 4);
    
    // Filtrer les stations ouvertes à cette date
    const targetDate = new Date(targetDateString);
    const stationsToShow = allStations.filter(station => {
        const stationOpenDate = new Date(station.openingDate);
        return stationOpenDate <= targetDate;
    });
    
    // Mettre à jour la carte
    updateStationMarkers(stationsToShow);
    updateMetroLines(stationsToShow);
    updateLegend();
    
    console.log(`Carte mise à jour pour ${targetDateString}: ${stationsToShow.length} stations visibles`);
}

/**
 * Affiche les marqueurs des stations sur la carte
 * @param {Array} stations - Tableau de stations à afficher
 */
function updateStationMarkers(stations) {
    // Effacer les marqueurs existants
    stationLayerGroup.clearLayers();
    visibleStations.clear();
    
    // Ajouter un marqueur pour chaque station
    stations.forEach(station => {
        // Vérifier si nous avons déjà cette station (pour les correspondances)
        const stationKey = `${station.coordinates[0]}-${station.coordinates[1]}`;
        if (visibleStations.has(stationKey)) return;
        
        visibleStations.add(stationKey);
        
        // Contenu de la popup
        const popupContent = `
            <div class="station-popup">
                <h4>${station.name}</h4>
                <p><strong>Ligne:</strong> ${station.line}</p>
                <p><strong>Ouvert le:</strong> ${formatDate(station.openingDate)}</p>
                ${station.previousNames && station.previousNames.length > 0 ? 
                    `<p><strong>Anciens noms:</strong> ${station.previousNames.join(', ')}</p>` : ''}
                ${station.faits ? `<p><strong>Faits:</strong> ${station.faits}</p>` : ''}
                ${station.architecte && station.architecte !== 'Non spécifié' ? 
                    `<p><strong>Architecte:</strong> ${station.architecte}</p>` : ''}
            </div>
        `;
        
        // Créer le marqueur
        const marker = L.circleMarker(station.coordinates, {
            radius: 8,
            fillColor: getLineColor(station.line),
            color: '#333',
            weight: 1.5,
            fillOpacity: 0.8,
            className: `metro-marker line-${station.line}`
        });
        
        // Ajouter la popup et au groupe
        marker.bindPopup(popupContent);
        marker.addTo(stationLayerGroup);
    });
}

/**
 * Dessine les lignes de métro entre les stations
 * @param {Array} stations - Stations visibles
 */
function updateMetroLines(stations) {
    // Effacer les lignes existantes
    lineLayerGroup.clearLayers();
    
    // Grouper les stations par ligne
    const stationsByLine = {};
    stations.forEach(station => {
        if (!stationsByLine[station.line]) {
            stationsByLine[station.line] = [];
        }
        stationsByLine[station.line].push(station);
    });
    
    // Trier les stations par date d'ouverture pour chaque ligne
    Object.keys(stationsByLine).forEach(line => {
        const lineStations = stationsByLine[line]
            .sort((a, b) => new Date(a.openingDate) - new Date(b.openingDate));
        
        // Créer les lignes entre stations consécutives
        for (let i = 0; i < lineStations.length - 1; i++) {
            const start = lineStations[i];
            const end = lineStations[i + 1];
            
            // Vérifier que les deux stations sont sur la même ligne
            if (start.line === end.line) {
                const polyline = L.polyline([start.coordinates, end.coordinates], {
                    color: getLineColor(line),
                    weight: 4,
                    opacity: 0.7,
                    lineCap: 'round',
                    className: `metro-line line-${line}`
                });
                
                polyline.addTo(lineLayerGroup);
            }
        }
    });
}

/**
 * Met à jour la légende de la carte
 */
function updateLegend() {
    const legendContent = document.getElementById('legend-content');
    if (!legendContent) return;
    
    // Trouver quelles lignes sont visibles
    const visibleLines = new Set();
    stationLayerGroup.eachLayer(layer => {
        if (layer.options.className) {
            const match = layer.options.className.match(/line-(\d+)/);
            if (match) visibleLines.add(match[1]);
        }
    });
    
    // Générer le HTML de la légende
    let html = '';
    Array.from(visibleLines).sort().forEach(lineNumber => {
        const lineInfo = metroLines[lineNumber];
        if (lineInfo) {
            html += `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${lineInfo.color}"></div>
                    <span>${lineInfo.name} (${lineInfo.opened})</span>
                </div>
            `;
        }
    });
    
    legendContent.innerHTML = html || '<p>Aucune ligne visible pour cette période</p>';
}

/**
 * Retourne la couleur associée à une ligne de métro
 * @param {string} lineNumber - Numéro de la ligne
 * @returns {string} Code couleur hexadécimal
 */
function getLineColor(lineNumber) {
    return metroLines[lineNumber]?.color || '#999999';
}

/**
 * Formate une date au format français
 * @param {string} dateString - Date au format YYYY-MM-DD
 * @returns {string} Date formatée
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Réinitialise la vue de la carte à la date initiale
 */
function resetView() {
    updateMapToDate('1900-01-01');
    map.setView([48.8566, 2.3522], 13);
}

// Exposer les fonctions au scope global
window.updateMapToDate = updateMapToDate;
window.resetView = resetView;
window.initSyncEngine = initSyncEngine;
