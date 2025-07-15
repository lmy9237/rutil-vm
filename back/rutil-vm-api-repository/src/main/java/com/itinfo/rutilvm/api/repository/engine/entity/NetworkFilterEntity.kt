package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson // Assuming you have this
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

/**
 * [NetworkFilterEntity]
 * 네트워크 필터링
 *
 * Represents a Network Filter. Network filters are used to define policies
 * or conditions for network traffic, often associated with VNIC profiles.
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name = "network_filter")
class NetworkFilterEntity(

	// The primary key is 'filter_name' according to the DDL,
	// but it also has a unique 'filter_id'.
	// We'll use filterId as the JPA @Id and reference the name as a unique column.
	@Id
	@Column(name = "filter_id", unique = true, nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val filterId: UUID? = null,
	val filterName: String, // This is the primary key in the DB, but we use filterId as JPA @Id
	val version: String
) : Serializable {

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bFilterId: UUID? = null; fun filterId(block: () -> UUID?) { bFilterId = block() }
		private var bFilterName: String = ""; fun filterName(block: () -> String?) { bFilterName = block() ?: "" }
		private var bVersion: String = ""; fun version(block: () -> String?) { bVersion = block() ?: "" }
		fun build(): NetworkFilterEntity = NetworkFilterEntity(bFilterId, bFilterName, bVersion)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): NetworkFilterEntity = Builder().apply(block).build()
	}
}
