package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.network.NicVo
import com.itinfo.rutilvm.api.model.network.toNicVoFromVm
import com.itinfo.rutilvm.api.model.network.toNicVosFromVm
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.Nic
import org.springframework.stereotype.Service
import kotlin.jvm.Throws

interface ItVmNicService {
	/**
	 * [ItVmNicService.findAllFromVm]
	 * 네트워크 인터페이스
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return List<[NicVo]>
	 */
	@Throws(Error::class)
	fun findAllFromVm(vmId: String): List<NicVo>
	/**
	 * [ItVmNicService.findOneFromVm]
	 * 네트워크 인터페이스 정보, 편집
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param nicId [String] nic Id
	 * @return [NicVo]?
	 */
	@Throws(Error::class)
	fun findOneFromVm(vmId: String, nicId: String): NicVo?

	 // 네트워크 인터페이스 생성창 -
	// 		VnicProfile 목록 [ItVmService.findAllVnicProfilesFromCluster]

	/**
	 * [ItVmNicService.addFromVm]
	 * 네트워크 인터페이스 생성
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param nicVo [NicVo]
	 * @return [NicVo]?
	 */
	@Throws(Error::class)
	fun addFromVm(vmId: String, nicVo: NicVo): NicVo?
	/**
	 * [ItVmNicService.updateFromVm]
	 * 네트워크 인터페이스 편집
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param nicVo [NicVo]
	 * @return [NicVo]?
	 */
	@Throws(Error::class)
	fun updateFromVm(vmId: String, nicVo: NicVo): NicVo?
	/**
	 * [ItVmNicService.removeFromVm]
	 * 네트워크 인터페이스 삭제
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param nicId [String] nic Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeFromVm(vmId: String, nicId: String): Boolean
}

@Service
class VmNicServiceImpl(
) : BaseService(), ItVmNicService {

	@Throws(Error::class)
	override fun findAllFromVm(vmId: String): List<NicVo> {
		log.info("findAllFromVm ... vmId: {}", vmId)
		val res: List<Nic> = conn.findAllNicsFromVm(vmId, follow = "statistics,reporteddevices").getOrDefault(emptyList())
		return res.toNicVosFromVm(conn)
		// val res: List<Nic> = conn.findAllNicsFromVm(vmId, follow = "vnicprofile.network,statistics,reporteddevices").getOrDefault(emptyList())
		// return res.toNicVmMenus()
	}

	@Throws(Error::class)
	override fun findOneFromVm(vmId: String, nicId: String): NicVo? {
		log.info("findOneFromVm ... vmId: {}, nicId: {}", vmId, nicId)
		val res: Nic? = conn.findNicFromVm(vmId, nicId).getOrNull()
		return res?.toNicVoFromVm(conn)
		// val res: Nic? = conn.findNicFromVm(vmId, nicId, follow = "vnicprofile.network").getOrNull()
		// return res?.toVmNic()
	}

	@Throws(Error::class)
	override fun addFromVm(vmId: String, nicVo: NicVo): NicVo? {
		log.info("addFromVm ... vmId: {}, nicVo: {}", vmId, nicVo)
		val res: Nic? = conn.addNicFromVm(
			vmId,
			nicVo.toAddNic()
		).getOrNull()
		return res?.toNicIdName()
	}

	@Throws(Error::class)
	override fun updateFromVm(vmId: String, nicVo: NicVo): NicVo? {
		log.info("updateFromVm ... vmId: {}, nicVo: {}", vmId, nicVo)
		val res: Nic? = conn.updateNicFromVm(
			vmId,
			nicVo.toEditNic()
		).getOrNull()
		return res?.toNicIdName()
	}

	@Throws(Error::class)
	override fun removeFromVm(vmId: String, nicId: String): Boolean {
		log.info("removeFromVm ... vmId: {}, nicId: {}", vmId, nicId)
		val res: Result<Boolean> = conn.removeNicFromVm(vmId, nicId)
		return res.isSuccess
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
