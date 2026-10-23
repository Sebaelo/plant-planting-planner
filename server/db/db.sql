CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_name TEXT NOT NULL,
    amount_to_plant INTEGER NOT NULL CHECK (amount_to_plant > 0),
    month_to_plant INTEGER NOT NULL CHECK (month_to_plant BETWEEN 1 AND 12),
    planting_advice TEXT NOT NULL
);

INSERT INTO plants(
    plant_name, amount_to_plant, month_to_plant, planting_advice
) VALUES ( 'Basilika', 5, 1, 'Testing, testing, 123!'),
 ('Salvia', 7, 1, 'This is another test, for salvia'),
 ('Dahlia', 10, 2, 'Would you believe it if this was another test?');
