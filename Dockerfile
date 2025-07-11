# Step 1: Build the Angular app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Step 2: Serve it using Nginx
FROM nginx:alpine

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from step 1
COPY --from=builder /app/dist/ts-pmt-ui-1725/browser /usr/share/nginx/html


# Copy custom nginx config if you want (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
