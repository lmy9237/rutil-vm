package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*

private fun Connection.srvTemplates(): TemplatesService =
	systemService().templatesService()

fun Connection.findAllTemplates(searchQuery: String = "", follow: String = ""): Result<List<Template>> = runCatching {
	this.srvTemplates().list().apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.caseSensitive(false).send().templates()

}.onSuccess {
	Term.TEMPLATE.logSuccess("목록조회")
}.onFailure {
	Term.TEMPLATE.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.TEMPLATE, "목록조회") else it
}

private fun Connection.srvTemplate(templateId: String): TemplateService =
	systemService.templatesService().templateService(templateId)

fun Connection.findTemplate(templateId: String, follow: String = ""): Result<Template?> = runCatching {
	this.srvTemplate(templateId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().template()

}.onSuccess {
	Term.TEMPLATE.logSuccess("상세조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFail("상세조회", it, templateId)
	throw if (it is Error) it.toItCloudException(Term.TEMPLATE, "상세조회", templateId) else it
}

fun List<Template>.templateHasDuplicateName(templateName: String, templateId: String = ""): Boolean =
	this.filter { it.id() != templateId}.any { it.name() == templateName }

fun Connection.exportTemplate(templateId: String, exclusive: Boolean, toStorageDomain: StorageDomain): Result<Boolean> = runCatching {
	this.srvTemplate(templateId).export().exclusive(exclusive)
		.storageDomain(toStorageDomain)
		.send()
	true
}.onSuccess {
	Term.TEMPLATE.logSuccess("내보내기", templateId)
}.onFailure {
	Term.TEMPLATE.logFail("내보내기", it, templateId)
	throw if (it is Error) it.toItCloudException(Term.TEMPLATE, "내보내기", templateId) else it
}

@Throws(Error::class)
fun Connection.addTemplate(vmId: String, template: Template): Result<Template?> = runCatching {
	val vm = checkVm(vmId)
	if (vm?.status() == VmStatus.UP) {
		throw ErrorPattern.VM_STATUS_ERROR.toError()
	}

	val templateAdded: Template? =
		this.srvTemplates().add().template(template).clonePermissions(true)/*.seal(seal)*/.send().template()

	templateAdded ?: throw ErrorPattern.TEMPLATE_NOT_FOUND.toError()
}.onSuccess {
	Term.TEMPLATE.logSuccess("생성", vmId)
}.onFailure {
	Term.TEMPLATE.logFail("생성", it, vmId)
	throw if (it is Error) it.toItCloudException(Term.TEMPLATE, "생성") else it
}

fun Connection.updateTemplate(templateId: String, template: Template): Result<Template?> = runCatching {
	checkTemplateExists(templateId)

	// if (this.findAllTemplates().getOrDefault(listOf())
	// 		.templateHasDuplicateName(template.name(), template.id())) {
	// 	throw ErrorPattern.TEMPLATE_DUPLICATE.toError()
	// }
	val templateUpdated: Template? =
		this.srvTemplate(templateId).update().template(template).send().template()

	templateUpdated ?: throw ErrorPattern.TEMPLATE_NOT_FOUND.toError()
}.onSuccess {
	Term.TEMPLATE.logSuccess("편집")
}.onFailure {
	Term.TEMPLATE.logFail("편집", it)
	throw if (it is Error) it.toItCloudException(Term.TEMPLATE, "편집", templateId) else it
}

fun Connection.removeTemplate(templateId: String): Result<Boolean> = runCatching {
	val template = checkTemplate(templateId)

	this.srvTemplate(template.id()).remove().send()
	true
}.onSuccess {
	Term.TEMPLATE.logSuccess("삭제", templateId)
}.onFailure {
	Term.TEMPLATE.logFail("삭제", it, templateId)
	throw if (it is Error) it.toItCloudException(Term.TEMPLATE, "삭제", templateId) else it
}

private fun Connection.srvWatchdogsFromTemplate(templateId: String): TemplateWatchdogsService =
	this.srvTemplate(templateId).watchdogsService()

fun Connection.findAllWatchdogsFromTemplate(templateId: String): Result<List<Watchdog>> = runCatching {
	this.srvWatchdogsFromTemplate(templateId).list().send().watchdogs()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.WATCHDOG, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.WATCHDOG,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.WATCHDOG,  "목록조회", templateId) else it
}

private fun Connection.srvCdromsFromTemplate(templateId: String): TemplateCdromsService =
	this.srvTemplate(templateId).cdromsService()

fun Connection.findAllCdromsFromTemplate(templateId: String): Result<List<Cdrom>> = runCatching {
	this.srvCdromsFromTemplate(templateId).list().send().cdroms()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.CD_ROM, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.CD_ROM,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.CD_ROM,  "목록조회", templateId) else it
}

