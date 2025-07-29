package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.ovirt.business.DiskContentTypeB
import com.itinfo.rutilvm.api.ovirt.business.DiskStatusB
import com.itinfo.rutilvm.api.ovirt.business.model.TreeNavigatableType
import com.itinfo.rutilvm.api.repository.engine.AllDisksRepository
import com.itinfo.rutilvm.api.repository.engine.entity.toDiskImageVosFromAllDiskEntities
import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.StorageDomain
import org.ovirt.engine.sdk4.types.StorageDomainStatus
import java.io.Serializable

class TreeNavigationalStorageDomain (
    id: String = "",
    name: String = "",
	status: StorageDomainStatus? = null,
    val disks: List<TreeNavigatable<DiskStatusB>> = listOf()
): TreeNavigational<StorageDomainStatus>(TreeNavigatableType.STORAGE_DOMAIN, id, name, status), Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
        private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bStatus: StorageDomainStatus? = null;fun status(block: () -> StorageDomainStatus?) { bStatus = block() }
        private var bDisks: List<TreeNavigatable<DiskStatusB>> = listOf(); fun disks(block: () -> List<TreeNavigatable<DiskStatusB>>?) { bDisks = block() ?: listOf() }
        fun build(): TreeNavigationalStorageDomain = TreeNavigationalStorageDomain(bId, bName, bStatus, bDisks)
    }
    companion object {
        inline fun builder(block: TreeNavigationalStorageDomain.Builder.() -> Unit): TreeNavigationalStorageDomain = TreeNavigationalStorageDomain.Builder().apply(block).build()
    }
}

fun StorageDomain.toNavigationalWithStorageDomains(
	conn: Connection?=null,
	rAllDisks: AllDisksRepository?=null,
): TreeNavigationalStorageDomain {
    // 디스크 목록 출력삭제
	val allDisks: List<DiskImageVo> = (rAllDisks?.findAllByStorageDomainIdOrderByDiskAliasAsc(
		this@toNavigationalWithStorageDomains.id()
	) ?: emptyList())
		.toDiskImageVosFromAllDiskEntities().filter {
		it.contentType == DiskContentTypeB.data || it.contentType == DiskContentTypeB.iso
	}
	return TreeNavigationalStorageDomain.builder {
		id { this@toNavigationalWithStorageDomains.id() }
		name { this@toNavigationalWithStorageDomains.name() }
		status { this@toNavigationalWithStorageDomains.status() }
		disks { allDisks }
		// disks { allDisks.toNavigationalsFromDiskImageVos() }
	}
	/*
    val disks: List<Disk> =
		conn?.findAllDisksFromStorageDomain(this@toNavigationalWithStorageDomains.id())
			?.getOrDefault(emptyList())?.filterNot {
				// 잡다한 유형들 다 제외
				it.contentType() == DiskContentType.OVF_STORE ||
				it.contentType() == DiskContentType.HOSTED_ENGINE ||
				it.contentType() == DiskContentType.HOSTED_ENGINE_CONFIGURATION ||
				it.contentType() == DiskContentType.HOSTED_ENGINE_METADATA ||
				it.contentType() == DiskContentType.HOSTED_ENGINE_SANLOCK ||
				it.contentType() == DiskContentType.MEMORY_DUMP_VOLUME ||
				it.contentType() == DiskContentType.MEMORY_METADATA_VOLUME
			}
			?: listOf()

    return TreeNavigationalStorageDomain.builder {
        id { this@toNavigationalWithStorageDomains.id() }
        name { this@toNavigationalWithStorageDomains.name() }
		status { this@toNavigationalWithStorageDomains.status() }
        disks { disks.toNavigationalsFromDisks() }
    }
    */
}

fun List<StorageDomain>.toTreeNavigationalsFromStorageDomain(
	conn: Connection?=null,
	rAllDisks: AllDisksRepository?=null,
): List<TreeNavigationalStorageDomain> =
    this@toTreeNavigationalsFromStorageDomain.map { it.toNavigationalWithStorageDomains(conn, rAllDisks) }
