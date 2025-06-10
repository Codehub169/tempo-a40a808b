const { db } = require('../config/db');

// Helper promisify functions for sqlite3 db methods
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { // Must use function for 'this' context
      if (err) {
        console.error('Error running SQL query (run):', sql, params, err.message);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Error running SQL query (get):', sql, params, err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error running SQL query (all):', sql, params, err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

class Product {
  static async create({ name, description, price, originalPrice, category, brand, condition, stockQuantity, images, sellerId, specifications, tags, approved = 0 }) {
    const imagesJson = JSON.stringify(images || []);
    const specificationsJson = JSON.stringify(specifications || {});
    const tagsJson = JSON.stringify(tags || []);

    const sql = `INSERT INTO Products (name, description, price, originalPrice, category, brand, condition, stockQuantity, images, sellerId, specifications, tags, approved)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, description, price, originalPrice, category, brand, condition, stockQuantity, imagesJson, sellerId, specificationsJson, tagsJson, approved ? 1 : 0]; // Ensure approved is 0 or 1
    
    try {
      const result = await dbRun(sql, params);
      return this.findById(result.lastID);
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw error;
    }
  }

  static async findById(id) {
    const sql = `SELECT * FROM Products WHERE id = ?`;
    try {
      const row = await dbGet(sql, [id]);
      if (row) {
        row.images = JSON.parse(row.images || '[]');
        row.specifications = JSON.parse(row.specifications || '{}');
        row.tags = JSON.parse(row.tags || '[]');
        row.approved = Boolean(row.approved); // Convert 0/1 to false/true
      }
      return row;
    } catch (error) {
      console.error(`Error finding product by ID ${id}:`, error.message);
      throw error;
    }
  }

  static async findAll({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', filters = {} } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    let baseSql = `SELECT * FROM Products`;
    let countSql = `SELECT COUNT(*) as total FROM Products`;
    const whereClauses = [];
    const queryParams = []; // For the main query with limit/offset
    const countParams = []; // For the count query

    if (filters.approved !== undefined) {
      whereClauses.push(`approved = ?`);
      const approvedValue = filters.approved ? 1 : 0;
      queryParams.push(approvedValue);
      countParams.push(approvedValue);
    }
    if (filters.sellerId) {
      whereClauses.push(`sellerId = ?`);
      queryParams.push(filters.sellerId);
      countParams.push(filters.sellerId);
    }
    if (filters.category) {
      whereClauses.push(`category = ?`);
      queryParams.push(filters.category);
      countParams.push(filters.category);
    }
    if (filters.brand) {
      whereClauses.push(`brand = ?`);
      queryParams.push(filters.brand);
      countParams.push(filters.brand);
    }
    if (filters.condition) {
      whereClauses.push(`condition = ?`);
      queryParams.push(filters.condition);
      countParams.push(filters.condition);
    }
    if (filters.priceMin !== undefined && !isNaN(parseFloat(filters.priceMin))) {
      whereClauses.push(`price >= ?`);
      const priceMin = parseFloat(filters.priceMin);
      queryParams.push(priceMin);
      countParams.push(priceMin);
    }
    if (filters.priceMax !== undefined && !isNaN(parseFloat(filters.priceMax))) {
      whereClauses.push(`price <= ?`);
      const priceMax = parseFloat(filters.priceMax);
      queryParams.push(priceMax);
      countParams.push(priceMax);
    }
    if (filters.searchTerm) {
      const searchTermLike = `%${filters.searchTerm}%`;
      // Ensure tags are searched as JSON string segments for flexibility
      whereClauses.push(`(name LIKE ? OR description LIKE ? OR tags LIKE ?)`);
      queryParams.push(searchTermLike, searchTermLike, searchTermLike);
      countParams.push(searchTermLike, searchTermLike, searchTermLike);
    }

    if (whereClauses.length > 0) {
      const whereString = ` WHERE ${whereClauses.join(' AND ')}`;
      baseSql += whereString;
      countSql += whereString;
    }

    const validSortOrders = ['ASC', 'DESC'];
    const order = validSortOrders.includes(String(sortOrder).toUpperCase()) ? String(sortOrder).toUpperCase() : 'DESC';
    const validSortBy = ['createdAt', 'price', 'name', 'updatedAt'];
    const sortColumn = validSortBy.includes(sortBy) ? sortBy : 'createdAt';
    
    baseSql += ` ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`;
    queryParams.push(Number(limit), offset);
    
    try {
      const products = await dbAll(baseSql, queryParams);
      const countResult = await dbGet(countSql, countParams);
      const totalProducts = countResult ? countResult.total : 0;

      return {
        products: products.map(p => ({
          ...p,
          images: JSON.parse(p.images || '[]'),
          specifications: JSON.parse(p.specifications || '{}'),
          tags: JSON.parse(p.tags || '[]'),
          approved: Boolean(p.approved), // Convert 0/1 to false/true
        })),
        totalPages: Math.ceil(totalProducts / Number(limit)),
        currentPage: parseInt(page, 10),
        totalProducts,
      };
    } catch (error) {
      console.error('Error finding all products:', error.message);
      throw error;
    }
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
    if (data.price !== undefined) { fields.push('price = ?'); params.push(data.price); }
    if (data.originalPrice !== undefined) { fields.push('originalPrice = ?'); params.push(data.originalPrice); }
    if (data.category !== undefined) { fields.push('category = ?'); params.push(data.category); }
    if (data.brand !== undefined) { fields.push('brand = ?'); params.push(data.brand); }
    if (data.condition !== undefined) { fields.push('condition = ?'); params.push(data.condition); }
    if (data.stockQuantity !== undefined) { fields.push('stockQuantity = ?'); params.push(data.stockQuantity); }
    if (data.images !== undefined) { fields.push('images = ?'); params.push(JSON.stringify(data.images)); }
    if (data.specifications !== undefined) { fields.push('specifications = ?'); params.push(JSON.stringify(data.specifications)); }
    if (data.tags !== undefined) { fields.push('tags = ?'); params.push(JSON.stringify(data.tags)); }
    if (data.approved !== undefined) { fields.push('approved = ?'); params.push(data.approved ? 1 : 0); }

    if (fields.length === 0) {
      // If no fields to update, return the current product data without hitting the DB for an update
      const existingProduct = await this.findById(id);
      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found.`);
      }
      return existingProduct;
    }

    // The trigger 'update_Products_updatedAt' will handle updatedAt. 
    // Explicitly setting it here is redundant but harmless.
    // fields.push('updatedAt = CURRENT_TIMESTAMP'); 
    const sql = `UPDATE Products SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    try {
      await dbRun(sql, params);
      return this.findById(id);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error.message);
      throw error;
    }
  }

  static async delete(id) {
    const sql = `DELETE FROM Products WHERE id = ?`;
    try {
      const result = await dbRun(sql, [id]);
      if (result.changes === 0) {
        // Optionally, indicate that no rows were deleted (e.g., product not found)
        // This could be an error or just an info, depending on application logic
        console.warn(`Attempted to delete product with ID ${id}, but no rows were affected.`);
      }
      return { changes: result.changes };
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error.message);
      throw error;
    }
  }

  static async updateStock(id, newStockQuantity) {
    if (newStockQuantity === undefined || isNaN(Number(newStockQuantity)) || Number(newStockQuantity) < 0) {
        const error = new Error('Invalid stock quantity provided.');
        console.error(error.message);
        throw error;
    }
    const sql = `UPDATE Products SET stockQuantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    try {
      await dbRun(sql, [Number(newStockQuantity), id]);
      return this.findById(id);
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error.message);
      throw error;
    }
  }
}

module.exports = Product;
