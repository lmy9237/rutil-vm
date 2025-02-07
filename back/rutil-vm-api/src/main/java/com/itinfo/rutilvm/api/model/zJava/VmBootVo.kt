package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create;

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findAllDisks
import com.itinfo.rutilvm.util.ovirt.findAllVmCdromsFromVm
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cdrom
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

*/
/**
 * [VmBootVo]
 * 부트 옵션
 *
 * @property firstDevice [String]
 * @property secDevice [String]
 * @property deviceList List<[String]>
 *
 * @property cdDvdConn [Boolean]
 * @property connId [String] cd/dvd 연결되면 뜰 iso id (사실 디스크 id)
 * @property connName [String]
 * @property bootingMenu [Boolean]
 * CDROM("cdrom"), HD("hd"), NETWORK("network");
 **//*
@Deprecated("사용안함")
class VmBootVo(
	val firstDevice: String = "",
	val secDevice: String = "",
	*/
/*
	val deviceList: List<String> = listOf(),
	val cdDvdConn: Boolean = false, 
	*//*

	val connId: String = "",
	val connName: String = "",
	val bootingMenu: Boolean = false,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bFirstDevice: String = "";fun firstDevice(block: () -> String?) { bFirstDevice = block() ?: "" }
		private var bSecDevice: String = "";fun secDevice(block: () -> String?) { bSecDevice = block() ?: "" }
		// private var bDeviceList: List<String> = listOf();fun deviceList(block: () -> List<String>?) { bDeviceList = block() ?: listOf() }
		// private var bCdDvdConn: Boolean = false;fun cdDvdConn(block: () -> Boolean?) { bCdDvdConn = block() ?: false }
		private var bConnId: String = "";fun connId(block: () -> String?) { bConnId = block() ?: "" }
		private var bConnName: String = "";fun connName(block: () -> String?) { bConnName = block() ?: "" }
		private var bBootingMenu: Boolean = false;fun bootingMenu(block: () -> Boolean?) { bBootingMenu = block() ?: false }
		fun build(): VmBootVo = VmBootVo(bFirstDevice, bSecDevice, */
/* bDeviceList, bCdDvdConn, *//*
 bConnId, bConnName, bBootingMenu)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: VmBootVo.Builder.() -> Unit): VmBootVo = VmBootVo.Builder().apply(block).build()
	}
}

*/
/**
 * [Vm.toVmBootVo]
 * 편집 - 부트 옵션
 *
 * @param system
 *
 * @return
 *//*

fun Vm.toVmBootVo(conn: Connection): VmBootVo {
	val cdrom: Cdrom? = conn.findAllVmCdromsFromVm(this@toVmBootVo.id()).firstOrNull()
	val cdromFileId: String = cdrom?.file()?.id() ?: ""
	val disk: Disk? = conn.findAllDisks("id=${cdromFileId}").firstOrNull()
	return VmBootVo.builder {
		firstDevice { this@toVmBootVo.os().boot().devices().first().value() }
		secDevice {
			if (this@toVmBootVo.os().boot().devices().size > 1)
				this@toVmBootVo.os().boot().devices()[1].value()
			else
				null
		}
		connId { cdromFileId }
		connName { disk?.name() }
	}
}*/
