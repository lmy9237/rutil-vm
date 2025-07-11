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
import com.itinfo.rutilvm.api.ovirt.business.BondModeVo
import com.itinfo.rutilvm.api.repository.engine.DnsResolverConfigurationRepository
import com.itinfo.rutilvm.api.repository.engine.NameServerRepository
import com.itinfo.rutilvm.api.repository.engine.NetworkClusterViewRepository
import com.itinfo.rutilvm.api.repository.engine.NetworkRepository
import com.itinfo.rutilvm.api.repository.engine.entity.DnsResolverConfigurationEntity
import com.itinfo.rutilvm.api.repository.engine.entity.NetworkClusterViewEntity
import com.itinfo.rutilvm.api.repository.engine.entity.NetworkEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toClusterVoFromNetworkClusterViewEntities
import com.itinfo.rutilvm.api.repository.engine.entity.toNetworkVoFromNetworkEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toNetworkVosFromNetworkEntities
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID
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
	fun findAllClustersFromNetwork(networkId: String): List<NetworkVo>?
	/**
	 * [ItNetworkService.findConnectedHostsFromNetwork]
	 * 네트워크 호스트 연결 목록
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[HostVo]>
	 */
	@Throws(Error::class)
	fun findConnectedHostsFromNetwork(networkId: String): List<HostVo>
	/**
	 * [ItNetworkService.findDisConnectedHostsFromNetwork]
	 * 네트워크 호스트 연결 해제목록
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[HostVo]>
	 */
	@Throws(Error::class)
	fun findDisConnectedHostsFromNetwork(networkId: String): List<HostVo>
	/**
	 * [ItNetworkService.findAllVmsNicFromNetwork]
	 * 네트워크 가상머신 목록
	 *
	 * @param networkId [String] 네트워크 아이디
	 * @return List<[NicVo]>
	 */
	@Throws(Error::class)
	fun findAllVmsNicFromNetwork(networkId: String): List<NicVo>
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
	 * [ItNetworkService.findAllBondModes]
	 * 호스트 네트워크 본딩 옵션 목록 조회
	 *
	 * @return List<[BondModeVo]> 호스트 네트워크 본딩 옵션 목록
	 */
	@Throws(Error::class)
	fun findAllBondModes(): List<BondModeVo>
}

