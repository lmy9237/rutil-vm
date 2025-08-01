#!/bin/bash

# Last Edit : 20250729-04

# ───────────────────────────────────────────────────────────────────
# 기존 YUM 리포지토리 백업 및 RutilVM 전용 저장소 설정
# ───────────────────────────────────────────────────────────────────
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Change engine repositories]"

if [ -d "/var/share/pkg/repositories" ]; then
    rm -rf "/var/share/pkg/repositories"
fi

mkdir "/var/share/pkg/repositories"
cp -r /var/share/pkg/rutilvm/engine/repositories/* /var/share/pkg/repositories/
mkdir -p /etc/yum.repos.d/backup

if ! ls /etc/yum.repos.d/backup/*.repo 1>/dev/null 2>&1; then
    find /etc/yum.repos.d/ -maxdepth 1 -type f -name "*.repo" -exec mv {} /etc/yum.repos.d/backup/ \;
fi

echo -e "[base]\nname=RutilVM - Base\nbaseurl=file:///var/share/pkg/repositories/\nenabled=1\ngpgcheck=0" > /etc/yum.repos.d/RutiVM.repo
yum clean all 1>/dev/null
echo "[ INFO  ] changed: [localhost]"

# ───────────────────────────────────────────────────────────────────
# 방화벽 포트 오픈 및 SELinux 포트 정책 설정
# - 지정된 포트들을 firewall에 영구 추가 (출력 및 오류 숨김)
# - 8443, 6691 포트를 SELinux http_port_t 타입으로 등록
# - 변경 사항 적용을 위해 firewall reload 수행
# ───────────────────────────────────────────────────────────────────
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Change engine firewall configuration]"

for port in 6690 6691 8080 8443 9990 9999; do
    if ! firewall-cmd --query-port="${port}/tcp" > /dev/null 2>&1; then
        firewall-cmd --permanent --add-port="${port}/tcp" > /dev/null 2>&1;
    fi
done

firewall-cmd --reload >/dev/null 2>&1

# SELinux에 8443 포트 추가
if ! semanage port -l | grep -q "8443/tcp"; then
    semanage port -a -t http_port_t -p tcp 8443 > /dev/null 2>&1;
fi

# SELinux에 6691 포트를 HTTP 포트 타입으로 추가
if ! semanage port -l | grep -q "6691/tcp"; then
    semanage port -a -t http_port_t -p tcp 6691 > /dev/null 2>&1;
fi

echo "[ INFO  ] changed: [localhost]"

# ───────────────────────────────────────────────────────────────────
# oVirt Engine HTTPS 포트 변경 및 SSO 구성 수정
# - Apache SSL 포트를 443 → 8443으로 변경
# - oVirt Engine 설정 파일 수정 (HTTPS 포트 및 SSO 구성 포함)
# - 관련 설정 파일 백업 수행 후 변경
# - httpd 및 ovirt-engine 서비스 재시작으로 적용
# ───────────────────────────────────────────────────────────────────
# SSL 설정 파일 백업
if [ ! -f /etc/httpd/conf.d/ssl.conf.org ]; then
    cp -p /etc/httpd/conf.d/ssl.conf /etc/httpd/conf.d/ssl.conf.org
fi

# Apache SSL 포트 변경 (443에서 8443으로)
if ! grep -q "^Listen 8443 https" /etc/httpd/conf.d/ssl.conf; then
  sed -i 's/^Listen 443 https/Listen 8443 https/' /etc/httpd/conf.d/ssl.conf
  sed -i 's/^<VirtualHost _default_:443/<VirtualHost _default_:8443/' /etc/httpd/conf.d/ssl.conf
fi

# oVirt engine 프로토콜 설정 파일 백업
if [ ! -f /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf.org ]; then
    cp -p /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf.org
fi

# oVirt engine의 HTTPS 포트 변경 (443에서 8443으로)
if ! grep -q "^ENGINE_PROXY_HTTPS_PORT=8443" /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf; then
  # 설정 파일 내에 ENGINE_PROXY_HTTPS_PORT 값이 443이면 8443으로 변경
  sed -i 's/^ENGINE_PROXY_HTTPS_PORT=443/ENGINE_PROXY_HTTPS_PORT=8443/' /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf
fi

# oVirt setup config 파일에서 FQDN 읽어오기
fqdn=$(sed -n 's/^OVESETUP_CONFIG\/fqdn=str://p' /etc/ovirt-engine-setup.conf.d/20-setup-ovirt-post.conf | head -n1)
# /etc/hosts 파일에서 FQDN에 해당하는 IP 주소 추출
ip_address=$(grep -w "$fqdn" /etc/hosts | awk '{print $1}' | head -n1)

# oVirt engine SSO 설정 파일 백업
if [ ! -f /etc/ovirt-engine/engine.conf.d/11-setup-sso.conf.org ]; then
    cp -p /etc/ovirt-engine/engine.conf.d/11-setup-sso.conf /etc/ovirt-engine/engine.conf.d/11-setup-sso.conf.org
fi

# SSO 설정 파일 내 포트 수정 (443에서 8443 변경)
if ! grep -q ":8443/" /etc/ovirt-engine/engine.conf.d/11-setup-sso.conf; then
    sed -i 's/:443\//:8443\//g' /etc/ovirt-engine/engine.conf.d/11-setup-sso.conf
fi

# SSO 설정 파일에 alternate engine FQDN 값을 IP 주소로 설정
sed -i "s/SSO_ALTERNATE_ENGINE_FQDNS=\"\"/SSO_ALTERNATE_ENGINE_FQDNS=\"${ip_address}\"/" /etc/ovirt-engine/engine.conf.d/11-setup-sso.conf

# SSO 설정 중 콜백 경로 접두어 검사를 비활성화하는 설정
echo 'SSO_CALLBACK_PREFIX_CHECK=false' | tee /etc/ovirt-engine/engine.conf.d/99-sso.conf >/dev/null 2>&1

# Apache와 ovirt engine 서비스 재시작
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Restart the httpd daemon]"
systemctl restart httpd >/dev/null 2>&1
echo "[ INFO  ] changed: [localhost]"
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Restart the engine daemon]"
systemctl restart ovirt-engine >/dev/null 2>&1
sleep 10
echo "[ INFO  ] changed: [localhost]"

# ───────────────────────────────────────────────────────────────────
# rutilvm 사용자 생성 및 SSH 디렉토리 초기화
# - rutilvm 계정이 존재하지 않을 경우 생성 (비밀번호, 홈 디렉토리 지정)
# - wheel, kvm, ovirt 그룹에 사용자 추가
# - .ssh 디렉토리 생성 및 권한 설정
# ───────────────────────────────────────────────────────────────────
# 변수 설정 (사용자 비밀번호, 홈 디렉토리, SSH 관련 변수 등)
RUTILVM_USER="rutilvm"
RUTILVM_PASSWORD="adminRoot!@#"
RUTILVM_HOME="/home/$RUTILVM_USER"
RUTILVM_SSH_DIR="$RUTILVM_HOME/.ssh"
RUTILVM_KEY="$RUTILVM_SSH_DIR/id_rsa"
RUTILVM_GROUPNAME="$RUTILVM_USER"

# 시스템에 "rutilvm" 사용자가 존재하지 않으면 생성
if ! id "$RUTILVM_USER" >/dev/null 2>&1; then
    useradd -m -d "$RUTILVM_HOME" "$RUTILVM_USER" &&
    echo "$RUTILVM_USER:$RUTILVM_PASSWORD" | chpasswd &&
    usermod -aG wheel,kvm,ovirt "$RUTILVM_USER"
fi

# rutilvm 사용자의 .ssh 디렉토리 생성 및 권한 설정
mkdir -p "$RUTILVM_SSH_DIR"
chown "$RUTILVM_USER:$RUTILVM_GROUPNAME" "$RUTILVM_SSH_DIR"
chmod 700 "$RUTILVM_SSH_DIR"

# 현재 호스트네임과 /etc/hosts에 기록된 IP 추출
current_hostname=$(hostname)
HOST01_IP=$(awk -v host="$current_hostname" '!/127\.0\.0\.1/ && !/::1/ && $0 !~ host {print $1; exit}' /etc/hosts)

# rutilvm 사용자의 SSH 키가 없으면 생성
if [ ! -f "$RUTILVM_KEY" ]; then
    sudo -u "$RUTILVM_USER" ssh-keygen -t rsa -b 4096 -m PKCS8 -N "" -f "$RUTILVM_KEY" > /dev/null 2>&1
fi

# authorized_keys 파일 생성 및 권한 설정
touch "$RUTILVM_SSH_DIR/authorized_keys"
chown "$RUTILVM_USER:$RUTILVM_GROUPNAME" "$RUTILVM_SSH_DIR/authorized_keys"
chmod 600 "$RUTILVM_SSH_DIR/authorized_keys"

# 공개키를 대상 호스트로 복사하여 비밀번호 없이 로그인 가능하게 설정
sshpass -p "$RUTILVM_PASSWORD" ssh-copy-id -o StrictHostKeyChecking=no -i "$RUTILVM_KEY.pub" "$RUTILVM_USER@$HOST01_IP" > /dev/null 2>&1

# engine이 만든 고유한 공개키를 authorized_keys 에 등록 (스스로 접근)
ENGINE_IP=$(hostname -i)
curl_url="https://${ENGINE_IP}:8443/ovirt-engine/services/pki-resource?resource=engine-certificate&format=OPENSSH-PUBKEY"
if ! curl -k -s -S -X GET "$curl_url" >> "$RUTILVM_SSH_DIR/authorized_keys"; then
    echo "[ ERROR ] Failed to retrieve oVirt engine public key from $curl_url"
fi

# rutilvm 관련 디렉토리 구조 생성
mkdir -p /opt/rutilvm/rutil-vm-api/{certs,logs,tmp}
mkdir -p /opt/rutilvm/rutil-vm/certs

# ───────────────────────────────────────────────────────────────────
# Apache 인증서 Fullchain 생성 및 PKCS#12 Keystore 변환
# ───────────────────────────────────────────────────────────────────
# Apache 서버 인증서와 CA 인증서를 결합하여 fullchain.pem 생성
cat /etc/pki/ovirt-engine/certs/apache.cer /etc/pki/ovirt-engine/apache-ca.pem > /opt/rutilvm/rutil-vm/certs/fullchain.pem

# OpenSSL을 이용해 keystore.p12 파일 생성 (API 서버용)
openssl pkcs12 -export \
-in /opt/rutilvm/rutil-vm/certs/fullchain.pem \
-inkey /etc/pki/ovirt-engine/keys/apache.key.nopass \
-out /opt/rutilvm/rutil-vm-api/certs/keystore.p12 \
-name rutil-vm-api \
-passout pass:rutil-vm-api

# ───────────────────────────────────────────────────────────────────
# PostgreSQL 사용자 및 테이블 생성 (rutil 역할 및 refresh_token 테이블)
# - rutil 역할 생성 및 권한 설정 (SUPERUSER, CREATEDB, CREATEROLE 등)
# - ovirt_engine_history 및 engine DB에 명령 실행
# - engine DB에 aaa_jdbc.refresh_token 테이블 생성 (존재하지 않을 경우만)
# ───────────────────────────────────────────────────────────────────
cd /tmp
sudo -u postgres psql -d ovirt_engine_history -c "CREATE ROLE rutil WITH LOGIN ENCRYPTED PASSWORD 'rutil1!';"  > /dev/null 2>&1;
sudo -u postgres psql -c "ALTER ROLE rutil WITH LOGIN SUPERUSER CREATEDB CREATEROLE INHERIT;"  > /dev/null 2>&1;
sudo -u postgres psql -d engine -c "CREATE TABLE IF NOT EXISTS aaa_jdbc.refresh_token (uuid UUID PRIMARY KEY NOT NULL, external_id VARCHAR(512) NOT NULL, refresh_token VARCHAR(200) NOT NULL);"  > /dev/null 2>&1;

# engine 사용자(또는 백업 시 사용하는 DB 사용자)가 aaa_jdbc.refresh_token 테이블에 접근 권한
sudo -u postgres psql -d engine -c "GRANT SELECT ON aaa_jdbc.refresh_token TO engine;"  > /dev/null 2>&1;
sudo -u postgres psql -d engine -c "GRANT USAGE ON SCHEMA aaa_jdbc TO engine;"  > /dev/null 2>&1;
sudo -u postgres psql -d engine -c "GRANT SELECT ON ALL TABLES IN SCHEMA aaa_jdbc TO engine;"  > /dev/null 2>&1;

# ───────────────────────────────────────────────────────────────────
# oVirt Engine 도커 환경 설정 및 이미지 배포 자동화
# - ENGINE_FQDN 및 IP 추출 후 docker-compose.yml 파일 변수 치환
# - SSO 키 삽입 및 임시 파일 생성 후 compose 파일 덮어쓰기
# - 로컬 RPM 설치 및 Docker 서비스 시작
# - 도커 이미지(api, web, wsproxy) 로드
# - docker-compose 소프트링크 설정 및 컨테이너 재생성 수행
# ───────────────────────────────────────────────────────────────────
# 사용할 docker-compose.yml 경로
COMPOSE_FILE="/var/share/pkg/rutilvm/engine/containers/docker-compose.yml"

# 기존의 컴포즈 파일이 있다면 삭제하여 새로 생성
if [ -f "$COMPOSE_FILE" ]; then
  rm -f "$COMPOSE_FILE"
fi

# 도커 컴포즈 파일 생성
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
      __RUTIL_VM_WATERMARK_TEXT__: v4.0.0-3
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
    restart: always # undefined으로 인자가 갈 때 죽음

networks:
  ovirt_network:
    driver: bridge
COMPOSE_FILE_EOF

# ENGINE_FQDN 값을 oVirt engine 설정 파일에서 추출
ENGINE_FQDN=$(grep '^ENGINE_FQDN=' /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf | cut -d'=' -f2)
# /etc/hosts 파일에서 ENGINE_FQDN에 대응하는 IP 주소 추출
ENGINE_IP=$(awk -v fqdn="$ENGINE_FQDN" '$0 !~ /^#/ && fqdn && index($0, fqdn) {print $1; exit}' /etc/hosts)

# 도커 컴포즈 파일이 존재하는지 확인
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "[ ERROR ] Could not find file $COMPOSE_FILE."
  echo "Deployment failed. Exiting."
  exit 1
fi

# 도커 컴포즈 파일 내에 ENGINE_IP와 ENGINE_FQDN placeholder 대체
sed -i "s/ENGINE_IP/$ENGINE_IP/g" "$COMPOSE_FILE"
sed -i "s/ENGINE_FQDN/$ENGINE_FQDN/g" "$COMPOSE_FILE"

# 임시 파일 생성 (도커 컴포즈 파일을 수정하기 위한 임시파일)
TMP_FILE=$(mktemp)

# 도커 컴포즈 파일의 각 줄을 읽어 OVIRT_ENGINE_PRIVATE_KEY가 있는 줄은 engine_id_rsa 파일 내용으로 대체
while IFS= read -r line; do
  if [[ "$line" == *"OVIRT_ENGINE_PRIVATE_KEY"* ]]; then
    sed 's/^/        /' /etc/pki/ovirt-engine/keys/engine_id_rsa >> "$TMP_FILE"
  else
    echo "$line" >> "$TMP_FILE"
  fi
done < "$COMPOSE_FILE"

# 수정된 임시 파일을 원본 도커 컴포즈 파일로 덮어쓰기
mv "$TMP_FILE" "$COMPOSE_FILE"

# 로컬 저장소의 rpm 패키지들을 설치
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Start configuring the engine image]"
if yum -y localinstall /var/share/pkg/repositories/*.rpm >/dev/null 2>&1; then
    echo "[ INFO  ] ok: [localhost]"
else
    echo "[ ERROR ] Failed to install RPMs from /var/share/pkg/repositories/"
fi

# docker 서비스를 활성화하고 시작
systemctl enable docker >/dev/null 2>&1
systemctl start docker >/dev/null 2>&1

# Docker 시작 후 안정성을 위해 5초 대기
sleep 5s

# Docker 데몬 상태 확인
status=$(systemctl is-active docker)
if [ "$status" != "active" ]; then
    echo "[WARNING] Docker daemon status: failed. Installation will be stopped."
    # 현재 스크립트의 자식 프로세스를 종료한 후 스크립트 종료
    pkill -P $$
    exit 1
fi

# Docker 이미지를 로드 (각 이미지 로드 후 상태 메시지 출력)
docker load -i /var/share/pkg/rutilvm/engine/containers/api.tar >/dev/null 2>&1
echo "[ INFO  ] ok: [localhost -> rutil-vm-api]"

docker load -i /var/share/pkg/rutilvm/engine/containers/web.tar >/dev/null 2>&1
#docker tag rutil-vm:0.3.5 rutil-vm:latest;
echo "[ INFO  ] ok: [localhost -> rutil-vm]"

docker load -i /var/share/pkg/rutilvm/engine/containers/wsproxy.tar >/dev/null 2>&1
#docker tag rutil-vm-wsproxy:0.3.2 rutil-vm-wsproxy:latest;
echo "[ INFO  ] ok: [localhost -> rutil-vm-wsproxy]"

echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Start image creation]"

# /tmp 파티션의 exec 옵션 재설정
mount /tmp -o remount,exec

# docker-compose 소프트 링크 생성
if [ -e /usr/bin/docker-compose ]; then
    rm -f /usr/bin/docker-compose
fi
ln -s /usr/libexec/docker/cli-plugins/docker-compose /usr/bin/docker-compose

# compose 프로젝트 이름 추출 (디렉토리 기준 자동 추정)
PROJECT_NAME=$(basename "$(dirname "$COMPOSE_FILE")")

# 실행 중이거나 생성된 컨테이너 목록 추출
RUNNING_CONTAINERS=$(docker ps -a --filter "label=com.docker.compose.project=${PROJECT_NAME}" --format '{{.ID}}')

if [ -n "$RUNNING_CONTAINERS" ]; then
    # 관련 컨테이너가 존재할 경우에만 down 수행
    docker compose -f "$COMPOSE_FILE" down --volumes --rmi all > /dev/null 2>&1
fi

# 컨테이너 생성
docker compose --file=/var/share/pkg/rutilvm/engine/containers/docker-compose.yml up -d > /dev/null 2>&1
echo "[ INFO  ] ok: [localhost]"

# ───────────────────────────────────────────────────────────────────
# PostgreSQL 클라이언트 인증 설정 (pg_hba.conf 수정)
# - 기존 pg_hba.conf 백업 후 덮어쓰기 방식으로 재구성
# - md5 인증 방식으로 클라이언트 접속 허용
# - 파일 권한 및 소유자 재설정 후 PostgreSQL 서비스 재시작
# ───────────────────────────────────────────────────────────────────
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Configure client authentication]"
# pg_hba.conf 파일을 백업 후 덮어쓰기로 복사하여 클라이언트 인증 방식 수정
if [ ! -f /var/lib/pgsql/data/pg_hba.conf.org ]; then
    cp -p /var/lib/pgsql/data/pg_hba.conf /var/lib/pgsql/data/pg_hba.conf.org
fi

# pg_hba.conf 파일 생성 및 내용 입력
cat << 'pg_hba_EOF' > /var/lib/pgsql/data/pg_hba.conf
# PostgreSQL Client Authentication Configuration File
# ===================================================
#
# Refer to the "Client Authentication" section in the PostgreSQL
# documentation for a complete description of this file.  A short
# synopsis follows.
#
# This file controls: which hosts are allowed to connect, how clients
# are authenticated, which PostgreSQL user names they can use, which
# databases they can access.  Records take one of these forms:
#
# local      DATABASE  USER  METHOD  [OPTIONS]
# host       DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
# hostssl    DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
# hostnossl  DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
#
# (The uppercase items must be replaced by actual values.)
#
# The first field is the connection type: "local" is a Unix-domain
# socket, "host" is either a plain or SSL-encrypted TCP/IP socket,
# "hostssl" is an SSL-encrypted TCP/IP socket, and "hostnossl" is a
# plain TCP/IP socket.
#
# DATABASE can be "all", "sameuser", "samerole", "replication", a
# database name, or a comma-separated list thereof. The "all"
# keyword does not match "replication". Access to replication
# must be enabled in a separate record (see example below).
#
# USER can be "all", a user name, a group name prefixed with "+", or a
# comma-separated list thereof.  In both the DATABASE and USER fields
# you can also write a file name prefixed with "@" to include names
# from a separate file.
#
# ADDRESS specifies the set of hosts the record matches.  It can be a
# host name, or it is made up of an IP address and a CIDR mask that is
# an integer (between 0 and 32 (IPv4) or 128 (IPv6) inclusive) that
# specifies the number of significant bits in the mask.  A host name
# that starts with a dot (.) matches a suffix of the actual host name.
# Alternatively, you can write an IP address and netmask in separate
# columns to specify the set of hosts.  Instead of a CIDR-address, you
# can write "samehost" to match any of the server's own IP addresses,
# or "samenet" to match any address in any subnet that the server is
# directly connected to.
#
# METHOD can be "trust", "reject", "md5", "password", "gss", "sspi",
# "ident", "peer", "pam", "ldap", "radius" or "cert".  Note that
# "password" sends passwords in clear text; "md5" is preferred since
# it sends encrypted passwords.
#
# OPTIONS are a set of options for the authentication in the format
# NAME=VALUE.  The available options depend on the different
# authentication methods -- refer to the "Client Authentication"
# section in the documentation for a list of which options are
# available for which authentication methods.
#
# Database and user names containing spaces, commas, quotes and other
# special characters must be quoted.  Quoting one of the keywords
# "all", "sameuser", "samerole" or "replication" makes the name lose
# its special character, and just match a database or username with
# that name.
#
# This file is read on server startup and when the postmaster receives
# a SIGHUP signal.  If you edit the file on a running system, you have
# to SIGHUP the postmaster for the changes to take effect.  You can
# use "pg_ctl reload" to do that.

# Put your actual configuration here
# ----------------------------------
#
# If you want to allow non-local connections, you need to add more
# "host" records.  In that case you will also need to make PostgreSQL
# listen on a non-local interface via the listen_addresses
# configuration parameter, or via the -i or -h command line switches.



# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
host    ovirt_engine_history ovirt_engine_history 0.0.0.0/0               md5
host    ovirt_engine_history ovirt_engine_history ::0/0                   md5
host    engine          engine          0.0.0.0/0               md5
host    engine          engine          ::0/0                   md5
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
#local   replication     postgres                                peer
#host    replication     postgres        127.0.0.1/32            ident
#host    replication     postgres        ::1/128                 ident
host     all             all             0.0.0.0/0               md5
pg_hba_EOF

chmod 600 /var/lib/pgsql/data/pg_hba.conf
chown postgres:postgres /var/lib/pgsql/data/pg_hba.conf

systemctl restart postgresql
echo "[ INFO  ] ok: [localhost]"

# ───────────────────────────────────────────────────────────────────
# oVirt 엔진 접속 시 루트(/)로 접근하면 자동으로 https://<IP>:8443/ 으로 리디렉션되도록 설정
# ───────────────────────────────────────────────────────────────────
redirect_conf="/etc/httpd/conf.d/ovirt-engine-root-redirect.conf"
IP4=$(/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1)
sed -i '/^.*\/ovirt-engine/s/^/#/g' $redirect_conf
echo "RedirectMatch ^/$ https://$IP4:8443" >> $redirect_conf

# ───────────────────────────────────────────────────────────────────
# oVirt Engine SSL 접근 설정 (/ovirt-engine 경로에 대한 접근 제어 설정)
# ───────────────────────────────────────────────────────────────────
#ssl_conf="/etc/httpd/conf.d/ssl.conf"
#sed -i 's/<\/VirtualHost>//g' $ssl_conf
#echo '#<Location "/ovirt-engine">' >> $ssl_conf
#echo "#    Order mutual-failure"   >> $ssl_conf
#echo "#    Allow from $IP4" >> $ssl_conf
#echo "#</Location>" >> $ssl_conf
#echo "</VirtualHost>" >> $ssl_conf
#systemctl restart httpd >/dev/null 2>&1

# ───────────────────────────────────────────────────────────────────
# oVirt Cockpit UI -> RutilVM으로 변경
# ───────────────────────────────────────────────────────────────────
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Cockpit UI settings]"
brand_path="/var/share/pkg/rutilvm/engine/branding"
ovirt_engine_brands="/usr/share/ovirt-engine/brands/ovirt.brand"
ovirt_web_ui_branding="/usr/share/ovirt-web-ui/branding/images"

# ovirt_engine_brands의 images 디렉토리로 복사할 파일들
yes | cp -p "$brand_path/favicon.ico" "$ovirt_engine_brands/images"
yes | cp -p "$brand_path/ovirt_logo.png" "$ovirt_engine_brands/images/"
yes | cp -p "$brand_path/ovirt_masthead_logo.png" "$ovirt_engine_brands/images/"
yes | cp -p "$brand_path/ovirt_middle_logo.png" "$ovirt_engine_brands/images/"
yes | cp -p "$brand_path/ovirt_masthead_bg.png" "$ovirt_engine_brands/images/"

# ovirt_engine_brands 기본 디렉토리로 복사할 파일들
yes | cp -p "$brand_path/favicon-16x16.png" "$ovirt_engine_brands"
yes | cp -p "$brand_path/favicon-32x32.png" "$ovirt_engine_brands"
yes | cp -p "$brand_path/common.css" "$ovirt_engine_brands"
yes | cp -p "$brand_path/external_resources.properties" "$ovirt_engine_brands"
yes | cp -p "$brand_path/welcome_page.template" "$ovirt_engine_brands"
yes | cp -p "$brand_path/messages.properties" "$ovirt_engine_brands"
yes | cp -p "$brand_path/messages_ko_KR.properties" "$ovirt_engine_brands"

# ovirt_web_ui_branding 디렉토리로 복사할 파일들
yes | cp -p "$brand_path/favicon.ico" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/favicon-16x16.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/favicon-32x32.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/ovirt_logo.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/ovirt_masthead_logo.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/ovirt_middle_logo.png" "$ovirt_web_ui_branding"

# ovirt_engine_brands 내 하위 디렉토리(bundled/patternfly-next/)로 patternfly-no-reset.css 파일 복사
yes | cp -p "$brand_path/patternfly-no-reset.css" "$ovirt_engine_brands/bundled/patternfly-next/"

systemctl restart httpd >/dev/null 2>&1
systemctl restart ovirt-engine >/dev/null 2>&1
echo "[ INFO  ] ok: [localhost]"

# ───────────────────────────────────────────────────────────────────
# NTP 서버 설정 함수
# ───────────────────────────────────────────────────────────────────
set +e   # 이 스크립트 안에서는 에러가 있어도 종료되지 않도록 설정
default_ntp="203.248.240.140"
chrony_config="/etc/chrony.conf"
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Start NTP configuration]"
if [ ! -f "${chrony_config}.org" ]; then
    cp "$chrony_config" "${chrony_config}.org"
fi
sed -i '/^server /d' "$chrony_config"
sed -i '/^pool.*iburst/s/^/#/' "$chrony_config"
sed -i '/^#log measurements statistics tracking/a server '"$default_ntp"' iburst' "$chrony_config"
systemctl restart chronyd >/dev/null 2>&1 || echo "[WARNING] chronyd restart failed, continuing..."
chronyc -a makestep >/dev/null 2>&1
timedatectl set-timezone Asia/Seoul >/dev/null 2>&1
set -e   # 다시 에러 발생 시 종료하도록 복원
echo "[ INFO  ] ok: [localhost]"

# ───────────────────────────────────────────────────────────────────
# 엔진 백업 실행
# ───────────────────────────────────────────────────────────────────
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Start engine configuration backup]"
export LANG=C
DATE="$(/bin/date +'%Y%m%d%H%M')"
engine-backup --scope=all --mode=backup --file=/etc/ovirt-engine/engine-backup_$DATE.tar --log=/var/log/engine-backup_$DATE.log >/dev/null 2>&1
echo "[ INFO  ] ok: [localhost]"

# ───────────────────────────────────────────────────────────────────
# 셸 히스토리 출력 포맷, 히스토리 크기, 파일 크기 및 히스토리 파일의 변경을 방지하는 설정을 추가
# ───────────────────────────────────────────────────────────────────
if ! grep -q 'export HISTTIMEFORMAT="[%F %T] "' /etc/profile; then
    echo 'export HISTTIMEFORMAT="[%F %T] "' >> /etc/profile
fi
if ! grep -q 'export HISTSIZE=10000' /etc/profile; then
    echo 'export HISTSIZE=10000' >> /etc/profile
fi
if ! grep -q 'export HISTFILESIZE=10000' /etc/profile; then
    echo 'export HISTFILESIZE=10000' >> /etc/profile
fi
if ! grep -q 'readonly HISTFILE' /etc/profile; then
    echo 'readonly HISTFILE' >> /etc/profile
fi

# ───────────────────────────────────────────────────────────────────
# 설치관련 불필요 파일 삭제
# ───────────────────────────────────────────────────────────────────
[ -f "/root/anaconda-ks.cfg" ] && rm -f "/root/anaconda-ks.cfg"
[ -f "/root/original-ks.cfg" ] && rm -f "/root/original-ks.cfg"

# ───────────────────────────────────────────────────────────────────
# SSH DNS 미사용
# ───────────────────────────────────────────────────────────────────
if grep -q '^UseDNS yes' /etc/ssh/sshd_config; then
  sed -i 's/^UseDNS yes/UseDNS no/' /etc/ssh/sshd_config
  systemctl restart sshd
fi
