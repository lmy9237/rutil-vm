package com.itinfo.rutilvm.api.model.common

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.ovirt.business.ActionType
import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.repository.engine.entity.JobEntity
import com.itinfo.rutilvm.common.formatEnhanced
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.common.differenceInMillis
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.toLocalDateTime
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.findAllAffinityLabelsFromVm
import com.itinfo.rutilvm.util.ovirt.findAllPermissionsFromDisk
import com.itinfo.rutilvm.util.ovirt.findCluster
import com.itinfo.rutilvm.util.ovirt.findDataCenter
import com.itinfo.rutilvm.util.ovirt.findDisk
import com.itinfo.rutilvm.util.ovirt.findEvent
import com.itinfo.rutilvm.util.ovirt.findHost
import com.itinfo.rutilvm.util.ovirt.findNetwork
import com.itinfo.rutilvm.util.ovirt.findNicFromVm
import com.itinfo.rutilvm.util.ovirt.findRole
import com.itinfo.rutilvm.util.ovirt.findSnapshotFromVm
import com.itinfo.rutilvm.util.ovirt.findStorageDomain
import com.itinfo.rutilvm.util.ovirt.findTemplate
import com.itinfo.rutilvm.util.ovirt.findVm
import com.itinfo.rutilvm.util.ovirt.findVnicProfile
import org.ovirt.engine.sdk4.Connection
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
	val actionType: ActionType? = null,
	val correlationId: String? = "",
	val autoCleared: Boolean = false,
	val external: Boolean = false,
	var lastUpdated: Date? = null,
	val _startTime: Date? = null,
	val _endTime: Date? = null,
	val steps: List<StepVo> = listOf(),
): Serializable {
	val startTime: String		get() = ovirtDf.formatEnhanced(_startTime)
	val endTime: String			get() = ovirtDf.formatEnhanced(_endTime)
	val timestamp: String		get() = if (_endTime == null || _startTime == null) "N/A" else "${_startTime.differenceInMillis(_endTime)}"
	val term: Term?				get() = actionType?.term

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bStatus: JobStatus = UNKNOWN;fun status(block: () -> JobStatus?) { bStatus = block() ?: UNKNOWN }
		private var bActionType: ActionType? = ActionType.Unknown;fun actionType(block: () -> ActionType?) { bActionType = block() ?: ActionType.Unknown }
		private var bCorrelationId: String? = "";fun correlationId(block: () -> String?) { bCorrelationId = block() ?: "" }
		private var bAutoCleared: Boolean = false;fun autoCleared(block: () -> Boolean?) { bAutoCleared = block() ?: false }
		private var bExternal: Boolean = false;fun external(block: () -> Boolean?) { bExternal = block() ?: false }
		private var bLastUpdated: Date? = null;fun lastUpdated(block: () -> Date?) { bLastUpdated = block() }
		private var bStartTime: Date? = Date();fun startTime(block: () -> Date?) { bStartTime = block() ?: Date() }
		private var bEndTime: Date? = null;fun endTime(block: () -> Date?) { bEndTime = block() }
		private var bSteps: List<StepVo> = listOf();fun steps(block: () -> List<StepVo>?) { bSteps = block() ?: listOf() }
		fun build(): JobVo = JobVo(bId, bName, bDescription, bComment, bStatus, bActionType, bCorrelationId, bAutoCleared, bExternal, bLastUpdated, bStartTime, bEndTime, bSteps)
	}
	companion object {
		val REGEX_DESCRIPTION_EXCLUDE: Regex = ActionType.actionTypes4PeriodicRemoval.joinToString("|").toRegex() // 가상머신 스크린샷 제외 (쓸 때 없이 많이 발생)
		// TODO: 이걸 이용해서 스케쥴러 돌린 후 해당 건 제거 필요
		const val DEFAULT_TITLE_RUTILVM_FAILURE = "RutilVM-API"
		inline fun builder(block: JobVo.Builder.() -> Unit): JobVo = JobVo.Builder().apply(block).build()
		fun rutilvmFail(
			detail: String,
			status: JobStatus? = JobStatus.FAILED
		): JobVo {
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

 fun JobVo.findCorrelation(
	 conn: Connection?=null,
 ): IdentifiedVo {
	 val correlationName: String = when(term) {
		 Term.DATACENTER -> conn?.findDataCenter(correlationId)?.getOrNull()?.name() ?: ""
		 Term.CLUSTER -> conn?.findCluster(correlationId)?.getOrNull()?.name() ?: ""
		 Term.HOST -> conn?.findHost(correlationId)?.getOrNull()?.name() ?: ""
		 Term.VM -> conn?.findVm(correlationId)?.getOrNull()?.name() ?: ""
		 Term.VNIC_PROFILE -> conn?.findVnicProfile(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.SNAPSHOT -> conn?.findSnapshotFromVm(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.VM_POOL -> conn?.findTemplate(correlationId)?.getOrNull()?.name() ?: ""
		 Term.TEMPLATE -> conn?.findTemplate(correlationId)?.getOrNull()?.name() ?: ""
		 Term.NETWORK -> conn?.findNetwork(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.NIC -> conn?.findNic(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.QOS -> conn?.findQos(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.MAC_POOL -> conn?.findMacPool(correlationId)?.getOrNull()?.name() ?: ""
		 Term.STORAGE_DOMAIN -> conn?.findStorageDomain(correlationId)?.getOrNull()?.name() ?: ""
		 Term.DISK -> conn?.findDisk(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.PERMISSION -> conn?.findPermission(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.QUOTA -> conn?.findQuota(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.AFFINITY_GROUP -> conn?.findAffinityGroup(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.TAG -> conn?.findTag(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.BOOKMARK -> conn?.findBookmark(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.LEASE -> conn?.findLease(correlationId)?.getOrNull()?.name() ?: ""
		 Term.ROLE -> conn?.findRole(correlationId)?.getOrNull()?.name() ?: ""
		 Term.EVENT -> conn?.findEvent(correlationId)?.getOrNull()?.name() ?: ""
		 // Term.TAG ->
		 else -> ""
	 }

	 return IdentifiedVo.builder {
		 id { this@findCorrelation.correlationId }
		 name { correlationName }
	 }

}

fun List<Job>.toJobVos(): List<JobVo> =
	this.map { it.toJobVo() }.sortedByDescending { it.startTime }
