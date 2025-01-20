FROM node:22.13-alpine

WORKDIR /api

# Create service group and user
RUN addgroup --system --gid 1001 service
RUN adduser --system --uid 1001 -g 1001 service

# Copy package files
COPY --chown=service:service package*.json ./

# Copy the distribution files
COPY --chown=service:service ../dist ./dist

# Make directory for logs
RUN mkdir ./logs
RUN chown service:service ./logs

# Run clean install
RUN npm ci --omit=dev

# Use service user
USER service

# Expose default port
EXPOSE 4000

ENTRYPOINT ["npm", "run", "api-start"]