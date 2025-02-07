package com.itinfo.rutilvm.api.model.zJava

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(AffinityLabelMemberVo::class.java)

/**
 * [AffinityLabelMemberVo]
 * 선호도 그룹맴버
 * 
 * @property vmLabels List<[IdentifiedVo]> 가상머신 레이블
 * @property hostLabels List<[IdentifiedVo]>	호스트 레이블
 **/
class AffinityLabelMemberVo(
	val vmLabels: List<IdentifiedVo> = listOf(),
	val hostLabels: List<IdentifiedVo> = listOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bVmLabels: List<IdentifiedVo> = listOf();fun vmLabels(block: () -> List<IdentifiedVo>?) { bVmLabels = block() ?: listOf() }
		private var bHostLabels: List<IdentifiedVo> = listOf();fun hostLabels(block: () -> List<IdentifiedVo>?) { bHostLabels = block() ?: listOf() }
		fun build(): AffinityLabelMemberVo = AffinityLabelMemberVo(bVmLabels, bHostLabels)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): AffinityLabelMemberVo = Builder().apply(block).build()
	}
}