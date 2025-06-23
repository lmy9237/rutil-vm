package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.ovirt.business.DiskContentType
import com.itinfo.rutilvm.api.ovirt.business.DiskStatus
import com.itinfo.rutilvm.api.ovirt.business.DiskStorageType
import com.itinfo.rutilvm.api.ovirt.business.StorageTypeB
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredDiskEntity
import com.itinfo.rutilvm.common.formatEnhancedFromLDT
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DiskBuilder
import org.ovirt.engine.sdk4.builders.DiskProfileBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskBackup
import org.ovirt.engine.sdk4.types.DiskFormat
import org.ovirt.engine.sdk4.types.DiskProfile
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.StorageType
import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable
import java.math.BigInteger
import java.time.LocalDateTime
import java.util.UUID

/**
 * [DiskImageVo]
 * 스토리지도메인 - 디스크 이미지 생성
 * 가상머신 - 생성 - 인스턴스 이미지 - 생성
 *
 * @property id [String]
 * @property size [BigInteger]
 * @property appendSize [BigInteger] 확장크기
 * @property alias [String] 별칭(이름과 같음)
 * @property description [String] 설명
 * @property sparse [Boolean] 할당 정책 (씬 true, 사전할당 false)
 * @property wipeAfterDelete [Boolean] 삭제 후 초기화
 * @property sharable [Boolean] 공유가능 (공유가능 o 이라면 증분백업 안됨 FRONT에서 막기?)
 * @property backup [Boolean] 증분 백업 사용 (기본이 true)
 * @property format [DiskFormat]
 * @property imageId [String]
 * @property virtualSize [BigInteger] 가상크기 (provisionedSize)
 * @property actualSize [BigInteger] 실제크기
 * @property status [DiskStatus] 디스크상태
 * @property contentType [DiskContentType]
 * @property storageType [DiskStorageType] 유형
 * @property createDate [String] 생성일자
 * @property connectVm [IdentifiedVo] 연결대상(가상머신)
 * @property connectTemplate [IdentifiedVo] 연결대상(템플릿)
 * @property diskProfileVo [IdentifiedVo] 디스크 프로파일 (스토리지-디스크프로파일)
 * @property storageDomainVo [IdentifiedVo]
 * @property dataCenterVo [IdentifiedVo] <스토리지-디스크-생성>
 // * @property diskProfileVos List<[IdentifiedVo]> 디스크 프로파일 목록
 */
