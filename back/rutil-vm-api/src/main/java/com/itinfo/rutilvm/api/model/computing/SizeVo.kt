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
