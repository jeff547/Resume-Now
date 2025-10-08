FROM node:23.11.0-bullseye

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD [ "npm", "run", "dev"]
