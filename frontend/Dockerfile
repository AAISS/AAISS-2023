FROM node:20.10.0

WORKDIR /run

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build