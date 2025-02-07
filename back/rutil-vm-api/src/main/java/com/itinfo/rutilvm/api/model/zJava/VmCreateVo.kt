package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.itcloud.model.Os
import com.itinfo.itcloud.model.computing.*
import com.itinfo.itcloud.gson
import com.itinfo.rutilvm.util.ovirt.findBios
import com.itinfo.rutilvm.util.ovirt.findVmType
import com.itinfo.itcloud.model.network.NicVo
import com.itinfo.itcloud.model.network.VnicProfileVo
import com.itinfo.itcloud.model.network.toNicVosFromVm
import com.itinfo.itcloud.model.storage.DiskImageVo
import com.itinfo.rutilvm.util.ovirt.*
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(VmCreateVo::class.java)

*/
/**
 * [VmCreateVo]
 * 가상머신 생성
 *
 * @property id [String]					가상머신ID
 * @property name [String]					가상머신명
 * @property description [String]			설명
 * @property comment [String]
 *
 * @property dataCenterVo [DataCenterVo]	따지고보면 생성창에서 보여주는 역할만 하는거 같음
 * @property clusterVo [ClusterVo]
 * @property clusterName [String]
 * @property templateId [String]			템플릿
 * @property templateName [String]
 * @property os [String] 					운영시스템
 * @property chipsetType [String]			칩셋/펌웨어 유형
 * @property option [String]				최적화 옵션
 * @property stateless [Boolean]			상태 비저장
 * @property startPaused [Boolean]			일시정지 모드에서 시작
 * @property deleteProtected [Boolean]  	삭제 방지
 * 
 * 보관
 * @property vDisks List<[VDiskVo]>			인스턴스 이미지
 * @property vnics List<[VnicProfileVo]>	vnic 프로파일 (vnic Profile id를 받아서
 *
 * @property vmSystemVo [VmSystemVo]		시스템
 * @property vmInitVo: [VmInitVo]			초기실행
 *
 * 콘솔
 * @property vmHostVo [VmHostVo] 호스트
 * @property vmHaVo: [VmHaVo] 고가용성
 * 
 * @property vmResourceVo [VmResourceVo] 리소스 할당
 * 
 * @property vmBootVo [VmBootVo] 부트 옵션
 * 
 * 선호도
 * @property agVoList List<[AffinityGroupVo]>
 * @property alVoList List<[AffinityLabelVo]>
 *//*
@Deprecated("사용안함")
class VmCreateVo(
	val id: String = "",
	val name: String = "",
	val description: String = "",
	val comment: String = "",
	val chipsetType: String = "",
	val option: String = "",

	val stateless: Boolean = false,
	val startPaused: Boolean = false,
	val deleteProtected: Boolean = false,

//	val vDisks: List<VDiskVo> = listOf(),
//	val vnicProfiles: List<VnicProfileVo> = listOf(),

	val os: Os = Os.OTHER,
	val clusterVo: ClusterVo = ClusterVo(),
	val dataCenterVo: DataCenterVo = DataCenterVo(),
	val templateVo: TemplateVo = TemplateVo(),
	val diskIds: List<String> = listOf(),
	val diskImages: List<DiskImageVo> = listOf(), // 디스크 이미지 생성용
	val vnicProfileIds: List<String>, // vnic profile 아이디저장용
	val nics: List<NicVo> = listOf(), // 편집

	val vmSystemVo: VmSystemVo = VmSystemVo(),
	val vmInitVo: VmInitVo = VmInitVo(),
	val vmHostVo: VmHostVo = VmHostVo(),
	val vmHaVo: VmHaVo = VmHaVo(),
	val vmResourceVo: VmResourceVo = VmResourceVo(),
	val vmBootVo: VmBootVo = VmBootVo(),

	val affinityGroupVos: List<AffinityGroupVo> = listOf(),
	val affinityLabelVos: List<AffinityLabelVo> = listOf()
): Serializable {
	val osFullName: String
		get() = os.fullName

	override fun toString(): String =
		gson.toJson(this)
		
	class Builder {
		private var bId: String = "";fun id(block: () -> String?) { bId = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bDescription: String = "";fun description(block: () -> String?) { bDescription = block() ?: "" }
		private var bComment: String = "";fun comment(block: () -> String?) { bComment = block() ?: "" }
		private var bChipsetType: String = "";fun chipsetType(block: () -> String?) { bChipsetType = block() ?: "" }
		private var bOption: String = "";fun option(block: () -> String?) { bOption = block() ?: "" }
		private var bIsStateless: Boolean = false;fun stateless(block: () -> Boolean?) { bIsStateless = block() ?: false }
		private var bIsStartPaused: Boolean = false;fun startPaused(block: () -> Boolean?) { bIsStartPaused = block() ?: false }
		private var bIsDeleteProtected: Boolean = false;fun deleteProtected(block: () -> Boolean?) { bIsDeleteProtected = block() ?: false }
//		private var bVDisks: List<VDiskVo> = listOf();fun vDisks(block: () -> List<VDiskVo>?) { bVDisks = block() ?: listOf() }
		private var bOs: Os = Os.OTHER;fun os(block: () -> Os?) { bOs = block() ?: Os.OTHER }
		private var bClusterVo: ClusterVo = ClusterVo();fun clusterVo(block: () -> ClusterVo?) { bClusterVo = block() ?: ClusterVo() }
		private var bDataCenterVo: DataCenterVo = DataCenterVo();fun dataCenterVo(block: () -> DataCenterVo?) { bDataCenterVo = block() ?: DataCenterVo() }
		private var bTemplateVo: TemplateVo = TemplateVo();fun templateVo(block: () -> TemplateVo?) { bTemplateVo = block() ?: TemplateVo() }
		private var bDiskIds: List<String> = listOf();fun diskIds(block: () -> List<String>?) { bDiskIds = block() ?: listOf() }
		private var bDiskImages: List<DiskImageVo> = listOf();fun diskImages(block: () -> List<DiskImageVo>?) { bDiskImages = block() ?: listOf() }
		private var bVnicProfileIds: List<String> = listOf();fun vnicProfileIds(block: () -> List<String>?) { bVnicProfileIds = block() ?: listOf() }
		private var bNics: List<NicVo> = listOf();fun nics(block: () -> List<NicVo>?) { bNics = block() ?: listOf() }
		private var bVmSystemVo: VmSystemVo = VmSystemVo();fun vmSystemVo(block: () -> VmSystemVo) { bVmSystemVo = block() ?: VmSystemVo() }
		private var bVmInitVo: VmInitVo = VmInitVo();fun vmInitVo(block: () -> VmInitVo) { bVmInitVo = block() ?: VmInitVo() }
		private var bVmHostVo: VmHostVo = VmHostVo();fun vmHostVo(block: () -> VmHostVo) { bVmHostVo = block() ?: VmHostVo() }
		private var bVmHaVo: VmHaVo = VmHaVo();fun vmHaVo(block: () -> VmHaVo) { bVmHaVo = block() ?: VmHaVo() }
		private var bVmResourceVo: VmResourceVo = VmResourceVo();fun vmResourceVo(block: () -> VmResourceVo) { bVmResourceVo = block() ?: VmResourceVo() }
		private var bVmBootVo: VmBootVo = VmBootVo();fun vmBootVo(block: () -> VmBootVo) { bVmBootVo = block() ?: VmBootVo() }
		private var bAffinityGroupVos: List<AffinityGroupVo> = listOf();fun affinityGroupVos(block: () -> List<AffinityGroupVo>?) { bAffinityGroupVos = block() ?: listOf() }
		private var bAffinityLabelVos: List<AffinityLabelVo> = listOf();fun affinityLabelVos(block: () -> List<AffinityLabelVo>?) { bAffinityLabelVos = block() ?: listOf() }
		fun build(): VmCreateVo = VmCreateVo(
			bId, bName, bDescription, bComment, bChipsetType, bOption, bIsStateless, bIsStartPaused, bIsDeleteProtected, */
