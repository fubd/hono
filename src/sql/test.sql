-- 插入示例数据
INSERT INTO `user` (`id`, `name`, `password`) VALUES 
  (UUID_SHORT(), 'admin', 'admin123'),
  (UUID_SHORT(), 'test', 'test123');