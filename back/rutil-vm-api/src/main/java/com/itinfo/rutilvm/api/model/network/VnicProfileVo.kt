package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.api.model.computing.DataCenterVo
import com.itinfo.rutilvm.util.ovirt.*
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.builders.NetworkFilterBuilder
import org.ovirt.engine.sdk4.builders.VnicPassThroughBuilder
import org.ovirt.engine.sdk4.builders.VnicProfileBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(VnicProfileVo::class.java)
/**
 * [VnicProfileVo]
 * 네트워크 - VnicProfile
 *
 * - vnicProfile 생성
 *  생성 방법: 네트워크 생성시 같이 생성(기본으로 네트워크명과 동일한 이름으로 생성) / 네트워크-vnicProfile에서 생성(잘안씀)
 *  프로젝트에서는 네트워크-vnicProfile 은 생략예정(목록 포함)
 *
 *  vnicProfile 생성시 통과가 T면 네트워크 필터 사라지고, 마이그레이션 선택여부가 나온다 (front)
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property passThrough [VnicPassThroughMode]
 * @property migration [Boolean]
 * @property portMirroring [Boolean]
 * @property networkFilterVo [NetworkFilterVo] 네트워크 필터 값을 입력해서 넣는방식인거 같음 (참고, NetworkFilter, NetworkFilterParameter)
 * @property dataCenterVo [DataCenterVo]
 * @property networkVo [IdentifiedVo]
 */
class VnicProfileVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val passThrough: VnicPassThroughMode = VnicPassThroughMode.DISABLED,
	val migration: Boolean = false,
	val portMirroring: Boolean = false,
	val failOVer: IdentifiedVo = IdentifiedVo(),  // vnicprofile이 들어감
	val networkFilterVo: IdentifiedVo =  IdentifiedVo(),
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val networkVo: IdentifiedVo = IdentifiedVo(),
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bPassThrough: VnicPassThroughMode = VnicPassThroughMode.DISABLED;fun passThrough(block: () -> VnicPassThroughMode) { bPassThrough = block() ?: VnicPassThroughMode.DISABLED }
		private var bMigration: Boolean = false;fun migration(block: () -> Boolean?) { bMigration = block() ?: false }
		private var bPortMirroring: Boolean = false;fun portMirroring(block: () -> Boolean?) { bPortMirroring = block() ?: false }
		private var bFailOver: IdentifiedVo = IdentifiedVo();fun failOVer(block: () -> IdentifiedVo?) { bFailOver = block() ?: IdentifiedVo() }
		private var bNetworkFilterVo: IdentifiedVo = IdentifiedVo();fun networkFilterVo(block: () -> IdentifiedVo?) { bNetworkFilterVo = block() ?: IdentifiedVo() }
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bNetworkVo: IdentifiedVo = IdentifiedVo();fun networkVo(block: () -> IdentifiedVo?) { bNetworkVo = block() ?: IdentifiedVo() }

		fun build(): VnicProfileVo = VnicProfileVo(bId, bName, bDescription, bPassThrough, bMigration, bPortMirroring, bFailOver, bNetworkFilterVo, bDataCenterVo, bNetworkVo)
	}

	companion object {
		inline fun builder(block: VnicProfileVo.Builder.() -> Unit): VnicProfileVo = VnicProfileVo.Builder().apply(block).build()
	}
}

fun VnicProfile.toVnicProfileIdName(): VnicProfileVo = VnicProfileVo.builder {
	id { this@toVnicProfileIdName.id() }
	name { this@toVnicProfileIdName.name() }
}
fun List<VnicProfile>.toVnicProfilesIdName(): List<VnicProfileVo> =
	this@toVnicProfilesIdName.map { it.toVnicProfileIdName() }


fun VnicProfile.toVnicProfileToVmVo(conn: Connection): VnicProfileVo {
	val network: Network? = conn.findNetwork(this@toVnicProfileToVmVo.network().id()).getOrNull()
	return VnicProfileVo.builder {
		id { this@toVnicProfileToVmVo.id() }
		name { this@toVnicProfileToVmVo.name() }
		networkVo { network?.fromNetworkToIdentifiedVo() }
	}
}
fun List<VnicProfile>.toVnicProfileToVmVos(conn: Connection): List<VnicProfileVo> =
	this@toVnicProfileToVmVos.map { it.toVnicProfileToVmVo(conn) }


