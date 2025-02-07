# rutil-vm-back

![favicon](../front/public/favicon.ico)
  
루틸 VM 백앤드

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
> ```bat
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

## 🐘Gradle

> [!IMPORTANT]
>
> ```sh
> #
> # 프로퍼티 `profile` 유형
> # - local: 로컬 (개발환경)
> # - staging
> #
> # 스프링부트 프로젝트 실행 (개발)
> ./gradlew rutil-vm-api:bootRun -Pprofile=staging -PskipNpm=true --parallel
> 
> # 아티팩트 생성 (운영)
> ./gradlew rutil-vm-api:bootJar -Pprofile=staging -PskipNpm=true --parallel
> ```

![itcloud:bootRun](../imgs/gradle-rutil-vm-api-bootRun.png)

## Run in VSCode

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>입력
- 프롬트 창에 `Tasks: Run Task` 입력
- `bootRun-rutil-vm-api` 선택

---

## 🐳Docker

> [!IMPORTANT]
> 
> 🛠Build
> 
> ```sh
> # Running on macOS M1
> docker build -t rutil-vm-api:0.2.0-beta1 .
> 
> # Okestro
> docker build -t okestro:0.0.5 .
> ```

> [!NOTE]
> 
> ▶️Run
> 
> *On Linux*
> 
> ```sh
> # rutil-vm-api
> docker run -d -it --name rutil-vm-api \
>   -e ITCLOUD_PORT_HTTP=8080 \
>   -e ITCLOUD_PORT_HTTPS=8443 \
>   -e ITCLOUD_OVIRT_IP=192.168.0.70 \
>   -e POSTGRES_JDBC_URL=192.168.0.70 \
>   -e POSTGRES_JDBC_PORT=5432 \
>   -e POSTGRES_DATASOURCE_JDBC_ID=<rutil> \
>   -e POSTGRES_DATASOURCE_JDBC_PW=<rutil1!> \
>   -p 8080:8080 -p 8443:8443 \
>   rutil-vm-api:0.2.0-beta1
> 
> # postgres
> docker run -d -it \
>   --name cst_postgres \
>   -e POSTGRES_PASSWORD=mysecretpassword \
>   -e PGDATA=/var/lib/postgresql/data/pgdata \
>   -v where/to/mount:/var/lib/postgresql/data \
>   postgres:10.12-alpine
> ```

> *On Windows*
> 
> ```batch
> :: iotcloud
> docker run -d -it --name rutil-vm-back ^
>   -e ITCLOUD_PORT_HTTP=8080 ^
>   -e ITCLOUD_PORT_HTTPS=8443 ^
>   -e ITCLOUD_OVIRT_IP=192.168.0.70 ^
>   -e POSTGRES_JDBC_URL=192.168.0.70 ^
>   -e POSTGRES_JDBC_PORT=5432 ^
>   -e POSTGRES_DATASOURCE_JDBC_ID=<rutil> ^
>   -e POSTGRES_DATASOURCE_JDBC_PW=<rutil1!> ^
>   -p 8080:8080 -p 8443:8443 ^
>   itinfo/rutil-vm-back:0.1.0
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

## 

### (사용자 정보 접근을 위한) PostgresDB 초기 구성

> Postgres 관리자 권한으로 로그인

```sh
su - postgres # postgres 사용자로 su 로그인
psql -U postgres -d engine # postgres 사용자로 engine 테이블스페이스에 로그인 (비밀번호X)
```

```sql
GRANT ALL ON SCHEMA aaa_jdbc TO okestro;
#
# GRANT
```

### 유용한 쿼리

```sql
# DESCRIBE 테이블
SELECT table_name, column_name, data_type FROM information_schema.columns WHERE 1=1
AND table_schema = 'aaa_jdbc'
AND table_name = 'users';
```

```sh
cd /etc/pki/ovirt-engine/certs
```

---

## 🩺Troubleshooting

### admin 계정 잠김

ssh로 해당 서버 접근하여 아래 커맨드 실행

```sh
ssh root@192.168.0.70 -p 22
# ...
# root@192.168.0.70's password:
# Web console: https://ovirt.ititinfo.local:9090/ or https://192.168.0.70:9090/
# 
# Last login: Mon Sep  2 11:08:15 2024 from 192.168.0.218
sudo ovirt-aaa-jdbc-tool user show admin # admin 계정 확인
#
# Picked up JAVA_TOOL_OPTIONS: -Dcom.redhat.fips=false
# -- User admin(<고유아이디>) --
# Namespace: *
# Name: admin
# ID: <고유아이디>
# Display Name:
# Email: admin@localhost
# First Name: admin
# Last Name:
# Department:
# Title:
# Description:
# Account Disabled: false
# Account Locked: false
# Account Unlocked At: 2024-09-02 02:45:20Z
# Account Valid From: 2024-08-27 09:48:37Z
# Account Valid To: 2224-08-27 09:48:37Z
# Account Without Password: false
# Last successful Login At: 2024-09-02 02:45:31Z
# Last unsuccessful Login At: 2024-09-02 02:44:51Z
# Password Valid To: 2025-03-01 01:07:15Z
#
sudo ovirt-aaa-jdbc-tool user password-reset admin --password-valid-to="2029-12-31 23:59:59Z"
#
# Picked up JAVA_TOOL_OPTIONS: -Dcom.redhat.fips=false
# Password:
# Reenter password:
# new password already used 
# 
# >>> 비밀번호 변경실패... 이미 사용했던 비밀번호
# 
sudo ovirt-aaa-jdbc-tool user password-reset admin --password-valid-to="2029-12-31 23:59:59Z" --force # 강제 변경
# 
# Picked up JAVA_TOOL_OPTIONS: -Dcom.redhat.fips=false
# Password:
# Reenter password:
# updating user admin...
# user updated successfully
#
# >>> 비밀번호 변경성공!
# 
sudo ovirt-aaa-jdbc-tool user unlock admin # admin 계정 잠금 풀기
# Picked up JAVA_TOOL_OPTIONS: -Dcom.redhat.fips=false
# updating user admin...
# user updated successfully
```

---

## Dependencies 주입

https://medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application-5839e4fd8fac
https://hoestory.tistory.com/70

[shield-java]: https://img.shields.io/badge/Temurin-11-f3812a?logo=openjdk&logoColor=f3812a&style=flat-square
[shield-spring]: https://img.shields.io/badge/Spring-4.3.14.RELEASE-6DB33F?logo=spring&logoColor=6DB33F&style=flat-square
[shield-spring-security]: https://img.shields.io/badge/Spring%20Security-4.2.2.RELEASE-6DB33F?logo=springsecurity&logoColor=6DB33F&style=flat-square
[shield-postgresql]: https://img.shields.io/badge/PostgreSQL-?.?.x-4169E1?logo=postgresql&logoColor=4169E1&style=flat-square
[shield-swagger]: https://img.shields.io/badge/Swagger-2.9.2-85EA2D?logo=swagger&logoColor=85EA2D&style=flat-square 
[shield-kotlin]: https://img.shields.io/badge/Kotlin-1.5.31-0095D5?logo=kotlin&logoColor=0095D5&style=flat-square
[shield-gradle]: https://img.shields.io/badge/Gradle-7.4.2-abd759?logo=gradle&logoColor=abd759&style=flat-square
[shield-tomcat]: https://img.shields.io/badge/Tomcat-8.5.38-F8DC75?logo=apachetomcat&logoColor=F8DC75&style=flat-square
