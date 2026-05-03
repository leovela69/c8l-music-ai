FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compilar el frontend
RUN npm run build

EXPOSE 3001

# Ejecutar el servidor que sirve tanto la API como el Frontend
CMD ["npm", "run", "server"]
