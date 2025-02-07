package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.CpuProfileVo
import com.itinfo.model.TemplateEditVo
import com.itinfo.model.TemplateVo
import com.itinfo.service.TemplatesService

import io.swagger.annotations.*
import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("compute")
@Api(value = "TemplatesController", tags = ["templates"])
class TemplatesController {
	@Autowired private lateinit var templatesService: TemplatesService

	@ApiOperation(httpMethod = "GET", value = "retrieveTemplates", notes = "탬플릿 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/template/retrieveTemplates")
	@ResponseBody
	fun retrieveTemplates(): JSONObject {
		log.info("... retrieveTemplates")
		val templates: List<TemplateVo> =
			templatesService.retrieveTemplates()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = templates
		}
	}

	@ApiOperation(httpMethod = "GET", value = "retrieveTemplate", notes = "탬플릿 상세 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name = "id", value = "탬플릿 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/template/retrieveTemplate")
	@ResponseBody
	fun retrieveTemplate(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveTemplate('{}')", id)
		val template: TemplateVo =
			templatesService.retrieveTemplate(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = template
		}
	}

	@ApiOperation(httpMethod = "GET", value = "retrieveCpuProfiles", notes = "CPU 프로필 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/template/cpuProfiles")
	@ResponseBody
	fun retrieveCpuProfiles(): JSONObject {
		log.info("... retrieveCpuProfiles")
		val cpuProfiles: List<CpuProfileVo> =
			templatesService.retrieveCpuProfiles()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = cpuProfiles
		}
	}

	@ApiOperation(httpMethod = "GET", value = "retrieveRootTemplates", notes = "ROOT 탬플릿 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/template/rootTemplates")
	@ResponseBody
	fun retrieveRootTemplates(): JSONObject {
		log.info("... retrieveRootTemplates")
		val rootTemplates: List<TemplateVo> =
			templatesService.retrieveRootTemplates()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = rootTemplates
		}
	}

	@ApiOperation(httpMethod = "GET", value = "retrieveDisks", notes = "디스크 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name = "id", value = "가상머신 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/template/retrieveDisks")
	@ResponseBody
	fun retrieveDisks(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveDisks('$id')")
		val list = templatesService.retrieveDisks(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = list
		}
	}

	@ApiOperation(httpMethod = "GET", value = "createTemplate", notes = "탬플릿 생성")
	@ApiImplicitParams(
		ApiImplicitParam(name = "template", value = "생성할 탬플릿 정보", paramType="body", dataTypeClass=TemplateVo::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/createTemplate")
	@ResponseBody
	fun createTemplate(
		@RequestBody template: TemplateVo,
	): JSONObject {
		log.info("... createTemplate")
		templatesService.createTemplate(template)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod = "POST", value = "checkDuplicateName", notes = "ROOT 탬플릿 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name = "name", value = "검색대상 이름", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/template/checkDuplicateName")
	@ResponseBody
	fun checkDuplicateName(
		@RequestParam(name="name") name: String,
	): JSONObject {
		log.info("... checkDuplicateName('$name')")
		val result =
			templatesService.checkDuplicateName(name)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}

	@ApiOperation(httpMethod = "POST", value = "removeTemplate", notes = "탬플릿 삭제")
	@ApiImplicitParams(
		ApiImplicitParam(name = "id", value = "삭제할 탬플릿 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/removeTemplate")
	@ResponseBody
	fun removeTemplate(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... removeTemplate('$id')")
		templatesService.removeTemplate(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod = "GET", value = "retrieveTemplateEditInfo", notes = "탬플릿 편집 정보 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name = "id", value = "편집할 탬플릿 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/retrieveTemplateEditInfo")
	@ResponseBody
	fun retrieveTemplateEditInfo(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveTemplateEditInfo('$id')")
		val templateEditInfo: TemplateEditVo =
			templatesService.retrieveTemplateEditInfo(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = templateEditInfo
		}
	}

	@ApiOperation(httpMethod = "POST", value = "updateTemplate", notes = "탬플릿 편집")
	@ApiImplicitParams(
		ApiImplicitParam(name = "templateEditInfo", value = "편집할 탬플릿 정보", paramType="body", dataTypeClass=TemplateEditVo::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/updateTemplate")
	@ResponseBody
	fun updateTemplate(
		@RequestBody templateEditInfo: TemplateEditVo,
	): JSONObject {
		log.info("... updateTemplate")
		val result: String =
			templatesService.updateTemplate(templateEditInfo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}

	@ApiOperation(httpMethod = "POST", value = "exportTemplate", notes = "탬플릿 내보내기")
	@ApiImplicitParams(
		ApiImplicitParam(name = "template", value = "내보낼 탬플릿 정보", paramType="body", dataTypeClass=TemplateVo::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/exportTemplate")
	@ResponseBody
	fun exportTemplate(
		@RequestBody template: TemplateVo,
	): JSONObject {
		log.info("... exportTemplate")
		templatesService.exportTemplate(template)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod = "POST", value = "checkExportTemplate", notes = "탬플릿 내보내기 전 확인")
	@ApiImplicitParams(
		ApiImplicitParam(name = "id", value = "내보낼 탬플릿 id", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/checkExportTemplate")
	@ResponseBody
	fun checkExportTemplate(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... checkExportTemplate('$id')")
		val result: Boolean =
			templatesService.checkExportTemplate(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}