# 使用官方的Node.js基础镜像
FROM node:18.12.1

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json文件和package-lock.json文件
COPY package*.json ./

# 安装项目依赖
RUN npm install
# 使用软连接，并且将时区配置覆盖/etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TimeZone /etc/localtime && echo $TimeZone > /etc/timezone

# 复制所有源代码到工作目录
COPY . .

# 暴露容器端口
EXPOSE 8888

# 定义环境变量
ENV PORT 8888
# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai

# 定义命令启动应用
CMD ["npm", "run","app"]