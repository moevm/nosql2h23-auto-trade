FROM mongo:7.0.3

FROM mongo-express:1.0.0-20

EXPOSE 8081

FROM node:21-alpine

COPY . /app

RUN cd /app && npm install

EXPOSE 3000

CMD ["node", "/app/app.js"]