/*
package com.itinfo.rutilvm.service.computing.impl;

import com.itinfo.itcloud.ExpectStatusExtKt;
import com.itinfo.itcloud.ItCloudApplicationKt;
import com.itinfo.itcloud.model.computing.*;
import com.itinfo.itcloud.model.response.Res;
import com.itinfo.itcloud.model.network.NicVo;
import com.itinfo.itcloud.model.setting.PermissionVo;
import com.itinfo.itcloud.model.setting.PermissionVoKt;
import com.itinfo.itcloud.repository.*;
import com.itinfo.itcloud.service.BaseService;
import com.itinfo.itcloud.service.computing.ItAffinityService;
import com.itinfo.itcloud.service.computing.ItGraphService;
import com.itinfo.itcloud.service.computing.ItHostService;
import com.itinfo.rutilvm.util.ovirt.StatisticExtKt;
import lombok.extern.slf4j.Slf4j;
import org.ovirt.engine.sdk4.builders.*;
import org.ovirt.engine.sdk4.services.HostService;
import org.ovirt.engine.sdk4.services.HostsService;
import org.ovirt.engine.sdk4.types.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class HostServiceImpl extends BaseService implements ItHostService {
    @Autowired private ItAffinityService affinity;
    @Autowired private ItGraphService dash;

    @Autowired private HostConfigurationRepository hostConfigurationRepository;
    @Autowired private HostSamplesHistoryRepository hostSamplesHistoryRepository;
    @Autowired private HostInterfaceSampleHistoryRepository hostInterfaceSampleHistoryRepository;
    @Autowired private VmSamplesHistoryRepository vmSamplesHistoryRepository;
    @Autowired private VmInterfaceSamplesHistoryRepository vmInterfaceSamplesHistoryRepository;

    */
/**
     * 호스트 목록
     * @return 호스트 목록
     *//*

    @Override
    public List<HostVo> findAll() {
        List<Host> hostList = getSystem().hostsService().list().allContent(true).send().hosts(); // hosted Engine의 정보가 나온다
        log.info("호스트 목록");
        return HostVoKt.toHostVos(hostList, getConn());
    }


    */
/**
     * 호스트 생성
     * 전원관리 없앰
     * @param hostCreateVo 호스트 객체
     * @return host 201(create) 404(fail)
     *//*

    @Override
    public Res<Boolean> addHost(HostCreateVo hostCreateVo) {
        HostsService hostsService = getSystem().hostsService();
        // ssh port가 22면 .ssh() 설정하지 않아도 알아서 지정됨.
        // ssh port 변경을 ovirt에서 해보신적은 없어서 우선 보류 (cmd로 하셨음)
        // 비밀번호 잘못되면 보여줄 코드?
        try {
            // 호스트 엔진 배치작업 선택 (없음/배포)  -> 호스트 생성
            Host host =
                hostsService.add()
                        .deployHostedEngine(hostCreateVo.isHostEngine())
                        .host(
                            new HostBuilder()
                                .cluster(new ClusterBuilder().id(hostCreateVo.getId()))
                                .name(hostCreateVo.getName())
                                .comment(hostCreateVo.getComment())
                                .address(hostCreateVo.getHostIp())  // 호스트이름/IP
                                .rootPassword(hostCreateVo.getSshPw())  // 암호
                                .spm(new SpmBuilder().priority(hostCreateVo.getSpm()))
                                .ssh(new SshBuilder().port(hostCreateVo.getSshPort()))  // 기본값이 22
                        )
                        .send().host();

            HostService hostService = getSystem().hostsService().hostService(host.id());


            if(ExpectStatusExtKt.expectHostStatus(getConn(), host.id(), HostStatus.UP, 900000, 3000)) {
                log.info("호스트 생성 완료: " + host.name());
                return Res.createResponse();
            } else {
                log.error("호스트 생성 시간 초과: {}", host.name());
                return Res.failResponse("호스트 생성 시간 초과");
            }

        } catch (Exception e) {
            log.error("호스트 추가 실패 {}", e.getMessage());
            e.getMessage();
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 호스트 편집창
     * @param id 호스트 id
     * @return 호스트 객체
     *//*

    @Override
    public HostCreateVo setHost(String id) {
        
        Host host = getSystem().hostsService().hostService(id).get().allContent(true).send().host();
        Cluster cluster = getSystem().clustersService().clusterService(host.cluster().id()).get().send().cluster();

        log.info("호스트 편집창");

        return HostCreateVo.builder()
                .clusterId(cluster.id())
                .clusterName(cluster.name())
                .datacenterName(getSystem().dataCentersService().dataCenterService(cluster.dataCenter().id()).get().send().dataCenter().name())
                .id(id)
                .name(host.name())
                .comment(host.comment())
                .hostIp(host.address())
                .sshPort(host.ssh().portAsInteger())
                // 인증 - 사용자 이름, 공개키 오케는 지정사용
                .sshPw(host.rootPassword())
                .spm(host.spm().priorityAsInteger())
                .hostEngine(host.hostedEnginePresent()) // ?? 호스트 엔진 배치작업 없음
                .build();
    }


    */
