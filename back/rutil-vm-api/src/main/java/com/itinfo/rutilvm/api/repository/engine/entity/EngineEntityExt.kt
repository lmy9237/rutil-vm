package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.model.auth.UserSessionVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import com.itinfo.rutilvm.api.model.storage.toUnregisterdDisk
import com.itinfo.rutilvm.common.toUUID
import org.ovirt.engine.sdk4.types.Disk

fun DiskVmElementEntity.toVmDisk(): DiskImageVo {
	return DiskImageVo.builder {

	}
}

//region: EngineSessionsEntity
fun EngineSessionsEntity.toUserSession(): UserSessionVo {
	return UserSessionVo.builder {
		id { id }
		userId { userId }
		userName { userName }
		sourceIp { sourceIp }
		authzName { authzName }
		sessionStartTime { null }
		sessionLastActiveTime { null }
		// TODO: sessionLastActiveTime, sessionStartTime 값 찾아 넣기
	}
}

fun List<EngineSessionsEntity>.toUserSessions(): List<UserSessionVo> = this.map { it.toUserSession() }
//endregion: EngineSessionsEntity

fun UnregisteredDiskEntity.toUnregisteredDiskImageVo(disk: Disk?=null): DiskImageVo =
	DiskImageVo.builder {
		id { this@toUnregisteredDiskImageVo.id.diskId.toString() }
		alias { this@toUnregisteredDiskImageVo.diskAlias }
		sharable { disk?.shareable() }
		virtualSize { this@toUnregisteredDiskImageVo.size }
		actualSize { this@toUnregisteredDiskImageVo.actualSize }
		sparse { this@toUnregisteredDiskImageVo.sparse }
		description { this@toUnregisteredDiskImageVo.diskDescription }
		dateCreated { this@toUnregisteredDiskImageVo.creationDate }
	}

fun List<UnregisteredDiskEntity>.toUnregisteredDiskImageVos(disks: List<Disk>): List<DiskImageVo> {
	val itemById: Map<String, Disk> =
		disks.associateBy { it.id() }
	return this.map { it.toUnregisteredDiskImageVo(itemById[it.id.toString()]) }
}
