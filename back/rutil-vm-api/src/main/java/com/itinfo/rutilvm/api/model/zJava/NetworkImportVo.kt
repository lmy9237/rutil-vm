/*
package com.itinfo.rutilvm.api.model.network

import com.itinfo.itcloud.gson
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.OpenStackNetworkProvider
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(NetworkImportVo::class.java)

*/
/**
 * [NetworkImportVo]
 * 
 * 공급자는 무조건 한개 ovirt-provider-ovn

 * @property id [String]  공급자 id
 * @property name [String]  공급자 name
 * @property openstackVos List<[OpenStackNetworkVo]>
 *
 * 이게 네트워크 공급자로 설정되어 있는 네트워크들의 목록가 뜨고
 * 그 네트워크 목록들을 데이터 센터에서 다 쓸수있게한다?
 *//*

@Deprecated("openStackNetworkVo 가 기능 수행")
class NetworkImportVo(
	val id: String = "",
	val name: String = "",
	val openstackVos: List<OpenStackNetworkVo> = listOf(),
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" } 
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" } 
		private var bOpenstackVos: List<OpenStackNetworkVo> = listOf();fun openstackVos(block: () -> List<OpenStackNetworkVo>?) { bOpenstackVos = block() ?: listOf() }

		fun build(): NetworkImportVo = NetworkImportVo(bId, bName, bOpenstackVos)
	}

	companion object {
		inline fun builder(block: NetworkImportVo.Builder.() -> Unit): NetworkImportVo =
			NetworkImportVo.Builder().apply(block).build()
	}
}

fun OpenStackNetworkProvider.toNetworkImportVo(conn: Connection): NetworkImportVo {
	log.debug("OpenStackNetworkProvider.toNetworkImportVo ... ")
	return NetworkImportVo.builder {
		id { this@toNetworkImportVo.id() }
		name { this@toNetworkImportVo.name() }
//		openstackVos { this@toNetworkImportVo.networks().toOpenStackVos(conn) }
	}
}*/
