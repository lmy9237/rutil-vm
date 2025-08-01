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


## 4.0.0-3 - 2025-08-01

- [`api-v4.0.0-3`][api-v4.0.0-3]: 백엔드
- [`web-v4.0.0-3`][web-v4.0.0-3]: 프론트앤드

### 일반

- `${back}` 코틀린 코루틴 라이브러리 연동 (백엔드 비동기 처리에 목적) [@chanhi2000][chanhi2000]
- `${front}` 체크박스 (shadcn 컴포넌트) 생성 및 부분 적용 (80%) [@chanhi2000][chanhi2000]
- `${front}` RutilVM 페이지 favicon 변경 (svg형태) [@chanhi2000][chanhi2000]
- `${front}` 트리메뉴 네비게이션: RutilManager 클릭 시 페이지 이동 정상화 [@chanhi2000][chanhi2000]
  - 네트워크 쪽 Rutil Manager 에서 데이터 센터 이름을 클릭하면 Computing 쪽  Rutil Manager로 넘어 가지 않도록 방지"
- 우클릭메뉴 기능 보강 [@chanhi2000][chanhi2000]
  - `${front}` 생성 (또는 가져오기) 버튼 은닉 (언제나 비활성이기 때문)
  - `${back}`/`${front}` 디스크 “편집”/”삭제”/”이동” 조건 정의 및 메뉴출력 API 보강
- `${front}`토스트 행위 변경 [@chanhi2000][chanhi2000]
    - 일정한 시간 내에 무조건 사라지도록 
    - 상태별 아이콘 추가, 디스크 업로드 메시지 변형
    - 성공 했을 때에 대한 응답은 표출하도록

### 데이터센터

- `${back}` 데이터센터 출력 API 항목 추가: 상태의 용어값 (한글/영어) 출력 [@chanhi2000][chanhi2000]
- `${front}` 데이터센터 > 논리 네트워크 편집: 모달 표출 문제 해소 [@chanhi2000][chanhi2000]
- `${back}` 데이터센터 목록: 호스트 개수 추가 [@dhj27][dhj27]
- `${front}` 데이터센터 action버튼: 활성화된 데이터센터는 삭제 버튼 비활성화 [@lmy9237][lmy9237]

### 호스트

- `${front}` 호스트 > 호스트 네트워크 기능변경 [@lmy9237][lmy9237]
  - 비동기 아이콘 옆에 조금 띄우기
  - 저장 버튼 눌렀을 때 처리중일 경우 “저장 중 ….” 문구표"

### 가상머신

- `${front}` 가상머신 목록
  - HostedEngine 일 때, 별 표시 아이콘 가리기  [@lmy9237][lmy9237]
  - 체크박스 추가 [@lmy9237][lmy9237]
    - 체크박스 선택은 Ctrl키 클릭 없이도 다중 선택 가능
    - 컬럼에 전체 선택 체크박스 추가"
  - “한번 실행“ 표시 제외 [@dhj27][dhj27]
  - 가상머신 재설정 (next_run) 아이콘 추가 [@dhj27][dhj27]
- 가상머신 > 일반
  - `${back}` 가상머신 스크린샷 이미지 출력 해소 (60번에서 발생) [@chanhi2000][chanhi2000]
  - `${front}` 박스 안 텍스트 잘리는 것 표출 정상화 [@lmy9237][lmy9237]
- `${front}` 가상머신 텝 싱테 유지 안정화 [@lmy9237][lmy9237]
  - ‘모니터' 탭에서 tree메뉴의 꺼진 가상머신을 누르면 일반 페이지로 가도록 설정"
- `${front}` 가상머신 > 생성: 실행 중인 상태에서는 디스크 삭제 비활성화
- `${front}` 가상머신 > 편집
  - 입력값 초기화 현상 방지 [@chanhi2000][chanhi2000]
  - 부트옵션 → CD/DVD 연결값 반영 안되는 현상 복구 [@chanhi2000][chanhi2000], [@dhj27][dhj27]
- `${front}` 가상머신 생성/편집
  - 디스크 텍스트 넘쳐 잘리는 것 표출정상화 [@lmy9237][lmy9237]
  - 디스크 연결: 체크박스 항목 가운데 정렬 [@dhj27][dhj27]
- `${back}`/`${front}` 기싱머신 > 모니터: 신규 페이지 디자인
  - 항목 당 하나씩 그래프 구성 (CPU, 메모리, 네트워크) [@lmy9237][lmy9237]
  - 항목 당 3분 간격 수치 정보를 가진 API 생성 [@dhj27][dhj27]
  - 실행 된 이후 사용량 값만 출력 [@dhj27][dhj27]
- `${back}` 가상머신 > 마이그레이션 기능 안정화
  - 마이그레이션 가능한 호스트 목록 수정
    - 호스트엔진 가상머신: 배포가능한 호스트 [@dhj27][dhj27]
    - 일반 가상머신 일 때: 기동 또는 정상적으로 살아있는 호스트 [@dhj27][dhj27]
  - 모달 탭에 라디오버튼 추가 [@lmy9237][lmy9237]
- `${front}` 가상머신 > 논리네트워크: 버튼 활성화 수정 (vm 상태와 nic 상태에 따른 삭제 버튼 비활성화) [@dhj27][dhj27]
- `${front}` 가상머신 > 스냅샷: 실행 중인 가상머신 스냅샷은 삭제,생성 버튼만 활성화 [@lmy9237][lmy9237]
- `${front}` 가상머신 action버튼 활성화 조건 재정리
  - 콘솔(일반페이지): 전원을 켜는 중일 때 활성화 [@chanhi2000][chanhi2000]
  - 스냅샷 생성: 1개 이상 선택하면 비활성화 [@lmy9237][lmy9237]
  - 템플릿생성 → up인 가상머신이 1개라도 있으면 비활성 [@lmy9237][lmy9237]
  - 마이그레이션: 한 개만 가능하게 변경 [@dhj27][dhj27]

### 탬플릿 

- `${front}` 템플릿 action버튼: "새 가상머신 만들기” 버튼 임시 비활성화 처리 (미비된 기능) [@lmy9237][lmy9237]

### vNIC 프로파일

- `${front}` vNIC 프로파일 생성: 네트워크 목록 출력 정상화 [@dhj27][dhj27]
- `${front}` vNIC 프로파일 목록: 포트 미러링 표시 수정: 있을 때 “O” 없을 땐 미출력 [@dhj27][dhj27]

### vNIC 프로파일

- `${back}`/`${front}` 네트워크 > vNIC 프로필: 목록 출력 정상화 (무한 로딩현상 문제) [@chanhi2000][chanhi2000]
- `${back}`/`${front}` 네트워크 공급자 목록 출력 API 정상화 (무한 로딩현상 문제) [@chanhi2000][chanhi2000]
- `${front}` 네트워크 > 클러스터: “네트워크 관리” 버튼 임시 비활성화 처리 (미비된 기능) [@lmy9237][lmy9237]
- `${front}` 네트워크 > 가상머신: “삭제” 버튼 제거 [@lmy9237][lmy9237]

### 스토리지 도메인

- `${front}` 스토리지 도메인 Tab 기억처리 정상화 [@lmy9237][lmy9237]
- `${front}` 스토리지 도메인 > 데이터센터: 분리 모달 스타일 수정 [@lmy9237][lmy9237]
- `${front}` 스토리지 도메인 > 가상머신: 상태 정보 출력 추가 [@dhj27][dhj27]
- `${front}` 스토리지 도메인 > 디스크: 삭제 후 경로 수정 [@dhj27][dhj27]
- `${front}` 스토리지 도메인 > 생성: 호스트 목록 수정 (호스트 상태에 따라 출력) [@dhj27][dhj27]
- `${front}` 스토리지 도메인 action버튼 활성화 조건 보강
  - “삭제”, “파괴”: 연결 해지 상태 일 때 활성화 [@chanhi2000][chanhi2000]
  - “유지보수”: 선택 된 데이터센터가 없으면 비활성화 [@lmy9237][lmy9237]

### 디스크

- `${back}` 디스크 유형에 맞는 사전할당정책 정정 [@chanhi2000][chanhi2000]
- `${front}` 디스크 > 업로드: 업로드 중일 때 토스트에 페이지 새로고침에 대한 경고 문구 표시 [@chanhi2000][chanhi2000]
- `${back}` 디스크 > 업로드: QCOW/ISO 유형 이미지 업로드 업로드 [@chanhi2000][chanhi2000]
- `${front}` 디스크 생성: 에서 할당정책에 사전할당 항목을 선택하면 오류뜸 (ovirt에선 만들어짐)<br/>디스크 사전할당 일 때, 증분백업 disabled처리" [@lmy9237][lmy9237]

### 이벤트

- `${front}` 이벤트 목록: 페이징 및 탭 클릭에 따른 목록 출력 정상화 [@chanhi2000][chanhi2000],  [@lmy9237][lmy9237]

<!--
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
-->

---

## 4.0.0-2 - 2025-07-25

- [`api-v4.0.0-2`][api-v4.0.0-2]: 백엔드
- [`web-v4.0.0-2`][web-v4.0.0-2]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${front}` 각 상세 페이지 별 탭에 대한 기억처리
  - `${devops}` ovirt,rutilvm 환경관리 bash_profile 추가개발
- [@dhj27][dhj27]
  - `${back}${front}` : datacenter 용량/사용량 (`useUsageDataCenter`)
  - `${back}${front}` : cluster 용량/사용량 (`useUsageCluster`)
  - `${back}` : AllDisksForVmsRepository, AllDisksForVmsEntity, DiskVmElementExtendedEntity 추가
  - `${back}` : 호스트가 있는 데이터센터 목록 출력 api 추가 (스토리지 도메인 생성 데이터센터 목록   출력위해)
  - `${front}` :가상머신 마이그레이션 모달 2(디스크 이동 포함)
- [@lmy9237][lmy9237]
  - `${front}` 가상머신 액션버튼 > 마이그레이션 활성화 조건 추가

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${front}`/`${back}` 스토리지 도메인 > 가상머신 가져오기 목록 느림 → db 로 코드변환
  - `${front}` 스토리지 도메인 연결 버튼 활성화에 대한 조건 정상화
  - `${front}` 스토리지 도메인 > 디스크 출력기능 정상화 (진행중)
  - `${front}`/`${back}` 스토리지 도메인 > 가상머신 가져오기 항목 문제 (ovf관련)
  - `${front}`/`${back}` 스토리지도메인 / 데이터센터 상태 값에 따른 UI반응 및 목록출력 정상화 출력기준변경
  - `${front}` 호스트 생성/편집: disabled 일 때 toggle switch 안보이도록 (레이블 css 처리)
  - `${back}`/`${front}` 네트워크 > 호스트 목록에서 비동기여부 확인기능 추가
  - `${front}` 이벤트: 탭 클릭 시 페이지 1로 설정
  - `${front}` 데이터센터 → 클러스터 삭제 시 부모 데이터센터로 페이지 이동
  - `${front}` 호스트 → 가상머신 생성하면 자동으로 해당 호스트 선택
  - `${back}` 디스크 업로드: qcow 업로드 복구
  - 네트워크 > vNIC 프로필: 목록 출력 정상화 (로딩중에서 값 표출 안됌)
  - 네트워크 > 클러스터 > 네트워크관리: 목록 출력 정상화 (값 불량)
  - `${front}` 가상머신 시작 대기중 상태 일 때 트리메뉴에서 없어짐
- [@dhj27][dhj27]
  - `${back}` : template disk 생성 부분 (qcow, raw)
  - `${back}` : 호스트 10분 출력 그래프 수정
  - `${back}` : 디스크 이동/복사에 필요한 스토리지 도메인 목록 api 수정
  - `${back}` : rutilvm 대시보드에 들어갈 network개수 추가
  - `${back}` : hostnic 수정(미완)
  - `${back}` : 가상머신 마이그레이션 가능한 호스트 목록 수정(미완)
  - `${back}` : disk, domain 단위 단일화 gb -> byte
  - `${front}` : 호스트 > 네트워크 어뎁터 이름항목에 본딩이 있을 떄 대괄호 안으로 slave이름목록 추가
  - `${front}` : 디스크 업로드 모달: 스토리지 용량 표시 추가
  - `${front}` : 디스크 이동,복사 모달:  용량값표시 불량 해소, 선택박스 목록출력 등등
  - `${front}` : 호스트 네트워크 모달: 비동기 항목 토글 ->체크박스 변환
  - `${front}` : 데이터 센터 일반 항목(가상머신, 클러스터 등) 개수 추가
  - `${front}` : 클러스터 생셩/편집: network 목록 값 출력 문제해소
  - `${front}` : 도메인 생성/편집: 텍스트 입력값 사라지는 문제 해결
