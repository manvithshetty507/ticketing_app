FROM node:alpine
WORKDIR /app

COPY package*.json ./
RUN npm install 
# Installs both dependencies and devDependencies
COPY . .

EXPOSE 3000
CMD ["npm", "start"]