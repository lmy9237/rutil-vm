package com.itinfo.rutilvm.api.model.zJava;

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.fromHostsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromVmsToIdentifiedVos
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.model.computing.HostVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.computing.toHostIdName
import com.itinfo.rutilvm.api.model.computing.toVmIdName

import com.itinfo.rutilvm.util.ovirt.findAllHostsFromAffinityLabel
import com.itinfo.rutilvm.util.ovirt.findAllVmsFromAffinityLabel
import com.itinfo.rutilvm.util.ovirt.findHost
import com.itinfo.rutilvm.util.ovirt.findVm

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.AffinityLabel
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

/**
 * [AffinityGroupMemberVo]
 * 선호도 그룹맴버
 * 
 * @property vmMembers List<[IdentifiedVo]> 가상머신 멤버
 * @property hostMembers List<[IdentifiedVo]>	호스트 멤버
// * @property vmMembers List<[VmVo]> 가상머신 멤버
// * @property hostMembers List<[HostVo]>	호스트 멤버
 **/
class AffinityGroupMemberVo(
	val vmMembers: List<IdentifiedVo> = listOf(),
//	val vmMembers: List<VmVo> = listOf(),
//	val hostMembers: List<HostVo> = listOf(),
	val hostMembers: List<IdentifiedVo> = listOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bVmMembers: List<IdentifiedVo> = listOf();fun vmMembers(block: () -> List<IdentifiedVo>?) { bVmMembers = block() ?: listOf() }
		private var bHostMembers: List<IdentifiedVo> = listOf();fun hostMembers(block: () -> List<IdentifiedVo>?) { bHostMembers = block() ?: listOf() }
		fun build(): AffinityGroupMemberVo = AffinityGroupMemberVo(bVmMembers, bHostMembers)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): AffinityGroupMemberVo = Builder().apply(block).build()
	}
}

fun AffinityLabel.toAffinityGroupMemberVo(conn: Connection): AffinityGroupMemberVo {
	val hosts: List<Host> =
		conn.findAllHostsFromAffinityLabel(this.id())
			.getOrDefault(listOf())
	val vms: List<Vm> =
		conn.findAllVmsFromAffinityLabel(this.id())
			.getOrDefault(listOf())

	// TODO: 나올 방법 고민, IdentifiedVo로 하지 않는다면 보정필요
	return AffinityGroupMemberVo.builder {
		hostMembers { hosts.fromHostsToIdentifiedVos() }
		vmMembers { vms.fromVmsToIdentifiedVos() }
	}
}

/**
 * [toAffinityLabelHosts]
 * 선호도 레이블에 있는 호스트 출력
 * @param alId 선호도 레이블 아이디
 * @return 선호도 레이블이 가지고 있는 host 목록
 */
fun List<Host>.toAffinityLabelHosts(conn: Connection): List<HostVo> =
	this.mapNotNull { conn.findHost(it.id()).getOrNull()?.toHostIdName() }

/**
 * [toAffinityLabelVms]
 * 선호도 레이블에 있는 가상머신 출력
 * @param affinityLabelId 선호도 레이블 아이디
 * @return 선호도 레이블이 가지고 있는 가상머신 목록
 */
fun List<Vm>.toAffinityLabelVms(conn: Connection): List<VmVo> =
	this.mapNotNull { conn.findVm(it.id()).getOrNull()?.toVmIdName() }
