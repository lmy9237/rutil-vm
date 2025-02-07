package com.itinfo.service.impl

import com.google.gson.Gson
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllEvents
import com.itinfo.findAllTemplates
import com.itinfo.findAllHosts
import com.itinfo.findAllVms
import com.itinfo.findAllNicsFromTemplate
import com.itinfo.findAllStorageDomains
import com.itinfo.findAllCpuProfiles
import com.itinfo.findAllDataCenters
import com.itinfo.findAllClusters
import com.itinfo.findAllOperatingSystems
import com.itinfo.findAllWatchdogsFromTemplate
import com.itinfo.findAllFilesFromStorageDomain
import com.itinfo.findAllTemplatesFromStorageDomain
import com.itinfo.findAllCdromsFromTemplate

import com.itinfo.findTemplate

import com.itinfo.addTemplate
import com.itinfo.removeTemplate
import com.itinfo.exportTemplate

import com.itinfo.model.MessageVo
import com.itinfo.model.MessageType
import com.itinfo.model.EventVo
import com.itinfo.model.toEventVo
import com.itinfo.model.toHostVos
import com.itinfo.model.TemplateVo
import com.itinfo.model.toClusterVos
import com.itinfo.model.toTemplateVo
import com.itinfo.model.toTemplateVos
import com.itinfo.model.TemplateEditVo
import com.itinfo.model.TemplateDiskVo
import com.itinfo.model.DiskProfileVo
import com.itinfo.model.toDiskAttachments
import com.itinfo.model.VmVo
import com.itinfo.model.toVmVo
import com.itinfo.model.VmSystemVo
import com.itinfo.model.toVmSystemVoFromTemplate
import com.itinfo.model.VmNicVo
import com.itinfo.model.toVmNicVos
import com.itinfo.model.CpuProfileVo
import com.itinfo.model.toCpuProfileVos
import com.itinfo.model.StorageDomainVo
import com.itinfo.model.toStorageDomainVos
import com.itinfo.model.QuotaVo
import com.itinfo.model.toQuotaVo
import com.itinfo.model.toDiskProfileVo
import com.itinfo.model.toOsInfoVos

import com.itinfo.service.TemplatesService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.ConnectionService
import com.itinfo.service.engine.WebsocketService

import org.apache.commons.lang3.StringUtils

import org.ovirt.engine.sdk4.builders.*
import org.ovirt.engine.sdk4.services.*
import org.ovirt.engine.sdk4.types.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

import kotlin.math.pow

import java.util.*


@Service
class TemplatesServiceImpl : TemplatesService {
	@Autowired private lateinit var connectionService: ConnectionService
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var websocketService: WebsocketService
	
	override fun retrieveTemplates(): List<TemplateVo> {
		log.info("... retrieveTemplate")
		val c = connectionService.getConnection()
		val items: List<Template> =
			c.findAllTemplates()
		return items.toTemplateVos(c)
	}

	override fun retrieveTemplate(id: String): TemplateVo {
		log.info("... retrieveTemplate('$id')")
		val c = connectionService.getConnection()
		val item: Template = c.findTemplate(id)
		val template = item.toTemplateVo(c)
		val vmList: List<Vm> =
			c.findAllVms()
		val vms: MutableList<VmVo> = ArrayList()
		for (vmItem in vmList) {
			var targetId = item.id()
			if (item.version().versionNumberAsInteger() > 1) targetId = item.version().baseTemplate().id()
			if (vmItem.template().id() == targetId) {
				val vm = vmItem.toVmVo(c)
				vms.add(vm)
			}
		}
		template.vms = vms
		template.nics = retrieveNicInfo(item.id())
		template.templateDisks = retrieveDisks(item.id())
		template.events = retrieveEvents(item.id())
		return template
	}

	override fun retrieveSystemInfo(id: String): VmSystemVo {
		log.info("... retrieveSystemInfo('$id')")
		val c = connectionService.getConnection()
		val template: Template = c.findTemplate(id)
		return template.toVmSystemVoFromTemplate()
	}

