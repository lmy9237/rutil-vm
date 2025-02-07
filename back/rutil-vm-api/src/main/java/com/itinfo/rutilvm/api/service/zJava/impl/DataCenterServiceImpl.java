/*
package com.itinfo.rutilvm.service.computing.impl;

import com.itinfo.itcloud.model.TypeExtKt;
import com.itinfo.itcloud.model.computing.*;
import com.itinfo.itcloud.model.create.DataCenterCreateVo;
import com.itinfo.itcloud.model.error.CommonVo;
import com.itinfo.itcloud.model.network.NetworkVo;
import com.itinfo.itcloud.model.storage.DiskVo;
import com.itinfo.itcloud.model.storage.DomainVo;
import com.itinfo.itcloud.ovirt.AdminConnectionService;
import com.itinfo.itcloud.service.computing.ItDataCenterService;
import lombok.extern.slf4j.Slf4j;
import org.ovirt.engine.sdk4.builders.DataCenterBuilder;
import org.ovirt.engine.sdk4.builders.VersionBuilder;
import org.ovirt.engine.sdk4.services.*;
import org.ovirt.engine.sdk4.types.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DataCenterServiceImpl implements ItDataCenterService {
    @Autowired private AdminConnectionService admin;
    @Autowired private CommonService common;

    */
/***
     * 데이터센터 목록 불러오기
     * @return 데이터센터 목록
     *//*

    @Override
    public List<DataCenterVo> getDataCenters(){
        SystemService system = admin.getConnection().systemService();
        log.info("데이터센터 목록");
        return system.dataCentersService().list().send().dataCenters().stream()
                .map(dataCenter ->
                    DataCenterVo.builder()
                        .id(dataCenter.id())
                        .name(dataCenter.name())
                        .description(dataCenter.description())
                        .storageType(dataCenter.local())
                        .status(TypeExtKt.findDCStatus(dataCenter.status()))
                        .quotaMode(TypeExtKt.findQuota(dataCenter.quotaMode()))
                        .version(dataCenter.version().major() + "." + dataCenter.version().minor())
                        .comment(dataCenter.comment())
                        .build()
                )
                .collect(Collectors.toList());
    }

    */
/***
     * 데이터센터 생성
     * @param dcVo 데이터센터 값
     * @return 데이터센터 생성 결과 201(create), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> addDatacenter(DataCenterCreateVo dcVo) {
        SystemService system = admin.getConnection().systemService();
        DataCentersService datacentersService = system.dataCentersService();     // datacenters 서비스 불러오기

        try {
            if(isNameDuplicate(system, dcVo.getName(),null)){
                log.error("데이터센터 이름 중복");
                return CommonVo.failResponse("중복된 이름이 있습니다.");
            }

            DataCenterBuilder dcBuilder = setDcBuilder(dcVo, true);
            datacentersService.add().dataCenter(dcBuilder.build()).send();     // 데이터센터 만든거 추가

            log.info("데이터센터 생성 완료");
            return CommonVo.createResponse();
        }catch (Exception e){
            log.error("데이터센터 생성 실패 {}", e.getMessage());
            return CommonVo.failResponse(e.getMessage());
        }
    }


    */
/***
     * 데이터센터 편집 창
     * @param id 데이터센터 id
     * @return 데이터센터 값
     *//*

    @Override
    public DataCenterCreateVo setDatacenter(String id){
        SystemService system = admin.getConnection().systemService();
        DataCenter dataCenter = system.dataCentersService().dataCenterService(id).get().send().dataCenter();

        log.info("데이터센터 {} 편집창", dataCenter.name());
        return DataCenterCreateVo.builder()
                .id(id)
                .name(dataCenter.name())
                .description(dataCenter.description())
                .storageType(dataCenter.local())
                .quotaMode(dataCenter.quotaMode())
                .version(dataCenter.version().major() + "." + dataCenter.version().minor())
                .comment(dataCenter.comment())
                .build();
    }

    */
/**
     * 데이터센터 편집
     * @param dcVo 데이터센터 id
     * @return 데이터센터 편집 결과 201(create), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> editDatacenter(DataCenterCreateVo dcVo) {
        SystemService system = admin.getConnection().systemService();
        DataCentersService datacentersService = system.dataCentersService();

        try {
            if (isNameDuplicate(system, dcVo.getName(), dcVo.getId())) {
                log.error("데이터센터 이름 중복");
                return CommonVo.failResponse("중복된 이름이 있습니다.");
            }

            DataCenterBuilder dcBuilder = setDcBuilder(dcVo, false);
            datacentersService.dataCenterService(dcVo.getId()).update().dataCenter(dcBuilder.build()).send();   // 데이터센터 편집

            log.info("데이터센터 편집 성공");
            return CommonVo.createResponse();
        }catch (Exception e) {
            log.error("데이터센터 편집 실패, {}", e.getMessage());
            return CommonVo.failResponse(e.getMessage());
        }
    }


    */
