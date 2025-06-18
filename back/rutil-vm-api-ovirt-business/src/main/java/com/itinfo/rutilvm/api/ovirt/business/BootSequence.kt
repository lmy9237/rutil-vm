package com.itinfo.rutilvm.api.ovirt.business

import java.io.Serializable
import java.util.concurrent.ConcurrentHashMap

/**
 * [BootSequence]
 * 가상머신 부팅순서 유형
 *
 * C - 하드디스크 HardDisk,
 * D - CD-ROM,
 * N - 네트워크(PXE) Network
 *
 * first 3 numbers for backward compatibility
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class BootSequence(
	override val value: Int,
	vararg composedOf: BootSequence?
): Identifiable, Serializable {
	C(0),	// 하드디스크
	D(10),	// CD-ROM
	N(2),	// 네트워크(PXE)
	DC(1, D, C), 		/* 1. CD-ROM, 2. 하드디스크 */
	CDN(3, C, D, N), 	/* 1. 하드디스크, 2. CD-ROM, 3. 네트워크(PXE) */
	CND(4, C, N, D),	/* 1. 하드디스크, 2. 네트워크(PXE), 3. CD-ROM */
	DCN(5, D, C, N),	/* 1. CD-ROM, 2. 하드디스크, 3. 네트워크(PXE) */
	DNC(6, D, N, C),	/* 1. CD-ROM, 2. 네트워크(PXE), 3. 하드디스크 */
	NCD(7, N, C, D),	/* 1. 네트워크(PXE), 2. 하드디스크, 3. CD-ROM */
	NDC(8, N, D, C),	/* 1. 네트워크(PXE), 2. CD-ROM, 3. 하드디스크 */
	CD(9, C, D),		/* 1. 하드디스크, 2. CD-ROM */
	CN(11, C, N),		/* 1. 하드디스크, 2. 네트워크(PXE) */
	DN(12, D, N),		/* 1. CD-ROM, 2. 네트워크(PXE) */
	NC(13, N, C),		/* 1. 네트워크(PXE), 2. 하드디스크 */
	ND(14, N, D);		/* 1. 네트워크(PXE), 2. CD-ROM */

	private val components: List<BootSequence> = listOf(if (composedOf.isEmpty()) {
		this@BootSequence	// leaf contains itself
	} else {
		composedOf
	}).toList() as? List<BootSequence> ?: listOf()

	/**
	 * [BootSequence.containsSubsequence]
	 * Returns true if and only if all the components of the subsequence are in this sequence (ignoring order)
	 * For example, D is a subsequence of D, DN, CD..., DN is a subsequence of DNC etc
	 */
	fun containsSubsequence(subsequence: BootSequence?): Boolean {
		if (subsequence == null)
			return false
		return components.containsAll(subsequence.components)
	}

	companion object {
		private val valueMapping: MutableMap<Int, BootSequence> = ConcurrentHashMap<Int, BootSequence>()
		init {
			BootSequence.values().forEach {
				valueMapping[it.value] = it
			}
		}
		@JvmStatic fun forValue(value: Int?): BootSequence = valueMapping[value ?: C] ?: C
	}
}

