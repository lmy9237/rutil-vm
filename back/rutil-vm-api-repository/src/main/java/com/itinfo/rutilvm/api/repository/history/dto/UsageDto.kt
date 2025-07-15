package com.itinfo.rutilvm.api.repository.history.dto

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson

import java.io.Serializable
import java.time.LocalDateTime

/**
 * [UsageDto]
 *
 * @property id [String]
 * @property name [String]
 * @property cpuPercent [Int]
 * @property memoryPercent [Int]
 * @property networkPercent [Int]
 * @property time [String]
 */
class UsageDto(
    val id: String = "",
    val name: String = "",
    val cpuPercent: Int? = null,
    val memoryPercent: Int? = null,
    var networkPercent: Int? = null,
    var time: LocalDateTime? = null,
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) {bId = block() ?: ""}
        private var bName: String = ""; fun name(block: () -> String?) {bName = block() ?: ""}
        private var bCpuPercent: Int? = null; fun cpuPercent(block: () -> Int?) {bCpuPercent = block()}
        private var bMemoryPercent: Int? = null; fun memoryPercent(block: () -> Int?) {bMemoryPercent = block()}
        private var bNetworkPercent: Int? = null; fun networkPercent(block: () -> Int?) {bNetworkPercent = block()}
        private var bTime: LocalDateTime? = null;fun time(block: () -> LocalDateTime?) { bTime = block() }
//        private var bTime: String = ""; fun time(block: () -> String?) {bTime = block() ?: ""}

        fun build(): UsageDto = UsageDto( bId, bName, bCpuPercent, bMemoryPercent, bNetworkPercent, bTime)
    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: UsageDto.Builder.() -> Unit): UsageDto = UsageDto.Builder().apply(block).build()
    }
}

