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

## 🐘Gradle

> [!IMPORTANT]
>
> ```sh
> #
> # 프로퍼티 `profile` 유형
> # - local: 로컬 (개발환경 192.168.0.20)
> # - local: 로컬 (개발환경 192.168.0.70)
> # - staging
> #
> # 스프링부트 프로젝트 실행 (개발)
> ./gradlew rutil-vm-api:bootRun -Pprofile=local --parallel
> ./gradlew rutil-vm-api:bootRun -Pprofile=local70 --parallel
> 
> # 아티팩트 생성 (운영)
> ./gradlew rutil-vm-api:bootJar -Pprofile=staging --parallel
> ```

![itcloud:bootRun](../imgs/gradle-rutil-vm-api-bootRun.png)

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
> # Running on macOS M1
> docker build -t ititcloud/rutil-vm-api:0.2.0-beta2 .
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
> -e RUTIL_VM_OVIRT_IP=192.168.0.20 \          # ovirt 주소 
> -e RUTIL_VM_OVIRT_PORT_HTTPS=443 \           # ovirt 포트 번호
> -e RUTIL_VM_PORT_HTTPS=8443 \                # rutilVM 호스팅 포트번호
> -e POSTGRES_JDBC_PORT=5432 \                 # PostgresDB 포트번호
> -e POSTGRES_DATASOURCE_JDBC_ID=rutil \       # 테이블스페이스접근 ID
> -e POSTGRES_DATASOURCE_JDBC_PW=rutil1! \     # 테이블스페이스접근 PW
> -e RUTIL_VM_CORS_ALLOWED_ORIGINS=localhost;rutil-vm \  # CORS 예외대상 호스트명
> -e RUTIL_VM_CORS_ALLOWED_ORIGINS_PORT=3000;3443;443 \  # CORS 예외대상 호스트의 포트
> -e RUTIL_VM_OVIRT_HOST_SSH_IP=192.168.0.21 \  # oVirt의 host주소
> -e RUTIL_VM_OVIRT_HOST_SSH_PORT=22 \          # oVirt의 host주소 포트번호
> -e RUTIL_VM_OVIRT_HOST_SSH_ID=admin \         # oVirt의 host SSH 접근가능 ID
> -e RUTIL_VM_OVIRT_HOST_SSH_PW=rootAdmin!@#  \ # oVirt의 host SSH 접근가능 ID
> -p 8080:8080 -p 8443:8443 \                   # Port Mapping
> ititcloud/rutil-vm-api:0.2.0-beta2
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
> -e RUTIL_VM_OVIRT_IP=192.168.0.20 ^
> -e RUTIL_VM_OVIRT_PORT_HTTPS=443 ^
> -e RUTIL_VM_PORT_HTTPS=8443 ^
> -e POSTGRES_JDBC_PORT=5432 ^
> -e POSTGRES_DATASOURCE_JDBC_ID=rutil ^
> -e POSTGRES_DATASOURCE_JDBC_PW=rutil1! ^
> -p 8080:8080 -p 8443:8443 ^
> ititcloud/rutil-vm-back:0.1.0
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
