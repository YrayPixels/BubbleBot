FROM ghcr.io/puppeteer/puppeteer:24.7.2

WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_DOWNLOAD=true 


COPY package*.json ./
RUN npm ci
COPY  . .

CMD ["node", "index.js"]