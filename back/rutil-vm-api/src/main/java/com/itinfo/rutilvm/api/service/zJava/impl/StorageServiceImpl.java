/*
package com.itinfo.rutilvm.service.storage.impl;

import com.itinfo.itcloud.model.IdentifiedVo;
import com.itinfo.itcloud.model.response.Res;
import com.itinfo.itcloud.model.network.NetworkVo;
import com.itinfo.itcloud.model.storage.java.DiskVo;
import com.itinfo.itcloud.model.storage.DomainCreateVo;
import com.itinfo.itcloud.model.storage.DomainVo;
import com.itinfo.itcloud.model.storage.ImageCreateVo;
import com.itinfo.itcloud.ovirt.AdminConnectionService;
import com.itinfo.itcloud.service.BaseService;
import com.itinfo.itcloud.service.storage.ItStorageService;
import lombok.extern.slf4j.Slf4j;
import org.ovirt.engine.sdk4.builders.*;
import org.ovirt.engine.sdk4.internal.containers.ImageContainer;
import org.ovirt.engine.sdk4.internal.containers.ImageTransferContainer;
import org.ovirt.engine.sdk4.services.*;
import org.ovirt.engine.sdk4.types.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.*;
import java.io.*;
import java.math.BigInteger;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class StorageServiceImpl extends BaseService implements ItStorageService {
    @Autowired private AdminConnectionService admin;
*/
/*
    @Override
    public List<DiskVo> getDiskList(String dcId) {
        
        AttachedStorageDomainsService attSdsService = getSystem().dataCentersService().dataCenterService(dcId).storageDomainsService();

        // 연결대상때문에 필요한듯 == vm의 diskattachment에 disk id가 같은지 비교. 근데 전체 vms를 다 뒤져야함 => 복잡
        VmsService vmsService = getSystem().vmsService();

        return attSdsService.list().send().storageDomains().stream()
                .flatMap(sd ->
                    attSdsService.storageDomainService(sd.id()).disksService().list().send().disks().stream()
                        .map(disk -> {
                            boolean isAttached = vmsService.list().send().vms().stream()
                                    .anyMatch(vm -> vmsService.vmService(vm.id()).diskAttachmentsService().list().send().attachments().stream()
                                                .anyMatch(diskAttachment -> diskAttachment.id().equals(disk.id())));

                            return DiskVo.builder()
                                    .id(disk.id())
                                    .name(disk.name())
                                    .alias(disk.alias())
                                    .description(disk.description())
                                    .shareable(disk.shareable())
                                    .status(disk.status())
                                    .storageType(disk.storageType().value())
                                    .virtualSize(disk.provisionedSize())
//                                    .connection(String.valueOf(isAttached)) // HELP 연결대상 쉽지않음
                                    .domainVo(DomainVo.builder().id(sd.id()).name(sd.name()).build())
                                    .build();
                        })
                )
                .collect(Collectors.toList());
    }

    @Override
    public List<IdentifiedVo> setDatacenterList(){
        
        return getSystem().dataCentersService().list().send().dataCenters().stream()
                .filter(dc -> dc.status() == DataCenterStatus.UP)
                .map(dc -> IdentifiedVo.builder().id(dc.id()).name(dc.name()).build())
                .collect(Collectors.toList());
    }


    @Override
    public List<IdentifiedVo> setDomainList(String dcId, String diskId) {
        
        List<StorageDomain> storageDomainList = getSystem().dataCentersService().dataCenterService(dcId).storageDomainsService().list().send().storageDomains();

        if(diskId != null && !diskId.isEmpty()){
            Disk disk = getSystem().disksService().diskService(diskId).get().send().disk();
            return getSystem().dataCentersService().dataCenterService(dcId).storageDomainsService().list().send().storageDomains().stream()
                    .filter(storageDomain -> !storageDomain.id().equals(disk.storageDomains().get(0).id()))
                    .map(storageDomain -> IdentifiedVo.builder().id(storageDomain.id()).name(storageDomain.name()).build())
                    .collect(Collectors.toList());

        }else {
            return storageDomainList.stream()
                    .map(storageDomain -> IdentifiedVo.builder().id(storageDomain.id()).name(storageDomain.name()).build())
                    .collect(Collectors.toList());
        }
    }
*//*


    */
