package com.itinfo.rutilvm.api.repository.engine.entity
import com.itinfo.rutilvm.api.ovirt.business.VmOsType
import com.itinfo.rutilvm.common.gson
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import java.io.Serializable

/**
 * [DwhOsinfoEntity]
 * oVirt 가상머신 운영 체제 코드별 명칭 목록
 *
 * @property osId [Int] 아이디
 * @property osName [String] 운영시스템 이름
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name = "dwh_osinfo")
class DwhOsinfoEntity(
	@Id
	@Column(name = "os_id", nullable = false)
	val osId: Int = 0,
	val osName: String? = null
) : Serializable {
	override fun toString(): String =
		gson.toJson(this@DwhOsinfoEntity)

	class Builder {
		private var bOsId: Int = 0;fun osId(block: () -> Int?) { bOsId = block() ?: 0 }
		private var bOsName: String? = null;fun osName(block: () -> String?) { bOsName = block() }
		fun build(): DwhOsinfoEntity = DwhOsinfoEntity(bOsId, bOsName)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): DwhOsinfoEntity = Builder().apply(block).build()
	}
}

fun DwhOsinfoEntity.toVmOsType() =
	VmOsType.forValue(this@toVmOsType.osId)
