package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VmDeviceType]
 * 가상머신 디바이스 유형
 *
 * @see GraphicsTypeB
 * @see DisplayTypeB
 */
enum class VmDeviceType(
	val code: String,
	val ovfResourceType: Int? = null,
) {
	FLOPPY("floppy", 14),
	DISK("disk", 17),
	LUN("lun"),
	CDROM("cdrom", 15),
	INTERFACE("interface", 10),
	BRIDGE("bridge", 3),
	VIDEO("video", 20),
	USB("usb", 23),
	CONTROLLER("controller", 23),
	REDIR("redir", 23),
	SPICEVMC("spicevmc", 23),
	QXL("qxl"),
	CIRRUS("cirrus"),
	VGA("vga"),
	SPICE("spice"),
	VNC("vnc"),
	SOUND("sound"),
	ICH6("ich6"),
	AC97("ac97"),
	MEMBALLOON("memballoon"),
	CHANNEL("channel"),
	SMARTCARD("smartcard"),
	BALLOON("balloon"),
	CONSOLE("console"),
	VIRTIO("virtio"),
	WATCHDOG("watchdog"),
	VIRTIOSCSI("virtio-scsi"),
	VIRTIOSERIAL("virtio-serial"),
	HOST_DEVICE("hostdev"),
	MEMORY("memory"),
	PCI("pci"),
	IDE("ide"),
	SATA("sata"),
	ICH9("ich9"),
	TPM("tpm"),
	BOCHS("bochs"),
	VGPU("vgpu"),
	OTHER("other", 0),
	UNKNOWN("unknown", -1);

	companion object {
		private const val INTERNAL_ENTITY_VALUE = -100
		private val codeMapping: MutableMap<String, VmDeviceType> = ConcurrentHashMap<String, VmDeviceType>()
		private val ovfResourceTypeMapping: MutableMap<String, VmDeviceType> = ConcurrentHashMap<String, VmDeviceType>()
		init {
			values().forEach {
				codeMapping[it.code] = it
				if (it.ovfResourceType != null) ovfResourceTypeMapping[it.code] = it
			}
		}
		@JvmStatic fun forCode(code: String?): VmDeviceType = codeMapping[code ?: "unknown"] ?: UNKNOWN
	}

	/**
	public static VmDeviceType getoVirtDevice(int resourceType) {
		for (VmDeviceType deviceType : values()) {
			if (deviceType.ovfResourceType != null && Integer.parseInt(deviceType.ovfResourceType) == resourceType) {
				return deviceType;
			}
		}
		return UNKNOWN;
	}
	*/
}