fun VnicProfile.toCVnicProfileMenu(): VnicProfileVo = VnicProfileVo.builder {
	id { this@toCVnicProfileMenu.id() }
	name { this@toCVnicProfileMenu.name() }
	passThrough { this@toCVnicProfileMenu.passThrough().mode() }
	networkVo { this@toCVnicProfileMenu.network().fromNetworkToIdentifiedVo() }
}
fun List<VnicProfile>.toCVnicProfileMenus(): List<VnicProfileVo> =
	this@toCVnicProfileMenus.map { it.toCVnicProfileMenu() }


fun VnicProfile.toVnicProfileMenu(conn: Connection): VnicProfileVo {
	val vnic = this@toVnicProfileMenu
    val networkFilter: NetworkFilter? =
		if(vnic.networkFilterPresent()) { conn.findNetworkFilter(vnic.networkFilter().id()).getOrNull() }
        else { null }

    return VnicProfileVo.builder {
        id { vnic.id() }
        name { vnic.name() }
        description { vnic.description() }
        passThrough { vnic.passThrough().mode() }
        portMirroring { vnic.portMirroring() }
        migration { if(vnic.migratablePresent()) vnic.migratable() else null }
        networkFilterVo { networkFilter?.fromNetworkFilterToIdentifiedVo() }
        dataCenterVo { vnic.network().dataCenter().fromDataCenterToIdentifiedVo() }
        networkVo { vnic.network().fromNetworkToIdentifiedVo() }
    }
}
fun List<VnicProfile>.toVnicProfileMenus(conn: Connection): List<VnicProfileVo> =
	this@toVnicProfileMenus.map { it.toVnicProfileMenu(conn) }



// region: builder
/**
 * vnicProfile 빌더
 */
fun VnicProfileVo.toVnicProfileBuilder(): VnicProfileBuilder {
	// 통과가 true 라면 마이그레이션 가능과 페일오버 vnic 기능 활성화,
	// 반대로 네트워크 필터는
	val builder = VnicProfileBuilder()
	if(passThrough == VnicPassThroughMode.ENABLED){
		builder
			.passThrough(VnicPassThroughBuilder().mode(VnicPassThroughMode.fromValue(passThrough.toString())))
			.migratable(migration)
			.failover(VnicProfileBuilder().id(failOVer.id))
	}else{
		builder
			.networkFilter(NetworkFilterBuilder().id(networkFilterVo.id))
			.portMirroring(portMirroring)
	}

	log.info("VnicProfileVo: {}", this)
	return builder
		.name(name)
		.network(NetworkBuilder().id(networkVo.id))
		.description(description)
}

/**
 * vnicProfile 생성 빌더
 */
fun VnicProfileVo.toAddVnicProfile(): VnicProfile =
	toVnicProfileBuilder().build()

/**
 * vnicProfile 편집 빌더
 */
fun VnicProfileVo.toEditVnicProfile(): VnicProfile {
	return toVnicProfileBuilder()
		.id(id)
		.build()
}


fun Nic.toVnicProfileVoFromNic(conn: Connection): VnicProfileVo {
	val vnicProfile: VnicProfile? = conn.findVnicProfile(this@toVnicProfileVoFromNic.vnicProfile().id()).getOrNull()
	val network: Network? = vnicProfile?.network()?.let { conn.findNetwork(it.id()).getOrNull() }

	return VnicProfileVo.builder {
		id { vnicProfile?.id() }
		name { vnicProfile?.name() }
		networkVo { network?.fromNetworkToIdentifiedVo() }
	}
}

/**
 * 편집 - vnic
 * @param conn
 * @return
 */
fun List<Nic>.toVnicProfileVosFromNic(conn: Connection): List<VnicProfileVo> =
	this.map { it.toVnicProfileVoFromNic(conn) }

// endregion
