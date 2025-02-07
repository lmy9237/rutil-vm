package com.itinfo.service.impl

import com.itinfo.gson
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.doCloseAll

import com.itinfo.ItInfoConstant
import com.itinfo.findAllDisks
import com.itinfo.findAllVms
import com.itinfo.findAllDiskAttachmentsFromVm

import com.itinfo.findStorageDomain
import com.itinfo.findDisk

import com.itinfo.addDisk
import com.itinfo.removeDisk
import com.itinfo.moveDisk
import com.itinfo.copyDisk

import com.itinfo.model.MessageVo
import com.itinfo.model.MessageType
import com.itinfo.model.DiskVo
import com.itinfo.model.toDisk
import com.itinfo.model.toDiskVos
import com.itinfo.model.DiskCreateVo
import com.itinfo.model.toDisk4Lun
import com.itinfo.model.DiskMigrationVo

import com.itinfo.service.DisksService
import com.itinfo.service.engine.AdminConnectionService
import com.itinfo.service.engine.ConnectionService
import com.itinfo.service.engine.WebsocketService

import org.ovirt.engine.sdk4.builders.DiskBuilder
import org.ovirt.engine.sdk4.internal.containers.ImageContainer
import org.ovirt.engine.sdk4.internal.containers.ImageTransferContainer
import org.ovirt.engine.sdk4.types.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

import java.io.*
import java.io.File
import java.net.MalformedURLException
import java.net.URL
import java.nio.file.Files
import java.nio.file.Paths
import java.security.KeyManagementException
import java.security.KeyStore
import java.security.NoSuchAlgorithmException
import java.security.SecureRandom
import java.security.cert.CertificateException
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import java.text.DecimalFormat
import java.util.*
import java.util.function.Consumer
import javax.net.ssl.*
import kotlin.math.floor


@Service
class DisksServiceImpl : DisksService {
	@Autowired private lateinit var adminConnectionService: AdminConnectionService
	@Autowired private lateinit var websocketService: WebsocketService
	@Autowired private lateinit var connectionService: ConnectionService

	override fun retrieveDisks(): List<DiskVo> {
		log.info("... retrieveDisks")
		val c = adminConnectionService.getConnection()
		val disks: List<Disk> = c.findAllDisks()
		val vms: List<Vm> = c.findAllVms()
		val vmDiskIdMap: MutableMap<String, String> = HashMap()
		vms.forEach(Consumer<Vm> { vm: Vm ->
			val diskAttachments: List<DiskAttachment> =
				c.findAllDiskAttachmentsFromVm(vm.id())
			diskAttachments.forEach(Consumer { att: DiskAttachment ->
				vmDiskIdMap[att.id()] = vm.name()
			})
		})
		val diskVoList = disks.toDiskVos(c, arrayListOf()).toMutableList()
		for (disk in disks) {
			val diskVo = DiskVo()
			diskVo.id = disk.id()
			diskVo.name = disk.name()
			diskVo.description = disk.description()
			diskVo.type = disk.storageType().name
			diskVo.sharable = disk.shareable()
			if (disk.provisionedSizePresent()) {
				diskVo.virtualSize = disk.provisionedSize().toString()
			} else if (disk.provisionedSize() == null && disk.storageType().name == "LUN") {
				diskVo.virtualSize = disk.lunStorage().logicalUnits()[0].size().toString()
			}
			diskVo.status = if (disk.statusPresent()) disk.status().value() else "ok"
			if (disk.storageDomains() != null && disk.storageDomains().size > 0) {
				diskVo.storageDomainId = disk.storageDomains()[0].id()
				val storageDomainName: String =
					c.findStorageDomain(diskVo.storageDomainId).name()
				diskVo.storageDomainName = storageDomainName
			}
			if (vmDiskIdMap.containsKey(disk.id())) diskVo.attachedTo = vmDiskIdMap[disk.id()]!!
			diskVoList.add(diskVo)
		}
		return diskVoList
	}

