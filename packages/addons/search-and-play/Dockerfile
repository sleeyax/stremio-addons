# Dockerfile of addon is defined in /docker/ts-addon/
FROM stremio-ts-addon

ENV STREAMING_SERVER_URL=
ENV ADDON_URL=

COPY package*.json ./

RUN npm install --production && npm install @types/node && npm cache clean --force

COPY src/ src/

RUN tsc --build tsconfig.prod.json

CMD [ "npm", "start" ]