package com.itinfo.rutilvm.api.service.setting

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.setting.ExternalHostProviderVo
import com.itinfo.rutilvm.api.model.setting.toProvidersEntity
import com.itinfo.rutilvm.api.repository.engine.ProvidersRepository
import com.itinfo.rutilvm.api.repository.engine.entity.ProvidersEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toExternalHostProviderVo
import com.itinfo.rutilvm.api.repository.engine.entity.toExternalHostProviderVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.removeExternalHostProvider
import org.postgresql.util.PSQLException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface ItProviderService {
	/**
	 * [ItProviderService.findAll]
	 * 공급자 목록
	 *
	 * @return List<[ExternalHostProviderVo]> 공급자 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<ExternalHostProviderVo>
	/**
	 * [ItProviderService.findOne]
	 * 공급자
	 *
	 * @param providerId [String]
	 * @return [ExternalHostProviderVo] 공급자
	 */
	@Throws(Error::class)
	fun findOne(providerId: String): ExternalHostProviderVo?
	/**
	 * [ItProviderService.add]
	 * 공급자 생성
	 *
	 * @param externalHostProviderVo [ExternalHostProviderVo]
	 * @return [ExternalHostProviderVo]?
	 */
	@Throws(Error::class)
	fun add(externalHostProviderVo: ExternalHostProviderVo): ExternalHostProviderVo?
	/**
	 * [ItProviderService.update]
	 * 공급자 편집
	 *
	 * @param externalHostProviderVo [ExternalHostProviderVo]
	 * @return [ExternalHostProviderVo]?
	 */
	@Throws(Error::class)
	fun update(externalHostProviderVo: ExternalHostProviderVo): ExternalHostProviderVo?
	/**
	 * [ItProviderService.remove]
	 * 공급자 삭제
	 *
	 * @param externalHostProviderId [String]
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun remove(externalHostProviderId: String): Boolean

}

@Service
class ProviderServiceImpl (
): BaseService(), ItProviderService {
	@Autowired private lateinit var rProvider: ProvidersRepository

	@Throws(Error::class)
	override fun findAll(): List<ExternalHostProviderVo> {
		log.info("findAll ...")
		val res: List<ProvidersEntity> = rProvider.findAll()
		return res.toExternalHostProviderVos()
	}

	@Throws(Error::class)
	override fun findOne(providerId: String): ExternalHostProviderVo? {
		log.info("findOne ...")
		val res: ProvidersEntity = rProvider.findById(providerId.toUUID()).get()
		return res.toExternalHostProviderVo()
	}

	@Throws(Error::class)
	@Transactional("engineTransactionManager")
	override fun add(externalHostProviderVo: ExternalHostProviderVo): ExternalHostProviderVo? {
		log.info("add ... externalHostProviderVo: {}", externalHostProviderVo)

		val name = externalHostProviderVo.name
		if (rProvider.findByName(name) != null)
			throw ErrorPattern.EXTERNAL_HOST_PROVIDER_DUPLICATE.toException()

		val providerAdded: ProvidersEntity =
			rProvider.save(externalHostProviderVo.toProvidersEntity())
		return providerAdded.toExternalHostProviderVo()
	}

	@Throws(Error::class, PSQLException::class)
	override fun update(externalHostProviderVo: ExternalHostProviderVo): ExternalHostProviderVo? {
		log.info("update ... externalHostProviderVo: {}", externalHostProviderVo)

		val providersFound: ProvidersEntity = rProvider.findById(externalHostProviderVo.id?.toUUID())
			?: throw ErrorPattern.EXTERNAL_HOST_PROVIDER_DUPLICATE.toException()

		val providers2Update: ProvidersEntity = providersFound.apply {
			this.name = externalHostProviderVo.name
			this.description = externalHostProviderVo.description
			this.url = externalHostProviderVo.providerPropertyVo?.vpxUrl
			this._providerType = externalHostProviderVo.providerType?.code
			this.authRequired = externalHostProviderVo.authRequired
			this.authUsername = externalHostProviderVo.authUsername
			// this.authPassword = externalHostProviderVo.authPassword
			this._additionalProperties = externalHostProviderVo.providerPropertyVo?.additionalProperties2Json
		}
		val providerUpdated: ProvidersEntity = rProvider.save(providers2Update)
		// val providerUpdate: ProvidersEntity = rProvider.findByProviderId(externalHostProviderVo.id)?.apply {
		// 	name = externalHostProviderVo.name
		// 	description = externalHostProviderVo.description
		// 	url = externalHostProviderVo.url
		// 	providerType = externalHostProviderVo.providerType
		// 	authRequired = externalHostProviderVo.authRequired
		// 	authUsername = externalHostProviderVo.authUsername
		// 	authPassword = externalHostProviderVo.authPassword
		// 	additionalProperties = externalHostProviderVo.additionalProperties
		// } ?: throw ErrorPattern.EXTERNAL_HOST_PROVIDER_NOT_FOUND.toException()

		return providerUpdated.toExternalHostProviderVo()
	}

	@Throws(Error::class)
	override fun remove(externalHostProviderId: String): Boolean {
		val res: Result<Boolean> = conn.removeExternalHostProvider(externalHostProviderId)
		return res.isSuccess
	}

	private fun wrapGuid(uuid: String?): List<Any>? {
		return uuid?.takeIf { it.isNotBlank() }?.let {
			listOf(
				"org.ovirt.engine.core.compat.Guid",
				mapOf("uuid" to it)
			)
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
