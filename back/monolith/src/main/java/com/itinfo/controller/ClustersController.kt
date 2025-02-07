package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.ClusterCreateVo
import com.itinfo.model.NetworkProviderVo
import com.itinfo.model.NetworkVo
import com.itinfo.service.ClustersService
import com.itinfo.service.engine.WebsocketService

import io.swagger.annotations.*
import org.apache.ibatis.annotations.Delete

import org.json.simple.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("v2")
@Api(value="ClustersController", tags=["clusters"])
class ClustersController {
	@Autowired private lateinit var clustersService: ClustersService
	@Autowired private lateinit var websocketService: WebsocketService


	@ApiOperation(httpMethod="GET", value="fetchClusters", notes="클러스터 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/clusters")
	@ResponseBody
	fun fetchClusters(): JSONObject {
		log.info("... fetchClusters")
		val clusters =
			clustersService.retrieveClusters()
		return JSONObject().apply { 
			this[ItInfoConstant.RESULT_KEY] = clusters
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveClusterDetail", notes="클러스터 상세 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="클러스터 ID", required=true, paramType="path", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping(value=["/{id}"])
	@ResponseBody
	fun retrieveClusterDetail(
		@PathVariable(name = "id") id: String
	): JSONObject {
		log.info("... retrieveClusterDetail('$id')")
		val cluster =
			clustersService.retrieveCluster(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY]=cluster
		}
	}

	@ApiOperation(httpMethod="POST", value="createCluster", notes="클러스터 생성")
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterCreateVo", value="생성 할 클러스터 정보", paramType="body", dataTypeClass=ClusterCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/clusters")
	@ResponseBody
	fun createCluster(
		@RequestBody clusterCreateVo: ClusterCreateVo
	): JSONObject {
		log.info("... createCluster")
		clustersService.createCluster(clusterCreateVo)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="PUT", value="updateCluster", notes="클러스터 갱신")
	@ApiImplicitParams(
		ApiImplicitParam(name="clusterCreateVo", value="갱신 할 클러스터 정보", paramType="body", dataTypeClass=ClusterCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PutMapping("/clusters/{id}")
	@ResponseBody
	fun updateCluster(
		@RequestBody clusterCreateVo: ClusterCreateVo,
		@PathVariable(name="id") clusterId: String
	): JSONObject {
		log.info("... updateCluster")
		clusterCreateVo.id = clusterId
		clustersService.updateCluster(clusterCreateVo)
		doSleep()
		// TODO: 성공여부 값 처리 필요
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="DELETE", value="removeCluster", notes="클러스터 제거")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="제거 할 클러스터 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@DeleteMapping("/clusters/{id}") // TODO: POST로 변경 필요
	@ResponseBody
	fun removeCluster(
		@PathVariable(name="id") clusterId: String
	): JSONObject {
		log.info("... removeCluster('$clusterId')")
		clustersService.removeCluster(clusterId)
		doSleep()
		// TODO: 성공여부 값 처리 필요
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveCreateClusterInfo", notes="생성할 클러스터 상세정보 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="생성할 클러스터 id", dataType="string", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/clusters/{id}/create")
	@ResponseBody
	fun retrieveCreateClusterInfo(
		@PathVariable(name="id") id: String
	): JSONObject {
		log.info("... retrieveCreateClusterInfo('$id')")
		val clusterCreateVo: ClusterCreateVo =
			clustersService.retrieveCreateClusterInfo(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = clusterCreateVo
		}
	}

	@ApiOperation(httpMethod = "GET", value="retrieveNetworks", notes="네트워크 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/clusters/networks")
	@ResponseBody
	fun retrieveNetworks(): JSONObject {
		log.info("... retrieveNetworks")
		val networks: List<NetworkVo> = 
			clustersService.retrieveNetworks()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = networks
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveNetworkProviders", notes="네트워크 제공자 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/clusters/networkProviders")
	@ResponseBody
	fun retrieveNetworkProviders(): JSONObject {
		log.info("... retrieveNetworkProviders")
		val networkProviders: List<NetworkProviderVo> =
			clustersService.retrieveNetworkProviders()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = networkProviders
		}
	}

	@ApiOperation(httpMethod="GET", value="testWebsocket", notes="웹소켓 테스트")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="?", dataType="string", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/clusters/websocket")
	@ResponseBody
	fun testWebsocket(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... testWebsocket('$id')")
		websocketService.sendMessage("/topic/test", "hello world")
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}