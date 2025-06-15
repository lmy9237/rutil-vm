package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.types.Icon
import java.io.Serializable

/**
 * [VmIconVo]
 * 가상머신 아이콘 정보
 *
 * @property id [String] 아이콘 ID
 * @property dataUrl [String] 이미지 데이터
 *
 * @author 이찬희 (@chanhi2000)
 */
class VmIconVo(
	val id: String? = "",
	val dataUrl: String? = "",
) : Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String? = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bDataUrl: String = "";fun dataUrl(block: () -> String?) { bDataUrl = block() ?: "" }
		fun build(): VmIconVo = VmIconVo(bId, bDataUrl)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmIconVo = Builder().apply(block).build()
	}
}

fun Icon.toVmIconVo(): VmIconVo = VmIconVo.builder {
	id { this@toVmIconVo.id() }
	dataUrl {
		if (this@toVmIconVo.dataPresent() && this@toVmIconVo.mediaTypePresent())
			"data:${this@toVmIconVo.mediaType()};base64,${this@toVmIconVo.data()}"
		else ""
	}
}
