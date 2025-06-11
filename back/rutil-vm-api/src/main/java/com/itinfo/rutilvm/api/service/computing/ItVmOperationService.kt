package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.VmExportVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.fromHostsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromNetworksToIdentifiedVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.service.computing.ItHostNicServiceImpl.Companion
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.Vm

import org.springframework.stereotype.Service

interface ItVmOperationService {
	/**
	 * [ItVmOperationService.start]
	 * 가상머신 - 실행
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun start(vmId: String): Boolean
	/**
	 * [ItVmOperationService.pause]
	 * 가상머신 - 일시정지
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun pause(vmId: String): Boolean
	/**
	 * [ItVmOperationService.powerOff]
	 * 가상머신 - 전원끔
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun powerOff(vmId: String): Boolean
	/**
	 * [ItVmOperationService.shutdown]
	 * 가상머신 - 종료
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun shutdown(vmId: String): Boolean
	/**
	 * [ItVmOperationService.reboot]
	 * 가상머신 - 재부팅
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun reboot(vmId: String): Boolean
	/**
	 * [ItVmOperationService.reset]
	 * 가상머신 - 재설정
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun reset(vmId: String): Boolean

	/**
	 * [ItVmOperationService.findMigratableHosts]
	 * 마이그레이션 할 수 있는 호스트 목록
	 *
	 * @param vmIds List<[String]> 가상머신 Id 목록
	 * @return List<[IdentifiedVo]>
	 */
	@Throws(Error::class, ItCloudException::class)
	fun findMigratableHosts(vmIds: List<String>): List<IdentifiedVo>
	/**
	 * [ItVmOperationService.findAllMigratableHostsFromVm]
	 * 마이그레이션 할 수 있는 호스트 목록
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return List<[IdentifiedVo]>
	 */
	@Throws(Error::class, ItCloudException::class)
	fun findAllMigratableHostsFromVm(vmId: String): List<IdentifiedVo>

	/**
	 * [ItVmOperationService.findAllNetworksFromHost]
	 * 호스트 네트워크 목록
	 * 가상머신 실행 시 호스트에 네트워크 있는지 확인 용
	 * 가상머신 마이그레이션시 각 호스트의 네트워크 비교를 위해
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[IdentifiedVo]> 네트워크 목록
	 */
	@Throws(Error::class)
	fun findAllNetworksFromHost(hostId: String): List<IdentifiedVo>

