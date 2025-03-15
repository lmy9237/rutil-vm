package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.ClusterVo
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.model.computing.HostVo
import com.itinfo.rutilvm.api.model.computing.VmViewVo
import com.itinfo.rutilvm.api.model.network.NetworkVo
import com.itinfo.rutilvm.api.model.network.UsageVo
import com.itinfo.rutilvm.common.LoggerDelegate
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.not
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

/**
 * [ItClusterServiceTest]
 * [ItClusterService]에 대한 테스트
 *
 * @author chanhi2000
 * @author deh22
 * @since 2024.10.10
 */
@SpringBootTest
class ItClusterServiceTest {

	@Autowired private lateinit var service: ItClusterService

	private lateinit var dataCenterId: String // 70 Default
	private lateinit var clusterId: String // 70 Default
	private lateinit var networkId: String // 70 ovirtmgmt(dc: Default)

	@BeforeEach
	fun setup() {
		dataCenterId = "94267b0e-f8b3-11ef-93e1-00163e4b783e"
		clusterId = "94283714-f8b3-11ef-ba3a-00163e4b783e"
		networkId = "00000000-0000-0000-0000-000000000009"
	}

	/**
	 * [should_findAll]
	 * [ItClusterService.findAll]에 대한 단위테스트
	 *
	 * @see ItClusterService.findAll
	 **/
	@Test
	fun should_findAll() {
		log.debug("should_findAll ... ")
		val result: List<ClusterVo> =
			service.findAll()

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
	}

	/**
	 * [should_findOne]
	 * [ItClusterService.findOne]에 대한 단위테스트
	 *
	 * @see ItClusterService.findOne
	 **/
	@Test
	fun should_findOne() {
		log.debug("should_findOne ... ")
		val result: ClusterVo? =
			service.findOne(clusterId)

		assertThat(result, `is`(not(nullValue())))
		println(result)
	}

	/**
	 * [should_findAllHostsFromCluster]
	 * [ItClusterService.findAllHostsFromCluster]에 대한 단위테스트
	 *
	 * @see ItClusterService.findAllHostsFromCluster
	 **/
	@Test
	fun should_findAllHostsFromCluster() {
		log.debug("should_findAllHostsFromCluster ... ")
		val result: List<HostVo> =
			service.findAllHostsFromCluster(clusterId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(2))
	}

	/**
	 * [should_findAllVmsFromCluster]
	 * [ItClusterService.findAllVmsFromCluster]에 대한 단위테스트
	 *
	 * @see ItClusterService.findAllVmsFromCluster
	 **/
	@Test
	fun should_findAllVmsFromCluster() {
		log.debug("should_findAllVmsFromCluster ... ")
		val result: List<VmViewVo> =
			service.findAllVmsFromCluster(clusterId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(5))
	}

	/**
	 * [should_findAllNetworksFromCluster]
	 * [ItClusterService.findAllNetworksFromCluster]에 대한 단위테스트
	 *
	 * @see ItClusterService.findAllNetworksFromCluster
	 **/
	@Test
	fun should_findAllNetworksFromCluster() {
		log.debug("should_findAllNetworksFromCluster ... ")
		val result: List<NetworkVo> =
			service.findAllNetworksFromCluster(clusterId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(7))
	}

	/**
	 * [should_addNetworkFromCluster]
	 * [ItClusterService.addNetworkFromCluster]에 대한 단위테스트
	 *
	 * @see ItClusterService.addNetworkFromCluster
	 **/
	@Test
	fun should_addNetworkFromCluster() {
		log.debug("should_addNetworkFromCluster ... ")
		val networkVo: NetworkVo =
			NetworkVo.builder {
				datacenterVo {
					IdentifiedVo.builder {
						id { dataCenterId }
					}
				}
				name { "test" }
				description { "" }
				portIsolation { false }
				usage {
					UsageVo.builder {
						vm { true }
					}
				}
				mtu { 0 }
			}

		val result: NetworkVo? =
			service.addNetworkFromCluster(clusterId, networkVo)

		assertThat(result, `is`(not(nullValue())))
	}

