package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromApplicationsToIdentifiedVos
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.network.toNicVoFromSnapshot
import com.itinfo.rutilvm.api.model.network.toNicVosFromSnapshot
import com.itinfo.rutilvm.api.model.network.toNicVosFromVm
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.toAddSnapshotDisks
import com.itinfo.rutilvm.api.ovirtDf
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.toError

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.SnapshotBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(SnapshotVo::class.java)

/**
 * [SnapshotVo]
 *
 * @property id[String]
 * @property description [String]
 * @property date [String]
 * @property persistMemory [Boolean] 메모리 저장 여부 f/t
 * @property status [String]
 * @property vmVo [VmVo]
 * @property snapshotDiskVos List<[SnapshotDiskVo]>
 * @property nicVos List<[NicVo]>
 * @property applicationVos List<[IdentifiedVo]>
 * @property diskAttachmentVos List<[DiskAttachmentVo]>
 */
class SnapshotVo (
    val id: String = "",
    val description: String = "",
    val status: String = "",
    val date: String = "",
    val persistMemory: Boolean = false,
    val vmVo: VmVo = VmVo(),
    val snapshotDiskVos: List<SnapshotDiskVo> = listOf(),
    val nicVos: List<NicVo> = listOf(),
    val applicationVos: List<IdentifiedVo> = listOf(),
    val diskAttachmentVos: List<DiskAttachmentVo> = listOf(), // 스냅샷 생성시 디스크 포함할 목록
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
        private var bDescription: String = ""; fun description(block: () -> String?) { bDescription= block() ?: "" }
        private var bStatus: String = ""; fun status(block: () -> String?) { bStatus= block() ?: "" }
        private var bDate: String = ""; fun date(block: () -> String?) { bDate= block() ?: "" }
        private var bPersistMemory: Boolean = false; fun persistMemory(block: () -> Boolean?) { bPersistMemory= block() ?: false }
        private var bVmVo: VmVo = VmVo(); fun vmVo(block: () -> VmVo?) { bVmVo = block() ?: VmVo()  }
        private var bSnapshotDiskVos: List<SnapshotDiskVo> = listOf(); fun snapshotDiskVos(block: () -> List<SnapshotDiskVo>?) { bSnapshotDiskVos = block() ?: listOf() }
        private var bNicVos: List<NicVo> = listOf(); fun nicVos(block: () -> List<NicVo>?) { bNicVos = block() ?: listOf() }
        private var bApplicationVos: List<IdentifiedVo> = listOf(); fun applicationVos(block: () -> List<IdentifiedVo>?) { bApplicationVos = block() ?: listOf() }
        private var bDiskAttachmentVos: List<DiskAttachmentVo> = listOf(); fun diskAttachmentVos(block: () -> List<DiskAttachmentVo>?) { bDiskAttachmentVos = block() ?: listOf() }

        fun build(): SnapshotVo = SnapshotVo(bId, bDescription, bStatus, bDate, bPersistMemory, bVmVo, bSnapshotDiskVos, bNicVos, bApplicationVos, bDiskAttachmentVos )
    }
    companion object {
        inline fun builder(block: SnapshotVo.Builder.() -> Unit): SnapshotVo = SnapshotVo.Builder().apply(block).build()
    }
}

fun Snapshot.toSnapshotIdName(): SnapshotVo = SnapshotVo.builder {
    id { this@toSnapshotIdName.id() }
    description { this@toSnapshotIdName.description() }
}
fun List<Snapshot>.toSnapshotsIdName(): List<SnapshotVo> =
    this@toSnapshotsIdName.map { it.toSnapshotIdName() }


fun Snapshot.toSnapshotVo(conn: Connection, vmId: String): SnapshotVo {
    val vm: Vm = conn.findVm(vmId)
        .getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toError()
    val disks: List<Disk> = conn.findAllSnapshotDisksFromVm(vmId, this@toSnapshotVo.id()).getOrDefault(listOf())
    val nics: List<Nic> = conn.findAllSnapshotNicsFromVm(vmId, this@toSnapshotVo.id()).getOrDefault(listOf())
    val applications: List<Application> = conn.findAllApplicationsFromVm(vmId).getOrDefault(listOf())

    return SnapshotVo.builder {
        id { this@toSnapshotVo.id() }
        description { this@toSnapshotVo.description() }
        date { if (this@toSnapshotVo.vmPresent()) ovirtDf.format(this@toSnapshotVo.date().time) else "현재" }
        status { this@toSnapshotVo.snapshotStatus().value() }
        persistMemory { this@toSnapshotVo.persistMemorystate() }
        vmVo { vm.toVmSystem() }
        snapshotDiskVos { disks.toSnapshotDiskVoFromVms() }
        nicVos { nics.toNicVosFromSnapshot(conn, vmId) }
        applicationVos { applications.fromApplicationsToIdentifiedVos() }
    }
}
fun List<Snapshot>.toSnapshotVos(conn: Connection, vmId: String): List<SnapshotVo> =
    this@toSnapshotVos.map { it.toSnapshotVo(conn, vmId) }


fun SnapshotVo.toSnapshotBuilder(): SnapshotBuilder {
    log.info("toSnapshotBuilder: {}", this)
    return SnapshotBuilder()
        .description(this@toSnapshotBuilder.description)
        .persistMemorystate(this@toSnapshotBuilder.persistMemory) // 메모리 저장 t/f
        .diskAttachments(this@toSnapshotBuilder.diskAttachmentVos.toAddSnapshotDisks())
}

fun SnapshotVo.toAddSnapshot(): Snapshot =
    this@toAddSnapshot.toSnapshotBuilder().build()

