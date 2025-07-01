package com.itinfo.rutilvm.api.service.auth

import com.itinfo.rutilvm.api.configuration.PropertiesConfig
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.repository.aaarepository.OvirtUserRepository
import com.itinfo.rutilvm.api.repository.aaarepository.RefreshTokenRepository
import com.itinfo.rutilvm.api.repository.aaarepository.UserDetailRepository
import com.itinfo.rutilvm.api.repository.aaarepository.dto.TokenDto
import com.itinfo.rutilvm.api.repository.aaarepository.entity.*
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.auth.ResetPasswordPrompt
import com.itinfo.rutilvm.api.model.auth.UserVo
import com.itinfo.rutilvm.api.model.setting.UsersVo
import com.itinfo.rutilvm.api.ovirt.hashPassword
import com.itinfo.rutilvm.api.ovirt.validatePassword
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException

import org.ovirt.engine.sdk4.Error
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.time.LocalDateTime
import java.util.*


interface ItOvirtUserService {
	/**
	 * [ItOvirtUserService.findAll]
	 * 모든 사용자 조회
	 *
	 * @return List<[UserVo]>
	 */
	@Throws(PSQLException::class)
	fun findAll(): List<UserVo>
	/**
	 * [ItOvirtUserService.findOne]
	 *
	 * @param username [String]
	 * @return [UserDetails]
	 */
	@Throws(PSQLException::class)
	fun findOne(username: String): UserVo?
	/**
	 * [ItOvirtUserService.findOneAAA]
	 * 특정 사용자 조회
	 *
	 * @param username [String]
	 * @return [OvirtUser]
	 */
	@Throws(PSQLException::class)
	fun findOneAAA(username: String): OvirtUser
	/**
	 * [ItOvirtUserService.findFullDetailByName]
	 *
	 * @param username [String]
	 * @return [UserVo]
	 */
	@Throws(PSQLException::class)
	fun findFullDetailByName(username: String): UserVo?
	/**
	 * [ItOvirtUserService.findEncryptedValue]
	 * DB 비밀번호 암호문에서 base64로 디코딩한 값 출력
	 *
	 * @param input [String]
	 * @return [String]
	 */
	fun findEncryptedValue(input: String): String
	/**
	 * [ItOvirtUserService.authenticate]
	 * 암호화 된 값 변환 (oVirt 비밀번호)
	 *
	 * @param username [String]
	 * @param password [String]
	 * @return Boolean
	 */
	@Throws(PSQLException::class)
	fun authenticate(username: String, password: String): HttpHeaders
	/**
	 * [ItOvirtUserService.add]
	 * 사용자 생성
	 *
	 * @param username [String]
	 * @param password [String]
	 * @param surname [String]
	 * @return [UserVo]
	 */
	@Throws(PSQLException::class)
	fun add(userVo: UserVo): UserVo?
	/**
	 * [ItOvirtUserService.updatePassword]
	 * 사용자 비밀변호 변경
	 *
	 * @param username [String]
	 * @param resetPassword [ResetPasswordPrompt]
	 * @param force [Boolean]
	 *
	 * @return [OvirtUser]
	 */
	@Throws(PSQLException::class)
	fun updatePassword(username: String, resetPassword: ResetPasswordPrompt?, force: Boolean): OvirtUser
	/**
	 * [ItOvirtUserService.update]
	 * 사용자 변경
	 *
	 * @param username [String]
	 * @param userVo [UserVo]
	 * @return [UserVo]
	 */
	@Throws(PSQLException::class)
	fun update(username: String, userVo: UserVo?): UserVo?
	/**
	 * [ItOvirtUserService.remove]
	 * 사용자 삭제
	 *
	 * @param username [String]
	 * @return [Boolean]
	 */
	@Throws(PSQLException::class)
	fun remove(username: String, shouldDeleteAdminByForce: Boolean = false): Boolean
	/**
	 * [ItSettingService.findAllUser]
	 * 활성 사용자 세션 목록
	 *
	 * @return List<[UsersVo]>
	 */
	@Throws(Error::class)
	fun findAllUserSessions(): List<UsersVo>

//    /**
//     * [ItSettingService.findAllLicence]
//     * 라이선스 목록
//     *
//     * @return List<[UsersVo]>
//     */
//    @Deprecated("나중구현")
//    fun findAllLicence(): List<>

}

