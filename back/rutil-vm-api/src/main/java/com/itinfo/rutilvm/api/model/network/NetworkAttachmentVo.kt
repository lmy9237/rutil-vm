package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostNicToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromNetworkToIdentifiedVo
import org.ovirt.engine.sdk4.builders.DnsResolverConfigurationBuilder
import org.ovirt.engine.sdk4.builders.HostNicBuilder
import org.ovirt.engine.sdk4.builders.NetworkAttachmentBuilder
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.types.NetworkAttachment
import java.io.Serializable

/**
 * [NetworkAttachmentVo]
 *
 * @property id [String]
 * @property inSync [Boolean]
 * @property ipAddressAssignments List[IpAddressAssignmentVo] // ipv4, ipv6
 * @property hostVo [IdentifiedVo]
 * @property hostNicVo [IdentifiedVo]
 * @property networkVo [IdentifiedVo]
 * @property nameServerList List<[String]>
 * <dns_resolver_configuration>
 *	<name_servers><name_server>8.8.8.8</name_server></name_servers>
 * </dns_resolver_configuration>
 */
class NetworkAttachmentVo (
    val id: String = "",
    val inSync : Boolean = false,
    val ipAddressAssignments: List<IpAddressAssignmentVo>,
    val hostVo: IdentifiedVo = IdentifiedVo(),
    val hostNicVo: IdentifiedVo = IdentifiedVo(),
    val networkVo: IdentifiedVo = IdentifiedVo(),
	val nameServerList: List<String> = listOf()
    // reported_configurations
) : Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: "" }
        private var bInSync: Boolean = false; fun inSync(block: () -> Boolean?) { bInSync = block() ?: false }
        private var bIpAddressAssignments: List<IpAddressAssignmentVo> = listOf(); fun ipAddressAssignments(block: () -> List<IpAddressAssignmentVo>?) { bIpAddressAssignments = block() ?: listOf() }
        private var bHostVo: IdentifiedVo = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
        private var bHostNicVo: IdentifiedVo = IdentifiedVo(); fun hostNicVo(block: () -> IdentifiedVo?) { bHostNicVo = block() ?: IdentifiedVo() }
        private var bNetworkVo: IdentifiedVo = IdentifiedVo(); fun networkVo(block: () -> IdentifiedVo?) { bNetworkVo = block() ?: IdentifiedVo() }
		private var bNameServerList: List<String> = listOf(); fun nameServerList(block: () -> List<String>?) { bNameServerList = block() ?: listOf() }

        fun build(): NetworkAttachmentVo = NetworkAttachmentVo(bId, bInSync, bIpAddressAssignments, bHostVo, bHostNicVo, bNetworkVo, bNameServerList)
    }

    companion object {
        inline fun builder(block: NetworkAttachmentVo.Builder.() -> Unit): NetworkAttachmentVo = NetworkAttachmentVo.Builder().apply(block).build()
    }
}

fun NetworkAttachment.toNetworkAttachmentVo(): NetworkAttachmentVo {
	val nAtt = this@toNetworkAttachmentVo
	val ip =
		if(nAtt.ipAddressAssignmentsPresent()) {
			nAtt.ipAddressAssignments().map { it.toIpAddressAssignmentVo() }
		} else { emptyList() }
	val dns =
		if(nAtt.dnsResolverConfigurationPresent()){ nAtt.dnsResolverConfiguration().nameServers() }
		else { null }

	return NetworkAttachmentVo.builder {
		id { nAtt.id() }
		inSync { nAtt.inSync() }
		ipAddressAssignments { ip }
		hostVo { nAtt.host().fromHostToIdentifiedVo() }
		hostNicVo { nAtt.hostNic().fromHostNicToIdentifiedVo() }
		networkVo { nAtt.network().fromNetworkToIdentifiedVo() }
		nameServerList { dns }
	}
}
fun List<NetworkAttachment>.toNetworkAttachmentVos(): List<NetworkAttachmentVo> =
	this@toNetworkAttachmentVos.map { it.toNetworkAttachmentVo() }


/**
 * 호스트 네트워크 modified_network_attachments
 * host_nic 빌더
 */
fun NetworkAttachmentVo.toNetworkAttachmentBuilder(): NetworkAttachmentBuilder =
	NetworkAttachmentBuilder()
		.network(NetworkBuilder().id(this.networkVo.id).build())

fun NetworkAttachmentVo.toModifiedNetworkAttachment(): NetworkAttachment {
	val builder = toNetworkAttachmentBuilder()
		.hostNic(HostNicBuilder().id(this.hostNicVo.id).build())
		.ipAddressAssignments(this.ipAddressAssignments.toIpAddressAssignments())

	if (this.nameServerList != null) {
		builder.dnsResolverConfiguration(
			DnsResolverConfigurationBuilder().nameServers(this.nameServerList).build()
		)
	}
	return builder.build()
}

// 여러개
fun List<NetworkAttachmentVo>.toModifiedNetworkAttachments(): List<NetworkAttachment> =
    this@toModifiedNetworkAttachments.map { it.toModifiedNetworkAttachment() }

