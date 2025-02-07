package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.util.model.SystemPropertiesVo
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.service.SystemPropertiesService
import com.itinfo.service.UsersService
import com.itinfo.service.engine.ConnectionService
import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

import javax.servlet.http.HttpServletRequest


@Controller
@Api(value="LoginController", tags=["login"])
class LoginController {
	@Autowired private lateinit var connectionService: ConnectionService
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService
	@Autowired private lateinit var usersService: UsersService

	@ApiOperation(httpMethod="GET", value="scopeTest", notes="scopeTest?")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping(value=["/scopeTest"])
	@ResponseBody
	fun scopeTest(): JSONObject {
		log.info("... scopeTest")
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = connectionService.uid	
		}
	}

	@ApiOperation(httpMethod="GET", value="loginTest", notes="loginTest??")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping(value=["/loginTest"])
	@ResponseBody
	fun loginTest(): JSONObject {
		log.info("... loginTest")
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = memberService.username
		}
	}

	@ApiOperation(httpMethod="GET", value="serverStatus", notes="서버상태 확인")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping(value=["/login/serverStatus"])
	@ResponseBody
	fun serverStatus(): JSONObject {
		log.info("... serverStatus")
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="GET", value="userConvenienceSetting", notes="사용자 편의 설정")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping(value=["/userConvenienceSetting"])
	@ResponseBody
	fun userConvenienceSetting(): JSONObject {
		log.info("... userConvenienceSetting")
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}


	@ApiOperation(httpMethod="GET", value="loginSuccess", notes="로그인 성공처리")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/loginSuccess")
	@ResponseBody
	fun loginSuccess(
		httpServletRequest: HttpServletRequest
	): JSONObject {
		log.info("... loginSuccess")
		val json = JSONObject()
		val userId = memberService.username.split("@".toRegex()).dropLastWhile { it.isEmpty() }
			.toTypedArray()[0]
		log.info("... loginSuccess > userId=$userId")
		val ht = httpServletRequest.session.apply {
			setAttribute("userId", userId)
		}

		json[ItInfoConstant.RESULT_KEY] = "OK"
		val systemProperties: SystemPropertiesVo =
			systemPropertiesService.retrieveSystemProperties()
		val redirectUrl: String =
			if ((systemProperties.ip.isNotEmpty() && systemProperties.password.isNotEmpty()))
				"/dashboard"
			else
				"/admin/systemProperties"
		json["redirect"] = redirectUrl
		log.info("redirecting to ... $redirectUrl")
		return json
	}


	@ApiOperation(httpMethod="GET", value="resetAdminLoginCount", notes="로그인 회수 초기화")
	@ApiImplicitParams(
		ApiImplicitParam(name="userId", value="사용자 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/login/resetLoginCount")
	@ResponseBody
	fun resetAdminLoginCount(
		@RequestParam(name="userId") userId: String
	): JSONObject {
		log.info("... resetAdminLoginCount")
//		usersService.initLoginCount(userId)

		val systemProperties = systemPropertiesService.retrieveSystemProperties()
		systemProperties.ip = ""
		systemProperties.password = ""
		systemProperties.vncIp = ""
		systemProperties.vncPort = ""
		systemProperties.grafanaUri = ""
		systemProperties.deeplearningUri = ""
		val updateResult = systemPropertiesService.saveSystemProperties(systemProperties)
		if (updateResult > 0)
			log.debug("systemProperties reset SUCCESS")
		else
			log.debug("systemProperties reset FAIL")
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = if (updateResult > 0) "OK" else "FAIl"
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}