package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostToIdentifiedVo
import com.itinfo.rutilvm.api.model.storage.LogicalUnitVo
import com.itinfo.rutilvm.api.model.storage.StorageDomainVo
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.storage.toLogicalUnitVos
import org.ovirt.engine.sdk4.builders.HostStorageBuilder
import org.ovirt.engine.sdk4.builders.LogicalUnitBuilder
import org.ovirt.engine.sdk4.builders.VolumeGroupBuilder

import org.ovirt.engine.sdk4.types.HostStorage
import org.ovirt.engine.sdk4.types.StorageType
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(HostStorageVo::class.java)
/**
 * [HostStorageVo]
 * /ovirt-engine/api/hosts/{id}/storage
 * iscsi fc만 출력 (nfs는 없음)
 *
 * @property type [StorageType]
 */
class HostStorageVo(
	val id: String = "",
    val type: StorageType = StorageType.NFS,
	val logicalUnitVos: List<LogicalUnitVo> = listOf(),
	val hostVo: IdentifiedVo = IdentifiedVo()
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bType: StorageType = StorageType.NFS;fun type(block: () -> StorageType?) { bType = block() ?: StorageType.NFS }
		private var bLogicalUnitVos: List<LogicalUnitVo> = listOf();fun logicalUnitVos(block: () -> List<LogicalUnitVo>?) { bLogicalUnitVos = block() ?: listOf() }
		private var bHostVo: IdentifiedVo = IdentifiedVo();fun hostVo(block: () -> IdentifiedVo?) { bHostVo = block() ?: IdentifiedVo() }
		fun build(): HostStorageVo = HostStorageVo(bId, bType, bLogicalUnitVos, bHostVo)
    }

    companion object {
        inline fun builder(block: Builder.() -> Unit): HostStorageVo = Builder().apply(block).build()
    }
}

fun HostStorage.toHostStorageVo() : HostStorageVo {
	val hostStorage = this@toHostStorageVo
	return HostStorageVo.builder {
		id { hostStorage.id() }
		type { hostStorage.type() }
		logicalUnitVos { hostStorage.logicalUnits().toLogicalUnitVos() }
		hostVo { hostStorage.host().fromHostToIdentifiedVo() }
	}
}
fun List<HostStorage>.toHostStorageVos(): List<HostStorageVo> =
	this@toHostStorageVos.map { it.toHostStorageVo() }


