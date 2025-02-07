package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findCpuProfile
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Vm
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(VmResourceVo::class.java)

*/
/**
 * [VmResourceVo]
 * 리소스 할당
 *
 * @property cpuProfileId [String] 			CPU 프로파일
 * @property cpuProfileName [String]
 * @property cpuShare [Int] 				CPU 공유
 * @property cpuPinningPolicy [String] 		CPU Pinning Policy
 * // @property cpuPinningTopology [String]	피닝 토폴로지  // ????
 * @property isMemoryBalloon [Boolean] 		메모리 balloon 활성화
 * @property ioThread [Boolean] 			I/O 스레드 활성화
 * @property ioThreadCnt [Int] 				I/O 스레드 활성화
 * @property multiQue [Boolean] 			멀티 큐 사용
 * @property virtSCSIEnable [Boolean] 		VirtIO-SCSI 활성화
 * @property virtIOcnt [String] 			VirtIO-SCSI Multi Queues
 *
 *
 * AutoPinningPolicy ADJUST("adjust"), DISABLED("disabled"), EXISTING("existing");
 * CpuPinningPolicy  DEDICATED("dedicated"), MANUAL("안되는거임"), NONE("none"), RESIZE_AND_PIN_NUMA("resize_and_pin_numa");
 * CpuShare 비활성화, 비활성화됨(0), 낮음(512), 중간(1024), 높음(2048), 사용자 지정
 *//*

@Deprecated("사용안함")
class VmResourceVo(
	val cpuProfileId: String = "",
	val cpuProfileName: String = "",
	val cpuShare: Int = 0,
	val cpuPinningPolicy: String = "",
//	val cpuPinningTopology: String = "",

	val isMemoryBalloon: Boolean = false,

	val ioThread: Boolean = false,
	val ioThreadCnt: Int = 0,
	val multiQue: Boolean = false,

	val virtSCSIEnable: Boolean = false,
	val virtIOcnt: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bCpuProfileId: String = "";fun cpuProfileId(block: () -> String?) { bCpuProfileId = block() ?: "" }
		private var bCpuProfileName: String = "";fun cpuProfileName(block: () -> String?) { bCpuProfileName = block() ?: "" }
		private var bCpuShare: Int = 0;fun cpuShare(block: () -> Int?) { bCpuShare = block() ?: 0 }
		private var bCpuPinningPolicy: String = "";fun cpuPinningPolicy(block: () -> String?) { bCpuPinningPolicy = block() ?: "" }
		// private var bCpuPinningTopology: String = "";fun cpuPinningTopology(block: () -> String?) { bCpuPinningTopology = block() ?: "" }
		private var bIsMemoryBalloon: Boolean = false;fun isMemoryBalloon(block: () -> Boolean?) { bIsMemoryBalloon = block() ?: false }
		private var bIoThread: Boolean = false;fun ioThread(block: () -> Boolean?) { bIoThread = block() ?: false }
		private var bIoThreadCnt: Int = 0;fun ioThreadCnt(block: () -> Int?) { bIoThreadCnt = block() ?: 0 }
		private var bMultiQue: Boolean = false;fun multiQue(block: () -> Boolean?) { bMultiQue = block() ?: false }
		private var bVirtSCSIEnable: Boolean = false;fun virtSCSIEnable(block: () -> Boolean?) { bVirtSCSIEnable = block() ?: false }
		private var bVirtIOcnt: String = "";fun virtIOcnt(block: () -> String?) { bVirtIOcnt = block() ?: "" }
		fun build(): VmResourceVo = VmResourceVo(bCpuProfileId, bCpuProfileName, bCpuShare, bCpuPinningPolicy, */
/* bCpuPinningTopology, *//*
 bIsMemoryBalloon, bIoThread, bIoThreadCnt, bMultiQue, bVirtSCSIEnable, bVirtIOcnt)
	}

	companion object {
		inline fun builder(block: VmResourceVo.Builder.() -> Unit): VmResourceVo =
			VmResourceVo.Builder().apply(block).build()
	}
}

*/
/**
 * [Vm.toVmResourceVo]
 * 편집 - 리소스 할당
 *
 * @param system
 *
 * @return
 *//*

fun Vm.toVmResourceVo(conn: Connection): VmResourceVo {
	return VmResourceVo.builder {
		cpuProfileId { this@toVmResourceVo.cpuProfile().id() }
		cpuProfileName {
			conn.findCpuProfile(this@toVmResourceVo.cpuProfile().id())?.name()
		}
		cpuShare { this@toVmResourceVo.cpuSharesAsInteger() }
		cpuPinningPolicy { this@toVmResourceVo.cpuPinningPolicy().value() }
		isMemoryBalloon { this@toVmResourceVo.memoryPolicy().ballooning() }
		ioThread { this@toVmResourceVo.io().threadsPresent() }
		ioThreadCnt  { if (this@toVmResourceVo.io().threadsPresent()) this@toVmResourceVo.io().threadsAsInteger() else 0 }
		multiQue { this@toVmResourceVo.multiQueuesEnabled() }
//		virtSCSIEnable { this@toVmResourceVo.virtioScsiMultiQueuesEnabled() }
		// virtio-scsi multi queues
	}
}*/
