package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.api.ovirt.business.AuditLogSeverity
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.DiskContentTypeB
import com.itinfo.rutilvm.api.ovirt.business.DiskInterfaceB
import com.itinfo.rutilvm.api.ovirt.business.DisplayTypeB
import com.itinfo.rutilvm.api.ovirt.business.FipsModeB
import com.itinfo.rutilvm.api.ovirt.business.MigrateOnErrorB
import com.itinfo.rutilvm.api.ovirt.business.MigrationSupport
import com.itinfo.rutilvm.api.ovirt.business.QuotaEnforcementType
import com.itinfo.rutilvm.api.ovirt.business.StorageDomainTypeB
import com.itinfo.rutilvm.api.ovirt.business.SwitchTypeB
import com.itinfo.rutilvm.api.ovirt.business.VmTypeB
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.stereotype.Service
import java.io.Serializable

interface ItTypeService {
	/**
	 * [ItTypeService.findAllAuditLogSeverities]
	 * 이벤트 심각도 유형 목록
	 *
	 * @return List<[TypeVo]> 이벤트 심각도 유형 목록
	 */
	@Throws(Error::class)
	fun findAllAuditLogSeverities(): List<TypeVo>
	/**
	 * [ItTypeService.findAllBiosTypes]
	 * BiosType 목록
	 *
	 * @return List<[TypeVo]> 작업 목록
	 */
	@Throws(Error::class)
	fun findAllBiosTypes(): List<TypeVo>
	/**
	 * [ItTypeService.findAllDiskContentTypes]
	 * 디스크 유형 목록
	 *
	 * @return List<[TypeVo]> 디스크 유형 목록
	 */
	@Throws(Error::class)
	fun findAllDiskContentTypes(): List<TypeVo>
	/**
	 * [ItTypeService.findAllDisplayTypes]
	 * 가상머신 디스플레이 유형 목록
	 *
	 * @return List<[TypeVo]> 가상머신 디스플레이 유형 목록
	 */
	@Throws(Error::class)
	fun findAllDisplayTypes(): List<TypeVo>
	/**
	 * [ItTypeService.findAllFipsModes]
	 * (클러스터) FIPS 유형 목록
	 *
	 * @return List<[TypeVo]> (클러스터) FIPS 유형 목록
	 */
	@Throws(Error::class)
	fun findAllFipsModes(): List<TypeVo>
	/**
	 * [ItTypeService.findAllMigrateOnErrors]
	 * 마이그레이션 복구정책 목록
	 *
	 * @return List<[TypeVo]> 마이그레이션 복구정책 목록
	 */
	@Throws(Error::class)
	fun findAllMigrateOnErrors(): List<TypeVo>
	/**
	 * [ItTypeService.findAllMigrationSupports]
	 * 마이그레이션 모드 목록
	 *
	 * @return List<[TypeVo]> 마이그레이션 모드 목록
	 */
	@Throws(Error::class)
	fun findAllMigrationSupports(): List<TypeVo>
	/**
	 * [ItTypeService.findAllQuotaEnforcementTypes]
	 * 마이그레이션 모드 목록
	 *
	 * @return List<[TypeVo]> 마이그레이션 모드 목록
	 */
	@Throws(Error::class)
	fun findAllQuotaEnforcementTypes(): List<TypeVo>
	/**
	 * [ItTypeService.findAllStorageDomainTypes]
	 * 스토리지 도메인 유형 목록
	 *
	 * @return List<[TypeVo]> 스토리지 도메인 유형 목록
	 */
	@Throws(Error::class)
	fun findAllStorageDomainTypes(): List<TypeVo>
	/**
	 * [ItTypeService.findAllSwitchTypes]
	 * 네트워크 스위치 유형 목록
	 *
	 * @return List<[TypeVo]> 네트워크 스위치 유형 목록
	 */
	@Throws(Error::class)
	fun findAllSwitchTypes(): List<TypeVo>
	/**
	 * [ItTypeService.findAllVmTypes]
	 * 가상머신 유형 (a.k.a. 최적화 옵션) 목록
	 *
	 * @return List<[TypeVo]> 가상머신 유형 (a.k.a. 최적화 옵션) 목록
	 */
	@Throws(Error::class)
	fun findAllVmTypes(): List<TypeVo>

}

