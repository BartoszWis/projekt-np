FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
CMD ["node","index.js"]
