package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.VmViewVo
import com.itinfo.rutilvm.api.model.computing.toDiskVms
import com.itinfo.rutilvm.api.model.fromTemplateCdromsToIdentifiedVos
import com.itinfo.rutilvm.api.model.fromVmCdromsToIdentifiedVos
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.services.ImageTransferService
import org.ovirt.engine.sdk4.types.*
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.IOException
import java.net.URL
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.*
import javax.net.ssl.HostnameVerifier
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

interface ItDiskService {

    /**
     * [ItDiskService.findAll]
     * 전체 디스크 목록
     *
     * @return List<[DiskImageVo]> 디스크 목록
     */
    @Throws(Error::class)
    fun findAll(): List<DiskImageVo>
    /**
     * [ItDiskService.findAllId]
     * 전체 디스크 목록 (아이디 이름만 뜨게)
     *
     * @return List<[DiskImageVo]> 디스크 아이디 목록
     */
    @Throws(Error::class)
    fun findAllId(): List<DiskImageVo>


	/**
	 * [ItDiskService.findAllCdRomsFromDisk]
	 * 디스크가 가진 cdrom정보
	 *
	 * @param diskId [String] 디스크 id
	 * @return List<[IdentifiedVo]> 디스크 아이디 목록
	 */
	@Throws(Error::class)
	fun findAllCdRomsFromDisk(diskId: String): List<IdentifiedVo>
    /**
     * [ItDiskService.findOne]
     * 디스크 정보
     *
     * @param diskId [String] 디스크 id
     * @return [DiskImageVo]?
     */
    @Throws(Error::class)
    fun findOne(diskId: String): DiskImageVo?

    // 디스크 생성창 - 이미지 데이터센터 목록 [ItDataCenterService.findAll]

    /**
     * [ItDiskService.findAllDomainsFromDataCenter]
     * 디스크 이미지 생성창
     * 디스크 생성 - 이미지 도메인 목록
     * 디스크 복사
     * 단순 데이터센터 내부에있는 스토리지 도메인을 선택하기 위해 존재
     *
     * @param dataCenterId [String]
     * @return List<[StorageDomainVo]> 스토리지 도메인 목록
     */
    @Throws(Error::class)
    fun findAllDomainsFromDataCenter(dataCenterId: String): List<StorageDomainVo>
    /**
     * [ItDiskService.findAllDiskProfilesFromStorageDomain]
     * 디스크 생성 - 이미지프로파일 목록
     * 디스크 복사
     *
     * @param storageDomainId [String]
     * @return [List]<[DiskProfileVo]> 디스크 프로파일 목록
     */
    @Throws(Error::class)
    fun findAllDiskProfilesFromStorageDomain(storageDomainId: String): List<DiskProfileVo>
    /**
     * [ItDiskService.add]
     * 디스크 생성 (이미지)
     * 가상 디스크 생성 - Lun, 관리되는 블록 제외
     * ovirt에서 dc정보는 스토리지 도메인을 파악하기 위해있음
     *
     * @param image [DiskImageVo] 이미지 객체
     * @return [Res]<[Boolean]> 201 (create), 404(fail)
     */
    @Throws(Error::class)
    fun add(image: DiskImageVo): DiskImageVo?
    /**
     * [ItDiskService.update]
     * 디스트 편집
     *
     * @param image [DiskImageVo] 이미지 생성
     * @return [DiskImageVo]
     */
    @Throws(Error::class)
    fun update(image: DiskImageVo): DiskImageVo?
    /**
     * [ItDiskService.remove]
     * 디스크 삭제
     *
     * @param diskId [String] 디스크 ID
     * @return [Boolean] 성공여부
     */
    @Throws(Error::class)
    fun remove(diskId: String): Boolean
    // /**
    //  * [ItDiskService.removeMultiple]
    //  * 디스크 삭제
    //  *
    //  * @param diskIdList List<[String]> 디스크 ID 리스트
    //  * @return [Boolean] 성공여부
    //  */
    // @Throws(Error::class)
    // fun removeMultiple(diskIdList: List<String>): List<Boolean>


