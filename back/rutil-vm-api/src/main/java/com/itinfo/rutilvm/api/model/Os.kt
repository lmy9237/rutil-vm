package com.itinfo.rutilvm.api.model

import org.ovirt.engine.sdk4.types.OperatingSystem
import java.util.concurrent.ConcurrentHashMap

enum class Os(
	val code: String,
	val fullName: String
) {
	WINDOWS_XP("windows_xp", "Windows XP"),
	WINDOWS_2003("windows_2003", "Windows 2003"),
	WINDOWS_2008("windows_2008", "Windows 2008"),
	OTHER_LINUX("other_linux", "Linux"),
	RHEL_5("rhel_5", "Red Hat Enterprise Linux 5.x"),
	RHEL_4("rhel_4", "Red Hat Enterprise Linux 4.x"),
	RHEL_3("rhel_3", "Red Hat Enterprise Linux 3.x"),
	WINDOWS_2003X64("windows_2003x64", "Windows 2003 x64"),
	WINDOWS_7("windows_7", "Windows 7"),
	WINDOWS_7X64("windows_7x64", "Windows 7 x64"),
	RHEL_5X64("rhel_5x64", "Red Hat Enterprise Linux 5.x x64"),
	RHEL_4X64("rhel_4x64", "Red Hat Enterprise Linux 4.x x64"),
	RHEL_3X64("rhel_3x64", "Red Hat Enterprise Linux 3.x x64"),
	WINDOWS_2008X64("windows_2008x64", "Windows 2008 x64"),
	WINDOWS_2008R2X64("windows_2008R2x64", "Windows 2008 R2 x64"),
	RHEL_6("rhel_6", "Red Hat Enterprise Linux 6.x"),
	RHEL_6X64("rhel_6x64", "Red Hat Enterprise Linux 6.x x64"),
	DEBIAN_7("debian_7", "Debian 7+"),
	WINDOWS_8("windows_8", "Windows 8"),
	DEBIAN_9("debian_9", "Debian 9+"),
	WINDOWS_8X64("windows_8x64", "Windows 8 x64"),
	WINDOWS_2012X64("windows_2012x64", "Windows 2012 x64"),
	RHEL_7X64("rhel_7x64", "Red Hat Enterprise Linux 7.x x64"),
	WINDOWS_2012R2X64("windows_2012R2x64", "Windows 2012R2 x64"),
	WINDOWS_10("windows_10", "Windows 10"),
	WINDOWS_10X64("windows_10x64", "Windows 10 x64"),
	RHEL_ATOMIC7X64("rhel_atomic7x64", "Red Hat Atomic 7.x x64"),
	WINDOWS_2016X64("windows_2016x64", "Windows 2016 x64"),
	RHEL_8X64("rhel_8x64", "Red Hat Enterprise Linux 8.x x64"),
	WINDOWS_2019X64("windows_2019x64", "Windows 2019 x64"),
	OTHER_LINUX_KERNEL_4("other_linux_kernel_4", "Other Linux (kernel 4.x)"),
	RHEL_9X64("rhel_9x64", "Red Hat Enterprise Linux 9.x x64"),
	RHCOS_X64("rhcos_x64", "Red Hat Enterprise Linux CoreOS"),
	WINDOWS_11("windows_11", "Windows 11"),
	WINDOWS_2022("windows_2022", "Windows 2022"),
	SLES_11("sles_11", "SUSE Linux Enterprise Server 11+"),
	OTHER_S390X("other_s390x", "Other OS"),
	OTHER_LINUX_S390X("other_linux_s390x", "Linux"),
	RHEL_7_S390X("rhel_7_s390x", "Red Hat Enterprise Linux 7.x"),
	SLES_12_S390X("sles_12_s390x", "SUSE Linux Enterprise Server 12"),
	UBUNTU_16_04_S390X("ubuntu_16_04_s390x", "Ubuntu Xenial Xerus LTS+"),
	FREEBSD("freebsd", "FreeBSD 9.2"),
	FREEBSDX64("freebsdx64", "FreeBSD 9.2 x64"),
	UBUNTU_12_04("ubuntu_12_04", "Ubuntu Precise Pangolin LTS"),
	UBUNTU_12_10("ubuntu_12_10", "Ubuntu Quantal Quetzal"),
	UBUNTU_13_04("ubuntu_13_04", "Ubuntu Raring Ringtails"),
	UBUNTU_13_10("ubuntu_13_10", "Ubuntu Saucy Salamander"),
	UBUNTU_14_04("ubuntu_14_04", "Ubuntu Trusty Tahr LTS+"),
	OTHER_PPC64("other_ppc64", "Other OS"),
	UBUNTU_18_04("ubuntu_18_04", "Ubuntu Bionic Beaver LTS+"),
	OTHER_LINUX_PPC64("other_linux_ppc64", "Linux"),
	RHEL_6_PPC64("rhel_6_ppc64", "Red Hat Enterprise Linux up to 6.8"),
	SLES_11_PPC64("sles_11_ppc64", "SUSE Linux Enterprise Server 11"),
	UBUNTU_14_04_PPC64("ubuntu_14_04_ppc64", "Ubuntu Trusty Tahr LTS+"),
	RHEL_7_PPC64("rhel_7_ppc64", "Red Hat Enterprise Linux 7.x"),
	RHEL_6_9_PLUS_PPC64("rhel_6_9_plus_ppc64", "Red Hat Enterprise Linux 6.9+"),
	RHEL_8_PPC64("rhel_8_ppc64", "Red Hat Enterprise Linux 8.x"),
	RHEL_9_PPC64("rhel_9_ppc64", "Red Hat Enterprise Linux 9.x"),
	OTHER("other", "Other OS");

	companion object {
		private val findMap: MutableMap<String, Os> = ConcurrentHashMap<String, Os>()
		init {
			values().forEach { findMap[it.code] = it }
		}
		@JvmStatic fun findByCode(code: String): Os = findMap[code] ?: OTHER
		@JvmStatic fun findByOsType(os: OperatingSystem): Os = findMap[os.type()] ?: OTHER
	}
}