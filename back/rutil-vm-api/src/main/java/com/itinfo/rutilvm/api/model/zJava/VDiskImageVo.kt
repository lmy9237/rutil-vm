package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findDisk
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DiskAttachmentBuilder
import org.ovirt.engine.sdk4.builders.DiskBuilder
import org.ovirt.engine.sdk4.builders.DiskProfileBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(VDiskImageVo::class.java)

*/
/**
 * [VDiskImageVo]
 * 
 * @property diskId [String]				연결할때
 * 
 * 이미지
 * @property size [Long]					크기(GiB)
 * @property alias [String]					별칭
 * @property description [String]			설명
 * @property storageDomainId [String]		스토리지 도메인
 * @property diskProfile [String]			디스크 프로파일 id
 * 
 * @property allocationPolicy [Boolean]		할당 정책
 * @property wipeAfterDelete [Boolean]		삭제 후 초기화 disk
 * @property shareable [Boolean]			공유가능 disk
 * @property backup [Boolean]				증분 백업 사용 disk
 * 
 * 
 * DiskAttachment
 * @property interfaces [DiskInterface]		인터페이스
 * @property active [Boolean]				활성화
 * @property bootable [Boolean]				부팅가능
 * @property readOnly [Boolean]				읽기전용
 * @property passDiscard [Boolean]			취소 활성화
 *
 *//*

@Deprecated("사용안함")
class VDiskImageVo(
    val diskId: String = "",
    val size: Long = 0L,
    val alias: String = "",
    val description: String = "",
    val storageDomainId: String = "",
    val diskProfile: String = "",
    val allocationPolicy: Boolean = false,
    val wipeAfterDelete: Boolean = false,
    val shareable: Boolean = false,
    val backup: Boolean = false,
    val interfaces: DiskInterface = DiskInterface.IDE,
    val active: Boolean = false,
    val bootable: Boolean = false,
    val readOnly: Boolean = false,
    val passDiscard: Boolean = false,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
	    private var bDiskId: String = "";fun diskId(block: () -> String?) { bDiskId = block() ?: "" }
	    private var bSize: Long = 0L;fun size(block: () -> Long?) { bSize = block() ?: 0L }
	    private var bAlias: String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
	    private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
	    private var bStorageDomainId: String = "";fun storageDomainId(block: () -> String?) { bStorageDomainId = block() ?: "" }
	    private var bDiskProfile: String = "";fun diskProfile(block: () -> String?) { bDiskProfile = block() ?: "" }
	    private var bAllocationPolicy: Boolean = false;fun allocationPolicy(block: () -> Boolean?) { bAllocationPolicy = block() ?: false }
	    private var bWipeAfterDelete: Boolean = false;fun wipeAfterDelete(block: () -> Boolean?) { bWipeAfterDelete = block() ?: false }
	    private var bShareable: Boolean = false;fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
	    private var bBackup: Boolean = false;fun backup(block: () -> Boolean?) { bBackup = block() ?: false }
	    private var bInterfaces: DiskInterface = DiskInterface.IDE;fun interfaces(block: () -> DiskInterface?) { bInterfaces = block() ?: DiskInterface.IDE }
	    private var bActive: Boolean = false;fun active(block: () -> Boolean?) { bActive = block() ?: false }
	    private var bBootable: Boolean = false;fun bootable(block: () -> Boolean?) { bBootable = block() ?: false }
	    private var bReadOnly: Boolean = false;fun readOnly(block: () -> Boolean?) { bReadOnly = block() ?: false }
	    private var bPassDiscard: Boolean = false;fun passDiscard(block: () -> Boolean?) { bPassDiscard = block() ?: false }
		fun build(): VDiskImageVo = VDiskImageVo(bDiskId, bSize, bAlias, bDescription, bStorageDomainId, bDiskProfile, bAllocationPolicy, bWipeAfterDelete, bShareable, bBackup, bInterfaces, bActive, bBootable, bReadOnly, bPassDiscard)
	}

	companion object {
		inline fun builder(block: VDiskImageVo.Builder.() -> Unit): VDiskImageVo =
			VDiskImageVo.Builder().apply(block).build()
	}
}


fun VDiskImageVo.toAddDiskBuilder(): Disk {
	return DiskBuilder()
		.provisionedSize(BigInteger.valueOf(this@toAddDiskBuilder.size).multiply(BigInteger.valueOf(1024).pow(3)) ) // 값 받은 것을 byte로 변환하여 준다
		.alias(this@toAddDiskBuilder.alias)
		.description(this@toAddDiskBuilder.description)
		.storageDomains(*arrayOf(StorageDomainBuilder().id(this@toAddDiskBuilder.storageDomainId).build()))
		.sparse(this@toAddDiskBuilder.allocationPolicy) // 할당정책: 씬 true
		.diskProfile(DiskProfileBuilder().id(this@toAddDiskBuilder.diskProfile).build()) // 없어도 상관없음
		.wipeAfterDelete(this@toAddDiskBuilder.wipeAfterDelete) // 삭제후 초기화
		.shareable(this@toAddDiskBuilder.shareable) // 공유 가능 (공유가능 o 이라면 증분백업 안됨 FRONT에서 막기?)
		.backup(if (this@toAddDiskBuilder.backup) DiskBackup.INCREMENTAL else DiskBackup.NONE) // 증분 백업 사용(기본이 true)
		.format(if (this@toAddDiskBuilder.backup) DiskFormat.COW else DiskFormat.RAW) // 백업 안하면 RAW
		.build()
}

fun List<VDiskImageVo>.toAddDiskBuilders(): List<Disk> =
	this@toAddDiskBuilders.map { it.toAddDiskBuilder() }


fun VDiskImageVo.toConnectDiskAttachmentBuilder(conn: Connection): DiskAttachmentBuilder {
	return DiskAttachmentBuilder()
		.disk(DiskBuilder().id(this@toConnectDiskAttachmentBuilder.diskId).build())
		.active(true)
		.interface_(this@toConnectDiskAttachmentBuilder.interfaces)
		.bootable(this@toConnectDiskAttachmentBuilder.bootable)
		.readOnly(this@toConnectDiskAttachmentBuilder.readOnly)
}


fun DiskAttachment.toVDiskImageVo(conn: Connection): VDiskImageVo {
	log.debug("DiskAttachment.toVDiskImageVo ... ")
	val convertMb = BigInteger.valueOf(1024).pow(3)
	val disk: Disk? = conn.findDisk(this@toVDiskImageVo.id())

	return VDiskImageVo.builder {
		diskId { disk?.id() }
		alias { disk?.alias() }
		size { disk?.provisionedSize()?.divide(convertMb)?.toLong() }
		bootable { this@toVDiskImageVo.bootable() }
	}
}

fun List<DiskAttachment>.toVDiskImageVos(conn: Connection): List<VDiskImageVo> =
	this@toVDiskImageVos.map { it.toVDiskImageVo(conn) }
*/
