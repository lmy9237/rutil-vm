package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.api.ovirt.business.ImageTransferPhaseB
import com.itinfo.rutilvm.api.ovirt.business.ImageTransferType
import com.itinfo.rutilvm.api.ovirt.business.TimeoutPolicyType
import com.itinfo.rutilvm.api.ovirt.business.VolumeFormat
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import java.io.Serializable
import java.math.BigInteger

/**
 * [ImageTransferVo]
 * 디스크 업로드에 쓰이는 image 이송 객체
 *
 * @author 이찬희
 */
class ImageTransferVo(
	val id: String? = "",
	var active: Boolean? = false,
	val shallow: Boolean? = false,
	val direction: ImageTransferType? = ImageTransferType.upload,
	val format: VolumeFormat? = VolumeFormat.raw, // raw 또는 cow
	val inactivityTimeout: Int? =  60,
	val phase: ImageTransferPhaseB? = ImageTransferPhaseB.paused_system,
	val timeoutPolicy: TimeoutPolicyType? = TimeoutPolicyType.legacy,
	val proxyUrl: String? = "",
	val transferUrl: String? = "",
	val transferred: BigInteger? = BigInteger.ZERO,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bActive: Boolean? = false;fun active(block: () -> Boolean?) { bActive = block() ?: false }
		private var bShallow: Boolean? = false;fun shallow(block: () -> Boolean?) { bShallow = block() ?: false }
		private var bDirection: ImageTransferType? = ImageTransferType.upload;fun direction(block: () -> ImageTransferType?) { bDirection = block() ?: ImageTransferType.upload }
		private var bFormat: VolumeFormat? = VolumeFormat.raw;fun format(block: () -> VolumeFormat?) { bFormat = block() ?: VolumeFormat.raw }
		private var bInactivityTimeout: Int? = 60;fun inactivityTimeout(block: () -> Int?) { bInactivityTimeout = block() ?: 60 }
		private var bPhase: ImageTransferPhaseB? = ImageTransferPhaseB.paused_system;fun phase(block: () -> ImageTransferPhaseB?) { bPhase = block() ?: ImageTransferPhaseB.paused_system }
		private var bTimeoutPolicy: TimeoutPolicyType? = TimeoutPolicyType.legacy;fun timeoutPolicy(block: () -> TimeoutPolicyType?) { bTimeoutPolicy = block() ?: TimeoutPolicyType.legacy }
		private var bProxyUrl: String? = "";fun proxyUrl(block: () -> String?) { bProxyUrl = block() ?: "" }
		private var bTransferUrl: String? = "";fun transferUrl(block: () -> String?) { bTransferUrl = block() ?: "" }
		private var bTransferred: BigInteger? = BigInteger.ZERO;fun transferred(block: () -> BigInteger?) { bTransferred = block() ?: BigInteger.ZERO }
		fun build(): ImageTransferVo = ImageTransferVo(bId, bActive, bShallow, bDirection, bFormat, bInactivityTimeout, bPhase, bTimeoutPolicy, bProxyUrl, bTransferUrl, bTransferred)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): ImageTransferVo = Builder().apply(block).build()
	}
}
