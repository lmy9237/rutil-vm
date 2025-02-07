/*
package com.itinfo.rutilvm.api.model.computing;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.ovirt.engine.sdk4.types.DiskStatus;
import org.ovirt.engine.sdk4.types.DiskStorageType;

import java.math.BigInteger;

@Getter @Builder @ToString
public class SnapshotDiskVo {
    private String id;
//    private String name;    // 스냅샷 이름
    private String daId;    // disk_attachments Id
    private String alias;   // disk 별칭
    private DiskStatus status;  // 상태

    private BigInteger virtualSize; // 가상크기
    private BigInteger actualSize;  // 실제 크기

    private String sparse;     // 할당정책  씬true, 사전할당false
    private String diskInterface;   // 인터페이스
    private String date;        // 생성일자
    private String diskSnapId;      // 디스크 스냅샷 ID
    private DiskStorageType storageType;     // 유형
    private String description;
}
*/