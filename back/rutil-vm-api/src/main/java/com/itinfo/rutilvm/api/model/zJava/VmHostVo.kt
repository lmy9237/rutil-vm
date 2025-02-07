package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.itcloud.model.IdentifiedVo
import com.itinfo.itcloud.model.fromHostToIdentifiedVo
import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findHost
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.InheritableBoolean
import org.ovirt.engine.sdk4.types.Vm
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(VmHostVo::class.java)

*/
/**
 * [VmHostVo]
 * 가상머신 호스트
 *
 * @property isHostInCluster [Boolean] 클러스터 내의 호스트 true-클러스터 내 호스트, false-특정
 * @property hostId List<[IdentifiedVo]> 특정 호스트
 * @property migrationMode [String] 마이그레이션 모드(placement_policy<affinity>) VmAffinity (MIGRATABLE, USER_MIGRATABLE, PINNED)
 * @property migrationPolicy [String] 마이그레이션 정책  migration_downtime
 * @property migrationEncrypt [InheritableBoolean] 마이그레이션 암호화 사용
 * @property parallelMigration [String] Parallel Migrations
 * @property numOfVmMigrations [String] Number of VM Migration Connections
 *//*

@Deprecated("사용안함")
class VmHostVo(
	val isHostInCluster: Boolean = false,
	val hostIds: List<IdentifiedVo> = listOf(),
	val migrationMode: String = "migratable",
	val migrationPolicy: String = "",
	val migrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT,
	val parallelMigration: String = "",
	val numOfVmMigrations: String = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bIsHostInCluster: Boolean = false;fun isHostInCluster(block: () -> Boolean?) { bIsHostInCluster = block() ?: false }
		private var bHostIds: List<IdentifiedVo> = listOf();fun hostIds(block: () -> List<IdentifiedVo>?) { bHostIds = block() ?: listOf() }
		private var bMigrationMode: String = "";fun migrationMode(block: () -> String?) { bMigrationMode = block() ?: "" }
		private var bMigrationPolicy: String = "";fun migrationPolicy(block: () -> String?) { bMigrationPolicy = block() ?: "" }
		private var bMigrationEncrypt: InheritableBoolean = InheritableBoolean.INHERIT;fun migrationEncrypt(block: () -> InheritableBoolean?) { bMigrationEncrypt = block() ?: InheritableBoolean.INHERIT}
		private var bParallelMigration: String = "";fun parallelMigration(block: () -> String?) { bParallelMigration = block() ?: "" }
		private var bNumOfVmMigrations: String = "";fun numOfVmMigrations(block: () -> String?) { bNumOfVmMigrations = block() ?: "" }
		fun build(): VmHostVo = VmHostVo(bIsHostInCluster, bHostIds, bMigrationMode, bMigrationPolicy, bMigrationEncrypt, bParallelMigration, bNumOfVmMigrations)
	}

	companion object {
		inline fun builder(block: VmHostVo.Builder.() -> Unit): VmHostVo = VmHostVo.Builder().apply(block).build()
	}
}

*/
/**
 * [Vm.toVmHostVo]
 * 편집 - 호스트
 *
 * @param system
 *
 * @return
 *//*

fun Vm.toVmHostVo(conn: Connection): VmHostVo {
	return VmHostVo.builder {
		isHostInCluster { !this@toVmHostVo.placementPolicy().hostsPresent() } // 클러스터내 호스트(t)인지 특정호스트(f)인지
		hostIds {
			if (this@toVmHostVo.placementPolicy().hostsPresent())
				this@toVmHostVo.placementPolicy().hosts().map { host: Host ->
					conn.findHost(host.id())
						?.fromHostToIdentifiedVo() ?: IdentifiedVo.builder {  }
				}
			else listOf()
		}
		migrationMode { this@toVmHostVo.placementPolicy().affinity().value() }
		migrationEncrypt { this@toVmHostVo.migration().encrypted() }
	}
}*/