- [@lmy9237][lmy9237]
  - `${front}` 호스트네트워크 드레그기능 오류 수정 ( 상태변경 후 확인버튼을 누르면 네트워크가 계속빠지는 현상)
  - `${front}` 가상머신 디스크모달 체크박스 간격 수정
  - `${front}` 템플릿생성 모달 테이블 간격수정 (진행중)
  - `${front}` 도메인 파괴 모달 디자인 및 문구내용 수정
  - `${front}` 디스크 이동,복사 모달 가로 스크롤 넘치는 것 수정
  - `${front}` 삭제모달 스타일 통일(DELETE 모달과 모양 및 크기 스타일 통일)
  - `${front}` bar그래프 색 통일
  - `${front}` 쿼리키 수정
  - `${front}` 미리보기 아이콘 교체 (폰트어썸삭제)
  - `${front}` 가상머신 네트워크인터페이스 생성,편집 디자인 수정
  - `${front}` “호스트 재부팅 상태 확인” 모달 디자인 수정
  - `${front}` 네트워크 → 템플릿 테이블 선택 안됨
  - `${front}` 호스트 생성 모달 인증 텍스트 공간 띄우기
  - `${front}` 가상머신 action버튼 조건 수정
  - `${front}` 호스트 테이블 데이터 가운데정렬(spm,상태,업타임,HA)
  - `${front}` 마이그레이션 모달 디자인수정
  - `${front}` 가상머신 → 디스크 가상머신이 켜져있거나 일시중지상태 가상머신의 디스크는 삭제버튼 비활성화
  - `${front}` footer 작업명 컬럼넓이 늘리기
  - `${front}` 스토리지 도메인 > 데이터센터: 활성화 돼있는 데이터센터가 있으면 “연결” 버튼 비활성화
  - `${front}` 데이터센터 > 스토리지 도메인: 선택 된 스토리지도메인이 없으면 “유지보수” 버튼 비활성화

### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
  - `${front}` 크롬이 아닌 다른브라우저에서 input type password일 때 기본적으로 나오는 눈 아이콘 제거

## 4.0.0 - 2025-07-18

- [`api-v4.0.0`][api-v4.0.0]: 백엔드
- [`web-v4.0.0`][web-v4.0.0]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${back}` 스케쥴러: 가상머신 스크린샷에 대한 불필요한 이벤트 로그를 주기적으로 제거
  - `${back}` API호출에 대한 연결상태 관리 > session 무한 생성 방지
  - `${back}` 스크린샷에 대한 불필요한 이벤트 로그를 주기적으로 제거
  - `${back}` 네트워크 정보 DB 처리 (조회, DNS수정, 등등)
  - `${front}` 테스트용: '무단배포금지입니다.' 워터마크 표시 처리
  - `${back}` OVF 데이터 가공 (스토리지 도메인에서 가상머신 가져오기)
- [@dhj27][dhj27]
  - `${back}`:  hostNic syncallNetworksHost 추가
  - `${front}`: Host 그래프 값 추가
  - `${front}`: rvi16RefreshTry, rvil16Migration 아이콘 추가
    ![Group 9.svg](attachment:28c4ec1a-469b-40bb-9bae-0baa58f857f9:Group_9.svg)
- [@lmy9237][lmy9237]
  - `${front}` : 토스트 검은색 테두리 추가하기
  - `${front}` : 테이블 컴포넌트 분리
  - `${front}` : vm편집모달 선택호스트 id안보이는 것 추가
  - `${front}` :  눈모양 아이콘 추가
  - `${front}` :  호스트차트 툴팁추가
  - `${front}` :  context-menu shadc추가
  - `${front}` :  가상머신 신규/편집: `LabelSelectOptionsID` 에 대한 기능 추가
  - `${front}` : 현재 이동/복사 대상인 디스크의 스토리지 도메인의 상태가 active가 아니라면 이동/복사/삭제 불가능 기능 추가

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${front}` 개발환경일 때 selectbox에 ID 표출
  - `${front}` 트리메뉴 > Computing  우클릭 반응 정상화
  - `${front}` 가상머신 생성/편집: 메모리 값 입력 방식 변경 (select -> 직접입력), GiB 단위변환포함
  - `${front}` 호스트 목록 컬럼 상태: SPM 상태와 상태 정정
  - `${back}`/`${front}` 네트워크 생성/편집: DNS값 변경 기능 복구
  - `${front}` 스토리지 도메인 > 가상머신 가지오기: 모달 및 목록에 필요항목 OVF 값과 연결
- [@dhj27][dhj27]
 - `${back}${front}` : 스토리지 도메인 목록 정리 (디스크 이동 스토리지 도메인 목록 오류)
 - `${back}${front}` : vm import 
 - `${back}`: host per(cpu,memory,network)
 - `${back}`: dashboard 정리
            - storage up/down 추가(상태x)
            - storage 정렬
            - host 1시간 값 출력(불완전)
 - `${back}`: 클러스터가 가진 호스트/가상머신 수 수정
 - `${back}`: diskattachment interface 수정
 - `${front}`: graph endpoint 변경
 - `${front}`: hostNic network insync 변경
 - `${front}`: migration modal, button 처리
 - `${front}`: rutilManager info 용량 데이터수정
 - `${front}`: host ha 값 변경(globalMaintenance -> hostedActive)
 - `${front}`: storagedomain template 크기 추가(불완전)
 - `${front}`: storageDomain 타입에 따른 경로 표시 수정
 - `${front}`: 테이블 width 수정 및 테이블 값 수정
 - `${front}`: host 비동기 아이콘 수정 [rvi16TryRefresh]
 - `${front}`: VmDiskModal, VmDiskConnectionModal 수정(기능완료)
 - `${front}`: TemplateModal 수정(기능 완료)
- [@lmy9237][lmy9237]
  - `${front}` : 대시보드 원그래프 ‘사용률’ 대신 ‘AVG’로 바꾸기
  - `${front}` : 호스트 일반페이지 글자 잘리는 것 수정
  - `${front}` : 가상머신 가져오기 render2 네트워크 테이블 수정
  - `${front}` : hostedengine 아이콘대신 배경색 or 글자색 변경(현재 주석처리)
  - `${front}` : 마이그레이션 모달 UI 수정
  - `${front}` : vnic프로파일 select선택안바뀜 수정
  - `${front}` : vm 일반페이지 +more버튼 가려지는 것 수정
  - `${front}` : 테이블안에 체크박스는 가운데정렬
  - `${front}` : 대시보드 bar그래프 색상 grid와 동일하게 맞추기
  - `${front}` : 호스트 네트워크 툴팁가려지는 것 수정     
  - `${front}` : 대시보드 원그래프 숫자와 사용률 위치 바꾸기
  - `${front}` : 워터마크 크기로 스크롤 생기는 것 방지 + css정리

### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
  -`${front}`:  VmCreateDiskConnectionModal, VmCreateDiskModal
- [@lmy9237][lmy9237]

---

## 0.3.8 - 2025-07-11

- [`api-v0.3.8`][api-v0.3.8]: 백엔드
- [`web-v0.3.8`][web-v0.3.8]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${back}`/`${front}`: 가상머신 > 실행 중인 CD-ROM 변경
  - `${back}`/`${front}`: 가상머신 > 디스플레이 유형 생성/변경
  - `${front}`: 모든 로딩이 완료 된 후 모달 UI를 보여주는 구조 마련
    - 데이터센터 생성/편집
    - 클러스터 생성/편집
    - 호스트 생성/편집/액션
    - 사용자 생성/편집/액션
    - 디스크 업로드
    - 모든 삭제
  - `${back}`: 디스크 이미지 업로드 API: 이미지 전송관련 상태 조회
  - `${font}`: 가상머신 > VNC: Fullscreen 기능추가
- [@dhj27][dhj27]
  - `${front}`:  리액트 훅 추가
    - `useSelectFirstItemEffect`
    - `useSelectItemEffect`
    - `useSelectItemOrDefaultEffect`
  - `${front}`: 아이콘 rvi16TriangleUpTEST, rvi16EngineTEST 추가
  - `${back}`: VmController `detachVm` 추가
  - `${back}`: VmVo IsInitialized (vmware 업로드 상태 수정 필요!)
- [@lmy9237][lmy9237]
  - `${front}`:base모달 로딩중 디자인 추가
  - `${front}`: 모든 로딩이 완료 된 후 모달 UI를 보여주는 구조 마련
    - vnic프로파일 생성/편집
    - 도메인 생성/편집/가져오기/ 파괴
    - 도메인 데이터센터 유지보수/ 연결/ 분리/  모달
    - 디스크 생성/편집/이동/복사/업로드 모달
    - 네트워크 생성/편집/가져오기 모달
    - 호스트 본딩편집 / 네트워크편집/
    - 네트워크 인터페이스 생성/편집 
    - 가상머신 modals
    - vmdisk 생성/편집 수정
  - `${front}`:가상머신 nic: 마우스 hover헀을 때 Tx/Rx값처럼 상세값을 보여주는 툴팁 표출
  - `${front}`:가상머신 생성/편집: 시스템 메모리 크기 설정 입력란 우측에 단위 표시
  - `${front}`:디스크 - 데이터 유형별 나누기 (selectbox) → diskdupl참고
  - `${front}`:템플릿 > 디스크: 스토리지 도메인 툴팁 뜨게
    - 값 표출정보: `TemplateDisks.jsx` > `StorageDomainWithtoolTip`

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${back}`: 최근작업 API 변경
    - 스크린샷 기록 조회에서 은닉
    - 5분 단위로 스크린샷 기록 제거 스케쥴화
  - `${back}`: VMWare 가상머신 상세 여러건 조회
  - `${back}`: 가상머신 > 스크린샷: 조건 추가
  - `${front}`: 가상머신 생성/편집: 메모리 선택 단위 변환 MB -> GB
  - `${back}`: 가상머신 > VNC: 콘솔화면 출력 조건 개선
  - `${front}`: 가상머신 > VNC: 기타 action버튼 추가
  - `${front}`: 디스크 트리메뉴 우클릭 > 디스크 복사버튼 누르면 랜덤으로 정보 안담김
- [@dhj27][dhj27]
  - `${back}`: Vmware 가져오기(import) 기능 구현
  - `${back}`:  vmentity 수정
  - `${back}`:  vmware url encode 수정
  - `${back}`:  host 현재 네트워크 사용량 수정
  - `${front}`: StorageDomain import 오류 수정
  - `${front}`: useQuery 수정
  - `${front}`: vms engine 아이콘
  - `${back}${front}`: VmModal 디스크 완전 삭제 -> 단순 연결 해제로 변경(임시)
- [@lmy9237][lmy9237]
  - `${front}`: 가상머신 생성 nic 인덱스 번호 수정
  - `${front}`: 대시보드 bar그래프 찌부되는 것 수정
  - `${front}`: 네트워크 → 데이터센터 클릭 시 경로 수정
  - `${front}`: 가상머신 bar 개수에 따라 위치 조정
  - `${front}`: 호스트 네트워크 버튼위치수정
  - `${front}`: delete모달 아이콘 안나오는 것 수정
  - `${front}`: 토스트 컴포넌트 글자 넘치는 것 수정
  - `${front}`: 가져오기모달 디자인 수정
  - `${front}`:  `nav f-start` 아이콘 배경색 변경될때 깜박이는 것 빼기(radius 값 변경)
  - `${front}`: 다시 시작 중 (`reboot_in_progress`)일 때 종료, 전원끔 버튼 활성화 (`vm.isRunning`  으로 구분)

### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

---

## 0.3.7 - 2025-07-04

