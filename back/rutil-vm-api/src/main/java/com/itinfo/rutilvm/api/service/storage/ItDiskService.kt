package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.VmVo
import com.itinfo.rutilvm.api.model.computing.toDiskVms
import com.itinfo.rutilvm.api.model.fromTemplateCdromsToIdentifiedVos
import com.itinfo.rutilvm.api.model.toIdentifiedVosFromVmCdroms
import com.itinfo.rutilvm.api.model.response.Res
import com.itinfo.rutilvm.api.model.storage.*
import com.itinfo.rutilvm.api.ovirt.business.DiskContentTypeB
import com.itinfo.rutilvm.api.repository.engine.AllDisksRepository
import com.itinfo.rutilvm.api.repository.engine.BaseDisksRepository
import com.itinfo.rutilvm.api.repository.engine.entity.AllDiskEntity
import com.itinfo.rutilvm.api.repository.engine.entity.toDiskImageVosFromAllDiskEntities
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.common.toUUID
import com.itinfo.rutilvm.util.ovirt.*
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern

import org.ovirt.engine.sdk4.types.*
import org.ovirt.engine.sdk4.types.StorageDomainType.EXPORT
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.io.IOException

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

    /**
     * [ItDiskService.findAllStorageDomainsToMoveFromDisk]
     * 디스크 이동- 창
     * ItDiskService.findAllStorageDomainsFromDataCenter 에서 disk가 가지고있는 스토리지도메인은 제외
     *
     * @param diskId [String] 디스크 ID
     * @return List<[StorageDomainVo]>
     */
    @Throws(Error::class)
    fun findAllStorageDomainsToMoveFromDisk(diskId: String): List<StorageDomainVo>?
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
	 * [ItDiskService.download]
	 * 디스크 이미지 다운로드
	 * required: provisioned_size, alias, description, wipe_after_delete, shareable, backup, disk_profile.
	 * @param diskId [String] 디스크ID
	 *
	 * @return [Flux]<[DataBuffer]> 성공결과
	 * @throws IOException
	 */
	@Throws(Error::class, IOException::class)
	fun download(diskId: String): Mono<ResponseEntity<Flux<DataBuffer>>>
	/**
	 * [ItDiskService.cancelImageTransfer]
	 * 디스크 이미지 전송 취소
	 *
	 * @param diskId [String] 디스크ID
	 * @throws IOException
	 */
	@Throws(Error::class)
	fun cancelImageTransfer(diskId: String): Boolean
	/**
	 * [ItDiskService.pauseImageTransfer]
	 * 디스크 이미지 전송 일시정지
	 *
	 * @param diskId [String] 디스크ID
	 * @throws IOException
	 */
	@Throws(Error::class)
	fun pauseImageTransfer(diskId: String): Boolean
	/**
	 * [ItDiskService.resumeImageTransfer]
	 * 디스크 이미지 전송 재개
	 *
	 * @param diskId [String] 디스크ID
	 * @throws IOException
	 */
	@Throws(Error::class)
	fun resumeImageTransfer(diskId: String): Boolean
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
     * @return List<[VmVo]> 가상머신
     */
    @Throws(Error::class)
    fun findAllVmsFromDisk(diskId: String): List<VmVo>
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
	@Autowired private lateinit var rBaseDisks: BaseDisksRepository
	@Autowired private lateinit var rAllDisks: AllDisksRepository

    @Throws(Error::class)
    override fun findAll(): List<DiskImageVo> {
        log.info("findAll ... ")

		val res: List<AllDiskEntity> = rAllDisks.findAllByOrderByDiskAliasAsc()
		return res.toDiskImageVosFromAllDiskEntities()
			.filter { it.contentType == DiskContentTypeB.data || it.contentType == DiskContentTypeB.iso }
    }

	@Throws(Error::class)
	override fun findAllCdRomsFromDisk(diskId: String): List<IdentifiedVo> {
		log.info("findAllCdRomsFromDisk ... {}", diskId)
		val vms: List<Vm> =
			conn.findAllVms(follow = "cdroms").getOrDefault(emptyList())
		val temps: List<Template> =
			conn.findAllTemplates(follow = "cdroms").getOrDefault(emptyList())
		val list: List<IdentifiedVo> =
			vms.toIdentifiedVosFromVmCdroms(diskId) + temps.fromTemplateCdromsToIdentifiedVos(diskId)
		return list
	}

    @Throws(Error::class)
    override fun findOne(diskId: String): DiskImageVo? {
        log.info("findOne ... diskId: $diskId, disk: $this")
		val res: Disk? = conn.findDisk(diskId).getOrNull()
		// NOTE: 문제 (API상 오류)
        /*
        val res: Disk? = conn.findDisk(diskId, follow="diskprofile").getOrNull()
        val res: Disk? = conn.findDisk(diskId, follow = "diskprofile.storage_domain").getOrNull()
         */
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
            image.toAddDisk()
        ).getOrNull()
        return res?.toDiskIdName()
    }

    @Throws(Error::class)
    override fun update(image: DiskImageVo): DiskImageVo? {
        log.info("updateDisk ... image: $image")
        val res: Disk? = conn.updateDisk(
            image.toEditDisk()
        ).getOrNull()
        return res?.toDiskIdName()
    }

    @Throws(Error::class)
    override fun remove(diskId: String): Boolean {
        log.info("removeDisk ... diskId: $diskId")
        val res: Result<Boolean> = conn.removeDisk(diskId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun findAllStorageDomainsToMoveFromDisk(diskId: String): List<StorageDomainVo>? {
        log.info("findAllStorageDomainsToMoveFromDisk ... diskId: $diskId")
		val disk: AllDiskEntity? = rAllDisks.findByDiskId(diskId.toUUID())
		val res = conn.findAllAttachedStorageDomainsFromDataCenter(disk?.storagePoolId.toString())
				.getOrDefault(listOf())
				.filter { it.status() == StorageDomainStatus.ACTIVE && it.type() != EXPORT }
				// .filter { it.id() != disk?.storageId && it.status() == StorageDomainStatus.ACTIVE && it.type() != EXPORT }
        return res.toStorageDomainSizes()
    }

    @Throws(Error::class)
    override fun move(diskId: String, storageDomainId: String): Boolean {
        log.info("move ... diskId: $diskId, storageDomainId: $storageDomainId")
        val res: Result<Boolean> = conn.moveDisk(diskId, storageDomainId)
        return res.isSuccess
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

	@Autowired private lateinit var iImageTransfers: ItImageTransferService

    @Throws(Error::class, IOException::class)
    override fun upload(file: MultipartFile, image: DiskImageVo): Boolean {
        log.info("uploadDisk ... file: {}, image:{}", file.name, image)
        if (file.isEmpty)
			throw ErrorPattern.FILE_NOT_FOUND.toException()

        // 이미지 업로드해서 imageTransfer.id() 를 알아내고 그 ID를 이용해 파일을 전송해야 한다.
		val imageTransferId: String = conn.findImageTransferId4DiskImageUpload(
			image.toUploadDisk(conn, file.size)
		).getOrNull() ?: throw ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toException()

        return iImageTransfers.uploadFile(file, imageTransferId)
    }

	@Throws(Error::class, IOException::class)
	override fun download(diskId: String): Mono<ResponseEntity<Flux<DataBuffer>>> {
		log.info("download ... diskId: {}", diskId)
		val disk: Disk = conn.findDisk(diskId).getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toException()
		val imageTransferId4Download: String = conn.findImageTransferId4DiskImageDownload(
			diskId
		).getOrNull() ?: throw ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toException()
		return iImageTransfers.downloadFile(imageTransferId4Download, disk.alias())
	}

	override fun cancelImageTransfer(diskId: String): Boolean {
		log.info("cancelImageTransfer ... diskId: {}", diskId)
		conn.findDisk(diskId).getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toException()
		val imageTransferIdFound: String = conn.findImageTransferIdInProgress(
			diskId
		).getOrNull() ?: throw ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toException()
		return iImageTransfers.cancel(imageTransferIdFound)
	}

	override fun pauseImageTransfer(diskId: String): Boolean {
		log.info("pauseImageTransfer ... diskId: {}", diskId)
		conn.findDisk(diskId).getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toException()
		val imageTransferIdFound: String = conn.findImageTransferIdInProgress(
			diskId
		).getOrNull() ?: throw ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toException()
		return iImageTransfers.pause(imageTransferIdFound)
	}

	override fun resumeImageTransfer(diskId: String): Boolean {
		log.info("resumeImageTransfer ... diskId: {}", diskId)
		conn.findDisk(diskId).getOrNull() ?: throw ErrorPattern.DISK_NOT_FOUND.toException()
		val imageTransferIdFound: String = conn.findImageTransferIdInProgress(
			diskId
		).getOrNull() ?: throw ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toException()
		return iImageTransfers.resume(imageTransferIdFound)
	}

	@Throws(Error::class)
    override fun refreshLun(diskId: String, hostId: String): Boolean {
        log.info("refreshLun ... ")
        // TODO: hostId 구하는 방법
        val res: Result<Boolean> = conn.refreshLunDisk(diskId, hostId)
        return res.isSuccess
    }

    @Throws(Error::class)
    override fun findAllVmsFromDisk(diskId: String): List<VmVo> {
        log.info("findAllVmsFromDisk ... ")
        val res: List<Vm> = conn.findAllVmsFromDisk(diskId)
			.getOrDefault(emptyList())
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
