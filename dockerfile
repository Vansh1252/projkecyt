FROM node:22-alpine

# Install Chromium and dependencies for Puppeteer
RUN apk add --no-cache \
    curl \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji \
    udev \
    ttf-opensans

# Set Puppeteer to use installed Chromium (skip download to save space)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
ADD package*.json .

# Install dependencies (Puppeteer will skip Chromium download due to env var)
RUN npm i

COPY . .

RUN npm run build

# Switch to non-root user
USER node

EXPOSE 3000
CMD npm run start
