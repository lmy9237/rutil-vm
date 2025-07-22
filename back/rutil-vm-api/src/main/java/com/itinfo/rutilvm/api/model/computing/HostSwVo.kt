package com.itinfo.rutilvm.api.model.computing

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.api.repository.history.entity.HostConfigurationEntity
import com.itinfo.rutilvm.api.repository.history.entity.toHostSwVo

import org.ovirt.engine.sdk4.types.Host
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(HostSwVo::class.java)

/**
 * [HostSwVo]
 * 호스트 소프트웨어
 *
 * @property osVersion [String]
 * @property osInfo [String]
 * @property kernalVersion [String]
 * @property kvmVersion [String]
 * @property libvirtVersion [String]
 * @property vdsmVersion [String]
 * @property spiceVersion [String]
 * @property glustersfsVersion [String]
 * @property cephVersion [String]
 * @property openVswitchVersion [String]
 * @property nmstateVersion [String]
 */
class HostSwVo(
    val osVersion: String = "",
    val osInfo: String = "",
    val kernalVersion: String = "",
    val kvmVersion: String = "",
    var libvirtVersion: String = "",
    var vdsmVersion: String = "",
    val spiceVersion: String = "",
    val glustersfsVersion: String = "",
    val cephVersion: String = "",
    val openVswitchVersion: String = "",
    val nmstateVersion: String = ""
): Serializable{
    override fun toString(): String =
        gson.toJson(this)

    class Builder{
        private var bOsVersion: String = ""; fun osVersion(block: () -> String?) { bOsVersion = block() ?: "" }
        private var bOsInfo: String = ""; fun osInfo(block: () -> String?) { bOsInfo = block() ?: "" }
        private var bKernalVersion: String = ""; fun kernalVersion(block: () -> String?) { bKernalVersion = block() ?: "" }
        private var bKvmVersion: String = ""; fun kvmVersion(block: () -> String?) { bKvmVersion = block() ?: "" }
        private var bLibvirtVersion: String = ""; fun libvirtVersion(block: () -> String?) { bLibvirtVersion = block() ?: "" }
        private var bVdsmVersion: String = ""; fun vdsmVersion(block: () -> String?) { bVdsmVersion = block() ?: "" }
        private var bSpiceVersion: String = ""; fun spiceVersion(block: () -> String?) { bSpiceVersion = block() ?: "" }
        private var bGlustersfsVersion: String = ""; fun glustersfsVersion(block: () -> String?) { bGlustersfsVersion = block() ?: "" }
        private var bCephVersion: String = ""; fun cephVersion(block: () -> String?) { bCephVersion = block() ?: "" }
        private var bOpenVswitchVersion: String = ""; fun openVswitchVersion(block: () -> String?) { bOpenVswitchVersion = block() ?: "" }
        private var bNmstateVersion: String = ""; fun nmstateVersion(block: () -> String?) { bNmstateVersion = block() ?: "" }
        fun build(): HostSwVo = HostSwVo(bOsVersion, bOsInfo, bKernalVersion, bKvmVersion, bLibvirtVersion, bVdsmVersion, bSpiceVersion, bGlustersfsVersion, bCephVersion, bOpenVswitchVersion, bNmstateVersion)
    }

    companion object {
        inline fun builder(block: HostSwVo.Builder.() -> Unit): HostSwVo = HostSwVo.Builder().apply(block).build()
    }
}

/**
 * [Host.toHostSwVo]
 * 호스트 소프트웨어 정보 받기
 * @param hostConfigurationEntity [HostConfigurationEntity] 호스트 객체
 * @return 소프트웨어 정보
 */
fun Host.toHostSwVo(hostConfigurationEntity: HostConfigurationEntity): HostSwVo {
    return hostConfigurationEntity.toHostSwVo().apply {
        // [Request processing failed; nested exception is java.lang.NullPointerException] with root cause
        this.libvirtVersion = if (this@toHostSwVo.libvirtVersionPresent()) this@toHostSwVo.libvirtVersion().fullVersion() else ""
        this.vdsmVersion = if (this@toHostSwVo.versionPresent()) this@toHostSwVo.version().fullVersion() else ""

    }
}
