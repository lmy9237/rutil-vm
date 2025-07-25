package com.itinfo.rutilvm.util.ovirt.error

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import org.ovirt.engine.sdk4.Error
import java.util.concurrent.ConcurrentHashMap

enum class ErrorPattern(
	val code: String,
	val term: Term,
	val failureType: FailureType,
	var additional: String = ""
) {
	OVIRTUSER_ID_NOT_FOUND("OVIRTUSER-E001", Term.OVIRT_USER, FailureType.ID_NOT_FOUND),
	OVIRTUSER_NOT_FOUND("OVIRTUSER-E002", Term.OVIRT_USER, FailureType.NOT_FOUND),
	OVIRTUSER_VO_INVALID("OVIRTUSER-E003", Term.OVIRT_USER, FailureType.BAD_REQUEST),
	OVIRTUSER_AUTH_INVALID("OVIRTUSER-E004", Term.OVIRT_USER, FailureType.UNAUTHORIZED),
	OVIRTUSER_DUPLICATE("OVIRTUSER-E005", Term.OVIRT_USER, FailureType.UNAUTHORIZED),
	OVIRTUSER_REQUIRED_VALUE_EMPTY("OVIRTUSER-E006", Term.OVIRT_USER, FailureType.REQUIRED_VALUE_EMPTY),
	OVIRTUSER_LOCKED("OVIRTUSER-E007", Term.OVIRT_USER, FailureType.LOCKED),
	ROLE_ID_NOT_FOUND("ROLE-E001", Term.ROLE, FailureType.NOT_FOUND),
	ROLE_NOT_FOUND("ROLE-E002", Term.ROLE, FailureType.NOT_FOUND),
	ROLE_VO_INVALID("ROLE-E003", Term.ROLE, FailureType.BAD_REQUEST),
	DATACENTER_ID_NOT_FOUND("DATACENTER-E001", Term.DATACENTER, FailureType.ID_NOT_FOUND),
	DATACENTER_NOT_FOUND("DATACENTER-E002", Term.DATACENTER, FailureType.NOT_FOUND),
	DATACENTER_VO_INVALID("DATACENTER-E003", Term.DATACENTER, FailureType.BAD_REQUEST),
	DATACENTER_DUPLICATE("DATACENTER-E004", Term.DATACENTER, FailureType.DUPLICATE),
	CLUSTER_ID_NOT_FOUND("CLUSTER-E001", Term.CLUSTER, FailureType.ID_NOT_FOUND),
	CLUSTER_NOT_FOUND("CLUSTER-E002", Term.CLUSTER, FailureType.NOT_FOUND),
	CLUSTER_VO_INVALID("CLUSTER-E003", Term.CLUSTER, FailureType.BAD_REQUEST),
	CLUSTER_DUPLICATE("CLUSTER-E004", Term.CLUSTER, FailureType.DUPLICATE),
	HOST_ID_NOT_FOUND("HOST-E001", Term.HOST, FailureType.ID_NOT_FOUND),
	HOST_NOT_FOUND("HOST-E002", Term.HOST, FailureType.NOT_FOUND),
	HOST_VO_INVALID("HOST-E003", Term.HOST, FailureType.BAD_REQUEST),
	HOST_HAS_RUNNING_VMS("HOST-E004", Term.HOST, FailureType.BAD_REQUEST),
	HOST_IS_GLOBAL_HA("HOST-E005", Term.HOST, FailureType.BAD_REQUEST),
	HOST_IS_LOCAL_HA("HOST-E006", Term.HOST, FailureType.BAD_REQUEST),
	HOST_DUPLICATE("HOST-E007", Term.HOST, FailureType.DUPLICATE),
	HOST_IS_MAINTENANCE("HOST-E008", Term.HOST, FailureType.CONFLICT),
	HOST_NOT_MAINTENANCE("HOST-E009", Term.HOST, FailureType.CONFLICT),
	HOST_ACTIVE("HOST-E010", Term.HOST, FailureType.CONFLICT_ACTIVE),
	HOST_INACTIVE("HOST-E011", Term.HOST, FailureType.CONFLICT_INACTIVE),
	HOST_NIC_ID_NOT_FOUND("HOST_NIC-E001", Term.HOST_NIC, FailureType.ID_NOT_FOUND),
	VM_ID_NOT_FOUND("VM-E001", Term.VM, FailureType.ID_NOT_FOUND),
	VM_NOT_FOUND("VM-E002", Term.VM, FailureType.NOT_FOUND),
	VM_VO_INVALID("VM-E003", Term.VM, FailureType.BAD_REQUEST),
	VM_PROTECTED("VM-E004", Term.VM, FailureType.UNPROCESSABLE_CONTENT), // TODO: 모드에 대한 처리 예외
	VM_STATUS_ERROR("VM-E005", Term.VM, FailureType.BAD_REQUEST),
	VM_STATUS_UP("VM-E005", Term.VM, FailureType.FORBIDDEN),
	VM_DUPLICATE("VM-E006", Term.VM, FailureType.DUPLICATE),
	VM_CONFLICT_WHILE_PREVIEWING_SNAPSHOT("VM-E007", Term.VM, FailureType.CONFLICT, "스냅샷 미리보기인 상태에서 허용되지 않은 처리."),
	TEMPLATE_ID_NOT_FOUND("TEMPLATE-E001", Term.TEMPLATE, FailureType.ID_NOT_FOUND),
	TEMPLATE_NOT_FOUND("TEMPLATE-E002", Term.TEMPLATE, FailureType.NOT_FOUND),
	TEMPLATE_VO_INVALID("TEMPLATE-E003", Term.TEMPLATE, FailureType.BAD_REQUEST),
	TEMPLATE_DUPLICATE("TEMPLATE-E004", Term.TEMPLATE, FailureType.DUPLICATE),
	STORAGE_DOMAIN_ID_NOT_FOUND("STORAGEDOMAIN-E001", Term.STORAGE_DOMAIN, FailureType.ID_NOT_FOUND),
	STORAGE_DOMAIN_NOT_FOUND("STORAGEDOMAIN-E002", Term.STORAGE_DOMAIN, FailureType.NOT_FOUND),
	STORAGE_DOMAIN_VO_INVALID("STORAGEDOMAIN-E003", Term.STORAGE_DOMAIN, FailureType.BAD_REQUEST),
	STORAGE_DOMAIN_DELETE_INVALID("STORAGEDOMAIN-E004", Term.STORAGE_DOMAIN, FailureType.BAD_REQUEST),
	STORAGE_DOMAIN_DUPLICATE("STORAGE_DOMAIN-E005", Term.STORAGE_DOMAIN, FailureType.DUPLICATE),
	STORAGE_DOMAIN_ACTIVE("STORAGE_DOMAIN-E006", Term.STORAGE_DOMAIN, FailureType.CONFLICT_ACTIVE),
	STORAGE_DOMAIN_INACTIVE("STORAGE_DOMAIN-E007", Term.STORAGE_DOMAIN, FailureType.CONFLICT_INACTIVE),
	STORAGE_DOMAIN_MAINTENANCE("STORAGE_DOMAIN-E008", Term.STORAGE_DOMAIN, FailureType.CONFLICT),
	DISCOVER_TARGET_NOT_FOUND("DISCOVER_TARGET-E001", Term.STORAGE_DOMAIN, FailureType.NOT_FOUND),
	DISK_ID_NOT_FOUND("DISK-E001", Term.DISK, FailureType.ID_NOT_FOUND),
	DISK_NOT_FOUND("DISK-E002", Term.DISK, FailureType.NOT_FOUND),
	DISK_VO_INVALID("DISK-E003", Term.DISK, FailureType.BAD_REQUEST),
	DISK_BOOT_OPTION("DISK-E004", Term.DISK, FailureType.CONFLICT),
	DISK_DUPLICATE("DISK-E004", Term.DISK, FailureType.DUPLICATE),
	DISK_CONFLICT("DISK-E005", Term.DISK, FailureType.CONFLICT),
	DISK_PROFILE_ID_NOT_FOUND("DISK_PROFILE-E001", Term.DISK_PROFILE, FailureType.ID_NOT_FOUND),
	DISK_PROFILE_NOT_FOUND("DISK_PROFILE-E002", Term.DISK_PROFILE, FailureType.NOT_FOUND),
	DISK_PROFILE_VO_INVALID("DISK_PROFILE-E003", Term.DISK_PROFILE, FailureType.BAD_REQUEST),
	DISK_PROFILE_DUPLICATE("DISK_PROFILE-E004", Term.DISK_PROFILE, FailureType.DUPLICATE),
	// DISK_IMAGE_ID_NOT_FOUND("DISKIMAGE-E001", Term.DISK_IMAGE, FailureType.ID_NOT_FOUND),
	// DISK_IMAGE_NOT_FOUND("DISKIMAGE-E002", Term.DISK_IMAGE, FailureType.NOT_FOUND),
	// DISK_IMAGE_VO_INVALID("DISKIMAGE-E003", Term.DISK_IMAGE, FailureType.BAD_REQUEST),
	DISK_ATTACHMENT_ID_NOT_FOUND("DISKATTACHMENT-E001", Term.DISK_ATTACHMENT, FailureType.ID_NOT_FOUND),
	DISK_ATTACHMENT_NOT_FOUND("DISKATTACHMENT-E002", Term.DISK_ATTACHMENT, FailureType.NOT_FOUND),
	DISK_ATTACHMENT_VO_INVALID("DISKATTACHMENT-E003", Term.DISK_ATTACHMENT, FailureType.BAD_REQUEST),
	DISK_ATTACHMENT_ACTIVE_INVALID("DISKATTACHMENT-E004", Term.DISK_ATTACHMENT, FailureType.BAD_REQUEST),
	DISK_ATTACHMENT_NOT_BOOTABLE("DISKATTACHMENT-E005", Term.DISK_ATTACHMENT, FailureType.BAD_REQUEST, "부팅 가능한 디스크가 없음"),
	DISK_ATTACHMENT_DUPLICATE("DISKATTACHMENT-E006", Term.DISK_ATTACHMENT, FailureType.BAD_REQUEST),
	CD_ROM_ID_NOT_FOUND("CDROM-E001", Term.CD_ROM, FailureType.ID_NOT_FOUND),
	CD_ROM_NOT_FOUND("CDROM-E002", Term.CD_ROM, FailureType.NOT_FOUND),
	CD_ROM_VO_INVALID("CDROM-E003", Term.CD_ROM, FailureType.BAD_REQUEST),
	CD_ROM_CONFLICT_WHILE_VM_UPDATING("CDROM-E004", Term.CD_ROM, FailureType.CONFLICT, "가상머신이 변경 중일 때 CD-ROM 변경 불가능"),
	IMAGE_TRANSFER_NOT_FOUND("IMAGE_TRANSFER_NOT_FOUND", Term.IMAGE_TRANSFER, FailureType.NOT_FOUND),
	TRANSFER_URL_EMPTY("TRANSFER_URL_EMPTY", Term.IMAGE_TRANSFER, FailureType.NOT_FOUND),
	NETWORK_ID_NOT_FOUND("NETWORK-E001", Term.NETWORK, FailureType.ID_NOT_FOUND),
	NETWORK_NOT_FOUND("NETWORK-E002", Term.NETWORK, FailureType.NOT_FOUND),
	NETWORK_VO_INVALID("NETWORK-E002", Term.NETWORK, FailureType.BAD_REQUEST),
	NETWORK_OPERATIONAL_ERROR("NETWORK-E003", Term.NETWORK, FailureType.BAD_REQUEST),
	// NETWORK_DUPLICATE("NETWORK-E004", Term.NETWORK, FailureType.DUPLICATE),
	NETWORK_ATTACHMENT_ID_NOT_FOUND("NETWORK_ATTACHMENT-E001", Term.NETWORK_ATTACHMENT, FailureType.ID_NOT_FOUND),
	NETWORK_ATTACHMENT_VO_NOT_FOUND("NETWORK_ATTACHMENT-E002", Term.NETWORK_ATTACHMENT, FailureType.ID_NOT_FOUND),
	NETWORK_ATTACHMENT_DUPLICATE("NETWORK_ATTACHMENT-E003", Term.NETWORK_ATTACHMENT, FailureType.DUPLICATE),
	NIC_ID_NOT_FOUND("NIC-E001", Term.NIC, FailureType.ID_NOT_FOUND),
	NIC_NOT_FOUND("NIC-E002", Term.NIC, FailureType.NOT_FOUND),
	NIC_VO_INVALID("NIC-E003", Term.NIC, FailureType.BAD_REQUEST),
	NIC_DUPLICATE("NIC-E004", Term.NIC, FailureType.DUPLICATE),
	NIC_UNLINKED_REQUIRED("NIC-E004", Term.NIC, FailureType.PRECONDITION_FAILED),
	BONDING_VO_INVALID("NIC-E003", Term.BOND, FailureType.BAD_REQUEST),
	SNAPSHOT_ID_NOT_FOUND("SNAPSHOT-E001", Term.SNAPSHOT, FailureType.ID_NOT_FOUND),
	SNAPSHOT_NOT_FOUND("SNAPSHOT-E002", Term.SNAPSHOT, FailureType.NOT_FOUND),
	SNAPSHOT_VO_INVALID("SNAPSHOT-E003", Term.SNAPSHOT, FailureType.BAD_REQUEST),
	SNAPSHOT_CONFLICT_WHILE_PREVIEWING_SNAPSHOT("SNAPSHOT-E004", Term.SNAPSHOT, FailureType.CONFLICT, "스냅샷 미리보기인 상태에서 허용되지 않은 처리."),
	// SNAPSHOT_DUPLICATE("SNAPSHOT-E004", Term.SNAPSHOT, FailureType.DUPLICATE),
	VNIC_PROFILE_ID_NOT_FOUND("VNICPROFILE-E001", Term.VNIC_PROFILE, FailureType.ID_NOT_FOUND),
	VNIC_PROFILE_NOT_FOUND("VNICPROFILE-E002", Term.VNIC_PROFILE, FailureType.NOT_FOUND),
	VNIC_PROFILE_VO_INVALID("VNICPROFILE-E003", Term.VNIC_PROFILE, FailureType.BAD_REQUEST),
	VNIC_PROFILE_DUPLICATE("VNICPROFILE-E004", Term.VNIC_PROFILE, FailureType.DUPLICATE),
	CONSOLE_ID_NOT_FOUND("CONSOLE-E001", Term.CONSOLE, FailureType.ID_NOT_FOUND),
	CONSOLE_NOT_FOUND("CONSOLE-E002", Term.CONSOLE, FailureType.NOT_FOUND),
	CONSOLE_VO_INVALID("CONSOLE-E003", Term.CONSOLE, FailureType.BAD_REQUEST),
	TICKET_ID_NOT_FOUND("TICKET-E001", Term.TICKET, FailureType.ID_NOT_FOUND),
	TICKET_NOT_FOUND("TICKET-E002", Term.TICKET, FailureType.NOT_FOUND),
	TICKET_VO_INVALID("TICKET-E003", Term.TICKET, FailureType.BAD_REQUEST),
	EVENT_ID_NOT_FOUND("EVENT-E001", Term.EVENT, FailureType.ID_NOT_FOUND),
	EVENT_NOT_FOUND("EVENT-E002", Term.EVENT, FailureType.ID_NOT_FOUND),
	EVENT_VO_INVALID("EVENT-E003", Term.EVENT, FailureType.BAD_REQUEST),
	CERT_ID_NOT_FOUND("CERT-E001", Term.CERT, FailureType.ID_NOT_FOUND),
	CERT_NOT_FOUND("CERT-E002", Term.CERT, FailureType.NOT_FOUND),
	CERT_MISSING_REQUIRED_VALUE("CERT-E003", Term.CERT, FailureType.BAD_REQUEST),
	JOB_ID_NOT_FOUND("JOB-E001", Term.JOB, FailureType.ID_NOT_FOUND),
	JOB_NOT_FOUND("JOB-E002", Term.JOB, FailureType.NOT_FOUND),
	JOB_VO_INVALID("JOB-E002", Term.JOB, FailureType.BAD_REQUEST),
	UNKNOWN("UNKNOWN-E001", Term.UNKNOWN, FailureType.UNKNOWN),
	FILE_NOT_FOUND("FILE_NOT_FOUND", Term.DISK, FailureType.UNKNOWN),
	EXTERNAL_HOST_PROVIDER_ID_NOT_FOUND("EXTERNAL_HOST_PROVIDER-E001", Term.EXTERNAL_HOST_PROVIDER, FailureType.ID_NOT_FOUND),
	EXTERNAL_HOST_PROVIDER_NOT_FOUND("EXTERNAL_HOST_PROVIDER-E002", Term.EXTERNAL_HOST_PROVIDER, FailureType.NOT_FOUND),
	EXTERNAL_HOST_PROVIDER_VO_INVALID("EXTERNAL_HOST_PROVIDER-E002", Term.EXTERNAL_HOST_PROVIDER, FailureType.BAD_REQUEST),
	EXTERNAL_HOST_PROVIDER_DUPLICATE("EXTERNAL_HOST_PROVIDER-E004", Term.EXTERNAL_HOST_PROVIDER, FailureType.DUPLICATE),
	// EXTERNAL_HOST_PROVIDER_NOT_FOUND("EXTERNAL_HOST_PROVIDER_NOT_FOUND", Term.EXTERNAL_HOST_PROVIDER, FailureType.UNKNOWN),
	;

	companion object {
		private val findMap: MutableMap<String, ErrorPattern> = ConcurrentHashMap<String, ErrorPattern>()
		init {
			values().forEach { findMap[it.code] = it }
		}
		@JvmStatic fun findByCode(code: String): ErrorPattern? = findMap[code]
	}
}
fun ErrorPattern.toError(): Error {
	return when {
		// ID_NOT_FOUND 종류
		this in listOf(
			ErrorPattern.OVIRTUSER_ID_NOT_FOUND,
			ErrorPattern.ROLE_ID_NOT_FOUND,
			ErrorPattern.DATACENTER_ID_NOT_FOUND,
			ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY,
			ErrorPattern.CLUSTER_ID_NOT_FOUND,
			ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND,
			ErrorPattern.HOST_ID_NOT_FOUND,
			ErrorPattern.DISK_ID_NOT_FOUND,
			// ErrorPattern.DISK_IMAGE_ID_NOT_FOUND,
			ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND,
			ErrorPattern.CD_ROM_ID_NOT_FOUND,
			ErrorPattern.NETWORK_ID_NOT_FOUND,
			ErrorPattern.NIC_ID_NOT_FOUND,
			ErrorPattern.VM_ID_NOT_FOUND,
			ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND,
			ErrorPattern.TEMPLATE_ID_NOT_FOUND,
			ErrorPattern.CONSOLE_ID_NOT_FOUND,
			ErrorPattern.TICKET_ID_NOT_FOUND,
			ErrorPattern.CERT_ID_NOT_FOUND,
			ErrorPattern.JOB_ID_NOT_FOUND,
			ErrorPattern.EVENT_ID_NOT_FOUND
		) -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}")

		// NOT_FOUND 종류
		this in listOf(
			ErrorPattern.OVIRTUSER_NOT_FOUND,
			ErrorPattern.ROLE_NOT_FOUND,
			ErrorPattern.DATACENTER_NOT_FOUND,
			ErrorPattern.CLUSTER_NOT_FOUND,
			ErrorPattern.STORAGE_DOMAIN_NOT_FOUND,
			ErrorPattern.HOST_NOT_FOUND,
			ErrorPattern.DISK_NOT_FOUND,
			// ErrorPattern.DISK_IMAGE_NOT_FOUND,
			ErrorPattern.DISK_ATTACHMENT_NOT_FOUND,
			ErrorPattern.CD_ROM_NOT_FOUND,
			ErrorPattern.NETWORK_NOT_FOUND,
			ErrorPattern.NIC_NOT_FOUND,
			ErrorPattern.VM_NOT_FOUND,
			ErrorPattern.VNIC_PROFILE_NOT_FOUND,
			ErrorPattern.TEMPLATE_NOT_FOUND,
			ErrorPattern.CONSOLE_NOT_FOUND,
			ErrorPattern.TICKET_NOT_FOUND,
			ErrorPattern.CERT_NOT_FOUND,
			ErrorPattern.JOB_NOT_FOUND,
			ErrorPattern.EVENT_NOT_FOUND
		) -> Error("[${code}] (${failureType.code})${failureType.message} ${term.description}")

		// VO_INVALID, AUTH_INVALID 등 BAD_REQUEST 관련
		this.name.endsWith("_VO_INVALID") ||
			this == ErrorPattern.DISK_ATTACHMENT_ACTIVE_INVALID ||
			this == ErrorPattern.OVIRTUSER_AUTH_INVALID ||
			this == ErrorPattern.CERT_MISSING_REQUIRED_VALUE ||
			this == ErrorPattern.OVIRTUSER_LOCKED -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}")

		// *_DUPLICATE 항목들 공통 처리
		this.name.endsWith("_DUPLICATE") -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}")

		this.name.endsWith("_ACTIVE") -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}")
		this.name.endsWith("_INACTIVE") -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}")
		this.name.endsWith("_MAINTENANCE") -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}")

		// 특별한 추가 메시지 필요할 때
		this == ErrorPattern.NIC_UNLINKED_REQUIRED ||
		this == ErrorPattern.VM_CONFLICT_WHILE_PREVIEWING_SNAPSHOT ||
		this == ErrorPattern.DISK_CONFLICT ||
		this == ErrorPattern.DISK_ATTACHMENT_DUPLICATE ||
		this == ErrorPattern.DISK_ATTACHMENT_NOT_BOOTABLE ||
		this == ErrorPattern.SNAPSHOT_CONFLICT_WHILE_PREVIEWING_SNAPSHOT ||
		this == ErrorPattern.CD_ROM_CONFLICT_WHILE_VM_UPDATING -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}}: $additional")
		this == ErrorPattern.DISK_BOOT_OPTION -> Error("[${code}] ${term.description} (${failureType.code})${failureType.message}: 부팅가능한 디스크는 오직 한개만 가능합니다")

		// 기본 처리
		else -> Error(failureType.message)
	}
}

