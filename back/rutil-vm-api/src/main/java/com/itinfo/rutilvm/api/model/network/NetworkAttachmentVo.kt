package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
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
 * @property ipAddressAssignments List[IpAddressAssignmentVo]
 * @property hostVo [IdentifiedVo]
 * @property hostNicVo [IdentifiedVo]
 * @property networkVo [IdentifiedVo]
 */
class NetworkAttachmentVo (
    val id: String = "",
    val inSync : Boolean = false,
    val ipAddressAssignments: List<IpAddressAssignmentVo>,
    val hostVo: IdentifiedVo = IdentifiedVo(),
    val hostNicVo: IdentifiedVo = IdentifiedVo(),
    val networkVo: IdentifiedVo = IdentifiedVo(),
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

        fun build(): NetworkAttachmentVo = NetworkAttachmentVo(bId, bInSync, bIpAddressAssignments, bHostVo, bHostNicVo, bNetworkVo)
    }

    companion object {
        inline fun builder(block: NetworkAttachmentVo.Builder.() -> Unit): NetworkAttachmentVo = NetworkAttachmentVo.Builder().apply(block).build()
    }
}


/**
 * 호스트 네트워크 modified_network_attachments
 * host_nic 빌더
 */
fun NetworkAttachmentVo.toModifiedNetworkAttachmentBuilder(): NetworkAttachmentBuilder {
    return NetworkAttachmentBuilder()
        .network(NetworkBuilder().id(this@toModifiedNetworkAttachmentBuilder.networkVo.id).build())
        .hostNic(HostNicBuilder().name(this@toModifiedNetworkAttachmentBuilder.hostNicVo.name).build())
        .ipAddressAssignments(this@toModifiedNetworkAttachmentBuilder.ipAddressAssignments.toIpAddressAssignments())
//        .dnsResolverConfiguration()
}

fun NetworkAttachmentVo.toModifiedNetworkAttachment(): NetworkAttachment =
    this@toModifiedNetworkAttachment.toModifiedNetworkAttachmentBuilder().build()


// 여러개
fun List<NetworkAttachmentVo>.toModifiedNetworkAttachments(): List<NetworkAttachment> =
    this@toModifiedNetworkAttachments.map { it.toModifiedNetworkAttachment() }


