package com.itinfo.rutilvm.api.service.setting

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.ObjectMapper
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.ClusterVo
import com.itinfo.rutilvm.api.model.setting.ExternalHostProviderVo
import com.itinfo.rutilvm.api.model.setting.ProviderPropertyVo
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.model.setting.ProviderVo
import com.itinfo.rutilvm.api.model.setting.toAddExternalHostProviderVo
import com.itinfo.rutilvm.api.model.setting.toAddHostProvider
import com.itinfo.rutilvm.api.model.setting.toEditExternalHostProviderVo
import com.itinfo.rutilvm.api.repository.aaarepository.entity.OvirtUser
import com.itinfo.rutilvm.api.repository.engine.ProvidersRepository
import com.itinfo.rutilvm.api.repository.engine.entity.ProvidersEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toExternalHostProviderVo
import com.itinfo.rutilvm.api.repository.engine.entity.toExternalHostProviderVos
import com.itinfo.rutilvm.api.repository.engine.entity.toProviderVo
import com.itinfo.rutilvm.api.repository.engine.entity.toProviderVos
import com.itinfo.rutilvm.api.service.computing.ItClusterService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.addExternalHostProvider
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.removeExternalHostProvider
import com.itinfo.rutilvm.util.ovirt.updateExternalHostProvider
import org.ovirt.engine.sdk4.types.ExternalHostProvider

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
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
	override fun add(externalHostProviderVo: ExternalHostProviderVo): ExternalHostProviderVo? {
		log.info("add ... externalHostProviderVo: {}", externalHostProviderVo)

		val name = externalHostProviderVo.name
		if (rProvider.findByName(name) != null)
			throw ErrorPattern.EXTERNAL_HOST_PROVIDER_DUPLICATE.toException()

		val propertyVo = externalHostProviderVo.providerPropertyVo
		val noVerify = if (propertyVo?.verifySSL == true) 1 else 0
		val url = "vpx://${propertyVo?.vCenter}/${propertyVo?.dataCenter}/${propertyVo?.cluster}/${propertyVo?.esxi}?no_verify=1"

		val additionalPropertiesMap = mapOf(
			"storagePoolId" to wrapGuid(propertyVo?.dataCenterVo?.id),
			"proxyHostId" to wrapGuid(propertyVo?.hostVo?.id),
			"vCenter" to propertyVo?.vCenter,
			"esx" to propertyVo?.esxi,
			"dataCenter" to listOfNotNull(
				propertyVo?.dataCenter,
				propertyVo?.cluster
			).takeIf { it.isNotEmpty() }?.joinToString("/"),
			"verifySSL" to propertyVo?.verifySSL
		)

		println("url: $url")

		val objectMapper = ObjectMapper()
		objectMapper.setSerializationInclusion(JsonInclude.Include.ALWAYS) // null 포함
		val additionalPropertiesJson = objectMapper.writeValueAsString(additionalPropertiesMap)

		val uuid: UUID = UUID.randomUUID()
		val providerAdd = ProvidersEntity.builder {
			id { uuid }
			name { name }
			description { externalHostProviderVo.description }
			url { url }
			authUrl { null }
			providerType { externalHostProviderVo.providerType.toString().uppercase() }
			authRequired { externalHostProviderVo.authRequired }
			authUsername { externalHostProviderVo.authUsername }
			authPassword { externalHostProviderVo.authPassword }
			additionalProperties { additionalPropertiesJson }
		}

		val providerAdded = rProvider.save(providerAdd)
		return providerAdd.toExternalHostProviderVo()
	}

	fun wrapGuid(uuid: String?): List<Any>? {
		return uuid?.takeIf { it.isNotBlank() }?.let {
			listOf(
				"org.ovirt.engine.core.compat.Guid",
				mapOf("uuid" to it)
			)
		}
	}


	@Throws(Error::class)
	override fun update(externalHostProviderVo: ExternalHostProviderVo): ExternalHostProviderVo? {
		val updateProvider: ExternalHostProvider? = conn.updateExternalHostProvider(
			externalHostProviderVo.toEditExternalHostProviderVo()
		).getOrNull()

		val res: ProvidersEntity? = updateProvider?.id()?.let { rProvider.findById(it.toUUID()).get() }
		return res?.toExternalHostProviderVo()
	}

	@Throws(Error::class)
	override fun remove(externalHostProviderId: String): Boolean {
		val res: Result<Boolean> = conn.removeExternalHostProvider(externalHostProviderId)
		return res.isSuccess
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