/*
fun ErrorPattern.toError(): Error {
	return when(this) {
		ErrorPattern.OVIRTUSER_ID_NOT_FOUND,
		ErrorPattern.ROLE_ID_NOT_FOUND,
		ErrorPattern.DATACENTER_ID_NOT_FOUND,
		ErrorPattern.OVIRTUSER_REQUIRED_VALUE_EMPTY,
		ErrorPattern.CLUSTER_ID_NOT_FOUND,
		ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND,
		ErrorPattern.HOST_ID_NOT_FOUND,
		ErrorPattern.DISK_ID_NOT_FOUND,
		ErrorPattern.DISK_IMAGE_ID_NOT_FOUND,
		ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND,
		ErrorPattern.NETWORK_ID_NOT_FOUND,
		ErrorPattern.NIC_ID_NOT_FOUND,
		ErrorPattern.VM_ID_NOT_FOUND,
		ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND,
		ErrorPattern.TEMPLATE_ID_NOT_FOUND,
		ErrorPattern.CONSOLE_ID_NOT_FOUND,
		ErrorPattern.TICKET_ID_NOT_FOUND,
		ErrorPattern.CERT_ID_NOT_FOUND,
		ErrorPattern.JOB_ID_NOT_FOUND,
		ErrorPattern.EVENT_ID_NOT_FOUND, -> Error("[${code}] ${term.description} ${failureType.message}")
		ErrorPattern.OVIRTUSER_NOT_FOUND,
		ErrorPattern.ROLE_NOT_FOUND,
		ErrorPattern.DATACENTER_NOT_FOUND,
		ErrorPattern.CLUSTER_NOT_FOUND,
		ErrorPattern.STORAGE_DOMAIN_NOT_FOUND,
		ErrorPattern.HOST_NOT_FOUND,
		ErrorPattern.DISK_NOT_FOUND,
		ErrorPattern.DISK_IMAGE_NOT_FOUND,
		ErrorPattern.DISK_ATTACHMENT_NOT_FOUND,
		ErrorPattern.NETWORK_NOT_FOUND,
		ErrorPattern.NIC_NOT_FOUND,
		ErrorPattern.VM_NOT_FOUND,
		ErrorPattern.VNIC_PROFILE_NOT_FOUND,
		ErrorPattern.TEMPLATE_NOT_FOUND,
		ErrorPattern.CONSOLE_NOT_FOUND,
		ErrorPattern.TICKET_NOT_FOUND,
		ErrorPattern.CERT_NOT_FOUND,
		ErrorPattern.JOB_NOT_FOUND,
		ErrorPattern.EVENT_NOT_FOUND, -> Error("[${code}] ${failureType.message} ${term.description}")
		ErrorPattern.OVIRTUSER_VO_INVALID,
		ErrorPattern.OVIRTUSER_AUTH_INVALID,
		ErrorPattern.OVIRTUSER_LOCKED,
		ErrorPattern.ROLE_VO_INVALID,
		ErrorPattern.DATACENTER_VO_INVALID,
		ErrorPattern.CLUSTER_VO_INVALID,
		ErrorPattern.STORAGE_DOMAIN_VO_INVALID,
		ErrorPattern.HOST_VO_INVALID,
		ErrorPattern.DISK_VO_INVALID,
		ErrorPattern.DISK_IMAGE_VO_INVALID,
		ErrorPattern.DISK_ATTACHMENT_VO_INVALID,
		ErrorPattern.NETWORK_VO_INVALID,
		ErrorPattern.NIC_VO_INVALID,
		ErrorPattern.VM_VO_INVALID,
		ErrorPattern.VNIC_PROFILE_VO_INVALID,
		ErrorPattern.TEMPLATE_VO_INVALID,
		ErrorPattern.CONSOLE_VO_INVALID,
		ErrorPattern.TICKET_VO_INVALID,
		ErrorPattern.JOB_VO_INVALID,
		ErrorPattern.EVENT_VO_INVALID, -> Error("[${code}] ${term.description} ${failureType.message}")
		ErrorPattern.OVIRTUSER_DUPLICATE,
		ErrorPattern.TEMPLATE_DUPLICATE, -> Error("[${code}] ${term.description} ${failureType.message}")
		ErrorPattern.NIC_UNLINKED_REQUIRED -> Error("[${code}] ${term.description} ${failureType.message}: $additional")
		else -> Error(failureType.message)
	}
}
*/
