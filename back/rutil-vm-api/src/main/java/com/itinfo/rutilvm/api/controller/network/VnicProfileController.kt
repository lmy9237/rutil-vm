package com.itinfo.rutilvm.api.controller.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.controller.BaseController
import com.itinfo.rutilvm.api.controller.network.NetworkController.Companion
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.network.NetworkVo
import com.itinfo.rutilvm.api.model.network.VnicProfileVo
import com.itinfo.rutilvm.api.service.network.ItVnicProfileService
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@Api(tags = ["Network", "VnicProfile"])
@RequestMapping("/api/v1/vnicProfiles")
class VnicProfileController: BaseController() {
    @Autowired private lateinit var iVnic: ItVnicProfileService

    @ApiOperation(
        httpMethod="GET",
        value="전체 vnicProfile 목록 조회",
        notes="전체 vnicProfile 목록을 조회한다"
    )
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @GetMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    fun vnicProfiles(): ResponseEntity<List<VnicProfileVo>> {
        log.info("/vnicProfiles ... 네트워크 목록")
        return ResponseEntity.ok(iVnic.findAll())
    }

    @ApiOperation(
        httpMethod="GET",
        value="vnic 프로파일 상세정보",
        notes="선택된 vnic 프로파일의 상세정보를 조회한다"
    )
    @ApiImplicitParams(
        ApiImplicitParam(name="vnicProfileId", value="Vnic Profile ID", dataTypeClass=String::class, required=true, paramType="path"),
    )
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @GetMapping("/{vnicProfileId}")
    @ResponseBody
    fun vnic(
        @PathVariable vnicProfileId: String? = null,
    ): ResponseEntity<VnicProfileVo?> {
        if (vnicProfileId.isNullOrEmpty())
            throw ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND.toException()
        log.info("/vnicProfiles/{} ... 네트워크 vnic profile", vnicProfileId)
        return ResponseEntity.ok(iVnic.findOne(vnicProfileId))
    }


    @ApiOperation(
        httpMethod="POST",
        value="vnic 프로파일 생성",
        notes="vnic 프로파일을 생성한다"
    )
    @ApiImplicitParams(
        ApiImplicitParam(name="networkId", value="네트워크 ID", dataTypeClass=String::class, required=true, paramType="path"),
        ApiImplicitParam(name="vnicProfile", value="Vnic Profile", dataTypeClass=VnicProfileVo::class, required=true, paramType="body")
    )
    @ApiResponses(
        ApiResponse(code = 201, message = "CREATED"),
        ApiResponse(code = 404, message = "NOT_FOUND")
    )
    @PostMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    fun addVnic(
        @PathVariable networkId: String? = null,
        @RequestBody vnicProfile: VnicProfileVo? = null
    ): ResponseEntity<VnicProfileVo?> {
        if (vnicProfile == null)
            throw ErrorPattern.VNIC_PROFILE_VO_INVALID.toException()
        log.info("/networks/{}/vnicProfiles ... vnicProfile 생성", networkId)
        return ResponseEntity.ok(iVnic.add(vnicProfile))
    }

    @ApiOperation(
        httpMethod="PUT",
        value="vnic 프로파일 편집",
        notes="vnic 프로파일을 편집한다"
    )
    @ApiImplicitParams(
        ApiImplicitParam(name="vnicProfileId", value="Vnic Profile ID", dataTypeClass=String::class, required=true, paramType="path"),
        ApiImplicitParam(name="vnicProfile", value="Vnic Profile", dataTypeClass=VnicProfileVo::class, paramType="body")
    )
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @PutMapping("/{vnicProfileId}")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    fun updateVnic(
        @PathVariable vnicProfileId: String? = null,
        @RequestBody vnicProfile: VnicProfileVo? = null,
    ): ResponseEntity<VnicProfileVo?> {
        log.info("/vnicProfiles/{} ... vnicProfile 편집", vnicProfileId)
        if (vnicProfileId.isNullOrEmpty())
            throw ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND.toException()
        if (vnicProfile == null)
            throw ErrorPattern.VNIC_PROFILE_NOT_FOUND.toException()
        return ResponseEntity.ok(iVnic.update(vnicProfile))
    }

