/*
@Service
public interface ItAffinityService {
    List<AffinityGroupVo> getClusterAffinityGroups(String clusterId);   // 선호도 그룹 목록 - 클러스터
    List<AffinityGroupVo> getVmAffinityGroups(String vmId);             // 선호도 그룹 목록 - 가상머신

    List<IdentifiedVo> setHostList(String clusterId);   // 선호도 생성창 - 호스트 목록 (클러스트 ID에 의존)
    List<IdentifiedVo> setVmList(String clusterId);     // 선호도 생성창 - 가상머신 목록 (클러스트 ID에 의존)
    List<IdentifiedVo> setLabelList();                  // 선호도 생성창 - 선호도 레이블 목록 (출력은 데이터센터 상관없이 나옴)

    CommonVo<Boolean> addAffinityGroup(String id,  boolean cluster, AffinityGroupVo agVo);  // 선호도 그룹 생성
    AffinityGroupVo setAffinityGroup(String id, boolean cluster, String agId);    // 선호도 그룹 편집창
    CommonVo<Boolean> editAffinityGroup(AffinityGroupVo agVo); // 선호도 그룹 편집
    CommonVo<Boolean> deleteAffinityGroup(String id, boolean cluster, String agId); // 선호도 그룹 삭제

    List<AffinityLabelVo> getAffinityLabels();  // 선호도 레이블 목록 - 클러스터, 호스트, 가상머신


    // cluster  : label, group      api-group
    // host     : label             api-affinitylabels
    // vm       : label, group      api-affinitylabels
}
*/