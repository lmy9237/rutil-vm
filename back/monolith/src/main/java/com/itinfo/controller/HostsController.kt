package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.*
import com.itinfo.model.karajan.ConsolidationVo
import com.itinfo.model.karajan.HostVo
import com.itinfo.service.ClustersService
import com.itinfo.service.HostsService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("compute/hosts")
@Api(value="HostsController", tags=["hosts"])
class HostsController {
	@Autowired private lateinit var hostsService: HostsService
	@Autowired private lateinit var clustersService: ClustersService


	@ApiOperation(httpMethod="GET", value="retrieveCreateClusterInfo", notes="호스트 생성정보 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="호스트 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveCreateHostInfo")
	@ResponseBody
	fun retrieveCreateClusterInfo(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... retrieveCreateClusterInfo('$id')")
		val hostCreateVo: HostCreateVo =
			hostsService.retrieveCreateHostInfo(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = hostCreateVo
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveHostsInfo", notes="호스트 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="status", value="호스트 상태", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK"),
	)
	@GetMapping("/retrieveHostsInfo")
	@ResponseBody
	fun retrieveHostsInfo(
		@RequestParam(name="status") status: String
	): JSONObject {
		log.info("... retrieveHostsInfo('$status')")
		val hosts: List<HostDetailVo> =
			hostsService.retrieveHostsInfo(status)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = hosts
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveLunHostsInfo", notes="LUN 호스트 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="status", value="호스트 상태", paramType="query", dataTypeClass=String::class),
	)
	@ApiResponses(value=[
		ApiResponse(code=200, message="OK")
	])
	@GetMapping("/retrieveLunHostsInfo")
	@ResponseBody
	fun retrieveLunHostsInfo(
		@RequestParam(name="status") status: String
	): JSONObject {
		log.info("... retrieveLunHostsInfo('{}')", status)
		val hosts: List<HostDetailVo> =
			hostsService.retrieveLunHostsInfo(status)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = hosts
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveHostDetail", notes="호스트 상세 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="호스트 ID", required=true, dataType="string", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveHostDetail")
	@ResponseBody
	fun retrieveHostDetail(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... retrieveHostDetail('$id')")
		val hostDetailVo: HostDetailVo =
			hostsService.retrieveHostDetail(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = hostDetailVo
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveHostEvents", notes="호스트 이벤트 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="호스트 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveHostEvents")
	@ResponseBody
	fun retrieveHostEvents(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... retrieveHostEvents('$id')")
		val events: List<EventVo> =
			hostsService.retrieveHostEvents(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = events
		}
	}

	@ApiOperation(httpMethod="POST", value="consolidateVms", notes="???")
	@ApiImplicitParams(
		ApiImplicitParam(name="hosts", value="호스트", required=true,  paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/consolidateVms")
	@ResponseBody
	fun consolidateVms(
		@RequestBody hosts: List<String>
	): JSONObject {
		log.info("... consolidateVms[${hosts.size}]")
		val result: List<ConsolidationVo> =
			hostsService.maintenanceBeforeConsolidateVms(hosts)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}

	@ApiOperation(httpMethod="POST", value="maintenanceStart", notes="유지보수 모드 시작")
	@ApiImplicitParams(
		ApiImplicitParam(name="hosts", value="호스트", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/maintenanceStart")
	@ResponseBody
	fun maintenanceStart(
		@RequestBody hosts: List<String>)
	: JSONObject {
		log.info("... maintenanceStart[${hosts.size}]")
		hostsService.maintenanceStart(hosts)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="maintenanceStop", notes="활성 모드 시작")
	@ApiImplicitParams(
		ApiImplicitParam(name="hosts", value="호스트", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/maintenanceStop")
	@ResponseBody
	fun maintenanceStop(
		@RequestBody hosts: List<String>
	): JSONObject {
		log.info("... maintenanceStop[${hosts.size}]")
		hostsService.maintenanceStop(hosts)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="restartHost", notes="호스트 재시작")
	@ApiImplicitParams(
		ApiImplicitParam(name="hosts", value="재시작할 호스트", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/restartHost")
	@ResponseBody
	fun restartHost(
		@RequestBody hosts: List<String>
	): JSONObject {
		log.info("... restartHost[${hosts.size}]")
		hostsService.restartHost(hosts)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="startHost", notes="호스트 시작")
	@ApiImplicitParams(
		ApiImplicitParam(name="hosts", value="시작할 호스트", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/startHost")
	@ResponseBody
	fun startHost(
		@RequestBody hosts: List<String>,
	): JSONObject {
		log.info("... startHost[${hosts.size}]")
		hostsService.startHost(hosts)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="stopHost", notes="호스트 정지")
	@ApiImplicitParams(
		ApiImplicitParam(name="hosts", value="정지할 호스트", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/stopHost")
	@ResponseBody
	fun stopHost(@RequestBody hosts: List<String>): JSONObject {
		log.info("... stopHost[${hosts.size}]")
		hostsService.stopHost(hosts)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="createHost", notes="호스트 생성")
	@ApiImplicitParams(
		ApiImplicitParam(name="hostCreateVo", value="생성할 호스트 정보", required=true, paramType="body", dataTypeClass=HostCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/createHost")
	@ResponseBody
	fun createHost(
		@RequestBody hostCreateVo: HostCreateVo
	): JSONObject {
		log.info("... createHost")
		hostsService.createHost(hostCreateVo)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="updateHost", notes="호스트 갱신")
	@ApiImplicitParams(
		ApiImplicitParam(name="hostCreateVo", value="갱신할 호스트 정보", required=true, paramType="body", dataTypeClass=HostCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/updateHost")
	@ResponseBody
	fun updateHost(
		@RequestBody hostCreateVo: HostCreateVo
	): JSONObject {
		log.info("... updateHost")
		hostsService.updateHost(hostCreateVo)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="removeHost", notes="호스트 제거")
	@ApiImplicitParams(
		ApiImplicitParam(name="hosts", value="제거할 호스트", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/removeHost")
	@ResponseBody
	fun removeHost(
		@RequestBody hosts: List<String>
	): JSONObject {
		log.info("... removeHost[${hosts.size}]")
		hostsService.removeHost(hosts)
		doSleep()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveClusters", notes="클러스터 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveClusters")
	@ResponseBody
	fun retrieveClusters(): JSONObject {
		log.info("... retrieveClusters")
		val clusters: List<ClusterVo> =
			clustersService.retrieveClusters()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = clusters
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveFenceAgentType", notes="펜스 에이전트 유형 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveFanceAgentType")
	@ResponseBody
	fun retrieveFenceAgentType(): JSONObject {
		log.info("... retrieveClusters")
		val fenceAgentTypes: List<String> =
			hostsService.retrieveFanceAgentType()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = fenceAgentTypes
		}
	}

	@ApiOperation(httpMethod="POST", value="connectTestFenceAgent", notes="테스트용 펜스 에이전트 연결")
	@ApiImplicitParams(
		ApiImplicitParam(name="fenceAgentVo", value="연결대상 펜스 에이전트", required=true, paramType="body", dataTypeClass=FenceAgentVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/connectTestFenceAgent")
	@ResponseBody
	fun connectTestFenceAgent(
		@RequestBody fenceAgentVo: FenceAgentVo
	): JSONObject {
		log.info("... connectTestFenceAgent")
		hostsService.connectTestFenceAgent(fenceAgentVo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="shutdownHost", notes="호스트 종료")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="종료할 호스트 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/shutdownHost")
	@ResponseBody
	fun shutdownHost(
		@RequestParam("id") id: String
	): JSONObject {
		log.info("... shutdownHost('$id')")
		val host = HostVo()
		host.id = id
		val hosts: MutableList<HostVo> = arrayListOf(host)
		hostsService.shutdownHost(hosts)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="setupHostNetwork", notes="호스트 네트워크 구성")
	@ApiImplicitParams(
		ApiImplicitParam(name="nicUsageApiVoList", value="???", required=true, paramType="body", dataTypeClass=Array<NicUsageApiVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/setupHostNetwork")
	@ResponseBody
	fun setupHostNetwork(
		@RequestBody nicUsageApiVoList: List<NicUsageApiVo>
	): JSONObject {
		log.info("... setupHostNetwork")
		hostsService.setupHostNetwork(nicUsageApiVoList)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="modifyNicNetwork", notes="??? 편집")
	@ApiImplicitParams(
		ApiImplicitParam(name="nicUsageApiVoList", value="편집할 ???", required=true, paramType="body", dataTypeClass=Array<NetworkAttachmentVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/modifyNicNetwork")
	@ResponseBody
	fun modifyNicNetwork(
		@RequestBody networkAttachmentVo: NetworkAttachmentVo
	): JSONObject {
		log.info("... modifyNicNetwork")
		hostsService.modifyNicNetwork(networkAttachmentVo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
