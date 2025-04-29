package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromDataCenterToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromDiskProfilesToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromDisksToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.*

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
 * @property type [String] 도메인 유형  /*StorageDomainType.IMAGE*/
 * @property master [Boolean] 마스터 여부
 // * @property hostedEngine [Boolean] 호스트 엔진 가상머신 데이터 포함  master가 이거 같음
 * @property storageFormat [StorageFormat] 포맷
 * @property size [BigInteger] 전체공간
 * @property availableSize [BigInteger] 여유공간
 * @property usedSize [BigInteger] 사용된 공간
 * @property commitedSize [BigInteger] 할당됨
 * @property overCommit [Int] 오버 할당 비율 (availableSize)
 * @property warning [Int] 디스크 공간 부족 경고  Warning Low Confirmed Space Indicator
 * @property spaceBlocker [Int] 디스크 공간 동작 차단 Critical Space Action Blocker
 * @property storageVo [StorageVo]
 * @property dataCenterVo [IdentifiedVo]
 * @property hostVo [IdentifiedVo]
 * @property diskImageVos List<[IdentifiedVo]>
 * @property diskProfileVos List<[IdentifiedVo]>
 */
class StorageDomainVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val status: StorageDomainStatus = StorageDomainStatus.UNATTACHED,
	val type: String = "",
	val master: Boolean = false,
	val hostedEngine: Boolean = false,
	val storageFormat: StorageFormat = StorageFormat.V5,
	val size: BigInteger = BigInteger.ZERO,
	val availableSize: BigInteger = BigInteger.ZERO,
	val usedSize: BigInteger = BigInteger.ZERO,
	val commitedSize: BigInteger = BigInteger.ZERO,
	val overCommit: Int = 0,
	val warning: Int = 0,
	val spaceBlocker: Int = 0,
	val storageVo: StorageVo = StorageVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val hostVo: IdentifiedVo = IdentifiedVo(),
	val diskImageVos: List<IdentifiedVo> = listOf(),
	val diskProfileVos: List<IdentifiedVo> = listOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bStatus: StorageDomainStatus = StorageDomainStatus.UNATTACHED;fun status(block: () -> StorageDomainStatus?) { bStatus = block() ?: StorageDomainStatus.UNATTACHED }
		private var bType: String = "";fun type(block: () -> String?) { bType = block() ?: "" }
		private var bMaster: Boolean = false;fun master(block: () -> Boolean?) { bMaster = block() ?: false }
		private var bHostedEngine: Boolean = false;fun hostedEngine(block: () -> Boolean?) { bHostedEngine = block() ?: false }
		private var bStorageFormat: StorageFormat = StorageFormat.V5;fun storageFormat(block: () -> StorageFormat?) { bStorageFormat = block() ?: StorageFormat.V5 }
		private var bSize: BigInteger = BigInteger.ZERO;fun size(block: () -> BigInteger?) { bSize = block() ?: BigInteger.ZERO }
		private var bAvailableSize: BigInteger = BigInteger.ZERO;fun availableSize(block: () -> BigInteger?) { bAvailableSize = block() ?: BigInteger.ZERO }
		private var bUsedSize: BigInteger = BigInteger.ZERO;fun usedSize(block: () -> BigInteger?) { bUsedSize = block() ?: BigInteger.ZERO }
		private var bCommitedSize: BigInteger = BigInteger.ZERO;fun commitedSize(block: () -> BigInteger?) { bCommitedSize = block() ?: BigInteger.ZERO }
		private var bOverCommit: Int = 0;fun overCommit(block: () -> Int?) { bOverCommit = block() ?: 0 }
		private var bWarning: Int = 0;fun warning(block: () -> Int?) { bWarning = block() ?: 0 }
		private var bSpaceBlocker: Int = 0;fun spaceBlocker(block: () -> Int?) { bSpaceBlocker = block() ?: 0 }
		private var bStorageVo: StorageVo = StorageVo(); fun storageVo(block: () -> StorageVo?) { bStorageVo = block() ?: StorageVo() }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bHostVo: IdentifiedVo = IdentifiedVo();fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		private var bDiskImageVos: List<IdentifiedVo> = listOf();fun diskImageVos(block: () -> List<IdentifiedVo>?) { bDiskImageVos = block() ?: listOf() }
		private var bDiskProfileVos: List<IdentifiedVo> = listOf();fun diskProfileVos(block: () -> List<IdentifiedVo>?) { bDiskProfileVos = block() ?: listOf() }

		fun build(): StorageDomainVo = StorageDomainVo(bId, bName, bDescription, bComment, bStatus, bType, bMaster, bHostedEngine, bStorageFormat, bSize, bAvailableSize, bUsedSize, bCommitedSize, bOverCommit, bWarning, bSpaceBlocker, bStorageVo, bDataCenterVo, bHostVo, bDiskImageVos, bDiskProfileVos, )
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): StorageDomainVo = Builder().apply(block).build()
	}
}

