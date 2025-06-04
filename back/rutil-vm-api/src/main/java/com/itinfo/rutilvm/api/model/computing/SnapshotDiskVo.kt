package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.api.repository.engine.DetailedDiskSnapshot
import com.itinfo.rutilvm.api.repository.engine.entity.VmSnapshotEntity
import com.itinfo.rutilvm.common.formatEnhancedFromLDT
import com.itinfo.rutilvm.common.ovirtDf

import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger
import java.sql.Timestamp
import java.time.LocalDateTime

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
 * @property interface_ [String]
 * @property imageId [String] disk snapshot id
 * @property propagateErrors [Boolean]
 * @property actualSize [BigInteger] 실제크기
 * @property provisionedSize [BigInteger] 가상크기
 * @property shareable [Boolean]
 * @property sparse [Boolean] 할당정책  씬true, 사전할당false
 * @property status [DiskStatus]
 * @property storageType [DiskStorageType]
 * @property wipeAfterDelete [Boolean]
 * // @property snapshotVo [SnapshotVo]
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
    val interface_: String = "",
    val imageId: String = "",
    val propagateErrors: Boolean = false,
    val actualSize: BigInteger = BigInteger.ZERO,
    val provisionedSize: BigInteger = BigInteger.ZERO,
    val shareable: Boolean = false,
    val sparse: Boolean = false,
    val status: DiskStatus = DiskStatus.LOCKED,
    val storageType: DiskStorageType = DiskStorageType.IMAGE,
    val wipeAfterDelete: Boolean = false,
	private val _creationDate: LocalDateTime? = null,
	val vmSnapshot: VmSnapshotEntity? = null,
	val vm: IdentifiedVo = IdentifiedVo(),
    val storageDomainVo: IdentifiedVo = IdentifiedVo(),
): Serializable {
    override fun toString(): String =
		gson.toJson(this)

	val creationDate: String
		get() = ovirtDf.formatEnhancedFromLDT(_creationDate)
	val vmSnapshotCreationDate: String
		get() = ovirtDf.formatEnhancedFromLDT(vmSnapshot?.creationDate)

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
        private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
        private var bAlias: String = ""; fun alias(block: () -> String?) { bAlias = block() ?: "" }
        private var bBackup: DiskBackup = DiskBackup.NONE; fun backup(block: () -> DiskBackup?) { bBackup = block() ?: DiskBackup.NONE }
        private var bContentType: DiskContentType = DiskContentType.DATA; fun contentType(block: () -> DiskContentType?) { bContentType = block() ?: DiskContentType.DATA }
        private var bFormat: DiskFormat = DiskFormat.RAW; fun format(block: () -> DiskFormat?) { bFormat = block() ?: DiskFormat.RAW }
        private var bInterface_: String = ""; fun interface_(block: () -> String?) { bInterface_ = block() ?: "" }
        private var bImageId: String = ""; fun imageId(block: () -> String?) { bImageId = block() ?: "" }
        private var bPropagateErrors: Boolean = false; fun propagateErrors(block: () -> Boolean?) { bPropagateErrors = block() ?: false }
        private var bActualSize: BigInteger = BigInteger.ZERO; fun actualSize(block: () -> BigInteger?) { bActualSize = block() ?: BigInteger.ZERO }
        private var bProvisionedSize: BigInteger = BigInteger.ZERO; fun provisionedSize(block: () -> BigInteger?) { bProvisionedSize = block() ?: BigInteger.ZERO }
        private var bShareable: Boolean = false; fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
        private var bSparse: Boolean = false; fun sparse(block: () -> Boolean?) { bSparse = block() ?: false }
        private var bStatus: DiskStatus = DiskStatus.LOCKED; fun status(block: () -> DiskStatus?) { bStatus = block() ?: DiskStatus.LOCKED }
        private var bStorageType: DiskStorageType = DiskStorageType.IMAGE; fun storageType(block: () -> DiskStorageType?) { bStorageType = block() ?: DiskStorageType.IMAGE }
		private var bWipeAfterDelete: Boolean = false;fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() ?: false }
		private var bCreationDate: LocalDateTime? = null;fun creationDate(block: () -> LocalDateTime?) { bCreationDate = block() }
		private var bVmSnapshot: VmSnapshotEntity? = null;fun vmSnapshot(block: () -> VmSnapshotEntity?) { bVmSnapshot = block() }
		private var bVm: IdentifiedVo =  IdentifiedVo(); fun vm(block: () -> IdentifiedVo?) { bVm = block() ?: IdentifiedVo() }
		// private var bSnapshotVo: IdentifiedVo =  IdentifiedVo(); fun snapshotVo(block: () -> IdentifiedVo?) { bSnapshotVo = block() ?: IdentifiedVo() }
        private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }

        fun build(): SnapshotDiskVo = SnapshotDiskVo(bId, bName, bDescription, bAlias, bBackup, bContentType, bFormat, bInterface_, bImageId, bPropagateErrors, bActualSize, bProvisionedSize, bShareable, bSparse, bStatus, bStorageType, bWipeAfterDelete, bCreationDate, bVmSnapshot, bVm, /*bSnapshotVo,*/ bStorageDomainVo,)
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


