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

/**
 *
 * [BaseDiskEntity]
 * 디스크 기본정보
 *
 * @property diskId [UUID]
 * @property wipeAfterDelete [Boolean]
 * @property propagateErrors [String]
 * @property diskAlias [String]
 * @property disDescription [String]
 * @property shareable [Boolean]
 * @property sgio [Int]
 * @property diskStorageType [Int]
 * @property cinderVolumeType [String]
 * @property diskContentType [Int]
 * @property backup [String]
 * @property backupMode [String]
 */
@Entity
@Table(name = "base_disks")
class BaseDiskEntity(
	@Id
	@Column(name = "disk_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val diskId: UUID? = null,
	val wipeAfterDelete: Boolean = false,
	val propagateErrors: String? = "",
	val diskAlias: String? = "",
	val disDescription: String? = "",
	val shareable: Boolean? = false,
	val sgio: Int = 0,
	val diskStorageType: Int = 0, //DiskContentType
	val cinderVolumeType: String? = "",
	val diskContentType: Int = 0,
	val backup: String? = "",
	val backupMode: String? = "",

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
		private var bWipeAfterDelete: Boolean = false; fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() ?: false}
		private var bPropagateErrors: String = ""; fun propagateErrors(block: () -> String?) { bPropagateErrors = block() ?: ""}
		private var bDiskAlias: String = ""; fun diskAlias(block: () -> String?) { bDiskAlias = block() ?: ""}
		private var bDisDescription: String = ""; fun disDescription(block: () -> String?) { bDisDescription = block() ?: ""}
		private var bShareable: Boolean = false; fun shareable(block: () -> Boolean?) { bShareable = block() ?: false}
		private var bSgio: Int = 0; fun sgio(block: () -> Int?) { bSgio = block() ?: 0}
		private var bDiskStorageType: Int = 0; fun diskStorageType(block: () -> Int?) { bDiskStorageType = block() ?: 0}
		private var bCinderVolumeType: String = ""; fun cinderVolumeType(block: () -> String?) { bCinderVolumeType = block() ?: ""}
		private var bDiskContentType: Int = 0; fun diskContentType(block: () -> Int?) { bDiskContentType = block() ?: 0}
		private var bBackup: String = ""; fun backup(block: () -> String?) { bBackup = block() ?: ""}
		private var bBackupMode: String = ""; fun backupMode(block: () -> String?) { bBackupMode = block() ?: ""}
		// private var bUnregisteredDisk: UnregisteredDiskEntity? = null; fun unregisteredDisk(block: () -> UnregisteredDiskEntity?) { bUnregisteredDisk = block() }

		fun build(): BaseDiskEntity = BaseDiskEntity(bDiskId, bWipeAfterDelete, bPropagateErrors, bDiskAlias, bDisDescription, bShareable, bSgio, bDiskStorageType, bCinderVolumeType, bDiskContentType, bBackup, bBackupMode, /*bUnregisteredDisk*/)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): BaseDiskEntity = Builder().apply(block).build()
	}
}


fun BaseDiskEntity.toDiskId(): String {
	return diskId.toString()
}

fun List<BaseDiskEntity>.toDiskIds(): List<String> =
	this@toDiskIds.map { it.toDiskId() }

