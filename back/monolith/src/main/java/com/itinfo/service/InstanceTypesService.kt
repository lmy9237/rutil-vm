package com.itinfo.service

import com.itinfo.model.InstanceTypeVo

/**
 * [InstanceTypesService]
 * 인스턴스 유형 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 * @see com.itinfo.service.impl.InstanceTypesServiceImpl
 */
interface InstanceTypesService {
	fun retrieveInstanceTypes(): List<InstanceTypeVo>
	fun retrieveInstanceTypeCreateInfo(): InstanceTypeVo
	fun createInstanceType(instanceType: InstanceTypeVo): String
	fun retrieveInstanceTypeUpdateInfo(id: String): InstanceTypeVo
	fun updateInstanceType(instanceType: InstanceTypeVo): String
	fun removeInstanceType(instanceType: InstanceTypeVo): String
}
