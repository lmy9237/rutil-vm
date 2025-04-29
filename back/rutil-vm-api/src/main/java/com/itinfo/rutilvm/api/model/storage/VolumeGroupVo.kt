package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.VolumeGroup
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(VolumeGroupVo::class.java)
/**
 * [VolumeGroupVo]
 *
 * @property id [String]
 * @property logicalUnitVos List<[LogicalUnitVo]>
 */
class VolumeGroupVo(
    val id: String = "",
    val logicalUnitVos: List<LogicalUnitVo> = listOf(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bLogicalUnitVos: List<LogicalUnitVo> = listOf();fun logicalUnitVos(block: () -> List<LogicalUnitVo>?) { bLogicalUnitVos = block() ?: listOf() }
        fun build(): VolumeGroupVo = VolumeGroupVo(bId, bLogicalUnitVos)
    }

    companion object {
        inline fun builder(block: Builder.() -> Unit): VolumeGroupVo = Builder().apply(block).build()
    }
}

fun VolumeGroup.toVolumeGroupVo() : VolumeGroupVo {
	val volumeGroup = this@toVolumeGroupVo
    return VolumeGroupVo.builder {
        id { volumeGroup.id() }
		logicalUnitVos { volumeGroup.logicalUnits().toLogicalUnitVos() }
    }
}
fun List<VolumeGroup>.toVolumeGroupVos(): List<VolumeGroupVo> =
    this@toVolumeGroupVos.map { it.toVolumeGroupVo() }
