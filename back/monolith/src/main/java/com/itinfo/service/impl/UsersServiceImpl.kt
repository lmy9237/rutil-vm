package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.OvirtUsersDao
import com.itinfo.model.UserVo
import com.itinfo.security.createHash
import com.itinfo.service.UsersService
import org.postgresql.util.PSQLException

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


/**
 * [UsersServiceImpl]
 * 사용자 관리 서비스 응용
 *
 * @author chlee
 * @since 2023.12.07
 */
@Service
class UsersServiceImpl : UsersService {
    @Autowired private lateinit var usersDao: OvirtUsersDao

    /**
     * [UsersService.fetchUsers]
     */
    @Throws(PSQLException::class)
    override fun fetchUsers(): List<UserVo> {
        log.info("... retrieveUsers")
        val users: List<UserVo> =
            usersDao.retrieveUsers()
        return users
    }

    /**
     * [UsersService.removeUsers]
     */
    @Throws(PSQLException::class)
    override fun removeUsers(users: List<UserVo>): Int {
        log.info("... removeUsers")
        return usersDao.removeUsers(users)
    }

    /**
     * [UsersService.isExistUser]
     */
    @Throws(PSQLException::class)
    override fun isExistUser(user: UserVo): Boolean {
        log.info("... isExistUser")
        return usersDao.isExistUser(user)
    }

    /**
     * [UsersService.addUser]
     */
    override fun addUser(user: UserVo): Int {
        log.info("... addUser")
        user.password = user.password.createHash()
        return usersDao.addUser(user)
    }

    /**
     * [UserService.login]
     */
    @Throws(PSQLException::class)
    override fun login(id: String): String {
        log.info("... login($id)")
        return usersDao.login(id)
    }

    /**
     * [UserService.fetchUser]
     */
    @Throws(PSQLException::class)
    override fun fetchUser(id: String): UserVo? {
        log.info("... retrieveUser($id)")
        return usersDao.retrieveUser(id)
    }

    @Throws(PSQLException::class)
    override fun updateUser(user: UserVo): Int {
        log.info("... retrieveUser")
        return usersDao.updateUser(user)
    }

    @Throws(PSQLException::class)
    override fun updatePassword(user: UserVo): Int {
        log.info("... updatePassword")
//      user.password = user.newPassword.createHash()
        return usersDao.updatePassword(user)
    }

    @Throws(PSQLException::class)
    override fun updateLoginCount(user: UserVo): Int {
        log.info("... updateLoginCount")
        return usersDao.updateLoginCount(user)
    }

    /*
    override fun setBlockTime(user: UserVo) {
        log.info("... setBlockTime")
        user.blockTime = LocalDateTime.now()
                .plusMinutes(10L)
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
        usersDao.setBlockTime(user)
    }

    @Throws(PSQLException::class)
    override fun initLoginCount(userId: String) {
        log.info("... initLoginCount($userId)")
        usersDao.initLoginCount(userId)
    }
    */
    
    companion object {
        private val log by LoggerDelegate()
    }
}
