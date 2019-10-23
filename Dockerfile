FROM node:12.13 as build

WORKDIR /src

COPY package*.json ./
RUN npm ci --quiet

COPY . .

RUN npm run tsc \
  && npm prune --production

FROM node:12.13-alpine

WORKDIR /app

COPY --from=build /src/dist /app
COPY --from=build /src/node_modules /app/node_modules

RUN chmod u+x /app/index.js \
  && ln -s /app/index.js /usr/local/bin/transform

VOLUME /app/data

CMD ["transform", "-i", "/app/data/input.csv", "-o", "/app/data/output.json"]
