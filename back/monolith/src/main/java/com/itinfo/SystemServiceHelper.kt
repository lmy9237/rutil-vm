package com.itinfo

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.services.HostService.IscsiDiscoverRequest
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory

private val log = LoggerFactory.getLogger("com.itinfo.SystemServiceHelperKt")

class SystemServiceHelper {
	companion object {
		@Volatile private var INSTANCE: SystemServiceHelper? = null
		@JvmStatic fun getInstance(): SystemServiceHelper = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}

		private fun build(): SystemServiceHelper = SystemServiceHelper()
	}

	private fun getSystemService(c: Connection): SystemService = c.systemService()



}

val Connection.systemService: SystemService
	get() = this.systemService()

private fun Connection.srvClusters(): ClustersService = this.systemService.clustersService()
private fun Connection.srvCluster(id: String): ClusterService = this.srvClusters().clusterService(id)

fun Connection.findAllClusters(searchQuery: String = ""): List<Cluster> =
	if (searchQuery.isEmpty()) this.srvClusters().list().send().clusters() ?: listOf()
	else this.srvClusters().list().search(searchQuery).caseSensitive(false).send().clusters() ?: listOf()

fun Connection.findCluster(clusterId: String): Cluster? = try {
	this.srvCluster(clusterId).get().send().cluster()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.addCluster(cluster: Cluster): Cluster? = try {
	this.srvClusters().add().cluster(cluster).send().cluster()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.updateCluster(clusterId: String, cluster: Cluster): Cluster? = try {
	this.srvCluster(clusterId).update().cluster(cluster).send().cluster()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.removeCluster(clusterId: String): Boolean = try {
	this.srvCluster(clusterId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

private fun Connection.srvClusterNetworks(clusterId: String): ClusterNetworksService =
	this.srvCluster(clusterId).networksService()

fun Connection.findAllNetworksFromCluster(clusterId: String): List<Network> = try {
	this.srvClusterNetworks(clusterId).list().send().networks()
} catch (e: Error) {
	log.error(e.localizedMessage)
	listOf()
}
private fun Connection.srvNetworkFromCluster(clusterId: String, networkId: String): ClusterNetworkService =
	this.srvClusterNetworks(clusterId).networkService(networkId)
fun Connection.findNetworkFromCluster(clusterId: String, networkId: String): Network? = try {
	val n: Network? = this.srvNetworkFromCluster(clusterId, networkId).get().send().network()
	log.info("network found ... id: ${n?.id()}")
	n
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.addNetworkFromCluster(clusterId: String, network: Network): Network? = try {
	val n: Network? = this.srvCluster(clusterId).networksService().add().network(network).send().network()
	log.info("network created successfully ... id: ${n?.id()}")
	n
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.updateNetworkFromCluster(clusterId: String, network: Network): Network? = try {
	this.srvNetworkFromCluster(clusterId, network.id()).update().network(network).send().network()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.removeNetworkFromCluster(clusterId: String, networkId: String): Boolean = try {
	this.srvNetworkFromCluster(clusterId, networkId).remove().send()
	false
} catch (e: Error) {
	log.error(e.localizedMessage)
	true
}
private fun Connection.srvExternalNetworkProviders(clusterId: String): ClusterExternalProvidersService =
	this.srvCluster(clusterId).externalNetworkProvidersService()

fun Connection.findExternalNetworkProviders(clusterId: String): List<ExternalProvider> = try {
	srvExternalNetworkProviders(clusterId).list().send().providers()
} catch (e: Error) {
	log.error(e.localizedMessage)
	listOf<ExternalProvider>()
}
//endregion

//region: Vm
private fun Connection.srvVms(): VmsService = this.systemService.vmsService()
fun Connection.findAllVms(searchQuery: String = ""): List<Vm> {
	return if (searchQuery == "") srvVms().list().send().vms()
	else srvVms().list().search(searchQuery).caseSensitive(false).send().vms()
}

fun Connection.srvVm(vmId: String): VmService = this.srvVms().vmService(vmId)
fun Connection.findVm(vmId: String): Vm? = try {
	this.srvVm(vmId).get().send().vm()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.startVm(vmId: String): Boolean = try {
	this.srvVm(vmId).start().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.stopVm(vmId: String): Boolean = try {
	this.srvVm(vmId).stop().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.suspendVm(vmId: String): Boolean = try {
	this.srvVm(vmId).suspend().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.rebootVm(vmId: String): Boolean = try {
	this.srvVm(vmId).reboot().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.removeVm(vmId: String, detachOnly: Boolean = false): Boolean = try {
	this.srvVm(vmId).remove().detachOnly(detachOnly).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

private fun Connection.srvVmCdromsFromVm(vmId: String): VmCdromsService =
	this.srvVm(vmId).cdromsService()
fun Connection.findAllVmCdromsFromVm(vmId: String): List<Cdrom> =
	this.srvVmCdromsFromVm(vmId).list().send().cdroms()

private fun Connection.srvVmCdromFromVm(vmId: String, cdromId: String): VmCdromService =
	this.srvVmCdromsFromVm(vmId).cdromService(cdromId)

fun Connection.findVmCdromFromVm(vmId: String, cdromId: String): Cdrom =
	this.srvVmCdromFromVm(vmId, cdromId).get().send().cdrom()

fun Connection.updateVmCdromFromVm(vmId: String, cdromId: String, cdrom: Cdrom): Boolean = try {
	this.srvVmCdromFromVm(vmId, cdromId).update().cdrom(cdrom).current(true).send()
	true
} catch (e: Error) {
	false
}

private fun Connection.srvNicsFromVm(vmId: String): VmNicsService =
	this.srvVm(vmId).nicsService()
fun Connection.findNicsFromVm(vmId: String): List<Nic> =
	this.srvNicsFromVm(vmId).list().send().nics()
private fun Connection.srvNicFromVm(vmId: String, nicId: String): VmNicService =
	this.srvNicsFromVm(vmId).nicService(nicId)

fun Connection.findNicFromVm(vmId: String, nicId: String): Nic? = try {
	this.srvNicFromVm(vmId, nicId).get().send().nic()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.addNicFromVm(vmId: String, nic: Nic): Nic? = try {
	srvNicsFromVm(vmId).add().nic(nic).send().nic()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.updateNicFromVm(vmId: String, nicId: String, nic: Nic): Nic? = try {
	srvNicFromVm(vmId, nicId).update().nic(nic).send().nic()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

private fun Connection.srvAllDiskAttachmentsFromVm(vmId: String): DiskAttachmentsService =
	this.srvVm(vmId).diskAttachmentsService()
fun Connection.findAllDiskAttachmentsFromVm(vmId: String): List<DiskAttachment> =
	this.srvAllDiskAttachmentsFromVm(vmId).list().send().attachments()
private fun Connection.srvSnapshotsFromVm(vmId: String): SnapshotsService =
	this.srvVm(vmId).snapshotsService()
fun Connection.findAllSnapshotsFromVm(vmId: String): List<Snapshot> =
	srvSnapshotsFromVm(vmId).list().send().snapshots()

private fun Connection.srvSnapshotFromVm(vmId: String, snapshotId: String): SnapshotService =
	this.srvSnapshotsFromVm(vmId).snapshotService(snapshotId)

fun Connection.findSnapshotFromVm(vmId: String, snapshotId: String): Snapshot? = try {
	this.srvSnapshotFromVm(vmId, snapshotId).get().send().snapshot()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.addSnapshotFromVm(vmId: String, snapshot: Snapshot): Boolean = try {
	this.srvSnapshotsFromVm(vmId).add().snapshot(snapshot).send().snapshot()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.removeSnapshotFromVm(vmId: String, snapshotId: String): Boolean = try {
	this.srvSnapshotFromVm(vmId, snapshotId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.undoSnapshotFromVm(vmId: String): Boolean = try {
	this.srvVm(vmId).undoSnapshot().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.commitSnapshotFromVm(vmId: String): Boolean = try {
	this.srvVm(vmId).commitSnapshot().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.previewSnapshotFromVm(vmId: String, snapshot: Snapshot, restoreMemory: Boolean): Boolean = try {
	this.srvVm(vmId).previewSnapshot().restoreMemory(restoreMemory).snapshot(snapshot).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

private fun Connection.srvSnapshotDisksFromVm(vmId: String, snapshotId: String): SnapshotDisksService =
	this.srvSnapshotFromVm(vmId, snapshotId).disksService()

fun Connection.findAllSnapshotDisksFromVm(vmId: String, snapshotId: String): List<Disk> =
	this.srvSnapshotDisksFromVm(vmId, snapshotId).list().send().disks()

private fun Connection.srvSnapshotNicsFromVm(vmId: String, snapshotId: String): SnapshotNicsService =
	this.srvSnapshotFromVm(vmId, snapshotId).nicsService()

fun Connection.findAllSnapshotNicsFromVm(vmId: String, snapshotId: String): List<Nic> =
	this.srvSnapshotNicsFromVm(vmId, snapshotId).list().send().nics()

private fun Connection.srvVmGraphicsConsolesFromVm(vmId: String): VmGraphicsConsolesService =
	this.srvVm(vmId).graphicsConsolesService()

fun Connection.findAllVmGraphicsConsolesFromVm(vmId: String): List<GraphicsConsole> =
	this.srvVmGraphicsConsolesFromVm(vmId).list().current(true).send().consoles()

private fun Connection.srvVmGraphicsConsoleFromVm(vmId: String, graphicsConsoleId: String): VmGraphicsConsoleService =
	this.srvVmGraphicsConsolesFromVm(vmId).consoleService(graphicsConsoleId)

fun Connection.findTicketFromVm(vmId: String, graphicsConsoleId: String): Ticket? = try {
	this.srvVmGraphicsConsoleFromVm(vmId, graphicsConsoleId).ticket().send().ticket()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
private fun Connection.srvStatisticsFromVm(vmId: String): StatisticsService =
	this.srvVm(vmId).statisticsService()
fun Connection.findAllStatisticsFromVm(vmId: String): List<Statistic> =
	this.srvStatisticsFromVm(vmId).list().send().statistics()
private fun Connection.srvAllAssignedPermissionsFromVm(vmId: String): AssignedPermissionsService =
	this.srvVm(vmId).permissionsService()
fun Connection.findAllAssignedPermissionsFromVm(vmId: String): List<Permission> = try {
	this.srvAllAssignedPermissionsFromVm(vmId).list().send().permissions()
} catch (e: Error) {
	log.error(e.localizedMessage)
	listOf()
}
private fun Connection.srvStatisticsFromVmNic(vmId: String, nicId: String): StatisticsService =
	this.srvVm(vmId).nicsService().nicService(nicId).statisticsService()
fun Connection.findAllStatisticsFromVmNic(vmId: String, nicId: String): List<Statistic> =
	this.srvStatisticsFromVmNic(vmId, nicId).list().send().statistics()
//endregion

//region: Hosts
private fun Connection.srvHosts(): HostsService = this.systemService.hostsService()
private fun Connection.srvHost(hostId: String): HostService = this.srvHosts().hostService(hostId)
fun Connection.findAllHosts(searchQuery: String = ""): List<Host> =
	if (searchQuery == "") this.srvHosts().list().send().hosts()
	else this.srvHosts().list().search(searchQuery).caseSensitive(false).send().hosts()

fun Connection.findHost(hostId: String): Host? = try {
	val h: Host? = srvHost(hostId).get().send().host()
	log.info("host found ... id: ${h?.id()}")
	h
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.addHost(host: Host, deployHostedEngine: Boolean = false): Host? = try {
	val host: Host? =
		if (deployHostedEngine) srvHosts().add().deployHostedEngine(true).host(host).send().host()
		else srvHosts().add().host(host).send().host()
	log.info("add host result: $host")
	host
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.updateHost(host: Host): Host? = try {
	val host: Host? =
		srvHost(host.id()).update().host(host).send().host()
	log.info("update host result: $host")
	host
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.removeHost(hostId: String): Boolean = try {
	val res = srvHost(hostId).remove().send()
	log.info("activate host result: $res")
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.activateHost(hostId: String): Boolean = try {
	val res = srvHost(hostId).activate().send()
	log.info("activate host result: $res")
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
fun Connection.deactivateHost(hostId: String): Boolean = try {
	val res = srvHost(hostId).deactivate().send()
	log.info("deactivate host result: $res")
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.findPowerManagementFromHost(hostId: String, fenceType: FenceType): PowerManagement? = try {
	val res = srvHost(hostId).fence().fenceType(fenceType.name).send().powerManagement()
	log.info("powerManagementFromHost result: $res")
	res
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.migrateHostFromVm(vmId: String, host: Host): Boolean = try {
	this.srvVm(vmId).migrate().host(host).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

private fun Connection.srvAllNicsFromHost(hostId: String): HostNicsService =
	this.srvHost(hostId).nicsService()
fun Connection.findAllNicsFromHost(hostId: String): List<HostNic> =
	this.srvAllNicsFromHost(hostId).list().send().nics()
private fun Connection.srvNicFromHost(hostId: String, hostNicId: String): HostNicService =
	this.srvAllNicsFromHost(hostId).nicService(hostNicId)

fun Connection.findNicFromHost(hostId: String, hostNicId: String): HostNic? = try {
	this.srvNicFromHost(hostId, hostNicId).get().send().nic()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

private fun Connection.srvStatisticsFromHost(hostId: String): StatisticsService =
	this.srvHost(hostId).statisticsService()

fun Connection.findAllStatisticsFromHost(hostId: String): List<Statistic> =
	this.srvStatisticsFromHost(hostId).list().send().statistics()

fun Connection.findAllStatisticsFromHostNic(hostId: String, hostNicId: String): List<Statistic> =
	this.srvAllNicsFromHost(hostId).nicService(hostNicId).statisticsService().list().send().statistics()

private fun Connection.srvStoragesFromHost(hostId: String): HostStorageService =
	this.srvHost(hostId).storageService()

fun Connection.findAllStoragesFromHost(hostId: String): List<HostStorage> =
	this.srvStoragesFromHost(hostId).list().send().storages()

private fun Connection.srvNetworkAttachmentsFromHost(hostId: String): NetworkAttachmentsService =
	this.srvHost(hostId).networkAttachmentsService()

fun Connection.findAllNetworkAttachmentsFromHost(hostId: String): List<NetworkAttachment> =
	this.srvNetworkAttachmentsFromHost(hostId).list().send().attachments()

private fun Connection.srvNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String): NetworkAttachmentService =
	this.srvNetworkAttachmentsFromHost(hostId).attachmentService(networkAttachmentId)

fun Connection.modifyNetworkAttachmentsFromHost(hostId: String, networkAttachments: List<NetworkAttachment>): Boolean = try {
	this.srvHost(hostId).setupNetworks().modifiedNetworkAttachments(networkAttachments).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.modifyNetworkAttachmentFromHost(hostId: String, networkAttachments: NetworkAttachment): Boolean = try {
	this.srvHost(hostId).setupNetworks().modifiedNetworkAttachments(networkAttachments).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.updateNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String, networkAttachment: NetworkAttachment): Boolean = try {
	this.srvNetworkAttachmentFromHost(hostId, networkAttachmentId).update().attachment(networkAttachment).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.removeNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String): Boolean = try {
	this.srvNetworkAttachmentFromHost(hostId, networkAttachmentId).remove().send()
	this.srvHost(hostId).commitNetConfig().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.removeBondsFromHost(hostId: String, hostNics: List<HostNic> = listOf()): Boolean = try {
	this.srvHost(hostId).setupNetworks().removedBonds(hostNics).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.setupNetworksFromHost(
	hostId: String,
	hostNics: HostNic,
	networkAttachments: List<NetworkAttachment> = listOf()
): Boolean = try {
	if (networkAttachments.isEmpty())
		this.srvHost(hostId).setupNetworks().modifiedBonds(hostNics).send()
	else
		this.srvHost(hostId).setupNetworks().modifiedBonds(hostNics).modifiedNetworkAttachments(networkAttachments).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

private fun Connection.srvFenceAgentsFromHost(hostId: String): FenceAgentsService =
	this.srvHost(hostId).fenceAgentsService()

fun Connection.findAllFenceAgentsFromHost(hostId: String): List<Agent> =
	this.srvFenceAgentsFromHost(hostId).list().send().agents()

fun Connection.addFenceAgent(hostId: String, agent: Agent): Agent? = try {
	this.srvFenceAgentsFromHost(hostId).add().agent(agent).send().agent()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

private fun Connection.srvAllIscsiDetailsFromHost(hostId: String): IscsiDiscoverRequest =
	this.srvHost(hostId).iscsiDiscover()

fun Connection.findAllIscsiTargetsFromHost(hostId: String, iscsiDetails: IscsiDetails): List<String> =
	this.srvAllIscsiDetailsFromHost(hostId).iscsi(iscsiDetails).send().iscsiTargets()

//endregion

//region: DataCenter
private fun Connection.srvDataCenters(): DataCentersService = this.systemService.dataCentersService()
fun Connection.findAllDataCenters(): List<DataCenter> =
	this.srvDataCenters().list().send().dataCenters()
private fun Connection.srvDataCenter(dataCenterId: String): DataCenterService = this.srvDataCenters().dataCenterService(dataCenterId)
fun Connection.findDataCenter(dataCenterId: String): DataCenter =
	this.srvDataCenter(dataCenterId).get().send().dataCenter()
private fun Connection.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId: String): AttachedStorageDomainsService =
	this.srvDataCenter(dataCenterId).storageDomainsService()
fun Connection.findAllAttachedStorageDomainsFromDataCenter(dataCenterId: String): List<StorageDomain>
		= this.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId).list().send().storageDomains()
fun Connection.srvAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): AttachedStorageDomainService
		= this.srvAllAttachedStorageDomainsFromDataCenter(dataCenterId).storageDomainService(storageDomainId)
fun Connection.findAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): StorageDomain? = try {
	srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).get().send().storageDomain()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.activeAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean = try {
	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).activate().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
fun Connection.deactiveAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean = try {
	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).deactivate().force(true).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
fun Connection.removeAttachedStorageDomainFromDataCenter(dataCenterId: String, storageDomainId: String): Boolean = try {
	this.srvAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainId).remove().async(true).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
private fun Connection.srvQossFromDataCenter(dataCenterId: String): QossService =
	this.srvDataCenter(dataCenterId).qossService()
fun Connection.findAllQossFromDataCenter(dataCenterId: String): List<Qos> =
	this.srvQossFromDataCenter(dataCenterId).list().send().qoss()
private fun Connection.srvQuotasFromDataCenter(dataCenterId: String): QuotasService =
	this.srvDataCenter(dataCenterId).quotasService()
fun Connection.findAllQuotasFromDataCenter(dataCenterId: String): List<Quota> =
	this.srvQuotasFromDataCenter(dataCenterId).list().send().quotas()
fun Connection.addQuotaFromDataCenter(dataCenterId: String, quota: Quota): Quota? = try {
	this.srvQuotasFromDataCenter(dataCenterId).add().quota(quota).send().quota()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
private fun Connection.srvQuotaFromDataCenter(dataCenterId: String, quotaId: String): QuotaService =
	this.srvQuotasFromDataCenter(dataCenterId).quotaService(quotaId)
fun Connection.findQuotaFromDataCenter(dataCenterId: String, quotaId: String): Quota =
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).get().send().quota()
private fun Connection.srvQuotaClusterLimitsFromDataCenter(dataCenterId: String, quotaId: String): QuotaClusterLimitsService =
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).quotaClusterLimitsService()
fun Connection.findAllQuotaClusterLimitsFromDataCenter(dataCenterId: String, quotaId: String): List<QuotaClusterLimit> =
	this.srvQuotaClusterLimitsFromDataCenter(dataCenterId, quotaId).list().send().limits()
private fun Connection.srvQuotaStorageLimitsFromDataCenter(dataCenterId: String, quotaId: String): QuotaStorageLimitsService =
	this.srvQuotaFromDataCenter(dataCenterId, quotaId).quotaStorageLimitsService()
fun Connection.findAllQuotaStorageLimitsFromDataCenter(dataCenterId: String, quotaId: String): List<QuotaStorageLimit> =
	this.srvQuotaStorageLimitsFromDataCenter(dataCenterId, quotaId).list().send().limits()
//endregion

//region: StorageDomain
private fun Connection.srvStorageDomains(): StorageDomainsService =
	this.systemService.storageDomainsService()
fun Connection.findAllStorageDomains(searchQuery: String = ""): List<StorageDomain> =
	if (searchQuery == "")	srvStorageDomains().list().search(searchQuery).send().storageDomains()
	else 					srvStorageDomains().list().send().storageDomains()
private fun Connection.srvStorageDomain(storageId: String): StorageDomainService =
	this.srvStorageDomains().storageDomainService(storageId)
fun Connection.findStorageDomain(storageId: String): StorageDomain =
	this.srvStorageDomain(storageId).get().send().storageDomain()
fun Connection.removeStorageDomain(storageId: String, format: Boolean): Boolean = try {
	srvStorageDomain(storageId).remove().destroy(true).format(format)
	true
} catch (e: Error) {
	log.error(e.localizedMessage)

	false
}
fun Connection.updateStorageDomain(storageId: String, storageDomain: StorageDomain): Boolean = try {
	this.srvStorageDomain(storageId).update().storageDomain(storageDomain).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)

	false
}
fun Connection.addStorageDomain(storageDomain: StorageDomain): StorageDomain? = try {
	this.srvStorageDomains().add().storageDomain(storageDomain).send().storageDomain()
} catch (e: Error) {
	log.error(e.localizedMessage)

	null
}
private fun Connection.srvAllFilesFromStorageDomain(storageId: String): FilesService =
	this.srvStorageDomain(storageId).filesService()
fun Connection.findAllFilesFromStorageDomain(storageId: String): List<File> = try {
	this.srvAllFilesFromStorageDomain(storageId).list().send().file()
} catch (e: Error) {
	log.error(e.localizedMessage)
	listOf()
}
private fun Connection.srvFileFromStorageDomain(storageId: String, fileId: String): FileService =
	this.srvAllFilesFromStorageDomain(storageId).fileService(fileId)
fun Connection.findFileFromStorageDomain(storageId: String, fileId: String): File =
	this.srvFileFromStorageDomain(storageId, fileId).get().send().file()
private fun Connection.srvDisksFromStorageDomain(storageId: String): StorageDomainDisksService =
	this.srvStorageDomain(storageId).disksService()
fun Connection.findAllDisksFromStorageDomain(storageId: String): List<Disk> =
	this.srvDisksFromStorageDomain(storageId).list().send().disks()
private fun Connection.srvAllDiskSnapshotsFromStorageDomain(storageId: String): DiskSnapshotsService =
	this.srvStorageDomain(storageId).diskSnapshotsService()
fun Connection.findAllDiskSnapshotsFromStorageDomain(storageId: String): List<DiskSnapshot> =
	this.srvAllDiskSnapshotsFromStorageDomain(storageId).list().send().snapshots()
private fun Connection.srvTemplatesFromStorageDomain(storageId: String): StorageDomainTemplatesService =
	this.srvStorageDomain(storageId).templatesService()
fun Connection.findAllTemplatesFromStorageDomain(storageId: String): List<Template> =
	this.srvTemplatesFromStorageDomain(storageId).list().send().templates()
//endregion

//region: CPUProfile
private fun Connection.srvCpuProfiles(): CpuProfilesService = systemService.cpuProfilesService()
fun Connection.findAllCpuProfiles(): List<CpuProfile> =
	this.srvCpuProfiles().list().send().profile()
//endregion

//region: DiskProfile
private fun Connection.srvDiskProfiles(): DiskProfilesService =
	systemService.diskProfilesService()
fun Connection.findAllDiskProfiles(): List<DiskProfile> =
	this.srvDiskProfiles().list().send().profile()

private fun Connection.srvDiskProfile(diskProfileId: String): DiskProfileService =
	this.srvDiskProfiles().diskProfileService(diskProfileId)
fun Connection.findDiskProfile(diskProfileId: String): DiskProfile =
	this.srvDiskProfile(diskProfileId).get().send().profile()
//endregion

//region: Disk
private fun Connection.srvAllDisks(): DisksService = systemService.disksService()
private fun Connection.srvDisk(diskId: String): DiskService = srvAllDisks().diskService(diskId)

fun Connection.findAllDisks(searchQuery: String = ""): List<Disk> {
	return if (searchQuery == "")	this.srvAllDisks().list().send().disks()
	else							this.srvAllDisks().list().search(searchQuery).caseSensitive(false).send().disks()
}
fun Connection.addDisk(disk: Disk): Disk? = try {
	this.srvAllDisks().add().disk(disk).send().disk()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.moveDisk(diskId: String, storageDomain: StorageDomain): Boolean = try {
	this.srvDisk(diskId).move().storageDomain(storageDomain).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
fun Connection.copyDisk(diskId: String, disk: Disk, storageDomain: StorageDomain): Boolean = try {
	this.srvDisk(diskId).copy().disk(disk).storageDomain(storageDomain).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
fun Connection.findDisk(diskId: String): Disk =
	this.srvDisk(diskId).get().send().disk()
fun Connection.removeDisk(diskId: String): Boolean = try {
	this.srvDisk(diskId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
//endregion

//region: VnicProfile
private fun Connection.srvVnicProfiles(): VnicProfilesService = this.systemService.vnicProfilesService()
fun Connection.findAllVnicProfiles(): List<VnicProfile> =
	this.srvVnicProfiles().list().send().profiles()
private fun Connection.srvVnicProfile(vnicProfileId: String): VnicProfileService =
	this.srvVnicProfiles().profileService(vnicProfileId)
fun Connection.findVnicProfile(vnicProfileId: String): VnicProfile? = try {
	this.srvVnicProfile(vnicProfileId).get().send().profile()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
//endregion

//region: Network
private fun Connection.srvNetworks(): NetworksService = this.systemService.networksService()
private fun Connection.srvNetwork(networkId: String): NetworkService = this.srvNetworks().networkService(networkId)
private fun Connection.srvNetworkLabelsFromNetwork(networkId: String): NetworkLabelsService =
	this.srvNetwork(networkId).networkLabelsService()

fun Connection.findAllNetworks(): List<Network> =
	this.srvNetworks().list().send().networks()
fun Connection.findNetwork(networkId: String): Network? = try {
	this.srvNetwork(networkId).get().send().network()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.addNetwork(network: Network): Network? = try {
	this.srvNetworks().add().network(network).send().network()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.updateNetwork(networkId: String, network: Network): Network? = try {
	this.srvNetwork(networkId).update().network(network).send().network()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.removeNetwork(networkId: String): Boolean = try {
	this.srvNetwork(networkId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
fun Connection.findAllNetworkLabelsFromNetwork(networkId: String): List<NetworkLabel> = try {
	this.srvNetworkLabelsFromNetwork(networkId).list().send().labels()
} catch (e: Error) {
	log.error(e.localizedMessage)
	listOf()
}

fun Connection.addNetworkLabelFromNetwork(networkId: String, networkLabel: NetworkLabel): NetworkLabel? = try {
	this.srvNetworkLabelsFromNetwork(networkId).add().label(networkLabel).send().label()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

private fun Connection.srvNetworkLabelFromNetwork(networkId: String, networkLabelId: String): NetworkLabelService =
	this.srvNetworkLabelsFromNetwork(networkId).labelService(networkLabelId)
fun Connection.removeNetworkLabelFromNetwork(networkId: String, networkLabelId: String): Boolean = try {
	this.srvNetworkLabelFromNetwork(networkId, networkLabelId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
private fun Connection.srvVnicProfilesFromNetwork(networkId: String): AssignedVnicProfilesService =
	this.srvNetwork(networkId).vnicProfilesService()
fun Connection.findAllVnicProfilesFromNetwork(networkId: String): List<VnicProfile>
		= this.srvVnicProfilesFromNetwork(networkId).list().send().profiles()

//endregion

//region: OpenStackNetworkProvider
private fun Connection.srvOpenStackNetworkProviders(): OpenstackNetworkProvidersService = systemService.openstackNetworkProvidersService()
fun Connection.findAllOpenStackNetworkProviders(): List<OpenStackNetworkProvider> =
	this.srvOpenStackNetworkProviders().list().send().providers()
private fun Connection.srvOpenStackNetworkProvider(networkProviderId: String): OpenstackNetworkProviderService =
	this.srvOpenStackNetworkProviders().providerService(networkProviderId)
fun Connection.findOpenStackNetworkProvider(networkProviderId: String): OpenStackNetworkProvider =
	this.srvOpenStackNetworkProvider(networkProviderId).get().send().provider()
//endregion

//region: OpenStackImageProvider
private fun Connection.srvOpenStackImageProviders(): OpenstackImageProvidersService
		= systemService.openstackImageProvidersService()
fun Connection.findAllOpenStackImageProviders(): List<OpenStackImageProvider>
		= this.srvOpenStackImageProviders().list().send().providers()
private fun Connection.srvOpenStackImageProvider(openStackImageProviderId: String): OpenstackImageProviderService
		= this.srvOpenStackImageProviders().providerService(openStackImageProviderId)
fun Connection.findOpenStackImageProvider(openStackImageProviderId: String): OpenStackImageProvider? = try {
	this.srvOpenStackImageProvider(openStackImageProviderId).get().send().provider()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
//endregion

//region: OpenStackVolumeProvider
private fun Connection.srvOpenStackVolumeProviders(): OpenstackVolumeProvidersService = this.systemService.openstackVolumeProvidersService()
private fun Connection.srvOpenStackVolumeProvider(openStackVolumeProviderId: String): OpenstackVolumeProviderService = this.srvOpenStackVolumeProviders().providerService(openStackVolumeProviderId)

fun Connection.findAllOpenStackVolumeProviders(): List<OpenStackVolumeProvider> =
	this.srvOpenStackVolumeProviders().list().send().providers()
fun Connection.findOpenStackVolumeProvider(openStackVolumeProviderId: String): OpenStackVolumeProvider =
	this.srvOpenStackVolumeProvider(openStackVolumeProviderId).get().send().provider()
//endregion

//region: ExternalHostProvider
private fun Connection.srvExternalHostProviders(): ExternalHostProvidersService = systemService.externalHostProvidersService()
private fun Connection.srvExternalHostProvider(externalHostProviderId: String): ExternalHostProviderService = this.srvExternalHostProviders().providerService(externalHostProviderId)

fun Connection.findAllExternalHostProviders(): List<ExternalHostProvider> =
	this.srvExternalHostProviders().list().send().providers()
fun Connection.findExternalHostProvider(externalHostProviderId: String): ExternalHostProvider =
	this.srvExternalHostProvider(externalHostProviderId).get().send().provider()
//endregion

//region Template
private fun Connection.srvTemplates(): TemplatesService = systemService().templatesService()
private fun Connection.srvTemplate(templateId: String): TemplateService = systemService.templatesService().templateService(templateId)

fun Connection.findAllTemplates(searchQuery: String = ""): List<Template> {
	return if (searchQuery.isEmpty())	this.srvTemplates().list().send().templates()
	else								this.srvTemplates().list().search(searchQuery).send().templates()
}
fun Connection.findTemplate(templateId: String): Template =
	this.srvTemplate(templateId).get().send().template()
fun Connection.removeTemplate(templateId: String): Boolean = try {
	this.srvTemplate(templateId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
fun Connection.exportTemplate(templateId: String, exclusive: Boolean, toStorageDomain: StorageDomain): Boolean = try {
	this.srvTemplate(templateId).export()
		.exclusive(exclusive)
		.storageDomain(toStorageDomain)
		.send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.addTemplate(template: Template, clonePermissions: Boolean = false, seal: Boolean = false): Template? = try {
	this.srvTemplates().add().template(template)
		.clonePermissions(clonePermissions)
		.seal(seal)
		.send().template()
} catch (e: Error) {
	log.error(e.localizedMessage)

	null
}
private fun Connection.srvWatchdogsFromTemplate(templateId: String): TemplateWatchdogsService = this.srvTemplate(templateId).watchdogsService()
fun Connection.findAllWatchdogsFromTemplate(templateId: String): List<Watchdog> =
	this.srvWatchdogsFromTemplate(templateId).list().send().watchdogs()
private fun Connection.srvCdromsFromTemplate(templateId: String): TemplateCdromsService = this.srvTemplate(templateId).cdromsService()
fun Connection.findAllCdromsFromTemplate(templateId: String): List<Cdrom> =
	this.srvCdromsFromTemplate(templateId).list().send().cdroms()
private fun Connection.srvDiskAttachmentsFromTemplate(templateId: String): TemplateDiskAttachmentsService = this.srvTemplate(templateId).diskAttachmentsService()
fun Connection.findAllDiskAttachmentsFromTemplate(templateId: String): List<DiskAttachment> =
	this.srvDiskAttachmentsFromTemplate(templateId).list().send().attachments()

private fun Connection.srvNicsFromTemplate(templateId: String): TemplateNicsService =
	this.srvTemplate(templateId).nicsService()
fun Connection.findAllNicsFromTemplate(templateId: String): List<Nic> =
	this.srvNicsFromTemplate(templateId).list().send().nics()
//endregion

//region: OperatingSystemInfo
private fun Connection.srvOperatingSystems(): OperatingSystemsService = systemService.operatingSystemsService()
fun Connection.findAllOperatingSystems(): List<OperatingSystemInfo> =
	this.srvOperatingSystems().list().send().operatingSystem()
//endregion




//region: InstanceType
private fun Connection.srvInstanceTypes(): InstanceTypesService = systemService.instanceTypesService()
private fun Connection.srvInstanceType(instanceTypeId: String): InstanceTypeService = this.srvInstanceTypes().instanceTypeService(instanceTypeId)

fun Connection.findAllInstanceTypes(): List<InstanceType> =
	srvInstanceTypes().list().send().instanceType()
fun Connection.findInstanceType(instanceTypeId: String): InstanceType =
	this.srvInstanceType(instanceTypeId).get().send().instanceType()
private fun Connection.srvNicsFromInstanceType(instanceTypeId: String): InstanceTypeNicsService =
	this.srvInstanceType(instanceTypeId).nicsService()
fun Connection.addNicForInstanceType(instanceTypeId: String, nic: Nic): Boolean = try {
	this.srvNicsFromInstanceType(instanceTypeId).add().nic(nic).send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}

fun Connection.addInstanceType(instanceType: InstanceType): InstanceType? = try {
	this.srvInstanceTypes().add().instanceType(instanceType).send().instanceType()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

fun Connection.updateInstanceType(instanceType: InstanceType): InstanceType? = try {
	this.srvInstanceType(instanceType.id()).update().send().instanceType()
} catch (e: Error) {
	log.error(e.localizedMessage)

	null
}
fun Connection.removeInstanceType(instanceTypeId: String): Boolean = try {
	this.srvInstanceType(instanceTypeId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)

	false
}
//endregion


//region: MacPool
private fun Connection.srvMacPools(): MacPoolsService = systemService.macPoolsService()
fun Connection.findAllMacPools(): List<MacPool> =
	this.srvMacPools().list().send().pools()
//endregion

//region: Event
private fun Connection.srvEvents(): EventsService = systemService.eventsService()
fun Connection.findAllEvents(searchQuery: String = ""): List<Event> =
	if (searchQuery == "")	this.srvEvents().list().send().events()
	else 					this.srvEvents().list().search(searchQuery).caseSensitive(false).send().events()
private fun Connection.srvEvent(eventId: String): EventService =
	this.srvEvents().eventService(eventId)
fun Connection.findEvent(eventId: String): Event =
	this.srvEvent(eventId).get().send().event()
//endregion

//region: SystemPermissions
private fun Connection.srvSystemPermissions(): SystemPermissionsService = systemService.permissionsService()
fun Connection.findAllPermissions(): List<Permission> =
	this.srvSystemPermissions().list().send().permissions()
fun Connection.addPermission(permission: Permission): Permission? = try {
	this.srvSystemPermissions().add().permission(permission).send().permission()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}
fun Connection.srvSystemPermission(permissionId: String): PermissionService = this.srvSystemPermissions().permissionService(permissionId)
fun Connection.removePermission(permissionId: String): Boolean = try {
	this.srvSystemPermission(permissionId).remove().send()
	true
} catch (e: Error) {
	log.error(e.localizedMessage)
	false
}
//endregion

//region: User
private fun Connection.srvUsers(): UsersService = systemService().usersService()
private fun Connection.srvUser(userId: String): UserService = this.srvUsers().userService(userId)

fun Connection.findAllUsers(): List<User> = this.srvUsers().list().send().users()
fun Connection.findUser(userId: String): User = this.srvUser(userId).get().send().user()
fun Connection.addUser(user: User): User? = try {
	this.srvUsers().add().user(user).send().user()
} catch (e: Error) {
	log.error(e.localizedMessage)
	null
}

//endregion

//region: Group
private fun Connection.srvGroups(): GroupsService = this.systemService.groupsService()
private fun Connection.srvGroup(groupId: String): GroupService = this.srvGroups().groupService(groupId)

fun Connection.findAllGroups(): List<Group> =
	this.srvGroups().list().send().groups()
fun Connection.findGroup(groupId: String): Group =
	this.srvGroup(groupId).get().send().get()
//endregion

//region: Role
private fun Connection.srvRoles(): RolesService = this.systemService.rolesService()
private fun Connection.srvRole(roleId: String): RoleService = this.srvRoles().roleService(roleId)

fun Connection.findAllRoles(): List<Role> =
	srvRoles().list().send().roles()
fun Connection.findRole(roleId: String): Role =
	this.srvRole(roleId).get().send().role()
//endregion