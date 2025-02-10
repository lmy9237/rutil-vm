package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.model.computing.EventVo
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.service.computing.ItTemplateService

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Computing", "Template"])
@RequestMapping("/api/v1/computing/templates")
class TemplateController: BaseController() {
	@Autowired private lateinit var iTemplate: ItTemplateService

	@ApiOperation(
		httpMethod="GET",
		value="템플릿 목록 조회",
		notes="전체 템플릿 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun templates(): ResponseEntity<List<TemplateVo>> {
		log.info("/computing/templates ... 템플릿 목록")
		return ResponseEntity.ok(iTemplate.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="템플릿의 정보 상세조회",
		notes="템플릿의 상세정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{templateId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findOne(
		@PathVariable templateId: String? = null,
	): ResponseEntity<TemplateVo?> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("/computing/templates/{} ...  템플릿 상세정보", templateId)
		return ResponseEntity.ok(iTemplate.findOne(templateId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="템플릿 생성",
		notes="템플릿을 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="template", value="템플릿", dataTypeClass= TemplateVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun add(
		@PathVariable vmId: String? = null,
		@RequestBody template: TemplateVo? = null
	): ResponseEntity<TemplateVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (template == null)
			throw ErrorPattern.TEMPLATE_VO_INVALID.toException()
		log.info("/computing/templates ... 템플릿 생성\n{}", template)
		return ResponseEntity.ok(iTemplate.add(vmId, template))
	}


	@ApiOperation(
		httpMethod="PUT",
		value="템플릿 편집",
		notes="템플릿 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="template", value="템플릿", dataTypeClass= TemplateVo::class, paramType="body")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{templateId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun update(
		@PathVariable templateId: String? = null,
		@RequestBody template: TemplateVo? = null,
	): ResponseEntity<TemplateVo?> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		if (template == null)
			throw ErrorPattern.TEMPLATE_VO_INVALID.toException()
		log.info("/computing/templates/{} ... 템플릿 편집\n{}", templateId, template)
		return ResponseEntity.ok(iTemplate.update(template))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="템플릿 삭제",
		notes="템플릿을 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{templateId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable templateId: String? = null,
	): ResponseEntity<Boolean> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("/computing/templates/{} ... 템플릿 삭제", templateId)
		return ResponseEntity.ok(iTemplate.remove(templateId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="템플릿 가상머신 목록",
		notes="선택된 템플릿의 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{templateId}/vms")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vms(
		@PathVariable templateId: String? = null,
	): ResponseEntity<List<VmVo>> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("--- template 가상머신")
		return ResponseEntity.ok(iTemplate.findAllVmsFromTemplate(templateId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="템플릿 Nic 목록",
		notes="선택된 템플릿의 Nic 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{templateId}/nics")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun nics(
		@PathVariable templateId: String? = null,
	): ResponseEntity<List<NicVo>> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("--- template Nic")
		return ResponseEntity.ok(iTemplate.findAllNicsFromTemplate(templateId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="템플릿 Nic 생성",
		notes="템플릿의 Nic를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 Id", dataTypeClass= String::class, paramType="path"),
		ApiImplicitParam(name="nicVo", value="NicVo", dataTypeClass= NicVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{templateId}/nics")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun addNic(
		@PathVariable templateId: String? = null,
		@RequestBody nicVo: NicVo? = null
	): ResponseEntity<NicVo?> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		if (nicVo == null)
			throw ErrorPattern.NIC_VO_INVALID.toException()
		log.info("/computing/templates/{}/nics ... 템플릿 Nic 생성", templateId)
		return ResponseEntity.ok(iTemplate.addNicFromTemplate(templateId, nicVo))
	}


	@ApiOperation(
		httpMethod="PUT",
		value="템플릿 Nic 편집",
		notes="템플릿의 Nic를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 Id", dataTypeClass= String::class, paramType="path"),
		ApiImplicitParam(name="nicVo", value="NicVo", dataTypeClass= NicVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{templateId}/nics/{nicId}") // TODO 이상함
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun updateNic(
		@PathVariable templateId: String? = null,
		@RequestBody nicVo: NicVo? = null
	): ResponseEntity<NicVo?> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		if (nicVo == null)
			throw ErrorPattern.NIC_VO_INVALID.toException()
		log.info("/computing/templates/{}/nics ... 템플릿 Nic 편집", templateId)
		return ResponseEntity.ok(iTemplate.updateNicFromTemplate(templateId, nicVo))
	}

	@ApiOperation(
		httpMethod = "DELETE",
		value = "템플릿 Nic 삭제",
		notes = "템플릿의 Nic을 삭제한다."
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "templateId", value = "템플릿 ID", dataTypeClass = String::class, required = true, paramType = "path"),
		ApiImplicitParam(name = "nicId", value = "nic ID", dataTypeClass = String::class, required = true, paramType = "path")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{templateId}/nics/{nicId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun removeNic(
		@PathVariable templateId: String,
		@PathVariable nicId: String
	): ResponseEntity<Boolean> {
		if (templateId.isNullOrEmpty()) {
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		}
		if (nicId.isNullOrEmpty()) {
			throw ErrorPattern.NIC_VO_INVALID.toException()
		}

		log.info("/computing/templates/{}/nics/{} ... 템플릿 NIC 삭제", templateId, nicId)
		return ResponseEntity.ok(iTemplate.removeNicFromTemplate(templateId, nicId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="템플릿 디스크 목록",
		notes="선택된 템플릿의 디스크 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{templateId}/disks")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun disks(
		@PathVariable templateId: String? = null,
	): ResponseEntity<List<DiskAttachmentVo>> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("/computing/templates/{}/disks 디스크", templateId)
		return ResponseEntity.ok(iTemplate.findAllDisksFromTemplate(templateId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="템플릿 스토리지 도메인 목록",
		notes="선택된 템플릿의 스토리지 도메인 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{templateId}/storageDomains")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findAllStorageDomainsFromTemplate(
		@PathVariable templateId: String? = null,
	): ResponseEntity<List<StorageDomainVo>> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("/computing/templates/{}/storageDomains 스토리지 도메인", templateId)
		return ResponseEntity.ok(iTemplate.findAllStorageDomainsFromTemplate(templateId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="템플릿 이벤트 목록",
		notes="선택된 템플릿의 이벤트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{templateId}/events")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findAllEventsFromTemplate(
		@PathVariable templateId: String? = null,
	): ResponseEntity<List<EventVo>> {
		if (templateId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("/computing/templates/{}/events 이벤트", templateId)
		return ResponseEntity.ok(iTemplate.findAllEventsFromTemplate(templateId))
	}


//	@ApiOperation(
//		httpMethod="GET",
//		value="템플릿 권한 목록",
//		notes="선택된 템플릿의 권한 목록을 조회한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name="templateId", value="템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 200, message = "OK")
//	)
//	@GetMapping("/{templateId}/permissions")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.OK)
//	fun findAllPermissions(
//		@PathVariable templateId: String? = null,
//	): ResponseEntity<List<PermissionVo>> {
//		if (templateId.isNullOrEmpty())
//			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
//		log.info("--- template 권한")
//		return ResponseEntity.ok(iTemplate.findAllPermissionsFromTemplate(templateId))
//	}

	companion object {
		private val log by LoggerDelegate()
	}
}