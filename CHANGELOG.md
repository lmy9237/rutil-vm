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
### Changed/Fixed
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
### Removed 
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
-->

---

## 0.2.2 - 2025-03-21

### [`api-v0.2.3`][api-v0.2.3]: 백엔드

### Added

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - Dashboard VM 메모리/CPU 통계 기능 조회 오류 예외처리
- [@dhj27][dhj27]
  - 전체적인 리팩토링 (속도개선)
  - navigation vm status 추가 
<!-- - [@lmy9237][lmy9237] -->

<!-- ### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

### [`web-v0.2.3`][web-v0.2.3]: 프론트

### Added

- [@chanhi2000][chanhi2000]
  - RutilVM 로고 적용 (로고 컴포넌트)
  - Localization 처리
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
  - input 테두리 px줄이기 , 네비케이션과 세부페이지 카테고리 hover기능추가

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - 디자인 된 아이콘으로 교체 (상태, 메뉴, etc.)
  - 컴포넌트 정리
- [@dhj27][dhj27]
  - 템플릿 페이지 정리
  - 페이지 리팩토링(formdata 정리)
  - 필요없는 테이블 삭제
- [@lmy9237][lmy9237]
  - 상단 헤더 메뉴버튼: 로고버튼 호버 효과 비활성화
  - 네비게이션 버튼 그룹 왼쪽으로 정렬
  - Path의 Font Size: 13 -> 14
  - 테이블 짝홀에 따른 열 색 Toggle (회색 / 흰색 교차)  
  - 하단 "최근작업" 활성화 버튼에 대한 아이콘 스타일 변경 
    - 닫혔을 때: ChevronArrowDown
    - 열렸을 때: ChevronArrowUp
  - Radio버튼, Checkbox버튼과 텍스트와의 수직 Center나열 
  -  상단 헤더 버튼 > 사용자 팝업박스 생성 후, 다른메뉴 또는 UI 변경 시, 사라지도록
  - 상단 헤더 버튼 > 이벤트 팝업박스 생성 후, 다른메뉴 또는 UI 변경 시, 사라지도록
  - Dashboard 그리드박스 수치에 따른 색깔표현 적용 
  - ActionButton 적용 (VM생성모달, etc.)
  - Dashboard 박스 스타일 틀어지는 현상수정(창이 거의 2줄 이상으로 바뀌기 직전에 메뉴버튼을 눌러주면 글자가 다 틀어짐)
  - 상세화면 popup_box에 대한 컴포넌트(disabled/hover에 대한 css처리 포함)
  - 폰트,높이,넓이 줄이기 + 버튼사이즈 수정
  - 네비게이션 트리구조 안열리는것 , 아이콘 오류 수정
  - 디자인 수정

### Removed 

- [@chanhi2000][chanhi2000]
  - 불필요한 의존 컴포넌트 제거