fun StorageDomain.toStorageDomainIdName(): StorageDomainVo = StorageDomainVo.builder {
	id { this@toStorageDomainIdName.id() }
	name { this@toStorageDomainIdName.name() }
}
fun List<StorageDomain>.toStorageDomainIdNames(): List<StorageDomainVo> =
	this@toStorageDomainIdNames.map { it.toStorageDomainIdName() }


fun StorageDomain.toStorageDomainMenu(conn: Connection): StorageDomainVo {
	val storageDomain = this@toStorageDomainMenu
	val dataCenter: DataCenter? = resolveDataCenter(conn)
	val hostedVm = findHostedVmFromStorageDomain(conn)
	val storageDomainStatus = dataCenter?.let {
		conn.findAttachedStorageDomainFromDataCenter(it.id(), storageDomain.id()).getOrNull()?.status()
	}

	return StorageDomainVo.builder {
		id { storageDomain.id() }
		name { storageDomain.name() }
		description { storageDomain.description() }
		status { storageDomainStatus }
		type { storageDomain.type().value() }
		storageVo { storageDomain.storage().toStorageVo() }
		master { storageDomain.masterPresent() && storageDomain.master() }
		hostedEngine { hostedVm }
		comment { storageDomain.comment() }
		storageFormat { storageDomain.storageFormat() }
		size { storageDomain.toDomainSize() }
		usedSize { if(storageDomain.usedPresent()) storageDomain.used() else null }
		availableSize { if(storageDomain.availablePresent()) storageDomain.available() else null }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
	}
}
fun List<StorageDomain>.toStorageDomainsMenu(conn: Connection): List<StorageDomainVo> =
	this@toStorageDomainsMenu.map { it.toStorageDomainMenu(conn) }


fun StorageDomain.toStorageDomainInfoVo(conn: Connection): StorageDomainVo {
	val storageDomain = this@toStorageDomainInfoVo
	val dataCenter: DataCenter? = resolveDataCenter(conn)
	val host: Host? = findHostFromStorageDomain(conn)
	return StorageDomainVo.builder {
		id { storageDomain.id() }
		name { storageDomain.name() }
		description { storageDomain.description() }
		comment { storageDomain.comment() }
		type { storageDomain.type().value() }
		master { if(storageDomain.masterPresent()) storageDomain.master() else false}
		storageFormat { storageDomain.storageFormat() }
		size { storageDomain.toDomainSize() }
		usedSize { storageDomain.used() }
		availableSize { storageDomain.available() }
		commitedSize { storageDomain.committed() }
		// overCommit {  }
		warning { storageDomain.warningLowSpaceIndicatorAsInteger() }
		spaceBlocker { storageDomain.criticalSpaceActionBlockerAsInteger() }
		dataCenterVo { dataCenter?.fromDataCenterToIdentifiedVo() }
		hostVo { host?.fromHostToIdentifiedVo() }
		storageVo { storageDomain.storage().toStorageVo() }
		diskProfileVos { storageDomain.diskProfiles().fromDiskProfilesToIdentifiedVos() }
		// diskImageVos { storageDomain.disks().fromDisksToIdentifiedVos() }
	}
}
fun List<StorageDomain>.toStorageDomainInfoVos(conn: Connection): List<StorageDomainVo> =
	this@toStorageDomainInfoVos.map { it.toStorageDomainInfoVo(conn) }




