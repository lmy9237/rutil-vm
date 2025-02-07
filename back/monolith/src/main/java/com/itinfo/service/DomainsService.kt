package com.itinfo.service

import com.itinfo.model.StorageDomainVo
import com.itinfo.model.StorageDomainCreateVo
import com.itinfo.model.EventVo
import com.itinfo.model.HostDetailVo
import com.itinfo.model.IscsiVo

/**
 * [DomainsService]
 * 도메인 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface DomainsService {
	fun retrieveStorageDomains(status: String, domainType: String): List<StorageDomainVo>
	fun maintenanceStart(domains: List<String>)
	fun maintenanceStop(domains: List<String>)
	fun retrieveStorageDomain(id: String): StorageDomainVo?
	fun retrieveCreateDomainInfo(storageDomainId: String): StorageDomainCreateVo?
	fun retrieveStorageDomainUsage(storageDomainId: String): List<List<String>>
	fun retrieveDomainEvents(id: String): List<EventVo>
	fun retrieveHosts(): List<HostDetailVo>
	fun createDomain(storageDomainCreateVo: StorageDomainCreateVo)
	fun updateDomain(storageDomainCreateVo: StorageDomainCreateVo)
	fun removeDomain(storageDomainVo: StorageDomainVo)
	fun iscsiDiscover(storageDomainCreateVo: StorageDomainCreateVo): List<String>
	fun iscsiLogin(storageDomainCreateVo: StorageDomainCreateVo): Boolean
}