private fun Connection.srvDiskAttachmentsFromTemplate(templateId: String): TemplateDiskAttachmentsService =
	this.srvTemplate(templateId).diskAttachmentsService()

fun Connection.findAllDiskAttachmentsFromTemplate(templateId: String, follow: String = ""): Result<List<DiskAttachment>> = runCatching {
	this.srvDiskAttachmentsFromTemplate(templateId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().attachments()

}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.DISK_ATTACHMENT, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.DISK_ATTACHMENT,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.DISK_ATTACHMENT,  "목록조회", templateId) else it
}

private fun Connection.srvDiskAttachmentFromTemplate(templateId: String, diskAttachmentId: String): TemplateDiskAttachmentService =
	this.srvDiskAttachmentsFromTemplate(templateId).attachmentService(diskAttachmentId)

fun Connection.findDiskAttachmentFromTemplate(templateId: String, diskAttachmentId: String): Result<DiskAttachment?> = runCatching {
	this.srvDiskAttachmentFromTemplate(templateId, diskAttachmentId).get().send().attachment()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.DISK_ATTACHMENT, "상세조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.DISK_ATTACHMENT,"상세조회", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.DISK_ATTACHMENT,  "상세조회", templateId, diskAttachmentId) else it
}

private fun Connection.srvNicsFromTemplate(templateId: String): TemplateNicsService =
	this.srvTemplate(templateId).nicsService()

fun Connection.findAllNicsFromTemplate(templateId: String, follow: String = ""): Result<List<Nic>> = runCatching {
	this.srvNicsFromTemplate(templateId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().nics()

}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "목록조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"목록조회", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.NIC,  "목록조회", templateId) else it
}
private fun Connection.srvNicFromTemplate(templateId: String, nicId: String): TemplateNicService =
	this.srvNicsFromTemplate(templateId).nicService(nicId)

fun Connection.findNicFromTemplate(templateId: String, nicId: String): Result<Nic?> = runCatching {
	this.srvNicFromTemplate(templateId, nicId).get().send().nic()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "상세조회", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"상세조회", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.NIC,  "상세조회", templateId, nicId) else it
}

fun Connection.addNicFromTemplate(templateId: String, nic: Nic): Result<Nic?> = runCatching {
	this.srvNicsFromTemplate(templateId).add().nic(nic).send().nic()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "생성", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"생성", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.NIC,  "생성", templateId) else it
}

fun Connection.updateNicFromTemplate(templateId: String, nic: Nic): Result<Nic?> = runCatching {
	this.srvNicFromTemplate(templateId, nic.id()).update().nic(nic).send().nic()
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "편집", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"편집", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.NIC,  "편집", templateId, nic.id()) else it
}

fun Connection.removeNicFromTemplate(templateId: String, nicId: String): Result<Boolean> = runCatching {
	this.srvNicFromTemplate(templateId, nicId).remove().send()
	true
}.onSuccess {
	Term.TEMPLATE.logSuccessWithin(Term.NIC, "제거", templateId)
}.onFailure {
	Term.TEMPLATE.logFailWithin(Term.NIC,"제거", it, templateId)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.TEMPLATE, Term.NIC,  "제거", templateId, nicId) else it
}


// CPU Topology 계산 최적화
fun Template?.cpuTopologyAll4Template(): Int? {
	val topology = this@cpuTopologyAll4Template?.cpu()?.topology()
	val cores = topology?.coresAsInteger() ?: 0
	val sockets = topology?.socketsAsInteger() ?: 0
	val threads = topology?.threadsAsInteger() ?: 0
	return cores * sockets * threads
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