/*bDisks,*//*
 bOs, bClusterVo, bDataCenterVo
			, bTemplateVo, bDiskIds, bDiskImages, bVnicProfileIds, bNics, bVmSystemVo, bVmInitVo, bVmHostVo, bVmHaVo, bVmResourceVo, bVmBootVo, bAffinityGroupVos, bAffinityLabelVos)
	}

	companion object {
		inline fun builder(block: VmCreateVo.Builder.() -> Unit): VmCreateVo = VmCreateVo.Builder().apply(block).build()
	}
}

// 편집창
fun Vm.toVmCreateVo(conn: Connection): VmCreateVo {
	val cluster: Cluster? = conn.findCluster(this@toVmCreateVo.cluster().id())
	val dataCenter: DataCenter? = cluster?.dataCenter()
	val vmNics: List<Nic> = conn.findAllNicsFromVm(this@toVmCreateVo.id())

	return VmCreateVo.builder {
		id { this@toVmCreateVo.id() }
		name { this@toVmCreateVo.name() }
		description { this@toVmCreateVo.description() }
		comment { this@toVmCreateVo.comment() }
		chipsetType { this@toVmCreateVo.bios().type().findBios() }
		option { this@toVmCreateVo.type().findVmType() }
		stateless { this@toVmCreateVo.stateless() } // 상태 비저장 (확실치 않음)
		startPaused { this@toVmCreateVo.startPaused() }
		deleteProtected { this@toVmCreateVo.deleteProtected() }
//		vDiskVos { diskAttachments.toVDiskVos(conn) }
//		diskImages { diskAttachments.toDiskAttachmentVos(conn) }
		os { Os.findByOsType(this@toVmCreateVo.os()) }
		clusterVo { cluster?.toClusterVo(conn) }
		dataCenterVo { dataCenter?.toDataCenterVo(conn) }
		templateVo { this@toVmCreateVo.template().toTemplateVo(conn) }
		nics { vmNics.toNicVosFromVm(conn, this@toVmCreateVo.id()) }
//		vNics { vmNics.toVnicProfileVos(conn) }
		vmSystemVo { this@toVmCreateVo.toVmSystemVo(conn) }
		vmInitVo { this@toVmCreateVo.toVmInitVo(conn) }
		vmHostVo { this@toVmCreateVo.toVmHostVo(conn) }
		vmHaVo { this@toVmCreateVo.toVmHaVo(conn) }
		vmResourceVo { this@toVmCreateVo.toVmResourceVo(conn) }
		vmBootVo { this@toVmCreateVo.toVmBootVo(conn) }
		affinityGroupVos { this@toVmCreateVo.toAffinityGroupVos(conn) }
		affinityLabelVos { this@toVmCreateVo.toAffinityLabelVos(conn) }
	}
}

fun VmCreateVo.toAddVmBuilder(conn: Connection): Vm {
	val vmBuilder: VmBuilder = VmBuilder()
	this.toVmInitBuilder(vmBuilder)
	this.toVmSystemBuilder(vmBuilder, conn)
	this.toVmInitBuilder(vmBuilder)
	this.toVmHostBuilder(vmBuilder)
	this.toVmResourceBuilder(vmBuilder)
	this.toVmHaBuilder(vmBuilder)
	this.toVmBootBuilder(vmBuilder)
	return vmBuilder.build()
}

fun VmCreateVo.toEditVmBuilder(conn: Connection): Vm {
	val vmBuilder: VmBuilder = VmBuilder()
	vmBuilder.id(this@toEditVmBuilder.id)
	this.toVmInitBuilder(vmBuilder)
	this.toVmSystemBuilder(vmBuilder, conn)
	this.toVmHostBuilder(vmBuilder)
	this.toVmResourceBuilder(vmBuilder)
	this.toVmHaBuilder(vmBuilder)
	this.toVmBootBuilder(vmBuilder)

	return vmBuilder.build()
}

*/
/**
 * 일반정보
 *//*

fun VmCreateVo.toVmInfoBuilder(vmBuilder: VmBuilder): VmBuilder {
	return vmBuilder
		.cluster(ClusterBuilder().id(this@toVmInfoBuilder.clusterId))
		.template(TemplateBuilder().id(this@toVmInfoBuilder.templateId))
		.bios(BiosBuilder().type(BiosType.valueOf(this@toVmInfoBuilder.chipsetType)))
		.type(VmType.valueOf(this@toVmInfoBuilder.option))
		.name(this@toVmInfoBuilder.name)
		.description(this@toVmInfoBuilder.description)
		.comment(this@toVmInfoBuilder.comment)
		.stateless(this@toVmInfoBuilder.stateless)
		.startPaused(this@toVmInfoBuilder.startPaused)
		.deleteProtected(this@toVmInfoBuilder.deleteProtected)
}

*/
/**
 * 시스템
 *//*

fun VmCreateVo.toVmSystemBuilder(vmBuilder: VmBuilder, conn: Connection): VmBuilder {
	val convertMb = BigInteger.valueOf(1024).pow(2)

	// 시스템-일반 하드웨어 클럭의 시간 오프셋
	vmBuilder.timeZone(TimeZoneBuilder().name(this@toVmSystemBuilder.vmSystemVo.timeOffset))

	// 인스턴스 타입이 지정되어 있다면
	if (this@toVmSystemBuilder.vmSystemVo.instanceType.isNotEmpty()) {
		val instance: InstanceType = conn.findAllInstanceTypes("name=${this@toVmSystemBuilder.vmSystemVo.instanceType}").first()
		vmBuilder.instanceType(instance)
	} else {    // 사용자 정의 값
		vmBuilder
			.memory(BigInteger.valueOf(this@toVmSystemBuilder.vmSystemVo.memorySize).multiply(convertMb))
			.memoryPolicy(
				MemoryPolicyBuilder()
					.max(BigInteger.valueOf(this@toVmSystemBuilder.vmSystemVo.memoryMax).multiply(convertMb))
					.ballooning(this@toVmSystemBuilder.vmResourceVo.isMemoryBalloon) // 리소스할당- 메모리 balloon 활성화
					.guaranteed(BigInteger.valueOf(this@toVmSystemBuilder.vmSystemVo.memoryActual).multiply(convertMb))
			)
			.cpu(
				CpuBuilder().topology(
					CpuTopologyBuilder()
						.cores(this@toVmSystemBuilder.vmSystemVo.vCpuSocketCore)
						.sockets(this@toVmSystemBuilder.vmSystemVo.vCpuSocket)
						.threads(this@toVmSystemBuilder.vmSystemVo.vCpuCoreThread)
				)
			)
	}
	return vmBuilder
}

*/
/**
 * 초기 실행
 *//*

fun VmCreateVo.toVmInitBuilder(vmBuilder: VmBuilder): VmBuilder {
	if (this@toVmInitBuilder.vmInitVo.isCloudInit) {
		vmBuilder.initialization(
			InitializationBuilder()
				.hostName(this@toVmInitBuilder.vmInitVo.hostName)
				.timezone(this@toVmInitBuilder.vmInitVo.timeStandard) // Asia/Seoul
				.customScript(this@toVmInitBuilder.vmInitVo.script)
		)
	}
	return vmBuilder
}

*/
/**
 * 호스트
 *//*

fun VmCreateVo.toVmHostBuilder(vmBuilder: VmBuilder): VmBuilder {
	val placementBuilder = VmPlacementPolicyBuilder()

	// 실행 호스트 - 특정 호스트(무조건 한개는 존재)
	// 기본이 클러스터 내 호스트라 지정 필요없음
	if (!this@toVmHostBuilder.vmHostVo.isHostInCluster) {
		placementBuilder.hosts(
			// 선택된 호스트 전부 넣기
			this@toVmHostBuilder.vmHostVo.hostIds.map { HostBuilder().id(it.id).build() }
		)
	}

	vmBuilder
		.placementPolicy(
			placementBuilder.affinity(VmAffinity.valueOf(this@toVmHostBuilder.vmHostVo.migrationMode))
		)
		.migration( // 정책은 찾을 수가 없음, parallel Migrations 안보임, 암호화
			MigrationOptionsBuilder().encrypted(this@toVmHostBuilder.vmHostVo.migrationEncrypt).build()
		)

	return vmBuilder
}

*/
/**
 * 리소스 할당
 *//*

fun VmCreateVo.toVmResourceBuilder(vmBuilder: VmBuilder): VmBuilder {
	return vmBuilder
		.cpuProfile(CpuProfileBuilder().id(this@toVmResourceBuilder.vmResourceVo.cpuProfileId))
		.cpuShares(this@toVmResourceBuilder.vmResourceVo.cpuShare)
		.autoPinningPolicy(if ("RESIZE_AND_PIN_NUMA" == this@toVmResourceBuilder.vmResourceVo.cpuPinningPolicy) AutoPinningPolicy.ADJUST else AutoPinningPolicy.DISABLED)
		.cpuPinningPolicy(CpuPinningPolicy.valueOf(this@toVmResourceBuilder.vmResourceVo.cpuPinningPolicy))
		.virtioScsiMultiQueuesEnabled(this@toVmResourceBuilder.vmResourceVo.multiQue) // VirtIO-SCSI 활성화
}

*/
/**
 * 고가용성
 *//*

fun VmCreateVo.toVmHaBuilder(vmBuilder: VmBuilder): VmBuilder {
	if (this@toVmHaBuilder.vmHaVo.isHa) {
		vmBuilder
			.lease(StorageDomainLeaseBuilder().storageDomain(StorageDomainBuilder().id(this@toVmHaBuilder.vmHaVo.vmStorageDomainId)))
	}
	vmBuilder
		.highAvailability(HighAvailabilityBuilder().enabled(this@toVmHaBuilder.vmHaVo.isHa).priority(this@toVmHaBuilder.vmHaVo.priority))

	return vmBuilder
}

*/
/**
 * 부트 옵션
 *//*

fun VmCreateVo.toVmBootBuilder(vmBuilder: VmBuilder): VmBuilder {
	val bootDeviceList: MutableList<BootDevice> = mutableListOf(
		BootDevice.valueOf(this@toVmBootBuilder.vmBootVo.firstDevice), // 첫번째 장치
	)

	if (this@toVmBootBuilder.vmBootVo.secDevice.isNotEmpty())
		bootDeviceList.add(BootDevice.valueOf(this@toVmBootBuilder.vmBootVo.secDevice)) // 두번째 장치

	vmBuilder
		.os(
			OperatingSystemBuilder()
				.type(this@toVmBootBuilder.osFullName) // 일반 - 운영시스템
				.boot(BootBuilder().devices(bootDeviceList))
		)
//		.bios(new BiosBuilder ().type(BiosType.valueOf(vmVo.getChipsetType())))  // 칩셋/펌웨어
//		.bootMenu(new BootMenuBuilder ().enabled(vmVo.getVmBootVo().isBootingMenu()))
	return vmBuilder
}
*/