/**
     * 호스트 편집
     * @param hcVo 호스트 객체
     * @return host 201(create) 404(fail)
     *//*

    @Override
    public Res<Boolean> editHost(HostCreateVo hcVo) {

        HostService hostService = getSystem().hostsService().hostService(hcVo.getId());

        try {
            hostService.update()
                    .host(
                        new HostBuilder()
                            .id(hcVo.getId())
                            .name(hcVo.getName())
                            .comment(hcVo.getComment())
                            .spm(new SpmBuilder().priority(hcVo.getSpm()))
                            .build()
                    )
                    .send().host();

            log.info("호스트 편집");
            return Res.createResponse();
        } catch (Exception e) {
            log.error("호스트 편집 error : ", e);
            return Res.failResponse(e.getMessage());
        }
    }



    */
/**
     * 호스트 삭제
     * 삭제 여부 = 가상머신 돌아가는게 있는지 -> 유지보수 상태인지 -> 삭제
     * @param ids 호스트 id 목록
     * @return host 200(success) 404(fail)
     *//*

    @Override
    public Res<Boolean> deleteHost(List<String> ids) {
        try {
            for(String id : ids) {
                HostService hostService = getSystem().hostsService().hostService(id);
                Host host = hostService.get().send().host();
                HostStatus status = hostService.get().send().host().status();
                String name = host.name();

                if (status == HostStatus.MAINTENANCE) {
                    hostService.remove().send();
                    log.info("호스트 {} 삭제", name);
                } else {
                    log.error("호스트 삭제불가 : {}, 유지보수 모드로 바꾸세요", host.name());
                    return Res.failResponse(host.name() + " 호스트는 유지보수 모드가 아님");
                }
            }
            return Res.successResponse();
        }catch (Exception e){
            log.error("error ", e);
            return Res.failResponse(e.getMessage());
        }
    }




    */
