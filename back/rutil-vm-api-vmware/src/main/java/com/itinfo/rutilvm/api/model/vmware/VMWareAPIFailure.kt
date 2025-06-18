package com.itinfo.rutilvm.api.model.vmware

import java.io.Serializable

open class VMWareAPIFailure(
	val errorType: String = "",
	val message: List<VWApiFailureDetail> = listOf(),
): Serializable {

}

open class VWApiFailureDetail(
	val args: List<String> = listOf(),
	val defaultMessage: String = "",
	val id: String = "",
): Serializable {

}
