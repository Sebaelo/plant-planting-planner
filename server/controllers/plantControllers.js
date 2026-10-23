import db from "../db/db.js";

function validatePlant({
  plantName,
  amountToPlant,
  monthToPlant,
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
    const plants = db.prepare("SELECT * FROM plants").all();
    return res.status(200).json(plants);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error:
        "Något gick fel, kunde inte hämta informationen. Vänligen försök igen...",
    });
  }
}

export function addPlant(req, res) {
  const error = validatePlant(req.body ?? {});
  if (error) {
    return res.status(400).json({ error });
  }

  const { plantName, amountToPlant, monthToPlant, plantingAdvice } = req.body;

  try {
    const addedPlant = db
      .prepare(
        `
    INSERT INTO plants ( plant_name, amount_to_plant, month_to_plant, planting_advice )
    VALUES (?, ?, ?, ?)
    RETURNING * `,
      )
      .get(plantName, amountToPlant, monthToPlant, plantingAdvice);

    return res.status(201).json({
      message: "Planteringsplaneringen lades till.",
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

  if (!Number.isInteger(plantId)) {
    return res.status(404).json({ error: "Ogiltigt ID" });
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
