import { Router } from "express";
import {
  addPlant,
  deletePlant,
  getAllPlants,
} from "../controllers/plantControllers.js";

const router = Router();

router.get("/", getAllPlants);

router.post("/", addPlant);

router.delete("/:id", deletePlant);

export default router;
