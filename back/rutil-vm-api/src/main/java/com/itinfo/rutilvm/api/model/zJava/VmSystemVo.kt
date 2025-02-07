package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable
import java.math.BigInteger

*/
/**
 * [VmSystemVo]
 * 시스템
 *
 * @property osSystem [String]
 * @property chipsetFirmwareType [String] bios.type
 *
 * @property memorySize [BigInteger] 		메모리 크기
 * @property memoryMax [BigInteger] 		최대 메모리
 * @property memoryActual [BigInteger]	할당할 실제 메모리
 *
 * 고급 매개변수
 *
 * @property cpuTopologyCnt [Int]  총 가상 CPU
 * @property cpuTopologyCore [Int]  가상 소켓
 * @property cpuTopologySocket [Int]  가상 소켓 당 코어
 * @property cpuTopologyThread [Int]  코어당 스레드
 *
 * @property userEmulation [String] 사용자 정의 에뮬레이션 시스템
 * @property userCpu [String] 		사용자 정의 CPU
 * @property userVersion [String] 	사용자 정의 호환 버전
 *
 * 인스턴스 유형이 바뀌면 가상 소켓과 메모리크기가 변함
 * https://192.168.0.80/ovirt-engine/api/instancetypes
 *
 * @property instanceType [String] 	인스턴스 유형 (none, large, medium, small, tiny, xlarge)
 * @property timeOffset [String] 	하드웨어 클럭의 시간 오프셋 기본값으로 하면됨 greenwich standard time, kst
 *//*
@Deprecated("사용안함")
class VmSystemVo(
	val memorySize: BigInteger = BigInteger.ZERO,
	val memoryMax: BigInteger = BigInteger.ZERO,
	val memoryActual: BigInteger = BigInteger.ZERO,

	val vCpuCnt: Int = 0 ,
	val vCpuSocket: Int = 0 ,
	val vCpuSocketCore: Int = 0 ,
	val vCpuCoreThread: Int = 0 ,
	val userEmulation: String = "",
	val userCpu: String = "",
	val userVersion: String = "",

	val instanceType: String = "",
	val timeOffset: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bMemorySize: Long = 0L;fun memorySize(block: () -> Long?) { bMemorySize = block() ?: 0L }
		private var bMemoryMax: Long = 0L;fun memoryMax(block: () -> Long?) { bMemoryMax = block() ?: 0L }
		private var bMemoryActual: BigInteger = BigInteger.ZERO;fun memoryActual(block: () -> BigInteger?) { bMemoryActual = block() ?: BigInteger.ZERO }
		private var bVCpuCnt: Int = 0 ;fun vCpuCnt(block: () -> Int?) { bVCpuCnt = block() ?: 0 }
		private var bVCpuSocket: Int = 0 ;fun vCpuSocket(block: () -> Int?) { bVCpuSocket = block() ?: 0 }
		private var bVCpuSocketCore: Int = 0 ;fun vCpuSocketCore(block: () -> Int?) { bVCpuSocketCore = block() ?: 0 }
		private var bVCpuCoreThread: Int = 0 ;fun vCpuCoreThread(block: () -> Int?) { bVCpuCoreThread = block() ?: 0 }
		private var bUserEmulation: String = "";fun userEmulation(block: () -> String?) { bUserEmulation = block() ?: "" }
		private var bUserCpu: String = "";fun userCpu(block: () -> String?) { bUserCpu = block() ?: "" }
		private var bUserVersion: String = "";fun userVersion(block: () -> String?) { bUserVersion = block() ?: "" }
		private var bInstanceType: String = "";fun instanceType(block: () -> String?) { bInstanceType = block() ?: "" }
		private var bTimeOffset: String = "";fun timeOffset(block: () -> String?) { bTimeOffset = block() ?: "" }
		fun build(): VmSystemVo = VmSystemVo(bMemorySize, bMemoryMax, bMemoryActual, bVCpuCnt, bVCpuSocket, bVCpuSocketCore, bVCpuCoreThread, bUserEmulation, bUserCpu, bUserVersion, bInstanceType, bTimeOffset)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: VmSystemVo.Builder.() -> Unit): VmSystemVo = VmSystemVo.Builder().apply(block).build()
	}
}


*/
/**
 * [Vm.toVmSystemVo]
 * 편집 - 시스템
 *
 * @param conn [Connection]
 *
 * @return
 *//*

fun Vm.toVmSystemVo(conn: Connection): VmSystemVo {
	val convertMb = BigInteger.valueOf(1024).pow(2)

	return VmSystemVo.builder {
		memorySize { this@toVmSystemVo.memory() }
		memoryActual { this@toVmSystemVo.memoryPolicy().guaranteed() }
//		memoryActual { this@toVmSystemVo.memoryPolicy().guaranteed().divide(convertMb).toLong() }
		memoryMax { this@toVmSystemVo.memoryPolicy().max().divide(convertMb).toLong() }
		vCpuCnt {
			this@toVmSystemVo.cpu().topology().coresAsInteger() *
					this@toVmSystemVo.cpu().topology().socketsAsInteger() *
					this@toVmSystemVo.cpu().topology().threadsAsInteger()
		}
		vCpuSocket { this@toVmSystemVo.cpu().topology().socketsAsInteger() }
		vCpuSocketCore { this@toVmSystemVo.cpu().topology().coresAsInteger() }
		vCpuCoreThread { this@toVmSystemVo.cpu().topology().threadsAsInteger() }
		timeOffset { this@toVmSystemVo.timeZone().name() }
	}
}*/
