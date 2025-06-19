package com.itinfo.rutilvm.api.controller.common

import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.service.common.TypeVo
import com.itinfo.rutilvm.api.service.common.ItTypeService
import com.itinfo.rutilvm.common.LoggerDelegate
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus

@Controller
@Api(tags = ["Type"])
@RequestMapping("/api/v1/types/")
class TypeController: BaseController(){
	@Autowired private lateinit var iType: ItTypeService

	@ApiOperation(
		httpMethod="GET",
		value="이벤트 심각도 유형 목록 조회",
		notes="이벤트 심각도 유형 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("auditLogSeverity")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allAuditLogSeverities(): ResponseEntity<List<TypeVo>> {
		log.info("/types/auditLogSeverity ... 이벤트 심각도 유형 목록")
		return ResponseEntity.ok(iType.findAllAuditLogSeverities())
	}
	@ApiOperation(
		httpMethod="GET",
		value="BIOS 유형 (a.k.a. 칩셋옵션) 목록 조회",
		notes="BIOS 유형 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("bios")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allBiosTypes(): ResponseEntity<List<TypeVo>> {
		log.info("/types/bios ... BIOS 유형 (a.k.a. 칩셋옵션) 목록")
		return ResponseEntity.ok(iType.findAllBiosTypes())
	}

	@ApiOperation(
		httpMethod="GET",
		value="디스크 유형 목록 조회",
		notes="디스크 유형 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("diskContentType")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allDiskContentTypes(): ResponseEntity<List<TypeVo>> {
		log.info("/types/diskContentType ... 디스크 유형 목록")
		return ResponseEntity.ok(iType.findAllDiskContentTypes())
	}

	@ApiOperation(
		httpMethod="GET",
		value="(클러스터) FIPS 유형 목록 조회",
		notes="(클러스터) FIPS 유형 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("fipsMode")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allFipsModes(): ResponseEntity<List<TypeVo>> {
		log.info("/types/fipsMode ... (클러스터) FIPS 유형 목록")
		return ResponseEntity.ok(iType.findAllFipsModes())
	}


	@ApiOperation(
		httpMethod="GET",
		value="가상머신 디스플레이 유형 목록 조회",
		notes="가상머신 디스플레이 유형 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("displayType")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allDisplayTypes(): ResponseEntity<List<TypeVo>> {
		log.info("/types/displayType ... 가상머신 디스플레이 유형 목록")
		return ResponseEntity.ok(iType.findAllDisplayTypes())
	}

	@ApiOperation(
		httpMethod="GET",
		value="마이그레이션 모드 목록 조회",
		notes="마이그레이션 모드 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("migrationSupport")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allMigrationSupports(): ResponseEntity<List<TypeVo>> {
		log.info("/types/migrationSupport ... 마이그레이션 모드 목록")
		return ResponseEntity.ok(iType.findAllMigrationSupports())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 풀 (a.k.a. 데이터센터) 쿼터 모드 목록 조회",
		notes="스토리지 풀 (a.k.a. 데이터센터) 쿼터 모드 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("quotaEnforcementType")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allQuotaEnforcementTypes(): ResponseEntity<List<TypeVo>> {
		log.info("/types/quotaEnforcementType ... 스토리지 풀 (a.k.a. 데이터센터) 쿼터 모드 목록")
		return ResponseEntity.ok(iType.findAllQuotaEnforcementTypes())
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 유형 (a.k.a. 최적화 옵션) 목록 조회",
		notes="가상머신 유형 (a.k.a. 최적화 옵션) 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("vmType")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun allVmTypes(): ResponseEntity<List<TypeVo>> {
		log.info("/types/vmType ... 가상머신 유형 (a.k.a. 최적화 옵션) 목록")
		return ResponseEntity.ok(iType.findAllVmTypes())
	}
	companion object {
		private val log by LoggerDelegate()
	}
}