	/**
	 * [should_findAllManageNetworksFromCluster]
	 * [ItClusterService.findAllManageNetworksFromCluster]에 대한 단위테스트
	 *
	 * @see ItClusterService.findAllManageNetworksFromCluster
	 **/
	@Test
	fun should_findAllManageNetworksFromCluster() {
		log.debug("should_findAllManageNetworksFromCluster ... ")
		val result: List<NetworkVo> =
			service.findAllManageNetworksFromCluster(clusterId)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(4))
	}

	/**
	 * [should_findAllEventsFromCluster]
	 * [ItClusterService.findAllEventsFromCluster]에 대한 단위테스트
	 *
	 * @see ItClusterService.findAllEventsFromCluster
	 **/
	@Test
	fun should_findAllEventsFromCluster() {
		log.debug("should_findAllEventsFromCluster ... ")
		val result: List<EventVo> =
			service.findAllEventsFromCluster(clusterId)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result.size, `is`(1252))
	}

	// region: behavior

	/**
	 * [should_add_update_and_remove_Cluster]
	 * [ItClusterService.add], [ItClusterService.update], [ItClusterService.remove]에 대한 단위테스트
	 * 외부공급자 생성x
	 *
	 * @see ItClusterService.add
	 * @see ItClusterService.update
	 * @see ItClusterService.remove
	 **/
	@Test
	fun should_add_update_and_remove_Cluster() {
		log.debug("should_addCluster ... ")
		val addCluster: ClusterVo = ClusterVo.builder {
			dataCenterVo { IdentifiedVo.builder { id { dataCenterId } } }
			name { "testCluster" }
			cpuArc { Architecture.X86_64 }
			cpuType { "Intel Nehalem Family" }
			description { "testDescription" }
			comment { "testComment" }
			networkVo { NetworkVo.builder { id { networkId } } }
			biosType { BiosType.Q35_SEA_BIOS }
			logMaxMemory { 90 }
			logMaxMemoryType { LogMaxMemoryUsedThresholdType.PERCENTAGE }
			errorHandling { MigrateOnError.MIGRATE.toString() }
			bandwidth { MigrationBandwidthAssignmentMethod.AUTO }
			encrypted { InheritableBoolean.INHERIT }
		}

		val addResult: ClusterVo? =
			service.add(addCluster)

		assertThat(addResult, `is`(not(nullValue())))
		assertThat(addResult?.id, `is`(not(nullValue())))
		assertThat(addResult?.dataCenterVo?.id, `is`(addCluster.dataCenterVo.id))
		assertThat(addResult?.name, `is`(addCluster.name))
		assertThat(addResult?.description, `is`(addCluster.description))
		assertThat(addResult?.comment, `is`(addCluster.comment))
		assertThat(addResult?.networkVo?.id, `is`(addCluster.networkVo.id))
		assertThat(addResult?.biosType, `is`(addCluster.biosType))

		log.debug("should_updateCluster ... ")
		val updateCluster: ClusterVo = ClusterVo.builder {
			id { addResult?.id }
			dataCenterVo { IdentifiedVo.builder { id { dataCenterId } } }
			name { "testCluster1" }
			cpuArc { Architecture.X86_64 }
			cpuType { "Intel Nehalem Family" }
			description { "testDescription" }
			comment { "testComment" }
			networkVo { NetworkVo.builder { id { networkId } } }
			biosType { BiosType.Q35_SEA_BIOS }
			logMaxMemory { 90 }
			logMaxMemoryType { LogMaxMemoryUsedThresholdType.PERCENTAGE }
			errorHandling { MigrateOnError.MIGRATE.toString() }
			bandwidth { MigrationBandwidthAssignmentMethod.AUTO }
			encrypted { InheritableBoolean.INHERIT }
		}

		val updateResult: ClusterVo? =
			service.update(updateCluster)

		assertThat(updateResult, `is`(not(nullValue())))
		assertThat(updateResult?.id, `is`(updateCluster.id))
		assertThat(updateResult?.dataCenterVo?.id, `is`(updateCluster.dataCenterVo.id))
		assertThat(updateResult?.name, `is`(updateCluster.name))
		assertThat(updateResult?.description, `is`(updateCluster.description))
		assertThat(updateResult?.comment, `is`(updateCluster.comment))
		assertThat(updateResult?.networkVo?.id, `is`(updateCluster.networkVo.id))
		assertThat(updateResult?.biosType, `is`(updateCluster.biosType))

		log.debug("should_removeCluster ... ")
		val removeResult =
			updateResult?.let { service.remove(it.id) }

		assertThat(removeResult, `is`(true))
	}

	/**
	 * [should_add_networkProvider_Cluster]
	 * [ItClusterService.add]에 대한 단위테스트
	 * 외부공급자 생성o
	 *
	 * @see ItClusterService.add
	 **/
	@Test
	fun should_add_networkProvider_Cluster() {
		log.debug("should_add_networkProvider_Cluster ... ")
		val addCluster: ClusterVo = ClusterVo.builder {
			dataCenterVo { IdentifiedVo.builder { id { dataCenterId } } }
			name { "testCluster2" }
			cpuArc { Architecture.X86_64 }
			cpuType { "Intel Nehalem Family" }
			description { "networkProvider" }
			comment { "testComment" }
			networkVo { NetworkVo.builder { id { networkId } } }// 관리 네트워크 ovirtmgmt
			biosType { BiosType.Q35_SEA_BIOS }
			fipsMode { FipsMode.ENABLED }
			version { "4.7" }
			switchType { SwitchType.LEGACY }
			firewallType { FirewallType.FIREWALLD }
			logMaxMemory { 90 }
			logMaxMemoryType { LogMaxMemoryUsedThresholdType.PERCENTAGE }
			virtService { true }
			glusterService { false }
			errorHandling { MigrateOnError.MIGRATE.toString() }
			bandwidth { MigrationBandwidthAssignmentMethod.AUTO }
			encrypted { InheritableBoolean.INHERIT }
			networkProvider { true }
		}

		val result: ClusterVo? =
			service.add(addCluster)

		log.debug(result?.networkProvider.toString() + ", " + addCluster.networkProvider)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result?.id, `is`(not(nullValue())))
		assertThat(result?.dataCenterVo?.id, `is`(addCluster.dataCenterVo.id))
		assertThat(result?.name, `is`(addCluster.name))
		assertThat(result?.description, `is`(addCluster.description))
		assertThat(result?.comment, `is`(addCluster.comment))
		assertThat(result?.networkVo?.id, `is`(addCluster.networkVo.id))
		assertThat(result?.biosType, `is`(addCluster.biosType))
		assertThat(result?.fipsMode, `is`(addCluster.fipsMode))
		assertThat(result?.version, `is`(addCluster.version))
		assertThat(result?.switchType, `is`(addCluster.switchType))
		assertThat(result?.firewallType, `is`(addCluster.firewallType))
		assertThat(result?.logMaxMemory, `is`(addCluster.logMaxMemory))
		assertThat(result?.logMaxMemoryType, `is`(addCluster.logMaxMemoryType))
		assertThat(result?.virtService, `is`(addCluster.virtService))
		assertThat(result?.glusterService, `is`(addCluster.glusterService))
		assertThat(result?.errorHandling, `is`(addCluster.errorHandling))
		assertThat(result?.bandwidth, `is`(addCluster.bandwidth))
		assertThat(result?.encrypted, `is`(addCluster.encrypted))

		val removeResult =
			result?.let { service.remove(it.id) }
		assertThat(removeResult, `is`(true))
	}

	// endreigion


	companion object {
		private val log by LoggerDelegate()
	}
}
