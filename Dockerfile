# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro para aproveitar cache
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do código para dentro do container
COPY . .

# Expõe a porta 3000 para comunicação
EXPOSE 3000

# Comando padrão ao iniciar o container
CMD ["npm", "start"]
