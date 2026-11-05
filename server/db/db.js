import Database from "better-sqlite3";

const db = new Database("plant-planner.db");

db.pragma("foreign_keys = ON");

db.exec(`
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

    INSERT INTO categories (category)
    SELECT 'Ört'
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category = 'Ört');

    INSERT INTO categories (category)
    SELECT 'Grönsak'
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category = 'Grönsak');

    INSERT INTO categories (category)
    SELECT 'Blomma'
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category = 'Blomma');


    INSERT INTO plants ( plant_name, amount_to_plant, month_to_plant, planting_advice, category_id)
    SELECT 'Basilika', 5, 1, 'Testing, testing, 123!', 1
    WHERE NOT EXISTS (SELECT 1 FROM plants WHERE plant_name = 'Basilika');

    INSERT INTO plants ( plant_name, amount_to_plant, month_to_plant, planting_advice, category_id)
    SELECT 'Dahlia', 20, 2, 'Would you believe it if this was another test?', 3
    WHERE NOT EXISTS (SELECT 1 FROM plants WHERE plant_name = 'Dahlia');

    INSERT INTO plants ( plant_name, amount_to_plant, month_to_plant, planting_advice, category_id)
    SELECT 'Tomat', 3, 1, 'This is another test, for salvia', 2
    WHERE NOT EXISTS (SELECT 1 FROM plants WHERE plant_name = 'Tomat');
`);

export default db;
