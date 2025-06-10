package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.DataCenterVo
import com.itinfo.rutilvm.api.service.computing.ItClusterService
import com.itinfo.rutilvm.api.service.computing.ItHostService
import com.itinfo.rutilvm.api.service.computing.ItVmService
import com.itinfo.rutilvm.util.ovirt.findAllDataCenters
import com.itinfo.rutilvm.util.ovirt.findAllStorageDomains
import com.itinfo.rutilvm.util.ovirt.findAllHosts

import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

interface ItDashboardService {
	/**
	 * [ItDashboardService.getDatacenters]
	 * 대시보드 - 데이터센터 개수
	 *
	 * @param type [String] 데이터센터 상태 (up, down, all)
	 * @return [Int] 데이터센터 개수
	 */
	fun getDatacenters(type: String = ""): Int // type: up, down, ""(all)

	/**
	 * [ItDashboardService.getClusters]
	 * 대시보드 - 클러스터 개수
	 *
	 * @return [Int] 클러스터 개수
	 */
	fun getClusters(): Int

	/**
	 * [ItDashboardService.getHosts]
	 * 대시보드 - 호스트 개수
	 *
	 * @param type [String] 호스트 상태 (up, down, all)
	 * @return [Int] 호스트 개수
	 */
	fun getHosts(type: String = ""): Int

	/**
	 * [ItDashboardService.getVms]
	 * 대시보드 - 가상머신 개수
	 *
	 * @param type [String] 데이터센터 상태 (up, down, all)
	 * @return [Int] 가상머신 개수
	 */
	fun getVms(type: String = ""): Int

	/**
	 * [ItDashboardService.getStorages]
	 * 대시보드 - 스토리지 도메인 개수
	 *
	 * @return [Int] 스토리지 도메인 개수
	 */
	fun getStorages(): Int
	fun getEvents(type: String = ""): Int
	fun getCpu(): Int
	fun getMemory(type: String = ""): Int
	fun getStorage(type: String = ""): Int
	fun setComputing() : List<DataCenterVo>
}

