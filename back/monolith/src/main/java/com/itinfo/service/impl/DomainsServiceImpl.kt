package com.itinfo.service.impl

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.findAllEvents
import com.itinfo.findAllDataCenters
import com.itinfo.findAllStorageDomains
import com.itinfo.findStorageDomain
import com.itinfo.findAllFilesFromStorageDomain
import com.itinfo.findAllDiskProfiles
import com.itinfo.findAllHosts
import com.itinfo.findAllVms
import com.itinfo.findAllDiskAttachmentsFromVm
import com.itinfo.findAllStoragesFromHost
import com.itinfo.findAllSnapshotsFromVm
import com.itinfo.findAllIscsiTargetsFromHost
import com.itinfo.findAllDiskSnapshotsFromStorageDomain

import com.itinfo.findHost
import com.itinfo.findAttachedStorageDomainFromDataCenter
import com.itinfo.addStorageDomain
import com.itinfo.updateStorageDomain
import com.itinfo.removeStorageDomain
import com.itinfo.activeAttachedStorageDomainFromDataCenter
import com.itinfo.controller.doSleep
import com.itinfo.deactiveAttachedStorageDomainFromDataCenter
import com.itinfo.removeAttachedStorageDomainFromDataCenter

import com.itinfo.dao.DomainsDao
import com.itinfo.model.MessageVo
import com.itinfo.model.EventVo
import com.itinfo.model.toEventVo
import com.itinfo.model.VmVo
import com.itinfo.model.LunVo
import com.itinfo.model.HostDetailVo
import com.itinfo.model.DiskVo
import com.itinfo.model.StorageDomainVo
import com.itinfo.model.toStorageDomainVos
import com.itinfo.model.StorageDomainCreateVo
import com.itinfo.model.StorageDomainUsageVo
import com.itinfo.model.ImageFileVo
import com.itinfo.model.toImageFileVos
import com.itinfo.model.IscsiVo
import com.itinfo.service.DisksService
import com.itinfo.service.DomainsService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.builders.Builders
import org.ovirt.engine.sdk4.builders.DataCenterBuilder
import org.ovirt.engine.sdk4.builders.HostStorageBuilder
import org.ovirt.engine.sdk4.builders.StorageDomainBuilder
import org.ovirt.engine.sdk4.internal.containers.LogicalUnitContainer
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.types.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

import java.math.BigInteger
import java.text.SimpleDateFormat
import java.util.*
import java.util.function.Consumer
import java.util.stream.Collectors

