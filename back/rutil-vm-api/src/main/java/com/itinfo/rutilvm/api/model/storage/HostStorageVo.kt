package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo

import org.ovirt.engine.sdk4.types.HostStorage
import org.ovirt.engine.sdk4.types.StorageType
import java.io.Serializable

/**
 * [HostStorageVo]
 *
 * @property id [String]
 * @property volumeGroup [String]
 * @property logicalUnits List<[LogicalUnitVo]>
 * @property type [StorageType]
 * @property hostVo [IdentifiedVo]
 */
class HostStorageVo(
    val id: String = "",
    val volumeGroup : String = "",
    val logicalUnits: List<LogicalUnitVo> = listOf(),
    val type: StorageType = StorageType.NFS,
    val hostVo: IdentifiedVo = IdentifiedVo()
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bVolumeGroup: String = "";fun volumeGroup(block: () -> String?) { bVolumeGroup = block() ?: "" }
        private var bLogicalUnits: List<LogicalUnitVo> = listOf();fun logicalUnits(block: () -> List<LogicalUnitVo>?) { bLogicalUnits = block() ?: listOf() }
        private var bType: StorageType = StorageType.NFS;fun type(block: () -> StorageType?) { bType = block() ?: StorageType.NFS }
        private var bHostVo: IdentifiedVo = IdentifiedVo();fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
        fun build(): HostStorageVo = HostStorageVo(bId, bVolumeGroup, bLogicalUnits, bType, bHostVo)
    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: Builder.() -> Unit): HostStorageVo = Builder().apply(block).build()
    }
}

fun HostStorage.toHostStorageVo() : HostStorageVo {
	val hostStorage = this@toHostStorageVo

    return HostStorageVo.builder {
        id { hostStorage.id() }
        logicalUnits { hostStorage.logicalUnits().toIscsiLogicalUnitVos() }
        type { hostStorage.type() }
        hostVo { if(hostStorage.hostPresent()) hostStorage.host().fromHostToIdentifiedVo() else null }
    }
}
fun List<HostStorage>.toHostStorageVos(): List<HostStorageVo> =
    this@toHostStorageVos.map { it.toHostStorageVo() }


fun HostStorage.toIscsiStorageVo() : HostStorageVo {
    return HostStorageVo.builder {
        id { this@toIscsiStorageVo.id() }
        volumeGroup { this@toIscsiStorageVo.volumeGroup().id() }
        logicalUnits { this@toIscsiStorageVo.volumeGroup().logicalUnits().toIscsiLogicalUnitVos() }
        type { this@toIscsiStorageVo.type() }
		hostVo { if(this@toIscsiStorageVo.hostPresent()) this@toIscsiStorageVo.host().fromHostToIdentifiedVo() else null }
    }
}
fun List<HostStorage>.toIscsiStorageVos(): List<HostStorageVo> =
    this@toIscsiStorageVos.map { it.toIscsiStorageVo() }


fun HostStorage.toFibreStorageVo() : HostStorageVo {
    return HostStorageVo.builder {
        id { this@toFibreStorageVo.id() }
        volumeGroup { this@toFibreStorageVo.volumeGroup().id() }
        logicalUnits { this@toFibreStorageVo.volumeGroup().logicalUnits().toFibreLogicalUnitVos() }
        type { this@toFibreStorageVo.type() }
		hostVo { if(this@toFibreStorageVo.hostPresent()) this@toFibreStorageVo.host().fromHostToIdentifiedVo() else null }
    }
}
fun List<HostStorage>.toFibreStorageVos(): List<HostStorageVo> =
    this@toFibreStorageVos.map { it.toFibreStorageVo() }