@Service
class DashboardServiceImpl(

): BaseService(), ItDashboardService {

	@Autowired private lateinit var vm: ItVmService
	@Autowired private lateinit var cluster: ItClusterService
	@Autowired private lateinit var host: ItHostService

	override fun getDatacenters(type: String): Int {
		log.info("getDatacenters ... type: $type")
		val dataCenters: List<DataCenter> =
			conn.findAllDataCenters()
				.getOrDefault(listOf())
		return dataCenters.count {
				when (type) {
					"up" -> it.status() == DataCenterStatus.UP
					"down" -> it.status() != DataCenterStatus.UP
					else -> true
				}
			}
	}

	override fun getClusters(): Int {
		log.info("getClusters ...")
		return cluster.findAll().size
	}

	override fun getHosts(type: String): Int {
		log.info("getHosts ... type: $type")
		return host.findAll().count {
			when (type) {
				"up" -> it.status == HostStatus.UP
				"down" -> it.status != HostStatus.UP
				else -> true
			}
		}
	}

	override fun getVms(type: String): Int {
		log.info("getVms ... type: $type")
		return vm.findAll().count {
			when (type) {
				"up" -> it.status == "UP"
				"down" -> it.status != "UP"
				else -> true
			}
		}
	}

	override fun getStorages(): Int {
		log.info("getStorages ... ")
		val storageDomains: List<StorageDomain> =
			conn.findAllStorageDomains()
				.getOrDefault(listOf())

		log.info("getStorages ... ${storageDomains.size} found ... ")
		return storageDomains.count {
			!it.statusPresent()
		}
	}

	/**
	 * [ItDashboardService.getEvents]
	 * 대시보드 - 이벤트 개수
	 *
	 * @return [Int] 이벤트 개수
	 *
	 * TODO : 기준이 애매하다
	 */
	override fun getEvents(type: String): Int {
		return 0
	}

	override fun getCpu(): Int {
		return conn.findAllHosts()
			.getOrDefault(listOf())
			.sumOf {
				it.cpu().topology().cores().toInt() *
				it.cpu().topology().sockets().toInt() *
				it.cpu().topology().threads().toInt()
			}
	}
/*
	// 전체사용량: cpu
	public void getCpu(SystemService system) {
		int cpuTotal = 0;
		int cpuCommit = 0;
		int cpuAssigned = 0;

		List<Host> hostList = system.hostsService().list().send().hosts();
		List<Vm> vmList = system.vmsService().list().send().vms();

		// 호스트에 있는 cpu
		for (Host host : hostList) {
			cpuTotal += host.cpu().topology().cores().intValue()
					* host.cpu().topology().sockets().intValue()
					* host.cpu().topology().threads().intValue();
		}

		// 가상머신에 할당된 cpu
		for (Vm vm : vmList) {
			cpuAssigned += vm.cpu().topology().cores().intValue()
					* vm.cpu().topology().sockets().intValue()
					* vm.cpu().topology().threads().intValue();
		}

		dbVo.setCpuTotal(cpuTotal);
		dbVo.setCpuAssigned(cpuAssigned);
	}
 */

	override fun getMemory(type: String): Int {
		return 0
	}
/*
	// memory
	public void getMemory(SystemService system) {
		List<Host> hostList = system.hostsService().list().send().hosts();

		// host id
		for (Host host : hostList) {
			List<Statistic> statisticList = system.hostsService().hostService(host.id()).statisticsService().list().send().statistics();

			// memory
			for (Statistic statistic : statisticList) {
				if (statistic.name().equals("memory.total")) {
					dbVo.setMemoryTotal(dbVo.getMemoryTotal() == null ?
							statistic.values().get(0).datum() : dbVo.getMemoryTotal().add(statistic.values().get(0).datum()));
				}
				if (statistic.name().equals("memory.used")) {
					dbVo.setMemoryUsed(dbVo.getMemoryUsed() == null ?
							statistic.values().get(0).datum() : dbVo.getMemoryUsed().add(statistic.values().get(0).datum()));
				}
				if (statistic.name().equals("memory.free")) {
					dbVo.setMemoryFree(dbVo.getMemoryFree() == null ?
							statistic.values().get(0).datum() : dbVo.getMemoryFree().add(statistic.values().get(0).datum()));
				}
			}
		}
	}
*/

	override fun getStorage(type: String): Int {
		return 0
	}


	/*
        // storage
        public void getStorage(SystemService system) {
            List<StorageDomain> storageDomainList = system.storageDomainsService().list().send().storageDomains();

            // storage datacenter 붙어있는지
            int storageActive = (int) storageDomainList.stream()
                    .filter(StorageDomain::dataCentersPresent)
                    .count();

            dbVo.setStorageDomainCnt(storageDomainList.size());
            dbVo.setStorageDomainActive(storageActive);
            dbVo.setStorageDomainInactive(storageDomainList.size() - storageActive);

            // 스토리지 값
            for (StorageDomain storageDomain : storageDomainList) {
                if (storageDomain.dataCentersPresent()) {
                    dbVo.setStorageTotal( dbVo.getStorageTotal() == null ?
                            new BigDecimal(storageDomain.available().add(storageDomain.used())) : dbVo.getStorageTotal().add(new BigDecimal(storageDomain.available().add(storageDomain.used()))) );

                    dbVo.setStorageUsed(dbVo.getStorageUsed() == null ?
                            new BigDecimal(storageDomain.used()) : dbVo.getStorageUsed().add(new BigDecimal(storageDomain.used())));

                    dbVo.setStorageFree(dbVo.getStorageTotal().subtract(dbVo.getStorageUsed()));
                }
            }
        }
    */

	override fun setComputing(): List<DataCenterVo> {
		log.info("set Computing ... ")
		val dataCenters : List<DataCenter> =
			conn.findAllDataCenters("", "clusters")
				.getOrDefault(listOf())
		TODO("Not yet implemented")
	}

	companion object {
		private val log by LoggerDelegate()
	}
}


