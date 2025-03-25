package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.LogicalUnit
import org.ovirt.engine.sdk4.types.LunStatus
import java.io.Serializable
import java.math.BigInteger

/**
 * [LogicalUnitVo]
 *
 * @property id [String]
 * @property address [String]
 * @property discardMaxSize [Int]
 * @property discardZeroesData [Boolean]
 * @property diskId [String] fibre
 * @property lunMapping [Int]
 * @property paths [Int]
 * @property port [Int]
 * @property portal [String]
 * @property productId [String]
 * @property size [BigInteger]
 * @property status [LunStatus]
 * @property storageDomainId [String]
 * @property target [String]
 * @property vendorId [String]
 */
class LogicalUnitVo (
    val id: String = "",
    val address: String = "",
    val discardMaxSize: Int = 0,
    val discardZeroesData: Boolean = false,
    val diskId: String = "",
    val lunMapping: Int = 0,
    val paths: Int = 0,
    val port: Int = 0,
    val portal: String = "",
    val productId: String = "",
    val size: BigInteger = BigInteger.ZERO,
    val status: LunStatus = LunStatus.UNUSABLE,
    val storageDomainId: String = "",
    val target: String = "",
    val vendorId: String = "",
    val serial: String = "",
    val volumeGroup: String = "",
): Serializable {
    override fun toString(): String =
        gson.toJson(this)

    class Builder {
        private var bId: String = ""; fun id(block: () -> String?) { bId = block() ?: ""}
        private var bAddress: String = ""; fun address(block: () -> String?) { bAddress = block() ?: ""}
        private var bDiscardMaxSize: Int = 0; fun discardMaxSize(block: () -> Int?) { bDiscardMaxSize = block() ?: 0}
        private var bDiscardZeroesData: Boolean = false; fun discardZeroesData(block: () -> Boolean?) { bDiscardZeroesData = block() ?: false}
        private var bDiskId: String = ""; fun diskId(block: () -> String?) { bDiskId = block() ?: ""}
        private var bLunMapping: Int = 0; fun lunMapping(block: () -> Int?) { bLunMapping = block() ?: 0}
        private var bPaths: Int = 0; fun paths(block: () -> Int?) { bPaths = block() ?: 0}
        private var bPort: Int = 0; fun port(block: () -> Int?) { bPort = block() ?: 0}
        private var bPortal: String = ""; fun portal(block: () -> String?) { bPortal = block() ?: ""}
        private var bProductId: String = ""; fun productId(block: () -> String?) { bProductId = block() ?: ""}
        private var bSize: BigInteger = BigInteger.ZERO; fun size(block: () -> BigInteger?) { bSize = block() ?: BigInteger.ZERO}
        private var bStatus: LunStatus = LunStatus.UNUSABLE; fun status(block: () -> LunStatus?) { bStatus = block() ?: LunStatus.UNUSABLE}
        private var bStorageDomainId: String = ""; fun storageDomainId(block: () -> String?) { bStorageDomainId = block() ?: ""}
        private var bTarget: String = ""; fun target(block: () -> String?) { bTarget = block() ?: ""}
        private var bVendorId: String = ""; fun vendorId(block: () -> String?) { bVendorId = block() ?: ""}
        private var bSerial: String = ""; fun serial(block: () -> String?) { bSerial = block() ?: ""}
        private var bVolumeGroup: String = ""; fun volumeGroup(block: () -> String?) { bVolumeGroup = block() ?: ""}

        fun build(): LogicalUnitVo = LogicalUnitVo(bId, bAddress, bDiscardMaxSize, bDiscardZeroesData, bDiskId, bLunMapping, bPaths, bPort, bPortal, bProductId, bSize, bStatus, bStorageDomainId, bTarget, bVendorId, bSerial, bVolumeGroup )
    }

    companion object {
        private val log by LoggerDelegate()
        inline fun builder(block: Builder.() -> Unit): LogicalUnitVo = Builder().apply(block).build()
    }
}

// logicalunit 공통 빌더
fun LogicalUnit.toLogicalUnitVoBuilder(): LogicalUnitVo.Builder.() -> Unit = {
	id { this@toLogicalUnitVoBuilder.id() }
	discardMaxSize { this@toLogicalUnitVoBuilder.discardMaxSizeAsInteger() }
	discardZeroesData { this@toLogicalUnitVoBuilder.discardZeroesData() }
	paths { this@toLogicalUnitVoBuilder.pathsAsInteger() }
	productId { this@toLogicalUnitVoBuilder.productId() }
	size { this@toLogicalUnitVoBuilder.size() }
	status { this@toLogicalUnitVoBuilder.status() }
	storageDomainId { this@toLogicalUnitVoBuilder.storageDomainId() }
	vendorId { this@toLogicalUnitVoBuilder.vendorId() }
	serial { this@toLogicalUnitVoBuilder.serial() }
	volumeGroup { this@toLogicalUnitVoBuilder.volumeGroupId() }
}

// iSCSI
fun LogicalUnit.toIscsiLogicalUnitVo(): LogicalUnitVo = LogicalUnitVo.builder {
	this@toIscsiLogicalUnitVo.toLogicalUnitVoBuilder().invoke(this)
	address { this@toIscsiLogicalUnitVo.address() }
	port { this@toIscsiLogicalUnitVo.portAsInteger() }
	portal { this@toIscsiLogicalUnitVo.portal() }
	target { this@toIscsiLogicalUnitVo.target() }
}
fun List<LogicalUnit>.toIscsiLogicalUnitVos(): List<LogicalUnitVo> =
	map { it.toIscsiLogicalUnitVo() }

// Fibre
fun LogicalUnit.toFibreLogicalUnitVo(): LogicalUnitVo = LogicalUnitVo.builder {
	this@toFibreLogicalUnitVo.toLogicalUnitVoBuilder().invoke(this)
	diskId { this@toFibreLogicalUnitVo.diskId() }
}
fun List<LogicalUnit>.toFibreLogicalUnitVos(): List<LogicalUnitVo> =
	map { it.toFibreLogicalUnitVo() }
