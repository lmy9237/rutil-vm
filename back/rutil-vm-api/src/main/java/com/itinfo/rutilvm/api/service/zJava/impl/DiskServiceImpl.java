/*
package com.itinfo.rutilvm.service.storage;

import com.itinfo.itcloud.model.setting.PermissionVo;
import com.itinfo.itcloud.model.computing.VmVo;
import com.itinfo.itcloud.model.storage.DiskVo;
import com.itinfo.itcloud.model.storage.DomainVo;
import com.itinfo.itcloud.ovirt.AdminConnectionService;
import com.itinfo.itcloud.service.ItDiskService;
import lombok.extern.slf4j.Slf4j;
import org.ovirt.engine.sdk4.services.*;
import org.ovirt.engine.sdk4.types.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class DiskServiceImpl implements ItDiskService {
    @Autowired
    private AdminConnectionService admin;

    @Override
    public String getName(String id){
        SystemService systemService = admin.getConnection().systemService();

        return ((DiskService.GetResponse)systemService.disksService().diskService(id).get().send()).disk().name();
    }

    @Override
    public List<DiskVo> getList() {
        SystemService systemService = admin.getConnection().systemService();

        List<DiskVo> dVoList = new ArrayList<>();
        DiskVo dVo = null;

        List<Disk> diskList =
                ((DisksService.ListResponse)systemService.disksService().list().send()).disks();

        for(Disk disk : diskList){
            dVo = new DiskVo();

            dVo.setId(disk.id());
            dVo.setName(disk.name());
            dVo.setAlias(disk.alias());
            dVo.setDescription(disk.description());
//            dVo.setConnection();
//            dVo.setStorageDomainName(disk.storageDomain().name());
            dVo.setShareable(disk.shareable());
            dVo.setStatus(disk.status());
            dVo.setStorageType(disk.storageType());
            dVo.setVirtualSize(disk.provisionedSize());

            dVoList.add(dVo);
        }
        return dVoList;
    }

    @Override
    public DiskVo getInfo(String id) {
        SystemService systemService = admin.getConnection().systemService();

        DiskVo dVo = new DiskVo();

        Disk disk = ((DiskService.GetResponse)systemService.disksService().diskService(id).get().send()).disk();

        dVo.setId(disk.id());
        dVo.setAlias(disk.alias());
        dVo.setDescription(disk.description());
        dVo.setDiskProfileName( ((DiskProfileService.GetResponse)systemService.diskProfilesService().diskProfileService(disk.diskProfile().id()).get().send()).profile().name() );
        dVo.setFormat(disk.wipeAfterDelete());
        dVo.setActualSize(disk.actualSize());
        dVo.setVirtualSize(disk.provisionedSize());

        return dVo;
    }

    @Override
    public List<VmVo> getVm(String id) {
        SystemService systemService = admin.getConnection().systemService();

        return null;
    }

    @Override
    public List<DomainVo> getStorage(String id) {
        SystemService systemService = admin.getConnection().systemService();

        List<DomainVo> sdVoList = new ArrayList<>();
        DomainVo sdVo = null;

        List<StorageDomain> storageDomainList =
                ((StorageDomainsService.ListResponse)systemService.storageDomainsService().list().send()).storageDomains();

//        for(StorageDomain storageDomain : storageDomainList) {
//
//
//
//            sdVo = new StorageDomainVo();
//
//
//            sdVo.setId(storageDomain.id());
//            sdVo.setName(storageDomain.name());
//            sdVo.setDomainType(storageDomain.type().value() + (storageDomain.master() ? "(master)" : ""));
//            sdVo.setStatus(storageDomain.statusPresent() ? storageDomain.status().value() : null);     // storageDomainStatus 10개
//            sdVo.setAvailableSize(storageDomain.available()); // 여유공간
//            sdVo.setUsedSize(storageDomain.used()); // 사용된 공간
////            sdVo.setDiskSize(storageDomain.available().add(storageDomain.used()));
//            sdVo.setDescription(storageDomain.description());
////            sdVo.setDatacenterName( ((DataCenterService.GetResponse)systemService.dataCentersService().dataCenterService(id).get().send()).dataCenter().name() );
//
//            sdVoList.add(sdVo);
//        }
        return sdVoList;
    }

    @Override
    public List<PermissionVo> getPermission(String id) {
        SystemService systemService = admin.getConnection().systemService();

        List<PermissionVo> pVoList = new ArrayList<>();
        PermissionVo pVo = null;

        List<Permission> permissionList =
                ((AssignedPermissionsService.ListResponse)systemService.disksService().diskService(id).permissionsService().list().send()).permissions();

        for(Permission permission : permissionList){
            pVo = new PermissionVo();
            pVo.setPermissionId(permission.id());

            if(permission.groupPresent() && !permission.userPresent()){
                Group group = ((GroupService.GetResponse)systemService.groupsService().groupService(permission.group().id()).get().send()).get();
                pVo.setUser(group.name());
                pVo.setNameSpace(group.namespace());
                // 생성일의 경우 db에서 가져와야함?

                Role role = ((RoleService.GetResponse)systemService.rolesService().roleService(permission.role().id()).get().send()).role();
                pVo.setRole(role.name());

                pVoList.add(pVo);       // 그룹에 추가
            }

            if(permission.userPresent() && !permission.groupPresent()){
                User user = ((UserService.GetResponse)systemService.usersService().userService(permission.user().id()).get().send()).user();
                pVo.setUser(user.name());
                pVo.setNameSpace(user.namespace());

                Role role = ((RoleService.GetResponse)systemService.rolesService().roleService(permission.role().id()).get().send()).role();
                pVo.setRole(role.name());

                pVoList.add(pVo);
            }
        }
        return pVoList;
    }
}


 */