package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.api.model.computing.DataCenterVo
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.util.ovirt.findAllDataCenters

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.DataCenter
import org.ovirt.engine.sdk4.types.OpenStackNetwork
import org.ovirt.engine.sdk4.types.OpenStackNetworkProvider
import java.io.Serializable

/**
 * [OpenStackNetworkVo]
 * 외부 네트워크 공급자
 *
 * 가져올 네트워크
 * @property id [String]
 * @property name [String]
 * @property dataCenterVo [IdentifiedVo] dc 편집
 */
class OpenStackNetworkVo (
    val id: String = "",
    val name: String = "",
    val dataCenterVo: IdentifiedVo = IdentifiedVo()
) : Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
        private var bDataCenterVo: IdentifiedVo = IdentifiedVo();fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }

        fun build(): OpenStackNetworkVo = OpenStackNetworkVo(bId, bName, bDataCenterVo)
    }

    companion object {
        inline fun builder(block: OpenStackNetworkVo.Builder.() -> Unit): OpenStackNetworkVo = OpenStackNetworkVo.Builder().apply(block).build()
    }
}

fun OpenStackNetwork.toOpenStackNetworkVoIdName(): OpenStackNetworkVo = OpenStackNetworkVo.builder {
    id { this@toOpenStackNetworkVoIdName.id() }
    name { this@toOpenStackNetworkVoIdName.name() }
}
fun List<OpenStackNetwork>.toOpenStackNetworkVosIdName(): List<OpenStackNetworkVo> =
    this@toOpenStackNetworkVosIdName.map { it.toOpenStackNetworkVoIdName() }


fun OpenStackNetworkProvider.toOpenStackNetworkVo(conn: Connection): OpenStackNetworkVo {
    val dataCenters: List<DataCenter> = conn.findAllDataCenters()
        .getOrDefault(listOf())
    return OpenStackNetworkVo.builder {
        id { this@toOpenStackNetworkVo.id() }
        name { this@toOpenStackNetworkVo.name() }
//        dataCenterVos { dataCenters.toDataCenterIdNames() }
    }
}

