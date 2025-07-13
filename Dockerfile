# 加载 .env 变量
include .env
export

# ======================
# 开发环境命令
# ======================

# 启动开发容器
dev-up:
	docker compose up --build -d

# 停止开发容器
dev-down:
	docker compose down

# 查看开发容器状态
dev-ps:
	docker compose ps

# 查看开发容器日志
dev-logs:
	docker compose logs -f

# 热重载 nginx 配置
dev-reload-nginx:
	docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload

# ======================
# 生产环境命令（需要手动加载 prod 文件）
# ======================

# 构建生产镜像
prod-build:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml build

# 推送镜像到仓库
prod-push:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml push

# 启动生产容器
prod-up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env up -d

# 停止生产容器
prod-down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# 查看生产容器状态
prod-ps:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

# 查看生产日志
prod-logs:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# ======================
# Shell 进入（开发）
# ======================

# 进入开发 node 容器
dev-shell:
	docker compose exec node sh

# 进入开发 mysql 容器
mysql-shell:
	docker compose exec mysql sh

# 进入开发 redis 容器
redis-shell:
	docker compose exec redis sh

# 启动 MySQL CLI（开发：直接运行 mysql 命令）
mysql-cli:
		docker compose exec mysql sh -c "mysql -u'${DB_USER}' -p'${DB_PASS}' ${DB_NAME}"

# 启动 Redis CLI（开发）
redis-cli:
	docker compose exec redis redis-cli

# ======================
# Shell 进入（生产）
# ======================

# 进入生产 node 容器
prod-shell:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml exec node sh

# 进入生产 mysql 容器
prod-mysql-shell:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml exec mysql sh

# 进入生产 redis 容器
prod-redis-shell:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml exec redis sh

# 启动生产 MySQL CLI（直接运行 mysql 命令）
prod-mysql-cli:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml exec mysql sh -c "mysql -u${DB_USER} -p${DB_PASS} ${DB_NAME}"

# 启动生产 Redis CLI
prod-redis-cli:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml exec redis redis-cli

# ======================
# 通用命令
# ======================

# 清理未使用资源
prune:
	docker system prune -f

# 查看所有容器
ps-all:
	docker ps -a
