package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.ImageEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.math.BigInteger
import java.time.LocalDateTime
import java.util.UUID

data class DetailedDiskSnapshot(
	val diskSnapshotId: UUID,
	val diskSnapshotImageCreationDate: LocalDateTime?,
	val diskSnapshotSize: BigInteger?,
	val vmSnapshotId: UUID?,
	val vmSnapshotDescription: String?,         // VM Snapshot's description
	val vmSnapshotCreationDate: LocalDateTime?,   // VM Snapshot's creation date
	val connectedVmName: String?,
	val connectedVmId: UUID?,
	val originalDiskAlias: String?,
	val originalDiskId: UUID?
)

@Repository
interface ImageRepository : JpaRepository<ImageEntity, UUID> {

	@Query("""
SELECT new com.itinfo.rutilvm.api.repository.engine.DetailedDiskSnapshot(
   i.imageGuid,
   i.creationDate,
   i.size,
   s.snapshotId,
   s.description,
   s.creationDate,
   vm.vmName,
   vm.vmGuid,
   bd.diskAlias,
   bd.diskId
)
FROM ImageEntity i
JOIN i.storageDomains sd
LEFT JOIN i.vmSnapshot s
LEFT JOIN s.vm vm
LEFT JOIN i.baseDisk bd
WHERE 1=1
AND sd.id = :storageDomainId
AND i.vmSnapshot IS NOT NULL
AND i.active = false
""", countQuery = """

""")
	fun findDiskSnapshotsByStorageDomain(
		@Param("storageDomainId") storageDomainId: UUID
	): List<DetailedDiskSnapshot>
}
