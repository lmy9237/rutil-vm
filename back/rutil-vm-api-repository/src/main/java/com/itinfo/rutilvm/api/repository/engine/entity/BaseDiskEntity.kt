package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.OneToOne
import javax.persistence.Table

/**
 *
 * [BaseDiskEntity]
 * 디스크 기본정보
 *
 * @property diskId [UUID]
 * @property diskAlias [String] The overall VM snapshot description
 */
@Entity
@Table(name = "base_disks")
class BaseDiskEntity(
	@Id
	@Column(name = "disk_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val diskId: UUID? = null,
	val diskAlias: String? = "",
	val shareable: Boolean? = false,

	/*@OneToOne(
		mappedBy="baseDisk",
		fetch=FetchType.LAZY
	)
	val unregisteredDisk: UnregisteredDiskEntity? = null*/
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bDiskId: UUID? = null;fun diskId(block: () -> UUID?) { bDiskId = block() }
		private var bDiskAlias: String = "";fun diskAlias(block: () -> String?) { bDiskAlias = block() ?: "" }
		private var bSharable: Boolean? = false;fun shareable(block: () -> Boolean?) { bSharable = block() ?: false }
		// private var bUnregisteredDisk: UnregisteredDiskEntity? = null; fun unregisteredDisk(block: () -> UnregisteredDiskEntity?) { bUnregisteredDisk = block() }
		fun build(): BaseDiskEntity = BaseDiskEntity(bDiskId, bDiskAlias, bSharable, /*bUnregisteredDisk*/)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): BaseDiskEntity = Builder().apply(block).build()
	}
}
