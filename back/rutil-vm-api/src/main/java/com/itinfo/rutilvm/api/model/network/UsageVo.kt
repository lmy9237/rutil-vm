package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllNetworksFromCluster

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkUsage
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(UsageVo::class.java)
/**
 * [UsageVo]
 *
 * @property vm [Boolean]
 * @property management [Boolean] 관리
 * @property display [Boolean] 출력
 * @property migration [Boolean]
 * @property gluster [Boolean]
 * @property defaultRoute [Boolean]
 */
// TODO cluster network에서 usage는 따로 처리해야할듯요
class UsageVo (
    val vm: Boolean = false,
    val management: Boolean = false,
    val display: Boolean = false,
    val migration: Boolean = false,
    val gluster: Boolean = false,
    val defaultRoute: Boolean = false
): Serializable{
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bVm: Boolean = false; fun vm(block: () -> Boolean) { bVm = block() ?: false }
        private var bManagement: Boolean = false; fun management(block: () -> Boolean) { bManagement = block() ?: false }
        private var bDisplay: Boolean = false; fun display (block: () -> Boolean) { bDisplay = block() ?: false }
        private var bMigration: Boolean = false; fun migration(block: () -> Boolean) { bMigration = block() ?: false }
        private var bGluster: Boolean = false; fun gluster (block: () -> Boolean) { bGluster = block() ?: false }
        private var bDefaultRoute: Boolean = false; fun defaultRoute (block: () -> Boolean) { bDefaultRoute = block() ?: false }
        fun build(): UsageVo = UsageVo(bVm, bManagement, bDisplay, bMigration, bGluster, bDefaultRoute)
    }

    companion object{
        inline fun builder(blcok: UsageVo.Builder.() -> Unit): UsageVo = UsageVo.Builder().apply(blcok).build()
    }
}

fun Network.toUsageVo(): UsageVo {
    return UsageVo.builder {
        vm { this@toUsageVo.usages().contains(NetworkUsage.VM) }
        display { this@toUsageVo.usages().contains(NetworkUsage.DISPLAY) }
        migration { this@toUsageVo.usages().contains(NetworkUsage.MIGRATION) }
        management { this@toUsageVo.usages().contains(NetworkUsage.MANAGEMENT) }
        defaultRoute { this@toUsageVo.usages().contains(NetworkUsage.DEFAULT_ROUTE) }
        gluster { this@toUsageVo.usages().contains(NetworkUsage.GLUSTER) }
    }
}

fun List<NetworkUsage>.toUsagesVo(): UsageVo{
    return UsageVo.builder {
        vm { this@toUsagesVo.contains(NetworkUsage.VM) }
        display { this@toUsagesVo.contains(NetworkUsage.DISPLAY) }
        migration { this@toUsagesVo.contains(NetworkUsage.MIGRATION) }
        management { this@toUsagesVo.contains(NetworkUsage.MANAGEMENT) }
        defaultRoute { this@toUsagesVo.contains(NetworkUsage.DEFAULT_ROUTE) }
        gluster { this@toUsagesVo.contains(NetworkUsage.GLUSTER) }
    }
}

