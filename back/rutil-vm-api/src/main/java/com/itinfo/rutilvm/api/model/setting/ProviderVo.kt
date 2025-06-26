package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.api.ovirt.business.ProviderTypeB
import com.itinfo.rutilvm.api.repository.engine.entity.AdditionalProperties4Vmware
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.builders.ExternalHostProviderBuilder
import org.ovirt.engine.sdk4.types.ExternalHostProvider
import java.io.Serializable
import java.time.LocalDateTime

/**
 * [ProviderVo]
 *
 * @property id [String]
 * @property name [String]
 * @property description [String]
 * @property url [String]
 * @property providerType [ProviderTypeB]
 * @property authRequired [Boolean]
 * @property authUsername [String]
 * @property authPassword [String]
 * @property createDate [LocalDateTime]
 * @property updateDate [LocalDateTime]
 * @property customProperties [String]
 * @property tenantName [String]
 * @property pluginType [String]
 * @property authUrl [String]
 * @property additionalProperties [String]
 * @property readOnly [Boolean]
 * @property isUnmanaged [Boolean]
 * @property autoSync [Boolean]
 * @property userDomainName [String]
 * @property projectName [String]
 * @property projectDomainName [String]
 */
class ProviderVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	var url: String? = "",
	var providerType: ProviderTypeB? = ProviderTypeB.external_network,
	var authRequired: Boolean = false,
	var authUsername: String? = "",
	var authPassword: String? = "",
	val createDate: LocalDateTime = LocalDateTime.now(),
	var updateDate: LocalDateTime? = null,
	var customProperties: String? = "",
	var tenantName: String? = "",
	var pluginType: String? = "",
	var authUrl: String? = "",
	var additionalProperties: AdditionalProperties4Vmware? = null,
	var readOnly: Boolean = false,
	var isUnmanaged: Boolean = false,
	var autoSync: Boolean = false,
	var userDomainName: String? = "",
	var projectName: String? = "",
	var projectDomainName: String? = "",
): Serializable {
	val providerTypeLocalizationKey: String
		get() = providerType?.localizationKey ?: ""

	val providerTypeKr: String
		get() = providerType?.kr ?: ""

	val isProviderTypeNetwork: Boolean
		get() = providerType?.isTypeNetwork ?: false

	val isProviderTypeOpenstack: Boolean
		get() = providerType?.isTypeOpenstack ?: false

	val providerTypeSupportsAuthApiV3: Boolean
		get() = providerType?.supportsAuthApiV3 ?: false

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bUrl: String? = "";fun url(block: () -> String?) { bUrl = block() ?: "" }
		private var bProviderTypeB: ProviderTypeB? = null;fun providerType(block: () -> ProviderTypeB?) { bProviderTypeB = block() }
		private var bAuthRequired: Boolean = false;fun authRequired(block: () -> Boolean?) { bAuthRequired = block() ?: false }
		private var bAuthUsername: String? = "";fun authUsername(block: () -> String?) { bAuthUsername = block() ?: "" }
		private var bAuthPassword: String? = "";fun authPassword(block: () -> String?) { bAuthPassword = block() ?: "" }
		private var bCreateDate: LocalDateTime = LocalDateTime.now();fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() ?: LocalDateTime.now() }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bCustomProperties: String? = "";fun customProperties(block: () -> String?) { bCustomProperties = block() ?: "" }
		private var bTenantName: String? = "";fun tenantName(block: () -> String?) { bTenantName = block() ?: "" }
		private var bPluginType: String? = "";fun pluginType(block: () -> String?) { bPluginType = block() ?: "" }
		private var bAuthUrl: String? = "";fun authUrl(block: () -> String?) { bAuthUrl = block() ?: "" }
		private var bAdditionalProperties: AdditionalProperties4Vmware? = null;fun additionalProperties(block: () -> AdditionalProperties4Vmware?) { bAdditionalProperties = block() }
		private var bReadOnly: Boolean = false;fun readOnly(block: () -> Boolean?) { bReadOnly = block() ?: false }
		private var bIsUnmanaged: Boolean = false;fun isUnmanaged(block: () -> Boolean?) { bIsUnmanaged = block() ?: false }
		private var bAutoSync: Boolean = false;fun autoSync(block: () -> Boolean?) { bAutoSync = block() ?: false }
		private var bUserDomainName: String? = "";fun userDomainName(block: () -> String?) { bUserDomainName = block() ?: "" }
		private var bProjectName: String? = "";fun projectName(block: () -> String?) { bProjectName = block() ?: "" }
		private var bProjectDomainName: String? = "";fun projectDomainName(block: () -> String?) { bProjectDomainName = block() ?: "" }
		fun build(): ProviderVo = ProviderVo(bId, bName, bDescription, bUrl, bProviderTypeB, bAuthRequired, bAuthUsername, bAuthPassword, bCreateDate, bUpdateDate, bCustomProperties, bTenantName, bPluginType, bAuthUrl, bAdditionalProperties, bReadOnly, bIsUnmanaged, bAutoSync, bUserDomainName, bProjectName, bProjectDomainName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): ProviderVo = Builder().apply(block).build()
	}
}


fun ProviderVo.toExternalHostProviderBuilder(): ExternalHostProviderBuilder {
	// val props = listOf(
	// 	PropertyVo("type", "vmware" },
	// 	PropertyVo("vcenter", "192.168.0.117"),
	// 	PropertyVo("esx", "192.168.0.411"),
	// 	PropertyVo("dataCenter", "Datacenter/NFO"),
	// 	PropertyVo("verifySSL", "false")
	// )

	return ExternalHostProviderBuilder()
		.name(name)
		.description(description)
		.url(url)
		.username(authUsername)
		.password(authPassword)
		// .properties(additionalProperties?.toPropertyBuildersFromAdditionalProperties4Vmware())
}

fun ProviderVo.toAddHostProvider(): ExternalHostProvider =
	toExternalHostProviderBuilder().build()

fun ProviderVo.toEditHostProvider(): ExternalHostProvider =
	toExternalHostProviderBuilder()
		.id(id)
		.build()
