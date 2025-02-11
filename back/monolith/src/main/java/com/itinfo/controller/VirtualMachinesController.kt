package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.model.*
import com.itinfo.service.SystemPropertiesService
import com.itinfo.service.VirtualMachinesService

import io.swagger.annotations.*

import org.json.simple.JSONObject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("compute")
@Api(value="VirtualMachinesController", tags=["virtual-machines"])
class VirtualMachinesController {
	@Autowired private lateinit var virtualMachinesService: VirtualMachinesService
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService

	@ApiOperation(httpMethod="GET", value="retrieveVms", notes="가상머신 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="status", value="가상머신 상태", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vmList")
	@ResponseBody
	fun retrieveVms(
		@RequestParam(name="status") status: String,
	): JSONObject {
		log.info("... retrieveVms('$status')")
		val vms: List<VmVo> =
			if ((status == "all")) virtualMachinesService.retrieveVmsAll()
			else virtualMachinesService.retrieveVms(status)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = vms
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveVmsHosts", notes="가상머신의 호스트 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vmList/hosts")
	@ResponseBody
	fun retrieveVmsHosts(): JSONObject {
		log.info("... retrieveVmsHosts")
		val hosts: List<HostVo> =
			virtualMachinesService.retrieveVmsHosts()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = hosts
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveVmsClusters", notes="가상머신의 클러스터 목록 조회")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vmList/clusters")
	@ResponseBody
	fun retrieveVmsClusters(): JSONObject {
		log.info("... retrieveVmsClusters")
		val clusters: List<ClusterVo> =
			virtualMachinesService.retrieveVmsClusters()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = clusters
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveVm", notes="가상머신 상세 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="가상머신 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vmDetail")
	@ResponseBody
	fun retrieveVm(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveVm('$id')")
		val vm: VmVo =
			virtualMachinesService.retrieveVm(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = vm
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveVmNetworkInterface", notes="가상머신 네트워크 인터페이스 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="가상머신 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/nic")
	@ResponseBody
	fun retrieveVmNetworkInterface(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveVmNetworkInterface('$id')")
		val vmNics: List<VmNicVo> =
			virtualMachinesService.retrieveVmNics(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = vmNics
		}
	}

	@ApiOperation(httpMethod="POST", value="createVmNic", notes="가상머신 네트워크 생성")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmNicVo", value="생성할 VM 네트워크 정보", required=true,  paramType="body", dataTypeClass=VmNicVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/vm/createVmNic")
	@ResponseBody
	fun createVmNic(
		@RequestBody vmNicVo: VmNicVo,
	): JSONObject {
		log.info("... createVmNic")
		virtualMachinesService.createVmNic(vmNicVo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="reMoveVmNic", notes="가상머신 네트워크 삭제")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmNicVo", value="삭제할 VM 네트워크 정보", required=true, paramType="body", dataTypeClass=VmNicVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/vm/removeVmNic")
	@ResponseBody
	fun reMoveVmNic(
		@RequestBody vmNicVo: VmNicVo,
	): JSONObject {
		log.info("... reMoveVmNic")
		virtualMachinesService.removeVmNic(vmNicVo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="POST", value="updateVmNic", notes="가상머신 네트워크 편집")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmNicVo", value="편집할 VM 네트워크 정보", required=true, paramType="body", dataTypeClass=VmNicVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/vm/updateVmNic")
	@ResponseBody
	fun updateVmNic(
		@RequestBody vmNicVo: VmNicVo,
	): JSONObject {
		log.info("... updateVmNic")
		virtualMachinesService.updateVmNic(vmNicVo)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveVmDisks", notes="가상머신 디스크 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="가상머신 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/disks")
	@ResponseBody
	fun retrieveVmDisks(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveVmDisks('$id')")
		val list: List<DiskVo> =
			virtualMachinesService.retrieveDisks(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = list
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveVmSnapshots", notes="가상머신 스냅샷 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="가상머신 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/snapshots")
	@ResponseBody
	fun retrieveVmSnapshots(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveVmSnapshots('$id')")
		val list = virtualMachinesService.retrieveVmSnapshots(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = list
		}
	}

	@ApiOperation(httpMethod="GET", value="retrieveVmDevices", notes="가상머신 장치정보 목록 조회")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="가상머신 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/devices")
	@ResponseBody
	fun retrieveVmDevices(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveVmDevices('$id')")
		val list: List<VmDeviceVo> =
			virtualMachinesService.retrieveVmDevices(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = list
		}
	}

	@ApiOperation(value="retrieveVmEvents", notes="가상머신 이벤트 목록 조회", httpMethod="GET")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="가상머신 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@GetMapping("/vm/events")
	@ResponseBody
	fun retrieveVmEvents(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... retrieveVmEvents('$id')")
		val list: List<EventVo> =
			virtualMachinesService.retrieveVmEvents(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = list
		}
	}

	@ApiOperation(value="startVm", notes="가상머신 기동", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vms", value="기동 할 가상머신", required=true, paramType="body", dataTypeClass=Array<VmVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/startVm")
	@ResponseBody
	fun startVm(
		@RequestBody vms: List<VmVo>,
	): JSONObject {
		log.info("... startVm[${vms.size}]")
		virtualMachinesService.startVm(vms)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="stopVm", notes="가상머신 정지", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vms", value="정지할 가상머신", required=true, paramType="body", dataTypeClass=Array<VmVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/stopVm")
	@ResponseBody
	fun stopVm(
		@RequestBody vms: List<VmVo>,
	): JSONObject {
		log.info("... stopVm[{}]", vms.size)
		virtualMachinesService.stopVm(vms)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="rebootVm", notes="가상머신 재기동", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vms", value="재기동 가상머신", required=true, paramType="body", dataTypeClass=Array<VmVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/rebootVm")
	@ResponseBody
	fun rebootVm(
		@RequestBody vms: List<VmVo>,
	): JSONObject {
		log.info("... rebootVm[${vms.size}]")
		virtualMachinesService.rebootVm(vms)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="suspendVm", notes="VM 일시정지", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vms", value="일시정지 할 가상머신", required=true, paramType="body", dataTypeClass=Array<VmVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/suspendVm")
	@ResponseBody
	fun suspendVm(
		@RequestBody vms: List<VmVo>,
	): JSONObject {
		log.info("... suspendVm[${vms.size}]")
		virtualMachinesService.suspendVm(vms)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="removeVm", notes="가상머신 삭제", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vms", value="삭제 할 가상머신", required=true, paramType="body", dataTypeClass=Array<VmVo>::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/removeVm")
	@ResponseBody
	fun removeVm(
		@RequestBody vms: List<VmVo>,
	): JSONObject {
		log.info("... removeVm[${vms.size}]")
		virtualMachinesService.removeVm(vms)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="checkDuplicateName", notes="가상머신 이름 중복 여부 확인", httpMethod="GET")
	@ApiImplicitParams(
		ApiImplicitParam(name="name", value="가상머신 이름", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/checkDuplicateName")
	@ResponseBody
	fun checkDuplicateName(
		@RequestParam(name="name") name: String,
	): JSONObject {
		log.info("... checkDuplicateName('$name')")
		val result: Boolean =
			virtualMachinesService.checkDuplicateName(name)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}

	@ApiOperation(value="checkDuplicateDiskName", notes="가상머신 디스크 이름 중복 여부 확인", httpMethod="GET")
	@ApiImplicitParams(
		ApiImplicitParam(name="name", value="가상머신 디스크 이름", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/createVm/checkDuplicateDiskName")
	@ResponseBody
	fun checkDuplicateDiskName(
		@RequestBody(required=true) disk: DiskVo,
	): JSONObject {
		log.info("... checkDuplicateDiskName")
		val result: Boolean =
			virtualMachinesService.checkDuplicateDiskName(disk)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = result
		}
	}

	@ApiOperation(value="createVmInfo", notes="가상머신 생성 정보 조회", httpMethod="GET")
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/createVm/info")
	@ResponseBody
	fun createVmInfo(): JSONObject {
		log.info("... createVmInfo")
		val vmCreate: VmCreateVo =
			virtualMachinesService.retrieveVmCreateInfo()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = vmCreate
		}
	}

	@ApiOperation(value="createVm", notes="가상머신 생성", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmCreate", value="생성 할 VM 정보", paramType="body", dataTypeClass=VmCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/createVm")
	@ResponseBody
	fun createVm(
		@RequestBody vmCreate: VmCreateVo,
	): JSONObject {
		log.info("... createVm")
		virtualMachinesService.createVm(vmCreate)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="updateVmInfo", notes="가상머신 편집 정보 조회", httpMethod="GET")
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/updateVm/info")
	@ResponseBody
	fun updateVmInfo(
		@RequestParam(name="id") id: String,
	): JSONObject {
		log.info("... updateVmInfo('$id')")
		val vmCreate: VmCreateVo? =
			virtualMachinesService.retrieveVmUpdateInfo(id)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = vmCreate
		}
	}

	@ApiOperation(value="updateVm", notes="가상머신 편집", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmCreate", value="편집 할 VM 정보", paramType="body", dataTypeClass=VmCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/updateVm")
	@ResponseBody
	fun updateVm(
		@RequestBody vmUpdate: VmCreateVo,
	): JSONObject {
		log.info("... updateVm")
		virtualMachinesService.updateVm(vmUpdate)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="cloneVmInfo", notes="복제할 VM 정보 조회", httpMethod="GET")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class),
		ApiImplicitParam(name="snapshotId", value="가상머신 스냅샷 아이디", dataTypeClass=String::class),
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/cloneVm/info")
	@ResponseBody
	fun cloneVmInfo(
		@RequestParam(name="vmId") vmId: String,
		@RequestParam(name="snapshotId") snapshotId: String,
	): JSONObject {
		log.info("... cloneVmInfo('$vmId')")
		val vmCreate =
			virtualMachinesService.retrieveVmCloneInfo(vmId, snapshotId)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = vmCreate
		}
	}

