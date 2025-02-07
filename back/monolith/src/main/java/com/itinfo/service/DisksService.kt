package com.itinfo.service

import com.itinfo.model.DiskCreateVo
import com.itinfo.model.DiskMigrationVo
import com.itinfo.model.DiskVo

import java.io.File
import java.io.IOException
import java.io.InputStream

/**
 * [DisksService]
 * 디스크 관리 서비스
 *
 * @author chlee
 * @since 2023.12.07
 */
interface DisksService {
	fun retrieveDisks(): List<DiskVo>
	fun retrieveDisks(storageDomainName: String): List<DiskVo>
	fun createDisk(diskCreateVo: DiskCreateVo)
	fun createLunDisk(diskCreateVo: DiskCreateVo)
	fun removeDisk(diskIds: List<String>)
	fun migrationDisk(diskMigrationVo: DiskMigrationVo)
	fun uploadDisk(bytes: ByteArray, diskCreateVo: DiskCreateVo, input: InputStream, diskSize: Long)

	@Throws(IOException::class)
	fun retrieveDiskImage(file: File): String
}
