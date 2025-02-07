package com.itinfo.rutilvm.api.controller.common

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.common.TreeNavigationalDataCenter
import com.itinfo.rutilvm.api.service.common.ItTreeNavigationService

import io.swagger.annotations.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus


@Controller
@Api(tags = ["Navigation"])
@RequestMapping("/api/v1/navigation/")
class NavigationController {
	@Autowired private lateinit var treeNavigation: ItTreeNavigationService

	@ApiOperation(
		httpMethod="GET",
		value="컴퓨팅 목록이 담긴 네비게이션 정보조회",
		notes="컴퓨팅 목록이 담긴 네비게이션 목록을 조회한다")
	@ApiImplicitParams(
		ApiImplicitParam(name="typeId", value="유형 ID", dataTypeClass=String::class, required=true, paramType="path"),
	)
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@GetMapping("{typeId}")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	fun findDcNavigationals(
		@PathVariable typeId: String = "none"
	): ResponseEntity<List<TreeNavigationalDataCenter>> {
		log.info("/api/v1/navigation/{} ... 컴퓨팅 목록이 담긴 네비게이션 정보조회", typeId)
		val res: List<TreeNavigationalDataCenter> = when(typeId) {
			"cluster", "clusters" -> treeNavigation.findAllNavigationalsWithClusters() // 클러스터
			"network", "networks" -> treeNavigation.findAllNavigationalsWithNetworks() // 네트워크
			"storagedomain", "storagedomains" -> treeNavigation.findAllNavigationalsWithStorageDomains() // 스토리지 도메인
			else -> listOf()
		}
		return ResponseEntity.ok(res)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}