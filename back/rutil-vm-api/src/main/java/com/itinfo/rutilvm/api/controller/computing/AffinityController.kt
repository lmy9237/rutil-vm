package com.itinfo.rutilvm.api.controller.computing

import com.itinfo.rutilvm.api.controller.BaseController
import io.swagger.annotations.Api
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@Api(tags = ["Computing", "Affinity"])
@RequestMapping("/api/v1/computing/affinity")
class AffinityController: BaseController() {

    /*
	@ApiOperation(
		httpMethod="POST"
		value="클러스터 선호도 그룹 생성",
		notes="선택된 클러스터의 선호도 그룹을 생성한다"
	)
	@ApiImplicitParam(name = "id", value = "클러스터 ID", dataTypeClass=String.class, paramType="path")
	@PostMapping("/{clusterId}/affinitygroups")
	@ResponseBody
    fun addAffinitygroup(
        @PathVariable clusterId: String,
		@RequestBody AffinityGroupCreateVo agVo
	) {
		if (clusterId.isNullOrEmpty())
			throw ErrorPattern.CLUSTER_ID_NOT_FOUND.toException()
		log.info("--- 클러스터 선호도 그룹 생성");
		return affinityService.addAffinityGroup(id, true, agVo);
	}

	//	@GetMapping("/{id}/affinitygroups/{agId}/settings")
	//	@ResponseBody
	//	public AffinityGroupCreateVo setEditAffinitygroup(@PathVariable String id,
	//													  @PathVariable String agId){
	//		log.info("--- 클러스터 선호도 그룹 편집 창");
	//		return affinityService.setAffinityGroup(id, "cluster", agId);
	//	}
	//
	//	@PutMapping("/{id}/affinitygroups/{agId}")
	//	@ResponseBody
	//	public CommonVo<Boolean> editAffinitygroup(@PathVariable String id,
	//											   @RequestBody AffinityGroupCreateVo agVo){
	//		log.info("--- 클러스터 선호도 그룹 편집");
	//		return affinityService.editAffinityGroup(id, agVo);
	//	}
	//
	//	@DeleteMapping("/{id}/affinitygroups/{agId}")
	//	@ResponseBody
	//	public CommonVo<Boolean> deleteAffinitygroup(@PathVariable String id,
	//												 @PathVariable String agId){
	//		log.info("--- 클러스터 선호도 그룹 삭제");
	//		return affinityService.deleteAffinityGroup(id, "cluster",agId);
	//	}

	@ApiOperation(
		httpMethod="GET",
		value="/computing/clusters/{clusterId}/affinitylabels",
		notes="클러스터 선호도 레이블 목록 > 클러스터의 선호도 레이블 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name = "clusterId", value = "클러스터 ID", dataTypeClass=String::class, paramType="path")
	)
	@GetMapping("/{clusterId}/affinitylabels")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun affLabel(): List<AffinityLabelVo> {
		log.info("--- 클러스터 선호도 레이블 목록")
		return affinity.findAllAffinityLabels()
	}

	//	@PostMapping("/cluster/{id}/affinitylabel")
	//	@ResponseBody
	//	@ResponseStatus(HttpStatus.CREATED)
	//	public CommonVo<Boolean> addAff(@PathVariable String id,
	//									@RequestBody AffinityLabelCreateVo alVo) {
	//		log.info("--- 클러스터 선호도 레이블 생성");
	//		return clusterService.addAffinitylabel(id, alVo);
	//	}
	//
	//	@GetMapping("/cluster/{id}/affinitylabel/{alId}")
	//	@ResponseBody
	//	@ResponseStatus(HttpStatus.OK)
	//	public AffinityLabelCreateVo getAffinityLabel(@PathVariable String id,
	//												  @PathVariable String alId){
	//		log.info("--- 클러스터 선호도 레이블 편집창");
	//		return clusterService.getAffinityLabel(id, alId);
	//	}
	//
	//	@PutMapping("/cluster/{id}/affinitylabel/{alId}")
	//	@ResponseBody
	//	@ResponseStatus(HttpStatus.CREATED)
	//	public CommonVo<Boolean> editAff(@PathVariable String id,
	//									 @PathVariable String alId,
	//									 @RequestBody AffinityLabelCreateVo alVo) {
	//		log.info("--- 클러스터 선호도 레이블 편집");
	//		return clusterService.editAffinitylabel(id, alId, alVo);
	//	}
	//
	//	@PostMapping("/cluster/{id}/affinitylabel/{alId}")
	//	@ResponseBody
	//	@ResponseStatus(HttpStatus.OK)
	public CommonVo<Boolean> deleteAff(@PathVariable String id,
									   @PathVariable String alId) {
		log.info("--- 클러스터 선호도 레이블 삭제");
		return clusterService.deleteAffinitylabel(id, alId);
	}

	//region: affinity


	@Autowired private lateinit var iAffinity: ItAffinityService
	@ApiOperation(
		httpMethod="GET",
		value="가상머신의 선호도그룹 목록",
		notes="선택된 가상머신의 선호도그룹 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@GetMapping("/{vmId}/affinitygroups")
	@ResponseBody
	fun findAllGroupsForVm(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<AffinityGroupVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("----- vm affGroup 불러오기: $vmId")
		return ResponseEntity.ok(iAffinity.findAllGroupsForVm(vmId))
	}

	@ApiOperation(
		httpMethod="GET",
		value="가상머신의 선호도레이블 목록",
		notes="선택된 가상머신의 선호도레이블 목록을 조회한다"
	)
	@ApiImplicitParams(
		ApiImplicitParam(name="vmId", value="가상머신 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@GetMapping("/{vmId}/affinitylabels")
	@ResponseBody
	fun findAllLabelsForVm(
		@PathVariable vmId: String? = null,
	): ResponseEntity<List<AffinityLabelVo>> {
		if (vmId.isNullOrEmpty())
			throw ErrorPattern.VM_ID_NOT_FOUND.toException()
		log.info("----- vm affLabel 불러오기: {}", vmId)
		return ResponseEntity.ok(iAffinity.findAllLabelsForVm(vmId))
	}
	//endregion
*/
}