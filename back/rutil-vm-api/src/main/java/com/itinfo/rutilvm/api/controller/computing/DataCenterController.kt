package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.api.model.network.NetworkVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.api.repository.engine.AuditLogSpecificationParam
import com.itinfo.rutilvm.api.service.computing.ItDataCenterService
import com.itinfo.rutilvm.api.service.setting.ItEventService

import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiImplicitParams
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import springfox.documentation.annotations.ApiIgnore

@Controller
@Api(tags = ["Computing", "DataCenter"])
@RequestMapping("/api/v1/computing/datacenters")
class DataCenterController: BaseController() {
	@Autowired private lateinit var iDataCenter: ItDataCenterService

	@ApiOperation(
		httpMethod="GET",
		value="데이터센터 목록 조회",
		notes="전체 데이터센터 목록을 조회한다"
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun datacenters(): ResponseEntity<List<DataCenterVo?>> {
		log.info("/computing/datacenters ... 데이터센터 목록")
		return ResponseEntity.ok(iDataCenter.findAll())
	}

	@ApiOperation(
		httpMethod="GET",
		value="데이터센터 정보 상세조회",
		notes="선택된 데이터센터의 정보를 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun datacenter(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<DataCenterVo?> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{} ... 데이터센터 상세정보", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findOne(dataCenterId))
	}

