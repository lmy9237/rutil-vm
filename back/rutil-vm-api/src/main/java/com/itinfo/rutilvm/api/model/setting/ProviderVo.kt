package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.api.ovirt.business.ProviderType
import com.itinfo.rutilvm.api.repository.engine.entity.ProvidersEntity
import com.itinfo.rutilvm.common.gson
import java.io.Serializable
import java.time.LocalDateTime
import java.util.*

class ProviderVo(
	val id: UUID = UUID.randomUUID(),
	val name: String = "",
	val description: String = "",
	var url: String? = "",
	var providerType: ProviderType?,
	var authRequired: Boolean = false,
	var authUsername: String? = "",
	var authPassword: String? = "",
	val createDate: LocalDateTime = LocalDateTime.now(),
	var updateDate: LocalDateTime? = null,
	var customProperties: String? = "",
	var tenantName: String? = "",
	var pluginType: String? = "",
	var authUrl: String? = "",
	var additionalProperties: String? = "",
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
		private var bId: UUID = UUID.randomUUID();fun id(block: () -> UUID) { bId = block() }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bUrl: String? = "";fun url(block: () -> String?) { bUrl = block() ?: "" }
		private var bProviderType: ProviderType? = null;fun providerType(block: () -> ProviderType?) { bProviderType = block() }
		private var bAuthRequired: Boolean = false;fun authRequired(block: () -> Boolean?) { bAuthRequired = block() ?: false }
		private var bAuthUsername: String? = "";fun authUsername(block: () -> String?) { bAuthUsername = block() ?: "" }
		private var bAuthPassword: String? = "";fun authPassword(block: () -> String?) { bAuthPassword = block() ?: "" }
		private var bCreateDate: LocalDateTime = LocalDateTime.now();fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() ?: LocalDateTime.now() }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bCustomProperties: String? = "";fun customProperties(block: () -> String?) { bCustomProperties = block() ?: "" }
		private var bTenantName: String? = "";fun tenantName(block: () -> String?) { bTenantName = block() ?: "" }
		private var bPluginType: String? = "";fun pluginType(block: () -> String?) { bPluginType = block() ?: "" }
		private var bAuthUrl: String? = "";fun authUrl(block: () -> String?) { bAuthUrl = block() ?: "" }
		private var bAdditionalProperties: String? = "";fun additionalProperties(block: () -> String?) { bAdditionalProperties = block() ?: "" }
		private var bReadOnly: Boolean = false;fun readOnly(block: () -> Boolean?) { bReadOnly = block() ?: false }
		private var bIsUnmanaged: Boolean = false;fun isUnmanaged(block: () -> Boolean?) { bIsUnmanaged = block() ?: false }
		private var bAutoSync: Boolean = false;fun autoSync(block: () -> Boolean?) { bAutoSync = block() ?: false }
		private var bUserDomainName: String? = "";fun userDomainName(block: () -> String?) { bUserDomainName = block() ?: "" }
		private var bProjectName: String? = "";fun projectName(block: () -> String?) { bProjectName = block() ?: "" }
		private var bProjectDomainName: String? = "";fun projectDomainName(block: () -> String?) { bProjectDomainName = block() ?: "" }
		fun build(): ProviderVo = ProviderVo(bId, bName, bDescription, bUrl, bProviderType, bAuthRequired, bAuthUsername, bAuthPassword, bCreateDate, bUpdateDate, bCustomProperties, bTenantName, bPluginType, bAuthUrl, bAdditionalProperties, bReadOnly, bIsUnmanaged, bAutoSync, bUserDomainName, bProjectName, bProjectDomainName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): ProviderVo = Builder().apply(block).build()
	}
}

fun ProvidersEntity.toProviderVo(): ProviderVo = ProviderVo.builder {
	id { id }
	name { name }
	description { description }
	url { url }
	providerType { providerTypeB }
	authRequired { authRequired }
	authUsername { authUsername }
	authPassword { authPassword }
	createDate { createDate }
	updateDate { updateDate }
	customProperties { customProperties }
	tenantName { tenantName }
	pluginType { pluginType }
	authUrl { authUrl }
	additionalProperties { additionalProperties }
	readOnly { readOnly }
	isUnmanaged { isUnmanaged }
	autoSync { autoSync }
	userDomainName { userDomainName }
	projectName { projectName }
	projectDomainName { projectDomainName }
}

fun List<ProvidersEntity>.toProviderVos(): List<ProviderVo> =
	this.map { it.toProviderVo() }
