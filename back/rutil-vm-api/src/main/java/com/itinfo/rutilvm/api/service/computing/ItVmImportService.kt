package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.ExternalVmVo
import com.itinfo.rutilvm.api.model.computing.VmExportVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.computing.toExternalVmImport
import com.itinfo.rutilvm.api.model.computing.toExternalVmImportBuilder
import com.itinfo.rutilvm.api.model.fromHostsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromNetworksToIdentifiedVos
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.service.computing.ItHostNicServiceImpl.Companion
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.error.ItCloudException
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.Cluster
import org.ovirt.engine.sdk4.types.ExternalVmImport
import org.ovirt.engine.sdk4.types.Host
import org.ovirt.engine.sdk4.types.Network
import org.ovirt.engine.sdk4.types.Vm

import org.springframework.stereotype.Service

interface ItVmImportService {
	// /**
	//  * [ItVmService.addVmwareInfo]
	//  * 가상머신 가져오기- vmware 정보등록
	//  *
	//  * @param
	//  * @return
	//  */
	// @Throws(Error::class)
	// fun addVmwareInfo(externalVo: ExternalVo): ExternalVo?
	/**
	 * [ItVmImportService.importExternalVm]
	 * 가상머신 가져오기 (Vmware)
	 *
	 * @param externalVmVo [ExternalVmVo]
	 * @return [ExternalVmVo]
	 *
	 * ExternalHostProviders 를 이용해 외부 공급자를 추가하고 조회하는 방식같음
	 *
	 * POST /externalvmimports
	 * <external_vm_import>
	 *   <vm>
	 *     <name>my_vm</name>
	 *   </vm>
	 *   <cluster id="360014051136c20574f743bdbd28177fd" />
	 *   <storage_domain id="8bb5ade5-e988-4000-8b93-dbfc6717fe50" />
	 *   <name>vm_name_as_is_in_vmware</name>
	 *   <sparse>true</sparse>
	 *   <username>vmware_user</username>
	 *   <password>123456</password>
	 *   <provider>VMWARE</provider>
	 *   <url>vpx://wmware_user@vcenter-host/DataCenter/Cluster/esxi-host?no_verify=1</url>
	 *   <drivers_iso id="virtio-win-1.6.7.iso" />
	 * </external_vm_import>
	 */
	@Throws(Error::class)
	fun importExternalVm(externalVmList: List<ExternalVmVo>): List<ExternalVmVo>?
}

@Service
class VmImportServiceImpl: BaseService(), ItVmImportService {

	// @Throws(Error::class)
	// override fun addVmwareInfo(externalVo: ExternalVo): ExternalVo? {
	// 	log.info("addVmwareInfo ...  externalVo: {}", externalVo)
	// 	val res: ExternalHostProvider? = conn.addExternalHostProvider(
	// 		externalVo.toExternalHostProviderBuilder()
	// 	).getOrNull()
	// 	return res?.toExternalHostProvider()
	// }

	// 외부 가상머신 가져오기 (vmware)
	@Throws(Error::class)
	override fun importExternalVm(externalVmList: List<ExternalVmVo>): List<ExternalVmVo>? {
		log.info("importExternalVm ...  externalVmList: {}", externalVmList)

		return externalVmList.mapNotNull { externalVmVo ->
			val res: ExternalVmImport? = conn
				.addExternalVmImport(externalVmVo.toExternalVmImportBuilder())
				.getOrNull()

			res?.toExternalVmImport()
		}
	}


	companion object {
		private val log by LoggerDelegate()
	}
}
