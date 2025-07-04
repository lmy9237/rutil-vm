package com.itinfo.rutilvm.api.repository.engine.entity

import com.google.gson.annotations.SerializedName
import com.itinfo.rutilvm.api.ovirt.business.ProviderTypeB
import com.itinfo.rutilvm.common.fromJson
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.hibernate.annotations.UpdateTimestamp
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(DiskVmElementEntity::class.java)

/**
 * [ProvidersEntity]
 * 관리 > 공급자
 *
 * @property id [UUID]
 * @property name [String]
 * @property description [String]
 * @property url [String]
 * @property providerType [String] 공급자 유형
 * @property authRequired [Boolean]
 * @property authUsername [String]
 * @property authPassword [String]
 * @property createDate [LocalDateTime]
 * @property updateDate [LocalDateTime]
 * @property customProperties [String]
 * @property tenantName [String]
 * @property pluginType [String] 네트워크 플러그인 유형
 * @property authUrl [String]
 * @property _additionalProperties [String] 기타 속성
 * @property readOnly [Boolean]
 * @property isUnmanaged [Boolean]
 * @property autoSync [Boolean]
 * @property userDomainName [String]
 * @property projectName [String]
 * @property projectDomainName [String]
 */
@Entity
@Table(name="providers", schema = "public")
class ProvidersEntity(
	@Id
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	@Column(name="id", unique = true, nullable = true)
	val id: UUID? = UUID.randomUUID(),
	var name: String? = "",
	var description: String? = "",
	var url: String? = "",
	@Column(name="provider_type", unique=false, nullable = true)
	var _providerType: String? = "",
	var authRequired: Boolean? = false,
	var authUsername: String? = null,
	var authPassword: String? = null,
	@Column(name="_create_date")
	val createDate: LocalDateTime = LocalDateTime.now(),
	@UpdateTimestamp
	@Column(name="_update_date", nullable=true)
	var updateDate: LocalDateTime? = null,
	var customProperties: String? = null,
	var tenantName: String? = null,
	var pluginType: String? = null,
	var authUrl: String? = null,
	@Column(name="additional_properties", nullable=true)
	var _additionalProperties: String? = null,
	var readOnly: Boolean = false,
	var isUnmanaged: Boolean = false,
	var autoSync: Boolean = false,
	var userDomainName: String? = null,
	var projectName: String? = null,
	var projectDomainName: String? = null,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	val providerType: ProviderTypeB?		get() = ProviderTypeB.forCode(_providerType)
	val additionalProperties: AdditionalProperties4Vmware? 	get() = gson.fromJson<AdditionalProperties4Vmware>(_additionalProperties ?: "")

	class Builder {
		private var bId: UUID? = UUID.randomUUID();fun id(block: () -> UUID?) { bId = block() }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bUrl: String? = "";fun url(block: () -> String?) { bUrl = block() ?: "" }
		private var bProviderType: String = "";fun providerType(block: () -> String?) { bProviderType = block() ?: "" }
		private var bAuthRequired: Boolean = false;fun authRequired(block: () -> Boolean?) { bAuthRequired = block() ?: false }
		private var bAuthUsername: String? = null;fun authUsername(block: () -> String?) { bAuthUsername = block() }
		private var bAuthPassword: String? = null;fun authPassword(block: () -> String?) { bAuthPassword = block() }
		private var bCreateDate: LocalDateTime = LocalDateTime.now();fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() ?: LocalDateTime.now() }
		private var bUpdateDate: LocalDateTime? = null;fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bCustomProperties: String? = null;fun customProperties(block: () -> String?) { bCustomProperties = block() }
		private var bTenantName: String? = null;fun tenantName(block: () -> String?) { bTenantName = block() }
		private var bPluginType: String? = null;fun pluginType(block: () -> String?) { bPluginType = block() }
		private var bAuthUrl: String? = null;fun authUrl(block: () -> String?) { bAuthUrl = block() }
		private var bAdditionalProperties: String? = null;fun additionalProperties(block: () -> String?) { bAdditionalProperties = block() }
		private var bReadOnly: Boolean = false;fun readOnly(block: () -> Boolean?) { bReadOnly = block() ?: false }
		private var bIsUnmanaged: Boolean = false;fun isUnmanaged(block: () -> Boolean?) { bIsUnmanaged = block() ?: false }
		private var bAutoSync: Boolean = false;fun autoSync(block: () -> Boolean?) { bAutoSync = block() ?: false }
		private var bUserDomainName: String? = null;fun userDomainName(block: () -> String?) { bUserDomainName = block() }
		private var bProjectName: String? = null;fun projectName(block: () -> String?) { bProjectName = block() }
		private var bProjectDomainName: String? = null;fun projectDomainName(block: () -> String?) { bProjectDomainName = block() }
		fun build(): ProvidersEntity = ProvidersEntity(bId, bName, bDescription, bUrl, bProviderType, bAuthRequired, bAuthUsername, bAuthPassword, bCreateDate, bUpdateDate, bCustomProperties, bTenantName, bPluginType, bAuthUrl, bAdditionalProperties, bReadOnly, bIsUnmanaged, bAutoSync, bUserDomainName, bProjectName, bProjectDomainName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): ProvidersEntity = Builder().apply(block).build()
	}
}

