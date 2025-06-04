package com.itinfo.rutilvm.api.service.common

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.common.TreeNavigationalDataCenter
import com.itinfo.rutilvm.api.model.common.toNavigationalsWithClusters
import com.itinfo.rutilvm.api.model.common.totoNavigationalsWithNetworks
import com.itinfo.rutilvm.api.model.common.toNavigationalsWithStorageDomains
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.findAllDataCenters

import org.ovirt.engine.sdk4.types.DataCenter
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

    @Throws(Error::class)
    override fun findAllNavigationalsWithClusters(): List<TreeNavigationalDataCenter> {
        log.info("toComputing ... ")
        val dataCenters: List<DataCenter> =
            conn.findAllDataCenters().getOrDefault(listOf())
        return dataCenters.toNavigationalsWithClusters(conn)
    }

    override fun findAllNavigationalsWithNetworks(): List<TreeNavigationalDataCenter> {
        log.info("toNetwork ... ")
        val dataCenters: List<DataCenter> =
            conn.findAllDataCenters().getOrDefault(listOf())
        return dataCenters.totoNavigationalsWithNetworks(conn)
    }

    override fun findAllNavigationalsWithStorageDomains(): List<TreeNavigationalDataCenter> {
        log.info("toStorageDomain ... ")
        val dataCenters: List<DataCenter> =
            conn.findAllDataCenters().getOrDefault(listOf())
        return dataCenters.toNavigationalsWithStorageDomains(conn)
    }

    companion object{
        private val log by LoggerDelegate()
    }
}
