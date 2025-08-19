# 使用 git 的 commit hash 作为镜像标签，确保版本唯一性
IMAGE_TAG := $(shell git rev-parse --short HEAD)
REGISTRY_PREFIX=registry.cn-hangzhou.aliyuncs.com/fubd_own

# ======================
# 开发环境命令
# ======================
dev-up:
	docker compose -f docker-compose.dev.yml up --build -d

dev-down:
	docker compose -f docker-compose.dev.yml down --volumes

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-shell:
	docker compose -f docker-compose.dev.yml exec node sh

# ======================
# 生产制品构建与推送
# (在开发机或 CI/CD 服务器上执行)
# ======================
build:
	@echo "--> Building production images with tag: $(IMAGE_TAG)"
	docker build -t $(REGISTRY_PREFIX)/hono-app:$(IMAGE_TAG) -t $(REGISTRY_PREFIX)/hono-app:latest -f Dockerfile .
	docker build -t $(REGISTRY_PREFIX)/hono-nginx:$(IMAGE_TAG) -t $(REGISTRY_PREFIX)/hono-nginx:latest -f gateway/Dockerfile ./gateway

push:
	@echo "--> Pushing images to registry with tag: $(IMAGE_TAG) and latest"
	docker push $(REGISTRY_PREFIX)/hono-app:$(IMAGE_TAG)
	docker push $(REGISTRY_PREFIX)/hono-app:latest
	docker push $(REGISTRY_PREFIX)/hono-nginx:$(IMAGE_TAG)
	docker push $(REGISTRY_PREFIX)/hono-nginx:latest

build-push: build push

# ======================
# 生产环境部署命令
# (这些命令仅供参考，实际在生产服务器上是手动执行)
# ======================
prod-up:
  # 在生产服务器上执行此命令前，需先设置好 .env 和 docker-compose.prod.yml
  # 并通过 export IMAGE_TAG=<tag> 指定版本
	docker compose -f docker-compose.prod.yml --env-file .env up -d

prod-down:
	docker compose -f docker-compose.prod.yml down