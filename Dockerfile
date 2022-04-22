# Builder stage, for building the source code only
ARG NODE_VERSION=17.5.0
ARG VARIANT=alpine
FROM node:${NODE_VERSION}-${VARIANT} as compiler
LABEL maintainer="plynoi.com"

# Create app directory
WORKDIR /app

# Install app dependencies and build configurations
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json .
COPY tsconfig.json .
COPY webpack.config.js .
#RUN npm install
RUN npm install -g npm@8.7.0 \
    && npm ci \
    && npm cache clean --force
# Copy source
COPY src ./src

# Build app
RUN npm run build

# 2nd stage for running the application
FROM node:${NODE_VERSION}-${VARIANT}

# Create app directory
WORKDIR /app
# Copy the bundle file and run script
COPY --from=compiler /app/dist ./dist
#COPY --from=builder /app/node_modules ./node_modules

#CMD [ "node", "--experimental-fetch", "./dist/rdp_nodefetch.js"]
ENTRYPOINT [ "node" ,"--experimental-fetch","./dist/main.js"]
