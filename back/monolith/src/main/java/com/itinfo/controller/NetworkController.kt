package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.ItInfoNetworkClusterVo
import com.itinfo.model.ItInfoNetworkCreateVo
import com.itinfo.model.ItInfoNetworkGroupVo
import com.itinfo.model.ItInfoNetworkVo
import com.itinfo.service.ItInfoNetworkService

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
@RequestMapping("network")
@Api(value="NetworkController", tags=["network"])
class NetworkController {
	@Autowired private lateinit var networkService: ItInfoNetworkService

	@ApiOperation(httpMethod="GET", value="retrieveNetworkList", notes="네트워크 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/getNetworkList")
	@ResponseBody
	fun retrieveNetworkList(): JSONObject {
		log.info("... getNetworkList")
		val list: List<ItInfoNetworkVo> =
			networkService.getNetworkList()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = list
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveHostNetworkList", notes="호스트 네트워크 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="네트워크 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/getHostNetworkList")
	@ResponseBody
	fun retrieveHostNetworkList(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveHostNetworkList('$id')")
		val networkList = networkService.getHostNetworkList(id)
		return JSONObject().apply {
			this["list"] = networkList
		}
	}

	@ApiOperation(httpMethod="POST", value="retrieveNetworkClusters", notes="네트워크 클러스터 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="itinfoNetworkVo", value="네트워크 정보",  paramType="body", dataTypeClass=ItInfoNetworkVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/clusters")
	@ResponseBody
	fun retrieveNetworkClusters(
		@RequestBody itinfoNetworkVo: ItInfoNetworkVo,
	): JSONObject {
		log.info("... networkClusters")
		val clusters: List<ItInfoNetworkClusterVo> =
			networkService.getNetworkCluster("", itinfoNetworkVo.id)
		return JSONObject().apply {
			this["clusters"] = clusters
		}
	}

	@ApiOperation(httpMethod="POST", value="retrieveNetworkClusters", notes="네트워크 클러스터 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="itinfoNetworkVo", value="네트워크 정보", paramType="body", dataTypeClass=ItInfoNetworkVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/getNetworkDetail")
	@ResponseBody
	fun retrieveNetworkDetail(
		@RequestBody itInfoNetworkVo: ItInfoNetworkVo,
	): JSONObject {
		log.info("... networkDeatil")
		val resultVo: ItInfoNetworkGroupVo =
			networkService.getNetworkDetail(itInfoNetworkVo)
		return JSONObject().apply {
			this["resultData"] = resultVo
		}
	}

	@ApiOperation(httpMethod="POST", value="createNetworkResource", notes="네트워크 생성")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/createNetworkDeatil")
	@ResponseBody
	fun createNetworkResource(): JSONObject {
		log.info("... networkCreateResource")
		val ItInfoNetworkCreateVo: ItInfoNetworkCreateVo =
			networkService.getNetworkCreateResource()
		return JSONObject().apply {
			this["resultData"] = ItInfoNetworkCreateVo
		}
	}

	@ApiOperation(httpMethod="POST", value="addNetwork", notes="네트워크 추가")
	@ApiImplicitParams(
		ApiImplicitParam(name="itinfoNetworkVo", value="네트워크 정보", paramType="body", dataTypeClass=ItInfoNetworkVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/addNetwork")
	@ResponseBody
	fun addNetwork(
		@RequestBody ItInfoNetworkVo: ItInfoNetworkVo,
	): JSONObject {
		log.info("... addNetwork")
		// TODO
		networkService.addLogicalNetwork(ItInfoNetworkVo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="deleteNetwork", notes="네트워크 제거")
	@ApiImplicitParams(
		ApiImplicitParam(name="itinfoNetworkVo", value="네트워크 정보", paramType="body", dataTypeClass=ItInfoNetworkVo::class)
	)
		@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/deleteNetwork")
	@ResponseBody
	@Throws(Exception::class)
	fun deleteNetwork(
		@RequestBody ItInfoNetworkVos: List<ItInfoNetworkVo>,
	): JSONObject {
		log.info("... deleteNetwork")
		// TODO
		networkService.deleteNetworks(ItInfoNetworkVos)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="updateNetwork", notes="네트워크 편집")
	@ApiImplicitParams(
		ApiImplicitParam(name="itinfoNetworkVo", value="네트워크 정보", paramType="body", dataTypeClass=ItInfoNetworkVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/modifiedNetwork")
	@ResponseBody
	fun updateNetwork(
		@RequestBody itInfoNetworkVo: ItInfoNetworkVo,
	): JSONObject {
		log.info("... updateNetwork")
		// TODO
		networkService.updateNetwork(itInfoNetworkVo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}