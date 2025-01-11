# Etapa 1: Construcción
FROM node:18 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
COPY . .

# Instala dependencias
RUN npm install --frozen-lockfile

# Compila el proyecto
RUN npm run build

# Etapa 2: Ejecución
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los artefactos de la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm install --production

# Expon el puerto (asegúrate de que sea el que usa tu aplicación)
EXPOSE 3001

# Comando de inicio
CMD ["node", "dist/main"]