fun DiskSnapshot.toSnapshotDiskVo(detailDiskSnapshot: DetailedDiskSnapshot?): SnapshotDiskVo {
    return SnapshotDiskVo.builder {
        id { this@toSnapshotDiskVo.id() }
        name { this@toSnapshotDiskVo.name() }
        description {
			if (this@toSnapshotDiskVo.descriptionPresent()) this@toSnapshotDiskVo.description() else detailDiskSnapshot?.vmSnapshotDescription ?: ""
		}
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
		creationDate { detailDiskSnapshot?.diskSnapshotImageCreationDate }
		vmSnapshot {
			VmSnapshotEntity.builder {
				snapshotId { detailDiskSnapshot?.vmSnapshotId }
				description { detailDiskSnapshot?.vmSnapshotDescription }
				creationDate { detailDiskSnapshot?.vmSnapshotCreationDate }
			}
		}
		vm { IdentifiedVo.builder {
			id { detailDiskSnapshot?.connectedVmId.toString() }
			name { detailDiskSnapshot?.connectedVmName }
		}}
    }
}
fun List<DiskSnapshot>.toSnapshotDiskVos(detailDiskSnapshots: List<DetailedDiskSnapshot?>): List<SnapshotDiskVo> =
    this@toSnapshotDiskVos.zip(detailDiskSnapshots) { ds, dds ->
		ds.toSnapshotDiskVo(dds)
	}

fun Disk.toSnapshotDiskVoFromVm(): SnapshotDiskVo {
    return SnapshotDiskVo.builder {
        id { this@toSnapshotDiskVoFromVm.id() }
        name { this@toSnapshotDiskVoFromVm.name() }
        description { this@toSnapshotDiskVoFromVm.description() }
        alias { this@toSnapshotDiskVoFromVm.alias() }
        backup { this@toSnapshotDiskVoFromVm.backup() }
        contentType { this@toSnapshotDiskVoFromVm.contentType() }
        format { this@toSnapshotDiskVoFromVm.format() }
        imageId { this@toSnapshotDiskVoFromVm.imageId()}
        propagateErrors { this@toSnapshotDiskVoFromVm.propagateErrors() }
        actualSize { this@toSnapshotDiskVoFromVm.actualSize() }
        provisionedSize { this@toSnapshotDiskVoFromVm.provisionedSize() }
        shareable { this@toSnapshotDiskVoFromVm.shareable() }
        sparse { this@toSnapshotDiskVoFromVm.sparse() }
        status { this@toSnapshotDiskVoFromVm.status() }
        storageType { this@toSnapshotDiskVoFromVm.storageType() }
        wipeAfterDelete { this@toSnapshotDiskVoFromVm.wipeAfterDelete() }
    }
}
fun List<Disk>.toSnapshotDiskVoFromVms(): List<SnapshotDiskVo> =
    this@toSnapshotDiskVoFromVms.map { it.toSnapshotDiskVoFromVm() }

