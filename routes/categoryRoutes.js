import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.post("/Insertcategories", createCategory);
router.get("/GetAllCategories", getAllCategories);
router.put("/UpdateCategory/:id", updateCategory);
router.delete("/DeleteCategory/:id", deleteCategory);

export default router;