class DiskImageVo(
	val id: String = "",
	val size: BigInteger = BigInteger.ZERO,
	val appendSize: BigInteger = BigInteger.ZERO,
	val alias: String = "",
	val description: String = "",
	val sparse: Boolean = false,
	val wipeAfterDelete: Boolean = false,
	val sharable: Boolean = false,
	val backup: Boolean = false,
	val format: DiskFormat = DiskFormat.RAW,
	val imageId: String = String(),
	val virtualSize: BigInteger = BigInteger.ZERO,
	val actualSize: BigInteger = BigInteger.ZERO,
	val status: DiskStatus? = DiskStatus.locked,
	val contentType: DiskContentType? = DiskContentType.data, // unknown
	val storageType: DiskStorageType? = DiskStorageType.image,
	private val _dateCreated: LocalDateTime? = null,
	val type: String = "",
	val connectVm: IdentifiedVo = IdentifiedVo(),
	val connectTemplate: IdentifiedVo = IdentifiedVo(),
	val diskProfileVo: IdentifiedVo = IdentifiedVo(),
	val storageDomainVo: IdentifiedVo = IdentifiedVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	// val diskProfileVos: List<IdentifiedVo> = listOf()
): Serializable {
	val dateCreated: String?		get() = ovirtDf.formatEnhancedFromLDT(_dateCreated)
	val statusCode: String?			get() = status?.code
	// val statusEn: String?			get() = status?.en ?: "N/A"
	// val statusKr: String?			get() = status?.kr ?: "알 수 없음"

	val contentTypeCode: String		get() = contentType?.code ?: DiskContentType.data.code
	val contentTypeEn: String 		get() = contentType?.en ?: "N/A"
	val contentTypeKr: String		get() = contentType?.kr ?: "알 수 없음"

	val storageTypeCode: String		get() = storageType?.code ?: DiskStorageType.image.code
	/*
	val storageTypeEn: String
		get() = storageType?.en ?: "N/A"
	val storageTypeKr: String
		get() = storageType?.kr ?: "알 수 없음"
	*/

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bSize: BigInteger = BigInteger.ZERO;fun size(block: () -> BigInteger?) { bSize = block() ?: BigInteger.ZERO }
		private var bAppendSize: BigInteger = BigInteger.ZERO;fun appendSize(block: () -> BigInteger?) { bAppendSize = block() ?: BigInteger.ZERO }
		private var bAlias: String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bSparse: Boolean = false;fun sparse(block: () -> Boolean?) { bSparse = block() ?: false }
		private var bWipeAfterDelete: Boolean = false;fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() ?: false }
		private var bSharable: Boolean = false;fun sharable(block: () -> Boolean?) { bSharable = block() ?: false }
		private var bBackup: Boolean = false;fun backup(block: () -> Boolean?) { bBackup = block() ?: false }
		private var bFormat: DiskFormat = DiskFormat.RAW;fun format(block: () -> DiskFormat?) { bFormat = block() ?: DiskFormat.RAW }
		private var bImageId: String = "";fun imageId(block: () -> String?) { bImageId = block() ?: "" }
		private var bVirtualSize: BigInteger = BigInteger.ZERO;fun virtualSize(block: () -> BigInteger?) { bVirtualSize = block() ?: BigInteger.ZERO }
		private var bActualSize: BigInteger = BigInteger.ZERO;fun actualSize(block: () -> BigInteger?) { bActualSize = block() ?: BigInteger.ZERO }
		private var bStatus: DiskStatus = DiskStatus.locked;fun status(block: () -> DiskStatus?) { bStatus = block() ?: DiskStatus.locked }
		private var bContentType: DiskContentType? = DiskContentType.data;fun contentType(block: () -> DiskContentType?) { bContentType = block() ?: DiskContentType.data }
		private var bStorageType: DiskStorageType? = DiskStorageType.image;fun storageType(block: () -> DiskStorageType?) { bStorageType = block() ?: DiskStorageType.image }
		private var bDateCreated: LocalDateTime? = null;fun dateCreated(block: () -> LocalDateTime?) { bDateCreated = block() }
		private var bType: String = "";fun type(block: () -> String?) { bType = block() ?: "" }
		private var bConnectVm: IdentifiedVo = IdentifiedVo();fun connectVm(block: () -> IdentifiedVo?) { bConnectVm = block() ?: IdentifiedVo() }
		private var bConnectTemplate: IdentifiedVo = IdentifiedVo();fun connectTemplate(block: () -> IdentifiedVo?) { bConnectTemplate = block() ?: IdentifiedVo() }
		private var bDiskProfileVo: IdentifiedVo = IdentifiedVo();fun diskProfileVo(block: () -> IdentifiedVo?) { bDiskProfileVo = block() ?: IdentifiedVo() }
		private var bStorageDomainVo: IdentifiedVo = IdentifiedVo();fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		// private var bDiskProfileVos: List<IdentifiedVo> = listOf();fun diskProfileVos(block: () -> List<IdentifiedVo>?) { bDiskProfileVos = block() ?: listOf() }

        fun build(): DiskImageVo = DiskImageVo(bId, bSize, bAppendSize, bAlias, bDescription, bSparse, bWipeAfterDelete, bSharable, bBackup, bFormat, bImageId, bVirtualSize, bActualSize, bStatus, bContentType, bStorageType, bDateCreated, bType, bConnectVm, bConnectTemplate, bDiskProfileVo, bStorageDomainVo, bDataCenterVo, )
	}
	companion  object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): DiskImageVo = Builder().apply(block).build()
	}
}

fun Disk.toDiskIdName(): DiskImageVo = DiskImageVo.builder {
	id { this@toDiskIdName.id() }
	alias { this@toDiskIdName.alias() }
}
fun List<Disk>.toDiskIdNames(): List<DiskImageVo> =
	this@toDiskIdNames.map { it.toDiskIdName() }