	override fun retrieveNicInfo(id: String): List<VmNicVo> {
		log.info("... retrieveNicInfo('$id')")
		val c = connectionService.getConnection()
		val nics: List<Nic> =
			c.findAllNicsFromTemplate(id)
		return nics.toVmNicVos(c)
	}

	override fun retrieveStorageInfo(id: String): List<StorageDomainVo> {
		log.info("... retrieveStorageInfo('$id')")
		val c = connectionService.getConnection()
		val storageDomainList: List<StorageDomain> =
			c.findAllStorageDomains()
		return storageDomainList.toStorageDomainVos(c)
	}

	override fun retrieveEvents(id: String): List<EventVo> {
		log.info("... retrieveEvents('$id')")
		val c = connectionService.getConnection()
		val items: List<Event> =
			c.findAllEvents()
		return items.filter { event: Event ->
			event.templatePresent() && id == event.template().id()
		}.map { it.toEventVo() }
	}

	override fun retrieveCpuProfiles(): List<CpuProfileVo> {
		log.info("... retrieveCpuProfiles")
		val c = connectionService.getConnection()
		val items: List<CpuProfile> = c.findAllCpuProfiles()
		return items.toCpuProfileVos()
	}

	override fun retrieveRootTemplates(): List<TemplateVo> {
		log.info("... retrieveRootTemplates")
		val c = connectionService.getConnection()
		val items: List<Template> = c.findAllTemplates().filter { item ->
			item.version().versionNumber().intValueExact() === 1
		}
		return items.toTemplateVos(c)
	}

	override fun retrieveDisks(vmId: String): List<TemplateDiskVo> {
		log.info("... retrieveDisks('$vmId')")
		val c = connectionService.getConnection()
		val systemService = c.systemService()
		val vmService = systemService.vmsService().vmService(vmId)
		val diskAttachments = vmService.diskAttachmentsService().list().send().attachments()
		val diskProfileList = systemService.diskProfilesService().list().send().profile()
		val dataCenterId = systemService.dataCentersService().list().send().dataCenters()[0].id()
		val quotaList =
			systemService.dataCentersService().dataCenterService(dataCenterId).quotasService().list().send().quotas()
		val templateDisks: MutableList<TemplateDiskVo> = ArrayList()
		for (diskAttachment in diskAttachments) {
			val item = systemService.disksService().diskService(diskAttachment.disk().id()).get().send().disk()
			val templateDisk = TemplateDiskVo()
			templateDisk.id = item.id()
			templateDisk.name = item.name()
			templateDisk.virtualSize =
				(Math.round(item.provisionedSize().toDouble() / 1024.0.pow(3.0) * 100.0) / 100.0).toString() + " GiB"
			templateDisk.actualSize =
				(Math.round(item.actualSize().toDouble() / 1024.0.pow(3.0) * 100.0) / 100.0).toString() + " GiB"
			templateDisk.status = item.status().value()
			templateDisk.format = item.format().value()
			templateDisk.type = item.storageType().value()
			val storageDomains: MutableList<StorageDomainVo> = ArrayList()
			val diskProfiles: MutableList<DiskProfileVo> = ArrayList()
			val quotas: MutableList<QuotaVo> = ArrayList()
			if (item.storageDomainsPresent()) {
				val storageDomainItem =
					systemService.storageDomainsService().storageDomainService(item.storageDomains()[0].id()).get()
						.send()
						.storageDomain()
				if (storageDomainItem.type() == StorageDomainType.DATA) {
					val storageDomain = StorageDomainVo()
					storageDomain.id = storageDomainItem.id()
					storageDomain.name = storageDomainItem.name()
					if (storageDomainItem.master()) {
						storageDomain.type = StringUtils.capitalize(storageDomainItem.type().value()) + "(Master)"
					} else {
						storageDomain.type = StringUtils.capitalize(storageDomainItem.type().value())
					}
					if (storageDomainItem.statusPresent()) {
						storageDomain.status = StringUtils.capitalize(storageDomainItem.status().value())
					} else {
						storageDomain.status = "-"
					}
					storageDomain.diskFree = storageDomainItem.available()
					storageDomain.diskUsed = storageDomainItem.used()
					storageDomains.add(storageDomain)
					for (diskProfileItem in diskProfileList) {
						if (storageDomainItem.id() == diskProfileItem.storageDomain().id()) {
							val diskProfile = diskProfileItem.toDiskProfileVo("")
							diskProfiles.add(diskProfile)
						}
					}
					for (quotaItem in quotaList) {
						val quotaService =
							systemService.dataCentersService().dataCenterService(dataCenterId).quotasService()
								.quotaService(quotaItem.id())
						for (quotaStorageLimit in quotaService.quotaStorageLimitsService().list().send().limits()) {
							if (!quotaStorageLimit.storageDomainPresent()) {
								val quota = quotaItem.toQuotaVo(c)
								quotas.add(quota)
							}
							if (quotaStorageLimit.storageDomainPresent() && storageDomainItem.id() == quotaStorageLimit.storageDomain()
									.id()
							) {
								val quota = quotaItem.toQuotaVo(c)
								quotas.add(quota)
							}
						}
					}
				}
			}
			templateDisk.storageDomains = storageDomains
			templateDisk.diskProfiles = diskProfiles
			templateDisk.quotas = quotas
			templateDisks.add(templateDisk)
		}
		return templateDisks
	}

