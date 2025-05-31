-- 检查并创建数据库
CREATE DATABASE IF NOT EXISTS hono;

USE hono;

-- 检查user表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);