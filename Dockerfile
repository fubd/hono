# =================================================================
# 阶段 1: 构建器 (Builder)
#
# 这个阶段的目标是创建一个包含所有构建工具和源代码的环境，
# 并编译出最终的可运行产物 (dist 目录)。
# =================================================================
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 1. 拷贝 package.json 和 lock 文件
#    我们只拷贝这两个文件，以便最大化利用 Docker 的层缓存。
#    只要这些文件不变，下一步的 npm install 就可以被缓存。
COPY package*.json ./

# 2. 安装所有依赖
#    在构建阶段，我们需要全部依赖 (dependencies 和 devDependencies)，
#    因为构建过程需要 @rsbuild/core, typescript 等开发工具。
RUN npm install

# 3. 拷贝所有源代码和配置文件
#    在依赖安装完成后，再拷贝源代码。这样修改代码不会破坏依赖缓存。
COPY . .

# 4. 运行构建命令
#    这个命令会调用 rsbuild 和 tsc 来构建前端和后端代码，
#    并将所有产物输出到 `dist` 目录。
RUN npm run build


# =================================================================
# 阶段 2: 生产环境 (Production)
#
# 这个阶段的目标是创建一个极度精简的镜像，只包含运行应用
# 所必需的 Node.js 运行时、生产依赖和编译后的代码。
# =================================================================
FROM node:22-alpine

# 从 .env 文件接收端口参数
ARG NODE_PORT_CONTAINER
ENV NODE_PORT_CONTAINER=${NODE_PORT_CONTAINER}
EXPOSE ${NODE_PORT_CONTAINER}


# 设置工作目录
WORKDIR /app

# 设置环境变量，确保应用在生产模式下运行
ENV NODE_ENV=production

# 1. 再次拷贝 package.json 和 lock 文件
COPY package*.json ./

# 2. 只安装生产依赖
#    这是关键的优化步骤！
#    `--omit=dev` 命令会告诉 npm 只安装 `dependencies` 字段中的包，
#    完全跳过 `devDependencies` 中的所有内容 (React, Rsbuild, etc.)。
#    这将使 node_modules 文件夹的体积大大减小，并加快安装速度。
RUN npm install --omit=dev

# 3. 从 'builder' 阶段拷贝编译好的代码
#    我们只从前一阶段拷贝 `dist` 目录。
#    最终的镜像里将不会包含任何 TypeScript 源码、React 组件源码、
#    配置文件或其他任何不必要的文件。
COPY --from=builder /app/dist ./dist

# 5. 定义容器启动命令
#    使用 tsc 编译后的 JavaScript 入口文件来启动服务器。
#    使用 exec 格式 (JSON 数组) 是最佳实践。
# 容器启动命令
CMD ["npm", "start"]