package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.ovirt.business.QuotaEnforcementType
import com.itinfo.rutilvm.api.ovirt.business.StorageDomainStatusB
import com.itinfo.rutilvm.api.ovirt.business.StoragePoolStatus
import com.itinfo.rutilvm.api.ovirt.business.toQuotaEnforcementType
import com.itinfo.rutilvm.api.ovirt.business.toQuotaModeType
import com.itinfo.rutilvm.api.ovirt.business.toStorageDomainStatusB
import com.itinfo.rutilvm.api.ovirt.business.toStoragePoolStatus
import com.itinfo.rutilvm.util.ovirt.*
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DataCenterBuilder
import org.ovirt.engine.sdk4.builders.VersionBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(DataCenterVo::class.java)

/**
 * [DataCenterVo]
 * 데이터센터 (a.k.a. 스토리지 풀)
 *
 * @property id [String]
 * @property name [String]
 * @property comment [String] 코멘트
 * @property description [String] 설명
 * @property storageType [Boolean] 스토리지 유형 (공유됨, 로컬)
 * @property version [String]
 * @property quotaMode [QuotaEnforcementType] 쿼터모드 (비활성화됨, 감사, 강제적용)
 * @property status [StoragePoolStatus] 상태 (contend, maintenance, not_operational, problematic, uninitialized, up)
 * @property domainStatus [StorageDomainStatusB] 스토리지 도메인 상태관리
 * @property clusterCnt [Int] 클러스터 개수
 * @property hostCnt [Int] 호스트 개수
 * @property clusterVos List<[clusterVos]>
 * @property networkVos List<[networkVos]>
 * @property storageDomainVos List<[storageDomainVos]>
 */
class DataCenterVo (
	val id: String = "",
	val name: String = "",
	val comment: String = "",
	val description: String = "",
	val storageType: Boolean = false,
	val version: String = "",
	val versionMajor: Int = 0,
	val versionMinor: Int = 0,
	val quotaMode: QuotaEnforcementType? = QuotaEnforcementType.disabled,
	val status: StoragePoolStatus? = StoragePoolStatus.not_operational,
	val domainStatus: StorageDomainStatusB? = StorageDomainStatusB.uninitialized,
	val clusterCnt: Int = 0,
	val hostCnt: Int = 0,
	val clusterVos: List<ClusterVo> = listOf(),
	val networkVos: List<IdentifiedVo> = listOf(),
	val storageDomainVos: List<StorageDomainVo> = listOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bStorageType: Boolean = false;fun storageType(block: () -> Boolean?) { bStorageType = block() ?: false }
		private var bVersion: String = "";fun version(block: () -> String?) { bVersion = block() ?: "" }
		private var bVersionMajor: Int = 0;fun versionMajor(block: () -> Int?) { bVersionMajor = block() ?: 0 }
		private var bVersionMinor: Int = 0;fun versionMinor(block: () -> Int?) { bVersionMinor = block() ?: 0 }
		private var bQuotaMode: QuotaEnforcementType? = QuotaEnforcementType.disabled;fun quotaMode(block: () -> QuotaEnforcementType?) { bQuotaMode = block() ?: QuotaEnforcementType.disabled }
		private var bStatus: StoragePoolStatus? = StoragePoolStatus.not_operational;fun status(block: () -> StoragePoolStatus?) { bStatus = block() ?: StoragePoolStatus.not_operational }
		private var bDomainStatus: StorageDomainStatusB? = StorageDomainStatusB.unknown;fun domainStatus(block: () -> StorageDomainStatusB?) { bDomainStatus = block() ?: StorageDomainStatusB.unknown }
		private var bClusterCnt: Int = 0; fun clusterCnt(block: () -> Int?) { bClusterCnt = block() ?: 0 }
		private var bHostCnt: Int = 0; fun hostCnt(block: () -> Int?) { bHostCnt = block() ?: 0 }
		private var bClusterVos: List<ClusterVo> = listOf();fun clusterVos(block: () -> List<ClusterVo>?) { bClusterVos = block() ?: listOf() }
		private var bNetworkVos: List<IdentifiedVo> = listOf();fun networkVos(block: () -> List<IdentifiedVo>?) { bNetworkVos = block() ?: listOf() }
		private var bStorageDomainVos: List<StorageDomainVo> = listOf();fun storageDomainVos(block: () -> List<StorageDomainVo>?) { bStorageDomainVos = block() ?: listOf() }
		fun build(): DataCenterVo = DataCenterVo(bId, bName, bComment, bDescription, bStorageType, bVersion, bVersionMajor, bVersionMinor, bQuotaMode, bStatus, bDomainStatus, bClusterCnt, bHostCnt, bClusterVos, bNetworkVos, bStorageDomainVos, )
	}

	companion object {
		inline fun builder(block: DataCenterVo.Builder.() -> Unit): DataCenterVo = Builder().apply(block).build()
	}
}

/**
 * 데이터센터 id & name
 */
fun DataCenter.toDataCenterIdName(): DataCenterVo = DataCenterVo.builder {
	id { this@toDataCenterIdName.id() }
	name { this@toDataCenterIdName.name() }
}
fun List<DataCenter>.toDataCenterIdNames(): List<DataCenterVo> =
	this@toDataCenterIdNames.map { it.toDataCenterIdName() }

/**
 * 데이터센터 메뉴 목록
 *
 * @param conn [Connection]
 * @return [DataCenterVo]
 */
