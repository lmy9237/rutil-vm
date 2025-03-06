package com.itinfo.rutilvm.api.repository.engine.entity

import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
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
 * @property engineSessionId [String]
 * @property userId [UUID]
 * @property userName [String]
 * @property groupIds [String]
 * @property roleIds [String]
 * @property sourceIp [String]
 * @property authzName [String]
 */
@Entity
@Table(name="providers", schema = "public")
class ProvidersEntity(
	@Id
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	@Column(unique = true, nullable = true)
	val id: UUID? = null,
)
