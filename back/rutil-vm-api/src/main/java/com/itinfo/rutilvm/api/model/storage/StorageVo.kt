package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.computing.HostStorageVo
import com.itinfo.rutilvm.api.ovirt.business.StorageTypeB
import com.itinfo.rutilvm.api.ovirt.business.toStorageType
import com.itinfo.rutilvm.api.ovirt.business.toStorageTypeB
import org.ovirt.engine.sdk4.builders.HostStorageBuilder
import org.ovirt.engine.sdk4.builders.LogicalUnitBuilder
import org.ovirt.engine.sdk4.builders.VolumeGroupBuilder

import org.ovirt.engine.sdk4.types.HostStorage
import org.ovirt.engine.sdk4.types.NfsVersion
import org.ovirt.engine.sdk4.types.StorageType
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(StorageVo::class.java)
/**
 * [StorageVo]
 * /ovirt-engine/api/storagedomains/{id}
 *
 * @property type [StorageType]
 */
class StorageVo(
    val type: StorageTypeB = StorageTypeB.nfs,
	val address: String = "",
	val path: String = "",
	val originPath: String = "",
	val nfsVersion: NfsVersion = NfsVersion.AUTO,
    val volumeGroupVo : VolumeGroupVo = VolumeGroupVo(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bType: StorageTypeB = StorageTypeB.nfs;fun type(block: () -> StorageTypeB?) { bType = block() ?: StorageTypeB.nfs }
		private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bPath: String = "";fun path(block: () -> String?) { bPath = block() ?: "" }
		private var bOriginPath: String = "";fun originPath(block: () -> String?) { bOriginPath = block() ?: "" }
		private var bNfsVersion: NfsVersion = NfsVersion.AUTO;fun nfsVersion(block: () -> NfsVersion?) { bNfsVersion = block() ?: NfsVersion.AUTO }
        private var bVolumeGroupVo: VolumeGroupVo = VolumeGroupVo();fun volumeGroupVo(block: () -> VolumeGroupVo?) { bVolumeGroupVo = block() ?: VolumeGroupVo() }
        fun build(): StorageVo = StorageVo(bType, bAddress, bPath, bOriginPath, bNfsVersion, bVolumeGroupVo)
    }

    companion object {
        inline fun builder(block: Builder.() -> Unit): StorageVo = Builder().apply(block).build()
    }
}

fun HostStorage.toStorageVo() : StorageVo {
	val storage = this@toStorageVo
	return StorageVo.builder {
		type { storage.type().toStorageTypeB() }
		address { if(storage.addressPresent()) storage.address() else null }
		path { if(storage.pathPresent()) storage.path() else null }
		originPath {
			if(storage.addressPresent() && storage.pathPresent()){ storage.address() + ":" + storage.path() }
			else null
		}
		nfsVersion { if(storage.nfsVersionPresent()) storage.nfsVersion() else null}
		volumeGroupVo { if(storage.volumeGroupPresent()) storage.volumeGroup().toVolumeGroupVo() else null }
	}
}
fun List<HostStorage>.toStorageVos(): List<StorageVo> =
	this@toStorageVos.map { it.toStorageVo() }

// Type 이 NFS
fun HostStorage.toNfsStorageVo() : StorageVo {
	val nfs = this@toNfsStorageVo
    return StorageVo.builder {
        type { nfs.type().toStorageTypeB() }
		address { nfs.address() }
		path { nfs.path() }
		nfsVersion { nfs.nfsVersion() }
    }
}
fun List<HostStorage>.toNfsStorageVos(): List<StorageVo> =
    this@toNfsStorageVos.map { it.toNfsStorageVo() }


// Type 이 Iscsi / FC
fun HostStorage.toGroupHostStorageVo() : StorageVo {
	val hostStorage = this@toGroupHostStorageVo
	return StorageVo.builder {
		type { hostStorage.type().toStorageTypeB() }
		volumeGroupVo { if(hostStorage.volumeGroupPresent()) hostStorage.volumeGroup().toVolumeGroupVo() else null }
	}
}
fun List<HostStorage>.toGroupHostStorageVos(): List<StorageVo> =
	this@toGroupHostStorageVos.map { it.toGroupHostStorageVo() }


fun StorageVo.toHostStorageBuilder(): HostStorageBuilder {
	return HostStorageBuilder()
		.type(type.toStorageType())
}

// NFS
fun StorageVo.toAddNFS(): HostStorage {
	return toHostStorageBuilder()
		.address(address)
		.path(path)
		.overrideLuns(true) // 덮어쓰기
		.build()
}

// ISCSI, FC
fun StorageVo.toAddBlockStorage(): HostStorage {
	return toHostStorageBuilder()
		.logicalUnits(volumeGroupVo.logicalUnitVos.map {
			LogicalUnitBuilder().id(it.id).build()
		})
		.overrideLuns(true) // 덮어쓰기
		.build()
}

fun StorageVo.toImportNFS(): HostStorage {
	return toHostStorageBuilder()
		.address(address)
		.path(path)
		.overrideLuns(false) // 덮어쓰기 방지
		.build()
}

fun StorageVo.toImportBlockStorage(): HostStorage {
	return toHostStorageBuilder()
		.volumeGroup(VolumeGroupBuilder().id(volumeGroupVo.id).build())
		.logicalUnits(volumeGroupVo.logicalUnitVos.map {
			LogicalUnitBuilder()
				.id(it.id)
				.serial(it.serial)
				.vendorId(it.vendorId)
				.volumeGroupId(it.volumeGroupId)
				.build()
		})
		.overrideLuns(false)  // 덮어쓰기 방지
		.build()
}


// // ISCSI
// fun StorageVo.toAddISCSIBuilder(): HostStorage {
// 	return HostStorageBuilder()
// 		.type(StorageType.fromValue(this.type.value()))
// 		.logicalUnits(this.volumeGroupVo.logicalUnitVos.map {
// 			LogicalUnitBuilder().id(it.id).build()
// 		})
// 		.build()
// }