	override fun checkDuplicateName(name: String): Boolean {
		log.info("... checkDuplicateName('$name')")
		val c = connectionService.getConnection()
		val result: Boolean = 
			c.findAllTemplates(" name=$name").isNotEmpty()
		log.info("... result: $result")
		return result
	}

	@Async("karajanTaskExecutor")
	override fun createTemplate(template: TemplateVo) {
		log.info("... createTemplate")
		val c = adminConnectionService.getConnection()
		val dataCenter: List<DataCenter> = c.findAllDataCenters()
		val dataCenterId = if (dataCenter.isNotEmpty()) dataCenter.first().id() else ""
		val attachments = template.templateDisks.toDiskAttachments(c, dataCenterId)
		val gson = Gson()
		val t2Add: Template
		t2Add = if (template.rootTemplateId != null && "" != template.rootTemplateId) {
			val baseTemplate: Template = c.findTemplate(template.rootTemplateId ?: "")
			val templateVersion = TemplateVersionBuilder()
				.baseTemplate(baseTemplate)
				.versionName(template.subVersionName)
				.build()
			Builders.template()
				.name(template.name)
				.description(template.description)
				.vm(Builders.vm().id(template.orgVmId).diskAttachments(attachments))
				.version(templateVersion)
				.build()
		} else {
			Builders.template()
				.name(template.name)
				.description(template.description)
				.vm(Builders.vm().id(template.orgVmId).diskAttachments(attachments))
				.build()
		}
		val response: Template? = 
			c.addTemplate(t2Add, template.clonePermissions, template.seal)
		try {
			do {
				Thread.sleep(5000L)
			} while (c.findAllTemplates(" name=${response?.name()}").isNotEmpty())
			val message = MessageVo.createMessage(MessageType.TEMPLATE_ADD, true, response?.name() ?: "", "")
			websocketService.notify(message)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val message = MessageVo.createMessage(MessageType.TEMPLATE_ADD, false, e.localizedMessage, "")
			websocketService.notify(message)
		}
	}

