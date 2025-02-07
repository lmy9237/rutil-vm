package com.itinfo.rutilvm.api.service.zJava

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.zJava.*
import com.itinfo.rutilvm.api.model.response.Res
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.AffinityGroup
import org.ovirt.engine.sdk4.types.AffinityLabel
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Vm
import org.springframework.stereotype.Service


interface ItAffinityService {
	// 선호도 그룹 나중 구현
//	fun findAllAffinityGroupsFromCluster(clusterId: String): List<AffinityGroupVo>?
//	fun addAffinityGroupFromCluster(clusterId: String, agVo: AffinityGroupVo): Boolean
//	fun getAffinityGroupFromCluster(clusterId: String, agId: String): AffinityGroupVo?
//	fun editAffinityGroupFromCluster(agVo: AffinityGroupVo): Boolean
//	fun deleteAffinityGroupFromCluster(clusterId: String, agId: String): Boolean

	/**
	 * [ItAffinityService.getClusterAffinityGroups]
	 * 선호도 그룹 목록 - 클러스터
	 *
	 * @param clusterId [String] 클러스터 ID
	 * @return 선호도 그룹 목록
	 */
	@Throws(Error::class)
	fun getClusterAffinityGroups(clusterId: String): List<AffinityGroupVo>
	/**
	 * [ItAffinityService.findAllGroupsForVm]
	 * 선호도 그룹 목록 - 가상머신
	 *
	 * @param vmId 가상머신 ID
	 *
	 */
	@Throws(Error::class)
	fun findAllGroupsForVm(vmId: String): List<AffinityGroupVo>
	/**
	 * [ItAffinityService.setHostList]
	 * 선호도 생성창 - 호스트 목록 (클러스트 ID에 의존)
	 * Affinity Group/Label 생성시, 해당 클러스터에 있는 모든 호스트 출력
	 *
	 * @param clusterId [String] 클러스터 ID
	 * @return 호스트 목록
	 */
	@Throws(Error::class)
	fun findAllLabelsForVm(vmId: String): List<AffinityLabelVo>
	@Throws(Error::class)
	fun setHostList(clusterId: String): List<HostVo>
	/**
	 * [ItAffinityService.setVmList]
	 * 선호도 생성창 - 가상머신 목록 (클러스트 ID에 의존)
	 * Affinity Group/Label 생성시, 해당 클러스터에 있는 모든 가상머신 출력
	 *
 	 * @param clusterId [String] 클러스터 ID
	 * @return 호스트 목록
	 */
	@Throws(Error::class)
	fun setVmList(clusterId: String): List<IdentifiedVo>
	/**
	 * [ItAffinityService.setLabelList]
	 * 선호도 생성창 - 선호도 레이블 목록 (출력은 데이터센터 상관없이 나옴)
	 * Affinity Group 생성 시 사용
	 * front에서 가상머신 레이블과 호스트 레이블 버튼을 새로 생성하는 방식으로 하면 될듯
	 * dc나 cluster의 id와 관계없음 -> dc와는 관련있는거 같은데 api에 dc 정보가 없음
	 *
	 * @return AffinityLabel 목록
	 */
	@Throws(Error::class)
	fun setLabelList(): List<IdentifiedVo>
	/**
	 * [ItAffinityService.addAffinityGroup]
	 * 선호도 그룹 생성
	 * 선호도 그룹 생성 (cluster, vm) 상관없음
	 *
	 * @param id [String] cluster id /vm id
	 * @param cluster [Boolean] 해당 항목이 cluster 에서 생성되는건지 확인
	 * @param agVo [AffinityGroupVo] 선호도그룹
	 * @return 201 / 404
	 */
	@Throws(Error::class)
	fun addAffinityGroup(id: String, cluster: Boolean, agVo: AffinityGroupVo): Boolean
	/**
	 * [ItAffinityService.setAffinityGroup]
	 * 선호도 그룹 편집창
	 *
	 * @param id [String] cluster/vm ID
	 * @param cluster [Boolean] cluster/vm 인지
	 * @param agId [String] 해당 선호도 그룹의 ID
	 * @return
	 */
	@Throws(Error::class)
	fun setAffinityGroup(id: String, cluster: Boolean, agId: String): AffinityGroupVo?
	/**
	 * [ItAffinityService.editAffinityGroup]
	 * 선호도 그룹 편집
	 * TODO 나중
	 */
	@Throws(Error::class)
	fun editAffinityGroup(agVo: AffinityGroupVo): Boolean
	/**
	 * [ItAffinityService.deleteAffinityGroup]
	 * 선호도 그룹 삭제
	 * 선호도 그룹 삭제 - clusterId와 agId를 가져와서 삭제
	 * 선호도 그룹 내에 항목들이 아예 없어야함
	 *
	 * @param id [String] cluster/vm ID
	 * @param cluster [Boolean] cluster/vm 인지
	 * @param agId [String] 해당 선호도 그룹의 ID
	 */
	@Throws(Error::class)
	fun deleteAffinityGroup(id: String, cluster: Boolean, agId: String): Boolean

