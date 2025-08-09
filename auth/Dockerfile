FROM node:alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
# Note: The CMD command will run the start script defined in package.json