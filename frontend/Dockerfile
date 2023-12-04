FROM node:18.18.0 AS build

WORKDIR /run

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

FROM alpine:3.17.6 AS production

WORKDIR /run
COPY --from=build /run/dist /dist
CMD cp -r /dist /run/dist
