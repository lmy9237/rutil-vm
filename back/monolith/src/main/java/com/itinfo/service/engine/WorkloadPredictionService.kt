package com.itinfo.service.engine

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllVms

import com.itinfo.model.karajan.WorkloadVo
import com.itinfo.model.karajan.toWorkloadVo
import com.itinfo.model.karajan.WorkloadVmVo
import com.itinfo.model.karajan.toWorkloadVmVo
import com.itinfo.model.karajan.HistoryVo

import com.itinfo.service.SystemPropertiesService

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Vm

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

import java.util.function.Consumer


@Component
class WorkloadPredictionService(private var queryGetVmWorkload: String) {
	lateinit var jdbcTemplate: JdbcTemplate

	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var  systemPropertiesService: SystemPropertiesService
	
	@Scheduled(cron = "0 0 01 * * ?")
	fun makeLearning() {
		log.info("... makeLearning")
		val properties = systemPropertiesService.retrieveSystemProperties()
		if (properties.deeplearningUri.isNotEmpty()) {
			log.info("make learning ${properties.deeplearningUri}")
			val workload = getWorkload()
			val rest = RestTemplate()
			val result = rest.postForObject(properties.deeplearningUri, workload, String::class.java)
			log.info("result: $result")
		}
	}

	fun getWorkload(): WorkloadVo {
		log.info("... getWorkload")
		val connection = adminConnectionService.getConnection()
		val properties = systemPropertiesService.retrieveSystemProperties()
		return properties.toWorkloadVo(connection)
	}

	private fun getVms(connection: Connection, clusterName: String): List<WorkloadVmVo> {
		log.info("... getVms")
		val targets: MutableList<WorkloadVmVo> = ArrayList()
		val vms: List<Vm> =
			connection.findAllVms("cluster=$clusterName")
		vms.forEach(Consumer { vm: Vm ->
			val target = vm.toWorkloadVmVo(connection, jdbcTemplate)
			val histories: MutableList<HistoryVo> =
				jdbcTemplate?.query(queryGetVmWorkload, arrayOf(
					(if (target.memoryInstalled != null) target.memoryInstalled else 0).toString(), vm.id()
				), BeanPropertyRowMapper(HistoryVo::class.java)
			)
			target.histories = histories ?: listOf()
			targets.add(target)
		})
		return targets
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}

