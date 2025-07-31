package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.toIdentifiedVoFromVm
import com.itinfo.rutilvm.api.ovirt.business.BiosTypeB
import com.itinfo.rutilvm.api.ovirt.business.DiskInterfaceB
import com.itinfo.rutilvm.api.ovirt.business.toDiskInterface
import com.itinfo.rutilvm.api.ovirt.business.toDiskInterfaceB
import com.itinfo.rutilvm.api.ovirt.business.toDiskInterfaceBuilder
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.*

import org.slf4j.LoggerFactory
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.DiskAttachmentBuilder
import org.ovirt.engine.sdk4.builders.DiskBuilder
import org.ovirt.engine.sdk4.types.BiosType
import org.ovirt.engine.sdk4.types.Disk
import org.ovirt.engine.sdk4.types.DiskAttachment
import org.ovirt.engine.sdk4.types.DiskInterface
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

private val log = LoggerFactory.getLogger(DiskAttachmentVo::class.java)

/**
 * [DiskAttachmentVo]
 * 가상머신에서만 사용하는 (부착된 디스크)
 *
 * @property id [String] 지정된 디스크와 아이디가 같음
 * @property active [Boolean] 활성 여부
 * @property bootable [Boolean] 부팅가능 (가상머신에서 부팅가능한 디스크는 한개만 지정가능)
 * @property readOnly [Boolean] 읽기전용
 * @property passDiscard [Boolean]
 * @property interface_ [DiskInterfaceB]  인터페이스
 * @property logicalName [String]  논리적 이름 (보통 없음)
 * @property detachOnly [Boolean] 완전삭제 여부 (기본 false=분리, true=완전삭제)
 * @property diskImageVo [DiskImageVo] 디스크 이미지 생성
 * @property vmVo [IdentifiedVo] 가상머신
 */
class DiskAttachmentVo(
	val id: String = "",
	val name: String? = "",
	val active: Boolean = false,
	val bootable: Boolean = false,
	val readOnly: Boolean = false,
	val passDiscard: Boolean = false,
	val interface_: DiskInterfaceB = DiskInterfaceB.virtio_scsi,
	val logicalName: String = "",
	val detachOnly: Boolean = false,
	val diskImageVo: DiskImageVo = DiskImageVo(),
	val vmVo: IdentifiedVo = IdentifiedVo(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bActive: Boolean = false;fun active(block: () -> Boolean?) { bActive = block() ?: false }
		private var bBootable: Boolean = false;fun bootable(block: () -> Boolean?) { bBootable = block() ?: false }
		private var bReadOnly: Boolean = false;fun readOnly(block: () -> Boolean?) { bReadOnly = block() ?: false }
		private var bPassDiscard: Boolean = false;fun passDiscard(block: () -> Boolean?) { bPassDiscard = block() ?: false }
		private var bInterface_: DiskInterfaceB = DiskInterfaceB.virtio_scsi;fun interface_(block: () -> DiskInterfaceB?) { bInterface_ = (block() ?: DiskInterfaceB.virtio_scsi) }
		private var bLogicalName: String = "";fun logicalName(block: () -> String?) { bLogicalName = block() ?: "" }
		private var bDetachOnly: Boolean = false;fun detachOnly(block: () -> Boolean?) { bDetachOnly = block() ?: false }
		private var bDiskImageVo: DiskImageVo = DiskImageVo();fun diskImageVo(block: () -> DiskImageVo?) { bDiskImageVo = block() ?: DiskImageVo() }
		private var bVmVo: IdentifiedVo = IdentifiedVo();fun vmVo(block: () -> IdentifiedVo?) { bVmVo = block() ?: IdentifiedVo() }

		fun build(): DiskAttachmentVo = DiskAttachmentVo(bId, bName, bActive, bBootable, bReadOnly, bPassDiscard, bInterface_, bLogicalName, bDetachOnly, bDiskImageVo, bVmVo)
	}

	companion object {
		inline fun builder(block: DiskAttachmentVo.Builder.() -> Unit): DiskAttachmentVo = DiskAttachmentVo.Builder().apply(block).build()
	}
}


fun DiskAttachment.toDiskAttachmentIdName(conn: Connection): DiskAttachmentVo {
	val disk: Disk? = conn.findDisk(this@toDiskAttachmentIdName.disk().id()).getOrNull()
	return DiskAttachmentVo.builder {
		id { this@toDiskAttachmentIdName.id() }
		diskImageVo { disk?.toDiskIdName() }
	}
}
fun List<DiskAttachment>.toDiskAttachmentIdNames(conn: Connection): List<DiskAttachmentVo> =
	this@toDiskAttachmentIdNames.map { it.toDiskAttachmentIdName(conn) }


