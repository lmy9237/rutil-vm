package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllVms
import com.itinfo.findAllVmGraphicsConsolesFromVm
import com.itinfo.findTicketFromVm

import com.itinfo.model.VmConsoleVo
import com.itinfo.service.SystemPropertiesService
import com.itinfo.service.VmConsoleService
import com.itinfo.service.engine.AdminConnectionService


import org.ovirt.engine.sdk4.types.GraphicsType

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class VmConsoleServiceImpl : VmConsoleService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var systemPropertiesService: SystemPropertiesService
	
	override fun getDisplayTicket(vmConsoleVo: VmConsoleVo): VmConsoleVo? {
		log.info("getDisplayTicket ...")
		val c = adminConnectionService.getConnection()
		val vm = c.findAllVms("name=${vmConsoleVo.vmName}")[0]
		val consoles = c.findAllVmGraphicsConsolesFromVm(vm.id())
		consoles.firstOrNull {
			vmConsoleVo.type.equals("VNC", ignoreCase = true) &&
					it.protocolPresent() &&
					(it.protocol() == GraphicsType.VNC || it.protocol() == GraphicsType.SPICE)
		}?.also { console ->
			log.info("console FOUND! ... $console")
			val ticket = c.findTicketFromVm(vm.id(), console.id())
			vmConsoleVo.address = console.address()
			vmConsoleVo.port = console.port().toInt().toString()
			vmConsoleVo.passwd = ticket?.value() ?: ""
			vmConsoleVo.tlsPort = if (console.tlsPortPresent()) "${console.tlsPort().toInt()}" else ""
			try {
				val systemProperties = systemPropertiesService.retrieveSystemProperties()
				vmConsoleVo.hostAddress = systemProperties.vncIp
				vmConsoleVo.hostPort = systemProperties.vncPort
			} catch (e: Exception) {
				log.error("something went WRONG! ... reason: ${e.localizedMessage}")
			}
		} ?: run {
			log.warn("NO console to run !!!")
			return null
		}
		return vmConsoleVo
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}