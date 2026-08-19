FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
ENV WDS_SOCKET_PORT=0
CMD ["npm", "start"]