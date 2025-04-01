const { Pool } = require('pg');
const CONFIG = require('../app/config/config');

const dbClient = new Pool({
  connectionString: CONFIG.DB.URI_ITINERARY,
  idleTimeoutMillis: 30000,
  max: 20
});

// Add SSL configuration for dev environment if needed
if (CONFIG.CURRENT_ENV === 'DEV') {
  dbClient.options.ssl = { rejectUnauthorized: false };
}

dbClient.connect((err) => {
  if (err) {
    console.error("Connection error to users database.", err.stack);
  } else {
    console.log("Successfully connected to users PostgreSQL database!");
  }
});

async function seedDatabase() {
  await client.connect();
  await client.query(`
    INSERT INTO famousCities (name) VALUES
    ('paris'),
    ('london'),
    ('new york'),
    ('tokyo'),
    ('rome'),
    ('barcelona'),
    ('dubai'),
    ('singapore'),
    ('bangkok'),
    ('istanbul')
    ON CONFLICT (name) DO NOTHING;
  `);
  const insertCityPlacesQuery = `
      INSERT INTO cityPlaces (city_id, name) VALUES
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Eiffel Tower'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Pont Alexandre III'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Musée Rodin'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Place de la Concorde'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Champs-Élysées'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Arc de Triomphe'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Louvre Museum'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Tuileries Garden'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Notre Dame Cathedral'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Île de la Cité'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Sainte-Chapelle'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Seine River Cruise'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Pantheon'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Luxembourg Gardens'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Montmartre'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Centre Pompidou'),
      ((SELECT id FROM famousCities WHERE name = 'paris'), 'Parc des Buttes-Chaumont'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Big Ben'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Westminster Abbey'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Trafalgar Square'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Buckingham Palace'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'London Eye'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Tower of London'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'St. Paul’s Cathedral'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Shakespeare’s Globe Theatre'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Borough Market'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'The Shard'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'British Museum'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Covent Garden'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Camden Market'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Hyde Park'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Hyde Park Corner'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Kensington Gardens'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Victoria and Albert Museum'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Natural History Museum'),
      ((SELECT id FROM famousCities WHERE name = 'london'), 'Regent’s Park'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Statue of Liberty'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'One World Observatory'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Wall Street'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Brooklyn Bridge'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Times Square'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Broadway'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), '5th Avenue'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Empire State Building'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Rockefeller Center'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Museum of Modern Art'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Grand Central Terminal'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Central Park'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Metropolitan Museum of Art'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'The Vessel'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'High Line Park'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Madison Square Garden'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'New York Public Library'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'The Bronx Zoo'),
      ((SELECT id FROM famousCities WHERE name = 'new york'), 'Coney Island'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Shibuya Crossing'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Meiji Shrine'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Tokyo Tower'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Akihabara'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Tsukiji Outer Market'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Ginza Shopping District'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Asakusa and Senso-ji Temple'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Ueno Park and Zoo'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Shinjuku Gyoen'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Odaiba'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Tokyo Disneyland'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Roppongi Hills'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Tokyo Skytree'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Harajuku'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Ikebukuro'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Tokyo National Museum'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Shinjuku Golden Gai'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Yanaka District'),
      ((SELECT id FROM famousCities WHERE name = 'tokyo'), 'Odaiba Statue of Liberty'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Colosseum'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Vatican Museums'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'St. Peter’s Basilica'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Pantheon'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Trevi Fountain'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Piazza Navona'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Roman Forum'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Borghese Gallery'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Castel Sant’Angelo'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Appian Way'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Piazza di Spagna'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Piazza del Popolo'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Palazzo Farnese'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Galleria Doria Pamphili'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Villa Borghese'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Santa Maria Maggiore'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Campo de’ Fiori'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Trastevere'),
      ((SELECT id FROM famousCities WHERE name = 'rome'), 'Capitoline Hill'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Sagrada Familia'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Park Güell'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'La Rambla'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Casa Batlló'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Casa Milà (La Pedrera)'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Barcelona Cathedral'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Gothic Quarter'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Montjuïc Hill'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Palau de la Música Catalana'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Magic Fountain of Montjuïc'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Camp Nou'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Park de la Ciutadella'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Poble Espanyol'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Museu Picasso'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Tibidabo Mountain'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Arc de Triomf'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Mercat de Sant Josep de la Boqueria'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Plaça de Catalunya'),
      ((SELECT id FROM famousCities WHERE name = 'barcelona'), 'Hospital de Sant Pau'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Burj Khalifa'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'The Dubai Mall'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Palm Jumeirah'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Dubai Marina'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Dubai Creek'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Burj Al Arab'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Dubai Aquarium and Underwater Zoo'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Jumeirah Beach'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Dubai Miracle Garden'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Dubai Opera'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Al Fahidi Historical Neighborhood'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Dubai Desert Safari'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Global Village'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Dubai Frame'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'The Dubai Fountain'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Ski Dubai'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Atlantis The Palm'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Mall of the Emirates'),
      ((SELECT id FROM famousCities WHERE name = 'dubai'), 'Riyadh Street Market');
    `;
  await client.query(insertCityPlacesQuery);
  console.log("cityPlaces data inserted successfully.");
  console.log("Database seeded successfully.");
  await client.end();
}

seedDatabase().catch(console.error);

module.exports = { dbClient };
