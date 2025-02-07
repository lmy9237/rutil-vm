package com.itinfo.rutilvm.util.ovirt

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.SystemService
import org.slf4j.LoggerFactory

val log = LoggerFactory.getLogger(SystemServiceHelper::class.java)

class SystemServiceHelper {
	companion object {
		@Volatile private var INSTANCE: SystemServiceHelper? = null
		@JvmStatic fun getInstance(): SystemServiceHelper = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): SystemServiceHelper = SystemServiceHelper()
	}

	private fun getSystemService(c: Connection): SystemService = c.systemService()
}

val Connection.systemService: SystemService
	get() = this.systemService()