@Service
class OvirtUserServiceImpl(

): BaseService(), ItOvirtUserService {
	@Autowired private lateinit var propsConfig: PropertiesConfig
	@Autowired private lateinit var jwtUtil: JwtUtil
	@Autowired private lateinit var ovirtUsers: OvirtUserRepository
	@Autowired private lateinit var userDetails: UserDetailRepository
	@Autowired private lateinit var refreshTokens: RefreshTokenRepository

	@Throws(PSQLException::class)
	override fun findAll(): List<UserVo> {
		log.info("findAll ... ")
		val res: List<OvirtUser> = ovirtUsers.findAll()
		if (res.isEmpty()) return listOf()

		val userDetails: List<UserDetail> = userDetails.findAll()
		log.debug("detailsFound: {}", userDetails)
		return res.toUserVos(userDetails)
	}

	@Throws(ItCloudException::class)
	override fun findOne(username: String): UserVo? {
		val res: OvirtUser = findOneAAA(username)
		return res.toUserVo()
	}

	@Throws(ItCloudException::class)
	override fun findOneAAA(username: String): OvirtUser =
		ovirtUsers.findByName(username) ?: throw ErrorPattern.OVIRTUSER_NOT_FOUND.toException()

	@Throws(ItCloudException::class, PSQLException::class)
	override fun findFullDetailByName(username: String): UserVo? {
		log.info("findByName ... name: {}", username)
		val oUser: OvirtUser = findOneAAA(username)
		log.debug("itemFound: {}", oUser)
		val oUserDetail: UserDetail =
			userDetails.findByExternalId(oUser.uuid) ?: throw ErrorPattern.OVIRTUSER_NOT_FOUND.toException()
		log.debug("detailFound: {}", oUserDetail)
		return oUser.toUserVo(oUserDetail, true) // USERS.retrieveUser
	}

	override fun findEncryptedValue(input: String): String =
		input.hashPassword()

	@Transactional("aaaTransactionManager")
	override fun add(userVo: UserVo): UserVo? {
		log.info("add ... userVo: {}", userVo)
		// STEP 1: 중복 사용자 존재유무
		val username = userVo.username
		val firstName = userVo.firstName
		val surName = userVo.surName
		val password = userVo.password
		if (ovirtUsers.findByName(username) != null)
			throw ErrorPattern.OVIRTUSER_DUPLICATE.toException()

		// STEP 2: 사용자 기본정보 생성
		val uuid: UUID = UUID.randomUUID()
		val user2Add = OvirtUser.builder {
			uuid { uuid.toString() }
			name { username }
			password { findEncryptedValue(password) }
			disabled { if (userVo.disabled) 1 else 0 }
		}
		val resUserAdded: OvirtUser = ovirtUsers.save(user2Add)

		// STEP 3: 사용자 상세정보 생성
		val resUserDetail2Add = UserDetail.builder {
			name { firstName }
			surname { surName }
			username { username }
			email { "${username}@localhost" }
			createDate { LocalDateTime.now() }
			externalId { uuid.toString() }
			/* note { } */
		}
		val resUserDetailAdded: UserDetail = userDetails.save(resUserDetail2Add)

		// STEP 4: 권한 등록
		// addPermission(uuid.toString())
		return resUserAdded.toUserVo(resUserDetailAdded, true)
	}

	@Throws(PSQLException::class)
	override fun authenticate(username: String, password: String): HttpHeaders {
		log.info("authenticate ... username: {}", username)
		log.debug("authenticate ... password: {}", password)

		// 아이디 검사
		val user: OvirtUser = findOneAAA(username)
		if (user.disabled == 1)
			throw ErrorPattern.OVIRTUSER_LOCKED.toException()

		// 비밀번호 검사
		val res = password.validatePassword(user.password)
		log.info("authenticate ... res: {}", res)

		// 로그인 성공/실패 처리 기록
		user.consecutiveFailures = if (res) 0 else user.consecutiveFailures+1
		ovirtUsers.save(user)

		if (user.consecutiveFailures >= propsConfig.loginLimit) {
			log.info("authenticate ... 실패처리 (총 {}번)", user.consecutiveFailures)
			user.disabled = 1
			ovirtUsers.save(user)
			throw ErrorPattern.OVIRTUSER_LOCKED.toException()
		}
		if (!res)
			throw ErrorPattern.OVIRTUSER_AUTH_INVALID.toException()

		val dto: TokenDto = jwtUtil.createAllToken(username)
		val rToken: RefreshToken? = refreshTokens.findByExternalId(user.uuid) // Refresh토큰 있는지 확인

		// 있다면 새토큰 발급후 업데이트
		// 없다면 새로 만들고 디비 저장
		if (rToken != null) {
			refreshTokens.save(rToken.updateToken(dto.refreshToken))
		} else {
			refreshTokens.save(RefreshToken.builder {
				externalId { user.uuid }
				refreshToken { dto.refreshToken }
			})
		}

		return HttpHeaders().apply {
			add(JwtUtil.ACCESS_TOKEN, dto.accessToken)
			add(JwtUtil.REFRESH_TOKEN, dto.refreshToken)
		}
	}

	@Transactional("aaaTransactionManager")
	override fun updatePassword(username: String, resetPassword: ResetPasswordPrompt?, force: Boolean): OvirtUser {
		log.info("updatePassword ... username: {}", username)
		val user: OvirtUser = findOneAAA(username)

		if (!force && authenticate(username, resetPassword?.pwCurrent ?: "").isEmpty())
			throw ErrorPattern.OVIRTUSER_AUTH_INVALID.toException()

		user.password = resetPassword?.pwNew?.hashPassword()
			?: throw ErrorPattern.OVIRTUSER_AUTH_INVALID.toException()
		val userUpdated: OvirtUser = ovirtUsers.save(user)
		return userUpdated
	}

	@Transactional("aaaTransactionManager")
	override fun update(username: String, userVo: UserVo?): UserVo? {
		log.info("update ... username: {}, userVo: {}", username, userVo)
		val user2Update: OvirtUser = findOneAAA(username).apply {
			disabled = if (userVo?.disabled == true) 1 else 0
			if (userVo?.disabled == false) {
				consecutiveFailures = 0
				unlockTime = OvirtUser.DEFAULT_TIME_LOWEST
			}
		}
		val resUserUpdated: OvirtUser = ovirtUsers.save(user2Update)

		val userDetail2Update: UserDetail = userDetails.findByExternalId(user2Update.uuid)?.apply {
			name = userVo?.firstName ?: ""
			surname = userVo?.surName ?: ""
			email = userVo?.email
		} ?: throw ErrorPattern.OVIRTUSER_NOT_FOUND.toException()

		val resUserDetailUpdated: UserDetail = userDetails.save(userDetail2Update)
		return resUserUpdated.toUserVo(resUserDetailUpdated, true)
	}

	@Transactional("aaaTransactionManager")
	override fun remove(username: String, shouldDeleteAdminByForce: Boolean): Boolean {
		log.info("remove ... username: {}", username)
		val user2Remove: OvirtUser = findOneAAA(username)
		ovirtUsers.delete(user2Remove)
		val userDetail2Remove: UserDetail? = userDetails.findByExternalId(user2Remove.uuid) ?: run {
			log.warn("remove ... no UserDetail FOUND for username: {}", username)
			return@run null
			// throw ErrorPattern.OVIRTUSER_NOT_FOUND.toException()
		}
		userDetail2Remove?.let { userDetails.delete(it) }
		return true
	}

	override fun findAllUserSessions(): List<UsersVo> {
		TODO("Not yet implemented")
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