/**
     * 디스크 이미지 생성창
     * 디스크 이미지 이동 창
     * @return 디스크 프로파일 목록
     *//*

    @Override
    public List<IdentifiedVo> findOneDiskProfile(String domainId) {
        
        return getSystem().storageDomainsService().storageDomainService(domainId).diskProfilesService().list().send().profiles().stream()
                .map(diskProfile -> IdentifiedVo.builder().id(diskProfile.id()).name(diskProfile.name()).build())
                .collect(Collectors.toList());
    }


    */
/**
     * 디스크 생성 (이미지)
     * ovirt에서 dc정보는 스토리지 도메인을 파악하기 위해있음
     * @param image 이미지 객체
     * @return 201 (create), 404(fail)
     *//*

    @Override
    public Res<Boolean> addDiskImage(ImageCreateVo image) {
        
        DisksService disksService = getSystem().disksService();

        try{
            Disk disk = disksService.add().disk(configureDiskBuilder(image, true)).send().disk();
            DiskService diskService = disksService.diskService(disk.id());

            if(expectDiskStatus(diskService, DiskStatus.OK, 1000, 90000)){
                log.info("성공: 디스크 이미지 {} 생성", image.getAlias());
                return Res.createResponse();
            } else {
                log.error("실패: 디스크 이미지 {} 생성 시간초과", image.getAlias());
                return Res.failResponse("실패: 디스크 이미지 생성 시간초과");
            }
        }catch (Exception e){
            log.error("실패: 새 가상 디스크 (이미지) 생성");
            return Res.failResponse(e.getMessage());
        }
    }

    */
/**
     * 디스크 생성, 편집
     * @param image 디스크 객체
     * @param isAdd true면 add, false면 edit
     * @return
     *//*

    private DiskBuilder configureDiskBuilder(ImageCreateVo image, boolean isAdd){
        DiskBuilder diskBuilder = new DiskBuilder();
        diskBuilder
                .name(image.getAlias())
                .description(image.getDescription())
                .wipeAfterDelete(image.isWipeAfterDelete()) // 삭제후 초기화
                .shareable(image.isShare())     // 공유 가능 (공유가능 o 이라면 증분백업 안됨 FRONT에서 막기?)
                .backup(image.isBackup() ? DiskBackup.INCREMENTAL : DiskBackup.NONE)    // 증분 백업 사용(기본이 true)
                .format(image.isBackup() ? DiskFormat.COW : DiskFormat.RAW); // 백업 안하면 RAW
        // 생성
        if(isAdd){
            return diskBuilder
                    .provisionedSize(BigInteger.valueOf(image.getSize()).multiply(BigInteger.valueOf(1024).pow(3))) // 값 받은 것을 byte로 변환하여 준다
                    .storageDomains(new StorageDomain[]{ new StorageDomainBuilder().id(image.getDomainId()).build()})
                    .sparse(image.isSparse()) // 할당정책: 씬 true
                    .diskProfile(new DiskProfileBuilder().id(image.getProfileId()).build()); // 없어도 상관없음
        }else { // 편집
            return diskBuilder
                    .provisionedSize((BigInteger.valueOf(image.getSize()+ image.getAppendSize())).multiply(BigInteger.valueOf(1024).pow(3)) ) // 값 받은 것을 byte로 변환하여 준다
                    .id(image.getId());
            // 기본 설정 크기, 데이터센터, 스토리지 도메인, 할당정책은 변경 불가능
        }
    }
    */
/**
     * 디스크 이미지 편집 창 & 디스크 이동 창
     * @param diskId 디스크 id
     * @return
     *//*

    @Override
    public ImageCreateVo setDiskImage(String diskId){
        
        Disk disk = getSystem().disksService().diskService(diskId).get().send().disk();
        StorageDomain storageDomain = getSystem().storageDomainsService().storageDomainService(disk.storageDomains().get(0).id()).get().send().storageDomain();
        DataCenter dataCenter = getSystem().dataCentersService().dataCenterService(storageDomain.dataCenters().get(0).id()).get().send().dataCenter();

        return ImageCreateVo.builder()
                .id(diskId)
                .size((int) (disk.provisionedSizeAsLong() / 1073741824) )// 1024^3
                .alias(disk.alias())
                .description(disk.description())
                .dcId(dataCenter.id())
                .dcName(dataCenter.name())
                .domainName(storageDomain.name())
                .profileId(disk.diskProfile().id())
                .profileName(getSystem().diskProfilesService().diskProfileService(disk.diskProfile().id()).get().send().profile().name())
                .sparse(disk.sparse())
                .backup(disk.backup() == DiskBackup.INCREMENTAL) // 증분백업 사용하는거
                .share(disk.shareable())
                .wipeAfterDelete(disk.wipeAfterDelete())
                .build();
    }


    */
