package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*
import com.jcraft.jsch.ChannelExec
import com.jcraft.jsch.JSch
import java.net.InetAddress


fun Connection.srvHosts(): HostsService =
	this.systemService.hostsService()

fun Connection.srvHost(hostId: String): HostService =
	this.srvHosts().hostService(hostId)

// https://192.168.0.70/ovirt-engine/api/hosts?all_content=true
fun Connection.findAllHosts(searchQuery: String = "", follow: String = ""): Result<List<Host>> = runCatching {
	this.srvHosts().list().allContent(true).apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.send().hosts()

	// if (searchQuery.isNotEmpty() && follow.isNotEmpty())
	// 	this.srvHosts().list().search(searchQuery).follow(follow).caseSensitive(false).send().hosts()
	// else if (searchQuery.isNotEmpty())
	// 	this.srvHosts().list().search(searchQuery).caseSensitive(false).send().hosts()
	// else if (follow.isNotEmpty())
	// 	this.srvHosts().list().follow(follow).caseSensitive(false).send().hosts()
	// else
	// 	this.srvHosts().list().allContent(true).send().hosts()
}.onSuccess {
	Term.HOST.logSuccess("목록조회")
}.onFailure {
	Term.HOST.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.findHost(hostId: String): Result<Host?> = runCatching {
	srvHost(hostId).get().allContent(true).send().host()
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
	// name: String,
	// password: String
): Result<Host?> = runCatching {
	if (this.findAllHosts()
			.getOrDefault(listOf())
			.nameDuplicateHost(host.name())) {
		return FailureType.DUPLICATE.toResult(Term.HOST.desc)
	}
	/*
		val address: InetAddress = InetAddress.getByName(host.address())
		log.info("Resolved address: {}", address)
		if (address.makeUserHostViaSSH(host.rootPassword(), 22, name, password).isFailure) {
			log.info("계정생성 실패")
			return Result.failure(Error("계정생성 실패"))
		}
	*/
	// reboot, activate = 바로 활성화
	log.info("배포작업: {}", deployHostedEngine)
	val hostAdded: Host =
		srvHosts().add().deployHostedEngine(deployHostedEngine).reboot(true).activate(true).host(host).send().host()

	// 상태 up 될때까지 기다리기
//	this.expectHostStatus(hostAdded.id(), HostStatus.UP)

	log.info("Host 생성 끝")
	hostAdded
}.onSuccess {
	Term.HOST.logSuccess("생성")
}.onFailure {
	log.error("호스트 생성 실패")
	Term.HOST.logFail("생성", it)
	log.error("왜냐고")
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateHost(host: Host): Result<Host?> = runCatching {
	if(this.findAllHosts()
			.getOrDefault(listOf())
			.nameDuplicateHost(host.name(), host.id())) {
		return FailureType.DUPLICATE.toResult(Term.HOST.desc)
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

	if(this.findAllVmsFromHost("", hostId)
			.getOrDefault(listOf())
			.any { it.status() == VmStatus.UP }){
		log.error("가상머신이 돌아가고 있는게 있음")
		throw ErrorPattern.HOST_HAS_RUNNING_VMS.toError()
	}
	if (host.status() != HostStatus.MAINTENANCE) {
		log.warn("{} 삭제 실패... {} 가 유지관리 상태가 아님 ", Term.HOST.desc, hostId)
		throw throw ErrorPattern.HOST_NOT_MAINTENANCE.toError()
	}

	this.srvHost(hostId).remove().send()
	if(!this.expectHostDeleted(hostId)){
		throw Error("삭제 실패했습니다 ... ${hostId}.")
	}
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
			this.findAllHosts().getOrDefault(listOf())
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


fun Connection.findAllVmsFromHost(hostId: String, searchQuery: String = ""): Result<List<Vm>> = runCatching {
	checkHostExists(hostId)

	this.srvVms().list().apply {
		if(searchQuery.isNotEmpty()) search(searchQuery)
	}.send().vms().filter { it.host()?.id() == hostId }

	// if (searchQuery.isNotEmpty())
	// 	this.srvVms().list().search(searchQuery).send().vms().filter { it.host()?.id() == hostId }
	// else
	// 	this.srvVms().list().send().vms().filter { it.host()?.id() == hostId }
}.onSuccess {
	Term.HOST.logSuccess("vms 조회", hostId)
}.onFailure {
	Term.HOST.logFail("vms 조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.deactivateHost(hostId: String): Result<Boolean> = runCatching {
	val host = checkHost(hostId)

	if (host.status() == HostStatus.MAINTENANCE) {
		throw Error("deactivateHost 실패 ... $hostId 가 이미 유지관리 상태") // return 대신 throw
	}
	srvHost(host.id()).deactivate().send()

	if (!this.expectHostStatus(host.id(), HostStatus.MAINTENANCE)) {
		throw Error("expectHostStatus가 실패했습니다 ... $hostId 가 유지관리 상태가 아닙니다.")
	}
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
		return Result.failure(Error("activateHost 실패 ... ${host.name()}가 이미 활성 상태 "))
	}
	srvHost(host.id()).activate().send()

	if (!this.expectHostStatus(host.id(), HostStatus.UP)) {
		throw Error("activate Host 실패했습니다 ...")
	}
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

	if (!this.expectHostStatus(hostId, HostStatus.UP)) {
		throw Error("refresh Host 실패했습니다 ...")
	}
	true
}.onSuccess {
	Term.HOST.logSuccess("새로고침", hostId)
}.onFailure {
	Term.HOST.logFail("새로고침", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.restartHost(hostId: String, hostName: String, hostPw: String): Result<Boolean> = runCatching {
	val host = checkHost(hostId)

	val address: InetAddress = InetAddress.getByName(host.address())
	if (address.rebootHostViaSSH(hostName, hostPw, 22).isFailure)
		return Result.failure(Error("SSH를 통한 호스트 재부팅 실패"))

	if (!this.expectHostStatus(hostId, HostStatus.UP)) {
		throw Error("호스트 재부팅 실패했습니다 ...")
	}
	true
}.onSuccess {
	Term.HOST.logSuccess("재부팅", hostId)
}.onFailure {
	Term.HOST.logFail("재부팅", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

/**
 * [makeUserHostViaSSH]
 * host 생성할때 같이 실행되며 재시작만을 위한 계정생성
 * @param password [String] root 비밀번호
 * @param port [Int]  포트번호
 * @param userName [String] 재시작 계정 아이디 (application.properties, host.rutil.id)
 * @param userPw [String] 재시작 계정 비밀번호 (application.properties, host.rutil.password)
 *
 */
fun InetAddress.makeUserHostViaSSH(password: String, port: Int, userName: String, userPw: String): Result<Boolean> = runCatching {
	log.info("SSH 시작 + 계정 생성 및 sudo 권한 부여")
	val session: com.jcraft.jsch.Session = JSch().getSession("root", this.hostAddress, port)
	session.setPassword(password)
	session.setConfig("StrictHostKeyChecking", "no")
	session.connect()


	val channel: ChannelExec = session.openChannel("exec") as ChannelExec // SSH 채널 열기

	// 1. 사용자 계정 생성
	channel.setCommand("useradd $userName && echo \"$userPw\" | /usr/bin/passwd --stdin $userName")
	channel.connect()
	Thread.sleep(300)

	channel.setCommand("echo \"$userName ALL=(ALL)   NOPASSWD: /usr/sbin/reboot\" | tee -a /etc/sudoers")
	channel.connect()
	Thread.sleep(300)

//	channel.setCommand("sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config")
//	channel.connect()
//	Thread.sleep(300)

	channel.disconnect()
	session.disconnect()

	log.info("계정 생성 및 sudo 권한 부여 성공: {}", userName)
	true
}.onSuccess {
	log.info("계정 생성 성공 여부: $it")
}.onFailure {
	log.error(it.localizedMessage, it)
	throw if (it is Error) it.toItCloudException() else it
}


/**
 * [InetAddress.rebootHostViaSSH]
 * host SSH 관리 - 재시작 부분
 * @param hostName [String] 생성한 계정
 * @param hostPw [String] 생성한 계정
 * @param port [Int]
 */
fun InetAddress.rebootHostViaSSH(hostName: String, hostPw: String, port: Int): Result<Boolean> = runCatching {
	log.info("SSH 시작: hostName={}, hostPw={}, hostAddress={}, port={}", hostName, hostPw, this.hostAddress, port)

	val session: com.jcraft.jsch.Session = JSch().getSession(hostName, this.hostAddress, port)
	session.setPassword(hostPw)

	// 보안 경고 무시 설정
	session.setConfig("StrictHostKeyChecking", "no")
	session.setConfig("PreferredAuthentications", "password")

	log.info("SSH 세션 연결 시도")
	session.connect()
	log.info("SSH 세션 연결 성공 {}", this.hostAddress)

	val channel: ChannelExec = session.openChannel("exec") as ChannelExec
	log.info("---------------------5")
	channel.setCommand("sudo -S reboot")
	channel.setCommand(hostPw)
	log.info("---------------------6")
	channel.connect()

	val startTime = System.currentTimeMillis()
	while (!channel.isClosed && System.currentTimeMillis() - startTime < 30000) {
		Thread.sleep(100)
	}

	val exitStatus = channel.exitStatus
	channel.disconnect()
	session.disconnect()

	if (exitStatus != 0) {
		throw Error("명령 실행 실패: exitStatus=$exitStatus")
	}

	log.info("재부팅 명령 성공")
	true
}.onSuccess {
	log.info("SSH 재부팅 성공 여부: {}", it)
}.onFailure {
	log.error("SSH 재부팅 실패: {}", it.localizedMessage)
	throw if (it is Error) it.toItCloudException() else it
}


//fun InetAddress.rebootHostViaSSH(hostName: String, hostPw: String, port: Int): Result<Boolean> = runCatching {
//	log.info("ssh 시작")
//	log.info("hostName: {}, hostAddress: {}, post: {}, {}", hostName, this@rebootHostViaSSH.hostAddress, port, hostPw)
//
//	val session: com.jcraft.jsch.Session = JSch().getSession(hostName, this.hostAddress, port)
//	session.setPassword(hostPw)
//	session.setConfig("StrictHostKeyChecking", "no") // 호스트 키 확인을 건너뛰기 위해 설정
//	session.connect()
//
//	val channel: ChannelExec = session.openChannel("exec") as ChannelExec // SSH 채널 열기
//	Thread.sleep(300)
//	channel.setCommand("sudo reboot") // 재부팅 명령 실행
//	channel.setCommand(hostPw) // 재부팅 명령 실행
//	channel.connect()
//
//	// 명령 실행 완료 대기
//	while (!channel.isClosed) {
//		Thread.sleep(100)
//	}
//
//	channel.disconnect()
//	session.disconnect()
//	val exitStatus = channel.exitStatus
//	log.info("rebootHostViaSSH")
//	return Result.success(exitStatus == 0)
//}.onSuccess {
//	log.info("재부팅 성공")
//}.onFailure {
//	log.error(it.localizedMessage)
//	throw if (it is Error) it.toItCloudException() else it
//}

fun Connection.enrollCertificate(hostId: String): Result<Boolean> = runCatching {
	checkHostExists(hostId)

	this.srvHost(hostId).enrollCertificate().send()
	true
}.onSuccess {
	Term.HOST.logSuccess("인증서 등록", hostId)
}.onFailure {
	Term.HOST.logFail("인증서 등록", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.activeGlobalHaFromHost(hostId: String): Result<Boolean> = runCatching {
	val host = checkHost(hostId)

	// host 주소
	// val address: InetAddress = InetAddress.getByName(host.address())
	TODO("ssh 로 구현")
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

fun Connection.findAllHostNicsFromHost(hostId: String): Result<List<HostNic>> = runCatching {
	checkHostExists(hostId)

	this.srvAllHostNicsFromHost(hostId).list().send().nics()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.HOST_NIC,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.HOST_NIC,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvHostNicFromHost(hostId: String, hostNicId: String): HostNicService =
	this.srvAllHostNicsFromHost(hostId).nicService(hostNicId)

fun Connection.findNicFromHost(hostId: String, hostNicId: String): Result<HostNic?> = runCatching {
	this.srvHostNicFromHost(hostId, hostNicId).get().send().nic()
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
	this.srvHostStoragesFromHost(hostId).list().send().storages()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.discoverIscsiFromHost(hostId: String, iscsiDetails: IscsiDetails): Result<List<IscsiDetails>> = runCatching {
	this.srvHost(hostId).discoverIscsi().iscsi(iscsiDetails).send().discoveredTargets()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.unRegisteredStorageDomainsFromHost(hostId: String): Result<List<StorageDomain>> = runCatching {
	this.srvHost(hostId).unregisteredStorageDomainsDiscover().send().storageDomains()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.loginIscsiFromHost(hostId: String, iscsiDetails: IscsiDetails): Result<Boolean> = runCatching {
	checkHostExists(hostId)

	this.srvHost(hostId).iscsiLogin().iscsi(iscsiDetails).send()
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.STORAGE,"iscsi 로그인 성공", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.STORAGE,"iscsi 로그인 실패", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNetworkAttachmentsFromHost(hostId: String): NetworkAttachmentsService =
	this.srvHost(hostId).networkAttachmentsService()

fun Connection.findAllNetworkAttachmentsFromHost(hostId: String): Result<List<NetworkAttachment>> = runCatching {
	this.srvNetworkAttachmentsFromHost(hostId).list().send().attachments()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT,"목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT,"목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNetworkAttachmentFromHost(hostId: String, networkAttachmentId: String): NetworkAttachmentService =
	this.srvNetworkAttachmentsFromHost(hostId).attachmentService(networkAttachmentId)

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

fun Connection.modifyNetworkAttachmentFromHost(hostId: String, networkAttachment: NetworkAttachment): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().modifiedNetworkAttachments(networkAttachment).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "편집", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "편집", it, hostId)
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

fun Connection.removeNetworkAttachmentsFromHost(hostId: String, networkAttachments: List<NetworkAttachment>): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().removedNetworkAttachments(networkAttachments).send()
	this.srvHost(hostId).commitNetConfig().send()
	true
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.NETWORK_ATTACHMENT, "제거", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.NETWORK_ATTACHMENT, "제거", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeBondsFromHost(hostId: String, hostNics: List<HostNic> = listOf()): Result<Boolean> = runCatching {
	this.srvHost(hostId).setupNetworks().removedBonds(hostNics).send()
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
		if (networkAttachments.isEmpty())modifiedBonds(hostNics)
		if (hostNics.isEmpty()) modifiedNetworkAttachments(networkAttachments)
	}.send()

	// if (hostNics.isEmpty())
	// 	this.srvHost(hostId).setupNetworks().modifiedNetworkAttachments(networkAttachments).send()
	// else if (networkAttachments.isEmpty())
	// 	this.srvHost(hostId).setupNetworks().modifiedBonds(hostNics).send()
	// else
	// 	this.srvHost(hostId).setupNetworks().modifiedBonds(hostNics).modifiedNetworkAttachments(networkAttachments).send()

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

fun Connection.findAllPermissionFromHost(hostId: String): Result<List<Permission>> = runCatching {
	checkHostExists(hostId)

	this.srvHost(hostId).permissionsService().list().send().permissions()
}.onSuccess {
	Term.HOST.logSuccessWithin(Term.PERMISSION, "목록조회", hostId)
}.onFailure {
	Term.HOST.logFailWithin(Term.PERMISSION, "목록조회", it, hostId)
	throw if (it is Error) it.toItCloudException() else it
}
