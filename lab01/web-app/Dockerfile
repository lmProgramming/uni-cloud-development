FROM node:16
WORKDIR /usr/src/app

# Kopiowanie plików package.json i package-lock.json do kontenera
COPY package*.json ./

# Instalowanie zależności aplikacji
RUN npm install

# Kopiowanie całego kodu aplikacji do kontenera
COPY . .

# Budowanie aplikacji (kompilacja TypeScript do JavaScript)
RUN npm run build

# Otwieranie portu 8080
EXPOSE 8080

# Komenda uruchamiająca aplikację
CMD ["node", "dist/server.js"]