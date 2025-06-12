package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.api.ovirt.business.BiosType
import com.itinfo.rutilvm.api.ovirt.business.DiskContentType
import com.itinfo.rutilvm.api.ovirt.business.MigrationSupport
import com.itinfo.rutilvm.api.ovirt.business.VmType
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.stereotype.Service
import java.io.Serializable

interface ItTypeService {
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

	override fun findAllBiosTypes(): List<TypeVo> {
		log.info("findAllBiosTypes ... ")
		return BiosType.allBiosTypes.toTypeVosFromBiosTypes()
	}

	override fun findAllDiskContentTypes(): List<TypeVo> {
		log.info("findAllDiskContentTypes ... ")
		return DiskContentType.allDiskContentTypes.toTypeVosFromDiskContentTypes()
			.filter { it.id == "DATA" || it.id == "ISOF" }
	}

	override fun findAllVmTypes(): List<TypeVo> {
		log.info("findAllVmTypes ... ")
		return VmType.allVmTypes.toTypeVosFromVmTypes()
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

fun BiosType.toTypeVoFromBiosType(): TypeVo = TypeVo(
	this@toTypeVoFromBiosType.name.lowercase(),
	this@toTypeVoFromBiosType.kr,
	this@toTypeVoFromBiosType.en,
)
fun List<BiosType>.toTypeVosFromBiosTypes(): List<TypeVo> =
	this@toTypeVosFromBiosTypes.map { it.toTypeVoFromBiosType() }
fun DiskContentType.toTypeVoFromDiskContentType(): TypeVo = TypeVo(
	this@toTypeVoFromDiskContentType.storageValue,
	this@toTypeVoFromDiskContentType.kr,
	this@toTypeVoFromDiskContentType.en,
)
fun List<DiskContentType>.toTypeVosFromDiskContentTypes(): List<TypeVo> =
	this@toTypeVosFromDiskContentTypes.map { it.toTypeVoFromDiskContentType() }
fun MigrationSupport.toTypeVoFromMigrationSupport(): TypeVo = TypeVo(
	this@toTypeVoFromMigrationSupport.name.lowercase(),
	this@toTypeVoFromMigrationSupport.kr,
	this@toTypeVoFromMigrationSupport.en,
)
fun List<MigrationSupport>.toTypeVosFromMigrationSupports(): List<TypeVo> =
	this@toTypeVosFromMigrationSupports.map { it.toTypeVoFromMigrationSupport() }
fun VmType.toTypeVoFromVmType(): TypeVo = TypeVo(
	this@toTypeVoFromVmType.name.lowercase(),
	this@toTypeVoFromVmType.kr,
	this@toTypeVoFromVmType.en,
)
fun List<VmType>.toTypeVosFromVmTypes(): List<TypeVo> =
	this@toTypeVosFromVmTypes.map { it.toTypeVoFromVmType() }

