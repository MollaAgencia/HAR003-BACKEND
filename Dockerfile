FROM node:20-alpine AS dependencies
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS deploy
RUN apk add --no-cache openssl
WORKDIR /app
RUN apt-get update -y 
ENV NODE_ENV production

FROM node:20-alpine AS server
RUN apk add --no-cache openssl
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build


EXPOSE 3333

CMD ["npm", "run", "start:prod"]
