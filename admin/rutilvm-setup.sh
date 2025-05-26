#!/bin/bash
# 
# Last Edit : 20250529-01 (공개키 추가)

echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Change engine repositories]"

# /var/share/pkg/repositories 디렉토리가 존재하면 삭제 후 생성
if [ -d "/var/share/pkg/repositories" ]; then
    rm -rf "/var/share/pkg/repositories"
fi
mkdir "/var/share/pkg/repositories"

# 기존 엔진 저장소의 파일을 대상 디렉토리로 복사
cp -r /var/share/pkg/rutilvm/engine/repositories/* /var/share/pkg/repositories/

# yum 저장소 리포지토리 백업을 위한 디렉토리 생성 (없을 경우)
mkdir -p /etc/yum.repos.d/backup

# 기존 *.repo 파일들을 백업 폴더로 이동
if ls /etc/yum.repos.d/backup/*.repo 1>/dev/null 2>&1; then
    :
else
    find /etc/yum.repos.d/ -maxdepth 1 -type f -name "*.repo" -exec mv {} /etc/yum.repos.d/backup/ \;
fi

# 새로운 RutilVM 저장소 파일 작성
echo -e "[base]\nname=RutilVM - Base\nbaseurl=file:///var/share/pkg/repositories/\nenabled=1\ngpgcheck=0" > /etc/yum.repos.d/RutiVM.repo

# yum 캐시를 정리
yum clean all 1>/dev/null

echo "[ INFO  ] changed: [localhost]"

echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Change engine firewall configuration]"

# 포트를 방화벽에 영구적으로 오픈 (출력 및 오류 메시지는 숨김)
for port in 6690 6691 8080 8443 9990 9999; do
    if ! firewall-cmd --query-port="${port}/tcp" > /dev/null 2>&1; then
        firewall-cmd --permanent --add-port="${port}/tcp" > /dev/null 2>&1;
    fi
done

# SELinux에 다시 8443 포트를 추가
if ! semanage port -l | grep -q "8443/tcp"; then
    semanage port -a -t http_port_t -p tcp 8443 > /dev/null 2>&1;
fi

firewall-cmd --reload >/dev/null 2>&1

# SELinux에 6691 포트를 HTTP 포트 타입으로 추가
if ! semanage port -l | grep -q "6691/tcp"; then
    semanage port -a -t http_port_t -p tcp 6691 > /dev/null 2>&1;
fi

echo "[ INFO  ] changed: [localhost]"

# SSL 설정 파일 백업
if [ ! -f /etc/httpd/conf.d/ssl.conf.org ]; then
    # 기존 ssl.conf 파일이 백업본이 없을 때 원본을 백업 (파일 속성 유지)
    cp -p /etc/httpd/conf.d/ssl.conf /etc/httpd/conf.d/ssl.conf.org
fi

# Apache SSL 포트 변경 (443에서 8443으로)
if ! grep -q "^Listen 8443 https" /etc/httpd/conf.d/ssl.conf; then
  # ssl.conf 파일 내 Listen 443 https 라인을 Listen 8443 https로 변경
  sed -i 's/^Listen 443 https/Listen 8443 https/' /etc/httpd/conf.d/ssl.conf
  sed -i 's/^<VirtualHost _default_:443/<VirtualHost _default_:8443/' /etc/httpd/conf.d/ssl.conf
fi

# oVirt engine 프로토콜 설정 파일 백업
if [ ! -f /etc/ovirt-engine/engine.conf.d/10-setup-protocols.conf.org ]; then
    # 기존 10-setup-protocols.conf 백업본이 없을 때 백업 생성
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
echo 'SSO_CALLBACK_PREFIX_CHECK=false' | tee /etc/ovirt-engine/engine.conf.d/99-sso.conf

# Apache와 ovirt engine 서비스 재시작
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Restart the httpd daemon]"
systemctl restart httpd >/dev/null 2>&1
echo "[ INFO  ] changed: [localhost]"
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Restart the engine daemon]"
systemctl restart ovirt-engine >/dev/null 2>&1
echo "[ INFO  ] changed: [localhost]"

# 시스템에 "rutilvm" 사용자가 존재하지 않으면 생성
if ! id "rutilvm" >/dev/null 2>&1; then
    # 홈 디렉토리 지정 및 사용자 생성, 비밀번호 설정, wheel, kvm, ovirt 그룹에 추가
    useradd -m -d /home/rutilvm rutilvm &&
    echo "rutilvm:adminRoot!@#" | chpasswd &&
    usermod -aG wheel,kvm,ovirt rutilvm
fi

# rutilvm 사용자의 .ssh 디렉토리 생성 및 권한 설정
mkdir -p /home/rutilvm/.ssh
chown rutilvm:rutilvm /home/rutilvm/.ssh
chmod 600 /home/rutilvm/.ssh

# 현재 호스트네임과 /etc/hosts에 기록된 IP 추출
current_hostname=$(hostname)
HOST01_IP=$(awk -v host="$current_hostname" '!/127\.0\.0\.1/ && !/::1/ && $0 !~ host {print $1; exit}' /etc/hosts)

# 변수 설정 (사용자 비밀번호, 홈 디렉토리, SSH 관련 변수 등)
RUTILVM_PASSWORD="adminRoot!@#"
RUTILVM_HOME="/home/rutilvm"
RUTILVM_SSH_DIR="$RUTILVM_HOME/.ssh"
RUTILVM_KEY="$RUTILVM_SSH_DIR/id_rsa"
RUTILVM_USER="rutilvm"

# rutilvm 사용자의 SSH 키가 없으면 생성
if [ ! -f "$RUTILVM_KEY" ]; then
    sudo -u "$RUTILVM_USER" mkdir -p "$RUTILVM_SSH_DIR"
    sudo -u "$RUTILVM_USER" chmod 700 "$RUTILVM_SSH_DIR"
    # 비밀번호 없이 RSA 키 생성
    sudo -u "$RUTILVM_USER" ssh-keygen -t rsa -b 4096 -m PKCS8 -N "" -f "$RUTILVM_KEY"
fi

curl -k -X GET "https://$(hostname -i):8443/ovirt-engine/services/pki-resource?resource=engine-certificate&format=OPENSSH-PUBKEY" >> $RUTILVM_SSH_DIR/authorized_keys

# sshpass를 이용하여 SSH 공개키를 대상 호스트(자신의 호스트)로 복사하여 비밀번호 없이 로그인 가능하게 설정
sshpass -p "$RUTILVM_PASSWORD" ssh-copy-id -o StrictHostKeyChecking=no -i "$RUTILVM_KEY.pub" "$RUTILVM_USER@$HOST01_IP"

# rutilvm 관련 디렉토리 구조 생성
mkdir -p /opt/rutilvm
mkdir -p /opt/rutilvm/rutil-vm-api
mkdir -p /opt/rutilvm/rutil-vm-api/certs
mkdir -p /opt/rutilvm/rutil-vm-api/logs
mkdir -p /opt/rutilvm/rutil-vm-api/tmp
mkdir -p /opt/rutilvm/rutil-vm
mkdir -p /opt/rutilvm/rutil-vm/certs

# Apache 인증서와 CA 인증서를 합쳐서 fullchain 인증서 생성
cat /etc/pki/ovirt-engine/certs/apache.cer /etc/pki/ovirt-engine/apache-ca.pem > /opt/rutilvm/rutil-vm/certs/fullchain.pem

# OpenSSL 명령어를 사용하여 PKCS#12 형식의 keystore.p12 생성
openssl pkcs12 -export \
-in /opt/rutilvm/rutil-vm/certs/fullchain.pem \
-inkey /etc/pki/ovirt-engine/keys/apache.key.nopass \
-out /opt/rutilvm/rutil-vm-api/certs/keystore.p12 \
-name rutil-vm-api \
-passout pass:rutil-vm-api

# PostgreSQL 데이터베이스에 rutil 역할을 생성 및 설정
cd /tmp
sudo -u postgres psql -d ovirt_engine_history -c "CREATE ROLE rutil WITH LOGIN ENCRYPTED PASSWORD 'rutil1!';"  > /dev/null 2>&1;
sudo -u postgres psql -c "ALTER ROLE rutil WITH LOGIN SUPERUSER CREATEDB CREATEROLE INHERIT;"  > /dev/null 2>&1;
sudo -u postgres psql -d engine -c "CREATE TABLE IF NOT EXISTS aaa_jdbc.refresh_token (uuid UUID PRIMARY KEY NOT NULL, external_id VARCHAR(512) NOT NULL, refresh_token VARCHAR(200) NOT NULL);"  > /dev/null 2>&1;

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
    restart: unless-stopped

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
    volumes:
      - /opt/rutilvm/rutil-vm/certs/fullchain.pem:/etc/nginx/certs/fullchain.pem:ro
      - /etc/pki/ovirt-engine/keys:/etc/pki/ovirt-engine/keys:ro
    networks:
      - ovirt_network
    restart: unless-stopped
    
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
      - /opt/rutilvm/rutil-vm/certs/fullchain.pem:/home/node/fullchain.pem:ro
    networks:
      - ovirt_network
    restart: unless-stopped

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
  echo "[ ERROR ] Deployment failed. Exiting."
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
    # engine_id_rsa 파일 내용을 들여쓰기를 붙여서 추가
    sed 's/^/        /' /etc/pki/ovirt-engine/keys/engine_id_rsa >> "$TMP_FILE"
  else
    echo "$line" >> "$TMP_FILE"
  fi
done < "$COMPOSE_FILE"

# 수정된 임시 파일을 원본 도커 컴포즈 파일로 덮어쓰기
mv "$TMP_FILE" "$COMPOSE_FILE"

# 로컬 저장소의 rpm 패키지들을 설치
echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Start configuring the engine image]"
sudo -u "$RUTILVM_USER" yum -y localinstall /var/share/pkg/repositories/*.rpm >/dev/null 2>&1
echo "[ INFO  ] ok: [localhost]"

# docker 서비스를 활성화하고 시작
sudo -u "$RUTILVM_USER" systemctl enable docker >/dev/null 2>&1
sudo -u "$RUTILVM_USER" systemctl start docker >/dev/null 2>&1

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
echo "[ INFO  ] ok: [localhost -> rutil-vm]"

docker load -i /var/share/pkg/rutilvm/engine/containers/wsproxy.tar >/dev/null 2>&1
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

# 파일 실행 권한/소유권 변경
chmod 600 /var/lib/pgsql/data/pg_hba.conf
chown postgres:postgres /var/lib/pgsql/data/pg_hba.conf

# PostgreSQL 서비스를 재시작하여 변경사항 적용
systemctl restart postgresql
echo "[ INFO  ] ok: [localhost]"

echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Cockpit UI settings]"
# 브랜딩 파일들이 위치한 경로와 복사 대상 경로 변수 선언
brand_path="/var/share/pkg/rutilvm/engine/branding"
ovirt_engine_brands="/usr/share/ovirt-engine/brands/ovirt.brand"
ovirt_web_ui_branding="/usr/share/ovirt-web-ui/branding/images"

# ovirt_engine_brands의 images 폴더로 복사할 파일들
yes | cp -p "$brand_path/favicon.ico" "$ovirt_engine_brands/images"
yes | cp -p "$brand_path/ovirt_logo.png" "$ovirt_engine_brands/images/"
yes | cp -p "$brand_path/ovirt_masthead_logo.png" "$ovirt_engine_brands/images/"
yes | cp -p "$brand_path/ovirt_middle_logo.png" "$ovirt_engine_brands/images/"
yes | cp -p "$brand_path/ovirt_masthead_bg.png" "$ovirt_engine_brands/images/"

# ovirt_engine_brands 기본 폴더로 복사할 파일들
yes | cp -p "$brand_path/favicon-16x16.png" "$ovirt_engine_brands"
yes | cp -p "$brand_path/favicon-32x32.png" "$ovirt_engine_brands"
yes | cp -p "$brand_path/common.css" "$ovirt_engine_brands"
yes | cp -p "$brand_path/external_resources.properties" "$ovirt_engine_brands"
yes | cp -p "$brand_path/welcome_page.template" "$ovirt_engine_brands"
yes | cp -p "$brand_path/messages.properties" "$ovirt_engine_brands"
yes | cp -p "$brand_path/messages_ko_KR.properties" "$ovirt_engine_brands"

# ovirt_web_ui_branding 폴더로 복사할 파일들
yes | cp -p "$brand_path/favicon.ico" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/favicon-16x16.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/favicon-32x32.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/ovirt_logo.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/ovirt_masthead_logo.png" "$ovirt_web_ui_branding"
yes | cp -p "$brand_path/ovirt_middle_logo.png" "$ovirt_web_ui_branding"

# ovirt_engine_brands 내 하위 디렉토리(bundled/patternfly-next/)로 patternfly-no-reset.css 파일 복사
yes | cp -p "$brand_path/patternfly-no-reset.css" "$ovirt_engine_brands/bundled/patternfly-next/"

echo "[ INFO  ] ok: [localhost]"

#redirect_conf="/etc/httpd/conf.d/ovirt-engine-root-redirect.conf"
#IP4=$(/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1)
#sed -i '/^.*\/ovirt-engine/s/^/#/g' $redirect_conf
#echo "RedirectMatch ^/$ https://$IP4:8443" >> $redirect_conf

#ssl_conf="/etc/httpd/conf.d/ssl.conf"
#sed -i 's/<\/VirtualHost>//g' $ssl_conf
#echo '#<Location "/ovirt-engine">' >> $ssl_conf
#echo "#    Order mutual-failure"   >> $ssl_conf
#echo "#    Allow from $IP4" >> $ssl_conf
#echo "#</Location>" >> $ssl_conf
#echo "</VirtualHost>" >> $ssl_conf
#systemctl restart httpd >/dev/null 2>&1

echo "[ INFO  ] TASK [rutilvm.hosted_engine_setup : Start engine configuration backup]"
# LANG 환경변수를 C로 설정하여 날짜 형식 등 locale 문제 방지
export LANG=C
# 현재 날짜와 시간을 포맷하여 백업 파일 이름에 사용
DATE="$(/bin/date +'%Y%m%d%H%M')"
# 엔진 백업 실행: 전체 백업 범위, 백업 모드, 백업 파일과 로그파일의 저장 경로 지정
engine-backup --scope=all --mode=backup --file=/etc/ovirt-engine/engine-backup_$DATE.tar --log=/var/log/engine-backup_$DATE.log >/dev/null 2>&1

# 셸 히스토리 출력 포맷, 히스토리 크기, 파일 크기 및 히스토리 파일의 변경을 방지하는 설정을 추가
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

# 설치관련 불필요 파일 존재 시 삭제
[ -f "/root/anaconda-ks.cfg" ] && rm -f "/root/anaconda-ks.cfg"
[ -f "/root/original-ks.cfg" ] && rm -f "/root/original-ks.cfg"

# SSH DNS 미사용
if grep -q '^UseDNS yes' /etc/ssh/sshd_config; then
  sed -i 's/^UseDNS yes/UseDNS no/' /etc/ssh/sshd_config
  systemctl restart sshd
fi
