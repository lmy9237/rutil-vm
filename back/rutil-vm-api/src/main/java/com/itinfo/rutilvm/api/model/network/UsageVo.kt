package com.itinfo.rutilvm.api.model.network

import com.itinfo.rutilvm.common.gson

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
    val vm: Boolean? = false,
    val management: Boolean? = false,
    val display: Boolean? = false,
    val migration: Boolean? = false,
    val gluster: Boolean? = false,
    val defaultRoute: Boolean? = false
): Serializable{
    override fun toString(): String =
        gson.toJson(this)

	private val rolesKr: List<String>			get() = listOf(
		if (management == true) "관리" else "",
		if (display == true) "출력" else "",
		if (migration == true) "마이그레이션" else "",
		if (gluster == true) "글러스터" else "",
		if (defaultRoute == true) "기본라우팅" else "",
	)

	private val rolesEn: List<String>			get() = listOf(
		if (management == true) "Management" else "",
		if (display == true) "Display" else "",
		if (migration == true) "Migration" else "",
		if (gluster == true) "Gluster" else "",
		if (defaultRoute == true) "Default Route" else "",
	)

	val roleInKr: String				get() = rolesKr.joinToString(" / ")
	val roleInEn: String				get() = rolesEn.joinToString(" / ")

    class Builder {
        private var bVm: Boolean? = false; fun vm(block: () -> Boolean?) { bVm = block() ?: false }
        private var bManagement: Boolean? = false; fun management(block: () -> Boolean?) { bManagement = block() ?: false }
        private var bDisplay: Boolean? = false; fun display(block: () -> Boolean?) { bDisplay = block() ?: false }
        private var bMigration: Boolean? = false; fun migration(block: () -> Boolean?) { bMigration = block() ?: false }
        private var bGluster: Boolean? = false; fun gluster(block: () -> Boolean?) { bGluster = block() ?: false }
        private var bDefaultRoute: Boolean? = false; fun defaultRoute(block: () -> Boolean?) { bDefaultRoute = block() ?: false }
        fun build(): UsageVo = UsageVo(bVm, bManagement, bDisplay, bMigration, bGluster, bDefaultRoute)
    }

    companion object{
        inline fun builder(blcok: UsageVo.Builder.() -> Unit): UsageVo = UsageVo.Builder().apply(blcok).build()
    }
}

fun List<NetworkUsage>.toUsageVo(): UsageVo = UsageVo.builder {
	vm { this@toUsageVo.contains(NetworkUsage.VM) }
	display { this@toUsageVo.contains(NetworkUsage.DISPLAY) }
	migration { this@toUsageVo.contains(NetworkUsage.MIGRATION) }
	management { this@toUsageVo.contains(NetworkUsage.MANAGEMENT) }
	defaultRoute { this@toUsageVo.contains(NetworkUsage.DEFAULT_ROUTE) }
	gluster { this@toUsageVo.contains(NetworkUsage.GLUSTER) }
}
fun Network.toUsageVo(): UsageVo = this@toUsageVo.usages().toUsageVo()

