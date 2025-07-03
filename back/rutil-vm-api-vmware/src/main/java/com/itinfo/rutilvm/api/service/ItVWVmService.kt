package com.itinfo.rutilvm.api.service

import com.itinfo.rutilvm.api.configuration.VCenterVMService
import com.itinfo.rutilvm.api.configuration.VWRestConfig
import com.itinfo.rutilvm.api.model.vmware.VCenterVm
import com.itinfo.rutilvm.api.model.vmware.VWPrompt
import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import retrofit2.Call
import retrofit2.Response

interface ItVWVmService {
	fun findAll(prompt: VWPrompt): List<VCenterVm>
}

@Service
open class VMWareVmServiceImpl (
): ItVWVmService {
	@Autowired private lateinit var vwRestConfig: VWRestConfig
	private fun vCenterVms(baseUrl: String): VCenterVMService =
		vwRestConfig.vmWareRestRetrofit(
			baseUrl
		).create(VCenterVMService::class.java)

	override fun findAll(prompt: VWPrompt): List<VCenterVm> {
		log.info("findAll ... sessionId: {}", prompt.sessionId)
		val call: Call<List<VCenterVm>> = vCenterVms(prompt.baseUrl)
			.findAll(prompt.sessionId)
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
