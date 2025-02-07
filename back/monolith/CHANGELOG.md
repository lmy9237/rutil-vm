# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.0.6: 2023-08-1x][v0.0.6]

프로젝트 안정화 6차

### Added

- Swagger2 적용
- API 설명추가 (DashboardController, LoginController)

### Modified

- Docker 빌드 전 환경변수 주입
- Smart Tomcat 구동 시 build 된 모듈 class 이동처리
 
---

## [v0.0.5: 2023-08-10][v0.0.5]

프로젝트 안정화 5차

### Modified

- 도커 이미지 구성을 위한 gradle 스크립트 안정화

---

## [v0.0.4: 2023-08-09][v0.0.4]

프로젝트 안정화 4차

### Fixed

- Smart Tomcat 에서 구동되도록 구성 (common, util모듈 빌드내용 포함)

### Modified

- Endpoint별 info 로그 기록
- 
---

## [v0.0.3: 2023-08-08][v0.0.3]

프로젝트 안정화

### Fixed

- model 관리 세부봐 (null 처리 대상 세부화)
- SystemService 예외대비 호출 기능 강화
- dashboardView 안정화
- (환경에 따른) database.properties 와 common.properties로 변수 관리

### Added

- 모듈 추가 (`common`, `util`)
- exploded war로 관리 하도록 구성 (docker)
 
---

## [v0.0.2: 2023-08-05][v0.0.2]

프로젝트 안정화

### Fixed

- model 관리 세부봐 (null 처리 대상 세부화)


### Mod

- `build.gradle.kts`: `monolith:war`생성 시 바로 `docker/okestro`폴더 밑으로 위치하도록 구성

---

## v0.0.1: 2023-08-04

초기배포

### Added

프로젝트 초기구성완료

[v0.0.6]: https://github.com/ITJEONGBO/okestro-demo/compare/v0.0.5...v0.0.6
[v0.0.5]: https://github.com/ITJEONGBO/okestro-demo/compare/v0.0.4...v0.0.5
[v0.0.4]: https://github.com/ITJEONGBO/okestro-demo/compare/v0.0.3...v0.0.4
[v0.0.3]: https://github.com/ITJEONGBO/okestro-demo/compare/v0.0.2...v0.0.3
[v0.0.2]: https://github.com/ITJEONGBO/okestro-demo/compare/v0.0.1...v0.0.2