/**
     * 호스트 유지보수
     * @param id 호스트 id
     * @return host 200(success) 404(fail)
     *//*

    @Override
    public Res<Boolean> deactiveHost(String id) {
        
        HostService hostService = getSystem().hostsService().hostService(id);

        try {
            Host host = hostService.get().send().host();
            HostStatus status = host.status();

            if (status != HostStatus.MAINTENANCE) {
                hostService.deactivate().send();

                if (ExpectStatusExtKt.expectHostStatus(getConn(), host.id(), HostStatus.MAINTENANCE, 900000, 6000)) {
                    log.info("호스트 유지보수 모드 전환 완료: {}", host.name());
                    return Res.successResponse();
                } else {
                    log.error("호스트 유지보수 모드 전환 시간 초과: {}", host.name());
                    return Res.failResponse("유지보수 모드 전환 시간 초과");
                }
            } else {
                log.info("현재 호스트는 이미 유지보수 모드입니다: {}", host.name());
                return Res.failResponse("현재 호스트는 이미 유지보수 모드입니다");
            }
        } catch (Exception e) {
            log.error("호스트 유지보수 모드 전환 중 오류: ", e);
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 호스트 활성
     * @param id 호스트 id
     * @return host 200(success) 404(fail)
     *//*

    @Override
    public Res<Boolean> activeHost(String id) {
        
        HostService hostService = getSystem().hostsService().hostService(id);

        try {
            Host host = hostService.get().send().host();
            HostStatus status = host.status();

            if (status != HostStatus.UP) {
                hostService.activate().send();

                if (ExpectStatusExtKt.expectHostStatus(getConn(), host.id(), HostStatus.UP, 60000, 3000)) {
                    log.info("호스트 활성 전환 완료: {}", host.name());
                    return Res.successResponse();
                } else {
                    log.error("호스트 활성 전환 시간 초과: {}", host.name());
                    return Res.failResponse("활성 전환 시간 초과");
                }
            } else {
                log.info("현재 호스트는 이미 활성 상태입니다: {}", host.name());
                return Res.failResponse("현재 호스트는 이미 활성 상태입니다");
            }
        } catch (Exception e) {
            log.error("호스트 활성 전환 중 오류: ", e);
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 호스트 새로고침
     * @param id 호스트 id
     * @return host 200(success) 404(fail)
     *//*

    @Override
    public Res<Boolean> refreshHost(String id) {

        HostService hostService = getSystem().hostsService().hostService(id);

        try {
            hostService.refresh().send();

            if (ExpectStatusExtKt.expectHostStatus(getConn(), id, HostStatus.UP, 60000, 3000)) {
                log.info("호스트 새로고침 완료: {}", hostService.get().send().host().name());
                return Res.successResponse();
            } else {
                log.error("호스트 새로고침 시간 초과: {}", hostService.get().send().host().name());
                return Res.failResponse("새로고침 시간 초과");
            }
        } catch (Exception e) {
            log.error("호스트 새로고침 중 오류: ", e);
            return Res.failResponse(e.getMessage());
        }
    }


    // host SSH 관리 - 재시작 부분
    private boolean rebootHostViaSSH(String hostAddress, String username, String password, int port) {
        com.jcraft.jsch.Session session = null;
        ChannelExec channel = null;
        log.debug("ssh 시작");

        try {
            // SSH 세션 생성 및 연결
            session = new JSch().getSession(username, hostAddress, port);
            session.setPassword(password);
            session.setConfig("StrictHostKeyChecking", "no");   // 호스트 키 확인을 건너뛰기 위해 설정
            session.connect();

            channel = (ChannelExec) session.openChannel("exec");  // SSH 채널 열기
            channel.setCommand("sudo reboot");// 재부팅 명령 실행
            channel.connect();

            // 명령 실행 완료 대기
            while (!channel.isClosed()) {
                Thread.sleep(100);
            }

            channel.disconnect();
            session.disconnect();
            int exitStatus = channel.getExitStatus();
            return exitStatus == 0;
        } catch (JSchException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }


    */