/**
     * 디스트 이미지 편집
     * @param image
     * @return
     *//*

    @Override
    public Res<Boolean> editDiskImage(ImageCreateVo image) {
        

        try{
            getSystem().disksService().diskService(image.getId()).update().disk(configureDiskBuilder(image, false)).send().disk();

            log.info("성공: 디스크 이미지 {} 편집", image.getAlias());
            return Res.createResponse();
        }catch (Exception e){
            log.error("실패: 새 가상 디스크 (이미지) 편집");
            e.printStackTrace();
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 디스크 삭제
     * @param diskId
     * @return
     *//*

    @Override
    public Res<Boolean> deleteDiskImage(String diskId) {
        
        DiskService diskService = getSystem().disksService().diskService(diskId);

        try{
            // 가상머신이 연결되어잇는지, down 상태인지
            diskService.remove().send();

            // :HELP 디스크 삭제 여부확인

            log.info("성공: 디스크 삭제");
            return Res.successResponse();
        }catch (Exception e){
            e.printStackTrace();
            log.error("실패: 가상 디스크 삭제");
            return Res.failResponse(e.getMessage());
        }
    }



    */
/**
     * 디스크 이동
     * @param id 디스크 아이디
     * @param domainId 이동할 도메인 아이디
     * @return 200(success) 404(fail)
     *//*

    @Override
    public Res<Boolean> moveDisk(String id, String domainId) {
        
        DiskService diskService = getSystem().disksService().diskService(id);

        try {
            diskService.move().storageDomain(new StorageDomainBuilder().id(domainId)).send();

            // 이동하는 상태확인
            if(expectDiskStatus(diskService, DiskStatus.OK, 1000, 50000)){
                log.info("성공: 디스크 이동");
                return Res.successResponse();
            }else {
                log.error("실패: 디스크 이동 시간초과");
                return Res.failResponse("디스크 이동 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.info("실패: 디스크 이동");
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 디스크 복사
     * @param diskVo 디스크 객체
     * @return 200(success) 404(fail)
     *//*

    @Override
    public Res<Boolean> copyDisk(DiskVo diskVo) {
        
        DiskService diskService = getSystem().disksService().diskService(diskVo.getId());

        try {
            diskService.copy()
                    .disk(new DiskBuilder().alias(diskVo.getAlias()))
                    .storageDomain(new StorageDomainBuilder().id(diskVo.getDomainVo().getId()))
            .send();

            // 복사 상태 확인
            if(expectDiskStatus(diskService, DiskStatus.OK, 1000, 50000)){
                log.info("성공: 디스크 복사");
                return Res.successResponse();
            }else {
                log.error("실패: 디스크 복사 시간초과");
                return Res.failResponse("디스크 복사 실패");
            }

        } catch (Exception e) {
            e.printStackTrace();
            log.info("실패: 디스크 복사");
            return Res.failResponse(e.getMessage());
        }
    }



    

    // (화면표시) 파일 선택시 파일에 있는 포맷, 컨텐츠(파일 확장자로 칭하는건지), 크기 출력
    //           파일 크기가 자동으로 디스크 옵션에 추가, 파일 명칭이 파일의 이름으로 지정됨 (+설명)
    */
