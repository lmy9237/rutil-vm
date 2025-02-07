package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.model.computing.DataCenterVo
import com.itinfo.itcloud.model.computing.toDataCenterVos
import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findAllDataCenters
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.ExternalProvider
import org.ovirt.engine.sdk4.types.OpenStackNetwork
import java.io.Serializable

*/
/**
 * [OpenstackVo]
 * 
 * 가져올 네트워크
 * @property id [String] 공급자의 네트워크 id
 * @property name [String] 네트워크 이름
 * 
 * 네트워크가 속해있는 dc
 * @property dcId [String]
 * @property dcName [String] 이름은 중복 불가
 * 
 * 자기가 가지고 있는 dc 빼고 출력해야하ㄱㄴ함
 * @property dataCenterVos List<[DataCenterVo]>
 * @property permission [Boolean] = false,
 *//*

@Deprecated("사용안함")
class OpenstackVo(
	val id: String = "",
	val name: String = "",
	val dcId: String = "",
	val dcName: String = "",
	val dataCenterVos: List<DataCenterVo> = listOf(),
	val permission: Boolean = false,
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDcId: String = "";fun dcId(block: () -> String?) { bDcId = block() ?: "" }
		private var bDcName: String = "";fun dcName(block: () -> String?) { bDcName = block() ?: "" }
		private var bDataCenterVos: List<DataCenterVo> = listOf();fun dataCenterVos(block: () -> List<DataCenterVo>?) { bDataCenterVos = block() ?: listOf() }
		private var bPermission: Boolean = false;fun permission(block: () -> Boolean?) { bPermission = block() ?: false }
		fun build(): OpenstackVo = OpenstackVo(bId, bName, bDcId, bDcName, bDataCenterVos, bPermission)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: OpenstackVo.Builder.() -> Unit): OpenstackVo =
			OpenstackVo.Builder().apply(block).build()
	}
}

fun OpenStackNetwork.toOpenStackVo(conn: Connection): OpenstackVo {
	val dataCenters: List<DataCenter> = conn.findAllDataCenters()
		.getOrDefault(listOf())

	return OpenstackVo.builder {
		id { this@toOpenStackVo.id() }
		name { this@toOpenStackVo.name() }
		dataCenterVos { dataCenters.toDataCenterVos(conn) }
		permission { true } // 기본값을 허용으로 설정
	}
}

fun List<OpenStackNetwork>.toOpenStackVos(conn: Connection): List<OpenstackVo> =
	this@toOpenStackVos.map { it.toOpenStackVo(conn) }*/
