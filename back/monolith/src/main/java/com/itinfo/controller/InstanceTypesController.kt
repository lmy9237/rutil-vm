package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.InstanceTypeVo
import com.itinfo.service.InstanceTypesService

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

/**
 * [InstanceTypesController]
 * 인스턴스 유형
 *
 * @author chlee
 * @since 2023.12.24
 */
@RestController
@RequestMapping("admin")
@Api(value="InstanceTypesController", tags=["instance-type"])
class InstanceTypesController {
	@Autowired private lateinit var instanceTypesService: InstanceTypesService

	@ApiOperation(httpMethod="GET", value="retrieveInstanceTypes", notes="인스턴스 유형 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveInstanceTypes")
	@ResponseBody
	fun retrieveInstanceTypes(): JSONObject {
		log.info("... retrieveInstanceTypes")
		val instanceTypes: List<InstanceTypeVo> =
			instanceTypesService.retrieveInstanceTypes()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = instanceTypes
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveInstanceTypeCreateInfo", notes="인스턴스 유형 생성 정보 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveInstanceTypeCreateInfo")
	@ResponseBody
	fun retrieveInstanceTypeCreateInfo(): JSONObject {
		log.info("... retrieveInstanceTypeCreateInfo")
		val instanceType: InstanceTypeVo =
			instanceTypesService.retrieveInstanceTypeCreateInfo()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = instanceType
		}
	}

	@ApiOperation(httpMethod="POST", value="createInstanceType", notes="인스턴스 유형 생성")
	@ApiImplicitParams(
		ApiImplicitParam(name="instanceType", value="생성할 인스턴스 유형", paramType="body", dataTypeClass=InstanceTypeVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("instanceType/createInstanceType")
	@ResponseBody
	fun createInstanceType(
		@RequestBody instanceType: InstanceTypeVo
	): JSONObject {
		log.info("... createInstanceType")
		val instanceTypeId: String =
			instanceTypesService.createInstanceType(instanceType)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = instanceTypeId
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveInstanceTypeUpdateInfo", notes="인스턴스 유형 갱신 정보 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="갱신할 인스턴스 유형 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("retrieveInstanceTypeUpdateInfo")
	@ResponseBody
	fun retrieveInstanceTypeUpdateInfo(
		@RequestParam(name = "id") id: String
	): JSONObject {
		log.info("... retrieveInstanceTypeUpdateInfo('$id')")
		val instanceType: InstanceTypeVo =
			instanceTypesService.retrieveInstanceTypeUpdateInfo(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = instanceType
		}
	}

	@ApiOperation(httpMethod="POST", value="updateInstanceType", notes="인스턴스 유형 갱신")
	@ApiImplicitParams(
		ApiImplicitParam(name="instanceType", value="갱신할 인스턴스 유형", paramType="body", dataTypeClass=InstanceTypeVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("instanceType/updateInstanceType")
	@ResponseBody
	fun updateInstanceType(
		@RequestBody instanceType: InstanceTypeVo
	): JSONObject {
		log.info("... updateInstanceType")
		val instanceTypeId: String =
			instanceTypesService.updateInstanceType(instanceType)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = instanceTypeId
		}
	}

	@ApiOperation(httpMethod="POST", value="removeInstanceType", notes="인스턴스 유형 제거")
	@ApiImplicitParams(
		ApiImplicitParam(name="instanceType", value="제거할 인스턴스 유형", paramType="body", dataTypeClass=InstanceTypeVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("instanceType/removeInstanceType")
	@ResponseBody
	fun removeInstanceType(
		@RequestBody instanceType: InstanceTypeVo
	): JSONObject {
		log.info("... removeInstanceType")
		val result: String =
			instanceTypesService.removeInstanceType(instanceType)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}