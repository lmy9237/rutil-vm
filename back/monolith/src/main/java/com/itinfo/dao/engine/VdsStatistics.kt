package com.itinfo.dao.engine

import com.itinfo.dao.gson
import com.itinfo.model.HostHaVo

import java.io.Serializable
import java.util.UUID
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Column
import javax.persistence.Id

/**
 * [VdsStatistics]
 * engine 엔티티: VDS_STATISTICS
 *
 * CLUSTER-SQL > COMPUTE-CLUSTER
 * @see com.itinfo.model.HostHaVo
 */
@Entity
@Table(name="VDS_STATISTICS")
data class VdsStatistics(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	val vdsId: UUID,
	var cpuIdle: Int, // numeric
	var cpuLoad: Int, // numeric
	var cpuSys: Int, // numeric
	var cpuUser: Int, // numeric
	var usageMemPercent: Int,
	var usageCpuPercent: Int,
	var usageNetworkPercent: Int,
	// var memAvailable: Int, // bigint
	var memShared: Int, // bigint
	var swapFree: Int, // bigint
	var swapTotal: Int, // bigint
	var ksmCpuPercent: Int,
	var ksmPages: Int, // bigint
	var ksmState: Boolean,
	@Column(name="_update_date")
	var updateDate:	LocalDateTime,
	var memFree: Int, // bigint
	var haScore: Int,
	var anonymousHugepages: Int,
	var haConfigured: Boolean,
	var haActive: Boolean,
	var haGlobalMaintenance: Boolean,
	var haLocalMaintenance: Boolean,
	var bootTime: Int, // bigint
	var cpuOverCommitTimeStamp:	LocalDateTime,
	var hugepages: String
): Serializable {
	override fun toString(): String = gson.toJson(this)
}

fun VdsStatistics.toHostHaVo(): HostHaVo = HostHaVo.hostHaVo {
	hostId { this@toHostHaVo.vdsId.toString() }
	haScore { "${this@toHostHaVo.haScore}" }
	haConfigured { this@toHostHaVo.haConfigured }
	haActive { this@toHostHaVo.haActive }
	haGlobalMaintenance { this@toHostHaVo.haGlobalMaintenance }
	haLocalMaintenance { this@toHostHaVo.haLocalMaintenance }
}

fun List<VdsStatistics>.toHostHaVos(): List<HostHaVo> =
	this.map { it.toHostHaVo() }

