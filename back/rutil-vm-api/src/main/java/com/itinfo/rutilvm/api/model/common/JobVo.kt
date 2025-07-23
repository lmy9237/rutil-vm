package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.repository.engine.entity.JobEntity
import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.common.differenceInMillis
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.common.toUUID
import org.ovirt.engine.sdk4.builders.JobBuilder
import org.ovirt.engine.sdk4.types.Job
import org.ovirt.engine.sdk4.types.JobStatus
import org.ovirt.engine.sdk4.types.JobStatus.UNKNOWN
import java.io.Serializable
import java.util.*

/**
 * [JobVo]
 * 작업현황
 *
 * @property id [String] ID
 * @property name [String] 이름
 * @property description [String] 설명
 * @property comment [String] 코멘트
 * @property status [JobStatus] 작업상태
 * @property autoCleared [Boolean] ?
 * @property external [Boolean] 외부 여부
 * @property lastUpdated [Date] 갱신일자
 * @property startTime [Date] 시작일자
 * @property endTime [Date] 종료일자
 *
 * @author 이찬희 (@chanhi2000)
 */
class JobVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	var status: JobStatus = JobStatus.UNKNOWN,
	val autoCleared: Boolean = false,
	val external: Boolean = false,
	var lastUpdated: Date? = null,
	val _startTime: Date? = null,
	val _endTime: Date? = null,
	val steps: List<StepVo> = listOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	val startTime: String
		get() = ovirtDf.formatEnhanced(_startTime)
	val endTime: String
		get() = ovirtDf.formatEnhanced(_endTime)

	val timestamp: String
		get() = if (_endTime == null || _startTime == null) "N/A" else "${_startTime.differenceInMillis(_endTime)}"

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bStatus: JobStatus = UNKNOWN;fun status(block: () -> JobStatus?) { bStatus = block() ?: UNKNOWN }
		private var bAutoCleared: Boolean = false;fun autoCleared(block: () -> Boolean?) { bAutoCleared = block() ?: false }
		private var bExternal: Boolean = false;fun external(block: () -> Boolean?) { bExternal = block() ?: false }
		private var bLastUpdated: Date? = null;fun lastUpdated(block: () -> Date?) { bLastUpdated = block() }
		private var bStartTime: Date? = Date();fun startTime(block: () -> Date?) { bStartTime = block() ?: Date() }
		private var bEndTime: Date? = null;fun endTime(block: () -> Date?) { bEndTime = block() }
		private var bSteps: List<StepVo> = listOf();fun steps(block: () -> List<StepVo>?) { bSteps = block() ?: listOf() }
		fun build(): JobVo = JobVo(bId, bName, bDescription, bComment, bStatus, bAutoCleared, bExternal, bLastUpdated, bStartTime, bEndTime, bSteps)
	}
	companion object {
		val REGEX_DESCRIPTION_EXCLUDE: Regex = JobEntity.ACTION_TYPE_EXCLUDE.toRegex() // 가상머신 스크린샷 제외 (쓸 때 없이 많이 발생)
		// TODO: 이걸 이용해서 스케쥴러 돌린 후 해당 건 제거 필요
		const val DEFAULT_TITLE_RUTILVM_FAILURE = "RutilVM-API"
		inline fun builder(block: JobVo.Builder.() -> Unit): JobVo = JobVo.Builder().apply(block).build()
		fun rutilvmFail(detail: String, status: JobStatus? = JobStatus.FAILED): JobVo {
			val today = Date()
			return builder {
				name { DEFAULT_TITLE_RUTILVM_FAILURE }
				description { "[${DEFAULT_TITLE_RUTILVM_FAILURE}] $detail" }
				// comment {  }
				status { JobStatus.FAILED }
				autoCleared { true }
				external { true }
				startTime { today }
				endTime { today }
				lastUpdated { today }
			}
		}
	}
}

fun JobVo.toJobEntity(
	actionType: String="AddExternalJob",
	correlationId: String="",
): JobEntity = JobEntity.builder {
	jobId { this@toJobEntity.id.toUUID() }
	actionType { actionType }
	description { this@toJobEntity.description }
	status { this@toJobEntity.status.name }
	// ownerId {  }
	visible { true }
	startTime { this@toJobEntity._startTime.toLocalDateTime() }
	endTime { this@toJobEntity._endTime.toLocalDateTime() }
	lastUpdateTime { this@toJobEntity.lastUpdated.toLocalDateTime() }
	correlationId { correlationId }
	isExternal { this@toJobEntity.external }
	isAutoCleared { this@toJobEntity.autoCleared }
	// engineSessionSeqId {  }
}

fun JobVo.toJob(): Job = JobBuilder()
	.name(name)
	.description(description)
	.comment(comment)
	.status(status)
	.autoCleared(autoCleared)
	.external(external)
	.startTime(_startTime)
	.endTime(_endTime)
	.build()

fun Job.toJobVo(): JobVo = JobVo.builder {
	id { id() }
	name { if (this@toJobVo.namePresent()) name() else "" }
	description { if (this@toJobVo.descriptionPresent()) description() else "" }
	comment { if (this@toJobVo.commentPresent()) comment() else "" }
	status { if (this@toJobVo.statusPresent()) status() else UNKNOWN }
	autoCleared { if (this@toJobVo.autoClearedPresent()) autoCleared() else false }
	external { if (this@toJobVo.externalPresent()) external() else false }
	lastUpdated { if (this@toJobVo.lastUpdatedPresent()) lastUpdated() else null }
	startTime { if (this@toJobVo.startTimePresent()) startTime() else null }
	endTime { if (this@toJobVo.endTimePresent()) endTime() else null }
	steps { if (this@toJobVo.stepsPresent()) steps().toStepVos() else null }
}

fun List<Job>.toJobVos(): List<JobVo> =
	this.map { it.toJobVo() }.sortedByDescending { it.startTime }