	@Async("karajanTaskExecutor")
	override fun removeTemplate(id: String) {
		log.info("... removeTemplate('$id')")
		val c = adminConnectionService.getConnection()
		val gson = Gson()
		val template: Template = c.findTemplate(id)
		try {
			var name = template.name()
			if (template.version().versionNumberAsInteger() > 1) name = template.version().versionName()
			val vms: List<Vm> = c.findAllVms(" template.name=" + template.name())
			if (vms.isNotEmpty()) {
				var names = ""
				for (vm in vms) names += vm.name() + " "
				websocketService.sendMessage("/topic/templates", gson.toJson(listOf(id, "failed")))
				val message = MessageVo.createMessage(MessageType.TEMPLATE_REMOVE, false, names, "이 템플릿은 현재 다음의 가상머신이 사용 중 입니다.")
				websocketService.notify( message)
			} else {
				c.removeTemplate(id)
				do {
					Thread.sleep(5000L)
				} while (c.findAllTemplates(" id=$id").isNotEmpty())
				websocketService.sendMessage("/topic/templates", gson.toJson(listOf(id, "removed")))
				val message = MessageVo.createMessage(MessageType.TEMPLATE_REMOVE, true, name!!, "")
				websocketService.notify(message)
			}
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			val message = MessageVo.createMessage(
				MessageType.TEMPLATE_REMOVE, false,
				e.message!!, ""
			)
			websocketService.notify(message)
		}
	}

