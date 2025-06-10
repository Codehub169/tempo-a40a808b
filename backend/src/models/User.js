const { db } = require('../config/db');
const bcrypt = require('bcryptjs');

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

class User {
  // Create a new user
  static async create({ name, email, password, role, profilePicture, phoneNumber }) {
    const sql = `
      INSERT INTO Users (name, email, password, role, profilePicture, phoneNumber)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    try {
      // Password should be pre-hashed by the controller before calling User.create
      const result = await dbRun(sql, [name, email, password, role || 'buyer', profilePicture, phoneNumber]);
      // Return the newly created user, fetching it to get all fields including defaults like createdAt
      return this.findById(result.lastID);
    } catch (error) {
      throw error;
    }
  }

  // Find a user by email
  static async findByEmail(email) {
    const sql = `SELECT * FROM Users WHERE email = ?`;
    try {
      return await dbGet(sql, [email]);
    } catch (error) {
      throw error;
    }
  }

  // Find a user by ID
  static async findById(id) {
    const sql = `SELECT * FROM Users WHERE id = ?`;
    try {
      const user = await dbGet(sql, [id]);
      // It's good practice to not send the password hash, even if it's for internal use after this point.
      // The authMiddleware already handles this for req.user, but models can also enforce it.
      if (user && user.password) {
        delete user.password; // Or create a user object without it
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  // Find a user by ID but include password (for login comparison)
  static async findByIdWithPassword(id) {
    const sql = `SELECT * FROM Users WHERE id = ?`;
    try {
      return await dbGet(sql, [id]);
    } catch (error) {
      throw error;
    }
  }

  // Update user profile information
  static async update(id, { name, profilePicture, phoneNumber }) {
    const fieldsToUpdate = [];
    const params = [];

    if (name !== undefined) { fieldsToUpdate.push('name = ?'); params.push(name); }
    if (profilePicture !== undefined) { fieldsToUpdate.push('profilePicture = ?'); params.push(profilePicture); }
    if (phoneNumber !== undefined) { fieldsToUpdate.push('phoneNumber = ?'); params.push(phoneNumber); }

    if (fieldsToUpdate.length === 0) {
      return this.findById(id); // No changes, return current user data
    }

    params.push(id); // For the WHERE clause
    const sql = `UPDATE Users SET ${fieldsToUpdate.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;

    try {
      await dbRun(sql, params);
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Change user password
  static async changePassword(id, newPasswordHash) {
    const sql = `UPDATE Users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    try {
      await dbRun(sql, [newPasswordHash, id]);
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Get all users (for admin)
  static async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const usersSql = `SELECT id, name, email, role, profilePicture, phoneNumber, createdAt, updatedAt FROM Users ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM Users`;
    try {
      const users = await dbAll(usersSql, [limit, offset]);
      const countResult = await dbGet(countSql);
      const totalUsers = countResult ? countResult.total : 0;
      return {
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: parseInt(page, 10),
        totalUsers
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