/**
     * ssh 관리 - 재시작
     * 제외하고 cli 로 하는 식으로
     * @param id 호스트 id
     * @return host 200(success) 404(fail)
     *//*

    @Override
    public Res<Boolean> reStartHost(String id) throws UnknownHostException {
        HostService hostService = getSystem().hostsService().hostService(id);
        Host host = hostService.get().send().host();
        InetAddress address = InetAddress.getByName(host.address());

        try {
            if (!rebootHostViaSSH(address.getHostAddress(), "root", "adminRoot!@#", 22)) {
                return Res.failResponse("SSH를 통한 호스트 재부팅 실패");
            }

            Thread.sleep(60000); // 60초 대기, 재부팅 시간 고려

            if (expectStatus(hostService, HostStatus.UP, 3000, 900000)) {
                log.info("호스트 재부팅 완료: {}", id);
                return Res.successResponse();
            } else {
                return Res.failResponse("재부팅 전환 시간 초과");
            }

        }catch (Exception e){
            log.error("error: ", e);
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 일반
     * @param id 호스트 id
     * @return 호스트 객체
     *//*

    @Override
    public HostVo getHost(String id) {
        
        Host host = getSystem().hostsService().hostService(id).get().allContent(true).send().host();
        HostService hostService = getSystem().hostsService().hostService(id);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy. MM. dd. HH:mm:ss");

        // 온라인 논리 CPU 코어수 - HostCpuUnit 이 없음 인식안됨
        // https://192.168.0.70/ovirt-engine/api/hosts/3bbd27b9-13d8-4fff-ad29-c0350994ca88/cpuunits,numanodes
        List<Statistic> statisticList = hostService.statisticsService().list().send().statistics();

        long bootTime = statisticList.stream()
                                .filter(statistic -> statistic.name().equals("boot.time"))
                                .map(statistic -> statistic.values().get(0).datum().longValue() * 1000)
                                .findAny()
                                .orElse(0L);

        log.info("호스트 일반");
        return HostVo.builder()
                .id(id)
                .name(host.name())
                .address(host.address())        //호스트 ip
                .spmPriority(host.spm().priorityAsInteger())    // spm 우선순위
                .status(host.status().value())
                // cpu 있으면 출력으로 바꿔야됨
                .cpuCnt(host.cpu().topologyPresent() ?
                        host.cpu().topology().coresAsInteger()
                        * host.cpu().topology().socketsAsInteger()
                        * host.cpu().topology().threadsAsInteger() : 0
                )
                .cpuOnline(
                        hostService.cpuUnitsService().list().send().cpuUnits().stream()
                                .map(HostCpuUnit::cpuIdAsInteger)
                                .collect(Collectors.toList())
                )
                .vmUpCnt(
                        (int) getSystem().vmsService().list().send().vms().stream()
                                .filter(vm -> vm.host()!= null && vm.host().id().equals(host.id()) && vm.status().value().equals("up"))
                                .count()
                )
                .iscsi(host.iscsiPresent() ? host.iscsi().initiator() : null)   // iscsi 게시자 이름
                .kdump(host.kdumpStatus().value())      // kdump intergration status
                .devicePassThrough(host.devicePassthrough().enabled())  // 장치통과
                .memoryMax(host.maxSchedulingMemory())    // 최대 여유 메모리.
                .memory(StatisticExtKt.findSpeed(statisticList, "memory.total"))
                .memoryFree(StatisticExtKt.findSpeed(statisticList, "memory.free"))
                .memoryUsed(StatisticExtKt.findSpeed(statisticList, "memory.used"))
                .memoryShared(StatisticExtKt.findSpeed(statisticList, "memory.shared")) // 문제잇음
                .swapTotal(StatisticExtKt.findSpeed(statisticList, "swap.total"))
                .swapFree(StatisticExtKt.findSpeed(statisticList, "swap.free"))
                .swapUsed(StatisticExtKt.findSpeed(statisticList, "swap.used"))
                .hugePage2048Total(StatisticExtKt.findPage(statisticList, "hugepages.2048.total"))
                .hugePage2048Free(StatisticExtKt.findPage(statisticList, "hugepages.2048.free"))
                .hugePage1048576Total(StatisticExtKt.findPage(statisticList, "hugepages.1048576.total"))
                .hugePage1048576Free(StatisticExtKt.findPage(statisticList, "hugepages.1048576.free"))
                .bootingTime(sdf.format(new Date(bootTime)))
//                .hostedEngine(host.hostedEnginePresent() && host.hostedEngine().active()) // 이 호스트 내에 호스트 가상머신이 있는지 보기
                .hostedActive(host.hostedEnginePresent() ? host.hostedEngine().active() : null)
                .hostedScore(host.hostedEnginePresent() ? host.hostedEngine().scoreAsInteger() : 0)
                .ksm(host.ksmPresent() && host.ksm().enabled())         // 메모리 페이지 공유  비활성
                .pageSize(host.transparentHugePages().enabled())    // 자동으로 페이지를 크게 (확실하지 않음. 매우)
                .seLinux(host.seLinux().mode().value())     // selinux모드: disabled, enforcing, permissive
                // 클러스터 호환버전
                .hostHwVo(HostHwVoKt.toHostHwVo(host))
                .hostSwVo(HostSwVoKt.toHostSwVo(host))
            .build();
    }
    

    */
/**
     * 호스트 가상머신 목록
     * @param id 호스트 id
     * @return 가상머신 목록
     *//*

    @Override
    public List<VmVo> findAllVmsFromHost(String id) {
        
        List<Vm> vmList = getSystem().vmsService().list().allContent(true).send().vms();

        log.info("호스트 가상머신");
        return vmList.stream()
                .filter(vm ->
                            (vm.hostPresent() && vm.host().id().equals(id)) ||
                            (vm.placementPolicy().hostsPresent() && vm.placementPolicy().hosts().stream().anyMatch(host -> host.id().equals(id))))
                .map(vm -> {
                    String vmNicId = getSystem().vmsService().vmService(vm.id()).nicsService().list().send().nics().get(0).id();

                    return VmVo.builder()
                            .id(vm.id())
                            .name(vm.name())
                            .clusterName(getSystem().clustersService().clusterService(vm.cluster().id()).get().send().cluster().name())
                            .hostEngineVm(vm.origin().equals("managed_hosted_engine"))
                            .status(vm.status().value())
                            .fqdn(vm.fqdn())
                            .upTime(VmVoKt.findVmUptime(vm, getConn()))
                            .ipv4(VmVoKt.findVmIp(vm, getConn(),"v4"))
                            .ipv6(VmVoKt.findVmIp(vm, getConn(),"v6"))
                            .usageDto(vm.status() == VmStatus.UP ? dash.vmPercent(vm.id(), vmNicId) : null)
//                            .placement(vm.placementPolicy().hostsPresent()) // 호스트 고정여부
                            // vm.placementPolicy().hosts() // 고정된 호스트 id가 나옴
                            // 현재 호스트에 부착 여부
                            .build();
                })
                .collect(Collectors.toList());
    }


    */
