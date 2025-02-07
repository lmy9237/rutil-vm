/*
@Service
@Slf4j
public class NetworkServiceImpl extends BaseService implements ItNetworkService {
    @Autowired private CommonService commonService;

    @Override
    public List<NetworkVo> getNetworks() {
        List<Network> networkList = NetworkExtKt.findAllNetworks(getConn());
        return NetworkVoKt.toNetworkVos(networkList, getConn());
    }


    // network 생성 시 필요한 dc와 클러스터 정보 가져오기
    @Override
    public List<NetworkDcClusterVo> setDcCluster() {
        List<DataCenter> dataCenterList = DataCenterExtKt.findAllDataCenters(getConn());
        return NetworkDcClusterVoKt.toNetworkDcClusterVos(dataCenterList, getConn());
    }

    // 새 논리 네트워크 추가
    // 필요 name, datacenter_id
    @Override
    public CommonVo<Boolean> addNetwork(NetworkCreateVo ncVo) {
        NetworksService networksService = getSystem().networksService();
        OpenStackNetworkProvider openStackNetworkProvider = getSystem().openstackNetworkProvidersService().list().send().providers().get(0);

        //
        // HELP 외부 공급자 설정할 때 물리적 네트워크에 연결하는 거 구현해야함, & 외부 공급자 설정 시 클러스터에서 모두필요 항목은 사라져야됨 (프론트)
        try {
            Network network =
                    networksService.add()
                            .network(
                                    new NetworkBuilder()
                                            .dataCenter(new DataCenterBuilder().id(ncVo.getDatacenterId()).build())
                                            .name(ncVo.getName())
                                            .description(ncVo.getDescription())
                                            .comment(ncVo.getComment())
                                            .vlan(ncVo.getVlan() != null ? new VlanBuilder().id(ncVo.getVlan()) : null)
                                            .usages(ncVo.getUsageVm() ? NetworkUsage.VM : NetworkUsage.DEFAULT_ROUTE)
                                            .portIsolation(ncVo.getPortIsolation())
                                            .mtu(ncVo.getMtu())
                                            .stp(ncVo.getStp()) // ?
                                            .externalProvider(ncVo.getExternalProvider() ?  openStackNetworkProvider : null)
                                            // 물리적네트워크
//                                            .externalProviderPhysicalNetwork(new NetworkBuilder().externalProviderPhysicalNetwork())
                            )
                            .send().network();

            // 기본생성되는 vnicprofile 삭제해주는 코드
            AssignedVnicProfilesService aVnicsService = getSystem().networksService().networkService(network.id()).vnicProfilesService();
            AssignedVnicProfileService vnicService = aVnicsService.profileService(aVnicsService.list().send().profiles().get(0).id());
            vnicService.remove().send();

            ncVo.getVnicProfileVos().forEach(vnicProfileVo -> {
                aVnicsService.add().profile(new VnicProfileBuilder().name(vnicProfileVo.getName()).build()).send();
            });


            // 클러스터 모두연결이 선택되어야지만 모두 필요가 선택됨
            ncVo.getClusterVos().stream()
                    .filter(NetworkClusterVo::isConnected) // 연결된 경우만 필터링
                    .forEach(networkClusterVo -> {
                        ClusterNetworksService clusterNetworksService = getSystem().clustersService().clusterService(networkClusterVo.getId()).networksService();
                        clusterNetworksService.add().network(
                                new NetworkBuilder()
                                        .id(network.id())
                                        .required(networkClusterVo.getRequired())
                        ).send().network();
                    });

            // 외부 공급자 처리시 레이블 생성 안됨
            if (!ncVo.getLabel().isEmpty()) {
                NetworkLabelsService nlsService = getSystem().networksService().networkService(network.id()).networkLabelsService();
                nlsService.add().label(new NetworkLabelBuilder().id(ncVo.getLabel())).send();
            }

            log.info("network {} 추가 성공", network.name());
            return CommonVo.createResponse();
        }catch (Exception e){
            e.printStackTrace();
            log.error("error, ", e);
            return CommonVo.failResponse(e.getMessage());
        }
    }

    // 네트워크 편집 창
    @Override
    public NetworkCreateVo setEditNetwork(String id) {
        Network network = getSystem().networksService().networkService(id).get().follow("networklabels").send().network();

        return NetworkCreateVoKt.toNetworkCreateVo(network, getConn(), id);
    }

    // 네트워크 편집
    // 중복이름 : dc 다르면 중복명 가능
    // 문제있음
    @Override
    public CommonVo<Boolean> editNetwork(NetworkCreateVo ncVo) {
        DataCenter dataCenter = getSystem().dataCentersService().dataCenterService(ncVo.getDatacenterId()).get().send().dataCenter();
        NetworkService networkService = getSystem().networksService().networkService(ncVo.getId());

        try {
            NetworkBuilder networkBuilder = new NetworkBuilder();
            networkBuilder
                    .id(ncVo.getId())
                    .name(ncVo.getName())
                    .description(ncVo.getDescription())
                    .comment(ncVo.getComment())
                    .usages(ncVo.getUsageVm() ? NetworkUsage.VM : NetworkUsage.DEFAULT_ROUTE)
//                    .dnsResolverConfiguration()   // HELP DNS 구현안됨
                    .mtu(ncVo.getMtu())
                    .stp(ncVo.getStp())
                    .vlan(ncVo.getVlan() != null ? new VlanBuilder().id(ncVo.getVlan()) : null)
//                    .externalProvider(ncVo.getExternalProvider() ? system.openstackNetworkProvidersService().list().send().providers().get(0) : null)  // 편집불가
                    .dataCenter(dataCenter);

            // 외부 공급자 처리시 레이블 생성 안됨
            if (ncVo.getLabel() != null && !ncVo.getLabel().isEmpty()) {
                NetworkLabelsService nlsService = getSystem().networksService().networkService(ncVo.getId()).networkLabelsService();

                if( nlsService.list().send().labels().get(0).idPresent() ) {
                    nlsService.labelService(nlsService.list().send().labels().get(0).id()).remove().send();
                }
                nlsService.add().label(new NetworkLabelBuilder().id(ncVo.getLabel())).send();// 그리고 다시 생성
            }

            networkService.update().network(networkBuilder.build()).send();

            log.info("네트워크 편집");
            return CommonVo.createResponse();
        }catch (Exception e){
            log.error("네트워크 편집에러, {}", e.getLocalizedMessage());
            return CommonVo.failResponse(e.getMessage());
        }
    }

    // 네트워크 삭제
    @Override
    public CommonVo<Boolean> deleteNetwork(String id) {
        NetworkService networkService = getSystem().networksService().networkService(id);
        List<Cluster> clusterList = getSystem().clustersService().list().send().clusters();

        // 네트워크가 비가동 중인지 확인
        boolean cDelete = clusterList.stream()
                            .flatMap(cluster -> getSystem().clustersService().clusterService(cluster.id()).networksService().list().send().networks().stream())
                            .filter(network -> network.id().equals(id))
                            .noneMatch(network -> network.status().equals(NetworkStatus.OPERATIONAL));
        try {
            if (cDelete) {  // 삭제 가능한 경우 네트워크를 삭제하고 성공 응답을 반환합니다
                networkService.remove().send();

                log.info("network 삭제");
                return CommonVo.successResponse();
            } else {
                log.error("network 삭제 실패");
                return CommonVo.failResponse("오류");
            }
        }catch (Exception e){
            log.error("network 삭제 실패");
            return CommonVo.failResponse("오류");
        }

    }


    // 가져오기 출력 창
    @Override
    public NetworkImportVo setImportNetwork() {
        OpenStackNetworkProvider osProvider = getSystem().openstackNetworkProvidersService().list().follow("networks").send().providers().get(0);
        List<DataCenter> dcList = getSystem().dataCentersService().list().send().dataCenters();
        List<Network> nwList = getSystem().networksService().list().send().networks().stream().filter(Network::externalProviderPresent).collect(Collectors.toList());

        nwList.stream().map(Network::name).forEach(System.out::println);
        System.out.println("---");

        return NetworkImportVoKt.toNetworkImportVo(osProvider, getConn());
    }

    // 네트워크 - 가져오기 출력창 (openStack)
    @Override
    public CommonVo<Boolean> importNetwork() {
        // 그냥 있는거 가져오기
        OpenStackNetworkProvider osProvider = getSystem().openstackNetworkProvidersService().list().follow("networks").send().providers().get(0);
        return null;
    }


    // 일반
    @Override
    public NetworkVo getNetwork(String id) {
        Network network = getSystem().networksService().networkService(id).get().send().network();
        return NetworkVoKt.toNetworkVo(network, getConn());
    }

    @Override
    public List<VnicProfileVo> getVnicByNetwork(String id) {
        List<VnicProfile> vnicProfileList = getSystem().networksService().networkService(id).vnicProfilesService().list().send().profiles();
        Network network = getSystem().networksService().networkService(id).get().send().network();

        return vnicProfileList.stream()
                .filter(vnicProfile -> id.equals(vnicProfile.network().id()))
                .map(vnicProfile -> {
                    DataCenter dataCenter = getSystem().dataCentersService().dataCenterService(network.dataCenter().id()).get().send().dataCenter();
                    return VnicProfileVoKt.toVnicProfileVo(vnicProfile, getConn(), id);
                })
                .collect(Collectors.toList());
    }

    // vnic 생성 창
    // HELP qos는 제외항목, 네트워크필터도 vdsm으로 고정
    //  통과 기능 활성화시 네트워크필터 기능 삭제, 마이그레이션 버튼 활성화, 페일오버 활성화, 포트미러링 비활성화
    //  사용자정의 속성 애매
    @Override
    public VnicCreateVo setVnic(String id) {
        Network network = getSystem().networksService().networkService(id).get().send().network();
        return VnicCreateVoKt.toVnicCreateVo(network, getConn());
    }


    // vnic 생성
    @Override
    public CommonVo<Boolean> addVnic(String id, VnicCreateVo vcVo) {
        AssignedVnicProfilesService aVnicsService = getSystem().networksService().networkService(id).vnicProfilesService();
        List<VnicProfile> vpList = getSystem().networksService().networkService(id).vnicProfilesService().list().send().profiles();

        boolean duplicateName = vpList.stream().anyMatch(vnicProfile -> vnicProfile.name().equals(vcVo.getName()));

        try{
            // 같은 network내 vnic이름 중복 x, 다르면 중복 o
            if(!duplicateName) {
                VnicProfileBuilder vnicBuilder = new VnicProfileBuilder();
                vnicBuilder
                        .network(new NetworkBuilder().id(id).build())
                        .name(vcVo.getName())
                        .description(vcVo.getDescription())
                        // 네트워크 필터 기본생성됨
                        .passThrough(new VnicPassThroughBuilder().mode(vcVo.getPassThrough()).build())
                        .migratable(vcVo.getMigration())
                        .build();

                aVnicsService.add().profile(vnicBuilder).send().profile();

                log.info("네트워크 vnic 생성");
                return CommonVo.successResponse();
            }else {
                log.error("vnic 이름 중복");
                return CommonVo.failResponse("vnic 이름 중복");
            }
        }catch (Exception e){
            log.error("error");
            e.printStackTrace();
            return CommonVo.failResponse(e.getMessage());
        }
    }

    // vnic 편집창
    @Override
    public VnicCreateVo setEditVnic(String id, String vcId) {
        DataCenter dataCenter = getSystem().networksService().networkService(id).get().send().network().dataCenter();
        VnicProfile vnicProfile = getSystem().networksService().networkService(id).vnicProfilesService().profileService(vcId).get().send().profile();

        log.info("vnic 프로파일 편집");
        return VnicCreateVoKt.toVnicCreateVo(vnicProfile, getConn(), vcId);
    }

    // vnic 편집
    @Override
    public CommonVo<Boolean> editVnic(String id, String vnicProfileId, VnicCreateVo vcVo) {
        VnicProfileService vnicService = getSystem().vnicProfilesService().profileService(vnicProfileId);

        try{
            VnicProfileBuilder vnicBuilder = new VnicProfileBuilder();
            vnicBuilder
                    .name(vcVo.getName())
                    .description(vcVo.getDescription())
                    .passThrough(new VnicPassThroughBuilder().mode(vcVo.getPassThrough()).build())
                    .migratable(vcVo.getMigration())
                    .portMirroring(vcVo.getPortMirror())
                    .build();

            vnicService.update().profile(vnicBuilder).send().profile();

            log.info("네트워크 Vnic 편집성공");
            return CommonVo.successResponse();
        }catch (Exception e){
            log.error("error");
            e.printStackTrace();
            return CommonVo.failResponse(e.getMessage());
        }
    }
    
    // vnic 삭제
    @Override
    public CommonVo<Boolean> deleteVnic(String id, String vnicProfileId) {
        VnicProfileService vnicService = getSystem().vnicProfilesService().profileService(vnicProfileId);
        try {
            vnicService.remove().send();
            log.info("네트워크 Vnic 삭제 성공");
            return CommonVo.successResponse();
        }catch (Exception e){
            log.error("error");
            e.printStackTrace();
            return CommonVo.failResponse(e.getMessage());
        }
    }



    // 클러스터 목록
    @Override
    public List<NetworkClusterVo> getCluster(String id) {
        List<Cluster> clusterList = getSystem().clustersService().list().send().clusters();

        return clusterList.stream()
                .flatMap(cluster -> {
                    List<Network> networkList = getSystem().clustersService().clusterService(cluster.id()).networksService().list().send().networks();

                    return networkList.stream()
                            .filter(network -> network.id().equals(id))
                            .map(network -> NetworkClusterVoKt.toNetworkClusterVo(network, cluster));
                })
                .collect(Collectors.toList());
    }

    // 클러스터 네트워크 관리 창
    @Override
    public NetworkUsageVo getUsage(String id, String cId) {
        Network network = getSystem().clustersService().clusterService(cId).networksService().networkService(id).get().send().network();

        // 모두 할당? 모두 필요?
        return NetworkUsageVoKt.toNetworkUsageVo(network);
    }

    // 네트워크 관리
    // 모두 할당, 모두 필요 / 관리 기능 활성화시 추가만 가능한거 같음 / 나머지는 선택가능
    @Override
    public CommonVo<Boolean> editUsage(String id, String cId, NetworkUsageVo nuVo) {
        // 클러스터 모두연결이 선택되어야지만 모두 필요가 선택됨
//        ncVo.getClusterVoList().stream()
//                .filter(NetworkClusterVo::isConnected) // 연결된 경우만 필터링
//                .forEach(networkClusterVo -> {
//                    ClusterNetworksService clusterNetworksService = system.clustersService().clusterService(networkClusterVo.getId()).networksService();
//                    clusterNetworksService.add().network(
//                            new NetworkBuilder()
//                                    .id(network.id())
//                                    .required(networkClusterVo.isRequired())
//                    ).send().network();
//                });
        return null;
    }

    // 호스트 목록
    @Override
    public List<NetworkHostVo> getHost(String id) {
        List<Host> hostList = getSystem().hostsService().list().send().hosts();
        DecimalFormat df = new DecimalFormat("###,###");

        return hostList.stream()
                .flatMap(host -> {
                    List<NetworkAttachment> naList = getSystem().hostsService().hostService(host.id()).networkAttachmentsService().list().send().attachments();
                    Cluster c = getSystem().clustersService().clusterService(host.cluster().id()).get().send().cluster();
                    List<HostNic> nicList = getSystem().hostsService().hostService(host.id()).nicsService().list().send().nics();

                    return naList.stream()
                        .filter(na -> na.networkPresent() && na.network().id().equals(id))
                        .map(na -> NetworkHostVoKt.toNetworkHostVo(host, getConn(), c));
                })
                .collect(Collectors.toList());
    }


    // 가상머신 목록
    @Override
    public List<NetworkVmVo> getVm(String id) {
        List<Vm> vmList = getSystem().vmsService().list().send().vms();

        return vmList.stream()
                .flatMap(vm -> {
                    List<Nic> nicList = getSystem().vmsService().vmService(vm.id()).nicsService().list().send().nics();
                    List<ReportedDevice> rdList = getSystem().vmsService().vmService(vm.id()).reportedDevicesService().list().send().reportedDevice();

                    return nicList.stream()
                            .filter(nic -> {
                                VnicProfile vnicProfile = getSystem().vnicProfilesService().profileService(nic.vnicProfile().id()).get().send().profile();
                                return vnicProfile.network().id().equals(id);
                            })
                            .map(nic -> {
                                List<Statistic> statisticList = getSystem().vmsService().vmService(vm.id()).nicsService().nicService(nic.id()).statisticsService().list().send().statistics();

                                NetworkVmVo.Builder builder = NetworkVmVo.builder()
                                        .vmId(vm.id())
                                        .vmName(vm.name())
                                        .status(vm.statusPresent() ? vm.status() : null)
                                        .fqdn(vm.fqdn())
                                        .clusterName(getSystem().clustersService().clusterService(vm.cluster().id()).get().send().cluster().name())
                                        .description(vm.description())
                                        .vnicStatus(nic.linked())
                                        .vnicId(nic.id())
                                        .vnicName(nic.name())
                                        .vnicRx(vm.status() == VmStatus.UP ? StatisticExtKt.findSpeed(statisticList, "data.current.rx.bps") : null)
                                        .vnicTx(vm.status() == VmStatus.UP ? StatisticExtKt.findSpeed(statisticList, "data.current.tx.bps") : null)
                                        .rxTotalSpeed(vm.status() == VmStatus.UP ? StatisticExtKt.findSpeed(statisticList, "data.total.rx") : null)
                                        .txTotalSpeed(vm.status() == VmStatus.UP ? StatisticExtKt.findSpeed(statisticList, "data.total.tx") : null);

                                if (vm.status() == VmStatus.UP) {
                                    rdList.stream()
                                        .filter(ReportedDevice::ipsPresent)
                                        .forEach(rd -> builder
                                            .ipv4(rd.ips().get(0).address())
                                            .ipv6(rd.ips().get(1).address())
                                        );
                                }
                                return builder.build();
                            });
                })
                .collect(Collectors.toList());
    }

    // 가상머신 nic 제거
    @Override
    public CommonVo<Boolean> deleteVmNic(String id, String vmId, String nicId) {
        // DELETE /ovirt-engine/api/vms/123/nics/456
        VmNicService vmNicService = getSystem().vmsService().vmService(vmId).nicsService().nicService(nicId);

        try{
            vmNicService.remove().send();
            return CommonVo.successResponse();

        }catch (Exception e){
            log.error("error");
            e.printStackTrace();
            return CommonVo.failResponse(e.getMessage());
        }
    }

    // 템플릿 목록
    @Override
    public List<NetworkTemplateVo> findTemplates(String id) {
        List<Template> templateList = getSystem().templatesService().list().send().templates();

        return templateList.stream()
                .flatMap(template -> {
                    List<Nic> nicList = getSystem().templatesService().templateService(template.id()).nicsService().list().send().nics();

                    return nicList.stream()
                            .filter(nic -> {
                                VnicProfile vp = getSystem().vnicProfilesService().profileService(nic.vnicProfile().id()).get().send().profile();
                                return vp.networkPresent() && vp.network().id().equals(id);
                            })
                            .map(nic -> NetworkTemplateVoKt.toNetworkTemplateVo(template, getConn(), nic));
                })
                .collect(Collectors.toList());
    }


    // 템플릿 nic 제거
    @Override
    public CommonVo<Boolean> deleteTempNic(String id, String tempId, String nicId) {
        TemplateNicService tnService = getSystem().templatesService().templateService(tempId).nicsService().nicService(nicId);

        try {
            tnService.remove().send();
            log.info("템플릿 nic 제거");
            return CommonVo.successResponse();
        }catch (Exception e){
            log.error("error");
            e.printStackTrace();
            return CommonVo.failResponse(e.getMessage());
        }
    }

    @Override
    public List<PermissionVo> getPermission(String id) {
        List<Permission> permissionList = getSystem().networksService().networkService(id).permissionsService().list().send().permissions();
        return PermissionVoKt.toPermissionVos(permissionList, getConn());
    }
}
*/