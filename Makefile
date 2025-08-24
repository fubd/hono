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
	@echo "--> Building production images for linux/amd64 with tag: $(IMAGE_TAG)"
	docker buildx build --platform linux/amd64,linux/arm64 -t $(REGISTRY_PREFIX)/hono-app:$(IMAGE_TAG) -t $(REGISTRY_PREFIX)/hono-app:latest -f Dockerfile . --load
	docker buildx build --platform linux/amd64,linux/arm64 -t $(REGISTRY_PREFIX)/hono-nginx:$(IMAGE_TAG) -t $(REGISTRY_PREFIX)/hono-nginx:latest -f nginx/Dockerfile ./nginx --load
	
push:
	@echo "--> Pushing images to registry with tag: $(IMAGE_TAG) and latest"
	docker push $(REGISTRY_PREFIX)/hono-app:$(IMAGE_TAG)
	docker push $(REGISTRY_PREFIX)/hono-app:latest
	docker push $(REGISTRY_PREFIX)/hono-nginx:$(IMAGE_TAG)
	docker push $(REGISTRY_PREFIX)/hono-nginx:latest

release: build push