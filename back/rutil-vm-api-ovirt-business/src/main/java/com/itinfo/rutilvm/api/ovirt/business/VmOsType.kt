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
	val description: String,
): Identifiable {
	other(0, "Other OS"),
	windows_xp(1, "Windows XP"),
	windows_2003(3, "Windows 2003"),
	windows_2008(4, "Windows 2008"),
	other_linux(5, "Other Linux"),
	rhel_5(7, "Red Hat Enterprise Linux 5.x"),
	rhel_4(8, "Red Hat Enterprise Linux 4.x"),
	rhel_3(9, "Red Hat Enterprise Linux 3.x"),
	windows_2003x64(10, "Windows 2003 x64"), // Q35칩셋에서는 지원 안됨
	windows_7(11, "Windows 7"),
	windows_7x64(12, "Windows 7 x64"), // Q35칩셋에서는 지원 안됨
	rhel_5x64(13, "Red Hat Enterprise Linux 5.x x64"), // Q35칩셋에서는 지원 안됨
	rhel_4x64(14, "Red Hat Enterprise Linux 4.x x64"), // Q35칩셋에서는 지원 안됨
	rhel_3x64(15, "Red Hat Enterprise Linux 3.x x64"), // Q35칩셋에서는 지원 안됨
	windows_2008x64(16, "Windows 2008 x64"),
	windows_2008r2x64(16, "Windows 2008 x64"),
	rhel_6(18, "Red Hat Enterprise Linux 6.x"),
	rhel_6x64(13, "Red Hat Enterprise Linux 6.x x64"),
	windows_8(20, "Windows 8"),
	windows_8x64(21, "Windows 8 x64"),
	windows_2012x64(23, "Windows 2012 x64"),
	rhel_7x64(24, "Red Hat Enterprise Linux 7.x x64"),
	windows_2012r2x64(25, "Windows 2012R2 x64"),
	windows_10(26, "Windows 10"),
	windows_10x64(27, "Windows 10 x64"),
	red_hat_atomic_7x64(28, "Red Hat Atomic 7.x x64"),
	windows_2016x64(29, "Windows 2016 x64"),
	rhel_8x64(30, "Red Hat Enterprise Linux 8.x x64"),
	windows_2019x64(31, "Windows 2019 x64"),
	other_linux_kernel_4(33, "Other Linux (kernel 4.x)"),
	rhel_9x64(34, "Red Hat Enterprise Linux 9.x x64"),
	rhel_core_os(35, "Red Hat Enterprise Linux CoreOS"),
	windows_11(36, "Windows 11"),
	windows_2022(37, "Windows 2022"),
	windows_2025(38, "Windows 2025"), // TODO: 임의로 등록한 값이며, 차후 oVirt에서 갱신 할 시 값 맞춰줘야 함.
	/*
	other_2(1001, "other2", "Other OS"), // TODO: 왜 있는지 모르겠음
	linux_2(1002, "linux2", "Linux"), // TODO: 왜 있는지 모르겠음
	rhel_6_8(1003, "rhel_6_8", "Red Hat Enterprise Linux up to 6.8"), // TODO: 왜 있는지 모르겠음
	sles_11(1004,  "sles_11", "SUSE Linux Enterprise Server 11"), // TODO: 왜 있는지 모르겠음
	ubuntu_14_04(1005, "ubuntu_14_04", "Ubuntu Trusty Tahr LTS+"), // TODO: 왜 있는지 모르겠음
	rhel_7(1006, "rhel_7", "Red Hat Enterprise Linux 7.x"), // TODO: 왜 있는지 모르겠음
	rhel_6_9(1007, "rhel_6_9", "Red Hat Enterprise Linux 6.9+"), // TODO: 왜 있는지 모르겠음
	rhel_8(1008, "rhel_8", "Red Hat Enterprise Linux 8.x"), // TODO: 왜 있는지 모르겠음
	rhel_9(1009, "rhel_9", "Red Hat Enterprise Linux 9.x"), // TODO: 왜 있는지 모르겠음
	*/
	sles_11(1193,  "SUSE Linux Enterprise Server 11+"),
	ubuntu_12_04(1252, "Ubuntu Precise Pangolin LTS"),
	ubuntu_12_10(1253, "Ubuntu Quantal Quetzal"),
	ubuntu_13_04(1254, "Ubuntu Raring Ringtails"),
	ubuntu_13_10(1255, "Ubuntu Saucy Salamander"),
	ubuntu_14_04(1256, "Ubuntu Trusty Tahr LTS+"),
	ubuntu_18_04(1257, "Ubuntu Bionic Beaver LTS+"),
	debian_7(1300, "Debian 7+"),
	debian_9(1301, "Debian 9+"),
	freebsd(1500, "FreeBSD 9.2"),
	freebsdx64(1501, "FreeBSD 9.2 x64"),
	unassigned(-1, "Unassigned")
	/*
	other_3(2001, "other_os", "Other OS"), // TODO: 왜 있는지 모르겠음
	linux_3(2002, "linux", "Linux"), // TODO: 왜 있는지 모르겠음
	rhel_7(2003, "Red Hat Enterprise Linux 7.x"), // TODO: 왜 있는지 모르겠음
	sles_12(2004, "SUSE Linux Enterprise Server 12"), // TODO: 왜 있는지 모르겠음
	ubuntu_16_04(2005, "ubuntu_16_04", "Ubuntu Xenial Xerus LTS+"),  // TODO: 왜 있는지 모르겠음
	*/
	;

	override fun toString(): String = this@VmOsType.code
	val code: String
		get() = this@VmOsType.name.uppercase()

	val isWindows: Boolean
		get() = this@VmOsType == windows_xp ||
			this@VmOsType == windows_2003 ||
			this@VmOsType == windows_2008 ||
			this@VmOsType == windows_2003x64 ||
			this@VmOsType == windows_7 ||
			this@VmOsType == windows_7x64 ||
			this@VmOsType == windows_2008x64 ||
			this@VmOsType == windows_2008r2x64 ||
			this@VmOsType == windows_8 ||
			this@VmOsType == windows_8x64 ||
			this@VmOsType == windows_2012x64 ||
			this@VmOsType == windows_2012r2x64 ||
			this@VmOsType == windows_10 ||
			this@VmOsType == windows_10x64 ||
			this@VmOsType == windows_2016x64 ||
			this@VmOsType == windows_2019x64 ||
			this@VmOsType == windows_11 ||
			this@VmOsType == windows_2022 ||
			this@VmOsType == windows_2025

			companion object {
		private val valueMapping: MutableMap<Int, VmOsType> = ConcurrentHashMap<Int, VmOsType>()
		private val codeMapping: MutableMap<String, VmOsType> = ConcurrentHashMap<String, VmOsType>()
		init {
			VmOsType.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): VmOsType = valueMapping[value ?: other.value] ?: other
		@JvmStatic fun forCode(code: String?): VmOsType = codeMapping[code?.uppercase() ?: other.code] ?: other
		val allVmOsTypes: List<VmOsType> = VmOsType.values().toList()
	}
}
