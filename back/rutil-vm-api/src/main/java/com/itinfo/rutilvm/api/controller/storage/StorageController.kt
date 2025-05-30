package com.itinfo.rutilvm.api.controller.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.DiskProfileVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.model.storage.StorageVo
import com.itinfo.rutilvm.api.service.storage.ItStorageDatacenterService
import com.itinfo.rutilvm.api.service.storage.ItStorageImportService
import com.itinfo.rutilvm.api.service.storage.ItStorageService

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Storage", "Domain"])
@RequestMapping("/api/v1/storages/domains")
class StorageController: BaseController() {
	@Autowired private lateinit var iDomain: ItStorageService
	@Autowired private lateinit var iDomainDatacenter: ItStorageDatacenterService
	@Autowired private lateinit var iDomainImport: ItStorageImportService

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 목록 조회",
		notes="전체 스토리지 도메인 목록을 보여준다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun storageDomains(): ResponseEntity<List<StorageDomainVo>> {
		log.info("/storages/domains ... 스토리지 도메인 목록")
		return ResponseEntity.ok(iDomain.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 목록 (NFS) 조회",
		notes="전체 스토리지 도메인 목록을 보여준다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/nfs")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun nfsStorageDomains(): ResponseEntity<List<StorageVo>> {
		log.info("/storages/domains/nfs ... 스토리지 도메인 목록")
		return ResponseEntity.ok(iDomain.findAllNfs())
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
		httpMethod="POST",
		value="스토리지 도메인 ovf 업데이트",
		notes="선택된 스토리지 도메인을 ovf 업데이트한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{storageDomainId}/updateOvf")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun updateOvf(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/domains/{}/updateOvf ... 스토리지 도메인 ovf 업데이트", storageDomainId)
		return ResponseEntity.ok(iDomain.updateOvfFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 디스크 검사",
		notes="선택된 스토리지 도메인을 디스크 검사한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{storageDomainId}/refreshLun")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun refreshLun(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/domains/{}/refreshLun ... 스토리지 도메인 디스크 검사", storageDomainId)
		return ResponseEntity.ok(iDomain.refreshLunFromStorageDomain(storageDomainId))
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
		return ResponseEntity.ok(iDomainDatacenter.findAllDataCentersFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 활성화된 데이터센터 목록",
		notes="스토리지 도메인 활성화된 데이터센터 목록"
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
		return ResponseEntity.ok(iDomainDatacenter.findAllDataCenterFromStorageDomain())
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 호스트 목록",
		notes="선택된 스토리지 도메인의 데이터센터가 가진 호스트 목록을 조회한다(도메인 삭제시 사용)"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/hosts")
	@ResponseBody
	fun hostsFromStorageDomain(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<HostVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/hosts ... 스토리지 도메인 밑에 붙어있는 데이터센터가 가진 호스트 목록", storageDomainId)
		return ResponseEntity.ok(iDomainDatacenter.findAllHostsFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 연결",
		notes="선택된 스토리지 도메인을 데이터센터에 연결한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "dataCenterId", value = "데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
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
		return ResponseEntity.ok(iDomainDatacenter.attachFromDataCenter(dataCenterId, storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 분리",
		notes="스토리지 도메인 - 데이터센터 분리"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "dataCenterId", value = "데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
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
		return ResponseEntity.ok(iDomainDatacenter.detachFromDataCenter(dataCenterId, storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 활성",
		notes="스토리지 도메인 - 데이터센터 활성 activate"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "dataCenterId", value = "데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
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
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (dataCenterId == null)
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/storages/{}/dataCenters/{}/activate ... 데이터센터 활성", storageDomainId, dataCenterId)
		return ResponseEntity.ok(iDomainDatacenter.activateFromDataCenter(dataCenterId, storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 - 데이터센터 유지보수",
		notes="스토리지 도메인 - 데이터센터 유지보수 maintenance"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "dataCenterId", value = "데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/{storageDomainId}/dataCenters/{dataCenterId}/maintenance")
	@ResponseBody
	fun maintenanceFromDataCenter(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("dataCenterId") dataCenterId: String? = null,
		@RequestParam(defaultValue = "false") ovf: Boolean,
	): ResponseEntity<Boolean> {
		if (dataCenterId == null)
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/{}/dataCenters/{}/maintenance ... 데이터센터 유지보수 maintenance", storageDomainId, dataCenterId)
		return ResponseEntity.ok(iDomainDatacenter.maintenanceFromDataCenter(dataCenterId, storageDomainId, ovf))
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
	): ResponseEntity<List<VmViewVo>> {
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
	fun unregisteredVms(
		@PathVariable("storageDomainId") storageDomainId: String? = null // id=dcId
	): ResponseEntity<List<VmViewVo>> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/domains/{}/vms/unregistered ... 스토리지 도메인 밑에 붙어있는 가상머신 가져오기 목록", storageDomainId)
		return ResponseEntity.ok(iDomainImport.findAllUnregisteredVmsFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 가상머신 가져오기",
		notes="스토리지 도메인 가상머신 가져오기"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "vmId", value = "가상머신 Id", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "vmVo", value = "가상머신", dataTypeClass=VmViewVo::class, required=true, paramType="body"),
		ApiImplicitParam(name = "allowPartialImport", value = "부분허용 여부", dataTypeClass=Boolean::class, required=false, paramType="query"),
		ApiImplicitParam(name = "reassignBadMacs", value = "불량 MAC 재배치 여부", dataTypeClass=Boolean::class, required=false, paramType="query"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("/{storageDomainId}/vms/{vmId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun registerVm(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("vmId") vmId: String? = null,
		@RequestBody vmViewVo: VmViewVo? = null,
		@RequestParam("allowPartialImport") allowPartialImport: Boolean = false,
		@RequestParam("reassignBadMacs") reassignBadMacs: Boolean = false,
	): ResponseEntity<Boolean?> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (vmId == null)
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		if (vmViewVo == null)
			throw ErrorPattern.VM_VO_INVALID.toException()
		log.info("/storages/{}/vms/{} ... 스토리지 도메인 가상머신 불러오기", storageDomainId, vmId)
		return ResponseEntity.ok(iDomainImport.registeredVmFromStorageDomain(storageDomainId, vmViewVo, allowPartialImport, reassignBadMacs))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="스토리지 도메인 가상머신 불러오기 삭제",
		notes="스토리지 도메인 가상머신 불러오기에서 가상머신를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "vmId", value = "가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{storageDomainId}/vms/{vmId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun deleteUnregisteredVm(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("vmId") vmId: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (vmId == null)
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("/storages/{}/vms/{} ... 스토리지 도메인 가상머신 불러오기 삭제", storageDomainId, vmId)
		return ResponseEntity.ok(iDomainImport.removeUnregisteredVmFromStorageDomain(storageDomainId, vmId))
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
		return ResponseEntity.ok(iDomainImport.findAllUnregisteredTemplatesFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="스토리지 도메인 템플릿 가져오기",
		notes="스토리지 도메인 템플릿 가져오기"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "templateId", value = "템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "templateVo", value = "템플릿", dataTypeClass=TemplateVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("/{storageDomainId}/templates/{templateId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun registerTemplate(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("templateId") templateId: String? = null,
		@RequestBody templateVo: TemplateVo? = null,
	): ResponseEntity<Boolean?> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (templateId == null)
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		if (templateVo == null)
			throw ErrorPattern.TEMPLATE_VO_INVALID.toException()
		log.info("/storages/{}/templates/{} ... 스토리지 도메인 템플릿 불러오기", storageDomainId, templateId)
		return ResponseEntity.ok(iDomainImport.registeredTemplateFromStorageDomain(storageDomainId, templateVo))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="스토리지 도메인 템플릿 불러오기 삭제",
		notes="스토리지 도메인 템플릿 불러오기에서 템플릿을 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "templateId", value = "템플릿 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{storageDomainId}/templates/{templateId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun deleteUnregisteredTemplate(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("templateId") templateId: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (templateId == null)
			throw ErrorPattern.TEMPLATE_ID_NOT_FOUND.toException()
		log.info("/storages/{}/vms/{} ... 스토리지 도메인 템플릿 불러오기 삭제", storageDomainId, templateId)
		return ResponseEntity.ok(iDomainImport.removeUnregisteredTemplateFromStorageDomain(storageDomainId, templateId))
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
		return ResponseEntity.ok(iDomainImport.findAllUnregisteredDisksFromStorageDomain(storageDomainId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 디스크 불러오기",
		notes="선택된 스토리지 도메인의 디스크 불러오기 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{storageDomainId}/disks/{diskId}/unregistered")
	@ResponseBody
	fun unregisteredDisk(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("diskId") diskId: String? = null,
	): ResponseEntity<DiskImageVo> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/{}/disks/{}/unregistered ... 스토리지 도메인 밑에 붙어있는 Disk 불러오기", storageDomainId, diskId)
		return ResponseEntity.ok(iDomainImport.findUnregisteredDiskFromStorageDomain(storageDomainId, diskId))
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
		return ResponseEntity.ok(iDomainImport.registeredDiskFromStorageDomain(storageDomainId, diskId))
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
	fun deleteUnregisteredDisk(
		@PathVariable("storageDomainId") storageDomainId: String? = null,
		@PathVariable("diskId") diskId: String? = null,
	): ResponseEntity<Boolean> {
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/{}/disks/{} ... 스토리지 도메인 디스크 불러오기 삭제", storageDomainId, diskId)
		return ResponseEntity.ok(iDomainImport.removeUnregisteredDiskFromStorageDomain(storageDomainId, diskId))
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
		checkDomain(storageDomainId)
		log.info("/storages/{}/events ... Event(s) 목록", storageDomainId)
		return ResponseEntity.ok(iDomain.findAllEventsFromStorageDomain(storageDomainId!!))
	}

	private fun checkDomain(id: String?) {
		if (id.isNullOrEmpty()) throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
