package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.model.computing.ClusterLevelVo

import com.itinfo.rutilvm.common.LoggerDelegate

import com.itinfo.rutilvm.api.model.computing.ClusterLevelByArchitectureVo
import com.itinfo.rutilvm.api.model.computing.CpuTypeVo
import com.itinfo.rutilvm.api.model.computing.toClusterLevelVo
import com.itinfo.rutilvm.api.model.computing.toClusterLevelVos
import com.itinfo.rutilvm.api.ovirt.business.ArchitectureType

import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.*
import org.springframework.stereotype.Service
import kotlin.Throws

interface ItClusterLevelService {
	/**
	 * [ItClusterLevelService.findAll]
	 * 클러스터 레벨 목록 조회
	 *
	 * @return List<[ClusterLevelVo]> 클러스터 레벨 목록
	 */
	@Throws(Error::class)
	fun findAll(): List<ClusterLevelVo>
	/**
	 * [ItClusterLevelService.findAll]
	 * 클러스터 레벨 ID 목록 전체 조회
	 *
	 * @return List<[ClusterLevelVo]> 클러스터 레벨 목록
	 */
	@Throws(Error::class)
	fun findAllIds(): List<String>
	/**
	 * [ItClusterLevelService.findAllByArchitecture]
	 * (아키텍쳐별로) 클러스터 레벨 목록 조회
	 *
	 * @return List<[ClusterLevelByArchitectureVo]> 클러스터 레벨 목록
	 */
	@Throws(Error::class)
	fun findAllCpuTypesByArchitecture(): Map<ArchitectureType?, List<CpuTypeVo>>
	/**
	 * [ItClusterLevelService.findOne]
	 * 클러스터 레벨 상세정보
	 *
	 * @param clusterId [String] 클러스터 Id
	 * @return [ClusterLevelVo]?
	 */
	@Throws(Error::class)
	fun findOne(levelId: String): ClusterLevelVo?
}

@Service
class ClusterLevelServiceImpl(

) : BaseService(), ItClusterLevelService {
	@Throws(Error::class)
	override fun findAll(): List<ClusterLevelVo> {
		log.info("findAll ...")
		val res: List<ClusterLevel> = conn.findAllClusterLevels()
			.getOrDefault(emptyList())
		return res.toClusterLevelVos()
			.sortedByDescending { it.id }

	}

	@Throws(Error::class)
	override fun findAllCpuTypesByArchitecture(): Map<ArchitectureType?, List<CpuTypeVo>> {
		log.info("findAllCpuTypesByArchitecture ...")
		val res: List<ClusterLevel> = conn.findAllClusterLevels()
			.getOrDefault(emptyList())
		return res.toClusterLevelVos().flatMap {
			it.cpuTypes
		}.sortedBy { it.level }.groupBy {
			it.architecture
		}
	}

	@Throws(Error::class)
	override fun findOne(levelId: String): ClusterLevelVo? {
		log.info("findOne ... levelId: {}", levelId)
		val res: ClusterLevel? = conn.findClusterLevel(levelId)
			.getOrNull()
		// ?: throw ErrorPattern.CLUSTER_LEVEL_
		return res?.toClusterLevelVo()
	}

	override fun findAllIds(): List<String>
		= findAll().map { it.id }.sortedByDescending { it }

	companion object {
		private val log by LoggerDelegate()
	}
}
