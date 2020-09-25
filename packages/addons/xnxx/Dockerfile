FROM node:12.18.4-alpine

ENV PORT=80
ENV NODE_ENV=production

RUN mkdir -p /usr/src/addon
WORKDIR /usr/src/addon

COPY package*.json ./

RUN npm install --production && npm cache clean --force

COPY ./tsconfig.json ./tsconfig.json
COPY ./assets ./assets
COPY ./build ./build

EXPOSE ${PORT}

CMD [ "npm", "start" ]