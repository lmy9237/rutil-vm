package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findDisk
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DiskBuilder
import org.ovirt.engine.sdk4.builders.DiskProfileBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskAttachment
import org.ovirt.engine.sdk4.types.DiskBackup
import org.ovirt.engine.sdk4.types.DiskFormat
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(VDiskVo::class.java)

*/
/**
 * [VDiskVo]
 * @property vDiskImageVo [VDiskImageVo] 이미지
 * @property vDiskLunVo [VDiskLunVo] 직접 LUN
 *//*
@Deprecated("안쓸예정")
class VDiskVo(
    val vDiskImageVo: VDiskImageVo = VDiskImageVo(),
    val vDiskLunVo: VDiskLunVo = VDiskLunVo(),
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
    	private var bVDiskImageVo: VDiskImageVo = VDiskImageVo();fun vDiskImageVo(block: () -> VDiskImageVo?) { bVDiskImageVo = block() ?: VDiskImageVo() }
    	private var bVDiskLunVo: VDiskLunVo = VDiskLunVo();fun vDiskLunVo(block: () -> VDiskLunVo?) { bVDiskLunVo = block() ?: VDiskLunVo() }
		fun build(): VDiskVo = VDiskVo(bVDiskImageVo, bVDiskLunVo)
	}

	companion object {
		inline fun builder(block: VDiskVo.Builder.() -> Unit): VDiskVo =
			VDiskVo.Builder().apply(block).build()
	}
}

fun DiskAttachment.toVDisk(conn: Connection): VDiskVo {
	log.debug("DiskAttachment.toVDisk ... ")
	val convertMb = BigInteger.valueOf(1024).pow(3)
	val disk: Disk? = conn.findDisk(this@toVDisk.disk().id())
	return VDiskVo.builder {
		vDiskImageVo {
			VDiskImageVo.builder {
				diskId { disk?.id() }
				alias { disk?.alias() }
				size { disk?.provisionedSize()?.divide(convertMb)?.toLong() }
				bootable { this@toVDisk.bootable() }
			}
		}
	}
}

*/
/**
 * [List<DiskAttachment>.getDisks]
 * 편집 - 인스턴스 이미지(디스크)
 * @param system
 * @param daList
 * @return
 *//*

fun List<DiskAttachment>.toVDiskVos(conn: Connection): List<VDiskVo>
		= this@toVDiskVos.map { it.toVDisk(conn) }

fun VDiskVo.toDiskBuilder(conn: Connection): DiskBuilder {
	return DiskBuilder()
		.provisionedSize(BigInteger.valueOf(this@toDiskBuilder.vDiskImageVo.size).multiply(BigInteger.valueOf(1024).pow(3)) ) // 값 받은 것을 byte로 변환하여 준다
		.alias(this@toDiskBuilder.vDiskImageVo.alias)
		.description(this@toDiskBuilder.vDiskImageVo.description)
		.storageDomains(*arrayOf(StorageDomainBuilder().id(this@toDiskBuilder.vDiskImageVo.storageDomainId).build()))
		.sparse(this@toDiskBuilder.vDiskImageVo.allocationPolicy) // 할당정책: 씬 true
		.diskProfile(DiskProfileBuilder().id(this@toDiskBuilder.vDiskImageVo.diskProfile).build()) // 없어도 상관없음
		.wipeAfterDelete(this@toDiskBuilder.vDiskImageVo.wipeAfterDelete) // 삭제후 초기화
		.shareable(this@toDiskBuilder.vDiskImageVo.shareable) // 공유 가능 (공유가능 o 이라면 증분백업 안됨 FRONT에서 막기?)
		.backup(if (this@toDiskBuilder.vDiskImageVo.backup) DiskBackup.INCREMENTAL else DiskBackup.NONE) // 증분 백업 사용(기본이 true)
		.format(if (this@toDiskBuilder.vDiskImageVo.backup) DiskFormat.COW else DiskFormat.RAW) // 백업 안하면 RAW
}

*/
/**
 * [VmServiceImpl.bootableFlag]
 * 부팅가능한 디스크는 한개만 설정가능
 *
 * @param bootableDiskExists
 * @param vDiskVo
 * @return
 *//*

fun VDiskVo.bootableFlag(bootableDiskExists: Boolean): Boolean {
	var isBootable = vDiskImageVo.bootable
	if (bootableDiskExists && isBootable) {
		log.warn("이미 부팅 가능한 디스크가 존재하므로 디스크는 부팅 불가능으로 설정됨")
		isBootable = false
	}
	return isBootable
}*/
