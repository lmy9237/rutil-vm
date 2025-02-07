//package com.itinfo.rutilvm.service.computing;
//
//import com.itinfo.itcloud.model.computing.*;
//import com.itinfo.itcloud.model.create.ClusterCreateVo;
//import com.itinfo.itcloud.model.create.NetworkCreateVo;
//import com.itinfo.itcloud.model.error.CommonVo;
//import com.itinfo.itcloud.model.network.NetworkClusterVo;
//import com.itinfo.itcloud.model.network.NetworkVo;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//public interface ItClusterService {
//    List<ClusterVo> getClusters();  // 클러스터 목록
//
//    List<DataCenterVo> setDcList(); // 생성 위한 dc 목록
//    List<NetworkVo> setNetworkList(String dcId);    // 생성 위한 network 목록
//
//    CommonVo<Boolean> addCluster(ClusterCreateVo cVo);  // 생성
//    ClusterCreateVo getCluster(String id);  // 편집 창
//    CommonVo<Boolean> editCluster(ClusterCreateVo cVo);  // 편집
//    CommonVo<Boolean> deleteCluster(List<String> ids); // 삭제
//
//
//    ClusterVo getClusterDetail(String id);   // 일반
//
//    List<NetworkVo> getNetworksByCluster(String id);  // 네트워크 목록
//    CommonVo<Boolean> addClusterNetwork(String id, NetworkCreateVo ncVo);// 네트워크 추가
//    List<NetworkClusterVo> setManageNetwork(String id); // 네트워크 관리 창
//    CommonVo<Boolean> manageNetwork(String id, List<NetworkClusterVo> ncVoList);// 네트워크 관리
//
//    List<HostVo> getHostsByCluster(String id);    // 호스트 목록
//    List<VmVo> getVmsByCluster(String id);        // 가상머신 목록
//
//    // 선호도 그룹
//    List<AffinityGroupVo> getAffinityGroupsByCluster(String id);
//    CommonVo<Boolean> addAffinityGroupByCluster(String id, AffinityGroupVo agVo);  // 선호도 그룹 생성
//    AffinityGroupVo setAffinityGroupByCluster(String id, String agId);    // 선호도 그룹 편집창
//    CommonVo<Boolean> editAffinityGroupByCluster(AffinityGroupVo agVo); // 선호도 그룹 편집
//    CommonVo<Boolean> deleteAffinityGroupByCluster(String id, String agId); // 선호도 그룹 삭제
//
//    // 선호도 레이블
//
//    List<PermissionVo> getPermissionsByCluster(String id);    // 권한
//    List<EventVo> getEventsByCluster(String id);  // 이벤트
//
////    List<CpuProfileVo> getCpuProfile(String id);  // 안쓸듯
//}
