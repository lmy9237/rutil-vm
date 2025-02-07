# rutil-vm

![favicon](front/public/favicon.ico)
  
루틸 VM

![Java (`11`)][shield-java]
![Spring (`5.3.20`) / Boot (`2.7.0`)][shield-spring]
![Spring Security (`4.2.2.RELEASE`)][shield-spring-security]
![Swagger (`2.9.2`)][shield-swagger]
![Kotlin (`1.5.31`)][shield-kotlin]
![Gradle (`7.4.2`)][shield-gradle]
<!-- ![shield-tomcat][shield-tomcat] -->

![Node.js (`11.0.23`)][shield-nodejs]
![React.js (`18.3.x`)][shield-reactjs]
![Storybook (`8.2.x`)][shield-storybook]
![PostgreSQL (`?.?.x`)][shield-postgresql]


---

## 🐳Docker

> [!IMPORTANT]
> 
> 🛠Build
> 
> ```sh
> # Running on macOS M1
> docker build -t itinfo/itcloud:0.1.0 .
> 
> # Okestro
> docker build -t itinfo/okestro:0.0.5 .
> ```

> [!NOTE]
> 
> ▶️Run
> 
> *On Linux*
> 
> ```sh
> # itcloud
> docker run -d -it --name itcloud \
>   -e ITCLOUD_PORT_HTTP=8080 \
>   -e ITCLOUD_PORT_HTTPS=8443 \
>   -e ITCLOUD_OVIRT_IP=192.168.0.70 \
>   -e POSTGRES_JDBC_URL=192.168.0.70 \
>   -e POSTGRES_JDBC_PORT=5432 \
>   -e POSTGRES_DATASOURCE_JDBC_ID=<rutil> \
>   -e POSTGRES_DATASOURCE_JDBC_PW=<rutil1!> \
>   -p 8080:8080 -p 8443:8443 \
>   itinfo/itcloud:0.1.0
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
> docker run -d -it --name itcloud ^
>   -e ITCLOUD_PORT_HTTP=8080 ^
>   -e ITCLOUD_PORT_HTTPS=8443 ^
>   -e ITCLOUD_OVIRT_IP=192.168.0.70 ^
>   -e POSTGRES_JDBC_URL=192.168.0.70 ^
>   -e POSTGRES_JDBC_PORT=5432 ^
>   -e POSTGRES_DATASOURCE_JDBC_ID=<rutil> ^
>   -e POSTGRES_DATASOURCE_JDBC_PW=<rutil1!> ^
>   -p 8080:8080 -p 8443:8443 ^
>   itinfo/itcloud:0.1.0
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
GRANT ALL ON SCHEMA aaa_jdbc TO rutil;
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

## 🎯TODO

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

## Swagger 3 

- 접속URL: `/swagger-ui/`

---

## Dependencies 주입

https://medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application-5839e4fd8fac
https://hoestory.tistory.com/70


[toENDPOINTS]: docs/ENDPOINTS.md
[toPOSTGRES]: docs/POSTGRES.md

[shield-java]: https://img.shields.io/badge/Temurin-11-f3812a?logo=openjdk&logoColor=f3812a&style=flat-square
[shield-spring]: https://img.shields.io/badge/Spring-4.3.14.RELEASE-6DB33F?logo=spring&logoColor=6DB33F&style=flat-square
[shield-spring-security]: https://img.shields.io/badge/Spring%20Security-4.2.2.RELEASE-6DB33F?logo=springsecurity&logoColor=6DB33F&style=flat-square
[shield-postgresql]: https://img.shields.io/badge/PostgreSQL-?.?.x-4169E1?logo=postgresql&logoColor=4169E1&style=flat-square
[shield-swagger]: https://img.shields.io/badge/Swagger-2.9.2-85EA2D?logo=swagger&logoColor=85EA2D&style=flat-square 
[shield-kotlin]: https://img.shields.io/badge/Kotlin-1.5.31-0095D5?logo=kotlin&logoColor=0095D5&style=flat-square
[shield-gradle]: https://img.shields.io/badge/Gradle-7.4.2-abd759?logo=gradle&logoColor=abd759&style=flat-square
[shield-tomcat]: https://img.shields.io/badge/Tomcat-8.5.38-F8DC75?logo=apachetomcat&logoColor=F8DC75&style=flat-square

[shield-nodejs]: https://img.shields.io/badge/Node.js-11.0.23-5FA04E?logo=nodedotjs&logoColor=5FA04E&style=flat-square
[shield-reactjs]: https://img.shields.io/badge/React.js-18.3.x-61DAFB?logo=react&logoColor=61DAFB&style=flat-square
[shield-storybook]: https://img.shields.io/badge/Storybook-8.2.x-FF4785?logo=react&logoColor=FF4785&style=flat-square
