package com.itinfo.rutilvm.api.ovirt.business
/**
 * [ApplicationMode]
 * 어플리케이션 유형
 *
 * Represents different modes of the application.
 * Each mode is represented by a unique binary number.
 * <p>
 * VirtOnly - 0000 0001 (1), GlusterOnly - 0000 0010 (2)<br/>
 * </p>
 * Value for the new modes should be a power of 2. Example: QuantomOnly - 0000 0100 (4)
 *
 * @author 이찬희 (@chanhi2000)
 */
enum class ApplicationMode(
	override val value: Int,
): Identifiable {
	VirtOnly(1), 		// 0000 0001
	GlusterOnly(2),	// 0000 0010
	AllModes(255);		//
}
