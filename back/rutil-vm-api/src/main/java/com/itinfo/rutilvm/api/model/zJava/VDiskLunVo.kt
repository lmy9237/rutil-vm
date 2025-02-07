package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.gson
import java.io.Serializable

*/
/**
 * [VDiskLunVo]
 *
 * 직접 LUN
 * @property alias [String] 별칭
 * @property description [String] 설명
 * @property interfaces [String] 인터페이스
 * @property host [String] 호스트
 * @property storageType [String] 스토리지 타입
 * @property bootable [Boolean] 부팅가능
 * @property shareable [Boolean] 공유가능
 * @property readonly [Boolean] 읽기전용
 * @property cancel [Boolean] 취소 활성화
 * @property scsiPass [Boolean] scsi 통과 활성화
 * @property scsiPermission [Boolean] 권한 부여된 scsi i/o 허용
 * @property scsiReservation [Boolean] scsi 예약 사용
 *//*
@Deprecated("나중에 구현")
class VDiskLunVo(
	val alias: String = "",
	val description: String = "",
	val interfaces: String = "",
	val host: String = "",
	val storageType: String = "",

	val bootable: Boolean = false,
	val shareable: Boolean = false,
	val readonly: Boolean = false,
	val cancel: Boolean = false,
	val scsiPass: Boolean = false,
	val scsiPermission: Boolean = false,
	val scsiReservation: Boolean = false,
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bAlias: String = "";fun alias(block: () -> String?) { bAlias = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bInterfaces: String = "";fun interfaces(block: () -> String?) { bInterfaces = block() ?: "" }
		private var bHost: String = "";fun host(block: () -> String?) { bHost = block() ?: "" }
		private var bStorageType: String = "";fun storageType(block: () -> String?) { bStorageType = block() ?: "" }
		private var bBootable: Boolean = false;fun bootable(block: () -> Boolean?) { bBootable = block() ?: false }
		private var bShareable: Boolean = false;fun shareable(block: () -> Boolean?) { bShareable = block() ?: false }
		private var bReadonly: Boolean = false;fun readonly(block: () -> Boolean?) { bReadonly = block() ?: false }
		private var bCancel: Boolean = false;fun cancel(block: () -> Boolean?) { bCancel = block() ?: false }
		private var bScsiPass: Boolean = false;fun scsiPass(block: () -> Boolean?) { bScsiPass = block() ?: false }
		private var bScsiPermission: Boolean = false;fun scsiPermission(block: () -> Boolean?) { bScsiPermission = block() ?: false }
		private var bScsiReservation: Boolean = false;fun scsiReservation(block: () -> Boolean?) { bScsiReservation = block() ?: false }
		fun build(): VDiskLunVo = VDiskLunVo(bAlias, bDescription, bInterfaces, bHost, bStorageType, bBootable, bShareable, bReadonly, bCancel, bScsiPass, bScsiPermission, bScsiReservation)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: VDiskLunVo.Builder.() -> Unit): VDiskLunVo =
			VDiskLunVo.Builder().apply(block).build()
	}
}
*/
