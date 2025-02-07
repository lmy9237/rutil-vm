package com.itinfo.service

import com.itinfo.model.VmConsoleVo


/**
 * [VmConsoleService]
 * VM 콘솔 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface VmConsoleService {
	/**
	 * [VmConsoleService.getDisplayTicket]
	 * ?
	 * @param vmConsoleVo [VmConsoleVo] ?
	 * @return [VmConsoleVo] ?
	 */
	fun getDisplayTicket(vmConsoleVo: VmConsoleVo): VmConsoleVo?
}
