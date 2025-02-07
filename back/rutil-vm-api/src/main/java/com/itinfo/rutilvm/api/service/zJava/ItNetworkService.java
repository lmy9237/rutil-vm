/*
public interface ItNetworkService {
    List<NetworkVo> getList();


    List<NetworkDcClusterVo> setDcCluster();    // 네트워크 생성 창

    CommonVo<Boolean> addNetwork(NetworkCreateVo ncVo); // 네트워크 생성
    NetworkCreateVo setEditNetwork(String id);   // 네트워크 편집 창
    CommonVo<Boolean> editNetwork(NetworkCreateVo ncVo);  // 네트워크 편집
    CommonVo<Boolean> deleteNetwork(String id); // 네트워크 삭제

    NetworkImportVo setImportNetwork();    // 네트워크 가져오기 생성창
    CommonVo<Boolean> importNetwork();  // 네트워크 가져오기


    NetworkVo getNetwork(String id);

    List<VnicProfileVo> getVnic(String id);

    List<VnicProfileVo> getVnicByNetwork(String id);

    VnicCreateVo setVnic(String id);
    CommonVo<Boolean> addVnic(String id, VnicCreateVo vcVo);
    VnicCreateVo setEditVnic(String id, String vcId);
    CommonVo<Boolean> editVnic(String id, String vcId, VnicCreateVo vcVo);
    CommonVo<Boolean> deleteVnic(String id, String vcId);


    List<NetworkClusterVo> getCluster(String id);
    NetworkUsageVo getUsage(String id, String cId);
    CommonVo<Boolean> editUsage(String id, String cId, NetworkUsageVo nuVo);

    List<NetworkHostVo> getHost(String id);

    List<NetworkVmVo> getVm(String id);
    CommonVo<Boolean> deleteVmNic(String id, String vmId, String nicId);  // 가상머신의 nics 제거

    List<NetworkTemplateVo> getTemplate(String id);
    CommonVo<Boolean> deleteTempNic(String id, String tempId, String nicId);  // 템플릿 nics 제거

    List<PermissionVo> getPermission(String id);
}
*/