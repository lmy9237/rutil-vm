package com.itinfo.service

import com.itinfo.model.DataCenterVo

/**
 * [DataCenterService]
 * 데이터센터 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface DataCenterService {
	fun retrieveDataCenters(): List<DataCenterVo>
}
