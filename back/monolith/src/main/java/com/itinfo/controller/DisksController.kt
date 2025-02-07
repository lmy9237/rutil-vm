package com.itinfo.controller

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.DiskCreateVo
import com.itinfo.model.DiskMigrationVo
import com.itinfo.model.DiskVo
import com.itinfo.service.DisksService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.WebsocketService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile


@RestController
@RequestMapping("v2/storage/disks")
@Api(value="DisksController", tags=["disks"])
class DisksController {
	@Autowired private lateinit var disksService: DisksService
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var websocketService: WebsocketService

	@ApiOperation(httpMethod="GET", value="retrieveDisks", notes="디스크 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping
	@ResponseBody
	fun retrieveDisks(): JSONObject {
		log.info("... retrieveDisks")
		val disks: List<DiskVo> =
			disksService.retrieveDisks()
		return asJsonResponse(disks)
	}

	@ApiOperation(httpMethod="POST", value="createDisk", notes="디스크 생성")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/create")
	@ResponseBody
	fun createDisk(
		@RequestBody diskCreateVo: DiskCreateVo
	): JSONObject {
		log.info("... createDisk")
		disksService.createDisk(diskCreateVo)
		doSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="POST", value="createLunDisk", notes="LUN 디스크 생성")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/lun/create")
	@ResponseBody
	fun createLunDisk(
		@RequestBody diskCreateVo: DiskCreateVo
	): JSONObject {
		log.info("... createLunDisk")
		disksService.createLunDisk(diskCreateVo)
		doSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="DELETE", value="removeDisk", notes="디스크 제거")
	@ApiImplicitParams(
		ApiImplicitParam(name="diskIds", value="제거할 디스크 ID", required=true, paramType="body", dataTypeClass=Array<String>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@DeleteMapping
	@ResponseBody
	fun removeDisk(
		@RequestBody diskIds: List<String>
	): JSONObject {
		log.info("... removeDisk[${diskIds.size}]")
		disksService.removeDisk(diskIds)
		doSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="POST", value="migrationDisk", notes="디스크 이관")
	@ApiImplicitParams(
		ApiImplicitParam(name="diskMigrationVo", value="이관할 디스크", required=true, paramType="body", dataTypeClass=DiskMigrationVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/migrate")
	@ResponseBody
	fun migrationDisk(
		@RequestBody diskMigrationVo: DiskMigrationVo,
	): JSONObject {
		log.info("... migrationDisk")
		disksService.migrationDisk(diskMigrationVo)
		doSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="POST", value="uploadDisk", notes="디스크 이관")
	@ApiImplicitParams(
		ApiImplicitParam(name="file", value="업로드 할 디스크 파일", required=true, paramType="body", dataTypeClass=MultipartFile::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@Async("karajanTaskExecutor")
	@PostMapping("/upload")
	@ResponseBody
	fun uploadDisk(
		@RequestParam("file") diskFile: MultipartFile,
		diskCreateVo: DiskCreateVo
	): JSONObject {
		// TODO 실행 확인 후 구현 완료
		try {
			val bytes = diskFile.bytes
			val `is` = diskFile.inputStream
			val diskSize = diskFile.size
			disksService.uploadDisk(bytes, diskCreateVo, `is`, diskSize)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.fillInStackTrace()
		}
		doSleep()
		return asJsonResponse("OK")
	}

	@ApiOperation(httpMethod="GET", value="retrieveDiskImage", notes="디스크 이미지 정보 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="file", value="업로드 할 디스크 파일", required=true, paramType="body", dataTypeClass=MultipartFile::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@Async("karajanTaskExecutor")
	@GetMapping("image")
	@ResponseBody
	fun retrieveDiskImage(@RequestParam("file") diskFile: MultipartFile?): JSONObject {
		// TODO: 구현 내용 추가
		return asJsonResponse("OK")
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}