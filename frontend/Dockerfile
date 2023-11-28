FROM node:18.18.0

WORKDIR /run

COPY package*.json .
RUN npm install

COPY . .
CMD npm run build