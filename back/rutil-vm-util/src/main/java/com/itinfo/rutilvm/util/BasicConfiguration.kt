package com.itinfo.rutilvm.util

import java.util.Properties

/**
 * [BasicConfiguration]
 * 기본설정
 *
 * @author 이찬희 (chanhi2000)
 * @since 2023.08.07
 */
class BasicConfiguration {
	private var commonProp: Properties? = null
	private var databaseProp: Properties? = null
	// private var appProp: Properties? = null
	companion object {
		private const val PROP_COMMON_FULL_PATH = "properties/common.properties"

		private const val PNAME_SYSETM_OVIRT_THRESHOLD_CPU = "system.ovirt.threshold.cpu"
		private const val PNAME_SYSETM_OVIRT_THRESHOLD_MEMORY = "system.ovirt.threshold.memory"
		private const val PNAME_SYSETM_OVIRT_GRAFANA_URI = "system.ovirt.grafana.uri"
		private const val PNAME_SYSETM_DEEPLEARNING_URI = "system.deeplearning.uri"
		private const val PNAME_SYSETM_SYMPHONY_POWER_CONTROL = "system.symphony_power_control"

		private const val PROP_DATABASE_FULL_PATH = "properties/database.properties"
		private const val PNAME_POSTGRES_DRIVER_CLASS_NAME = "postgres.driverClassName"
		private const val PNAME_POSTGRES_JDBC_PROTOCOL = "postgres.jdbc.protocol"
		private const val PNAME_POSTGRES_JDBC_URL = "postgres.jdbc.url"
		private const val PNAME_POSTGRES_JDBC_PORT = "postgres.jdbc.port"

		private const val PNAME_POSTGRES_DATA_SOURCE_DB = "postgres.dataSource.db"
		private const val PNAME_POSTGRES_DATA_SOURCE_ID = "postgres.dataSource.jdbc.id"
		private const val PNAME_POSTGRES_DATA_SOURCE_PW = "postgres.dataSource.jdbc.pw"

		private const val PNAME_POSTGRES_DATA_SOURCE_ENGINE_DB = "postgres.dataSourceEngine.db"
		private const val PNAME_POSTGRES_DATA_SOURCE_ENGINE_ID = "postgres.dataSourceEngine.jdbc.id"
		private const val PNAME_POSTGRES_DATA_SOURCE_ENGINE_PW = "postgres.dataSourceEngine.jdbc.pw"

		private val propH: PropertiesHelper = PropertiesHelper.getInstance()
		@Volatile private var INSTANCE: BasicConfiguration? = null
		@JvmStatic fun getInstance(): BasicConfiguration = INSTANCE ?: synchronized(this) {
			INSTANCE ?: build().also { INSTANCE = it }
		}
		private fun build(): BasicConfiguration {
			val bc = BasicConfiguration()
			// bc.commonProp = propH.loadProperties(PROP_COMMON_FULL_PATH)
			bc.databaseProp = propH.loadProperties(PROP_DATABASE_FULL_PATH)
			// bc.appProp = propH.loadProperties(PROP_APP_FULL_PATH)
			return bc
		}
	}

	val postgresDriverClassname: String
		get() = databaseProp?.get(PNAME_POSTGRES_DRIVER_CLASS_NAME).toString()
	val postgresProtocol: String
		get() = databaseProp?.get(PNAME_POSTGRES_JDBC_PROTOCOL).toString()
	val postgresUrl: String
		get() = databaseProp?.get(PNAME_POSTGRES_JDBC_URL).toString()
	val postgresPort: Int
		get() = databaseProp?.get(PNAME_POSTGRES_JDBC_PORT).toString().toIntOrNull() ?: 5432
	val postgresDataSourceDb: String
		get() = databaseProp?.get(PNAME_POSTGRES_DATA_SOURCE_DB).toString()
	val postgresDataSourceId: String
		get() = databaseProp?.get(PNAME_POSTGRES_DATA_SOURCE_ID).toString()
	val postgresDataSourcePw: String
		get() = databaseProp?.get(PNAME_POSTGRES_DATA_SOURCE_PW).toString()
	val postgresDataSourceEngineDb: String
		get() = databaseProp?.get(PNAME_POSTGRES_DATA_SOURCE_ENGINE_DB).toString()
	val postgresDataSourceEngineId: String
		get() = databaseProp?.get(PNAME_POSTGRES_DATA_SOURCE_ENGINE_ID).toString()
	val postgresDataSourceEnginePw: String
		get() = databaseProp?.get(PNAME_POSTGRES_DATA_SOURCE_ENGINE_PW).toString()

	val ovirtThresholdCpu: Int
		get() = commonProp?.get(PNAME_SYSETM_OVIRT_THRESHOLD_CPU).toString().toIntOrNull() ?: 80
	val ovirtThresholdMemory: Int
		get() = commonProp?.get(PNAME_SYSETM_OVIRT_THRESHOLD_MEMORY).toString().toIntOrNull() ?: 78
	val ovirtGrafanaUri: String
		get() = commonProp?.get(PNAME_SYSETM_OVIRT_GRAFANA_URI).toString()
	val deeplearningUri: String
		get() = commonProp?.get(PNAME_SYSETM_DEEPLEARNING_URI).toString()
	val symphonyPowerControl: Boolean
		get() = commonProp?.get(PNAME_SYSETM_SYMPHONY_POWER_CONTROL).toString().toBoolean()

}