	@ApiOperation(
		httpMethod="POST",
		value="데이터센터 생성",
		notes="데이터센터를 생성한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenter", value="데이터센터", dataTypeClass=DataCenterVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 201, message = "CREATED"),
		ApiResponse(code = 404, message = "NOT_FOUND")
	)
	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	fun add(
		@RequestBody dataCenter: DataCenterVo? = null
	): ResponseEntity<DataCenterVo?> {
		if (dataCenter == null)
			throw ErrorPattern.DATACENTER_VO_INVALID.toException()
		log.info("/computing/datacenters ... 데이터센터 생성\n{}", dataCenter)
		return ResponseEntity.ok(iDataCenter.add(dataCenter))
	}

	@ApiOperation(
		httpMethod="PUT",
		value="데이터센터 편집",
		notes="데이터센터를 편집한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
		ApiImplicitParam(name="dataCenter", value="데이터센터", dataTypeClass=DataCenterVo::class, paramType="body"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@PutMapping("/{dataCenterId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun update(
		@PathVariable dataCenterId: String? = null,
		@RequestBody dataCenter: DataCenterVo? = null,
	): ResponseEntity<DataCenterVo?> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		if (dataCenter == null)
			throw ErrorPattern.DATACENTER_VO_INVALID.toException()
		log.info("/computing/datacenters/{} ... 데이터센터 편집\n{}", dataCenterId, dataCenter)
		return ResponseEntity.ok(iDataCenter.update(dataCenter))
	}

	@ApiOperation(
		httpMethod="DELETE",
		value="데이터센터 삭제",
		notes="데이터센터를 삭제한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@DeleteMapping("/{dataCenterId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun remove(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<Boolean> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{} ... 데이터센터 삭제", dataCenterId)
		return ResponseEntity.ok(iDataCenter.remove(dataCenterId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="클러스터 목록 조회",
		notes="선택된 데이터센터의 클러스터 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/clusters")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun clusters(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<List<ClusterVo>> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/clusters ... 데이터센터 클러스터 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllClustersFromDataCenter(dataCenterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="호스트 목록 조회",
		notes="선택된 데이터센터의 호스트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/hosts")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun hosts(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<List<HostVo>> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/hosts ... 데이터센터 호스트 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllHostsFromDataCenter(dataCenterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 목록 조회",
		notes="선택된 데이터센터의 가상머신 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/vms")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun vms(
		@PathVariable dataCenterId: String? = null
	): ResponseEntity<List<VmVo>> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/vms ... 데이터센터 가상머신 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllVmsFromDataCenter(dataCenterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="스토리지 도메인 목록 조회",
		notes="선택된 데이터센터의 스토리지 도메인 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/storageDomains")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	fun storageDomains(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<List<StorageDomainVo>> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/storageDomains ... 데이터센터 스토리지 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllStorageDomainsFromDataCenter(dataCenterId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="활성화된 스토리지 도메인 목록",
		notes="선택된 데이터센터의 활성화된 스토리지 도메인 목록 (디스크 생성에 사용)"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/storageDomains/active")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	fun domainsFromDataCenter(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<List<StorageDomainVo>> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/activeDomains ... Domain(s) 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllActiveStorageDomainsFromDataCenter(dataCenterId))
	}


	@ApiOperation(
		httpMethod="GET",
		value="네트워크 목록 조회",
		notes="선택된 데이터센터의 네트워크 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/networks")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun networks(
		@PathVariable dataCenterId: String? = null
	): ResponseEntity<List<NetworkVo>> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/dataCenters/{}/networks ... 데이터센터 네트워크 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllNetworksFromDataCenter(dataCenterId))
	}

	@Autowired private lateinit var iEvent: ItEventService
	@ApiOperation(
		httpMethod="GET",
		value="이벤트 목록조회",
		notes="선택된 데이터센터의 이벤트 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="page", value="보여줄 페이지 번호", dataTypeClass=Int::class, required=false, paramType="query", example="0"),
		ApiImplicitParam(name="size", value="페이지 당 보여줄 개수", dataTypeClass=Int::class, required=false, paramType="query", example="20",),
		ApiImplicitParam(name="datacenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{datacenterId}/events")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun events(
		@ApiIgnore
		@PageableDefault(size=5000, sort=["logTime"], direction= Sort.Direction.DESC) pageable: Pageable,
		@PathVariable datacenterId: String? = null,
	): ResponseEntity<List<EventVo>> {
		if (datacenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/events ... 데이터센터 이벤트 목록: page: {}, size: {}", datacenterId, pageable.pageNumber, pageable.pageSize)
		return ResponseEntity.ok(
			iEvent.findAll(pageable,
				AuditLogSpecificationParam.builder {
					datacenterId { datacenterId }
				}
			).content
		)
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 생성창 - 템플릿(데이터센터Id 기반)",
		notes="해당 데이터센터 내에 있는 템플릿 연결 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/templates")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun templates(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<List<IdentifiedVo>?> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/templates ... 가상머신 생성창 - 템플릿 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllTemplatesFromDataCenter(dataCenterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 생성창 - 디스크 연결 목록 (데이터센터Id 기반)",
		notes="해당 데이터센터 내에 있는 디스크 연결 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/unattachedDiskImages")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun unattachedDiskImages(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<List<DiskImageVo>?> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/unattachedDiskImages ... 가상머신 생성창 - 디스크 연결 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findUnattachedDiskImageFromDataCenter(dataCenterId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신 생성창 - ISO 목록(데이터센터Id 기반)",
		notes="해당 데이터센터 내에 있는 ISO 목록(CD/DVD 연결)을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("/{dataCenterId}/iso")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun iso(
		@PathVariable dataCenterId: String? = null,
	): ResponseEntity<List<IdentifiedVo>?> {
		if (dataCenterId.isNullOrEmpty())
			throw ErrorPattern.DATACENTER_ID_NOT_FOUND.toException()
		log.info("/computing/datacenters/{}/iso ... 가상머신 생성창 - 디스크 연결 목록", dataCenterId)
		return ResponseEntity.ok(iDataCenter.findAllISOFromDataCenter(dataCenterId))
	}

	// @ApiOperation(
	// 	httpMethod="GET",
	// 	value="가상머신 생성창 - vnicProfile 목록",
	// 	notes="가상머신 생성시에 필요한 vnicProfile 목록을 조회한다"
	// )
	// @ApiImplicitParams(
	// 	ApiImplicitParam(name="dataCenterId", value="데이터센터 ID", dataTypeClass=String::class, required=true, paramType="path"),
	// )
	// @ApiResponses(
	// 	ApiResponse(code = 200, message = "OK")
	// )
	// @GetMapping("/{dataCenterId}/vnicProfiles")
	// @ResponseBody
	// @ResponseStatus(HttpStatus.OK)
	// fun vnicProfiles(
	// 	@PathVariable dataCenterId: String? = null,
	// ): ResponseEntity<List<VnicProfileVo>?> {
	// 	if (dataCenterId.isNullOrEmpty())
	// 		throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
	// 	log.info("/computing/dataCenters/{}/vnicProfiles ... 가상머신 생성창 - vnicProfiles 목록", dataCenterId)
	// 	return ResponseEntity.ok(iDataCenter.findAllVnicProfilesFromDataCenter(dataCenterId))
	// }


	companion object {
		private val log by LoggerDelegate()
	}
}