/*

fun AllDiskEntity.toDiskEntity(): DiskImageVo {
	val entity = this@toDiskEntity
	return DiskImageVo.builder {
		id { entity.diskId.toString() }
		alias { entity.diskAlias }
		sharable { entity.shareable }
		virtualSize { entity.size }
		actualSize { entity.actualSize }
		status { DiskStatus.forValue(entity.imagestatus) }
		storageType { DiskStorageType.forValue(entity.diskStorageType) }
		sparse { entity.volumeType == 2 }
		description { entity.description }
		dateCreated { entity.creationDate }
		dataCenterVo {
			IdentifiedVo.builder {
				id { entity.storagePoolId.toString() }
			}
		}
		diskProfileVo {
			IdentifiedVo.builder {
				id { entity.diskProfileId }
				name { entity.diskProfileName }
			}
		}
		storageDomainVo {
			IdentifiedVo.builder {
				id { entity.storageId }
				name { entity.storageName }
			}
		}
		type { entity.entityType }
		connectVm {
			if(entity.entityType == "VM") {
				IdentifiedVo.builder {
					name { entity.vmNames }
				}
			}
			else null
		}
		connectTemplate {
			if(entity.entityType == "TEMPLATE") {
				IdentifiedVo.builder {
					name { entity.vmNames }
				}
			}
			else null
		}
	}
}
fun List<AllDiskEntity>.toDiskEntities(): List<DiskImageVo> =
	this@toDiskEntities.map { it.toDiskEntity() }
*/


/**
 * 디스크 목록
 * 스토리지도메인 - 디스크 목록
 */
fun Disk.toDiskMenu(conn: Connection): DiskImageVo {
	val disk = this@toDiskMenu
	val storageDomain: StorageDomain? = conn.findStorageDomain(this.storageDomains().first().id()).getOrNull()
	val dataCenter: DataCenter? = storageDomain?.dataCenters()?.first()?.let { conn.findDataCenter(it.id()).getOrNull() }

	val diskLink: Disk? = conn.findDisk(this@toDiskMenu.id()).getOrNull()
	val vmConn: Vm? = if(diskLink?.vmsPresent() == true){
		conn.findVm(diskLink.vms().first().id()).getOrNull()
	} else { null }

	val templateId: String? = conn.findAllTemplates(follow = "diskattachments").getOrDefault(emptyList())
		.firstOrNull { template ->
			template.diskAttachmentsPresent() &&
					template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
		}?.id()
	val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		sharable { disk.shareable() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.actualSize() }
		status { DiskStatus.forCode(disk.status().value()) }
		sparse { disk.sparse() }
		contentType { DiskContentType.forStorageValue(disk.contentType().toString()) }
		storageType { DiskStorageType.forCode(disk.storageType().toString()) }
		description { disk.description() }
		connectVm { vmConn?.fromVmToIdentifiedVo() }
		connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
	}
}
fun List<Disk>.toDiskMenus(conn: Connection): List<DiskImageVo> =
	this@toDiskMenus.map { it.toDiskMenu(conn) }

fun Disk.toDcDiskMenu(conn: Connection): DiskImageVo {
	val disk = this@toDcDiskMenu
	log.info("disk.vmsPresent(): {} / {}", disk.vmsPresent(), disk.id())
	// val templateId: String? = conn.findAllTemplates(follow = "diskattachments").getOrDefault(emptyList())
	// 	.firstOrNull { template ->
	// 		template.diskAttachmentsPresent() &&
	// 			template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
	// 	}?.id()
	// val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }
	val storageDomain = conn.findStorageDomain(disk.storageDomain().id()).getOrNull()

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		sharable { disk.shareable() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.actualSize() }
		status { DiskStatus.forCode(disk.status().value()) }
		sparse { disk.sparse() }
		storageType { DiskStorageType.forCode(disk.storageType().toString()) }
		description { disk.description() }
		// connectVm { if(disk.vmsPresent()) disk.vms().first().fromVmToIdentifiedVo() else null }
		// connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
	}
}
fun List<Disk>.toDcDiskMenus(conn:Connection): List<DiskImageVo> =
	this@toDcDiskMenus.map { it.toDcDiskMenu(conn) }


fun Disk.toDomainDiskMenu(conn: Connection): DiskImageVo {
	val disk = this@toDomainDiskMenu
	val diskLink: Disk? = conn.findDisk(disk.id()).getOrNull()
	val vmConn: Vm? = if (diskLink?.vmsPresent() == true) {
		conn.findVm(diskLink.vms().first().id()).getOrNull()
	} else { null }

	val templateId: String? = conn.findAllTemplates(follow = "diskattachments").getOrDefault(emptyList())
		.firstOrNull { template ->
			template.diskAttachmentsPresent() &&
				template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
		}?.id()
	val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		sharable { disk.shareable() }
		storageDomainVo { disk.storageDomain().fromStorageDomainToIdentifiedVo() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.actualSize() }
		status { DiskStatus.forCode(disk.status().value()) }
		sparse { disk.sparse() }
		storageType { DiskStorageType.forCode(disk.storageType().toString()) }
		description { disk.description() }
		connectVm { vmConn?.fromVmToIdentifiedVo() }
		connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
	}
}
fun List<Disk>.toDomainDiskMenus(conn: Connection): List<DiskImageVo> =
	this@toDomainDiskMenus.map { it.toDomainDiskMenu(conn) }


