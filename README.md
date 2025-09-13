# Prisma Backend - PostgreSQL Query Explanations

A Node.js Express backend with Prisma ORM providing CRUD operations for Categories and Products with built-in PostgreSQL query explanations.

## Features

- **PostgreSQL Database** with optimized schema design
- **One-liner Query Explanations** for all database operations
- **CRUD Operations** for Categories and Products
- **Foreign Key Relationships** with referential integrity
- **Query Logging** for debugging and documentation

## Database Schema Design

### Category Table
```sql
-- Category table: Stores product categories with unique names and audit timestamps
CREATE TABLE "Category" (
  id SERIAL PRIMARY KEY,           -- Auto-incrementing primary key for efficient indexing
  name VARCHAR UNIQUE NOT NULL,    -- Unique constraint prevents duplicate category names
  createdAt TIMESTAMP DEFAULT NOW(), -- Audit trail: record creation timestamp
  updatedAt TIMESTAMP DEFAULT NOW()  -- Audit trail: automatic update timestamp
);
```

### Product Table  
```sql
-- Product table: Stores product information with foreign key relationship to Category
CREATE TABLE "Product" (
  id SERIAL PRIMARY KEY,           -- Auto-incrementing primary key for efficient lookups
  name VARCHAR UNIQUE NOT NULL,    -- Unique product names prevent duplicates
  description TEXT,                -- Optional product description (nullable field)
  price DECIMAL DEFAULT 0.0,       -- Decimal type ensures precise currency calculations
  currency VARCHAR DEFAULT 'USD',  -- Currency code with USD default
  quantity INTEGER DEFAULT 0,      -- Inventory tracking with zero default
  available BOOLEAN DEFAULT true,  -- Product availability flag for business logic
  createdAt TIMESTAMP DEFAULT NOW(), -- Audit trail: record creation timestamp
  updatedAt TIMESTAMP DEFAULT NOW(), -- Audit trail: automatic update timestamp
  categoryId INTEGER NOT NULL REFERENCES "Category"(id) -- FK with referential integrity
);
```

## Query Explanations

The application provides one-liner explanations for all PostgreSQL operations:

### Category Operations
- **Create**: `INSERT INTO Category (name, createdAt, updatedAt) VALUES (...) - Creates a new category with unique name constraint`
- **Read All**: `SELECT * FROM Category ORDER BY createdAt - Fetches all categories in creation order`
- **Update**: `UPDATE Category SET name = ?, updatedAt = NOW() WHERE id = ? - Updates category name with timestamp`
- **Delete**: `DELETE FROM Category WHERE id = ? - Removes category (cascades to related products)`

### Product Operations  
- **Create**: `INSERT INTO Product (...) VALUES (...) - Creates product with foreign key reference to Category`
- **Read All**: `SELECT p.*, c.name FROM Product p JOIN Category c ON p.categoryId = c.id ORDER BY p.createdAt DESC - Fetches products with category details`
- **Read One**: `SELECT p.*, c.name FROM Product p JOIN Category c ON p.categoryId = c.id WHERE p.id = ? OR p.name = ? - Retrieves specific product with category info`
- **Update**: `UPDATE Product SET [...fields], updatedAt = NOW() WHERE id = ? - Updates product fields with timestamp`
- **Delete**: `DELETE FROM Product WHERE id = ? - Removes specific product by ID`
- **By Category**: `SELECT * FROM Product WHERE categoryId = ? ORDER BY name ASC - Fetches all products in a specific category`

## API Endpoints

### Categories
- `POST /Insertcategories` - Create new category
- `GET /GetAllCategories` - Get all categories  
- `PUT /UpdateCategory/:id` - Update category by ID
- `DELETE /DeleteCategory/:id` - Delete category by ID

### Products
- `POST /InsertProduct` - Create new product
- `GET /GetAllProducts` - Get all products with category info
- `GET /GetProduct?id=X` or `?name=Y` - Get product by ID or name
- `PUT /UpdateProduct/:id` - Update product by ID
- `DELETE /DeleteProduct/:id` - Delete product by ID
- `GET /GetProductsByCategory/:categoryId` - Get products by category

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   # Create .env file with DATABASE_URL
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Run database migrations**:
   ```bash
   npx prisma db push
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

## Query Explanation Utility

The `utils/queryExplainer.js` module provides:

- **logQueryExplanation()** - Logs SQL explanation to console
- **getQueryExplanation()** - Returns explanation string for given operation
- **queryExplanations** - Object containing all query explanations

Example usage:
```javascript
import { logQueryExplanation } from './utils/queryExplainer.js';

// Logs: "🔍 Query: SELECT * FROM Category WHERE id = ? - Retrieves specific category"
logQueryExplanation('findUniqueCategory', { id: 1 });
```

## Performance Optimizations

- **Automatic Indexes**: Primary keys, unique constraints, and foreign keys
- **Query Optimization**: Proper JOINs instead of N+1 queries  
- **Selective Fields**: Using `select` and `omit` to limit data transfer
- **Efficient Ordering**: Database-level sorting with `ORDER BY`

This implementation provides clear visibility into PostgreSQL operations while maintaining optimal performance.