/**
 * [AdditionalProperties4Vmware]
 * Vmware 외부공급자 기타 속성
 */
class AdditionalProperties4Vmware(
	@SerializedName("storagePoolId") val _storagePoolId: List<Any>? = emptyList(),
	@SerializedName("proxyHostId") val _proxyHostId: List<Any>? = emptyList(),
	@SerializedName("vCenter") val vcenter: String? = "",
	@SerializedName("esx") val esx: String? = "",
	@SerializedName("dataCenter") val dataCenter: String? = "",
	@SerializedName("verifySSL") val verifySSL: Boolean? = false,
): Serializable {
	override fun toString(): String =
		gson.toJson(this@AdditionalProperties4Vmware)


	val storagePoolId: String			get() =
		if (_storagePoolId.isNullOrEmpty()) "" else (gson.fromJson<AdditionalPropertiesUUIDWrapper>(_storagePoolId[1].toString())).uuid
	val storagePoolIdFull: String		get() =
		if (_storagePoolId.isNullOrEmpty()) "null" else ("[\"org.ovirt.engine.core.compat.Guid\", {\"uuid\": \"${storagePoolId}\"}]")
	val proxyHostId: String 			get() =
		if (_proxyHostId.isNullOrEmpty()) "" else (gson.fromJson<AdditionalPropertiesUUIDWrapper>(_proxyHostId[1].toString())).uuid
	val proxyHostIdFull: String 		get() =
		if (_proxyHostId.isNullOrEmpty()) "null" else ("[\"org.ovirt.engine.core.compat.Guid\", {\"uuid\": \"${proxyHostId}\"}]")

	class Builder {
		private var bStoragePoolId: List<Any>? = emptyList(); fun storagePoolId(block: () -> List<Any>?) { bStoragePoolId = block() ?: emptyList() }
		private var bProxyHostId: List<Any>? = emptyList(); fun proxyHostId(block: () -> List<Any>?) { bProxyHostId = block() ?: emptyList() }
		private var bVcenter: String? = ""; fun vcenter(block: () -> String?) { bVcenter = block() ?: "" }
		private var bEsx: String? = ""; fun esx(block: () -> String?) { bEsx = block() ?: "" }
		private var bDataCenter: String? = ""; fun dataCenter(block: () -> String?) { bDataCenter = block() ?: "" }
		private var bVerifySSL: Boolean? = false; fun verifySSL(block: () -> Boolean?) { bVerifySSL = block() ?: false }

		fun build(): AdditionalProperties4Vmware = AdditionalProperties4Vmware( bStoragePoolId, bProxyHostId, bVcenter, bEsx, bDataCenter, bVerifySSL,)
	}
	companion object {
		inline fun builder(block: Builder.() -> Unit): AdditionalProperties4Vmware = Builder().apply(block).build()
	}
}

data class AdditionalPropertiesUUIDWrapper(
	@SerializedName("uuid") val uuid: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this@AdditionalPropertiesUUIDWrapper)
}

fun String?.toWrapUuid(): List<Any>? =
	this@toWrapUuid?.takeIf { it.isNotBlank() }?.let {
		listOf(
			"org.ovirt.engine.core.compat.Guid",
			mapOf("uuid" to it)
		)
	}