	@ApiOperation(httpMethod="POST", value="cloneVm", notes="가상머신 복제")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmCreate", value="복제 할 VM", paramType="body", dataTypeClass=VmCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/cloneVm")
	@ResponseBody
	fun cloneVm(
		@RequestBody vmCreate: VmCreateVo,
	): JSONObject {
		log.info("... cloneVm")
		virtualMachinesService.cloneVm(vmCreate)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="recommendHosts", notes="추천 할 호스트?", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmCreate", value="복제 할 VM", paramType="body", dataTypeClass=VmCreateVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/createVm/recommendHosts")
	@ResponseBody
	fun recommendHosts(
		@RequestBody vmCreate: VmCreateVo,
	): JSONObject {
		log.info("... recommendHosts")
		val recommendHosts: List<Array<String>> =
			virtualMachinesService.recommendHosts(vmCreate)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = recommendHosts
		}
	}

	@ApiOperation(value="retrieveDisks", notes="디스크 목록 조회", httpMethod="GET")
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/createVm/disks")
	@ResponseBody
	fun retrieveDisks(): JSONObject {
		log.info("... retrieveDisks")
		val disks: List<DiskVo> =
			virtualMachinesService.retrieveDisks()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = disks
		}
	}

	@ApiOperation(value="retrieveDiskProfiles", notes="디스크 프로필 목록 조회", httpMethod="GET")
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@GetMapping("/retrieveDiskProfiles")
	@ResponseBody
	fun retrieveDiskProfiles(): JSONObject {
		log.info("... retrieveDiskProfiles")
		val diskProfiles: List<DiskProfileVo> =
			virtualMachinesService.retrieveDiskProfiles()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = diskProfiles
		}
	}

	@ApiOperation(value="createSnapshot", notes="스냅샷 생성", httpMethod="GET")
	@ApiImplicitParams(
		ApiImplicitParam(name="snapshot", value="생성할 스냅샷 정보", paramType="body", dataTypeClass=SnapshotVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/vm/createSnapshot")
	@ResponseBody
	fun createSnapshot(
		@RequestBody snapshot: SnapshotVo,
	): JSONObject {
		log.info("... createSnapshot")
		virtualMachinesService.createSnapshot(snapshot)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="previewSnapshot", notes="스냅샷 미리보기", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="snapshot", value="미리보기할 스냅샷 정보", paramType="body", dataTypeClass=SnapshotVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/vm/previewSnapshot")
	@ResponseBody
	fun previewSnapshot(
		@RequestBody snapshot: SnapshotVo,
	): JSONObject {
		log.info("... previewSnapshot")
		virtualMachinesService.previewSnapshot(snapshot)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="commitSnapshot", notes="스냅샷 커밋", httpMethod="GET")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/commitSnapshot")
	@ResponseBody
	fun commitSnapshot(
		@RequestParam(name="vmId") vmId: String,
	): JSONObject {
		log.info("... commitSnapshot('$vmId')")
		virtualMachinesService.commitSnapshot(vmId)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="undoSnapshot", notes="스냅샷 복구", httpMethod="GET")
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/undoSnapshot")
	@ResponseBody
	fun undoSnapshot(
		@RequestParam(name="vmId") vmId: String,
	): JSONObject {
		log.info("... undoSnapshot('$vmId')")
		virtualMachinesService.undoSnapshot(vmId)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="removeSnapshot", notes="스냅샷 제거", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="snapshot", value="스냅샷 정보", paramType="body", dataTypeClass=SnapshotVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/vm/removeSnapshot")
	@ResponseBody
	fun removeSnapshot(
		@RequestBody snapshot: SnapshotVo,
	): JSONObject {
		log.info("... removeSnapshot")
		virtualMachinesService.removeSnapshot(snapshot)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="retrieveDiscs", notes="디스크 목록 조회", httpMethod="GET")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/discs")
	@ResponseBody
	fun retrieveDiscs(): JSONObject {
		log.info("... retrieveDiscs")
		val discs: List<StorageDomainVo> =
			virtualMachinesService.retrieveDiscs()
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = discs
		}
	}

	@ApiOperation(value="changeDisc", notes="디스크 교체", httpMethod="POST")
	@ApiImplicitParams(
		ApiImplicitParam(name="vm", value="가상머신 정보", paramType="body", dataTypeClass=VmVo::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@PostMapping("/changeDisc")
	@ResponseBody
	fun changeDisc(
		@RequestBody vm: VmVo,
	): JSONObject {
		log.info("... changeDisc")
		virtualMachinesService.changeDisc(vm)
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = "OK"
		}
	}

	@ApiOperation(value="retrieveEngineIp", notes="엔진 IP 조회", httpMethod="GET")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/retrieveEngineIp")
	@ResponseBody
	fun retrieveEngineIp(): JSONObject {
		log.info("... retrieveEngineIp")
		val engineIp: String =
			systemPropertiesService.retrieveSystemProperties().ovirtIp
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = engineIp
		}
	}

	@ApiOperation(value="getGrafanaUri", notes="???", httpMethod="POST")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@GetMapping("/vm/metrics/uri")
	@ResponseBody
	fun getGrafanaUri(): JSONObject {
		log.info("... getGrafanaUri")
		return JSONObject().apply {
			this[ItInfoConstant.RESULT_KEY] = systemPropertiesService.retrieveSystemProperties().grafanaUri
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