/**
     * 데이터센터 생성&편집 빌더
     * @param dcVo 데이터센터
     * @param add 생성시 true, 편집시 false
     * @return 데이터센터 빌더
     *//*

    private DataCenterBuilder setDcBuilder(DataCenterCreateVo dcVo, boolean add){
        String[] ver = dcVo.getVersion().split("\\.");      // 버전값 분리

        DataCenterBuilder dcBuilder =
                new DataCenterBuilder()
                        .name(dcVo.getName())       // 이름
                        .description(dcVo.getDescription())     // 설명
                        .local(dcVo.isStorageType())    // 스토리지 유형
                        .version(new VersionBuilder().major(Integer.parseInt(ver[0])).minor(Integer.parseInt(ver[1])).build())  // 호환 버전
                        .quotaMode(dcVo.getQuotaMode())      // 쿼터 모드
                        .comment(dcVo.getComment());     // 코멘트
        if(add) {   // 생성 시
            return dcBuilder;
        }else{  // 편집 시
            return dcBuilder.id(dcVo.getId());
        }
    }

    */
/**
     * 데이터센터 삭제
     * @param ids 데이터센터 id 목록
     * @return  데이터센터 삭제 결과 200(success), 404(fail)
     *//*

    @Override
    public CommonVo<Boolean> deleteDatacenter(List<String> ids) {
        SystemService system = admin.getConnection().systemService();

        try {
            String name = "";
            for (String id : ids) {
                DataCenterService dataCenterService = system.dataCentersService().dataCenterService(id);
                name = dataCenterService.get().send().dataCenter().name();
                dataCenterService.remove().force(true).send();
                log.info("데이터센터 {} 삭제", name);
            }
            return CommonVo.successResponse();
        } catch (Exception e) {
            log.error("데이터센터 삭제 실패 {}", e.getMessage());
            return CommonVo.failResponse("데이터센터 삭제 실패");
        }
    }

    */
/**
     * 데이터센터 이벤트 출력
     * @param id 데이터센터 id
     * @return 데이터센터 이벤트 목록
     *//*

    @Override
    public List<EventVo> getEventsByDatacenter(String id) {
        SystemService system = admin.getConnection().systemService();
        String dcName = system.dataCentersService().dataCenterService(id).get().send().dataCenter().name();

        log.info("데이터센터 {} 이벤트 출력", dcName);
        return system.eventsService().list().send().events().stream()
                .filter(event -> event.dataCenterPresent()
                        && (event.dataCenter().idPresent() && event.dataCenter().id().equals(id) || (event.dataCenter().namePresent() && event.dataCenter().name().equals(dcName)) )
                )
                .map(event ->
                        EventVo.builder()
                            .datacenterName(dcName)
                            .severity(TypeExtKt.findLogSeverity(event.severity()))   //상태
                            .time(new SimpleDateFormat("yyyy. MM. dd. HH:mm:ss").format(event.time()))
                            .message(event.description())
                            .relationId(event.correlationIdPresent() ? event.correlationId() : null)
                            .source(event.origin())
                            .build()
                )
                .collect(Collectors.toList());
    }



    // 대시보드 임시방편
    */
/**
     * 대시보드 컴퓨팅 목록
     * @return
     *//*

    @Override
    public List<DataCenterVo> dashboardComputing() {
        SystemService system = admin.getConnection().systemService();
        return system.dataCentersService().list().send().dataCenters().stream()
                .map(dc -> {

                    List<ClusterVo> clusters = system.clustersService().list().send().clusters().stream()
                            .filter(cluster -> cluster.dataCenterPresent() && cluster.dataCenter().id().equals(dc.id()))
                            .map(cluster -> {
                                List<HostVo> hosts = system.hostsService().list().send().hosts().stream()
                                        .filter(host -> host.clusterPresent() && host.cluster().id().equals(cluster.id()))
                                        .map(host -> {

                                            List<VmVo> vms = system.vmsService().list().send().vms().stream()
                                                    .filter(vm -> vm.hostPresent() && vm.host().id().equals(host.id()))
                                                    .map(vm -> VmVo.builder().id(vm.id()).name(vm.name()).hostId(host.id()).build())
                                                    .collect(Collectors.toList());

                                            return HostVo.builder()
                                                    .id(host.id())
                                                    .name(host.name())
                                                    .vmVoList(vms) // 호스트의 가상 머신 목록 설정
                                                    .build();
                                        })
                                        .collect(Collectors.toList());

                                List<TemplateVo> templateList = system.templatesService().list().send().templates().stream()
                                        .filter(template -> !template.clusterPresent() || template.cluster().id().equals(cluster.id()))
                                        .map(template -> TemplateVo.builder().id(template.id()).name(template.name()).build())
                                        .collect(Collectors.toList());

                                return ClusterVo.builder()
                                        .id(cluster.id())
                                        .name(cluster.name())
                                        .hostVoList(hosts) // 클러스터의 호스트 목록 설정
                                        .templateVoList(templateList) // 클러스터의 템플릿 리스트 설정
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return DataCenterVo.builder()
                            .id(dc.id())
                            .name(dc.name())
                            .clusterVoList(clusters) // 데이터 센터의 클러스터 리스트 설정
                            .build();
                })
                .collect(Collectors.toList());
    }

    */
