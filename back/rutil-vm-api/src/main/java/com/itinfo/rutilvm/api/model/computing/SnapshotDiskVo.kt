package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo

import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(SnapshotDiskVo::class.java)

/**
 * [SnapshotDiskVo]
 *
 * @property id [String]  disk id
 * @property name [String] disk 별칭
 * @property description [String]
 * @property alias [String] disk 별칭
 * @property backup [String]
 * @property contentType [DiskContentType]
 * @property format [DiskFormat]
 * @property imageId [String] disk snapshot id
 * @property propagateErrors [Boolean]
 * @property actualSize [BigInteger] 실제크기
 * @property provisionedSize [BigInteger] 가상크기
 * @property shareable [Boolean]
 * @property sparse [Boolean] 할당정책  씬true, 사전할당false
 * @property status [DiskStatus]
 * @property storageType [DiskStorageType]
 * @property wipeAfterDelete [Boolean]
 * @property snapshotVo [SnapshotVo]
 * @property storageDomainVo [IdentifiedVo]
 * DiskInterface
 */
class SnapshotDiskVo (
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val alias: String = "",
    val backup: DiskBackup = DiskBackup.NONE,
    val contentType: DiskContentType = DiskContentType.DATA,
    val format: DiskFormat = DiskFormat.RAW,
    val imageId: String = "",
    val propagateErrors: Boolean = false,
    val actualSize: BigInteger = BigInteger.ZERO,
    val provisionedSize: BigInteger = BigInteger.ZERO,
    val shareable: Boolean = false,
    val sparse: Boolean = false,
    val status: DiskStatus = DiskStatus.LOCKED,
    val storageType: DiskStorageType = DiskStorageType.IMAGE,
    val wipeAfterDelete: Boolean = false,
    val snapshotVo: IdentifiedVo = IdentifiedVo(),
    val storageDomainVo: IdentifiedVo = IdentifiedVo(),

    ): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
        private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
        private var bAlias: String = ""; fun alias(block: () -> String?) { bAlias = block() ?: "" }
        private var bBackup: DiskBackup = DiskBackup.NONE; fun backup(block: () -> DiskBackup?) { bBackup = block() ?: DiskBackup.NONE }
        private var bContentType: DiskContentType = DiskContentType.DATA; fun contentType(block: () -> DiskContentType?) { bContentType = block() ?: DiskContentType.DATA }
        private var bFormat: DiskFormat = DiskFormat.RAW; fun format(block: () -> DiskFormat?) { bFormat = block() ?: DiskFormat.RAW }
        private var bImageId: String = ""; fun imageId(block: () -> String?) { bImageId = block() ?: "" }
        private var bPropagateErrors: Boolean = false; fun propagateErrors(block: () -> Boolean?) { bPropagateErrors = block() ?: false }
        private var bActualSize: BigInteger = BigInteger.ZERO; fun actualSize(block: () -> BigInteger?) { bActualSize = block() ?: BigInteger.ZERO }
        private var bProvisionedSize: BigInteger = BigInteger.ZERO; fun provisionedSize(block: () -> BigInteger?) { bProvisionedSize = block() ?: BigInteger.ZERO }
        private var bShareable: Boolean = false; fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
        private var bSparse: Boolean = false; fun sparse(block: () -> Boolean?) { bSparse = block() ?: false }
        private var bStatus: DiskStatus = DiskStatus.LOCKED; fun status(block: () -> DiskStatus?) { bStatus = block() ?: DiskStatus.LOCKED }
        private var bStorageType: DiskStorageType = DiskStorageType.IMAGE; fun storageType(block: () -> DiskStorageType?) { bStorageType = block() ?: DiskStorageType.IMAGE }
        private var bWipeAfterDelete: Boolean = false; fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() ?: false }
        private var bSnapshotVo: IdentifiedVo =  IdentifiedVo(); fun snapshotVo(block: () -> IdentifiedVo?) { bSnapshotVo = block() ?: IdentifiedVo() }
        private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }

        fun build(): SnapshotDiskVo = SnapshotDiskVo(bId, bName, bDescription, bAlias, bBackup, bContentType, bFormat, bImageId, bPropagateErrors, bActualSize, bProvisionedSize, bShareable, bSparse, bStatus, bStorageType, bWipeAfterDelete, bSnapshotVo, bStorageDomainVo,)
    }

    companion object {
        inline fun builder(block: SnapshotDiskVo.Builder.() -> Unit): SnapshotDiskVo = SnapshotDiskVo.Builder().apply(block).build()
    }
}

fun Disk.toSnapshotDiskIdName(): SnapshotDiskVo = SnapshotDiskVo.builder {
    id { this@toSnapshotDiskIdName.id() }
    name { this@toSnapshotDiskIdName.name() }
}
fun List<Disk>.toSnapshotDisksIdName(): List<SnapshotDiskVo> =
    this@toSnapshotDisksIdName.map { it.toSnapshotDiskIdName() }


fun DiskSnapshot.toSnapshotDiskVo(): SnapshotDiskVo {
    return SnapshotDiskVo.builder {
        id { this@toSnapshotDiskVo.id() }
        name { this@toSnapshotDiskVo.name() }
        description { this@toSnapshotDiskVo.description() }
        alias { this@toSnapshotDiskVo.alias() }
        backup { this@toSnapshotDiskVo.backup() }
        contentType { this@toSnapshotDiskVo.contentType() }
        format { this@toSnapshotDiskVo.format() }
        imageId { this@toSnapshotDiskVo.imageId()}
        propagateErrors { this@toSnapshotDiskVo.propagateErrors() }
        actualSize { this@toSnapshotDiskVo.actualSize() }
        provisionedSize { this@toSnapshotDiskVo.provisionedSize() }
        shareable { this@toSnapshotDiskVo.shareable() }
        sparse { this@toSnapshotDiskVo.sparse() }
        status { this@toSnapshotDiskVo.status() }
        storageType { this@toSnapshotDiskVo.storageType() }
        wipeAfterDelete { this@toSnapshotDiskVo.wipeAfterDelete() }
    }
}
fun List<DiskSnapshot>.toSnapshotDiskVos(): List<SnapshotDiskVo> =
    this@toSnapshotDiskVos.map { it.toSnapshotDiskVo() }

fun Disk.toSnapshotDiskVoFromVm(): SnapshotDiskVo {
    val disk = this@toSnapshotDiskVoFromVm
    return SnapshotDiskVo.builder {
        id { disk.id() }
        name { disk.name() }
        description { disk.description() }
        alias { disk.alias() }
        backup { disk.backup() }
        contentType { disk.contentType() }
        format { disk.format() }
        imageId { disk.imageId()}
        propagateErrors { disk.propagateErrors() }
        actualSize { disk.actualSize() }
        provisionedSize { disk.provisionedSize() }
        shareable { disk.shareable() }
        sparse { disk.sparse() }
        status { disk.status() }
        storageType { disk.storageType() }
        wipeAfterDelete { disk.wipeAfterDelete() }
    }
}
fun List<Disk>.toSnapshotDiskVoFromVms(): List<SnapshotDiskVo> =
    this@toSnapshotDiskVoFromVms.map { it.toSnapshotDiskVoFromVm() }

