package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.HostNetworkVo
import com.itinfo.rutilvm.api.model.network.HostNicVo
import com.itinfo.rutilvm.api.model.network.NetworkAttachmentVo
import com.itinfo.rutilvm.api.model.storage.HostStorageVo
import com.itinfo.rutilvm.api.model.storage.IscsiDetailVo
import com.itinfo.rutilvm.api.service.computing.ItHostNicService
import com.itinfo.rutilvm.api.service.computing.ItHostOperationService
import com.itinfo.rutilvm.api.service.computing.ItHostService
import com.itinfo.rutilvm.api.service.computing.ItHostStorageService
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Computing", "Host"])
@RequestMapping("/api/v1/computing/hosts")
class HostController {
	@Autowired private lateinit var iHost: ItHostService

	@ApiOperation(
		httpMethod="GET",
		value="호스트 목록 조회",
		notes="전체 호스트 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun hosts(): ResponseEntity<List<HostVo>> {
		log.info("/computing/hosts ... 호스트 목록")
		return ResponseEntity.ok(iHost.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value = "호스트 정보 상세조회",
		notes = "선택된 호스트의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun host(
		@PathVariable hostId: String? = null,
	): ResponseEntity<HostVo?> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{} ... 호스트 상세정보", hostId)
		return ResponseEntity.ok(iHost.findOne(hostId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="호스트 생성",
		notes="호스트를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="host", value="호스트", dataTypeClass=HostVo::class, paramType="body"),
		ApiImplicitParam(name="deployHostedEngine", value="호스트 엔진 배포 작업 여부", dataTypeClass=Boolean::class, paramType="query", defaultValue="false")
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun add(
		@RequestBody host: HostVo? = null,
		@RequestParam(defaultValue = "false") deployHostedEngine: Boolean
	): ResponseEntity<HostVo?> {
		if (host == null)
			throw ErrorPattern.HOST_VO_INVALID.toException()
		log.info("/computing/hosts?deployHostedEngine={} ... 호스트 생성\n{}", deployHostedEngine, host)
		return ResponseEntity.ok(iHost.add(host, deployHostedEngine))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="호스트 편집",
		notes="호스트를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="host", value="호스트", dataTypeClass=HostVo::class, paramType="body")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{hostId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun update(
		@PathVariable hostId: String? = null,
		@RequestBody host: HostVo? = null
	): ResponseEntity<HostVo?> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (host == null)
			throw ErrorPattern.HOST_VO_INVALID.toException()
		log.info("/computing/hosts/{} ... 호스트 편집\n{}", hostId, host)
		return ResponseEntity.ok(iHost.update(host))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="호스트 삭제",
		notes="호스트를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{hostId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable hostId: String? = null,
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{} ... 호스트 삭제", hostId)
		return ResponseEntity.ok(iHost.remove(hostId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="호스트 가상머신 목록",
		notes="선택된 호스트의 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/vms")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vms(
		@PathVariable hostId: String? = null,
	): ResponseEntity<List<VmViewVo>> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/vms ... 호스트 가상머신 목록", hostId)
		return ResponseEntity.ok(iHost.findAllVmsFromHost(hostId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 장치 목록",
		notes="선택된 호스트의 장치 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/devices")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun devices(
		@PathVariable hostId: String? = null,
	): ResponseEntity<List<HostDeviceVo>> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/devices ...  호스트 장치 목록", hostId)
		return ResponseEntity.ok(iHost.findAllHostDevicesFromHost(hostId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 이벤트 목록",
		notes="선택된 호스트의 이벤트 목록을 조회한다")
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/events")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun events(
		@PathVariable hostId: String?
	): ResponseEntity<List<EventVo>> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/events ... 호스트 이벤트 목록", hostId)
		return ResponseEntity.ok(iHost.findAllEventsFromHost(hostId))
	}

	// region: hostNic
	@Autowired private lateinit var iHostNic: ItHostNicService

	@ApiOperation(
		httpMethod="GET",
		value="호스트 네트워크 인터페이스 목록",
		notes="선택된 호스트의 네트워크 인터페이스 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/nics")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun nics(
		@PathVariable hostId: String? = null
	): ResponseEntity<List<HostNicVo>> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/nics ... 호스트 nic 목록", hostId)
		return ResponseEntity.ok(iHostNic.findAllFromHost(hostId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 네트워크 인터페이스 조회",
		notes="선택된 호스트 네트워크 인터페이스를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="nicId", value="네트워크 인터페이스 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/nics/{nicId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun nic(
		@PathVariable hostId: String? = null,
		@PathVariable nicId: String? = null,
	): ResponseEntity<HostNicVo> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (nicId.isNullOrEmpty())
			throw ErrorPattern.NIC_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/nics/{} ... 호스트 nic ", hostId, nicId)
		return ResponseEntity.ok(iHostNic.findOneFromHost(hostId, nicId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 네트워크 목록",
		notes="선택된 호스트의 네트워크 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/networkAttachments")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun networkAttachments(
		@PathVariable hostId: String? = null
	): ResponseEntity<List<NetworkAttachmentVo>> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/networkAttachments ... 호스트 네트워크 목록", hostId)
		return ResponseEntity.ok(iHostNic.findAllNetworkAttachmentsFromHost(hostId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 네트워크 결합",
		notes="선택된 호스트의 네트워크 결합을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="networkAttachmentId", value="네트워크 결합 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/networkAttachments/{networkAttachmentId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun networkAttachment(
		@PathVariable hostId: String? = null,
		@PathVariable networkAttachmentId: String? = null,
	): ResponseEntity<NetworkAttachmentVo> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (networkAttachmentId.isNullOrEmpty())
			throw ErrorPattern.NETWORK_ATTACHMENT_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/networkAttachments/{} ... 호스트 네트워크 목록", hostId, networkAttachmentId)
		return ResponseEntity.ok(iHostNic.findNetworkAttachmentFromHost(hostId, networkAttachmentId))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="호스트 네트워크 결합 편집",
		notes="선택된 호스트의 네트워크 결합을 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="networkAttachmentId", value="네트워크 결합 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="networkAttachmentVo", value="호스트", dataTypeClass=NetworkAttachmentVo::class, paramType="body")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{hostId}/networkAttachments/{networkAttachmentId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun updateNetworkAttachment(
		@PathVariable hostId: String? = null,
		@PathVariable networkAttachmentId: String? = null,
		@RequestBody networkAttachmentVo: NetworkAttachmentVo? = null
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (networkAttachmentId.isNullOrEmpty())
			throw ErrorPattern.NETWORK_ATTACHMENT_ID_NOT_FOUND.toException()
		if (networkAttachmentVo == null)
			throw ErrorPattern.NETWORK_ATTACHMENT_VO_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/networkAttachments/{} ... 호스트 네트워크 편집", hostId, networkAttachmentId)
		return ResponseEntity.ok(iHostNic.updateNetworkAttachmentFromHost(hostId, networkAttachmentId, networkAttachmentVo))
	}


	@ApiOperation(
		httpMethod="DELETE",
		value="호스트 네트워크 결합 삭제",
		notes="선택된 호스트의 네트워크 결합을 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="networkAttachments", value="네트워크 결합목록", dataTypeClass=Array<NetworkAttachmentVo>::class, paramType="body")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{hostId}/networkAttachments")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun deleteNetworkAttachment(
		@PathVariable hostId: String? = null,
		@RequestBody networkAttachmentVos: List<NetworkAttachmentVo>? = null
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (networkAttachmentVos == null)
			throw ErrorPattern.NETWORK_ATTACHMENT_VO_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/networkAttachments ... 호스트 네트워크 삭제", hostId)
		return ResponseEntity.ok(iHostNic.removeNetworkAttachmentsFromHost(hostId, networkAttachmentVos))
	}

	@ApiOperation(
		httpMethod="POST",
		value="호스트 네트워크 인터페이스 본딩",
		notes="선택된 호스트 네트워크 인터페이스를 본딩한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="hostNicVo", value="호스트 네트워크 인터페이스", dataTypeClass=HostNicVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{hostId}/nics//bonding")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun addBonding(
		@PathVariable hostId: String? = null,
		@RequestBody hostNicVo: HostNicVo? = null,
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (hostNicVo == null)
			throw ErrorPattern.BONDING_VO_INVALID.toException()
		log.info("/computing/hosts/{}/nics/bonding ... 호스트 nic 본딩 ", hostId)
		return ResponseEntity.ok(iHostNic.addBondFromHost(hostId, hostNicVo))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="호스트 네트워크 인터페이스 본딩 편집",
		notes="선택된 호스트 네트워크 인터페이스를 본딩을 편집한다 (모드만 편집 가능 / slave 이동과는 다른 작업) "
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="hostNicVo", value="호스트 네트워크 인터페이스", dataTypeClass=HostNicVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{hostId}/nics/bonding")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun updateBondings(
		@PathVariable hostId: String? = null,
		@RequestBody hostNicVo: HostNicVo? = null,
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (hostNicVo == null)
			throw ErrorPattern.BONDING_VO_INVALID.toException()
		log.info("/computing/hosts/{}/nics/bonding ... 호스트 nic 본딩 편집 ", hostId)
		return ResponseEntity.ok(iHostNic.modifiedBondFromHost(hostId, hostNicVo))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="호스트 네트워크 인터페이스 본딩 삭제",
		notes="선택된 호스트 네트워크 인터페이스의 본딩을 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="hostNicVo", value="호스트 네트워크 인터페이스", dataTypeClass=HostNicVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{hostId}/nics/bonding")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun removeBonding(
		@PathVariable hostId: String? = null,
		@RequestBody hostNicVo: HostNicVo? = null,
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (hostNicVo == null)
			throw ErrorPattern.BONDING_VO_INVALID.toException()
		log.info("/computing/hosts/{}/nics/{}/bonding ... 호스트 nic 본딩 삭제 ", hostId, hostNicVo)
		return ResponseEntity.ok(iHostNic.removeBondFromHost(hostId, hostNicVo))
	}

	// 이곳에서 slave연결과 network 등의 모든 작업을 실행할 수 있음
	@ApiOperation(
		httpMethod="POST",
		value="호스트 네트워크 설정",
		notes="선택된 호스트의 네트워크를 설정한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="hostNetworkVo", value="네트워크", dataTypeClass=HostNetworkVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{hostId}/nics/setup")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun setupNetwork(
		@PathVariable hostId: String? = null,
		@RequestBody hostNetworkVo: HostNetworkVo? = null,
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if (hostNetworkVo == null)
			throw ErrorPattern.NETWORK_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/nics/setup ... 호스트 네트워크 생성", hostId)
		return ResponseEntity.ok(iHostNic.setUpNetworksFromHost(hostId, hostNetworkVo))
	}
	// endregion

	// region: operation
	@Autowired private lateinit var iHostOp: ItHostOperationService

	@ApiOperation(
		httpMethod="POST",
		value="호스트 유지보수 모드전환",
		notes="호스트를 유지보수 모드로 전환한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{hostId}/deactivate")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun deactivate(
		@PathVariable hostId: String?
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/deactivate ... 호스트 유지보수", hostId)
		return ResponseEntity.ok(iHostOp.deactivate(hostId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="호스트 활성화 모드전환",
		notes="호스트를 활성화 모드로 전환한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{hostId}/activate")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun activate(
		@PathVariable hostId: String?
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/activate ... 호스트 활성", hostId)
		return ResponseEntity.ok(iHostOp.activate(hostId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="호스트 재시작",
		notes="호스트를 재시작 한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{hostId}/restart")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun restart(
		@PathVariable hostId: String?
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/restart ... 호스트 ssh 재시작", hostId)
		return ResponseEntity.ok(iHostOp.restart(hostId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="호스트 글로벌 HA 활성화",
		notes="호스트를 글로벌 HA 활성화한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{hostId}/activateGlobal")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun activateGlobal(
		@PathVariable hostId: String?
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/activateGlobal ... 호스트 글로벌 HA 활성화", hostId)
		return ResponseEntity.ok(iHostOp.globalHaActivate(hostId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="호스트 글로벌 HA 비활성화",
		notes="호스트를 글로벌 HA 비활성화한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{hostId}/deactivateGlobal")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun deactivateGlobal(
		@PathVariable hostId: String?
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/deactivateGlobal ... 호스트 글로벌 HA 비활성화", hostId)
		return ResponseEntity.ok(iHostOp.globalHaDeactivate(hostId))
	}


	@ApiOperation(
		httpMethod="POST",
		value="호스트 새로고침 모드전환",
		notes="호스트를 새로고침"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{hostId}/refresh")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun refresh(
		@PathVariable hostId: String?
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/refresh ... 호스트 새로고침", hostId)
		return ResponseEntity.ok(iHostOp.refresh(hostId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="호스트 재부팅 확인",
		notes="호스트 재부팅 확인한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="hostId", value="호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping("/{hostId}/commitNetConfig")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun commitNetConfig(
		@PathVariable hostId: String?
	): ResponseEntity<Boolean> {
		if (hostId.isNullOrEmpty())
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/commitNetConfig ... 호스트 재부팅 확인", hostId)
		return ResponseEntity.ok(iHostOp.commitNetConfig(hostId))
	}
	// endregion



	// region: storage
	@Autowired private lateinit var iHostStorage: ItHostStorageService

	@ApiOperation(
		httpMethod="GET",
		value="도메인 - iSCSI 목록",
		notes="도메인 - iSCSI 유형 대상 LUN 목록, 기본적으로 있는 항목 출력. 생성시 사용"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "hostId", value = "호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/iscsis")
	@ResponseBody
	fun iSCSIs(
		@PathVariable("hostId") hostId: String? = null
	): ResponseEntity<List<HostStorageVo>> {
		if (hostId == null)
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/iscsis ... 호스트 iscsis 목록", hostId)
		return ResponseEntity.ok(iHostStorage.findAllIscsiFromHost(hostId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="도메인 - Fibre Channel ",
		notes="도메인 - Fibre Channel 유형 대상 LUN 목록, 기본적으로 있는 항목 출력. 생성시 사용"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "hostId", value = "호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{hostId}/fibres")
	@ResponseBody
	fun fibres(
		@PathVariable("hostId") hostId: String? = null
	): ResponseEntity<List<HostStorageVo>> {
		if (hostId == null)
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/fibres ... 호스트 fibres 목록", hostId)
		return ResponseEntity.ok(iHostStorage.findAllFibreFromHost(hostId))
	}


	@ApiOperation(
		httpMethod="POST",
		value="도메인 - iSCSI 검색 요청",
		notes="도메인 - 주소와 포트로 있는 iscsi 검색 요청. 가져오기에 사용"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "hostId", value = "호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name= "iscsiDetailVo", value="검색(address, port)", dataTypeClass=IscsiDetailVo::class, paramType="body")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{hostId}/searchIscsi")
	@ResponseBody
	fun searchIscsi(
		@PathVariable("hostId") hostId: String? = null,
		@RequestBody iscsiDetailVo: IscsiDetailVo? = null  // 로그인은 나중에(chap 이름, 암호도 들어가야함)
	): ResponseEntity<List<IscsiDetailVo>> {
		if (hostId == null)
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if(iscsiDetailVo == null)
			throw ErrorPattern.DISCOVER_TARGET_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/searchIscsi {} {} ... 호스트 iscsi 검색 목록", hostId, iscsiDetailVo.address, iscsiDetailVo.port)
		return ResponseEntity.ok(iHostStorage.findImportIscsiFromHost(hostId, iscsiDetailVo))
	}

	@ApiOperation(
		httpMethod="POST",
		value="도메인 - Fibre Channel 검색 요청",
		notes="도메인 - Fibre Channel 검색 요청. 가져오기에 사용"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "hostId", value = "호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{hostId}/searchFc")
	@ResponseBody
	fun searchFc(
		@PathVariable("hostId") hostId: String? = null
	): ResponseEntity<List<IdentifiedVo>> {
		if (hostId == null)
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/searchFc ... 호스트 fc 검색 목록", hostId)
		return ResponseEntity.ok(iHostStorage.findUnregisterDomainFromHost(hostId))
	}


	@ApiOperation(
		httpMethod="POST",
		value="도메인 가져오기에 필요한 iSCSI 로그인",
		notes="도메인 가져오기 - iSCSI 요쳥"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "hostId", value = "호스트 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "iscsiDetailVo", value="target, address, port", dataTypeClass=IscsiDetailVo::class, paramType="body")
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{hostId}/iscsiToLogin")
	@ResponseBody
	fun loginISCSI(
		@PathVariable("hostId") hostId: String? = null,
		@RequestBody iscsiDetailVo: IscsiDetailVo? = null
	): ResponseEntity<List<IdentifiedVo>> {
		if (hostId == null)
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		if(iscsiDetailVo == null)
			throw ErrorPattern.DISCOVER_TARGET_NOT_FOUND.toException()
		log.info("/computing/hosts/{}/iscsiToLogin {} {} {} ... 호스트 iscsi 로그인 목록", hostId, iscsiDetailVo.target, iscsiDetailVo.address, iscsiDetailVo.port)
		return ResponseEntity.ok(iHostStorage.loginIscsiFromHost(hostId, iscsiDetailVo))
	}

	// endregion


	companion object {
		private val log by LoggerDelegate()
	}
}