@Service
class DomainsServiceImpl : DomainsService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var domainsDao: DomainsDao
	@Autowired private lateinit var disksService: DisksService
	@Autowired private lateinit var websocketService: WebsocketService
	
	override fun retrieveStorageDomains(status: String, domainType: String): List<StorageDomainVo> {
		log.info("... retrieveStorageDomains('${status}', '${domainType}')")
		val conn: Connection =
			adminConnectionService.getConnection()
		val dataCenterId: String =
			conn.findAllDataCenters().first().id() // TODO: 데이터 센터 세분화
		val storageDomains =
			if (StorageDomainStatus.ACTIVE.value().equals(status, ignoreCase = true))
				conn.findAllStorageDomains("status=active")
			else if (StorageDomainStatus.INACTIVE.value().equals(status, ignoreCase = true))
				conn.findAllStorageDomains("status!=active")
			else
				conn.findAllStorageDomains("")
		
		val storageDomainVos: MutableList<StorageDomainVo> =
			storageDomains.toStorageDomainVos(conn).toMutableList()
		val diskProfiles: List<DiskProfile> =
			conn.findAllDiskProfiles()
//		storageDomains.forEach(Consumer<StorageDomain> { storageDomain: StorageDomain ->
//			if ("all" == domainType || storageDomain.type().name.equals(domainType, ignoreCase = true)) {
//				val storageDomainVo = StorageDomainVo()
//				storageDomainVo.id = storageDomain.id()
//				storageDomainVo.name = storageDomain.name()
//				storageDomainVo.type = storageDomain.type().name
//				storageDomainVo.comment = storageDomain.comment()
//				storageDomainVo.description = storageDomain.description()
//				storageDomainVo.diskFree = storageDomain.available()
//				storageDomainVo.diskUsed = storageDomain.used()
//				storageDomainVo.storageFormat = storageDomain.storageFormat().name
//				storageDomainVo.storageAddress = storageDomain.storage().address()
//				storageDomainVo.storagePath = storageDomain.storage().path()
//				storageDomainVo.storageType = storageDomain.storage().type().name
//				if (storageDomain.status() == null) {
//					try {
//						val sd: StorageDomain? =
//							conn.findAttachedStorageDomainFromDataCenter(dataCenterId, storageDomain.id())
//						storageDomainVo.status = sd?.status()?.value() ?: ""
//					} catch (e: Exception) {
//						log.error(e.localizedMessage)
//						storageDomainVo.status = ""
//					}
//				} else {
//					storageDomainVo.status = storageDomain.status().value()
//				}
//
//				if (storageDomain.type().name == StorageDomainType.ISO.name) {
//					val files =
//						conn.findAllFilesFromStorageDomain(storageDomain.id())
//					val imageFiles = files.toImageFileVos()
//					storageDomainVo.imageFileList = imageFiles
//				}
//				for (dp in diskProfiles) {
//					if (dp.storageDomain().id() == storageDomain.id()) {
//						storageDomainVo.diskProfileId = dp.id()
//						storageDomainVo.diskProfileName = dp.name()
//						break
//					}
//				}
//				storageDomainVos.add(storageDomainVo)
//			}
//		})
		return storageDomainVos
	}

	@Async("karajanTaskExecutor")
	override fun maintenanceStart(domains: List<String>) {
		log.info("... maintenanceStart[${domains.size}]")
		val connection: Connection = adminConnectionService.getConnection()
		val message = MessageVo()
		message.title = "스토리지 도메인 유지보수 모드"
		for (id in domains) {
			val dataCenterId = connection.findAllStorageDomains(id).first().id() // TODO: 값이 이상함...
			var domain: StorageDomain? =
				connection.findAttachedStorageDomainFromDataCenter(dataCenterId, id)
			try {
				if (domain?.status() != StorageDomainStatus.MAINTENANCE)
					connection.deactiveAttachedStorageDomainFromDataCenter(dataCenterId, id)
				do {
					Thread.sleep(5000L)
					domain = connection.findAttachedStorageDomainFromDataCenter(dataCenterId, id)
				} while (domain?.status() != StorageDomainStatus.MAINTENANCE)
				message.text = "스토리지 도메인 유지보수 모드 완료(${domain.name()})"
				message.style = "success"
			} catch (e: Exception) {
				e.printStackTrace()
				message.text = "스토리지 도메인 유지보수 모드 실패(${domain?.name()})"
				message.style = "error"
			}
			websocketService.notify(message)
			websocketService.reload(message, "domains")
		}
	}

	@Async("karajanTaskExecutor")
	override fun maintenanceStop(domains: List<String>) {
		log.info("... maintenanceStop[${domains.size}]")
		val connection: Connection = adminConnectionService.getConnection()
		val message = MessageVo()
		message.title = "스토리지 도메인 활성 모드"
		for (id in domains) {
			val dataCenterId = connection.findAllStorageDomains(id)[0].id() // TODO: 값이 이상함...
			var domain: StorageDomain? =
				connection.findAttachedStorageDomainFromDataCenter(dataCenterId, id)
			try {
				if (domain?.status() == StorageDomainStatus.MAINTENANCE ||
					domain?.status() == StorageDomainStatus.PREPARING_FOR_MAINTENANCE)
					connection.activeAttachedStorageDomainFromDataCenter(dataCenterId, id)
				do {
					Thread.sleep(5000L)
					domain = connection.findAttachedStorageDomainFromDataCenter(dataCenterId, id)
				} while (domain?.status() != StorageDomainStatus.ACTIVE)
				message.text = "스토리지 도메인 활성 모드 완료(${domain.name()})"
				message.style = "success"
			} catch (e: Exception) {
				e.printStackTrace()
				message.text = "스토리지 도메인 활성 모드 실패(${domain?.name()})"
				message.style = "error"
			}
			websocketService.notify(message)
			websocketService.reload(message, "domains")
		}
	}

	override fun retrieveStorageDomain(id: String): StorageDomainVo? {
		log.info("... retrieveStorageDomain('$id')")
		val connection: Connection = adminConnectionService.getConnection()
		val storageDomain: StorageDomain
		= connection.findStorageDomain(id)
		val storageDomainVo = StorageDomainVo()
		storageDomainVo.id = storageDomain.id()
		storageDomainVo.name = storageDomain.name()
		storageDomainVo.type = storageDomain.type().name
		if (storageDomain.statusPresent()) storageDomainVo.status = storageDomain.status().value()
		storageDomainVo.comment = storageDomain.comment()
		storageDomainVo.description = storageDomain.description()
		storageDomainVo.diskFree = storageDomain.available()
		storageDomainVo.diskUsed = storageDomain.used()
		storageDomainVo.storageFormat = storageDomain.storageFormat().name
		if (storageDomain.storagePresent() && storageDomain.storage().addressPresent()) {
			storageDomainVo.storageAddress = storageDomain.storage().address()
		} else if (storageDomain.storagePresent() && !storageDomain.storage().addressPresent()) {
			storageDomainVo.storageAddress = "Domain ID"
		}
		if (storageDomain.storagePresent() && storageDomain.storage().pathPresent()) {
			storageDomainVo.storagePath = storageDomain.storage().path()
		} else if (storageDomain.storagePresent() && !storageDomain.storage().addressPresent()) {
			storageDomainVo.storagePath = storageDomain.id()
		}
		storageDomainVo.storageType = storageDomain.storage().type().name
		storageDomainVo.storageDomainUsages = retrieveStorageDomainUsage(id)
		storageDomainVo.diskVoList = disksService.retrieveDisks(storageDomain.name())
		if (storageDomain.type().name == StorageDomainType.ISO.name) {
			val files =
				connection.findAllFilesFromStorageDomain(id)
			storageDomainVo.imageFileList = files.stream().map { e: File ->
				val imageFile = ImageFileVo()
				imageFile.id = e.id()
				imageFile.name = e.name()
				imageFile
			}.collect(Collectors.toList())
		}
		val vmList = connection.findAllVms("")
		val format = SimpleDateFormat("yyyy-MM-dd hh:mm:ss")
		val attaachedVmList = vmList.stream().filter { vm: Vm ->
			connection.findAllDiskAttachmentsFromVm(vm.id()).isNotEmpty()
		}.map { vm: Vm ->
			val attachedVm = VmVo()
			attachedVm.id = connection.findAllDiskAttachmentsFromVm(vm.id()).first().id()
			attachedVm.name = vm.name()
			val cdateLong =
				connection.findAllSnapshotsFromVm(vm.id()).first().date().time
			attachedVm.cdate = format.format(cdateLong)
			attachedVm
		}.collect(Collectors.toList())
		val snapshots = connection.findAllDiskSnapshotsFromStorageDomain(id)
		val diskSnapshotVoList: MutableList<DiskVo> = ArrayList()
		snapshots.forEach(Consumer { snapshot: DiskSnapshot ->
			val diskSnapshotVo = DiskVo()
			diskSnapshotVo.id = snapshot.id()
			diskSnapshotVo.status = snapshot.status().name
			diskSnapshotVo.actualSize = snapshot.actualSize().toString()
			diskSnapshotVo.description = snapshot.description()
			diskSnapshotVo.name = snapshot.name()
			diskSnapshotVo.type = snapshot.contentType().toString()
			for ((id1, name, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, cdate) in attaachedVmList) {
				if (id1 == snapshot.disk().id()) {
					diskSnapshotVo.attachedTo = name
					diskSnapshotVo.cdate = cdate
				}
			}
			diskSnapshotVoList.add(diskSnapshotVo)
		})
		storageDomainVo.diskSnapshotVoList = diskSnapshotVoList
		return storageDomainVo
	}

	override fun retrieveCreateDomainInfo(storageDomainId: String): StorageDomainCreateVo? {
		log.info("... retrieveCreateDomainInfo('${storageDomainId}')")
		val c: Connection = adminConnectionService.getConnection()
		val storageDomain = c.findStorageDomain(storageDomainId)
		val storageDomainCreateVo = StorageDomainCreateVo()
		storageDomainCreateVo.id = storageDomainId
		storageDomainCreateVo.name = storageDomain.name()
		storageDomainCreateVo.description = storageDomain.description()
		storageDomainCreateVo.domainType = storageDomain.type().name.lowercase(Locale.getDefault())
		storageDomainCreateVo.path = "${storageDomain.storage().address()}:${storageDomain.storage().path()}"
		storageDomainCreateVo.storageType = storageDomain.storage().type().name
		if (StorageType.ISCSI.value().equals(storageDomain.storage().type().name, ignoreCase = true)) {
			val iscsiVo = IscsiVo()
			iscsiVo.address = storageDomain.storage().volumeGroup().logicalUnits()[0].address()
			iscsiVo.port = storageDomain.storage().volumeGroup().logicalUnits()[0].port().toString()
			iscsiVo.target = storageDomain.storage().volumeGroup().logicalUnits()[0].target()
			storageDomainCreateVo.iscsi = iscsiVo
		}
		return storageDomainCreateVo
	}

	override fun retrieveStorageDomainUsage(storageDomainId: String): List<List<String>> {
		log.info("... retrieveStorageDomainUsage('${storageDomainId}')")
		val storageDomainUsageVoList =
			domainsDao.retrieveStorageDomainUsage(storageDomainId)
		return storageDomainUsageVoList.map { vo: StorageDomainUsageVo ->
			val storageDomain: MutableList<String> = ArrayList()
			storageDomain.add(vo.historyDatetime)
			storageDomain.add((vo.usedDiskSizeGb / (vo.availableDiskSizeGb + vo.usedDiskSizeGb) * 100.0).toString())
			storageDomain
		}
	}

	override fun retrieveDomainEvents(id: String): List<EventVo> {
		log.info("... retrieveDomainEvents('$id')")
		val connection: Connection = adminConnectionService.getConnection()
		val items: List<Event> = connection.findAllEvents("")
		return items.filter { e: Event ->
			e.storageDomainPresent() && id == e.storageDomain().id()
		}.map { it.toEventVo() }
	}

	override fun retrieveHosts(): List<HostDetailVo> {
		log.info("... retrieveHosts")
		val connection: Connection = adminConnectionService.getConnection()
		val hosts = connection.findAllHosts("")
		return hosts.map { e: Host ->
			val hostDetailVo = HostDetailVo()
			hostDetailVo.id = e.id()
			hostDetailVo.name = e.name()
			hostDetailVo
		}
	}

	@Async("karajanTaskExecutor")
	override fun createDomain(storageDomainCreateVo: StorageDomainCreateVo) {
		log.info("... createDomain")
		val connection: Connection = adminConnectionService.getConnection()
		val systemService = connection.systemService()
		val dataCenter: DataCenter = connection.findAllDataCenters().first()
		val dcService = systemService.dataCentersService().dataCenterService(dataCenter.id())
		val host = connection.findHost(storageDomainCreateVo.hostId)
		val message = MessageVo()
		message.title = "스토리지 도메인 생성"
		try {
			var s: StorageDomain
			var sd: StorageDomain? = null
			if (StorageType.NFS.value().equals(storageDomainCreateVo.storageType, ignoreCase = true)) {
				val address: String
				val pathArr =
					storageDomainCreateVo.path.split(":".toRegex())
						.dropLastWhile { it.isEmpty() }
						.toTypedArray()
				val path: String
				if (pathArr.size == 2) {
					address = pathArr[0]
					path = pathArr[1]
				} else {
					return
				}

				val hostStorageBuilder = HostStorageBuilder()
				hostStorageBuilder.type(StorageType.NFS)
				hostStorageBuilder.nfsVersion(NfsVersion.AUTO)
				hostStorageBuilder.address(address)
				hostStorageBuilder.path(path)
				val storageDomainBuilder = StorageDomainBuilder()
				storageDomainBuilder.name(storageDomainCreateVo.name)
				if (storageDomainCreateVo.description.isNotEmpty())
					storageDomainBuilder.description(storageDomainCreateVo.description)
				storageDomainBuilder.type(StorageDomainType.fromValue(storageDomainCreateVo.domainType))
				storageDomainBuilder.host(Builders.host().name(host!!.name()))
				storageDomainBuilder.storage(hostStorageBuilder)
				sd = connection.addStorageDomain(storageDomainBuilder.build())
			} else if (StorageType.ISCSI.value().equals(storageDomainCreateVo.storageType, ignoreCase = true)) {
				val list = connection.findAllStoragesFromHost(storageDomainCreateVo.hostId)
				val hostStorageBuilder = HostStorageBuilder()
					.type(StorageType.ISCSI)
					.target(storageDomainCreateVo.iscsi!!.target)
					.address(storageDomainCreateVo.iscsi!!.address)
					.port(storageDomainCreateVo.iscsi!!.port.toInt())
					.logicalUnits(list[list.size - 1].logicalUnits())
					.overrideLuns(true)
				if (!storageDomainCreateVo.iscsi!!.id.isEmpty()) hostStorageBuilder.username(storageDomainCreateVo.iscsi!!.id)
				if (!storageDomainCreateVo.iscsi!!.password.isEmpty()) hostStorageBuilder.password(
					storageDomainCreateVo.iscsi!!.password
				)
				val storageDomainBuilder = StorageDomainBuilder()
				storageDomainBuilder.name(storageDomainCreateVo?.name)
				if (!storageDomainCreateVo?.description.isNullOrBlank()) storageDomainBuilder.description(
					storageDomainCreateVo?.description
				)
				storageDomainBuilder.type(StorageDomainType.fromValue(storageDomainCreateVo.domainType))
				storageDomainBuilder.host(Builders.host().name(host!!.name()))
				storageDomainBuilder.discardAfterDelete(false)
				storageDomainBuilder.supportsDiscard(false)
				storageDomainBuilder.backup(false)
				storageDomainBuilder.wipeAfterDelete(false)
				storageDomainBuilder.storage(hostStorageBuilder)
				sd = connection.addStorageDomain(storageDomainBuilder.build())
			} else if (StorageType.FCP.value().equals(storageDomainCreateVo.storageType, ignoreCase = true)) {
				val hostStorageBuilder = HostStorageBuilder()
				val storageDomainBuilder = StorageDomainBuilder()
				hostStorageBuilder.type(StorageType.FCP)
				val lunVos = storageDomainCreateVo.lunVos
				val logicalUnitList: MutableList<LogicalUnit> = ArrayList()
				lunVos.forEach { (id, size, path, _, productId): LunVo ->
					val logicalUnitContainer = LogicalUnitContainer()
					logicalUnitContainer.id(id)
					logicalUnitContainer.paths(BigInteger(path))
					logicalUnitContainer.productId(productId)
					logicalUnitContainer.serial(productId)
					logicalUnitContainer.size(BigInteger(size))
					logicalUnitList.add(logicalUnitContainer)
				}
				hostStorageBuilder.logicalUnits(logicalUnitList)
				storageDomainBuilder.storage(hostStorageBuilder)
				storageDomainBuilder.name(storageDomainCreateVo.name)
				storageDomainBuilder.type(StorageDomainType.fromValue(storageDomainCreateVo.domainType))
				storageDomainBuilder.host(Builders.host().name(host!!.name()))
				sd = connection.addStorageDomain(storageDomainBuilder.build())
			}
			do {
				try { Thread.sleep(2000L) } catch (ie: InterruptedException) { log.error(ie.localizedMessage) }
				s = connection.findStorageDomain(sd!!.id())
			} while (s.status() != StorageDomainStatus.UNATTACHED)
			val attachedSdsService = dcService.storageDomainsService()
			try {
				attachedSdsService.add()
					.storageDomain(
						Builders.storageDomain().id(sd.id()).dataCenter(DataCenterBuilder().id(dataCenter.id()))
					)
					.send()
			} catch (e: Exception) {
				e.printStackTrace()
			}
			do {
				try { Thread.sleep(2000L) } catch (ie2: InterruptedException) { log.error(ie2.localizedMessage) }
				sd = connection.findAttachedStorageDomainFromDataCenter(dataCenter.id(), sd!!.id())
			} while (sd!!.status() != StorageDomainStatus.ACTIVE)
			message.text = "스토리지 도메인 생성 성공(${storageDomainCreateVo.name})"
			message.style = "success"
		} catch (e: Exception) {
			e.printStackTrace()
			message.text = "스토리지 도메인 생성 실패(${storageDomainCreateVo.name})"
			message.style = "error"
		}
		websocketService.notify(message)
		websocketService.reload(message, "domains")
	}

	@Async("karajanTaskExecutor")
	override fun updateDomain(storageDomainCreateVo: StorageDomainCreateVo) {
		log.info("... updateDomain")
		val connection: Connection = adminConnectionService.getConnection()
		val message = MessageVo()
		message.title = "스토리지 도메인 편집"
		try {
			val sdb = StorageDomainBuilder()
			sdb.name(storageDomainCreateVo.name)
			sdb.description(storageDomainCreateVo.description)
			connection.updateStorageDomain(storageDomainCreateVo.id, sdb.build())
			message.text = "스토리지 도메인 편집 완료(" + storageDomainCreateVo.name + ")"
			message.style = "success"
		} catch (e: Exception) {
			e.printStackTrace()
			message.text = "스토리지 도메인 편집 실패(" + storageDomainCreateVo!!.name + ")"
			message.style = "error"
		}
		try {
			Thread.sleep(1000L)
		} catch (interruptedException: InterruptedException) {
			log.error(interruptedException.localizedMessage)
		}
		websocketService.notify(message)
		websocketService.reload(message, "domains")
	}

	@Async("karajanTaskExecutor")
	override fun removeDomain(storageDomainVo: StorageDomainVo) {
		log.info("... removeDomain")
		val c: Connection = adminConnectionService.getConnection()
		val message = MessageVo()
		message.title = "스토리지 도메인 삭제"
		var sd: StorageDomain? =
			c.findStorageDomain(storageDomainVo.id)
		val dataCenterId: String =
			c.findAllDataCenters().first().id()
		try {
			if (sd?.dataCenters() != null && sd.dataCenters().size != 0) {
				sd = c.findAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainVo.id)
				if (!StorageDomainStatus.MAINTENANCE.value().equals(sd?.status()?.value(), ignoreCase = true)) return
				try {
					c.removeAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainVo.id)
				} catch (e: Exception) {
					log.error(e.localizedMessage)
					e.printStackTrace()
				}
			}
			do {
				doSleep(2000L)
				sd =
					c.findAttachedStorageDomainFromDataCenter(dataCenterId, storageDomainVo.id)
			} while (sd?.status() != StorageDomainStatus.UNATTACHED)

			try {
				doSleep(3000L)
				c.removeStorageDomain(storageDomainVo.id, storageDomainVo.format)
			} catch (e: Exception) {
				log.error(e.localizedMessage)
				e.printStackTrace()
			}
			doSleep(2000L)
			message.text = "스토리지 도메인 삭제 완료(${sd.name()})"
			message.style = "success"
		} catch (e: Exception) {
			e.printStackTrace()
			message.text = "스토리지 도메인 삭제 실패(${sd?.name()})"
			message.style = "error"
		}
		websocketService.notify(message)
		websocketService.reload(message, "domains")
	}

	override fun iscsiDiscover(vo: StorageDomainCreateVo): List<String> {
		log.info("... iscsiDiscover")
		val connection: Connection =
			adminConnectionService.getConnection()
		val iscsisDiscovered: List<String> = connection.findAllIscsiTargetsFromHost(vo.hostId,
			Builders.iscsiDetails()
				.address(vo.iscsi?.address)
				.port(vo.iscsi?.port?.toInt())
				.build()
		)
		// TODO: 4.5.1 이후 IscsiDetail이 사라짐
		return iscsisDiscovered
	}

	override fun iscsiLogin(vo: StorageDomainCreateVo): Boolean {
		log.info("... iscsiLogin")
		val connection: Connection = adminConnectionService.getConnection()
		val systemService = connection.systemService()
		val hostService = systemService.hostsService().hostService(vo.hostId)
		try {
			hostService.iscsiLogin()
				.iscsi(
					Builders.iscsiDetails().address(vo.iscsi?.address)
						.port(vo.iscsi?.port?.toInt())
						.target(vo.iscsi?.target)
				)
				.send()
		} catch (e: Exception) {
			return false
		}
		return true
	}
	
	companion object {
		private val log by LoggerDelegate()
	}
}
