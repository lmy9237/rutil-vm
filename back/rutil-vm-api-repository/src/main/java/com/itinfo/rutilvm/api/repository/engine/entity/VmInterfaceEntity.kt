package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.api.ovirt.business.VmInterfaceType
import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type
import java.util.UUID
import java.io.Serializable
import java.time.LocalDateTime
import javax.persistence.CascadeType
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToOne
import javax.persistence.Table

/**
 * [VmInterfaceEntity]
 * Maps to the `vm_interface` table, which represents a single virtual
 * Network Interface Card (vNIC) attached to a VM.
 *
 * @author 이찬희 (@chanhi2000)
 */
@Entity
@Table(name = "vm_interface")
class VmInterfaceEntity(
	@Id
	@Column(name = "id")
	@Type(type = "org.hibernate.type.PostgresUUIDType")
	val id: UUID? = null,
	val macAddr: String? = "",
	val name: String? = "",
	val speed: Int? = null,
	@Column(name = "type")
	private val _interfaceType: Int? = 0, // Renamed from 'type' to avoid keyword conflicts
	@Column(name = "_create_date")
	val createDate: LocalDateTime? = null, // timestamptz -> OffsetDateTime
	@Column(name = "_update_date")
	val updateDate: LocalDateTime? = null,
	val linked: Boolean? = true,
	val synced: Boolean? = true,

	// --- Relationships ---
	// The VM this NIC belongs to. The DDL references vm_static.
	@ManyToOne(
		fetch=FetchType.LAZY,
		cascade=[CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE],
	)
	@JoinColumn(
		name="vm_guid",
		referencedColumnName="vm_guid",
		nullable=true
	)
	@NotFound(action = NotFoundAction.IGNORE)
	val vm: VmEntity? = null,

	// The VNIC Profile applied to this NIC.
	@ManyToOne(
		fetch=FetchType.LAZY,
		cascade=[CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE],
	)
	@JoinColumn(
		name="vnic_profile_id",
		referencedColumnName="id"
	)
	@NotFound(action = NotFoundAction.IGNORE)
	val vnicProfile: VnicProfileEntity? = null, // From our previous step

	@OneToOne(
		mappedBy="vmInterface", // This MUST match the property name in VmInterfaceStatisticsEntity
		fetch=FetchType.LAZY,
		cascade=[CascadeType.ALL], // If you delete the interface, delete its stats too
		orphanRemoval=true
	)
	val stats: VmInterfaceStatisticsEntity? = null
) : Serializable {
	val interfaceType: VmInterfaceType		get() = VmInterfaceType.forValue(_interfaceType)

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: UUID? = null; fun id(block: () -> UUID?) { bId = block() }
		private var bMacAddr: String? = null; fun macAddr(block: () -> String?) { bMacAddr = block() }
		private var bName: String = ""; fun name(block: () -> String?) { bName = block() ?: "" }
		private var bSpeed: Int? = null; fun speed(block: () -> Int?) { bSpeed = block() }
		private var bInterfaceType: Int? = 0; fun interfaceType(block: () -> VmInterfaceType?) { bInterfaceType = block()?.value ?: 0 }
		private var bCreateDate: LocalDateTime? = null; fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() }
		private var bUpdateDate: LocalDateTime? = null; fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bLinked: Boolean = true; fun linked(block: () -> Boolean?) { bLinked = block() ?: true }
		private var bSynced: Boolean? = true; fun synced(block: () -> Boolean?) { bSynced = block() ?: true }
		private var bVm: VmEntity? = null; fun vm(block: () -> VmEntity?) { bVm = block() }
		private var bVnicProfile: VnicProfileEntity? = null; fun vnicProfile(block: () -> VnicProfileEntity?) { bVnicProfile = block() }
		private var bStats: VmInterfaceStatisticsEntity? = null; fun stats(block: () -> VmInterfaceStatisticsEntity?) { bStats = block() }

		fun build(): VmInterfaceEntity = VmInterfaceEntity(bId, bMacAddr, bName, bSpeed, bInterfaceType, bCreateDate, bUpdateDate, bLinked, bSynced, bVm, bVnicProfile, bStats)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VmInterfaceEntity = Builder().apply(block).build()
	}
}
