package com.itinfo.rutilvm.api.model.zJava

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.findAllAffinityLabelsFromVm

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.AffinityLabel
import org.ovirt.engine.sdk4.types.Vm
import java.io.Serializable

/**
 * [AffinityLabelVo]
 * 선호도레이블
 * 
 * @property id [String]
 * @property name [String]
 * @property clusterName [String]
 * @property agMemberVo [AffinityGroupMemberVo]
 **/
class AffinityLabelVo(
    val id: String = "",
    val name: String = "",
    val clusterName: String = "",
    val agMemberVo: AffinityGroupMemberVo = AffinityGroupMemberVo(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	
	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bClusterName: String = "";fun clusterName(block: () -> String?) { bClusterName = block() ?: "" }
		private var bAgMemberVo: AffinityGroupMemberVo = AffinityGroupMemberVo();fun agMemberVo(block: () -> AffinityGroupMemberVo?) { bAgMemberVo = block() ?: AffinityGroupMemberVo() }
		fun build(): AffinityLabelVo = AffinityLabelVo(bId, bName, bClusterName, bAgMemberVo)
	}

	companion object {
		private val log by LoggerDelegate()
		inline fun builder(block: Builder.() -> Unit): AffinityLabelVo = Builder().apply(block).build()
	}
}

fun AffinityLabel.toAffinityLabelVo(conn: Connection): AffinityLabelVo = AffinityLabelVo.builder {
    id { this@toAffinityLabelVo.id() }
    name { this@toAffinityLabelVo.name() }
    agMemberVo {
        this@toAffinityLabelVo.toAffinityGroupMemberVo(conn)
    }
}

fun List<AffinityLabel>.toAffinityLabelVos(conn: Connection): List<AffinityLabelVo> =
	this@toAffinityLabelVos.map { it.toAffinityLabelVo(conn) }

/**
 * [Vm.toAffinityLabelVos]
 * 편집 - 선호도 레이블
 *
 * @param system
 *
 * @return
 */
fun Vm.toAffinityLabelVos(conn: Connection): List<AffinityLabelVo> {
	val affinityLabels: List<AffinityLabel> =
		conn.findAllAffinityLabelsFromVm(this@toAffinityLabelVos.id())
			.getOrDefault(listOf())
	return affinityLabels.toAffinityLabelVos(conn)
}
