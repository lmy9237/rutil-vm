package com.itinfo.service

import com.itinfo.model.ProviderVo


/**
 * [ProvidersService]
 * 프로바이더 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface ProvidersService {
	/**
	 * [ProvidersService.retrieveProviders]
	 * 프로바이더 목록 조회
	 *
	 * @return [List] 프로바이더 목록
	 */
	fun retrieveProviders(): List<ProviderVo>
}
