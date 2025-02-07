package com.itinfo.controller

import com.itinfo.ItInfoConstant
import com.itinfo.rutilvm.common.LoggerDelegate

import io.swagger.annotations.*

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam


@Controller
class NavigationController {
	@ApiOperation(httpMethod="GET", value="loginView", notes="페이지 이동 > /login")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET, RequestMethod.POST], value=["/login"])
	fun loginView(): String {
		log.info("... loginView")
		return "/castanets/login/login"
	}

	@ApiOperation(httpMethod="GET", value="accessDeniedView", notes="페이지 이동 > /accessDenied")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET, RequestMethod.POST], value=["/accessDenied"])
	fun accessDeniedView(): String {
		log.info("... accessDeniedView")
		return "/castanets/login/accessDenied"
	}

	@ApiOperation(httpMethod="GET", value="contextRoot", notes="페이지 이동 > /dashboard")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET, RequestMethod.POST], value=["/"])
	fun contextRoot(): String {
		log.info("... contextRoot")
		return "redirect:dashboard"
	}

	@RequestMapping(method=[RequestMethod.GET, RequestMethod.POST], value=["/dashboard"])
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@ApiImplicitParams
	@ApiOperation(httpMethod="GET", value="getDashboardView", notes="페이지 이동 > /dashboard")
	fun getDashboardView(): String {
		log.info("... getDashboardView")
		return "/castanets/dashboard/dashboard"
	}

	@RequestMapping(method=[RequestMethod.GET, RequestMethod.POST], value=["/symphony"])
	@ApiResponses(ApiResponse(code=200, message="OK"))
	@ApiImplicitParams
	@ApiOperation(httpMethod="GET", value="getSymphonyView", notes=" 페이지 이동 > /symphony")
	fun getSymphonyView(): String {
		log.info("... getSymphonyView")
		return "/castanets/karajan/karajan"
	}


	@ApiOperation(httpMethod="GET", value="usersView", notes="페이지 이동 > /admin/users")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/users"])
	fun usersView(): String {
		log.info("... usersView")
		return "/castanets/admin/users"
	}


	@ApiOperation(httpMethod="GET", value="addUsersView", notes="페이지 이동 > /admin/addUser")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/users/viewAddUser"])
	fun addUsersView(): String {
		log.info("... addUsersView")
		return "/castanets/admin/addUser"
	}

	@ApiOperation(httpMethod="GET", value="passwordView", notes="페이지 이동 > /admin/users/password")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/users/password"])
	fun passwordView(): String {
		log.info("... passwordView")
		return "/castanets/admin/password"
	}

	@ApiOperation(httpMethod="GET", value="instanceTypesView", notes="페이지 이동 > /admin/instanceTypes")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/instanceTypes"])
	fun instanceTypesView(): String {
		log.info("... instanceTypesView")
		return "/castanets/admin/instanceTypes"
	}

	@ApiOperation(httpMethod="GET", value="createInstanceTypeView", notes="페이지 이동 > /admin/createInstanceType")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/createInstanceType"])
	fun createInstanceTypeView(): String {
		log.info("... createInstanceTypeView")
		return "/castanets/admin/createInstanceType"
	}

	@ApiOperation(httpMethod="GET", value="updateInstanceTypeView", notes="페이지 이동 > /admin/updateInstanceType")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/updateInstanceType"])
	fun updateInstanceTypeView(): String {
		log.info("... updateInstanceTypeView")
		return "/castanets/admin/updateInstanceType"
	}

	@ApiOperation(httpMethod="GET", value="providersView", notes="페이지 이동 > /admin/providers")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/providers"])
	fun providersView(): String {
		log.info("... providersView")
		return "/castanets/admin/providers"
	}

	@ApiOperation(httpMethod="GET", value="systemPropertiesView", notes="페이지 이동 > /admin/systemProperties")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/systemProperties"])
	fun systemPropertiesView(): String {
		log.info("... systemPropertiesView")
		return "/castanets/admin/systemProperties"
	}

	@ApiOperation(httpMethod="GET", value="systemPermissionsView", notes="페이지 이동 > /admin/systemPermissions")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/systemPermissions"])
	fun systemPermissionsView(): String {
		log.info("systemPermissionsView ...")
		return "/castanets/admin/systemPermissions"
	}

	@ApiOperation(httpMethod = "GET", value = "vmsView", notes = "페이지 이동 > /compute/vms")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/compute/vms"])
	fun vmsView(): String {
		log.info("... vmsView")
		return "/castanets/compute/vms"
	}

	@ApiOperation(httpMethod = "GET", value = "vmView", notes = "페이지 이동 > /compute/vm")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/compute/vm"])
	fun vmView(): String {
		log.info("... vmView")
		return "/castanets/compute/vmDetail"
	}

	@ApiOperation(httpMethod = "GET", value = "createVmView", notes = "페이지 이동 > /compute/createVmView")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/compute/createVmView"])
	fun createVmView(): String {
		log.info("... createVmView")
		return "/castanets/compute/createVm"
	}

	@ApiOperation(httpMethod = "GET", value = "updateVmView", notes = "페이지 이동 > /compute/updateVmInfo")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/compute/updateVmInfo"])
	fun updateVmView(): String {
		log.info("... updateVmView")
		return "/castanets/compute/updateVm"
	}

	@ApiOperation(httpMethod = "GET", value = "cloneVmView", notes = "페이지 이동 > /compute/cloneVmInfo")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/compute/cloneVmInfo"])
	fun cloneVmView(): String {
		log.info("... cloneVmView")
		return "/castanets/compute/cloneVm"
	}

	@ApiOperation(httpMethod="GET", value="addSystemPermissionsView", notes="페이지 이동 > /admin/systemPermissions/viewAddSystemPermissions")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/systemPermissions/viewAddSystemPermissions"])
	fun addSystemPermissionsView(): String {
		log.info("addSystemPermissionsView ...")
		return "/castanets/admin/addSystemPermissions"
	}

	@ApiOperation(httpMethod="GET", value="createClusterView", notes="페이지 이동 > /compute/createCluster")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/createCluster"])
	fun createClusterView(): String {
		log.info("... createClusterView")
		return "/castanets/compute/createCluster"
	}

	@ApiOperation(httpMethod="GET", value="updateCluster", notes="페이지 이동 > /compute/updateCluster")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="클러스터 ID", paramType="query", dataTypeClass=String::class)
		)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/updateCluster"])
	fun updateCluster(
		@RequestParam(name="id") id: String?,
		model: Model
	): String {
		log.info("... updateCluster('{}')", id)
		model.addAttribute(ItInfoConstant.RESULT_KEY, id)
		return "/castanets/compute/createCluster"
	}

	@ApiOperation(httpMethod="GET", value="clustersView", notes="페이지 이동 > /compute/clusters")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/clusters"])
	fun clustersView(): String {
		log.info("... clustersView")
		return "/castanets/compute/clusters"
	}

	@ApiOperation(httpMethod="GET", value="clusterView", notes="페이지 이동 > /compute/cluster")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="클러스터 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/cluster"])
	fun clusterView(
		@RequestParam(name="id") id: String?,
		model: Model
	): String {
		log.info("... clusterView('{}')", id)
		model.addAttribute(ItInfoConstant.RESULT_KEY, id)
		return "/castanets/compute/cluster"
	}

	@ApiOperation(httpMethod="GET", value="createHostView", notes="페이지 이동 > /compute/hosts")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/hosts"])
	fun hostsView(): String {
		log.info("... hostsView")
		return "/castanets/compute/hosts"
	}

	@ApiOperation(httpMethod="GET", value="hostView", notes="페이지 이동 > /compute/host")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/host"])
	fun hostView(id: String?, model: Model): String {
		log.info("... hostView('{}')", id)
		model.addAttribute(ItInfoConstant.RESULT_KEY, id)
		return "/castanets/compute/host"
	}

	@ApiOperation(httpMethod="GET", value="createHostView", notes="페이지 이동 > /compute/createHost")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/createHost"])
	fun createHostView(): String {
		log.info("... createHostView")
		return "/castanets/compute/createHost"
	}

	@ApiOperation(httpMethod="GET", value="updateHostView", notes="페이지 이동 > /compute/updateHost")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="갱신할 호스트 ID", required=true, paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/compute/updateHost"])
	fun updateHostView(
		id: String?,
		model: Model
	): String {
		log.info("... createHostView('$id')")
		model.addAttribute(ItInfoConstant.RESULT_KEY, id)
		return "/castanets/compute/createHost"
	}

	@ApiOperation(httpMethod="GET", value="disksView", notes="페이지 이동 > /storage/disks")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/storage/disks"])
	fun disksView(): String {
		log.info("... disksView")
		return "/castanets/storage/disks"
	}

	@ApiOperation(httpMethod="GET", value="createDiskView", notes="페이지 이동 > /storage/createDisk")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/storage/createDisk"])
	fun createDiskView(): String {
		log.info("... createDiskView")
		return "/castanets/storage/createDisk"
	}

	@ApiOperation(httpMethod="GET", value="domainsView", notes="페이지 이동 > /storage/domains")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/storage/domains"])
	fun domainsView(): String {
		log.info("... domainsView")
		return "/castanets/storage/domains"
	}

	@ApiOperation(httpMethod="GET", value="createDomainView", notes="페이지 이동 > /storage/importDomain")
	@ApiImplicitParams(
		ApiImplicitParam(name="isImport", value="가져오기 여부", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/storage/importDomain"])
	fun importDomain(
		isImport: Boolean,
		model: Model
	): String {
		log.info("... importDomain('{}')", isImport)
		model.addAttribute(ItInfoConstant.RESULT_KEY, isImport)
		return "/castanets/storage/createDomain"
	}

	@ApiOperation(httpMethod="GET", value="createDomainView", notes="페이지 이동 > /storage/createDomain")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/storage/createDomain"])
	fun createDomainView(): String {
		log.info("... createDomainView")
		return "/castanets/storage/createDomain"
	}

	@ApiOperation(httpMethod="GET", value="updateDomainView", notes="페이지 이동 > /storage/updateDomain")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="도메인 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/storage/updateDomain"])
	fun updateDomainView(
		id: String?,
		model: Model
	): String {
		log.info("... updateDomain('$id')")
		model.addAttribute(ItInfoConstant.RESULT_KEY, id)
		return "/castanets/storage/createDomain"
	}

	@ApiOperation(httpMethod="GET", value="domainView", notes="페이지 이동 > /storage/domain")
	@ApiImplicitParams(
		ApiImplicitParam(name="id", value="도메인 ID", paramType="query", dataTypeClass=String::class)
	)
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/storage/domain"])
	fun domainView(
		id: String?,
		model: Model
	): String {
		log.info("... domainView('{}')", id)
		model.addAttribute(ItInfoConstant.RESULT_KEY, id)
		return "/castanets/storage/domain"
	}

	@ApiOperation(httpMethod="GET", value="networksView", notes="페이지 이동 > /network/networks")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/network/networks"])
	fun networksView(): String {
		log.info("... networksView")
		return "/castanets/network/networks"
	}

	@ApiOperation(httpMethod="GET", value="networkDetailView", notes="페이지 이동 > /network/network")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/network/network"])
	fun networkDetailView(): String {
		log.info("... networkDetailView")
		return "/castanets/network/network"
	}

	@ApiOperation(httpMethod="GET", value="createNetworkView", notes="페이지 이동 > /network/createNetwork")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/network/createNetwork"])
	fun createNetworkView(): String {
		log.info("... createNetworkView")
		return "/castanets/network/createNetwork"
	}

	@ApiOperation(httpMethod="GET", value="updateNetworkView", notes="페이지 이동 > /network/updateNetwork")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/network/updateNetwork"])
	fun updateNetworkView(): String {
		log.info("... updateNetworkView")
		return "/castanets/network/updateNetwork"
	}

	@ApiOperation(httpMethod="GET", value="macAddressPoolsView", notes="페이지 이동 > /admin/macAddressPools")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/macAddressPools"])
	fun macAddressPoolsView(): String {
		log.info("... macAddressPools")
		return "/castanets/admin/macAddressPools"
	}

	@ApiOperation(httpMethod="GET", value="vncView", notes="페이지 이동 > /vmConsole/vncView")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/vmConsole/vncView"])
	fun vncView(): String {
		log.info("vncView ...")
		return "/vmconsole/vnc"
	}

	@ApiOperation(httpMethod="GET", value="systemProperties", notes="페이지 이동 > /admin/license")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code=200, message="OK")
	)
	@RequestMapping(method=[RequestMethod.GET], value=["/admin/license"])
	fun systemProperties(): String {
		log.info("... systemProperties")
		return "/castanets/admin/license"
	}

	@ApiOperation(value = "getVmOverview", notes = "페이지 이동 > /compute/vm/metrics", httpMethod = "GET")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/compute/vm/metrics"])
	fun getVmOverview(): String {
		log.info("... getVmOverview")
		return "/castanets/compute/vmMetrics"
	}

	@ApiOperation(httpMethod = "GET", value = "templatesView", notes = "페이지 이동 > /compute/templates")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/compute/templates"])
	fun templatesView(): String {
		log.info("... templatesView")
		return "/castanets/compute/templates"
	}

	@ApiOperation(httpMethod = "GET", value = "updateTemplateView", notes = "페이지 이동 > /compute/updateTemplateInfo")
	@ApiImplicitParams
	@ApiResponses(
		ApiResponse(code = 200, message = "OK")
	)
	@RequestMapping(method = [RequestMethod.GET], value = ["/updateTemplateInfo"])
	fun updateTemplateView(): String {
		log.info("... updateTemplateView")
		return "/castanets/compute/updateTemplate"
	}

	companion object {
		private val log by LoggerDelegate()
	}
}