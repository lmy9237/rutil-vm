package com.itinfo.service

import com.itinfo.rutilvm.util.model.SystemPropertiesVo

// import com.itinfo.model.AppInfoVo

/**
 * [SystemPropertiesService]
 * 시스템 속성관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface SystemPropertiesService {
	fun retrieveSystemProperties(): SystemPropertiesVo
	fun saveSystemProperties(paramSystemPropertiesVo: SystemPropertiesVo): Int
	// fun retrieveProgramVersion(): AppInfoVo
	fun retrieveProgramVersion(): Array<String>
}