	override fun retrieveTemplateEditInfo(id: String): TemplateEditVo {
		log.info("... retrieveTemplateEditInfo('$id')")
		val c = connectionService.getConnection()
		val template: Template =
			c.findTemplate(id)
		val clusterItemList: List<Cluster> =
			c.findAllClusters()
		val clusters = clusterItemList.toClusterVos(c, null)
		val templateEditInfo = TemplateEditVo()
		templateEditInfo.clusters = clusters
		val osItemList: List<OperatingSystemInfo> =
			c.findAllOperatingSystems()
		val osInfoList =
			osItemList.toOsInfoVos()
		templateEditInfo.operatingSystems = osInfoList
		val hostList: List<Host> = c.findAllHosts()
		val hosts = hostList.toHostVos(c)
		templateEditInfo.hosts = hosts
		if (template.placementPolicy().hostsPresent()) templateEditInfo.targetHost =
			template.placementPolicy().hosts()[0].id()
		templateEditInfo.affinity = "migratable"
		val storageDomainList: List<StorageDomain> = c.findAllStorageDomains()
		val storageDomains: MutableList<StorageDomainVo> = ArrayList()
		val bootImages: MutableList<StorageDomainVo> = ArrayList()
		for (item in storageDomainList) {
			if ("data" == item.type().value()) {
				val storageDomain = StorageDomainVo()
				storageDomain.id = item.id()
				storageDomain.name = item.name()
				storageDomain.type = item.type().value()
				storageDomains.add(storageDomain)
				continue
			}
			if ("iso" == item.type().value()) {
				val filesFromStorageDomain: List<File> =
					c.findAllFilesFromStorageDomain(item.id())
				templateEditInfo.imageStorage = item.id()
				for (file in filesFromStorageDomain) {
					val storageDomain = StorageDomainVo()
					storageDomain.id = file.id()
					storageDomain.name = file.name()
					storageDomain.type = file.type()
					bootImages.add(storageDomain)
				}
			}
		}
		templateEditInfo.leaseStorageDomains = storageDomains
		templateEditInfo.bootImages = bootImages
		val cpuProfileList: List<CpuProfile> = c.findAllCpuProfiles()
		val cpuProfiles = cpuProfileList.toCpuProfileVos()
		/*
		for (CpuProfile profile : systemService.cpuProfilesService().list().send().profile()) {
			CpuProfileVo cpuProfile = new CpuProfileVo();
			cpuProfile.setId(profile.id());
			cpuProfile.setName(profile.name());
			cpuProfiles.add(cpuProfile);
		}
		*/templateEditInfo.cpuProfiles = cpuProfiles
		templateEditInfo.id = template.id()
		templateEditInfo.cluster = template.cluster().id()
		for (item in osItemList) {
			if (template.os().type() == item.name()) templateEditInfo.operatingSystem = item.name()
		}
		templateEditInfo.type = template.type().value()
		templateEditInfo.name = template.name()
		templateEditInfo.description = template.description()
		templateEditInfo.stateless = template.stateless()
		templateEditInfo.startInPause = template.startPaused()
		templateEditInfo.deleteProtection = template.deleteProtected()
		if (template.version().versionNumberAsInteger() > 1) {
			templateEditInfo.subName = template.version().versionName()
		} else {
			templateEditInfo.subName = "base version"
		}
		templateEditInfo.disconnectAction = template.display().disconnectAction()
		templateEditInfo.smartcard = template.display().smartcardEnabled()
		templateEditInfo.memory = template.memoryPolicy().guaranteed()
		templateEditInfo.physicalMemory = template.memoryPolicy().guaranteed()
		templateEditInfo.maximumMemory = template.memoryPolicy().max()
		templateEditInfo.virtualSockets = template.cpu().topology().socketsAsInteger()
		templateEditInfo.coresPerVirtualSocket = template.cpu().topology().coresAsInteger()
		templateEditInfo.threadsPerCore = template.cpu().topology().threadsAsInteger()
		templateEditInfo.affinity = template.placementPolicy().affinity().value()
		templateEditInfo.autoConverge = template.migration().autoConverge().value()
		templateEditInfo.compressed = template.migration().compressed().value()
		if (template.migration().policyPresent()) {
			templateEditInfo.customMigrationUsed = true
			templateEditInfo.customMigration = template.migration().policy().id()
			templateEditInfo.customMigrationDowntime = template.migrationDowntime()
		}
		if (template.initializationPresent()) {
			templateEditInfo.useCloudInit = template.initializationPresent()
			templateEditInfo.hostName = template.initialization().hostName()
			templateEditInfo.timezone = template.initialization().timezone()
			templateEditInfo.customScript = template.initialization().customScript()
		}
		templateEditInfo.highAvailability = template.highAvailability().enabled()
		if (template.leasePresent()) templateEditInfo.leaseStorageDomain = template.lease().storageDomain().id()
		templateEditInfo.resumeBehaviour = template.storageErrorResumeBehaviour().value()
		templateEditInfo.priority = template.highAvailability().priority()
		val watchdogList: List<Watchdog> = c.findAllWatchdogsFromTemplate(template.id())
		if (watchdogList.isNotEmpty()) {
			templateEditInfo.watchdogModel = watchdogList[0].model().value()
			templateEditInfo.watchdogAction = watchdogList[0].action().value()
		}
		templateEditInfo.firstDevice = (template.os().boot().devices()[0] as BootDevice).value()
		if (template.os().boot().devices().size > 1) templateEditInfo.secondDevice =
			(template.os().boot().devices()[1] as BootDevice).value()
		val cdroms: List<Cdrom> = c.findAllCdromsFromTemplate(template.id())
		if (cdroms.isNotEmpty() && cdroms[0].filePresent()) {
			templateEditInfo.bootImageUse = true
			templateEditInfo.bootImage = cdroms[0].file().id()
		}
		templateEditInfo.cpuProfile = template.cpuProfile().id()
		templateEditInfo.cpuShare = template.cpuShares()
		templateEditInfo.memoryBalloon = template.memoryPolicy().ballooning()
		templateEditInfo.ioThreadsEnabled = template.io().threads()
		return templateEditInfo
	}