fun Disk.toDiskInfo(conn: Connection): DiskImageVo {
	val disk = this@toDiskInfo
	val storageDomain: StorageDomain? = conn.findStorageDomain(disk.storageDomains().first().id(), follow = "diskprofiles").getOrNull()

	val vmConn: Vm? =
		if (disk.vmsPresent()) { conn.findVm(disk.vms().first().id()).getOrNull() }
		else { null }

	val templateId: String? = conn.findAllTemplates(follow = "diskattachments").getOrDefault(emptyList())
		.firstOrNull { template ->
			template.diskAttachmentsPresent() &&
					template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
		}?.id()
	val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }
	val profile: DiskProfile? = if(disk.diskProfilePresent()) conn.findDiskProfile(disk.diskProfile().id()).getOrNull() else null

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		description { disk.description() }
		status { DiskStatus.forCode(disk.status().value()) }
		sparse { disk.sparse() } // 할당정책
		if (storageDomain != null) {
			dataCenterVo { storageDomain.dataCenters().first()?.fromDataCenterToIdentifiedVo() }
			storageDomainVo { storageDomain.fromStorageDomainToIdentifiedVo() }
		}
		diskProfileVo { profile?.fromDiskProfileToIdentifiedVo() }
		contentType { DiskContentType.forStorageValue(disk.contentType().toString()) }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.totalSize() }
		wipeAfterDelete { disk.wipeAfterDelete() }
		sharable { disk.shareable() }
		backup { disk.backup() == DiskBackup.INCREMENTAL }
		connectVm { vmConn?.fromVmToIdentifiedVo() } // 연결된 가상머신
		connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
	}
}

fun Disk.toVmDisk(conn: Connection): DiskImageVo {
	val disk = this@toVmDisk
	val storageDomain: StorageDomain? = conn.findStorageDomain(this.storageDomains().first().id()).getOrNull()
	val dataCenter = storageDomain?.dataCenters()?.firstOrNull()?.id()?.let { conn.findDataCenter(it).getOrNull() }
	val diskProfile: DiskProfile? =
		if(disk.diskProfilePresent()) conn.findDiskProfile(disk.diskProfile().id()).getOrNull()
		else null

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		description { disk.description() }
		status { DiskStatus.forCode(disk.status().value()) }
		sparse { disk.sparse() } // 할당정책
		wipeAfterDelete { disk.wipeAfterDelete() }
		sharable { disk.shareable() }
		backup { disk.backup() == DiskBackup.INCREMENTAL }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.totalSize() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
	}
}
fun List<Disk>.toVmDisks(conn: Connection): List<DiskImageVo> =
	this@toVmDisks.map { it.toVmDisk(conn) }


