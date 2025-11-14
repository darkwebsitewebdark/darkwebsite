import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const tables = [
  `CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parentId INT,
    commissionRate INT NOT NULL DEFAULT 5,
    imageUrl TEXT,
    displayOrder INT NOT NULL DEFAULT 0,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS sellerApplications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    idCardImageUrl TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    adminNote TEXT,
    reviewedBy INT,
    reviewedAt TIMESTAMP,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sellerId INT NOT NULL,
    categoryId INT NOT NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    images JSON,
    status ENUM('active', 'inactive', 'outofstock') NOT NULL DEFAULT 'active',
    views INT NOT NULL DEFAULT 0,
    sales INT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    userId INT NOT NULL,
    orderId INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    images JSON,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyerId INT NOT NULL,
    sellerId INT NOT NULL,
    orderNumber VARCHAR(50) NOT NULL UNIQUE,
    totalAmount INT NOT NULL,
    commissionAmount INT NOT NULL,
    sellerAmount INT NOT NULL,
    status ENUM('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'disputed') NOT NULL DEFAULT 'pending_payment',
    shippingAddress JSON NOT NULL,
    trackingNumber VARCHAR(100),
    shippingProvider ENUM('flash', 'kerry', 'thailandpost', 'jnt'),
    shippingStatus TEXT,
    paidAt TIMESTAMP,
    shippedAt TIMESTAMP,
    deliveredAt TIMESTAMP,
    confirmedAt TIMESTAMP,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS orderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    productName VARCHAR(500) NOT NULL,
    productImage TEXT,
    quantity INT NOT NULL,
    price INT NOT NULL,
    subtotal INT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    type ENUM('topup', 'withdrawal', 'purchase', 'sale', 'commission', 'refund') NOT NULL,
    amount INT NOT NULL,
    balanceAfter INT NOT NULL,
    refNumber VARCHAR(50),
    relatedOrderId INT,
    status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    note TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS cartItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    senderId INT NOT NULL,
    receiverId INT NOT NULL,
    orderId INT,
    message TEXT NOT NULL,
    isSupport BOOLEAN NOT NULL DEFAULT FALSE,
    isRead BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    userId INT NOT NULL,
    reason TEXT NOT NULL,
    evidence JSON,
    status ENUM('open', 'investigating', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    resolution TEXT,
    resolvedBy INT,
    resolvedAt TIMESTAMP,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'payment', 'chat', 'system', 'dispute') NOT NULL,
    relatedId INT,
    isRead BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS withdrawalRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    amount INT NOT NULL,
    bankAccountNumber VARCHAR(50) NOT NULL,
    bankAccountName VARCHAR(255) NOT NULL,
    bankName VARCHAR(100) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
    adminNote TEXT,
    processedBy INT,
    processedAt TIMESTAMP,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`
];

// Update users table
await connection.execute(`
  ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS profileImage TEXT,
  ADD COLUMN IF NOT EXISTS bankAccountNumber VARCHAR(50),
  ADD COLUMN IF NOT EXISTS bankAccountName VARCHAR(255),
  ADD COLUMN IF NOT EXISTS bankName VARCHAR(100),
  ADD COLUMN IF NOT EXISTS idCardNumber VARCHAR(255),
  ADD COLUMN IF NOT EXISTS idCardImageUrl TEXT,
  ADD COLUMN IF NOT EXISTS walletBalance INT NOT NULL DEFAULT 0
`).catch(e => console.log("Users table already updated or error:", e.message));

// Modify role enum if needed
await connection.execute(`
  ALTER TABLE users MODIFY COLUMN role ENUM('user', 'seller', 'admin') NOT NULL DEFAULT 'user'
`).catch(e => console.log("Role enum already updated or error:", e.message));

for (const sql of tables) {
  try {
    await connection.execute(sql);
    const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
    console.log(`✓ Created table: ${tableName}`);
  } catch (e) {
    console.log(`Error:`, e.message);
  }
}

await connection.end();
console.log('Migration complete!');
