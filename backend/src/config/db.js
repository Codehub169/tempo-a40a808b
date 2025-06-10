const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determine the database path from environment variable or use a default
const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../../data/database.sqlite');
const dbDir = path.dirname(dbPath);

// Ensure the data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        // If the database cannot be opened, it's a critical error. Consider exiting.
        process.exit(1);
    } else {
        console.log(`Connected to the SQLite database at ${dbPath}`);
    }
});

const initializeDB = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users Table
            db.run(`
                CREATE TABLE IF NOT EXISTS Users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT CHECK(role IN ('buyer', 'seller', 'admin')) NOT NULL DEFAULT 'buyer',
                    profilePicture TEXT,
                    phoneNumber TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => { if (err) return reject(new Error(`Failed to create Users table: ${err.message}`)); });

            // Products Table
            db.run(`
                CREATE TABLE IF NOT EXISTS Products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    price REAL NOT NULL,
                    originalPrice REAL,
                    category TEXT NOT NULL,
                    brand TEXT,
                    condition TEXT CHECK(condition IN ('new_sealed', 'like_new', 'excellent', 'good', 'fair')) NOT NULL,
                    stockQuantity INTEGER NOT NULL DEFAULT 0,
                    images TEXT, -- JSON array of image URLs/paths
                    sellerId INTEGER NOT NULL,
                    specifications TEXT, -- JSON object for key-value specs
                    tags TEXT, -- JSON array of strings
                    approved BOOLEAN DEFAULT 0, -- 0 for false, 1 for true. Default to unapproved for seller-added items.
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (sellerId) REFERENCES Users(id) ON DELETE CASCADE
                )
            `, (err) => { if (err) return reject(new Error(`Failed to create Products table: ${err.message}`)); });

            // Orders Table
            db.run(`
                CREATE TABLE IF NOT EXISTS Orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userId INTEGER NOT NULL,
                    totalAmount REAL NOT NULL,
                    shippingAddress TEXT NOT NULL, -- JSON object
                    paymentMethod TEXT,
                    paymentDetails TEXT, -- Store payment gateway response or transaction ID (JSON object)
                    paymentStatus TEXT CHECK(paymentStatus IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
                    orderStatus TEXT CHECK(orderStatus IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed')) DEFAULT 'pending',
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
                )
            `, (err) => { if (err) return reject(new Error(`Failed to create Orders table: ${err.message}`)); });

            // OrderItems Table (Junction table for Orders and Products)
            db.run(`
                CREATE TABLE IF NOT EXISTS OrderItems (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    orderId INTEGER NOT NULL,
                    productId INTEGER NOT NULL,
                    sellerId INTEGER NOT NULL, -- Denormalized for easier seller order management
                    quantity INTEGER NOT NULL,
                    priceAtPurchase REAL NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
                    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE SET NULL, -- Product might be deleted, but order item should remain
                    FOREIGN KEY (sellerId) REFERENCES Users(id) ON DELETE SET NULL -- Seller might be deleted
                )
            `, (err) => { if (err) return reject(new Error(`Failed to create OrderItems table: ${err.message}`)); });

            // Triggers to update 'updatedAt' timestamps
            const tablesWithUpdatedAt = ['Users', 'Products', 'Orders', 'OrderItems'];
            tablesWithUpdatedAt.forEach(table => {
                db.run(`
                    CREATE TRIGGER IF NOT EXISTS update_${table}_updatedAt
                    AFTER UPDATE ON ${table}
                    FOR EACH ROW
                    BEGIN
                        UPDATE ${table} SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
                    END;
                `, (triggerErr) => { 
                    if (triggerErr) console.warn(`Warning: Could not create update trigger for ${table}: ${triggerErr.message}`); 
                });
            });
            
            console.log('Database tables checked/created.');
            resolve(db); // Resolve with the db instance
        });
    });
};

// Handle command-line argument for explicit initialization (e.g., from package.json script)
if (require.main === module && process.argv.includes('--init')) {
    console.log('Explicit database initialization requested...');
    initializeDB()
        .then(() => {
            console.log('Database initialization script completed successfully.');
            db.close((closeErr) => {
                if (closeErr) console.error('Error closing database:', closeErr.message);
                process.exit(0);
            });
        })
        .catch(err => {
            console.error('Database initialization script failed:', err);
            db.close((closeErr) => {
                if (closeErr) console.error('Error closing database:', closeErr.message);
                process.exit(1);
            });
        });
}

module.exports = { initializeDB, db };
