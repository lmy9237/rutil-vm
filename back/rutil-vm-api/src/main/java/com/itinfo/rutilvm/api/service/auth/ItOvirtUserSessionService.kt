package com.itinfo.rutilvm.api.service.auth

import com.itinfo.rutilvm.api.model.auth.UserSessionVo
import com.itinfo.rutilvm.api.repository.engine.EngineSessionsRepository
import com.itinfo.rutilvm.api.repository.engine.entity.EngineSessionsEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toUserSessions
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

interface ItOvirtUserSessionService {
	/**
	 * [ItOvirtUserService.findAll]
	 * 모든 활성 사용자 세션 조회
	 *
	 * @return List<[UserSessionVo]>
	 */
	@Throws(PSQLException::class)
	fun findAll(username: String?): List<UserSessionVo>
}

@Service
class OvirtUserSessionServiceImpl(

): BaseService(), ItOvirtUserSessionService {
	@Autowired private lateinit var engineSessions: EngineSessionsRepository

	override fun findAll(username: String?): List<UserSessionVo> {
		log.info("findAll ... username: {}", username)
		val res: List<EngineSessionsEntity> =
			if (username.isNullOrEmpty()) engineSessions.findAll()
			else engineSessions.findAllByUserName(username)
		return res.toUserSessions()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
