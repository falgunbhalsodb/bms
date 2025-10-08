# Stage 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies (for better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source code
COPY . .

# Accept build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application with optimizations
RUN npm run build

# Stage 2: Production runtime with Nginx
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built application from build stage
COPY --from=build /app/dist .

# Copy custom nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback - redirect all requests to index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Expose port 80 for Cloud Run
EXPOSE 80
ENV PORT=80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Run nginx in foregrounds
CMD ["nginx", "-g", "daemon off;"]
