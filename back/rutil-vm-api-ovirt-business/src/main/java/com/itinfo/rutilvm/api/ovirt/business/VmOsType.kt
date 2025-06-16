package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [VmOsType]
 * 가상머신 운영시스템 유형
 *
 * TODO: 값 유형 유효한지 확인 필요 (dwh_osinfo 기준으로 추출)
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class VmOsType(
	override val value: Int,
	val code: String,
	val description: String,
): Identifiable {
	OTHER_OS(0, "other", "Other OS"),
	WINDOWS_XP(1, "windows_xp", "Windows XP"),
	WINDOWS_2003(3, "windows_2003", "Windows 2003"),
	WINDOWS_2008(4, "windows_2008", "Windows 2008"),
	LINUX(5, "other_linux", "Linux"),
	RHEL_5(7, "rhel_5", "Red Hat Enterprise Linux 5.x"),
	RHEL_4(8, "rhel_4", "Red Hat Enterprise Linux 4.x"),
	RHEL_3(9, "rhel_3", "Red Hat Enterprise Linux 3.x"),
	WINDOWS_2003X64(10, "windows_2003x64", "Windows 2003 x64"),
	WINDOWS_7(11, "windows_7", "Windows 7"),
	WINDOWS_7X64(12, "windows_7x64", "Windows 7 x64"),
	RHEL_5X64(13, "rhel_5x64", "Red Hat Enterprise Linux 5.x x64"),
	RHEL_4X64(14, "rhel_4x64", "Red Hat Enterprise Linux 4.x x64"),
	RHEL_3X64(15, "rhel_3x64", "Red Hat Enterprise Linux 3.x x64"),
	WINDOWS_2008X64(16, "windows_2008x64", "Windows 2008 x64"),
	WINDOWS_2008R2X64(16, "windows_2008R2x64", "Windows 2008 x64"),
	RHEL_6(18, "rhel_6", "Red Hat Enterprise Linux 6.x"),
	RHEL_6X64(13, "rhel_6x64", "Red Hat Enterprise Linux 6.x x64"),
	WINDOWS_8(20, "windows_8", "Windows 8"),
	WINDOWS_8X64(21, "windows_8x64", "Windows 8 x64"),
	WINDOWS_2012X64(23, "windows_2012x64", "Windows 2012 x64"),
	RHEL_7X64(24, "", "Red Hat Enterprise Linux 7.x x64"),
	WINDOWS_2012R2X64(25, "windows_2012R2x64", "Windows 2012R2 x64"),
	WINDOWS_10(26, "windows_10", "Windows 10"),
	WINDOWS_10X64(27, "windows_10x64", "Windows 10 x64"),
	RED_HAT_ATOMIC_7X64(28, "rhel_atomic7x64", "Red Hat Atomic 7.x x64"),
	WINDOWS_2016X64(29, "windows_2016x64", "Windows 2016 x64"),
	RHEL_8X64(30, "rhel_8x64", "Red Hat Enterprise Linux 8.x x64"),
	WINDOWS_2019X64(31, "windows_2019x64", "Windows 2019 x64"),
	OTHER_LINUX_KERNEL_4(33, "other_linux_kernel_4", "Other Linux (kernel 4.x)"),
	RHEL_9X64(34, "rhel_9x64", "Red Hat Enterprise Linux 9.x x64"),
	RHEL_CORE_OS(35, "rhcos_x64", "Red Hat Enterprise Linux CoreOS"),
	WINDOWS_11(36, "windows_11", "Windows 11"),
	WINDOWS_2012(37, "windows_2012", "Windows 2022"),
	/*
	OTHER_OS_2(1001, "other2", "Other OS"), // TODO: 왜 있는지 모르겠음
	LINUX_2(1002, "linux2", "Linux"), // TODO: 왜 있는지 모르겠음
	RHEL_6_8(1003, "rhel_6_8", "Red Hat Enterprise Linux up to 6.8"), // TODO: 왜 있는지 모르겠음
	SLES_11(1004,  "sles_11", "SUSE Linux Enterprise Server 11"), // TODO: 왜 있는지 모르겠음
	UBUNTU_14_04(1005, "ubuntu_14_04", "Ubuntu Trusty Tahr LTS+"), // TODO: 왜 있는지 모르겠음
	RHEL_7(1006, "rhel_7", "Red Hat Enterprise Linux 7.x"), // TODO: 왜 있는지 모르겠음
	RHEL_6_9(1007, "rhel_6_9", "Red Hat Enterprise Linux 6.9+"), // TODO: 왜 있는지 모르겠음
	RHEL_8(1008, "rhel_8", "Red Hat Enterprise Linux 8.x"), // TODO: 왜 있는지 모르겠음
	RHEL_9(1009, "rhel_9", "Red Hat Enterprise Linux 9.x"), // TODO: 왜 있는지 모르겠음
	*/
	SLES_11(1193, "sles_11", "SUSE Linux Enterprise Server 11+"),
	UBUNTU_12_04(1252, "ubuntu_12_04", "Ubuntu Precise Pangolin LTS"),
	UBUNTU_12_10(1253, "ubuntu_12_10", "Ubuntu Quantal Quetzal"),
	UBUNTU_13_04(1254, "ubuntU_13_04", "Ubuntu Raring Ringtails"),
	UBUNTU_13_10(1255, "ubuntu_13_10", "Ubuntu Saucy Salamander"),
	UBUNTU_14_04(1256, "ubuntu_14_04", "Ubuntu Trusty Tahr LTS+"),
	UBUNTU_18_04(1257, "ubuntu_18_04", "Ubuntu Bionic Beaver LTS+"),
	DEBIAN_7(1300, "debian_7", "Debian 7+"),
	DEBIAN_9(1301, "debian_9", "Debian 9+"),
	FREEBSD(1500, "freebsd", "FreeBSD 9.2"),
	FREEBSDX64(1501, "freebsdx64", "FreeBSD 9.2 x64")
	/*
	OTHER_OS_3(2001, "other_os", "Other OS"), // TODO: 왜 있는지 모르겠음
	LINUX_3(2002, "linux", "Linux"), // TODO: 왜 있는지 모르겠음
	RHEL_7(2003, "Red Hat Enterprise Linux 7.x"), // TODO: 왜 있는지 모르겠음
	SLES_12(2004, "SUSE Linux Enterprise Server 12"), // TODO: 왜 있는지 모르겠음
	UBUNTU_16_04(2005, "ubuntu_16_04", "Ubuntu Xenial Xerus LTS+"),  // TODO: 왜 있는지 모르겠음
	*/
	;

	companion object {
		private val valueMapping: MutableMap<Int, VmOsType> = ConcurrentHashMap<Int, VmOsType>()
		private val codeMapping: MutableMap<String, VmOsType> = ConcurrentHashMap<String, VmOsType>()
		init {
			VmOsType.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VmOsType = valueMapping[value ?: -1] ?: OTHER_OS
		@JvmStatic fun forCode(code: String?): VmOsType = codeMapping[code?.lowercase() ?: "other_os"] ?: OTHER_OS
		val allVmOsTypes: List<VmOsType> = VmOsType.values().toList()
	}
}
