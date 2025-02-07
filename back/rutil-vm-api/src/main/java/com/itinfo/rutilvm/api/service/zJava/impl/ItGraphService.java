/*
@Service
public interface ItGraphService {

    DashBoardVo getDashboard();

    HostUsageDto totalCpuMemory();

    StorageUsageDto totalStorage();

    // 선 그래프
    List<HostUsageDto> totalCpuMemoryList(UUID hostId, int limit);

    // 사용량 top 3
    List<UsageDto> vmCpuChart();
    List<UsageDto> vmMemoryChart();
    List<UsageDto> storageChart();

    // 호스트 사용량 top3
    List<UsageDto> hostCpuChart();
    List<UsageDto> hostMemoryChart();

    // 호스트 목록 - 그래프
    UsageDto hostPercent(String hostId, String hostNicId);

    // 가상머신 목록 - 그래프
    UsageDto vmPercent(String vmId, String vmNicId);

}
*/