package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.auth.RutilProperties
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.Host
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
     * [ItHostOperationService.deactivateMultiple]
     * 호스트 관리 - 다중 유지보수
     *
     * @param hostIds List<[String]> 호스트 아이디
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun deactivateMultiple(hostIds: List<String>): Map<String, String>
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
     * [ItHostOperationService.activateMultiple]
     * 호스트 관리 - 다중 활성
     *
     * @param hostIds List<[String]> 호스트 아이디
     * @return Map<[String], [String]>
     */
    @Throws(Error::class)
    fun activateMultiple(hostIds: List<String>): Map<String, String>
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
     * [ItHostOperationService.activateMultiple]
     * 호스트 관리 - 다중 재시작
     *
     * @param hostIds List<[String]> 호스트 아이디
     * @return Map<[String], [String]>
     */
//    @Throws(Error::class)
//    fun restartMultiple(hostIds: List<String>): Map<String, String>

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
    @Deprecated("사용안함")
    @Throws(Error::class)
    fun refresh(hostId: String): Boolean
}

@Service
class HostOperationServiceImpl(

): BaseService(), ItHostOperationService {
    @Autowired private lateinit var rutil: RutilProperties

    @Throws(Error::class)
    override fun deactivate(hostId: String): Boolean {
        log.info("deactivate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.deactivateHost(hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun deactivateMultiple(hostIds: List<String>): Map<String, String> {
        val result = mutableMapOf<String, String>() // 성공/실패 결과를 저장할 Map

        hostIds.forEach { hostId ->
            val hostName: String = conn.findHost(hostId).getOrNull()?.name().toString()
            try {
                log.info("deactivateMultiple ... hostId: {}", hostId)
                val isSuccess = conn.deactivateHost(hostId).isSuccess

                if (isSuccess) {
                    result[hostName] = "Success"
                }
            } catch (ex: Exception) {
                log.error("Failed to deactivate host: $hostName", ex)
                result[hostName] = "Failure: ${ex.message}" // 실패한 경우 메시지 추가
            }
        }
        return result // 성공/실패 결과 반환
    }


    @Throws(Error::class)
    override fun activate(hostId: String): Boolean {
        log.info("activate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.activateHost(hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun activateMultiple(hostIds: List<String>): Map<String, String> {
        log.info("activateMultiple ... hostIds: $hostIds")
        val result = mutableMapOf<String, String>() // 성공/실패 결과를 저장할 Map

        hostIds.forEach { hostId ->
            val hostName: String = conn.findHost(hostId).getOrNull()?.name().toString()
            try {
                val isSuccess = conn.activateHost(hostId).isSuccess

                if (isSuccess) {
                    result[hostName] = "Success"
                }
            } catch (ex: Exception) {
                log.error("Failed to activate host: $hostName", ex)
                result[hostName] = "Failure: ${ex.message}" // 실패한 경우 메시지 추가
            }
        }
        return result
    }

    // TODO host root 로그인이 아닌 새호스트 계정을 생성하고 이를 application.properties에 저장해서 보여주는 방식
    @Throws(UnknownHostException::class, Error::class)
    override fun restart(hostId: String): Boolean {
        log.info("reStart ... hostId: {}", hostId)
        val name = rutil.id
        val password = rutil.password
        log.info("Host ID: {}, Password: {}", name, password)
        val res: Result<Boolean> = conn.restartHost(hostId, name, password)
        return res.isSuccess
    }

    // TODO 인증서 등록에 대한 조건이 뭔지 모르겠음 (활성화 조건을 모름)
    @Throws(Error::class)
    override fun enrollCertificate(hostId: String): Boolean {
        log.info("enrollCertificate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.enrollCertificate(hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun globalHaActivate(hostId: String): Boolean {
        log.info("globalHaActivate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.activeGlobalHaFromHost(hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun globalHaDeactivate(hostId: String): Boolean {
        log.info("globalHaDeactivate ... hostId: {}", hostId)
        val res: Result<Boolean> = conn.deactiveGlobalHaFromHost(hostId)
        return res.isSuccess
    }


    @Deprecated("사용안함")
    @Throws(Error::class)
    override fun refresh(hostId: String): Boolean {
        log.info("refresh ... hostId: {}", hostId)
        val res: Result<Boolean> =
            conn.refreshHost(hostId)
        return res.isSuccess
    }

    companion object {
        private val log by LoggerDelegate()
    }
}