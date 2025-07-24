package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import org.slf4j.LoggerFactory

import java.io.Serializable

private val log = LoggerFactory.getLogger(HostNetworkVo::class.java)

/**
 * [HostNetworkVo]
 * 호스트 네트워크 정보
 *
 * @author 이찬희 (@chanhi2000)
 */
class HostNetworkVo (
	val bonds: List<HostNicVo> = listOf(),
	val bondsToRemove: List<HostNicVo> = listOf(),
	val networkAttachments: List<NetworkAttachmentVo> = listOf(),
	val networkAttachmentsToSync: List<NetworkAttachmentVo> = listOf(),
	val networkAttachmentsToRemove: List<NetworkAttachmentVo> = listOf(),
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
		private var bBonds: List<HostNicVo> = listOf(); fun bonds(block: () -> List<HostNicVo>?) { bBonds = block() ?: listOf() }
		private var bBondsToRemove: List<HostNicVo> = listOf(); fun bondsToRemove(block: () -> List<HostNicVo>?) { bBondsToRemove = block() ?: listOf() }
		private var bNetworkAttachments: List<NetworkAttachmentVo> = listOf(); fun networkAttachments(block: () -> List<NetworkAttachmentVo>?) { bNetworkAttachments = block() ?: listOf() }
		private var bNetworkAttachmentsToSync: List<NetworkAttachmentVo> = listOf(); fun networkAttachmentsToSync(block: () -> List<NetworkAttachmentVo>?) { bNetworkAttachmentsToSync = block() ?: listOf() }
		private var bNetworkAttachmentsToRemove: List<NetworkAttachmentVo> = listOf(); fun networkAttachmentsToRemove(block: () -> List<NetworkAttachmentVo>?) { bNetworkAttachmentsToRemove = block() ?: listOf() }
        fun build(): HostNetworkVo = HostNetworkVo(bBonds, bBondsToRemove, bNetworkAttachments, bNetworkAttachmentsToSync, bNetworkAttachmentsToRemove)
    }

    companion object {
        inline fun builder(block: Builder.() -> Unit): HostNetworkVo = Builder().apply(block).build()
    }
}

