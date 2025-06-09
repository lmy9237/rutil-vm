package com.itinfo.rutilvm.api.controller.admin


import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.service.admin.ItCertService
import com.itinfo.rutilvm.api.model.cert.CertManager

import com.itinfo.rutilvm.common.LoggerDelegate
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import java.io.Serializable

@Controller
@Api(tags = ["Certificate(s) Management"])
@RequestMapping("/api/v1/admin/certs")
class CertMgmtController : BaseController() {
	@Autowired private lateinit var cert: ItCertService

	@ApiOperation(
		httpMethod = "GET",
		value = "oVirt 인증서 목록 조회",
		notes = "oVirt 인증서 목록 조회"
	)
	@ApiImplicitParams(
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 요청")
	)
	@GetMapping
	fun findAll(): ResponseEntity<List<CertManager>> {
		log.debug("findAll ... ")
		val certs: List<CertManager> = cert.findAll()
		return ResponseEntity.ok(certs)
	}

	@ApiOperation(
		httpMethod = "GET",
		value = "oVirt 인증서 단일/상세조회",
		notes = "oVirt 인증서 단일/상세조회"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="oVirt 인증서 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 요청")
	)
	@GetMapping("/{id}")
	fun findOne(

	): ResponseEntity<CertManager?> {
		// log.debug("findOne ... id: {}", id)
		// val idInt: Int = id.toIntOrNull() ?: throw ErrorPattern.CERT_ID_NOT_FOUND.toException()
		// val certs: CertManager? = cert.findOne(idInt)
		return ResponseEntity.ok(null)
	}

	@ApiOperation(
		httpMethod = "GET",
		value = "oVirt 인증서 연결",
		notes = "oVirt 인증서 상태를 RutilVM에서 확인할 수 있도록 연결한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="cert", value="oVirt 인증서 연결 관련 입력정보", dataTypeClass=CertManagerReq::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 요청")
	)
	@PostMapping("/attach")
	fun attach(
		@RequestBody(required = true) certReq: CertManagerReq
	): ResponseEntity<Boolean?> {
		log.debug("attach ... cert: {}", certReq)
		// val idInt: Int = id.toIntOrNull() ?: throw ErrorPattern.CERT_ID_NOT_FOUND.toException()
		val res: Boolean? = cert.attach(certReq.address, certReq.rootPassword)
		return ResponseEntity.ok(res)
	}
	data class CertManagerReq(val address: String? = "", val rootPassword: String? = ""): Serializable

	companion object {
		private val log by LoggerDelegate()
	}
}
