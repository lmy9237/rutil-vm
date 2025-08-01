package com.itinfo.rutilvm.api.model

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(IdentifiedVo::class.java)

/**
 * [IdentifiedVo]
 * 단순 id, name을 출력하기 위해 있음
 *
 * @property id [String]
 * @property name [String]
 */
open class IdentifiedVo(
	val id: String = "",
	val name: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		fun build(): IdentifiedVo = IdentifiedVo(bId, bName)
	}

	companion object {
		inline fun builder(block: IdentifiedVo.Builder.() -> Unit): IdentifiedVo = IdentifiedVo.Builder().apply(block).build()
	}
}


fun DataCenter.fromDataCenterToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { name() }
}
fun List<DataCenter>.fromDataCentersToIdentifiedVos(): List<IdentifiedVo> =
	this@fromDataCentersToIdentifiedVos.map { it.fromDataCenterToIdentifiedVo() }

fun Cluster.fromClusterToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Cluster>.toIdentifiedVosFromClusters(): List<IdentifiedVo> =
	this@toIdentifiedVosFromClusters.map { it.fromClusterToIdentifiedVo() }

fun Host.fromHostToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Host>.fromHostsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromHostsToIdentifiedVos.map { it.fromHostToIdentifiedVo() }

fun Vm.toIdentifiedVoFromVm(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Vm>.fromVmsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromVmsToIdentifiedVos.map { it.toIdentifiedVoFromVm() }

fun Snapshot.fromSnapshotToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (descriptionPresent()) description() else "" }
}
fun List<Snapshot>.fromSnapshotsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromSnapshotsToIdentifiedVos.map { it.fromSnapshotToIdentifiedVo() }

fun Template.fromTemplateToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Template>.fromTemplatesToIdentifiedVos(): List<IdentifiedVo> =
	this@fromTemplatesToIdentifiedVos.map { it.fromTemplateToIdentifiedVo() }

fun Network.fromNetworkToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Network>.fromNetworksToIdentifiedVos(): List<IdentifiedVo> =
	this@fromNetworksToIdentifiedVos.map { it.fromNetworkToIdentifiedVo() }

fun NetworkFilter.fromNetworkFilterToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<NetworkFilter>.fromNetworkFiltersToIdentifiedVos(): List<IdentifiedVo> =
	this@fromNetworkFiltersToIdentifiedVos.map { it.fromNetworkFilterToIdentifiedVo() }

fun Nic.fromNicToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Nic>.fromNicsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromNicsToIdentifiedVos.map { it.fromNicToIdentifiedVo() }

fun HostNic.fromHostNicToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<HostNic>.fromHostNicsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromHostNicsToIdentifiedVos.map { it.fromHostNicToIdentifiedVo() }

fun IscsiDetails.fromIscsiDetailToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { storageDomainId() }
	name { if (usernamePresent()) username() else "" }
}
fun List<IscsiDetails>.fromIscsiDetailsToIdentifiedVos(): List<IdentifiedVo> =
	this.map { it.fromIscsiDetailToIdentifiedVo() }

fun VnicProfile.fromVnicProfileToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<VnicProfile>.fromVnicProfilesToIdentifiedVos(): List<IdentifiedVo> =
	this@fromVnicProfilesToIdentifiedVos.map { it.fromVnicProfileToIdentifiedVo() }

fun OpenStackNetworkProvider.toIdentifiedVoFromOpenStackNetworkProvider() = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}

fun List<OpenStackNetworkProvider>.toIdentifiedVosFromOpenStackNetworkProviders(): List<IdentifiedVo> =
	this@toIdentifiedVosFromOpenStackNetworkProviders.map { it.toIdentifiedVoFromOpenStackNetworkProvider() }

fun CpuProfile.fromCpuProfileToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<CpuProfile>.fromCpuProfilesToIdentifiedVos(): List<IdentifiedVo> =
	this@fromCpuProfilesToIdentifiedVos.map { it.fromCpuProfileToIdentifiedVo() }


fun StorageDomain.toIdentifiedVoFromStorageDomain(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<StorageDomain>.fromStorageDomainsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromStorageDomainsToIdentifiedVos.map { it.toIdentifiedVoFromStorageDomain() }

fun Disk.fromDiskToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Disk>.fromDisksToIdentifiedVos(): List<IdentifiedVo> =
	this@fromDisksToIdentifiedVos.map { it.fromDiskToIdentifiedVo() }

fun DiskAttachment.fromDiskAttachmentToIdentifiedVo(): IdentifiedVo {
	// val disk: Disk? = conn.findDisk(this@fromDiskAttachmentToIdentifiedVo.disk().id()).getOrNull()
	return IdentifiedVo.builder {
		id { id() }
		name { disk().alias() }
	}
}
fun List<DiskAttachment>.fromDiskAttachmentsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromDiskAttachmentsToIdentifiedVos.map { it.fromDiskAttachmentToIdentifiedVo() }

fun DiskProfile.toIdentifiedVoFromDiskProfile(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<DiskProfile>.fromDiskProfilesToIdentifiedVos(): List<IdentifiedVo> =
	this@fromDiskProfilesToIdentifiedVos.map { it.toIdentifiedVoFromDiskProfile() }


fun Domain.fromDomainToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { this@fromDomainToIdentifiedVo.id() }
	name { this@fromDomainToIdentifiedVo.name() }
}
fun List<Domain>.fromDomainsToIdentifiedVo(): List<IdentifiedVo> =
	this@fromDomainsToIdentifiedVo.map { it.fromDomainToIdentifiedVo() }
fun AffinityGroup.toIdentifiedVoFromAffinityGroup(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<AffinityGroup>.toIdentifiedVosFromAffinityGroups(): List<IdentifiedVo> =
	this@toIdentifiedVosFromAffinityGroups.map { it.toIdentifiedVoFromAffinityGroup() }

fun AffinityLabel.fromAffinityLabelToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<AffinityLabel>.fromAffinityLabelsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromAffinityLabelsToIdentifiedVos.map { it.fromAffinityLabelToIdentifiedVo() }

fun Application.toIdentifiedVoFromApplication(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Application>.toIdentifiedVosFromApplications(): List<IdentifiedVo> =
	this@toIdentifiedVosFromApplications.map { it.toIdentifiedVoFromApplication() }

fun Cdrom?.toIdentifiedVoFromCdrom(): IdentifiedVo = IdentifiedVo.builder {
	id { this@toIdentifiedVoFromCdrom?.file()?.id() }
	name { "" }
}
fun Vm.toIdentifiedVoFromVmCdrom(cdromFileId: String): IdentifiedVo? {
	val file = cdroms().firstOrNull()?.takeIf { it.filePresent() }?.file()?.id()
	return if (cdromFileId == file) toIdentifiedVoFromVm() else null
}
fun List<Vm>.toIdentifiedVosFromVmCdroms(cdromFileId: String): List<IdentifiedVo> =
	this.mapNotNull { it.toIdentifiedVoFromVmCdrom(cdromFileId) }

fun Template.fromTemplateCdromToIdentifiedVo(diskId: String): IdentifiedVo? {
	val file = cdroms().firstOrNull()?.takeIf { it.filePresent() }?.file()?.id()
	return if (diskId == file) fromTemplateToIdentifiedVo() else null
}
fun List<Template>.fromTemplateCdromsToIdentifiedVos(diskId: String): List<IdentifiedVo> =
	this.mapNotNull { it.fromTemplateCdromToIdentifiedVo(diskId) }

