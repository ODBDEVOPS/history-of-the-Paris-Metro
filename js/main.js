// Script principal d'initialisation de l'application
// Coordonne l'initialisation de la carte, de la timeline et des événements

document.addEventListener('DOMContentLoaded', function() {
    console.log('Démarrage de l\'application ChronoMétro Paris...');
    
    // Variables globales
    let map;
    let timeline;
    
    // 1. INITIALISATION DE LA CARTE
    function initMap() {
        console.log('Initialisation de la carte Leaflet...');
        
        // Créer la carte centrée sur Paris
        map = L.map('map').setView([48.8566, 2.3522], 13);
        
        // Ajouter la couche de tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
            minZoom: 11
        }).addTo(map);
        
        // Ajouter un contrôle d'échelle
        L.control.scale({ imperial: false }).addTo(map);
        
        console.log('Carte initialisée avec succès');
        return map;
    }
    
    // 2. INITIALISATION DE LA TIMELINE
    function initTimeline() {
        console.log('Initialisation de TimelineJS...');
        
        // Préparer les données pour TimelineJS
        const timelineData = {
            events: []
        };
        
        // Ajouter les événements historiques
        historicalEvents.forEach(event => {
            timelineData.events.push(event);
        });
        
        // Ajouter les ouvertures de lignes comme événements
        Object.keys(metroLines).forEach(lineNumber => {
            const line = metroLines[lineNumber];
            timelineData.events.push({
                start_date: { year: parseInt(line.opened) },
                text: { 
                    headline: `🚇 ${line.name}`, 
                    text: `Ouverture de la ${line.name.toLowerCase()}`
                }
            });
        });
        
        // Configurer TimelineJS
        const options = {
            hash_bookmark: false,
            initial_zoom: 3,
            scale_factor: 1,
            timenav_position: 'bottom',
            start_at_end: false,
            default_bg_color: '#003366',
            use_bc: false,
            language: 'fr'
        };
        
        // Créer la timeline
        timeline = new TL.Timeline('timeline-embed', timelineData, options);
        
        // Configurer les événements de la timeline
        setupTimelineEvents();
        
        console.log('TimelineJS initialisée avec succès');
        return timeline;
    }
    
    // 3. CONFIGURER LES ÉVÉNEMENTS DE LA TIMELINE
    function setupTimelineEvents() {
        if (!timeline) return;
        
        // Écouter les changements de slide
        timeline.on('change', function(event) {
            const currentSlide = timeline.getCurrentSlide();
            if (currentSlide && currentSlide.start_date) {
                // Construire une date au format YYYY-MM-DD
                const date = currentSlide.start_date;
                const dateString = `${date.year}-${String(date.month || 1).padStart(2, '0')}-${String(date.day || 1).padStart(2, '0')}`;
                
                // Mettre à jour la carte
                window.updateMapToDate(dateString);
                
                // Mettre à jour le panneau d'information
                updateInfoPanel(currentSlide);
                
                // Synchroniser le slider
                syncYearSlider(date.year);
            }
        });
        
        // Définir la date initiale
        setTimeout(() => {
            window.updateMapToDate('1900-01-01');
        }, 500);
    }
    
    // 4. METTRE À JOUR LE PANNEAU D'INFORMATION
    function updateInfoPanel(slide) {
        const infoPanel = document.getElementById('slide-info');
        if (!infoPanel || !slide) return;
        
        let html = `<h4>${slide.text.headline}</h4>`;
        if (slide.text.text) {
            html += `<p>${slide.text.text}</p>`;
        }
        
        // Ajouter des informations supplémentaires selon le type d'événement
        if (slide.text.headline.includes('Ligne')) {
            const lineMatch = slide.text.headline.match(/\d+/);
            if (lineMatch) {
                const lineNum = lineMatch[0];
                const lineInfo = metroLines[lineNum];
                if (lineInfo) {
                    html += `<p><strong>Couleur:</strong> <span style="color:${lineInfo.color}">${lineInfo.color}</span></p>`;
                }
            }
        }
        
        infoPanel.innerHTML = html;
    }
    
    // 5. CONFIGURER LES CONTRÔLES INTERACTIFS
    function setupControls() {
        console.log('Configuration des contrôles interactifs...');
        
        // Slider d'année
        const yearSlider = document.getElementById('year-slider');
        const sliderYearDisplay = document.getElementById('slider-year');
        
        if (yearSlider) {
            yearSlider.addEventListener('input', function() {
                const year = this.value;
                sliderYearDisplay.textContent = year;
                
                // Mettre à jour la carte
                window.updateMapToDate(`${year}-01-01`);
                
                // Mettre à jour la timeline (si possible)
                if (timeline) {
                    // Chercher le slide le plus proche de cette année
                    // Note: TimelineJS ne supporte pas directement le saut par année
                }
            });
        }
        
        // Boutons de navigation
        document.getElementById('timeline-prev')?.addEventListener('click', function() {
            if (timeline) {
                timeline.previous();
            } else {
                const currentYear = parseInt(document.getElementById('slider-year').textContent);
                const newYear = Math.max(1900, currentYear - 1);
                window.updateMapToDate(`${newYear}-01-01`);
                syncYearSlider(newYear);
            }
        });
        
        document.getElementById('timeline-next')?.addEventListener('click', function() {
            if (timeline) {
                timeline.next();
            } else {
                const currentYear = parseInt(document.getElementById('slider-year').textContent);
                const newYear = Math.min(2025, currentYear + 1);
                window.updateMapToDate(`${newYear}-01-01`);
                syncYearSlider(newYear);
            }
        });
        
        // Bouton de réinitialisation
        document.getElementById('btn-reset-view')?.addEventListener('click', function() {
            window.resetView();
            if (timeline) {
                timeline.goToId(0);
            }
            syncYearSlider(1900);
        });
        
        // Filtres
        document.getElementById('toggle-stations')?.addEventListener('change', function(e) {
            const isChecked = e.target.checked;
            if (isChecked) {
                map.addLayer(stationLayerGroup);
            } else {
                map.removeLayer(stationLayerGroup);
            }
        });
        
        document.getElementById('toggle-lines')?.addEventListener('change', function(e) {
            const isChecked = e.target.checked;
            if (isChecked) {
                map.addLayer(lineLayerGroup);
            } else {
                map.removeLayer(lineLayerGroup);
            }
        });
        
        console.log('Contrôles configurés avec succès');
    }
    
    // 6. SYNCHRONISER LE SLIDER D'ANNÉE
    function syncYearSlider(year) {
        const yearSlider = document.getElementById('year-slider');
        const sliderYearDisplay = document.getElementById('slider-year');
        
        if (yearSlider && sliderYearDisplay) {
            yearSlider.value = year;
            sliderYearDisplay.textContent = year;
        }
    }
    
    // 7. INITIALISATION DE L'APPLICATION
    function initApp() {
        try {
            // Initialiser la carte
            map = initMap();
            
            // Initialiser le moteur de synchronisation
            window.initSyncEngine(map);
            
            // Initialiser la timeline
            timeline = initTimeline();
            
            // Configurer les contrôles
            setupControls();
            
            // Mettre à jour la légende initiale
            updateLegend();
            
            // Afficher un message de bienvenue
            setTimeout(() => {
                console.log('✅ Application ChronoMétro Paris prête !');
                document.getElementById('slide-info').innerHTML = `
                    <h4>Bienvenue sur ChronoMétro Paris !</h4>
                    <p>Explorez l'histoire du métro parisien en utilisant la chronologie ci-dessous ou le curseur d'année.</p>
                    <p>Cliquez sur une station pour plus d'informations.</p>
                    <p><em>${allStations.length} stations chargées</em></p>
                `;
            }, 1000);
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            document.getElementById('map').innerHTML = `
                <div class="error">
                    <h3>Erreur d'initialisation</h3>
                    <p>${error.message}</p>
                    <p>Vérifiez votre connexion Internet et rechargez la page.</p>
                </div>
            `;
        }
    }
    
    // Démarrer l'application
    initApp();
    
    // Exposer les objets principaux pour le débogage
    window.app = { map, timeline, allStations, metroLines };
});