/**
     * 호스트 네트워크 인터페이스 목록
     * @param id 호스트 id
     * @return 네트워크 인터페이스 목록
     *//*

    @Override
    public List<NicVo> getNicsByHost(String id) {
        
        List<HostNic> hostNicList = getSystem().hostsService().hostService(id).nicsService().list().send().nics();
        DecimalFormat df = new DecimalFormat("###,###");
        BigInteger bps = BigInteger.valueOf(1024).pow(2);
        
        log.info("호스트 네트워크 인터페이스");
        return hostNicList.stream()
                .map(hostNic -> {
                    List<Statistic> statisticList = getSystem().hostsService().hostService(id).nicsService().nicService(hostNic.id()).statisticsService().list().send().statistics();

                    return NicVo.builder()
                            .status(hostNic.status())
                            .name(hostNic.name())
                            .networkName(getSystem().networksService().networkService(hostNic.network().id()).get().send().network().name())
                            .macAddress(hostNic.macPresent() ? hostNic.mac().address() : "")
                            .ipv4(hostNic.ip().address())
                            .ipv6(hostNic.ipv6().addressPresent() ? hostNic.ipv6().address() : null)
                            .speed(hostNic.speed().divide(BigInteger.valueOf(1024 * 1024)))
                            .rxSpeed(StatisticExtKt.findSpeed(statisticList, "data.current.rx.bps").divide(bps))
                            .txSpeed(StatisticExtKt.findSpeed(statisticList, "data.current.tx.bps").divide(bps))
                            .rxTotalSpeed(StatisticExtKt.findSpeed(statisticList, "data.total.rx"))
                            .txTotalSpeed(StatisticExtKt.findSpeed(statisticList, "data.total.tx"))
                            .stop(StatisticExtKt.findSpeed(statisticList, "errors.total.rx").divide(bps))
                            .build();
                })
                .collect(Collectors.toList());
    }


    */
/**
     * 호스트 호스트장치 목록
     * @param id 호스트 id
     * @return 호스트 장치 목록
     *//*

    @Override
    public List<HostDeviceVo> getHostDevicesByHost(String id) {
        
        List<HostDevice> hostDeviceList = getSystem().hostsService().hostService(id).devicesService().list().send().devices();

        log.info("호스트 호스트장치");
        return hostDeviceList.stream()
                .map(hostDevice ->
                        HostDeviceVo.builder()
                            .name(hostDevice.name())
                            .capability(hostDevice.capability())
                            .driver(hostDevice.driverPresent() ? hostDevice.driver() : null)
                            .vendorName(hostDevice.vendorPresent() ? hostDevice.vendor().name() + " (" +hostDevice.vendor().id() + ")" : "")
                            .productName(hostDevice.productPresent() ? hostDevice.product().name() + " (" + hostDevice.product().id() + ")" : "")
                        .build()
                )
                .collect(Collectors.toList());
    }

    */
