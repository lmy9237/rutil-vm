package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [GraphicsTypeB]
 * 가상머신 그래픽 유형
 *
 * @see VmDeviceType
 */
enum class GraphicsTypeB(
	val vmDeviceType: VmDeviceType,
) {
	spice(VmDeviceType.SPICE), // 1
	vnc(VmDeviceType.VNC); // 2

	override fun toString(): String = code
	val code: String
		get() = this@GraphicsTypeB.name.uppercase()
	val value: Int
		get() = this@GraphicsTypeB.ordinal+1

	companion object {
		private val valueMapping: MutableMap<Int, GraphicsTypeB> = ConcurrentHashMap<Int, GraphicsTypeB>()
		private val codeMapping: MutableMap<String, GraphicsTypeB> = ConcurrentHashMap<String, GraphicsTypeB>()
		private val deviceTypeMapping: MutableMap<VmDeviceType, GraphicsTypeB> = ConcurrentHashMap<VmDeviceType, GraphicsTypeB>()
		// private val ovfResourceTypeMapping: MutableMap<String, GraphicsType> = ConcurrentHashMap<String, GraphicsType>()
		init {
			values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
				deviceTypeMapping[it.vmDeviceType] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): GraphicsTypeB? = valueMapping[value ?: vnc.code] ?: vnc
		@JvmStatic fun forCode(code: String?): GraphicsTypeB? = codeMapping[code ?: vnc.code] ?: vnc
		@JvmStatic fun forDeviceType(deviceType: VmDeviceType?): GraphicsTypeB? = deviceTypeMapping[deviceType] ?: vnc
	}

}
