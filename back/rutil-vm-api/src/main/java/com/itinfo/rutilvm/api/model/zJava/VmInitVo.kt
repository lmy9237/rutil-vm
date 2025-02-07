package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.itcloud.gson
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Vm
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(VmInitVo::class.java)


*/
/**
 * [VmInitVo]
 * 가상머신 초기실행
 *
 * @property isCloudInit [Boolean]
 * @property hostName [String]
 * @property timeStandard [String]
 * 인증
 * 네트워크
 * @property script [String] 사용자 지정 스크립트 
 *//*

class VmInitVo(
	val isCloudInit: Boolean = false,
	val hostName: String = "",
	val timeStandard: String = "",
	val script: String = ""
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bIsCloudInit: Boolean = false;fun isCloudInit(block: () -> Boolean?) { bIsCloudInit = block() ?: false}
		private var bHostName: String = "";fun hostName(block: () -> String?) { bHostName = block() ?: "" }
		private var bTimeStandard: String = "";fun timeStandard(block: () -> String?) { bTimeStandard = block() ?: "" }
		private var bScript: String = "";fun script(block: () -> String?) { bScript = block() ?: "" }
		fun build(): VmInitVo = VmInitVo(bIsCloudInit, bHostName, bTimeStandard, bScript)
	}

	companion object {
		inline fun builder(block: VmInitVo.Builder.() -> Unit): VmInitVo = VmInitVo.Builder().apply(block).build()
	}
}

*/
/**
 * [Vm.toVmInitVo]
 * 편집 - 초기실행
 *
 * @param system
 *
 * @return
 *//*

fun Vm.toVmInitVo(conn: Connection): VmInitVo {
	return VmInitVo.builder {
		isCloudInit { this@toVmInitVo.initializationPresent() }
		hostName {
			if (this@toVmInitVo.initializationPresent())
				this@toVmInitVo.initialization().hostName()
			else
				""
		}
	}
}*/