- [`api-v0.3.7`][api-v0.3.7]: 백엔드
- [`web-v0.3.7`][web-v0.3.7]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${front}`: 가상머신 > 콘솔(VNC): <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>del</kbd> 입력
  - `${back}`: 가상머신 생셩/편집: 운영시스템 유형 추가 (Windows Server 2025)
  - `${back}`: VMWare API 연동: 가상머신 상세조회 API
  - `${back}`: 외부 공급자 API 최종 정보 지정 및 마무리
- [@dhj27][dhj27]
  - `${back}`: Vmvo statusDetail 추가
  - `${back}`: 외부 공급자 (vmware) DB로 추가
  - `${back}`: 외부 공급자 수정
  - `${front}`: `VmStartOnceModal`, `VmModal - VmConsole` 추가
- [@lmy9237][lmy9237]
  - `${front}`: 가상머신 가져오기 모달 추가/수정
  - `${front}`: 가상머신 가져오기모달 상세정보 추가
  - `${front}`: 공급자 페이지(일반, 인증 키) 제작
  - `${front}`: 공급자 상세정보 추가
  - `${front}`: select박스 정렬(abc 순) 기능추가
  - `${front}`: 일반페이지 카드박스 데이터가 넘치면 more 라는 버튼을 만들고 누르면 해당페이지로 이동
  - `${front}`: 가져오기 모달 컴포넌트 분리

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${back}`/`${front}`: 가상머신 > 일반: (실행 중일 떄) 스크린샷 화면 연동
  - `${back}`/`${front}`: .디스크 > 업로드
    - 업로드 실 기능 복구
    - 파일의 유형에 맞는 설명 추가
    - 진행중 Toast 복구
- [@dhj27][dhj27]
  - `${back}`: Vm startOnce method 변경
  - `${back}`: Vm fqdn 변경
  - `${front}`: `SettingProviderModal` 수정
  - `${front}`: vms 목록에 runOnce 항목 추가
- [@lmy9237][lmy9237]
  - `${front}`: 일반페이지 카드박스 클래스명 추가/수정
  - `${front}`: 삭제모달 수정
  - `${front}`: 공급자 path경로수정
  - `${front}`: 가상머신 가져오기 모달 외부 공급자 누르면 input disabled처리(암호제외)
  - `${front}`: 가상머신 가져오기모달 이름.,운영시스템, 가상머신 생성쪽 시스템 -> 메모리부분 넣기 / 네트워크쪽은 체크박스 하나만들어두기
  - `${front}`:  템플릿 생성 모달: 총 용량 콘솔 diskImageVo 에 안뜸
### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

---

## 0.3.6 - 2025-06-26

- [`api-v0.3.6`][api-v0.3.6]: 백엔드
- [`web-v0.3.6`][web-v0.3.6]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${front}`: 가상머신 > 일반 미리보기 화면
- [@dhj27][dhj27]
  - `${back}`: 도메인 생성 - 내보내기 기능 구현
  - `${back}`:  Network - `NetworkClusterEntity`, `NetworkClusterViewRepository` 추가
  - `${back}`: StorageDomain <비활성화, 분리> 코드 안정화(`cleanFinishedTasks`  추가)
  - `${back}`: Graph 스토리지 도메인 import_export 제외
  - `${back}`: 공급자 추가 (`ExternalHostProviderBuilder` , `addProvider`, `editProvider`, `deleteProvider` ) [기능안됨]
  - `${front}`: 공급자 페이지 추가 (`SettingProviders`, `SettingProviderModals`, `SettingProviderModal`, `SettingProvidersActionButtons`)
- [@lmy9237][lmy9237]
  - `${front}`: 데이터센터, 네트워크, 클러스 일반페이지 추가
  - `${front}`: 공급자 페이지 제작

### Changed/Fixed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
  - `${front}`: DataCenter - `findAllActiveStorageDomainsFromDataCenter` 수정 (db로 변경 및 import_export 제외)
  - `${front}`: Host - Host 업타임 추가
  - `${front}`: Vm - vnicProfile 예시 페이지 추가
  - `${front}`: Template: 모달 수정
  - `${front}`: Network - 상태 추가, 모달 편집 수정(async 추가)
  - `${front}`: VnicProfile - 편집 수정
  - `${front}`: StorageDomain - 파괴 활성화
  - `${front}`: 모달 중복 이름 검사 코드 추가 (Network, Disk 제외)
  - `${front}`: emptyIdNameVo() 수정
- [@lmy9237][lmy9237]
  - `${front}`: bar 컴포넌트 재구성(폰트사이즈 변경)
  - `${front}`: bar차트 라벨 안맞는것 수정 
  - `${front}`: 일반페이지 박스들 제목 13px 통일
  - `${front}`: 네트워크 일반페이지 수정
  - `${front}`: 호스트 일반페이지 박스 순서변경
  - `${front}`: 클러스터 일반페이지 수정
  - `${front}`: 도메인,디스크 일반페이지 테이블 컬럼제목, 아이콘 변경
  - `${front}`: VmGeneralBarChart 컴포넌트재구성(이름바꿔야함)
  - `${front}`: 호스트,가상머신,도메인,디스크 그래프 값넣기
  - `${front}`: 일반페이지 용량 및 사용량 그래프 개수에 따라  flex-direction: column 조건 걸어주기
  - `${front}`: 모달 hr z-index줄이기
  - `${front}`: 테이블 th,td간격 일정하게
  - `${front}`: 디스크 목록 필터버튼 높이 수정
  - `${front}`: 트리메뉴 데이터센터 경로 수정(클러스터로 가는문제)
  - `${front}`: 가상머신 > 일반: 정보 연결
      - 네트워크 어댑터 정보 (`vnicProfile`)
      - 디스크 (`diskAttachment`)
  - `${front}`: btn-tab-nav-group 선 잘리는 것 수정( + 고정)

### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
  - `${front}`: 대시보드 그래프 사용가능 % 삭제
  - `${front}`: vm-info-box-outer 삭제
---

## 0.3.5 - 2025-06-20

- [`api-v0.3.5`][api-v0.3.5]: 백엔드
- [`web-v0.3.5`][web-v0.3.5]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${back}`: 상태 값 관리를 위한 enum 생성 및 기능 정리
  - `${back}`/`${front}`: 가상머신의 운영시스템에 대한 아이콘 조회
  - `${back}`: VMWare API 구현 (v2v용)
- [@dhj27][dhj27]
  - `${back}`: Entity 생성
    - `DwhHostConfigurationFullCheckEntity`, `DwhHostConfigurationFullCheckRepository`, `VmTemplateEntity`, `VmTemplateRepository`, `VmTemplateStatus`
  - `${front}`: 가상머신
      - 가상머신 모달에 들어가는 디스크 모달 추가 (`VmCreateDiskConnectionModal`, `VmCreateDiskModal`)
  - `${front}`: util: emptyIdNameVo(), checkDuplicateName() 추가
- [@lmy9237][lmy9237]
  - `${front}`: 리액트차트 추가
  - `${front}`: vm-box-default 컴포넌트분리(클래스이름변경 필요)
  - `${front}`: GeneralLayout 컴포넌트분리

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${front}`: 호스트 > 네트워크: 목록출력 오류
  - `${back}`/`${front}`:  트리메뉴 우클릭 기능 정상화
    - 우클릭했을때 상태 반영 오류(ex 켜진 가상머신은 마이그레이션 활성화)
    - 스토리지 도메인 > 일반: 경로 값 누락 (NFS만 해당)
- [@dhj27][dhj27]
  - `${back}`: entity Type 수정
  - `${back}`: findUnattachedDiskImageFromDataCenter 수정
  - `${front}`: 가상머신: 모달 수정 (VmModal, VmDiskModal, VmDiskConnectionModal, VmDiskDeleteModal )
  - `${front}`: 스토리지 도메인: 모달 수정
  - `${front}`: DataCenterModal 쿼터모드 수정
  - `${front}`: ClusterModal cpuArc, cpuType, bisoType 수정
- [@lmy9237][lmy9237]
  - `${front}`: 가상머신 ,호스트,루틸매니저,도메인 일반페이지 디자인수정
  - `${front}`: 일반페이지 스냅샷, 콘솔버튼 연결
  - `${front}`: lable 문자열 Localization 변경
  - `${front}`: 도메인 테이이블 컬럼 사이즈
  - `${front}`: 호스트네트워크 높이 맞추기(반응형)
  - `${front}`: 도메인 상세페이지 정보 틀린 것 수정(제목,데이터)
  - `${front}`: path.jsx 쪽에 margin-bottom값 주기 (여백)
  - `${front}`: rutil상세페이지 용량 및 사용량 네트워크가 아니라 스토리지로 변경
  - `${front}`: 대시보드
    - 대시보드 bar차트 navigate경로 오류 수정
    - bar 범위 넘는오류 수정
    - sidebar 넓게 늘렸을 때 그래프 겹치는 오류 수정(아래로 떨어지게)
  - `${front}`: 가상머신
    - 그래프 값 넣기
    - 일반: 용량 및 사용량  바 색 (`#6396d8` ) → 가상머신은 빨간색으로 고정
    - 상세페이지 콘솔박스 상세페이지 크기줄이기

### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

---

## 0.3.4 - 2025-06-13

- [`api-v0.3.4`][api-v0.3.4]: 백엔드
- [`web-v0.3.4`][web-v0.3.4]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${back}`: 디스크 가져오기 관련 API 개발을 위한 JPA 엔티티 개발
    - `unregistered_dsk`
    - `unregistered_disk_to_vm`
    - `unregistered_ovf_of_entities`
- [@dhj27][dhj27]
  - `${back}`: Disk API 속도 개선
  - `${back}`: VM API 속도 개선
  - `${back}`: Snapshot API 추가
  - `${back}`: StorageDomain API 속도 개선
  - `${back}`: VM 마이그레이션 가능한 호스트 목록 출력(마이그레이션 대상 호스트와 현재 호스트의 네트워크 비교 후 같은 값이 있어야만 넘어갈 수 있음)
  - `${back}`: 대시보드 가상머신 아이디 추가
  - `${back}`: Entity 생성
      - `BaseDisksRepository`,  `BaseDiskEntity` , `DiskStatus` , `DiskStorageType`, `AllDisksRepository` , `AllDiskEntity`
      - `Origin`, `VmStatus`, `VmsRepository`, `VmsEntity`,
      - `SnapshotsRepository`, `SnapshotEntity`
      - `MigrationSupport`, `StorageDomainEntity`, `StorageDomainsRepository`, `StorageDomainStatus`, `StorageDomainType`, `StorageDomainPoolStatus`, `StorageType`
- [@lmy9237][lmy9237]
  - `${front}`: path.jsx   Breadcrumb로 바꾸기
  - `${front}`: 추후 디스크에 디스크 유형 탭 추가
  - `${front}`: 테이블 
    - tablerowclick 잘리면 ..처리 + 툴팁 추가
    - shift 클릭 후 다중 선택(추가)
    - 기존 정렬기능 추가
    - 컬럼 간격 드레그 추가
  - `${front}`: dashboard section에만 세로 드레그 추가( 세부페이지쪽에선 안쪽에만 드레그 추가)
  - `${front}`: 트리네비: 우클릭에 대한 선택 표시 필요 (우클릭에 대한 선택유지 특정색 부여)

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${back}`/`${front}`: 이벤트 목록 API 처리 개선
    - 전체, 데이터센터, 클러스터, 호스트, 가상머신, 탬플릿, 스토리지 도메인
  - `${back}`: 가상머신 목록 API 속도 개선에 따른 미비된 속성 연결
    - 스냅샷 정보 관계 연결
    - uptime 계산
  - `${front}`: 스토리지 도메인 > 디스크 생성 (데이터센터, 스토리지 도메인 지정 처리 정상화)
  - `${front}`: 스토리지 도메인 > 디스크 가져오기 목록 (API 및 조회기능 복구환료)
  - `${front}`: 가상머신 (상세) > 디스크: 우클릭 메뉴 비활성화
  - `${back}`/`${front}`: 설정 > 인증서
    - 인증서 우클릭메뉴: 구성
    - `ID`,  `버전` 컬럼 (일단 은닉)
    - 재갱신 정책: 영문 → 한글 변경
  - `${back}`/`${front}`: 스토리지 도메인 (상세) > 데이터센터:
    - 우클릭메뉴 재구성
    - action버튼 활성화 조건 부여
    - 연결 API 문제 개선
