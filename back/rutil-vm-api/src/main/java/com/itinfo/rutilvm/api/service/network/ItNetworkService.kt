package com.itinfo.rutilvm.api.service.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.error.ItemNotFoundException
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.fromNetworkFiltersToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromOpenStackNetworkProviderToIdentifiedVo
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.model.setting.toPermissionVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.springframework.stereotype.Service
import kotlin.Error

interface ItNetworkService {
	/**
	 * [ItNetworkService.findAll]
	 * 네트워크 목록
	 *
	 * @return List<[NetworkVo]> 네트워크 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<NetworkVo>
	/**
	 * [ItNetworkService.findOne]
	 * 네트워크 상세정보
	 *
	 * @param networkId [String] 네트워크 Id
	 * @return [NetworkVo] 네트워크 정보
	 */
	@Throws(ItemNotFoundException::class, Error::class)
	fun findOne(networkId: String): NetworkVo?

	/**
	 * [ItNetworkService.add]
	 * 네트워크 생성
	 * 기본 단순 생성은 클러스터가 할당되지도 필수도 선택되지 않음
	 * 외부 공급자 선택시 클러스터는 연결만 선택 가능 (필수 불가능)
	 *
	 * @param networkVo [NetworkVo]
	 * @return [NetworkVo]
	 */
	@Throws(Error::class)
	fun add(networkVo: NetworkVo): NetworkVo?
	/**
	 * [ItNetworkService.update]
	 * 네트워크 편집
	 * 편집에서는 클러스터 선택 못함
	 *
	 * @param networkVo [NetworkVo]
	 * @return [NetworkVo]
	 */
	@Throws(Error::class)
	fun update(networkVo: NetworkVo): NetworkVo?
	/**
	 * [ItNetworkService.remove]
	 * 네트워크 삭제
	 *
	 * @param networkId [String] 네트워크 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun remove(networkId: String): Boolean
	/**
	 * [ItNetworkService.removeMultiple]
	 * 네트워크 다중 삭제
	 *
	 * @param networkIdList [String] 네트워크 Id list
	 * @return Map<[String], [String]>
	 */
	@Throws(Error::class)
	fun removeMultiple(networkIdList: List<String>): Map<String, String>

	/**
	 * [ItNetworkService.findNetworkProviderFromNetwork]
	 * 네트워크 가져오기 - 네트워크 공급자 목록
	 *
	 * @return [IdentifiedVo]
	 */
	@Throws(Error::class)
	fun findNetworkProviderFromNetwork(): IdentifiedVo
	/**
	 * [ItNetworkService.findAllOpenStackNetworkFromNetworkProvider]
	 * 네트워크 가져오기 창 - 네트워크 공급자가 가지고있는 네트워크
	 *
	 * @param providerId [String] 공급자 Id
	 * @return List<[OpenStackNetworkVo]>
	 */
	@Throws(Error::class)
	fun findAllOpenStackNetworkFromNetworkProvider(providerId: String): List<OpenStackNetworkVo>
	/**
	 * [ItNetworkService.findAllDataCentersFromNetwork]
	 * 네트워크 가져올 때 사용될 데이터센터 목록
	 * 네트워크 자신의 데이터센터는 제외
	 *
	 * @param openstackNetworkId [String] 네트워크 Id
	 * @return List<[DataCenterVo]>
	 */
	@Throws(Error::class)
	fun findAllDataCentersFromNetwork(openstackNetworkId: String): List<DataCenterVo>
	/**
	 * [ItNetworkService.importNetwork]
	 * 네트워크 가져오기 - 데이터센터만 바꿔서 네트워크 복사기능
	 *
	 * @param openStackNetworkVos List<[OpenStackNetworkVo]> 오픈스택 네트워크 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun importNetwork(openStackNetworkVos: List<OpenStackNetworkVo>): Boolean

	/**
	 * [ItNetworkService.findAllClustersFromNetwork]
	 * 네트워크 클러스터 목록
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[ClusterVo]>
	 */
	@Throws(Error::class)
	fun findAllClustersFromNetwork(networkId: String): List<ClusterVo>
	/**
	 * [ItNetworkService.findConnectedHostsFromNetwork]
	 * 네트워크 호스트 목록 - 연결됨
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[HostVo]>
	 */
	@Throws(Error::class)
	fun findConnectedHostsFromNetwork(networkId: String): List<HostVo>
	/**
	 * [ItNetworkService.findDisconnectedHostsFromNetwork]
	 * 네트워크 호스트 목록 - 연결해제
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[HostVo]>
	 */
	@Throws(Error::class)
	fun findDisconnectedHostsFromNetwork(networkId: String): List<HostVo>
	/**
	 * [ItNetworkService.findAllVmsFromNetwork]
	 * 네트워크 가상머신 목록
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[VmVo]>
	 */
	@Throws(Error::class)
	fun findAllVmsFromNetwork(networkId: String): List<VmViewVo>
	/**
	 * [ItNetworkService.findAllTemplatesFromNetwork]
	 * 네트워크 템플릿 목록
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[NetworkTemplateVo]>
	 */
	@Throws(ItemNotFoundException::class, Error::class)
	fun findAllTemplatesFromNetwork(networkId: String): List<NetworkTemplateVo>
	/**
	 * [ItNetworkService.findAllNetworkFilters]
	 * vNIC Profile 생성 시 필요한 네트워크 필터 목록
	 *
	 * @return List<[IdentifiedVo]>
	 */
	@Throws(Error::class)
	fun findAllNetworkFilters(): List<IdentifiedVo>
	/**
	 * [ItNetworkService.findAllPermissionsFromNetwork]
	 * 네트워크 권한 목록
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[PermissionVo]>
	 */
	@Deprecated("사용안함")
	@Throws(Error::class)
	fun findAllPermissionsFromNetwork(networkId: String): List<PermissionVo>
}

