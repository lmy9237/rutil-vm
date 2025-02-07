package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.storage.java

import com.itinfo.rutilvm.util.ovirt.findStorageType
import com.itinfo.itcloud.gson
import com.itinfo.itcloud.model.storage.DiskProfileVo
import com.itinfo.itcloud.model.storage.StorageDomainVo
import com.itinfo.itcloud.model.storage.toStorageDomainVo
import com.itinfo.rutilvm.util.ovirt.findDisk
import com.itinfo.rutilvm.util.ovirt.findStorageDomain
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskAttachment
import org.ovirt.engine.sdk4.types.DiskInterface
import org.ovirt.engine.sdk4.types.DiskStatus
import org.ovirt.engine.sdk4.types.StorageDomain
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(DiskVo::class.java)
*/
/**
 * [DiskVo]
 * 스토리지 - 디스크
 * 스토리지 도메인 - 항목 - 디스크
 * 단순 출력용(?)
 *
 * @property id [String] 디스크 ID
 * @property name [String] 디스크명
 * @property alias [String] 디스크 별칭
 * @property description [String]  디스크 설명
 * @property status [DiskStatus] 디스크상태
 * @property diskInterface [DiskInterface] 인터페이스
 * @property sparse [Boolean] 할당정책 (씬true, 사전할당false)
 * @property format [Boolean] 삭제 후 초기화
 * @property virtualSize [BigInteger] 가상크기
 * @property actualSize [BigInteger] 실제크기
 * @property contentType [String]
 * @property storageType [String] 유형
 * @property createDate [String] 생성일자
 *
 * @property shareable [Boolean] 공유가능
 * @property connection [String] 연결대상
 *
 * @property storageDomainVo [StorageDomainVo]
 * @property diskProfileVo [DiskProfileVo]
 * @property diskProfileVos List<[DiskProfileVo]> 디스크 프로파일 목록
 *//*

@Deprecated("지금은 디스크 이미지만 사용할듯")
class DiskVo(
	val id: String = "",
	val name: String = "",
	val alias: String = "",
	val description: String = "",

	val status: DiskStatus = DiskStatus.OK,
	val diskInterface: DiskInterface = DiskInterface.IDE,
	val sparse: Boolean = false,
	val format: Boolean = false,

	val shareable: Boolean = false,
	val storageType: String = "",
	val contentType: String = "",
	val connection: String = "",

	val virtualSize: BigInteger = BigInteger.ZERO,
	val actualSize: BigInteger = BigInteger.ZERO,

	val createDate: String = "",

	val storageDomainVo: StorageDomainVo = StorageDomainVo(),
	val diskProfileVo: DiskProfileVo = DiskProfileVo(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bAlias: String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bStatus: DiskStatus = DiskStatus.OK;fun status(block: () -> DiskStatus?) { bStatus = block() ?: DiskStatus.OK }
		private var bDiskInterface: DiskInterface = DiskInterface.IDE;fun diskInterface(block: () -> DiskInterface?) { bDiskInterface = block() ?: DiskInterface.IDE }
		private var bSparse: Boolean = false;fun sparse(block: () -> Boolean?) { bSparse = block() ?: false }
		private var bFormat: Boolean = false;fun format(block: () -> Boolean?) { bFormat = block() ?: false }
		private var bShareable: Boolean = false;fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
		private var bStorageType: String = "";fun storageType(block: () -> String?) { bStorageType = block() ?: "" }
		private var bContentType: String = "";fun contentType(block: () -> String?) { bContentType = block() ?: "" }
		private var bConnection: String = "";fun connection(block: () -> String?) { bConnection = block() ?: "" }
		private var bVirtualSize: BigInteger = BigInteger.ZERO;fun virtualSize(block: () -> BigInteger?) { bVirtualSize = block() ?: BigInteger.ZERO }
		private var bActualSize: BigInteger = BigInteger.ZERO;fun actualSize(block: () -> BigInteger?) { bActualSize = block() ?: BigInteger.ZERO }
		private var bCreateDate: String = "";fun createDate(block: () -> String?) { bCreateDate = block() ?: "" }
		private var bStorageDomainVo: StorageDomainVo = StorageDomainVo();fun domainVo(block: () -> StorageDomainVo?) { bStorageDomainVo = block() ?: StorageDomainVo(); }
		private var bDiskProfileVo: DiskProfileVo = DiskProfileVo();fun profileVo(block: () -> DiskProfileVo?) { bDiskProfileVo = block() ?: DiskProfileVo(); }
		fun build(): DiskVo = DiskVo(bId, bName, bAlias, bDescription, bStatus, bDiskInterface, bSparse, bFormat, bShareable, bStorageType, bContentType, bConnection, bVirtualSize, bActualSize, bCreateDate, bStorageDomainVo, bDiskProfileVo)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): DiskVo = Builder().apply(block).build()
	}
}

fun Disk.toDiskVo(conn: Connection): DiskVo {
	val storageDomain: StorageDomain =
		conn.findStorageDomain(this@toDiskVo.storageDomains().first().id())
			.getOrNull() ?: run {
			return DiskVo.builder {
			}
	}
	return DiskVo.builder {
		id { this@toDiskVo.id() }
		name { this@toDiskVo.name() }
		alias { this@toDiskVo.alias() }
		description { this@toDiskVo.description() }
		status { this@toDiskVo.status() }
		diskInterface { this@toDiskVo.interface_() }
		sparse { this@toDiskVo.sparse() }
//		format { this@toDiskVo.format() }
		shareable { this@toDiskVo.shareable() }
		storageType { this@toDiskVo.storageType().value() }
		contentType { this@toDiskVo.contentType().value() }
//		connection { this@toDiskVo }
		virtualSize { this@toDiskVo.provisionedSize() }
		actualSize { this@toDiskVo.actualSize() }
//		createDate { this@toDiskVo }
		domainVo { storageDomain.toStorageDomainVo(conn) }
//		profileVo { this@toDiskVo }
	}
}

fun List<Disk>.toDiskVos(conn: Connection): List<DiskVo> =
	this@toDiskVos.map { it.toDiskVo(conn) }

fun DiskAttachment.toDiskVo(conn: Connection): DiskVo {
	val disk: Disk = conn.findDisk(this@toDiskVo.disk().id()).getOrNull() ?: run {
		log.error("toDiskVo ... 찾을 수 없는 디스크")
		return DiskVo.builder { }
	}
	val storageDomain: StorageDomain? =
		conn.findStorageDomain(disk.storageDomains().first().id())
			.getOrNull()

	return DiskVo.builder {
		id { disk.id() }
		name { disk.name() }
		virtualSize { disk.provisionedSize() }
		actualSize { disk.actualSize() } // 1보다 작은거 처리는 front에
		status { disk.status() }
		sparse { disk.sparse() }
		diskInterface { this@toDiskVo.interface_() }
		storageType { disk.storageType().findStorageType() }
//		createDate { disk. } 
		domainVo { storageDomain?.toStorageDomainVo(conn, this@toDiskVo.active()) }
	}
}

fun List<DiskAttachment>.toDiskVos(conn: Connection): List<DiskVo> =
	this@toDiskVos.map { it.toDiskVo(conn) }

*/
