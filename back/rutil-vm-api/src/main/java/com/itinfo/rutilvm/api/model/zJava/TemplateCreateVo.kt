package com.itinfo.rutilvm.api.model.zJava/*
package com.itinfo.rutilvm.api.model.create

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.itcloud.model.computing.ClusterVo
import com.itinfo.itcloud.model.computing.CpuProfileVo
import com.itinfo.itcloud.gson
import com.itinfo.itcloud.model.storage.DiskVo
import org.slf4j.LoggerFactory
import java.io.Serializable

private val log = LoggerFactory.getLogger(TemplateCreateVo::class.java)
*/
/**
 * [TemplateCreateVo]
 * 템플릿 생성
 *
 * 가상머신에서 수행
 *
 * @property id [String]
 * @property name [String]
 * @property dcId [String]
 * @property dcName [String]
 * @property diskVo [DiskVo] 디스크 할당
 * @property clusterVos List<[ClusterVo]>
 * @property cpuProfileVos [List<[CpuProfileVo]>]
 *//*

@Deprecated("사용안함")
class TemplateCreateVo (
    val id: String = "",
    val name: String = "",
    val dcId: String = "",
    val dcName: String = "",
    val diskVo: DiskVo = DiskVo(),
    val clusterVos: List<ClusterVo> = listOf(),
    val cpuProfileVos: List<CpuProfileVo> = listOf(),
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
        private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: ""}
        private var bDcId: String = ""; fun dcId(block: () -> String?) { bDcId = block() ?: ""}
        private var bDcName: String = ""; fun dcName(block: () -> String?) { bDcName = block() ?: ""}
        private var bDiskVo: DiskVo = DiskVo(); fun diskVo(block: () -> DiskVo?) { bDiskVo = block() ?: DiskVo()}
        private var bClusterVos: List<ClusterVo> = listOf(); fun clusterVoList(block: () -> List<ClusterVo>?) { bClusterVos = block() ?: listOf()}
        private var bCpuProfileVos: List<CpuProfileVo> = listOf(); fun cpuProfileVoList(block: () -> List<CpuProfileVo>?) { bCpuProfileVos = block() ?: listOf()}
        fun build(): TemplateCreateVo = TemplateCreateVo(bId, bName, bDcId, bDcName, bDiskVo, bClusterVos, bCpuProfileVos)
    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: TemplateCreateVo.Builder.() -> Unit): TemplateCreateVo = TemplateCreateVo.Builder().apply(block).build()
    }
}*/
