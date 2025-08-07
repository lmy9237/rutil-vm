package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.CascadeType
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.OneToOne
import javax.persistence.OrderBy
import javax.persistence.Table

private val log = LoggerFactory.getLogger(DnsResolverConfigurationEntity::class.java)

/**
 *
 * [DnsResolverConfigurationEntity]
 * DNS 설정 정보
 *
 * @property id [UUID]
 * @property name [String] 이름
 * @property description [String] 설명
 * @property active [UUID]
 * @property vmSnapshot [VmSnapshotEntity] Renamed to avoid clash with Snapshot annotation
 * @property baseDisk [BaseDiskEntity]
 * @property storageDomains List<[ImageStorageDomainMapEntity]>
 *
 * @see ImageStorageDomainMapEntity
 */
@Entity
@Table(name = "dns_resolver_configuration")
class DnsResolverConfigurationEntity(
	@Id
	@Column(name = "id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var id: UUID? = null, // Or generate it if DB does it
	// This is the "many" side of the one-to-many relationship
	// It maps to the 'name_server' table.
	// 'mappedBy = "dnsResolverConfiguration"' indicates that the NameServerEntity
	// has a field named 'dnsResolverConfiguration' which owns the relationship (holds the FK).
	// CascadeType.ALL means operations (persist, remove, etc.) on DnsResolverConfigurationEntity
	// will cascade to its nameServers.
	// OrphanRemoval = true means if a NameServerEntity is removed from this list,
	// it will be deleted from the database.
	@OneToMany(
		mappedBy="dnsResolverConfiguration",
		cascade=[CascadeType.ALL, CascadeType.REMOVE],
		orphanRemoval=true,
		fetch = FetchType.LAZY // LAZY is generally good for collections
	)
	@OrderBy("position ASC") // Optional: if you have an order_number column in name_server
	val nameServers: MutableList<NameServerEntity> = mutableListOf()

): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	// Helper methods to manage the bidirectional relationship consistently
	fun addNameServer(nameServer: NameServerEntity) {
		nameServers.add(nameServer)
		nameServer.dnsResolverConfiguration = this
	}

	fun removeNameServer(nameServer: NameServerEntity) {
		nameServers.remove(nameServer)
		nameServer.dnsResolverConfiguration = null
	}

	override fun equals(other: Any?): Boolean { // Basic equals/hashCode for entities
		if (this === other) return true
		if (other !is DnsResolverConfigurationEntity) return false
		return id == other.id
	}

	override fun hashCode(): Int = id.hashCode()

	class Builder {
		private var bId: UUID? = null;fun id(block: () -> UUID?) { bId = block() }
		private var bNameServers: MutableList<NameServerEntity> = mutableListOf();fun dnsConfiguration(block: () -> MutableList<NameServerEntity>?) { bNameServers = block() ?: mutableListOf() }
		fun build(): DnsResolverConfigurationEntity = DnsResolverConfigurationEntity(bId, bNameServers)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): DnsResolverConfigurationEntity = Builder().apply(block).build()
	}
}
