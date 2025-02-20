package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

private val log = LoggerFactory.getLogger(DiskVmElementEntity::class.java)

/**
 * [EngineSessionsEntity]
 * <관리 > 활성 사용자 세션> 기준 정보
 *
 * @property id [UUID]
 * @property engineSessionId [String]
 * @property userId [UUID]
 * @property userName [String]
 * @property groupIds [String]
 * @property roleIds [String]
 * @property sourceIp [String]
 * @property authzName [String]
 */
@Entity
@Table(name="engine_sessions", schema = "public")
class EngineSessionsEntity(
	@Id
	@Column(unique = true, nullable = true)
	val id: Long = 0L,
	val engineSessionId: String = "",
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val userId: UUID? = null,
	val userName: String = "",
	val groupIds: String? = "",
	val roleIds: String? = "",
	val sourceIp: String? = "",
	val authzName: String? = "",
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bId: Long = 0L;fun id(block: () -> Long?) { bId = block() ?: 0L }
		private var bEngineSessionId: String = "";fun engineSessionId(block: () -> String?) { bEngineSessionId = block() ?: "" }
		private var bUserId: UUID? = null;fun userId(block: () -> UUID?) { bUserId = block() }
		private var bUserName: String = "";fun userName(block: () -> String?) { bUserName = block() ?: "" }
		private var bGroupIds: String? = "";fun groupIds(block: () -> String?) { bGroupIds = block() ?: "" }
		private var bRoleIds: String? = "";fun roleIds(block: () -> String?) { bRoleIds = block() ?: "" }
		private var bSourceIp: String? = "";fun sourceIp(block: () -> String?) { bSourceIp = block() ?: "" }
		private var bAuthzName: String? = "";fun authzName(block: () -> String?) { bAuthzName = block() ?: "" }
		fun build(): EngineSessionsEntity = EngineSessionsEntity(bId, bEngineSessionId, bUserId, bUserName, bGroupIds, bRoleIds, bSourceIp, bAuthzName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): EngineSessionsEntity = Builder().apply(block).build()
	}
}