@Service
class NetworkServiceImpl(
): BaseService(), ItNetworkService {

	@Autowired private lateinit var rNetwork: NetworkRepository
	@Autowired private lateinit var rNetworkCluster: NetworkClusterViewRepository
	@Autowired private lateinit var rDnsConfigs: DnsResolverConfigurationRepository
	@Autowired private lateinit var rNameServers: NameServerRepository

	@Throws(Error::class)
	override fun findAll(): List<NetworkVo> {
		log.info("findAll ... ")
		// val networks: List<Network> = conn.findAllNetworks(follow = "datacenter").getOrDefault(emptyList())
		val networksFound: List<NetworkEntity> = rNetwork.findAll()
		return networksFound.toNetworkVosFromNetworkEntities()
	}

	@Throws(Error::class)
	override fun findOne(networkId: String): NetworkVo? {
		log.info("findOne ... networkId: {}", networkId)
		// val res: Network? = conn.findNetwork(networkId, "datacenter,vnicprofiles,networklabels").getOrNull()
		val networkFound: NetworkEntity = rNetwork.findByNetworkId(networkId.toUUID()) ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		return networkFound.toNetworkVoFromNetworkEntity()
	}

	@Throws(Error::class)
	@Transactional("engineTransactionManager")
	override fun add(networkVo: NetworkVo): NetworkVo? {
		log.info("addNetwork ... {}", networkVo)
		val res: Network = conn.addNetwork(
			networkVo.toAddNetwork()
		).getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()

		// 생성 후에 나온 network Id로 클러스터 네트워크 생성 및 레이블 생성 가능
		networkVo.toAddClusterAttach(conn, res.id())	// 클러스터 연결, 필수 선택
//		networkVo.toAddNetworkLabel(conn, res.id()) // 네트워크 레이블
		applyDnsNameServers(networkVo.dnsNameServers, res.id().toUUID())
		return res.toNetworkIdName()
	}

	@Throws(Error::class)
	@Transactional("engineTransactionManager")
	override fun update(networkVo: NetworkVo): NetworkVo? {
		log.info("update ... networkName: {}", networkVo.name)
		val res: Network? = conn.updateNetwork(
			networkVo.toEditNetwork()
		).getOrNull()
		applyDnsNameServers(networkVo.dnsNameServers, networkVo.id.toUUID())
		return res?.toNetworkIdName()
	}

	@Transactional("engineTransactionManager")
	private fun applyDnsNameServers(
		dnsNameServers: List<DnsVo>,
		networkId: UUID
	) {
		log.info("updateDnsNameServers ... dnsNameServers: {} networkId: {}", dnsNameServers, networkId)
		val network2UpdateDns: NetworkEntity = rNetwork.findByNetworkId(networkId) ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		var dnsConfig: DnsResolverConfigurationEntity? = network2UpdateDns.dnsConfiguration
		if (dnsNameServers.isEmpty()) {
			if (dnsConfig != null) {
				rDnsConfigs.delete(dnsConfig)
				rNameServers.deleteAll(dnsConfig.nameServers)
				log.debug("updateDnsNameServers ... 네트워크 ${network2UpdateDns.name}에서 DNS 설정 제거 진행완료 ... dnsConfig.id: {}", dnsConfig.id)
			}
		} else {
			if (dnsConfig == null) {
				dnsConfig = DnsResolverConfigurationEntity.builder {
					id { UUID.randomUUID() }
				}
				network2UpdateDns.dnsConfiguration = dnsConfig // Associate the new configuration with the network
			} else {

			}
			dnsConfig.nameServers.clear()
			dnsNameServers.forEach { dns ->
				dnsConfig.addNameServer(dns.address, dns.position) // Assuming addNameServer handles creating NameServerEntity
			}
			log.info("네트워크 ${network2UpdateDns.name} 에 추가 된 DNS servers: $dnsNameServers ")
		}
		rNetwork.save(network2UpdateDns)
	}

	@Throws(Error::class)
	override fun remove(networkId: String): Boolean {
		log.info("remove ... ")
		val res: Result<Boolean> = conn.removeNetwork(networkId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun findNetworkProviderFromNetwork(): IdentifiedVo {
		log.info("findNetworkProviderFromNetwork ... ")
		val res: OpenStackNetworkProvider = conn.findAllOpenStackNetworkProviders().getOrDefault(emptyList()).first()
		return res.fromOpenStackNetworkProviderToIdentifiedVo()
	}

	@Throws(Error::class)
	override fun findAllOpenStackNetworkFromNetworkProvider(providerId: String): List<OpenStackNetworkVo> {
		log.info("findAllOpenStackNetworkFromNetworkProvider ... providerId: {}", providerId)
		val res: List<OpenStackNetwork> = conn.findAllOpenStackNetworksFromNetworkProvider(providerId).getOrDefault(emptyList())
		return res.toOpenStackNetworkVosIdName()
	}

	@Throws(Error::class)
	override fun findAllDataCentersFromNetwork(openstackNetworkId: String): List<DataCenterVo> {
		log.info("findAllDataCentersFromNetwork ... openstackNetworkId:{}", openstackNetworkId)
		val provider: OpenStackNetworkProvider = conn.findOpenStackNetworkProviderFirst()
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		val openstack: OpenStackNetwork = conn.findOpenStackNetworkFromNetworkProvider(provider.id(), openstackNetworkId)
			.getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()

		val res: List<DataCenter> = conn.findAllDataCenters().getOrDefault(emptyList())
			.filter { dataCenter ->
				conn.findAllNetworksFromDataCenter(dataCenter.id()).getOrDefault(emptyList())
					.none { it.externalProviderPresent() && it.name() != openstack.name() }
			}
		return res.toDataCenterIdNames()
	}

	// TODO 되긴하는데 리턴값이 애매함
	@Throws(Error::class)
	override fun importNetwork(openStackNetworkVos: List<OpenStackNetworkVo>): Boolean {
		log.info("importNetwork ... ")
		TODO()
		// openStackNetworkVos.forEach{
		// 	conn.importOpenStackNetwork(it.id, it.dataCenterVo.id)
		// }
		// return true
	}


	@Throws(Error::class)
	override fun findAllClustersFromNetwork(networkId: String): List<NetworkVo>? {
		log.info("findAllClustersFromNetwork ... networkId: {}", networkId)
		// val network = checkNetwork(networkId)
		// val dcId = network.dataCenter().id()
		// val res: List<Cluster> = conn.findAllClustersFromDataCenter(dcId, follow = "networks").getOrDefault(emptyList())
		// return res.toNetworkClusterVos(conn, networkId)
		val res: List<NetworkClusterViewEntity>? = rNetworkCluster.findByNetworkId(networkId.toUUID())
		return res?.toClusterVoFromNetworkClusterViewEntities()
	}

	@Throws(Error::class)
	override fun findConnectedHostsFromNetwork(networkId: String): List<HostVo> {
		log.info("findConnectedHostsFromNetwork ... networkId: {}", networkId)
		val network = checkNetwork(networkId)
		val res: List<Host> = conn.findAllHosts(follow = "cluster.datacenter,networkattachments,nics").getOrDefault(emptyList())
			.filter { host ->
				val clusterNetworks = conn.findAllNetworksFromCluster(host.cluster().id()).getOrDefault(emptyList())
					.any { it.id() == networkId }
				host.networkAttachments().any { it.network().id() == networkId } && clusterNetworks
			}

		return res.toNetworkHostMenus(conn, networkId)
	}

	@Throws(Error::class)
	override fun findDisConnectedHostsFromNetwork(networkId: String): List<HostVo> {
		log.info("findDisConnectedHostsFromNetwork ... networkId: {}", networkId)
		val network = checkNetwork(networkId)
		val hosts: List<Host> = conn.findAllHosts(follow = "cluster.datacenter,networkattachments,nics").getOrDefault(emptyList())
			.filter { host ->
				val clusterNetworks = conn.findAllNetworksFromCluster(host.cluster().id()).getOrDefault(emptyList())
					.any { it.id() == networkId }
				host.networkAttachments().none { it.network().id() == networkId } && clusterNetworks
			}
		return hosts.toNetworkDisConnectedHostMenus()
	}

	@Throws(Error::class)
	override fun findAllVmsNicFromNetwork(networkId: String): List<NicVo> {
		log.info("findAllVmsFromNetwork ... networkId: {}", networkId)
		val res: List<Vm> = conn.findAllVms(follow = "nics.vnicprofile,nics.statistics").getOrDefault(emptyList())
			.filter { vm -> vm.nics().any { nic -> nic.vnicProfile().network().id() == networkId } }

		return res.flatMap { vm ->
			vm.nics().map { nic -> nic.toNetworkVmMenu(conn) } // NicVo로 변환
		}
	}

	@Throws(Error::class)
	override fun findAllTemplatesFromNetwork(networkId: String): List<NetworkTemplateVo> {
		// TODO
		log.info("findAllTemplatesFromNetwork ... networkId: {}", networkId)
		val res: List<Template> = conn.findAllTemplates(follow = "nics.vnicprofile").getOrDefault(emptyList())
			.filter { it.nics().any { nic -> nic.vnicProfile().network().id() == networkId }
		}
		return res.flatMap {
			it.nics().map { nic -> it.toNetworkTemplateVo(conn, nic) }
		}
	}

	@Throws(Error::class)
	override fun findAllNetworkFilters(): List<IdentifiedVo> {
		log.info("findAllNetworkFilters ... ")
		val res: List<NetworkFilter> = conn.findAllNetworkFilters().getOrDefault(emptyList())
		return res.fromNetworkFiltersToIdentifiedVos()
	}

	@Throws(Error::class)
	override fun findAllBondModes(): List<BondModeVo> {
		log.info("findAllBondModes ... ")
		val res: List<BondModeVo> = BondModeVo.allBondModes
		return res
	}


	private fun checkNetwork(networkId: String): Network {
		return conn.findNetwork(networkId).getOrNull() ?: throw ErrorPattern.NETWORK_NOT_FOUND.toException()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
