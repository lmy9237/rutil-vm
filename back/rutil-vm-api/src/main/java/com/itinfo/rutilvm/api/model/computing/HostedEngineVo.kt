package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.ovirtDf
import com.itinfo.rutilvm.api.model.*
import com.itinfo.rutilvm.common.differenceInMillis
import com.itinfo.rutilvm.common.toTimeElapsedKr
import com.itinfo.rutilvm.util.ovirt.*

import org.slf4j.LoggerFactory
import org.ovirt.engine.sdk4.types.*
import java.io.Serializable

private val log = LoggerFactory.getLogger(HostedEngineVo::class.java)

/**
 * [HostedEngineVo]
 * HostedEngine으로 지정된 호스트의 정보
 *
 * @property active [Boolean] ?
 * @property configured [Boolean] ?
 * @property globalMaintenance [Boolean] ?
 * @property localMaintenance [Boolean] ?
 * @property score [Int] 점수
 */
class HostedEngineVo(
	var active: Boolean = true,
	var configured: Boolean = true,
	var globalMaintenance: Boolean = false,
	var localMaintenance: Boolean = false,
	var score: Int = -1,
): Serializable {
    override fun toString(): String =
		gson.toJson(this)

	class Builder {
        private var bActive: Boolean = true; fun active(block: () -> Boolean?) { bActive = block() ?: false }
        private var bConfigured: Boolean = true; fun configured(block: () -> Boolean?) { bConfigured = block() ?: false }
        private var bGlobalMaintenance: Boolean = false; fun globalMaintenance(block: () -> Boolean?) { bGlobalMaintenance = block() ?: false }
        private var bLocalMaintenance: Boolean = false; fun localMaintenance(block: () -> Boolean?) { bLocalMaintenance = block() ?: false }
        private var bScore: Int = -1;fun score(block: () -> Int?) { bScore = block() ?: -1 }
        fun build(): HostedEngineVo = HostedEngineVo(bActive, bConfigured, bGlobalMaintenance, bLocalMaintenance, bScore)
    }
    companion object {
        inline fun builder(block: HostedEngineVo.Builder.() -> Unit): HostedEngineVo = HostedEngineVo.Builder().apply(block).build()
    }
}

fun HostedEngine.toHostedEngineVo(): HostedEngineVo = HostedEngineVo.builder {
	active { this@toHostedEngineVo.activePresent() && this@toHostedEngineVo.active() }
	configured { this@toHostedEngineVo.configuredPresent() && this@toHostedEngineVo.configured() }
	globalMaintenance { this@toHostedEngineVo.globalMaintenancePresent() && this@toHostedEngineVo.globalMaintenance() }
	localMaintenance { this@toHostedEngineVo.localMaintenancePresent() && this@toHostedEngineVo.localMaintenance() }
	score { if (this@toHostedEngineVo.scorePresent()) this@toHostedEngineVo.scoreAsInteger() else -1 }
}
