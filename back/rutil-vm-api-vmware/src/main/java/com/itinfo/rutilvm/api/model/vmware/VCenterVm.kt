package com.itinfo.rutilvm.api.model.vmware

import com.google.gson.annotations.SerializedName
import com.itinfo.rutilvm.common.gson
import java.io.Serializable
import java.math.BigInteger

/**
 * [VCenterVm]
 * VMWare 용 Vm 정보
 *
 * @author 이찬희 (@chanhi2000)
 */
class VCenterVm(
	@SerializedName("memory_size_MiB") val memorySizeMiB: BigInteger? = BigInteger.ZERO,
	@SerializedName("vm") val vm: String? = "",
	@SerializedName("name") val name: String? = "",
	@SerializedName("power_state") val powerState: String? = "", /* POWERED_ON, POWERED_OFF */
	@SerializedName("cpu_count") val cpuCount: Int? = -1,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bMemorySizeMiB: BigInteger? = BigInteger.ZERO;fun memorySizeMiB(block: () -> BigInteger?) { bMemorySizeMiB = block() }
		private var bVm: String? = "";fun vm(block: () -> String?) { bVm = block() }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() }
		private var bPowerState: String? = "";fun powerState(block: () -> String?) { bPowerState = block() }
		private var bCpuCount: Int? = -1;fun cpuCount(block: () -> Int?) { bCpuCount = block() }
		fun build(): VCenterVm = VCenterVm(bMemorySizeMiB, bVm, bName, bPowerState, bCpuCount)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VCenterVm = Builder().apply(block).build()
	}
}
