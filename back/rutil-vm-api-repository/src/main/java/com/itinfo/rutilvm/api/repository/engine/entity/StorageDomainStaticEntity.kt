package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "storage_domain_static")
data class StorageDomainStaticEntity(
	@Id
	@Column(name="id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val storageName: String? = "",
	// other fields as needed
): Serializable {
	override fun toString(): String = gson.toJson(this)

	class Builder {
		private var bId: UUID? = null;fun id(block: () -> UUID?) { bId = block() }
		private var bStorageName: String = "";fun storageName(block: () -> String?) { bStorageName = block() ?: "" }
		fun build(): StorageDomainStaticEntity = StorageDomainStaticEntity(bId, bStorageName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): StorageDomainStaticEntity = Builder().apply(block).build()
	}
}
