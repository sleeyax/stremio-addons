# Dockerfile of addon is defined in /docker/ts-addon/
FROM stremio-ts-addon

ENV PROXY=

COPY package*.json ./

RUN npm install --production && npm cache clean --force

COPY assets/ assets/
COPY src/ src/

RUN tsc --build tsconfig.prod.json

CMD [ "npm", "start" ]