	override fun retrieveDisks(storageDomainName: String): List<DiskVo> {
		log.info("... retrieveDisks('{}')", storageDomainName)
		val c = adminConnectionService.getConnection()
		val disks: List<Disk> = c.findAllDisks(" Storage=$storageDomainName")
		val vms: List<Vm> = c.findAllVms()
		val vmDiskIdMap: MutableMap<String, String> = HashMap()
		vms.forEach { vm: Vm ->
			val diskAttachments: List<DiskAttachment> =
				c.findAllDiskAttachmentsFromVm(vm.id())
			diskAttachments.forEach{ att: DiskAttachment ->
				vmDiskIdMap[att.id()] = vm.name()
			}
		}
		val diskVoList = disks.toDiskVos(c, arrayListOf()).toMutableList()
		for (disk in disks) {
			val diskVo = DiskVo()
			diskVo.id = disk.id()
			diskVo.name = disk.name()
			diskVo.description = disk.description()
			diskVo.type = disk.storageType().name
			diskVo.sharable = disk.shareable()
			diskVo.actualSize = disk.actualSize().toString()
			diskVo.virtualSize = disk.provisionedSize().toString()
			diskVo.status = disk.status().value()
			if (vmDiskIdMap.containsKey(disk.id())) diskVo.attachedTo = vmDiskIdMap[disk.id()]!!
			diskVoList.add(diskVo)
		}
		return diskVoList
	}

	override fun createDisk(diskCreateVo: DiskCreateVo) {
		log.info("... createDisk")
		val c = adminConnectionService.getConnection()
		var disk: Disk?
		var message: MessageVo
		try {
			/*
			DiskBuilder diskBuilder = new DiskBuilder()
					.name(diskCreateVo.getName())
					.description(diskCreateVo.getDescription())
					.format(diskCreateVo.getShareable() ? DiskFormat.RAW : DiskFormat.COW)
					.shareable(diskCreateVo.getShareable())
					.wipeAfterDelete(diskCreateVo.getWipeAfterDelete())
					.provisionedSize(BigInteger.valueOf(Integer.parseInt(diskCreateVo.getSize())).multiply(BigInteger.valueOf(2L).pow(30)))
					.storageDomains(storageDomain);
			*/
			disk = c.addDisk(diskCreateVo.toDisk(c))
			if (disk != null) {
				do {
					try {
						Thread.sleep(5000L)
					} catch (e: InterruptedException) {
						log.error(e.localizedMessage)
					}
					if (disk!!.idPresent()) disk = c.findDisk(disk.id())
				} while (disk!!.status() != DiskStatus.OK)
			}
			message = MessageVo.createMessage(MessageType.DISK_ADD, true, diskCreateVo.name, "")
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			message = MessageVo.createMessage(MessageType.DISK_ADD, false, diskCreateVo.name, e.localizedMessage)
		}
		websocketService.notify(message)
		websocketService.reload(message, "disks")
	}

	@Async("karajanTaskExecutor")
	override fun createLunDisk(diskCreateVo: DiskCreateVo) {
		log.info("... createLunDisk")
		val c = adminConnectionService.getConnection()
		var message: MessageVo = MessageVo()
		val disk: Disk?
		try {
			/*
			DiskBuilder diskBuilder = new DiskBuilder()
				.alias(diskCreateVo.getName())
				.description(diskCreateVo.getDescription())
				.shareable(diskCreateVo.getShareable());
			HostStorageBuilder lunStorage = new HostStorageBuilder();
			for (HostStorage lun : luns) {
				if (lun.id().equals(diskCreateVo.getLunId())) {
					LogicalUnitBuilder logicalUnitBuilder = new LogicalUnitBuilder()
						.id(diskCreateVo.getLunId())
						.lunMapping((lun.logicalUnits().get(0)).lunMapping())
						.productId((lun.logicalUnits().get(0)).productId())
						.serial((lun.logicalUnits().get(0)).serial())
						.size((lun.logicalUnits().get(0)).size())
						.vendorId((lun.logicalUnits().get(0)).vendorId());

					HostBuilder hostBuilder = new HostBuilder()
						.id(diskCreateVo.getHostId());

					lunStorage.host(hostBuilder);
					lunStorage.type(StorageType.FCP);
					lunStorage.logicalUnits(logicalUnitBuilder);
					diskBuilder.lunStorage(lunStorage);
					break;
				}
			}
			*/
			disk = c.addDisk(diskCreateVo.toDisk4Lun(c))
			if (disk != null) message = MessageVo.createMessage(MessageType.DISK_ADD, true, disk.name(), "")
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			message = MessageVo.createMessage(MessageType.DISK_ADD, false, diskCreateVo.name, e.localizedMessage)
		}
		websocketService.notify(message)
		websocketService.reload(message, "disks")
	}