/**
     * 디스크 이미지 업로드
     * required: provisioned_size, alias, description, wipe_after_delete, shareable, backup, disk_profile.
     * @param file 업로드 할 파일
     * @param image 이미지 객체
     * @return
     * @throws IOException
     *//*

    @Override
    public Res<Boolean> uploadDisk(MultipartFile file, ImageCreateVo image) throws IOException {
        
        DisksService disksService = getSystem().disksService();
        ImageTransfersService imageTransfersService = getSystem().imageTransfersService(); // 이미지 추가를 위한 서비스

        try {
            if(file == null || file.isEmpty()){
                return Res.failResponse("파일이 없습니다.");
            }

            log.debug("Total Memory : {}, Free Memory : {}, Max Memory : {}", Runtime.getRuntime().totalMemory(), Runtime.getRuntime().freeMemory(), Runtime.getRuntime().maxMemory());
            log.info("파일: {}, size: {}, 타입: {}", file.getOriginalFilename(), file.getSize(), file.getContentType());

            // 우선 입력된 디스크 정보를 바탕으로 디스크 추가
            Disk disk = disksService.add().disk(createDisk(image, file.getSize())).send().disk();
            DiskService diskService = disksService.diskService(disk.id());

            // 디스크 ok 상태여야 이미지 업로드 가능
            if(expectDiskStatus(diskService, DiskStatus.OK, 1000, 30000)){
                log.info("디스크 생성 성공");
            }else {
                log.error("디스크 대기시간 초과");
                return Res.failResponse("디스크 대기시간 초과");
            }

            // 이미지를 저장하거나 관리하는 컨테이너,.이미지의 생성, 삭제, 편집 등의 작업을 지원
            ImageContainer imageContainer = new ImageContainer();
            imageContainer.id(disk.id());

            // 이미지 전송 작업(업로드나 다운로드)을 관리하는 컨테이너. 전송 상태, 진행률, 오류 처리 등의 기능을 포함.
            ImageTransferContainer imageTransferContainer = new ImageTransferContainer();
            imageTransferContainer.direction(ImageTransferDirection.UPLOAD);
            imageTransferContainer.image(imageContainer);

            // 이미지 전송
            ImageTransfer imageTransfer = imageTransfersService.add().imageTransfer(imageTransferContainer).send().imageTransfer();
            while (imageTransfer.phase() == ImageTransferPhase.INITIALIZING) {
                log.debug("이미지 업로드 가능상태 확인 {}", imageTransfer.phase());
                Thread.sleep(1000);
            }

            ImageTransferService imageTransferService = imageTransfersService.imageTransferService(imageTransfer.id());

            String transferUrl = imageTransfer.transferUrl();
            if(transferUrl == null || transferUrl.isEmpty()){
                log.debug("transferUrl 없음");
                return Res.failResponse("transferUrl 가 없음");
            }else {
                log.debug("imageTransfer.transferUrl(): {}", transferUrl);
                imageSend(imageTransferService, file);
            }
            return Res.successResponse();
        } catch (Exception e) {
            e.printStackTrace();
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 디스크 생성
     * @param image
     * @param fileSize
     * @return
     *//*

    private Disk createDisk(ImageCreateVo image, long fileSize){
        return new DiskBuilder()
                .provisionedSize(fileSize)
                .alias(image.getAlias())
                .description(image.getDescription())
                .storageDomains(new StorageDomain[]{new StorageDomainBuilder().id(image.getDomainId()).build()})
                .diskProfile(new DiskProfileBuilder().id(image.getProfileId()).build())
                .wipeAfterDelete(image.isWipeAfterDelete())
                .shareable(image.isShare())
                .backup(DiskBackup.NONE) // 증분백업 되지 않음
                .format(DiskFormat.RAW) // 이미지 업로드는 raw형식만 가능
                .contentType(DiskContentType.ISO) // iso 업로드
                .build();
    }


    */
/**
     * 디스크 이미지 전송
     * @param imageTransferService
     * @param file
     *//*

    private Res<Boolean> imageSend(ImageTransferService imageTransferService, MultipartFile file) {
        HttpsURLConnection httpsConn = null;

        try {
            disableSSLVerification();
            log.debug("imageSend");

            // 자바에서 HTTP 요청을 보낼 때 기본적으로 제한된 헤더를 사용자 코드에서 설정할 수 있도록 허용하는 설정
            getSystem().setProperty("sun.net.http.allowRestrictedHeaders", "true");

            URL url = new URL(imageTransferService.get().send().imageTransfer().transferUrl());
            httpsConn = (HttpsURLConnection) url.openConnection();
            httpsConn.setRequestMethod("PUT");
            httpsConn.setRequestProperty("Content-Length", String.valueOf(file.getSize()));
            httpsConn.setFixedLengthStreamingMode(file.getSize()); // 메모리 사용 최적화
            httpsConn.setDoOutput(true); // 서버에 데이터를 보낼수 있게 설정
            httpsConn.connect();

            // 버퍼 크기 설정 (128KB)
            int bufferSize = 131072;
            try (
                    BufferedInputStream bufferedInputStream = new BufferedInputStream(file.getInputStream(), bufferSize);
                    BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(httpsConn.getOutputStream(), bufferSize);
            ) {
                byte[] buffer = new byte[bufferSize];
                int bytesRead;
                while ((bytesRead = bufferedInputStream.read(buffer)) != -1) {
                    bufferedOutputStream.write(buffer, 0, bytesRead);
                }
                bufferedOutputStream.flush();

                // image 전송 완료
                imageTransferService.finalize_().send();

                httpsConn.disconnect();

                ImageTransfer imageTransfer = imageTransferService.get().send().imageTransfer();
                log.debug("phase() : {}", imageTransfer.phase());

                return Res.successResponse();
            } catch (IOException e) {
                e.printStackTrace();
                return Res.failResponse("disk image 업로드 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Res.failResponse("");
        } finally {
            if (httpsConn != null) {
                httpsConn.disconnect();
            }
        }
    }


    */
