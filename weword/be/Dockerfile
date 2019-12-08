FROM node:10

# Create app directory
WORKDIR /Users/noahfiner/Desktop/Website Projects/weword/be

COPY package*.json ./

RUN npm install

ENV MONGO_URL="mongo:27017"

COPY . .

EXPOSE 4001

CMD [ "nodemon", "server.js" ]
