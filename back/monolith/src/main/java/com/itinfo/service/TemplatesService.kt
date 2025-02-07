package com.itinfo.service

import com.itinfo.model.*

/**
 * [TemplatesService]
 * 탬플릿 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface TemplatesService {
	fun retrieveTemplates(): List<TemplateVo>
	fun retrieveTemplate(id: String): TemplateVo
	fun retrieveSystemInfo(id: String): VmSystemVo
	fun retrieveNicInfo(id: String): List<VmNicVo>
	fun retrieveStorageInfo(id: String): List<StorageDomainVo>
	fun retrieveEvents(id: String): List<EventVo>
	fun retrieveCpuProfiles(): List<CpuProfileVo>
	fun retrieveRootTemplates(): List<TemplateVo>
	fun retrieveDisks(id: String): List<TemplateDiskVo>
	fun checkDuplicateName(name: String): Boolean
	fun createTemplate(template: TemplateVo)
	fun removeTemplate(id: String)
	fun retrieveTemplateEditInfo(id: String): TemplateEditVo
	fun updateTemplate(templateEditInfo: TemplateEditVo): String
	fun exportTemplate(template: TemplateVo)
	fun checkExportTemplate(id: String): Boolean
}
