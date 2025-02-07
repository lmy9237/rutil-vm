/*
package com.itinfo.rutilvm.service.computing.impl;

import com.itinfo.itcloud.model.IdentifiedVo;
import com.itinfo.itcloud.model.TypeExtKt;
import com.itinfo.itcloud.model.computing.*;
import com.itinfo.itcloud.model.create.ClusterCreateVo;
import com.itinfo.itcloud.model.create.NetworkCreateVo;
import com.itinfo.itcloud.model.error.CommonVo;
import com.itinfo.itcloud.model.network.NetworkClusterVo;
import com.itinfo.itcloud.model.network.NetworkUsageVo;
import com.itinfo.itcloud.model.network.NetworkVo;
import com.itinfo.itcloud.model.setting.PermissionVo;
import com.itinfo.itcloud.ovirt.AdminConnectionService;
import com.itinfo.itcloud.repository.VmInterfaceSamplesHistoryRepository;
import com.itinfo.itcloud.repository.VmSamplesHistoryRepository;
import com.itinfo.itcloud.service.computing.ItAffinityService;
import com.itinfo.itcloud.service.computing.ItClusterService;
import com.itinfo.itcloud.service.computing.ItGraphService;
import lombok.extern.slf4j.Slf4j;
import org.ovirt.engine.sdk4.builders.*;
import org.ovirt.engine.sdk4.services.*;
import org.ovirt.engine.sdk4.types.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ClusterServiceImpl implements ItClusterService {
    @Autowired private AdminConnectionService admin;
    @Autowired private CommonService common;
    @Autowired private ItAffinityService affinity;
    @Autowired private ItGraphService graph;

    @Autowired private VmSamplesHistoryRepository vmSamplesHistoryRepository;
    @Autowired private VmInterfaceSamplesHistoryRepository vmInterfaceSamplesHistoryRepository;

    */
/***
     * 클러스터 목록
     * @return 클러스터 목록
     *//*

    @Override
    public List<ClusterVo> getClusters(){
        SystemService system = admin.getConnection().systemService();
        log.info("클러스터 목록");
        return system.clustersService().list().send().clusters().stream()
                .map(cluster ->
                        ClusterVo.builder()
                            .id(cluster.id())
                            .name(cluster.name())
                            .comment(cluster.comment())
                            .version(cluster.version().major() + "." + cluster.version().minor())
                            .description(cluster.description())
                            .cpuType(cluster.cpuPresent() ? cluster.cpu().type() : null)
                            .hostCnt(getClusterHostCnt(system, cluster.id(), ""))
                            .vmCnt(getClusterVmCnt(system, cluster.id(), ""))
                            .build()
                )
                .collect(Collectors.toList());
    }


    */
/***
     * 클러스터 생성 위해 필요한 데이터센터 목록
     * @return 데이터센터 목록
     *//*

    @Override
    public List<DataCenterVo> setDcList(){
        SystemService system = admin.getConnection().systemService();
        log.info("클러스터 생성 위해 필요한 데이터센터 목록");
        return system.dataCentersService().list().send().dataCenters().stream()
                .map(dataCenter ->
                        DataCenterVo.builder()
                            .id(dataCenter.id())
                            .name(dataCenter.name())
                            .storageType(dataCenter.local()) // ?
                            .build()
                )
                .collect(Collectors.toList());
    }

    //

    */
/***
     * 클러스터 생성 위해 필요한 네트워크 목록
     * @param dcId 데이터센터 아이디에 의존
     * @return 네트워크 목록
     *//*

    @Override
    public List<NetworkVo> setNetworkList(String dcId) {
        SystemService system = admin.getConnection().systemService();
        log.info("클러스터 생성 위해 필요한 네트워크 목록");
        return system.dataCentersService().dataCenterService(dcId).networksService().list().send().networks().stream()
                .filter(network -> !network.externalProviderPresent())
                .map(network -> NetworkVo.builder().id(network.id()).name(network.name()).build())
                .collect(Collectors.toList());
    }



    */
