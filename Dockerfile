
FROM node

RUN apt-get update -y && apt-get install ffmpeg -y

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
EXPOSE 3030

CMD [ "node", "server.js" ]
