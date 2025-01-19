FROM node:22.13-alpine

WORKDIR /api

# Copy package files
COPY package*.json ./

# Copy the distribution files
COPY dist ./dist

# Make directory for logs
RUN mkdir ./logs

# Run clean install
RUN npm ci --omit=dev

# Expose default port
EXPOSE 4000

ENTRYPOINT ["npm", "run", "api-start"]