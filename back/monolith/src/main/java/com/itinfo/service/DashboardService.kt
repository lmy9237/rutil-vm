package com.itinfo.service

import com.itinfo.model.DataCenterVo
import com.itinfo.model.EventVo

/**
 * [DashboardService]
 * 대시보드 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface DashboardService {
	fun retrieveDataCenterStatus(): DataCenterVo
	fun retrieveEvents(): List<EventVo>
}

