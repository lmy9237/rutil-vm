package com.itinfo.service

import com.itinfo.model.EventVo
import com.itinfo.model.QuotaCreateVo
import com.itinfo.model.QuotaVo

/**
 * [QuotasService]
 * 할당량 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface QuotasService {
	fun retrieveQuotas(): List<QuotaVo>
	fun retrieveQuotaDetail(quotaId: String): QuotaVo?
	fun retrieveQuotaEvents(quotaId: String): List<EventVo>
	fun createQuota(quotaCreateVo: QuotaCreateVo): QuotaCreateVo?
	fun updateQuota(quotaCreateVo: QuotaCreateVo): QuotaCreateVo?
}
