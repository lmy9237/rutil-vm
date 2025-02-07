/*
package com.itinfo.rutilvm.api.model.computing;

import com.itinfo.itcloud.repository.dto.UsageDto;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.math.BigInteger;
import java.util.List;

@Getter @Builder @ToString
public class HostVo {
    private String id;
    private String name;
    private String comment;
    private String address;
    private String status;

    // cpu 소켓
    private int cpuTopologyCore;
    private int cpuTopologySocket;
    private int cpuTopologyThread;
    private int cpuCnt;
    private List<Integer> cpuOnline;

    private boolean devicePassThrough;
    private String iscsi;
    private String kdump;       // kdumpStatus(Enum): disabled, enabled, unknown

    private String bootingTime;

    // 물리적 메모리
    private BigInteger memory;
    private BigInteger memoryUsed;
    private BigInteger memoryFree;
    private BigInteger memoryMax; // 새 가상머신 최대여유메모리
    private BigInteger memoryShared;    // 공유 메모리

    // swap 크기
    private BigInteger swapTotal;
    private BigInteger swapUsed;
    private BigInteger swapFree;

    private String seLinux;
    private String spmStatus;   // spm 상태
    private int spmPriority;    // spm 우선순위

    private Boolean hostedEngine;   // Hosted Engine HA [ 금장, 은장, null ]
    private Boolean hostedActive;    // 활성여부
    private int hostedScore;        // 점수

    private boolean ksm;             // 메모리 페이지 공유
    private boolean pageSize;       // 자동으로 페이지를 크게


    // Huge Pages (size: free/total) 2048:0/0, 1048576:0/0
    private int hugePage2048Free;
    private int hugePage2048Total;
    private int hugePage1048576Free;
    private int hugePage1048576Total;

    // 클러스터 호환 버전
    private String clusterVer;

    private String clusterId;
    private String clusterName;
    private String datacenterId;
    private String datacenterName;

    private int vmCnt;
    private int vmUpCnt;

    private HostHwVo hostHwVo;
    private HostSwVo hostSwVo;

    private NicVo nicVo;
    private UsageDto usageDto;

    private List<VmVo> vmVoList;
}
*/