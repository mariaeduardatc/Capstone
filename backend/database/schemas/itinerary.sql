CREATE TABLE itinerary 
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    saved_itinerary JSON NOT NULL,
    number_of_days INTEGER,
    city_name VARCHAR(255)
);