fun DiskAttachment.toDiskAttachmentVo(conn: Connection): DiskAttachmentVo {
	val disk: Disk? = conn.findDisk(this@toDiskAttachmentVo.disk().id()).getOrNull()
	val vm: Vm? = conn.findVm(this@toDiskAttachmentVo.vm().id()).getOrNull()
	return DiskAttachmentVo.builder {
		id { this@toDiskAttachmentVo.id() }
		name { this@toDiskAttachmentVo.name() }
		active { this@toDiskAttachmentVo.active() }
		bootable { this@toDiskAttachmentVo.bootable() }
		readOnly { this@toDiskAttachmentVo.readOnly() }
		passDiscard { this@toDiskAttachmentVo.passDiscard() }
		interface_ { this@toDiskAttachmentVo.interface_().toDiskInterfaceB() }
		logicalName { this@toDiskAttachmentVo.logicalName() }
		diskImageVo { disk?.toVmDisk(conn) }
		vmVo { vm?.toIdentifiedVoFromVm() }
	}
}
fun List<DiskAttachment>.toDiskAttachmentVos(conn: Connection): List<DiskAttachmentVo> =
	this@toDiskAttachmentVos.map { it.toDiskAttachmentVo(conn) }


fun DiskAttachment.toDiskAttachmentToTemplate(conn: Connection): DiskAttachmentVo {
	val disk: Disk? = conn.findDisk(this@toDiskAttachmentToTemplate.disk().id(), follow = "diskprofile").getOrNull()

	return DiskAttachmentVo.builder {
		id { this@toDiskAttachmentToTemplate.id() }
		name { this@toDiskAttachmentToTemplate.name() }
		active { this@toDiskAttachmentToTemplate.active() }
		bootable { this@toDiskAttachmentToTemplate.bootable() }
		readOnly { this@toDiskAttachmentToTemplate.readOnly() }
		passDiscard { this@toDiskAttachmentToTemplate.passDiscard() }
		interface_ { this@toDiskAttachmentToTemplate.interface_().toDiskInterfaceB() }
		logicalName { this@toDiskAttachmentToTemplate.logicalName() }
		diskImageVo { disk?.toTemplateDiskInfo(conn) }
	}
}
fun List<DiskAttachment>.toDiskAttachmentsToTemplate(conn: Connection): List<DiskAttachmentVo> =
	this@toDiskAttachmentsToTemplate.map { it.toDiskAttachmentToTemplate(conn) }


fun DiskAttachmentVo.toAddSnapshotDisk(): DiskAttachment {
	log.info("toAddSnapshotDisk: $this")
	return DiskAttachmentBuilder()
		.disk(this.diskImageVo.toAddSnapshotDisk())
		.build()
}

fun List<DiskAttachmentVo>.toAddSnapshotDisks(): List<DiskAttachment> =
	this.map { it.toAddSnapshotDisk() }


// region: builder
/**
 * DiskAttachmentBuilder
 */
fun DiskAttachmentVo.toDiskAttachmentBuilder(): DiskAttachmentBuilder {
	log.info("disk:{}", this@toDiskAttachmentBuilder)
	return DiskAttachmentBuilder()
		.active(this.active)
		.bootable(this.bootable)
		.passDiscard(this.passDiscard)
		.readOnly(this.readOnly)
		.interface_(this.interface_.toDiskInterfaceBuilder())
		.logicalName(this.logicalName)
}

/**
 * DiskAttachmentBuilder 에서 디스크를 생성해서 붙이는 방식
 */
fun DiskAttachmentVo.toAddDiskAttachment(): DiskAttachment {
	return this.toDiskAttachmentBuilder()
		.disk(this.diskImageVo.toAddDisk())
		.build()
}
/**
 * DiskAttachmentBuilder 에서 디스크를 연결해서 붙이는 방식
 */
fun DiskAttachmentVo.toAttachDisk(): DiskAttachment {
	return this.toDiskAttachmentBuilder()
		.active(true)
		.disk(DiskBuilder().id(this.diskImageVo.id).build())
		.build()
}
fun List<DiskAttachmentVo>.toAttachDiskList(): List<DiskAttachment> =
	map { it.toAttachDisk() }

/**
 * DiskAttachmentBuilder 에서 디스크 편집
 * 추가된 사이즈 적용
 */
fun DiskAttachmentVo.toEditDiskAttachment(): DiskAttachment {
	return this.toDiskAttachmentBuilder()
		.id(this.id)
		.disk(this.diskImageVo.toEditDisk())
		.build()
}


// 생성과 연결될 DiskAttachment 를 목록으로 내보낸다
fun List<DiskAttachmentVo>.toAddVmDiskAttachmentList(): List<DiskAttachment> {
	val diskAttachmentList = mutableListOf<DiskAttachment>()

	this.forEach { diskAttachmentVo ->
		if (diskAttachmentVo.diskImageVo.id.isEmpty()) {
			// 디스크 생성
			diskAttachmentList.add(diskAttachmentVo.toAddDiskAttachment())
		} else {
			// 디스크 연결
			diskAttachmentList.add(diskAttachmentVo.toAttachDisk())
		}
	}
	return diskAttachmentList
}

// endregion
