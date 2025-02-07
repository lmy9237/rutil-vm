package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.IdentifiedVo

import org.ovirt.engine.sdk4.types.HostStorage
import org.ovirt.engine.sdk4.types.LogicalUnit
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

fun HostStorage.toIscsiHostStorageVo() : HostStorageVo {
    val units: List<LogicalUnit> = this@toIscsiHostStorageVo.logicalUnits()
    val host: IdentifiedVo =
        if(this@toIscsiHostStorageVo.hostPresent()) {
            IdentifiedVo.builder { id { this@toIscsiHostStorageVo.host().id() } }
        }else{ IdentifiedVo() }
    return HostStorageVo.builder {
        id { this@toIscsiHostStorageVo.id() }
        logicalUnits { units.toIscsiLogicalUnitVos() }
        type { this@toIscsiHostStorageVo.type() }
        hostVo { host }
    }
}
fun List<HostStorage>.toIscsiHostStorageVos(): List<HostStorageVo> =
    this@toIscsiHostStorageVos.map { it.toIscsiHostStorageVo() }


fun HostStorage.toFibreHostStorageVo() : HostStorageVo {
    val units: List<LogicalUnit> = this@toFibreHostStorageVo.logicalUnits()
    val host: IdentifiedVo =
        if(this@toFibreHostStorageVo.hostPresent()) {
            IdentifiedVo.builder { id { this@toFibreHostStorageVo.host().id() } }
        }else{ IdentifiedVo() }
    return HostStorageVo.builder {
        id { this@toFibreHostStorageVo.id() }
        logicalUnits { units.toFibreLogicalUnitVos() }
        type { this@toFibreHostStorageVo.type() }
        hostVo { host }
    }
}
fun List<HostStorage>.toFibreHostStorageVos(): List<HostStorageVo> =
    this@toFibreHostStorageVos.map { it.toFibreHostStorageVo() }


fun HostStorage.toIscsiStorageVo() : HostStorageVo {
    val units: List<LogicalUnit> = this@toIscsiStorageVo.volumeGroup().logicalUnits()
    val host: IdentifiedVo =
        if(this@toIscsiStorageVo.hostPresent()) {
            IdentifiedVo.builder { id { this@toIscsiStorageVo.host().id() } }
        }else{ IdentifiedVo() }
    return HostStorageVo.builder {
        id { this@toIscsiStorageVo.id() }
        volumeGroup { this@toIscsiStorageVo.volumeGroup().id() }
        logicalUnits { units.toIscsiLogicalUnitVos() }
        type { this@toIscsiStorageVo.type() }
        hostVo { host }
    }
}
fun List<HostStorage>.toIscsiStorageVos(): List<HostStorageVo> =
    this@toIscsiStorageVos.map { it.toIscsiStorageVo() }


fun HostStorage.toFibreStorageVo() : HostStorageVo {
    val units: List<LogicalUnit> = this@toFibreStorageVo.volumeGroup().logicalUnits()
    val host: IdentifiedVo =
        if(this@toFibreStorageVo.hostPresent()) {
            IdentifiedVo.builder { id { this@toFibreStorageVo.host().id() } }
        }else{ IdentifiedVo() }
    return HostStorageVo.builder {
        id { this@toFibreStorageVo.id() }
        volumeGroup { this@toFibreStorageVo.volumeGroup().id() }
        logicalUnits { units.toFibreLogicalUnitVos() }
        type { this@toFibreStorageVo.type() }
        hostVo { host }
    }
}
fun List<HostStorage>.toFibreStorageVos(): List<HostStorageVo> =
    this@toFibreStorageVos.map { it.toFibreStorageVo() }