# 使用官方的 Node.js 18 鏡像
FROM node:18

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製項目代碼到工作目錄
COPY . .

# 建立 Next.js 應用
RUN npm run build
RUN npm run start

# 暴露端口
EXPOSE 3000

# 運行應用
CMD ["npm", "start"]