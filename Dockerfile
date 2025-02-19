FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache npm

COPY package.json .
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]