import db from "../db/db.js";

function validatePlant({
  plantName,
  amountToPlant,
  monthToPlant,
  plantCategory,
  plantingAdvice,
}) {
  if (typeof plantName !== "string" || plantName.trim() === "") {
    return "Växtnamn måste vara ifyllt.";
  }
  if (typeof plantingAdvice !== "string" || plantingAdvice.trim() === "") {
    return "Skötselråd måste vara ifyllt.";
  }
  if (!Number.isInteger(amountToPlant) || amountToPlant <= 0) {
    return "Mängd måste vara ett positivt heltal.";
  }
  if (!Number.isInteger(plantCategory) || plantCategory <= 0) {
    return "Vänligen välj en kategori.";
  }
  if (
    !Number.isInteger(monthToPlant) ||
    monthToPlant < 1 ||
    monthToPlant > 12
  ) {
    return "Vänligen välj en månad.";
  }
  return null;
}

export function getAllPlants(req, res) {
  try {
    const plants = db
      .prepare(
        `SELECT plants.id,
              plants.plant_name,
              plants.amount_to_plant,
              plants.month_to_plant,
              plants.planting_advice,
              categories.category
          FROM plants
          JOIN categories ON plants.category_id = categories.id`,
      )
      .all();
    return res.status(200).json(plants);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error:
        "Något gick fel, kunde inte hämta växterna. Vänligen försök igen...",
    });
  }
}

export function addPlant(req, res) {
  const {
    plantName,
    amountToPlant,
    monthToPlant,
    plantCategory,
    plantingAdvice,
  } = req.body ?? {};

  const amount = Number(amountToPlant);
  const month = Number(monthToPlant);
  const category = Number(plantCategory);

  const error = validatePlant({
    plantName,
    amountToPlant: amount,
    monthToPlant: month,
    plantCategory: category,
    plantingAdvice,
  });

  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const existingCategory = db
      .prepare("SELECT id FROM categories WHERE id = ?")
      .get(category);

    if (!existingCategory) {
      return res.status(400).json({
        error: "Den valda kategorin finns inte.",
      });
    }

    const addedPlant = db
      .prepare(
        `
        INSERT INTO plants ( plant_name, amount_to_plant, month_to_plant, planting_advice, category_id )
        VALUES (?, ?, ?, ?, ?)
        RETURNING
          id,
          plant_name,
          amount_to_plant,
          month_to_plant,
          planting_advice,
          (SELECT category FROM categories WHERE categories.id = plants.category_id) AS category
        `,
      )
      .get(plantName, amount, month, plantingAdvice, category);

    return res.status(201).json({
      message: "Planteringsplaneringen lades till!",
      addedPlant,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error:
        "Något gick fel, kunde inte lägga till inlägget. Vänligen försök igen...",
    });
  }
}

export function deletePlant(req, res) {
  const plantId = Number(req.params.id);

  if (!Number.isInteger(plantId) || plantId <= 0) {
    return res.status(400).json({ error: "Ogiltigt ID." });
  }

  try {
    const deletedPlant = db
      .prepare("DELETE FROM plants WHERE id = ?")
      .run(plantId);

    if (deletedPlant.changes === 0) {
      return res.status(404).json({
        error: "Inget inlägg hittades.",
      });
    }

    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error:
        "Något gick fel, kunde inte ta bort inlägget. Vänligen försök igen...",
    });
  }
}
