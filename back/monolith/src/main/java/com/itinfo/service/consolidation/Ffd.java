package com.itinfo.service.consolidation;

import com.itinfo.model.karajan.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Ffd {
	public List<ConsolidationVo> optimizeDataCenter(KarajanVo karajan,
													String clusterId) {
		log.info("... optimizeDataCenter('{}')", clusterId);
		List<ClusterVo> clusterInfo = karajan.getClusters();
		List<HostVo> afterHostInfo = new ArrayList<>();
		int i;
		for (ClusterVo c: clusterInfo) {
			if (clusterId.equals(c.getId())) {
				afterHostInfo = c.getHosts();
				break;
			}
		}
		for (i = afterHostInfo.size() - 1; i >= 0; i--) {
			if (!afterHostInfo.get(i).getStatus().equals("up"))
				afterHostInfo.remove(i);
		}
		List<ConsolidationVo> migrationScheduleInfo = new ArrayList<>();
		do {
			migrationScheduleInfo.clear();
			migrationScheduleInfo = consolidateVM(karajan, afterHostInfo);
			if (migrationScheduleInfo.size() == 0) continue;
			afterHostInfo = updateHostInfo(afterHostInfo, migrationScheduleInfo);
		} while (!migrationScheduleInfo.isEmpty());
		return getMigrationSchedule(afterHostInfo);
	}

	public List<ConsolidationVo> consolidateVM(KarajanVo karajan,
											   List<HostVo> hostInfo) {
		int clusterMemoryThreshold = karajan.getMemoryThreshold();
		List<ConsolidationVo> migrationScheduleInfo = new ArrayList<>();
		List<VmVo> removedVmInfo = new ArrayList<>();
		AscendingHostComparator hostComparator = new AscendingHostComparator();
		Collections.sort(hostInfo, hostComparator);
		for (int i = 0; i < hostInfo.size() - 1; i++) {
			List<VmVo> vmInfo = clone(((HostVo)hostInfo.get(i)).getVms());
			if (vmInfo.size() >= 1)
				if (vmInfo.stream().allMatch(vx -> vx.getPlacementPolicy().equals("migratable"))) {
					AscendingVmComparator vmComparator = new AscendingVmComparator();
					Collections.sort(vmInfo, vmComparator);
					for (int v = vmInfo.size() - 1; v >= 0; v--) {
						for (int h = hostInfo.size() - 1; h >= 0; h--) {
							if (i == 2 && h == 0) {
								Boolean a = Boolean.TRUE;
								a = Boolean.TRUE;
							}
							BigInteger hostMax = (hostInfo.get(0)).getMaxSchedulingMemory();
							if (h != i && (hostInfo.get(h)).getVms().size() >= 1) {
								BigDecimal tempMemoryTotal = (hostInfo.get(h)).getMemoryTotal();
								BigDecimal tempMemoryUsed = (hostInfo.get(h)).getMemoryUsed();
								BigDecimal availableMemory = tempMemoryTotal.multiply(new BigDecimal(clusterMemoryThreshold / 100.0D));
								BigDecimal assignedMemory = tempMemoryUsed.add((vmInfo.get(v)).getMemoryInstalled());
								BigDecimal hostMaxSchedulingMemory = (new BigDecimal((hostInfo.get(h)).getMaxSchedulingMemory())).multiply(new BigDecimal(clusterMemoryThreshold / 100.0D));
								if (availableMemory.compareTo(assignedMemory) == 1 && hostMaxSchedulingMemory.compareTo((vmInfo.get(v)).getMemoryInstalled()) != -1) {
									int vmVCpu = (vmInfo.get(v)).getCores() * (vmInfo.get(v)).getSockets() * (vmInfo.get(v)).getThreads();
									int HostVCpu = (hostInfo.get(h)).getCores() * (hostInfo.get(h)).getSockets() * (hostInfo.get(h)).getThreads();
									if (HostVCpu >= vmVCpu + (hostInfo.get(h)).getCpuVmUsed()) {
										(hostInfo.get(h)).setCpuVmUsed(vmVCpu + (hostInfo.get(h)).getCpuVmUsed());
										(hostInfo.get(h)).setMemoryUsed(assignedMemory);
										(hostInfo.get(h)).setMemoryFree(tempMemoryTotal.subtract(assignedMemory));
										(hostInfo.get(h)).setMaxSchedulingMemory((hostInfo.get(h)).getMaxSchedulingMemory().subtract((vmInfo.get(v)).getMemoryInstalled().toBigInteger()));
										(hostInfo.get(i)).setCpuVmUsed(vmVCpu - (hostInfo.get(i)).getCpuVmUsed());
										(hostInfo.get(i)).setMemoryUsed((hostInfo.get(i)).getMemoryUsed().subtract((vmInfo.get(v)).getMemoryInstalled()));
										(hostInfo.get(i)).setMemoryFree((hostInfo.get(i)).getMemoryTotal().subtract((hostInfo.get(i)).getMemoryFree()));
										(hostInfo.get(i)).setMaxSchedulingMemory((hostInfo.get(i)).getMaxSchedulingMemory().add((vmInfo.get(v)).getMemoryInstalled().toBigInteger()));
										ConsolidationVo migrationInfo =
												KarajanModelsKt.toConsolidationVoWithSpecificHost(vmInfo.get(v), hostInfo.get(h));
										migrationScheduleInfo.add(migrationInfo);
										removedVmInfo.add(vmInfo.get(v));
										vmInfo.remove(v);
										break;
									}
								}
							}
						}
					}
					if (vmInfo.size() < 1)
						break;
					hostInfo = rollBackHostInfo(migrationScheduleInfo, hostInfo, removedVmInfo);
					migrationScheduleInfo.clear();
					removedVmInfo.clear();
				} else if (!vmInfo.stream().allMatch(vx -> vx.getPlacementPolicy().equals("migratable"))) {

				}
		}
		migrationScheduleInfo.size();
		return migrationScheduleInfo;
	}

	public List<ConsolidationVo> getMigrationSchedule(List<HostVo> hostInfo) {
		List<ConsolidationVo> migrationScheduleInfo = new ArrayList<>();
		for (HostVo hostVo : hostInfo) {
			List<VmVo> vmInfo = hostVo.getVms();
			String hostId = hostVo.getId();
			for (VmVo vmVo : vmInfo) {
				String vmHostId = vmVo.getHostId();
				if (!hostId.equals(vmHostId)) {
					ConsolidationVo migrationInfo =
							KarajanModelsKt.toConsolidationVoWithSpecificHost(vmVo, hostVo);
					migrationScheduleInfo.add(migrationInfo);
				}
			}
		}
		return migrationScheduleInfo;
	}

	public List<HostVo> updateHostInfo(List<HostVo> hostInfo, List<ConsolidationVo> migrationSchedule) {
		for (ConsolidationVo consolidationVo : migrationSchedule) {
			String sourceHostId = consolidationVo.getFromHostId();
			String migrationVmId = consolidationVo.getVmId();
			String destinationHostId = consolidationVo.getHostId();
			int sourceHostIndex = findHostIndex(hostInfo, sourceHostId);
			int destinationHostIndex = findHostIndex(hostInfo, destinationHostId);
			List<VmVo> sourceVm = clone((hostInfo.get(sourceHostIndex)).getVms());
			int migrationVmIndex = findVmIndex(sourceVm, migrationVmId);
			VmVo migrationVm = sourceVm.get(migrationVmIndex);
			List<VmVo> destinationVm = clone((hostInfo.get(destinationHostIndex)).getVms());
			destinationVm.add(sourceVm.get(migrationVmIndex));
			sourceVm.remove(migrationVmIndex);
			(hostInfo.get(destinationHostIndex)).setVms(destinationVm);
			(hostInfo.get(sourceHostIndex)).setVms(sourceVm);
			BigDecimal memoryUsed = (hostInfo.get(destinationHostIndex)).getMemoryUsed();
			BigDecimal memoryTotal = (hostInfo.get(destinationHostIndex)).getMemoryTotal();
			BigDecimal maxSchedulingMemory = new BigDecimal((hostInfo.get(destinationHostIndex)).getMaxSchedulingMemory());
			int cpuVmUsed = 0;
			List<VmVo> vmInfo = (hostInfo.get(destinationHostIndex)).getVms();
			int j;
			for (j = 0; j < vmInfo.size(); j++)
				cpuVmUsed += (vmInfo.get(j)).getCores() * (vmInfo.get(j)).getSockets() * (vmInfo.get(j)).getThreads();
			(hostInfo.get(destinationHostIndex)).setMemoryUsed(memoryUsed.add(migrationVm.getMemoryInstalled()));
			(hostInfo.get(destinationHostIndex)).setMemoryFree(memoryTotal.subtract(memoryUsed));
			(hostInfo.get(destinationHostIndex)).setMaxSchedulingMemory(maxSchedulingMemory.subtract(migrationVm.getMemoryInstalled()).toBigInteger());
			(hostInfo.get(destinationHostIndex)).setCpuVmUsed(cpuVmUsed);
			memoryUsed = (hostInfo.get(sourceHostIndex)).getMemoryUsed();
			memoryTotal = (hostInfo.get(sourceHostIndex)).getMemoryTotal();
			maxSchedulingMemory = new BigDecimal((hostInfo.get(sourceHostIndex)).getMaxSchedulingMemory());
			cpuVmUsed = 0;
			vmInfo = (hostInfo.get(sourceHostIndex)).getVms();
			for (j = 0; j < vmInfo.size(); j++)
				cpuVmUsed += (vmInfo.get(j)).getCores() * (vmInfo.get(j)).getSockets() * (vmInfo.get(j)).getThreads();
			(hostInfo.get(sourceHostIndex)).setMemoryUsed(memoryUsed.subtract(migrationVm.getMemoryInstalled()));
			(hostInfo.get(sourceHostIndex)).setMemoryFree(memoryTotal.subtract(memoryUsed));
			(hostInfo.get(sourceHostIndex)).setMaxSchedulingMemory(maxSchedulingMemory.add(migrationVm.getMemoryInstalled()).toBigInteger());
			(hostInfo.get(sourceHostIndex)).setCpuVmUsed(cpuVmUsed);
		}
		return hostInfo;
	}

	public List<HostVo> rollBackHostInfo(List<ConsolidationVo> migrationSchedule, List<HostVo> hostInfo, List<VmVo> vmInfo) {
		for (int i = 0; i < migrationSchedule.size(); i++) {
			String sourceHostId = (migrationSchedule.get(i)).getFromHostId();
			String destinationHostId = (migrationSchedule.get(i)).getHostId();
			String candidatedVmId = (migrationSchedule.get(i)).getVmId();
			int sourceHostIndex = findHostIndex(hostInfo, sourceHostId);
			int destinationHostIndex = findHostIndex(hostInfo, destinationHostId);
			int candidatedVmIndex = findVmIndex(vmInfo, candidatedVmId);
			BigDecimal vmMemoryInstalled = (vmInfo.get(candidatedVmIndex)).getMemoryInstalled();
			int cpuVmUsed = (vmInfo.get(candidatedVmIndex)).getCores() * (vmInfo.get(candidatedVmIndex)).getSockets() * (vmInfo.get(candidatedVmIndex)).getThreads();
			(hostInfo.get(sourceHostIndex)).setMemoryUsed((hostInfo.get(sourceHostIndex)).getMemoryUsed().add(vmMemoryInstalled));
			(hostInfo.get(sourceHostIndex)).setMemoryFree((hostInfo.get(sourceHostIndex)).getMemoryTotal().subtract((hostInfo.get(sourceHostIndex)).getMemoryUsed()));
			(hostInfo.get(sourceHostIndex)).setMaxSchedulingMemory((hostInfo.get(sourceHostIndex)).getMaxSchedulingMemory().subtract(vmMemoryInstalled.toBigInteger()));
			(hostInfo.get(sourceHostIndex)).setCpuVmUsed((hostInfo.get(sourceHostIndex)).getCpuVmUsed() + cpuVmUsed);
			(hostInfo.get(destinationHostIndex)).setMemoryUsed((hostInfo.get(destinationHostIndex)).getMemoryUsed().subtract(vmMemoryInstalled));
			(hostInfo.get(destinationHostIndex)).setMemoryFree((hostInfo.get(destinationHostIndex)).getMemoryTotal().subtract((hostInfo.get(destinationHostIndex)).getMemoryUsed()));
			(hostInfo.get(destinationHostIndex)).setMaxSchedulingMemory((hostInfo.get(destinationHostIndex)).getMaxSchedulingMemory().add(vmMemoryInstalled.toBigInteger()));
			(hostInfo.get(destinationHostIndex)).setCpuVmUsed((hostInfo.get(destinationHostIndex)).getCpuVmUsed() - cpuVmUsed);
		}
		return hostInfo;
	}

	public List<ConsolidationVo> migrationOrdering(List<ConsolidationVo> migrationSchedule,
												   List<HostVo> hostInfo) {
		List<ConsolidationVo> ordered_migrationScheduleInfo = new ArrayList<>();
		List<String> destinationHost = new ArrayList<>();
		for (int i = 0; i < migrationSchedule.size(); i++)
			destinationHost.add((migrationSchedule.get(i)).getHostId());
		destinationHost = destinationHost.parallelStream().distinct().collect(Collectors.toList());
		List<VmVo> vmInfo = new ArrayList<>();
		if (destinationHost.size() == 1) {
			String sourceVmId = null;
			int sourceVM;
			for (sourceVM = 0; sourceVM < migrationSchedule.size(); sourceVM++) {
				if ((destinationHost.get(0)).equals((migrationSchedule.get(sourceVM)).getHostId())) {
					sourceVmId = (migrationSchedule.get(sourceVM)).getVmId();
					break;
				}
			}
			for (sourceVM = 0; sourceVM < hostInfo.size(); sourceVM++) {
				if ((destinationHost.get(0)).equals((hostInfo.get(sourceVM)).getId())) {
					vmInfo = (hostInfo.get(sourceVM)).getVms();
					break;
				}
			}
			sourceVM = migrationSchedule.size();
			int destinationVM = vmInfo.size();
			if (vmInfo.stream().allMatch(vx -> vx.getStatus().equals("up"))) {
				if (sourceVM > destinationVM) {
					for (VmVo vmVo : vmInfo) {
						ConsolidationVo migrationInfo =
								KarajanModelsKt.toConsolidationVoPostMigration(vmVo, hostInfo, sourceVmId);
						ordered_migrationScheduleInfo.add(migrationInfo);
					}
				} else {
					ordered_migrationScheduleInfo.addAll(migrationSchedule);
				}
			} else {
				ordered_migrationScheduleInfo.addAll(migrationSchedule);
			}
		} else if (destinationHost.size() > 1) {
			ordered_migrationScheduleInfo.addAll(migrationSchedule);
		}
		return ordered_migrationScheduleInfo;
	}

	public List<ConsolidationVo> reassignVirtualMachine(KarajanVo karajan,
														String clusterId,
														String shutdownHostId) {
		int clusterMemoryThreshold = karajan.getMemoryThreshold();
		List<ConsolidationVo> migrationScheduleInfo = new ArrayList<>();
		List<ClusterVo> clusterInfo = karajan.getClusters();
		List<HostVo> hostInfo = new ArrayList<>();
		List<VmVo> vmInfo = new ArrayList<>();
		List<String> vmDescription = new ArrayList<>();
		int i;
		for (i = 0; i < clusterInfo.size(); i++) {
			if (clusterId.equals((clusterInfo.get(i)).getId())) {
				hostInfo = (clusterInfo.get(i)).getHosts();
				break;
			}
		}
		for (i = 0; i < hostInfo.size(); i++) {
			if (shutdownHostId.equals((hostInfo.get(i)).getId())) {
				vmInfo = (hostInfo.get(i)).getVms();
				break;
			}
		}
		for (i = 0; i < vmInfo.size(); i++)
			vmDescription.add("");
		for (i = hostInfo.size() - 1; i >= 0; i--) {
			if (shutdownHostId.equals((hostInfo.get(i)).getId()) || !(hostInfo.get(i)).getStatus().equals("up"))
				hostInfo.remove(i);
		}
		AscendingHostComparator hostComparator = new AscendingHostComparator();
		Collections.sort(hostInfo, hostComparator);
		AscendingVmComparator vmComparator = new AscendingVmComparator();
		Collections.sort(vmInfo, vmComparator);
		for (i = vmInfo.size() - 1; i >= 0; i--) {
			if ((vmInfo.get(i)).getPlacementPolicy().equals("migratable")) {
				BigDecimal vmMemoryInstalled = (vmInfo.get(i)).getMemoryInstalled();
				for (int j = 0; j < hostInfo.size(); j++) {
					BigDecimal tempMemoryTotal = (hostInfo.get(j)).getMemoryTotal();
					BigDecimal availableMemory = tempMemoryTotal.multiply(new BigDecimal(clusterMemoryThreshold / 100.0D));
					BigDecimal hostMaxSchedulingMemory = (new BigDecimal((hostInfo.get(j)).getMaxSchedulingMemory())).multiply(new BigDecimal(clusterMemoryThreshold / 100.0D));
					if (availableMemory.compareTo(vmMemoryInstalled) != -1 && hostMaxSchedulingMemory.compareTo(vmMemoryInstalled) != -1) {
						int vmVCpu = (vmInfo.get(i)).getCores() * (vmInfo.get(i)).getSockets() * (vmInfo.get(i)).getThreads();
						int HostVCpu = (hostInfo.get(j)).getCores() * (hostInfo.get(j)).getSockets() * (hostInfo.get(j)).getThreads();
						if (HostVCpu > vmVCpu + (hostInfo.get(j)).getCpuVmUsed()) {
							(hostInfo.get(j)).setCpuVmUsed(vmVCpu + (hostInfo.get(j)).getCpuVmUsed());
							(hostInfo.get(j)).setMemoryUsed((hostInfo.get(j)).getMemoryUsed().add(vmMemoryInstalled));
							(hostInfo.get(j)).setMemoryFree((hostInfo.get(j)).getMemoryTotal().subtract((hostInfo.get(j)).getMemoryUsed()));
							(hostInfo.get(j)).setMaxSchedulingMemory(hostMaxSchedulingMemory.subtract(vmMemoryInstalled).toBigInteger());
							ConsolidationVo migrationInfo =
									KarajanModelsKt.toConsolidationVo(vmInfo.get(i), vmDescription.get(i), hostInfo.get(i));
							migrationScheduleInfo.add(migrationInfo);
							vmInfo.remove(i);
							vmDescription.remove(i);
							break;
						}
						vmDescription.set(i, "CPU 공간이 여유있는 호스트가 존재하지 않습니다.");
					} else {
						vmDescription.set(i, "메모리 공간이 여유있는 호스트가 존재하지 않습니다.");
					}
				}
			}
		}
		for (i = 0; i < vmInfo.size(); i++) {
			ConsolidationVo migrationInfo =
					KarajanModelsKt.toConsolidationVo(vmInfo.get(i), vmDescription.get(i), null);
			migrationScheduleInfo.add(migrationInfo);
		}
		return migrationScheduleInfo;
	}

	public int findHostIndex(List<HostVo> hostInfo, String hostId) {
		int index = -1;
		for (int i = 0; i < hostInfo.size(); i++) {
			if ((hostInfo.get(i)).getId().equals(hostId)) {
				index = i;
				break;
			}
		}
		return index;
	}

	public int findVmIndex(List<VmVo> vmInfo, String vmId) {
		int index = -1;
		for (int i = 0; i < vmInfo.size(); i++) {
			if ((vmInfo.get(i)).getId().equals(vmId)) {
				index = i;
				break;
			}
		}
		return index;
	}

	public static <T> List<T> clone(List<T> original) {
		List<T> copy = new ArrayList<>(original);
		return copy;
	}

	static class AscendingBigDecimal implements Comparator<BigDecimal> {
		@Override
		public int compare(BigDecimal a, BigDecimal b) {
			return b.compareTo(a);
		}
	}

	static class AscendingHostComparator implements Comparator<HostVo> {
		public int compare(HostVo firstHost, HostVo secondHost) {
			BigDecimal firstValue = firstHost.getMemoryFree().divide(firstHost.getMemoryTotal(), 2, 4);
			BigDecimal secondValue = secondHost.getMemoryFree().divide(secondHost.getMemoryTotal(), 2, 4);
			return firstValue.compareTo(secondValue) * -1;
		}
	}

	static class AscendingVmComparator implements Comparator<VmVo> {
		public int compare(VmVo firstVm, VmVo secondVm) {
			BigDecimal firstValue = firstVm.getMemoryUsed();
			BigDecimal secondValue = secondVm.getMemoryUsed();
			return firstValue.compareTo(secondValue) * -1;
		}
	}

	static class DescendingHostComparator implements Comparator<HostVo> {
		public int compare(HostVo firstHost, HostVo secondHost) {
			BigDecimal firstValue = firstHost.getMemoryFree().divide(firstHost.getMemoryTotal(), 2, RoundingMode.HALF_UP);
			BigDecimal secondValue = secondHost.getMemoryFree().divide(secondHost.getMemoryTotal(), 2, RoundingMode.HALF_UP);
			return firstValue.compareTo(secondValue);
		}
	}

	static class DescendingVmComparator implements Comparator<VmVo> {
		@Override
		public int compare(VmVo firstVm, VmVo secondVm) {
			BigDecimal firstValue = firstVm.getMemoryUsed();
			BigDecimal secondValue = secondVm.getMemoryUsed();
			return firstValue.compareTo(secondValue);
		}
	}
}
