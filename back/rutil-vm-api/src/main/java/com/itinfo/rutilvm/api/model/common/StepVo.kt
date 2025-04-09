package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.formatEnhanced
import com.itinfo.rutilvm.api.ovirtDf
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.types.ExternalSystemType
import org.ovirt.engine.sdk4.types.Step
import org.ovirt.engine.sdk4.types.StepEnum
import org.ovirt.engine.sdk4.types.StepStatus
import java.io.Serializable
import java.math.BigInteger
import java.util.*

/**
 * [StepVo]
 * 작업과정
 *
 * @property id [String] ID
 * @property name [String] 이름
 * @property description [String] 설명
 * @property comment [String] 코멘트
 * @property type [StepEnum] StepEnum.UNKNOWN
 * @property status [StepStatus] 작업상태
 * @property number [BigInteger]
 * @property progress [BigInteger]
 * @property external [Boolean] 외부 여부
 * @property externalType [ExternalSystemType] ExternalSystemType
 * @property startTime [Date] 시작일자
 * @property endTime [Date] 종료일자
 *
 * @author 이찬희 (@chanhi2000)
 */
class StepVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val type: StepEnum = StepEnum.UNKNOWN,
	val status: StepStatus = StepStatus.UNKNOWN,
	val number: BigInteger = BigInteger.ZERO,
	val progress: BigInteger = BigInteger.ZERO,
	val external: Boolean = false,
	val externalType: ExternalSystemType? = null,
	private val _startTime: Date? = null,
	private val _endTime: Date? = null,
	val parentStep: StepVo? = null,
): Serializable {

	val startTime: String
		get() = ovirtDf.formatEnhanced(_startTime)
	val endTime: String
		get() = ovirtDf.formatEnhanced(_endTime)

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bType: StepEnum = StepEnum.UNKNOWN;fun type(block: () -> StepEnum?) { bType = block() ?: StepEnum.UNKNOWN }
		private var bStatus: StepStatus = StepStatus.UNKNOWN;fun status(block: () -> StepStatus?) { bStatus = block() ?: StepStatus.UNKNOWN }
		private var bNumber: BigInteger = BigInteger.ZERO;fun number(block: () -> BigInteger?) { bNumber = block() ?: BigInteger.ZERO }
		private var bProgress: BigInteger = BigInteger.ZERO;fun progress(block: () -> BigInteger?) { bProgress = block() ?: BigInteger.ZERO }
		private var bExternal: Boolean = false;fun external(block: () -> Boolean?) { bExternal = block() ?: false }
		private var bExternalType: ExternalSystemType? = null;fun externalType(block: () -> ExternalSystemType?) { bExternalType = block() }
		private var bStartTime: Date? = null;fun startTime(block: () -> Date?) { bStartTime = block()  }
		private var bEndTime: Date? = null;fun endTime(block: () -> Date?) { bEndTime = block() }
		private var bParentStep: StepVo? = null;fun parentStep(block: () -> StepVo?) { bParentStep = block() }
		fun build(): StepVo = StepVo(bId, bName, bDescription, bComment, bType, bStatus, bNumber, bProgress, bExternal, bExternalType, bStartTime, bEndTime, bParentStep)
	}
	companion object {
		inline fun builder(block: StepVo.Builder.() -> Unit): StepVo = StepVo.Builder().apply(block).build()
	}
}

fun Step.toStepVo(): StepVo = StepVo.builder {
	id { if (this@toStepVo.idPresent()) id() else "" }
	name { if (this@toStepVo.namePresent()) name() else "" }
	description { if (this@toStepVo.descriptionPresent()) description() else "" }
	comment { if (this@toStepVo.commentPresent()) comment() else "" }
	type { if (this@toStepVo.typePresent()) type() else StepEnum.UNKNOWN }
	status { if (this@toStepVo.statusPresent()) status() else StepStatus.UNKNOWN }
	number { if (this@toStepVo.numberPresent()) number() else BigInteger.ZERO }
	progress { if (this@toStepVo.progressPresent()) progress() else BigInteger.ZERO }
	external { if (this@toStepVo.externalPresent()) external() else false }
	externalType { if (this@toStepVo.externalTypePresent()) externalType() else null }
	startTime { if (this@toStepVo.startTimePresent()) startTime() else null }
	endTime { if (this@toStepVo.endTimePresent()) endTime() else null }
	parentStep { if (this@toStepVo.parentStepPresent()) parentStep().toStepVo() else null }
}

fun List<Step>.toStepVos(): List<StepVo> = this.map { it.toStepVo() }
