package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.computing.AggregateConsoleVo
import com.itinfo.rutilvm.api.model.computing.GraphicsConsoleVo
import com.itinfo.rutilvm.api.model.computing.TicketVo
import com.itinfo.rutilvm.api.model.computing.toAggregateConsoleVo
import com.itinfo.rutilvm.api.model.computing.toGraphicsConsoleVo
import com.itinfo.rutilvm.api.model.computing.toGraphicsConsoleVos
import com.itinfo.rutilvm.api.model.computing.toTicketVo
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.toError
import com.itinfo.rutilvm.util.ovirt.findAllVmGraphicsConsolesFromVm
import com.itinfo.rutilvm.util.ovirt.findTicketFromVmGraphicsConsole
import com.itinfo.rutilvm.util.ovirt.findVm
import com.itinfo.rutilvm.util.ovirt.findVmGraphicsConsoleFromVm
import com.itinfo.rutilvm.util.ovirt.generateRemoteViewerConnectionFile
import com.itinfo.rutilvm.util.ovirt.qualified4ConsoleConnect
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.GraphicsConsole
import org.ovirt.engine.sdk4.types.Ticket
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmStatus
import org.springframework.stereotype.Service

interface ItVmGraphicsConsolesService {
	/**
	 * [ItVmOperationService.generateRemoteViewerConnection]
	 * 가상머신 그래픽 콘솔 원격 클라이언트 접속 파일 (console.vv) 다운로드
	 *
	 * @param vmId [String] 가상머신 Id
	 */
	@Throws(Error::class)
	fun generateRemoteViewerConnection(vmId: String): String?
	/**
	 * [ItVmOperationService.earnGCTicketFromVm]
	 * 가상머신 그래픽 콘솔 구성
	 *
	 * @param vmId [String] 가상머신 Id
	 */
	@Throws(Error::class)
	fun earnGCTicketFromVm(vmId: String): AggregateConsoleVo?
	/**
	 * [ItVmGraphicsConsolesService.findAllFromVm]
	 * 그래픽 콘솔 목록 조회
	 *
	 * @param vmId [String] 가상머신 Id
	 * @return List<[GraphicsConsoleVo]>
	 */
	fun findAllFromVm(vmId: String): List<GraphicsConsoleVo>
	/**
	 * [ItVmGraphicsConsolesService.findAllFromVm]
	 * 그래픽 콘솔 상세 조회
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param graphicsConsoleId [String] 그래픽콘솔 Id
	 * @return [GraphicsConsoleVo]
	 */
	fun findOneFromVm(vmId: String, graphicsConsoleId: String): GraphicsConsoleVo
	/**
	 * [ItVmGraphicsConsolesService.findAllFromVm]
	 * 그래픽 콘솔에 접근을 위해 티켓 발행
	 *
	 * @param vmId [String] 가상머신 Id
	 * @param graphicsConsoleId [String] 그래픽콘솔 Id
	 * @param expiry [Long] 콘솔 접근 만료시간
	 *
	 * @return [GraphicsConsoleVo]
	 */
	fun publishTicket(vmId: String, graphicsConsoleId: String, expiry: Long?): TicketVo
}

@Service
class VmGraphicsConsolesServiceImpl(

) : BaseService(), ItVmGraphicsConsolesService {
	override fun generateRemoteViewerConnection(vmId: String): String? {
		log.info("generateRemoteViewerConnection ... vmId: {}", vmId)
		val vm: Vm = conn.findVm(vmId).getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		if (vm.statusPresent() && !(vm.qualified4ConsoleConnect)) {
			vm.status() !== VmStatus.UP
			log.error("generateRemoteViewerConnection ... vmId: {}\nThis vm is NOT running!", vmId)
			throw ErrorPattern.VM_STATUS_UP.toError()
		}
		val graphicsConsole: GraphicsConsole =
			conn.findAllVmGraphicsConsolesFromVm(vmId).getOrDefault(listOf()).firstOrNull()
				?: throw ErrorPattern.CONSOLE_NOT_FOUND.toException() // VmStatus가 UP 상태 일 경우 하나 이상은 있어야 정상.
		val res: String? = conn.generateRemoteViewerConnectionFile(vmId, graphicsConsole.id()).getOrDefault("")
		return res
	}

	@Throws(Error::class)
	override fun earnGCTicketFromVm(vmId: String): AggregateConsoleVo? {
		log.info("earnGCTicketFromVm ... vmId: {}", vmId)
		val vm: Vm = conn.findVm(vmId).getOrNull() ?: throw ErrorPattern.VM_NOT_FOUND.toException()
		if (vm.statusPresent() && !(vm.qualified4ConsoleConnect)) {
			log.error("earnGCTicketFromVm ... vmId: {}\nThis vm is NOT running!", vmId)
			throw ErrorPattern.VM_STATUS_UP.toError()
		}
		return vm.toAggregateConsoleVo(conn)
	}

	override fun findAllFromVm(vmId: String): List<GraphicsConsoleVo> {
		log.info("findAllFromVm ... vmId: {}", vmId)
		val gConsoles: List<GraphicsConsole> =
			conn.findAllVmGraphicsConsolesFromVm(vmId).getOrDefault(listOf())
		return gConsoles.toGraphicsConsoleVos()
	}

	@Throws(Error::class)
	override fun findOneFromVm(vmId: String, graphicsConsoleId: String): GraphicsConsoleVo {
		log.info("findOneFromVm ... vmId: {}, graphicsConsoleId: {}", vmId, graphicsConsoleId)
		val gConsole: GraphicsConsole =
			conn.findVmGraphicsConsoleFromVm(vmId, graphicsConsoleId).getOrNull() ?: throw ErrorPattern.CONSOLE_NOT_FOUND.toException()
		return gConsole.toGraphicsConsoleVo()
	}

	override fun publishTicket(vmId: String, graphicsConsoleId: String, expiry: Long?): TicketVo {
		log.info("publishTicket ... vmId: {}, graphicsConsoleId: {}, expiry: {}", vmId, graphicsConsoleId, expiry)
		val ticket: Ticket =
			conn.findTicketFromVmGraphicsConsole(vmId, graphicsConsoleId, expiry?.toBigInteger()).getOrNull()
				?: throw ErrorPattern.TICKET_NOT_FOUND.toException()
		return ticket.toTicketVo()
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
