package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.OneToMany
import javax.persistence.ManyToOne
import javax.persistence.Table

/**
 * [VmIconDefaultsEntity]
 * 가상머신 운영시스템에 따른 기본 아이콘 정보
 *
 * @property id [UUID] 아이콘 ID
 * @property osId [Int] 운영시스템 ID
 * @property smallIcon [VmIconEntity] 작은 아이콘
 * @property largeIcon [VmIconEntity] 큰 아이콘
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name="vm_icon_defaults",)
class VmIconDefaultsEntity(

	@Id
	@Column(name = "id", unique = true, nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val osId: Int = 0,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "small_icon_id",        // FK column in 'vm_icon_defaults'
		referencedColumnName = "id",   // PK column in 'vm_icons'
		nullable = false
	)
	val smallIcon: VmIconEntity? = null,

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "large_icon_id",         // FK column in 'vm_icon_defaults'
		referencedColumnName = "id",   // PK column in 'vm_icons'
		nullable = false
	)
	val largeIcon: VmIconEntity? = null

) : Serializable {

	override fun toString(): String =
		gson.toJson(this@VmIconDefaultsEntity)

	class Builder {
		private var bId: UUID? = null;fun id(block: () -> UUID?) { bId = block() }
		private var bOsId: Int = 0;fun osId(block: () -> Int?) { bOsId = block() ?: 0 }
		private var bSmallIcon: VmIconEntity? = null;fun smallIcon(block: () -> VmIconEntity?) { bSmallIcon = block() }
		private var bLargeIcon: VmIconEntity? = null;fun largeIcon(block: () -> VmIconEntity?) { bLargeIcon = block() }
		fun build(): VmIconDefaultsEntity = VmIconDefaultsEntity(bId, bOsId, bSmallIcon, bLargeIcon)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmIconDefaultsEntity = Builder().apply(block).build()
	}
}
