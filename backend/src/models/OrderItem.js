const { db } = require('../config/db'); // Import the db instance

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

class OrderItem {
  // Create a new order item
  static async create({ orderId, productId, sellerId, quantity, priceAtPurchase }) {
    const sql = `
      INSERT INTO OrderItems (orderId, productId, sellerId, quantity, priceAtPurchase)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const result = await dbRun(sql, [orderId, productId, sellerId, quantity, priceAtPurchase]);
      return { id: result.lastID, orderId, productId, sellerId, quantity, priceAtPurchase };
    } catch (error) {
      // Error already logged by dbRun
      throw error;
    }
  }

  // Find all items for a given orderId
  static async findByOrderId(orderId) {
    const sql = `
      SELECT oi.*, p.name as productName, p.images as productImages
      FROM OrderItems oi
      LEFT JOIN Products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `;
    try {
      const rows = await dbAll(sql, [orderId]);
      return rows.map(row => ({
         ...row, 
         productImages: row.productImages ? JSON.parse(row.productImages) : [] 
        }));
    } catch (error) {
      // Error already logged by dbAll
      throw error;
    }
  }

  // Find all items sold by a given sellerId (across all orders)
  static async findBySellerId(sellerId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const itemsSql = `
      SELECT oi.*, o.id as orderId, o.orderStatus, o.createdAt as orderDate, p.name as productName
      FROM OrderItems oi
      JOIN Orders o ON oi.orderId = o.id
      LEFT JOIN Products p ON oi.productId = p.id
      WHERE oi.sellerId = ?
      ORDER BY o.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    const countSql = `SELECT COUNT(*) as total FROM OrderItems WHERE sellerId = ?`;

    try {
      const items = await dbAll(itemsSql, [sellerId, limit, offset]);
      const countResult = await dbGet(countSql, [sellerId]);
      const totalItems = countResult ? countResult.total : 0;
      return {
        items: items.map(item => ({ ...item, productImages: item.productImages ? JSON.parse(item.productImages) : [] })),
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page, 10),
        totalItems
      };
    } catch (error) {
      // Errors already logged by dbAll/dbGet
      throw error;
    }
  }
}

module.exports = OrderItem;
