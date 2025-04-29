package com.itinfo.rutilvm.api.model.storage

import com.itinfo.rutilvm.common.gson

import org.ovirt.engine.sdk4.types.LogicalUnit
import org.ovirt.engine.sdk4.types.LunStatus
import org.slf4j.LoggerFactory
import java.io.Serializable
import java.math.BigInteger

private val log = LoggerFactory.getLogger(LogicalUnitVo::class.java)

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
	val serial: String = "",
    val size: BigInteger = BigInteger.ZERO,
    val status: LunStatus = LunStatus.UNUSABLE,
    val storageDomainId: String = "",
    val target: String = "",
    val vendorId: String = "",
    val volumeGroupId: String = "",
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
        private var bSerial: String = ""; fun serial(block: () -> String?) { bSerial = block() ?: ""}
        private var bSize: BigInteger = BigInteger.ZERO; fun size(block: () -> BigInteger?) { bSize = block() ?: BigInteger.ZERO}
        private var bStatus: LunStatus = LunStatus.UNUSABLE; fun status(block: () -> LunStatus?) { bStatus = block() ?: LunStatus.UNUSABLE}
        private var bStorageDomainId: String = ""; fun storageDomainId(block: () -> String?) { bStorageDomainId = block() ?: ""}
        private var bTarget: String = ""; fun target(block: () -> String?) { bTarget = block() ?: ""}
        private var bVendorId: String = ""; fun vendorId(block: () -> String?) { bVendorId = block() ?: ""}
        private var bVolumeGroupId: String = ""; fun volumeGroupId(block: () -> String?) { bVolumeGroupId = block() ?: ""}

        fun build(): LogicalUnitVo = LogicalUnitVo(bId, bAddress, bDiscardMaxSize, bDiscardZeroesData, bDiskId, bLunMapping, bPaths, bPort, bPortal, bProductId, bSerial, bSize, bStatus, bStorageDomainId, bTarget, bVendorId, bVolumeGroupId )
    }

    companion object {
        inline fun builder(block: Builder.() -> Unit): LogicalUnitVo = Builder().apply(block).build()
    }
}

fun LogicalUnit.toLogicalUnitVo(): LogicalUnitVo {
	val logical = this@toLogicalUnitVo
	return LogicalUnitVo.builder {
		id { if(logical.idPresent()) logical.id() else null }
		address { if(logical.addressPresent()) logical.address() else null }
		port { if(logical.portPresent()) logical.portAsInteger() else null }
		portal { if(logical.portalPresent()) logical.portal() else null }
		target { if(logical.targetPresent()) logical.target() else null }
		discardMaxSize { if(logical.discardMaxSizePresent()) logical.discardMaxSizeAsInteger() else null }
		discardZeroesData { if(logical.discardZeroesDataPresent()) logical.discardZeroesData() else null }
		paths { if(logical.pathsPresent()) logical.pathsAsInteger() else null }
		productId { if(logical.productIdPresent()) logical.productId() else null }
		serial { if(logical.serialPresent()) logical.serial() else null }
		size { if(logical.sizePresent()) logical.size() else null }
		status { if(logical.statusPresent()) logical.status() else null }
		storageDomainId { if(logical.storageDomainIdPresent()) logical.storageDomainId() else null }
		vendorId { if(logical.vendorIdPresent()) logical.vendorId() else null }
		volumeGroupId { if(logical.volumeGroupIdPresent()) logical.volumeGroupId() else null }
	}
}
fun List<LogicalUnit>.toLogicalUnitVos(): List<LogicalUnitVo> =
	this@toLogicalUnitVos.map { it.toLogicalUnitVo() }


fun LogicalUnit.toLogicalUnitVoBuilder(): LogicalUnitVo.Builder.() -> Unit = {
	id { this@toLogicalUnitVoBuilder.id() }
	discardMaxSize { this@toLogicalUnitVoBuilder.discardMaxSizeAsInteger() }
	discardZeroesData { this@toLogicalUnitVoBuilder.discardZeroesData() }
	paths { this@toLogicalUnitVoBuilder.pathsAsInteger() }
	productId { this@toLogicalUnitVoBuilder.productId() }
	serial { this@toLogicalUnitVoBuilder.serial() }
	size { this@toLogicalUnitVoBuilder.size() }
	status { this@toLogicalUnitVoBuilder.status() }
	storageDomainId { this@toLogicalUnitVoBuilder.storageDomainId() }
	vendorId { this@toLogicalUnitVoBuilder.vendorId() }
	volumeGroupId { this@toLogicalUnitVoBuilder.volumeGroupId() }
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