    @ApiOperation(
        httpMethod="DELETE",
        value="vnic 프로파일 삭제",
        notes="vnic 프로파일을 삭제한다"
    )
    @ApiImplicitParams(
        ApiImplicitParam(name="vnicProfileId", value="Vnic Profile ID", dataTypeClass=String::class, required=true, paramType="path")
    )
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @DeleteMapping("/{vnicProfileId}")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    fun removeVnic(
        @PathVariable vnicProfileId: String? = null,
    ): ResponseEntity<Boolean> {
        if (vnicProfileId.isNullOrEmpty())
            throw ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND.toException()
        log.info("/vnicProfiles/{} ... vnic 프로파일 삭제", vnicProfileId)
        return ResponseEntity.ok(iVnic.remove(vnicProfileId))
    }

//    @ApiOperation(
//        httpMethod="DELETE",
//        value="vnic 프로파일 다중 삭제",
//        notes="vnic 프로파일을 다중 삭제한다"
//    )
//    @ApiImplicitParams(
//        ApiImplicitParam(name="vnicProfileIdList", value="Vnic Profile ID 리스트", dataTypeClass=Array<String>::class, required=true, paramType="body"),
//    )
//    @ApiResponses(
//        ApiResponse(code = 200, message = "OK")
//    )
//    @DeleteMapping
//    @ResponseBody
//    @ResponseStatus(HttpStatus.OK)
//    fun removeVnicList(
//        @RequestBody vnicProfileIdList: List<String>? = null,
//    ): ResponseEntity<Map<String, String>> {
//        if (vnicProfileIdList.isNullOrEmpty())
//            throw ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND.toException()
//        log.info("/vnicProfiles ... vnic 프로파일 다중 삭제")
//        return ResponseEntity.ok(iVnic.removeMultiple(vnicProfileIdList))
//    }

    @ApiOperation(
        httpMethod="GET",
        value="가상머신 목록",
        notes="선택된 vnic 프로파일의 가상머신 목록을 조회한다"
    )
    @ApiImplicitParams(
        ApiImplicitParam(name="vnicProfileId", value="vnicProfile ID", dataTypeClass=String::class, required=true, paramType="path"),
    )
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @GetMapping("/{vnicProfileId}/vms")
    @ResponseBody
    fun vms(
        @PathVariable vnicProfileId: String? = null,
    ): ResponseEntity<List<VmVo>> {
        if (vnicProfileId.isNullOrEmpty())
            throw ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND.toException()
        log.info("/vnicProfiles/{}/vms ... 가상머신 목록", vnicProfileId)
        return ResponseEntity.ok(iVnic.findAllVmsFromVnicProfile(vnicProfileId))
    }

    @ApiOperation(
        httpMethod="GET",
        value="템플릿 목록",
        notes="선택된 vnic 프로파일의 템플릿 목록을 조회한다"
    )
    @ApiImplicitParams(
        ApiImplicitParam(name="vnicProfileId", value="vnicProfile ID", dataTypeClass=String::class, required=true, paramType="path"),
    )
    @ApiResponses(
        ApiResponse(code = 200, message = "OK")
    )
    @GetMapping("/{vnicProfileId}/templates")
    @ResponseBody
    fun templates(
        @PathVariable vnicProfileId: String? = null,
    ): ResponseEntity<List<TemplateVo>> {
        if (vnicProfileId.isNullOrEmpty())
            throw ErrorPattern.VNIC_PROFILE_ID_NOT_FOUND.toException()
        log.info("/vnicProfiles/{}/vms ... 템플릿 목록", vnicProfileId)
        return ResponseEntity.ok(iVnic.findAllTemplatesFromVnicProfile(vnicProfileId))
    }


    companion object {
        private val log by LoggerDelegate()
    }
}
