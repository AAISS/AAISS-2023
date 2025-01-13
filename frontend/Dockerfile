FROM focker.ir/node:18.20-alpine AS build

WORKDIR /run

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

FROM focker.ir/alpine:3.17.6 AS production

WORKDIR /run
COPY --from=build /run/dist /dist
CMD cp -r /dist /run
