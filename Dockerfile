# Base Node.js image (Alpine is lightweight)
FROM node:18-alpine

# Install build dependencies for node-pty (Python, make, g++)
RUN apk add --no-libc-base-search --no-cache \
    python3 \
    make \
    g++ \
    bash

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all application code
COPY . .

# Expose server port
EXPOSE 3000

# Set default shell environment variable
ENV SHELL=/bin/bash

# Start application
CMD ["npm", "start"]
