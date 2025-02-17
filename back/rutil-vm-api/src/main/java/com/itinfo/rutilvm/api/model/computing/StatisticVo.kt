package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.types.Statistic
import org.ovirt.engine.sdk4.types.StatisticKind
import org.ovirt.engine.sdk4.types.StatisticUnit
import org.ovirt.engine.sdk4.types.Value
import org.ovirt.engine.sdk4.types.ValueType
import org.slf4j.LoggerFactory
import org.springframework.data.relational.core.sql.Values
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(StatisticVo::class.java)

/**
 * [StatisticVo]
 * VM Statistic
 * @property id [String]
 * @property name [String]
 * @property description [String]
 // * @property kind [StatisticKind]
 // * @property type [ValueType]
 // * @property unit [StatisticUnit]
 * @property values [BigInteger]
 * @property vmVo [IdentifiedVo]
 */
class StatisticVo (
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val values: BigInteger = BigInteger.ZERO,
	val vmVo: IdentifiedVo = IdentifiedVo()
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bValues: BigInteger = BigInteger.ZERO;fun values(block: () -> BigInteger?) { bValues = block() ?: BigInteger.ZERO }
		private var bVmVo: IdentifiedVo = IdentifiedVo(); fun vmVo(block: () -> IdentifiedVo?) { bVmVo = block() ?: IdentifiedVo() }

		fun build(): StatisticVo = StatisticVo(bId, bName, bDescription, bValues, bVmVo)
    }

    companion object{
        inline fun builder(block: Builder.() -> Unit): StatisticVo = StatisticVo.Builder().apply(block).build()
    }
}

