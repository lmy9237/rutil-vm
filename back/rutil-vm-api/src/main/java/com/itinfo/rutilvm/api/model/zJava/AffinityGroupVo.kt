package com.itinfo.rutilvm.api.model.zJava

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.AffinityGroup
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

/**
 * [AffinityGroupVo]
 * 선호도 그룹
 * 
 * @property id [String]	
 * @property name [String]	
 * @property description [String]	
 * @property status [Boolean]			broken
 * @property priority [Int]				우선순위
 * 
 * @property clusterId [String]	
 *
 * @property isPositive [Boolean]		양극/음극    | 가상머신 따라감
 * @property isEnforcing [Boolean]		강제적용     | 가상머신 따라감
 * 
 * vms_rule
 * @property isVmEnabled [Boolean]		가상머신 측 극성 (비활성화)
 * @property isVmPositive [Boolean]		가상머신 측 극성 (양극, 음극)
 * @property isVmEnforcing [Boolean]	가상머신 강제적용
 * 
 * host_rule
 * @property hostEnabled [Boolean]		호스트 측 극성 (비활성화)
 * @property hostPositive [Boolean]		호스트 측 극성 (양극, 음극)
 * @property hostEnforcing [Boolean]	호스트 강제적용
 * 
 * @property agMemberVo [AffinityGroupMemberVo] 멤버
 * @property alMemberVo [AffinityLabelMemberVo] 레이블
 */
class AffinityGroupVo(
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val status: Boolean = false,
    val priority: Int = 0,

    val clusterId: String = "",

    val isPositive: Boolean = false,
    val isEnforcing: Boolean = false,

    val isVmEnabled: Boolean = false,
    val isVmPositive: Boolean = false,
    val isVmEnforcing: Boolean = false,

    val isHostEnabled: Boolean = false,
    val isHostPositive: Boolean = false,
    val isHostEnforcing: Boolean = false,

    val agMemberVo: AffinityGroupMemberVo = AffinityGroupMemberVo(),
    val alMemberVo: AffinityLabelMemberVo = AffinityLabelMemberVo(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bStatus: Boolean = false;fun status(block: () -> Boolean?) { bStatus = block() ?: false }
		private var bPriority: Int = 0;fun priority(block: () -> Int?) { bPriority = block() ?: 0 }
		private var bClusterId: String = "";fun clusterId(block: () -> String?) { bClusterId = block() ?: "" }
		private var bIsPositive: Boolean = false;fun isPositive(block: () -> Boolean?) { bIsPositive = block() ?: false }
		private var bIsEnforcing: Boolean = false;fun isEnforcing(block: () -> Boolean?) { bIsEnforcing = block() ?: false }
		private var bIsVmEnabled: Boolean = false;fun isVmEnabled(block: () -> Boolean?) { bIsVmEnabled = block() ?: false }
		private var bIsVmPositive: Boolean = false;fun isVmPositive(block: () -> Boolean?) { bIsVmPositive = block() ?: false }
		private var bIsVmEnforcing: Boolean = false;fun isVmEnforcing(block: () -> Boolean?) { bIsVmEnforcing = block() ?: false }
		private var bIsHostEnabled: Boolean = false;fun isHostEnabled(block: () -> Boolean?) { bIsHostEnabled = block() ?: false }
		private var bIsHostPositive: Boolean = false;fun isHostPositive(block: () -> Boolean?) { bIsHostPositive = block() ?: false }
		private var bIsHostEnforcing: Boolean = false;fun isHostEnforcing(block: () -> Boolean?) { bIsHostEnforcing = block() ?: false }
		private var bAgMemberVo: AffinityGroupMemberVo = AffinityGroupMemberVo();fun agMemberVo(block: () -> AffinityGroupMemberVo?) { bAgMemberVo = block() ?: AffinityGroupMemberVo() }
		private var bAlMemberVo: AffinityLabelMemberVo = AffinityLabelMemberVo();fun alMemberVo(block: () -> AffinityLabelMemberVo?) { bAlMemberVo = block() ?: AffinityLabelMemberVo() }
		fun build(): AffinityGroupVo = AffinityGroupVo(bId, bName, bDescription, bStatus, bPriority, bClusterId, bIsPositive, bIsEnforcing, bIsVmEnabled, bIsVmPositive, bIsVmEnforcing, bIsHostEnabled, bIsHostPositive, bIsHostEnforcing, bAgMemberVo, bAlMemberVo)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): AffinityGroupVo = Builder().apply(block).build()
	}
}

