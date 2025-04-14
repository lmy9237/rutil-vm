package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.model.network.NetworkVo
import com.itinfo.rutilvm.api.model.network.VnicProfileVo
import com.itinfo.rutilvm.api.service.computing.ItClusterService

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Computing", "Cluster"])
@RequestMapping("/api/v1/computing/clusters")
class ClusterController: BaseController() {
	@Autowired private lateinit var iCluster: ItClusterService

	@ApiOperation(
		httpMethod="GET",
		value="클러스터 목록 조회",
		notes="전체 클러스터 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun clusters(): ResponseEntity<List<ClusterVo>> {
		log.info("/computing/clusters ... 클러스터 목록")
		return ResponseEntity.ok(iCluster.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="클러스터 목록 조회(데이터센터 up)",
		notes="전체 클러스터 목록을 조회한다(데이터센터가 up상태만)"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/up")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun clustersUp(): ResponseEntity<List<ClusterVo>> {
		log.info("/computing/clusters/up ... 클러스터(up) 목록")
		return ResponseEntity.ok(iCluster.findAllUp())
	}

	@ApiOperation(
		httpMethod="GET",
		value="클러스터 정보 상세조회",
		notes="선택된 클러스터의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun cluster(
		@PathVariable(required = true) clusterId: String
	): ResponseEntity<ClusterVo?> {
		log.info("/computing/clusters/{} ... 클러스터 상세정보", clusterId)
		return ResponseEntity.ok(iCluster.findOne(clusterId))
	}


	@ApiOperation(
		httpMethod="POST",
		value="클러스터 생성",
		notes="클러스터를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="cluster", value="클러스터", dataTypeClass=ClusterVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun add(
		@RequestBody cluster: ClusterVo? = null
	): ResponseEntity<ClusterVo?> {
		if (cluster == null)
			throw ErrorPattern.CLUSTER_VO_INVALID.toException()
		log.info("/computing/clusters ... 클러스터 생성\n{}", cluster)
		return ResponseEntity.ok(iCluster.add(cluster))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="클러스터 편집",
		notes="클러스터를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="cluster", value="클러스터", dataTypeClass=ClusterVo::class, paramType="body")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{clusterId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun update(
		@PathVariable clusterId: String? = null,
		@RequestBody cluster: ClusterVo? = null,
	): ResponseEntity<ClusterVo?> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		if (cluster == null)
			throw ErrorPattern.CLUSTER_VO_INVALID.toException()
		log.info("/computing/clusters/{} ... 클러스터 편집\n{}", clusterId, cluster)
		return ResponseEntity.ok(iCluster.update(cluster))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="클러스터 삭제",
		notes="클러스터를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{clusterId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable clusterId: String? = null,
	): ResponseEntity<Boolean> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{} ... 클러스터 삭제", clusterId)
		return ResponseEntity.ok(iCluster.remove(clusterId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="호스트 목록",
		notes="선택된 클러스터의 호스트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/hosts")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun hosts(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<HostVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/hosts ... 클러스터 내 호스트 목록", clusterId)
		return ResponseEntity.ok(iCluster.findAllHostsFromCluster(clusterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 목록조회",
		notes="선택된 클러스터의 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/vms")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vms(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<VmViewVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/vms ... 클러스터 가상머신 목록", clusterId)
		return ResponseEntity.ok(iCluster.findAllVmsFromCluster(clusterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="네트워크 목록조회",
		notes="선택된 클러스터의 네트워크 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/networks")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun networks(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<NetworkVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/networks ... 클러스터 네트워크 목록", clusterId)
		return ResponseEntity.ok(iCluster.findAllNetworksFromCluster(clusterId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="네트워크 생성",
		notes="선택된 클러스터의 네트워크를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="network", value="네트워크", dataTypeClass=NetworkVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{clusterId}/networks")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun addNetwork(
		@PathVariable clusterId: String? = null,
		@RequestBody network: NetworkVo? = null
	): ResponseEntity<NetworkVo?> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		if (network == null)
			throw ErrorPattern.CLUSTER_VO_INVALID.toException()
		log.info("/computing/clusters/{}/networks ... 클러스터 네트워크 생성\n{}", clusterId, network)
		return ResponseEntity.ok(iCluster.addNetworkFromCluster(clusterId, network))
	}

	@ApiOperation(
		httpMethod="GET",
		value="네트워크 관리 목록",
		notes="선택된 클러스터의 네트워크 관리 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/manageNetworks")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun manageNetworks(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<NetworkVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/manageNetworks ... 클러스터 내 네트워크 관리 목록", clusterId)
		return ResponseEntity.ok(iCluster.findAllManageNetworksFromCluster(clusterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="vnicProfile 목록조회",
		notes="선택된 클러스터의 vnicProfile 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/vnicProfiles")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vnicProfiles(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<VnicProfileVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/vnicProfiles ... 클러스터 vnicProfile 목록", clusterId)
		return ResponseEntity.ok(iCluster.findAllVnicProfilesFromCluster(clusterId))
	}

	// manageNetworksFromCluster
//	@ApiOperation(
//		httpMethod="POST",
//		value="네트워크 관리 기능",
//		notes="네트워크 관리기능을 변경한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 200, message = "OK")
//	)
//	@PostMapping("/{clusterId}/networks/manageNetworks")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.OK)
//	fun manageNetworks(
//		@RequestBody clusterId: String? = null
//	): ResponseEntity<Boolean?> {
//		if (clusterId.isNullOrEmpty())
//			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
//		log.info("/computing/clusters/{}/networks/manageNetworks ... 클러스터 생성\n{}", clusterId, network())
//		return ResponseEntity.ok(iCluster.manageNetworksFromCluster(clusterId, networkVos = ))
//	}


	@ApiOperation(
		httpMethod="GET",
		value="이벤트 목록",
		notes="선택된 클러스터의 이벤트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/events")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun events(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<EventVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/events ... 클러스터 이벤트", clusterId)
		return ResponseEntity.ok(iCluster.findAllEventsFromCluster(clusterId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="가상머신 생성창 - 운영시스템 목록",
		notes="선택된 클러스터의 운영시스템 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/osSystems")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun osSystem(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<OsVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/osSystems ... 클러스터 운영시스템 목록", clusterId)
		return ResponseEntity.ok(iCluster.findAllOsSystemFromCluster(clusterId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="가상머신 생성창 - Cpu Profile 목록",
		notes="선택된 클러스터의 Cpu Profile 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterId", value="클러스터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{clusterId}/cpuProfiles")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun cpuProfiles(
		@PathVariable clusterId: String? = null
	): ResponseEntity<List<CpuProfileVo>> {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("/computing/clusters/{}/cpuProfiles ... 클러스터 Cpu Profile 목록", clusterId)
		return ResponseEntity.ok(iCluster.findAllCpuProfilesFromCluster(clusterId))
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
