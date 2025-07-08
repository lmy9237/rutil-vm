package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.DisplayTypeB
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

/**
 * [VmStaticEntity]
 * 가상머신 기본정보
 *
 * @property vmGuid [UUID] 가상머신 ID
 * @property vmName [String] 가상머신 이름
 * @property _defaultDisplayType [Int] 디스플레이 유형 [DisplayTypeB]
 */
@Entity
@Table(name = "vm_static")
class VmStaticEntity(
	@Id
	@Column(name="vm_guid", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val vmGuid: UUID? = null,
	val vmName: String? = "",
	@Column(name="default_display_type", nullable=true)
	private var _defaultDisplayType: Int? = null,
): Serializable {
	var defaultDisplayType: DisplayTypeB?			get() = DisplayTypeB.forValue(_defaultDisplayType)
		set(newVal) {
			_defaultDisplayType = newVal?.value
		}

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bVmGuid: UUID? = null;fun vmGuid(block: () -> UUID?) { bVmGuid = block() }
		private var bVmName: String = "";fun vmName(block: () -> String?) { bVmName = block() ?: "" }
		private var bDefaultDisplayType: Int = -1; fun defaultDisplayType(block: () -> Int?) { bDefaultDisplayType = block() ?: -1 }
		fun build(): VmStaticEntity = VmStaticEntity(bVmGuid, bVmName, bDefaultDisplayType)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmStaticEntity = Builder().apply(block).build()
	}
}