	@Async("karajanTaskExecutor")
	override fun updateTemplate(templateEditInfo: TemplateEditVo): String {
		log.info("... updateTemplate")
		val c = adminConnectionService.getConnection()
		val systemService = c.systemService()
		val templateService = systemService.templatesService().templateService(templateEditInfo.id)
		var response: Template? = null
		try {
			val templateBuilder = TemplateBuilder()
			try {
				templateBuilder.cluster(
					systemService.clustersService().clusterService(templateEditInfo.cluster).get().send().cluster()
				)
			} catch (e: Exception) {
				throw Exception("클러스터를 찾을 수 없습니다.")
			}
			val operatingSystemBuilder = OperatingSystemBuilder()
			operatingSystemBuilder.type(templateEditInfo.operatingSystem)
			templateBuilder.type(VmType.fromValue(templateEditInfo.type))
			templateBuilder.name(templateEditInfo.name)
			if (templateEditInfo.subName != null);
			templateBuilder.description(templateEditInfo.description)
			templateBuilder.stateless(templateEditInfo.stateless)
			templateBuilder.startPaused(templateEditInfo.startInPause)
			templateBuilder.deleteProtected(templateEditInfo.deleteProtection)
			val displayBuilder = DisplayBuilder()
			displayBuilder.type(DisplayType.VNC)
			displayBuilder.disconnectAction(templateEditInfo.disconnectAction)
			displayBuilder.smartcardEnabled(templateEditInfo.smartcard)
			templateBuilder.display(displayBuilder)
			val cpuBuilder = CpuBuilder()
			val cpuTopologyBuilder = CpuTopologyBuilder()
			cpuTopologyBuilder.cores(templateEditInfo.coresPerVirtualSocket)
			cpuTopologyBuilder.sockets(templateEditInfo.virtualSockets)
			cpuTopologyBuilder.threads(templateEditInfo.threadsPerCore)
			cpuBuilder.topology(cpuTopologyBuilder)
			templateBuilder.cpu(cpuBuilder)
			val memoryPolicy = MemoryPolicyBuilder()
			memoryPolicy.max(templateEditInfo.maximumMemory)
			memoryPolicy.guaranteed(templateEditInfo.physicalMemory)
			memoryPolicy.ballooning(templateEditInfo.memoryBalloon)
			templateBuilder.memory(templateEditInfo.memory)
			templateBuilder.memoryPolicy(memoryPolicy)
			val runHosts: MutableList<Host> = ArrayList()
			if (templateEditInfo.recommendHost != null) {
				runHosts.add(
					(systemService.hostsService().hostService(templateEditInfo.recommendHost).get()
						.send() as HostService.GetResponse).host()
				)
			} else {
				runHosts.add(
					(systemService.hostsService().hostService(templateEditInfo.targetHost).get()
						.send() as HostService.GetResponse).host()
				)
			}
			val vmPlacementPolicyBuilder = VmPlacementPolicyBuilder()
			vmPlacementPolicyBuilder.affinity(VmAffinity.fromValue(templateEditInfo.affinity))
			vmPlacementPolicyBuilder.hosts(runHosts)
			templateBuilder.placementPolicy(vmPlacementPolicyBuilder)
			if (templateEditInfo.customMigrationUsed) {
				val migrationOptionBuilder = MigrationOptionsBuilder()
				migrationOptionBuilder.autoConverge(InheritableBoolean.fromValue(templateEditInfo.autoConverge))
				migrationOptionBuilder.compressed(InheritableBoolean.fromValue(templateEditInfo.compressed))
				if (templateEditInfo.customMigrationDowntimeUsed) templateBuilder.migrationDowntime(templateEditInfo.customMigrationDowntime)
			}
			if (templateEditInfo.highAvailability) {
				val storageDomainLeaseBuilder = StorageDomainLeaseBuilder()
				storageDomainLeaseBuilder.storageDomain(
					(systemService.storageDomainsService().storageDomainService(templateEditInfo.leaseStorageDomain)
						.get().send() as StorageDomainService.GetResponse).storageDomain()
				)
				templateBuilder.lease(storageDomainLeaseBuilder)
			}
			templateBuilder.storageErrorResumeBehaviour(VmStorageErrorResumeBehaviour.fromValue(templateEditInfo.resumeBehaviour))
			val highAvailabilityBuilder = HighAvailabilityBuilder()
			highAvailabilityBuilder.priority(templateEditInfo.priority)
			if (templateEditInfo.watchdogModel != null) {
				val watchdogBuilder = WatchdogBuilder()
				watchdogBuilder.model(WatchdogModel.fromValue(templateEditInfo.watchdogModel))
				watchdogBuilder.action(WatchdogAction.fromValue(templateEditInfo.watchdogAction))
				templateBuilder.watchdogs(*arrayOf(watchdogBuilder))
			}
			val bootDevices: MutableList<BootDevice> = ArrayList()
			bootDevices.add(BootDevice.fromValue(templateEditInfo.firstDevice))
			if (templateEditInfo.secondDevice != null && templateEditInfo.secondDevice != "" && templateEditInfo.secondDevice != "none") bootDevices.add(
				BootDevice.fromValue(templateEditInfo.secondDevice)
			)
			val bootBuilder = BootBuilder()
			bootBuilder.devices(bootDevices)
			operatingSystemBuilder.boot(bootBuilder)
			templateBuilder.os(operatingSystemBuilder)
			val cpuProfileBuilder = CpuProfileBuilder()
			try {
				cpuProfileBuilder.cluster(
					systemService.clustersService().clusterService(templateEditInfo.cluster).get().send().cluster()
				)
			} catch (e: Exception) {
				throw Exception("클러스터를 찾을 수 없습니다.")
			}
			templateBuilder.cpuProfile(cpuProfileBuilder)
			templateBuilder.cpuShares(templateEditInfo.cpuShare)
			val ioBuilder = IoBuilder()
			ioBuilder.threads(templateEditInfo.ioThreadsEnabled)
			templateBuilder.io(ioBuilder)
			val virtioScsiBuilder = VirtioScsiBuilder()
			virtioScsiBuilder.enabled(templateEditInfo.virtioScsiEnabled)
			templateBuilder.virtioScsi(virtioScsiBuilder)
			templateService.update().template(templateBuilder).send()
			response = templateService.get().send().template()
			val gson = Gson()
			val message = MessageVo(
				"템플릿 편집",
				"템플릿 편집 완료(" + response.name() + ")",
				"success"
			)
			websocketService.notify( message)
		} catch (e: Exception) {
			try {
				Thread.sleep(5000L)
			} catch (interruptedException: InterruptedException) {
				interruptedException.printStackTrace()
			}
			log.error(e.localizedMessage)
			val message = MessageVo("템플릿 편집", "템플릿 편집 실패(${e.message})", "error")
			websocketService.notify(message)
		}
		return response!!.id()
	}

