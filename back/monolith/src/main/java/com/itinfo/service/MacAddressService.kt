package com.itinfo.service

import com.itinfo.model.MacAddressPoolsVo

/**
 * [MacAddressService]
 * mac address 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface MacAddressService {
	fun retrieveMacAddressPools(): List<MacAddressPoolsVo>
}
