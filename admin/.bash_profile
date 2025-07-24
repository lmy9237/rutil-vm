#!/bin/bash

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
  . ~/.bashrc
fi
PATH=$PATH:$HOME/bin
export PATH

export DOCKER_COMPOSE_FILENAME=deploy-rutilvm.yaml
export RUTIL_VM_HOME=/opt/rutilvm

# User specific environment and startup programs
export DOCKER_REGISTRY_HOME=ititinfo.synology.me:50951/ititcloud
# export DOCKER_IMG_RUTIL_VM_API=$DOCKER_REGISTRY_HOME/ititcloud/rutil-vm-api
export DOCKER_IMG_RUTIL_VM_API=rutil-vm-api
export DOCKER_IMG_RUTIL_VM_API_VERSION=4.0.0
export DOCKER_IMG_RUTIL_VM_API_BUILD_NO=1
export DOCKER_IMG_RUTIL_VM_API_CURRENT=$DOCKER_IMG_RUTIL_VM_API:$DOCKER_IMG_RUTIL_VM_API_VERSION-$DOCKER_IMG_RUTIL_VM_API_BUILD_NO
export DOCKER_IMG_RUTIL_VM_API_LATEST=$DOCKER_IMG_RUTIL_VM_API:latest

# export DOCKER_IMG_RUTIL_VM=$DOCKER_REGISTRY_HOME/ititcloud/rutil-vm
export DOCKER_IMG_RUTIL_VM=rutil-vm
export DOCKER_IMG_RUTIL_VM_CURRENT=$DOCKER_IMG_RUTIL_VM:$DOCKER_IMG_RUTIL_VM_API_VERSION-$DOCKER_IMG_RUTIL_VM_API_BUILD_NO
export DOCKER_IMG_RUTIL_VM_LATEST=$DOCKER_IMG_RUTIL_VM:latest

# export DOCKER_IMG_RUTIL_VM_WSPROXY=$DOCKER_REGISTRY_HOME/ititcloud/rutil-vm-wsproxy
export DOCKER_IMG_RUTIL_VM_WSPROXY=rutil-vm-wsproxy
export DOCKER_IMG_RUTIL_VM_WSPROXY_CURRENT=$DOCKER_IMG_RUTIL_VM_WSPROXY:$DOCKER_IMG_RUTIL_VM_API_VERSION-$DOCKER_IMG_RUTIL_VM_API_BUILD_NO
export DOCKER_IMG_RUTIL_VM_WSPROXY_LATEST=$DOCKER_IMG_RUTIL_VM_WSPROXY:latest

# Engine
export OVIRT_ENGINE_PKI=/etc/pki/ovirt-engine/keys/engine_id_rsa
export OVIRT_ENGINE_PUB="ovirt-engine/services/pki-resource?resource=engine-certificate&format=OPENSSH-PUBKEY"
export OVIRT_ENGINE_LOG=/var/log/ovirt-engine/engine.log
export OVIRT_ENGINE_LOG_CONFIG=/usr/share/ovirt-engine/services/ovirt-engine/ovirt-engine.xml.in

function rutilvm() {
  vi $RUTIL_VM_HOME/.bash_profile
}
function setrutilvm() {
  cp $RUTIL_VM_HOME/.bash_profile ~/.bash_profile;
  source ~/.bash_profile;
}

function dp() { docker ps -a; }               # 상태 조회
function dl() { docker logs -f $1; }          # 로그 보기
function dx() { docker exec -it $1 /bin/sh; } # 내부 접속
function di() { docker images; }              # 이미지 목록
function drmi() { docker rmi $1; }            # 이미지 제거

function drmb() { docker rm -f rutil-vm-api; }                            # 강제중지: 백엔드only
function drmf() { docker rm -f rutil-vm; }                                # 강제중지: 프론트only
function drmw() { docker rm -f rutil-vm-wsproxy; }                        # 강제중지: 웹프록시only
function drmc() { docker rm -f rutil-vm rutil-vm-api; }                   # 강제중지: 백엔드.프론트 
function drma() { docker rm -f rutil-vm rutil-vm-api rutil-vm-wsproxy; }  # 전부 강제중지