/***
     * 클러스터 생성
     * required: name, cpu.type, data_center (Identify the datacenter with either id or name)
     * @param cVo 클러스터 객체
     * @return 클러스터 생성 결과 201(create), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> addCluster(ClusterCreateVo cVo) {
        SystemService system = admin.getConnection().systemService();
        ClustersService clustersService = system.clustersService();
        String[] ver = cVo.getVersion().split("\\.", 2);      // 버전값 분리

        try{
            if (isNameDuplicate(system, cVo.getName(), null)) {
                log.error("클러스터 이름 중복");
                return CommonVo.failResponse("실패: 클러스터 이름 중복");
            }

            ClusterBuilder clusterBuilder = new ClusterBuilder();
            clusterBuilder
                    .dataCenter(new DataCenterBuilder().id(cVo.getDatacenterId()).build()) // 필수
                    .name(cVo.getName())    // 필수
                    .cpu(
                        new CpuBuilder()
                            .architecture(Architecture.valueOf(cVo.getCpuArc()))
                            .type(cVo.getCpuType())
                            .build()
                    )   // 필수
                    .description(cVo.getDescription())
                    .comment(cVo.getComment())
                    .managementNetwork(new NetworkBuilder().id(cVo.getNetworkId()).build())
                    .biosType(BiosType.valueOf(cVo.getBiosType()))
                    .fipsMode(FipsMode.valueOf(cVo.getFipsMode()))
                    .version(new VersionBuilder().major(Integer.parseInt(ver[0])).minor(Integer.parseInt(ver[1])).build())
                    .switchType(SwitchType.valueOf(cVo.getSwitchType()))
                    .firewallType(FirewallType.valueOf(cVo.getFirewallType()))
                    .logMaxMemoryUsedThreshold(cVo.getLogMaxMemory())
                    .logMaxMemoryUsedThresholdType(LogMaxMemoryUsedThresholdType.valueOf(cVo.getLogMaxType()))
                    .virtService(cVo.isVirtService())
                    .glusterService(cVo.isGlusterService())
                    // HELP: 마이그레이션 정책 관련 설정 값 조회 기능 존재여부 확인필요
                    .migration(
                        new MigrationOptionsBuilder()
                            .bandwidth(new MigrationBandwidthBuilder().assignmentMethod(cVo.getBandwidth()))
                            .encrypted(cVo.getEncrypted())
                    )
                    .fencingPolicy(
                        new FencingPolicyBuilder()
                            .skipIfConnectivityBroken(new SkipIfConnectivityBrokenBuilder().enabled(true))
                            .skipIfSdActive(new SkipIfSdActiveBuilder().enabled(true))
                    );

            if (cVo.isNetworkProvider()) {
                clusterBuilder.externalNetworkProviders(system.openstackNetworkProvidersService().list().send().providers().get(0));
            }

            Cluster cluster = clustersService.add().cluster(clusterBuilder.build()).send().cluster();

            while(true){
                if(cluster.idPresent()){
                    log.info("클러스터 생성 완료");
                    break;
                }
                else{
                    log.debug("클러스터 생성중");
                    Thread.sleep(1000);
                }
            }

            return CommonVo.createResponse();
        }catch (Exception e){
            log.error("실패: 클러스터 생성 실패", e);
            return CommonVo.failResponse(e.getMessage());
        }
    }

    */
/***
     * 클러스터 편집 창
     * @param id 클러스터 id
     * @return 클러스터 값
     *//*

    @Override
    public ClusterCreateVo getCluster(String id){
        SystemService system = admin.getConnection().systemService();
        Cluster cluster = system.clustersService().clusterService(id).get().send().cluster();
        DataCenter dataCenter = system.dataCentersService().dataCenterService(cluster.dataCenter().id()).get().send().dataCenter();

        // management 가 잇어야 네트워크로 나옴
        IdentifiedVo network =
                system.clustersService().clusterService(id).networksService().list().send().networks().stream()
                    .filter(network1 -> network1.usages().contains(NetworkUsage.MANAGEMENT))
                    .map(network1 ->
                            IdentifiedVo.builder()
                                    .id(network1.id())
                                    .name(network1.name())
                                    .build()
                    )
                    .findAny()
                    .orElse(null);

        log.info("클러스터 편집 창");
        return ClusterCreateVo.builder()
                .id(id)
                .name(cluster.name())
                .description(cluster.description())
                .comment(cluster.comment())
                .datacenterId(dataCenter.id())
                .datacenterName(dataCenter.name())
                .cpuType(cluster.cpuPresent() ? cluster.cpu().type() : null)
                .cpuArc(cluster.cpuPresent() ? String.valueOf(cluster.cpu().architecture()) : null)
                .biosType(String.valueOf(cluster.biosType()))
                .fipsMode(String.valueOf(cluster.fipsMode()))
                .version(cluster.version().major() + "." + cluster.version().minor())
                .switchType(String.valueOf(cluster.switchType()))
                .firewallType(String.valueOf(cluster.firewallType()))
                .logMaxMemory(cluster.logMaxMemoryUsedThresholdAsInteger())
                .logMaxType(String.valueOf(cluster.logMaxMemoryUsedThresholdType()))
                .virtService(cluster.virtService())
                .glusterService(cluster.glusterService())
                .networkId(network.getId())
                .networkName(network.getName())
                // migration
                .bandwidth(cluster.migration().bandwidth().assignmentMethod())
                .recoveryPolicy(cluster.errorHandling().onError())
                .build();
    }

    */
