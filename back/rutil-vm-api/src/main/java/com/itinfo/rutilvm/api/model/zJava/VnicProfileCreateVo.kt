package com.itinfo.rutilvm.api.model.zJava

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable

// private val log = LoggerFactory.getLogger(VnicProfileCreateVo::class.java)
/**
 * [VnicProfileCreateVo]
 *
 * @property datacenterId [String]
 * @property datacenterName [String]
 * @property networkId [String]
 * @property networkName [String]
 * 
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property networkFilterId [String]
 * @property networkFilterName [String]
 * 
 * @property passThrough [Boolean]
 * @property portMirroring [Boolean]
 * @property migration [Boolean]
 * @property pailOver [String]
 * 
 * @property user [String]
 * @property permission [Boolean]
 */
/*
@Deprecated("사용안함")
class VnicProfileCreateVo(
    val datacenterId: String = "",
    val datacenterName: String = "",
    val networkId: String = "",
    val networkName: String = "",
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val networkFilterId: String = "",
    val networkFilterName: String = "",
    val passThrough: Boolean = false,
    val portMirroring: Boolean = false,
    val migration: Boolean = false,
    val pailOver: String = "",
    val user: String = "",
    val permission: Boolean = false,
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
    	private var bDatacenterId: String = "";fun datacenterId(block: () -> String?) { bDatacenterId = block() ?: "" }
    	private var bDatacenterName: String = "";fun datacenterName(block: () -> String?) { bDatacenterName = block() ?: "" }
    	private var bNetworkId: String = "";fun networkId(block: () -> String?) { bNetworkId = block() ?: "" }
    	private var bNetworkName: String = "";fun networkName(block: () -> String?) { bNetworkName = block() ?: "" }
    	private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
    	private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
    	private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
    	private var bNetworkFilterId: String = "";fun networkFilterId(block: () -> String?) { bNetworkFilterId = block() ?: "" }
    	private var bNetworkFilterName: String = "";fun networkFilterName(block: () -> String?) { bNetworkFilterName = block() ?: "" }
    	private var bPassThrough: Boolean = false;fun passThrough(block: () -> Boolean?) { bPassThrough = block() ?: false }
    	private var bPortMirroring: Boolean = false;fun portMirroring(block: () -> Boolean?) { bPortMirroring = block() ?: false }
    	private var bMigration: Boolean = false;fun migration(block: () -> Boolean?) { bMigration = block() ?: false }
    	private var bPailOver: String = "";fun pailOver(block: () -> String?) { bPailOver = block() ?: "" }
    	private var bUser: String = "";fun user(block: () -> String?) { bUser = block() ?: "" }
    	private var bPermission: Boolean = false;fun permission(block: () -> Boolean?) { bPermission = block() ?: false }
		fun build(): VnicProfileCreateVo = VnicProfileCreateVo(bDatacenterId, bDatacenterName, bNetworkId, bNetworkName, bId, bName, bDescription, bNetworkFilterId, bNetworkFilterName, bPassThrough, bPortMirroring, bMigration, bPailOver, bUser, bPermission)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: VnicProfileCreateVo.Builder.() -> Unit): VnicProfileCreateVo =
			VnicProfileCreateVo.Builder().apply(block).build()
	}
}
*/