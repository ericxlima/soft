FROM node:18.16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# RUN npx sequelize-cli db:migrate

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
