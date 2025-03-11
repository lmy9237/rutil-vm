package com.itinfo.rutilvm.api.service.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmViewVo
import com.itinfo.rutilvm.api.model.computing.toTemplateIdNames
import com.itinfo.rutilvm.api.model.computing.toVmsIdName
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VnicProfile
import org.springframework.stereotype.Service

interface ItVnicProfileService{
    /**
     * [ItVnicProfileService.findAll]
     * 네트워크 - vNIC Profile 목록
     *
     * @return List<[VnicProfileVo]>
     */
    @Throws(Error::class)
    fun findAll(): List<VnicProfileVo>
    /**
     * [ItVnicProfileService.findAllFromNetwork]
     * 네트워크 - vNIC Profile 목록
     *
     * @param networkId [String] 네트워크 Id
     * @return List<[VnicProfileVo]>
     */
    @Throws(Error::class)
    fun findAllFromNetwork(networkId: String): List<VnicProfileVo>
    /**
     * [ItVnicProfileService.findOne]
     * 네트워크 - vNIC Profile
     *
     * @param vnicProfileId [String] vnicProfile Id
     * @return [VnicProfileVo]
     */
    @Throws(Error::class)
    fun findOne(vnicProfileId: String): VnicProfileVo?

    /**
     * [ItVnicProfileService.add]
     * 네트워크 - vNIC Profile 생성
     *
     * @param vnicProfileVo [VnicProfileVo]
     * @return [VnicProfileVo]?
     */
    @Throws(Error::class)
    fun add(vnicProfileVo: VnicProfileVo): VnicProfileVo?
    /**
     * [ItVnicProfileService.update]
     * 네트워크 - vNIC Profile 편집
     *
     * @param vnicProfileVo [VnicProfileVo]
     * @return [VnicProfileVo]?
     */
    @Throws(Error::class)
    fun update(vnicProfileVo: VnicProfileVo): VnicProfileVo?
    /**
     * [ItVnicProfileService.remove]
     * 네트워크 - vNIC Profile 삭제
     *
     * @param vnicProfileId [String] vnicProfile Id
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun remove(vnicProfileId: String): Boolean
    /**
     * [ItVnicProfileService.removeMultiple]
     * 네트워크 - vNIC Profile 다중 삭제
     *
     * @param vnicProfileIdList List<[String]> vnicProfile Id 리스트
     * @return Map<[String], [String]>
     */
    @Throws(Error::class)
    fun removeMultiple(vnicProfileIdList: List<String>): Map<String, String>

    /**
     * [ItVnicProfileService.findAllVmsFromVnicProfile]
     * vNIC Profile가 가지고있는 가상머신 목록
     *
     * @param vnicProfileId [String] vnicProfile id
     * @return List<[VmViewVo]>
     */
    @Throws(Error::class)
    fun findAllVmsFromVnicProfile(vnicProfileId: String): List<VmViewVo>
    /**
     * [ItVnicProfileService.findAllTemplatesFromVnicProfile]
     * 네트워크 - 템플릿 목록
     *
     * @param vnicProfileId [String] vnicProfile id
     * @return List<[TemplateVo]>
     */
    @Throws(Error::class)
    fun findAllTemplatesFromVnicProfile(vnicProfileId: String): List<TemplateVo>
}
@Service
class VnicProfileServiceImpl(

): BaseService(), ItVnicProfileService {

    @Throws(Error::class)
    override fun findAll(): List<VnicProfileVo> {
        log.info("findAll ... ")
        val res: List<VnicProfile> =
            conn.findAllVnicProfiles().getOrDefault(listOf())
        return res.toVnicProfileVos(conn)
    }

    @Throws(Error::class)
    override fun findAllFromNetwork(networkId: String): List<VnicProfileVo> {
        log.info("findAllFromNetwork ... networkId: {}", networkId)
        val res: List<VnicProfile> = conn.findAllVnicProfilesFromNetwork(networkId)
            .getOrDefault(listOf())
        return res.toVnicProfileVos(conn)
    }

    @Throws(Error::class)
    override fun findOne(vnicProfileId: String): VnicProfileVo? {
        log.info("findOne ... vcId: {}", vnicProfileId)
        val res: VnicProfile? = conn.findVnicProfile(vnicProfileId)
            .getOrNull()
        return res?.toVnicProfileVo(conn)
    }


    @Throws(Error::class)
    override fun add(vnicProfileVo: VnicProfileVo): VnicProfileVo? {
        log.info("add ... ")
        val res: VnicProfile? = conn.addVnicProfileFromNetwork(
            vnicProfileVo.networkVo.id,
            vnicProfileVo.toAddVnicProfileBuilder()
        ).getOrNull()
        return res?.toVnicProfileVo(conn)
    }

    @Throws(Error::class)
    override fun update(vnicProfileVo: VnicProfileVo): VnicProfileVo? {
        log.info("update ... ")
        val res: VnicProfile? = conn.updateVnicProfile(vnicProfileVo.toEditVnicProfileBuilder())
            .getOrNull()
        return res?.toVnicProfileVo(conn)
    }

    @Throws(Error::class)
    override fun remove(vnicProfileId: String): Boolean {
        log.info("remove ... ")
        val res: Result<Boolean> = conn.removeVnicProfile(vnicProfileId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun removeMultiple(vnicProfileIdList: List<String>): Map<String, String> {
        val result = mutableMapOf<String, String>() // 성공/실패 결과를 저장할 Map

        vnicProfileIdList.forEach { vnicId ->
            val vnicName: String = conn.findVnicProfile(vnicId).getOrNull()?.name().toString()
            try {
                log.info("removeMultiple ... vnicId: {}", vnicId)
                val isSuccess = conn.removeVnicProfile(vnicId).isSuccess

                if (isSuccess) {
                    result[vnicName] = "Success"
                }
            } catch (ex: Exception) {
                log.error("Failed to remove vnic: $vnicName", ex)
                result[vnicName] = "Failure: ${ex.message}" // 실패한 경우 메시지 추가
            }
        }
        return result
    }

    @Throws(Error::class)
    override fun findAllVmsFromVnicProfile(vnicProfileId: String): List<VmViewVo> {
        log.info("findAllVmsFromVnicProfile ... vnicProfileId: {}", vnicProfileId)
        val res: List<Vm> = conn.findAllVms(follow = "nics")
            .getOrDefault(listOf())
            .filter { vm ->
                vm.nicsPresent() && vm.nics().any { nic ->
                    nic.vnicProfilePresent() && nic.vnicProfile().id() == vnicProfileId
                }
            }
        return res.toVmsIdName()
    }

    @Throws(Error::class)
    override fun findAllTemplatesFromVnicProfile(vnicProfileId: String): List<TemplateVo> {
        log.info("findAllTemplatesFromVnicProfile ... vnicProfileId: {}", vnicProfileId)
        val res: List<Template> = conn.findAllTemplates(follow = "nics")
            .getOrDefault(listOf())
            .filter { template ->
                template.nicsPresent() && template.nics().any { nic ->
                    nic.vnicProfilePresent() && nic.vnicProfile().id() == vnicProfileId
                }
            }
        return res.toTemplateIdNames()
    }


    companion object {
        private val log by LoggerDelegate()
    }
}