/**
     * SSL 인증서를 검증하지 않도록 설정하는 메서드
     *//*

    private void disableSSLVerification() {
        log.debug("disableSSLVerification");
        try {
            TrustManager[] trustAllCerts = new TrustManager[] {
                    new X509TrustManager() {
                        public X509Certificate[] getAcceptedIssuers() {
                            return null;
                        }
                        public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                        public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                    }
            };

            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            HostnameVerifier allHostsValid = (hostname, session) -> true;
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    */
/**
     * 스토리지 도메인 목록
     * @param dcId 데이터센터 밑에 있는 도메인 목록
     * @return 스토리지 도메인 목록
     *//*

    @Override
    public List<DomainVo> getDomainList(String dcId) {
        
        return getSystem().storageDomainsService().list().send().storageDomains().stream()
                .filter(storageDomain -> !storageDomain.dataCentersPresent() || storageDomain.dataCenters().get(0).id().equals(dcId))
                .map(storageDomain ->
                    DomainVo.builder()
                            .status(storageDomain.status())
                            .id(storageDomain.id())
                            .name(storageDomain.name())
                            .comment(storageDomain.comment())
                            .domainType(storageDomain.type())
                            .domainTypeMaster(storageDomain.master())
                            .storageType(storageDomain.storage().type())
                            .format(storageDomain.storageFormat())
                            .diskSize(storageDomain.usedPresent() ? storageDomain.used().add(storageDomain.available()) : null)
                            .availableSize(storageDomain.available())
                            .description(storageDomain.description())
                            .build()
                )
                .collect(Collectors.toList());
    }

    // 도메인 생성 창 - datacenter List, host List
    */
/**
     * 도메인 생성 창
     * @param dcId 데이터센터 밑에 있는 호스트
     * @return 호스트 목록
     *//*

    @Override
    public List<IdentifiedVo> setHostList(String dcId) {
        
        return getSystem().hostsService().list().send().hosts().stream()
                .filter(host -> getSystem().clustersService().clusterService(host.cluster().id()).get().send().cluster().dataCenter().id().equals(dcId))
                .map(host -> IdentifiedVo.builder().id(host.id()).name(host.name()).build())
                .collect(Collectors.toList());
    }


    */
/**
     * 스토리지 도메인 생성빌더
     * @param dcVo
     * @return
     *//*

    private StorageDomainBuilder configureDomain(DomainCreateVo dcVo){
        StorageDomainBuilder storageDomainBuilder = new StorageDomainBuilder();

        storageDomainBuilder
                .name(dcVo.getName())
                .type(dcVo.getDomainType()) // domaintype
                .host(new HostBuilder().name(dcVo.getHostName()).build());
//                        .discardAfterDelete()
//                        .supportsDiscard()
//                        .backup()
//                        .wipeAfterDelete()

        // 스토리지 유형이 iscsi 일 경우
        if(dcVo.getStorageType().equals(StorageType.ISCSI)){
            return storageDomainBuilder
                    .dataCenter(new DataCenterBuilder().id(dcVo.getDatacenterId()).build())
                    .storage(new HostStorageBuilder().type(StorageType.ISCSI).logicalUnits(new LogicalUnitBuilder().id(dcVo.getLogicalUnitId()).build()).build());

        }else { // 그외 다른 유형
            // 경로  예: myserver.mydomain.com:/my/local/path
            // paths[0] = address, paths[1] = path
            String[] paths = dcVo.getPath().split(":", 2);
            return storageDomainBuilder
                    .storage(new HostStorageBuilder().type(dcVo.getStorageType()).address(paths[0].trim()).path(paths[1].trim()).build());
        }
    }




    // requires: name, type, host, and storage attributes. Identify the host attribute with the id or name attributes.
    // To add a new storage domain with specified name, type, storage.type, storage.address, and storage.path,
    // and using a host with an id 123, send a request like this
    */
