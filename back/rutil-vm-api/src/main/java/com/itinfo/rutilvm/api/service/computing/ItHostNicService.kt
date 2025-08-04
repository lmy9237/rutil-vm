package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.repository.engine.NetworkClusterRepository
import com.itinfo.rutilvm.api.repository.engine.entity.NetworkClusterEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toNetworkVosFromNetworkClusters
import com.itinfo.rutilvm.api.repository.engine.entity.toUsageVo
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.HostNic
import org.ovirt.engine.sdk4.types.NetworkAttachment
import org.springframework.beans.factory.annotation.Autowired
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

	/**
	 * [ItHostNicService.syncallNetworksHost]
	 * 호스트 네트워크 동기화
	 *
	 * @param hostId [String] 호스트 Id
	 * @return
	 */
	@Throws(Error::class)
	fun syncallNetworksHost(hostId: String): Boolean
}

@Service
class ItHostNicServiceImpl(
): BaseService(), ItHostNicService {
	@Autowired private lateinit var rNetworkCluster: NetworkClusterRepository

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
		val host = conn.findHost(hostId).getOrNull()
		val clusterId = host?.cluster()?.id()?.toUUID()!!

		val res: List<NetworkAttachment> = conn.findAllNetworkAttachmentsFromHost(hostId, follow = "host,host_nic,network")
			.getOrDefault(emptyList())

		return res.map { networkAttachment ->
			val networksFound: NetworkClusterEntity = rNetworkCluster.findOneByNetworkIdAndClusterId(networkAttachment.network().id().toUUID(), clusterId)
			networkAttachment.toHostNetworkAttachmentVo(networksFound.toUsageVo())
		}
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

		// val synced = hostNetworkVo.networkAttachments.filter { !it.inSync }
		// log.info("modifiSize: {}, syncedSize: {}, synced: {}", hostNetworkVo.networkAttachments.toModifiedNetworkAttachments().size, synced.size, synced.map { println(it.networkVo.name) })

		val res: Result<Boolean> = conn.setupNetworksFromHost(
			hostId = hostId,
			modifiedBonds = hostNetworkVo.bonds.toModifiedBonds(),
			removedBonds = hostNetworkVo.bondsToRemove.toRemoveBonds(),
			synchronizedNetworkAttachments = hostNetworkVo.networkAttachmentsToSync.toSyncNetworkAttachments(),
			modifiedNetworkAttachments = hostNetworkVo.networkAttachments.toModifiedNetworkAttachments(),
			removedNetworkAttachments = hostNetworkVo.networkAttachmentsToRemove.toRemoveNetworkAttachments()
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun syncallNetworksHost(hostId: String): Boolean {
		log.info("syncallNetworksHost ... hostId: {}", hostId)
		val res: Result<Boolean> = conn.syncallNetworksHost(hostId)
		return res.isSuccess
	}

	companion object {
        private val log by LoggerDelegate()
    }
}