- [@dhj27][dhj27]
  - `${back}`: VM- Disk 연결 api 구현
  - `${back}`: VM- 모달수정
  - `${front}`: DataCenter
      - 모달-버전 적용 및 버전에 따른 selct 변경
  - `${front}`: Cluster
      - 모달-type 적용 및 cpuArc 수정
  - `${front}`: Host
      - HostNic 네트워크 required 수정
  - `${front}`: VM
      - 모달 수정
      - Snapshot 메모리 출력
      - 실행 중인 디스크 크기 추가 기능 수정
      - 마이그레이션 모달 수정
  - `${front}`: Disk
      - DiskContentType 필터링
  - `${front}`: StorageDomain
      - Status 수정
      - DomainModal, DomainImportModal 수정
- [@lmy9237][lmy9237]
  - `${front}`: `TableRowClick` : `tr-clickable w-full` > `tr-clickable` 변경
  - `${front}`: `TableColumnInfo.VMS` : `host` 컬럼을 `comment` 다음으로 위치순서 변경
  - `${front}`: 문구 변경: `Localization`: `"중지"` > `"정지"`
  - `${front}`: 가상머신 action button
    - `POWERING_UP`일 때 콘솔 버튼 활성화
    - 시작버튼 눌렀을 때 토스트 문구 수정
    - 시작 하면 디스크 수정버튼 비활성화
  - `${front}`: 가상머신(상세) > 스냅샷 > 우측 메뉴
    - 눌렀을 때만 화면에서 표출되도록 (`display: hidden`)
  - `${front}`: 최근작업
    - 테이블 top margin 제거
    - `(위치)` 문구 제거
    - footer 테이블 데이터 위치 가운데로 맞추기
  - `${front}`: 템플릿 편집 모니터수 안뜸(0개일때)
  - `${front}`: 대시보드
    - 특정 해상도에서 bar 그래프 내용이 넘치는 현상
    - 제목 부여 (그리드, 바)
    - 동그라미차트 툴팁 가운데로 맞추기
    - 그리드: 0%일 때 최소 1%값 부여 (그래프)
    - 원그래프: 외각 hover 했을 때 남은 사용량( 사용하지않은부분 지원x)
    - bar 그래프 선택 시, 상세화면으로 이동
  - `${front}`: 스토리지 도메인 (상세) > 연결해제 상태일 때 `삭제` 활성화(?)
    - 유지보수 상태로 변경 후 연결해제 상태가 됨
  - `${front}`: 네트워크 생성/편집
    - `${back}`: MTU 값을 `0`이 아니라 `1500` 을 주도록 (기본값)
    - `${back}`: `mtu` 값이 비어있을 때 기본으로 `1500` 할당 `const val DEFAULT_MTU = 1500`
    - `${front}`: 빈 값일 경우 이거나  값 변경 대상이 아닐 경우 무시
  - `${front}`:가상머신 디스크 생성 모달 디자인 변경
  - `${front}`스냅샷 생성중일때(스냅샷 이미지가 lock일때) 스냅샷 생성버튼 막기
  - `${front}`: 테이블
    - 0퍼센트 1프로로 표시
    - info 테이블 th,td 넓이 수정
    - 데이터센터 호스트수,클러스터수,호환버전 가운데 정렬
    - 이벤트 테이블 크기 수정
    - (운영) 테이블 내용 정렬: 최근작업 및 기타 테이블 값 내용 가운데정렬 적용 이상현상 (확인필요)
        - `.cell-ellipsis > display: block` 제거 필요
  - `${front}`:hostnic , vmsnapshot 컴포넌트 분리, css정리
  - `${front}`:설정
    - 사용자 테이블 컬럼 잘리는 것 수정
    - path경로 이상한 것 수정
  - `${front}`:디스크  필터링 박스 높이맞추기
  
### Removed

- [@chanhi2000][chanhi2000]
  - `${back}`: 이벤트 조회 통일화에 대한 관련 서비스 응용처리 제거
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

---

## 0.3.3 - 2025-05-30

