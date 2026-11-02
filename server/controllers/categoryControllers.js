import db from "../db/db.js";

export default function getCategories(req, res) {
  try {
    const categories = db.prepare(`SELECT * FROM categories`).all();
    return res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error:
        "Något gick fel, kunde inte hämta kategorierna. Vänligen försök igen...",
    });
  }
}
