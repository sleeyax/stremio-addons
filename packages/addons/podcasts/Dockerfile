# Dockerfile of addon is defined in /docker/js-addon/
FROM stremio-js-addon

COPY package*.json ./

RUN npm install --production && npm cache clean --force

COPY src/ src/
COPY resources/ resources/

CMD [ "npm", "start" ]