- [`api-v0.3.3`][api-v0.3.3]: 백엔드
- [`web-v0.3.3`][web-v0.3.3]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${back}`: 호스트: 인증서 등록 API 개발
  - `${back}`/`${front}`: 호스트 > HA 유지관리 활성화/비활성화 API 구현 및 적용
  - `${front}`: 스토리지 트리메뉴 목록 구성: 도메인 내 디스크 목록 출력
  - `${back}`: 디스크 이미지 다운로드 API (구현 중)
- [@dhj27][dhj27]
  - `${back}${front}`: StorageDomain
    - 디스크 가져오기 한개만 가져오도록
    - 디스크 가져오기 modal
- [@lmy9237][lmy9237]
  - `${front}`: 스냅샷이 미리보기중이면 디스크를 생성할 수 없음(생성했어도 미리보기를 키면 디스크가 일시적으로 사라짐) + 조건추가
  - `${front}`: 가상머신 부팅가능한 디스크가없으면 실행안되는 문구 추가 + 조건추가
  - `${front}`: 호스트 네트워크 할당되지않은 네트워크 filter버튼 추가

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${front}`: 호스트 편집 > 클러스터 변경 할 수 하도록 select box 활성화
    - 이동 후 `NON_OPERATIONAL` 되는 장애처리 (
    - 주의:  클러스터를 바꿀 호스트가 __엔진 가상머신 실행가능__ 대상 일 경우 다른 클러스터에서 활성화가 불가능. 같은 클러스터에 있도록 구성해야 함.
  - `${front}`/`${back}`: 호스트 > `INSTALLING` 상태일 때 uptime 숫자 오류 (은닉처리)
  - `${front}`: 트리메뉴 Rutil Manager (대시보드 시점에서) 우클릭 메뉴 진입 시 오류 (경로 충돌)
   토스트 Progress 관련 상태에 대한 기능 추가 (미완)
  - `${front}`: 사용자 목록 테이블 컬럼 순서 변경 (사용자 ID가 맨 앞)
- [@dhj27][dhj27]
  - `${front}`: 호스트 그래프 값 최신화 안됨
  - `${back}${front}`: host nic [network의 insync 제외하곤 완료]
    - Bonding Modal 수정
    - NetworkAttachment Modal 수정 (insync 문제 제외)
  - `${back}${front}`: StorageDomain
    - 상태에 따른 가져오기 탭 변화
    - modal 내보내기 경로 명칭 변경
    - domain 연결 버튼 활성화
    - 데이터센터 분리 오류 수정
    - storage domain 가져오기
- 가져오기 service 분리
- [@lmy9237][lmy9237]
  - `${front}`: vm모달 스타일 수정
  - `${front}`: select박스 스타일 수정
  - `${front}`: diskactionmodal  선택안되는 것 수정
  - `${front}`: tablerowclick 빈칸일때 클릭방지(ex 가상머신목록 호스트)
  - `${front}`: 도메인 → 템플릿가져오기,가상머신 가져오기
    - 모달 안닫히는 것 수정
    - 각각 템플릿,가상머신 modals에 추가함
    - actionbutton 수정
  - `${front}`: 템플릿 생성모달 input크기 + 선택 안되는 것 수정
  - `${front}`: 템플릿편집  일반 체크박스  + 콘솔 (모니터수) 값 반영안되는 것 수정
  - `${front}`: table글씨잘리는 것 수정
  - `${front}`: 특정 템플릿으로 걸경우 nic이 자동으로 들어가게
    - nic index 조건 수정
  - `${front}`: Rutil Mangaer > Data Center 생성/편집 실패 수정
    - 팝업은 생성 되나 적용 불가능
  - `${front}`: 가상머신 nic삭제 기능 추가( + 삭제 후 경로 이상해지는 것 수정)
  - `${front}`: 특정 템플릿일 때 가상머신 생성,연결이 불가능하게
  - `${front}`: 가상머신 > 네트워크 인터페이스: 생성 모달 창
    - 확인/취소 버튼 반응 X
    - 사용자 지정 MAC주소 지정할 수 있도록 변경 (textbox)
  - `${front}`: 스토리지 도메인 - 디스크 삭제 후 경로 문제 수정
  - `${front}`: vNIC프로파일 생성 / 편집 → 통과버튼 이나 포트미러링 체크하면 오류표시 수정
  - `${front}`: 토스트 글씨 잘리는 것 수정(넘치는 것 떨어지게)
  - `${front}`: 가상머신 > VNC: 가상머신(콘솔)
    - 시작 또는 재시작 중 … 생성되는 Toast (불허용 요청)
    - 종료 시 생기는 문제 (불허용 요청)
  - `${front}`: 호스트 네트워크 디자인변경
  - `${front}`: nic 지정되지 않았으면 무한으로 +/- 버튼 뜰수 없음(DynamicInputList 수정)

### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

## 0.3.2 - 2025-05-23

- [`api-v0.3.2`][api-v0.3.2]: 백엔드
- [`web-v0.3.2`][web-v0.3.2]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${front}`: (개발용) oVirt 관련 페이지 링크 표출
  - `${front}`/`${back}`: 최근작업 > 작업 제거 API 구성 및 적용
- [@dhj27][dhj27]
  - `${front}` 호스트 어댑터 status 추가
- [@lmy9237][lmy9237]
  - `${front}`: 가상머신 ova모달 input정보넣기
  - `${front}`: 가상머신 상세페이지 action버튼 모달 추가
  - `${front}`: 모달 안 하단에 위치한 dropdown 메뉴 선택이 안되는 현상(→ shadcn으로 변경)
  - `${front}`: 우측메뉴 > 가상머신 > 콘솔 선택 메뉴 추가
### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${front}`: 최근작업 > 세부작업 컬럼 내 데이터 표출 변경 (진행완료 건 / 전체 건)
  - `${front}`: 테이블 이름/설명 컬럼 정렬 왼쪽
  - `${back}`/`${front}`: 운영시스템 선택 목록 API 구성 및 재횔용
  - `${back}`/`${front}`: 클러스터 레벨 정보 (CPU 아키텍처 정보) 조회 API 구성 및 적용 (데이터센터 모달)
  - `${front}`: 각 목록 API 호출에 대해 재갱신 (refresh) 처리 연결
  - `${front}`: 변경/제거 API 호출 후 모달 자동닫기 처리
  - `${front}`: 대시보드 원 그래프
     - 각 그래프에 대한 설명 추가
     - 문구 변경 `총` 앞에 붙이기
     - 처음 로딩 시 값 `0`으로 출력되는 문제 해소
  - `${front}`: 트리메뉴에서 Rutil Manager 우클릭 시 탭 메뉴 구성
  - `${front}`: Rutil Manager 상세정보에서 부팅시간 값 (UpTime 형태로) 출력되도록 보정
  - `${front}`: 스냅샷 미리보기 상태에서 `active vm before the preview` 문구 가리기
  - `${back}`: 도메인 목록 조회에서 "디스크 스냅샷 생성일자", "스냅샷설명", "연결대상" 항목 찾아 API 재구성 및 값 연결
  - `${back}`:  네트워크 생성/편집 모달 - DNS 관리 API 안정화
  - `${front}`/`${back}`: 가상머신 > 콘솔 remoteviewer 로 접근가능 파일 생성 API 구성 및 적용
  - `${front}`: Select, SelectID input에서 발생하는 오류에 대한 로직 처리
    - 데이터센터 > 클러스터: 생성/편집
    - 가상머신: 생성/편집
- [@dhj27][dhj27]
  - `${back}${front}`: 호스트 네트워크
  - `${back}${front}`: 스토리지 도메인 NFS 중복 검사 코드 추가
  - `${back}`: 가상머신 네트워크 인터페이스 api 수정
  - `${back}`: 가상머신 네트워크 인터페이스 에러 수정
             - network 변경에 따른 vnicProfile, network 에러 해결 (follow문제)
             - 네트워크 인터페이스 모달- vnicprofile passThrough 모드에 따른 유형 변화
  - `${front}`: VmNics 이름 정렬 출력
- [@lmy9237][lmy9237]
  - `${front}`: 관리버튼 화살표 색상수정
  - `${front}`: select박스 텍스트 넘치는 것 수정
  - `${front}`: 우클릭메뉴박스 선 잘리는문제 수정
  - `${front}`: 스냅샷모달 스크롤빼기
  - `${front}`: 템플릿 편집 모니터수 수정
  - `${front}`: 스토리지 도메인 상태 아이콘 문제        
  - `${front}`: 가상머신 > 디스크 모달 제목 및 내용 오출력(편집)
  - `${front}`: 이벤트 텍스트짤림 수정
  - `${front}`: 툴팁 잘리는 것 수정
  - `${front}`: 가상머신 생성/편집 > VNIC 오와 열 수정 
  - `${front}`: 대시보드 이벤트박스 구조 수정
  - `${front}`: 대시보드 아이콘 작아지는 것 수정
  - `${front}`: 대시보드 작은박스들 한줄로 떨어지게 하는 것 막기
  - `${front}`: 대시보드 그리드 박스 순서 가로로 변경
  - `${front}`: 테이블 tablerowclick 왼쪽정렬(확인필요)
  - `${front}`: 호스트 → 일반 → 그래프 잘리는 것 수정
  - `${front}`: 네트워크 트리구조 아이콘 색빠지는 것 수정
  - `${front}`: dropdown메뉴 색빠지는 것 수정
  - `${front}`: 가상머신 action버튼 활성화 및 표출 조건수정
  - `${front}`: input disabled 글씨 색 연하게
  - `${front}`: 템플릿 eidtmodal 수정(크기 작아지는문제)
  - `${front}`: 도메인 Rutil manager 네트워크 눌렀을 때 네트워크 버튼으로 활성화 되는 것 수정
  - `${front}`: vnic 프로파일 편집 설명부분 입력안되는 것 수정 + 한글 유효성검사 삭제
  - `${front}`: 네트워크 인터페이스 화살표 눌러도 토글 안됨
  - `${front}`: 호스트 테이블 간격 수정( 그래프 옆으로 옮기기)
  - `${front}`: 스토리지 도메인 파괴버튼없애기
  - `${front}`: bar차트 굵기 얇게 + 수치에 따라 색깔 정해주기
  - `${front}`: 대시보드: Grid: 가상머신 이름 넘치는 현상(크기고정)
  - `${front}`: 최근작업 상태컬럼 크기조정(줄이기)
  - `${front}`: 가상머신 스냅샷 > 세부항목 문구변경
  - `${front}`: 토글 버튼 비활성화 상태에 대한 처리 (Host 모달) 
  - `${front}`: 테이블 안 새로고침 버튼에 대한 기능 (뷰 활성화에 대한 표시 필요)
  - `${front}`: 대시보드 원그래프 글씨 가운데정렬(현재 밑으로 내려가있음)
  - `${front}`: 호스트 네트워크인터페이스 네트워크편집모달 찌그러짐
  - `${front}`: 스토리지 도메인 생성/연결 모달 창 (FC) →
      - ID 표출 은닉 (개발에서만 표출: SelectedIdView 활용)
      - 작업승인 위치바꾸기  , 빨간글씨 왼쪽으로 , 모달크기 줄이기
  - `${front}`: 디스크 할당 테이블 표출 불량 (내용이 넘쳐서 안보임)
  - `${front}`: 가상머신 > 콘솔 (액션버튼): 선택 후 닫기
  - `${front}`: 네트워크모달 사용자정의 input숫자 안지워지는 것(조건) 수정
  - `${front}`: asidebar 글자 잘리는 것 수정 + 테이블 글씨 잘리는 것 수정
  - `${front}`: 스토리지 도메인 > 디스크 액션버튼 > 디스크 화면: 디스크 목록 개수가 많아 질 때 밑으로 가면 Header부분이 짤리는    현상(.main-outer 의 스크롤 유무 질문드리기)
  - `${front}`: 템플릿 부분 새 가상머신 눌렀을 때 기본값 해당 템플릿으로 설정(모달열릴때 templateid가 안들어감)
  - `${front}`: 가상머신 > 디스크 액션버트 `이동` 버튼 선택 하나 이상 있을 때 활성화
  - `${front}`: TMI > 가상머신 우클릭 > 액션버튼 탬플릿 버튼은 가리기
  - `${front}`: 가상머신 >  스냅샷 메모리저장 토글 선택 시 (활성화/해제) 구현
  - `${front}`: 도메인 → 도메인/템플릿  가져오기 → 모달창 UI수정

### Removed 

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

---

## 0.3.1 - 2025-05-09

- [`api-v0.3.1`][api-v0.3.1]: 백엔드
- [`web-v0.3.1`][web-v0.3.1]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
  - `${back}${front}`: 호스트 > 네트워크 어댑터 페이지 추가
  - `${back}${front}`: 가상머신 목록에 > 스냅샷 여부 코드 추가
  - `${back}${front}`: 스토리지도메인 생성/편집 Modal > 기능 구현 완료 (nfs, fc)
  - `${back}${front}`: 스토리지도메인 Modal > `DomainImportModal` 가져오기 기능 구현 완료 (nfs, fc)
- [@lmy9237][lmy9237]
  - `${front}`: 가상머신 Aciton 버튼 헤더: 가상머신 복제 버튼 활성화 및 기능 개발

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${front}`: Aside 메뉴 처음 페이지에서 열리게 수정
  - `${front}`: 트리메뉴아이콘 추가: 가상머신 일시정지 `rvi16Pause`
  - `${front}`: Footer 높이에 따른 이벤트창 높이 조절
  - `${front}`: Footer 미쳐 날뛰는 현상
  - `${front}`: Disk 상태에 때른 버튼 활성화/비활성화 버튼 처리
  - `${front}`: 호스트 > `INSTALLING`에 대해서 편집버튼 비활성화
  - `${front}`: 기본글자크기 조절 `12px`
  - `${front}`: 호스트 > 버튼문구 변경: `호스트 재부팅 확인` -> `호스트 재부팅 상태 확인`
  - `${front}`: 가상머신 > 스냅샷 생성버튼 언제든 활성화
  - `${front}`: 스토리지도메인 > `가상머신 가져오기` 버튼 모달연결
  - `${front}`: 대시보드 스타일 전면수정
  - `${front}`: 스토리지 > 디스크 > 상세 > 스토리지 > 도메인 목록 
- [@dhj27][dhj27]
  - `${back}${front}`: 스토리지 도메인 편집에서 호스트 출력
  - `${front}${back}`: 가상머신 생성/편집 모달 > BIOS 부팅메뉴 코드 수정
  - `${back}`: LogicalUnit iscsi와 fc 상관없이 출력되게 코드 수정
  - `${back}`: 스토리지도메인 vo 개선
  - `${front}`: 가상머신 NIC 모달 편집 (토글버튼, select박스)
  - `${front}`: 가상머신 NIC 페이지 수정
  - `${front}`: 템플릿 모달 수정
  - `${front}`: DomainCheckModal 수정
  - `${front}`: DomainInfo에 Domain 상태 값 추가
  - `${front}`: Domain 상태에 따른 DomainInfo Tab 메뉴 변경
  - `${front}`: `RQHook` 관리 > `searchFc`
- [@lmy9237][lmy9237]
  - `${front}`: Footer 작업명 컬럼명 아이콘과 줄 맞추기 
  - `${front}`: 비밀번호 눈 표시 (비번 안보임)
  - `${front}`: 원그래프 소수점 자르기
  - `${front}`: 가상머신 호스트 > 특정호스트 색 다 채우기
  - `${front}`: input 비밀번호 눈표시 (미리보기) 추가 (모달, 로그인페이지)
  - `${front}`: 호스트 상세페이지 > 부팅시간 데이터 안뜸
  - `${front}`: 가상머신 > 스냅샷 유무 컬럼 추가
  - `${front}`: 가상머신 일시중지 일 때 시작버튼 활성화
  - `${front}`: 막대그래프 크기고정 > 큰화면일때 높이 수정
  - `${front}`: 스토리지도메인 action 이동/복사 버튼 기능 개발(모달필요)
  - `${front}`: 가상 디스크 편집 아이콘 빼기(임시)
  - `${front}`: 데이터센터 > 호스트 > 관리 Action 버튼 눌렀을 때 `글로벌 HA 유지관리를 비활성화` 문구가 2줄로 되어 범위가 넘어가는 현상
  - `${front}`: 가상머신 Action버튼: 재부팅 및 시작 등 Action버튼에 대한 넓이 처리 (공백이 많음)
  - `${front}`: 호스트 Action 버튼 활성화 처리: `인증서 등록` 은 유지보수모드 일 때  만 활성화
  - `${front}`: 대시보드 > 이벤트 세부 count 아이콘 누락
  - `${front}`: 대시보드 > 가로바 그래프 제목 글자 굵기 해제
  - `${front}`: 대시보드 > 원그래프 사용가능 Font 크기
  - `${front}`: 네트워크 생성/편집: `DNS 설정` 문구 폰트처리
  - `${front}`:`Localization`수정 `VNIC` > `vNIC`
  - `${front}`: 드레그선 굵기 > 얇게
  - `${front}`: 가상머신 생성/편집 모달 > 부팅 가능한 것만 [ 부팅 ] 라벨 표시
  - `${front}`: 가상머신 목록 > 재설정 필요 아이콘: `rvi16refresh`
      - 위치: 상태 안 (아이콘 2개표출)
  - `${front}`: `TableRowColumn` 값/텍스트 정렬 처리 기능 추가
      - 컬럼 : 가운데정렬
      - 긴 항목: 왼쪽 정렬 (이름, 설명, 코멘트)
      - 짧은 항목: 가운데 정렬 (상태, 유형, 크기, etc.)
  - `${front}`: 가상머신 스냅샷, 호스트 네트워크 인터페이스 컴포넌트분리
  - `${front}`: 네트워크 가상머신 버튼 위치
  - `${front}`:  가상머신 생성/편집 > 디스크생성 별칭 자동으로 만들기
      - 생성에서만
      - 가상머신에 이름에 맞춰
      - 가상머신 이름이 없을 경우 `_Disk1` 표시 안하도록
  - `${front}`: 가상머신 > 디스크 action버튼 활성/비활성화 예
  - `${front}`: 모달 선두께 통일
  - `${front}`: 관리버튼 화살표 색상수정
  - `${front}`: select박스 텍스트 넘치는 것 수정
  - `${front}`: 우클릭메뉴박스 선 잘리는문제 수정
  - `${front}`: 스냅샷모달 스크롤빼기
  - `${front}`: 템플릿 편집 모니터수 수정
  - `${front}`: 스토리지 도메인 상태 아이콘 문제        
  - `${front}`: 가상머신 > 디스크 모달 제목 및 내용 오출력 (편집)
  - `${front}`: 이벤트 텍스트짤림
  - `${front}`: 툴팁 잘리는 것 수정
  - `${front}`: 가상머신 생성/편집 > VNIC 오와 열

### Removed

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

---

## 0.3.0 - 2025-04-25

- [`api-v0.3.0`][api-v0.3.0]: 백엔드
- [`web-v0.3.0`][web-v0.3.0]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  
  - `${front}`: 이벤트 메시지 눌렀을 때 copy할 수 있게 (우클릭) - 이진성요청
  - `${front}`: Storage Domain 사이드메뉴 모달 처리 비활성화
  - `${front}`: 스냅샷 세부 페이지 정리
  - `${front}`: 각 화면에서 누락 된 Search Bar, SelectedIdView, Modal 등록
  - `${front}`: 최근작업 refetch 주기 설정 기능 추가 (5, 10, 15초 중 하나 선택하여 설정)
  - `${front}`: 최근작업 총 소요 시간에 대한 값 처리

- [@dhj27][dhj27]
  - `${back}${front}`: 호스트 새로고침 모달 &기능 완료
  - `${back}${front}`: 호스트 재부팅 모달 &기능 완료 (🚨 엔지니어 테스트 필요)
  - `${front}`: "Default" 와 같은 기본 지정값 설정
  - `${back}${front}`: VM NextRun, RunOnce 추가
  - `${front}`: DomainDataCenterActionButtons
- [@lmy9237][lmy9237]
  - `${front}`: 스냅샷 `미리보기` `IN_PREVIEW` 상태 설명 및 아이콘 추가 (fontaweseom: `fas fa-eye`)
  - `${front}`: 호스트 `NON_RESPONSIVE` 상태추가(`응답하지 않음`)
  - `${front}`: 대시보드 원그레프 툴팁추가
  - `${front}`: 가상머신 스냅샷 action버튼추가
  - `${front}`: `rvi16ExclamationMark` 로 가상머신 `nextRun` 에 대한 상태 아이콘 추가
  - `${front}`: 변경처리를 진행 할 때 목록이 갱신이 자동적으로 되지 않는것 수정(ex 상태 아이콘 바뀌는것)

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${front}`: 로직개선: 리펙토링 (GlobalProvider, UIStateProvider, TMIStateProvide)
    - 영향: 우클릭 메뉴, 하단 최근작업 UI처리 (진행중), 사이드메뉴 UI반응 (진행중), 등등.
  - `${front}`: Aside메뉴와 상세내용 옆 border 얇게 처리 2px (padding없게) - 문용규요청
  - `${front}`: 드래그 기능 및 기타 UI 오류 정정 (footer, aside)
  - `${front}`: 이벤트 박스 창 크기조절
  - `${front}`: 로그인 화면 보정
  - `${front}`: VM 생성/편집 모달 반응 정정
    - 디스크 생성 별칭 누락 문제
    - 시스템 탭:  총 가상cpu select 값 표시 정상화
  - `${front}`: VM Action 버튼상태 처리
    - 일시중지 일 때  종료, 전원 끔, 실행, 편집 버튼 활성화 
    - 가상머신 실행 중 일 때 마이그레이션 버튼 활성화 (가상머신 세부페이지)
  - `${front}/${back}`: Disk 업로드 안정화 (최근작업 관리)
  - `${front}`: 호스트 생성 중에 대한 객체 처리 비활성화
  - `${front}`: 우클릭 메뉴에 대한 로직 문제 보정 (없는 것들에 대한 정리)
- [@dhj27][dhj27]
  - `${front}`: 디스크 복사 모달 완료
  - `${front}`: 디스크 이동 모달 완료
  - `${front}`: 호스트 새로고침 모달 &기능 완료
  - `${front}`: 호스트 재부팅 모달 &기능 완료 (🚨 엔지니어 테스트 필요)
  - `${back}`: vm 생성시 필요한 nic 목록 수정(/{dataCenterId}/vnicProfiles -> /{clusterId}/vnicProfiles)
  - `${front}`: checkname 수정 
  - `${front}`: vm powering_up중에 전원끔 버튼 활성화
  - `${front}`: vm disk 생성/편집 모달 수정
  - `${front}`: vm disk 삭제 모달 수정
  - `${front}`: vm disk action 모달 수정
  - `${front}`: VM > 스냅샷 삭제 버튼 UI오류 수정
  - `${back}${front}` : 네트워크  호스트 네트워크 장치값 수정
  - `${back}`: VM Cdrom 편집 수정 (vmstatus up에서 실행가능하도록 하는 변수) 설정
  - `${front}`: VM 삭제 모달에서 디스크 삭제 항목 안 뜨는 문제 수정
  - `${front}`: VM 마이그레이션 모달 중복선택 가능
  - `${front}`: 스토리지 도메인 모달 수정 (삭제, 파괴, 연결, 활성화, 비활성화, 유지보수)
  - `${front}`: DomainDupl에 actiontype 변경
  - `${front}`: DomainDupl에 데이터센터-도메인, 도메인-데이터센터에서 띄울 버튼 구분할 타입 수정(souceContext)
  - `${front}`: DomanAttachModal 기능 구현
  - `${front}`: DomainActionModal를 DomainActivateModal과 DomainDetachModal로 구분
  - `${front}`: DomainGernal 이미지 개수, 디스크 스냅샷 개수 수정
  - `${front}`: DomainImportVms 생성 날짜 추가
  - `${front}`: DomainModal nfs 수정
  - `${front}`: DomainModal iscsi 수정(미완)
  - `${front}`: vnic프로파일 모달 onclose
  - `${front}`: Dupl, ActionButtons, Modals (datacenter, cluster, host, vm) 수정
  - `${back}`: HostStorageService 생성. HostService에 있던 코드 이동
  - `${front}`: 스토리지 도메인가져오기 모달 수정(iscsi, fcp 검색)
  - `${back}` : 스토리지 도메인 nfs 가져오기 완료
  - `${front}`: 스토리지 도메인 연결 모달 변경
  - `${front}`: 스토리지 도메인 유지보수 모달 변경
  - `${front}`: 스토리지 도메인 활성 모달 변경
  - `${front}`: LabelSelectOptions, LabelSelectOptionsID key 수정
  - `${front}`: 데이터 센터 모달 변경
  - `${front}`: 클러스터 모달 변경
  - `${front}`: 호스트 모달 변경
  - `${front}`: 도메인 모달(생성, 가져오기) 변경
  - `${front}`: 디스크 모달 별칭, 설명 중복사용 해결
  - `${front}`: VM 모달 OS 수정
  - `${front}`: VNICProfile 모달 OS 수정
  - `${back}` : StorageDomain FC Unregisterd 수정
- [@lmy9237][lmy9237]
  - `${front}`: 호스트 유지보수 모드에서 재시작 버튼 활성화
  - `${front}`: 가상머신 스냅샷 기본 날짜,시간 없애기(현재위치만 남기기)
  - `${front}`: 툴팁 값 불량 정정(하이퍼링크)
  - `${front}`: 상세페이지정보 화면 줄이면 td줄바뀌는것 한줄로수정
  - `${front}`: 디스크 연결대상컬럼 text 왼쪽정렬하기
  - `${front}`: RutilVmIcon: tooltip > Tippy 적용
  - `${front}`: 템플릿>네트워크 인터페이스 버튼
  - `${front}`: 가상머신 생성/편집 > 호스트 선택에 따른 순서 적용 (GOOD, ID대신 **명칭**으로)
  - `${front}`: 상세페이지 이름 길어졌을 때 버튼들 찌그러지는 것 수정(e.g. 가상머신)
  - `${front}`: JobFooter 높이 조절 끝까지 (밑으로)
  - `${front}`:  nav 우클릭박스 완성(모달열릴때 contextmenu 안 닫힘) > 수정
  - `${front}`:  템플릿 네트워크인터페이스 nic모달로 바꾸기 (NICMODAL.jsx참고)
  - `${front}`:  테이블 글씨 잘리는것 > …으로 표시 tippy 수정
  - `${front}`: VM 상세 > 스냅샷 페이지
      - 맨 위 정보 표출 필요여부 (@문용규 협의 후 적용진행)
      - 정렬 순서 선택필요 @문용규 (내림차순 5,4,3,2,1 / 오름차순 1,2,3,4,5,)
  - `${front}`: Footer 기본 높이 작게 (테이블 항목 1개 정도 만 보이도록)
  - `${front}`: Footer 최근작업 Table 표 column 넓이 정의처리
      - `상태`, `시작시간`, `종료시간`: 컬럼 넓이 px로 지정 (총 소요시간도 적절하게 px로)
      - `작업명` 컬럼을 나머지 영역으로 잡아 지정
  - `${front}`: 마이그레이션 디자인 수정
  - `${front}`:  마이그레이션모달 오류(VmMigrationModal.jsx:98 Uncaught TypeError: selectedVms.map is not a function)  selectedVms.map((vm) > 수정
  - `${front}`:  논리네트워크 생성 Modal > input처리 (Toggle버튼 추가)
  - `${front}`:  논리네트워크 생성 Modal > 표를 감싸는 border처리
  - `${front}`:  테이블 툴팁 오류 재수정
  - `${front}`:  통지함: ‘모두삭제’ 등등 버튼의 스타일
  - `${front}`:  대시보드 grid박스 겹치는 것 수정
  - `${front}`:  디스크 업로드 Modal > ‘파일선택’ 버튼 font 크기, 확인,취소 버튼 사이즈와 같게
  - `${front}`:  디스크 업로드 Modal > ‘선택된 파일 없음’ 문구 font 크기, 확인,취소 버튼 사이즈와 같게
  - `${front}`:  input 아이콘 작아지는 것 크기고정
  - `${front}`:  vNIC 프로파일에 대한 Header 아이콘 지정
  - `${front}`:  Select box 커스텀
  - `${front}`:  네트워크모달 vlan값 수정(예외있음)
  - `${front}`:  그리드박스 %색상표 앞쪽으로 옮기기
  - `${front}`:  그리드박스 텍스트 괄호빼기
  - `${front}`:  모달 확인 취소버튼 밑으로 내리기
  - `${front}`:  select 글씨 짤림>  …으로 보이게수정
  - `${front}`:  그리드박스 0 프로일때 마우스 설정
  - `${front}`:  모달 폰트사이즈 통일
  - `${front}`:  모달 구분선 색상통일
  - `${front}`:  가상머신 일반 > nic인덱스 숫자수정
  - `${front}`:  테이블 컬럼 데이터 숫자는 가운데 정렬
  - `${front}`:  탭이 있는 Modal 에 대해
      - hover했을 때 회색으로
      - 글자 왼쪽 padding 부여
  - `${front}`: 모든 input text, selectbox 에 대해 border같게
      - Modal 구분선 색과 같게
  - `${front}`:  Modal 내 Dropdown 컴포넌트에 대한 식별 필요 (배경이 하얗기 때문에 텍스로 오해)
  - `${front}`:  VM 생성/편집 모달 > 일반 >인스턴스 이미지 연결 / 생성 버튼에 대한 아이콘?
  - `${front}`:  네트워크 인터페이스 항목 선택 시 선택 된 상태에 대한 스타일
  - `${front}`:  LabelSelectOptions 5개 이상 항목이 있을 때 y축 scroll 바 생기도록 (i.e. 전체높이 고정)
  - `${front}`:  border색 통일+css정리
  - `${front}`:  vnic모달 체크박스 ‘통과, 마이그레이션’ 조건,  네트워크 모달 ‘ 가상머신 네트워크’ 조건 수정
  - `${front}`:  Header버튼의 활성화/비활성화에 따른 스타일 처리
  - `${front}`:  상세화면 값 렌더링(ex이름) 문제
  - `${front}`:  템플릿 생성/편집 모달 > 텍스트 폰트처리 > 작게
  - `${front}`:  toast 글씨 넘치는 문제 수정
  - `${front}`:  로그인 버튼 사라짐 (스타일 문제)
  - `${front}`:  호스트Action버튼 범위초과 (스타일 문제)
  - `${front}`:  도메인 > 데이터센터 연결모달 padding값 주기 너무 딱 달라붙어있음
  - `${front}`:  host-fileter-btn  보더테두리 1px로 줄이기, 가로 padding값 추가
  - `${front}`:  도메인 > 템플릿 가져오기 action버튼 항목선택해야지만 활성화
  - `${front}`:  사용자 비번변경 모달사이즈 줄이기
  - `${front}`:  Storage Domain > Template 목록 출력 불량
  - `${front}`:  rutilVm > 디스크 > 표 짤림 문제
  - `${front}`:  템플릿 생성 - 표 크기 문제
  - `${front}`:  로그인 페이지 디자인 

### Removed 

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

---

## 0.2.6 - 2025-04-11

- [`api-v0.2.6`][api-v0.2.6]: 백엔드
- [`web-v0.2.6`][web-v0.2.6]: 프론트앤드

### Added

- [@chanhi2000][chanhi2000]
  - `${front}`: UI 상태값 (좌측메뉴, Footer,  트리메뉴, etc.) useContext 화 (`UIStateProvider`)
  - `${front}`/`${back}`: 이벤트 조회 조건 신규 추가 (페이징 및 심각도 조절)
  - `${front}`/`${back}`: 최근작업 (Job) 처리 API 추가 및 개선
    - 외부 작업 추가 및 종료 API 추가
    - Disk 업로드에 대한 연동
  - `${front}`: 용어 및 아이콘 정의:
    - 중지 중 (`POWERING_DOWN`)
- [@dhj27][dhj27]
  - Host Network interface
    - `${back}`: Host Network Bonding 생성, 편집, 삭제 코드 추가
    - `${back}`: Host NetworkAttachment 생성, 편집, 삭제 코드 추가
    - `${front}`: Bonding 모달 값 추가
    - `${front}`: NetworkAttachment 모달 값 추가
    - `${front}`: Host Nic별 값 출력 (속도)
    - `${front}`: Host Network ip값 출력(dns 아직)
    - `${front}`: Host Nic 위 생성 버튼 추가
  - 디스크 복사 모달 기능 추가
  - VM > 스냅샷 삭제 모달 기능 추가 
  - Job / Steps UI 적용
- [@lmy9237][lmy9237]
  - `${front}`: 테이블 아이콘 + React Element으로 구성 된 내용 (e.g. hyperlink 있는 이름) 정렬기능 추가
  - `${front}`: 호스트 유지보수된것  활성(UNASSIGNED)>상태(툴팁),아이콘추가
  - `${front}`: Storage Doamin > `UNKNOWN` ”알 수 없음” 상태 값 추가
  - `${front}`: 계정설정 모달창추가(비밀번호변경)
  - `${front}`: 왼쪽메뉴 우클릭박스 네트워크,데이터센터 모달 기능추가
  - `${front}`: 용어 및 아이콘 정의:
    - 유지보수 준비중 (`PREPARING_FOR_MAINTENANCE`)
    - 복구중 (`RESTORING_STATE`) 
    - 마이그레이션 중 (`MIGRATIONG`)
    - 일시중지 중 (`SAVING_STATE`),
    - 재설정,재부팅 (`REBOOT_IN_PROGRESS`) 대기>상태(툴팁),아이콘추가

### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - `${devops}`: 백엔드 docker 로그 utf-8 한글출력 정상화
  - `${front}`/`${back}`: 알림 버튼에 대한 이벤트 API 연동
  - `${front}`: (알림이 있을 때) 알림 버튼에 뱃지 UI 생성
  - `${front}`/`${back}`: Disk 업로드 API 처리방식 개선
    - QCOW 유형 허용
    - Disk 업로드 진행과정 출력
  - `${front}`: VM 생성/편집 > 총 가상 CPU 에 값에 반응
- [@dhj27][dhj27]
  - Host Network interface > 상세 항목을 표출
    - HostNic  > 항목: Rx/Tx Speed 등
    - NetworkAttachment > ip, mac
  - VM 편집에서 총 가상 CPU 값 표기
  - 가상머신 액션 버튼에 이벤트 onsuccess(), onclose() 넣기
  - VM 스냅샷 생성 모달 창 이름 표시  
  - 디스크 목록 - iso 연결되어 있는 가상머신 목록 출력
  - 가상머신 스냅샷 버튼 활성화
  - 가상머신 스냅샷 삭제 기능 활성화
  - 가상머신 생성 - 디스크 모달 에러 수정
  - 템플릿 생성 모달 수정
    - 템플릿 도메인 별 디스크 프로파일 출력
    - 도메인 크기 출력
  - ErrorPattern DUPLICATE 수정
- [@lmy9237][lmy9237]
  - [front] Network 상세 > 호스트: Tab과 ActionHeaderButtons 와 한열로(네트워크 호스트,가상머신쪽 디자인비교)
  - [front]  aside nav 아이콘 작아지는 것 수정
  - [front]  Dashboard 매트릭 박스 0크기고정 (`grid-item-name` max-width 설정)
  - [front]  Computing > VM (`test`) 선택 > 디스크 > `test_Disk1`  선택 > 스토리지 > `rutilvm-ititinfo_nfs01` 선택 > 가상머신 가져오기 화면이 죽는것 수정
  - [front] VM 상세화면 > 일반 (SideNavbar 열었을 때) 글자가 2둘로 변하는 현상
  - [front] 검색창 정렬기능 숫자단위 오류 수정 ex ) 2 200 3 4
  - [front] 스토리지 도메인 우클릭박스 모달창 안열리는것 수정
  - [front] 데이터센터 모달 정보 안나오는 것 수정
  - [front] 대시보드 그래프차트 줌기능(스크롤?) 막기
  - [front]  header-right-btns  밑으로 떨어졌을때 간격주기
  - [front]  Dashboard > Grid 박스 사이즈 틀어지는 현상 (1425 x 925 px)
  - [front] VM > 콘솔 우클릭메뉴 navigation 정상화
  - [front]  VM 상태가 일시중지 일 때 스냅샷 생성 비활성화 수정
  - [front] 삭제모달창 UI깨지는 것 수정
  - [front]  삭제 후 전화면으로 돌아가는 것 navigation 경로 수정
  - [front] 삭제모달 복수선택했을때 목록으로 구분 (삭제 모달 크기 너무작음)
  - [front] dynamic 컴포넌트 적용(가상머신생성모달,네트워크 생성모달 dns)
  - [front]  스냅샷 생성 성공 후, 이름 텍스트 찌그러지는것 수정
  - [front] 호스트 > `NON_OPERATIONAL` 일 때 편집 유지보수 활성화, 가능하도록 (ovirt 와 같게)
  - [front]  input css 정리
  - [front]  호스트 유지보수 모드에서 재시작 버튼 활성화
  - [front] 대시보드 그래프 aside바에따라 겹치는 것 방지
  - [front] 툴팁 값 불량 정정(하이퍼링크) + 기존 tootip 스타일때문에 css안먹는 문제로 tootip > tippy로 변경

### Removed 

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
  - 필요없는 DeleteModal/DeleteModals 삭제
  - 호스트 삭제 대기 해제 (처리는 진행 되나 Modal창이 계속 떠있는 현상) 
- [@lmy9237][lmy9237]

## 0.2.5 - 2025-04-04

### [`api-v0.2.5`][api-v0.2.5]: 백엔드

 
#### Added

<!-- - [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

#### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - 사용자 API 안정화: 예외처리 (잠금 및 비밀번호 불일치)
- [@dhj27][dhj27]
  - 로그 알림 (에러처리)
  - Network 모달 정리
    - dns 추가 (api자체 문제있음)
  - 운영시스템 변경
    - linux에서 window로 갈때 timezone 변경하여 운영시스템 변경 적용
  - 기능개선: 호스트 네트워크 API 수정.
- [@lmy9237][lmy9237]

#### Removed 

<!-- - [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->


### [`web-v0.2.5`][web-v0.2.5]: 프론트앤드

#### Added

- [@chanhi2000][chanhi2000]
  - 일반
    - PagingTable 페이지 별 기본 개수 값 변수화 (`CONSTANT.itemsPerPage`)
    - 목록화면에서 (검색화면 옆) Reloading 버튼 구현
  - VM 목록
    - 아이콘 추가 (`POWERING_UP`: 전원 켜는 중)
  - Host 목록
    - 아이콘 추가 (`INSTALLING`: 설치 중)
- [@dhj27][dhj27]
  - VM 목록 > 마이그레이션 적용
- [@lmy9237][lmy9237]
  - 일반
    - nav 우클릭박스 제작
    - Footer 창사이즈 조절 드레그 기능 생성
    - 로딩 중 뷰 Spinner 표출

#### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - 로그인 
    - API 안정화
    - `FooterCompany` 표출내용 생략 기능 추갸
  - 사용자 > 생성/편집 Modal
    - 잠금해제 처리 기능 보강
      - 비활성화일 떄 로그인 방지
      - 사용자 관리 UI 및 API 통신 처리강화
  - VM > VNC
    - Vnc화면 스크린샷 구현 (진행 중)
  - VM 생성/편집 Modal
    - 코어당 쓰레드: 최소공배수 형태로 select 구성
  - Host 목록
    - 상태에 따른 재시작 및 HA 설정 활성화 상태 정정
  - Event 목록
    - 아이콘 심각도 처리 정정
  - 일반
    - React Query Hook 전면 수정
      - 에러 및 예외 메시지 필터링 및 표출처리 강화
    - Toast 긴 메시지 표출 개선
    - Modal 편집: 용어 변경 `편집` -> `확인`
    - 큰 화면 border 스타일 통일
    - Tooltip 출력 스타일 개선 (맨 앞으로, 메시지 중간정렬)
- [@dhj27][dhj27]
  - Network 목록: 데이터센터 datacenterVo, `comment` 값 출력
  - Network 모달 정리
    - 데이터센터 아이디에 따른 클러스터 목록 변화
    - DNS 추가 (api자체 문제있음)
  - VM 생성/편집 Modal 
    - 운영시스템 변경
      - VM up 상태에서는 운영시스템 변경 안됨
      - linux에서 window로 갈때 timezone 변경하여 운영시스템 변경 적용
      - 최적화 옵션 변경 적용
      - 칩셋/펌웨어 유형 변경 적용
  - Host Network 페이지 개선.
  - Template 생성
  - Snapshot 생성 이름 수정
- [@lmy9237][lmy9237]
  - Host 목록 > 관리 버튼 > Select 메뉴 스타일 일관화
  - VM 상세: Snapshot, NIC 수정
  - VM 생성/편집 Modal 
    - 명칭: `인스턴스 이미지` 를 `가상 디스크` 로 변경
    - 스타일: 부트옵션 CD/DVD 연결 Select박스 width 정상화
    - 인스턴스 이미지 항목 아이콘 hover처리
    - Sub메뉴 right-border 높이 전체가 아닌 것 수정
    - Template 선택 박스 Blank일 때, 선택항목 자체를 은닉
    - Host 선택 (클릭 시 선택 상태 유지 하도록, 다중선택)
    - 메모리 크기 변경 시
      - 최대 메모리: 메모리크기 x 4
      - 할당할 실제 메모리: 메모리크기와 같음
    - 총 가상 cpu 값 설정 안되는것 수정
  - VM > Disk
    -  검색 탭 위치 한 열로
    - 테이블 위 항목 검색창 구조변경
  - VM > Snapshot: (내용 0개일 때) 보여주기
  - Network > Host목록
    -  항목 선택 후 `호스트 네트워크 설정` 버튼 선택 시,
      - 호스트 > 네트워크 인터페이스 화면으로 navigate
      - 호스트 네트워크 설정 Modal 비활성화
  - 일반
    - 상세화면 사이드메뉴 > hover 시 색 적용 (연한 회색)
    - Dashboard 그래프와 그리드박스 간격맞추기
    - Dashboard 한화면에 그래프 보이게하기(스크롤X)
    - Dashboard Horizontal Bar 그래프 Top3이기 때문에
    - `width`: 1개든 2개든 넓이는 동일하게
    - orientation: 최상위 고정
      - 추가버튼 `[+]` 제거
      - 삭제버튼 휴지통 아이콘
    - Toast 가운데로 텍스트 나오는 것 왼쪽으로 정렬
    - Paging Table 기본 개수 설정 (20)
    - VM > action Button 설정 다시 맞추기
    - VM > action Modal UI 수정
    - VM, Host actionm Modal 수정


#### Removed 

- [@chanhi2000][chanhi2000]
  - 불필요한 의존 컴포넌트 제거
<!--
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
-->


## 0.2.4 - 2025-03-28

### [`api-v0.2.4`][api-v0.2.4]: 백엔드

#### Added

<!-- - [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

#### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - 그래픽 콘솔 API 정정
- [@dhj27][dhj27]
  - 디스크 업로드 코드 수정
  - 스토리지 도메인 생성
  - vm expectStatus 기능 주석 처리
  - host expectStatus 기능 주석 처리
- [@lmy9237][lmy9237]

#### Removed 
<!-- 
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] 
-->

### [`web-v0.2.4`][web-v0.2.4]: 프론트앤드

#### Added

- [@chanhi2000][chanhi2000]
  - `wsproxy` 추가 및 환경구성
  - 디자인 된 아이콘 리소스 추가 (20+)
  - 용어 추가 (Localization)
  - VM접근 noVNC 콘솔창 UI생성
- [@dhj27][dhj27]
  - Toggle Button 추가 (데이터센터, 호스트)
- [@lmy9237][lmy9237]
  - vm생성모달 nic라벨 넣기
  - 가상머신 마이그레이션 Modal 제작
  - vNic Profile > `HeaderButton` 의 아이콘 스타일 수정 (`accentColor` 기본, `rvi24Lan` 으로 설정)
  - Storage Domain > 디스크 버튼 눌렀을 시 화면전환 오류
  - 작업취소, 도메인 유지보수, 확인, 도메인파괴 추가모달 제작

#### Changed/Fixed

- [@chanhi2000][chanhi2000]
  - 로그인 화면 디자인 적용
  - 우측상단 이벤트 아이콘 선택시 창 화면 높이
- [@dhj27][dhj27]
  - 모달 코드 리팩토링 (disk, cluster, host, disk upload, vnicprofile, network, template, network, vm)
  - 클러스터 일반 정보 값 추가
  - 클러스터 모달 - select 선택에 의한 변경 수정
  - 스토리지 도메인 모달 수정
    - fc 생성 완료
    - nfs 생성 완료
    - iscsi 나중
  - 네트워크 모달 생성 수정
  - host action 버튼 2차구현 항목 주석 처리
  - 가상머신 생성 모달
    - vm 시스템 총 cpu값 input 설정 변경
    - iso 연결 수정
- [@lmy9237][lmy9237]
  - Hover색 설정: Tree Navigation
  - Hover색 설정: 상세화면 Sub메뉴
  - Paging Table 기본 개수 설정 (20) > 페이징테이블 컴포넌트안씀
  - 사이즈: nav바 길이 끝까지 안 가는것 수정
  - VM 일반페이지 넓이 줄어들 때, 항목쪽 텍스트 2줄 되는 현상 해소
  - rutil manager페이지에서 Tree Navigtaion 선택 상태 해제 현상 해소
  - font-size작게
    - Dashboard > 원그래프 단위 (e.g. `GB`) 텍스트
    - Dashboard 그리드박스 Percent 값 밑에 항목 명칭
  - 그림자제거: VM > 상세화면 그래프
  - 비활성화처리: Dashboard > 그리드박스에서 없는 항목에 대한 비활성화 처리
  - 메뉴은닉: 설정 > 방화벽 메뉴
  - 테이블 텍스트가 아닌 것들은 가운데 정렬
  - (radio 버튼 > select): Host > Network 편집 Modal > IPv6 탭:
  - UI복구: 설정 > 사용자 선택
  - UI복구: Table 컴포넌트 선택 건 ID 추출 불량
  - UI복구: RutilVmIcon > Tooltip `top` 으로 고정 안되는 현상
  - UI복구: Tree Navigation > 가상머신 이름 길 때 `…` 으로 은닉 처리 (`white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)
  - UI복구: Storage Domain 우클릭박스 위치오류 수정
  - UI복구: 대시보드 원그래프 크기 작아지는것 수정
  - Modal 내 Toggle 버튼 스타일 수정 (`input-switch` 로 구성)
    - 데이터센터 생성/편집 Modal  (`DataCenterModal`)
    - 호스트 생성/편집 Modal (`HostModal`)
    - 템플릿 생성/편집 Modal (`TemplateModal`)
    - nic 생성/평집 Modal (`NicModal`)
  - VM > 상세화면 상태 태그 (`SUSPENDED` 및 그 외 에 대한 설정)
  - Footer 뷰 높이 `--h-rutil-footer` : `48px` > `36px`
  - RutilVM 로고 width: `120px`
  - Dashboard > 박스 총 숫자 > `font-size: var(--f-big)`으로 `font-weight: 700`
  - Dashboard > 그리드 커서 hover에서 tooltip으로 항목 명 표출(질문)
  - 가상머신 디스크편집안나오는것수정
  - Dashboard 전체화면 padding **상, 우, 하** 쪽 감소 (`left`만 좀 작게 나오는데 그게 적당한 사이즈로 판단
    - Grid gap값도 `6px`로 가야 공간이 균등하게 분포 될 것 같음
    - Dashboard padding 사이사이 균등하게 (`6px` )
    - 변수화 (`--p-default: 6px` )
  - UI변경: Box, Grid, Graph 전체 `border-radius`: `5px`으로 통일
    `App.css`에 변수로 값 관리 `--br-default: 5px`
  - 가상머신 생성모달 닉 초기화되는것 수정
  - 가상머신 생성모달 시스템 부분 숨기기

<!-- #### Removed 

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

### [`wsproxy-v0.2.4`][wsproxy-v0.2.4]: 웹소켓프록시

신규 추가

---

## 0.2.3 - 2025-03-21

### [`api-v0.2.3`][api-v0.2.3]: 백엔드

#### Added

- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]

#### Changed/Fixed

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

### [`web-v0.2.3`][web-v0.2.3]: 프론트앤드

#### Added

- [@chanhi2000][chanhi2000]
  - RutilVM 로고 적용 (로고 컴포넌트)
  - Localization 처리
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
  - input 테두리 px줄이기 , 네비케이션과 세부페이지 카테고리 hover기능추가

#### Changed/Fixed

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

#### Removed 

- [@chanhi2000][chanhi2000]
  - 불필요한 의존 컴포넌트 제거
<!-- - [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

---


## 0.2.2 - 2025-03-14

### [`api-v0.2.2`][api-v0.2.2]: 백엔드

#### Added

- [@chanhi2000][chanhi2000]
  - 인증서 파일 임시보관 처리 ([`7ad2ad84`](https://github.com/ititcloud/rutil-vm/commit/7ad2ad84c3acc571c8ebfdf844df8cdf6c1c7bf7))
  - spring-actuator 활성화 (health모니터링 및 시스템정보 관리)
  - vSphere 관련 API 기초 구성 ([`f1d993cc8`](https://github.com/ititcloud/rutil-vm/commit/f1d993cc8ad93cf30de4f4f655a03964e4bed076))
  - 그래픽콘솔 관련 API 기초 구성 ([`10ead1e6`](https://github.com/ititcloud/rutil-vm/commit/10ead1e6354f5fe2bac0f1f105dc60f62094a137))
<!-- - [@dhj27][dhj27] -->
- [@lmy9237][lmy9237]
  - 가상머신 > 다운된 가상머신 추가

#### Changed/Fixed

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

#### Removed 

- [@chanhi2000][chanhi2000]
  - 불필요한 CORS처리 부분 제거 ([`bf760e05`](https://github.com/ititcloud/rutil-vm/commit/bf760e05482caed2d32ce348fdc8763ff69d357c))
<!-- - [@dhj27][dhj27] -->
- [@lmy9237][lmy9237]
  - 대시보드 - 그래프 숫자제거

### [`web-v0.2.2`][web-v0.2.2]: 프론트

#### Added

- [@chanhi2000][chanhi2000]
  - `react-scan` 추가: 렌더링 성능 측정 ([`acaf854c`](https://github.com/ititcloud/rutil-vm/commit/acaf854c7fd5a8ab4f3ea0e310698e66f01c85e0))
  - 그래픽콘솔 화면 기초 구성 ([`10ead1e6`](https://github.com/ititcloud/rutil-vm/commit/10ead1e6354f5fe2bac0f1f105dc60f62094a137))
<!-- - [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

#### Changed/Fixed

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

#### Removed 

<!-- - [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] -->

---

## 0.2.1 - 2025-03-07

### [`api-v0.2.1`][api-v0.2.1]: 백엔드

#### Added

- [@chanhi2000][chanhi2000]
  - 180번 서버 배포 및 접근정보에 대한 구성 ([`ccec77cd`](https://github.com/ititcloud/rutil-vm/commit/ccec77cd7d764230938cd862c3af26c6bb048632))
  - 배포환경에 맞는 프론트 Docker 빌드 구성 ([`423fa0d9`](https://github.com/ititcloud/rutil-vm/commit/423fa0d9dfd1e46dc45c3357c0954cf8fee99054))
  - 공급자 정보 조회 API ([`33a39dd6`](https://github.com/ititcloud/rutil-vm/commit/33a39dd6691867148833e465eebc485a75fe6ca4))
- [@dhj27][dhj27]
  - 가상머신 가져오기 API (vmware)

#### Changed

- [@chanhi2000][chanhi2000]
  - 프론트 + 백앤드 배포환경 구성 완료 ([`c2e2dc10`](https://github.com/ititcloud/rutil-vm/commit/c2e2dc1054a11ddb2e132b1b085ed32c9420bf49))
- [@dhj27][dhj27]
  - 가상머신 편집

#### Fixed

- [@chanhi2000][chanhi2000]
  - SSH 접근을 이용하여 호스트 재기동 기능 복구 ([`50640e2f`](https://github.com/ititcloud/rutil-vm/commit/50640e2ff6f0382247e62a72a6df23c7c4e419df))
- [@dhj27][dhj27]
  - 호스트 네트워크 모달 수정 및 기능 수정
  - 가상머신 스냅샷 수정

#### Removed

<!-- 
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237] 
-->

### [`web-v0.2.1`][web-v0.2.1]: 프론트

#### Added

- [@chanhi2000][chanhi2000]
  - `rutil-vm` github action 자동 Docker Image 생성 ([`44afb86e`](https://github.com/ititcloud/rutil-vm/commit/44afb86e42fee46c186f955e66bb61740a5ec6a4))
<!-- - [@dhj27][dhj27] -->
- [@lmy9237][lmy9237]
  - 검색창 추가(새 컴포넌트추가)
  - 컴포넌트분리(모달nav , 검색창 , mainouter)

#### Changed

- [@chanhi2000][chanhi2000]
  - 프론트 + 백앤드 배포환경 구성 완료 ([`c2e2dc10`](https://github.com/ititcloud/rutil-vm/commit/c2e2dc1054a11ddb2e132b1b085ed32c9420bf49))
- [@dhj27][dhj27]
  - 가상머신 편집
<!-- - [@lmy9237][lmy9237] -->

#### Fixed

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

#### Removed

<!--
- [@chanhi2000][chanhi2000]
- [@dhj27][dhj27]
- [@lmy9237][lmy9237]
-->

---

## [0.2.0-beta2][api-v0.2.0-beta2] - 2025-03-07

#### Added

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

#### Changed

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

#### Fixed

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

#### Removed

- [@lmy9237][lmy9237]
  - `${FRONT}` 필요없는 구 컴포넌트 삭제

## 0.2.0-beta1 - 2025.02.12

프로젝트 병합 후 첫 릴리즈

[api-v4.0.0-2]: https://github.com/ititcloud/rutil-vm/compare/web-v4.0.0...web-v4.0.0-2
[web-v4.0.0-2]: https://github.com/ititcloud/rutil-vm/compare/api-v4.0.0...api-v4.0.0-2
[api-v4.0.0]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.8...web-v4.0.0
[web-v4.0.0]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.8...api-v4.0.0
[api-v0.3.8]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.7...web-v0.3.8
[web-v0.3.8]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.7...api-v0.3.8
[api-v0.3.7]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.6...web-v0.3.7
[web-v0.3.7]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.6...api-v0.3.7
[api-v0.3.6]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.5...web-v0.3.6
[web-v0.3.6]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.5...api-v0.3.6
[api-v0.3.5]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.4...web-v0.3.5
[web-v0.3.5]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.4...api-v0.3.5
[api-v0.3.4]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.3...web-v0.3.4
[web-v0.3.4]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.3...api-v0.3.4
[web-v0.3.3]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.2...web-v0.3.3
[api-v0.3.3]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.2...api-v0.3.3
[web-v0.3.2]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.1...web-v0.3.2
[api-v0.3.2]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.1...api-v0.3.2
[web-v0.3.1]: https://github.com/ititcloud/rutil-vm/compare/web-v0.3.0...web-v0.3.1
[api-v0.3.1]: https://github.com/ititcloud/rutil-vm/compare/api-v0.3.0...api-v0.3.1
[web-v0.3.0]: https://github.com/ititcloud/rutil-vm/compare/web-v0.2.6...web-v0.3.0
[api-v0.3.0]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.6...api-v0.3.0
[web-v0.2.6]: https://github.com/ititcloud/rutil-vm/compare/web-v0.2.5...web-v0.2.6
[api-v0.2.6]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.5...api-v0.2.6
[web-v0.2.5]: https://github.com/ititcloud/rutil-vm/compare/web-v0.2.4...web-v0.2.5
[api-v0.2.5]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.4...api-v0.2.5
[web-v0.2.4]: https://github.com/ititcloud/rutil-vm/compare/web-v0.2.3...web-v0.2.4
[api-v0.2.4]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.3...api-v0.2.4
[web-v0.2.3]: https://github.com/ititcloud/rutil-vm/compare/web-v0.2.2...web-v0.2.3
[api-v0.2.3]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.2...api-v0.2.3
[web-v0.2.2]: https://github.com/ititcloud/rutil-vm/compare/web-v0.2.1...web-v0.2.2
[api-v0.2.2]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.1...api-v0.2.2
[web-v0.2.1]: https://github.com/ititcloud/rutil-vm/compare/web-v0.2.0-beta2...web-v0.2.1
[api-v0.2.1]: https://github.com/ititcloud/rutil-vm/compare/api-v0.2.0-beta2...api-v0.2.1
[api-v0.2.0-beta2]: https://github.com/ititcloud/rutil-vm/tree/api-v0.2.0-beta2

[chanhi2000]: https://github.com/chanhi2000
[dhj27]: https://github.com/dhj27
[lmy9237]: https://github.com/lmy9237