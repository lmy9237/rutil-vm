package com.itinfo.rutilvm.api.service.setting

import com.itinfo.rutilvm.api.model.computing.ClusterVo
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.model.setting.ProviderVo
import com.itinfo.rutilvm.api.repository.engine.ProvidersRepository
import com.itinfo.rutilvm.api.repository.engine.entity.ProvidersEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toProviderVos
import com.itinfo.rutilvm.api.service.computing.ItClusterService

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

interface ItProviderService {
	/**
	 * [ItProviderService.findAll]
	 * 공급자 목록
	 *
	 * @return List<[ProviderVo]> 공급자 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<ProviderVo>
	/**
	 * [ItProviderService.add]
	 * 공급자 생성
	 *
	 * @param providerVo [ProviderVo]
	 * @return [ProviderVo]?
	 */
	// @Throws(Error::class)
	// fun add(providerVo: ProviderVo): ProviderVo?
}

@Service
class ProviderServiceImpl (
): BaseService(), ItProviderService {
	@Autowired private lateinit var providers: ProvidersRepository

	@Throws(Error::class)
	override fun findAll(): List<ProviderVo> {
		log.info("findAll ...")
		val res: List<ProvidersEntity> = providers.findAll()
		return res.toProviderVos()
	}

	// @Throws(Error::class)
	// override fun add(providerVo: ProviderVo): ProviderVo? {
	// 	// log.info("add ...{}", providerVo)
	// 	// val res: List<ProvidersEntity> = providers.findAll()
	// 	// return res.toProviderVos()
	// 	TODO("")
	// }

	companion object {
		private val log by LoggerDelegate()
	}
}