	@Async("karajanTaskExecutor")
	override fun removeDisk(diskIds: List<String>) {
		log.info("... removeDisk")
		val c = adminConnectionService.getConnection()
		var message: MessageVo = MessageVo()
		var diskName = ""
		for (diskId in diskIds) {
			try {
				val disk: Disk = c.findDisk(diskId)
				diskName = disk.name()
				val res: Boolean = c.removeDisk(diskId)
				message = MessageVo.createMessage(MessageType.DISK_REMOVE, res, diskName, "")
			} catch (e: Exception) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				message = MessageVo.createMessage(MessageType.DISK_REMOVE, false, diskName, e.localizedMessage)
			}
			try {
				Thread.sleep(1000L)
			} catch (e: InterruptedException) {
				e.localizedMessage
			}
			websocketService.notify(message)
			websocketService.reload(message, "disks")
		}
	}

	@Async("karajanTaskExecutor")
	override fun migrationDisk(diskMigrationVo: DiskMigrationVo) {
		log.info("... migrationDisk")
		val c = adminConnectionService.getConnection()
		if (!("move".equals(diskMigrationVo.migrationType, ignoreCase = true) ||
			"copy".equals(diskMigrationVo.migrationType, ignoreCase = true))
		) {
			log.error("처리 보류 ... 찾을 수 없는 디스크 처리 행위 ... migrationType: " + diskMigrationVo.migrationType)
			return
		}

		var message: MessageVo
		var disk: Disk? = null
		var res = false
		try {
			val target: StorageDomain =
				c.findStorageDomain(diskMigrationVo.targetStorageDomainId)
			if ("move".equals(diskMigrationVo.migrationType, ignoreCase = true)) {
				res = c.moveDisk(diskMigrationVo.disk.id, target)
			} else if ("copy".equals(diskMigrationVo.migrationType, ignoreCase = true)) {
				val disk2copy = DiskBuilder().name(diskMigrationVo.targetDiskName).build()
				res = c.copyDisk(diskMigrationVo.disk.id, disk2copy, target)
			}
			do {
				try {
					Thread.sleep(5000L)
				} catch (e: InterruptedException) {
					log.error(e.localizedMessage)
				}
				disk = c.findDisk(diskMigrationVo.disk.id)
			} while (disk!!.status() != DiskStatus.OK)
			message = MessageVo.createMessage(
				if ("move".equals(
						diskMigrationVo.migrationType,
						ignoreCase = true
					)
				) MessageType.DISK_MOVE else MessageType.DISK_COPY,
				res, disk.name(), ""
			)
		} catch (e: Exception) {
			log.error(e.localizedMessage)
			e.printStackTrace()
			message = MessageVo.createMessage(
				if ("move".equals(
						diskMigrationVo.migrationType,
						ignoreCase = true
					)
				) MessageType.DISK_MOVE else MessageType.DISK_COPY,
				res, disk!!.name(), e.localizedMessage
			)
		}
		try {
			Thread.sleep(1000L)
		} catch (e: InterruptedException) {
			e.localizedMessage
		}
		websocketService.notify(message)
		websocketService.reload(message, "disks")
	}

	@Async("karajanTaskExecutor")
	override fun uploadDisk(bytes: ByteArray, diskCreateVo: DiskCreateVo, `is`: InputStream, diskSize: Long) {
		log.info("... uploadDisk")
		val connection = adminConnectionService.getConnection()
		val systemService = connection.systemService()
		val storageDomain =
			systemService.storageDomainsService().storageDomainService(diskCreateVo.storageDomainId).get().send()
				.storageDomain()
		val disksService = systemService.disksService()
		val message = MessageVo()
		try {
			val diskBuilder = DiskBuilder()
			diskBuilder.name(diskCreateVo.name)
			diskBuilder.description(diskCreateVo.description)
			if ("qcow2" == diskCreateVo.format) {
				diskBuilder.format(if (diskCreateVo.shareable) DiskFormat.RAW else DiskFormat.COW)
			} else {
				diskBuilder.format(DiskFormat.RAW)
			}
			diskBuilder.shareable(diskCreateVo.shareable)
			diskBuilder.wipeAfterDelete(diskCreateVo.wipeAfterDelete)
			if ("qcow2" != diskCreateVo.format) {
				diskBuilder.provisionedSize(diskSize)
			} else if ("qcow2" == diskCreateVo.format) {
				diskBuilder.provisionedSize(diskCreateVo.virtualSize)
			}
			diskBuilder.storageDomains(storageDomain)
			val disk = disksService.add().disk(diskBuilder).send().disk()
			do {
				Thread.sleep(3000L)
			} while (disksService.diskService(disk.id()).get().send().disk().status() != DiskStatus.OK)
			message.title = disk.id()
			message.text = "업로드 준비 중 ..."
			websocketService.sendMessage("/topic/disks/uploadDisk", gson.toJson(message))
			val transfersService = systemService.imageTransfersService()
			val transfer2 = ImageTransferContainer()
			val image = ImageContainer()
			image.id(disk.id())
			transfer2.image(image)
			val transfer = transfersService.add().imageTransfer(transfer2).send().imageTransfer()
			while (true) {
				Thread.sleep(1000L)
				if (transfer.phase() != ImageTransferPhase.INITIALIZING) {
					transfersService.imageTransferService(transfer.id()).get()
					if (transfer.transferUrl() != null) {
						val url = URL(transfer.transferUrl())
						requestVfrontConnection(url, bytes)
						setTrustStore()
						System.setProperty("sun.net.http.allowRestrictedHeaders", "true")
						val https = url.openConnection() as HttpsURLConnection
						https.setRequestProperty("PUT", url.path)
						log.info("length = $diskSize")
						https.setRequestProperty("Content-Length", diskSize.toString())
						https.setRequestMethod("PUT")
						https.setFixedLengthStreamingMode(diskSize)
						https.setDoOutput(true)
						https.connect()
						Thread.sleep(2000L)
						val os = https.outputStream
						val buf = ByteArray(131072)
						var read = 0L
						val form = DecimalFormat("#.#")
						message.title = disk.id()
						message.text = "업로드 중 ..."
						do {
							val readNow = `is`.read(buf)
							os.write(buf, 0, readNow)
							os.flush()
							read += readNow.toLong()
							if (floor(read * 100.0 / diskSize) != form.format(read * 100.0 / diskSize)
									.toDouble()
							) continue
							message.title = disk.id()
							message.text = (read * 100.0 / diskSize).toInt().toString() + "%"
							websocketService.sendMessage("/topic/disks/uploadDisk", gson.toJson(message))
						} while (read < diskSize)
						val responseCode = https.getResponseCode()
						if (responseCode == ItInfoConstant.STATUS_OK) {
							message.title = disk.id()
							message.text = "완료"
							websocketService.sendMessage("/topic/disks/uploadDisk", gson.toJson(message))
						}
						`is`.close()
						os.close()
						val transferService = systemService.imageTransfersService().imageTransferService(transfer.id())
						transferService.finalize_().send()
						https.disconnect()
						connection.close()
						message.title = "디스크 업로드"
						message.text = diskCreateVo.name + "디스크 업로드 완료"
						message.style = "success"
					}
				} else {
					continue
				}
				websocketService.notify(message)
				websocketService.reload(message, "disks")
				return
			}
		} catch (e: Exception) {
			e.fillInStackTrace()
			log.debug(e.localizedMessage)
			message.title = "디스크 업로드"
			message.text = diskCreateVo.name + "디스크 업로드 실패"
			message.style = "error"
		}
		websocketService.notify(message)
		websocketService.reload(message, "disks")
	}

	@Throws(IOException::class)
	override fun retrieveDiskImage(file: File): String {
		log.info("... retrieveDiskImage")
		return ""
	}

	companion object {
		private val log by LoggerDelegate()
		@Throws(Exception::class)
		fun setTrustStore() {
			log.info("... setTrustStore")
			val path = System.getProperty("user.dir")
			log.info("path는 ... $path")
			val trustManagerFactory = TrustManagerFactory.getInstance("X509")
			val keystore = KeyStore.getInstance(KeyStore.getDefaultType())
			val `is` = Files.newInputStream(Paths.get("../webapps/ROOT/WEB-INF/cert.pem"))
			val message = MessageVo()
			message.title = "cert.pem"
			val cf = CertificateFactory.getInstance("X.509")
			val caCert = cf.generateCertificate(`is`) as X509Certificate
			val tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
			val ks = KeyStore.getInstance(KeyStore.getDefaultType())
			ks.load(null)
			ks.setCertificateEntry("caCert", caCert)
			tmf.init(ks)
			val sslContext = SSLContext.getInstance("TLS")
			sslContext.init(null, tmf.trustManagers, null)
			SSLContext.setDefault(sslContext)
		}

		@Throws(InterruptedException::class)
		fun requestVfrontConnection(url: URL, bytes: ByteArray): String? {
			log.info("... requestVfrontConnection('$url')")
			var conn: HttpsURLConnection? = null
			var outputStream: OutputStream? = null
			var inputStream: InputStream? = null
			var bufferedReader: BufferedReader? = null
			var resultString: String? = null
			var sslContext: SSLContext? = null
			try {
				val hostnameVerifier = HostnameVerifier { arg0, arg1 -> true }
				val trustManager = arrayOf<TrustManager>(object : X509TrustManager {
					override fun getAcceptedIssuers(): Array<X509Certificate> {
						return arrayOf()
					}

					@Throws(CertificateException::class)
					override fun checkServerTrusted(arg0: Array<X509Certificate>, arg1: String) {
					}

					@Throws(CertificateException::class)
					override fun checkClientTrusted(arg0: Array<X509Certificate>, arg1: String) {
					}
				})
				sslContext = SSLContext.getInstance("TLS")
				sslContext.init(null, trustManager, SecureRandom())
				HttpsURLConnection.setDefaultHostnameVerifier(hostnameVerifier)
				HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.socketFactory)
				conn = url.openConnection() as HttpsURLConnection
				conn.setDoInput(true)
				conn!!.setDoOutput(true)
				conn.setRequestMethod("PUT")
				conn.setConnectTimeout(2000)
				outputStream = conn.outputStream
				outputStream.write(bytes[0].toInt())
				outputStream.flush()
				outputStream.close()
				inputStream = conn.inputStream
				bufferedReader = BufferedReader(InputStreamReader(inputStream, "UTF-8"))
				var buf = ""
				var resultBuf = ""
				while (bufferedReader.readLine().also { buf = it } != null) resultBuf = resultBuf + buf
				resultString = resultBuf
				log.info("##################################")
				log.info("res chk     :$resultString")
				bufferedReader.close()
			} catch (e: MalformedURLException) {
				e.printStackTrace()
				log.error(e.localizedMessage)
			} catch (e: KeyManagementException) {
				e.printStackTrace()
				log.error(e.localizedMessage)
			} catch (e: NoSuchAlgorithmException) {
				e.printStackTrace()
				log.error(e.localizedMessage)
			} catch (e: IOException) {
				e.printStackTrace()
				log.error(e.localizedMessage)
				return "timeout"
			} finally {
				Arrays.asList(bufferedReader, inputStream, outputStream).doCloseAll()
				try {
					conn?.disconnect()
				} catch (e: Exception) {
					log.error(e.localizedMessage)
				}
			}
			Thread.sleep(2000L)
			return resultString
		}
	}
}
