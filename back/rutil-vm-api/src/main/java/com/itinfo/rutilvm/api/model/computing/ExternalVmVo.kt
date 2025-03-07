package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.common.gson
import org.ovirt.engine.sdk4.builders.ClusterBuilder
import org.ovirt.engine.sdk4.builders.ExternalVmImportBuilder
import org.ovirt.engine.sdk4.builders.OperatingSystemBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.builders.VmBuilder
import org.ovirt.engine.sdk4.types.ExternalVmImport
import org.ovirt.engine.sdk4.types.ExternalVmProviderType
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(ExternalVmVo::class.java)

/**
 * [ExternalVmVo]
 // * @property provider [ExternalVmProviderType]
 * @property vmwareCenter [String]
 * @property vmwareDataCenter [String]
 * @property vmwareCluster [String]
 * @property vmwareEsxi [String]
 * @property vmwareName [String]
 * @property url [String]
 * @property userName [String]
 * @property password [String]
 * @property clusterVo [IdentifiedVo]
 * @property storageDomainVo [IdentifiedVo]
 * @property sparse [Boolean]
 * @property vmVo [IdentifiedVo]
 // * @property iso [IdentifiedVo]
 */
class ExternalVmVo (
	// val provider: String = "VMWARE",
	val vmwareCenter: String = "",
	val vmwareDataCenter: String = "",
	val vmwareCluster: String = "",
	val vmwareEsxi: String = "",
	val vmwareName: String = "",
	val url: String = "",
	val userName: String = "",
	val password: String = "",
	val clusterVo: IdentifiedVo = IdentifiedVo(),
	val storageDomainVo: IdentifiedVo = IdentifiedVo(),
	val sparse: Boolean = false,
	val vmVo: IdentifiedVo = IdentifiedVo(),
	val osSystem: String = "",
	// val nic
	// val iso: IdentifiedVo = IdentifiedVo(),
): Serializable {
    override fun toString(): String = gson.toJson(this)

    class Builder {
		// private var bProvider: String = "VMWARE"; fun provider(block: () -> String?) { bProvider = block() ?: "VMWARE" }
		private var bVMWareCenter: String = ""; fun vmwareCenter(block: () -> String?) { bVMWareCenter = block() ?: "" }
		private var bVMWareDataCenter: String = ""; fun vmwareDataCenter(block: () -> String?) { bVMWareDataCenter = block() ?: "" }
		private var bVMWareCluster: String = ""; fun vmwareCluster(block: () -> String?) { bVMWareCluster = block() ?: "" }
		private var bVMWareEsxi: String = ""; fun vmwareEsxi(block: () -> String?) { bVMWareEsxi = block() ?: "" }
        private var bVMWareName: String = ""; fun vmwareName(block: () -> String?) { bVMWareName = block() ?: ""}
		private var bUrl: String = ""; fun url(block: () -> String?) { bUrl = block() ?: "" }
		private var bUserName: String = ""; fun userName(block: () -> String?) { bUserName = block() ?: "" }
		private var bPassword: String = ""; fun password(block: () -> String?) { bPassword = block() ?: "" }
		private var bClusterVo: IdentifiedVo = IdentifiedVo(); fun clusterVo(block: () -> IdentifiedVo?) { bClusterVo = block() ?: IdentifiedVo() }
		private var bStorageDomainVo: IdentifiedVo = IdentifiedVo(); fun storageDomainVo(block: () -> IdentifiedVo?) { bStorageDomainVo = block() ?: IdentifiedVo() }
		private var bSparse: Boolean = false; fun sparse(block: () -> Boolean?) { bSparse = block() ?: false }
		private var bVmVo: IdentifiedVo = IdentifiedVo(); fun vmVo(block: () -> IdentifiedVo?) { bVmVo = block() ?: IdentifiedVo() }
		private var bOsSystem: String = ""; fun osSystem(block: () -> String?) { bOsSystem = block() ?: "" }


		// private var bIso: IdentifiedVo = IdentifiedVo(); fun iso(block: () -> IdentifiedVo?) { bIso = block() ?: IdentifiedVo() }

        fun build(): ExternalVmVo = ExternalVmVo(/*bProvider,*/ bVMWareCenter, bVMWareDataCenter, bVMWareCluster, bVMWareEsxi, bVMWareName, bUrl, bUserName, bPassword, bClusterVo, bStorageDomainVo, bSparse, bVmVo, bOsSystem )
    }

    companion object {
        inline fun builder(block: ExternalVmVo.Builder.() -> Unit): ExternalVmVo = ExternalVmVo.Builder().apply(block).build()
    }
}

fun ExternalVmImport.toExternalVmImport(): ExternalVmVo {
	val ehp = this@toExternalVmImport
	return ExternalVmVo.builder {
		vmwareName { ehp.name() }
		vmVo { IdentifiedVo.builder { name { ehp.vm().name() } } }
		clusterVo { IdentifiedVo.builder { id { ehp.cluster().id() } } }
		storageDomainVo { IdentifiedVo.builder { id { ehp.storageDomain().id() } } }
		sparse { ehp.sparse() }
		userName { ehp.username() }
		password { ehp.password() }
		// provider { ehp.provider().value() }
		url { ehp.url() }
		// iso { IdentifiedVo.builder { id { ehp.driversIso().id() } } }
	}
}

// ?no_verify=1 검증무시
fun ExternalVmVo.toExternalVmImportBuilder(): ExternalVmImport {
	log.info("importExternalVm ...  externalVo: {}", this@toExternalVmImportBuilder)
	return ExternalVmImportBuilder()
		.name(this@toExternalVmImportBuilder.vmwareName)
		.vm(
			VmBuilder()
				.name(this@toExternalVmImportBuilder.vmVo.name)
				.os(OperatingSystemBuilder().type(osSystem).build())
				// .cluster(ClusterBuilder().id(this@toExternalVmImportBuilder.clusterVo.id).build())
				.build()
		)
		.cluster(ClusterBuilder().id(this@toExternalVmImportBuilder.clusterVo.id).build())
		.storageDomain(StorageDomainBuilder().id(this@toExternalVmImportBuilder.storageDomainVo.id).build())
		.sparse(this@toExternalVmImportBuilder.sparse)
		.username(this@toExternalVmImportBuilder.userName)
		.password(this@toExternalVmImportBuilder.password)
		.provider(ExternalVmProviderType.VMWARE) // vmware 로 기본지정
		.url("vpx://"+this@toExternalVmImportBuilder.vmwareCenter+"/"+this@toExternalVmImportBuilder.vmwareDataCenter+"/"+this@toExternalVmImportBuilder.vmwareCluster+"/"+this@toExternalVmImportBuilder.vmwareEsxi+"?no_verify=1")
		// .driversIso(FileBuilder().id(eVm.iso.id).build())
		.build()
}
