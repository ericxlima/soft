FROM node:18.16-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

RUN npm install pg pg-hstore

# RUN npx sequelize-cli db:migrate

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]