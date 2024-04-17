FROM node:20 as build

WORKDIR /app/build

ADD *.json ./
RUN npm install

ADD . .
RUN npm run build

# Second stage

#FROM node:20-alpine
#
#WORKDIR /app/client
#
#ADD package*.json .
#RUN npm install --omit=dev
#
#COPY --from=build /app/build/dist/ ./dist/
#COPY --from=build /app/build/public/ ./public/
#COPY --from=build /app/build/src/ ./src/
#COPY --from=build /app/build/*.html .
#COPY --from=build /app/build/*.json .
#COPY --from=build /app/build/vite.config.ts ./vite.config.ts

EXPOSE 3000

CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "preview"]
