package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findDataCenter
import com.itinfo.rutilvm.util.ovirt.findNetwork
import com.itinfo.rutilvm.util.ovirt.findNetworkFilter
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkFilter
import org.ovirt.engine.sdk4.types.VnicPassThroughMode
import org.ovirt.engine.sdk4.types.VnicProfile
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(VnicCreateVo::class.java)
*/
/**
 * [VnicCreateVo]
 * 
 * 네트워크-vnicprofile, 새로만들기
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * // @property nfVo [NetworkFilterVo]
 * @property networkFilterName [String]
 * @property passThrough [VnicPassThroughMode] 
 * @property migration [Boolean] 
 * @property portMirror [Boolean] 
 *
 * 사용자 정의 속성
 * @property dcId [String]
 * @property dcName [String]
 * @property networkId [String]
 * @property networkName [String]
 *//*

@Deprecated("사용안함")
class VnicCreateVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
    // val nfVo: NetworkFilterVo,
	val networkFilterName: String = "",
	val passThrough: VnicPassThroughMode = VnicPassThroughMode.DISABLED,
	val migration: Boolean = false,
	val portMirror: Boolean = false,
	val dcId: String = "",
	val dcName: String = "",
	val networkId: String = "",
	val networkName: String = "",
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
    	private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		// private var bNfVo: NetworkFilterVo;fun nfVo(block: () -> NetworkFilterVo?) { bNfVo = block() ?: "" }
		private var bNetworkFilterName: String = "";fun networkFilterName(block: () -> String?) { bNetworkFilterName = block() ?: "" }
		private var bPassThrough: VnicPassThroughMode = VnicPassThroughMode.DISABLED;fun passThrough(block: () -> VnicPassThroughMode?) { bPassThrough = block() ?: VnicPassThroughMode.DISABLED }
		private var bMigration: Boolean = false;fun migration(block: () -> Boolean?) { bMigration = block() ?: false }
		private var bPortMirror: Boolean = false;fun portMirror(block: () -> Boolean?) { bPortMirror = block() ?: false }
		private var bDcId: String = "";fun dcId(block: () -> String?) { bDcId = block() ?: "" }
		private var bDcName: String = "";fun dcName(block: () -> String?) { bDcName = block() ?: "" }
		private var bNetworkId: String = "";fun networkId(block: () -> String?) { bNetworkId = block() ?: "" }
		private var bNetworkName: String = "";fun networkName(block: () -> String?) { bNetworkName = block() ?: "" }
		fun build(): VnicCreateVo = VnicCreateVo(bId, bName, bDescription,*/
/* bNfVo,*//*
 bNetworkFilterName, bPassThrough, bMigration, bPortMirror, bDcId, bDcName, bNetworkId, bNetworkName)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): VnicCreateVo =
			Builder().apply(block).build()
	}
}

fun Network.toVnicCreateVo(conn: Connection): VnicCreateVo {
	val dc: DataCenter? =
		conn.findDataCenter(this@toVnicCreateVo.dataCenter().id())
			.getOrNull()
	return VnicCreateVo.builder {
		dcId { dc?.id() }
		dcName { dc?.name() }
		networkId { this@toVnicCreateVo.id() }
		networkName { this@toVnicCreateVo.name() }
//		nfVo(NetworkFilterVo.builder().build())
		// 프론트에서 네트워크 기본값 지정
		migration { true }
	}
}

fun VnicProfile.toVnicCreateVo(conn: Connection, vcId: String): VnicCreateVo {
	val	network: Network =
		conn.findNetwork(this@toVnicCreateVo.network().id())
			.getOrNull() ?: return VnicCreateVo.builder {
			networkId { this@toVnicCreateVo.network().id() }
			name { this@toVnicCreateVo.name() }
			description { this@toVnicCreateVo.description() }
			passThrough { this@toVnicCreateVo.passThrough().mode() }
			migration { !this@toVnicCreateVo.migratablePresent() || this@toVnicCreateVo.migratable() }
			portMirror { this@toVnicCreateVo.portMirroring() }
		}
	val dc: DataCenter = network.dataCenter()
	val networkFilter: NetworkFilter =
		conn.findNetworkFilter(this@toVnicCreateVo.networkFilter().id())
			.getOrNull() ?: return VnicCreateVo.builder {
			dcId { dc.id() }
			dcName { dc.name() }
			networkId { this@toVnicCreateVo.network().id() }
			networkName { network.name() }
			id { vcId }
			name { this@toVnicCreateVo.name() }
			description { this@toVnicCreateVo.description() }
			passThrough { this@toVnicCreateVo.passThrough().mode() }
			migration { !this@toVnicCreateVo.migratablePresent() || this@toVnicCreateVo.migratable() }
			portMirror { this@toVnicCreateVo.portMirroring() }
		}

	return VnicCreateVo.builder {
		dcId { dc.id() }
		dcName { dc.name() }
		networkId { this@toVnicCreateVo.network().id() }
		networkName { network.name() }
		id { vcId }
		name { this@toVnicCreateVo.name() }
		description { this@toVnicCreateVo.description() }
		passThrough { this@toVnicCreateVo.passThrough().mode() }
		migration { !this@toVnicCreateVo.migratablePresent() || this@toVnicCreateVo.migratable() }
		portMirror { this@toVnicCreateVo.portMirroring() }
		networkFilterName { networkFilter.name() }
	}
}*/
