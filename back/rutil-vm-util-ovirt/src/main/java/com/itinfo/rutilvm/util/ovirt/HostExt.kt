package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*
import com.jcraft.jsch.ChannelExec
import com.jcraft.jsch.JSch
import org.ovirt.engine.sdk4.builders.HostNicBuilder
import java.net.InetAddress


fun Connection.srvHosts(): HostsService =
	this.systemService.hostsService()

fun Connection.srvHost(hostId: String): HostService =
	this.srvHosts().hostService(hostId)

fun Connection.findAllHosts(searchQuery: String = "", follow: String = ""): Result<List<Host>> = runCatching {
	this.srvHosts().list().allContent(true).apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.send().hosts()

}.onSuccess {
	Term.HOST.logSuccess("목록조회")
}.onFailure {
	Term.HOST.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findHost(hostId: String, follow: String = ""): Result<Host?> = runCatching {
	srvHost(hostId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.allContent(true).send().host()

}.onSuccess {
	Term.HOST.logSuccess("상세조회", hostId)
}.onFailure {
	Term.HOST.logFail("상세조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun List<Host>.nameDuplicateHost(hostName: String, hostId: String? = null): Boolean =
	this.filter { it.id() != hostId }.any { it.name() == hostName }

fun Connection.addHost(
	host: Host,
	deployHostedEngine: Boolean? = false,
): Result<Host?> = runCatching {
	if (this.findAllHosts().getOrDefault(emptyList())
			.nameDuplicateHost(host.name())) {
		throw ErrorPattern.HOST_DUPLICATE.toError()
	}

	log.info("배포작업: {}", deployHostedEngine)
	val hostAdded: Host? =
		srvHosts().add().deployHostedEngine(deployHostedEngine).reboot(true).activate(true).host(host).send().host()

	// 상태 up 될때까지 기다리기
//	this.expectHostStatus(hostAdded.id(), HostStatus.UP)

	hostAdded  ?: throw ErrorPattern.HOST_NOT_FOUND.toError()
}.onSuccess {
	Term.HOST.logSuccess("생성")
}.onFailure {
	log.error("호스트 생성 실패")
	Term.HOST.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateHost(host: Host): Result<Host?> = runCatching {
	if(this.findAllHosts().getOrDefault(emptyList())
			.nameDuplicateHost(host.name(), host.id())) {
		throw ErrorPattern.HOST_DUPLICATE.toError()
	}
	val hostUpdated: Host? =
		this.srvHost(host.id()).update().host(host).send().host()

	hostUpdated ?: throw ErrorPattern.HOST_NOT_FOUND.toError()
}.onSuccess {
	Term.HOST.logSuccess("편집", host.id())
}.onFailure {
	Term.HOST.logFail("편집", it, host.id())
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeHost(hostId: String): Result<Boolean> = runCatching {
	val host = checkHost(hostId)

	if(this.findAllVmsFromHost(hostId).getOrDefault(emptyList())
			.any { it.status() == VmStatus.UP }){
		log.error("가상머신이 돌아가고 있는게 있음")
		throw ErrorPattern.HOST_HAS_RUNNING_VMS.toError()
	}
	if (host.status() != HostStatus.MAINTENANCE) {
		log.warn("{} 삭제 실패... {} 가 유지관리 상태가 아님 ", Term.HOST.desc, hostId)
		throw throw ErrorPattern.HOST_NOT_MAINTENANCE.toError()
	}

	this.srvHost(hostId).remove().send()
	// if(!this.expectHostDeleted(hostId)){
	// 	throw Error("삭제 실패했습니다 ... ${hostId}.")
	// }

	true
}.onSuccess {
	Term.HOST.logSuccess("삭제", hostId)
}.onFailure {
	Term.HOST.logFail("삭제", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

@Throws(InterruptedException::class)
fun Connection.expectHostDeleted(hostId: String, timeout: Long = 60000L, interval: Long = 1000L): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val hosts: List<Host> =
			this.findAllHosts().getOrDefault(emptyList())
		val hostToRemove: Host? = hosts.firstOrNull() {it.id() == hostId}
		if (hostToRemove == null) {// !(매치되는것이 있다)
			Term.HOST.logSuccess("삭제")
			return true
		} else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("{} {} 삭제 시간 초과", Term.HOST.desc, hostToRemove.name())
			return false
		}
		log.debug("{} 삭제 진행중 ... ", Term.HOST.desc)
		Thread.sleep(interval)
	}
}


fun Connection.findAllVmsFromHost(hostId: String, searchQuery: String = "",follow: String = ""): Result<List<Vm>> = runCatching {
	checkHostExists(hostId)

	this.srvVms().list().apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.send().vms().filter { it.host()?.id() == hostId }

}.onSuccess {
	Term.HOST.logSuccess("vms 조회", hostId)
}.onFailure {
	Term.HOST.logFail("vms 조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.deactivateHost(hostId: String): Result<Boolean> = runCatching {
	val host = checkHost(hostId)

	if (host.status() == HostStatus.MAINTENANCE) {
		throw ErrorPattern.HOST_IS_MAINTENANCE.toError()
		// throw Error("deactivateHost 실패 ... $hostId 가 이미 유지관리 상태") // return 대신 throw
	}
	srvHost(host.id()).deactivate().send()

	// if (!this.expectHostStatus(host.id(), HostStatus.MAINTENANCE)) {
	// 	throw Error("expectHostStatus가 실패했습니다 ... $hostId 가 유지관리 상태가 아닙니다.")
	// }
	true
}.onSuccess {
	Term.HOST.logSuccess("비활성화", hostId)
}.onFailure {
	Term.HOST.logFail("비활성화", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.activateHost(hostId: String): Result<Boolean> = runCatching {
	val host = checkHost(hostId)
	if (host.status() == HostStatus.UP) {
		throw ErrorPattern.HOST_ACTIVE.toError()
		// return Result.failure(Error("activateHost 실패 ... ${host.name()}가 이미 활성 상태 "))
	}
	srvHost(host.id()).activate().send()

	// if (!this.expectHostStatus(host.id(), HostStatus.UP)) {
	// 	throw Error("activate Host 실패했습니다 ...")
	// }
	true
}.onSuccess {
	Term.HOST.logSuccess("활성화", hostId)
}.onFailure {
	Term.HOST.logFail("활성화", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.refreshHost(hostId: String): Result<Boolean> = runCatching {
	checkHostExists(hostId)
	this.srvHost(hostId).refresh().send()

	// if (!this.expectHostStatus(hostId, HostStatus.UP)) {
	// 	throw Error("refresh Host 실패했습니다 ...")
	// }
	true
}.onSuccess {
	Term.HOST.logSuccess("새로고침", hostId)
}.onFailure {
	Term.HOST.logFail("새로고침", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.commitNetConfigHost(hostId: String): Result<Boolean> = runCatching {
	checkHostExists(hostId)
	this.srvHost(hostId).commitNetConfig().send()

	// if (!this.expectHostStatus(hostId, HostStatus.UP)) {
	// 	throw Error("refresh Host 실패했습니다 ...")
	// }
	true
}.onSuccess {
	Term.HOST.logSuccess("재부팅 확인", hostId)
}.onFailure {
	Term.HOST.logFail("재부팅 확인", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.enrollCertificate(hostId: String): Result<Boolean> = runCatching {
	checkHostExists(hostId)
	this.srvHost(hostId).enrollCertificate().async(true).send()

	true

}.onSuccess {
	Term.HOST.logSuccess("인증서 등록", hostId)
}.onFailure {
	Term.HOST.logFail("인증서 등록", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.activeGlobalHaFromHost(hostId: String): Result<Boolean> = runCatching {
	val host: Host = checkHost(hostId)
	if (host.status() !== HostStatus.UP) {
		throw ErrorPattern.HOST_ACTIVE.toError()
		// return Result.failure(Error("activeGlobalHaFromHost 실패 ... ${host.name()}가 비활성화 된 상태"))
	}
	if (host.hostedEnginePresent() && host.hostedEngine().globalMaintenancePresent() && host.hostedEngine().globalMaintenance()) {
		throw ErrorPattern.HOST_IS_GLOBAL_HA.toError()
		// return Result.failure(Error("activeGlobalHaFromHost 실패 ... ${host.name()}가 이미 글로벌 HA 된 상태"))
	}
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.HOST,"글로벌 ha 활성화")
}.onFailure {
	Term.HOST.logFailWithin(Term.HOST,"글로벌 ha 활성화", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.deactiveGlobalHaFromHost(hostId: String): Result<Boolean> = runCatching {
	val host = checkHost(hostId)

	TODO("ssh 로 구현")
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.HOST,"글로벌 ha 비활성화")
}.onFailure {
	Term.HOST.logFailWithin(Term.HOST,"글로벌 ha 비활성화", it)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.findPowerManagementFromHost(hostId: String, fenceType: FenceType): Result<PowerManagement?> = runCatching {
	srvHost(hostId).fence().fenceType(fenceType.name).send().powerManagement()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.POWER_MANAGEMENT,"상세조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.POWER_MANAGEMENT,"상세조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.migrateHostFromVm(vmId: String, host: Host): Result<Boolean> = runCatching {
	this.srvVm(vmId).migrate().host(host).send()
	true

}.onSuccess {
	Term.VM.logSuccessWithin(Term.HOST,"이동", vmId)
}.onFailure {
	Term.VM.logFailWithin(Term.HOST,"이동", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

/**
 * [Connection.expectHostStatus]
 * 호스트 상태 체크하는 메소드
 *
 * @param hostId 호스트
 * @param expectStatus 원하는 호스트 상태
 * @param interval 상태 확인 간격(밀리초)
 * @param timeout 최대 대기 시간(밀리초)
 * @throws InterruptedException
 */
@Throws(InterruptedException::class)
fun Connection.expectHostStatus(hostId: String, expectStatus: HostStatus, interval: Long = 3000L, timeout: Long = 900000L): Boolean {
	val startTime: Long = System.currentTimeMillis()
	while (true) {
		val currentHost: Host? = this@expectHostStatus.findHost(hostId).getOrNull()
		val status = currentHost?.status()
		if (status == expectStatus) {
			log.info("호스트 완료 ... {}", expectStatus)
			return true
		} else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("호스트 시간 초과: {}", currentHost?.name());
			return false
		}

		log.info("호스트 상태: {} -> expect '{}'", status, expectStatus)
		Thread.sleep(interval)
	}
}

private fun Connection.srvAllHostNicsFromHost(hostId: String): HostNicsService =
	this.srvHost(hostId).nicsService()

fun Connection.findAllHostNicsFromHost(hostId: String, follow: String = ""): Result<List<HostNic>> = runCatching {
	this.srvAllHostNicsFromHost(hostId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().nics()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.HOST_NIC,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.HOST_NIC,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvHostNicFromHost(hostId: String, hostNicId: String): HostNicService =
	this.srvAllHostNicsFromHost(hostId).nicService(hostNicId)

fun Connection.findNicFromHost(hostId: String, hostNicId: String, follow: String = ""): Result<HostNic?> = runCatching {
	this.srvHostNicFromHost(hostId, hostNicId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().nic()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.HOST_NIC,"상세조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.HOST_NIC,"상세조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllStatisticsFromHostNic(hostId: String, hostNicId: String): Result<List<Statistic>> = runCatching {
	this.srvHostNicFromHost(hostId, hostNicId).statisticsService().list().send().statistics()
}.onSuccess {
	Term.HOST_NIC.logSuccessWithin(Term.STATISTIC,"목록조회", hostId)
}.onFailure {
	Term.HOST_NIC.logFailWithin(Term.STATISTIC,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvStatisticsFromHost(hostId: String): StatisticsService =
	this.srvHost(hostId).statisticsService()

fun Connection.findAllStatisticsFromHost(hostId: String): Result<List<Statistic>> = runCatching {
	checkHostExists(hostId)

	this.srvStatisticsFromHost(hostId).list().send().statistics()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STATISTIC,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STATISTIC,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.srvHostStoragesFromHost(hostId: String): HostStorageService =
	this.srvHost(hostId).storageService()

fun Connection.findAllHostStoragesFromHost(hostId: String): Result<List<HostStorage>> = runCatching {
	checkHostExists(hostId)

	this.srvHostStoragesFromHost(hostId).list().send().storages()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.discoverIscsiFromHost(hostId: String, iscsiDetails: IscsiDetails): Result<List<IscsiDetails>> = runCatching {
	checkHostExists(hostId)

	this.srvHost(hostId).discoverIscsi().iscsi(iscsiDetails).send().discoveredTargets()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.unRegisteredStorageDomainsFromHost(hostId: String): Result<List<StorageDomain>> = runCatching {
	checkHostExists(hostId)

	this.srvHost(hostId).unregisteredStorageDomainsDiscover().send().storageDomains()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.loginIscsiFromHost(hostId: String, iscsiDetails: IscsiDetails): Result<List<String>> = runCatching {
	checkHostExists(hostId)

	//TODO: 로그인 후 값 받아오는 처리
	this.srvHost(hostId).iscsiLogin().iscsi(iscsiDetails).send()

	this.srvHost(hostId).iscsiDiscover().send().iscsiTargets()
	// this.srvHost(hostId).discoverIscsi().send().discoveredTargets()

	// true

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"iscsi 로그인 성공", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"iscsi 로그인 실패", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNetworkAttachmentsFromHost(hostId: String): NetworkAttachmentsService =
	this.srvHost(hostId).networkAttachmentsService()

fun Connection.findAllNetworkAttachmentsFromHost(hostId: String, follow: String = ""): Result<List<NetworkAttachment>> = runCatching {
	checkHostExists(hostId)
	this.srvNetworkAttachmentsFromHost(hostId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().attachments()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String): NetworkAttachmentService =
	this.srvNetworkAttachmentsFromHost(hostId).attachmentService(networkAttachmentId)

fun Connection.findNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String, follow: String = ""): Result<NetworkAttachment> = runCatching {
	checkHostExists(hostId)
	this.srvNetworkAttachmentFromHost(hostId, networkAttachmentId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().attachment()

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT,"조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT,"조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

// fun Connection.modifyNetworkAttachmentFromHost(hostId: String, networkAttachment: NetworkAttachment): Result<Boolean> = runCatching {
// 	this.srvHost(hostId).setupNetworks().modifiedNetworkAttachments(networkAttachment).send()
// 	this.srvHost(hostId).commitNetConfig().send()
// 	true
// }.onSuccess {
// 	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "편집", hostId)
// }.onFailure {
// 	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "편집", it, hostId)
// 	throw if (it is Error) it.toItCloudException() else it
// }

fun Connection.modifyNetworkAttachmentsFromHost(hostId: String, networkAttachments: List<NetworkAttachment>): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().modifiedNetworkAttachments(networkAttachments).send()
	this.srvHost(hostId).commitNetConfig().send()

	true

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "일괄편집", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "일괄편집", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String, networkAttachment: NetworkAttachment): Result<Boolean> = runCatching {
	this.srvNetworkAttachmentFromHost(hostId, networkAttachmentId).update().attachment(networkAttachment).send()
	this.srvHost(hostId).commitNetConfig().send()

	true

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "편집", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "편집", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String): Result<Boolean> = runCatching {
	this.srvNetworkAttachmentFromHost(hostId, networkAttachmentId).remove().send()
	this.srvHost(hostId).commitNetConfig().send()

	true

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "제거", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "제거", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeNetworkAttachmentFromHost(hostId: String, networkAttachment: NetworkAttachment): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().removedNetworkAttachments(networkAttachment).send()
	this.srvHost(hostId).commitNetConfig().send()

	true

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "제거", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "제거", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeNetworkAttachmentsFromHost(
	hostId: String,
	networkAttachments: List<NetworkAttachment> = listOf()
): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().removedNetworkAttachments(networkAttachments).send()
	this.srvHost(hostId).commitNetConfig().send()

	true

}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "제거", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "제거", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addBondFromHost(hostId: String, hostNic: HostNic): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().modifiedBonds(hostNic).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.BOND, "생성", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.BOND, "생성", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.modifiedBondFromHost(hostId: String, hostNic: HostNic): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().modifiedBonds(hostNic).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.BOND, "수정", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.BOND, "수정", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeBondFromHost(hostId: String, hostNic: HostNic): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().removedBonds(hostNic).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.BOND, "제거", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.BOND, "제거", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.setupNetworksFromHost(
	hostId: String,
	hostNics: List<HostNic> = listOf(),
	networkAttachments: List<NetworkAttachment> = listOf()
): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().apply {
		if (networkAttachments.isNotEmpty()) modifiedBonds(hostNics)
		if (hostNics.isNotEmpty()) modifiedNetworkAttachments(networkAttachments)
	}.send()

	this.srvHost(hostId).commitNetConfig().send()
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.BOND, "호스트 네트워크 설정", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.BOND, "호스트 네트워크 설정", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvFenceAgentsFromHost(hostId: String): FenceAgentsService =
	this.srvHost(hostId).fenceAgentsService()

fun Connection.findAllFenceAgentsFromHost(hostId: String): Result<List<Agent>> = runCatching {
	this.srvFenceAgentsFromHost(hostId).list().send().agents()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.FENCE_AGENT, "목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.FENCE_AGENT, "목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addFenceAgent(hostId: String, agent: Agent): Result<Agent?> = runCatching {
	this.srvFenceAgentsFromHost(hostId).add().agent(agent).send().agent()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.FENCE_AGENT, "생성", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.FENCE_AGENT, "생성", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvAllIscsiDetailsFromHost(hostId: String): HostService.IscsiDiscoverRequest =
	this.srvHost(hostId).iscsiDiscover()

fun Connection.findAllIscsiTargetsFromHost(hostId: String, iscsiDetails: IscsiDetails): Result<List<String>> = runCatching {
	this.srvAllIscsiDetailsFromHost(hostId).iscsi(iscsiDetails).send().iscsiTargets()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.ISCSI_DETAIL, "목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.ISCSI_DETAIL, "목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllCpuUnitFromHost(hostId: String): Result<List<HostCpuUnit>> = runCatching {
	this.srvHost(hostId).cpuUnitsService().list().send().cpuUnits()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.HOST_CPU_UNIT, "목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.HOST_CPU_UNIT, "목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findAllHostDeviceFromHost(hostId: String): Result<List<HostDevice>> = runCatching {
	checkHostExists(hostId)

	this.srvHost(hostId).devicesService().list().send().devices()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.HOST_DEVICES, "목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.HOST_DEVICES, "목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

// fun Connection.findAllPermissionFromHost(hostId: String): Result<List<Permission>> = runCatching {
// 	checkHostExists(hostId)
//
// 	this.srvHost(hostId).permissionsService().list().send().permissions()
// }.onSuccess {
// 	Term.HOST.logSuccessWithin(Term.PERMISSION, "목록조회", hostId)
// }.onFailure {
// 	Term.HOST.logFailWithin(Term.PERMISSION, "목록조회", it, hostId)
// 	throw if (it is Error) it.toItCloudException() else it
// }
