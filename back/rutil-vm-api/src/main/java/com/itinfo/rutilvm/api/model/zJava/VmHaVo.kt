package com.itinfo.rutilvm.api.model.zJava

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ovirt.findStorageDomain
import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.WatchdogAction
import java.io.Serializable

/**
 * [VmHaVo]
 * 가상머신 고가용성
 *
 * @property ha [Boolean]  					고가용성
 * @property vmStorageDomainId [String]		가상 머신 임대 대상 스토리지 도메인
 * @property vmStorageDomainName [String]  
 * @property resumeOperation [String]		재개 동작
 * @property priority [Int]					우선순위 (낮음:1, 중간:50, 높음:100 )
 * @property watchDogModel [String]			워치독 모델 WatchdogModel.I6300ESB
 * @property watchDogAction [WatchdogAction] 워치독 작업
 * - [WatchdogAction.NONE]
 * - [WatchdogAction.RESET]
 * - [WatchdogAction.POWEROFF]
 * - [WatchdogAction.DUMP]
 * - [WatchdogAction.PAUSE]
 */
/*
@Deprecated("사용안함")
class VmHaVo(
	val isHa: Boolean = false,
	val vmStorageDomainId: String = "",
	val vmStorageDomainName: String = "",
	val resumeOperation: String = "",
	val priority: Int = 0,
	val watchDogModel: String = "",
	val watchDogAction: WatchdogAction = WatchdogAction.NONE
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bIsHa: Boolean = false;fun ha(block: () -> Boolean?) { bIsHa = block() ?: false}
		private var bVmStorageDomainId: String = "";fun vmStorageDomainId(block: () -> String?) { bVmStorageDomainId = block() ?: "" }
		private var bVmStorageDomainName: String = "";fun vmStorageDomainName(block: () -> String?) { bVmStorageDomainName = block() ?: "" }
		private var bResumeOperation: String = "";fun resumeOperation(block: () -> String?) { bResumeOperation = block() ?: "" }
		private var bPriority: Int = 0;fun priority(block: () -> Int?) { bPriority = block() ?: 0 }
		private var bWatchDogModel: String = "";fun watchDogModel(block: () -> String?) { bWatchDogModel = block() ?: "" }
		private var bWatchDogAction: WatchdogAction = WatchdogAction.NONE;fun watchDogAction(block: () -> WatchdogAction?) { bWatchDogAction = block() ?: WatchdogAction.NONE }
		fun build(): VmHaVo = VmHaVo(bIsHa, bVmStorageDomainId, bVmStorageDomainName, bResumeOperation, bPriority, bWatchDogModel, bWatchDogAction)
	}

	companion object {
		inline fun builder(block: VmHaVo.Builder.() -> Unit): VmHaVo = VmHaVo.Builder().apply(block).build()
	}
}
*/
/**
 * [Vm.toVmHaVo]
 * 편집 - 고가용성
 * @param system
 * @param vm
 * @return
 */
/*
fun Vm.toVmHaVo(conn: Connection): VmHaVo {
	return VmHaVo.builder {
		ha { this@toVmHaVo.highAvailability().enabled() }
		priority { this@toVmHaVo.highAvailability().priorityAsInteger() }
		vmStorageDomainId { if (this@toVmHaVo.leasePresent()) this@toVmHaVo.lease().storageDomain().id() else null }
		vmStorageDomainName {
			if (this@toVmHaVo.leasePresent())
				conn.findStorageDomain(this@toVmHaVo.lease().storageDomain().id())?.name()
			else null
		}
		resumeOperation { this@toVmHaVo.storageErrorResumeBehaviour().value() } // 워치독?
		watchDogAction { WatchdogAction.NONE }
	}
}
*/
