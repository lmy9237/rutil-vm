package com.itinfo.security

import java.io.File
import java.io.IOException

import kotlin.jvm.Throws

class EngineLocalConfig {
	companion object {
		private var INSTANCE: EngineLocalConfig? = null
		@JvmStatic fun getInstance(): EngineLocalConfig = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		fun build(): EngineLocalConfig = EngineLocalConfig()
	}

	fun getPKICACert(): File = File("") // TODO
	fun getPKIQemuCACert(): File = File("") // TODO

	@Throws(IOException::class)
	fun getPKIEngineCert(): File =
		File(EngineLocalConfig::class.java.classLoader.getResource("certs/engine.cer")?.file ?: "")
}
