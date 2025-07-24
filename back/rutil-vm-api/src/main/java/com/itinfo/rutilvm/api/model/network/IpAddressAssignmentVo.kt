package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.builders.IpAddressAssignmentBuilder
import org.ovirt.engine.sdk4.types.BootProtocol
import org.ovirt.engine.sdk4.types.IpAddressAssignment
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(IpAddressAssignmentVo::class.java)

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
	return IpAddressAssignmentVo.builder {
		assignmentMethod { this@toIpAddressAssignmentVo.assignmentMethod().value() }
		ipVo { if(this@toIpAddressAssignmentVo.ipPresent()) ip().toIpVo() else null }
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
        .ip(this.ipVo.toIp())
        .build()
}
fun List<IpAddressAssignmentVo>.toIpAddressAssignments(): List<IpAddressAssignment> =
    this@toIpAddressAssignments.map { it.toIpAddressAssignment() }
