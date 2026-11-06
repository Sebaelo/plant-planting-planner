import db from "../db/db.js";
import {
  getAllPlantsModel,
  addPlantModel,
  deletePlantModel,
} from "../models/plantModels.js";

function validatePlant(
  plantName,
  amountToPlant,
  monthToPlant,
  plantCategory,
  plantingAdvice,
) {
  if (typeof plantName !== "string" || !plantName.trim()) {
    return "Växtnamn måste vara ifyllt.";
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
  if (!Number.isInteger(plantCategory) || plantCategory <= 0) {
    return "Vänligen välj en kategori.";
  }
  if (typeof plantingAdvice !== "string" || !plantingAdvice.trim()) {
    return "Skötselråd måste vara ifyllt.";
  }
  return null;
}

export function getAllPlants(req, res) {
  try {
    const plants = getAllPlantsModel();
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

  const error = validatePlant(
    plantName,
    amount,
    month,
    category,
    plantingAdvice,
  );

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

    const addedPlant = addPlantModel(
      plantName,
      amount,
      month,
      plantingAdvice,
      category,
    );

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
    const deletedPlant = deletePlantModel(plantId);

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

export function searchPlants(req, res) {
  try {
    const query = req.query.q?.toLowerCase().trim() ?? "";
    const plants = getAllPlantsModel();

    const filteredPlants = plants.filter((plant) => {
      return plant.plant_name.toLowerCase().includes(query);
    });

    return res.status(200).json(filteredPlants);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error:
        "Något gick fel, kunde inte genomföra sökningen. Vänligen försök igen...",
    });
  }
}
