package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.model.auth.UserSessionVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo

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