    /**
     * [ItDiskService.findAllStorageDomainsToMoveFromDisk]
     * 디스크 이동- 창
     * ItDiskService.findAllStorageDomainsFromDataCenter 에서 disk가 가지고있는 스토리지도메인은 제외
     *
     * @param diskId [String] 디스크 ID
     * @return List<[StorageDomainVo]>
     */
    @Throws(Error::class)
    fun findAllStorageDomainsToMoveFromDisk(diskId: String): List<StorageDomainVo>
    /**
     * [ItDiskService.move]
     * 디스크 이동
     *
     * @param diskId [String] 디스크 아이디
     * @param storageDomainId [String] 도메인 아이디
     * @return [Boolean] 성공여부
     */
    @Throws(Error::class)
    fun move(diskId: String, storageDomainId: String): Boolean
    /**
     * [ItDiskService.moveMultiple]
     * 디스크 이동
     *
     * @param diskList List<[DiskImageVo>]
     * @return Map<[String], [String]>
     */
    @Throws(Error::class)
    fun moveMultiple(diskList: List<DiskImageVo>): Map<String, String>
    /**
     * [ItDiskService.copy]
     * 디스크 복사
     *
     * @param diskImageVo [DiskImageVo] 디스크 객체
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun copy(diskImageVo: DiskImageVo): Boolean
    /**
     * [ItDiskService.upload]
     * 디스크 이미지 업로드
     * required: provisioned_size, alias, description, wipe_after_delete, shareable, backup, disk_profile.
     * @param file [MultipartFile] 업로드 할 파일
     * @param image [DiskImageVo] 이미지 객체
     * @return [Boolean] 성공여부
     * @throws IOException
     */
    @Throws(Error::class, IOException::class)
    fun upload(file: MultipartFile, image: DiskImageVo): Boolean
    /**
     * [ItDiskService.refreshLun]
     * lun 새로고침
     *
     * @param diskId [String] 도메인 ID
     * @param hostId [String] host Id
     * @return [Boolean]
     */
    @Throws(Error::class)
    fun refreshLun(diskId: String, hostId: String): Boolean

    /**
     * [ItDiskService.findAllVmsFromDisk]
     * 스토리지도메인 - 가상머신
     *
     * @param diskId [String] 도메인 ID
     * @return List<[VmViewVo]> 가상머신
     */
    @Throws(Error::class)
    fun findAllVmsFromDisk(diskId: String): List<VmViewVo>
    /**
     * [ItDiskService.findAllStorageDomainsFromDisk]
     * 스토리지도메인 - 스토리지
     *
     * @param diskId [String] 디스크 ID
     * @return List<[StorageDomainVo]>
     */
    @Throws(Error::class)
    fun findAllStorageDomainsFromDisk(diskId: String): List<StorageDomainVo>

}

