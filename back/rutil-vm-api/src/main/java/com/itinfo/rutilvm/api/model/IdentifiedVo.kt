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
fun List<Cluster>.fromClustersToIdentifiedVos(): List<IdentifiedVo> =
	this@fromClustersToIdentifiedVos.map { it.fromClusterToIdentifiedVo() }

fun Host.fromHostToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Host>.fromHostsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromHostsToIdentifiedVos.map { it.fromHostToIdentifiedVo() }

fun Vm.fromVmToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Vm>.fromVmsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromVmsToIdentifiedVos.map { it.fromVmToIdentifiedVo() }

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


fun HostNic.fromHostNicToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<HostNic>.fromHostNicsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromHostNicsToIdentifiedVos.map { it.fromHostNicToIdentifiedVo() }


fun VnicProfile.fromVnicProfileToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<VnicProfile>.fromVnicProfilesToIdentifiedVos(): List<IdentifiedVo> =
	this@fromVnicProfilesToIdentifiedVos.map { it.fromVnicProfileToIdentifiedVo() }

fun OpenStackNetworkProvider.fromOpenStackNetworkProviderToIdentifiedVo() = IdentifiedVo.builder { 
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<OpenStackNetworkProvider>.fromOpenStackNetworkProviderToIdentifiedVos(): List<IdentifiedVo> =
	this@fromOpenStackNetworkProviderToIdentifiedVos.map { it.fromOpenStackNetworkProviderToIdentifiedVo() }

fun CpuProfile.fromCpuProfileToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<CpuProfile>.fromCpuProfilesToIdentifiedVos(): List<IdentifiedVo> =
	this@fromCpuProfilesToIdentifiedVos.map { it.fromCpuProfileToIdentifiedVo() }


fun StorageDomain.fromStorageDomainToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<StorageDomain>.fromStorageDomainsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromStorageDomainsToIdentifiedVos.map { it.fromStorageDomainToIdentifiedVo() }

fun Disk.fromDiskToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Disk>.fromDisksToIdentifiedVos(): List<IdentifiedVo> =
	this@fromDisksToIdentifiedVos.map { it.fromDiskToIdentifiedVo() }

fun DiskProfile.fromDiskProfileToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<DiskProfile>.fromDiskProfilesToIdentifiedVos(): List<IdentifiedVo> =
	this@fromDiskProfilesToIdentifiedVos.map { it.fromDiskProfileToIdentifiedVo() }


fun Domain.fromDomainToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { this@fromDomainToIdentifiedVo.id() }
	name { this@fromDomainToIdentifiedVo.name() }
}
fun List<Domain>.fromDomainsToIdentifiedVo(): List<IdentifiedVo> =
	this@fromDomainsToIdentifiedVo.map { it.fromDomainToIdentifiedVo() }




fun AffinityGroup.fromAffinityGroupToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<AffinityGroup>.fromAffinityGroupsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromAffinityGroupsToIdentifiedVos.map { it.fromAffinityGroupToIdentifiedVo() }

fun AffinityLabel.fromAffinityLabelToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<AffinityLabel>.fromAffinityLabelsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromAffinityLabelsToIdentifiedVos.map { it.fromAffinityLabelToIdentifiedVo() }

fun Application.fromApplicationToIdentifiedVo(): IdentifiedVo = IdentifiedVo.builder {
	id { id() }
	name { if (namePresent()) name() else "" }
}
fun List<Application>.fromApplicationsToIdentifiedVos(): List<IdentifiedVo> =
	this@fromApplicationsToIdentifiedVos.map { it.fromApplicationToIdentifiedVo() }
