package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllEvents
import com.itinfo.findAllDataCenters
import com.itinfo.findQuotaFromDataCenter
import com.itinfo.findAllQuotasFromDataCenter

import com.itinfo.addQuotaFromDataCenter

import com.itinfo.service.QuotasService
import com.itinfo.service.engine.ConnectionService

import com.itinfo.model.QuotaVo
import com.itinfo.model.toQuotaVo
import com.itinfo.model.toQuotaVos
import com.itinfo.model.EventVo
import com.itinfo.model.toEventVos
import com.itinfo.model.toQuota
import com.itinfo.model.QuotaCreateVo
import com.itinfo.model.QuotaClusterLimitVo

import org.ovirt.engine.sdk4.builders.QuotaClusterLimitBuilder
import org.ovirt.engine.sdk4.builders.QuotaStorageLimitBuilder

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


/**
 * [QuotasServiceImpl]
 * 할당량 관리 서비스 응용
 * 
 * @author chlee
 * @since 2023.12.07
 */
@Service
class QuotasServiceImpl : QuotasService {
	@Autowired private lateinit var connectionService: ConnectionService
	
	override fun retrieveQuotas(): List<QuotaVo> {
		log.info("... retrieveQuotas")
		val connection = connectionService.getConnection()
		val dataCenterId = connection.findAllDataCenters().firstOrNull()?.id() ?: ""
		log.debug("dataCenterId: $dataCenterId")
		if (dataCenterId.isEmpty())
			return arrayListOf()

		val quotas = connection.findAllQuotasFromDataCenter(dataCenterId)
		return quotas.toQuotaVos(connection)
	}

	/**
	 * [QuotasService.retrieveQuotaDetail]
	 *
	 * TODO: 데이터센터 조회 기능 구현 (현재는 하나)
	 */
	override fun retrieveQuotaDetail(quotaId: String): QuotaVo? {
		log.info("... retrieveQuotaDetail('$quotaId')")
		val connection = connectionService.getConnection()
		val dataCenterId = connection.findAllDataCenters().firstOrNull()?.id() ?: ""
		log.debug("dataCenterId: $dataCenterId")
		if (dataCenterId.isEmpty())
			return null

		val quota = connection.findQuotaFromDataCenter(dataCenterId, quotaId)
		return quota.toQuotaVo(connection)
	}

	override fun retrieveQuotaEvents(quotaId: String): List<EventVo> {
		log.info("... retrieveQuotaEvents('$quotaId')", )
		val c = connectionService.getConnection()
		val events = c.findAllEvents(" Quota = test-quota")
		return events.toEventVos()
	}

	override fun createQuota(quotaCreateVo: QuotaCreateVo): QuotaCreateVo? {
		log.info("... createQuota using object\n $quotaCreateVo")
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val dataCenter = c.findAllDataCenters().firstOrNull()
		if (dataCenter == null) {
			log.warn("createQuota FAILED ... dataCenter Not FOUND")
			return null
		}

		val quotasService = systemService.dataCentersService().dataCenterService(dataCenter?.id()).quotasService()
		val (clusterId, clusterName, memoryUsage, memoryLimit, vCpuUsage, vCpuLimit) = QuotaClusterLimitVo()
		val qslb = QuotaStorageLimitBuilder()
		val qcList = quotaCreateVo.quotaClusterList
		val qsdList = quotaCreateVo.quotaStorageDomainList
		val qclb = QuotaClusterLimitBuilder()
		val q2Add = quotaCreateVo.toQuota()
		val quota = c.addQuotaFromDataCenter(dataCenter.id(), q2Add)
		return null
	}

	override fun updateQuota(quotaCreateVo: QuotaCreateVo): QuotaCreateVo? {
		log.info("... updateQuota")
		// TODO 진행사항 확인 후 첨삭
		return null
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}
