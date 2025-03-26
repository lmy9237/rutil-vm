FROM node:18.12.1-alpine
LABEL maintainer="Chan Hee Lee <chlee@ititinfo.com>"
LABEL build-stage="wsproxy"

WORKDIR /home/node

COPY package.json /home/node/package.json
RUN npm audit fix;exit 0
RUN npm i

COPY src /home/node/src
COPY allowed.js /home/node/
COPY default.crt /home/node/
COPY default.key /home/node/
COPY index.js /home/node/

EXPOSE 9999

COPY docker-entrypoint.sh /home/node/docker-entrypoint.sh
RUN chmod +x /home/node/docker-entrypoint.sh
# entrypoint.sh EOL 처리: DOS (CRLF) -> UNIX (LF)
RUN sed -i -e 's/\r$//' /home/node/docker-entrypoint.sh
RUN sed -i -e 's/^M$//' /home/node/docker-entrypoint.sh

# Start Nginx when the container launches
ENTRYPOINT [ "/home/node/docker-entrypoint.sh" ]