<!-- - [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

---


## 0.2.2 - 2025-03-14

### [`api-v0.2.2`][api-v0.2.2]: 백엔드

### Added

- [@chanhi2000][chanhi2000]
  - 인증서 파일 임시보관 처리 ([`7ad2ad84`](https://github.com/ititcloud/rutil-vm/commit/7ad2ad84c3acc571c8ebfdf844df8cdf6c1c7bf7))
  - spring-actuator 활성화 (health모니터링 및 시스템정보 관리)
  - vSphere 관련 API 기초 구성 ([`f1d993cc8`](https://github.com/ititcloud/rutil-vm/commit/f1d993cc8ad93cf30de4f4f655a03964e4bed076))
  - 그래픽콘솔 관련 API 기초 구성 ([`10ead1e6`](https://github.com/ititcloud/rutil-vm/commit/10ead1e6354f5fe2bac0f1f105dc60f62094a137))
<!-- - [@dhj27][dhj27] -->
- [@lmy9237][lmy9237]
  - 가상머신 > 다운된 가상머신 추가

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - 인증서목록 조회 속도 개선 ([`7ad2ad84`](https://github.com/ititcloud/rutil-vm/commit/7ad2ad84c3acc571c8ebfdf844df8cdf6c1c7bf7))
    - 인증서파일 임시보관처리 스캐쥴링
    - SSH/SFTP 파일 처리 시, 통신이 양호하지 않은 환경에 대비한 connectionTimeout설정 옵션 추가 ([`f917113f`](https://github.com/ititcloud/rutil-vm/commit/f917113f8e105bcecacde1903c114f2f3aa7190f))
  - Figma 디자인 적용 
    - 네비게이션메뉴 아이콘 ([`ac934cb3`](https://github.com/ititcloud/rutil-vm/commit/ac934cb3d30b17077035091ada6550c487cfcf2c))
    - 트리 네비게이션 ([`6408d33c`](https://github.com/ititcloud/rutil-vm/commit/6408d33c2c77908db1c688c92b2817612c1d240f))
- [@dhj27][dhj27]
  - 대시보드 - host 사용량 선 그래프 값 추가 ([`6a987059`](https://github.com/ititcloud/rutil-vm/commit/6a987059a226943d3296d2d2783696fb0158bf62))
  - 대시보드 - 스토리지 도메인 사용량 선 그래프 값 추가 ([`211cb8b3`](https://github.com/ititcloud/rutil-vm/commit/211cb8b3212869f21014b02443e85198148622e1))
  - 대시보드 - 그래프에서 가상머신 'hostedEngine' 표시 제외 ([`0ca1aa82c`](https://github.com/ititcloud/rutil-vm/commit/0ca1aa82cc681e124ce3c53cff9fca9123d1daca))
  - 호스트 - 하루 사용량에 대한 선 그래프 값 추가 ([`ae57efd0`](https://github.com/ititcloud/rutil-vm/commit/ae57efd02151e2cc43aba760e7915db20fda63b4))
  - 가상머신- 사용량에 대한 반원 그래프 값 추가 ([`e970f0bf`](https://github.com/ititcloud/rutil-vm/commit/e970f0bf42c6f598705c2dac282cc6814034b349))
  - 가상머신 모델 변경 (`VmVo` -> `VmViewVo`)
  - 가상머신 - 네트워크 인터페이스 수정 (기능)
  - 가상머신 - 스냅샷 수정 (기능)
- [@lmy9237][lmy9237]
  - +,-버튼 컴포넌트적용
  - 모든 테이블 페이징처리
  - 디자인반영
  - 대시보드 그래프 수정
  - 테이블선택오류 수정

### Removed 

- [@chanhi2000][chanhi2000]
  - 불필요한 CORS처리 부분 제거 ([`bf760e05`](https://github.com/ititcloud/rutil-vm/commit/bf760e05482caed2d32ce348fdc8763ff69d357c))
<!-- - [@dhj27][dhj27] -->
- [@lmy9237][lmy9237]
  - 대시보드 - 그래프 숫자제거

### [`web-v0.2.2`][web-v0.2.2]: 프론트

### Added

- [@chanhi2000][chanhi2000]
  - `react-scan` 추가: 렌더링 성능 측정 ([`acaf854c`](https://github.com/ititcloud/rutil-vm/commit/acaf854c7fd5a8ab4f3ea0e310698e66f01c85e0))
  - 그래픽콘솔 화면 기초 구성 ([`10ead1e6`](https://github.com/ititcloud/rutil-vm/commit/10ead1e6354f5fe2bac0f1f105dc60f62094a137))
<!-- - [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - socket 통신 정상화 ([`bf760e05`](https://github.com/ititcloud/rutil-vm/commit/bf760e05482caed2d32ce348fdc8763ff69d357c))
- [@dhj27][dhj27]
  - 대시보드 - host 사용량 선 그래프 추가 ([`6a987059`](https://github.com/ititcloud/rutil-vm/commit/6a987059a226943d3296d2d2783696fb0158bf62))
  - 대시보드 - 스토리지 도메인 사용량 선 그래프 추가 ([`211cb8b3`](https://github.com/ititcloud/rutil-vm/commit/211cb8b3212869f21014b02443e85198148622e1))
  - 대시보드 - 그래프에서 가상머신 'hostedEngine' 표시 제외 ([`0ca1aa82c`](https://github.com/ititcloud/rutil-vm/commit/0ca1aa82cc681e124ce3c53cff9fca9123d1daca))
  - 호스트 - 하루 사용량에 대한 선 그래프 추가 ([`ae57efd0`](https://github.com/ititcloud/rutil-vm/commit/ae57efd02151e2cc43aba760e7915db20fda63b4))
  - 가상머신- 사용량에 대한 반원 그래프 추가 ([`e970f0bf`](https://github.com/ititcloud/rutil-vm/commit/e970f0bf42c6f598705c2dac282cc6814034b349))
  - 가상머신 - 네트워크 인터페이스 디자인 및 기능 수정
  - 가상머신 - 스냅샷 기능 및 디자인 수정
  - 템플릿 - 디스크 페이지 디자인 수정
  - 템플릿 - 가상머신 페이지 디자인  수정
<!-- - [@lmy9237][lmy9237] -->

### Removed 

<!-- - [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

---

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

[web-v0.2.3]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.3...web-v0.2.3
[api-v0.2.3]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.3...api-v0.2.3
[web-v0.2.2]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.1...web-v0.2.2
[api-v0.2.2]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.1...api-v0.2.2
[web-v0.2.1]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.0-beta2...web-v0.2.1
[api-v0.2.1]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.0-beta2...api-v0.2.1
[api-v0.2.0-beta2]: https://github.com/ititcloud/rutil-vm/tree/api-v0.2.0-beta2

[chanhi2000]: https://github.com/chanhi2000
[dhj27]: https://github.com/dhj27
[lmy9237]: https://github.com/lmy9237