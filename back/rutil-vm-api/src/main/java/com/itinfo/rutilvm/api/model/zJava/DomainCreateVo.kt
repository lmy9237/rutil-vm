/*
package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import java.io.Serializable
import org.ovirt.engine.sdk4.types.StorageDomainType
import org.ovirt.engine.sdk4.types.StorageType
*/
/**
 * [DomainCreateVo]
 * 
 * @property name [String]
 * @property description [String]
 * @property comment [String]
 *
 * @property datacenterId [String]
 * @property datacenterName [String]
 * @property domainType [StorageDomainType]	도메인 기능
 * @property storageType [StorageType]		스토리지 유형
 * @property path [String] 					내보내기 경로
 *
 * @property logicalUnitId [String]
 *
 * @property hostId [String]
 * @property hostName [String]
 *//*
@Deprecated("as")
class DomainCreateVo(
    val name: String = "",
    val description: String = "",
    val comment: String = "",

    val datacenterId: String = "",
    val datacenterName: String = "",
    val domainType: StorageDomainType = StorageDomainType.DATA, // 진짜 없을 경우 null 해야할지 판단필요
    val storageType: StorageType = StorageType.NFS, // 진짜 없을 경우 null 해야할지 판단필요
    val path: String = "",

    val logicalUnitId: String = "",

    val hostId: String = "",
    val hostName: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	class Builder {
	    private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
	    private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
	    private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
	    private var bDatacenterId: String = "";fun datacenterId(block: () -> String?) { bDatacenterId = block() ?: "" }
	    private var bDatacenterName: String = "";fun datacenterName(block: () -> String?) { bDatacenterName = block() ?: "" }
	    private var bDomainType: StorageDomainType = StorageDomainType.DATA;fun domainType(block: () -> StorageDomainType?) { bDomainType = block() ?: StorageDomainType.DATA }
	    private var bStorageType: StorageType = StorageType.NFS;fun storageType(block: () -> StorageType?) { bStorageType = block() ?: StorageType.NFS }
	    private var bPath: String = "";fun path(block: () -> String?) { bPath = block() ?: "" }
	    private var bLogicalUnitId: String = "";fun logicalUnitId(block: () -> String?) { bLogicalUnitId = block() ?: "" }
	    private var bHostId: String = "";fun hostId(block: () -> String?) { bHostId = block() ?: "" }
	    private var bHostName: String = "";fun hostName(block: () -> String?) { bHostName = block() ?: "" }
		fun build(): DomainCreateVo = DomainCreateVo(bName, bDescription, bComment, bDatacenterId, bDatacenterName, bDomainType, bStorageType, bPath, bLogicalUnitId, bHostId, bHostName)
	}
	
	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: DomainCreateVo.Builder.() -> Unit): DomainCreateVo = DomainCreateVo.Builder().apply(block).build()
	}
}*/
