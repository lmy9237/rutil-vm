package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostNicToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostNicsToIdentifiedVos
import com.itinfo.rutilvm.util.ovirt.findNicFromHost

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.BondingBuilder
import org.ovirt.engine.sdk4.builders.HostNicBuilder
import org.ovirt.engine.sdk4.types.Bonding
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.HostNic
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(BondingVo::class.java)

class BondingVo (
    val adPartnerMacAddress: String = "",
    val activeSlave: IdentifiedVo = IdentifiedVo(),  // hostNicvo
    val optionVos: List<OptionVo> = listOf(),
    val slaves: List<IdentifiedVo> = listOf(),  // hostNic
//    val slaves: List<HostNicVo> = listOf(),  // hostNic
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder{
        private var bAdPartnerMacAddress: String = ""; fun adPartnerMacAddress(block: () -> String?) { bAdPartnerMacAddress = block() ?: "" }
        private var bActiveSlave: IdentifiedVo = IdentifiedVo(); fun activeSlave(block: () -> IdentifiedVo?) { bActiveSlave = block() ?: IdentifiedVo() }
        private var bOptionVos: List<OptionVo> = listOf(); fun optionVos(block: () -> List<OptionVo>?) { bOptionVos = block() ?: listOf() }
        private var bSlaves: List<IdentifiedVo> = listOf(); fun slaves(block: () -> List<IdentifiedVo>?) { bSlaves = block() ?: listOf() }
//        private var bSlaves: List<HostNicVo> = listOf(); fun slaves(block: () -> List<HostNicVo>?) { bSlaves = block() ?: listOf() }

        fun build(): BondingVo = BondingVo(bAdPartnerMacAddress, bActiveSlave, bOptionVos, bSlaves)
    }

    companion object{
        inline fun builder(block: BondingVo.Builder.() -> Unit): BondingVo =  BondingVo.Builder().apply(block).build()
    }
}

fun Bonding.toBondingVo(conn: Connection, hostId: String): BondingVo {
    val slaves = if (this@toBondingVo.slavesPresent()) {
        this@toBondingVo.slaves().mapNotNull { hostNic ->
            val slaveId = hostNic.id()
            val nic: HostNic? = conn.findNicFromHost(hostId, slaveId).getOrNull()
//            nic?.toSlaveHostNicVo(conn)
            nic?.fromHostNicToIdentifiedVo()
        }
    } else listOf()

    return BondingVo.builder {
        activeSlave {
            if (this@toBondingVo.activeSlavePresent()) {
                val activeSlaveId = this@toBondingVo.activeSlave().id()
                val nic = conn.findNicFromHost(hostId, activeSlaveId).getOrNull()
                nic?.fromHostNicToIdentifiedVo()
            } else null
        }
        optionVos {
            if (this@toBondingVo.optionsPresent()) this@toBondingVo.options().toOptionVos() else listOf()
        }
        slaves { slaves }
    }
}

/**
 * 호스트 네트워크 인터페이스
 */
fun BondingVo.toBondingBuilder(): BondingBuilder {
    return BondingBuilder()
        .options(toDefaultOption()) // 기본 옵션지정 mode1
        .slaves(this@toBondingBuilder.slaves.map { slave ->
            HostNicBuilder()
//                .id(slave.id)
                .name(slave.name)
                .build()
        })
}

// 호스트 네트워크 설정 - 본딩 인터페이스 생성
fun BondingVo.toBonding(): Bonding =
    this@toBonding.toBondingBuilder().build()
