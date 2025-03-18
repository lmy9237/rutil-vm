package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDiskProfilesToIdentifiedVos
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(StorageDomainVo::class.java)

/**
 * [StorageDomainVo]
 * 도메인
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 * @property status [StorageDomainStatus] 상태
 * @property domainType [String] 도메인 유형  /*StorageDomainType.IMAGE*/
 * @property domainTypeMaster [Boolean] 마스터 여부
 * @property hostedEngine [Boolean] 호스트 엔진 가상머신 데이터 포함
 * @property storageType [String] 스토리지 유형  /*StorageType.NFS*/
 * @property format [StorageFormat] 포맷
 * @property active [Boolean] 데이터 센터간 상태: 활성화
 * @property diskSize [BigInteger] 전체공간
 * @property availableSize [BigInteger] 여유공간
 * @property usedSize [BigInteger] 사용된 공간
 * @property commitedSize [BigInteger] 할당됨
 * @property overCommit [BigInteger] 오버 할당 비율 (availableSize)
 * @property image [Int] 이미지 디스크사이즈 //?
 * @property storagePath [String] 내보내기 path ip
 * @property storageAddress [String] 내보내기 경로
 * @property logicalUnits List<[String]> iscsi 사용시 필요 (id값만 들어감)
 * @property warning [Int] 디스크 공간 부족 경고  Warning Low Confirmed Space Indicator
 * @property spaceBlocker [Int] 디스크 공간 동작 차단 Critical Space Action Blocker
 * @property dataCenterVo [IdentifiedVo]
 * @property hostVo [IdentifiedVo]
 * @property diskImageVos List<[DiskImageVo]>
 * @property profileVos List<[IdentifiedVo]>
 * @property nfsVersion [String]  nfs 버전

 *
 */
class StorageDomainVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val status: StorageDomainStatus = StorageDomainStatus.LOCKED,
	val domainType: String = "",
	val domainTypeMaster: Boolean = false,
	val hostedEngine: Boolean = false,
	val storageType: String = "",
	val format: StorageFormat = StorageFormat.V5,
	val active: Boolean = false,
	val diskSize: BigInteger = BigInteger.ZERO,
	val availableSize: BigInteger = BigInteger.ZERO,
	val usedSize: BigInteger = BigInteger.ZERO,
	val commitedSize: BigInteger = BigInteger.ZERO,
	val overCommit: BigInteger = BigInteger.ZERO,
	val image: Int = 0,
	val storagePath: String = "",
	val storageAddress: String = "",
	val logicalUnits: List<String> = listOf(),
	val warning: Int = 0,
	val spaceBlocker: Int = 0,
	val nfsVersion: String = "",
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val hostVo: IdentifiedVo = IdentifiedVo(),
	val diskImageVos: List<DiskImageVo> = listOf(),
	val profileVos: List<IdentifiedVo> = listOf(),
	val hostStorageVo: HostStorageVo = HostStorageVo(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bStatus: StorageDomainStatus = StorageDomainStatus.UNKNOWN;fun status(block: () -> StorageDomainStatus?) { bStatus = block() ?: StorageDomainStatus.UNKNOWN }
		private var bDomainType: String = "";fun domainType(block: () -> String?) { bDomainType = block() ?: "" }
		private var bDomainTypeMaster: Boolean = false;fun domainTypeMaster(block: () -> Boolean?) { bDomainTypeMaster = block() ?: false }
		private var bHostedEngine: Boolean = false;fun hostedEngine(block: () -> Boolean?) { bHostedEngine = block() ?: false }
		private var bStorageType: String = "";fun storageType(block: () -> String?) { bStorageType = block() ?: "" }
		private var bFormat: StorageFormat = StorageFormat.V1;fun format(block: () -> StorageFormat?) { bFormat = block() ?: StorageFormat.V1 }
		private var bActive: Boolean = false;fun active(block: () -> Boolean?) { bActive = block() ?: false }
		private var bDiskSize: BigInteger = BigInteger.ZERO;fun diskSize(block: () -> BigInteger?) { bDiskSize = block() ?: BigInteger.ZERO }
		private var bAvailableSize: BigInteger = BigInteger.ZERO;fun availableSize(block: () -> BigInteger?) { bAvailableSize = block() ?: BigInteger.ZERO }
		private var bUsedSize: BigInteger = BigInteger.ZERO;fun usedSize(block: () -> BigInteger?) { bUsedSize = block() ?: BigInteger.ZERO }
		private var bCommitedSize: BigInteger = BigInteger.ZERO;fun commitedSize(block: () -> BigInteger?) { bCommitedSize = block() ?: BigInteger.ZERO }
		private var bOverCommit: BigInteger = BigInteger.ZERO;fun overCommit(block: () -> BigInteger?) { bOverCommit = block() ?: BigInteger.ZERO }
		private var bImage: Int = 0;fun image(block: () -> Int?) { bImage = block() ?: 0 }
		private var bStoragePath: String = "";fun storagePath(block: () -> String?) { bStoragePath = block() ?: ""}
		private var bStorageAddress: String = "";fun storageAddress(block: () -> String?) { bStorageAddress = block() ?: ""}
		private var bLogicalUnits: List<String> = listOf();fun logicalUnits(block: () -> List<String>?) { bLogicalUnits = block() ?: listOf() }
		private var bWarning: Int = 0;fun warning(block: () -> Int?) { bWarning = block() ?: 0 }
		private var bSpaceBlocker: Int = 0;fun spaceBlocker(block: () -> Int?) { bSpaceBlocker = block() ?: 0 }
		private var bNfsVersion: String = "";fun nfsVersion(block: () -> String?) { bNfsVersion = block() ?: ""}
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bHostVo: IdentifiedVo = IdentifiedVo();fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		private var bDiskImageVos: List<DiskImageVo> = listOf();fun diskImageVos(block: () -> List<DiskImageVo>?) { bDiskImageVos = block() ?: listOf() }
		private var bProfileVos: List<IdentifiedVo> = listOf();fun profileVos(block: () -> List<IdentifiedVo>?) { bProfileVos = block() ?: listOf() }
		private var bHostStorageVo: HostStorageVo = HostStorageVo(); fun hostStorageVo(block: () -> HostStorageVo?) { bHostStorageVo = block() ?: HostStorageVo() }

		fun build(): StorageDomainVo = StorageDomainVo(bId, bName, bDescription, bComment, bStatus, bDomainType, bDomainTypeMaster, bHostedEngine, bStorageType, bFormat, bActive, bDiskSize, bAvailableSize, bUsedSize, bCommitedSize, bOverCommit, bImage, bStoragePath, bStorageAddress, bLogicalUnits, bWarning, bSpaceBlocker, bNfsVersion, bDataCenterVo, bHostVo, bDiskImageVos, bProfileVos, bHostStorageVo)
	}

	companion object {
		inline fun builder(block: StorageDomainVo.Builder.() -> Unit): StorageDomainVo = StorageDomainVo.Builder().apply(block).build()
	}
}