/**
     * 도메인 생성
     * @param domainCreateVo
     * @return
     *//*

    @Override
    public Res<Boolean> addDomain(DomainCreateVo domainCreateVo) {
        
        StorageDomainsService storageDomainsService = getSystem().storageDomainsService();
        DataCenterService dataCenterService = getSystem().dataCentersService().dataCenterService(domainCreateVo.getDatacenterId());

        try{
            StorageDomain storageDomain = storageDomainsService.add().storageDomain(configureDomain(domainCreateVo)).send().storageDomain();
            StorageDomainService storageDomainService = storageDomainsService.storageDomainService(storageDomain.id());

            do {
                Thread.sleep(2000L);
                storageDomain = storageDomainService.get().send().storageDomain();
            } while(storageDomain.status() != StorageDomainStatus.UNATTACHED);

            AttachedStorageDomainsService asdsService = dataCenterService.storageDomainsService();
            AttachedStorageDomainService asdService = asdsService.storageDomainService(storageDomain.id());
            try {
                asdsService.add().storageDomain(new StorageDomainBuilder().id(storageDomain.id())).send();
//                        .dataCenter(new DataCenterBuilder().id(dcVo.getDatacenterId()).build())
            } catch (Exception var18) {
                var18.printStackTrace();
            }

            do {
                Thread.sleep(2000L);

                storageDomain = asdService.get().send().storageDomain();
            } while(storageDomain.status() != StorageDomainStatus.ACTIVE);

            return Res.successResponse();
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            return Res.failResponse(e.getMessage());
        }
    }


    @Override
    public Res<Boolean> remove(String domainId) {
        
        StorageDomainService storageDomainService = getSystem().storageDomainsService().storageDomainService(domainId);
        StorageDomain storageDomain = storageDomainService.get().send().storageDomain();
        AttachedStorageDomainService asdService = getSystem().dataCentersService().dataCenterService(storageDomain.dataCenters().get(0).id()).storageDomainsService().storageDomainService(domainId);

        try{
            asdService.remove().async(true).send();
            do {
                getSystem().out.println("떨어짐");
            }while (storageDomain.status() != StorageDomainStatus.UNATTACHED);

            storageDomainService.remove().destroy(true).send();

            return Res.successResponse();
        }catch (Exception e){
            e.printStackTrace();
            return Res.failResponse(e.getMessage());
        }
    }


    */
/**
     * 데이터센터 밑에 있는 네트워크 목록
     * @param dcId
     * @return 네트워크 목록
     *//*

    @Override
    public List<NetworkVo> getNetworkVoList(String dcId) {
        
        return getSystem().dataCentersService().dataCenterService(dcId).networksService().list().send().networks().stream()
                .map(network ->
                    NetworkVo.builder()
                            .id(network.id())
                            .name(network.name())
                            .description(network.description())
                        .build()
                )
                .collect(Collectors.toList());
    }


    */
