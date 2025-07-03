package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.builders.PropertyBuilder
import org.ovirt.engine.sdk4.types.Property
import java.io.Serializable

class ProviderPropertyVo(
	val dataCenterVo: IdentifiedVo? = IdentifiedVo(),
	val hostVo: IdentifiedVo? = IdentifiedVo(),
    val vCenter: String = "",
	val esxi: String = "",
	val dataCenter: String = "",
	val cluster: String = "",
	val verifySSL: Boolean = false,
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
		private var bDataCenterVo: IdentifiedVo? = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bHostVo: IdentifiedVo? = IdentifiedVo(); fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		private var bVCenter: String = ""; fun vCenter(block: () -> String?) { bVCenter = block() ?: "" }
		private var bEsxi: String = ""; fun esxi(block: () -> String?) { bEsxi = block() ?: "" }
		private var bDataCenter: String = ""; fun dataCenter(block: () -> String?) { bDataCenter = block() ?: "" }
		private var bCluster: String = ""; fun cluster(block: () -> String?) { bCluster = block() ?: "" }
		private var bVerifySSL: Boolean = false; fun verifySSL(block: () -> Boolean?) { bVerifySSL = block() ?: false }

        fun build(): ProviderPropertyVo = ProviderPropertyVo( bDataCenterVo, bHostVo, bVCenter, bEsxi, bDataCenter, bCluster, bVerifySSL,)
    }
    companion object {
        inline fun builder(block: Builder.() -> Unit): ProviderPropertyVo = Builder().apply(block).build()
    }
}

fun ProviderPropertyVo.toProperties(): List<Property> {
	val props = mutableListOf<Property>()

	if (!dataCenterVo?.id.isNullOrBlank()) {
		props.add(
			PropertyBuilder()
				.name("storagePoolId")
				.value(dataCenterVo!!.id)
				.build()
		)
	}
	if (!hostVo?.id.isNullOrBlank()) {
		props.add(
			PropertyBuilder()
				.name("proxyHostId")
				.value(hostVo!!.id)
				.build()
		)
	}

	listOf(
		// "storagePoolId" to dataCenterVo,
		// "proxyHostId" to hostVo,
		"type" to "vmware",
		"vCenter" to vCenter,
		"esx" to esxi,
		"dataCenter" to dataCenter,
		"verifySSL" to verifySSL.toString()
	).forEach { (key, value) ->
		props.add(PropertyBuilder().name(key).value(value).build())
	}
	props.forEach {
		println(it.name() +": "+it.value())
	}

	return props
}