fun Disk.toDiskImageVo(conn: Connection): DiskImageVo {
	val storageDomain: StorageDomain? =
		conn.findStorageDomain(this@toDiskImageVo.storageDomains().first().id())
			.getOrNull()

	val dataCenter: DataCenter? =
		if(storageDomain?.dataCentersPresent() == true) conn.findDataCenter(storageDomain.dataCenters().first().id()).getOrNull()
		else null

	val diskProfile: DiskProfile? =
		if(this@toDiskImageVo.diskProfilePresent()) conn.findDiskProfile(this@toDiskImageVo.diskProfile().id()).getOrNull()
		else null

	return DiskImageVo.builder {
		id { this@toDiskImageVo.id() }
		size { this@toDiskImageVo.provisionedSize() } // 1024^3
		alias { this@toDiskImageVo.alias() }
		description { this@toDiskImageVo.description() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		// storageDomainVo { storageDomain?.toStorageDomainIdName() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		sparse { this@toDiskImageVo.sparse() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
		wipeAfterDelete { this@toDiskImageVo.wipeAfterDelete() }
		sharable { this@toDiskImageVo.shareable() }
		backup { this@toDiskImageVo.backup() == DiskBackup.INCREMENTAL }
		virtualSize { this@toDiskImageVo.provisionedSize() }
		actualSize { this@toDiskImageVo.actualSize() }
		status { DiskStatus.forCode(this@toDiskImageVo.status().value()) }
		contentType { DiskContentType.forStorageValue(this@toDiskImageVo.contentType().toString()) }
		storageType { DiskStorageType.forCode(this@toDiskImageVo.storageType().toString()) }
		// dateCreated { this@toDiskImageVo. }
//		connectVm { toConnectVm(conn, diskVmElementEntity) } } }  // TODO
	}
}
fun List<Disk>.toDiskImageVos(conn: Connection): List<DiskImageVo> =
	this@toDiskImageVos.map { it.toDiskImageVo(conn) }

fun Disk.toDiskVo(conn: Connection, vmId: String): DiskImageVo {
	val storageDomain: StorageDomain? = conn.findStorageDomain(this@toDiskVo.storageDomains().first().id()).getOrNull()
	val dataCenter: DataCenter? =
		if(storageDomain?.dataCentersPresent() == true) conn.findDataCenter(storageDomain.dataCenters().first().id()).getOrNull()
		else null

	val diskProfile: DiskProfile? =
		if(this@toDiskVo.diskProfilePresent()) conn.findDiskProfile(this@toDiskVo.diskProfile().id()).getOrNull()
		else null

	return DiskImageVo.builder {
		id { this@toDiskVo.id() }
		size { this@toDiskVo.provisionedSize() } // 1024^3
		alias { this@toDiskVo.alias() }
		description { this@toDiskVo.description() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		// storageDomainVo { storageDomain?.toStorageDomainIdName() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		sparse { this@toDiskVo.sparse() }
		diskProfileVo { diskProfile?.fromDiskProfileToIdentifiedVo() }
		wipeAfterDelete { this@toDiskVo.wipeAfterDelete() }
		sharable { this@toDiskVo.shareable() }
		backup { this@toDiskVo.backup() == DiskBackup.INCREMENTAL }
		virtualSize { this@toDiskVo.provisionedSize() }
		actualSize { this@toDiskVo.actualSize() }
		status { DiskStatus.forCode(this@toDiskVo.status().value()) }
		contentType { DiskContentType.forStorageValue(this@toDiskVo.contentType().toString()) }
		storageType { DiskStorageType.forCode(this@toDiskVo.storageType().toString()) }
//		createDate { this@toDiskImageVo. } // TODO
	}
}

fun Disk.toTemplateDiskInfo(conn: Connection): DiskImageVo {
	val disk = this@toTemplateDiskInfo
	val storageDomain: StorageDomain? = conn.findStorageDomain(this.storageDomains().first().id()).getOrNull()
	val dataCenter: DataCenter? = storageDomain?.dataCenters()?.first()?.let {
		conn.findDataCenter(it.id()).getOrNull()
	}
	val vmConn: Vm? =
		if(disk.vmsPresent()){ conn.findVm(disk.vms().first().id()).getOrNull() }
		else { null }
	val templateId: String? = conn.findAllTemplates(follow = "diskattachments").getOrDefault(emptyList())
		.firstOrNull { template ->
			template.diskAttachmentsPresent() &&
					template.diskAttachments().any { diskAttachment -> diskAttachment.id() == disk.id() }
		}?.id()
	val tmp: Template? = templateId?.let { conn.findTemplate(it).getOrNull() }

	return DiskImageVo.builder {
		id { disk.id() }
		alias { disk.alias() }
		description { disk.description() }
		status { DiskStatus.forCode(disk.status().value()) }
		sparse { disk.sparse() } // 할당정책
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		storageDomainVo { storageDomain?.fromStorageDomainToIdentifiedVo() }
		diskProfileVo { disk.diskProfile().fromDiskProfileToIdentifiedVo() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.totalSize() }
		wipeAfterDelete { disk.wipeAfterDelete() }
		storageType { DiskStorageType.forCode(disk.storageType().toString()) }
		sharable { disk.shareable() }
		backup { disk.backup() == DiskBackup.INCREMENTAL }
		connectVm { vmConn?.fromVmToIdentifiedVo() } // 연결된 가상머신
		connectTemplate { tmp?.fromTemplateToIdentifiedVo() }
		// createDate { disk.c }
	}
}


fun Disk.toUnregisterdDisk(disk: UnregisteredDiskEntity?=null): DiskImageVo {
    return DiskImageVo.builder {
        id { this@toUnregisterdDisk.id() }
        alias { this@toUnregisterdDisk.alias() }
        sharable { this@toUnregisterdDisk.shareable() }
        virtualSize { this@toUnregisterdDisk.provisionedSize() }
        actualSize { this@toUnregisterdDisk.actualSize() }
        sparse { this@toUnregisterdDisk.sparse() }
        description { this@toUnregisterdDisk.description() }
		dateCreated { disk?.creationDate }
    }
}

fun List<Disk>.toUnregisterdDisks(unregisteredDisks: List<UnregisteredDiskEntity>): List<DiskImageVo> {
	val itemById: Map<UUID?, UnregisteredDiskEntity> =
		unregisteredDisks.associateBy { it.id.diskId }
	return this.map { it.toUnregisterdDisk(itemById[it.id().toUUID()]) }
}

fun DiskImageVo.toRegisterDiskBuilder(): Disk {
	return DiskBuilder()
		.id(this.id)
		.diskProfile(DiskProfileBuilder().id(diskProfileVo.id).build())
		.build()
}

/**
 * 스토리지 - 디스크 생성
 * 가상머신 - 가상머신 생성 - 디스크 생성
 */
fun DiskImageVo.toDiskBuilder(): DiskBuilder {
	return DiskBuilder()
		.alias(this.alias)
		.description(this.description)
		.wipeAfterDelete(this.wipeAfterDelete)
		.shareable(this.sharable)
		.backup(if (this.backup) DiskBackup.INCREMENTAL else DiskBackup.NONE)
		.format(if (this.backup) DiskFormat.COW else DiskFormat.RAW)
		.sparse(this.sparse)
		.diskProfile(DiskProfileBuilder().id(this.diskProfileVo.id).build())
}

fun DiskImageVo.toAddDisk(): Disk =
	this.toDiskBuilder()
		.storageDomains(*arrayOf(StorageDomainBuilder().id(this.storageDomainVo.id).build()))
		.provisionedSize(this.size)
		.build()

fun DiskImageVo.toEditDisk(): Disk =
	this.toDiskBuilder()
		.id(this.id)
		.provisionedSize(this.size.add(this.appendSize))
		.build()


// 가상머신 스냅샷에서 디스크 포함할때 사용
fun DiskImageVo.toAddSnapshotDisk(): Disk {
	return DiskBuilder()
		.id(this.id)
		.imageId(this.imageId)
		.build()
}


/**
 * 디스크 업로드
 * ISO 이미지 업로드용
 * (화면표시) 파일 선택시 파일에 있는 포맷, 컨텐츠(파일 확장자로 칭하는건지), 크기 출력
 * 	파일 크기가 자동으로 디스크 옵션에 추가, 파일 명칭이 파일의 이름으로 지정됨 (+설명)
 * 	디스크 이미지 업로드
 *  required: provisioned_size, alias, description, wipe_after_delete, shareable, backup, disk_profile.
 *
 */
fun DiskImageVo.toUploadDisk(conn: Connection, fileSize: Long): Disk {
	val storageDomain: StorageDomain = conn.findStorageDomain(this.storageDomainVo.id)
		.getOrNull() ?: throw ErrorPattern.STORAGE_DOMAIN_NOT_FOUND.toException()

	return DiskBuilder()
		.contentType ( org.ovirt.engine.sdk4.types.DiskContentType.ISO )
		.provisionedSize(fileSize)
		.sparse(storageDomain.storage().type() == StorageType.NFS)// storage가 nfs 면 씬, iscsi면 사전할당
		.alias(this.alias)
		.description(this.description)
		.storageDomains(*arrayOf(StorageDomainBuilder().id(this.storageDomainVo.id).build()))
		.diskProfile(DiskProfileBuilder().id(this.diskProfileVo.id).build())
		.shareable(this.sharable)
		.wipeAfterDelete(this.wipeAfterDelete)
		.backup(DiskBackup.NONE) // 증분백업 되지 않음
		.format(DiskFormat.RAW) // 이미지 업로드는 raw 형식만 가능 +front 처리?
		.build()
}


fun DiskImageVo.toAddTemplateDisk(): Disk {
	return DiskBuilder()
		.id(this.id)
		.alias(this.alias)
		.format(this.format)
		.sparse(false)
		.storageDomains(*arrayOf(StorageDomainBuilder().id(this.storageDomainVo.id).build()))
		.diskProfile(DiskProfileBuilder().id(this.diskProfileVo.id).build())
		.build()
}

