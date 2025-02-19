package com.itinfo.rutilvm.api.controller.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.setting.UsersVo
import com.itinfo.rutilvm.api.service.setting.ItSettingService
import com.itinfo.rutilvm.api.service.setting.ItSystemPropertiesService
import com.itinfo.rutilvm.util.model.SystemPropertiesVo

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

/**
 * [SystemPropertiesController]
 * 시스템 설정 값
 */
@Controller
@Api(tags = ["Setting"])
@RequestMapping("/api/v1/setting")
class SystemPropertiesController {
	@Autowired private lateinit var sysProp: ItSystemPropertiesService
	@Autowired private lateinit var iUser: ItSettingService

	@ApiOperation(
		httpMethod="GET",
		value="시스템 설정정보 조회",
		notes="시스템 설정정보를 조회한다")
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping()
	@ResponseBody
	fun findOne(): ResponseEntity<SystemPropertiesVo> {
		log.info("GET /v1/api/setting ... ")
		return ResponseEntity.ok(sysProp.findOne())
	}


	@ApiOperation(
		httpMethod="POST",
		value="시스템 설정정보 저장",
		notes="시스템 설정정보를 저장한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping
	@ResponseBody
	fun update(): SystemPropertiesVo? {
		log.info("POST /v1/api/setting ... ")
		// 관리-설정-엔진 에서 id, pw, ip를 입력하고 저장을 하면 대시보드 결과가 뜬다.
		// 이거는 json방식이긴한데.. 일단 나중에
		return sysProp.update(sysProp.findOne())
	}

	@ApiOperation(
		httpMethod="GET",
		value="사용자 목록조회",
		notes="사용자 목록조회를 한다."
	)
	@ApiImplicitParams(
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "성공"),
		ApiResponse(code = 404, message = "찾을 수 없는 사용자")
	)
	@GetMapping("/users")
	fun findAll(): ResponseEntity<List<UsersVo>> {
		log.info("findAll ... ")
		val res: List<UsersVo> = iUser.findAllUsers()
		return ResponseEntity.ok(res)
	}



	companion object {
		private val log by LoggerDelegate()
	}
}
