package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.api.configuration.VCenterVMService
import com.itinfo.rutilvm.api.model.vmware.VCenterVm
import com.itinfo.rutilvm.api.model.vmware.VMWareSessionId
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.stereotype.Service
import retrofit2.Call
import retrofit2.Response

interface ItVWVmService {
	fun findAll(sessionId: String): List<VCenterVm>
}

@Service
open class VMWareVmServiceImpl (
	private val vCenterVms: VCenterVMService
): ItVWVmService {
	override fun findAll(sessionId: String): List<VCenterVm> {
		log.info("findAll ... sessionId: {}", sessionId)
		val call: Call<List<VCenterVm>> = vCenterVms.findAll(sessionId)
		val response: Response<List<VCenterVm>> = call.execute()
		if (response.isSuccessful) {
			return response.body() ?: throw RuntimeException("Response body is null")
		} else {
			throw RuntimeException("Failed to retrieve vm: ${response.errorBody()?.string()}")
		}
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
