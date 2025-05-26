package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdcOptionEntity

const val OPTION_NAME_SSH_HOST_REBOOT_COMMAND = "SshHostRebootCommand"

fun VdcOptionsRepository.findAllSshHostRebootCommands(): List<VdcOptionEntity> =
	findByOptionName(OPTION_NAME_SSH_HOST_REBOOT_COMMAND)

// NOTE:
// 4.7을 기본 버전으로 쓰기로 하였기에 기본값을 이렇게 부여하였다.
// SshHostRebootCommand는 현재 `version`이 'general' 인 값이 없다
fun VdcOptionsRepository.findSshHostRebootCommandByVersion(version: String = "4.7"): VdcOptionEntity? =
	findByOptionNameAndVersion(OPTION_NAME_SSH_HOST_REBOOT_COMMAND, version)

