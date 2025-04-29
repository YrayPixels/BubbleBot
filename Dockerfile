FROM ghcr.io/puppeteer/puppeteer:24.7.2

WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMUIM_DOWNLOAD=true 
# PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable


COPY package*.json ./
RUN npm ci
COPY  . .

CMD ["node", "index.js"]