fun AffinityGroup.toAffinityGroupVo(conn: Connection, clusterId: String = ""): AffinityGroupVo {
	return AffinityGroupVo.builder {
        clusterId { clusterId }
        id { this@toAffinityGroupVo.id() }
        name { this@toAffinityGroupVo.name() }
        description { this@toAffinityGroupVo.description() }
        priority { this@toAffinityGroupVo.priority().toInt() }
        isPositive { this@toAffinityGroupVo.positivePresent() && this@toAffinityGroupVo.positive() }
        isVmEnabled { this@toAffinityGroupVo.vmsRule().enabled() }
        isVmPositive { this@toAffinityGroupVo.vmsRule().positive() }
        isVmEnforcing { this@toAffinityGroupVo.vmsRule().enforcing() }
        isHostEnabled { this@toAffinityGroupVo.hostsRule().enabled() }
        isHostPositive { this@toAffinityGroupVo.hostsRule().positive() }
        isHostEnforcing { this@toAffinityGroupVo.hostsRule().enforcing() }
        alMemberVo {
            AffinityLabelMemberVo.builder {
                hostLabels { this@toAffinityGroupVo.setEdit(conn, "hostLabels") }
                vmLabels { this@toAffinityGroupVo.setEdit(conn, "vmLabels") }
            }
        }
        agMemberVo {
            // TODO: IdentifiedVo로 하지 않는다면 보정필요
            AffinityGroupMemberVo.builder {
                hostMembers { this@toAffinityGroupVo.setEdit(conn, "hosts") }
                vmMembers { this@toAffinityGroupVo.setEdit(conn, "vms") }
            }
        }
    }
}

fun List<AffinityGroup>.toAffinityGroupVos(conn: Connection, clusterId: String = ""): List<AffinityGroupVo> =
	this@toAffinityGroupVos.map { it.toAffinityGroupVo(conn, clusterId) }


// 선호도 그룹 편집창 - host/vm 레이블, host/vm 아이디,이름 출력만
fun AffinityGroup.setEdit(conn: Connection, type: String): List<IdentifiedVo> =
	when (type) {
		"hostLabels" -> conn.findAllAffinityGroupHostLabelsFromCluster(this.cluster().id(), this.id())
			.getOrDefault(listOf())
			.fromAffinityLabelsToIdentifiedVos()
		"vmLabels" -> conn.findAllAffinityGroupVmLabelsFromCluster(this.cluster().id(), this.id())
			.getOrDefault(listOf())
			.fromAffinityLabelsToIdentifiedVos()
		"hosts" -> conn.findAllAffinityGroupHostsFromCluster(this.cluster().id(), this.id())
			.getOrDefault(listOf())
			.fromHostsToIdentifiedVos()
		"vms" -> conn.findAllAffinityGroupVmsFromCluster(this.cluster().id(), this.id())
			.getOrDefault(listOf())
			.fromVmsToIdentifiedVos()
		else -> listOf()
	}

/**
 * [Vm.toAffinityGroupVos]
 * 편집 - 선호도 그룹
 *
 * @param system
 *
 * @return
 */
fun Vm.toAffinityGroupVos(conn: Connection): List<AffinityGroupVo> {
	val affinityGroups: List<AffinityGroup> =
		conn.findAllAffinityGroupsFromCluster(this@toAffinityGroupVos.cluster().id())
			.getOrDefault(listOf())
			.filter { it.vms().any { vm: Vm -> vm.id() == this@toAffinityGroupVos.id() } }

	return affinityGroups.map { ag: AffinityGroup -> ag.toAffinityGroupVo(conn) }
}