# rutil-vm-back

![favicon](../front/favicon.ico)
  
Rutil VM 백앤드

![Java (`11`)][shield-java]
![Spring (`5.3.20`) / Boot (`2.7.0`)][shield-spring]
![Spring Security (`4.2.2.RELEASE`)][shield-spring-security]
![Swagger (`2.9.2`)][shield-swagger]
![Kotlin (`1.5.31`)][shield-kotlin]
![Gradle (`7.4.2`)][shield-gradle]

## 🚀Quickstart

### 🧰Prerequisite(s)

- 🐳Docker
  - `postgres:10.12-alpine` (jdbc port: `5432`)
  - `gradle:7.4.2-jdk11-focal`
  - `eclipse-temurin:11-jdk-focal`
- OpenSSH

---

## VSCode 환경 구성

### Extension 설치

- [Debugger for Java (`vscjava.vscode-java-debug`)](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug)
- [Docker (`ms-azuretools.vscode-docker`)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [Gradle for Java (`vscjava.vscode-gradle`)](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle)
- [Java (`Oracle.oracle-java`)](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java)
- [Kotlin Language (`mathiasfrohlich.Kotlin`)](https://marketplace.visualstudio.com/items?itemName=mathiasfrohlich.Kotlin)
- [Language Support for Java(TM) by Red Hat (`redhat.java`)](https://marketplace.visualstudio.com/items?itemName=redhat.java)
- [Project Manager (`alefragnani.project-manager`)](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager)
- [Spring Boot Dashboard (`vscjava.vscode-spring-boot-dashboard`)](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-boot-dashboard)

> [!TIP] 
> 
> 일괄 설치
> 
> ```batchfile
> code --install-extension vscjava.vscode-java-debug `
> code --install-extension ms-azuretools.vscode-docker `
> code --install-extension vscjava.vscode-gradle `
> code --install-extension Oracle.oracle-java `
> code --install-extension mathiasfrohlich.Kotlin `
> code --install-extension redhat.java `
> code --install-extension alefragnani.project-manager `
> code --install-extension vscjava.vscode-spring-boot-dashboard
> ```

### JDK/Gradle에 대한 환경설정

`.vscode/` 경로 밑에 각자 맞는 환경에 따라 `settings.json`을 만들어 아래와 같이 구성

> [!IMPORTANT] 
> 
> 이 정보를 `%APPDATA%/Code/User/settings.json`에 넣어주어도 무방하다.
> VSCode에서 구동하기 위하여 필요함으로 꼭 넣어주도록

```json
{
  // gradle의 JDK 경로
  "java.import.gradle.java.home": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.25.9-hotspot",
  "java.import.gradle.wrapper.enabled": true,
  // kotlin의 JDK 경로
  "kotlin.java.home": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.25.9-hotspot", 
  // JDK 경로
  "jdk.project.jdkhome": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.25.9-hotspot",
  // OutofMemory 방지
  "java.jdt.ls.vmargs": "-XX:+UseParallelGC -XX:GCTimeRatio=4 -XX:AdaptiveSizePolicyWeight=90 -Dsun.zip.disableMemoryMapping=true -Xmx2G -Xms100m -Xlog:disable",
  //
  // [OPTIONAL] gradle의 JDK 경로
  //
  "java.import.gradle.user.home": "C:\\development\\.gradle",
  "java.configuration.updateBuildConfiguration": "interactive",
  "java.compile.nullAnalysis.mode": "automatic",
  "gradle.allowParallelRun": true,
}
```

- `java.import.gradle.java.home`: (gradle이 필요한) JDK 경로
- `java.import.gradle.wrapper.enabled`: `gradle-wrapper.properties` 에서 쓰이는 Gradle을 사용할지에 대한 유무
- `kotlin.java.home`: (kotlin이 필요한) JDK 경로
- `java.jdt.ls.vmargs`: Java 컴파일 시 OutOfMemory 방지
- `java.import.gradle.user.home`: .gradle의 경로 (기본 `%UserProfile%\.gradle`)
- `java.configuration.updateBuildConfiguration`: ?
- `gradle.allowParallelRun`: 

---

## OpenSSH

- 인증서 조회 기능에 필요한 선처리 작업
- 백앤드 기동에 꼭 필요

### SSH 접근 인증서 생성 및 각 Host에 주입

```sh
#
# 1. RutilVM이 있는 곳에서 인증서 생성 (개발환경도 포함)
# 
# - 통상적으로 ovirt-engine이 있는 곳 (예: 192.168.0.70)
# - 결과물 ~/.ssh/id_rsa, ~/.ssh/id_rsa.pub
#   - id_rsa: 개인키
#   - id_rsa.pub: 공개키
ssh-keygen -t rsa -b 4096 -m PKCS8 -N ""
#
# 2. 공개 인증서 주입
# 
# - 대상: ovirt-engine에서 접근할 host (예: 192.168.0.71 또는 192.168.0.72)
# - 결과: host의 ~/.ssh/authorized_keys파일에 ovirt-engine의 공개키 주입
#
ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.0.71
```

### 예외 상황에 대한 대처

> `id_rsa.*`파일 생성 후 `ssh-copy-id`가 안될 경우

```sh
# 
# 1. RutilVM이 있는 곳에서 공개키 값 출력
# 
# - 편집 또는 `cat`을 이용하여 값 출력 후 관련 key 추출하여 복사 (1줄)
#
cat ~/.ssh/id_rsa.pub
#
# ssh-rsa <해시값> root@rutilvm-dev.ititinfo.com
```

## Intellij Idea

### Settings

- `Build, Execution, Deployment` > `Compiler`: `Build project automatically` 활성화
- `Build, Execution, Deployment` > `Compiler` > `Annotation Processors`: `Enable annotation processing` 활성화
- `Advanced Settings`: `Compiler:Allow auto-make to start even if developed application is currently running` 활성화

### Run/Debug Configuration

- Kotlin
  - Main class: `com.itinfo.rutilvm.api.RutilVmApplicationKt`

---

## 🐘Gradle

> [!IMPORTANT]
>
> ```sh
> #
> # 프로퍼티 `profile` 유형
> # - local20: 로컬 (개발환경 192.168.0.20)
> # - local70: 로컬 (개발환경 192.168.0.70)
> # - local180: 로컬 (개발환경 192.168.0.180)
> # - staging: 스테이징 (도커용)
> # - prd: 운영 (도커용)
> #
> 
> # 아티팩트 생성 (운영)
> ./gradlew rutil-vm-api:bootJar -Pprofile=local --parallel
> ./gradlew rutil-vm-api:bootJar -Pprofile=local20 --parallel
> ./gradlew rutil-vm-api:bootJar -Pprofile=local70 --parallel
> ./gradlew rutil-vm-api:bootJar -Pprofile=local180 --parallel
> ./gradlew rutil-vm-api:bootJar -Pprofile=staging --parallel
> ./gradlew rutil-vm-api:bootJar -Pprofile=prd --parallel
> ```

### Run in VSCode

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>입력
- 프롬트 창에 `Tasks: Run Task` 입력
- (실행대상 ovirt서버에 따라) `bootRun-rutil-vm-api-20` 또는 `bootRun-rutil-vm-api-70` 선택

---

## 🐳Docker

> [!IMPORTANT]
> 
> 🛠Build
> 
> ```sh
> docker build -t ititcloud/rutil-vm-api:0.3.6 .
> docker tag ititcloud/rutil-vm-api:0.3.6 ititcloud/rutil-vm-api:latest
> ```
> 
> ▶️Run
> 
> *On Linux*
> 
> ```sh
> # rutil-vm-api
> docker run -d -it --name rutil-vm-api \
> -e TZ=Asia/Seoul \
> -e LANGUAGE=ko_KR;ko;en_US;en \
> -e LC_ALL=ko_KR.UTF-8 \
> -e LANG=ko_KR.utf8 \
> -e RUTIL_VM_OVIRT_IP=192.168.0.20 \                         # ovirt 주소 
> -e RUTIL_VM_OVIRT_PORT_HTTPS=8443 \                         # ovirt 포트 번호
> -e RUTIL_VM_PORT_HTTPS=6690 \                               # rutilVM 호스팅 포트번호
> -e RUTIL_VM_SSL_KEY_STORE=/app/certs/keystore.p12 \         # SSL 인증서 파일 (fullchain.pem으로 만든 keystore.p12)
> -e RUTIL_VM_SSL_KEY_STORE_PASSWORD=rutil-vm-api \           # SSL 인증서 비밀번호
> -e RUTIL_VM_SSL_KEY_ALIAS=rutil-vm-api \                    # SSL 인증서 alias
> -e RUTIL_VM_CORS_ALLOWED_ORIGINS=192.168.0.20;localhost;rutil-vm;rutilvm-ititinfo.com \       # CORS 예외대상 호스트명
> -e RUTIL_VM_CORS_ALLOWED_ORIGINS_PORT=3000;3443;443 \       # CORS 예외대상 호스트의 포트
> -e RUTIL_VM_OVIRT_LOGIN_LIMIT=5 \                           # 잠금처리를 위한 로그인 실패 최고 회수
> -e RUTIL_VM_OVIRT_SSH_JSCH_LOG_ENABLED=false \              # JSch 디버깅 활성화 여부 (목적: SSH연결)
> -e RUTIL_VM_OVIRT_SSH_JSCH_CONNECTION_TIMEOUT=60000 \       # 접속 Timout시간 (1분 in ms)
> -e RUTIL_VM_OVIRT_SSH_CERT_LOCATION=/app/tmp \              # 앱 내 인증서 임시보관 위치 
> -e RUTIL_VM_OVIRT_SSH_PRVKEY_LOCATION=/root/.ssh/id_rsa \   # SSH private key 위치 (기본: ${user.home}/.ssh/id_rsa)
> -e RUTIL_VM_OVIRT_SSH_ENGINE_ADDRESS=root@192.168.0.20:22 \ # oVirt Engine의 SSH 접근주소
> -e RUTIL_VM_OVIRT_SSH_ENGINE_PRVKEY= \                      # oVirt Engine의 SSH Private Key 위치
> -e POSTGRES_JDBC_PORT=5432 \                                # PostgresDB 포트번호
> -e POSTGRES_DATASOURCE_JDBC_ID=rutil \                      # 테이블스페이스접근 ID
> -e POSTGRES_DATASOURCE_JDBC_PW=rutil1! \                    # 테이블스페이스접근 PW
> -v ./rutil-vm-api/logs:/app/logs:rw \                       # 로그경로 마운트
> -v ./rutil-vm-api/certs:/app/certs:rw \                     # SSL인증서 마운트 (keystore.p12)
> -v /root/.ssh:/root/.ssh:rw \                               # SSH 접근 인증서 경로 공유
> -v /etc/hosts:/etc/hosts:ro \                               # 시스템 호스트 정보
> -v /etc/localtime:/etc/localtime:ro \                       # 시스템 시간날짜
> -p 6690:6690 \                                              # Port Maping
> ititcloud/rutil-vm-api:latest
> 
> # postgres
> docker run -d -it \
>   --name cst_postgres \
>   -e POSTGRES_PASSWORD=mysecretpassword \
>   -e PGDATA=/var/lib/postgresql/data/pgdata \
>   -v where/to/mount:/var/lib/postgresql/data \
>   postgres:12.12-alpine
> ```

> *On Windows*
> 
> ```batch
> :: rutil-vm-api
> docker run -d -it --name rutil-vm-api ^
> -e TZ=Asia/Seoul ^
> -e LANGUAGE=ko_KR;ko;en_US;en ^
> -e LC_ALL=ko_KR.UTF-8 ^
> -e LANG=ko_KR.utf8 ^
> -e RUTIL_VM_OVIRT_IP=192.168.0.20 ^
> -e RUTIL_VM_OVIRT_PORT_HTTPS=8443 ^
> -e RUTIL_VM_PORT_HTTPS=6690 ^
> -e RUTIL_VM_SSL_KEY_STORE=/app/certs/keystore.p12 ^keystore.p12)
> -e RUTIL_VM_SSL_KEY_STORE_PASSWORD=rutil-vm-api ^
> -e RUTIL_VM_SSL_KEY_ALIAS=rutil-vm-api ^
> -e RUTIL_VM_CORS_ALLOWED_ORIGINS=192.168.0.20;localhost;rutil-vm;rutilvm-ititinfo.com ^
> -e RUTIL_VM_CORS_ALLOWED_ORIGINS_PORT=3000;3443;443 ^
> -e RUTIL_VM_OVIRT_LOGIN_LIMIT=5 ^
> -e RUTIL_VM_OVIRT_SSH_JSCH_LOG_ENABLED=false ^
> -e RUTIL_VM_OVIRT_SSH_JSCH_CONNECTION_TIMEOUT=60000 ^
> -e RUTIL_VM_OVIRT_SSH_CERT_LOCATION=/app/tmp ^
> -e RUTIL_VM_OVIRT_SSH_PRVKEY_LOCATION=/root/.ssh/id_rsa ^
> -e RUTIL_VM_OVIRT_SSH_ENGINE_ADDRESS=root@192.168.0.20:22 ^
> -e RUTIL_VM_OVIRT_SSH_ENGINE_PRVKEY= ^
> -e POSTGRES_JDBC_PORT=5432 ^
> -e POSTGRES_DATASOURCE_JDBC_ID=rutil ^
> -e POSTGRES_DATASOURCE_JDBC_PW=rutil1! ^
> -v ./rutil-vm-api/logs:/app/logs:rw ^
> -v ./rutil-vm-api/certs:/app/certs:rw ^
> -v /root/.ssh:/root/.ssh:rw ^
> -v /etc/hosts:/etc/hosts:ro ^
> -v /etc/localtime:/etc/localtime:ro ^
> -p 6690:6690 ^
> ititcloud/rutil-vm-api:latest
> 
> :: postgres
> docker run -d -it ^
>   --name cst_postgres ^
>   -e POSTGRES_PASSWORD=mysecretpassword ^
>   -e PGDATA=/var/lib/pgsql/data ^
>   -v where/to/mount:/var/lib/pgsql/data ^
>   postgres:12.12-alpine
> ```
>

[shield-java]: https://img.shields.io/badge/Temurin-11-f3812a?logo=openjdk&logoColor=f3812a&style=flat-square
[shield-spring]: https://img.shields.io/badge/Spring-4.3.14.RELEASE-6DB33F?logo=spring&logoColor=6DB33F&style=flat-square
[shield-spring-security]: https://img.shields.io/badge/Spring%20Security-4.2.2.RELEASE-6DB33F?logo=springsecurity&logoColor=6DB33F&style=flat-square
[shield-postgresql]: https://img.shields.io/badge/PostgreSQL-?.?.x-4169E1?logo=postgresql&logoColor=4169E1&style=flat-square
[shield-swagger]: https://img.shields.io/badge/Swagger-2.9.2-85EA2D?logo=swagger&logoColor=85EA2D&style=flat-square 
[shield-kotlin]: https://img.shields.io/badge/Kotlin-1.5.31-0095D5?logo=kotlin&logoColor=0095D5&style=flat-square
[shield-gradle]: https://img.shields.io/badge/Gradle-7.4.2-abd759?logo=gradle&logoColor=abd759&style=flat-square
[shield-tomcat]: https://img.shields.io/badge/Tomcat-8.5.38-F8DC75?logo=apachetomcat&logoColor=F8DC75&style=flat-square