@Service
class DiskServiceImpl(
): BaseService(), ItDiskService {
    @Throws(Error::class)
    override fun findAll(): List<DiskImageVo> {
        log.info("findAll ... ")
        val res: List<Disk> = conn.findAllDisks().getOrDefault(emptyList())
            .filter { it.contentType() != DiskContentType.OVF_STORE } // ovf_store 값은 제외하고
        return res.toDiskMenus(conn)
    }

	@Throws(Error::class)
	override fun findAllId(): List<DiskImageVo> {
		log.info("findAllId ... ")
		val res: List<Disk> = conn.findAllDisks().getOrDefault(emptyList())
			.filter { it.contentType() != DiskContentType.OVF_STORE } // ovf_store 값은 제외하고
		return res.toDiskIdNames()
	}

	@Throws(Error::class)
	override fun findAllCdRomsFromDisk(diskId: String): List<IdentifiedVo> {
		log.info("findAllCdRomsFromDisk ... {}", diskId)
		val vms: List<Vm> = conn.findAllVms(follow = "cdroms").getOrDefault(emptyList())
		val temps: List<Template> = conn.findAllTemplates(follow = "cdroms").getOrDefault(emptyList())
		val list: List<IdentifiedVo> = vms.fromVmCdromsToIdentifiedVos(diskId) + temps.fromTemplateCdromsToIdentifiedVos(diskId)
		return list
	}

    @Throws(Error::class)
    override fun findOne(diskId: String): DiskImageVo? {
        log.info("findOne ... diskId: $diskId, disk: $this")
        val res: Disk? = conn.findDisk(diskId).getOrNull()
        // val res: Disk? = conn.findDisk(diskId, follow = "diskprofile.storagedomain").getOrNull()
        return res?.toDiskInfo(conn)
    }

    @Throws(Error::class)
    override fun findAllDomainsFromDataCenter(dataCenterId: String): List<StorageDomainVo> {
        log.info("findAllStorageDomainsFromDataCenter ... dataCenterId: $dataCenterId")
        val res: List<StorageDomain> = conn.findAllAttachedStorageDomainsFromDataCenter(dataCenterId).getOrDefault(emptyList())
            .filter { it.status() == StorageDomainStatus.ACTIVE }
        return res.toStorageDomainSizes()
    }

    @Throws(Error::class)
    override fun findAllDiskProfilesFromStorageDomain(storageDomainId: String): List<DiskProfileVo> {
        log.info("findAllDiskProfilesFromStorageDomain ... domainId: $storageDomainId")
        val res: List<DiskProfile> = conn.findAllDiskProfilesFromStorageDomain(storageDomainId).getOrDefault(emptyList())
        return res.toDiskProfileVos()
    }

    @Throws(Error::class)
    override fun add(image: DiskImageVo): DiskImageVo? {
        log.info("addDisk ... image: $image")
        val res: Disk? = conn.addDisk(
            image.toAddDiskBuilder()
        ).getOrNull()
        return res?.toDiskIdName()
    }

    @Throws(Error::class)
    override fun update(image: DiskImageVo): DiskImageVo? {
        log.info("updateDisk ... image: $image")
        val res: Disk? = conn.updateDisk(
            image.toEditDiskBuilder()
        ).getOrNull()
        return res?.toDiskIdName()
    }

    @Throws(Error::class)
    override fun remove(diskId: String): Boolean {
        log.info("removeDisk ... diskId: $diskId")
        val res: Result<Boolean> = conn.removeDisk(diskId)
        return res.isSuccess
    }

    // override fun removeMultiple(diskIdList: List<String>): List<Boolean> {
    //     log.info("removeMultiple ... diskIdList ... {}", diskIdList)
    //     val res: List<Result<Boolean>> = diskIdList.map { diskId ->
    //         conn.removeDisk(diskId)
    //     }
    //     return res.map { it.isSuccess }
    // }

    @Throws(Error::class)
    override fun findAllStorageDomainsToMoveFromDisk(diskId: String): List<StorageDomainVo> {
        log.info("findAllStorageDomainsToMoveFromDisk ... diskId: $diskId")
        val disk: Disk = conn.findDisk(diskId)
            .getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toException()
        val res: List<StorageDomain> = conn.findAllStorageDomains().getOrDefault(emptyList())
            .filter { it.id() != disk.storageDomains().first().id() }
        return res.toStorageDomainSizes()
    }

    @Throws(Error::class)
    override fun move(diskId: String, storageDomainId: String): Boolean {
        log.info("move ... diskId: $diskId, storageDomainId: $storageDomainId")
        val res: Result<Boolean> = conn.moveDisk(diskId, storageDomainId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun moveMultiple(diskList: List<DiskImageVo>): Map<String, String> {
        log.info("moveMultiple ... diskList: $diskList")
        val result = mutableMapOf<String, String>()

        diskList.forEach { diskImageVo ->
            val diskName: String = conn.findDisk(diskImageVo.id).getOrNull()?.name().toString()
            try{
                val isSuccess = conn.moveDisk(diskImageVo.id, diskImageVo.storageDomainVo.id).isSuccess
                if (isSuccess) {
                    result[diskName] = "Success"
                }
            } catch (ex: Exception) {
                log.error("Failed to move disk: $diskName", ex)
                result[diskName] = "Failure: ${ex.message}" // 실패한 경우 메시지 추가
            }
        }
        return result
    }

    @Throws(Error::class)
    override fun copy(diskImageVo: DiskImageVo): Boolean {
        log.info("copy ... diskName: ${diskImageVo.alias}")

        // disk에 연결된 vm이 up이면 복사 불가능
        val res: Result<Boolean> = conn.copyDisk(
            diskImageVo.id,
            diskImageVo.alias,
            diskImageVo.storageDomainVo.id
        )
        return res.isSuccess
    }

    @Throws(Error::class, IOException::class)
    override fun upload(file: MultipartFile, image: DiskImageVo): Boolean {
        log.info("uploadDisk ... file: {}, image:{}", file.name, image)
        if (file.isEmpty) throw ErrorPattern.FILE_NOT_FOUND.toException() // 파일이 없으면 에러

        // 이미지 업로드해서 imageTransfer.id()를 알아낸다
		val imageTransferId: String = conn.uploadSetDisk(
			image.toUploadDiskBuilder(conn, file.size)
		).getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toException()

        return uploadFileToTransferUrl(file, imageTransferId)
    }

    @Throws(Error::class)
    fun uploadFileToTransferUrl(file: MultipartFile, imageTransferId: String): Boolean {
        log.info("uploadFileToTransferUrl .. ")

        val imageTransferService: ImageTransferService = conn.srvImageTransfer(imageTransferId)
        val transferUrl = imageTransferService.get().send().imageTransfer().transferUrl()

        log.info("transferUrl: $transferUrl")
        disableSSLVerification()

//        System.setProperty("sun.net.http.allowRestrictedHeaders", "true")
        val url = URL(transferUrl)
        val https: HttpsURLConnection = url.openConnection() as HttpsURLConnection
        https.allowUserInteraction = true
        https.setRequestMethod("PUT")
        https.setRequestProperty("PUT", url.path)
        https.setRequestProperty("Content-Length", file.size.toString())
        https.setFixedLengthStreamingMode(file.size)
        https.setDoOutput(true)
        https.connect()

        val bufferSize = calculateOptimalBufferSize(file.size)
//        if (file.size > 10_000_000) 524288 else 131072  // 10MB 이상은 512KB 버퍼 사용

        val bufferedInputStream = BufferedInputStream(file.inputStream, bufferSize)
        val bufferedOutputStream = BufferedOutputStream(https.outputStream, bufferSize)

        val buffer = ByteArray(bufferSize)
        var bytesRead: Int
        while (bufferedInputStream.read(buffer).also { bytesRead = it } != -1) {
            bufferedOutputStream.write(buffer, 0, bytesRead)
        }
        bufferedOutputStream.flush()

        imageTransferService.finalize_().send()
        https.disconnect()
        log.info("완")
        return true
    }

    private fun calculateOptimalBufferSize(fileSize: Long): Int {
        return when {
            fileSize > 5L * 1024 * 1024 * 1024 -> 4 * 1024 * 1024  // 4MB for files larger than 5GB
            fileSize > 500L * 1024 * 1024 -> 2 * 1024 * 1024       // 2MB for files larger than 500MB
            else -> 512 * 1024                                     // 512KB for smaller files
        }
    }

    @Throws(Error::class)
    fun disableSSLVerification() {
        log.debug("disableSSLVerification")
        val hostnameVerifier = HostnameVerifier { _, _ -> true }
        val trustAllCerts = arrayOf<TrustManager>(
            object : X509TrustManager {
                override fun getAcceptedIssuers(): Array<X509Certificate>? {
                    return null
                }
                override fun checkClientTrusted(certs: Array<X509Certificate>, authType: String) {}
                override fun checkServerTrusted(certs: Array<X509Certificate>, authType: String) {}
            }
        )

        val sc = SSLContext.getInstance("TLS")
        sc.init(null, trustAllCerts, SecureRandom())
        HttpsURLConnection.setDefaultHostnameVerifier(hostnameVerifier)
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.socketFactory)
    }

    @Throws(Error::class)
    override fun refreshLun(diskId: String, hostId: String): Boolean {
        log.info("refreshLun ... ")
        // TODO HostId 구하는 방법
        val res: Result<Boolean> = conn.refreshLunDisk(diskId, hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun findAllVmsFromDisk(diskId: String): List<VmViewVo> {
        log.info("findAllVmsFromDisk ... ")
        val res: List<Vm> = conn.findAllVmsFromDisk(diskId).getOrDefault(emptyList())
        return res.toDiskVms(conn)
    }

    @Throws(Error::class)
    override fun findAllStorageDomainsFromDisk(diskId: String): List<StorageDomainVo> {
        log.info("findAllStorageDomainsFromDisk ... diskId: $diskId")
        val res: List<StorageDomain> = conn.findAllStorageDomainsFromDisk(diskId).getOrDefault(emptyList())
        return res.toStorageDomainsMenu(conn)
    }


    companion object {
        private val log by LoggerDelegate()
    }
}