/**
     * 클러스터 편집
     * @param cVo 클러스터 객체
     * @return 클러스터 편집 결과 201(create), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> editCluster(ClusterCreateVo cVo) {
        SystemService system = admin.getConnection().systemService();
        ClusterService clusterService = system.clustersService().clusterService(cVo.getId());
        OpenStackNetworkProvider openStackNetworkProvider = system.openstackNetworkProvidersService().list().send().providers().get(0);

        String[] ver = cVo.getVersion().split("\\.");      // 버전값 분리

        try{
            if (isNameDuplicate(system, cVo.getName(), cVo.getId())) {
                log.error("클러스터 이름 중복");
                return CommonVo.failResponse("실패: 클러스터 이름 중복");
            }

            ClusterBuilder clusterBuilder = new ClusterBuilder();
            clusterBuilder
                    .id(cVo.getId())
                    .dataCenter(new DataCenterBuilder().id(cVo.getDatacenterId()).build()) // 필수
                    .name(cVo.getName())    // 필수
                    .cpu(new CpuBuilder().architecture(Architecture.valueOf(cVo.getCpuArc())).type(cVo.getCpuType()))   // 필수
                    .description(cVo.getDescription())
                    .comment(cVo.getComment())
                    .managementNetwork(new NetworkBuilder().id(cVo.getNetworkId()).build())
                    .biosType(BiosType.valueOf(cVo.getBiosType()))
                    .fipsMode(FipsMode.valueOf(cVo.getFipsMode()))
                    .version(new VersionBuilder().major(Integer.parseInt(ver[0])).minor(Integer.parseInt(ver[1])).build())  // 호환 버전
//                    .switchType(cVo.getSwitchType())      // 선택불가
                    .firewallType(FirewallType.valueOf(cVo.getFirewallType()))
                    .logMaxMemoryUsedThreshold(cVo.getLogMaxMemory())
                    .logMaxMemoryUsedThresholdType(LogMaxMemoryUsedThresholdType.PERCENTAGE)
                    .virtService(cVo.isVirtService())
                    .glusterService(cVo.isGlusterService())
                    .errorHandling(new ErrorHandlingBuilder().onError(cVo.getRecoveryPolicy()))   // 복구정책
                    // 마이그레이션 정책
                    .migration(new MigrationOptionsBuilder()
                            .bandwidth(new MigrationBandwidthBuilder().assignmentMethod(cVo.getBandwidth()))    // 대역폭
                            .encrypted(cVo.getEncrypted())      // 암호화
                    );

            if (cVo.isNetworkProvider()) {
                clusterBuilder.externalNetworkProviders(openStackNetworkProvider);
            }

            clusterService.update().cluster(clusterBuilder.build()).send();

            log.info("클러스터 편집 완료");
            return CommonVo.createResponse();
        }catch (Exception e){
            log.error("실패: 클러스터 편집", e);
            return CommonVo.failResponse(e.getMessage());
        }
    }

    */
/**
     * 클러스터 삭제
     * @param ids 클러스터 id 목록
     * @return 클러스터 삭제 결과 200(success), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> deleteCluster(List<String> ids) {
        SystemService system = admin.getConnection().systemService();

        try {
            String name = "";
            for(String id : ids) {
                ClusterService clusterService = system.clustersService().clusterService(id);
                name = clusterService.get().send().cluster().name();
                clusterService.remove().send();
                log.info("클러스터 {} 삭제", name);
            }
            return CommonVo.successResponse();
        }catch (Exception e){
            log.error("클러스터 삭제 실패 {}",  e.getMessage());
            return CommonVo.failResponse(e.getMessage());
        }
    }



    */
