// Données historiques des stations du métro parisien
// Ceci est un jeu de données réduit pour commencer - vous devrez le compléter

const allStations = [
    {
        "name": "Porte Maillot",
        "openingDate": "1900-07-19",
        "coordinates": [48.8776, 2.2849],
        "line": "1",
        "previousNames": [],
        "architecte": "Non spécifié",
        "faits": "Ouverture pour l'Exposition Universelle de 1900"
    },
    {
        "name": "Charles de Gaulle - Étoile",
        "openingDate": "1900-12-01",
        "coordinates": [48.8738, 2.2950],
        "line": "1",
        "previousNames": ["Étoile"],
        "architecte": "H. Guimard",
        "faits": "Correspondance avec la ligne 2 ouverte en 1900"
    },
    {
        "name": "Franklin D. Roosevelt",
        "openingDate": "1900-07-19",
        "coordinates": [48.8686, 2.3075],
        "line": "1",
        "previousNames": ["Marbeuf", "Rond-point des Champs-Élysées"],
        "architecte": "J. Formigé",
        "faits": "A changé de nom en 1942"
    },
    {
        "name": "Champs-Élysées - Clemenceau",
        "openingDate": "1900-07-19",
        "coordinates": [48.8667, 2.3139],
        "line": "1",
        "previousNames": ["Champs-Élysées"],
        "architecte": "H. Guimard",
        "faits": "Station d'origine de la ligne 1"
    },
    {
        "name": "Concorde",
        "openingDate": "1900-07-19",
        "coordinates": [48.8656, 2.3214],
        "line": "1",
        "previousNames": [],
        "architecte": "H. Guimard",
        "faits": "Correspondance avec les lignes 8 et 12"
    },
    {
        "name": "Porte de Vincennes",
        "openingDate": "1900-07-19",
        "coordinates": [48.8483, 2.4147],
        "line": "1",
        "previousNames": [],
        "architecte": "Non spécifié",
        "faits": "Terminus est de la ligne 1 jusqu'en 1993"
    },
    {
        "name": "Trocadéro",
        "openingDate": "1900-10-02",
        "coordinates": [48.8630, 2.2875],
        "line": "6",
        "previousNames": [],
        "architecte": "H. Guimard",
        "faits": "Vue sur la Tour Eiffel"
    },
    {
        "name": "Bir-Hakeim",
        "openingDate": "1906-04-24",
        "coordinates": [48.8537, 2.2898],
        "line": "6",
        "previousNames": ["Grenelle"],
        "architecte": "Non spécifié",
        "faits": "Renommé en 1949 pour la bataille de Bir Hakeim"
    },
    {
        "name": "Montparnasse - Bienvenüe",
        "openingDate": "1910-04-24",
        "coordinates": [48.8431, 2.3222],
        "line": "4",
        "previousNames": ["Montparnasse"],
        "architecte": "Non spécifié",
        "faits": "Plus grande station de correspondance de Paris"
    },
    {
        "name": "Châtelet",
        "openingDate": "1900-08-06",
        "coordinates": [48.8584, 2.3474],
        "line": "1",
        "previousNames": [],
        "architecte": "H. Guimard",
        "faits": "Plus grande station souterraine au monde"
    },
    {
        "name": "Louvre - Rivoli",
        "openingDate": "1900-07-19",
        "coordinates": [48.8612, 2.3406],
        "line": "1",
        "previousNames": ["Louvre"],
        "architecte": "H. Guimard",
        "faits": "Décoration sur le thème du Louvre"
    },
    {
        "name": "Bastille",
        "openingDate": "1900-07-19",
        "coordinates": [48.8531, 2.3692],
        "line": "1",
        "previousNames": [],
        "architecte": "H. Guimard",
        "faits": "Fresques sur la Révolution française"
    },
    {
        "name": "Gare de Lyon",
        "openingDate": "1900-07-19",
        "coordinates": [48.8447, 2.3742],
        "line": "1",
        "previousNames": [],
        "architecte": "H. Guimard",
        "faits": "Correspondance avec la ligne 14 automatique"
    },
    {
        "name": "Opéra",
        "openingDate": "1910-11-05",
        "coordinates": [48.8708, 2.3322],
        "line": "3",
        "previousNames": [],
        "architecte": "H. Guimard",
        "faits": "Proche de l'Opéra Garnier"
    },
    {
        "name": "Saint-Lazare",
        "openingDate": "1910-11-05",
        "coordinates": [48.8767, 2.3253],
        "line": "13",
        "previousNames": [],
        "architecte": "Non spécifié",
        "faits": "Deuxième gare la plus fréquentée d'Europe"
    }
];

// Données des lignes pour la légende
const metroLines = {
    "1": { name: "Ligne 1", color: "#FFCD00", opened: "1900" },
    "2": { name: "Ligne 2", color: "#003CA6", opened: "1900" },
    "3": { name: "Ligne 3", color: "#837902", opened: "1904" },
    "4": { name: "Ligne 4", color: "#CF009E", opened: "1908" },
    "5": { name: "Ligne 5", color: "#FF7E2E", opened: "1906" },
    "6": { name: "Ligne 6", color: "#73C7D6", opened: "1909" },
    "7": { name: "Ligne 7", color: "#F3A4BA", opened: "1910" },
    "8": { name: "Ligne 8", color: "#C7A8CF", opened: "1913" },
    "9": { name: "Ligne 9", color: "#B6BD00", opened: "1922" },
    "10": { name: "Ligne 10", color: "#E3B32A", opened: "1923" },
    "11": { name: "Ligne 11", color: "#704B1C", opened: "1935" },
    "12": { name: "Ligne 12", color: "#007852", opened: "1910" },
    "13": { name: "Ligne 13", color: "#6E4C1E", opened: "1911" },
    "14": { name: "Ligne 14", color: "#62259D", opened: "1998" }
};

// Événements historiques majeurs pour TimelineJS
const historicalEvents = [
    {
        start_date: { year: 1900, month: 7, day: 19 },
        text: { headline: "🎉 Inauguration du Métro de Paris", text: "La ligne 1 entre Porte Maillot et Porte de Vincennes ouvre pour l'Exposition Universelle." }
    },
    {
        start_date: { year: 1910, month: 4 },
        text: { headline: "🌊 Inondations de la Seine", text: "Plusieurs stations sont inondées, causant d'importants dégâts." }
    },
    {
        start_date: { year: 1935, month: 4, day: 28 },
        text: { headline: "🆕 Ligne 11", text: "Ouverture de la ligne 11, première ligne à pentes importantes." }
    },
    {
        start_date: { year: 1942, month: 6 },
        text: { headline: "🔄 Changements de noms", text: "Plusieurs stations sont renommées pendant l'Occupation." }
    },
    {
        start_date: { year: 1998, month: 10, day: 15 },
        text: { headline: "🤖 Ligne 14 Automatique", text: "Ouverture de la première ligne complètement automatique." }
    },
    {
        start_date: { year: 2024, month: 6 },
        text: { headline: "🚀 Extension Ligne 14", text: "Prolongation vers l'aéroport d'Orly." }
    }
];
