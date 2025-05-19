package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.model.computing.ClusterLevelVo

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.ClusterLevelByArchitectureVo
import com.itinfo.rutilvm.api.model.computing.CpuTypeVo
import com.itinfo.rutilvm.api.model.computing.toClusterLevelVo
import com.itinfo.rutilvm.api.model.computing.toClusterLevelVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.builders.NetworkBuilder
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
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
	 * [ItClusterLevelService.findAllByArchitecture]
	 * (아키텍쳐별로) 클러스터 레벨 목록 조회
	 *
	 * @return List<[ClusterLevelByArchitectureVo]> 클러스터 레벨 목록
	 */
	@Throws(Error::class)
	fun findAllCpuTypesByArchitecture(): Map<Architecture?, List<CpuTypeVo>>
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
	}

	@Throws(Error::class)
	override fun findAllCpuTypesByArchitecture(): Map<Architecture?, List<CpuTypeVo>> {
		log.info("findAllCpuTypesByArchitecture ...")
		val res: List<ClusterLevel> = conn.findAllClusterLevels()
			.getOrDefault(emptyList())
		return res.toClusterLevelVos().flatMap {
			it.cpuTypes
		}.groupBy {
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

	companion object {
		private val log by LoggerDelegate()
	}
}
