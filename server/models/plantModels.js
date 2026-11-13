import db from "../db/db.js";

export function getAllPlantsModel() {
  return db
    .prepare(
      `
        SELECT plants.id,
          plants.plant_name,
          plants.amount_to_plant,
          plants.month_to_plant,
          plants.category_id,
          plants.planting_advice,
          categories.category
        FROM plants
        JOIN categories ON plants.category_id = categories.id`,
    )
    .all();
}

export function addPlantModel(
  plantName,
  amountToPlant,
  monthToPlant,
  plantingAdvice,
  category,
) {
  return db
    .prepare(
      `
        INSERT INTO plants (plant_name, amount_to_plant, month_to_plant, planting_advice, category_id)
        VALUES (?, ?, ?, ?, ?)
        RETURNING
            id,
            plant_name,
            amount_to_plant,
            month_to_plant,
            category_id,
            planting_advice,
        (SELECT category FROM categories WHERE categories.id = plants.category_id) AS category`,
    )
    .get(plantName, amountToPlant, monthToPlant, plantingAdvice, category);
}

export function deletePlantModel(plantId) {
  return db.prepare("DELETE FROM plants WHERE id = ?").run(plantId);
}

export function editPlantModel(
  plantName,
  amountToPlant,
  monthToPlant,
  plantingAdvice,
  category,
  plantId,
) {
  return db
    .prepare(
      `
      UPDATE plants
      SET plant_name = ?,
          amount_to_plant = ?,
          month_to_plant = ?,
          planting_advice = ?,
          category_id = ?
      WHERE id = ?
      RETURNING id,
        plant_name,
        amount_to_plant,
        month_to_plant,
        planting_advice,
        category_id,
      (SELECT category FROM categories WHERE categories.id = plants.category_id) AS category`,
    )
    .get(
      plantName,
      amountToPlant,
      monthToPlant,
      plantingAdvice,
      category,
      plantId,
    );
}
