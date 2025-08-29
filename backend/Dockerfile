FROM node:22-alpine
WORKDIR /app

# Install docker client for runner usage and small utilities
RUN apk add --no-cache docker-cli bash curl jq

# Copy package metadata and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy prisma schema (optional but useful)
COPY prisma ./prisma/

# Copy rest of the source
COPY . .

# Copy entrypoint script and make executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port (api)
EXPOSE 4000

# Run entrypoint then whatever CMD is provided (dev or worker)
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# Default command (compose overrides with npm run dev / worker)
CMD ["npm", "run", "dev"]