fun DataCenter.toDataCenterMenu(conn: Connection): DataCenterVo {
	val dc = this@toDataCenterMenu
	val hostSize = conn.findAllHostsFromDataCenter(dc.id()).getOrDefault(listOf()).size
	return DataCenterVo.builder {
		id { dc.id() }
		name { dc.name() }
		comment { dc.comment() }
		description { dc.description() }
		storageType { dc.local() }
		status { dc.status().toStoragePoolStatus() }
		version { dc.version().major().toString() + "." + dc.version().minor() }
		clusterCnt { dc.clusters().size }
		hostCnt { hostSize }
	}
}

fun List<DataCenter>.toDataCentersMenu(conn: Connection): List<DataCenterVo> =
	this@toDataCentersMenu.map { it.toDataCenterMenu(conn) }


/**
 * 데이터센터 상세정보(편집창)
 * 위의 toDataCenterMenu 와 클러스터&호스트 개수만 다름
 */
fun DataCenter.toDataCenterVoInfo(): DataCenterVo {
	val dc = this@toDataCenterVoInfo
	return DataCenterVo.builder {
		id { dc .id() }
		name { dc.name() }
		comment { dc.comment() }
		description { dc.description() }
		storageType { dc.local() }
		status { dc.status().toStoragePoolStatus() }
		quotaMode { dc.quotaMode().toQuotaEnforcementType() }
		version { dc.version().major().toString() + "." + dc.version().minor() }
		versionMajor { dc.version().major().toInt() }
		versionMinor { dc.version().minor().toInt() }
	}
}

fun DataCenter.toDataCenterVo(
	conn: Connection?,
	findNetworks: Boolean = true,
	findStorageDomains: Boolean = true,
	findClusters: Boolean = true
): DataCenterVo {
	log.debug("DataCenter.toDataCenterVo ... findNetworks: {}, findStorageDomains: {}, findClusters: {}", findNetworks, findStorageDomains, findClusters)
	val networks: List<Network> = (conn?.findAllNetworks()?.getOrNull() ?: listOf()).filter {
		it.dataCenter().id() == this@toDataCenterVo.id()
	}
	val storageDomains: List<StorageDomain> =
		conn?.findAllStorageDomains()?.getOrDefault(listOf())
			?.filter { it.dataCentersPresent() && it.dataCenters().first().id() == this@toDataCenterVo.id() } ?: listOf()
	val clusters: List<Cluster> = (conn?.findAllClusters()?.getOrDefault(listOf()))?.filter {
		it.dataCenterPresent() && it.dataCenter().id() == this@toDataCenterVo.id()
	} ?: listOf()

	val storageDomainVoList: List<StorageDomainVo> = if (conn == null || !findStorageDomains) listOf() else storageDomains.toStorageDomainIdNames()
//	val storageDomainVos: List<IdentifiedVo> = if (conn == null || !findStorageDomains) listOf() else storageDomains.fromStorageDomainsToIdentifiedVos()
	val networkVos: List<IdentifiedVo> = if (conn == null || !findNetworks) listOf() else networks.fromNetworksToIdentifiedVos()
	val clusterVos: List<ClusterVo> = if (conn == null || !findClusters) listOf() else clusters.toDcClustersMenu()

	return DataCenterVo.builder {
		id { this@toDataCenterVo.id() }
		name { this@toDataCenterVo.name() }
		storageType { this@toDataCenterVo.local() }
		clusterVos { clusterVos }
		networkVos { networkVos }
		storageDomainVos { storageDomainVoList }
	}
}
fun List<DataCenter>.toDataCenterVos(
	conn: Connection?,
	findClusters: Boolean = true,
	findNetworks: Boolean = true,
	findStorageDomains: Boolean = true
): List<DataCenterVo> =
	this@toDataCenterVos.map { it.toDataCenterVo(conn, findClusters, findNetworks, findStorageDomains) }

fun StorageDomain.toStorageDomainDataCenter(conn: Connection): List<DataCenterVo> {
	val dataCenterIds =
		if (this@toStorageDomainDataCenter.dataCentersPresent())
			this@toStorageDomainDataCenter.dataCenters().map { it.id() }
		else listOf()

	return dataCenterIds.mapNotNull { dataCenterId ->
		val dataCenter = conn.findDataCenter(dataCenterId, "storagedomains").getOrNull()
		val storageDomainStatus = dataCenter?.storageDomains()?.find {
			it.id() == this@toStorageDomainDataCenter.id()
		}?.status()

		dataCenter?.let {
			DataCenterVo.builder {
				id { dataCenter.id() }
				name { dataCenter.name() }
				domainStatus { storageDomainStatus.toStorageDomainStatusB() }
			}
		}
	}
}
// region: builder


/**
 * [DataCenterVo.toDataCenterBuilder]
 * 데이터센터 빌더
 */
fun DataCenterVo.toDataCenterBuilder(): DataCenterBuilder = DataCenterBuilder()
	.name(name)
	.description(description)
	.local(storageType)
	.version(
		VersionBuilder()
			.major(versionMajor)
			.minor(versionMinor)
	)
	.quotaMode(quotaMode?.toQuotaModeType())
	.comment(comment)

/**
 * 데이터센터 생성 빌더
 */
fun DataCenterVo.toAddDataCenter(): DataCenter =
	toDataCenterBuilder().build()

/**
 * 데이터센터 편집 빌더
 */
fun DataCenterVo.toEditDataCenter(): DataCenter {
	return toDataCenterBuilder()
		.id(this.id)
		.build()
}
// endregion
