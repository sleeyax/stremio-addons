# Dockerfile of addon is defined in /docker/ts-addon/
FROM stremio-js-addon

COPY package*.json ./

RUN npm install --production && npm cache clean --force

COPY resources/ resources/
COPY src/ src/

CMD [ "npm", "start" ]