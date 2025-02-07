package com.itinfo.service

import com.itinfo.model.*

/**
 * [ItInfoNetworkService]
 * 네트워크 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface ItInfoNetworkService {
	fun getNetworkList(): List<ItInfoNetworkVo>
	fun getHostNetworkList(id: String): List<ItInfoNetworkVo>
	fun getNetworkDetail(itInfoNetworkVo: ItInfoNetworkVo): ItInfoNetworkGroupVo
	fun getNetworkCluster(clusterId: String, networkId: String): List<ItInfoNetworkClusterVo>
	fun getNetwork(networkId: String): ItInfoNetworkVo
	fun getNetworkHost(networkId: String): List<ItInfoNetworkHostVo>
	fun getNetworkVm(networkId: String): List<ItInfoNetworkVmVo>
	fun addLogicalNetwork(itInfoNetworkVo: ItInfoNetworkVo)
	fun getNetworkCreateResource(): ItInfoNetworkCreateVo

	@Throws(Exception::class)
	fun deleteNetworks(itInfoNetworkVos: List<ItInfoNetworkVo>)
	fun updateNetwork(itInfoNetworkVo: ItInfoNetworkVo)
}
