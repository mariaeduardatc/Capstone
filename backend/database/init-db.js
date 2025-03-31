const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
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
  console.log("Database seeded successfully.");
  await client.end();
}

seedDatabase().catch(console.error);
