package com.itinfo.rutilvm.util.ovirt

enum class Term(
	val desc: String
) {
	OVIRT_USER("ovirt 사용자"),
	DATACENTER("데이터센터"),
	STORAGE("스토리지"),
	STORAGE_DOMAIN("스토리지 도메인"),
	DISK("디스크"),
	DISK_IMAGE("디스크 이미지"),
	DISK_PROFILE("디스크 프로필"),
	DISK_SNAPSHOT("디스크 스냅샷"),
	IMAGE_TRANSFER("이미지 업로드"),
	NETWORK("네트워크"),
	NETWORK_LABEL("네트워크 레이블"),
	NETWORK_ATTACHMENT("네트워크 결합"),
	NETWORK_FILTER("네트워크 필터"),
	EXTERNAL_NETWORK_PROVIDER("외부 네트워크 공급자"),
	BOND("(네트워크) 본드"),
	NIC("네트워크 인터페이스 컨트롤러"),
	VM("가상머신"),
	EXTERNAL_VM("외부 가상머신"),
	CONSOLE("콘솔"),
	TICKET("티켓"),
	REMOTE_VIEWER("원격뷰어"),
	SNAPSHOT("스냅샷"),
	VNIC("가상머신 NIC"),
	VNIC_PROFILE("가상머신 NIC 프로필"),
	DNS("DNS"),
	HOST("호스트"),
	HOST_NIC("호스트 NIC"),
	HOST_CPU_UNIT("호스트 CPU 유닛"),
	HOST_DEVICES("호스트 장비"),
	EXTERNAL_HOST_PROVIDER("외부 호스트 공급자"),
	CLUSTER("클러스터"),
	TEMPLATE("탬플릿"),
	WATCHDOG("워치독"),
	FENCE_AGENT("펜스 에이전트"),
	ISCSI_DETAIL("ISCSI 상세정보"),
	CPU_PROFILE("CPU 프로필"),
	APPLICATION("어플리케이션"),
	REPORTED_DEVICE("보고된 디바이스"),
	PERMISSION("권한"),
	SYSTEM_PERMISSION("시스템 권한"),
	MAC_POOL("MAC Pool"),
	CD_ROM("CD ROM"),
	DISK_ATTACHMENT("디스크 결합"),
	OPERATING_SYSTEM("운영 체제"),
	USER("사용자"),
	GROUP("그룹"),
	ROLE("역할"),
	FILE("파일"),
	OPEN_STACK_IMAGE_PROVIDER("오픈스택 이미지 공급자"),
	OPEN_STACK_NETWORK_PROVIDER("오픈스택 네트워크 공급자"),
	OPEN_STACK_VOLUME_PROVIDER("오픈스택 볼륨 공급자"),
	AFFINITY_GROUP("선호도 그룹"),
	AFFINITY_LABEL("선호도 레이블"),
	POWER_MANAGEMENT("전원 관리"),
	STATISTIC("통계"),
	INSTANCE_TYPE("인스턴스 유형"),
	EVENT("이벤트"),
	QOS("통신 서비스 품질"),
	QUOTA("할당량"),
	CLUSTER_QUOTA_LIMIT("클러스터 제한 할당량"),
	CERT("인증서"),
	JOB("작업"),
	STEP("작업과정"),
	UNKNOWN("알 수 없음")
	;
}

fun Term.logSuccess(action: String, target: String = "") {
	// log.info("완료: {} {}  ... {}", this@logSuccess.desc, action, target)
}

fun Term.logSuccessWithin(withinItem: Term, action: String, target: String = "") {
	// log.info("완료: {} 내 {} {} ... {}", this@logSuccessWithin.desc, withinItem.desc, action, target)

}

fun Term.logFail(action: String, t: Throwable? = null, target: String = "") {
	if (t == null)
		log.error("실패: {} {} ... {}", this@logFail.desc, action, target)
	else
		log.error("실패: {} {} ... {}, 이유: {}", this@logFail.desc, action, target, t.stackTraceToString())

}

fun Term.logFailWithin(withinItem: Term, action: String, t: Throwable? = null, target: String = "") {
	if (t == null)
		log.error("실패: {} 내 {} {} ... {} ", this@logFailWithin.desc, withinItem.desc, action, target)
	else
		log.error("실패: {} 내 {} {} ... {}, 이유: {}", this@logFailWithin.desc, withinItem.desc, action, target, t.localizedMessage)

}
