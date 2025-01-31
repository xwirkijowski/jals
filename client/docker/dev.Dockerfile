FROM node:22.13-alpine

WORKDIR /client

# Copy files
COPY ../package*.json ./
COPY ../*.config.js ./
COPY ../tsconfig.json ./
COPY ../next-env.d.ts ./
COPY ../src ./src

# Run clean install
RUN npm ci

# Create service group and user
RUN addgroup --system --gid 1001 service
RUN adduser --system --uid 1001 -g 1001 service
USER service

# Set run time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_CLIENT_API_STRING
ENV NEXT_PUBLIC_CLIENT_API_STRING=${NEXT_PUBLIC_CLIENT_API_STRING}
ARG SERVER_API_STRING
ENV SERVER_API_STRING=${SERVER_API_STRING}

# Expose default port
EXPOSE 3000

ENTRYPOINT ["npm", "run", "client-dev"]








