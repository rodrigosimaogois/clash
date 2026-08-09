FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

# Usamos --allowed-hosts=all no lugar de --disable-host-check
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--allowed-hosts=all"]
