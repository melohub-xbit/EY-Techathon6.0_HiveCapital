FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.23-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx template
# The nginx-alpine image process will run envsubst on this file 
# and output it to /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Cloud Run injects PORT. We also need BACKEND_URL.
# Expose is for documentation, Cloud Run ignores it but useful for local testing
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
