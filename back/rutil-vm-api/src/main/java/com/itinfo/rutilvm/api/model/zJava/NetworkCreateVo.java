/*
package com.itinfo.rutilvm.api.model.create;

import com.itinfo.itcloud.model.network.NetworkClusterVo;
import com.itinfo.itcloud.model.network.VnicProfileVo;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;
/*
@Getter @Builder @ToString
public class NetworkCreateVo {
    // name, data_center
    private String datacenterId;
    private String datacenterName;

    private NetworkClusterVo clusterVo; // cluster=network 추가
    private List<NetworkClusterVo> clusterVoList;

    private String id;
    private String name;
    private String description;
    private String comment;
    private String label;   // 네트워크 레이블

    private Integer vlan;   // vlan 태그 (태그 자체는 활성화를 해야 입력란이 생김)
    private Integer mtu;    // true면 기본값
    private Boolean usageVm;  // 기본이 체크된 상태 (true)
    private Boolean portIsolation;
    private Boolean stp;

    private Boolean externalProvider;
    private Boolean physicalNw;
//    private String externalName;

    private List<String> dnsList;
    private List<VnicProfileVo> vnics;
}
*/