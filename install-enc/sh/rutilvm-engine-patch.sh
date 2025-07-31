#!/bin/bash

LOGFILE="/var/log/rutilvm-patch.log"

show_spinner() {
	local pid=$1
	local spinstr='|/-\\'
	local len=${#spinstr}
	local i=0
	printf '\e[?25l'
	while ps -p "$pid" >/dev/null 2>&1; do
		printf "\rRutilVM is being patched... [%c] " "${spinstr:i % len:1}"
		((i++))
		sleep 0.2
	done
	printf "\r\033[K"
	printf '\e[?25h'
}

(
	set -e
	set -o pipefail
	
	echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting RutilVM patch"
	
	all_containers=$(docker ps -aq)
	if [ -n "$all_containers" ]; then
		running_containers=$(docker ps -q)
		[ -n "$running_containers" ] && docker stop $running_containers
		docker rm $all_containers
		docker rmi $(docker images -q) -f
		docker container prune -f
	fi
	
	systemctl stop docker
	systemctl daemon-reload
	
	cloudinitEnginePwd=itinfo1!
	export UNZIP_DISABLE_ZIPBOMB_DETECTION=TRUE
	unzip -q -P $cloudinitEnginePwd -o ./engine.zip -d /var/share/pkg/rutilvm/
	
	COMPOSE_FILE="/var/share/pkg/rutilvm/engine/containers/docker-compose.yml"
	mkdir -p "$(dirname "$COMPOSE_FILE")"
	cat << 'COMPOSE_FILE_EOF' > "$COMPOSE_FILE"
version: "3"

services:
  rutil-vm-api:
    image: rutil-vm-api:latest
    container_name: rutil-vm-api
    ports:
      - "6690:6690"
    environment:
      TZ: Asia/Seoul
      LANGUAGE: ko_KR;ko;en_US;en
      LC_ALL: ko_KR.UTF-8
      LANG: ko_KR.utf8
      RUTIL_VM_OVIRT_IP: ENGINE_IP
      RUTIL_VM_OVIRT_PORT_HTTPS: 8443
      RUTIL_VM_PORT_HTTPS: 6690
      RUTIL_VM_SSL_KEY_STORE: /app/certs/keystore.p12
      RUTIL_VM_SSL_KEY_STORE_PASSWORD: rutil-vm-api
      RUTIL_VM_SSL_KEY_ALIAS: rutil-vm-api
      RUTIL_VM_CORS_ALLOWED_ORIGINS: ENGINE_IP;ENGINE_FQDN
      RUTIL_VM_CORS_ALLOWED_ORIGINS_PORT: 3000;3443;443
      RUTIL_VM_OVIRT_LOGIN_LIMIT: 5
      RUTIL_VM_OVIRT_SSH_JSCH_LOG_ENABLED: true
      RUTIL_VM_OVIRT_SSH_JSCH_CONNECTION_TIMEOUT: 60000
      RUTIL_VM_OVIRT_SSH_CERT_LOCATION: /app/tmp
      RUTIL_VM_OVIRT_SSH_PRVKEY_LOCATION: /root/.ssh/id_rsa
      RUTIL_VM_OVIRT_SSH_ENGINE_ADDRESS: rutilvm@ENGINE_IP:22
      RUTIL_VM_OVIRT_SSH_ENGINE_PRVKEY: |
OVIRT_ENGINE_PRIVATE_KEY
      POSTGRES_JDBC_PORT: 5432
      POSTGRES_DATASOURCE_JDBC_ID: rutil
      POSTGRES_DATASOURCE_JDBC_PW: rutil1!
    volumes:
      - /opt/rutilvm/rutil-vm-api/logs:/app/logs:rw
      - /opt/rutilvm/rutil-vm-api/certs:/app/certs:rw
      - /opt/rutilvm/rutil-vm-api/tmp:/app/tmp:rw
      - /home/rutilvm/.ssh:/root/.ssh:rw
      - /etc/hosts:/etc/hosts:ro
      - /etc/localtime:/etc/localtime:ro
    networks:
      - ovirt_network
    healthcheck:
      test: ["CMD-SHELL", "curl --silent --fail https://localhost:6690/actuator/health || exit 1"]
      interval: 10s
      timeout: 10s
      retries: 3
    restart: on-failure

  rutil-vm:
    image: rutil-vm:latest
    container_name: rutil-vm
    ports:
      - "443:443"
    environment:
      TZ: Asia/Seoul
      LANGUAGE: ko_KR;ko;en_US;en
      LC_ALL: ko_KR.UTF-8
      LANG: ko_KR.utf8
      NODE_ENV: production
      __RUTIL_VM_OVIRT_IP_ADDRESS__: ENGINE_IP
      __RUTIL_VM_LOGGING_ENABLED__: true
      __RUTIL_VM_ITEMS_PER_PAGE__: 20
      __RUTIL_VM_IS_LICENCE_VERIFIED__: false
      __RUTIL_VM_WATERMARK_TEXT__: RV_WATERMARK_TEXT
    volumes:
      - /opt/rutilvm/rutil-vm/certs/fullchain.pem:/etc/nginx/certs/fullchain.pem:ro
      - /etc/pki/ovirt-engine/keys:/etc/pki/ovirt-engine/keys:ro
    networks:
      - ovirt_network
    healthcheck:
      test: ["CMD-SHELL", "curl --silent --fail https://localhost:433 || exit 1"]
      interval: 10s
      timeout: 10s
      retries: 3
    restart: always

  rutil-vm-wsproxy:
    image: rutil-vm-wsproxy:latest
    container_name: rutil-vm-wsproxy
    ports:
      - "9999:9999"
    environment:
      TZ: Asia/Seoul
      LANGUAGE: ko_KR;ko;en_US;en
      LC_ALL: ko_KR.UTF-8
      LANG: ko_KR.utf8
      PORT: 9999
    volumes:
      - ./rutil-vm/certs/fullchain.pem:/home/node/fullchain.pem:ro
    networks:
      - ovirt_network
    restart: always

networks:
  ovirt_network:
    driver: bridge
COMPOSE_FILE_EOF
	
	ENGINE_FQDN=$(grep '^ENGINE_FQDN=' /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf | cut -d'=' -f2)
	ENGINE_IP=$(awk -v fqdn="$ENGINE_FQDN" '$0 !~ /^#/ && fqdn && index($0, fqdn) {print $1; exit}' /etc/hosts)
	RV_WATERMARK_TEXT=무단배포금지
	
	sed -i "s/ENGINE_IP/$ENGINE_IP/g" "$COMPOSE_FILE"
	sed -i "s/ENGINE_FQDN/$ENGINE_FQDN/g" "$COMPOSE_FILE"
	sed -i "s/RV_WATERMARK_TEXT/$RV_WATERMARK_TEXT/g" "$COMPOSE_FILE"
	
	TMP_FILE=$(mktemp)
	while IFS= read -r line; do
		if [[ "$line" == *"OVIRT_ENGINE_PRIVATE_KEY"* ]]; then
			sed 's/^/        /' /etc/pki/ovirt-engine/keys/engine_id_rsa >> "$TMP_FILE"
		else
			echo "$line" >> "$TMP_FILE"
		fi
	done < "$COMPOSE_FILE"
	mv "$TMP_FILE" "$COMPOSE_FILE"
	
	systemctl enable docker
	systemctl start docker
	sleep 5
	docker load -i /var/share/pkg/rutilvm/engine/containers/api.tar
	docker load -i /var/share/pkg/rutilvm/engine/containers/web.tar
	docker load -i /var/share/pkg/rutilvm/engine/containers/wsproxy.tar
	
	mount /tmp -o remount,exec
	ln -sf /usr/libexec/docker/cli-plugins/docker-compose /usr/bin/docker-compose
	
	PROJECT_NAME=$(basename "$(dirname "$COMPOSE_FILE")")
	RUNNING_CONTAINERS=$(docker ps -a --filter "label=com.docker.compose.project=${PROJECT_NAME}" --format '{{.ID}}')
	[ -n "$RUNNING_CONTAINERS" ] && docker compose -f "$COMPOSE_FILE" down --volumes --rmi all
	docker compose -f "$COMPOSE_FILE" up -d
	
	rm -rf /var/share/pkg/rutilvm/engine 
	
	echo "[$(date +'%Y-%m-%d %H:%M:%S')] RutilVM patch completed successfully"
) > "$LOGFILE" 2>&1 &

PATCH_PID=$!
show_spinner "$PATCH_PID"
wait "$PATCH_PID"
echo "RutilVM has been successfully patched."
