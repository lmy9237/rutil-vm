package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.computing.HostStorageVo
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
    val type: StorageType = StorageType.NFS,
	val address: String = "",
	val path: String = "",
	val nfsVersion: NfsVersion = NfsVersion.AUTO,
    val volumeGroupVo : VolumeGroupVo = VolumeGroupVo(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bType: StorageType = StorageType.NFS;fun type(block: () -> StorageType?) { bType = block() ?: StorageType.NFS }
		private var bAddress: String = "";fun address(block: () -> String?) { bAddress = block() ?: "" }
		private var bPath: String = "";fun path(block: () -> String?) { bPath = block() ?: "" }
		private var bNfsVersion: NfsVersion = NfsVersion.AUTO;fun nfsVersion(block: () -> NfsVersion?) { bNfsVersion = block() ?: NfsVersion.AUTO }
        private var bVolumeGroupVo: VolumeGroupVo = VolumeGroupVo();fun volumeGroupVo(block: () -> VolumeGroupVo?) { bVolumeGroupVo = block() ?: VolumeGroupVo() }
        fun build(): StorageVo = StorageVo(bType, bAddress, bPath, bNfsVersion, bVolumeGroupVo)
    }

    companion object {
        inline fun builder(block: Builder.() -> Unit): StorageVo = Builder().apply(block).build()
    }
}

fun HostStorage.toStorageVo() : StorageVo {
	val storage = this@toStorageVo
	return StorageVo.builder {
		type { storage.type() }
		address { if(storage.addressPresent()) storage.address() else null }
		path { if(storage.pathPresent()) storage.path() else null }
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
        type { nfs.type() }
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
		type { hostStorage.type() }
		volumeGroupVo { if(hostStorage.volumeGroupPresent()) hostStorage.volumeGroup().toVolumeGroupVo() else null }
	}
}
fun List<HostStorage>.toGroupHostStorageVos(): List<StorageVo> =
	this@toGroupHostStorageVos.map { it.toGroupHostStorageVo() }



// NFS
fun StorageVo.toAddNFS(): HostStorage {
	return HostStorageBuilder()
		.type(StorageType.fromValue(type.value()))
		.address(address)
		.path(path)
		.build()
}

// ISCSI, FC
fun StorageVo.toAddBlockStorage(): HostStorage {
	return HostStorageBuilder()
		.type(StorageType.fromValue(type.value()))
		.logicalUnits(volumeGroupVo.logicalUnitVos.map {
			LogicalUnitBuilder().id(it.id).build()
		})
		.overrideLuns(true) // 생성 기능 강제 처리
		.build()
}

fun StorageVo.toImportBlockStorage(): HostStorage {
	return HostStorageBuilder()
		.type(StorageType.fromValue(type.value()))
		.logicalUnits(volumeGroupVo.logicalUnitVos.map { logicalUnitVo ->
			LogicalUnitBuilder().id(logicalUnitVo.id).build()
		})
		.volumeGroup(VolumeGroupBuilder().id(volumeGroupVo.id).build())
		.build()
		// .overrideLuns(true)
		// overrideLuns = 생성기능 강제 처리
		// This operation might be unrecoverable and destructive.
		// the following luns are alread in use,"
		// 버튼 "approve operation"
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
//
// // Fibre Channel
// fun StorageVo.toAddFCPBuilder(): HostStorage {
// 	return HostStorageBuilder()
// 		.type(StorageType.fromValue(this.type.value()))
// 		.logicalUnits(this.volumeGroupVo.logicalUnitVos.map {
// 			LogicalUnitBuilder().id(it.id).build()
// 		})
// 		.overrideLuns(true)
// 		// overrideLuns = 생성기능 강제 처리
// 		// This operation might be unrecoverable and destructive.
// 		// the following luns are alread in use,"
// 		// 버튼 "approve operation"
// 		// .volumeGroup(
// 		// 	VolumeGroupBuilder().logicalUnits(
// 		// 		this@toAddFCPBuilder.logicalUnits.map {
// 		// 			LogicalUnitBuilder().id(it).build()
// 		// 		}
// 		// 	)
// 		// )
// 		.build()
// }
