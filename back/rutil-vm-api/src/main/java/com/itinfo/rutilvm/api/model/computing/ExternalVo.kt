package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.builders.ClusterBuilder
import org.ovirt.engine.sdk4.builders.ExternalHostProviderBuilder
import org.ovirt.engine.sdk4.builders.ExternalVmImportBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.builders.VmBuilder
import org.ovirt.engine.sdk4.types.ExternalHostProvider
import org.ovirt.engine.sdk4.types.ExternalProvider
import org.ovirt.engine.sdk4.types.ExternalVmImport
import org.ovirt.engine.sdk4.types.ExternalVmProviderType
import org.ovirt.engine.sdk4.types.ExternalVmProviderType.VMWARE

import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(ExternalVo::class.java)

/**
 * [ExternalVo]
 *
 * @property name [String]
 * @property vmVo [IdentifiedVo]
 * @property clusterVo [IdentifiedVo]
 * @property storageDomainVo [IdentifiedVo]
 * @property sparse [Boolean]
 * @property userName [String]
 * @property password [String]
 * @property provider [ExternalVmProviderType]
 * @property url [String]
 * @property iso [IdentifiedVo]
 */
class ExternalVo (
	val dataCenterVo: IdentifiedVo = IdentifiedVo(),
	val vCenter: String = "",
	val dataCenter: String = "",
	val cluster: String = "",
	val esxi: String = "",
	val name: String = "",
	val vmVo: IdentifiedVo = IdentifiedVo(),
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val storageDomainVo: IdentifiedVo = IdentifiedVo(),
	val sparse: Boolean = false,
	val userName: String = "",
	val password: String = "",
	val provider: ExternalVmProviderType = ExternalVmProviderType.VMWARE,
	val url: String = "",
	// val iso: IdentifiedVo = IdentifiedVo(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
		private var bDataCenterVo: IdentifiedVo = IdentifiedVo(); fun dataCenterVo(block: () -> IdentifiedVo?) { bDataCenterVo = block() ?: IdentifiedVo() }
		private var bVCenter: String = ""; fun vCenter(block: () -> String?) { bVCenter = block() ?: "" }
		private var bDataCenter: String = ""; fun dataCenter(block: () -> String?) { bDataCenter = block() ?: "" }
		private var bCluster: String = ""; fun cluster(block: () -> String?) { bCluster = block() ?: "" }
		private var bEsxi: String = ""; fun esxi(block: () -> String?) { bEsxi = block() ?: "" }
        private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
		private var bVmVo: IdentifiedVo = IdentifiedVo(); fun vmVo(block: () -> IdentifiedVo?) { bVmVo = block() ?: IdentifiedVo() }
		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
		private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
		private var bSparse: Boolean = false; fun sparse(block: () -> Boolean?) { bSparse = block() ?: false }
		private var bUserName: String = ""; fun userName(block: () -> String?) { bUserName = block() ?: "" }
		private var bPassword: String = ""; fun password(block: () -> String?) { bPassword = block() ?: "" }
		private var bProvider: ExternalVmProviderType = VMWARE; fun provider(block: () -> ExternalVmProviderType?) { bProvider = block() ?: VMWARE }
		private var bUrl: String = ""; fun url(block: () -> String?) { bUrl = block() ?: "" }
		// private var bIso: IdentifiedVo = IdentifiedVo(); fun iso(block: () -> IdentifiedVo?) { bIso = block() ?: IdentifiedVo() }

        fun build(): ExternalVo = ExternalVo(bDataCenterVo, bVCenter, bDataCenter, bCluster, bEsxi, bName, bVmVo, bClusterVo, bStorageDomainVo, bSparse, bUserName, bPassword, bProvider, bUrl, /*bIso,*/ )
    }

    companion object {
        inline fun builder(block: ExternalVo.Builder.() -> Unit): ExternalVo = ExternalVo.Builder().apply(block).build()
    }
}

fun ExternalVmImport.toExternalVmImport(): ExternalVo {
	val ehp = this@toExternalVmImport
	return ExternalVo.builder {
		name { ehp.name() }
		vmVo { IdentifiedVo.builder { name { ehp.vm().name() } } }
		clusterVo { IdentifiedVo.builder { id { ehp.cluster().id() } } }
		storageDomainVo { IdentifiedVo.builder { id { ehp.storageDomain().id() } } }
		sparse { ehp.sparse() }
		userName { ehp.username() }
		password { ehp.password() }
		provider { ehp.provider() }
		url { ehp.url() }
		// iso { IdentifiedVo.builder { id { ehp.driversIso().id() } } }
	}
}

fun ExternalHostProvider.toExternalHostProvider(): ExternalVo {
	val ehp = this@toExternalHostProvider
	return ExternalVo.builder {
		userName { ehp.username() }
		url { ehp.url() }
	}
}
fun List<ExternalHostProvider>.toExternalHostProviders(): List<ExternalVo> =
	this@toExternalHostProviders.map { it.toExternalHostProvider() }


fun ExternalProvider.toExternalProvider(): ExternalVo {
	val ehp = this@toExternalProvider
	return ExternalVo.builder {
		userName { ehp.username() }
		url { ehp.url() }
		name { ehp.name() }
	}
}
fun List<ExternalProvider>.toExternalProviders(): List<ExternalVo> =
	this@toExternalProviders.map { it.toExternalProvider() }

fun ExternalVo.toExternalHostProviderBuilder(): ExternalHostProvider {
	val ehp = this@toExternalHostProviderBuilder
	log.info("externalHost: {}", this)
	return ExternalHostProviderBuilder()
		.name("VmWare") // 해결필요
		.username(ehp.userName)
		.password(ehp.password)
		.url("vpx://"+ehp.userName+"/"+ehp.dataCenter+"/"+cluster+"/"+esxi)
		// .url(ehp.url)
		// https://administrator@vsphere.local/Datacenter/ITITINFO/192.168.0.4
		.build()
}


fun ExternalVo.toExternalVmImportBuilder(): ExternalVmImport {
	val eVm = this@toExternalVmImportBuilder
	return ExternalVmImportBuilder()
		.vm(VmBuilder().name(eVm.vmVo.name).build())
		.cluster(ClusterBuilder().id(eVm.clusterVo.id).build())
		.storageDomain(StorageDomainBuilder().id(eVm.storageDomainVo.id).build())
		.name(eVm.name)
		.sparse(eVm.sparse)
		.username(eVm.userName)
		.password(eVm.password)
		.provider(eVm.provider) // vmware 로 기본지정
		.url(eVm.url+"?no_verify=1") // ?no_verify=1 검증무시
		// <url>vpx://wmware_user@vcenter-host/DataCenter/Cluster/esxi-host?no_verify=1</url>
		// .driversIso(FileBuilder().id(eVm.iso.id).build())
		.build()
}