	/**
	 * [ItAffinityService.findAllAffinityLabels]
	 * 선호도 레이블 목록 - 클러스터, 호스트, 가상머신
	 * 클러스터에서 선호도 레이블 목록 출력
	 * 호스트 본인의 id가 있어야 출력됨
	 */
	@Throws(Error::class)
	fun findAllAffinityLabels(): List<AffinityLabelVo>
	// cluster  : label, group      api-group
	// host     : label             api-affinitylabels
	// vm       : label, group      api-affinitylabels


	/**
	 * [ItHostService.findAllAffinityLabelsFromHost]
	 * 호스트 선호도 레이블 목록
	 *
	 *  @param hostId [String] 호스트 아이디
	 *  @return List<[AffinityLabelVo]>? 선호도 레이블 목록
	 */
//	@Throws(Error::class)
//	fun findAllAffinityLabelsFromHost(hostId: String): List<AffinityLabelVo>

	// 선호도 그룹/레이블은 나중구현 가능
	/**
	 * [ItVmService.findAllAffinityGroupsFromCluster]
	 * 가상머신 생성 - 선호도 - 선호도 그룹 목록
	 *
	 * @param clusterId [String] 클러스터 id
	 * @return List<[IdentifiedVo]> 선호도 그룹 목록
	 */
	@Deprecated("선호도 나중 구현")
	@Throws(Error::class)
	fun findAllAffinityGroupsFromCluster(clusterId: String): List<IdentifiedVo>
	/**
	 * [ItVmService.findAllAffinityLabel]
	 * 가상머신 생성 - 선호도 - 선호도 레이블 목록
	 * 기준을 모르겠음
	 *
	 * @return List<[IdentifiedVo]> 선호도 레이블 목록
	 */
	@Deprecated("선호도 나중 구현")
	@Throws(Error::class)
	fun findAllAffinityLabel(): List<IdentifiedVo> // 선호도 레이블 리스트


}


/*enum class AffinityServiceType(
	val code: String,
	val description: String,
) {
	VM("vm", "가상머신"),
	CLUSTER("cluster", "클러스터"),
	UNKNOWN("unknown", "알수없음");

	companion object {
		private val findMap: MutableMap<String, AffinityServiceType>
				= ConcurrentHashMap<String, AffinityServiceType>()
		init {
			values().forEach { findMap[it.code] = it }
		}
		@JvmStatic fun findByCode(code: String): AffinityServiceType
				= findMap[code] ?: UNKNOWN
	}
}*/

/*
fun <T : Enum<AffinityServiceType>> ItAffinityService<T>.checkServiceType(type: T): Boolean {
	return this@checkServiceType.javaClass.genericInterfaces
		.filterIsInstance<ParameterizedType>()
		.any { it.actualTypeArguments.contains(type::class.java) }
}
*/