/**
     * 클러스터 일반
     * @param id 클러스터 id
     * @return 클러스터 객체
     *//*

    @Override
    public ClusterVo getClusterDetail(String id){
        SystemService system = admin.getConnection().systemService();
        Cluster cluster = system.clustersService().clusterService(id).get().send().cluster();

        log.info("클러스터 일반");
        return ClusterVo.builder()
                    .id(id)
                    .name(cluster.name())
                    .description(cluster.description())
                    .datacenterName(cluster.dataCenterPresent() ? system.dataCentersService().dataCenterService(cluster.dataCenter().id()).get().send().dataCenter().name() : null)
                    .version(cluster.version().major() + "." + cluster.version().minor())
                    .gluster(cluster.glusterService())
                    .virt(cluster.virtService())
                    .cpuType(cluster.cpuPresent() ? cluster.cpu().type() : null)
                    .chipsetFirmwareType(cluster.biosTypePresent() ? TypeExtKt.findBios(cluster.biosType()) : "자동 감지")
                    .threadsAsCore(cluster.threadsAsCores())
                    .memoryOverCommit(cluster.memoryPolicy().overCommit().percentAsInteger())
                    .restoration(TypeExtKt.findMigrateErr(cluster.errorHandling().onError()))
                    .vmCnt(getClusterVmCnt(system, id, ""))
                .build();
    }


    */
/**
     * 클러스터 네트워크 목록
     * @param id 클러스터 id
     * @return 클러스터 네트워크 목록
     *//*

    @Override
    public List<NetworkVo> getNetworksByCluster(String id) {
        SystemService system = admin.getConnection().systemService();
        List<Network> networkList = system.clustersService().clusterService(id).networksService().list().send().networks();

        log.info("클러스터 네트워크 목록");
        return networkList.stream()
                .filter(network -> !networkList.isEmpty())
                .map(network ->
                    NetworkVo.builder()
                        .id(network.id())
                        .name(network.name())
                        .status(TypeExtKt.findNetworkStatus(network.status()))
                        .description(network.description())
                        .networkUsageVo(
                            NetworkUsageVo.builder()
                                .vm(network.usages().contains(NetworkUsage.VM))
                                .display(network.usages().contains(NetworkUsage.DISPLAY))
                                .migration(network.usages().contains(NetworkUsage.MIGRATION))
                                .management(network.usages().contains(NetworkUsage.MANAGEMENT))
                                .defaultRoute(network.usages().contains(NetworkUsage.DEFAULT_ROUTE))
                                .gluster(network.usages().contains(NetworkUsage.GLUSTER))
                            .build()
                        )
                    .build()
                )
                .collect(Collectors.toList());
    }



    */
/**
     * 클러스터 네트워크 생성
     * @param id 클러스터 id
     * @param ncVo 네트워크 생성 객체
     * @return 네트워크 생성 결과 201(create), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> addNetworkByCluster(String id, NetworkCreateVo ncVo) {
        SystemService system = admin.getConnection().systemService();
        NetworksService networksService = system.networksService();
        OpenStackNetworkProvider openStackNetworkProvider = system.openstackNetworkProvidersService().list().send().providers().get(0);
        String dcId = system.clustersService().clusterService(id).get().send().cluster().dataCenter().id();

        // HELP  외부 공급자 설정할 때 물리적 네트워크에 연결하는 거 구현해야함, & 외부 공급자 설정 시 클러스터에서 모두필요 항목은 사라져야됨 (프론트)
        try {
            if(networkNameDuplicate(system, ncVo.getName(), dcId)){
                log.error("네트워크 이름 중복");
                return CommonVo.failResponse("네트워크 이름중복");
            }

            Network network =
                networksService.add()
                        .network(
                            new NetworkBuilder()
                                .dataCenter(new DataCenterBuilder().id(dcId).build())
                                .name(ncVo.getName())
                                .description(ncVo.getDescription())
                                .comment(ncVo.getComment())
                                .vlan(ncVo.getVlan() != null ? new VlanBuilder().id(ncVo.getVlan()) : null)
                                .usages(ncVo.getUsageVm() ? NetworkUsage.VM : NetworkUsage.DEFAULT_ROUTE)
                                .portIsolation(ncVo.getPortIsolation())
                                .mtu(ncVo.getMtu())
                                .stp(ncVo.getStp()) // ?
                                .externalProvider(ncVo.getExternalProvider() ?  openStackNetworkProvider : null)
                        )
                        .send().network();


            // 기본생성되는 vnicprofile 삭제해주는 코드
            AssignedVnicProfilesService aVnicsService = system.networksService().networkService(network.id()).vnicProfilesService();
            AssignedVnicProfileService vnicService = aVnicsService.profileService(aVnicsService.list().send().profiles().get(0).id());
            vnicService.remove().send();

            ncVo.getVnics().forEach(vnicProfileVo -> {
                    aVnicsService.add().profile(new VnicProfileBuilder().name(vnicProfileVo.getName()).build()).send();
            });


            // 클러스터 필요 선택
            ClusterNetworksService clusterNetworksService = system.clustersService().clusterService(id).networksService();
            clusterNetworksService.add()
                    .network(
                        new NetworkBuilder()
                            .id(network.id())
                            .required(ncVo.getClusterVo().isRequired())
                    )
                    .send().network();

            // 외부 공급자 처리시 레이블 생성 안됨
            if (ncVo.getLabel() != null && !ncVo.getLabel().isEmpty()) {
                NetworkLabelsService nlsService = system.networksService().networkService(network.id()).networkLabelsService();
                nlsService.add().label(new NetworkLabelBuilder().id(ncVo.getLabel())).send();
            }

            log.info("네트워크 {} 추가 성공", network.name());
            return CommonVo.createResponse();
        }catch (Exception e){
            e.printStackTrace();
            log.error("error, ", e);
            return CommonVo.failResponse(e.getMessage());
        }
    }


    */