	/**
	 * [ItVmOperationService.migrate]
	 * 가상머신 - 마이그레이션
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param vmVo [VmVo] 마이그레이션할 클러스터 id /호스트 Id
	 * @param affinityClosure [Boolean]
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun migrate(vmId: String, vmVo: VmVo, affinityClosure: Boolean = false): Boolean

	// 가상머신 내보내기 창
	// 		호스트 목록 [ItClusterService.findAllHostsFromCluster] (가상 어플라이언스로 가상머신 내보내기)

	/**
	 * [ItVmOperationService.exportOva]
	 * 가상머신 ova로 내보내기 (실행시, 해당 host?vm? 내부에 파일이 생성됨)
	 *
	 * @param vmId [String]
	 * @param vmExportVo [VmExportVo]
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun exportOva(vmId: String, vmExportVo: VmExportVo): Boolean
}

@Service
class VmOperationServiceImpl: BaseService(), ItVmOperationService {

	@Throws(Error::class, ItCloudException::class)
	override fun start(vmId: String): Boolean {
		log.info("start ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.startVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class, ItCloudException::class)
	override fun pause(vmId: String): Boolean {
		log.info("pause ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.suspendVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class, ItCloudException::class)
	override fun powerOff(vmId: String): Boolean {
		log.info("powerOff ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.stopVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class, ItCloudException::class)
	override fun shutdown(vmId: String): Boolean {
		log.info("shutdown ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.shutdownVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class, ItCloudException::class)
	override fun reboot(vmId: String): Boolean {
		log.info("reboot ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.rebootVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class, ItCloudException::class)
	override fun reset(vmId: String): Boolean {
		log.info("reset ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.resetVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class, ItCloudException::class)
	override fun findMigratableHosts(vmIds: List<String>): List<IdentifiedVo> {
		log.info("findMigratableHosts ... vmIds: {}", vmIds)
		val searchQuery: String = vmIds.joinToString(" or ") { "id=${it}" }
		val vms: List<Vm> = conn.findAllVms(searchQuery=searchQuery, follow="cluster")
			.getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		val clusters: List<Cluster> = vms.mapNotNull {
			it.cluster()
		}.distinctBy {
			it.id()
		}
		if (clusters.isEmpty()) throw ErrorPattern.CLUSTER_NOT_FOUND.toException()
		val clusterIds: List<String> = clusters.map { it.id() }

		val res: List<Host> = conn.findAllHosts().getOrDefault(emptyList())
			.filter { clusterIds.indexOf(it.cluster().id()) > -1 }
			// 내 호스트랑 같은건 front 에서 처리
		return res.fromHostsToIdentifiedVos()
	}

	@Throws(Error::class, ItCloudException::class)
	override fun findAllMigratableHostsFromVm(vmId: String): List<IdentifiedVo> {
		log.info("findAllMigratableHostsFromVm ... vmId: {}", vmId)
		val vm: Vm? = conn.findVm(vmId).getOrNull()
		val hosts: List<Host> = conn.findAllHostsFromCluster(vm!!.cluster().id())
			.getOrDefault(listOf())
			.filter { it.id() != vm.host().id() }

		// VM이 현재 실행 중인 호스트의 네트워크 목록 (id로 set 변환)
		val myNetworks = findAllNetworksFromHost(vm.host().id())
		val myNetworkIds = myNetworks.map { it.id }.toSet()

		// 최종 결과 담을 리스트
		val migratableHosts = mutableListOf<IdentifiedVo>()

		// 각 host별로 비교
		hosts.forEach { host ->
			val hostNetworks = findAllNetworksFromHost(host.id())
			val hostNetworkIds = hostNetworks.map { it.id }.toSet()

			// myNetworkIds가 hostNetworkIds에 모두 포함되는지 확인 (subset)
			if (hostNetworkIds.containsAll(myNetworkIds)) {
				// 조건 만족시 추가
				migratableHosts.add(IdentifiedVo(host.id(), host.name()))
			}
		}

		return migratableHosts
	}

	@Throws(Error::class)
	override fun findAllNetworksFromHost(hostId: String): List<IdentifiedVo> {
		log.info("findAllNetworksFromHost ... hostId: {}", hostId)
		val res: List<Network> = conn.findAllNetworkAttachmentsFromHost(hostId, follow = "network")
			.getOrDefault(emptyList())
			.map { it.network() }
		return res.fromNetworksToIdentifiedVos()
	}

	@Throws(Error::class, ItCloudException::class)
	override fun migrate(vmId: String, vmVo: VmVo, affinityClosure: Boolean): Boolean {
		log.info("migrate ... vmId:{}, vmVo: {}, aff: {}", vmId, vmVo, affinityClosure)
		val res: Result<Boolean> = when {
			vmVo.clusterVo.id != "" && vmVo.hostVo.id == "" -> conn.migrationVm(vmId, vmVo.clusterVo.id, affinityClosure)
			vmVo.clusterVo.id == "" && vmVo.hostVo.id != "" -> conn.migrationVmToHost(vmId, vmVo.hostVo.id, affinityClosure)
			else -> throw IllegalArgumentException("Cluster 또는 Host 정보가 필요합니다.")
		}
		return res.isSuccess
	}

	@Throws(Error::class, ItCloudException::class)
	override fun exportOva(vmId: String, vmExportVo: VmExportVo): Boolean {
		log.info("exportOva ... ")
		val res: Result<Boolean> = conn.exportVm(
			vmId,
			vmExportVo.hostVo.name,
			vmExportVo.directory,
			vmExportVo.fileName
		)
		return res.isSuccess
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
