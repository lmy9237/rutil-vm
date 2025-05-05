package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.Host
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(HostHwVo::class.java)

/**
 * [HostHwVo]
 * 호스트 하드웨어
 *
 * @property manufacturer [String] 생산자
 * @property family [String] 제품군
 * @property productName [String] 제품 이름
 * @property serialNum [String] 일련번호
 * @property uuid [String]
 * @property hwVersion [String] 버전
 * @property cpuName [String] cpu 모델
 * @property cpuType [String] cpu 유형
 * @property cpuTopologyCore [Int] cpu-topology-core
 * @property cpuTopologySocket [Int] cpu-topology-socket
 * @property cpuTopologyThread [Int] cpu-topology-thread
 * @property cpuTopologyAll [Int]  cpu core*socket*thread 논리 cpu 코어수
 * @property cpuOnline List<[Int]>  온라인 논리 CPU 수
 * // val hostCpuUnits: List<HostCpuUnit> = conn.findAllCpuUnitFromHost(this@toHostVo.id())
 */
class HostHwVo(
    val manufacturer: String = "",
    val family: String = "",
    val productName: String = "",
    val serialNum: String = "",
    val uuid: String = "",
    val hwVersion: String = "",
    val cpuName: String = "",
    val cpuType: String = "",
    val cpuTopologyCore: Int = 0,
    val cpuTopologySocket: Int = 0,
    val cpuTopologyThread: Int = 0,
    val cpuTopologyAll: Int = 0,
    val cpuOnline: List<Int> = listOf(),
): Serializable{
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bManufacturer: String = ""; fun manufacturer(block: () -> String?) { bManufacturer = block() ?: "" }
        private var bFamily: String = ""; fun family(block: () -> String?) { bFamily = block() ?: "" }
        private var bProductName: String = ""; fun productName(block: () -> String?) { bProductName = block() ?: "" }
        private var bSerialNum: String = ""; fun serialNum(block: () -> String?) { bSerialNum = block() ?: "" }
        private var bUuid: String = ""; fun uuid(block: () -> String?) { bUuid = block() ?: "" }
        private var bHwVersion: String = ""; fun hwVersion(block: () -> String?) { bHwVersion = block() ?: "" }
        private var bCpuName: String = ""; fun cpuName(block: () -> String?) { bCpuName = block() ?: "" }
        private var bCpuType: String = ""; fun cpuType(block: () -> String?) { bCpuType = block() ?: "" }
        private var bCpuTopologyCore: Int = 0; fun cpuTopologyCore(block: () -> Int?) { bCpuTopologyCore = block() ?: 0 }
        private var bCpuTopologySocket: Int = 0; fun cpuTopologySocket(block: () -> Int?) { bCpuTopologySocket = block() ?: 0 }
        private var bCpuTopologyThread: Int = 0; fun cpuTopologyThread(block: () -> Int?) { bCpuTopologyThread = block() ?: 0 }
        private var bCpuTopologyAll: Int = 0; fun cpuTopologyAll(block: () -> Int?) { bCpuTopologyAll = block() ?: 0 }
        private var bCpuOnline: List<Int> = listOf(); fun cpuOnline(block: () -> List<Int>?) { bCpuOnline = block() ?: listOf() }

        fun build(): HostHwVo = HostHwVo(bManufacturer, bFamily, bProductName, bSerialNum, bUuid, bHwVersion, bCpuName, bCpuType, bCpuTopologyCore, bCpuTopologySocket, bCpuTopologyThread, bCpuTopologyAll, bCpuOnline )
    }

    companion object {
        inline fun builder(block: HostHwVo.Builder.() -> Unit): HostHwVo = HostHwVo.Builder().apply(block).build()
    }
}

/**
 * 호스트 하드웨어 정보 받기
 * @return 하드웨어 정보
 */
fun Host.toHostHwVo(): HostHwVo {
    val hardwareInfo = this.hardwareInformation()
    val cpuInfo = this.cpu()
    val cpuTopology = if (cpuInfo.topologyPresent()) cpuInfo.topology() else null

    val cpuSocket = cpuTopology?.socketsAsInteger() ?: 0
    val cpuThread = cpuTopology?.threadsAsInteger() ?: 0
    val cpuCore = cpuTopology?.coresAsInteger() ?: 0
    val cpuTopologyAll = cpuSocket * cpuThread * cpuCore

   return HostHwVo.builder {
       family { if (hardwareInfo.familyPresent()) hardwareInfo.family() else "" }
       manufacturer { if(hardwareInfo.manufacturerPresent()) hardwareInfo.manufacturer() else "" }
       productName { if (hardwareInfo.productNamePresent()) hardwareInfo.productName() else "" }
       hwVersion { if (hardwareInfo.versionPresent()) hardwareInfo.version() else "" }
       cpuName { if (cpuInfo.namePresent()) cpuInfo.name() else "" }
       cpuType { if (cpuInfo.typePresent()) cpuInfo.type() else "" }
       uuid { if (hardwareInfo.uuidPresent()) hardwareInfo.uuid() else "" }
       serialNum { if (hardwareInfo.serialNumberPresent()) hardwareInfo.serialNumber() else "" }
       cpuTopologySocket { cpuSocket }
       cpuTopologyThread { cpuThread }
       cpuTopologyCore { cpuCore }
       cpuTopologyAll { cpuTopologyAll }
   }
}
