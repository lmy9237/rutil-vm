/*
package com.itinfo.rutilvm.api.model.storage

import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findDisk
import com.itinfo.rutilvm.util.ovirt.findStorageType
import com.itinfo.rutilvm.util.ovirt.findVm
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskAttachment
import org.ovirt.engine.sdk4.types.Vm
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(VmDiskVo::class.java)
*/
/**
 * [VmDiskVo]
 * vms-disk_attachments
 * 
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * 
 * DiskVo 에 있는 내용임 
 * @property type [String]			유형
 * @property status [String]		상태
 * @property connection [String]	연결대상 ?
 * @property virtualSize [BigInteger]
 * 
 * @property isActive [Boolean]
 * @property isBootAble [Boolean]
 * @property isPassDiscard [Boolean]
 * @property isReadOnly [Boolean]
 * @property isUseScsi [Boolean]
 * 
 * @property interfaceName [String]
 * @property logicalName [String]
 * 
 *//*

@Deprecated("diskattachment 내용")
class VmDiskVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val type: String = "",
	val status: String = "",
	val connection: String = "",
	val virtualSize: BigInteger = BigInteger.ZERO,

	val isActive: Boolean = false,
	val isBootable: Boolean = false,
	val isPassDiscard: Boolean = false,
	val isReadOnly: Boolean = false,
	val isUseScsi: Boolean = false,

	val interfaceName: String = "",
	val logicalName: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bType: String = "";fun type(block: () -> String?) { bType = block() ?: "" }
		private var bStatus: String = "";fun status(block: () -> String?) { bStatus = block() ?: "" }
		private var bConnection: String = "";fun connection(block: () -> String?) { bConnection = block() ?: "" }
		private var bVirtualSize: BigInteger = BigInteger.ZERO;fun virtualSize(block: () -> BigInteger?) { bVirtualSize = block() ?: BigInteger.ZERO }
		private var bIsActive: Boolean = false;fun isActive(block: () -> Boolean?) { bIsActive = block() ?: false }
		private var bIsBootable: Boolean = false;fun isBootable(block: () -> Boolean?) { bIsBootable = block() ?: false }
		private var bIsPassDiscard: Boolean = false;fun isPassDiscard(block: () -> Boolean?) { bIsPassDiscard = block() ?: false }
		private var bIsReadOnly: Boolean = false;fun isReadOnly(block: () -> Boolean?) { bIsReadOnly = block() ?: false }
		private var bIsUseScsi: Boolean = false;fun isUseScsi(block: () -> Boolean?) { bIsUseScsi = block() ?: false }
		private var bInterfaceName: String = "";fun interfaceName(block: () -> String?) { bInterfaceName = block() ?: "" }
		private var bLogicalName: String = "";fun logicalName(block: () -> String?) { bLogicalName = block() ?: "" }
		fun build(): VmDiskVo = VmDiskVo(bId, bName, bDescription, bType, bStatus, bConnection, bVirtualSize, bIsActive, bIsBootable, bIsPassDiscard, bIsReadOnly, bIsUseScsi, bInterfaceName, bLogicalName)
	}
	
	companion object {
		inline fun builder(block: VmDiskVo.Builder.() -> Unit): VmDiskVo = VmDiskVo.Builder().apply(block).build()
	}
}

fun DiskAttachment.toVmDiskVo(conn: Connection, vmId: String): VmDiskVo {
	val vm: Vm? =
		conn.findVm(vmId)
			.getOrNull()
	val disk: Disk? =
		conn.findDisk(this@toVmDiskVo.disk().id())
			.getOrNull()

	return VmDiskVo.builder {
		id { this@toVmDiskVo.id() }
		name { disk?.name() }
		status { disk?.status()?.value() }  // 상태
		description { disk?.description() }
		virtualSize { disk?.provisionedSize() }
		isActive { this@toVmDiskVo.active() }
		isReadOnly { this@toVmDiskVo.readOnly() }
		isBootable { this@toVmDiskVo.bootable() }
		connection { vm?.name() }
		interfaceName { this@toVmDiskVo.interface_().value() }
		logicalName { this@toVmDiskVo.logicalName() }
		type { disk?.storageType()?.findStorageType() } // 유형
	}
}

fun List<DiskAttachment>.toVmDiskVos(conn: Connection, vmId: String): List<VmDiskVo> =
	this@toVmDiskVos.map { it.toVmDiskVo(conn, vmId) }*/
