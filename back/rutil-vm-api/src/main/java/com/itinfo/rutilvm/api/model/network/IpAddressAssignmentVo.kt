package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.builders.IpAddressAssignmentBuilder
import org.ovirt.engine.sdk4.types.BootProtocol
import org.ovirt.engine.sdk4.types.IpAddressAssignment
import java.io.Serializable

class IpAddressAssignmentVo (
    val assignmentMethod: String = "", //BootProtocol
    val ipVo: IpVo = IpVo()
) : Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bAssignmentMethod: String = "";fun assignmentMethod(block: () -> String?) { bAssignmentMethod = block() ?: "" }
        private var bIpVo: IpVo = IpVo();fun ipVo(block: () -> IpVo?) { bIpVo = block() ?: IpVo() }

        fun build(): IpAddressAssignmentVo = IpAddressAssignmentVo(bAssignmentMethod, bIpVo)
    }

    companion object {
        inline fun builder(block: IpAddressAssignmentVo.Builder.() -> Unit): IpAddressAssignmentVo = IpAddressAssignmentVo.Builder().apply(block).build()
    }
}


fun IpAddressAssignment.toIpAddressAssignmentVo(): IpAddressAssignmentVo {
	val ip = this@toIpAddressAssignmentVo
	return IpAddressAssignmentVo.builder {
		assignmentMethod { ip.assignmentMethod().value() }
		ipVo {
			if(ip.ipPresent()) ip().toIp()
			else IpVo()
		}
	}
}
fun List<IpAddressAssignment>.toIpAddressAssignmentVos(): List<IpAddressAssignmentVo> =
	this@toIpAddressAssignmentVos.map { it.toIpAddressAssignmentVo() }

/**
 * 호스트 네트워크 설정에서 사용됨
 */
fun IpAddressAssignmentVo.toIpAddressAssignment(): IpAddressAssignment {
    return IpAddressAssignmentBuilder()
        .assignmentMethod(BootProtocol.fromValue(this.assignmentMethod))
        .ip(this.ipVo.toIpBuilder())
        .build()
}
fun List<IpAddressAssignmentVo>.toIpAddressAssignments(): List<IpAddressAssignment> =
    this@toIpAddressAssignments.map { it.toIpAddressAssignment() }
