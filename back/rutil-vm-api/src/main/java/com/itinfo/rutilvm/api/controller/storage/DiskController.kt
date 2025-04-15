package com.itinfo.rutilvm.api.controller.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.error.IdNotFoundException
import com.itinfo.rutilvm.api.error.InvalidRequestException
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.VmViewVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.service.storage.ItDiskService

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.HTTP_VERSION_NOT_SUPPORTED
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Mono
import java.io.IOException

@Controller
@Api(tags = ["Storage", "Disk"])
@RequestMapping("/api/v1/storages/disks")
class DiskController: BaseController() {
	@Autowired private lateinit var iDisk: ItDiskService

	@ApiOperation(
		httpMethod="GET",
		value="디스크 목록",
		notes="전체 디스크 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun disks(
	): ResponseEntity<List<DiskImageVo>> {
		log.info("/storages/disks ... 디스크 목록")
		return ResponseEntity.ok(iDisk.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="디스크 목록(simple)",
		notes="전체 디스크 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/simple")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun simpleDisks(
	): ResponseEntity<List<DiskImageVo>> {
		log.info("/storages/disks/simple ... 디스크 목록")
		return ResponseEntity.ok(iDisk.findAllId())
	}

	@ApiOperation(
		httpMethod="GET",
		value="디스크가 가진 연결 목록",
		notes="전체 디스크 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크이미지 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{diskId}/cdRoms")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findAllCdRomsFromDisk(
		@PathVariable diskId: String? = null,
	): ResponseEntity<List<IdentifiedVo>> {
		log.info("/storages/disks/{}/cdRoms ... cdroms", diskId)
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		return ResponseEntity.ok(iDisk.findAllCdRomsFromDisk(diskId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="디스크의 정보 상세조회",
		notes="선택된 디스크의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크이미지 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{diskId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun disk(
		@PathVariable diskId: String? = null,
	): ResponseEntity<DiskImageVo> {
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/disks/{} ... 디스크", diskId)
		return ResponseEntity.ok(iDisk.findOne(diskId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="디스크 생성",
		notes="디스크 이미지를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskImage", value = "디스크이미지", dataTypeClass = DiskImageVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping()
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun addDiskImage(
		@RequestBody diskImage: DiskImageVo? = null,
	): ResponseEntity<DiskImageVo?> {
		if (diskImage == null)
			throw ErrorPattern.DISK_VO_INVALID.toException()
		log.info("/disks ... 디스크 이미지 생성")
		return ResponseEntity.ok(iDisk.add(diskImage))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="디스크 편집",
		notes="디스크 이미지를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크이미지 ID", dataTypeClass = String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "diskImage", value = "디스크이미지", dataTypeClass = DiskImageVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PutMapping("/{diskId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun editDiskImage(
		@PathVariable diskId: String? = null,
		@RequestBody diskImage: DiskImageVo?
	): ResponseEntity<DiskImageVo?> {
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		if (diskImage == null)
			throw ErrorPattern.DISK_VO_INVALID.toException()
		log.info("/storages/disks/{} ... 디스크 이미지 편집", diskId)
		return ResponseEntity.ok(iDisk.update(diskImage))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="디스크 삭제",
		notes="디스크 이미지를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크이미지 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{diskId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable diskId: String? = null,
	): ResponseEntity<Boolean> {
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/disks/{} ... 디스크 이미지 삭제", diskId)
		return ResponseEntity.ok(iDisk.remove(diskId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="디스크 이동창 - 스토리지 도메인 목록",
		notes="선택된 디스크를 이동할 스토리지 도메인 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{diskId}/move")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findAllStorageDomainsToMoveFromDisk(
		@PathVariable diskId: String? = null,
	): ResponseEntity<List<StorageDomainVo>> {
		if (diskId == null)
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/disks/{}/move ... 스토리지 도메인 목록 목록", diskId)
		return ResponseEntity.ok(iDisk.findAllStorageDomainsToMoveFromDisk(diskId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="디스크 이동",
		notes="디스크 이미지를 이동한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass = String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("/{diskId}/move/{storageDomainId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun moveDisk(
		@PathVariable diskId: String? = null,
		@PathVariable storageDomainId: String? = null,
	): ResponseEntity<Boolean> {
		if (diskId.isNullOrEmpty())
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		if (storageDomainId == null)
			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
		log.info("/storages/disks/{}/move ... 디스크 - 이동", diskId)
		return ResponseEntity.ok(iDisk.move(diskId, storageDomainId))
	}


	@ApiOperation(
		httpMethod="POST",
		value="디스크 이미지 복사",
		notes="디스크 이미지를 복사한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass = String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "diskImage", value = "디스크이미지", dataTypeClass = DiskImageVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("/{diskId}/copy")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun copyDisk(
		@PathVariable diskId: String? = null,
		@RequestBody diskImage: DiskImageVo? = null,
	): ResponseEntity<Boolean> {
		if (diskId.isNullOrEmpty())
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		if (diskImage == null)
			throw ErrorPattern.DISK_VO_INVALID.toException()
		log.info("/storages/disks/{}/copy ... 디스크 - 복사", diskId)
		return ResponseEntity.ok(iDisk.copy(diskImage))
	}

	@ApiOperation(
		httpMethod="POST",
		value="디스크 업로드",
		notes="디스크 업로드를 업로드 한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "file", value = "파일", dataTypeClass = MultipartFile::class, required=true, paramType="body"),
		ApiImplicitParam(name = "diskImage", value = "디스크이미지", dataTypeClass = DiskImageVo::class, required=true, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PostMapping("/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	@Throws(IdNotFoundException::class, InvalidRequestException::class, IOException::class)
	fun uploadDisk(
		@RequestPart diskImage: DiskImageVo?,
		@RequestPart file: MultipartFile,
	): Mono<ResponseEntity<Boolean>> {
		log.info("/storages/disks/upload ... 업로드")
		if (diskImage == null)
			throw ErrorPattern.DISK_VO_INVALID.toException()
		log.info("Received diskImage: {}", diskImage)

		return Mono.fromRunnable<ResponseEntity<Boolean>?> {
			iDisk.upload(file, diskImage)
		}.then(Mono.just(ResponseEntity.ok(true))).onErrorResume {
			Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false))
		}
	}


	@ApiOperation(
		httpMethod="POST",
		value="디스크 LUN 새로고침",
		notes="디스크 LUN을 새로고침한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass = String::class, required=true, paramType="path"),
		ApiImplicitParam(name = "hostId", value = "호스트 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED")
	)
	@PostMapping("/{diskId}/refreshLun")
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun refreshLun(
		@PathVariable diskId: String? = null,
		@PathVariable hostId: String? = null,
	): ResponseEntity<Boolean> {
		if (diskId.isNullOrEmpty())
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		if (hostId == null)
			throw ErrorPattern.HOST_ID_NOT_FOUND.toException()
		log.info("/storages/disks/{}/refreshLun ... refreshLun", diskId)
		return ResponseEntity.ok(iDisk.refreshLun(diskId, hostId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="디스크 가상머신 목록",
		notes="선택된 디스크의 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{diskId}/vms")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	fun vms(
		@PathVariable diskId: String? = null,
	): ResponseEntity<List<VmViewVo>> {
		if (diskId.isNullOrEmpty())
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/disks/{}/vms ... ", diskId)
		return ResponseEntity.ok(iDisk.findAllVmsFromDisk(diskId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="디스크 스토리지 도메인 목록",
		notes="선택된 디스크의 스토리지 도메인 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "diskId", value = "디스크 ID", dataTypeClass = String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{diskId}/storageDomains")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	fun storageDomains(
		@PathVariable diskId: String? = null,
	): ResponseEntity<List<StorageDomainVo>> {
		if (diskId.isNullOrEmpty())
			throw ErrorPattern.DISK_ID_NOT_FOUND.toException()
		log.info("/storages/disks/{}/storageDomains ... ", diskId)
		return ResponseEntity.ok(iDisk.findAllStorageDomainsFromDisk(diskId))
	}


//	@ApiOperation(
//		httpMethod="GET",
//		value="데이터센터 스토리지 도메인 목록",
//		notes="선택된 데이터센터의 스토리지 도메인 목록을 조회한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name = "dataCenterId", value = "데이터센터 ID", dataTypeClass = String::class, required=true, paramType="path"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 200, message = "OK")
//	)
//	@GetMapping("/{dataCenterId}")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.OK)
//	fun storageDomainsFromDataCenter(
//		@PathVariable dataCenterId: String? = null,
//	): ResponseEntity<List<StorageDomainVo>> {
//		if (dataCenterId == null)
//			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
//		log.info("/storages/disks/{} ... 스토리지 도메인 목록", dataCenterId)
//		return ResponseEntity.ok(iDisk.findAllDomainsFromDataCenter(dataCenterId))
//	}

//	@ApiOperation(
//		httpMethod="GET",
//		value="스토리지 도메인 디스크 프로파일 목록",
//		notes="선택된 스토리지 도메인의 디스크 프로파일 목록을 조회한다"
//	)
//	@ApiImplicitParams(
//		ApiImplicitParam(name = "storageDomainId", value = "스토리지 도메인 ID", dataTypeClass = String::class, required=true, paramType="path"),
//	)
//	@ApiResponses(
//		ApiResponse(code = 200, message = "OK")
//	)
//	@GetMapping("/{storageDomainId}")
//	@ResponseBody
//	@ResponseStatus(HttpStatus.OK)
//	fun diskProfilesFromStorageDomains(
//		@PathVariable storageDomainId: String? = null,
//	): ResponseEntity<List<DiskProfileVo>> {
//		if (storageDomainId == null)
//			throw ErrorPattern.STORAGE_DOMAIN_ID_NOT_FOUND.toException()
//		log.info("/storages/disks/{} ... 디스크 프로파일 목록", storageDomainId)
//		return ResponseEntity.ok(iDisk.findAllDiskProfilesFromStorageDomain(storageDomainId))
//	}


	companion object {
		private val log by LoggerDelegate()
	}
}
