package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.*
import java.io.Serializable

class SizeVo (
    val allCnt: Int = 0,
    val upCnt: Int = 0,
    val downCnt: Int = 0
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
        private var bAllCnt: Int = 0; fun allCnt(block: () -> Int) { bAllCnt = block() ?: 0 }
        private var bUpCnt: Int = 0; fun upCnt(block: () -> Int) { bUpCnt = block() ?: 0 }
        private var bDownCnt: Int = 0; fun downCnt(block: () -> Int) { bDownCnt = block() ?: 0 }
        fun build(): SizeVo = SizeVo(bAllCnt, bUpCnt, bDownCnt)
    }

    companion object{
        inline fun builder(block: Builder.() -> Unit): SizeVo = Builder().apply(block).build()
    }
}

fun Connection.findDataCenterCnt(): SizeVo {
    val allDataCenters = this@findDataCenterCnt.findAllDataCenters().getOrDefault(listOf())
    val allCnt = allDataCenters.size
    val upCnt = allDataCenters.count { it.status() == DataCenterStatus.UP }
    val downCnt = allCnt - upCnt

    return SizeVo.builder {
        allCnt { allCnt }
        upCnt { upCnt }
        downCnt { downCnt }
    }
}

fun Connection.findClusterCnt(): SizeVo {
    val allClusters = this@findClusterCnt.findAllClusters().getOrDefault(listOf())

    return SizeVo.builder {
        allCnt { allClusters.size }
    }
}

fun Connection.findHostCnt(): SizeVo {
    val allHosts = this@findHostCnt.findAllHosts().getOrDefault(listOf())
    val allCnt = allHosts.size
    val upCnt = allHosts.count { it.status() == HostStatus.UP }
    val downCnt = allCnt - upCnt

    return SizeVo.builder {
        allCnt { allCnt }
        upCnt { upCnt }
        downCnt { downCnt }
    }
}

fun Connection.findVmCnt(): SizeVo {
    val allVms = this@findVmCnt.findAllVms().getOrDefault(listOf())
    val allCnt = allVms.size
    val upCnt = allVms.count { it.status() == VmStatus.UP }
    val downCnt = allCnt - upCnt

    return SizeVo.builder {
        allCnt { allCnt }
        upCnt { upCnt }
        downCnt { downCnt }
    }
}



fun Cluster.findHostCntFromCluster(conn: Connection): SizeVo {
    val allHost: List<Host> = conn.findAllHostsFromCluster(this@findHostCntFromCluster.id()).getOrDefault(listOf())
    val allCnt: Int = allHost.size
    val upCnt: Int = allHost.count { it.status() == HostStatus.UP }
    return SizeVo.builder {
        allCnt { allCnt }
        upCnt { upCnt }
        downCnt { allCnt - upCnt }
    }
}

fun Cluster.findVmCntFromCluster(conn: Connection): SizeVo {
    val allVms: List<Vm> = conn.findAllVmsFromCluster(this@findVmCntFromCluster.id()).getOrDefault(listOf())
    val allCnt: Int = allVms.size
    val upCnt: Int = allVms.count { it.status() == VmStatus.UP }
    return SizeVo.builder {
        allCnt { allCnt }
        upCnt { upCnt }
        downCnt { allCnt - upCnt }
    }
}

/**
 * 해당 호스트가 가진 가상머신의 개수 (전체, up, down)
 * @return [SizeVo]
 */
fun Host.findVmCntFromHost(): SizeVo = SizeVo.builder {
    val summary = this@findVmCntFromHost.summary()
    allCnt { if (summary.totalPresent()) summary.totalAsInteger() else 0 }
    upCnt { if (summary.activePresent()) summary.activeAsInteger() else 0 }
    downCnt { if (summary.activePresent() && summary.totalPresent()) summary.totalAsInteger() - summary.activeAsInteger() else 0 }
}

//fun Host.findVmCntFromHost(conn: Connection): SizeVo {
//    val allVms: List<Vm> = conn.findAllVmsFromHost(this@findVmCntFromHost.id()).getOrDefault(listOf())
//    val allCnt: Int = allVms.size
//    val upCnt: Int = allVms.count { it.status() == VmStatus.UP }
//    return SizeVo.builder {
//        allCnt { allCnt }
//        upCnt { upCnt }
//        downCnt { allCnt - upCnt }
//    }
//}
