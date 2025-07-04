package com.itinfo.rutilvm.api.model.setting

import com.itinfo.rutilvm.api.ovirt.business.ProviderTypeB
import com.itinfo.rutilvm.api.repository.engine.entity.AdditionalProperties4Vmware
import com.itinfo.rutilvm.api.repository.engine.entity.ProvidersEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toPropertyBuildersFromAdditionalProperties4Vmware
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.toUUID
import org.ovirt.engine.sdk4.builders.ExternalDiscoveredHostBuilder
import org.ovirt.engine.sdk4.builders.ExternalHostProviderBuilder
import org.ovirt.engine.sdk4.builders.PropertyBuilder
import org.ovirt.engine.sdk4.internal.containers.ExternalHostProviderContainer
import org.ovirt.engine.sdk4.types.ExternalHostProvider
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime
import java.util.*

private val log = LoggerFactory.getLogger(ExternalHostProviderVo::class.java)
/**
 * [ExternalHostProviderVo]
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
 * @property providerPropertyVo [ProviderPropertyVo]
 * @property additionalProperties [String]
 */
class ExternalHostProviderVo(
	val id: String? = "",
	val name: String? = "",
	val description: String? = "",
	val url: String? = "",
	val providerType: ProviderTypeB? = ProviderTypeB.external_network,
	val authRequired: Boolean? = false,
	val authUsername: String? = "",
	val authPassword: String? = "",
	val createDate: LocalDateTime? = LocalDateTime.now(),
	val updateDate: LocalDateTime? = null,
	val providerPropertyVo: ProviderPropertyVo? = ProviderPropertyVo(),
	// val additionalProperties: AdditionalProperties4Vmware? = null,
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
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String? = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bUrl: String? = "";fun url(block: () -> String?) { bUrl = block() ?: "" }
		private var bProviderTypeB: ProviderTypeB? = null;fun providerType(block: () -> ProviderTypeB?) { bProviderTypeB = block() }
		private var bAuthRequired: Boolean? = false;fun authRequired(block: () -> Boolean?) { bAuthRequired = block() ?: false }
		private var bAuthUsername: String? = "";fun authUsername(block: () -> String?) { bAuthUsername = block() ?: "" }
		private var bAuthPassword: String? = "";fun authPassword(block: () -> String?) { bAuthPassword = block() ?: "" }
		private var bCreateDate: LocalDateTime? = LocalDateTime.now();fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() ?: LocalDateTime.now() }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bProviderPropertyVo: ProviderPropertyVo? = ProviderPropertyVo();fun providerPropertyVo(block: () -> ProviderPropertyVo?) { bProviderPropertyVo = block() ?: ProviderPropertyVo() }
		// private var bAdditionalProperties: AdditionalProperties4Vmware? = null;fun additionalProperties(block: () -> AdditionalProperties4Vmware?) { bAdditionalProperties = block() }
		fun build(): ExternalHostProviderVo = ExternalHostProviderVo(bId, bName, bDescription, bUrl, bProviderTypeB, bAuthRequired, bAuthUsername, bAuthPassword, bCreateDate, bUpdateDate, bProviderPropertyVo/*, bAdditionalProperties*/,)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): ExternalHostProviderVo = Builder().apply(block).build()
	}
}


fun ExternalHostProviderVo.toExternalHostProviderBuilder(): ExternalHostProviderBuilder {
	return ExternalHostProviderBuilder()
		.name(name)
		.description(description)
		// .properties(listOf(PropertyBuilder().name("type").value("VMWARE").build()))
		.url(url)
		.requiresAuthentication(false)
		.username(authUsername)
		.password(authPassword)// 일단 빈값

		// .properties(providerPropertyVo?.toProperties())
		// .properties(additionalProperties?.toPropertyBuildersFromAdditionalProperties4Vmware())
}

fun ExternalHostProviderVo.toAddExternalHostProviderVo(): ExternalHostProvider =
	toExternalHostProviderBuilder().build()

fun ExternalHostProviderVo.toEditExternalHostProviderVo(): ExternalHostProvider =
	toExternalHostProviderBuilder()
		.id(id)
		.build()

fun ExternalHostProviderVo.toProvidersEntity(
	uuid2Add: UUID? = UUID.randomUUID()
): ProvidersEntity = ProvidersEntity.builder {
	id { if (this@toProvidersEntity.id.isNullOrEmpty()) uuid2Add else this@toProvidersEntity.id.toUUID() }
	name { this@toProvidersEntity.name }
	description { this@toProvidersEntity.description }
	url { this@toProvidersEntity.providerPropertyVo?.vpxUrl }
	providerType { this@toProvidersEntity.providerType.toString().uppercase() }
	authRequired { this@toProvidersEntity.authRequired }
	authUsername { this@toProvidersEntity.authUsername }
	// authPassword { externalHostProviderVo.authPassword }
	additionalProperties { this@toProvidersEntity.providerPropertyVo?.additionalProperties2Json }
}
