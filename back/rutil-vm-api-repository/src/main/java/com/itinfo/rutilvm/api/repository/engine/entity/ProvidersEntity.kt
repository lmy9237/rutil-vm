package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.ProviderType
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
 * @property additionalProperties [String]
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
	@Column(unique = true, nullable = true)
	val id: UUID = UUID.randomUUID(),
	var name: String = "",
	var description: String = "",
	var url: String? = "",
	var providerType: String? = "",
	var authRequired: Boolean = false,
	var authUsername: String? = "",
	var authPassword: String? = "",
	@Column(name="_create_date")
	val createDate: LocalDateTime = LocalDateTime.now(),
	@UpdateTimestamp
	@Column(name="_update_date", nullable=true)
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
	override fun toString(): String =
		gson.toJson(this)

	val providerTypeB: ProviderType?
		get() = ProviderType.findByName(providerType ?: "")

	val providerTypeName: String?
		get() = providerTypeB?.name

	class Builder {
		private var bId: UUID = UUID.randomUUID();fun id(block: () -> UUID) { bId = block() }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bUrl: String? = "";fun url(block: () -> String?) { bUrl = block() ?: "" }
		private var bProviderType: String = "";fun providerType(block: () -> String?) { bProviderType = block() ?: "" }
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
		fun build(): ProvidersEntity = ProvidersEntity(bId, bName, bDescription, bUrl, bProviderType, bAuthRequired, bAuthUsername, bAuthPassword, bCreateDate, bUpdateDate, bCustomProperties, bTenantName, bPluginType, bAuthUrl, bAdditionalProperties, bReadOnly, bIsUnmanaged, bAutoSync, bUserDomainName, bProjectName, bProjectDomainName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): ProvidersEntity = Builder().apply(block).build()
	}
}
