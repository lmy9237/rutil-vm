package com.itinfo.rutilvm.api.service.network

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.computing.TemplateVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.computing.toTemplateIdNames
import com.itinfo.rutilvm.api.model.computing.toVmsIdName
import com.itinfo.rutilvm.api.model.network.*
import com.itinfo.rutilvm.api.repository.engine.VnicProfileRepository
import com.itinfo.rutilvm.api.repository.engine.entity.VnicProfileEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toVnicProfileVosFromVnicProfileEntities
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*

import org.ovirt.engine.sdk4.types.Template
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VnicProfile
import org.springframework.beans.factory.annotation.Autowired
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
     * [ItVnicProfileService.findAllVmsFromVnicProfile]
     * vNIC Profile가 가지고있는 가상머신 목록
     *
     * @param vnicProfileId [String] vnicProfile id
     * @return List<[VmVo]>
     */
    @Throws(Error::class)
    fun findAllVmsFromVnicProfile(vnicProfileId: String): List<VmVo>
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

	@Autowired private lateinit var rVnicProfiles: VnicProfileRepository

    @Throws(Error::class)
    override fun findAll(): List<VnicProfileVo> {
        log.info("findAll ... ")
        val res: List<VnicProfile> = conn.findAllVnicProfiles(follow = "network.datacenter").getOrDefault(emptyList())
        return res.toVnicProfileMenus(conn)
    }

    @Throws(Error::class)
    override fun findAllFromNetwork(networkId: String): List<VnicProfileVo> {
        log.info("findAllFromNetwork ... networkId: {}", networkId)
		val vnicProfilesFound: List<VnicProfileEntity> = rVnicProfiles.findByNetworkId(networkId.toUUID())
		return vnicProfilesFound.toVnicProfileVosFromVnicProfileEntities()
        /*val res: List<VnicProfile> = conn.findAllVnicProfilesFromNetwork(networkId, follow = "network.datacenter")
			.getOrDefault(emptyList())
        return res.toVnicProfileMenus(conn)*/
    }

    @Throws(Error::class)
    override fun findOne(vnicProfileId: String): VnicProfileVo? {
        log.info("findOne ... vcId: {}", vnicProfileId)
        val res: VnicProfile? = conn.findVnicProfile(vnicProfileId, follow = "network.datacenter").getOrNull()
        return res?.toVnicProfileMenu(conn)
    }


    @Throws(Error::class)
    override fun add(vnicProfileVo: VnicProfileVo): VnicProfileVo? {
        log.info("add ... ")
        val res: VnicProfile? = conn.addVnicProfileFromNetwork(
            vnicProfileVo.networkVo.id,
            vnicProfileVo.toAddVnicProfile()
        ).getOrNull()
        return res?.toVnicProfileIdName()
    }

    @Throws(Error::class)
    override fun update(vnicProfileVo: VnicProfileVo): VnicProfileVo? {
        log.info("update ... ")
        val res: VnicProfile? = conn.updateVnicProfile(
			vnicProfileVo.toEditVnicProfile()
		).getOrNull()
        return res?.toVnicProfileIdName()
    }

    @Throws(Error::class)
    override fun remove(vnicProfileId: String): Boolean {
        log.info("remove ... ")
        val res: Result<Boolean> = conn.removeVnicProfile(vnicProfileId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun findAllVmsFromVnicProfile(vnicProfileId: String): List<VmVo> {
        log.info("findAllVmsFromVnicProfile ... vnicProfileId: {}", vnicProfileId)
        val res: List<Vm> = conn.findAllVms(follow = "nics").getOrDefault(emptyList())
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
        val res: List<Template> = conn.findAllTemplates(follow = "nics").getOrDefault(emptyList())
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
