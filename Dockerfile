FROM node:21-alpine

COPY . /app

RUN cd /app && npm install

EXPOSE 3000

CMD ["node", "/app/app.js"]