fun StorageDomain.toDcDomainMenu(conn: Connection): StorageDomainVo {
	val domain = this@toDcDomainMenu
	val hostedVm = findHostedVmFromStorageDomain(conn)

	return StorageDomainVo.builder {
		id { domain.id() }
		name { domain.name() }
		description { domain.description() }
		status { domain.status() }
		hostedEngine { hostedVm }
		comment { domain.comment() }
		type { domain.type().value() }
		master { domain.masterPresent() && domain.master() }
		storageFormat { domain.storageFormat() }
		usedSize { domain.used() }
		availableSize { domain.available() }
		size { domain.toDomainSize() }
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
	size { this@toActiveDomain.toDomainSize() }
}
fun List<StorageDomain>.toActiveDomains(): List<StorageDomainVo> =
	this@toActiveDomains.map { it.toActiveDomain()}


// region: builder
/**
 * 스토리지 도메인 생성 빌더
 * 기본
 */
fun StorageDomainVo.toStorageDomainBuilder(): StorageDomainBuilder {
	return StorageDomainBuilder()
		.name(this.name)
		.type(StorageDomainType.fromValue(this.type))
		.description(this.description)
		.comment(this.comment)
		.warningLowSpaceIndicator(this.warning)
		.criticalSpaceActionBlocker(this.spaceBlocker)  //디스크 공간 동작 차단
		.dataCenters(*arrayOf(DataCenterBuilder().id(this.dataCenterVo.id).build()))
		.host(HostBuilder().name(this.hostVo.name).build())
}

fun StorageDomainVo.toAddStorageDomainBuilder(): StorageDomain {
	log.info("toAddStorageDomainBuilder: {}", this)
	return this.toStorageDomainBuilder()
		.storage(
			when (StorageType.fromValue(this@toAddStorageDomainBuilder.storageVo.type.value())) {
				StorageType.NFS -> this@toAddStorageDomainBuilder.storageVo.toAddNFSBuilder()
				StorageType.ISCSI -> this.storageVo.toAddISCSIBuilder()
				StorageType.FCP -> this.storageVo.toAddFCPBuilder()
				else -> throw IllegalArgumentException("Unsupported storage type")
			}
		)
		.build()
}


// 도메인 가져오기 iscsi와 fc 모두
fun StorageDomainVo.toImportStorageDomainBuilder(): StorageDomain {
	log.info("toImportStorageDomainBuilder: {}", this)
	return this.toStorageDomainBuilder()
		.storage(storageVo.toImportFCPBuilder())
		.id(this.id)
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

// 호스트 찾기
fun StorageDomain.findHostFromStorageDomain(conn: Connection): Host? {
	// follow 때문에 위험한 코드
	val hosts: List<Host> = conn.findAllHosts(follow = "cluster.datacenter.storagedomains").getOrDefault(emptyList())
	return hosts.firstOrNull { host ->
		host.cluster()?.dataCenter()?.storageDomains()?.any { it.id() == this@findHostFromStorageDomain.id() } == true
	}
}

// 호스트 가상머신이 있는지 찾기
fun StorageDomain.findHostedVmFromStorageDomain(conn: Connection): Boolean {
	return conn.findAllVmsFromStorageDomain(this@findHostedVmFromStorageDomain.id()).getOrDefault(listOf())
		.any { it.origin() == "managed_hosted_engine" }
}

// 도메인 사이즈 계산
fun StorageDomain.toDomainSize(): BigInteger? {
	return if (this@toDomainSize.availablePresent() && this@toDomainSize.usedPresent()) {
		this@toDomainSize.available().add(this@toDomainSize.used())
	} else { null }
}


// fun HostStorage.toHostStorageVoByType(): HostStorageVo {
// 	return when (this.type()) {
// 		StorageType.ISCSI -> this.toIscsiStorageVo()
// 		StorageType.FCP ->this.toFibreStorageVo()
// 		else -> HostStorageVo()
// 	}
// }

fun StorageDomain.toStorageDomainSize(): StorageDomainVo {
	return StorageDomainVo.builder {
		id { this@toStorageDomainSize.id() }
		name { this@toStorageDomainSize.name() }
		type { this@toStorageDomainSize.type().value() }
		master { if(this@toStorageDomainSize.masterPresent()) this@toStorageDomainSize.master() else false }
		usedSize { this@toStorageDomainSize.used() }
		availableSize { this@toStorageDomainSize.available() }
	}
}
fun List<StorageDomain>.toStorageDomainSizes(): List<StorageDomainVo> =
	this@toStorageDomainSizes.map { it.toStorageDomainSize() }
