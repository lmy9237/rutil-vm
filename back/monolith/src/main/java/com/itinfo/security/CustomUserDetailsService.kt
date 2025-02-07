package com.itinfo.security

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.dao.OvirtUsersDao
import com.itinfo.model.UserVo
import com.itinfo.model.toCustomUserDetails
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService: UserDetailsService {

	@Autowired private lateinit var ovirtUsersDao: OvirtUsersDao
	@Throws(UsernameNotFoundException::class)
	override fun loadUserByUsername(username: String?): UserDetails {
		log.debug("... loadUserByUsername('$username'")
		if (username.isNullOrBlank()) {
			log.error("... loadUserByUsername > NO username found ...")
			throw UsernameNotFoundException("username 값이 비어있습니다.")
		}
		val user: UserVo =
			ovirtUsersDao.retrieveUser(username) ?: throw UsernameNotFoundException("해당 username이 없습니다")
		return user.toCustomUserDetails()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}