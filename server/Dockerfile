FROM node:20-alpine as build

WORKDIR /app/build

ADD *.json ./
RUN npm install

ADD . .
RUN npm run build

# Second stage

FROM node:20-alpine

WORKDIR /app/server

ADD package*.json .
RUN npm install --omit=dev

COPY --from=build /app/build/dist/src ./dist/src

EXPOSE 3000

CMD ["node", "./dist/src/main.js"]
