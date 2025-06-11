package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.fromNetworkToIdentifiedVo
import com.itinfo.rutilvm.api.model.fromNetworksToIdentifiedVos
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.HostNic
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.NetworkAttachment
import org.springframework.stereotype.Service

interface ItHostNicService {
	/**
	 * [ItHostNicService.findAllFromHost]
	 * 호스트 네트워크 인터페이스 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[HostNicVo]> 네트워크 인터페이스 목록
	 */
	@Throws(Error::class)
	fun findAllFromHost(hostId: String): List<HostNicVo>

	/**
	 * [ItHostNicService.findOneFromHost]
	 * 호스트 네트워크 인터페이스
	 *
	 * @param hostId [String] 호스트 Id
	 * @param hostNicId [String] 호스트 nic Id
	 * @return [HostNicVo]? 네트워크 인터페이스 목록
	 */
	@Throws(Error::class)
	fun findOneFromHost(
		hostId: String,
		hostNicId: String
	): HostNicVo?

	/**
	 * [ItHostNicService.findAllNetworkAttachmentsFromHost]
	 * 호스트 네트워크 할당 목록
	 *
	 * @param hostId [String] 호스트 Id
	 * @return List<[NetworkAttachmentVo]> 네트워크 목록
	 */
	@Throws(Error::class)
	fun findAllNetworkAttachmentsFromHost(hostId: String): List<NetworkAttachmentVo>

	/**
	 * [ItHostNicService.findNetworkAttachmentFromHost]
	 * 호스트 네트워크 할당 조회
	 *
	 * @param hostId [String] 호스트 Id
	 * @param networkAttachmentId [String] networkAttachment Id
	 * @return [NetworkAttachmentVo] 네트워크
	 */
	@Throws(Error::class)
	fun findNetworkAttachmentFromHost(
		hostId: String,
		networkAttachmentId: String
	): NetworkAttachmentVo?

	/**
	 * [ItHostNicService.setUpNetworksFromHost]
	 * 호스트 네트워크 설정
	 *
	 * @param hostId [String] 호스트 Id
	 * @param hostNetworkVo [HostNetworkVo] 호스트 네트워크
	 * @return [Boolean] 아직미정
	 */
	@Throws(Error::class)
	fun setUpNetworksFromHost(
		hostId: String,
		hostNetworkVo: HostNetworkVo
	): Boolean

}

@Service
class ItHostNicServiceImpl(
): BaseService(), ItHostNicService {

    @Throws(Error::class)
    override fun findAllFromHost(hostId: String): List<HostNicVo> {
        log.info("findAllFromHost ... hostId: {}", hostId)
		val res: List<HostNic> = conn.findAllHostNicsFromHost(hostId, follow = "host,statistics").getOrDefault(emptyList())
			.filter { !it.baseInterfacePresent() } // 네트워크에 vlan있으면 baseinterface가 만들어짐
		return res.toHostNicVos(conn)
    }

	@Throws(Error::class)
    override fun findOneFromHost(hostId: String, hostNicId: String): HostNicVo? {
        log.info("findOneFromHost ... hostId: {}, hostNicId: {}", hostId, hostNicId)
        val res: HostNic? = conn.findNicFromHost(hostId, hostNicId, follow = "host,statistics").getOrNull()
        return res?.toHostNicVo(conn)
    }

	@Throws(Error::class)
	override fun findAllNetworkAttachmentsFromHost(hostId: String): List<NetworkAttachmentVo> {
		log.info("findAllNetworkAttachmentFromHost... hostId: {}", hostId)
		val res: List<NetworkAttachment> = conn.findAllNetworkAttachmentsFromHost(hostId, follow = "host,host_nic,network").getOrDefault(emptyList())
		return res.toNetworkAttachmentVos()
	}

	@Throws(Error::class)
	override fun findNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String): NetworkAttachmentVo? {
		log.info("findNetworkAttachmentFromHost ... hostId: {}, naId: {}", hostId, networkAttachmentId)
		val res: NetworkAttachment? = conn.findNetworkAttachmentFromHost(hostId, networkAttachmentId, follow = "host,host_nic,network").getOrNull()
		return res?.toNetworkAttachmentVo()
	}

	@Throws(Error::class)
	override fun setUpNetworksFromHost(hostId: String, hostNetworkVo: HostNetworkVo): Boolean {
		log.info("setUpNetworksFromHost ... hostId: {}, hostNetworkVo: {}", hostId, hostNetworkVo)

		val res: Result<Boolean> = conn.setupNetworksFromHost(
			hostId,
			hostNetworkVo.bonds.toModifiedBonds(),
			hostNetworkVo.bondsToRemove.toRemoveBonds(),
			hostNetworkVo.networkAttachments.toModifiedNetworkAttachments(),
			hostNetworkVo.networkAttachmentsToRemove.toRemoveNetworkAttachments()
		)
		return res.isSuccess
	}

	companion object {
        private val log by LoggerDelegate()
    }
}