function loadDkb() {
  docker rmi $DOCKER_IMG_RUTIL_VM_API $DOCKER_IMG_RUTIL_VM_API_CURRNET;
  docker load -i $1;
  docker tag $DOCKER_IMG_RUTIL_VM_API_CURRENT $DOCKER_IMG_RUTIL_VM_API_LATEST;
}

function loadDkf() {
  docker rmi $DOCKER_IMG_RUTIL_VM $DOCKER_IMG_RUTIL_VM_CURRNET;
  docker load -i $1;
  docker tag $DOCKER_IMG_RUTIL_VM_CURRENT $DOCKER_IMG_RUTIL_VM_LATEST;
}

function loadDkw() {
  docker rmi $DOCKER_IMG_RUTIL_VM_WSPROXY $DOCKER_IMG_RUTIL_VM_WSPROXY_CURRENT;
  docker load -i $1;
  docker tag $DOCKER_IMG_RUTIL_VM_WSPROXY_CURRENT $DOCKER_IMG_RUTIL_VM_WSPROXY_LATEST;
}

function startDk() { docker compose -f "$RUTIL_VM_HOME/$DOCKER_COMPOSE_FILENAME" up -d; }  # 모두 기동
function stopDk() { docker compose -f "$RUTIL_VM_HOME/$DOCKER_COMPOSE_FILENAME" down; }    # 모두 중지
function dView() {
  COMPOSE_FILE=$RUTIL_VM_HOME/$DOCKER_COMPOSE_FILENAME;
  cat $COMPOSE_FILE;
}
function dGen() {
# echo "hello docker compose"
COMPOSE_FILE=$RUTIL_VM_HOME/$DOCKER_COMPOSE_FILENAME
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
      RUTIL_VM_CORS_ALLOWED_ORIGINS: ENGINE_IP;ENGINE_FQDN;localhost;rutil-vm
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
      __RUTIL_VM_ITEMS_PER_PAGE__: 25
      __RUTIL_VM_IS_LICENCE_VERIFIED__: false
      __RUTIL_VM_WATERMARK_TEXT__: 무단배포금지
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
}

# 엔진버젼 출력
function engineVer() { rpm -qa | grep -e ^ovirt-engine-[0-9]\.[0-9]\.[0-9]; }
# 엔진개인키 출력
function enginePki() { cat $OVIRT_ENGINE_PKI; } 
# 엔진공개키 출력
function enginePub() { curl -k -X GET "https://$(hostname -i):8443/$OVIRT_ENGINE_PUB"; }
# 엔진공개키 주입
function saveEnginePub() {
  RUTILVM_SSH_DIR=/home/rutilvm/.ssh
  OVIRT_ENGINE_PUB_URL="https://$(hostname -i):8443/$OVIRT_ENGINE_PUB"
  if ! curl -k -s -S -X GET "$OVIRT_ENGINE_PUB_URL" >> "$RUTILVM_SSH_DIR/authorized_keys" 2>/dev/null; then
    echo "[ ERROR ] Failed to retrieve oVirt engine public key from $OVIRT_ENGINE_PUB_URL"
  fi
}

function engineLog() { tail -1500f $OVIRT_ENGINE_LOG; }  # 엔진로그 확인
function setEngineLog() { vi $OVIRT_ENGINE_LOG_CONFIG; } # 엔진로그 설정

