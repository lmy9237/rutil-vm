package com.itinfo.rutilvm.api.socket

import com.itinfo.rutilvm.util.ovirt.Term


fun Term.simpleNotify(isSuccess: Boolean = true, title: String = "", content: String): WSMessage = when(this) {
	else -> WSMessage.builder {
		title { title + if (isSuccess) " 완료" else " 실패" }
		content { "$content 처리가 " + if (isSuccess) "완료되었습니다." else "실패하였습니다."   }
		tag { if (isSuccess) WSMessageTag.SUCCESS else WSMessageTag.ERROR }
	}
}