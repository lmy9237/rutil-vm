package com.itinfo.rutilvm.api.model.zJava
/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.ClusterVo
import com.itinfo.rutilvm.api.gson
import com.itinfo.rutlivm.api.util.ovirt.findAllOpenStackNetworkProviders
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.types.*
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger("com.itinfo.rutlivm.api.model.create.ClusterCreateVoKt")
*/

/**
 * [ClusterCreateVo]
 *
 * @param datacenterId
 * @param datacenterName
 *
 * @param id
 * @param name
 * @param description
 * @param comment
 *
 * @param networkId 관리 네트워크 id(데이터센터 네트워크 목록에서 선택)
 * @param networkName
 * @param cpuArc CPU 아키텍처
 * @param cpuType CPU 유형 cpu().type()
 * @param biosType 칩셋/펌웨어 유형
 *
 * @param fipsMode FIPS 모드
 * @param version 호환 버전
 * @param switchType 스위치 유형
// * @param firewallType 방화벽 유형
// * @param networkProvider 기본 네트워크 공급자 (예, 아니요?)
 * <link href="/ovirt-engine/api/openstacknetworkproviders/1dd7e19a-5b16-4a76-a53f-ec1f1476692f/testconnectivity" rel="testconnectivity"/>
 *
// * @param logMaxMemory 로그의 최대 메모리 한계
// * @param logMaxType ABSOLUTE_VALUE_IN_MB, PERCENTAGE
// * @param virtService virt 서비스 활성화
// * @param glusterService Gluster 서비스 활성화
 *
// * @param migrationPolicy 마이그레이션 정책
// * @param bandwidth 대역폭
 * @param recoveryPolicy 복구 정책    <error_handling> <on_error>migrate_highly_available</on_error> </error_handling>
 * @param encrypted 추가속성- 암호화 사용
// * @param parallel  Parallel Migrations
 *
 *//*


@Deprecated("안쓸예정")
class ClusterCreateVo (
    val datacenterId: String = "",
    val datacenterName: String = "",

    val id: String = "",
    val name: String = "",
    val description: String = "",
    val comment: String = "",

    val networkId: String = "",
    val networkName: String = "",
    val cpuArc: String = "",
    val cpuType: String = "",
    val biosType: String = "",

    val fipsMode: String = "",
    val version: String = "",
    val switchType: String = "",
    val firewallType: String = "",
    val networkProvider: Boolean = false,

    val logMaxMemory: Int = 0,
    val logMaxType: String = "",

    val virtService: Boolean = false,
    val glusterService: Boolean = false,

    // 마이그레이션
    val migrationPolicy: String = "", // MigrationPolicy 임시방편
    val bandwidth: MigrationBandwidthAssignmentMethod = MigrationBandwidthAssignmentMethod.AUTO,
    val recoveryPolicy: MigrateOnError = MigrateOnError.MIGRATE,
    val encrypted: InheritableBoolean = InheritableBoolean.INHERIT,
//    val parallel: MigrationOptions = "",

): Serializable{
    override fun toString(): String = gson.toJson(this)

    class Builder{
        private var bdatacenterId:  String = ""; fun datacenterId(block: () -> String?) { bdatacenterId = block() ?: ""}
        private var bdatacenterName:  String = ""; fun datacenterName(block: () -> String?) { bdatacenterName = block() ?: ""}
        private var bid:  String = ""; fun id(block: () -> String?) { bid = block() ?: ""}
        private var bname:  String = ""; fun name(block: () -> String?) { bname = block() ?: ""}
        private var bdescription:  String = ""; fun description(block: () -> String?) { bdescription = block() ?: ""}
        private var bcomment:  String = ""; fun comment(block: () -> String?) { bcomment = block() ?: ""}
        private var bnetworkId:  String = ""; fun networkId(block: () -> String?) { bnetworkId = block() ?: ""}
        private var bnetworkName:  String = ""; fun networkName(block: () -> String?) { bnetworkName = block() ?: ""}
        private var bcpuArc:  String = ""; fun cpuArc(block: () -> String?) { bcpuArc = block() ?: ""}
        private var bcpuType:  String = ""; fun cpuType(block: () -> String?) { bcpuType = block() ?: ""}
        private var bbiosType:  String = ""; fun biosType(block: () -> String?) { bbiosType = block() ?: ""}
        private var bfipsMode:  String = ""; fun fipsMode(block: () -> String?) { bfipsMode = block() ?: ""}
        private var bversion:  String = ""; fun version(block: () -> String?) { bversion = block() ?: ""}
        private var bswitchType:  String = ""; fun switchType(block: () -> String?) { bswitchType = block() ?: ""}
        private var bfirewallType:  String = ""; fun firewallType(block: () -> String?) { bfirewallType = block() ?: ""}
        private var bnetworkProvider:  Boolean = false; fun networkProvider(block: () -> Boolean?) { bnetworkProvider = block() ?: false}
        private var blogMaxMemory:  Int = 0; fun logMaxMemory(block: () -> Int?) { blogMaxMemory = block() ?: 0}
        private var blogMaxType:  String = ""; fun logMaxType(block: () -> String?) { blogMaxType = block() ?: ""}
        private var bvirtService:  Boolean = false; fun virtService(block: () -> Boolean?) { bvirtService = block() ?: false}
        private var bglusterService:  Boolean = false; fun glusterService(block: () -> Boolean?) { bglusterService = block() ?: false}
        private var bmigrationPolicy:  String = ""; fun migrationPolicy(block: () -> String?) { bmigrationPolicy = block() ?: ""}
        private var bbandwidth:  MigrationBandwidthAssignmentMethod = MigrationBandwidthAssignmentMethod.AUTO; fun bandwidth(block: () -> MigrationBandwidthAssignmentMethod?) { bbandwidth = block() ?: MigrationBandwidthAssignmentMethod.AUTO}
        private var brecoveryPolicy:  MigrateOnError = MigrateOnError.MIGRATE; fun recoveryPolicy(block: () -> MigrateOnError?) { brecoveryPolicy = block() ?: MigrateOnError.MIGRATE}
        private var bencrypted:  InheritableBoolean = InheritableBoolean.INHERIT; fun encrypted(block: () -> InheritableBoolean?) { bencrypted = block() ?: InheritableBoolean.INHERIT}

        fun build(): ClusterCreateVo = ClusterCreateVo(bdatacenterId,bdatacenterName, bid, bname, bdescription, bcomment, bnetworkId, bnetworkName, bcpuArc, bcpuType, bbiosType, bfipsMode, bversion, bswitchType, bfirewallType, bnetworkProvider, blogMaxMemory, blogMaxType, bvirtService, bglusterService, bmigrationPolicy, bbandwidth, brecoveryPolicy)
    }

    companion object{
        inline fun builder(block: ClusterCreateVo.Builder.() -> Unit): ClusterCreateVo = ClusterCreateVo.Builder().apply(block).build()
    }
}

fun Cluster?.toClusterCreateVo(clusterId: String = "", network: IdentifiedVo): ClusterCreateVo {
    requireNotNull(this) { "Cluster cannot be null" }

    return  ClusterCreateVo.builder {
        datacenterId { this@toClusterCreateVo.dataCenter().id() }
        datacenterName { this@toClusterCreateVo.dataCenter().name() }
        id { clusterId }
        name { this@toClusterCreateVo.name() }
        description { this@toClusterCreateVo.description() }
        comment { this@toClusterCreateVo.comment() }
        networkId { network.id }
        networkName { network.name }
        cpuArc { this@toClusterCreateVo.cpu().type() }
        cpuType { this@toClusterCreateVo.cpu().type() }
        biosType { this@toClusterCreateVo.biosType().toString() }
        fipsMode { this@toClusterCreateVo.fipsMode().toString() }
        version { this@toClusterCreateVo.version().fullVersion() }
        switchType { this@toClusterCreateVo.switchType().toString() }
        firewallType { this@toClusterCreateVo.firewallType().toString() }
        networkProvider { this@toClusterCreateVo.externalNetworkProvidersPresent() }
        logMaxMemory { this@toClusterCreateVo.logMaxMemoryUsedThresholdAsInteger() }
        logMaxType { this@toClusterCreateVo.logMaxMemoryUsedThresholdType().toString() }
        virtService { this@toClusterCreateVo.virtService() }
        glusterService { this@toClusterCreateVo.glusterService() }
        //    migrationPolicy { this@toClusterCreateVo.migration().} //마이그레이션 정책
        bandwidth { this@toClusterCreateVo.migration().bandwidth().assignmentMethod() }
        //    recoveryPolicy { this@toClusterCreateVo.}  // 암호화 정책
        encrypted { this@toClusterCreateVo.migration().encrypted() }
    }
}

fun ClusterCreateVo.toClusterBuilder(conn: Connection, add: Boolean = true): ClusterBuilder {
    val ver = this@toClusterBuilder.version.split("\\.".toRegex(), limit = 2).toTypedArray() // 버전값 분리
    val clusterBuilder = ClusterBuilder()

    clusterBuilder
        .dataCenter(DataCenterBuilder().id(this.datacenterId).build()) // 필수
        .id(this.id)
        .name(this.name) // 필수
        .cpu(CpuBuilder().architecture(Architecture.valueOf(this.cpuArc)).type(this.cpuType)) // 필수
        .description(this.description)
        .comment(this.comment)
        .managementNetwork(NetworkBuilder().id(this.networkId).build())
        .biosType(BiosType.valueOf(this.biosType))
        .fipsMode(FipsMode.valueOf(this.fipsMode))
        .version(VersionBuilder().major(Integer.parseInt(ver[0])).minor(Integer.parseInt(ver[1])).build()) // 호환 버전
        .switchType(SwitchType.valueOf(this.switchType))  // 편집에선 선택불가
        .firewallType(FirewallType.fromValue(this.firewallType))
        .logMaxMemoryUsedThreshold(this.logMaxMemory)
        .logMaxMemoryUsedThresholdType(LogMaxMemoryUsedThresholdType.valueOf(this.logMaxType))
        .virtService(this.virtService)
        .glusterService(this.glusterService)
        .errorHandling(ErrorHandlingBuilder().onError(this.recoveryPolicy)) // 복구정책
        // TODO: 마이그레이션 정책 관련 설정 값 조회 기능 존재여부 확인필요
        .migration(
            MigrationOptionsBuilder().bandwidth(MigrationBandwidthBuilder().assignmentMethod(this.bandwidth)) // 대역폭
                .encrypted(this.encrypted)  // 암호화
        )
        .fencingPolicy(
            FencingPolicyBuilder().skipIfConnectivityBroken(
                SkipIfConnectivityBrokenBuilder().enabled(
                    true
                )
            ).skipIfSdActive(SkipIfSdActiveBuilder().enabled(true))
        )

    if (this.networkProvider) {
        clusterBuilder.externalNetworkProviders(
            conn.findAllOpenStackNetworkProviders().firstOrNull()
        )
    }

    if (!add) { // 편집이라면
        clusterBuilder.id(this.id)
    }
    log.info("클러스터 빌더")
    return clusterBuilder
}
*/
