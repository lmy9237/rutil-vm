package com.itinfo.dao

import com.itinfo.rutilvm.common.LoggerDelegate

import com.itinfo.dao.aaa.OvirtUser
import com.itinfo.dao.aaa.OvirtUserRepository
import com.itinfo.dao.aaa.toUserVo
import com.itinfo.dao.aaa.toUserVos
import com.itinfo.dao.engine.UserDetail
import com.itinfo.dao.engine.UserDetailRepository

import com.itinfo.model.UserVo
import org.postgresql.util.PSQLException

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class OvirtUsersDao {
	@Autowired private lateinit var ovirtUserRepository: OvirtUserRepository
	@Autowired private lateinit var userDetailRepository: UserDetailRepository

	@Throws(PSQLException::class)
	fun retrieveUsers(): List<UserVo> {
		log.info("... retrieveUsers")
		val itemsFound: List<OvirtUser> =
			ovirtUserRepository.findAll()
		if (itemsFound.isEmpty()) return listOf()
		log.debug("itemFound: $itemsFound")

		val userDetails: List<UserDetail> =
			userDetailRepository.findAll()
		log.debug("detailsFound: $userDetails")
		return itemsFound.toUserVos(userDetails)
	}

	@Throws(PSQLException::class)
	fun retrieveUser(username: String): UserVo? {
		log.info("... retrieveUser('$username')")
		val itemFound: OvirtUser =
			ovirtUserRepository.findByName(username) ?: throw Exception("사용자를 찾을 수 없습니다.")
		log.debug("itemFound: $itemFound")
		val detailFound: UserDetail =
			userDetailRepository.findByExternalId(itemFound.uuid) ?: throw Exception("사용자 상세정보를 찾을 수 없습니다.")
		log.debug("detailFound: $detailFound")
		return itemFound.toUserVo(detailFound) // USERS.retrieveUser
	}

	@Throws(PSQLException::class)
	fun isExistUser(user: UserVo): Boolean {
		log.info("... isExistUser > user: $user")
		val isUserFound: Boolean =
			retrieveUser(user.username) != null
		log.debug("isUserFound: $isUserFound")
		return isUserFound // USERS.isExistUser
	}

	@Throws(PSQLException::class)
	fun addUser(user: UserVo): Int {
		return -1
		// TODO: ovirt-aaa-jdbc 에서 처리 법 찾아 구현
		// return this.systemSqlSessionTemplate.insert("USERS.addUser", user)
	}

	@Throws(PSQLException::class)
	fun updateUser(user: UserVo): Int {
		return -1
		// TODO: ovirt-aaa-jdbc 에서 처리 법 찾아 구현
		// return this.systemSqlSessionTemplate.insert("USERS.updateUser", user)
	}

	@Throws(PSQLException::class)
	fun updatePassword(user: UserVo): Int {
		return -1
		// TODO: ovirt-aaa-jdbc 에서 처리 법 찾아 구현
		// return this.systemSqlSessionTemplate.insert("USERS.updatePassword", user)
	}

	@Throws(PSQLException::class)
	fun updateLoginCount(user: UserVo): Int {
		return -1
		// TODO: ovirt-aaa-jdbc 에서 처리 법 찾아 구현
		// return this.systemSqlSessionTemplate.insert("USERS.updateLoginCount", user)
	}

	@Throws(PSQLException::class)
	fun setBlockTime(user: UserVo): Int {
		return -1
		// TODO: ovirt-aaa-jdbc 에서 처리 법 찾아 구현
		// return this.systemSqlSessionTemplate.insert("USERS.setBlockTime", user);
	}

	fun initLoginCount(userId: String): Int {
		return -1
		// TODO: ovirt-aaa-jdbc 에서 처리 법 찾아 구현
		// return this.systemSqlSessionTemplate.insert("USERS.initLoginCount", userId);
	}

	fun removeUsers(users: List<UserVo>): Int {
		return -1
		// TODO: ovirt-aaa-jdbc 에서 처리 법 찾아 구현
		// return this.systemSqlSessionTemplate.delete("USERS.removeUsers", users);
	}

	fun login(id: String): String {
		log.info("login('$id') ...")
		val itemFound: UserVo? = retrieveUser(id)
		return itemFound?.password ?: ""
		// return (String)this.systemSqlSessionTemplate.selectOne("USERS.login", id);
	}

	companion object {
		private val log by LoggerDelegate()
	}
}