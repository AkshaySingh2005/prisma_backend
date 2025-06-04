import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Product name is required" });
    }

    if (!req.body.price) {
      return res.status(400).json({ error: "Product price is required" });
    } else if (isNaN(req.body.price)) {
      return res.status(400).json({ error: "Product price must be a number" });
    }

    if (!req.body.categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    } else {
      const categoryExists = await prisma.category.findUnique({
        where: {
          id: parseInt(req.body.categoryId),
        },
      });

      if (!categoryExists) {
        return res.status(400).json({ error: "Category does not exist" });
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        currency: req.body.currency || "USD",
        quantity: req.body.quantity ? parseInt(req.body.quantity) : 0,
        available: req.body.available !== undefined ? req.body.available : true,
        categoryId: parseInt(req.body.categoryId),
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      //include fields from the related category
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      //exclude fields from the product model
      omit: {
        categoryId: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const productsCount = await prisma.product.count();

    return res.status(200).json({
      message: "Products fetched successfully",
      count: productsCount,
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductByIdOrName = async (req, res) => {
  try {
    let product;

    if (req.query.id) {
      product = await prisma.product.findUnique({
        where: {
          id: parseInt(req.query.id),
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
    } else if (req.query.name) {
      product = await prisma.product.findUnique({
        where: {
          name: req.query.name,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      return res.status(400).json({ error: "Product ID or name is required" });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (!productId || isNaN(productId)) {
      return res.status(400).json({ error: "Valid product ID is required" });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;
    if (req.body.price !== undefined)
      updateData.price = parseFloat(req.body.price);
    if (req.body.currency !== undefined)
      updateData.currency = req.body.currency;
    if (req.body.quantity !== undefined)
      updateData.quantity = parseInt(req.body.quantity);
    if (req.body.available !== undefined)
      updateData.available = req.body.available;

    if (req.body.categoryId !== undefined) {
      const categoryId = parseInt(req.body.categoryId);
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res.status(400).json({ error: "Category does not exist" });
      }

      updateData.categoryId = categoryId;
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: updateData,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (!productId || isNaN(productId)) {
      return res.status(400).json({ error: "Valid product ID is required" });
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ error: "Valid category ID is required" });
    }
    if (
      !(await prisma.category.findUnique({
        where: { id: categoryId },
      }))
    ) {
      return res.status(404).json({ error: "Category not found" });
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    const productsCount = await prisma.product.count({
      where: {
        categoryId: categoryId,
      },
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      count: productsCount,
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
