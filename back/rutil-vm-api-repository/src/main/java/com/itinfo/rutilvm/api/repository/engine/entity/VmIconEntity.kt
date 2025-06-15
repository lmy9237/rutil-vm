package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import org.hibernate.annotations.Type
import java.io.Serializable
import java.util.UUID

/**
 * [VmIconEntity]
 * 가상머신 운영시스템에 대한 아이콘 정보
 *
 * @property id [String] 아이콘 ID
 * @property dataUrl [String] 이미지 데이터
 *
 * @author 이찬희 (@chanhi2000)
 *
 * NOTE: 아이콘에 대한 값이 정확하지 않음.
 * OS 값에 따라 아이콘 정보를 추출하는 방법이 필요.
 */
@Entity
@Table(name = "vm_icons")
class VmIconEntity(
	@Id
	@Column(name = "id", unique = true, nullable = false)
	@Type(type = "org.hibernate.type.PostgresUUIDType") // Consistent with your VmEntity
	val id: UUID? = null,

	@Column(name = "data_url", nullable = false)
	val dataUrl: String = ""

) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: UUID? = null;fun id(block: () -> UUID?) { bId = block() }
		private var bDataUrl: String = "";fun dataUrl(block: () -> String?) { bDataUrl = block() ?: "" }
		fun build(): VmIconEntity = VmIconEntity(bId, bDataUrl)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmIconEntity = Builder().apply(block).build()
	}
}
