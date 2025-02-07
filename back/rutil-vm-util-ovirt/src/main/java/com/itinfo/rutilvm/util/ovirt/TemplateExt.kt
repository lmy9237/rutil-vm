package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*

private fun Connection.srvTemplates(): TemplatesService =
	systemService().templatesService()

fun Connection.findAllTemplates(searchQuery: String = "", follow: String = ""): Result<List<Template>> = runCatching {
	log.debug("Connection.findAllTemplates ... searchQuery: {}, follow: {}", searchQuery, follow)
	if (searchQuery.isNotEmpty() && follow.isNotEmpty())
		this.srvTemplates().list().search(searchQuery).follow(follow).caseSensitive(false).send().templates()
	else if (searchQuery.isNotEmpty())
		this.srvTemplates().list().search(searchQuery).caseSensitive(false).send().templates()
	else if (follow.isNotEmpty())
		this.srvTemplates().list().follow(follow).caseSensitive(false).send().templates()
	else
		this.srvTemplates().list().send().templates()
}.onSuccess {
	Term.TEMPLATE.logSuccess("목록조회")
}.onFailure {
	Term.TEMPLATE.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvTemplate(templateId: String): TemplateService =
	systemService.templatesService().templateService(templateId)

fun Connection.findTemplate(templateId: String, follow: String = ""): Result<Template?> = runCatching {
	if (follow.isNotEmpty())
		this.srvTemplate(templateId).get().follow(follow).send().template()
	else
		this.srvTemplate(templateId).get().send().template()
}.onSuccess {
	Term.TEMPLATE.logSuccess("상세조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFail("상세조회", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.exportTemplate(templateId: String, exclusive: Boolean, toStorageDomain: StorageDomain): Result<Boolean> = runCatching {
	this.srvTemplate(templateId).export()
		.exclusive(exclusive)
		.storageDomain(toStorageDomain)
		.send()
	true
}.onSuccess {
	Term.TEMPLATE.logSuccess("내보내기", templateId)
}.onFailure {
	Term.TEMPLATE.logFail("내보내기", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

@Throws(Error::class)
fun Connection.addTemplate(
	vmId: String,
	template: Template
): Result<Template?> = runCatching {
	val vm: Vm =
		this@addTemplate.findVm(vmId).getOrNull()
			?: throw ErrorPattern.VM_NOT_FOUND.toError()

	if (vm.status() == VmStatus.UP) {
		log.error("addTemplate ... 가상머신 up 상태에서는 템플릿 생성 불가")
		return Result.failure(Error("가상머신 UP 상태에서는 템플릿 생성 불가"))
	}

	if (this@addTemplate.templateHasDuplicateName(template.name())) {
		log.error("addTemplate ... 템플릿 이름 중복")
		return Result.failure(Error("템플릿 이름 중복"))
	}

	val templateAdded: Template? =
		this.srvTemplates().add().template(template)/*.clonePermissions(f).seal(seal)*/.send().template()
	val templateIdAdded: String = templateAdded?.id() ?: ""

	if (templateAdded != null && this@addTemplate.expectTemplateStatus(templateIdAdded))
		return Result.success(templateAdded)
	else
		return Result.failure(Error("오류"))
}.onSuccess {
	Term.TEMPLATE.logSuccess("생성", vmId)
}.onFailure {
	Term.TEMPLATE.logFail("생성", it, vmId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateTemplate(templateId: String, template: Template): Result<Template?> = runCatching {
	this@updateTemplate.findTemplate(templateId).getOrNull() ?: throw ErrorPattern.TEMPLATE_NOT_FOUND.toError()
//	if (this@updateTemplate.templateHasDuplicateName(template.name())) {
//		log.error("updateTemplate ... 템플릿 이름 중복")
//		return Result.failure(Error("템플릿 이름 중복"))
//	}
	val templateUpdated: Template? = this@updateTemplate.srvTemplate(templateId).update().template(template).send().template()
	templateUpdated
}.onSuccess {
	Term.TEMPLATE.logSuccess("편집", templateId)
}.onFailure {
	Term.TEMPLATE.logFail("편집", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeTemplate(templateId: String): Result<Boolean> = runCatching {
	this@removeTemplate.findTemplate(templateId).getOrNull()
		?: throw ErrorPattern.TEMPLATE_NOT_FOUND.toError()

	this@removeTemplate.srvTemplate(templateId).remove().send()
	true
}.onSuccess {
	Term.TEMPLATE.logSuccess("삭제", templateId)
}.onFailure {
	Term.TEMPLATE.logFail("삭제", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

/**
 * 템플릿 이름 중복 확인
 * @param templateName [String]
 * @param templateId [String]
 * @return
 */
fun Connection.templateHasDuplicateName(templateName: String, templateId: String = ""): Boolean {
	return this@templateHasDuplicateName.findAllTemplates()
		.getOrDefault(listOf())
		.filter { it.id() == null || it.id() != templateId /* 조건이 이상한데 ... */ }
		.any { it.name() == templateName }
}

private fun Connection.srvWatchdogsFromTemplate(templateId: String): TemplateWatchdogsService =
	this.srvTemplate(templateId).watchdogsService()

fun Connection.findAllWatchdogsFromTemplate(templateId: String): Result<List<Watchdog>> = runCatching {
	this.srvWatchdogsFromTemplate(templateId).list().send().watchdogs()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.WATCHDOG, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.WATCHDOG,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvCdromsFromTemplate(templateId: String): TemplateCdromsService =
	this.srvTemplate(templateId).cdromsService()

fun Connection.findAllCdromsFromTemplate(templateId: String): Result<List<Cdrom>> = runCatching {
	this.srvCdromsFromTemplate(templateId).list().send().cdroms()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.CD_ROM, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.CD_ROM,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvDiskAttachmentsFromTemplate(templateId: String): TemplateDiskAttachmentsService =
	this.srvTemplate(templateId).diskAttachmentsService()

fun Connection.findAllDiskAttachmentsFromTemplate(templateId: String, follow: String = ""): Result<List<DiskAttachment>> = runCatching {
	if (follow.isNotEmpty())
		this.srvDiskAttachmentsFromTemplate(templateId).list().follow(follow).send().attachments()
	else
		this.srvDiskAttachmentsFromTemplate(templateId).list().send().attachments()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.DISK_ATTACHMENT, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.DISK_ATTACHMENT,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvDiskAttachmentFromTemplate(templateId: String, diskAttachmentId: String): TemplateDiskAttachmentService =
	this.srvDiskAttachmentsFromTemplate(templateId).attachmentService(diskAttachmentId)

fun Connection.findDiskAttachmentFromTemplate(templateId: String, diskAttachmentId: String): Result<DiskAttachment?> = runCatching {
	this.srvDiskAttachmentFromTemplate(templateId, diskAttachmentId).get().send().attachment()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.DISK_ATTACHMENT, "상세조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.DISK_ATTACHMENT,"상세조회", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvNicsFromTemplate(templateId: String): TemplateNicsService =
	this.srvTemplate(templateId).nicsService()

fun Connection.findAllNicsFromTemplate(templateId: String, follow: String = ""): Result<List<Nic>> = runCatching {
	if (follow.isNotEmpty())
		this.srvNicsFromTemplate(templateId).list().follow(follow).send().nics()
	else
		this.srvNicsFromTemplate(templateId).list().send().nics()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}
private fun Connection.srvNicFromTemplate(templateId: String, nicId: String): TemplateNicService =
	this.srvNicsFromTemplate(templateId).nicService(nicId)

fun Connection.findNicFromTemplate(templateId: String, nicId: String): Result<Nic?> = runCatching {
	this.srvNicFromTemplate(templateId, nicId).get().send().nic()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "상세조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"상세조회", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addNicFromTemplate(templateId: String, nic: Nic): Result<Nic?> = runCatching {
	this.srvNicsFromTemplate(templateId).add().nic(nic).send().nic()

}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "생성", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"생성", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.updateNicFromTemplate(templateId: String, nic: Nic): Result<Nic?> = runCatching {
	this.srvNicFromTemplate(templateId, nic.id()).update().nic(nic).send().nic()

}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "편집", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"편집", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}


fun Connection.removeNicFromTemplate(templateId: String, nicId: String): Result<Boolean> = runCatching {
	this.srvNicFromTemplate(templateId, nicId).remove().send()
	true
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "제거", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"제거", it, templateId)
	throw if (it is Error) it.toItCloudException() else it
}


/**
 * [Connection.expectTemplateStatus]
 * 템플릿 상태확인
 * @param templateId [String]
 * @param expectStatus
 * @param interval
 * @param timeout
 * @return
 * @throws InterruptedException
 */
@Throws(InterruptedException::class)
fun Connection.expectTemplateStatus(
	templateId: String,
	expectStatus: TemplateStatus = TemplateStatus.OK,
	timeout: Long = 30000,
	interval: Long = 1000,
): Boolean {
	val startTime = System.currentTimeMillis()
	while (true) {
		val currentTemplate: Template? = this@expectTemplateStatus.findTemplate(templateId).getOrNull()
		val status = currentTemplate?.status()

		if (status == expectStatus) {
			log.info("템플릿 생성 완료")
			return true
		} else if (System.currentTimeMillis() - startTime > timeout) {
			log.error("템플릿 생성 시간초과")
			return false
		}
		log.debug("템플릿 상태: {}", status)
		Thread.sleep(interval)
	}
}