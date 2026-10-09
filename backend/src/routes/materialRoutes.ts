import express from "express";
import {
  getMaterials,
  addMaterial,
  editMaterial,
  removeMaterial,
  uploadMaterial,
} from "../controllers/courseMaterialController";

const router = express.Router();

router.get("/", getMaterials);
router.post("/", uploadMaterial.single("file"), addMaterial);
router.put("/:id", uploadMaterial.single("file"), editMaterial);
router.delete("/:id", removeMaterial);

export default router;
