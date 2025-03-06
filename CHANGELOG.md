# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Contributor(s)

- [@chanhi2000][chanhi2000]: PL
- [@dhj27][dhj27]: Backend
- [@lmy9237][lmy9237]: Frontend

## [Unreleased]

<!-- 
### Added
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
### Changed
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
### Fixed
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
### Removed 
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
-->

## 0.2.1 - 2025-03-07

### [`api-v0.2.1`][api-v0.2.1]: 백엔드

### Added

- [@chanhi2000][chanhi2000]
  - 180번 서버 배포 및 접근정보에 대한 구성 ([`ccec77cd`](https://github.com/ititcloud/rutil-vm/commit/ccec77cd7d764230938cd862c3af26c6bb048632))
  - 배포환경에 맞는 프론트 Docker 빌드 구성 ([`423fa0d9`](https://github.com/ititcloud/rutil-vm/commit/423fa0d9dfd1e46dc45c3357c0954cf8fee99054))
  - 공급자 정보 조회 API ([`33a39dd6`](https://github.com/ititcloud/rutil-vm/commit/33a39dd6691867148833e465eebc485a75fe6ca4))
- [@dhj27][dhj27]
  - 가상머신 가져오기 API (vmware)

### Changed

- [@chanhi2000][chanhi2000]
  - 프론트 + 백앤드 배포환경 구성 완료 ([`c2e2dc10`](https://github.com/ititcloud/rutil-vm/commit/c2e2dc1054a11ddb2e132b1b085ed32c9420bf49))
- [@dhj27][dhj27]
  - 가상머신 편집

### Fixed

- [@chanhi2000][chanhi2000]
  - SSH 접근을 이용하여 호스트 재기동 기능 복구 ([`50640e2f`](https://github.com/ititcloud/rutil-vm/commit/50640e2ff6f0382247e62a72a6df23c7c4e419df))
- [@dhj27][dhj27]
  - 호스트 네트워크 모달 수정 및 기능 수정
  - 가상머신 스냅샷 수정

### Removed

<!-- 
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] 
-->

### [`web-v0.2.1`][web-v0.2.1]: 프론트

### Added

- [@chanhi2000][chanhi2000]
  - `rutil-vm` github action 자동 Docker Image 생성 ([`44afb86e`](https://github.com/ititcloud/rutil-vm/commit/44afb86e42fee46c186f955e66bb61740a5ec6a4))
<!-- - [@dhj27][dhj27] -->
- [@lmy9237][lmy9237]
  - 검색창 추가(새 컴포넌트추가)
  - 컴포넌트분리(모달nav , 검색창 , mainouter)

### Changed

- [@chanhi2000][chanhi2000]
  - 프론트 + 백앤드 배포환경 구성 완료 ([`c2e2dc10`](https://github.com/ititcloud/rutil-vm/commit/c2e2dc1054a11ddb2e132b1b085ed32c9420bf49))
- [@dhj27][dhj27]
  - 가상머신 편집
<!-- - [@lmy9237][lmy9237] -->

### Fixed

- [@chanhi2000][chanhi2000]
  - 프론트 Docker 배포에 쓰이는 `entrypoint.sh` 파일 EOF 문제 개선 ([`d5765291`](https://github.com/ititcloud/rutil-vm/commit/d57652910a58b5df48c0be08c8a8c15f86f005b2))
  - **QUICK-FIX**: 프론트 빌드에러 수정 (`useSearch` 파일 경로참조 오타)
- [@dhj27][dhj27]
  - 호스트 네트워크 모달 수정 및 기능 수정
  - 가상머신 스냅샷 수정
- [@lmy9237][lmy9237]
  - css 깨진것 수정
  - 반응형
  - 대시보드 수정(차트크기,비율)
  - 모달창 크기수정

### Removed

<!--
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
-->

---

## [0.2.0-beta2][api-v0.2.0-beta2] - 2025-03-07

### Added

- [@chanhi2000][chanhi2000]
  - `${DEVOPS}` admin 환경에 대한 관련 파일 추가 
    - `admin/.bash_profile`: 기동하는 엔진의 프로필
    - `admin/deploy-local-*.yml`: 배포에 필요한 Docker Image에 대한 환경관리  
  - `${DEVOPS}` 코드규칙 관련 lint 추가 (EditorConfig, ESLint, etc.)
  - `${BACK}`/`${DEVOPS}` Docker 이미지의 환경변수 구성 (CORS 필터 허용 address, 호스트 ssh 접근)
  - `${FRONT}`/`${BACK}` 사용자 (목록, 추가, 편집, 비밀변경, 삭제)
  - `${FRONT}`/`${BACK}` 활성 사용자 세션 (목록)
  - `${FRONT}`/`${BACK}` 인증서 (목록)
  - `${BACK}` 인증서 파일처리 / SSH처리 분리개발
- [@dhj27][dhj27]
  - `${FRONT}`/`${BACK}` Storage Domain > Template 가져오기
  - `${FRONT}`/`${BACK}` Storage Domain > VM 가져오기 목록
  - `${FRONT}`/`${BACK}` Storage Domain > VM 가져오기
  - `${FRONT}`/`${BACK}` Storage Domain > VM 불러오기 목록
  - `${FRONT}`/`${BACK}` Storage Domain > VM 불러오기
  - `${FRONT}`/`${BACK}` Storage Domain > Disk 불러오기 목록
  - `${FRONT}`/`${BACK}` Storage Domain > Disk 불러오기
  - `${FRONT}` VM 생성 시 Disk 이름 자동입력
  - `${BACK}` Disk 활성화 상태 검사
- [@lmy9237][lmy9237]
  - `${FRONT}` 스토리지 추가페이지 생성
  - `${FRONT}` css변수 생성 (font size px단위, 모달창 크기, 등등)
  - `${FRONT}` 도메인,가상머신 path경로추가
  - `${FRONT}` 드레그기능 재추가
  - `${FRONT}` 테이블 툴팁 재추가
  - `${FRONT}` 버튼들 떨어지게하기(반응형)
  - `${FRONT}` 대시보드 박스 떨어지게하기(반응형)
  - `${FRONT}` 경보 / 알림칸 추가 

### Changed

- [@chanhi2000][chanhi2000]
  - `${FRONT}`/`${BACK}` project nameing 변경 itcloud -> rutil-vm
  - `${FRONT}` 리펙토링 - 모듈분리 (BaseModal, PagingTableOuter, etc.)
  - `${FRONT}` 컴파일 방식 변경 (webpack -> vite)
- [@dhj27][dhj27]
  - `${FRONT}` Storage Domain 생성모달
  - `${FRONT}` Disk 생성 모달
  - `${FRONT}` aside 메뉴 드래그 기능 (진행중)
  - `${FRONT}` VM 모달 리팩토링
  - `${FRONT}` VM 생성
  - `${FRONT}` VM Disk 생성, 편집
  - `${FRONT}`/`${BACK}` Host Network 정리
  - `${FRONT}` Host Nic 정리
- [@lmy9237][lmy9237]
  - `${FRONT}`: 스타일 수정 (nav 아이콘, 반응형처리)
  - `${FRONT}`: 우클릭박스 수정
  - `${FRONT}`: Path.jsx 링크이동

### Fixed

- [@chanhi2000][chanhi2000]
  - `${DEVOPS}`: ovirt-engine 호스팅 포트 변경 (443 -> 2443) 후 `rutil-vm-api`의 환경구성 (`a53c7305d`)
  - `${BACK}`: PostgreSQL 환경에서 발생하는 too many clients 처리 (`max-connection` 제한 `10` -> `4`)
  - `${BACK}`: Github Actions 연동 정상화 (사내 Synology NAS에 Docker Image 자동 업로드 처리 - 백앤드only)
  - `${BACK}`: Docker환경에서 JPA 조회 안되는 현상 처리
  - `${BACK}`: Timezone문제로 인한 통계정보 출력 불량
- [@dhj27][dhj27]
  - `${FRONT}` VM Disk 생성, 편집, 삭제
  - `${FRONT}` Host Network 이름 변경
- [@lmy9237][lmy9237]
  - `${FRONT}` 호스트 > 네트워크 모달 정보 안나오는 것 수정 (진행중)
  - `${FRONT}` Template 생성 (스토리지 공간 오류)
  - `${FRONT}` Template NIC 생성오류 보정
  - `${FRONT}` Template NIC 삭제오류 보정
  - `${FRONT}` Template NIC 라디오버튼 표시안뜨는것 보정
  - `${FRONT}` vNIC Profile 생성모달 데이터센터오류 보정
  - `${FRONT}` Storage Domain 우클릭 출력불량 오류 보정
  - `${FRONT}` header화면비율조정
  - `${FRONT}` 디스크, 가상머신  모달깨진것수정
  - `${FRONT}` 필터버튼(ex:디스크유형) , 모달 옆에 메뉴버튼 , DynamicInputList 컴포넌트 분리
  - `${FRONT}` 성공/실패 토스트 수정

### Removed

- [@lmy9237][lmy9237]
  - `${FRONT}` 필요없는 구 컴포넌트 삭제

## 0.2.0-beta1 - 2025.02.12

프로젝트 병합 후 첫 릴리즈

[web-v0.2.1]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.0-beta2...web-v0.2.1
[api-v0.2.1]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.0-beta2...api-v0.2.1
[api-v0.2.0-beta2]: https://github.com/ititcloud/rutil-vm/tree/api-v0.2.0-beta2

[chanhi2000]: https://github.com/chanhi2000
[dhj27]: https://github.com/dhj27
[lmy9237]: https://github.com/lmy9237