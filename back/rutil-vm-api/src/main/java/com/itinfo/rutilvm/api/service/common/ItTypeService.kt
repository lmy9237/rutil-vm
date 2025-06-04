package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.api.ovirt.business.BiosType
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.stereotype.Service
import java.io.Serializable

interface ItTypeService {
	/**
	 * [ItTypeService.findAllBiosTypes]
	 * BiosType 목록
	 *
	 * @return List<[BiosTypeVo]> 작업 목록
	 */
	@Throws(Error::class)
	fun findAllBiosTypes(): List<BiosTypeVo>
}

@Service
class TypeServiceImpl(

): BaseService(), ItTypeService {

	override fun findAllBiosTypes(): List<BiosTypeVo> {
		log.info("findAllBiosTypes ... ")
		return BiosType.allBiosTypes.toBiosTypeVos()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}

data class BiosTypeVo(val id: String, val kr: String, val en: String): Serializable

fun BiosType.toBiosTypeVo(): BiosTypeVo = BiosTypeVo(
	this@toBiosTypeVo.name.lowercase(),
	this@toBiosTypeVo.kr,
	this@toBiosTypeVo.en,
)

fun List<BiosType>.toBiosTypeVos(): List<BiosTypeVo> = this@toBiosTypeVos.map { it.toBiosTypeVo() }

