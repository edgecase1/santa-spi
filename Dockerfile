
FROM node

RUN apt-get update -y && apt-get install ffmpeg -y

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js page.html spiwrite /app/

EXPOSE 3000

CMD [ "node", "server.js" ]
