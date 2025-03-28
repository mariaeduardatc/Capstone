CREATE TABLE cityPlaces 
(
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL,
    name VARCHAR(500) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES famousCities(id) ON DELETE CASCADE
);