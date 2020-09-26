# base stremio addon dockerfile
# all addons should use the resulting image for max comptability
FROM node:12.18.4-alpine

ENV PORT=80
ENV NODE_ENV=production

RUN mkdir -p /usr/src/addon
WORKDIR /usr/src/addon

RUN npm install -g typescript && npm cache clean --force

COPY @types/ @types/
COPY tsconfig.json tsconfig.json
COPY docker/ts-addon/tsconfig.prod.json tsconfig.prod.json

EXPOSE ${PORT}