/**
     * 호스트 권한 목록
     * @param id 호스트 id
     * @return 권한 목록
     *//*

    @Override
    public List<PermissionVo> findAllPermissionsFromHost(String id) {
        List<Permission> permissionList = getSystem().hostsService().hostService(id).permissionsService().list().send().permissions();
        log.info("호스트 권한");
        return PermissionVoKt.toPermissionVos(permissionList, getConn());
    }

    // 호스트 선호도 레이블 목록
//    @Override
//    public List<AffinityLabelVo> getAffinitylabels(String id) {
////        
////        List<AffinityLabel> affinityLabelList = getSystem().hostsService().hostService(id).affinityLabelsService().list().follow("hosts,vms").send().label();
////
////        log.info("Host 선호도 레이블");
////        return affinityLabelList.stream()
////                .map(al ->
////                        AffinityLabelVo.builder()
////                            .id(al.id())
////                            .name(al.name())
////                            .hosts(itAffinityService.getHostLabelMember(system, al.id()))
////                            .vms(itAffinityService.getVmLabelMember(system, al.id()))
////                        .build())
////                .collect(Collectors.toList());
//        return null;
//    }
//
//    // 선호도 레이블 생성 창
//    @Override
//    public AffinityHostVm setAffinityDefaultInfo(String id, String type) {
//        
//        String clusterId = getSystem().hostsService().hostService(id).get().send().host().cluster().id();
//
//        log.info("Host 선호도 레이블 생성 창");
//        return AffinityHostVm.builder()
//                .clusterId(id)
//                .hostList(itAffinityService.getHostList(clusterId))
//                .vmList(itAffinityService.getVmList(clusterId))
//                .build();
//    }
//
//
//    @Override
//    public CommonVo<Boolean> addAffinitylabel(String id, AffinityLabelCreateVo alVo) {
//        
//        AffinityLabelsService alServices = getSystem().affinityLabelsService();
//        List<AffinityLabel> alList = getSystem().affinityLabelsService().list().send().labels();
//
//        // 중복이름
//        boolean duplicateName = alList.stream().noneMatch(al -> al.name().equals(alVo.getName()));
//
//        try {
//            if(duplicateName) {
//                AffinityLabelBuilder alBuilder = new AffinityLabelBuilder();
//                alBuilder
//                        .name(alVo.getName())
//                        .hosts(
//                            alVo.getHostList().stream()
//                                .map(host -> new HostBuilder().id(host.getId()).build())
//                                .collect(Collectors.toList())
//                        )
//                        .vms(
//                            alVo.getVmList().stream()
//                                .map(vm -> new VmBuilder().id(vm.getId()).build())
//                                .collect(Collectors.toList())
//                        )
//                        .build();
//
//                alServices.add().label(alBuilder).send().label();
//                log.info("Host 선호도 레이블 생성");
//                return CommonVo.successResponse();
//            }else {
//                log.error("실패: Host 선호도레이블 이름 중복");
//                return CommonVo.failResponse("이름 중복");
//            }
//        } catch (Exception e) {
//            log.error("실패: Host 선호도 레이블");
//            e.printStackTrace();
//            return CommonVo.failResponse(e.getMessage());
//        }
//    }
//
//    @Override
//    public AffinityLabelCreateVo getAffinityLabel(String alId) {
////        
////        AffinityLabel al = getSystem().affinityLabelsService().labelService(alId).get().follow("hosts,vms").send().label();
////
////        log.info("Host 선호도 레이블 편집창");
////        return AffinityLabelCreateVo.builder()
////                .id(alId)
////                .name(al.name())
////                .hostList(al.hostsPresent() ? itAffinityService.getHostLabelMember(system, alId) : null )
////                .vmList(al.vmsPresent() ? itAffinityService.getVmLabelMember(system, alId) : null)
////                .build();
//        return null;
//    }
//
//    @Override
//    public CommonVo<Boolean> editAffinitylabel(String id, String alId, AffinityLabelCreateVo alVo) {
//
//        return null;
//    }
//
//    @Override
//    public CommonVo<Boolean> deleteAffinitylabel(String id, String alId) {
//
//        return null;
//    }


    */
/**
     * 호스트 이벤트 목록
     * @param id 호스트 id
     * @return 이벤트 목록
     *//*

    @Override
    public List<EventVo> findAllEventsFromHost(String id) {
        
        SimpleDateFormat sdf = new ItCloudApplicationKt.getOvirtDf();
        List<Event> eventList = getSystem().eventsService().list().search("host.name=" + getSystem().hostsService().hostService(id).get().send().host().name()).send().events();

        log.info("호스트 이벤트");
        return eventList.stream()
                .filter(event -> !(event.severity().value().equals("alert") && event.description().contains("Failed to verify Power Management configuration for Host")))
                .map(
                    event ->
                        EventVo.builder()
                            .severity(event.severity().value())     // 상태[LogSeverity] : alert, error, normal, warning
                            .time(sdf.format(event.time()))
                            .message(event.description())
                            .relationId(event.correlationIdPresent() ? event.correlationId() : null)
                            .source(event.origin())
                        .build()
                )
                .collect(Collectors.toList());
    }
}
*/
