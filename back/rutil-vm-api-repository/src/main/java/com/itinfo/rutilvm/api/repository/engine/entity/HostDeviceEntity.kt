package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.Type
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.MapsId
import javax.persistence.Id
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumns
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table
import java.io.Serializable
import java.math.BigDecimal
import java.math.BigInteger
import java.time.LocalDateTime
import java.util.UUID

@Embeddable
data class HostDeviceId(
	@Column(name="host_id", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var hostId: UUID? = null,
	@Column(name="device_name", unique = true, nullable = true)
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	var deviceName: String? = null
) : Serializable

/**
 * [HostDeviceEntity]
 * 호스트 장치
 *
 * Maps to the `host_device` table, representing a physical device on a host
 * that can potentially be assigned to a VM (e.g., PCI passthrough, SR-IOV).
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name="host_device")
class HostDeviceEntity(
	@EmbeddedId
	var id: HostDeviceId? = null,
	val capability: String? = "",
	val iommuGroup: Int? = null,
	val productName: String? = null,
	val productId: String? = null,
	val vendorName: String? = null,
	val vendorId: String? = null,
	val totalVfs: Int? = null,
	val netIfaceName: String? = null,
	val driver: String? = null,
	val isAssignable: Boolean? = true,
	val address: String? = "",
	val mdevTypes: String? = null,
	val blockPath: String? = null,
	val hostdevSpecParams: String? = null,

	// --- Relationships ---
	@ManyToOne(fetch=FetchType.LAZY)
	@MapsId("hostId") // Links the 'hostId' part of the composite key to this relationship
	@JoinColumn(
		name="host_id",
		referencedColumnName="vds_id"
	)
	val host: VdsStaticEntity? = null, // Assumes you have VdsStaticEntity

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(
		name="vm_id",
		referencedColumnName="vm_guid"
	)
	val attachedVm: VmStaticEntity? = null, // Assumes you have VmStaticEntity

	// --- Self-Referencing Relationships ---
	// A device's parent device (e.g., a PCI device under a PCI bridge)
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumns(
		JoinColumn(name="host_id", referencedColumnName="host_id", insertable = false, updatable = false),
		JoinColumn(name="parent_device_name", referencedColumnName="device_name", insertable = false, updatable = false)
	)
	val parentDevice: HostDeviceEntity? = null,

	// A Virtual Function's (VF) link to its parent Physical Function (PF)
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumns(
		JoinColumn(name="host_id", referencedColumnName="host_id", insertable = false, updatable = false),
		JoinColumn(name="physfn", referencedColumnName="device_name", insertable = false, updatable = false)
	)
	val physicalFunctionDevice: HostDeviceEntity? = null,
	// --- Inverse Side of Self-Referencing Relationships ---

	@OneToMany(mappedBy="parentDevice")
	val childDevices: Set<HostDeviceEntity> = emptySet(),

	@OneToMany(mappedBy="physicalFunctionDevice")
	val virtualFunctions: Set<HostDeviceEntity> = emptySet()
) : Serializable {

	override fun toString(): String =
		gson.toJson(this)

	val hasIommu: Boolean			get() = capability == "pci" && iommuGroup != null // TODO: devicepassthrough 값이 이거일까?
	/*
	protected boolean hasIommu(HostDevice hostDevice) {
		// iommu group restriction only applicable to 'pci' devices
		return hostDevice.isPci() && hostDevice.getIommuGroup() != null;
	}
	*/

	class Builder {
		private var bId: HostDeviceId? = null; fun id(block: () -> HostDeviceId?) { bId = block() }
		private var bCapability: String = ""; fun capability(block: () -> String?) { bCapability = block() ?: "" }
		private var bIommuGroup: Int? = null; fun iommuGroup(block: () -> Int?) { bIommuGroup = block() }
		private var bProductName: String? = null; fun productName(block: () -> String?) { bProductName = block() }
		private var bProductId: String? = null; fun productId(block: () -> String?) { bProductId = block() }
		private var bVendorName: String? = null; fun vendorName(block: () -> String?) { bVendorName = block() }
		private var bVendorId: String? = null; fun vendorId(block: () -> String?) { bVendorId = block() }
		private var bTotalVfs: Int? = null; fun totalVfs(block: () -> Int?) { bTotalVfs = block() }
		private var bNetIfaceName: String? = null; fun netIfaceName(block: () -> String?) { bNetIfaceName = block() }
		private var bDriver: String? = null; fun driver(block: () -> String?) { bDriver = block() }
		private var bIsAssignable: Boolean = true; fun isAssignable(block: () -> Boolean?) { bIsAssignable = block() ?: true }
		private var bAddress: String? = null; fun address(block: () -> String?) { bAddress = block() }
		private var bMdevTypes: String? = null; fun mdevTypes(block: () -> String?) { bMdevTypes = block() }
		private var bBlockPath: String? = null; fun blockPath(block: () -> String?) { bBlockPath = block() }
		private var bHostdevSpecParams: String? = null; fun hostdevSpecParams(block: () -> String?) { bHostdevSpecParams = block() }
		private var bHost: VdsStaticEntity? = null; fun host(block: () -> VdsStaticEntity?) { bHost = block() }
		private var bAttachedVm: VmStaticEntity? = null; fun attachedVm(block: () -> VmStaticEntity?) { bAttachedVm = block() }
		private var bParentDevice: HostDeviceEntity? = null; fun parentDevice(block: () -> HostDeviceEntity?) { bParentDevice = block() }
		private var bPhysicalFunctionDevice: HostDeviceEntity? = null; fun physicalFunctionDevice(block: () -> HostDeviceEntity?) { bPhysicalFunctionDevice = block() }
		private var bChildDevices: Set<HostDeviceEntity> = emptySet(); fun childDevices(block: () -> Set<HostDeviceEntity>?) { bChildDevices = block() ?: emptySet() }
		private var bVirtualFunctions: Set<HostDeviceEntity> = emptySet(); fun virtualFunctions(block: () -> Set<HostDeviceEntity>?) { bVirtualFunctions = block() ?: emptySet() }

		fun build(): HostDeviceEntity = HostDeviceEntity(bId, bCapability, bIommuGroup, bProductName, bProductId, bVendorName, bVendorId, bTotalVfs, bNetIfaceName, bDriver, bIsAssignable, bAddress, bMdevTypes, bBlockPath, bHostdevSpecParams, bHost, bAttachedVm, bParentDevice, bPhysicalFunctionDevice, bChildDevices, bVirtualFunctions)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): HostDeviceEntity = Builder().apply(block).build()
	}
}
