import { Router } from "express";
import {
  addPlant,
  deletePlant,
  editPlant,
  getAllPlants,
  searchPlants,
} from "../controllers/plantControllers.js";

const router = Router();

router.get("/", getAllPlants);

router.post("/", addPlant);

router.get("/search", searchPlants);

router.put("/:id", editPlant);

router.delete("/:id", deletePlant);

export default router;
