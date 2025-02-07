package com.itinfo.rutilvm.api.repository.history.dto

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson

import java.io.Serializable
import java.time.LocalDateTime

class LineDto (
    val name: String = "",
    val dataList: List<Int> = listOf(),
    var time: List<LocalDateTime> = listOf(),
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
        private var bName: String = ""; fun name(block: () -> String?) {bName = block() ?: ""}
        private var bDataList: List<Int> = listOf(); fun dataList(block: () -> List<Int>?) {bDataList = block() ?: listOf()}
        private var bTime: List<LocalDateTime> = listOf();fun time(block: () -> List<LocalDateTime>?) { bTime = block() ?: listOf() }

        fun build(): LineDto = LineDto(bName, bDataList, bTime)
    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: LineDto.Builder.() -> Unit): LineDto = LineDto.Builder().apply(block).build()
    }
}


