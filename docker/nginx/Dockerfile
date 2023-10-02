FROM node:18.16-alpine AS build

WORKDIR /app/frontend

COPY ./frontend ./

RUN npm install
RUN npm install -g serve 

RUN npm run build

FROM nginx:1.23.2-alpine

COPY --from=build /app/frontend/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]