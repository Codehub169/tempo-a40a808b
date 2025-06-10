const db = require('../config/db').promise();

class OrderItem {
  // Create a new order item
  // This might be called internally by an Order.create method within a transaction
  static async create({ orderId, productId, sellerId, quantity, priceAtPurchase }) {
    const sql = `
      INSERT INTO OrderItems (orderId, productId, sellerId, quantity, priceAtPurchase)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await db.execute(sql, [orderId, productId, sellerId, quantity, priceAtPurchase]);
      return { id: result.insertId, orderId, productId, sellerId, quantity, priceAtPurchase };
    } catch (error) {
      console.error('Error creating order item:', error);
      throw error;
    }
  }

  // Find all items for a given orderId
  static async findByOrderId(orderId) {
    const sql = `
      SELECT oi.*, p.name as productName, p.images as productImages
      FROM OrderItems oi
      JOIN Products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `;
    try {
      const [rows] = await db.execute(sql, [orderId]);
      return rows.map(row => ({ ...row, productImages: JSON.parse(row.productImages || '[]') }));
    } catch (error) {
      console.error(`Error fetching order items for orderId ${orderId}:`, error);
      throw error;
    }
  }

  // Find all items sold by a given sellerId (across all orders)
  static async findBySellerId(sellerId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT oi.*, o.id as orderId, o.orderStatus, o.createdAt as orderDate, p.name as productName
      FROM OrderItems oi
      JOIN Orders o ON oi.orderId = o.id
      JOIN Products p ON oi.productId = p.id
      WHERE oi.sellerId = ?
      ORDER BY o.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    const countSql = `SELECT COUNT(*) as total FROM OrderItems WHERE sellerId = ?`;

    try {
      const [rows] = await db.execute(sql, [sellerId, limit, offset]);
      const [countResult] = await db.execute(countSql, [sellerId]);
      const totalItems = countResult[0].total;
      return {
        items: rows,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems
      };
    } catch (error) {
      console.error(`Error fetching order items for sellerId ${sellerId}:`, error);
      throw error;
    }
  }

  // Potentially other methods like findById, update, delete if needed directly
}

module.exports = OrderItem;
