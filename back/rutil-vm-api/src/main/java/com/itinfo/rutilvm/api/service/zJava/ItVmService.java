/*
public interface ItVmService {
    // 디스크
    List<VmDiskVo> getDisksByVm(String id);
    CommonVo<Boolean> addDiskImage(String id, VDiskImageVo image);  // 디스크 이미지 생성, id=vmId

    CommonVo<Boolean> deleteDisk(String id, String daId, boolean type); // 디스크 삭제
    CommonVo<Boolean> activeDisk(String id, String daId);        // 디스크 활성화
    CommonVo<Boolean> deactivateDisk(String id, String daId);    // 디스크 비활성화
    DiskVo setDiskMove(String id, String daId);                     // 디스크 이동창
    CommonVo<Boolean> moveDisk(String id, String daId, DiskVo diskVo);     // 디스크 스토리지 이동


    // 스냅샷
    List<SnapshotVo> getSnapshotsByVm(String id);    // 목록
    List<SnapshotDiskVo> setSnapshot(String vmId);  // 스냅샷 생성창
    CommonVo<Boolean> addSnapshot(SnapshotVo snapshotVo);   // 스냅샷 생성
    CommonVo<Boolean> deleteSnapshot(String id, String snapId);     // 스냅샷 삭제

    CommonVo<Boolean> addTemplate();    // 스냅샷 템플릿 생성


    List<AffinityGroupVo> getAffinityGroupByVm(String id);  // 선호도 그룹
    CommonVo<Boolean> addAffinityGroupByVm(String id, AffinityGroupVo agVo);  // 선호도 그룹 생성
    AffinityGroupVo setAffinityGroupByVm(String id, String agId);    // 선호도 그룹 편집창
    CommonVo<Boolean> editAffinityGroupByVm(AffinityGroupVo agVo); // 선호도 그룹 편집
    CommonVo<Boolean> deleteAffinityGroupByVm(String id, String agId); // 선호도 그룹 삭제

//    List<AffinityLabelVo> getAffinityLabelByVm(String id);  // 선호도 레이블


    List<IdentifiedVo> getApplicationsByVm(String id);  // 어플리케이션
    GuestInfoVo getGuestByVm(String id);    // 게스트 정보
    List<PermissionVo> getPermissionsByVm(String id);    // 권한
    List<EventVo> getEventsByVm(String id);      // 이벤트

    ConsoleVo getConsole(String vmId);



//    CommonVo<Boolean> editDiskImage(String id, VDiskImageVo image); // 디스크 이미지 편집
//    CommonVo<Boolean> addDiskLun(String id, VDiskLunVo lun);        // 디스크 lun 생성, id=vmId
//    CommonVo<Boolean> connectDisk(String id);     // 디스크 연결
//    CommonVo<Boolean> editDiskLun(String id, VDiskLunVo lun);       // 디스크 lun 편집
//    CommonVo<Boolean> previewSnapshot(String id, String snapId);    // 스냅샷 미리보기
//    CommonVo<Boolean> commitSnapshot(String id, String snapId);     // 스냅샷 커밋
//    CommonVo<Boolean> restoreSnapshot(String id, String snapId);    // 스냅샷 되돌리기
//    CommonVo<Boolean> copySnapshot();   // 스냅샷 복제
}
*/