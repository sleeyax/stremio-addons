# base stremio addon dockerfile
# all addons should use the resulting image for max comptability
FROM node:12.18.4-alpine

ENV PORT=80
ENV NODE_ENV=production

RUN mkdir -p /usr/src/addon
WORKDIR /usr/src/addon

EXPOSE ${PORT}
