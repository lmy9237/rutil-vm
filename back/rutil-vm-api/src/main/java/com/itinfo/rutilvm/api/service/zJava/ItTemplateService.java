/*
package com.itinfo.rutilvm.service.computing;

import com.itinfo.itcloud.model.computing.*;
import com.itinfo.itcloud.model.error.CommonVo;
import com.itinfo.itcloud.model.setting.PermissionVo;
import com.itinfo.itcloud.model.storage.DiskVo;
import com.itinfo.itcloud.model.storage.DomainVo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ItTemplateService {
    List<TemplateVo> getTemplates();

    List<ClusterVo> setClusterList();    // 클러스터 목록
//    List<DiskVo> setVmDisk(String vmId);    // 가상머신이 가진 디스크 출력

    CommonVo<Boolean> addTemplate(String vmId, TemplateVo templateVo);
    TemplateVo setTemplate(String id);  // 편집 창
    CommonVo<Boolean> editTemplate(TemplateVo tVo);   // 편집
    CommonVo<Boolean> deleteTemplate(String id);        // 삭제


    TemplateVo getTemplateInfo(String id);

    List<VmVo> getVmsByTemplate(String id);
    List<NicVo> getNicsByTemplate(String id);  // 네트워크 인터페이스
    // 생성, 편집, 제거

    List<DiskVo> getDisksByTemplate(String id);    // 디스크
    List<DomainVo> getDomainsByTemplate(String id);    // 스토리지
    List<PermissionVo> getPermissionsByTemplate(String id);    // 권한
    List<EventVo> getEventsByTemplate(String id);
}
*/
