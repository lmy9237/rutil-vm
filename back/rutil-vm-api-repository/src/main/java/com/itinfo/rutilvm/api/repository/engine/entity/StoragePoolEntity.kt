package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.QuotaEnforcementType
import com.itinfo.rutilvm.api.ovirt.business.StorageFormatType
import com.itinfo.rutilvm.api.ovirt.business.StoragePoolStatus
import com.itinfo.rutilvm.common.gson
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.io.Serializable
import java.util.UUID
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.OneToMany

@Entity
@Table(name = "storage_pool")
/**
 * [StoragePoolEntity]
 * 스토리지 풀 (a.k.a. 데이터센터)
 *
 * @property id [UUID] 데이터센터 ID
 * @property name [String] 데이터센터 이름
 * @property description [String] 데이터센터 설명
 * @property _storagePoolType [Int] 데이터센터 유형 코드
 * @property _storagePoolFormatType [Int] 데이터센터 포멧 유형 코드
 * @property _status [Int] 데이터센터 상태 코드
 * @property masterDomainVersion [Int] ?
 * @property spmVdsId [UUID] ?
 * @property compatibilityVersion [String] 호환 버전 (2.2~4.7)
 * @property createDate [LocalDateTime] 생성일자
 * @property updateDate [LocalDateTime] 수정일자
 * @property _quotaEnforcementType [Int] 쿼터모드 유형코드
 * @property freeTextComment [String] 코멘트
 * @property isLocal [Boolean] 로컬여부 (true: 로컬, false: 공유됨)
 * @property managed [Boolean] ?
 *
 * @author 이찬희 (@chanhi2000)
 */
class StoragePoolEntity(
	@Id
	@Column(name="id", unique=true, nullable=false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val name: String = "",
	val description: String = "",
	@Column(name="storage_pool_type")
	private val _storagePoolType: Int? = null,
	@Column(name="storage_pool_format_type")
	private val _storagePoolFormatType: String? = null,
	@Column(name = "status", nullable=false)
	private val _status: Int = 0,
	val masterDomainVersion: Int = 0,
	@Column(name = "spm_vds_id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val spmVdsId: UUID? = null,
	val compatibilityVersion: String = "2.2",
	@Column(name="_create_date")
	val createDate: LocalDateTime? = null,
	@Column(name="_update_date")
	val updateDate: LocalDateTime? = null,
	@Column(name="quota_enforcement_type")
	private val _quotaEnforcementType: Int? = null,
	val freeTextComment: String = "",
	val isLocal: Boolean? = false,
	val managed: Boolean? = false,

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(
		name="storage_pool_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val clusters: Set<ClusterViewEntity>? = emptySet(),
	/*@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(
		name="storage_pool_id",
		referencedColumnName="id",
		insertable=false,
		updatable=false
	)
	val hosts: Set<VdsEntity>? = emptySet()*/
) : Serializable {
	val status: StoragePoolStatus						get() = StoragePoolStatus.forValue(_status)
	val storagePoolFormatType: StorageFormatType		get() = StorageFormatType.forValue(_storagePoolFormatType)
	val quotaEnforcementType: QuotaEnforcementType	get() = QuotaEnforcementType.forValue(_quotaEnforcementType)
	val majorVersion: Int								get() = compatibilityVersion.split(".").first().toIntOrNull() ?: 2
	val minorVersion: Int								get() = compatibilityVersion.split(".").last().toIntOrNull() ?: 2

	override fun toString(): String =
		gson.toJson(this@StoragePoolEntity)

	class Builder {
		private var bId: UUID? = null; fun id(block: () -> UUID?) { bId = block() }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = ""; fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bStoragePoolType: Int? = null; fun storagePoolType(block: () -> Int?) { bStoragePoolType = block() }
		private var bStoragePoolFormatType: String? = null; fun storagePoolFormatType(block: () -> String?) { bStoragePoolFormatType = block() }
		private var bStatus: Int = 0; fun status(block: () -> Int?) { bStatus = block() ?: 0 }
		private var bMasterDomainVersion: Int = 0; fun masterDomainVersion(block: () -> Int?) { bMasterDomainVersion = block() ?: 0 }
		private var bSpmVdsId: UUID? = null; fun spmVdsId(block: () -> UUID?) { bSpmVdsId = block() }
		private var bCompatibilityVersion: String = "2.2"; fun compatibilityVersion(block: () -> String?) { bCompatibilityVersion = block() ?: "2.2" }
		private var bCreateDate: LocalDateTime? = null; fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() }
		private var bUpdateDate: LocalDateTime? = null; fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bQuotaEnforcementType: Int? = null; fun quotaEnforcementType(block: () -> Int?) { bQuotaEnforcementType = block() }
		private var bFreeTextComment: String = ""; fun freeTextComment(block: () -> String?) { bFreeTextComment = block() ?: "" }
		private var bIsLocal: Boolean? = false; fun isLocal(block: () -> Boolean?) { bIsLocal = block() ?: false }
		private var bManaged: Boolean? = false; fun managed(block: () -> Boolean?) { bManaged = block() ?: false }
		private var bClusters: Set<ClusterViewEntity>? = emptySet(); fun clusters(block: () -> Set<ClusterViewEntity>?) { bClusters = block() ?: emptySet() }
		fun build(): StoragePoolEntity = StoragePoolEntity(bId, bName, bDescription, bStoragePoolType, bStoragePoolFormatType, bStatus, bMasterDomainVersion, bSpmVdsId, bCompatibilityVersion, bCreateDate, bUpdateDate, bQuotaEnforcementType, bFreeTextComment, bIsLocal, bManaged, bClusters)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): StoragePoolEntity = Builder().apply(block).build()
	}
}
