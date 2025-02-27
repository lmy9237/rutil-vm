package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import org.slf4j.LoggerFactory

import java.io.Serializable

private val log = LoggerFactory.getLogger(HostNetworkVo::class.java)

class HostNetworkVo (
	val bonds: List<HostNicVo> = listOf(),
	val networkAttachments: List<NetworkAttachmentVo> = listOf(),
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
		private var bBonds: List<HostNicVo> = listOf(); fun bonds(block: () -> List<HostNicVo>?) { bBonds = block() ?: listOf() }
		private var bNetworkAttachments: List<NetworkAttachmentVo> = listOf(); fun networkAttachments(block: () -> List<NetworkAttachmentVo>?) { bNetworkAttachments = block() ?: listOf() }

        fun build(): HostNetworkVo = HostNetworkVo(bBonds, bNetworkAttachments )
    }

    companion object {
        inline fun builder(block: HostNetworkVo.Builder.() -> Unit): HostNetworkVo = HostNetworkVo.Builder().apply(block).build()
    }
}

