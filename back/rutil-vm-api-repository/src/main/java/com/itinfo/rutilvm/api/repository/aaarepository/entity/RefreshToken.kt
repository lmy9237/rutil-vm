package com.itinfo.rutilvm.api.repository.aaarepository.entity

import com.itinfo.rutilvm.common.gson

import org.hibernate.annotations.Type
import java.io.Serializable
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

/**
 * [RefreshToken]
 * engine 엔티티: REFRESH_TOKEn
 *
 * @see com.itinfo.dao.aaa.OvirtUser
 */
@Entity
@Table(name = "refresh_token", schema = "aaa_jdbc")
class RefreshToken(
	@Id
	@Type(type="pg-uuid")
	@Column(unique=true,nullable=false, columnDefinition = "uuid")
	val uuid: UUID = UUID.randomUUID(),
	@Column(nullable=false)
	var externalId: String,
	@Column(nullable=false)
	var refreshToken: String,
): Serializable {

	fun updateToken(newRefreshToken: String = ""): RefreshToken {
		this.refreshToken = newRefreshToken
		return this
	}

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bUuid: UUID = UUID.randomUUID();fun uuid(block: () -> UUID) { bUuid = block() }
		private var bExternalId: String = "";fun externalId(block: () -> String?) { bExternalId = block() ?: "" }
		private var bRefreshToken: String = "";fun refreshToken(block: () -> String?) { bRefreshToken = block() ?: "" }
		fun build(): RefreshToken = RefreshToken(bUuid, bExternalId, bRefreshToken)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): RefreshToken = Builder().apply(block).build()
	}
}