fun StorageDomain.toStorageDomainIdName(): StorageDomainVo = StorageDomainVo.builder {
	id { this@toStorageDomainIdName.id() }
	name { this@toStorageDomainIdName.name() }
}

fun List<StorageDomain>.toStorageDomainIdNames(): List<StorageDomainVo> =
	this@toStorageDomainIdNames.map { it.toStorageDomainIdName() }


fun StorageDomain.toDomainStatus(): StorageDomainVo {
	return StorageDomainVo.builder { status { this@toDomainStatus.status() } }
}
fun List<StorageDomain>.toDomainStatuss(): List<StorageDomainVo> =
	this@toDomainStatuss.map { it.toDomainStatus() }


fun StorageDomain.toStorageDomainMenu(conn: Connection): StorageDomainVo {
	val storageDomain = this@toStorageDomainMenu
	val dataCenter: DataCenter? = resolveDataCenter(conn)
	val storageDomainStatus = dataCenter?.let {
		conn.findAttachedStorageDomainFromDataCenter(it.id(), storageDomain.id()).getOrNull()?.status()
	}

	return StorageDomainVo.builder {
		id { storageDomain.id() }
		name { storageDomain.name() }
		description { storageDomain.description() }
		status { storageDomainStatus }
		hostedEngine { storageDomain.vms().any { it.origin() == "managed_hosted_engine" } }
		comment { storageDomain.comment() }
		domainType { storageDomain.type().value() }
		domainTypeMaster { storageDomain.masterPresent() && storageDomain.master() }
		storageType { storageDomain.storagePresent().let { storageDomain.storage().type().value() } }
		format { storageDomain.storageFormat() }
		usedSize { storageDomain.used() }
		availableSize { storageDomain.available() }
		diskSize { storageDomain.toDiskSize() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
	}
}
fun List<StorageDomain>.toStorageDomainsMenu(conn: Connection): List<StorageDomainVo> =
	this@toStorageDomainsMenu.map { it.toStorageDomainMenu(conn) }


fun StorageDomain.toDcDomainMenu(conn: Connection): StorageDomainVo {
	val domain = this@toDcDomainMenu
	val hostedVm = conn.findAllVmsFromStorageDomain(domain.id()).getOrDefault(listOf())
		.any { it.origin() == "managed_hosted_engine" }

	return StorageDomainVo.builder {
		id { domain.id() }
		name { domain.name() }
		description { domain.description() }
		status { domain.status() }
		hostedEngine { hostedVm }
		comment { domain.comment() }
		domainType { domain.type().value() }
		domainTypeMaster { domain.masterPresent() && domain.master() }
		storageType { domain.storagePresent().let { domain.storage().type().value() } }
		format { domain.storageFormat() }
		usedSize { domain.used() }
		availableSize { domain.available() }
		diskSize { domain.toDiskSize() }
		dataCenterVo { if(domain.dataCenterPresent()) domain.dataCenter().fromDataCenterToIdentifiedVo() else IdentifiedVo()}
	}
}
fun List<StorageDomain>.toDcDomainMenus(conn: Connection): List<StorageDomainVo> =
	this@toDcDomainMenus.map { it.toDcDomainMenu(conn) }

fun StorageDomain.toActiveDomain(): StorageDomainVo = StorageDomainVo.builder {
	id { this@toActiveDomain.id() }
	name { this@toActiveDomain.name() }
	usedSize { this@toActiveDomain.used() }
	availableSize { this@toActiveDomain.available() }
	diskSize { this@toActiveDomain.toDiskSize() }
}
fun List<StorageDomain>.toActiveDomains(): List<StorageDomainVo> =
	this@toActiveDomains.map { it.toActiveDomain()}


fun StorageDomain.toStorageDomainInfoVo(conn: Connection): StorageDomainVo {
	val storageDomain = this@toStorageDomainInfoVo
	val dataCenter: DataCenter? = resolveDataCenter(conn)
	val hostStorage: HostStorage = storageDomain.storage()
	val disks: List<Disk> = conn.findAllDisks()
		.getOrDefault(listOf())
		.filter { it.storageDomainsPresent() && it.storageDomains().first().id() == storageDomain.id() }
	val diskProfiles: List<DiskProfile> = conn.findAllDiskProfilesFromStorageDomain(storageDomain.id()).getOrDefault(listOf())

	return StorageDomainVo.builder {
		id { storageDomain.id() }
		name { storageDomain.name() }
		description { storageDomain.description() }
		comment { storageDomain.comment() }
		domainType { storageDomain.type().value() }
		domainTypeMaster { if(storageDomain.masterPresent()) storageDomain.master() else false}
		storageType { if(storageDomain.storagePresent()) storageDomain.storage().type().value() else null }
		format { storageDomain.storageFormat() }
		usedSize { storageDomain.used() }
		availableSize { storageDomain.available() }
		commitedSize { storageDomain.committed() }
		profileVos { diskProfiles.fromDiskProfilesToIdentifiedVos()  }
		diskSize { storageDomain.toDiskSize() }
		diskImageVos { disks.toDiskImageVos(conn) }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		warning { storageDomain.warningLowSpaceIndicatorAsInteger() }
		spaceBlocker { storageDomain.criticalSpaceActionBlockerAsInteger() }
		storageAddress { storageDomain.storage().address() + storageDomain.storage().path() } // 경로
//		nfsVersion { storageDomain.storage().nfsVersion().value() }
		hostStorageVo { hostStorage.toHostStorageVoByType() }
	}
}
fun List<StorageDomain>.toStorageDomainInfoVos(conn: Connection): List<StorageDomainVo> =
	this@toStorageDomainInfoVos.map { it.toStorageDomainInfoVo(conn) }


// region: builder
/**
 * 스토리지 도메인 생성 빌더
 * 기본
 */
fun StorageDomainVo.toStorageDomainBuilder(): StorageDomainBuilder {
	return StorageDomainBuilder()
		.name(this@toStorageDomainBuilder.name)
		.type(StorageDomainType.fromValue(this@toStorageDomainBuilder.domainType))
		.description(this@toStorageDomainBuilder.description)
		.comment(this@toStorageDomainBuilder.comment)
		.warningLowSpaceIndicator(this@toStorageDomainBuilder.warning)
		.criticalSpaceActionBlocker(this@toStorageDomainBuilder.spaceBlocker)  //디스크 공간 동작 차단
		.dataCenters(*arrayOf(DataCenterBuilder().id(this@toStorageDomainBuilder.dataCenterVo.id).build()))
		.host(HostBuilder().name(this@toStorageDomainBuilder.hostVo.name).build())
}

fun StorageDomainVo.toAddStorageDomainBuilder(): StorageDomain {
	log.info("toAddStorageDomainBuilder: {}", this)
	return this@toAddStorageDomainBuilder
		.toStorageDomainBuilder()
		.storage(
			when (StorageType.fromValue(this@toAddStorageDomainBuilder.storageType)) {
				StorageType.NFS -> this@toAddStorageDomainBuilder.toAddNFSBuilder()
				StorageType.ISCSI -> this@toAddStorageDomainBuilder.toAddISCSIBuilder()
				StorageType.FCP -> this@toAddStorageDomainBuilder.toAddFCPBuilder()
				else -> throw IllegalArgumentException("Unsupported storage type")
			}
		)
		.build()
}

fun StorageDomainVo.toImportStorageDomainBuilder(): StorageDomain {
	log.info("toImportStorageDomainBuilder: {}", this)
	// TODO: 가져오기 id값의 위치를 알아봐야 할 듯
	return this@toImportStorageDomainBuilder
		.toStorageDomainBuilder()
		.id(this@toImportStorageDomainBuilder.id)
		.storage(HostStorageBuilder().type(StorageType.fromValue(this@toImportStorageDomainBuilder.storageType)))
		.build()
}

// NFS
fun StorageDomainVo.toAddNFSBuilder(): HostStorage {
	return HostStorageBuilder()
			.address(this@toAddNFSBuilder.storageAddress)
//			.nfsVersion(NfsVersion.AUTO)
			.path(this@toAddNFSBuilder.storagePath)
			.type(StorageType.fromValue(this@toAddNFSBuilder.storageType))
	.build()
}

// ISCSI
fun StorageDomainVo.toAddISCSIBuilder(): HostStorage {
	return HostStorageBuilder()
		.type(StorageType.fromValue(this@toAddISCSIBuilder.storageType))
		.logicalUnits(this@toAddISCSIBuilder.logicalUnits.map {
			LogicalUnitBuilder().id(it).build()
		})
	.build()
}

// Fibre Channel
fun StorageDomainVo.toAddFCPBuilder(): HostStorage {
	return HostStorageBuilder()
		.type(StorageType.fromValue(this@toAddFCPBuilder.storageType))
//		.logicalUnits(this@toAddFCPBuilder.logicalUnits.map {
//			LogicalUnitBuilder().id(it).build()
//		})
		.volumeGroup(
			VolumeGroupBuilder().logicalUnits(
				this@toAddFCPBuilder.logicalUnits.map {
					LogicalUnitBuilder().id(it).build()
				}
			)
		)
	.build()
}

/**
 * 스토리지 도메인 편집 빌더
 * 기본
 */
fun StorageDomainVo.toEditStorageDomainBuilder(): StorageDomain {
	return StorageDomainBuilder()
		.id(this@toEditStorageDomainBuilder.id)
		.name(this@toEditStorageDomainBuilder.name)
		.comment(this@toEditStorageDomainBuilder.comment)
		.description(this@toEditStorageDomainBuilder.description)
		.warningLowSpaceIndicator(this@toEditStorageDomainBuilder.warning)
		.criticalSpaceActionBlocker(this@toEditStorageDomainBuilder.spaceBlocker)
		.build()
}

// endregion



// 데이터센터 찾기
fun StorageDomain.resolveDataCenter(conn: Connection): DataCenter? {
	return if(this@resolveDataCenter.dataCentersPresent()) conn.findDataCenter(this@resolveDataCenter.dataCenters().first().id()).getOrNull() else null
}


// 디스크 사이즈 계산
fun StorageDomain.toDiskSize(): BigInteger? {
	log.info(
		"Checking disk size: availablePresent={}, usedPresent={}, available={}, used={}",
		this@toDiskSize.availablePresent(),
		this@toDiskSize.usedPresent(),
		this@toDiskSize.available(),
		this@toDiskSize.used()
	)
	return if (!this@toDiskSize.availablePresent() || this@toDiskSize.available() == null ||
		!this@toDiskSize.usedPresent() || this@toDiskSize.used() == null) {
		null
	} else {
		this@toDiskSize.available().add(this@toDiskSize.used())
	}
}


fun HostStorage.toHostStorageVoByType(): HostStorageVo {
	return when (this.type()) {
		StorageType.ISCSI -> this.toIscsiStorageVo()
		StorageType.FCP ->this.toFibreStorageVo()
		else -> HostStorageVo()
	}
}

fun StorageDomain.toStorageDomainSize(): StorageDomainVo {
	return StorageDomainVo.builder {
		id { this@toStorageDomainSize.id() }
		name { this@toStorageDomainSize.name() }
		domainType { this@toStorageDomainSize.type().value() }
		domainTypeMaster { if(this@toStorageDomainSize.masterPresent()) this@toStorageDomainSize.master() else false }
		usedSize { this@toStorageDomainSize.used() }
		availableSize { this@toStorageDomainSize.available() }
		// diskImageVos {  }
	}
}
fun List<StorageDomain>.toStorageDomainSizes(): List<StorageDomainVo> =
	this@toStorageDomainSizes.map { it.toStorageDomainSize() }
