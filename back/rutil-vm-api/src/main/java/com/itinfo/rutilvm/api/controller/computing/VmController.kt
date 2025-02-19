package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.service.computing.*

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Computing", "Vm"])
@RequestMapping("/api/v1/computing/vms")
class VmController: BaseController() {
	@Autowired private lateinit var iVm: ItVmService

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 목록 조회",
		notes="전체 가상머신 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vms(): ResponseEntity<List<VmVo>> {
		log.info("/computing/vms ... 가상머신 목록")
		return ResponseEntity.ok(iVm.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 상세정보",
		notes="선택된 가상머신의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vm(
		@PathVariable vmId: String? = null,
	): ResponseEntity<VmVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{} ... 가상머신 상세정보", vmId)
		return ResponseEntity.ok(iVm.findOne(vmId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 편집 상세정보",
		notes="편집할 가상머신의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/edit")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun editVm(
		@PathVariable vmId: String? = null,
	): ResponseEntity<VmCreateVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/edit ... 가상머신 편집 상세정보", vmId)
		return ResponseEntity.ok(iVm.findEditOne(vmId))
	}


	@ApiOperation(
		httpMethod="POST",
		value="가상머신 생성",
		notes="가상머신을 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vm", value="가상머신", dataTypeClass=VmVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun add(
		@RequestBody vm: VmCreateVo? = null,
	): ResponseEntity<VmCreateVo?> {
		if (vm == null)
			throw ErrorPattern.VM_VO_INVALID.toException()
		log.info("/computing/vms ... 가상머신 생성")
		return ResponseEntity.ok(iVm.add(vm))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="가상머신 편집",
		notes="가상머신을 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="vm", value="가상머신", dataTypeClass=VmVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{vmId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun update(
		@PathVariable vmId: String?,
		@RequestBody vm: VmVo?
	): ResponseEntity<VmVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (vm == null)
			throw ErrorPattern.VM_VO_INVALID.toException()
		log.info("/computing/vms/{} ... 가상머신 편집", vmId)
		return ResponseEntity.ok(iVm.update(vm))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="가상머신 삭제",
		notes="가상머신을 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{vmId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable vmId: String? = null,
		@RequestParam detachOnly: Boolean? = null // disk 삭제여부
	): ResponseEntity<Boolean> {
		log.info("vm 삭제 $vmId, $detachOnly")
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (detachOnly == null)
			throw ErrorPattern.VM_ID_NOT_FOUND.toException() // TODO
		log.info("/computing/vms/{} ... 가상머신 삭제", vmId)
		return ResponseEntity.ok(iVm.remove(vmId, detachOnly))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 내 어플리케이션 목록",
		notes="선택된 가상머신의 어플리케이션 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/applications")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun applications(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<IdentifiedVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/applications ... 가상머신 어플리케이션 목록", vmId)
		return ResponseEntity.ok(iVm.findAllApplicationsFromVm(vmId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 내 호스트 장치 목록",
		notes="선택된 가상머신의 호스트 장치 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/hostDevices")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun hostDevices(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<HostDeviceVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/hostDevices ... 가상머신 호스트 장치 목록", vmId)
		return ResponseEntity.ok(iVm.findAllHostDevicesFromVm(vmId))

	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 이벤트 목록",
		notes="선택된 가상머신의 이벤트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/events")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun events(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<EventVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/events ... 가상머신 이벤트", vmId)
		return ResponseEntity.ok(iVm.findAllEventsFromVm(vmId))
	}


	@Deprecated("필요없음")
	@ApiOperation(
		value="가상머신 게스트 목록",
		notes="선택된 가상머신의 게스트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/guest")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun guest(
		@PathVariable vmId: String? = null,
	): ResponseEntity<GuestInfoVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/guest ... 가상머신 게스트", vmId)
		return ResponseEntity.ok(iVm.findGuestFromVm(vmId))
	}

	@Deprecated("필요없음")
	@ApiOperation(
		httpMethod="GET",
		value="가상머신 권한 목록",
		notes="선택된 가상머신의 권한 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/permissions")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun permissions(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<PermissionVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/permissions ... 가상머신 권한", vmId)
		return ResponseEntity.ok(iVm.findAllPermissionsFromVm(vmId))
	}


	//region: vmOp
	@Autowired private lateinit var iVmOp: ItVmOperationService

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 실행",
		notes="선택된 가상머신을 실행한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/start")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun start(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/start ... 가상머신 시작", vmId)
		return ResponseEntity.ok(iVmOp.start(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 일시정지",
		notes="선택된 가상머신을 일시정지한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/pause")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun pause(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/pause ... 가상머신 일시정지", vmId)
		return ResponseEntity.ok(iVmOp.pause(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 전원끔",
		notes="선택된 가상머신의 전원을 끈다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/powerOff")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun powerOff(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/powerOff ... 가상머신 전원끄기", vmId)
		return ResponseEntity.ok(iVmOp.powerOff(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 종료",
		notes="선택된 가상머신을 종료한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/shutdown")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun shutdown(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/shutdown ... 가상머신 종료", vmId)
		return ResponseEntity.ok(iVmOp.shutdown(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 재부팅",
		notes="선택된 가상머신을 재부팅한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/reboot")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun reboot(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/reboot ... 가상머신 재부팅", vmId)
		return ResponseEntity.ok(iVmOp.reboot(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 재설정",
		notes="선택된 가상머신을 재설정한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/reset")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun reset(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/reset ... 가상머신 재설정", vmId)
		return ResponseEntity.ok(iVmOp.reset(vmId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 마이그레이션 호스트 목록",
		notes="선택된 가상머신의 마이그레이션 가능한 호스트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/migrateHosts")
	@ResponseBody
//	@ResponseStatus(HttpStatus.CREATED)
	fun migrateHosts(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<IdentifiedVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/migrateHosts ... 가상머신 호스트 목록 조회", vmId)
		return ResponseEntity.ok(iVmOp.migrateHostList(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 마이그레이션",
		notes="선택된 가상머신을 재설정한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/migrate/{hostId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun reset(
		@PathVariable vmId: String? = null,
		@PathVariable hostId: String? = null
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/migrate ... 가상머신 재설정", vmId)
		return ResponseEntity.ok(iVmOp.migrate(vmId, hostId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 내보내기",
		notes="선택된 가상머신을 OVA로 내보낸다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, paramType="path"),
		ApiImplicitParam(name="vmExport", value="가상머신 내보내기", dataTypeClass=VmExportVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/export")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun exportOva(
		@PathVariable vmId: String? = null,
		@RequestBody vmExport: VmExportVo? = null,
	): ResponseEntity<Boolean?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (vmExport == null)
			throw ErrorPattern.VM_VO_INVALID.toException()
		log.info("/computing/vms/{}/export ... 가상머신 생성", vmId)
		return ResponseEntity.ok(iVmOp.exportOva(vmId, vmExport))
	}

	@ApiOperation(
		value="가상머신 콘솔",
		notes="선택된 가상머신의 콘솔을 출력한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		// ApiImplicitParam(name="console", value="콘솔", dataTypeClass=ConsoleVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/console")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun console(
		@PathVariable vmId: String? = null,
	): ResponseEntity<ConsoleVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/console ... 가상머신 콘솔", vmId)
		return ResponseEntity.ok(iVmOp.console(vmId))
	}
	//endregion


	//region: vmNic
	@Autowired private lateinit var vmNic: ItVmNicService

	@ApiOperation(
		httpMethod="GET",
		value = "가상머신 네트워크 인터페이스 목록",
		notes = "선택된 가상머신의 네트워크 인터페이스 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@GetMapping("/{vmId}/nics")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun nics(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<NicVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/nics ... 가상머신 nic 목록", vmId)
		return ResponseEntity.ok(vmNic.findAllFromVm(vmId))
	}

	@ApiOperation(
		httpMethod="GET",
		value = "가상머신 네트워크 인터페이스",
		notes = "선택된 가상머신의 네트워크 인터페이스를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="nicId", value="네트워크 인터페이스 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@GetMapping("/{vmId}/nics/{nicId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun nic(
		@PathVariable vmId: String? = null,
		@PathVariable nicId: String? = null,
	): ResponseEntity<NicVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (nicId.isNullOrEmpty())
			throw ErrorPattern.NIC_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/nics/{} ... 가상머신 nic 일반 ", vmId, nicId)
		return ResponseEntity.ok(vmNic.findOneFromVm(vmId, nicId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 네트워크 인터페이스 생성",
		notes="선택된 가상머신의 네트워크 인터페이스를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="nic", value="네트워크 인터페이스", dataTypeClass=NicVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/nics")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun addNic(
		@PathVariable vmId: String? = null,
		@RequestBody nic: NicVo? = null,
	): ResponseEntity<NicVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (nic == null)
			throw ErrorPattern.NIC_VO_INVALID.toException()
		log.info("/computing/vms/{}/nics ... 가상머신 nic 생성 ", vmId)
		return ResponseEntity.ok(vmNic.addFromVm(vmId, nic))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="가상머신 네트워크 인터페이스 편집",
		notes="선택된 가상머신의 네트워크 인터페이스를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="nicId", value="네트워크 인터페이스 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="nic", value="네트워크 인터페이스", dataTypeClass=NicVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{vmId}/nics/{nicId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun updateNic(
		@PathVariable vmId: String? = null,
		@PathVariable nicId: String? = null,
		@RequestBody nic: NicVo? = null,
	): ResponseEntity<NicVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (nicId.isNullOrEmpty())
			throw ErrorPattern.NIC_ID_NOT_FOUND.toException()
		if (nic == null)
			throw ErrorPattern.NIC_VO_INVALID.toException()
		log.info("/computing/vms/{}/nics/{} ... 가상머신 nic 편집 ", vmId, nicId)
		return ResponseEntity.ok(vmNic.updateFromVm(vmId, nic))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="가상머신 네트워크 인터페이스 삭제",
		notes="선택된 가상머신의 네트워크 인터페이스를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="nicId", value="네트워크 인터페이스 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{vmId}/nics/{nicId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun removeNic(
		@PathVariable vmId: String? = null,
		@PathVariable nicId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (nicId.isNullOrEmpty())
			throw ErrorPattern.NIC_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/nics/{} ... 가상머신 nic 삭제 ", vmId, nicId)
		return ResponseEntity.ok(vmNic.removeFromVm(vmId, nicId))
	}
	// endregion


	//region: vmDisk
	@Autowired private lateinit var iVmDisk: ItVmDiskService

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 디스크 목록",
		notes="선택된 가상머신의 디스크 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/disks")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun disks(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<DiskAttachmentVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/disks ... 가상머신 disk 목록", vmId)
		return ResponseEntity.ok(iVmDisk.findAllFromVm(vmId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 디스크",
		notes="선택된 가상머신의 디스크를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachmentId", value="디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/disks/{diskAttachmentId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun disk(
		@PathVariable vmId: String? = null,
		@PathVariable diskAttachmentId: String? = null,
	): ResponseEntity<DiskAttachmentVo> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachmentId.isNullOrEmpty())
			throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/disks/{} ... 가상머신 disk 목록", vmId, diskAttachmentId)
		return ResponseEntity.ok(iVmDisk.findOneFromVm(vmId, diskAttachmentId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 디스크 생성",
		notes="선택된 가상머신의 디스크를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachment", value="디스크", dataTypeClass=DiskAttachmentVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/disks")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun addDisk(
		@PathVariable vmId: String? = null,
		@RequestBody diskAttachment: DiskAttachmentVo? = null,
	): ResponseEntity<DiskAttachmentVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachment == null)
			throw ErrorPattern.DISK_ATTACHMENT_VO_INVALID.toException()
		log.info("/computing/vms/{}/disks ... 가상머신 디스크 생성 ", vmId)
		return ResponseEntity.ok(iVmDisk.addFromVm(vmId, diskAttachment))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 디스크 연결",
		notes="선택된 가상머신의 디스크를 연결한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachment", value="디스크", dataTypeClass=DiskAttachmentVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/disks/attach")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun attachDisk(
		@PathVariable vmId: String? = null,
		@RequestBody diskAttachment: DiskAttachmentVo? = null,
	): ResponseEntity<DiskAttachmentVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachment == null)
			throw ErrorPattern.DISK_ATTACHMENT_VO_INVALID.toException()
		log.info("/computing/vms/{}/disks/attach ... 가상머신 디스크 연결 ", vmId)
		return ResponseEntity.ok(iVmDisk.attachFromVm(vmId, diskAttachment))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 디스크 연결(다중)",
		notes="선택된 가상머신의 디스크를 연결한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachment", value="디스크 ID 목록", dataTypeClass=Array<DiskAttachmentVo>::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/disks/attachs")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun attachDiskList(
		@PathVariable vmId: String? = null,
		@RequestBody diskAttachments: List<DiskAttachmentVo>? = null,
	): ResponseEntity<Boolean?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachments == null)
			throw ErrorPattern.DISK_ATTACHMENT_VO_INVALID.toException()
		log.info("/computing/vms/{}/disks/attachs ... 가상머신 디스크 연결 ", vmId)
		return ResponseEntity.ok(iVmDisk.attachMultiFromVm(vmId, diskAttachments))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="가상머신 디스크 편집",
		notes="선택된 가상머신의 디스크를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachmentId", value="디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachment", value="디스크", dataTypeClass=DiskAttachmentVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{vmId}/disks/{diskAttachmentId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun updateDisk(
		@PathVariable vmId: String? = null,
		@PathVariable diskAttachmentId: String? = null,
		@RequestBody diskAttachment: DiskAttachmentVo? = null,
	): ResponseEntity<DiskAttachmentVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachmentId.isNullOrEmpty())
			throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toException()
		if (diskAttachment == null)
			throw ErrorPattern.DISK_ATTACHMENT_VO_INVALID.toException()
		log.info("/computing/vms/{}/disks/{} ... 가상머신 디스크 편집 ", vmId, diskAttachmentId)
		return ResponseEntity.ok(iVmDisk.updateFromVm(vmId, diskAttachment))
	}

//	@ApiOperation(
//		httpMethod="DELETE",
//		value="가상머신 디스크 삭제(다중)",
//		notes="선택된 가상머신의 디스크를 삭제한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
//		ApiImplicitParam(name="diskAttachments", value="디스크 ID 목록", dataTypeClass=Array<DiskAttachmentVo>::class, required=true, paramType="body"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 200, message = "OK")
//	)
//	@DeleteMapping("/{vmId}/disks")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.OK)
//	fun removeDisks(
//		@PathVariable vmId: String? = null,
//		@RequestBody diskAttachments: List<DiskAttachmentVo>? = null,
//	): ResponseEntity<Boolean> {
//		if (vmId.isNullOrEmpty())
//			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
//		if (diskAttachments == null)
//			throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toException()
//		log.info("/computing/vms/{}/disks ... 가상머신 디스크 삭제(다중) ", vmId)
//		return ResponseEntity.ok(iVmDisk.removeMultiFromVm(vmId, diskAttachments))
//	}

	@ApiOperation(
		httpMethod="DELETE",
		value="가상머신 디스크 삭제",
		notes="선택된 가상머신의 디스크를 삭제한다 detachOnly=false가 완전삭제"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachmentId", value="디스크연결 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{vmId}/disks/{diskAttachmentId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun removeDisk(
		@PathVariable vmId: String? = null,
		@PathVariable diskAttachmentId: String? = null,
		@RequestParam(defaultValue = "false") detachOnly: Boolean,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachmentId.isNullOrEmpty())
			throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/disks/{}?detachOnly={} ... 가상머신 디스크 삭제 ", vmId, diskAttachmentId, detachOnly)
		return ResponseEntity.ok(iVmDisk.removeFromVm(vmId, diskAttachmentId, detachOnly))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 디스크 활성화",
		notes="선택된 가상머신의 디스크 활성화한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachmentId", value="디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/disks/{diskAttachmentId}/activate")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun activateDisk(
		@PathVariable vmId: String? = null,
		@PathVariable diskAttachmentId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachmentId == null)
			throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/disks/{}/activate ... 가상머신 디스크 활성화", vmId, diskAttachmentId)
		return ResponseEntity.ok(iVmDisk.activeFromVm(vmId, diskAttachmentId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 디스크 비활성화",
		notes="선택된 가상머신의 디스크 비활성화한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachmentId", value="디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/disks/{diskAttachmentId}/deactivate")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun deactivateDisk(
		@PathVariable vmId: String? = null,
		@PathVariable diskAttachmentId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachmentId == null)
			throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/disks/{}/deactivate ... 가상머신 디스크 비활성화", vmId, diskAttachmentId)
		return ResponseEntity.ok(iVmDisk.deactivateFromVm(vmId, diskAttachmentId))
	}


//	@ApiOperation(
//		httpMethod="POST",
//		value="가상머신 디스크 활성화",
//		notes="선택된 가상머신의 디스크 활성화한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
//		ApiImplicitParam(name="diskAttachments", value="디스크 ID 목록", dataTypeClass=Array<String>::class, required=true, paramType="body"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 201, message = "CREATED"),
//		ApiResponse(code = 404, message = "NOT_FOUND")
//	)
//	@PostMapping("/{vmId}/disks/activate")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.CREATED)
//	fun activateDisk(
//		@PathVariable vmId: String? = null,
//		@RequestBody diskAttachments: List<String>? = null,
//	): ResponseEntity<Boolean> {
//		if (vmId.isNullOrEmpty())
//			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
//		if (diskAttachments == null)
//			throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toException()
//		log.info("/computing/vms/{}/disks/activate ... 가상머신 디스크 활성화", vmId)
//		return ResponseEntity.ok(iVmDisk.activeMultiFromVm(vmId, diskAttachments))
//	}
//
//	@ApiOperation(
//		httpMethod="POST",
//		value="가상머신 디스크 비활성화",
//		notes="선택된 가상머신의 디스크 비활성화한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
//		ApiImplicitParam(name="diskAttachments", value="디스크 ID 목록", dataTypeClass=Array<String>::class, required=true, paramType="body"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 201, message = "CREATED"),
//		ApiResponse(code = 404, message = "NOT_FOUND")
//	)
//	@PostMapping("/{vmId}/disks/deactivate")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.CREATED)
//	fun deactivateDisk(
//		@PathVariable vmId: String? = null,
//		@RequestBody diskAttachments: List<String>? = null,
//	): ResponseEntity<Boolean> {
//		if (vmId.isNullOrEmpty())
//			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
//		if (diskAttachments == null)
//			throw ErrorPattern.DISK_ATTACHMENT_NOT_FOUND.toException()
//		log.info("/computing/vms/{}/disks/deactivate ... 가상머신 디스크 활성화", vmId)
//		return ResponseEntity.ok(iVmDisk.deactivateMultiFromVm(vmId, diskAttachments))
//	}
//

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 디스크 이동 스토리지 도메인 목록",
		notes="선택된 가상머신의 디스크를 이동할 스토리지 도메인 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachmentId", value="디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/disks/{diskAttachmentId}/storageDomains")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun storageDomains(
		@PathVariable vmId: String? = null,
		@PathVariable diskAttachmentId: String? = null,
	): ResponseEntity<List<StorageDomainVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachmentId.isNullOrEmpty())
			throw ErrorPattern.DISK_ATTACHMENT_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/disks/{} ... 가상머신 디스크 이동 스토리지 목록", vmId, diskAttachmentId)
		return ResponseEntity.ok(iVmDisk.findAllStorageDomains(vmId, diskAttachmentId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 디스크 이동",
		notes="선택된 가상머신의 디스크를 이동한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="diskAttachment", value="디스크", dataTypeClass=DiskAttachmentVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/disks/move")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun move(
		@PathVariable vmId: String? = null,
		@RequestBody diskAttachment: DiskAttachmentVo? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (diskAttachment == null)
			throw ErrorPattern.DISK_ATTACHMENT_VO_INVALID.toException()
		log.info("/computing/vms/{}/disks/move ... 가상머신 디스크 이동", vmId)
		return ResponseEntity.ok(iVmDisk.moveFromVm(vmId, diskAttachment))
	}

	// endregion


	//region: vmSnapshot
	@Autowired private lateinit var iVmSnapshot: ItVmSnapshotService

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 스냅샷 목록",
		notes="선택된 가상머신의 스냅샷 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/snapshots")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun snapshots(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<SnapshotVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/snapshots ... 가상머신 스냅샷 목록", vmId)
		return ResponseEntity.ok(iVmSnapshot.findAllFromVm(vmId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 스냅샷 상세조회",
		notes="선택된 가상머신의 스냅샷을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="snapshotId", value="스냅샷 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{vmId}/snapshots/{snapshotId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun snapshot(
		@PathVariable vmId: String? = null,
		@PathVariable snapshotId: String? = null,
	): ResponseEntity<SnapshotVo> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (snapshotId.isNullOrEmpty())
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/snapshots/{} ... 가상머신 스냅샷 조회", vmId, snapshotId)
		return ResponseEntity.ok(iVmSnapshot.findOneFromVm(vmId, snapshotId))
	}


	@ApiOperation(
		httpMethod="POST",
		value="가상머신 스냅샷 생성",
		notes="가상머신에 스냅샷을 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="snapshot", value="스냅샷", dataTypeClass=SnapshotVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/snapshots")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun addSnapshot(
		@PathVariable vmId: String? = null,
		@RequestBody snapshot: SnapshotVo? = null,
	): ResponseEntity<SnapshotVo?> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (snapshot == null)
			throw ErrorPattern.SNAPSHOT_VO_INVALID.toException()
		log.info("/computing/vms/{}/snapshots ... 가상머신 스냅샷 생성", vmId)
		return ResponseEntity.ok(iVmSnapshot.addFromVm(vmId, snapshot))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="가상머신 스냅샷 삭제",
		notes="가상머신에 있는 스냅샷을 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="snapshotId", value="스냅샷 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{vmId}/snapshots/{snapshotId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun removeSnapshot(
		@PathVariable vmId: String? = null,
		@PathVariable snapshotId: String? = null
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (snapshotId.isNullOrEmpty())
			throw ErrorPattern.SNAPSHOT_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/snapshots/{} ... 가상머신 스냅샷 삭제", vmId, snapshotId)
		return ResponseEntity.ok(iVmSnapshot.removeFromVm(vmId, snapshotId))
	}

//	@ApiOperation(
//		httpMethod="DELETE",
//		value="가상머신 스냅샷 삭제(다중)",
//		notes="가상머신에 있는 스냅샷을 삭제한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
//		ApiImplicitParam(name="snapshotIds", value="스냅샷 ID 목록", dataTypeClass=Array::class, required=true, paramType="body"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 200, message = "OK")
//	)
//	@DeleteMapping("/{vmId}/snapshots")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.OK)
//	fun removeSnapshots(
//		@PathVariable vmId: String? = null,
//		@RequestBody snapshotIds: List<String>? = null
//	): ResponseEntity<Boolean> {
//		if (vmId.isNullOrEmpty())
//			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
//		if (snapshotIds == null)
//			throw ErrorPattern.SNAPSHOT_NOT_FOUND.toException()
//		log.info("/computing/vms/{}/snapshots ... 가상머신 스냅샷 삭제", vmId)
//		return ResponseEntity.ok(iVmSnapshot.removeMultiFromVm(vmId, snapshotIds))
//	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 스냅샷 미리보기",
		notes="선택된 가상머신의 스냅샷 미리보기 기능을 실행한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="snapshotId", value="스냅샷 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/snapshots/{snapshotId}/preview")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun preview(
		@PathVariable vmId: String? = null,
		@PathVariable snapshotId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (snapshotId.isNullOrEmpty())
			throw ErrorPattern.SNAPSHOT_NOT_FOUND.toException()
		log.info("/computing/vms/{}/snapshots/{}/preview ... 가상머신 미리보기", vmId, snapshotId)
		return ResponseEntity.ok(iVmSnapshot.previewFromVm(vmId, snapshotId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 스냅샷 커밋",
		notes="선택된 가상머신의 스냅샷 커밋 기능을 실행한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/snapshots/commit")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun commit(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/snapshots/commit ... 가상머신 커밋", vmId)
		return ResponseEntity.ok(iVmSnapshot.commitFromVm(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 스냅샷 되돌리기",
		notes="선택된 가상머신의 스냅샷 되돌리기 기능을 실행한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/snapshots/undo")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun undo(
		@PathVariable vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/computing/vms/{}/snapshots/undo ... 가상머신 커밋", vmId)
		return ResponseEntity.ok(iVmSnapshot.undoFromVm(vmId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="가상머신 스냅샷 복제",
		notes="선택된 가상머신의 스냅샷 복제 기능을 실행한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="name", value="가상머신 이름", dataTypeClass=String::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{vmId}/snapshots/clone")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun clone(
		@PathVariable vmId: String? = null,
		@RequestBody name: String? = null,
	): ResponseEntity<Boolean> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (name.isNullOrEmpty())
			throw ErrorPattern.VM_NOT_FOUND.toException()
		log.info("/computing/vms/{}/snapshots/clone ... 가상머신 복제", vmId)
		return ResponseEntity.ok(iVmSnapshot.cloneFromVm(vmId, name))
	}


	// endregion


	companion object {
		private val log by LoggerDelegate()
	}
}
