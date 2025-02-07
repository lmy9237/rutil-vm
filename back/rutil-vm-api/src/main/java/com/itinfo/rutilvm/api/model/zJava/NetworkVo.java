//package com.itinfo.rutilvm.api.model.network;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.ToString;
//
//import java.math.BigInteger;
//
//@Getter @ToString @Builder
//public class NetworkVo {
//    private String id;
//    private String name;
//    private String description;
//    private String comment;
//    private int mtu;
//    private boolean portIsolation;
//    private boolean stp;
//    private String vdsmName;
//    private BigInteger vlan;        // vLan
//    private boolean required;       // 필수 네트워크
//    private String label;           // 레이블
//    private String providerId;        // 공급자 id
//    private String providerName;        // 공급자 이름
//
//    private String datacenterId;
//    private String datacenterName;
//    private String clusterId;
//    private String clusterName;
//
//    // cluster
//    // https://192.168.0.80/ovirt-engine/api/clusters/ac0ec8c8-8917-11ee-aa39-00163e58bee5/networks
//    private String status;      // operational / non-operational
//
//    // usages 역할
//    private NetworkUsageVo networkUsageVo;
//}
