# rutil-vm

![favicon](front/favicon.ico)
  
Rutil VM

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

## 🚀Quickstart

### 🧰개발환경 구성

#### 인증서 생성

oVirt Engine에서 docker로 올리기 전 SSL 호환 인증서 파일 구성하기

- `/root/rutil-vm/rutil-vm/certs/fullchain.pem`: `apache.cer`과 `apache-ca.pem`으로 만든 파일
- `/root/rutil-vm/rutil-vm-api/certs/keystore.p12`: `fullchain.pem`으로 만든 파일

> [!IMPORTANT]
> 
> 프론트앤드 `rutil-vm`
>
> ```sh
> # fullchain.pem 인증서 만들기
> #
> cat /etc/pki/ovirt-engine/certs/apache.cer /etc/pki/ovirt-engine/apache-ca.pem > /root/rutil-vm/rutil-vm/certs/fullchain.pem
> ```
> 
> 백앤드 `rutil-vm-api`
> 
> ```sh
> #
> # fullchain.pem 을 사용하여 keystore.p12 만들기
> #
> openssl pkcs12 -export \
> -in /root/rutil-vm/rutil-vm/certs/fullchain.pem \
> -inkey /etc/pki/ovirt-engine/keys/apache.key.nopass \
> -out /root/rutil-vm/rutil-vm-api/certs/keystore.p12 \
> -name rutil-vm-api \                # RUTIL_VM_SSL_KEY_ALIAS
> -passout pass:rutil-vm-api          # RUTIL_VM_SSL_KEY_STORE_PASSWORD
> ```

---

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
[shield-storybook]: https://img.shields.io/badge/Storybook-8.2.x-FF4785?logo=storybook&logoColor=FF4785&style=flat-square
