CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(60) NOT NULL,
  melacash INTEGER DEFAULT 0,
  UNIQUE(username)
);

CREATE TABLE IF NOT EXISTS products (
  product VARCHAR(255) PRIMARY KEY,
  price VARCHAR(255) NOT NULL,
  UNIQUE(product)
);

CREATE TABLE IF NOT EXISTS inventory (
  inventoryID INTEGER PRIMARY KEY AUTOINCREMENT,
  username INT NOT NULL,
  product INT NOT NULL,
  FOREIGN KEY (product) REFERENCES products(product),
  FOREIGN KEY (username) REFERENCES users(username)
);