/**
     * 클러스터 네트워크 관리 창
     * @param id 클러스터 id
     * @return 네트워크 usages 목록들
     *//*

    @Override
    public List<NetworkClusterVo> getManageNetworkByCluster(String id) {
        SystemService system = admin.getConnection().systemService();
        List<Network> networkList = system.clustersService().clusterService(id).networksService().list().send().networks();

        log.info("클러스터 네트워크 관리창");
        return networkList.stream()
                .map(network ->
                    NetworkClusterVo.builder()
                            .id(network.id())
                            .name(network.name())
                            .connected(network.clusterPresent()) // 할당: 클러스터에 떠있어야만 이게 보임, 할당을 해제하면 cluster에서 삭제
                            .required(network.required())
                            .networkUsageVo(
                                    NetworkUsageVo.builder()
                                            .vm(network.usages().stream().anyMatch(networkUsage -> networkUsage.value().equals("vm")))
                                            .display(network.usages().stream().anyMatch(networkUsage -> networkUsage.value().equals("display")))
                                            .migration(network.usages().stream().anyMatch(networkUsage -> networkUsage.value().equals("migration")))
                                            .management(network.usages().stream().anyMatch(networkUsage -> networkUsage.value().equals("management")))
                                            .defaultRoute(network.usages().stream().anyMatch(networkUsage -> networkUsage.value().equals("default_route")))
                                            .gluster(network.usages().stream().anyMatch(networkUsage -> networkUsage.value().equals("gluster")))
                                            .build()
                            )
                            .build()
                )
                .collect(Collectors.toList());
    }

    // HELP  관리기능 애매
    */
/**
     * 클러스터 네트워크 관리
     * @param id 클러스터 id
     * @param ncVoList 네트워크 usages 값들
     * @return 클러스터 네트워크 관리 변경 결과 200(success), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> manageNetworkByCluster(String id, List<NetworkClusterVo> ncVoList) {
        SystemService system = admin.getConnection().systemService();
        ClusterNetworksService cNetworksService = system.clustersService().clusterService(id).networksService();

//        List<NetworkUsage> usages = new ArrayList<>();
//        for(NetworkClusterVo ncVo : ncVoList){
//            NetworkBuilder networkBuilder = new NetworkBuilder();
//
//            if (ncVo.getNetworkUsageVo().isManagement()) {
//                usages.add(NetworkUsage.MANAGEMENT);
//            }
//            if (ncVo.getNetworkUsageVo().isDisplay()) {
//                usages.add(NetworkUsage.DISPLAY);
//            }
//            if (ncVo.getNetworkUsageVo().isMigration()) {
//                usages.add(NetworkUsage.MIGRATION);
//            }
//            if (ncVo.getNetworkUsageVo().isGluster()) {
//                usages.add(NetworkUsage.GLUSTER);
//            }
//            if (ncVo.getNetworkUsageVo().isDefaultRoute()) {
//                usages.add(NetworkUsage.DEFAULT_ROUTE);
//            }
//
//            // connect 자기자신은 무조건 할당되어 있음
//            networkBuilder
//                    .id(ncVo.getId())
//                    .required(ncVo.isRequired())
//                    .usages(usages);
//
//            cNetworksService.networkService(ncVo.getId()).update().send();
//        }

        return null;
    }


    */
