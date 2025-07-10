package com.itinfo.rutilvm.api.ovirt.business

import java.util.concurrent.ConcurrentHashMap

/**
 * [ImageTransferPhaseB]
 * 디스크 이미지 전송 상태
 *
 * @author 이찬희
 */
enum class ImageTransferPhaseB(
	override val value: Int,
): Identifiable {
	unknown(0),
	initializing(1),
	transferring(2),
	resuming(3),
	paused_system(4),
	paused_user(5),
	cancelled_system(6),
	finalizing_success(7),
	finalizing_failure(8),
	finished_success(9),
	finished_failure(10),
	cancelled_user(11),
	finalizing_cleanup(12),
	finished_cleanup(13);

	override fun toString(): String = code
	val code: String
		get() = this@ImageTransferPhaseB.name.uppercase()

	val localizationKey: String		get() = "${ImageTransferPhaseB::class.java.simpleName}.${this.name}"
	private val loc: Localization	get() = Localization.getInstance()
	val en: String					get() = loc.findLocalizedName4ImageTransferPhaseB(this, "en")
	val kr: String					get() = loc.findLocalizedName4ImageTransferPhaseB(this, "kr")

	val canBePaused: Boolean
		get() = this@ImageTransferPhaseB === initializing ||
			this@ImageTransferPhaseB === resuming ||
			this@ImageTransferPhaseB === transferring
	val isPaused: Boolean
		get() = this@ImageTransferPhaseB === paused_system ||
			this@ImageTransferPhaseB === paused_user
	val canBeCancelled: Boolean
		get() = this@ImageTransferPhaseB.canBePaused ||
			this@ImageTransferPhaseB.isPaused
	val isFinished: Boolean
		get() = this@ImageTransferPhaseB === finished_failure ||
			this@ImageTransferPhaseB === finished_success
	val isValidTransition: Boolean
		get() = !this@ImageTransferPhaseB.isFinished

	companion object {
		private val valueMapping: MutableMap<Int, ImageTransferPhaseB> = ConcurrentHashMap<Int, ImageTransferPhaseB>()
		private val codeMapping: MutableMap<String, ImageTransferPhaseB> = ConcurrentHashMap<String, ImageTransferPhaseB>()
		init {
			ImageTransferPhaseB.values().forEach {
				valueMapping[it.value] = it
				codeMapping[it.code] = it
				codeMapping[it.name] = it
			}
			// TODO: revisit this in the future to validate all transitions
			//        validTransitions.put(INITIALIZING, EnumSet.of(TRANSFERRING, PAUSED_SYSTEM, CANCELLED_SYSTEM));
			//        validTransitions.put(TRANSFERRING, EnumSet.of(FINALIZING_SUCCESS, PAUSED_SYSTEM, CANCELLED_SYSTEM, CANCELLED_USER, PAUSED_USER));
			//        validTransitions.put(RESUMING, EnumSet.of(TRANSFERRING, PAUSED_SYSTEM, CANCELLED_SYSTEM));
			//        validTransitions.put(PAUSED_SYSTEM, EnumSet.of(RESUMING, CANCELLED_USER, CANCELLED_SYSTEM));
			//        validTransitions.put(PAUSED_USER, EnumSet.of(RESUMING, CANCELLED_USER, CANCELLED_SYSTEM));
			//        validTransitions.put(CANCELLED_USER, EnumSet.of(FINALIZING_CLEANUP));
			//        validTransitions.put(CANCELLED_SYSTEM, EnumSet.of(FINALIZING_FAILURE));
			//        validTransitions.put(FINALIZING_SUCCESS, EnumSet.of(FINALIZING_FAILURE, FINISHED_SUCCESS));
			//        validTransitions.put(FINALIZING_FAILURE, EnumSet.of(FINISHED_FAILURE));
			//        validTransitions.put(FINALIZING_CLEANUP, EnumSet.of(FINISHED_CLEANUP));
			//        validTransitions.put(FINISHED_FAILURE, EnumSet.of(FINISHED_FAILURE));
			//        validTransitions.put(FINISHED_SUCCESS, EnumSet.of(FINISHED_SUCCESS));
		}
		@JvmStatic fun forValue(value: Int?): ImageTransferPhaseB = valueMapping[value ?: unknown.value] ?: unknown
		@JvmStatic fun forCode(code: String?): ImageTransferPhaseB = codeMapping[code ?: unknown.code] ?: unknown
		val alImageTransferPhaseBs: List<ImageTransferPhaseB> = ImageTransferPhaseB.values().toList()
		/*fun isValidTransition(
			from: ImageTransferPhaseB, to: ImageTransferPhaseB
		): Boolean = !from.isFinished*/
	}
}
