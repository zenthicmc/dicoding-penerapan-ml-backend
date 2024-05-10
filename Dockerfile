FROM node:buster-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000:3000

CMD ["npm", "run", "start"]
