# rutil-vm-admin

![favicon](../front/favicon.ico)
  
Rutil VM 관리 및 필수 확인사항

## oVirt 테스트 환경에 있을 파일

> 위치: /opt/rutilvm

- `.bash_profile_<엔진IP의끝번호>`: 해당 엔진에서 rutil-vm 및 ovirt 관련 서비스를 다루는 모든 bash 정보
- `deploy-local-<엔진IP의끝번호>.yaml`: 해당 엔진에서 rutil-vm 관련 서비스를 올리고 내리기 위해 필요한 docker compose 파일
- `api.tar`: 최신 RutilVM 백엔트 도커이미지 (새로 올리거나 이미지를 로드할 경우)
- `web.tar`: 최신 RutilVM 프론트엔드 도커이미지 (새로 올리거나 이미지를 로드할 경우)
- `wsproxy.tar`: 최신 RutilVM 웹프록시 서버 도커이미지 (새로 올리거나 이미지를 로드할 경우)

> [!IMPORTANT] 
> 
> `api,web,wsproxy` tar파일은 사내 NAS (`ititinfo.synology.me:5001`)에 위치함 `
>
> 경로: /docker`
> 

## 엔진의 개인키 확인

```sh
# .bash_profile 이 있다면
enginePki
# 없다면
cat /etc/pki/ovirt-engine/keys/engine_id_rsa
```

## 엔진의 공개키 확인

```sh
# .bash_profile 이 있다면
enginePub
# 없다면
curl -k -X GET "https://$(hostname -i):8443/ovirt-engine/services/pki-resource?resource=engine-certificate&format=OPENSSH-PUBKEY" 
```

## docker-compose 파일의 상태

### IP 주소 및 hostname이 들어갈 곳에 내용이 올바르게 들어갔는지 확인

```yaml
```

### 엔진 개인키가 잘 들어갔는지 확인

```yaml
```



