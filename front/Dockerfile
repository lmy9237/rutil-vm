# ------------------------------
# Stage 1: Build the application using Node
FROM node:18.12.1-alpine AS build-fe
LABEL maintainer="Chan Hee Lee <chlee@ititinfo.com>"
LABEL build-stage="front"

WORKDIR /home/node

COPY package.json /home/node/
COPY package-lock.json /home/node/
RUN npm audit fix;exit 0
RUN npm i

COPY src /home/node/src
COPY tailwind.config.js /home/node/
COPY postcss.config.js /home/node/
COPY vite.config.js /home/node/
COPY index.html /home/node/
COPY logo*.png /home/node/
COPY favicon.svg /home/node/
COPY manifest.json /home/node/
COPY robots.txt /home/node/

RUN npm run build

# ------------------------------
# Stage 2: Run the application
# Base image for the runtime stage
FROM nginx:alpine
LABEL maintainer="Chan Hee Lee <chlee@ititinfo.com>"
LABEL description="RutilVM"
LABEL version="4.0.0"
LABEL build-no="2"
LABEL vcs-url="https://github.com/ititcloud/rutil-vm"
LABEL build-date="2025-07-25"
LABEL commit-hash="05f9e12ee27c1532623112d1df92004226d0d347"
LABEL license="Apache-2.0"
LABEL environment="production"
LABEL app-name="rutil-vm"

# Assuming you have a "certs" directory with your SSL certificate and key
# COPY certs /etc/nginx/certs

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage to the nginx html directory
COPY --from=build-fe /home/node/dist /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80 443

COPY entrypoint.sh /home/node/entrypoint.sh
RUN chmod +x /home/node/entrypoint.sh
# entrypoint.sh EOL 처리: DOS (CRLF) -> UNIX (LF)
RUN sed -i -e 's/\r$//' /home/node/entrypoint.sh
RUN sed -i -e 's/^M$//' /home/node/entrypoint.sh

# Start Nginx when the container launches
ENTRYPOINT [ "/home/node/entrypoint.sh" ]
