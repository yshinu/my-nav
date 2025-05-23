# 阶段 1: 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制所有项目文件
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 阶段 2: 生产阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量，Next.js 生产环境需要
ENV NODE_ENV production

# 复制构建阶段生成的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]