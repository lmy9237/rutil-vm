package com.itinfo.rutilvm.util.model

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.itinfo.rutilvm.util.BasicConfiguration

import java.io.Serializable

private val gson: Gson =
	GsonBuilder()
		.setPrettyPrinting()
		.create()

val basicConf: BasicConfiguration
	get() = BasicConfiguration.getInstance()

class SystemPropertiesVo(
	var id: String = "",
	var password: String = "",
	var ovirtIp: String = "",
	var ovirtPort: Int = 2443,
	var vncIp: String = "",
	var vncPort: String = "",
	var cpuThreshold: Int = basicConf.ovirtThresholdCpu,
	var memoryThreshold: Int = basicConf.ovirtThresholdMemory,
	var grafanaUri: String = basicConf.ovirtGrafanaUri,
	var deeplearningUri: String = basicConf.deeplearningUri,
	var symphonyPowerControll: Boolean = basicConf.symphonyPowerControl,
	var loginLimit: Int = 5,
	var sessionToken: String = "",
): Serializable {
	val ovirtEngineApiUrl: String
		get() = "https://${ovirtIp}${if(ovirtPort == 443) "" else ":${ovirtPort}"}/ovirt-engine/api"
	val ovirtUserId: String
		get() = "${id}@internal"

	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bPassword: String = "";fun password(block: () -> String?) { bPassword = block() ?: "" }
		private var bOvirtIp: String = "";fun ovirtIp(block: () -> String?) { bOvirtIp = block() ?: "" }
		private var bOvirtPort: Int = 443;fun ovirtPort(block: () -> Int?) { bOvirtPort = block() ?: 443 }
		private var bVncIp: String = "";fun vncIp(block: () -> String?) { bVncIp = block() ?: "" }
		private var bVncPort: String = "";fun vncPort(block: () -> String?) { bVncPort = block() ?: "" }
//		private var bJwtSecretKey: String = "";fun jwtSecretKey(block: () -> String?) { bJwtSecretKey = block() ?: basicConf.jwtSecretKey }
//		private var bJwtExpirationTime: Long = 0L;fun jwtExpirationTime(block: () -> Long?) { bJwtExpirationTime = block() ?: basicConf.jwtExpirationTime }
		private var bCpuThreshold: Int = -1;fun cpuThreshold(block: () -> Int?) { bCpuThreshold = block() ?: basicConf.ovirtThresholdCpu }
		private var bMemoryThreshold: Int = -1;fun memoryThreshold(block: () -> Int?) { bMemoryThreshold = block() ?: basicConf.ovirtThresholdMemory }
		private var bGrafanaUri: String = "";fun grafanaUri(block: () -> String?) { bGrafanaUri = block() ?: basicConf.ovirtGrafanaUri }
		private var bDeeplearningUri: String = "";fun deeplearningUri(block: () -> String?) { bDeeplearningUri = block() ?: basicConf.deeplearningUri }
		private var bSymphonyPowerControll: Boolean = false;fun symphonyPowerControll(block: () -> Boolean?) { bSymphonyPowerControll = block() ?: basicConf.symphonyPowerControl }
		private var bLoginLimit: Int = 5;fun loginLimit(block: () -> Int?) { bLoginLimit = block() ?: 5 }
		fun build(): SystemPropertiesVo = SystemPropertiesVo(bId, bPassword, bOvirtIp, bOvirtPort, bVncIp, bVncPort, /* bJwtSecretKey, bJwtExpirationTime,*/ bCpuThreshold, bMemoryThreshold, bGrafanaUri, bDeeplearningUri, bSymphonyPowerControll, bLoginLimit)
	}
	companion object {
		@JvmStatic inline fun systemPropertiesVo(block: Builder.() -> Unit): SystemPropertiesVo = Builder().apply(block).build()
	}
}
