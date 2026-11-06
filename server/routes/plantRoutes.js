import { Router } from "express";
import {
  addPlant,
  deletePlant,
  getAllPlants,
  searchPlants,
} from "../controllers/plantControllers.js";

const router = Router();

router.get("/", getAllPlants);

router.post("/", addPlant);

router.get("/search", searchPlants);

router.delete("/:id", deletePlant);

export default router;