	@Async("karajanTaskExecutor")
	override fun exportTemplate(template: TemplateVo) {
		log.info("... exportTemplate")
		val c = adminConnectionService.getConnection()
		val exportDomain: StorageDomain = c.findAllStorageDomains("export").first()
		var msg: MessageVo
		try {
			c.exportTemplate(template.id, template.forceOverride, exportDomain)
			var breaker = 0
			do {
				val templates: List<Template> =
					c.findAllTemplatesFromStorageDomain(exportDomain.id())
				Thread.sleep(5000L)
				if (templates.isEmpty()) continue

				for (exportTemplate in templates) {
					if (template.id == exportTemplate.id()) {
						msg = MessageVo.createMessage(MessageType.TEMPLATE_ADD, true, template.name, "")
						websocketService.notify(msg)
						breaker = 1
					}
				}
			} while (breaker <= 0)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			msg = MessageVo.createMessage(MessageType.TEMPLATE_ADD, false, template.name, "")
			websocketService.notify(msg)
		}
	}

	override fun checkExportTemplate(id: String): Boolean {
		val c = connectionService.getConnection()
		val storageDomains: List<StorageDomain> = c.findAllStorageDomains("export")
		var exist = false
		if (storageDomains.isNotEmpty()) for (storageDomain in storageDomains) {
			val templates: List<Template> =
				c.findAllTemplatesFromStorageDomain(storageDomain.id())
			if (templates.isNotEmpty()) for (template in templates) if (template.id() == id) {
				exist = true
				break
			}
		}
		return exist
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}
