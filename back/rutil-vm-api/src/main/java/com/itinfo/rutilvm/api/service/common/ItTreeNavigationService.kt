package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.common.TreeNavigationalDataCenter
import com.itinfo.rutilvm.api.model.common.toNavigationalsFromDataCenter4Clusters
import com.itinfo.rutilvm.api.model.common.toNavigationalsFromNetworks
import com.itinfo.rutilvm.api.model.common.toNavigationalsFromDataCenters4StorageDomains
import com.itinfo.rutilvm.api.repository.engine.AllDisksRepository
import com.itinfo.rutilvm.api.repository.engine.VmRepository
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.findAllDataCenters

import org.ovirt.engine.sdk4.types.DataCenter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

interface ItTreeNavigationService {
    /**
     * [ItTreeNavigationService.findAllNavigationalsWithClusters]
     * 컴퓨팅 목록이 담긴 네비게이션 정보조회
     *
     * @return List<[TreeNavigationalDataCenter]>
     */
    @Throws(Error::class)
    fun findAllNavigationalsWithClusters(): List<TreeNavigationalDataCenter>
    /**
     * [ItTreeNavigationService.findAllNavigationalsWithNetworks]
     * 네트워크 목록이 담긴 네비게이션 정보조회
     *
     * @return List<[TreeNavigationalDataCenter]>
     */
    @Throws(Error::class)
    fun findAllNavigationalsWithNetworks(): List<TreeNavigationalDataCenter>
    /**
     * [ItTreeNavigationService.findAllNavigationalsWithStorageDomains]
     * 스토리지도메인 목록이 담긴 네비게이션 정보조회
     *
     * @return List<[TreeNavigationalDataCenter]>
     */
    @Throws(Error::class)
    fun findAllNavigationalsWithStorageDomains(): List<TreeNavigationalDataCenter>
}

@Service
class TreeNavigationServiceImpl (

): BaseService(), ItTreeNavigationService {
	@Autowired private lateinit var rVm: VmRepository
	@Autowired private lateinit var rAllDisks: AllDisksRepository

    @Throws(Error::class)
    override fun findAllNavigationalsWithClusters(): List<TreeNavigationalDataCenter> {
        log.info("toComputing ... ")
        val dataCenters: List<DataCenter> =
            conn.findAllDataCenters().getOrDefault(listOf())
        return dataCenters.toNavigationalsFromDataCenter4Clusters(conn, rVm)
    }

    override fun findAllNavigationalsWithNetworks(): List<TreeNavigationalDataCenter> {
        log.info("toNetwork ... ")
        val dataCenters: List<DataCenter> =
            conn.findAllDataCenters().getOrDefault(listOf())
        return dataCenters.toNavigationalsFromNetworks(conn)
    }

    override fun findAllNavigationalsWithStorageDomains(): List<TreeNavigationalDataCenter> {
        log.info("toStorageDomain ... ")
        val dataCenters: List<DataCenter> =
            conn.findAllDataCenters().getOrDefault(listOf())
        return dataCenters.toNavigationalsFromDataCenters4StorageDomains(conn, rAllDisks)
    }

    companion object{
        private val log by LoggerDelegate()
    }
}
