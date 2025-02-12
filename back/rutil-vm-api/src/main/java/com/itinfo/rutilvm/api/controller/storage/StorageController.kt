package com.itinfo.rutilvm.api.controller.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.controller.storage.DiskController.Companion
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.DiskProfileVo
import com.itinfo.rutilvm.api.model.storage.HostStorageVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.service.storage.ItStorageService

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Storage"])
@RequestMapping("/api/v1/storages/domains")
class StorageController: BaseController() {
	@Autowired private lateinit var iDomain: ItStorageService

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 목록 조회",
		notes="전체 스토리지 도메인 목록을 보여준다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping()
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun storageDomains(): ResponseEntity<List<StorageDomainVo>> {
		log.info("/storages/domains ... 스토리지 도메인 목록")
		return ResponseEntity.ok(iDomain.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인",
		notes="선택된 스토리지 도메인의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}")
	@ResponseBody
	fun storageDomain(
		@PathVariable("storageDomainId") storageDomainId: String? = null
	): ResponseEntity<StorageDomainVo> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/domains/{} ... 스토리지 도메인 정보", storageDomainId)
		return ResponseEntity.ok(iDomain.findOne(storageDomainId))
	}


	// 생성
	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 생성",
		notes="스토리지 도메인을 생성"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomain", value = "스토리지도메인", dataTypeClass = StorageDomainVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun addStorageDomain(
		@RequestBody storageDomain: StorageDomainVo? = null,
	): ResponseEntity<StorageDomainVo?> {
		if (storageDomain == null)
			throw ErrorPattern.STORAGE_DOMAIN_VO_INVALID.toException()
		log.info("/storages/domains ... 스토리지 도메인 생성")
		return ResponseEntity.ok(iDomain.add(storageDomain))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 가져오기",
		notes="스토리지 도메인을 가져온다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomain", value = "스토리지도메인", dataTypeClass = StorageDomainVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("/import")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun importStorageDomain(
		@RequestBody storageDomain: StorageDomainVo? = null,
	): ResponseEntity<StorageDomainVo?> {
		if (storageDomain == null)
			throw ErrorPattern.STORAGE_DOMAIN_VO_INVALID.toException()
		log.info("/storages/domains/import ... 스토리지 도메인 가져오기")
		return ResponseEntity.ok(iDomain.import(storageDomain))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="스토리지 도메인 편집",
		notes="선택된 스토리지 도메인을 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "storageDomain", value = "스토리지도메인", dataTypeClass = StorageDomainVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PutMapping("/{storageDomainId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun editStorageDomain(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@RequestBody storageDomain: StorageDomainVo? = null,
	): ResponseEntity<StorageDomainVo?> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (storageDomain == null)
			throw ErrorPattern.STORAGE_DOMAIN_VO_INVALID.toException()
		log.info("/storages/domains/{} ... 스토리지 도메인 편집", storageDomainId)
		return ResponseEntity.ok(iDomain.update(storageDomain))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="스토리지 도메인 삭제",
		notes="선택된 스토리지 도메인을 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{storageDomainId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun deleteStorageDomain(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@RequestParam(defaultValue = "false") format: Boolean,
		@RequestParam("host") hostName: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/domains/{} ... 스토리지 도메인 삭제", storageDomainId)
		log.info("Received delete request: storageDomainId={}, format={}, hostName={}", storageDomainId, format, hostName)
		return ResponseEntity.ok(iDomain.remove(storageDomainId, format, hostName))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="스토리지 도메인 파괴",
		notes="선택된 스토리지 도메인을 파괴한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{storageDomainId}/destroy")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun destroyStorageDomain(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/domains/{} ... 스토리지 도메인 파괴", storageDomainId)
		return ResponseEntity.ok(iDomain.destroy(storageDomainId))
	}


	@ApiOperation(
		httpMethod="GET",

		value="스토리지 도메인 데이터센터 목록",
		notes="선택된 스토리지 도메인의 데이터센터 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/dataCenters")
	@ResponseBody
	fun datacentersFromStorageDomain(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<DataCenterVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/dataCenters ... 스토리지 도메인 밑에 붙어있는 데이터센터 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllDataCentersFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 연결",
		notes="선택된 스토리지 도메인의 데이터센터 연결(??) 말을어캐하지"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{storageDomainId}/dataCenters/{dataCenterId}/attach")
	@ResponseBody
	fun attachFromDataCenter(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("dataCenterId") dataCenterId: String? = null
	): ResponseEntity<Boolean> {
		if (dataCenterId == null)
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/{}/dataCenters/{}/attach ... 데이터센터 연결", storageDomainId, dataCenterId)
		return ResponseEntity.ok(iDomain.attachFromDataCenter(dataCenterId, storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 분리",
		notes="스토리지 도메인 - 데이터센터 분리"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{storageDomainId}/dataCenters/{dataCenterId}/detach")
	@ResponseBody
	fun detachFromDataCenter(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("dataCenterId") dataCenterId: String? = null
	): ResponseEntity<Boolean> {
		if (dataCenterId == null)
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/dataCenters/{}/detach ... 데이터센터 분리 detach", storageDomainId, dataCenterId)
		return ResponseEntity.ok(iDomain.detachFromDataCenter(dataCenterId, storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 활성",
		notes="스토리지 도메인 - 데이터센터 활성 activate"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{storageDomainId}/dataCenters/{dataCenterId}/activate")
	@ResponseBody
	fun activateFromDataCenter(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("dataCenterId") dataCenterId: String? = null
	): ResponseEntity<Boolean> {
		if (dataCenterId == null)
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/dataCenters/{}/activate ... 데이터센터 활성 activate", storageDomainId, dataCenterId)
		return ResponseEntity.ok(iDomain.activateFromDataCenter(dataCenterId, storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 유지보수",
		notes="스토리지 도메인 - 데이터센터 유지보수 maintenance"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{storageDomainId}/dataCenters/{dataCenterId}/maintenance")
	@ResponseBody
	fun maintenanceFromDataCenter(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("dataCenterId") dataCenterId: String? = null
	): ResponseEntity<Boolean> {
		if (dataCenterId == null)
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/dataCenters/{}/maintenance ... 데이터센터 유지보수 maintenance", storageDomainId, dataCenterId)
		return ResponseEntity.ok(iDomain.maintenanceFromDataCenter(dataCenterId, storageDomainId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 가상머신 목록",
		notes="선택된 스토리지 도메인의 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/vms")
	@ResponseBody
	fun vms(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<VmVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/vms ... 스토리지 도메인 밑에 붙어있는 가상머신 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllVmsFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 가상머신 가져오기 목록",
		notes="선택된 스토리지 도메인의 가상머신 가져오기 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/vms/unregistered")
	@ResponseBody
	fun unregisterdVms(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<VmVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/vms/unregistered ... 스토리지 도메인 밑에 붙어있는 가상머신 가져오기 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllUnregisteredVmsFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 디스크 목록",
		notes="선택된 스토리지 도메인의 디스크 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/disks")
	@ResponseBody
	fun disks(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<DiskImageVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/disks ... 스토리지 도메인 밑에 붙어있는 Disk 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllDisksFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 디스크 불러오기 목록",
		notes="선택된 스토리지 도메인의 디스크 불러오기 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/disks/unregistered")
	@ResponseBody
	fun unregisteredDisks(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<DiskImageVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/disks/unregistered ... 스토리지 도메인 밑에 붙어있는 Disk 불러오기 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllUnregisteredDisksFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 디스크 불러오기",
		notes="스토리지 도메인 디스크 불러오기"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("/{storageDomainId}/disks/{diskId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun registerDisk(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("diskId") diskId: String? = null,
	): ResponseEntity<Boolean?> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/{}/disks/{} ... 스토리지 도메인 디스크 불러오기", storageDomainId, diskId)
		return ResponseEntity.ok(iDomain.registeredDiskFromStorageDomain(storageDomainId, diskId))
	}
	@ApiOperation(
		httpMethod="DELETE",
		value="스토리지 도메인 디스크 불러오기 삭제",
		notes="스토리지 도메인 디스크 불러오기에서 디스크를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{storageDomainId}/disks/{diskId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun deleteStorageDomain(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("diskId") diskId: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/{}/disks/{} ... 스토리지 도메인 디스크 불러오기 삭제", storageDomainId, diskId)
		return ResponseEntity.ok(iDomain.removeRegisteredDiskFromStorageDomain(storageDomainId, diskId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 디스크 스냅샷 목록",
		notes="선택된 스토리지 도메인의 디스크 스냅샷 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/diskSnapshots")
	@ResponseBody
	fun diskSnapshots(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<SnapshotDiskVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/diskSnapshots ... 스토리지 도메인 밑에 붙어있는 디스크 스냅샷 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllDiskSnapshotsFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 템플릿 목록",
		notes="선택된 스토리지 도메인의 템플릿 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/templates")
	@ResponseBody
	fun templates(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<TemplateVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/templates ... 스토리지 도메인 밑에 붙어있는 템플릿 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllTemplatesFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 템플릿 가져오기 목록",
		notes="선택된 스토리지 도메인의 템플릿 가져오기 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/templates/unregistered")
	@ResponseBody
	fun unregisteredTemplates(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<TemplateVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/templates/unregistered ... 스토리지 도메인 밑에 붙어있는 템플릿 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllUnregisteredTemplatesFromStorageDomain(storageDomainId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 밑에 붙어있는 디스크 프로파일 목록",
		notes="선택된 스토리지 도메인의 디스크 프로파일 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/diskProfiles")
	@ResponseBody
	fun diskProfiles(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<DiskProfileVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/diskProfiles ... 스토리지 도메인 밑에 붙어있는 디스크 프로파일 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllDiskProfilesFromStorageDomain(storageDomainId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 이벤트 목록",
		notes = "선택된 스토리지 도메인의 이벤트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="storageDomainId", value="스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/events")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	fun events(
		@PathVariable("storageDomainId") storageDomainId: String? = null
	): ResponseEntity<List<EventVo>> {
		if (storageDomainId.isNullOrEmpty())
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/events ... Event(s) 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllEventsFromStorageDomain(storageDomainId))
	}


	@Deprecated("필요없음")
	@ApiOperation(
		httpMethod="GET",
		value="",
		notes="Permission(s) 목록"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="storageDomainId", value="스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/permissions")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	fun permissions(
		@PathVariable storageDomainId: String? = null,
	): ResponseEntity<List<PermissionVo>> {
		if (storageDomainId.isNullOrEmpty())
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/permissions ... Permission(s) 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllPermissionsFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="",
		notes="datacenter 목록"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/dataCenters")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	fun activeDatacenters(
	): ResponseEntity<List<DataCenterVo>> {
		log.info("/storages/datacenters ...")
		return ResponseEntity.ok(iDomain.findAllDataCenterFromStorageDomain())
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
