package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
import java.math.BigInteger
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

/**
 * [QosEntity]
 * 네트워크 품질 제어
 *
 * Maps to the `qos` table.
 * Represents a Quality of Service (QoS) profile which can be applied to different
 * resource types like storage, CPU, or network to enforce performance limits.
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name = "qos")
class QosEntity(
	@Id
	@Column(name = "id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	@Column(name = "qos_type", nullable = false)
	val qosType: Short, // int2 maps to Short in Java/Kotlin
	val name: String? = null,
	val description: String? = null,
	val maxThroughput: Int? = null,
	val maxReadThroughput: Int? = null,
	val maxWriteThroughput: Int? = null,
	val maxIops: Int? = null,
	val maxReadIops: Int? = null,
	val maxWriteIops: Int? = null,

	// --- CPU QoS Parameters ---
	val cpuLimit: Short? = null,

	// --- Network QoS Parameters ---
	val inboundAverage: Int? = null,
	val inboundPeak: Int? = null,
	val inboundBurst: Int? = null,
	val outboundAverage: Int? = null,
	val outboundPeak: Int? = null,
	val outboundBurst: Int? = null,
	val outAverageLinkshare: Int? = null,
	val outAverageUpperlimit: Int? = null,
	val outAverageRealtime: Int? = null,

	// --- Timestamps ---
	@Column(name = "_create_date")
	val createDate: LocalDateTime? = null,
	@Column(name = "_update_date")
	val updateDate: LocalDateTime? = null,

	// --- Relationships ---
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "storage_pool_id",
		referencedColumnName = "id"
	)
	val storagePool: StoragePoolEntity? = null // Assumes you have a StoragePoolEntity
) : Serializable {
	override fun toString(): String
	= gson.toJson(this)

	class Builder {
		private var bId: UUID? = null; fun id(block: () -> UUID?) { bId = block() }
		private var bQosType: Short = 0; fun qosType(block: () -> Short?) { bQosType = block() ?: 0 }
		private var bName: String? = null; fun name(block: () -> String?) { bName = block() }
		private var bDescription: String? = null; fun description(block: () -> String?) { bDescription = block() }
		private var bMaxThroughput: Int? = null; fun maxThroughput(block: () -> Int?) { bMaxThroughput = block() }
		private var bMaxReadThroughput: Int? = null; fun maxReadThroughput(block: () -> Int?) { bMaxReadThroughput = block() }
		private var bMaxWriteThroughput: Int? = null; fun maxWriteThroughput(block: () -> Int?) { bMaxWriteThroughput = block() }
		private var bMaxIops: Int? = null; fun maxIops(block: () -> Int?) { bMaxIops = block() }
		private var bMaxReadIops: Int? = null; fun maxReadIops(block: () -> Int?) { bMaxReadIops = block() }
		private var bMaxWriteIops: Int? = null; fun maxWriteIops(block: () -> Int?) { bMaxWriteIops = block() }
		private var bCpuLimit: Short? = null; fun cpuLimit(block: () -> Short?) { bCpuLimit = block() }
		private var bInboundAverage: Int? = null; fun inboundAverage(block: () -> Int?) { bInboundAverage = block() }
		private var bInboundPeak: Int? = null; fun inboundPeak(block: () -> Int?) { bInboundPeak = block() }
		private var bInboundBurst: Int? = null; fun inboundBurst(block: () -> Int?) { bInboundBurst = block() }
		private var bOutboundAverage: Int? = null; fun outboundAverage(block: () -> Int?) { bOutboundAverage = block() }
		private var bOutboundPeak: Int? = null; fun outboundPeak(block: () -> Int?) { bOutboundPeak = block() }
		private var bOutboundBurst: Int? = null; fun outboundBurst(block: () -> Int?) { bOutboundBurst = block() }
		private var bOutAverageLinkshare: Int? = null; fun outAverageLinkshare(block: () -> Int?) { bOutAverageLinkshare = block() }
		private var bOutAverageUpperlimit: Int? = null; fun outAverageUpperlimit(block: () -> Int?) { bOutAverageUpperlimit = block() }
		private var bOutAverageRealtime: Int? = null; fun outAverageRealtime(block: () -> Int?) { bOutAverageRealtime = block() }
		private var bCreateDate: LocalDateTime? = null; fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() }
		private var bUpdateDate: LocalDateTime? = null; fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bStoragePool: StoragePoolEntity? = null; fun storagePool(block: () -> StoragePoolEntity?) { bStoragePool = block() }
		fun build(): QosEntity = QosEntity(bId, bQosType, bName, bDescription, bMaxThroughput, bMaxReadThroughput, bMaxWriteThroughput, bMaxIops, bMaxReadIops, bMaxWriteIops, bCpuLimit, bInboundAverage, bInboundPeak, bInboundBurst, bOutboundAverage, bOutboundPeak, bOutboundBurst, bOutAverageLinkshare, bOutAverageUpperlimit, bOutAverageRealtime, bCreateDate, bUpdateDate, bStoragePool)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): QosEntity = Builder().apply(block).build()
	}
}
