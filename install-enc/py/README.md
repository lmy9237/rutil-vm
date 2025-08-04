# py-enc

Python 기반 Rutil VM 설치 및 관리 스크립트 암호화

> 호스트에 위치
> 
> 현재 버전: 20250729-02

컴파일 된 후 최종 파일명: `rutilvm` (확장자명 없음)

## Nuitka로 암호화된 Python 코드 컴파일

> PyArmor만큼의 암호화/난독화는 아니지만, 일반적으로 `.py` 코드 유출은 완전히 막을 수 있음.

| 목적 | PyArmor | Nuitka |
| :---- | :---: | :---: |
| 코드 난독화 / 암호화 | O | X |
| 실행 파일 생성 (바이너리) | X | O |
| 실행 파일 내장된 암호화 코드 | O | O (PyArmor + Nuitka 함께 사용) |
| 무료 사용 | 제한적 사용 가능 | 무료로 사용 가능 |

## Nuitka 장/단점

### 장점

- 단독 완전한 실행파일 생성 
- 높은 속도
- 소스 보호

### 단점

고급 난독화는 불가
                           
## 설치 방법

- ~~CentOS Stream 9 개발자모드로 설치 (Python 3.9.21)~~
  - ~~Python 3.9.21~~
  - nuitka
  - ~~ldd 2.34~~ 
- CentOS Stream 8 에서 개발자모드로 설치 
  - Python 3.6.8
  - nuitka 2.7.12
  - ldd: 2.28

```sh
/usr/bin/python3 --version
#
# Python 3.6.8
ldd --version
#
# ldd (GNU libc) 2.28
# Copyright (C) 2018 Free Software Foundation, Inc.
# 이 프로그램은 공개 소프트웨어입니다; 복사조건은 소스를 참조하십시오.  상품성
# 이나 특정 목적에 대한 적합성을 비롯하여 어떠한 보증도 하지 않습니다.
# 만든 사람: Roland McGrath 및 Ulrich Drepper.

dnf install -y gcc gcc-c++
dnf install python3-devel
dnf install libxml2-devel

pip3 install nuitka
pip3 install patchelf
pip3 install ovirt-engine-sdk-python
pip3 install setuptools wheel
pip3 install cryptography

chmod 755 /root/rutilvm-beta-20250404-01

```

---

## 컴파일 예시

```sh
python3 -m nuitka --standalone --onefile rutilvm-beta-20250405-01.py
#
# 또는
# 
nuitka \
--standalone \
--onefile \
--nofollow-import-to=tkinter,test \
--remove-output \
--lto=yes \
--enable-plugin=numpy \
--show-progress \
--output-dir=build \
rutilvm-beta-20250404-01.py
```

## 옵션 설명

- `--standalone`: 모든 종속 라이브러리 포함
- `--onefile`: 단일 실행파일로 생성
- `--nofollow-import-to=`: 불필요한 라이브러리 제외 (용량 줄이기용)
- `--remove-output`: 이전 빌드 결과 삭제
- `--lto=yes`: C코드 최적화 (Link Time Optimization)
- `--enable-plugin=numpy`: NumPy 사용 시 필수
- `--output-dir=build`: 출력 디렉터리 지정
- `--show-progress`: 빌드 진행 상태 표시

### 보안 강화 팁 (고급)

- `--no-pyi-file`:  `.pyi` 파일 생성 방지
- `--include-data-files`: 외부 설정파일 포함 시 직접 지정
- `--python-flag=no_site`: `site.py`로딩 방지
- `--noinclude-default-mode=error`: 불필요한 모듈 포함 차단


## 참조

- https://nuitka.net/
  - https://nuitka.net/user-documentation/common-issue-solutions.html
- https://github.com/Nuitka/Nuitka

