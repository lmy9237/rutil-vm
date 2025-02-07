package com.itinfo.service.consolidation;

import com.itinfo.model.karajan.ClusterVo;
import com.itinfo.model.karajan.HostVo;
import com.itinfo.model.karajan.KarajanVo;
import com.itinfo.model.karajan.VmVo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GreedyHost {
	public List<String[]> recommendHosts(String clusterId,
										 KarajanVo karajan,
										 VmVo newVM) {
		log.info("... recommendHosts('{}')", clusterId);
		List<ClusterVo> clusterInfo = karajan.getClusters();
		List<HostVo> hostInfo = new ArrayList<>();
		int clusterMemoryThreshold = karajan.getMemoryThreshold();
		List<String[]> candidateHost = new ArrayList<>();

		for (ClusterVo clusterVo : clusterInfo) {
			if (clusterId.equals(clusterVo.getId())) {
				hostInfo = clusterVo.getHosts();
				break;
			}
		}

		HostComparator comparator = new HostComparator();
		Collections.sort(hostInfo, comparator);

		for (int j = 0; j < hostInfo.size() && candidateHost.size() < 3; j++) {
			if ((hostInfo.get(j)).getStatus().equals("up")) {
				BigDecimal tempMemoryTotal = (hostInfo.get(j)).getMemoryTotal();
				BigDecimal tempMemoryUsed = (hostInfo.get(j)).getMemoryUsed();
				BigDecimal availableMemory = tempMemoryTotal.multiply(new BigDecimal(clusterMemoryThreshold / 100.0D));
				BigDecimal assignedMemory = tempMemoryUsed.add(newVM.getMemoryInstalled());
				BigDecimal hostMaxSchedulingMemory = (new BigDecimal((hostInfo.get(j)).getMaxSchedulingMemory())).multiply(new BigDecimal(clusterMemoryThreshold / 100.0D));
				if (availableMemory.compareTo(assignedMemory) >= 1 && hostMaxSchedulingMemory.compareTo(newVM.getMemoryInstalled()) != -1) {
					int vmVCpu = newVM.getCores() * newVM.getSockets() * newVM.getThreads();
					int HostVCpu = (hostInfo.get(j)).getCores() * (hostInfo.get(j)).getSockets() * (hostInfo.get(j)).getThreads();
					if (HostVCpu > vmVCpu + (hostInfo.get(j)).getCpuVmUsed()) {
						String[] candidateHostInfo = { (hostInfo.get(j)).getId(), (hostInfo.get(j)).getName() };
						candidateHost.add(candidateHostInfo);
					}
				}
			}
		}
		return candidateHost;
	}

	static class AscendingBigDecimal implements Comparator<BigDecimal> {
		public int compare(BigDecimal a, BigDecimal b) {
			return b.compareTo(a);
		}
	}

	static class HostComparator implements Comparator<HostVo> {
		@Override
		public int compare(HostVo firstHost, HostVo secondHost) {
			BigDecimal firstValue = firstHost.getMemoryFree();
			BigDecimal secondValue = secondHost.getMemoryFree();
			return firstValue.compareTo(secondValue);
		}
	}
}