@Service
class NetworkServiceImpl(

): BaseService(), ItNetworkService {

	@Throws(Error::class)
	override fun findAll(): List<NetworkVo> {
		log.info("findAll ... ")
		val networks: List<Network> = conn.findAllNetworks()
			.getOrDefault(listOf())
		return networks.toNetworksMenu(conn)
	}

	@Throws(Error::class)
	override fun findOne(networkId: String): NetworkVo? {
		log.info("findOne ... networkId: {}", networkId)
		val res: Network? = conn.findNetwork(networkId, "networklabels")
			.getOrNull()
		return res?.toNetworkVo(conn)
	}

	@Throws(Error::class)
	override fun add(networkVo: NetworkVo): NetworkVo? {
		// dc 다르면 중복명 가능
		log.info("addNetwork ... ")
		val res: Network = conn.addNetwork(
			networkVo.toAddNetworkBuilder()
		).getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()

		// 생성 후에 나온 network Id로 클러스터 네트워크 생성 및 레이블 생성 가능
		networkVo.toAddClusterAttach(conn, res.id())	// 클러스터 연결, 필수 선택
//		networkVo.toAddNetworkLabel(conn, res.id()) // 네트워크 레이블
		return res.toNetworkVo(conn)
	}

	@Throws(Error::class)
	override fun update(networkVo: NetworkVo): NetworkVo? {
		log.info("update ... networkName: {}", networkVo.name)
		val res: Network? = conn.updateNetwork(
			networkVo.toEditNetworkBuilder()
		).getOrNull()
		return res?.toNetworkVo(conn)
	}

	@Throws(Error::class)
	override fun remove(networkId: String): Boolean {
		log.info("remove ... ")
		val res: Result<Boolean> = conn.removeNetwork(networkId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun removeMultiple(networkIdList: List<String>): Map<String, String> {
		val result = mutableMapOf<String, String>() // 성공/실패 결과를 저장할 Map

		networkIdList.forEach { networkId ->
			val networkName: String = conn.findNetwork(networkId).getOrNull()?.name().toString()
			try {
				log.info("removeMultiple ... networkId: {}", networkId)
				val isSuccess = conn.removeNetwork(networkId).isSuccess

				if (isSuccess) {
					result[networkName] = "Success"
				}
			} catch (ex: Exception) {
				log.error("Failed to remove network: $networkName", ex)
				result[networkName] = "Failure: ${ex.message}" // 실패한 경우 메시지 추가
			}
		}
		return result
	}

	@Throws(Error::class)
	override fun findNetworkProviderFromNetwork(): IdentifiedVo {
		log.info("findNetworkProviderFromNetwork ... ")
		val res: OpenStackNetworkProvider = conn.findAllOpenStackNetworkProviders("networks")
			.getOrDefault(listOf())
			.first()
		return res.fromOpenStackNetworkProviderToIdentifiedVo()
	}

	@Throws(Error::class)
	override fun findAllOpenStackNetworkFromNetworkProvider(providerId: String): List<OpenStackNetworkVo> {
		log.info("findAllOpenStackNetworkFromNetworkProvider ... providerId: {}", providerId)
		val res: List<OpenStackNetwork> = conn.findAllOpenStackNetworksFromNetworkProvider(providerId)
			.getOrDefault(listOf())
		return res.toOpenStackNetworkVosIdName()
	}

	@Throws(Error::class)
	override fun findAllDataCentersFromNetwork(openstackNetworkId: String): List<DataCenterVo> {
		log.info("findAllDataCentersFromNetwork ... openstackNetworkId:{}", openstackNetworkId)
		val provider: OpenStackNetworkProvider = conn.findOpenStackNetworkProviderFirst()
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		val openstack: OpenStackNetwork = conn.findOpenStackNetworkFromNetworkProvider(provider.id(), openstackNetworkId)
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()

		val res: List<DataCenter> = conn.findAllDataCenters()
			.getOrDefault(listOf())
			.filter { dataCenter ->
				conn.findAllNetworksFromDataCenter(dataCenter.id())
					.getOrDefault(listOf())
					.none { it.externalProviderPresent() && it.name() != openstack.name() }
			}
		return res.toDataCenterIdNames()
	}

	@Throws(Error::class)
	override fun importNetwork(openStackNetworkVos: List<OpenStackNetworkVo>): Boolean {
		log.info("importNetwork ... ")
		// TODO 되긴하는데 리턴값이 애매함
		openStackNetworkVos.forEach{
			conn.importOpenStackNetwork(it.id, it.dataCenterVo.id)
		}
		return true
	}


	@Throws(Error::class)
	override fun findAllClustersFromNetwork(networkId: String): List<ClusterVo> {
		log.info("findAllClustersFromNetwork ... networkId: {}", networkId)
		val network: Network = conn.findNetwork(networkId)
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		val dcId = network.dataCenter().id()
		val res: List<Cluster> = conn.findAllClustersFromDataCenter(dcId, follow = "networks")
			.getOrDefault(listOf())
		return res.toNetworkClusterVos(conn, networkId)
	}

	@Throws(Error::class)
	override fun findConnectedHostsFromNetwork(networkId: String): List<HostVo> {
		log.info("findConnectedHostsFromNetwork ... ")
		conn.findNetwork(networkId)
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		val res: List<Host> = conn.findAllHosts(follow = "networkattachments")
			.getOrDefault(listOf())
			.filter { it.networkAttachments().any { networkAttachment -> networkAttachment.network().id() == networkId } }
		return res.toNetworkHostVos(conn) //TODO
	}

	@Throws(Error::class)
	override fun findDisconnectedHostsFromNetwork(networkId: String): List<HostVo> {
		log.info("findDisconnectedHostsFromNetwork ... ")
		val network = conn.findNetwork(networkId)
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()

		val allHostsInDataCenter = conn.findAllHostsFromDataCenter(network.dataCenter().id())
			.getOrDefault(listOf())

		val connectedHostIds = conn.findAllHosts(follow = "networkattachments")
			.getOrDefault(listOf())
			.filter { host ->
				host.networkAttachments().any { attachment ->
					attachment.network().id() == networkId
				}
			}
			.map { it.id() } // 연결된 호스트 ID 추출

		val res = allHostsInDataCenter.filter { it.id() !in connectedHostIds }
		return res.toNetworkHostVos(conn) //TODO
	}

	@Throws(Error::class)
	override fun findAllVmsFromNetwork(networkId: String): List<VmViewVo> {
		log.info("findAllVmsFromNetwork ... networkId: {}", networkId)
		// val network: Network = conn.findNetwork(networkId)
		// 	.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		// 따지고보면 nic를 출력하느너

		// VM의 NIC 중 networkId와 매칭되는 NIC이 있는지 확인
		val res: List<Vm> = conn.findAllVms(follow = "reporteddevices,nics.vnicprofile")
			.getOrDefault(listOf())
			.filter { vm -> vm.nics().any { nic -> nic.vnicProfile().network().id() == networkId } }

		// 모든 VM에 대해 NIC 정보를 포함하여 VmVo 변환
		return res.toVmViewVoFromNetworks(conn)
	}

	@Throws(Error::class)
	override fun findAllTemplatesFromNetwork(networkId: String): List<NetworkTemplateVo> {
		log.info("findAllTemplatesFromNetwork ... networkId: {}", networkId)
		conn.findNetwork(networkId)
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		val res: List<Template> = conn.findAllTemplates(follow = "nics.vnicprofile")
			.getOrDefault(listOf())
			.filter { it.nics().any { nic -> nic.vnicProfile().network().id() == networkId }
		}
		return res.flatMap { it.nics().map { nic -> it.toNetworkTemplateVo(conn, nic) } }
	}

	@Throws(Error::class)
	override fun findAllNetworkFilters(): List<IdentifiedVo> {
		log.info("findAllNetworkFilters ... ")
		val res: List<NetworkFilter> = conn.findAllNetworkFilters().getOrDefault(listOf())
		return res.fromNetworkFiltersToIdentifiedVos()
	}

	@Deprecated("사용안함")
	@Throws(Error::class)
	override fun findAllPermissionsFromNetwork(networkId: String): List<PermissionVo> {
		log.info("findAllPermissionsFromNetwork ... ")
		val permissions: List<Permission> = conn.findAllPermissionsFromNetwork(networkId)
			.getOrDefault(listOf())
		return permissions.toPermissionVos(conn)
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