/**
     * 클러스터 호스트 목록
     * @param id 클러스터 id
     * @return 호스트 목록
     *//*

    @Override
    public List<HostVo> getHostsByCluster(String id) {
        SystemService system = admin.getConnection().systemService();
        List<Host> hostList = system.hostsService().list().send().hosts();
        List<Vm> vmList = system.vmsService().list().send().vms();

        log.info("클러스터 호스트 목록");
        return hostList.stream()
                .filter(host -> host.cluster().id().equals(id))
                .map(host -> {
                    String hostNicId = system.hostsService().hostService(host.id()).nicsService().list().send().nics().get(0).id();

                    return HostVo.builder()
                            .id(host.id())
                            .name(host.name())
                            .status(host.status().value())
                            .address(host.address())
                            .vmUpCnt(
                                    (int) vmList.stream()
                                            .filter(vm -> vm.hostPresent() && vm.host().id().equals(host.id()) && vm.status().value().equals("up"))
                                            .count()
                            )
                            .usageDto(host.status() == HostStatus.UP ? graph.hostPercent(host.id(), hostNicId) : null)
                            .build();
                })
                .collect(Collectors.toList());
    }


    */
/**
     * 클러스터 가상머신 목록
     * @param id 클러스터 id
     * @return 가상머신 목록
     *//*

    @Override
    public List<VmVo> getVmsByCluster(String id) {
        SystemService system = admin.getConnection().systemService();
        List<Vm> vmList = system.vmsService().list().allContent(true).send().vms();

        log.info("클러스터 가상머신 목록");
        return vmList.stream()
                .filter(vm -> vm.cluster().id().equals(id))
                .map(vm -> {
                    String vmNicId = system.vmsService().vmService(vm.id()).nicsService().list().send().nics().get(0).id();

                    return VmVo.builder()
                            .status(vm.status().value())
                            .id(vm.id())
                            .name(vm.name())
                            .upTime(common.getVmUptime(system, vm.id()))
                            .hostEngineVm(vm.origin().equals("managed_hosted_engine"))  // 엔진여부
                            .ipv4(common.getVmIp(system, vm.id(), "v4"))
                            .ipv6(common.getVmIp(system, vm.id(), "v6"))
                            .usageDto(vm.status() == VmStatus.UP ? graph.vmPercent(vm.id(), vmNicId) : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // AffinityService에서 선호도 그룹/레이블 출력
    // 선호도 그룹 목록

    @Override
    public List<AffinityGroupVo> getAffinityGroupsByCluster(String id) {
        log.info("클러스터 선호도 그룹 목록");
        return affinity.getClusterAffinityGroups(id);
    }

    @Override
    public CommonVo<Boolean> addAffinityGroupByCluster(String id, AffinityGroupVo agVo) {
        return affinity.addAffinityGroup(id, true, agVo);
    }

    @Override
    public AffinityGroupVo getAffinityGroupByCluster(String id, String agId) {
        return affinity.setAffinityGroup(id, true, agId);
    }

    @Override
    public CommonVo<Boolean> editAffinityGroupByCluster(AffinityGroupVo agVo) {
        return affinity.editAffinityGroup(agVo);
    }

    @Override
    public CommonVo<Boolean> deleteAffinityGroupByCluster(String id, String agId) {
        return affinity.deleteAffinityGroup(id, true, agId);
    }

    // 선호도 레이블 목록 출력




    // 클러스터 권한 목록
    @Override
    public List<PermissionVo> getPermissionsByCluster(String id) {
        SystemService system = admin.getConnection().systemService();
        List<Permission> permissionList = system.clustersService().clusterService(id).permissionsService().list().send().permissions();

        log.info("클러스터 권한 목록");
        return common.getPermission(system, permissionList);
    }


    // 클러스터 이벤트 출력
    @Override
    public List<EventVo> getEventsByCluster(String id) {
        SystemService system = admin.getConnection().systemService();
        log.info("클러스터 이벤트 목록");
        return system.eventsService().list().send().events().stream()
                .filter(event -> event.clusterPresent() && event.cluster().idPresent() && event.cluster().id().equals(id))
                .map(event ->
                    EventVo.builder()
                        .severity(event.severity().value())     // 상태[LogSeverity] : alert, error, normal, warning
                        .time(new SimpleDateFormat("yyyy. MM. dd. HH:mm:ss").format(event.time()))
                        .message(event.description())
                        .relationId(event.correlationIdPresent() ? event.correlationId() : null)
                        .source(event.origin())
                    .build()
                )
                .collect(Collectors.toList());
    }





//-------------------------------------------------------------------------------


    */
