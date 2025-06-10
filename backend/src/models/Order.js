const { db } = require('../config/db');
const OrderItem = require('./OrderItem'); // For findByIdWithItems

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

class Order {
  static async create({ userId, totalAmount, shippingAddress, paymentMethod, paymentDetails, paymentStatus, orderStatus }) {
    const sql = `
      INSERT INTO Orders (userId, totalAmount, shippingAddress, paymentMethod, paymentDetails, paymentStatus, orderStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    // Ensure shippingAddress and paymentDetails are stringified JSON if passed as objects.
    // However, the comment implies controller logic handles this. If not, stringify here.
    // For now, assuming they are already strings as per original intent.
    const params = [
      userId,
      totalAmount,
      shippingAddress, // Assumed to be stringified JSON from controller
      paymentMethod,
      paymentDetails,  // Assumed to be stringified JSON from controller
      paymentStatus,
      orderStatus
    ];
    try {
      const result = await dbRun(sql, params);
      return this.findByIdWithItems(result.lastID); // Fetch the full order with items to return
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const sql = `SELECT * FROM Orders WHERE id = ?`;
    try {
      const order = await dbGet(sql, [id]);
      if (order) {
        order.shippingAddress = JSON.parse(order.shippingAddress || '{}');
        order.paymentDetails = order.paymentDetails ? JSON.parse(order.paymentDetails) : null;
      }
      return order;
    } catch (error) {
      throw error;
    }
  }

  static async findByIdWithItems(id) {
    const order = await this.findById(id);
    if (!order) {
      return null;
    }
    const items = await OrderItem.findByOrderId(id);
    order.items = items; // OrderItem.findByOrderId already parses productImages
    return order;
  }

  static async findByUserId(userId, { page: pageArg = 1, limit: limitArg = 10 } = {}) {
    const page = Number.isInteger(Number(pageArg)) && Number(pageArg) > 0 ? Number(pageArg) : 1;
    const limit = Number.isInteger(Number(limitArg)) && Number(limitArg) > 0 ? Number(limitArg) : 10;
    const offset = (page - 1) * limit;

    const ordersSql = `SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM Orders WHERE userId = ?`;
    try {
      const orders = await dbAll(ordersSql, [userId, limit, offset]);
      const countResult = await dbGet(countSql, [userId]);
      const totalOrders = countResult ? countResult.total : 0;

      const processedOrders = orders.map(order => ({
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress || '{}'),
        paymentDetails: order.paymentDetails ? JSON.parse(order.paymentDetails) : null,
      }));
      
      return {
        orders: processedOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        totalOrders,
      };
    } catch (error) {
      throw error;
    }
  }

  static async findOrdersBySellerId(sellerId, { page: pageArg = 1, limit: limitArg = 10 } = {}) {
    const page = Number.isInteger(Number(pageArg)) && Number(pageArg) > 0 ? Number(pageArg) : 1;
    const limit = Number.isInteger(Number(limitArg)) && Number(limitArg) > 0 ? Number(limitArg) : 10;
    const offset = (page - 1) * limit;

    const distinctOrderIdsSql = `
        SELECT DISTINCT o.id
        FROM Orders o
        JOIN OrderItems oi ON o.id = oi.orderId
        WHERE oi.sellerId = ?
        ORDER BY o.createdAt DESC
        LIMIT ? OFFSET ?
    `;
    const countDistinctOrderIdsSql = `
        SELECT COUNT(DISTINCT o.id) as total
        FROM Orders o
        JOIN OrderItems oi ON o.id = oi.orderId
        WHERE oi.sellerId = ?
    `;

    try {
      const orderIdRows = await dbAll(distinctOrderIdsSql, [sellerId, limit, offset]);
      const orderIds = orderIdRows.map(row => row.id);

      if (orderIds.length === 0) {
        return { orders: [], totalPages: 0, currentPage: page, totalOrders: 0 };
      }

      // Construct IN clause safely with placeholders
      const placeholders = orderIds.map(() => '?').join(',');
      const ordersSql = `
        SELECT * FROM Orders 
        WHERE id IN (${placeholders})
      `; 
      
      const fetchedOrders = await dbAll(ordersSql, orderIds);
      
      const countResult = await dbGet(countDistinctOrderIdsSql, [sellerId]);
      const totalOrders = countResult ? countResult.total : 0;

      const ordersWithItems = [];
      for (const order of fetchedOrders) {
        const fullOrder = await this.findByIdWithItems(order.id);
        if (fullOrder) {
            ordersWithItems.push(fullOrder);
        }
      }
      
      // Re-sort to match the paginated order ID list because IN clause doesn't guarantee order
      ordersWithItems.sort((a, b) => orderIds.indexOf(a.id) - orderIds.indexOf(b.id));

      return {
        orders: ordersWithItems,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        totalOrders,
      };
    } catch (error) {
      console.error(`Error finding orders by seller ID ${sellerId}:`, error.message);
      throw error;
    }
  }

  static async updateStatus(id, newStatus) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'];
    const lowerCaseNewStatus = String(newStatus).toLowerCase();
    if (!validStatuses.includes(lowerCaseNewStatus)) {
        throw new Error(`Invalid order status: ${newStatus}`);
    }
    const sql = `UPDATE Orders SET orderStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    try {
      const result = await dbRun(sql, [lowerCaseNewStatus, id]);
      if (result.changes === 0) {
        throw new Error(`Order with ID ${id} not found or status unchanged.`);
      }
      return this.findByIdWithItems(id); 
    } catch (error) {
      throw error;
    }
  }

  static async updatePayment(id, paymentStatus, paymentDetails) {
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    const lowerCasePaymentStatus = String(paymentStatus).toLowerCase();
     if (!validPaymentStatuses.includes(lowerCasePaymentStatus)) {
        throw new Error(`Invalid payment status: ${paymentStatus}`);
    }
    const sql = `UPDATE Orders SET paymentStatus = ?, paymentDetails = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    try {
      const result = await dbRun(sql, [lowerCasePaymentStatus, paymentDetails ? JSON.stringify(paymentDetails) : null, id]);
      if (result.changes === 0) {
        throw new Error(`Order with ID ${id} not found or payment details unchanged.`);
      }
      return this.findByIdWithItems(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;