/**
     * 디스크 상태 확인
     * @param diskService
     * @param expectStatus
     * @param interval
     * @param timeout
     * @return
     * @throws InterruptedException
     *//*

    private boolean expectDiskStatus(DiskService diskService, DiskStatus expectStatus, long interval, long timeout) throws InterruptedException {
        long startTime = getSystem().currentTimeMillis();
        while (true) {
            Disk currentDisk = diskService.get().send().disk();
            DiskStatus status = currentDisk.status();

            if (status == expectStatus) {
                return true;
            } else if (getSystem().currentTimeMillis() - startTime > timeout) {
                return false;
            }

            log.debug("디스크 상태: {}", status);
            Thread.sleep(interval);
        }
    }









    // 인증서를 keystore에 저장하는 과정
    private void trust(URL url, int bytes) throws Exception {
        FileInputStream fis = new FileInputStream("D:/key/server.crt");
        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        X509Certificate caCert = (X509Certificate) cf.generateCertificate(fis);

        KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
        ks.load(null, null);
        ks.setCertificateEntry("caCert", caCert);

        TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        tmf.init(ks);

        SSLContext ssl = SSLContext.getInstance("TLS");
        ssl.init(null, tmf.getTrustManagers(), new SecureRandom());

        HttpsURLConnection.setDefaultSSLSocketFactory(ssl.getSocketFactory());

        // 모든 호스트 이름을 검증 없이 허용 (보안에 좋지 않음)
        HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

        HttpsURLConnection httpsConn = (HttpsURLConnection) url.openConnection();
        httpsConn.setDoInput(true);
        httpsConn.setDoOutput(true);
        httpsConn.setRequestMethod("PUT");
        httpsConn.setConnectTimeout(2000);

        try (OutputStream os = httpsConn.getOutputStream()) {
            os.write(bytes);
            os.flush();
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(httpsConn.getInputStream(), StandardCharsets.UTF_8))) {
            reader.lines().collect(Collectors.joining());
        }
    }




    // region: 나중
//    @Override
//    public LunCreateVo setDiskLun(String dcId) {
//        
//        DataCenter dataCenter = getSystem().dataCentersService().dataCenterService(dcId).get().follow("clusters").send().dataCenter();
//        List<Host> hostList = getSystem().hostsService().list().send().hosts();
//        hostList.stream()
//                .filter(Host::clusterPresent)
//                .map(host ->
//                        HostVo.builder()
//                                .id(host.id())
//                                .name(host.name())
//                        .build()
//                )
//                .collect(Collectors.toList());
//
//        return null;
//    }
//
//    // 스토리지 > 디스크 > 새로만들기 - 직접 LUN
//    // 오케는 lun생성 없음(코드는 있음)
//    @Override
//    public CommonVo<Boolean> addDiskLun(LunCreateVo lun) {
//        
//        DisksService disksService = getSystem().disksService();
////        Host host = getSystem().hostsService().hostService(lunVo.getHostId()).get().send().host();
//
//        // host 사용 -> 호스트는 상태 확인(예: LUN 표시) 및 LUN에 대한 기본 정보(예: 크기 및 일련 번호) 검색에 사용
//        // host 사용X ->  데이터베이스 전용 작업. 스토리지에 액세스되지 않습니다.
//
//        try{
//            DiskBuilder diskBuilder = new DiskBuilder();
//            diskBuilder
//                    .alias(lun.getAlias())
//                    .description(lun.getDescription())
//                    .lunStorage(
//                        new HostStorageBuilder()
//                            .host(new HostBuilder().id(lun.getHostId()).build())
//                            .type(lun.getStorageType())
//                            .logicalUnits(
//                                new LogicalUnitBuilder()
//                                    .address(lun.getAddress())
//                                    .port(lun.getPort())
//                                    .target(lun.getTarget())
//                                .build()
//                            )
//                        .build()
//                    )
//            .build();
//
////            Disk disk = disksService.add().disk(diskBuilder).send().disk();
//            Disk disk = disksService.addLun().disk(diskBuilder).send().disk();
//
//            do{
//                log.info("ok");
//            }while (disk.status().equals(DiskStatus.OK));
//
//            log.info("성공: 새 가상 디스크 (lun) 생성");
//            return CommonVo.successResponse();
//        }catch (Exception e){
//            log.error("실패: 새 가상 디스크 (lun) 생성");
//            return CommonVo.failResponse(e.getMessage());
//        }
//    }
//
//    @Override
//    public CommonVo<Boolean> editDiskLun(LunCreateVo lunCreateVo) {
//        
//
//        return null;
//    }
//    @Override
//    public CommonVo<Boolean> cancelUpload(String diskId) {
//
//
//        imageTranService.cancel().send();
//
//        return CommonVo.successResponse();
//    }
//
//    @Override
//    public CommonVo<Boolean> pauseUpload(String diskId) {
//
//
//        imageTranService.pause().send();
//
//        return CommonVo.successResponse();
//    }
//
//    @Override
//    public CommonVo<Boolean> resumeUpload(String diskId) {
//
//
//        imageTranService.resume().send();
//
//        return CommonVo.successResponse();
//    }
//
//    @Override
//    public CommonVo<Boolean> downloadDisk() {
//
//
//
//        return CommonVo.successResponse();
//    }
    // endregion

}

*/
