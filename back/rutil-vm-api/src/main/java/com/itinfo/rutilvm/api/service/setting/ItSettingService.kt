package com.itinfo.rutilvm.api.service.setting

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.setting.UsersVo
import com.itinfo.rutilvm.api.model.setting.toUsersMenu
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.findAllUsers

import org.ovirt.engine.sdk4.types.User
import org.springframework.stereotype.Service

interface ItSettingService {
    /**
     * [ItSettingService.findAllUsers]
     * 시스템 설정 값 조회
     *
     * @return []
     */
    fun findAllUsers(): List<UsersVo>
}

@Service
class ItSettingServiceImpl(
): BaseService(), ItSettingService {

    override fun findAllUsers(): List<UsersVo> {
		log.info("findAllUsers ... ")
        val users: List<User> = conn.findAllUsers()
            .getOrDefault(listOf())
        return users.toUsersMenu()
    }


    companion object {
        private val log by LoggerDelegate()
    }
}