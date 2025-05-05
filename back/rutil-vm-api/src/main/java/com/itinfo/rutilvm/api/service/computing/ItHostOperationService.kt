package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.api.configuration.CertConfig
import com.itinfo.rutilvm.api.configuration.PropertiesConfig
import com.itinfo.rutilvm.api.model.cert.toRemoteConnMgmt
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ssh.model.RemoteConnMgmt
import com.itinfo.rutilvm.util.ssh.model.enableGlobalHA
import com.itinfo.rutilvm.util.ssh.model.rebootSystem

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.HostStatus
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.net.UnknownHostException

interface ItHostOperationService {
    /**
     * [ItHostOperationService.deactivate]
     * 호스트 관리 - 유지보수
     *
     * @param hostId [String] 호스트 아이디
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun deactivate(hostId: String): Boolean
    /**
     * [ItHostOperationService.activate]
     * 호스트 관리 - 활성
     *
     * @param hostId [String] 호스트 아이디
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun activate(hostId: String): Boolean
    /**
     * [ItHostOperationService.restart]
     * 호스트 ssh 관리 - 재시작
     *
     * @param hostId [String] 호스트 아이디
     * @return [Boolean]
     */
    @Throws(
        UnknownHostException::class,
        Error::class
    )
    fun restart(hostId: String): Boolean
    /**
     * [ItHostOperationService.enrollCertificate]
     * 설치 - 인증서 등록
     *
     * @param hostId [String] 호스트 아이디
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun enrollCertificate(hostId: String): Boolean
    /**
     * [ItHostOperationService.globalHaActivate]
     * 글로벌 HA 유지관리를 활성화
     *
     * @param hostId [String] 호스트 아이디
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun globalHaActivate(hostId: String): Boolean
    /**
     * [ItHostOperationService.globalHaDeactivate]
     * 글로벌 HA 유지관리를 비활성화
     *
     * @param hostId [String] 호스트 아이디
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun globalHaDeactivate(hostId: String): Boolean
	/**
	 * [ItHostOperationService.refresh]
	 * 호스트 관리 - 새로고침
	 *
	 * @param hostId [String] 호스트 아이디
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun refresh(hostId: String): Boolean

	/**
	 * [ItHostOperationService.commitNetConfig]
	 * 호스트 재부팅 확인
	 *
	 * @param hostId [String] 호스트 아이디
	 * @return [Boolean]
	 */
	@Throws(Error::class)
	fun commitNetConfig(hostId: String): Boolean
}

@Service
class HostOperationServiceImpl(

): BaseService(), ItHostOperationService {
    // @Autowired private lateinit var propConfig: PropertiesConfig
	@Autowired private lateinit var iHost: ItHostService
	@Autowired private lateinit var certConfig: CertConfig

    @Throws(Error::class)
    override fun deactivate(hostId: String): Boolean {
        log.info("deactivate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.deactivateHost(hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun activate(hostId: String): Boolean {
        log.info("activate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.activateHost(hostId)
        return res.isSuccess
    }

    @Throws(UnknownHostException::class, Error::class)
    override fun restart(hostId: String): Boolean {
        log.info("reStart ... hostId: {}", hostId)
		val resHost2Reboot: HostVo? = iHost.findOne(hostId)
		val remoteConnMgmt: RemoteConnMgmt? = resHost2Reboot?.toRemoteConnMgmt(certConfig.ovirtSSHPrvKey)
        val res: Result<Boolean>? = remoteConnMgmt?.rebootSystem()
        return res?.isSuccess == true
    }

    @Throws(Error::class)
    override fun enrollCertificate(hostId: String): Boolean {
        log.info("enrollCertificate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.enrollCertificate(hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun globalHaActivate(hostId: String): Boolean {
        log.info("globalHaActivate ... hostId: {}", hostId)
		val resHost2EnableGobalHA: HostVo? = iHost.findOne(hostId)
		if (resHost2EnableGobalHA?.status !== HostStatus.UP) {
			return false
			// throw Result.failure(Error("resHost2EnableGobalHA 실패 ... ${resHost2EnableGobalHA.name()}가 비활성화 된 상태"))
		}
		val remoteConnMgmt: RemoteConnMgmt = resHost2EnableGobalHA.toRemoteConnMgmt(certConfig.ovirtSSHPrvKey)
		val res: Result<Boolean> = remoteConnMgmt.enableGlobalHA()
		return res.isSuccess
    }

    @Throws(Error::class)
    override fun globalHaDeactivate(hostId: String): Boolean {
        log.info("globalHaDeactivate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.deactiveGlobalHaFromHost(hostId)
        return res.isSuccess
    }

	@Throws(Error::class)
	override fun refresh(hostId: String): Boolean {
		log.info("refresh ... hostId: {}", hostId)
		val res: Result<Boolean> = conn.refreshHost(hostId)
		return res.isSuccess
	}

	@Throws(Error::class)
	override fun commitNetConfig(hostId: String): Boolean {
		log.info("commitNetConfig ... hostId: {}", hostId)
		val res: Result<Boolean> = conn.commitNetConfigHost(hostId)
		return res.isSuccess
	}

	companion object {
        private val log by LoggerDelegate()
    }
}
