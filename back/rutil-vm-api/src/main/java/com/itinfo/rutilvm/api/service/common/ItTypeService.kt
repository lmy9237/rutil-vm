package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.api.ovirt.business.AuditLogSeverity
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.DiskContentType
import com.itinfo.rutilvm.api.ovirt.business.DiskInterface
import com.itinfo.rutilvm.api.ovirt.business.DisplayTypeB
import com.itinfo.rutilvm.api.ovirt.business.MigrationSupport
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
	 * [ItTypeService.findAllMigrationSupports]
	 * 마이그레이션 모드 목록
	 *
	 * @return List<[TypeVo]> 마이그레이션 모드 목록
	 */
	@Throws(Error::class)
	fun findAllMigrationSupports(): List<TypeVo>
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
		return DiskContentType.allDiskContentTypes.filter {
			it == DiskContentType.DATA || it == DiskContentType.ISO  // NOTE: 실제 필드에서 사용 될 유형
		}.toTypeVosFromDiskContentTypes()
	}

	override fun findAllDisplayTypes(): List<TypeVo> {
		log.info("findAllDisplayTypes ... ")
		return DisplayTypeB.allDisplayTypes.toTypeVosFromDisplayTypes()
	}

	override fun findAllVmTypes(): List<TypeVo> {
		log.info("findAllVmTypes ... ")
		return VmTypeB.allVmTypes.toTypeVosFromVmTypes()
	}

	override fun findAllMigrationSupports(): List<TypeVo> {
		log.info("findAllMigrationSupports ... ")
		return MigrationSupport.allMigrationSupports.toTypeVosFromMigrationSupports()
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
fun DiskContentType.toTypeVoFromDiskContentType(): TypeVo = TypeVo(
	this@toTypeVoFromDiskContentType.storageValue,
	this@toTypeVoFromDiskContentType.kr,
	this@toTypeVoFromDiskContentType.en,
)
fun List<DiskContentType>.toTypeVosFromDiskContentTypes(): List<TypeVo> =
	this@toTypeVosFromDiskContentTypes.map { it.toTypeVoFromDiskContentType() }
fun DiskInterface.toTypeVoFromDiskInterface(): TypeVo = TypeVo(
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
fun MigrationSupport.toTypeVoFromMigrationSupport(): TypeVo = TypeVo(
	this@toTypeVoFromMigrationSupport.name.uppercase(),
	this@toTypeVoFromMigrationSupport.kr,
	this@toTypeVoFromMigrationSupport.en,
)
fun List<MigrationSupport>.toTypeVosFromMigrationSupports(): List<TypeVo> =
	this@toTypeVosFromMigrationSupports.map { it.toTypeVoFromMigrationSupport() }
fun VmTypeB.toTypeVoFromVmType(): TypeVo = TypeVo(
	this@toTypeVoFromVmType.name,
	this@toTypeVoFromVmType.kr,
	this@toTypeVoFromVmType.en,
)
fun List<VmTypeB>.toTypeVosFromVmTypes(): List<TypeVo> =
	this@toTypeVosFromVmTypes.map { it.toTypeVoFromVmType() }