/**
     * 대시보드 네트워크
     * @return
     *//*

    @Override
    public List<DataCenterVo> dashboardNetwork() {
        SystemService system = admin.getConnection().systemService();
        return system.dataCentersService().list().send().dataCenters().stream()
                .map(dc -> {
                    List<NetworkVo> networkVos = system.networksService().list().send().networks().stream().filter(network -> network.dataCenter().id().equals(dc.id()))
                            .map(network -> NetworkVo.builder().id(network.id()).name(network.name()).build())
                            .collect(Collectors.toList());

                    return DataCenterVo.builder()
                            .id(dc.id())
                            .name(dc.name())
                            .networkVoList(networkVos)
                            .build();
                })
                .collect(Collectors.toList());
    }


    */
/**
     * 대시보드 - 스토리지
     * @return
     *//*

    @Override
    public List<DataCenterVo> dashboardStorage() {
        SystemService system = admin.getConnection().systemService();
        return system.dataCentersService().list().send().dataCenters().stream()
                .map(dc -> {
                    List<DomainVo> domainVoList = system.storageDomainsService().list().send().storageDomains().stream()
                            .filter(storageDomain -> storageDomain.dataCentersPresent() && storageDomain.dataCenters().get(0).id().equals(dc.id())) */
/*storageDomain.dataCenters().stream().anyMatch(dataCenter -> dc.id().equals(dataCenter.id()))*//*

                            .map(storageDomain -> {

                                List<DiskVo> diskVoList = system.disksService().list().send().disks().stream()
                                        .filter(disk -> disk.storageDomainsPresent() && disk.storageDomains().get(0).id().equals(storageDomain.id()))
                                        .map(disk -> DiskVo.builder().id(disk.id()).name(disk.name()).build())
                                        .collect(Collectors.toList());

                                return DomainVo.builder()
                                        .id(storageDomain.id())
                                        .name(storageDomain.name())
                                        .diskVoList(diskVoList)
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return DataCenterVo.builder()
                            .id(dc.id())
                            .name(dc.name())
                            .domainVoList(domainVoList)
                            .build();
                })
                .collect(Collectors.toList());
    }


    //-------------------------------------------------------------

    */
/***
     * 데이터센터 이름 중복
     * @param system
     * @param name
     * @param id
     * @return 이름 중복되는게 있으면 true 반환
     *//*

    // 애매한게 생성시에는 데이터센터 목록에서 찾고
    // 편집시에는 데이터센터 목록에서 찾지만, 아이디가 같다면 이름중복 허용(내자신의 이름과 비교x)
    private boolean isNameDuplicate(SystemService system, String name, String id) {
        return system.dataCentersService().list().send().dataCenters().stream()
                .filter(dataCenter -> id == null || !dataCenter.id().equals(id))
                .anyMatch(dataCenter -> dataCenter.name().equals(name));
    }


    */
/**
     * 데이터센터 삭제 확인
     * @param system
     * @param dcId
     * @param interval
     * @param timeout
     * @return
     * @throws InterruptedException
     *//*

    private boolean isDcDeleted(SystemService system, String dcId, long interval, long timeout) throws InterruptedException {
        long startTime = System.currentTimeMillis();
        while (true){
            List<DataCenter> dataCenterList = system.dataCentersService().list().send().dataCenters();
            boolean dcExists = dataCenterList.stream().anyMatch(dc -> dc.id().equals(dcId));    // dc이 어느것이라도 매치되는것이 있다면

            if(!dcExists){ // !(매치되는것이 있다)
                return true;
            }else if (System.currentTimeMillis() - startTime > timeout) {
                return false;
            }

            log.debug("데이터센터 삭제 진행중");
            Thread.sleep(interval);
        }
    }



}
*/
