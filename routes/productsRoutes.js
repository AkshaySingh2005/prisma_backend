import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductByIdOrName,
  updateProduct,
  deleteProduct,
  getProductByCategory,
} from "../controllers/productCategory.js";

const router = Router();

router.post("/InsertProduct", createProduct);
router.get("/GetAllProducts", getAllProducts);
router.get("/GetProduct", getProductByIdOrName);
router.put("/UpdateProduct/:id", updateProduct);
router.delete("/DeleteProduct/:id", deleteProduct);
router.get("/GetProductsByCategory/:categoryId", getProductByCategory);

export default router;