@Service
class TypeServiceImpl(

): BaseService(), ItTypeService {
	override fun findAllAuditLogSeverities(): List<TypeVo> {
		log.info("findAllAuditLogSeverities ... ")
		return AuditLogSeverity.allAuditLogSeverities.toTypeVosFromAuditLogSeverities()
	}

	override fun findAllBiosTypes(): List<TypeVo> {
		log.info("findAllBiosTypes ... ")
		return BiosTypeB.allBiosTypes.toTypeVosFromBiosTypes()
	}

	override fun findAllDiskContentTypes(): List<TypeVo> {
		log.info("findAllDiskContentTypes ... ")
		return DiskContentTypeB.allDiskContentTypes.filter {
			it == DiskContentTypeB.data || it == DiskContentTypeB.iso  // NOTE: 실제 필드에서 사용 될 유형
		}.toTypeVosFromDiskContentTypes()
	}

	override fun findAllDisplayTypes(): List<TypeVo> {
		log.info("findAllDisplayTypes ... ")
		return DisplayTypeB.allDisplayTypes.toTypeVosFromDisplayTypes()
	}

	override fun findAllFipsModes(): List<TypeVo> {
		log.info("findAllFipsModes ... ")
		return FipsModeB.allFipsModes.toTypeVosFromFipsModes()
	}

	override fun findAllMigrateOnErrors(): List<TypeVo> {
		log.info("findAllMigrateOnErrors ... ")
		return MigrateOnErrorB.allMigrateOnErrors.toTypeVosFromMigrateOnErrors()
	}

	override fun findAllMigrationSupports(): List<TypeVo> {
		log.info("findAllMigrationSupports ... ")
		return MigrationSupport.allMigrationSupports.toTypeVosFromMigrationSupports()
	}

	override fun findAllQuotaEnforcementTypes(): List<TypeVo> {
		log.info("findAllQuotaEnforcementTypes ... ")
		return QuotaEnforcementType.allQuotaEnforcementTypes.toTypeVosFromQuotaEnforcementTypes()
	}

	override fun findAllStorageDomainTypes(): List<TypeVo> {
		log.info("findAllStorageDomainTypes ... ")
		return StorageDomainTypeB.allStorageDomainTypes.toTypeVosFromStorageDomainTypes()
	}

	override fun findAllSwitchTypes(): List<TypeVo> {
		log.info("findAllSwitchTypes ... ")
		return SwitchTypeB.allSwitchTypes.toTypeVosFromSwitchTypes()
	}

	override fun findAllVmTypes(): List<TypeVo> {
		log.info("findAllVmTypes ... ")
		return VmTypeB.allVmTypes.toTypeVosFromVmTypes()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

data class TypeVo(val id: String, val kr: String, val en: String): Serializable

fun AuditLogSeverity.toTypeVoFromAuditLogSeverity(): TypeVo = TypeVo(
	this@toTypeVoFromAuditLogSeverity.name.lowercase(),
	this@toTypeVoFromAuditLogSeverity.kr,
	this@toTypeVoFromAuditLogSeverity.en,
)
fun List<AuditLogSeverity>.toTypeVosFromAuditLogSeverities(): List<TypeVo> =
	this@toTypeVosFromAuditLogSeverities.map { it.toTypeVoFromAuditLogSeverity() }
fun BiosTypeB.toTypeVoFromBiosType(): TypeVo = TypeVo(
	this@toTypeVoFromBiosType.name.lowercase(),
	this@toTypeVoFromBiosType.kr,
	this@toTypeVoFromBiosType.en,
)
fun List<BiosTypeB>.toTypeVosFromBiosTypes(): List<TypeVo> =
	this@toTypeVosFromBiosTypes.map { it.toTypeVoFromBiosType() }
fun DiskContentTypeB.toTypeVoFromDiskContentType(): TypeVo = TypeVo(
	this@toTypeVoFromDiskContentType.name,
	this@toTypeVoFromDiskContentType.kr,
	this@toTypeVoFromDiskContentType.en,
)
fun List<DiskContentTypeB>.toTypeVosFromDiskContentTypes(): List<TypeVo> =
	this@toTypeVosFromDiskContentTypes.map { it.toTypeVoFromDiskContentType() }
fun DiskInterfaceB.toTypeVoFromDiskInterface(): TypeVo = TypeVo(
	this@toTypeVoFromDiskInterface.name,
	this@toTypeVoFromDiskInterface.kr,
	this@toTypeVoFromDiskInterface.en,
)
fun DisplayTypeB.toTypeVoFromDisplayType(): TypeVo = TypeVo(
	this@toTypeVoFromDisplayType.name,
	this@toTypeVoFromDisplayType.kr,
	this@toTypeVoFromDisplayType.en,
)
fun List<DisplayTypeB>.toTypeVosFromDisplayTypes(): List<TypeVo> =
	this@toTypeVosFromDisplayTypes.map { it.toTypeVoFromDisplayType() }
fun FipsModeB.toTypeVoFromFipsMode(): TypeVo = TypeVo(
	this@toTypeVoFromFipsMode.name,
	this@toTypeVoFromFipsMode.kr,
	this@toTypeVoFromFipsMode.en,
)
fun List<FipsModeB>.toTypeVosFromFipsModes(): List<TypeVo> =
	this@toTypeVosFromFipsModes.map { it.toTypeVoFromFipsMode() }
fun MigrateOnErrorB.toTypeVoFromMigrateOnError(): TypeVo = TypeVo (
	this@toTypeVoFromMigrateOnError.name,
	this@toTypeVoFromMigrateOnError.kr,
	this@toTypeVoFromMigrateOnError.en,
)
fun List<MigrateOnErrorB>.toTypeVosFromMigrateOnErrors(): List<TypeVo> =
	this@toTypeVosFromMigrateOnErrors.map { it.toTypeVoFromMigrateOnError() }
fun MigrationSupport.toTypeVoFromMigrationSupport(): TypeVo = TypeVo(
	this@toTypeVoFromMigrationSupport.name,
	this@toTypeVoFromMigrationSupport.kr,
	this@toTypeVoFromMigrationSupport.en,
)
fun List<MigrationSupport>.toTypeVosFromMigrationSupports(): List<TypeVo> =
	this@toTypeVosFromMigrationSupports.map { it.toTypeVoFromMigrationSupport() }
fun QuotaEnforcementType.toTypeVoFromQuotaEnforcementType(): TypeVo = TypeVo(
	this@toTypeVoFromQuotaEnforcementType.name,
	this@toTypeVoFromQuotaEnforcementType.kr,
	this@toTypeVoFromQuotaEnforcementType.en,
)
fun List<QuotaEnforcementType>.toTypeVosFromQuotaEnforcementTypes(): List<TypeVo> =
	this@toTypeVosFromQuotaEnforcementTypes.map { it.toTypeVoFromQuotaEnforcementType() }
fun StorageDomainTypeB.toTypeVoFromStorageDomainType(): TypeVo = TypeVo(
	this@toTypeVoFromStorageDomainType.name,
	this@toTypeVoFromStorageDomainType.kr,
	this@toTypeVoFromStorageDomainType.en,
)
fun List<StorageDomainTypeB>.toTypeVosFromStorageDomainTypes(): List<TypeVo> =
	this@toTypeVosFromStorageDomainTypes.map { it.toTypeVoFromStorageDomainType() }
fun SwitchTypeB.toTypeVoFromSwitchType(): TypeVo = TypeVo(
	this@toTypeVoFromSwitchType.name,
	this@toTypeVoFromSwitchType.kr,
	this@toTypeVoFromSwitchType.en,
)
fun List<SwitchTypeB>.toTypeVosFromSwitchTypes(): List<TypeVo> =
	this@toTypeVosFromSwitchTypes.map { it.toTypeVoFromSwitchType()}
fun VmTypeB.toTypeVoFromVmType(): TypeVo = TypeVo(
	this@toTypeVoFromVmType.name,
	this@toTypeVoFromVmType.kr,
	this@toTypeVoFromVmType.en,
)
fun List<VmTypeB>.toTypeVosFromVmTypes(): List<TypeVo> =
	this@toTypeVosFromVmTypes.map { it.toTypeVoFromVmType() }

