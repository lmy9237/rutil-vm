#!/bin/sh
#
# entrypoint.sh
#
# NGINX 실행 전 환경변수 값에 대한 수정처리 
# 앞에 __RUTIL_VM 이 있는 변수 일 경우 일괄 변경처리
#
for i in $(env | grep __RUTIL_VM)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value
    # sed All files
    # find /usr/share/nginx/html -type f -exec sed -i "s|${key}|${value}|g" '{}' +

    # sed JS and conf
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|${key}|${value}|g" '{}' +
    find /etc/nginx/conf.d -type f -name '*.conf' -exec sed -i "s|${key}|${value}|g" '{}' +
done
echo 'done'

exec nginx -g 'daemon off;'