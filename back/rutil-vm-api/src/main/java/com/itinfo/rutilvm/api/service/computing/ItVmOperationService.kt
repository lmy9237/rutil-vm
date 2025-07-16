package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.VmExportVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.computing.toStartOnceVm
import com.itinfo.rutilvm.api.model.computing.toVmVo
import com.itinfo.rutilvm.api.model.fromHostsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromNetworksToIdentifiedVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.service.setting.ItSystemPropertiesService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.model.SystemPropertiesVo
import com.itinfo.rutilvm.util.ovirt.detachVm
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException
import com.itinfo.rutilvm.util.ovirt.exportVm
import com.itinfo.rutilvm.util.ovirt.findAllHosts
import com.itinfo.rutilvm.util.ovirt.findAllHostsFromCluster
import com.itinfo.rutilvm.util.ovirt.findAllNetworkAttachmentsFromHost
import com.itinfo.rutilvm.util.ovirt.findAllVms
import com.itinfo.rutilvm.util.ovirt.findVm
import com.itinfo.rutilvm.util.ovirt.isHostedEngineVm
import com.itinfo.rutilvm.util.ovirt.migrationVm
import com.itinfo.rutilvm.util.ovirt.migrationVmToHost
import com.itinfo.rutilvm.util.ovirt.qualified4ConsoleConnect
import com.itinfo.rutilvm.util.ovirt.rebootVm
import com.itinfo.rutilvm.util.ovirt.resetVm
import com.itinfo.rutilvm.util.ovirt.shutdownVm
import com.itinfo.rutilvm.util.ovirt.startOnceVm
import com.itinfo.rutilvm.util.ovirt.startVm
import com.itinfo.rutilvm.util.ovirt.stopVm
import com.itinfo.rutilvm.util.ovirt.suspendVm
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmStatus
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import java.util.*

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
	 * [ItVmOperationService.startOnce]
	 * 가상머신 - 한번 실행
	 *
	 * @param vmVo [VmVo]
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun startOnce(vmVo: VmVo): Boolean
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
	 * [ItVmOperationService.detach]
	 * 가상머신 - detach
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class, ItCloudException::class)
	fun detach(vmId: String): Boolean

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

	/**
	 * [ItVmOperationService.takeScreenshotFromVm]
	 * 가상머신화면 스크린샷
	 *
	 * @param vmId [String]
	 *
	 * @return [String] 바이너리화 된 png 이미지 정보
	 */
	@Throws(Error::class, IllegalStateException::class, ItCloudException::class)
	fun takeScreenshotFromVm(vmId: String): String
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
	override fun startOnce(vmVo: VmVo): Boolean {
		log.info("startOnce ... vm: {}", vmVo)
		val res: Result<Boolean> = conn.startOnceVm(
			vmVo.toStartOnceVm(),
			vmVo.windowGuestTool
		)
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
	override fun detach(vmId: String): Boolean {
		log.info("detach ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.detachVm(vmId)
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
		log.info("exportOva ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.exportVm(
			vmId,
			vmExportVo.hostVo.name,
			vmExportVo.directory,
			vmExportVo.fileName
		)
		return res.isSuccess
	}

	@Autowired private lateinit var iSystemProperties: ItSystemPropertiesService
	@Autowired private lateinit var restTemplate: RestTemplate

	@Throws(Error::class, IllegalStateException::class, ItCloudException::class)
	override fun takeScreenshotFromVm(vmId: String): String {
		log.info("takeScreenshotFromVm ... vmId: {}", vmId)
		val vm: Vm = conn.findVm(vmId).getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		if (vm.isHostedEngineVm) { /* hostedEngine에 대해서는 이미지를 API에서 제공안함 */
			log.warn("takeScreenshotFromVm ... vmId: {}\n\nREASON: VM screenshot is NOT available for HostedEngine VM!\n", vmId)
			return ""
		}

		if (vm.statusPresent() && !vm.qualified4ConsoleConnect) {
			log.warn("takeScreenshotFromVm ... vmId: {}\n\nVM screenshot is NOT available at this status!\n", vmId)
			return ""
		}

		val sysProp: SystemPropertiesVo = iSystemProperties.findOne()
		val baseUrl: String = sysProp.ovirtEngineApiUrl
		val screenshotApiUrl = "$baseUrl/vms/${vmId}/screenshot"
		val requestBody = "<action/>"
		val headers = HttpHeaders().apply {
			// The most important part: Add the authentication cookie.
			setBasicAuth(sysProp.ovirtUserId, sysProp.password)
			// Tell the server we can accept any image format.
			contentType = MediaType.APPLICATION_XML
			accept = listOf(MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG, MediaType.ALL)
		}
		val httpEntity = HttpEntity<String>(requestBody, headers).apply {}

		// RestTemplate 객체 생성
		val response: ResponseEntity<ByteArray> = try {
			restTemplate.postForEntity(
				screenshotApiUrl,
				httpEntity,
				ByteArray::class.java
			)
		} catch (e: RestClientException) {
			log.error("something went wrong ... reason: {}", e.localizedMessage)
			throw e
		}
		val imageBytes: ByteArray = response.body
			?: throw IllegalStateException("Response body was null")
		val contentType: String = response.headers.contentType?.toString()
			?: "image/png" // Default if not provided

		// 7. Encode the raw bytes into a Base64 string.
		val base64EncodedData = Base64.getEncoder().encodeToString(imageBytes)

		// 8. Construct and return the final data URI string.
		return "data:image/png;base64,$base64EncodedData"
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
