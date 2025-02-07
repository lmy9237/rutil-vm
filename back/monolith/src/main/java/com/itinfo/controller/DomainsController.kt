package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.*
import com.itinfo.service.DomainsService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.ovirt.engine.sdk4.types.StorageDomainType
import org.ovirt.engine.sdk4.types.StorageType

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("v2/storage/domains")
@Api(value="DomainsController", tags=["domains"])
class DomainsController {
	@Autowired private lateinit var domainsService: DomainsService

	@ApiOperation(httpMethod="GET", value="retrieveDomains", notes="도메인 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="status", value="도메인 상태", paramType="query", dataTypeClass=String::class),
		ApiImplicitParam(name="domainType", value="도메인 유형", paramType="query", dataTypeClass=String::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping
	@ResponseBody
	fun retrieveDomains(
		@RequestParam(name = "status") status: String,
		@RequestParam(name = "domainType") domainType: String
	): JSONObject {
		log.info("... retrieveDomains('$status', '$domainType')")
		val storageDomains: List<StorageDomainVo> =
			domainsService.retrieveStorageDomains(status, domainType)
		return asJsonResponse(storageDomains)
	}


	@ApiOperation(httpMethod="GET", value="retrieveCreateDomainInfo", notes="도메인 생성 정보 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="도메인 ID", dataType="string", paramType="query", dataTypeClass=String::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/{id}/create")
	@ResponseBody
	fun retrieveCreateDomainInfo(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... retrieveCreateDomainInfo('$id')", )
		val storageDomainCreateVo: StorageDomainCreateVo? =
			domainsService.retrieveCreateDomainInfo(id)
		return asJsonResponse(storageDomainCreateVo)
	}


	@ApiOperation(httpMethod="GET", value="retrieveDomain", notes="도메인 상세 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="도메인 ID", dataType="string", paramType="query", dataTypeClass=String::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/{id}")
	@ResponseBody
	fun retrieveDomain(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... retrieveDomain('$id')")
		val storageDomain: StorageDomainVo? =
			domainsService.retrieveStorageDomain(id)
		return asJsonResponse(storageDomain)
	}


	@ApiOperation(httpMethod="GET", value="retrieveDomainUsage", notes="도메인 상세 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="도메인 ID", dataType="string", paramType="query", dataTypeClass=String::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("{id}/usage")
	@ResponseBody
	fun retrieveDomainUsage(
		@RequestParam(name="id") id: String
	): JSONObject {
		// TODO 구현
		log.info("... retrieveDomainUsage('$id')")
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod = "GET", value="retrieveDomainEvents", notes="도메인 이벤트 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="도메인 ID", dataType="string", paramType="query", dataTypeClass=String::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/{id}/events")
	@ResponseBody
	fun retrieveDomainEvents(
		@RequestParam(name="id") id: String
	): JSONObject {
		log.info("... retrieveDomainEvents('$id')")
		val events: List<EventVo> =
			domainsService.retrieveDomainEvents(id)
		return asJsonResponse(events)
	}

	@ApiOperation(httpMethod="POST", value="createDomain", notes="도메인 생성")
	@ApiImplicitParams(
		ApiImplicitParam(name="storageDomainCreateVo", value="생성할 도메인 정보", paramType="body", dataTypeClass=StorageDomainCreateVo::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping
	@ResponseBody
	fun createDomain(
		@RequestBody storageDomainCreateVo: StorageDomainCreateVo,
	): JSONObject {
		log.info("... createDomain")
		// TODO 실행 시 결과 값 반환하도록 구현
		domainsService.createDomain(storageDomainCreateVo)
		doLongSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="PUT", value="updateDomain", notes="도메인 편집")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="도메인 ID", paramType="body", dataTypeClass=String::class),
		ApiImplicitParam(name="storageDomainCreateVo", value="편집할 도메인 정보", paramType="body", dataTypeClass=StorageDomainCreateVo::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PutMapping("/{id}")
	@ResponseBody
	fun updateDomain(
		@PathVariable(name="id") storageDomainId: String,
		@RequestBody storageDomainCreateVo: StorageDomainCreateVo
	): JSONObject {
		log.info("... updateDomain")
		// TODO 실행 시 결과 값 반환하도록 구현
		storageDomainCreateVo.id = storageDomainId
		domainsService.updateDomain(storageDomainCreateVo)
		doLongSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="POST", value="removeDomain", notes="도메인 제거")
	@ApiImplicitParams(
		ApiImplicitParam(name="storageDomainVo", value="제거할 도메인 정보", required=true, paramType="body", dataTypeClass=StorageDomainCreateVo::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@DeleteMapping("/{id}")
	@ResponseBody
	fun removeDomain(
		@RequestBody storageDomainVo: StorageDomainVo
	): JSONObject {
		log.info("... removeDomain")
		// TODO 실행 시 결과 값 반환하도록 구현
		domainsService.removeDomain(storageDomainVo)
		doLongSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="POST", value="maintenanceStart", notes="유지보수 모드 시작")
	@ApiImplicitParams(
		ApiImplicitParam(name="domains", value="도메인", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/maintenanceStart")
	@ResponseBody
	fun maintenanceStart(
		@RequestBody domains: List<String>,
	): JSONObject {
		log.info("... maintenanceStart")
		// TODO 실행 시 결과 값 반환하도록 구현
		domainsService.maintenanceStart(domains)
		doSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="POST", value="maintenanceStop", notes="활성화 모드 시작")
	@ApiImplicitParams(
		ApiImplicitParam(name="domains", value="도메인", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/maintenanceStop")
	@ResponseBody
	fun maintenanceStop(
		@RequestBody domains: List<String>
	): JSONObject {
		log.info("... maintenanceStop")
		// TODO 실행 시 결과 값 반환하도록 구현
		domainsService.maintenanceStop(domains)
		doSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="POST", value="iscsiDiscover", notes="ISCSI 찾기")
	@ApiImplicitParams(
		ApiImplicitParam(name="storageDomainCreateVo", value="생성할 도메인 정보", required=true, paramType="body", dataTypeClass=StorageDomainCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/iscsiDiscover")
	@ResponseBody
	fun iscsiDiscover(
		@RequestBody storageDomainCreateVo: StorageDomainCreateVo
	): JSONObject {
		log.info("... iscsiDiscover")
		val iscsis: List<String>
				= domainsService.iscsiDiscover(storageDomainCreateVo)
		return asJsonResponse(iscsis)
	}

	@ApiOperation(httpMethod="POST", value="iscsiLogin", notes="ISCSI 로그인")
	@ApiImplicitParams(
		ApiImplicitParam(name="storageDomainCreateVo", value="생성할 도메인 정보", required=true, paramType="body", dataTypeClass=StorageDomainCreateVo::class),
	)
	@ApiResponses(
		ApiResponse(code = 200, message="OK")
	)
	@PostMapping("/iscsiLogin")
	@ResponseBody
	fun iscsiLogin(
		@RequestBody storageDomainCreateVo: StorageDomainCreateVo
	): JSONObject {
		log.info("... iscsiLogin")
		val isSuccess: Boolean =
			domainsService.iscsiLogin(storageDomainCreateVo)
		return asJsonResponse(isSuccess)
	}

	@ApiOperation(httpMethod="GET", value="retrieveHosts", notes="호스트 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveHosts")
	@ResponseBody
	fun retrieveHosts(): JSONObject {
		log.info("... retrieveHosts")
		val hosts: List<HostDetailVo> =
			domainsService.retrieveHosts()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = hosts
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveDomainMeta", notes="도메인 메타정보 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveDomainMeta")
	@ResponseBody
	fun retrieveDomainMeta(): JSONObject {
		log.info("... retrieveDomainMeta")
		val domains = domainsService.retrieveStorageDomains("all", "all")
		val isExistIso: Boolean =
			domains.any {
				StorageDomainType.ISO.value().equals(it.type, ignoreCase = true)
			}
		return JSONObject().apply {
			this["domainTypeList"] = StorageDomainType.values()
			this["storageTypeList"] = StorageType.values()
			this["isExistIso"] = isExistIso
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}