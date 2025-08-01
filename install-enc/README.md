 # sh-enc

Shell 기반 Rutil VM 설치 및 관리 스크립트 암호화

> 엔진에 위치
> 
> 현재 버전: 20250729-02

---

## 🚀Quickstart

### 🧰Prerequisite(s)

- ~~CentOS Stream 9 개발자모드로 설치 (Python 3.9.21)~~
  - ~~ldd 2.34~~ 
  - ~~Python 3.9.21~~
  - nuitka
- CentOS Stream 8 에서 개발자모드로 설치 
  - ldd: 2.28
  - Python 3.6.8
  - nuitka 2.7.12


컴파일 된 결과물을 실행 할 환경에서 ldd 버전 확인!

```sh
#
# Debian 기반일 때
#
ldd --version
# 
# ldd (Debian GLIBC 2.28-10+deb10u3) 2.28
# Copyright (C) 2018 Free Software Foundation, Inc.
# This is free software; see the source for copying conditions.  There is NO
# warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# Written by Roland McGrath and Ulrich Drepper.
#
# Fedora (i.e. CentOS 8 기반일 때)
#
ldd --version
# 
# ldd (GNU libc) 2.28
# Copyright (C) 2018 Free Software Foundation, Inc.
# This is free software; see the source for copying conditions.  There is NO
# warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# Written by Roland McGrath and Ulrich Drepper.
```

> [!IMPORTANT]
>
> 이럴 경우 ldd 버젼이 같더라도 (2.28) Fedora기봔 환경에서 돌아야 함으로, 컴파일 된 파일은 절대 실행이 되지않는다.
> 그러므로 우리는 `rockylinux:8` 기반에서 실행하여 컴파일 하여야 한다.

### 최종 결과물

```sh
out/
├── sh/
│   ├── rutilvm-engine-setup.sh    # 암호화 처리 완료 된 스크립트
│   ├── rutilvm-engine-patch.sh    # 암호화 처리 완료 된 스크립트
│   ├── rutilvm-host-setup.sh      # 암호화 처리 완료 된 스크립트
│   └── test.sh                    # 암호화 처리 완료 된 스크립트 (테스트 실행용)
├── py/
│    ├── ruitilvm-el8.py           # 암호화 처리 완료 된 Python 스크립트
│    └── test.py                   # 암호화 처리 완료 된 Python 스크립트 (테스트)
└── version.txt                    # 빌드 된 환경에서의 OS 및 필수 의존 소프트웨어 버젼 정보
```

## 🐳Docker

> [!IMPORTANT]
> 
> 🛠Build
> 
> ```sh
> docker build -t ititinfo.synology.me:50951/ititcloud/rutil-vm-sh-enc:4.0.0-3 .
> docker tag ititinfo.synology.me:50951/ititcloud/rutil-vm-sh-enc:4.0.0-3 ititinfo.synology.me:50951/ititcloud/rutil-vm-sh-enc:latest
> ```
> 
> ▶️Run
> 
> ```sh
> # rutil-vm-sh-enc
> docker rm -f rutil-vm-sh-enc
> docker create --name rutil-vm-sh-enc ititinfo.synology.me:50951/ititcloud/rutil-vm-sh-enc:4.0.0-3
> # docker cp rutil-vm-sh-enc:/out/sh/test.sh ./
> docker cp rutil-vm-sh-enc:/out/sh/rutilvm-engine-setup.sh ./
> docker cp rutil-vm-sh-enc:/out/sh/version.txt ./
> ```

---

## 참고

https://www.datsi.fi.upm.es/~frosal/