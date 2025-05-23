package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.types.Architecture
import org.ovirt.engine.sdk4.types.ClusterLevel
import org.ovirt.engine.sdk4.types.CpuType
import org.ovirt.engine.sdk4.types.Permit
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(ClusterLevelVo::class.java)

/**
 * [ClusterLevelVo]
 * 클러스터 레벨 정보
 */
class ClusterLevelVo(
	val id: String = "",
	val cpuTypes: List<CpuTypeVo> = listOf(),
	val permits: List<PermitVo> = listOf()
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bCpuTypes: List<CpuTypeVo> = listOf();fun cpuTypes(block: () -> List<CpuTypeVo>?) { bCpuTypes = block() ?: listOf() }
		private var bPermits: List<PermitVo> = listOf();fun permits(block: () -> List<PermitVo>?) { bPermits = block() ?: listOf() }
		fun build(): ClusterLevelVo = ClusterLevelVo(bId, bCpuTypes, bPermits)
	}

	companion object {
		inline fun builder(block: ClusterLevelVo.Builder.() -> Unit): ClusterLevelVo = ClusterLevelVo.Builder().apply(block).build()
	}
}

class CpuTypeVo(
	val architecture: Architecture? = Architecture.UNDEFINED,
	val level: BigInteger? = BigInteger.ZERO,
	val name: String? = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bArchitecture: Architecture? = Architecture.UNDEFINED;fun architecture(block: () -> Architecture?) { bArchitecture = block() ?: Architecture.UNDEFINED }
		private var bLevel: BigInteger? = BigInteger.ZERO;fun level(block: () -> BigInteger?) { bLevel = block() ?: BigInteger.ZERO }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		fun build(): CpuTypeVo = CpuTypeVo(bArchitecture, bLevel, bName)
	}

	companion object {
		inline fun builder(block: CpuTypeVo.Builder.() -> Unit): CpuTypeVo = CpuTypeVo.Builder().apply(block).build()
	}
}

class PermitVo(
	val id: String? = "",
	val name: String? = "",
	val administrative: Boolean? = false,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bAdministrative: Boolean? = false;fun administrative(block: () -> Boolean?) { bAdministrative = block() ?: false }
		fun build(): PermitVo = PermitVo(bId, bName, bAdministrative)
	}

	companion object {
		inline fun builder(block: PermitVo.Builder.() -> Unit): PermitVo = PermitVo.Builder().apply(block).build()
	}
}

fun CpuType.toCpuTypeVo(): CpuTypeVo = CpuTypeVo.builder {
	architecture { if (this@toCpuTypeVo.architecturePresent()) this@toCpuTypeVo.architecture() else Architecture.UNDEFINED }
	level { if (this@toCpuTypeVo.levelPresent()) this@toCpuTypeVo.level() else BigInteger.ZERO }
	name { if (this@toCpuTypeVo.namePresent()) this@toCpuTypeVo.name() else "" }
}

fun List<CpuType>.toCpuTypeVos(): List<CpuTypeVo> = this@toCpuTypeVos.map {
	it.toCpuTypeVo()
}

fun Permit.toPermitVo(): PermitVo = PermitVo.builder {
	id { if (this@toPermitVo.idPresent()) id() else "" }
	name { if (this@toPermitVo.namePresent()) name() else "" }
	administrative { if (this@toPermitVo.administrativePresent()) administrative() else false }
}

fun List<Permit>.toPermitVos(): List<PermitVo> = this@toPermitVos.map {
	it.toPermitVo()
}

fun ClusterLevel.toClusterLevelVo(): ClusterLevelVo = ClusterLevelVo.builder {
	id { if (this@toClusterLevelVo.idPresent()) id() else "" }
	cpuTypes { if (this@toClusterLevelVo.cpuTypesPresent()) cpuTypes().toCpuTypeVos() else listOf()  }
	permits { if (this@toClusterLevelVo.permitsPresent()) permits().toPermitVos() else listOf() }
}

fun List<ClusterLevel>.toClusterLevelVos(): List<ClusterLevelVo> = this.map {
	it.toClusterLevelVo()
}

class ClusterLevelByArchitectureVo(
	val architecture: Architecture? = Architecture.UNDEFINED,
	val identifiables: List<ClusterLevelIdentifiableVo>? = listOf(),
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bArchitecture: Architecture? = Architecture.UNDEFINED;fun architecture(block: () -> Architecture?) { bArchitecture = block() ?: Architecture.UNDEFINED }
		private var bIdentifiables: List<ClusterLevelIdentifiableVo> = listOf();fun identifiables(block: () -> List<ClusterLevelIdentifiableVo>?) { bIdentifiables = block() ?: listOf() }
		fun build(): ClusterLevelByArchitectureVo = ClusterLevelByArchitectureVo(bArchitecture, bIdentifiables)
	}

	companion object {
		inline fun builder(block: ClusterLevelByArchitectureVo.Builder.() -> Unit): ClusterLevelByArchitectureVo = ClusterLevelByArchitectureVo.Builder().apply(block).build()
	}
}

class ClusterLevelIdentifiableVo(
	val level: BigInteger? = BigInteger.ZERO,
	val name: String? = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bLevel: BigInteger? = BigInteger.ZERO;fun level(block: () -> BigInteger?) { bLevel = block() ?: BigInteger.ZERO }
		private var bName: String? = "";fun name(block: () -> String?) { bName = block() ?: "" }
		fun build(): ClusterLevelIdentifiableVo = ClusterLevelIdentifiableVo(bLevel, bName)
	}

	companion object {
		inline fun builder(block: ClusterLevelIdentifiableVo.Builder.() -> Unit): ClusterLevelIdentifiableVo = ClusterLevelIdentifiableVo.Builder().apply(block).build()
	}
}

fun List<CpuType>.toCpuTypeByArchitectureVos(architecture: Architecture): ClusterLevelByArchitectureVo = ClusterLevelByArchitectureVo.builder {
	architecture { architecture }
	identifiables {
		this@toCpuTypeByArchitectureVos.filter {
			it.architecturePresent() && it.architecture() === architecture
		}.map {
			it.toClusterLevelIdentifiableVo()
		}
	}
}

fun CpuType.toClusterLevelIdentifiableVo(): ClusterLevelIdentifiableVo = ClusterLevelIdentifiableVo.builder {
	level { if (this@toClusterLevelIdentifiableVo.levelPresent()) this@toClusterLevelIdentifiableVo.level() else BigInteger.ZERO }
	name { if (this@toClusterLevelIdentifiableVo.namePresent()) this@toClusterLevelIdentifiableVo.name() else "" }
}
