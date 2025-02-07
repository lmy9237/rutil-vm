package com.itinfo.service.impl

import com.google.gson.Gson

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllInstanceTypes
import com.itinfo.findAllVnicProfiles

import com.itinfo.findInstanceType
import com.itinfo.addInstanceType
import com.itinfo.updateInstanceType
import com.itinfo.removeInstanceType
import com.itinfo.addNicForInstanceType

import com.itinfo.model.MessageVo.Companion.createMessage
import com.itinfo.model.MessageType
import com.itinfo.model.toInstanceType
import com.itinfo.model.toInstanceTypeVo
import com.itinfo.model.InstanceTypeVo
import com.itinfo.model.toInstanceTypeVos
import com.itinfo.model.toVmNicVos
import com.itinfo.service.InstanceTypesService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.ConnectionService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.builders.Builders
import org.ovirt.engine.sdk4.types.InstanceType

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service


/**
 * [InstanceTypesServiceImpl]
 * 인스턴스 유형 관리 서비스 응용
 * 
 * @author chlee
 * @since 2023.12.07
 */
@Service
class InstanceTypesServiceImpl : InstanceTypesService {
	@Autowired private lateinit var connectionService: ConnectionService
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var websocketService: WebsocketService
	
	override fun retrieveInstanceTypes(): List<InstanceTypeVo> {
		log.info("... retrieveInstanceTypes")
		val c = connectionService.getConnection()
		val instanceTypes = c.findAllInstanceTypes()
		return instanceTypes.toInstanceTypeVos(c)
	}

	override fun retrieveInstanceTypeCreateInfo(): InstanceTypeVo {
		log.info("... retrieveInstanceTypeCreateInfo")
		val connection = connectionService.getConnection()
		val nicItemList = connection.findAllVnicProfiles()
		val vnics = nicItemList.toVmNicVos()
		return InstanceTypeVo().apply {
			nics = vnics
			affinity = "migratable"
		}
	}

	@Async("karajanTaskExecutor")
	override fun createInstanceType(instanceType: InstanceTypeVo): String {
		// TODO: 코드 정리
		log.info("... createInstanceType")
		val c = adminConnectionService.getConnection()
		var instanceTypeFound: InstanceType? = null
		try {
			val it = instanceType.toInstanceType()
			instanceTypeFound = c.addInstanceType(it)
			if (instanceType.selectNics.isNotEmpty()) {
				val (_, id, _, _, nicName) = instanceType.selectNics[0]
				val nic = Builders.nic()
					.name(nicName)
					.vnicProfile(Builders.vnicProfile().id(id)).build()
				val res =
					c.addNicForInstanceType(instanceTypeFound!!.id(), nic)
			}
			Thread.sleep(3000L)
			val message = createMessage(MessageType.INSTANCE_TYPE_ADD, true, instanceTypeFound!!.name(), "")
			websocketService.notify(message)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val message = createMessage(
				MessageType.INSTANCE_TYPE_ADD, false,
				e.message!!, ""
			)
			websocketService.notify(message)
		}
		return instanceTypeFound!!.id()
	}

	override fun retrieveInstanceTypeUpdateInfo(id: String): InstanceTypeVo {
		log.info("... retrieveInstanceTypeUpdateInfo('$id')")
		val c = connectionService.getConnection()
		val item = c.findInstanceType(id)
		val vo = item.toInstanceTypeVo(c)
		log.debug("instanceType FOUND!: $vo")
		return vo
	}

	@Async("karajanTaskExecutor")
	override fun updateInstanceType(instanceType: InstanceTypeVo): String {
		// TODO: 코드 정리
		log.info("... updateInstanceType")
		val c = adminConnectionService.getConnection()
		var response: InstanceType? = null
		try {
			val it = instanceType.toInstanceType()
			response = c.updateInstanceType(it)
			Thread.sleep(3000L)
			val message = createMessage(MessageType.INSTANCE_TYPE_UPDATE, true, response!!.name(), "")
			websocketService.notify( message)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val message = createMessage(MessageType.INSTANCE_TYPE_UPDATE, false, e.localizedMessage, "")
			websocketService.notify( message)
		}
		return response!!.id()
	}

	override fun removeInstanceType(instanceType: InstanceTypeVo): String {
		log.info("removeInstanceType ...")
		val connection = connectionService.getConnection()
		val res = connection.removeInstanceType(instanceType.id)
		return  "${instanceType.name} 삭제 ${if (res) "완료" else "실패"}"
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}
