package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.builders.SnapshotBuilder
import org.ovirt.engine.sdk4.builders.VmBuilder
import org.ovirt.engine.sdk4.services.SystemService
import org.ovirt.engine.sdk4.services.VmService
import org.ovirt.engine.sdk4.types.*
import org.springframework.stereotype.Service

interface ItVmSnapshotService {
	/**
	 * [ItVmSnapshotService.findAllFromVm]
	 * 스냅샷 목록
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return List<[SnapshotVo]>
	 */
	@Throws(Error::class)
	fun findAllFromVm(vmId: String): List<SnapshotVo>
	/**
	 * [ItVmSnapshotService.findOneFromVm]
	 * 스냅샷 상세정보
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param snapshotId [String] 스냅샷 Id
	 * @return [SnapshotVo] ?
	 */
	@Throws(Error::class)
	fun findOneFromVm(vmId: String, snapshotId: String): SnapshotVo?

	// 가상머신 스냅샷 생성 창 - [ItVmDiskService.findAllDisksFromVm]

	/**
	 * [ItVmSnapshotService.addFromVm]
	 * 스냅샷 생성 (생성 중에는 다른기능(삭제, 커밋)같은 기능 구현 x)
	 * 
	 * @param vmId
	 * @param snapshotVo
	 * @return [SnapshotVo]
	 */
	@Throws(Error::class)
	fun addFromVm(vmId: String, snapshotVo: SnapshotVo): SnapshotVo?
	/**
	 * [ItVmSnapshotService.removeFromVm]
	 * 스냅샷 삭제
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param snapshotId [String] 스냅샷 Id
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeFromVm(vmId: String, snapshotId: String): Boolean
	/**
	 * [ItVmSnapshotService.removeMultiFromVm]
	 * 스냅샷 삭제(다중)
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param snapshotIds List<[String]> 스냅샷 Id 목록
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun removeMultiFromVm(vmId: String, snapshotIds: List<String>): Boolean

	/**
	 * [ItVmSnapshotService.previewFromVm]
	 * 스냅샷 미리보기
	 *
	 * @param vmId
	 * @param snapshotId: [String]
	 * @return [SnapshotVo]
	 */
	@Throws(Error::class)
	fun previewFromVm(vmId: String, snapshotId: String): Boolean
	/**
	 * [ItVmSnapshotService.commitFromVm]
	 * 스냅샷 커밋
	 * 미리보기를 눌러야 활성화
	 *
	 * @param vmId
	 * @return [SnapshotVo]
	 */
	@Throws(Error::class)
	fun commitFromVm(vmId: String): Boolean
	/**
	 * [ItVmSnapshotService.undoFromVm]
	 * 스냅샷 되돌리기
	 * 미리보기를 눌러야 활성화
	 *
	 * @param vmId
	 * @return [SnapshotVo]
	 */
	@Throws(Error::class)
	fun undoFromVm(vmId: String): Boolean
	/**
	 * [ItVmSnapshotService.cloneFromVm]
	 * 스냅샷 복제
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param name [String]  가상머신 이름
	 * @return [SnapshotVo]
	 */
	@Throws(Error::class)
	fun cloneFromVm(vmId: String, name: String): Boolean
}

@Service
class VmSnapshotServiceImpl(

): BaseService(), ItVmSnapshotService {

	@Throws(Error::class)
	override fun findAllFromVm(vmId: String): List<SnapshotVo> {
		log.info("findAllFromVm ... ")
		val res: List<Snapshot> = conn.findAllSnapshotsFromVm(vmId)
			.getOrDefault(listOf())
		return res.toSnapshotVos(conn, vmId)
	}

	@Throws(Error::class)
	override fun findOneFromVm(vmId: String, snapshotId: String): SnapshotVo? {
		log.info("findOneFromVm ... vmId: {}, snapshotId: {}", vmId, snapshotId)
		val res: Snapshot? = conn.findSnapshotFromVm(vmId, snapshotId)
			.getOrNull()
		return res?.toSnapshotVo(conn, vmId)
	}

	@Throws(Error::class)
	override fun addFromVm(vmId: String, snapshotVo: SnapshotVo): SnapshotVo? {
		log.info("addFromVm ... ")
		val res: Snapshot? = conn.addSnapshotFromVm(
			vmId, snapshotVo.toAddSnapshot()
		).getOrNull()
		return res?.toSnapshotVo(conn, vmId)
	}

	@Throws(Error::class)
	override fun removeFromVm(vmId: String, snapshotId: String): Boolean {
		log.info("removeFromVm ... vmId: {}, snapshotId: {}", vmId, snapshotId)
		val res: Result<Boolean> = conn.removeSnapshotFromVm(vmId, snapshotId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun removeMultiFromVm(vmId: String, snapshotIds: List<String>): Boolean {
		log.info("removeMultiFromVm ... vmId: {}, snapshotIds: {}", vmId, snapshotIds)
		val res: Result<Boolean> = conn.removeMultiSnapshotFromVm(vmId, snapshotIds)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun previewFromVm(vmId: String, snapshotId: String): Boolean {
		log.info("previewFromVm ... vmId: {}, snapshotId: {}", vmId, snapshotId)
		val res: Result<Boolean> = conn.previewSnapshotFromVm(
			vmId,
			SnapshotBuilder().id(snapshotId).build()
		)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun commitFromVm(vmId: String): Boolean {
		log.info("commitFromVm ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.commitSnapshotFromVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun undoFromVm(vmId: String): Boolean {
		log.info("undoFromVm ... vmId: {}", vmId)
		val res: Result<Boolean> = conn.undoSnapshotFromVm(vmId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun cloneFromVm(vmId: String, name: String): Boolean {
		log.info("cloneFromVm ... vmId: {}, name: {}", vmId, name)
		val res: Result<Boolean> = conn.cloneSnapshotFromVm(
			vmId,
			VmBuilder().id(vmId).name(name).build()
		)
		return res.isSuccess
	}


	companion object {
		private val log by LoggerDelegate()
	}
}