@Service
class AffinityServiceImpl(

): BaseService(), ItAffinityService {

//	@Deprecated("선호도 나중 구현")
//	@Throws(Error::class)
//	override fun findAllAffinityGroupsFromCluster(clusterId: String): List<AffinityGroupVo>? {
//		log.info("findAllAffinityGroupsFromCluster ... clusterId: {}", clusterId)
//		val res: List<AffinityGroup> =
//			conn.findAllAffinityGroupsFromCluster(clusterId)
//				.getOrDefault(listOf())
//		return res.toAffinityGroupVos(conn, clusterId)
//	}
//
//	@Deprecated("선호도 나중 구현")
//	@Throws(Error::class)
//	override fun addAffinityGroupFromCluster(clusterId: String, agVo: AffinityGroupVo): Boolean {
//		log.info("addAffinityGroupFromCluster ... ")
//		TODO("나중 구현")
//	}
//
//	@Deprecated("선호도 나중 구현")
//	@Throws(Error::class)
//	override fun getAffinityGroupFromCluster(clusterId: String, agId: String): AffinityGroupVo? {
//		log.info("getAffinityGroupFromCluster ... ")
//		TODO("나중 구현")
//	}
//
//	@Deprecated("선호도 나중 구현")
//	@Throws(Error::class)
//	override fun editAffinityGroupFromCluster(agVo: AffinityGroupVo): Boolean {
//		log.info("editAffinityGroupFromCluster ... ")
//		TODO("나중 구현")
//	}
//
//	@Deprecated("선호도 나중 구현")
//	@Throws(Error::class)
//	override fun deleteAffinityGroupFromCluster(clusterId: String, agId: String): Boolean {
//		log.info("deleteAffinityGroupFromCluster ... ")
//		TODO("나중 구현")
//	}

	@Throws(Error::class)
	override fun getClusterAffinityGroups(clusterId: String): List<AffinityGroupVo> {
		log.info("getClusterAffinityGroups ... clusterId: {}", clusterId)
		val affinityGroups: List<AffinityGroup> =
			conn.findAllAffinityGroupsFromCluster(clusterId)
				.getOrDefault(listOf())
		log.info("클러스터 선호도그룹 목록")
		return affinityGroups.toAffinityGroupVos(conn)
	}

	@Throws(Error::class)
	override fun findAllGroupsForVm(vmId: String): List<AffinityGroupVo> {
		log.info("findAllGroupsForVm ... vmId: {}", vmId)
		val vm: Vm = conn.findVm(vmId).getOrNull() ?: run {
			return listOf()
		}
		val clusterId = vm.cluster().id()
		val affinityGroups: List<AffinityGroup> =
			conn.findAllAffinityGroupsFromCluster(clusterId)
				.getOrDefault(listOf())
				.filter { it.vmsPresent() && it.vms().any { vm: Vm -> vm.id() == vmId } }
		log.info("가상머신 선호도그룹 목록")
		return affinityGroups.toAffinityGroupVos(conn, clusterId)
	}


	@Throws(Error::class)
	override fun findAllLabelsForVm(vmId: String): List<AffinityLabelVo> {
		log.info("findAllLabelsForVm ... vmId: {}", vmId)
		val vm: Vm? = conn.findVm(vmId)
			.getOrNull()
		val clusterId = vm?.cluster()?.id()
		val affinityGroups: List<AffinityLabel> =
			conn.findAllAffinityLabelsFromVm(vmId)
				.getOrDefault(listOf())
				.filter { it.vmsPresent() && it.vms().any { vm: Vm -> vm.id() == vmId } }
		log.info("가상머신 선호도레이블 목록")
		return affinityGroups.toAffinityLabelVos(conn)
	}

	@Throws(Error::class)
	override fun setHostList(clusterId: String): List<HostVo> {
		log.info("setHostList ... clusterId: {}", clusterId)
		val hosts: List<Host> =
			conn.findAllHosts()
				.getOrDefault(listOf())
				.filter { it.cluster().id() == clusterId }
		return hosts.toHostsIdName()
	}

	@Throws(Error::class)
	override fun setVmList(clusterId: String): List<IdentifiedVo> {
		log.info("setVmList ... clusterId: {}", clusterId)
		val vms: List<Vm> =
			conn.findAllVms()
				.getOrDefault(listOf())
				.filter { it.cluster().id() == clusterId }
		return vms.fromVmsToIdentifiedVos()
	}

	@Throws(Error::class)
	override fun setLabelList(): List<IdentifiedVo> {
		log.info("setLabelList ... ")
		val affinityLabels: List<AffinityLabel> =
			conn.findAllAffinityLabels()
				.getOrDefault(listOf())
		return affinityLabels.fromAffinityLabelsToIdentifiedVos()
	}

	@Throws(Error::class)
	override fun addAffinityGroup(id: String, cluster: Boolean, agVo: AffinityGroupVo): Boolean {
		log.info("addAffinityGroup ... id: {}, cluster: {}", id, cluster)
		val clusterId: String =
			if (cluster) id
			else conn.findVm(id).getOrNull()?.cluster()?.id() ?: ""

		val ag: AffinityGroupBuilder = getAffinityGroupBuilder(agVo)
		getLabels(ag, agVo.alMemberVo)
		getMembers(ag, agVo.agMemberVo)

		val res: Result<AffinityGroup> =
			conn.addAffinityGroupFromCluster(clusterId, ag.build(), agVo.name)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun setAffinityGroup(id: String, cluster: Boolean, agId: String): AffinityGroupVo? {
		log.info("setAffinityGroup ... id: {}, cluster: {}, agId: {}", id, cluster, agId)
		val clusterId: String =
			if (cluster) id
			else conn.findVm(id).getOrNull()?.cluster()?.id() ?: ""

		val affinityGroup: AffinityGroup? =
			conn.findAffinityGroupFromCluster(clusterId, agId, "vmlabels,hostlabels,vms,hosts")
				.getOrNull()

		log.info(if (cluster) "클러스터 선호도 그룹 편집창" else "가상머신 선호도 그룹 편집창")
		return affinityGroup?.toAffinityGroupVo(conn, clusterId)
	}

	@Throws(Error::class)
	override fun editAffinityGroup(agVo: AffinityGroupVo): Boolean {
		val agId = agVo.id

		val ag: AffinityGroupBuilder = getAffinityGroupBuilder(agVo)
		ag.id(agId)
		// 편집시 들어갈 host/vm labels,list
		editHostLabels(system, ag, agVo)
		editVmLabels(system, ag, agVo)
		editHostMembers(system, ag, agVo)
		editVmMembers(system, ag, agVo)
		val res: Result<AffinityGroup> =
			conn.updateAffinityGroupFromCluster(agVo.clusterId, ag.build(), agVo.name)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun deleteAffinityGroup(id: String, cluster: Boolean, agId: String): Boolean {
		log.info("deleteAffinityGroup ... id: {}, cluster: {}, agId: {}", id, cluster, agId)
		val clusterId: String =
			if (cluster) id
			else conn.findVm(id).getOrNull()?.cluster()?.id() ?: ""

		val res: Result<Boolean> =
			conn.removeAffinityGroupFromCluster(clusterId, agId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun findAllAffinityLabels(): List<AffinityLabelVo> {
		log.info("getAffinityLabels ... ")
		val affinityLabels: List<AffinityLabel> =
			conn.findAllAffinityLabels()
				.getOrDefault(listOf())
		log.info("선호도 레이블")
		return affinityLabels.toAffinityLabelVos(conn)
	}


	@Deprecated("선호도 나중 구현")
	override fun findAllAffinityGroupsFromCluster(clusterId: String): List<IdentifiedVo> {
		log.info("findAllAffinityGroupsFromCluster ... ")
		conn.findCluster(clusterId)
			.getOrNull() ?: throw ErrorPattern.CLUSTER_NOT_FOUND.toException()
		val res: List<AffinityGroup> =
			conn.findAllAffinityGroupsFromCluster(clusterId)
				.getOrDefault(listOf())
		return res.fromAffinityGroupsToIdentifiedVos()
	}

	@Deprecated("선호도 나중 구현")
	override fun findAllAffinityLabel(): List<IdentifiedVo> {
		log.info("findAllAffinityLabel ... ")
		val res: List<AffinityLabel> =
			conn.findAllAffinityLabels()
				.getOrDefault(listOf())
		return res.fromAffinityLabelsToIdentifiedVos()
	}

	// 클러스터에서 가지고 왓ㅇ므요
	// 선호도 레이블 생성
	//    @Override
	//    public CommonVo<Boolean> addAffinitylabel(String id, AffinityLabelCreateVo alVo) {
	//        SystemService system = admin.getConnection().systemService();
	//        AffinityLabelsService alServices = system.affinityLabelsService();
	//        List<AffinityLabel> alList = system.affinityLabelsService().list().send().labels();
	//
	//        // 중복이름
	//        boolean duplicateName = alList.stream().noneMatch(al -> al.name().equals(alVo.getName()));
	//
	//        try {
	//            if(duplicateName) {
	//                log.error("실패: Cluster 선호도레이블 이름 중복");
	//                return CommonVo.failResponse("이름 중복");
	//            }
	//            AffinityLabelBuilder alBuilder = new AffinityLabelBuilder();
	//            alBuilder
	//                    .name(alVo.getName())
	//                    .hosts(
	//                            alVo.getHostList().stream()
	//                                    .map(host -> new HostBuilder().id(host.getId()).build())
	//                                    .collect(Collectors.toList())
	//                    )
	//                    .vms(
	//                            alVo.getVmList().stream()
	//                                    .map(vm -> new VmBuilder().id(vm.getId()).build())
	//                                    .collect(Collectors.toList())
	//                    )
	//                    .build();
	//
	//            alServices.add().label(alBuilder).send().label();
	//
	//            log.info("Cluster 선호도레이블 생성");
	//            return CommonVo.createResponse();
	//        } catch (Exception e) {
	//            log.error("실패: Cluster 선호도 레이블");
	//            e.printStackTrace();
	//            return CommonVo.failResponse(e.getMessage());
	//        }
	//    }
	//
	//
	//        // 선호도 레이블 편집 시 출력창
	//        @Override
	//        public AffinityLabelCreateVo getAffinityLabel(String id, String alId){   // id는 alid
	//            SystemService system = admin.getConnection().systemService();
	//            AffinityLabel al = system.affinityLabelsService().labelService(alId).get().follow("hosts,vms").send().label();
	//
	//            log.info("Cluster 선호도 레이블 편집창");
	//            return AffinityLabelCreateVo.builder()
	//                    .id(id)
	//                    .name(al.name())
	//    //                .hostList(al.hostsPresent() ? affinityService.getHostLabelMember(system, alId) : null )
	//    //                .vmList(al.vmsPresent() ? affinityService.getVmLabelMember(system, alId) : null)
	//                    .build();
	//        }
	//
	//        // 선호도 레이블 - 편집
	//        // 이름만 바뀌는거 같음, 호스트하고 vm은 걍 삭제하는 방식으로
	//        @Override
	//        public CommonVo<Boolean> editAffinitylabel(String id, String alId, AffinityLabelCreateVo alVo) {
	//            SystemService system = admin.getConnection().systemService();
	//            AffinityLabelService alService = system.affinityLabelsService().labelService(alVo.getId());
	//            List<AffinityLabel> alList = system.affinityLabelsService().list().send().labels();
	//
	//            // 중복이름
	//            boolean duplicateName = alList.stream().noneMatch(al -> al.name().equals(alVo.getName()));
	//
	//            try {
	//                AffinityLabelBuilder alBuilder = new AffinityLabelBuilder();
	//                alBuilder
	//                        .id(alVo.getId())
	//                        .name(alVo.getName())
	//                        .hosts(
	//                                alVo.getHostList().stream()
	//                                        .map(host ->
	//                                                new HostBuilder()
	//                                                        .id(host.getId())
	//                                                        .build()
	//                                        )
	//                                        .collect(Collectors.toList())
	//                        )
	//                        .vms(
	//                                alVo.getVmList().stream()
	//                                        .map(vm ->
	//                                                new VmBuilder()
	//                                                        .id(vm.getId())
	//                                                        .build()
	//                                        )
	//                                        .collect(Collectors.toList())
	//                        )
	//                        .build();
	//
	//    //            alVo.getVmList().stream().distinct().forEach(System.out::println);
	//
	//                alService.update().label(alBuilder).send().label();
	//                log.info("Cluster 선호도레이블 편집");
	//                return CommonVo.createResponse();
	//            } catch (Exception e) {
	//                log.error("실패: Cluster 선호도레이블 편집");
	//                e.printStackTrace();
	//                return CommonVo.failResponse(e.getMessage());
	//            }
	//        }
	//
	//
	//        // 선호도 레이블 - 삭제하려면 해당 레이블에 있는 가상머신&호스트 멤버 전부 내리고 해야함
	//        @Override
	//        public CommonVo<Boolean> deleteAffinitylabel(String id, String alId) {
	//            SystemService system = admin.getConnection().systemService();
	//            AffinityLabelService alService = system.affinityLabelsService().labelService(alId);
	//            AffinityLabel affinityLabel = system.affinityLabelsService().labelService(alId).get().follow("hosts,vms").send().label();
	//
	//            try {
	//                if(!affinityLabel.hostsPresent() && !affinityLabel.vmsPresent()) {
	//                    alService.remove().send();
	//
	//                    log.info("Cluster 선호도레이블 삭제");
	//                    return CommonVo.successResponse();
	//                } else {
	//                    log.error("가상머신 혹은 호스트를 삭제하세요");
	//                    return CommonVo.failResponse("error");
	//                }
	//            } catch (Exception e) {
	//                log.error("실패: Cluster 선호도레이블 삭제");
	//                return CommonVo.failResponse(e.getMessage());
	//            }
	//        }
	// -------------------------------------------------------------

	/**
	 * 선호도 그룹 빌더
	 * @param agVo
	 * @return
	 */
	private fun getAffinityGroupBuilder(agVo: AffinityGroupVo): AffinityGroupBuilder {
		val ag = AffinityGroupBuilder()
		ag.name(agVo.name)
			.description(agVo.description)
			.cluster(ClusterBuilder().id(agVo.clusterId).build())
			.priority(agVo.priority.toFloat())
			.vmsRule(
				AffinityRuleBuilder()
					.enabled(agVo.isVmEnabled) // 비활성화
					.positive(agVo.isVmPositive) // 양극 음극
					.enforcing(agVo.isVmEnforcing) // 강제 적용
			)
			.hostsRule(
				AffinityRuleBuilder()
					.enabled(agVo.isHostEnabled)
					.positive(agVo.isHostPositive)
					.enforcing(agVo.isHostEnforcing)
			)
		return ag
	}


	/**
	 * 선호도 그룹 레이블 생성하는
	 * @param ag 선호도 그룹 빌더
	 * @param affinityLabelMember 선호도 레이블 내이 레이블
	 */
	private fun getLabels(ag: AffinityGroupBuilder, affinityLabelMember: AffinityLabelMemberVo) {
		if (affinityLabelMember.hostLabels.isNotEmpty()) {
			ag.hostLabels(
				affinityLabelMember.hostLabels.map { al: IdentifiedVo ->
					AffinityLabelBuilder().id(al.id).build()
				}
			)
		}
		if (affinityLabelMember.vmLabels.isNotEmpty()) {
			ag.vmLabels(affinityLabelMember.vmLabels.map { al: IdentifiedVo ->
				AffinityLabelBuilder().id(al.id).build()
			})
		}
	}


	private fun getMembers(ag: AffinityGroupBuilder, affinityGroupMember: AffinityGroupMemberVo) {
		if (affinityGroupMember.hostMembers.isNotEmpty()) {
			ag.hosts(affinityGroupMember.hostMembers.map { host: IdentifiedVo ->
				HostBuilder().id(host.id).build()
			})
		}
		if (affinityGroupMember.vmMembers.isNotEmpty()) {
			ag.vms(affinityGroupMember.vmMembers.map { vm: IdentifiedVo ->
				VmBuilder().id(vm.id).build()
			})
		}
	}


	// 선호도 그룹 편집창 - host/vm 레이블, host/vm 아이디,이름 출력만
	private fun setEdit(system: SystemService, ag: AffinityGroup, type: String): List<IdentifiedVo> {
		return when (type) {
			"hostLabels" -> system.clustersService().clusterService(ag.cluster().id()).affinityGroupsService()
				.groupService(ag.id()).hostLabelsService().list().send().labels().map { label: AffinityLabel ->
					label.fromAffinityLabelToIdentifiedVo()
				}
			"vmLabels" -> system.clustersService().clusterService(ag.cluster().id()).affinityGroupsService()
				.groupService(ag.id()).vmLabelsService().list().send().labels().map { label: AffinityLabel ->
					label.fromAffinityLabelToIdentifiedVo()
				}
			"hosts" -> system.clustersService().clusterService(ag.cluster().id()).affinityGroupsService()
				.groupService(ag.id()).hostsService().list().send().hosts().map { host: Host ->
					host.fromHostToIdentifiedVo()
				}
			"vms" -> system.clustersService().clusterService(ag.cluster().id()).affinityGroupsService()
				.groupService(ag.id()).vmsService().list().send().vms().map { vm: Vm ->
					vm.fromVmToIdentifiedVo()
				}
			else -> listOf()
		}
	}


	// Host Labels
	private fun editHostLabels(
		system: SystemService,
		agBuilder: AffinityGroupBuilder,
		agVo: AffinityGroupVo
	): Res<Boolean> {
		val agHostLabelsService =
			system.clustersService().clusterService(agVo.clusterId).affinityGroupsService().groupService(agVo.id).hostLabelsService()
		if (agVo.alMemberVo.hostLabels.isNotEmpty()) {
			try {
				agBuilder.hostLabels(agVo.alMemberVo.hostLabels.map { label: IdentifiedVo ->
					AffinityLabelBuilder().id(label.id).build()
				})
				return Res.successResponse()
			} catch (e: Exception) {
				e.message
				return Res.fail(404, "hostfail")
			}
		} else {
			try {
				val hostLabelList = agHostLabelsService.list().send().labels()
				for (al in hostLabelList) {
					log.debug(al.id() + ":" + al.name())
					// TODO: 지워지지 않음, issue에 올려서 로그 기록 확인 필요
					agHostLabelsService.labelService(al.id()).remove().send()
				}
				return Res.successResponse()
			} catch (e: Exception) {
				log.error(e.message)
				return Res.fail(404, "fail")
			}
		}
	}


	// VM Labels
	private fun editVmLabels(
		system: SystemService,
		agBuilder: AffinityGroupBuilder,
		agVo: AffinityGroupVo
	): Res<Boolean> {
		val agVmLabelsService =
			system.clustersService().clusterService(agVo.clusterId).affinityGroupsService().groupService(agVo.id)
				.vmLabelsService()
		if (agVo.alMemberVo.vmLabels.isNotEmpty()) {
			try {
				agBuilder.vmLabels(
					agVo.alMemberVo.vmLabels.map { label: IdentifiedVo ->
						AffinityLabelBuilder().id(label.id).build()
					}
				)
				return Res.successResponse()
			} catch (e: Exception) {
				log.error("vmLabel Fail, {}", e.message)
				return Res.fail(404,"vmLabel Fail")
			}
		} else {
			try {
				val vmLabelList = agVmLabelsService.list().send().labels()
				for (al in vmLabelList) {
					agVmLabelsService.labelService(al.id()).remove().send()
				}
				return Res.successResponse()
			} catch (e: Exception) {
				log.error(e.message)
				return Res.fail(404, "fail")
			}
		}
	}


	// 선호도 그룹 편집 시, Host/Vm 멤버 추가&삭제
	private fun editHostMembers(system: SystemService, agBuilder: AffinityGroupBuilder, agVo: AffinityGroupVo) {
		val agHostsService =
			system.clustersService().clusterService(agVo.clusterId).affinityGroupsService().groupService(agVo.id)
				.hostsService()

		if (agVo.agMemberVo.hostMembers.isNotEmpty()) {
			agBuilder.hosts(
				agVo.agMemberVo.hostMembers.map { host: IdentifiedVo ->
					HostBuilder().id(host.id).build()
				}
			)
		} else {
			val hostList = agHostsService.list().send().hosts()
			for (host in hostList) {
				try {
					agHostsService.hostService(host.id()).remove().send()
					log.debug("Removed host: {}", host.name())
				} catch (e: Exception) {
					log.error("Failed to remove host: {} {}", host.name(), e.localizedMessage)
				}
			}
		}
	}

	// 선호도 그룹 편집 시, Host/Vm 멤버 추가&삭제
	private fun editVmMembers(system: SystemService, agBuilder: AffinityGroupBuilder, agVo: AffinityGroupVo) {
		val agVmsService =
			system.clustersService().clusterService(agVo.clusterId).affinityGroupsService().groupService(agVo.id)
				.vmsService()

		if (agVo.agMemberVo.vmMembers.isNotEmpty()) {
			agBuilder.vms(agVo.agMemberVo.vmMembers.map { vm: IdentifiedVo ->
				VmBuilder().id(vm.id).build()
			})
		} else {
			val vmList = agVmsService.list().send().vms()
			for (vm in vmList) {
				try {
					agVmsService.vmService(vm.id()).remove().send()
					log.debug("Removed vm: {}", vm.name())
				} catch (e: Exception) {
					log.error("Failed to remove vm: {}, {}", vm.name(), e.localizedMessage)
				}
			}
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
