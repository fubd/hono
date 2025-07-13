-- 检查并创建数据库
CREATE DATABASE IF NOT EXISTS hono_db;

USE hono_db;

-- 检查 user 表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS user (
 id BIGINT UNSIGNED PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
