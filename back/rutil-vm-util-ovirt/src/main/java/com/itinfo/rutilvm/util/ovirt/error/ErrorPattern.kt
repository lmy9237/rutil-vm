package com.itinfo.rutilvm.util.ovirt.error

import com.itinfo.rutilvm.util.ovirt.Term
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
	CLUSTER_ID_NOT_FOUND("CLUSTER-E001", Term.CLUSTER, FailureType.ID_NOT_FOUND),
	CLUSTER_NOT_FOUND("CLUSTER-E002", Term.CLUSTER, FailureType.NOT_FOUND),
	CLUSTER_VO_INVALID("CLUSTER-E003", Term.CLUSTER, FailureType.BAD_REQUEST),
	STORAGE_DOMAIN_ID_NOT_FOUND("STORAGEDOMAIN-E001", Term.STORAGE_DOMAIN, FailureType.ID_NOT_FOUND),
	STORAGE_DOMAIN_NOT_FOUND("STORAGEDOMAIN-E002", Term.STORAGE_DOMAIN, FailureType.NOT_FOUND),
	STORAGE_DOMAIN_VO_INVALID("STORAGEDOMAIN-E003", Term.STORAGE_DOMAIN, FailureType.BAD_REQUEST),
	STORAGE_DOMAIN_DELETE_INVALID("STORAGEDOMAIN-E004", Term.STORAGE_DOMAIN, FailureType.BAD_REQUEST),
	DISCOVER_TARGET_NOT_FOUND("DISCOVER_TARGET-E001", Term.STORAGE_DOMAIN, FailureType.NOT_FOUND),
	HOST_ID_NOT_FOUND("HOST-E001", Term.HOST, FailureType.ID_NOT_FOUND),
	HOST_NOT_FOUND("HOST-E002", Term.HOST, FailureType.NOT_FOUND),
	HOST_NOT_MAINTENANCE("HOST-E003", Term.HOST, FailureType.UNPROCESSABLE_CONTENT),
	HOST_VO_INVALID("HOST-E003", Term.HOST, FailureType.BAD_REQUEST),
	HOST_HAS_RUNNING_VMS("HOST-E004", Term.HOST, FailureType.BAD_REQUEST),
	HOST_IS_GLOBAL_HA("HOST-E005", Term.HOST, FailureType.BAD_REQUEST),
	HOST_IS_LOCAL_HA("HOST-E006", Term.HOST, FailureType.BAD_REQUEST),
	DISK_ID_NOT_FOUND("DISK-E001", Term.DISK, FailureType.ID_NOT_FOUND),
	DISK_NOT_FOUND("DISK-E002", Term.DISK, FailureType.NOT_FOUND),
	DISK_VO_INVALID("DISK-E003", Term.DISK, FailureType.BAD_REQUEST),
	DISK_PROFILE_ID_NOT_FOUND("DISK_PROFILE-E001", Term.DISK_PROFILE, FailureType.ID_NOT_FOUND),
	DISK_PROFILE_NOT_FOUND("DISK_PROFILE-E002", Term.DISK_PROFILE, FailureType.NOT_FOUND),
	DISK_PROFILE_VO_INVALID("DISK_PROFILE-E003", Term.DISK_PROFILE, FailureType.BAD_REQUEST),
	DISK_IMAGE_ID_NOT_FOUND("DISKIMAGE-E001", Term.DISK_IMAGE, FailureType.ID_NOT_FOUND),
	DISK_IMAGE_NOT_FOUND("DISKIMAGE-E002", Term.DISK_IMAGE, FailureType.NOT_FOUND),
	DISK_IMAGE_VO_INVALID("DISKIMAGE-E003", Term.DISK_IMAGE, FailureType.BAD_REQUEST),
	DISK_ATTACHMENT_ID_NOT_FOUND("DISKATTACHMENT-E001", Term.DISK_ATTACHMENT, FailureType.ID_NOT_FOUND),
	DISK_ATTACHMENT_NOT_FOUND("DISKATTACHMENT-E002", Term.DISK_ATTACHMENT, FailureType.NOT_FOUND),
	DISK_ATTACHMENT_VO_INVALID("DISKATTACHMENT-E003", Term.DISK_ATTACHMENT, FailureType.BAD_REQUEST),
	DISK_ATTACHMENT_ACTIVE_INVALID("DISKATTACHMENT-E004", Term.DISK_ATTACHMENT, FailureType.BAD_REQUEST),
	DISK_ATTACHMENT_NOT_BOOTABLE("DISKATTACHMENT-E005", Term.DISK_ATTACHMENT, FailureType.BAD_REQUEST),
	IMAGE_TRANSFER_NOT_FOUND("IMAGE_TRANSFER_NOT_FOUND", Term.IMAGE_TRANSFER, FailureType.NOT_FOUND),
	TRANSFER_URL_EMPTY("TRANSFER_URL_EMPTY", Term.IMAGE_TRANSFER, FailureType.NOT_FOUND),
	NETWORK_ID_NOT_FOUND("NETWORK-E001", Term.NETWORK, FailureType.ID_NOT_FOUND),
	NETWORK_NOT_FOUND("NETWORK-E002", Term.NETWORK, FailureType.NOT_FOUND),
	NETWORK_VO_INVALID("NETWORK-E002", Term.NETWORK, FailureType.BAD_REQUEST),
	NETWORK_OPERATIONAL_ERROR("NETWORK-E003", Term.NETWORK, FailureType.BAD_REQUEST),
	NETWORK_ATTACHMENT_ID_NOT_FOUND("NETWORK_ATTACHMENT-E001", Term.NETWORK_ATTACHMENT, FailureType.ID_NOT_FOUND),
	NIC_ID_NOT_FOUND("NIC-E001", Term.NIC, FailureType.ID_NOT_FOUND),
	NIC_NOT_FOUND("NIC-E002", Term.NIC, FailureType.NOT_FOUND),
	NIC_VO_INVALID("NIC-E003", Term.NIC, FailureType.BAD_REQUEST),
	NIC_UNLINKED_REQUIRED("NIC-E004", Term.NIC, FailureType.PRECONDITION_FAILED),
	VM_ID_NOT_FOUND("VM-E001", Term.VM, FailureType.ID_NOT_FOUND),
	VM_NOT_FOUND("VM-E002", Term.VM, FailureType.NOT_FOUND),
	VM_VO_INVALID("VM-E003", Term.VM, FailureType.BAD_REQUEST),
	VM_PROTECTED("VM-E004", Term.VM, FailureType.UNPROCESSABLE_CONTENT), // TODO: 모드에 대한 처리 예외
	VM_STATUS_ERROR("VM-E005", Term.VM, FailureType.BAD_REQUEST),
	VM_STATUS_UP("VM-E005", Term.VM, FailureType.FORBIDDEN),
	SNAPSHOT_ID_NOT_FOUND("SNAPSHOT-E001", Term.SNAPSHOT, FailureType.ID_NOT_FOUND),
	SNAPSHOT_NOT_FOUND("SNAPSHOT-E002", Term.SNAPSHOT, FailureType.NOT_FOUND),
	SNAPSHOT_VO_INVALID("SNAPSHOT-E003", Term.SNAPSHOT, FailureType.BAD_REQUEST),
	VNIC_PROFILE_ID_NOT_FOUND("VNICPROFILE-E001", Term.VNIC_PROFILE, FailureType.ID_NOT_FOUND),
	VNIC_PROFILE_NOT_FOUND("VNICPROFILE-E002", Term.VNIC_PROFILE, FailureType.NOT_FOUND),
	VNIC_PROFILE_VO_INVALID("VNICPROFILE-E003", Term.VNIC_PROFILE, FailureType.BAD_REQUEST),
	TEMPLATE_ID_NOT_FOUND("TEMPLATE-E001", Term.TEMPLATE, FailureType.ID_NOT_FOUND),
	TEMPLATE_NOT_FOUND("TEMPLATE-E002", Term.TEMPLATE, FailureType.NOT_FOUND),
	TEMPLATE_VO_INVALID("TEMPLATE-E003", Term.TEMPLATE, FailureType.BAD_REQUEST),
	CONSOLE_ID_NOT_FOUND("CONSOLE-E001", Term.CONSOLE, FailureType.ID_NOT_FOUND),
	CONSOLE_NOT_FOUND("CONSOLE-E002", Term.CONSOLE, FailureType.NOT_FOUND),
	CONSOLE_VO_INVALID("CONSOLE-E003", Term.CONSOLE, FailureType.BAD_REQUEST),
	TICKET_ID_NOT_FOUND("TICKET-E001", Term.TICKET, FailureType.ID_NOT_FOUND),
	TICKET_NOT_FOUND("TICKET-E002", Term.TICKET, FailureType.NOT_FOUND),
	TICKET_VO_INVALID("TICKET-E003", Term.TICKET, FailureType.BAD_REQUEST),
	CERT_ID_NOT_FOUND("CERT-E001", Term.CERT, FailureType.ID_NOT_FOUND),
	CERT_NOT_FOUND("CERT-E003", Term.CERT, FailureType.NOT_FOUND),
	UNKNOWN("UNKNOWN-E001", Term.UNKNOWN, FailureType.UNKNOWN),
	FILE_NOT_FOUND("FILE_NOT_FOUND", Term.DISK, FailureType.UNKNOWN),
	EXTERNAL_HOST_PROVIDER_NOT_FOUND("EXTERNAL_HOST_PROVIDER_NOT_FOUND", Term.EXTERNAL_HOST_PROVIDER, FailureType.UNKNOWN),
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
		ErrorPattern.CERT_ID_NOT_FOUND, -> Error("[${code}] ${term.desc} ${failureType.message}")
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
		ErrorPattern.CERT_NOT_FOUND, -> Error("[${code}] ${failureType.message} ${term.desc}")
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
		ErrorPattern.TICKET_VO_INVALID, -> Error("[${code}] ${term.desc} ${failureType.message}")
		ErrorPattern.NIC_UNLINKED_REQUIRED -> Error("[${code}] ${term.desc} ${failureType.message}: $additional")
		else -> Error(failureType.message)
	}
}
