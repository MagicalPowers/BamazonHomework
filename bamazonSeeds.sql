DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT, 
    department_name VARCHAR(100) NULL,
    over_head_costs INT NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  sale_price INTEGER(10) NOT NULL,
  -- cost INTEGER(10),
  stock_quantity INTEGER(10) NOT NULL,
  total_sold INT NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, sale_price, stock_quantity)
VALUES ("Hammond Organ", "musical instruments", 375, 1),
("Osage Orange", "trees", 125, 8),
("American Chestnut (Blight Resistant", "trees", 500, 100),
("Meyer Lemon", "trees", 95, 20),
("A. Homer Hilson", "bicycles", 2800, 12),
("Sandworm", "bicycles", 2500, 2),
("Ice Cream Truck", "bicycles", 2000, 3),
("PEX 3/4X3/4X1/2 Manifold Three Port Pass-Through", "plumbing", 22, 30),
("Water Pressure Regulator", "plumbing", 25, 25),
("5X5X3 B-VENT SWIVEL WYE", "ducting", 40, 12);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("musical instruments", 5000),
("trees", 40000),
("bicycles", 30000),
("plumbing", 80000),
("ducting", 100000);
