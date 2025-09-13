/**
 * Utility for generating one-liner explanations of PostgreSQL queries and operations
 */

export const queryExplanations = {
  // Category operations
  createCategory: "INSERT INTO Category (name, createdAt, updatedAt) VALUES (...) - Creates a new category with unique name constraint",
  findUniqueCategory: "SELECT * FROM Category WHERE name = ? OR id = ? - Retrieves a specific category by unique identifier",
  findManyCategories: "SELECT * FROM Category ORDER BY createdAt - Fetches all categories in creation order",
  updateCategory: "UPDATE Category SET name = ?, updatedAt = NOW() WHERE id = ? - Updates category name with timestamp",
  deleteCategory: "DELETE FROM Category WHERE id = ? - Removes category (cascades to related products)",

  // Product operations
  createProduct: "INSERT INTO Product (...) VALUES (...) - Creates product with foreign key reference to Category",
  findManyProducts: "SELECT p.*, c.name FROM Product p JOIN Category c ON p.categoryId = c.id ORDER BY p.createdAt DESC - Fetches products with category details",
  findUniqueProduct: "SELECT p.*, c.name FROM Product p JOIN Category c ON p.categoryId = c.id WHERE p.id = ? OR p.name = ? - Retrieves specific product with category info",
  updateProduct: "UPDATE Product SET [...fields], updatedAt = NOW() WHERE id = ? - Updates product fields with timestamp",
  deleteProduct: "DELETE FROM Product WHERE id = ? - Removes specific product by ID",
  findProductsByCategory: "SELECT * FROM Product WHERE categoryId = ? ORDER BY name ASC - Fetches all products in a specific category",
  countProducts: "SELECT COUNT(*) FROM Product [WHERE categoryId = ?] - Counts total products or products in category",

  // Schema design explanations
  schema: {
    categoryModel: "Category table: Primary key (id), unique name constraint, timestamps for audit trail",
    productModel: "Product table: Primary key (id), foreign key to Category, decimal pricing, inventory tracking",
    relationship: "One-to-Many: Category → Products (categoryId foreign key with cascade operations)",
    indexing: "Automatic indexes on: primary keys, unique constraints, foreign keys for optimal query performance",
    constraints: "Data integrity: NOT NULL on required fields, unique names, positive pricing, category existence validation"
  }
};

/**
 * Logs query explanation to console for debugging and documentation
 * @param {string} operation - The operation being performed
 * @param {Object} additionalInfo - Additional context about the query
 */
export const logQueryExplanation = (operation, additionalInfo = {}) => {
  const explanation = queryExplanations[operation];
  if (explanation) {
    console.log(`🔍 Query: ${explanation}`);
    if (Object.keys(additionalInfo).length > 0) {
      console.log(`📋 Context:`, additionalInfo);
    }
  }
};

/**
 * Returns explanation for a given operation
 * @param {string} operation - The operation key
 * @returns {string} - The explanation or default message
 */
export const getQueryExplanation = (operation) => {
  return queryExplanations[operation] || "Database operation - refer to Prisma schema for details";
};