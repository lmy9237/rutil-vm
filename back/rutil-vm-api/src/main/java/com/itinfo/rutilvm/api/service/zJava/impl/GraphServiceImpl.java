import com.itinfo.rutilvm.api.model.computing.DashBoardVo;
import com.itinfo.rutilvm.api.model.computing.DashBoardVoKt;
import com.itinfo.rutilvm.api.ovirt.AdminConnectionService;
import com.itinfo.rutilvm.api.service.BaseService;
import com.itinfo.rutilvm.api.service.computing.ItGraphService;
import lombok.extern.slf4j.Slf4j;
import org.ovirt.engine.sdk4.services.SystemService;
import org.ovirt.engine.sdk4.types.Host;
import org.ovirt.engine.sdk4.types.StorageDomain;
import org.ovirt.engine.sdk4.types.Vm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
/*
@Service
@Slf4j
public class GraphServiceImpl extends BaseService implements ItGraphService {
    @Autowired private HostConfigurationRepository hostConfigurationRepository;
    @Autowired private HostSamplesHistoryRepository hostSamplesHistoryRepository;
    @Autowired private HostInterfaceSampleHistoryRepository hostInterfaceSampleHistoryRepository;
    @Autowired private VmSamplesHistoryRepository vmSamplesHistoryRepository;
    @Autowired private VmInterfaceSamplesHistoryRepository vmInterfaceSamplesHistoryRepository;
    @Autowired private StorageDomainSamplesHistoryRepository storageDomainSamplesHistoryRepository;


    @Override
    public DashBoardVo getDashboard() {
        return DashBoardVoKt.toDashboardVo(getConn());
    }


    @Override
    public HostUsageDto totalCpuMemory() {
        List<Host> hostList = getSystem().hostsService().list().send().hosts();

        int hostCnt = hostList.size();

        double total = hostList.stream().mapToDouble(Host::memoryAsLong).sum() / GB;
        double used = hostList.stream()
                .flatMap(host -> getSystem().hostsService().hostService(host.id()).statisticsService().list().send().statistics().stream())
                .filter(stat -> "memory.used".equals(stat.name()))
                .mapToDouble(stat -> stat.values().get(0).datum().doubleValue())
                .sum() / GB;
        double free = total - used;

        double totalCpu = 0;
        double totalMemory = 0;
        LocalDateTime time = null;
        for(Host host : hostList){
            HostUsageDto usage = hostSamplesHistoryRepository.findFirstByHostIdOrderByHistoryDatetimeDesc(UUID.fromString(host.id())).totalCpuMemory();
            totalCpu += usage.getTotalCpuUsagePercent();
            totalMemory += usage.getTotalMemoryUsagePercent();
            time = usage.getHistoryDatetime();
        }

        System.out.println(totalCpu + ", " + hostList.size());

        return HostUsageDto.builder()
                .historyDatetime(time)
                .totalCpuUsagePercent(Math.round(totalCpu / hostCnt))
                .totalMemoryUsagePercent(Math.round(totalMemory / hostCnt))
                .totalMemoryGB(total)
                .usedMemoryGB(used)
                .freeMemoryGB(free)
                .build();
    }

    @Override
    public StorageUsageDto totalStorage() {
        List<StorageDomain> storageDomains = getSystem().storageDomainsService().list().send().storageDomains();

        double free = storageDomains.stream()
                .filter(StorageDomain::availablePresent)
                .mapToDouble(StorageDomain::availableAsLong)
                .sum() / GB;

        double used = storageDomains.stream()
                .filter(StorageDomain::usedPresent)
                .mapToDouble(StorageDomain::usedAsLong)
                .sum() / GB;

        return StorageUsageDto.builder()
                .totalGB(free + used)
                .freeGB(free)
                .usedGB(used)
                .usedPercent(used / (free + used) * 100)
                .build();

    }

    @Override
    public List<HostUsageDto> totalCpuMemoryList(UUID hostId, int limit) {
        SystemService system = admin.getConnection().systemService();
        Pageable page = PageRequest.of(0, limit);
        String hostName = system.hostsService().list().search("id=" + hostId).send().hosts().get(0).name();

        return hostSamplesHistoryRepository.findByHostIdOrderByHistoryDatetimeDesc(hostId, page).stream()
                .map(hostEntity ->
                        HostUsageDto.builder()
                            .hostName(hostName)
                            .historyDatetime(hostEntity.getHistoryDatetime())
                            .totalCpuUsagePercent(hostEntity.getCpuUsagePercent())
                            .totalMemoryUsagePercent(hostEntity.getMemoryUsagePercent())
                            .build()
                )
                .collect(Collectors.toList());
    }

    @Override
    public List<UsageDto> vmCpuChart() {
        SystemService system = admin.getConnection().systemService();
        Pageable page = PageRequest.of(0, 3);

        return vmSamplesHistoryRepository.findVmCpuChart(page).stream()
                .map(vmEntity -> {
                    Vm vm = system.vmsService().vmService(String.valueOf(vmEntity.getVmId())).get().send().vm();
                    return UsageDto.builder()
                            .name(vm.name())
                            .cpuPercent(vmEntity.getCpuUsagePercent())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<UsageDto> vmMemoryChart() {
        SystemService system = admin.getConnection().systemService();
        Pageable page = PageRequest.of(0, 3);

        return vmSamplesHistoryRepository.findVmMemoryChart(page).stream()
                .map(vmEntity -> {
                    Vm vm = system.vmsService().vmService(String.valueOf(vmEntity.getVmId())).get().send().vm();
                    return UsageDto.builder()
                            .name(vm.name())
                            .memoryPercent(vmEntity.getMemoryUsagePercent())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<UsageDto> storageChart() {
        SystemService system = admin.getConnection().systemService();
        Pageable page = PageRequest.of(0, 3);

        return storageDomainSamplesHistoryRepository.findStorageChart(page).stream()
                .map(domainEntity -> {
                    StorageDomain storageDomain = system.storageDomainsService().storageDomainService(String.valueOf(domainEntity.getStorageDomainId())).get().send().storageDomain();
                    double totalGB = domainEntity.getAvailableDiskSizeGb() + domainEntity.getUsedDiskSizeGb();

                    return UsageDto.builder()
                            .name(storageDomain.name())
                            .memoryPercent((int) ((domainEntity.getUsedDiskSizeGb() / totalGB) * 100))
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<UsageDto> hostCpuChart() {
        SystemService system = admin.getConnection().systemService();
        Pageable page = PageRequest.of(0, 3);

        return hostSamplesHistoryRepository.findHostCpuChart(page).stream()
                .map(hostEntity -> {
                    Host host = system.hostsService().hostService(String.valueOf(hostEntity.getHostId())).get().send().host();
                    return UsageDto.builder()
                            .name(host.name())
                            .cpuPercent(hostEntity.getCpuUsagePercent())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<UsageDto> hostMemoryChart() {
        SystemService system = admin.getConnection().systemService();
        Pageable page = PageRequest.of(0, 3);

        return hostSamplesHistoryRepository.findHostMemoryChart(page).stream()
                .map(hostEntity -> {
                    Host host = system.hostsService().hostService(String.valueOf(hostEntity.getHostId())).get().send().host();
                    return UsageDto.builder()
                            .name(host.name())
                            .memoryPercent(hostEntity.getMemoryUsagePercent())
                            .build();
                })
                .collect(Collectors.toList());
    }


    @Override
    public UsageDto hostPercent(String hostId, String hostNicId) {
        UsageDto usageDto = hostSamplesHistoryRepository.findFirstByHostIdOrderByHistoryDatetimeDesc(UUID.fromString(hostId)).getUsage();
        int networkRate = hostInterfaceSampleHistoryRepository.findFirstByHostInterfaceIdOrderByHistoryDatetimeDesc(UUID.fromString(hostNicId)).getNetworkRate();
        usageDto.setNetworkPercent(networkRate);

        return usageDto;
    }

    @Override
    public UsageDto vmPercent(String vmId, String vmNicId) {
        UsageDto usageDto = vmSamplesHistoryRepository.findFirstByVmIdOrderByHistoryDatetimeDesc(UUID.fromString(vmId)).getUsage();
        int networkRate = vmInterfaceSamplesHistoryRepository.findFirstByVmInterfaceIdOrderByHistoryDatetimeDesc(UUID.fromString(vmNicId)).getNetworkRate();
        usageDto.setNetworkPercent(networkRate);

        return usageDto;
    }
}
*/