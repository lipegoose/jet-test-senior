# Dockerfile no diretório frontend/
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência e instala as dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia todo o código para dentro do container
COPY . .

# Exponha a porta interna em que o servidor de desenvolvimento roda (normalmente 3000)
EXPOSE 3000

# Inicia o servidor de desenvolvimento com hot reload
CMD ["npm", "start"]
