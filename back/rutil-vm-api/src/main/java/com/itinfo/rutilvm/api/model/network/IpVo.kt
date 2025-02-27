package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.builders.IpBuilder
import org.ovirt.engine.sdk4.types.Ip
import org.ovirt.engine.sdk4.types.IpVersion
import java.io.Serializable

class IpVo (
    val address: String = "",
    val gateway: String = "",
    val netmask: String = "",
    val version: IpVersion = IpVersion.V4,
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
        private var bGateway: String = "";fun gateway(block: () -> String?) { bGateway = block() ?: "" }
        private var bNetmask: String = "";fun netmask(block: () -> String?) { bNetmask = block() ?: "" }
        private var bVersion: IpVersion = IpVersion.V4; fun version(block: () -> IpVersion?) { bVersion = block() ?: IpVersion.V4 }

        fun build(): IpVo = IpVo(bAddress, bGateway, bNetmask, bVersion)
    }

    companion object {
        inline fun builder(block: IpVo.Builder.() -> Unit): IpVo = IpVo.Builder().apply(block).build()
    }
}

fun Ip.toIp(): IpVo {
    return IpVo.builder {
        address { if (this@toIp.addressPresent()) this@toIp.address()  else null }
        gateway { if (this@toIp.gatewayPresent()) this@toIp.gateway()  else null }
        netmask { if(this@toIp.netmaskPresent()) this@toIp.netmask() else null }
        version { if(this@toIp.versionPresent()) this@toIp.version() else null }
    }
}

fun IpVo.toIpBuilder(): Ip = IpBuilder()
	.address(this@toIpBuilder.address)
	.netmask(this@toIpBuilder.netmask)
	.build()
//        .gateway(this@toIpBuilder.gateway)
//        .version(this@toIpBuilder.version)
