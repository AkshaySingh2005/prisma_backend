import { PrismaClient } from "../generated/prisma/index.js";
import { logQueryExplanation } from "../utils/queryExplainer.js";

const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Query: SELECT * FROM Category WHERE name = ? - Check for existing category
    logQueryExplanation("findUniqueCategory", { operation: "check existing", name: req.body.name });
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: req.body.name,
      },
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    // Query: INSERT INTO Category (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())
    logQueryExplanation("createCategory", { name: req.body.name });
    const newCategory = await prisma.category.create({
      data: {
        name: req.body.name,
      },
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    // Query: SELECT * FROM Category ORDER BY createdAt - Fetch all categories
    logQueryExplanation("findManyCategories");
    const categories = await prisma.category.findMany();
    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: "No categories found" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Query: SELECT * FROM Category WHERE id = ? - Verify category exists
    logQueryExplanation("findUniqueCategory", { operation: "verify exists", id: categoryId });
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (!req.body.name) {
      return res
        .status(400)
        .json({ error: "Category name is required to update" });
    }

    // Query: UPDATE Category SET name = ?, updatedAt = NOW() WHERE id = ?
    logQueryExplanation("updateCategory", { id: categoryId, newName: req.body.name });
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: req.body.name,
      },
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Query: SELECT * FROM Category WHERE id = ? - Verify category exists before deletion
    logQueryExplanation("findUniqueCategory", { operation: "verify before delete", id: categoryId });
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found !!" });
    }

    // Query: DELETE FROM Category WHERE id = ? - This will cascade delete related products
    logQueryExplanation("deleteCategory", { id: categoryId, warning: "cascades to products" });
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
