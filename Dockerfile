# Use Node.js 18 on Alpine Linux (lightweight)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile the contract to ensure everything is ready
RUN npx hardhat compile

# The default command runs the test suite
CMD ["npx", "hardhat", "test"]