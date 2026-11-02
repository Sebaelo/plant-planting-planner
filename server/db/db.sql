CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_name TEXT NOT NULL,
    amount_to_plant INTEGER NOT NULL CHECK (amount_to_plant > 0),
    month_to_plant INTEGER NOT NULL CHECK (month_to_plant BETWEEN 1 AND 12),
    planting_advice TEXT NOT NULL,
    category_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

INSERT INTO categories (
    category
) VALUES ( 'Ört' ), ('Grönsak'), ('Blomma');

INSERT INTO plants(
    plant_name, amount_to_plant, month_to_plant, planting_advice, category_id
) VALUES ( 'Basilika', 5, 1, 'Testing, testing, 123!', 1),
        ('Dahlia', 20, 2, 'Would you believe it if this was another test?', 3),
        ('Tomat', 3, 1, 'This is another test, for salvia', 2);
