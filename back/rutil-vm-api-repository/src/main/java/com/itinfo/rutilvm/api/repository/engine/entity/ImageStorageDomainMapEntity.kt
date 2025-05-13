package com.itinfo.rutilvm.api.repository.engine.entity

import java.util.UUID
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.MapsId
import javax.persistence.Table

/**
 *
 * [ImageStorageDomainMapEntity]
 * 스토리지도메인 기본정보
 *
 * @property id [UUID]
 * @property storageName [String] 이름
 */

@Embeddable
data class ImageStorageDomainMapId(
	@Column(name = "image_guid")
	val imageGuid: UUID,

	@Column(name = "storage_domain_id")
	val storageDomainId: UUID
): Serializable

@Entity
@Table(name = "image_storage_domain_map")
class ImageStorageDomainMapEntity(
	@EmbeddedId
	val id: ImageStorageDomainMapId,

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("imageGuid") // Maps the imageGuid part of the composite key
	@JoinColumn(name = "image_guid")
	val image: ImageEntity,

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("storageDomainId") // Maps the storageDomainId part of the composite key
	@JoinColumn(name = "storage_domain_id")
	val storageDomain: StorageDomainStaticEntity // Assuming you have a StorageDomainStatic entity
): Serializable
