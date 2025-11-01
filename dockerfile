# -----------------------------
# Stage 1: Build React app
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -----------------------------
# Stage 2: Serve using Nginx
# -----------------------------
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/si_konsinyasi_frontend.conf

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
