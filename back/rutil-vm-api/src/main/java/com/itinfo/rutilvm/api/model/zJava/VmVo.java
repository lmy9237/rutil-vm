/*
package com.itinfo.rutilvm.api.model.computing;

import com.itinfo.itcloud.model.IdentifiedVo;
import com.itinfo.itcloud.repository.dto.UsageDto;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.math.BigInteger;

@Getter @Builder @ToString
public class VmVo {
    private String id;
    private String name;
    private String status;
    private String description;
    private String fqdn;
    private String upTime;

    private String osSystem;
    private String chipsetFirmwareType; // bios.type
    private String priority;    // 고가용성 HighAvailability
    private String optimizeOption;

    private boolean hostEngineVm;

//  private String recentHost;  // 최근 부팅되었던 호스트 명

    private BigInteger memory;
    private BigInteger memoryActual;
    private int cpuCoreCnt;
    private int cpuTopologyCore;
    private int cpuTopologySocket;
    private int cpuTopologyThread;
    private int guestCpuCnt;
    private String guestCpu;
    private boolean ha;
    private int monitor;
    private boolean usb;
    private String hwTimeOffset;
    // 작성자
    // 소스
    // 실행 호스트
    // 사용자 정의속성
    // 클러스터 호환버전

    private BigInteger guestMemory;
    private BigInteger guestBufferedMemory;

    private String datacenterId;
    private String datacenterName;
    private String clusterId;
    private String clusterName;
    private String hostId;
    private String hostName;
    private String templateID;
    private String templateName;
    private String ipv4;
    private String ipv6;

    private String placement;  // 호스트에 부탁 여부 ( 호스트에 고정, 호스트에서 실행중, 호스트에서 고정 및 실행)
//    private IdentifiedVo currentlyRunningHost; // 가장 최근 실행 호스트

    private UsageDto usageDto; // 사용량
}
*/