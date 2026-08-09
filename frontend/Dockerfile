# --- Estágio 1: Build do Angular ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# --- Estágio 2: NGINX Web Server ---
FROM nginx:alpine

# Limpa configurações e arquivos padrão do NGINX
RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

# Copia a sua configuração do NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados garantindo busca recursiva ou direta
COPY --from=build /app/dist/frontend /tmp/build-output
RUN if [ -d "/tmp/build-output/browser" ]; then \
        cp -r /tmp/build-output/browser/* /usr/share/nginx/html/; \
    else \
        cp -r /tmp/build-output/* /usr/share/nginx/html/; \
    fi && rm -rf /tmp/build-output

# Garante permissão de leitura pública para o NGINX
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
