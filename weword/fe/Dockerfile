# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

COPY package*.json ./

# install and cache app dependencies
RUN npm install 
RUN npm install react-scripts@3.0.1 -g 

ENV REACT_APP_API_URL="http://localhost:4001"

COPY . .

EXPOSE 3000

# start app
CMD ["npm", "start"]
