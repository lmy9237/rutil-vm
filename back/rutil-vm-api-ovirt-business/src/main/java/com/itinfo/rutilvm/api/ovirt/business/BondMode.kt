package com.itinfo.rutilvm.api.ovirt.business

import com.itinfo.rutilvm.api.ovirt.business.BondMode.UNKNOWN
import com.itinfo.rutilvm.common.gson
import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [BondMode]
 * 호스트 네트워크 본드모드
 *
 */
enum class BondMode(
	override val value: Int,
	val stringValue: String,
	val description: String,
	val isValidForVmNetwork: Boolean
) : Identifiable {
	BOND0(0, "balance-rr", "Round-robin", false),
	BOND1(1, "active-backup", "Active-Backup", true),
	BOND2(2, "balance-xor", "Load balance (balance-xor)", true),
	BOND3(3, "broadcast", "Broadcast", true),
	BOND4(4, "802.3ad", "Dynamic link aggregation (802.3ad)", true),
	BOND5(5, "balance-tlb", "Adaptive transmit load balancing (balance-tlb)", false),
	BOND6(6, "balance-alb", "Adaptive load balancing (balance-alb)", false),
	UNKNOWN(-1, "", "", false);

	val descriptionFull: String
		get() = if (value != -1) "(Mode ${value}) $description" else ""

	override fun toString(): String =
		gson.toJson(this)

	fun getConfigurationValue(
		miimonValue: String=DEFAULT_MIIMON_VALUE
	): String {
		val extraOption = if (value == BOND4.value) {
			" xmit_hash_policy=$BOND_XMIT_POLICY_LAYER23"
		} else {
			" miimon=$miimonValue"
		}
		return "${MODE}${this.value} $extraOption"
	}

	companion object {
		private const val MODE: String = "mode="
		private const val DEFAULT_MIIMON_VALUE: String = "100"
		const val MODE_FOR_SEARCH = "mode"
		private const val BOND_XMIT_POLICY_LAYER23: String = "2"
		private val findMap: MutableMap<Int, BondMode> = ConcurrentHashMap<Int, BondMode>()
		init {
			values().forEach { findMap[it.value] = it }
		}

		val allBondModes: List<BondMode> = BondMode.values().filterNot {
			it == UNKNOWN
		}

		@JvmStatic fun forValue(value: Int?=-1): BondMode = findMap[value] ?: UNKNOWN
		@JvmStatic fun findMode(
			bondOptions: String
		): String? {
			val bondOptionsChars = bondOptions.toCharArray()
			val length: Int = bondOptions.length

			// Find the start index for "mode"
			var index = 0
			if (!bondOptions.startsWith(MODE_FOR_SEARCH)) {
				if ((bondOptions.indexOf(" $MODE_FOR_SEARCH").also { index = it }) == -1) {
					return null
				}
				index++ // compensate for the extra space in front of "mode"
			}

			index = index + MODE_FOR_SEARCH.length

			// find "="
			if (index >= length || bondOptionsChars[index] != '=') {
				return null
			}
			index++

			if (index == length || Character.isSpace(bondOptionsChars[index])) {
				return null
			}

			val startIndex = index
			while (index < length && !Character.isSpace(bondOptionsChars[index])) {
				index++
			}

			// GWT complains about Arrays.copyOfRange, using System.arraycopy instead
			val modeChars = CharArray(index - startIndex)
			System.arraycopy(bondOptionsChars, startIndex, modeChars, 0, index - startIndex)
			return kotlin.text.String(modeChars)
		}
	}
}

class BondModeVo(
	val value: Int? = -1,
	val stringValue: String? = "",
	val description: String? = "",
	val isValidForVmNetwork: Boolean? = true,
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bValue: Int? = -1; fun value(block: () -> Int?) { bValue = block() ?: -1 }
		private var bStringValue: String? = ""; fun stringValue(block: () -> String?) { bStringValue = block() ?: ""}
		private var bDescription: String? = ""; fun description(block: () -> String?) { bDescription = block() ?: ""}
		private var bIsValidForVmNetwork: Boolean? = true; fun isValidForVmNetwork(block: () -> Boolean?) { bIsValidForVmNetwork = block() ?: true }

		fun build(): BondModeVo = BondModeVo(bValue, bStringValue, bDescription, bIsValidForVmNetwork)
	}

	companion object{
		inline fun builder(block: Builder.() -> Unit): BondModeVo = Builder().apply(block).build()
		val allBondModes: List<BondModeVo> = BondMode.allBondModes.map { it.toBondModeVo() }
	}
}

fun BondMode.toBondModeVo() = BondModeVo.builder {
	value { this@toBondModeVo.value }
	stringValue { this@toBondModeVo.stringValue }
	description { this@toBondModeVo.description }
	isValidForVmNetwork { this@toBondModeVo.isValidForVmNetwork }
}