/***
     * 클러스터 이름 중복
     * @param system
     * @param name
     * @param id
     * @return 이름 중복되는게 있으면 true 반환
     *//*

    private boolean isNameDuplicate(SystemService system, String name, String id) {
        return system.clustersService().list().send().clusters().stream()
                .filter(cluster -> id == null || !cluster.id().equals(id))
                .anyMatch(cluster -> cluster.name().equals(name));
    }

    */
/**
     * 클러스터에서 네트워크 생성시 필요한 네트워크 이름 중복
     * @param system
     * @param name
     * @param dcId
     * @return 이름 중복되는게 있으면 true 반환
     *//*

    // 클러스터가 가진 dc 아이디와 네트워크에서
    private boolean networkNameDuplicate(SystemService system, String name, String dcId) {
        return system.networksService().list().send().networks().stream()
                .filter(network -> network.dataCenter().id().equals(dcId))
                .anyMatch(network -> network.name().equals(name));
    }


    */
/**
     * 클러스터 내에 있는 호스트 개수 파악
     * @param system
     * @param clusterId host의 clusterId와 비교
     * @param ele up, down, ""==all 값
     * @return 호스트 개수
     *//*

    private int getClusterHostCnt(SystemService system, String clusterId, String ele){
        List<Host> hostList = system.hostsService().list().send().hosts();

        if("up".equals(ele)){
            return (int) hostList.stream()
                    .filter(host -> host.cluster().id().equals(clusterId) && host.status().value().equals("up"))
                    .count();
        }else if("down".equals(ele)){
            return (int) hostList.stream()
                    .filter(host -> host.cluster().id().equals(clusterId) && !host.status().value().equals("up"))
                    .count();
        }else {
            return (int) hostList.stream()
                    .filter(host -> host.cluster().id().equals(clusterId))
                    .count();
        }
    }

    */
/**
     * 클러스터 내에 있는 가상머신 개수 파악
     * @param system
     * @param clusterId vm의 clusterId와 비교
     * @param ele up, down, "" 값
     * @return 가상머신 개수
     *//*

    private int getClusterVmCnt(SystemService system, String clusterId, String ele){
        List<Vm> vmList = system.vmsService().list().send().vms();

        if("up".equals(ele)) {
            return (int) vmList.stream()
                    .filter(vm -> vm.cluster().id().equals(clusterId) && vm.status().value().equals("up"))
                    .count();
        }else if("down".equals(ele)) {
            return (int) vmList.stream()
                    .filter(vm -> vm.cluster().id().equals(clusterId) && !vm.status().value().equals("up"))
                    .count();
        }else{
            return (int) vmList.stream()
                    .filter(vm -> vm.cluster().id().equals(clusterId))
                    .count();
        }
    }






    // ----------------------------------------------------------------------------------------



    // region :필요없을 거 같음

//    public List<CpuProfileVo> getCpuProfile(String id){
//        Connection connection = adminConnectionService.getConnection();
//        SystemService systemService = connection.systemService();
//
//        List<CpuProfileVo> cpVoList = new ArrayList<>();
//        CpuProfileVo cpVo = null;
//
//        List<CpuProfile> cpuProfileList =
//                ((AssignedCpuProfilesService.ListResponse)systemService.clustersService().clusterService(id).cpuProfilesService().list().send()).profiles();
//
//        for(CpuProfile cpuProfile : cpuProfileList){
//            cpVo = new CpuProfileVo();
//            cpVo.setName(cpuProfile.name());
//            cpVo.setDescription(cpuProfile.description());
//            cpVoList.add(cpVo);
//        }
//        return cpVoList;
//    }

    // endregion

}
*/
