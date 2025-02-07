# ------------------------------
# Stage 1: Build the application using Node
FROM node:18.12.1-alpine AS build-fe
WORKDIR /usr/src/app

COPY rutil-vm-api/src/main/frontend ./

RUN npm install
RUN npm run build