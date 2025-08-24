# 使用官方 nginx 镜像作为基础
FROM nginx:alpine

# 设置工作目录
WORKDIR /app

# 将你的本地 nginx.conf 复制到镜像中的 nginx 配置目录
# 这会覆盖掉默认的配置
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./static ./static