# RHV-M Certificates
function certs() {
    # 인증서 검사
    echo "This script will check certificate expiration dates"
    echo
    echo "Checking RHV-M Certificates..."
    echo "=================================================";
    ca=`openssl x509 -in /etc/pki/ovirt-engine/ca.pem -noout -enddate| cut -d= -f2`
    apache=`openssl x509 -in /etc/pki/ovirt-engine/certs/apache.cer -noout -enddate| cut -d= -f2`
    engine=`openssl x509 -in /etc/pki/ovirt-engine/certs/engine.cer -noout -enddate| cut -d= -f2`
    qemu=`openssl x509 -in /etc/pki/ovirt-engine/qemu-ca.pem -noout -enddate| cut -d= -f2`
    wsp=`openssl x509 -in /etc/pki/ovirt-engine/certs/websocket-proxy.cer -noout -enddate| cut -d= -f2`
    jboss=`openssl x509 -in /etc/pki/ovirt-engine/certs/jboss.cer -noout -enddate| cut -d= -f2`
    ovn=`openssl x509 -in /etc/pki/ovirt-engine/certs/ovirt-provider-ovn.cer -noout -enddate| cut -d= -f2`
    ovnnbd=`openssl x509 -in /etc/pki/ovirt-engine/certs/ovn-ndb.cer -noout -enddate| cut -d= -f2`
    ovnsbd=`openssl x509 -in /etc/pki/ovirt-engine/certs/ovn-sdb.cer -noout -enddate| cut -d= -f2`
    vmhelper=`openssl x509 -in /etc/pki/ovirt-engine/certs/vmconsole-proxy-helper.cer -noout -enddate| cut -d= -f2`
    vmhost=`openssl x509 -in /etc/pki/ovirt-engine/certs/vmconsole-proxy-host.cer -noout -enddate| cut -d= -f2`
    vmuser=`openssl x509 -in /etc/pki/ovirt-engine/certs/vmconsole-proxy-user.cer -noout -enddate| cut -d= -f2`

    echo "  /etc/pki/ovirt-engine/ca.pem:                          $ca"
    echo "  /etc/pki/ovirt-engine/certs/apache.cer:                $apache"
    echo "  /etc/pki/ovirt-engine/certs/engine.cer:                $engine"
    echo "  /etc/pki/ovirt-engine/qemu-ca.pem                      $qemu"
    echo "  /etc/pki/ovirt-engine/certs/websocket-proxy.cer        $wsp"
    echo "  /etc/pki/ovirt-engine/certs/jboss.cer                  $jboss"
    echo "  /etc/pki/ovirt-engine/certs/ovirt-provider-ovn         $ovn"
    echo "  /etc/pki/ovirt-engine/certs/ovn-ndb.cer                $ovnnbd" 
    echo "  /etc/pki/ovirt-engine/certs/ovn-sdb.cer                $ovnsbd"
    echo "  /etc/pki/ovirt-engine/certs/vmconsole-proxy-helper.cer $vmhelper"
    echo "  /etc/pki/ovirt-engine/certs/vmconsole-proxy-host.cer   $vmhost"
    echo "  /etc/pki/ovirt-engine/certs/vmconsole-proxy-user.cer   $vmuser"

    echo

    hosts=`/usr/share/ovirt-engine/dbscripts/engine-psql.sh -t -c "select vds_name from vds;" | xargs`
    echo
    echo "Checking Host Certificates..."
    echo

    for i in $hosts;
        do echo "Host: $i";
        echo "=================================================";
        vdsm=`ssh -i  $OVIRT_ENGINE_PKI root@${i} 'openssl x509 -in /etc/pki/vdsm/certs/vdsmcert.pem -noout -enddate' | cut -d= -f2`
        echo -e "  /etc/pki/vdsm/certs/vdsmcert.pem:              $vdsm";

        spice=`ssh -i  $OVIRT_ENGINE_PKI root@${i} 'openssl x509 -in /etc/pki/vdsm/libvirt-spice/server-cert.pem -noout -enddate' | cut -d= -f2`
        echo -e "  /etc/pki/vdsm/libvirt-spice/server-cert.pem:   $spice";

        vnc=`ssh -i  $OVIRT_ENGINE_PKI root@${i} 'openssl x509 -in /etc/pki/vdsm/libvirt-vnc/server-cert.pem -noout -enddate' | cut -d= -f2`
        echo -e "  /etc/pki/vdsm/libvirt-vnc/server-cert.pem:     $vnc";

        libvirt=`ssh -i  $OVIRT_ENGINE_PKI root@${i} 'openssl x509 -in /etc/pki/libvirt/clientcert.pem -noout -enddate' | cut -d= -f2`
        echo -e "  /etc/pki/libvirt/clientcert.pem:               $libvirt";

        migrate=`ssh -i  $OVIRT_ENGINE_PKI root@${i} 'openssl x509 -in /etc/pki/vdsm/libvirt-migrate/server-cert.pem -noout -enddate' | cut -d= -f2`
        echo -e "  /etc/pki/vdsm/libvirt-migrate/server-cert.pem: $migrate";

        echo;
        echo;
    done
}