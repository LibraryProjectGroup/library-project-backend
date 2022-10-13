FROM node:latest

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy project to docker
COPY . .

# Build project
RUN npm run build

# Expose port 3000 to host
EXPOSE 3000

# Run the project
CMD ["node", "build/index.js"]