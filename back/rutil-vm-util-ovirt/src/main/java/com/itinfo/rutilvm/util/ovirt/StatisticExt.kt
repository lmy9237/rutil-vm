package com.itinfo.rutilvm.util.ovirt

import org.ovirt.engine.sdk4.types.Statistic
import java.math.BigInteger

/**
 * List<[Statistic]>.findSpeed
 *
 * Statistic의 memory, swap memory, speed(rx,tx)
 * vms/{id}/nic/{id}/statistics
 * @param query statistic.name이 들어감
 * @return [BigInteger] 형식의 값
 *
 * <statistic href="/ovirt-engine/api/vms/e929923d-8710-47ef-bfbd-e281434eb8ee/nics/98273d10-a01f-44b4-809a-c27b9a3504f3/statistics/50b8f057-7795-30bd-825a-1acadd37a9d7" id="50b8f057-7795-30bd-825a-1acadd37a9d7">
 * 	   <name>errors.total.rx</name>
 *     <values/>
 * </statistic>
 */
fun List<Statistic>.findSpeed(query: String): BigInteger {
	log.debug("List<Statistics>.findSpeed ... ")
	log.debug("List<Statistics>.findSpeed ... query: $query")
	return this.firstOrNull { it.namePresent() && it.name() == query && it.valuesPresent() }
		?.values()?.firstOrNull()?.datum()?.toBigInteger() ?: BigInteger.ZERO
}


/**
 * List<[Statistic]>.findPage
 *
 * Statistic의 hugepage
 * hosts/{hostId}/statistic
 * vms/{vmId}/statistic
 * @param query statistic.name이 들어감
 * @return [Int] 형식
 */
fun List<Statistic>.findPage(query: String): Int {
	return this.filter {
		it.name() == query
	}.map { statistic: Statistic ->
		statistic.values().firstOrNull()?.datum()?.toInt()
	}.firstOrNull() ?: 0
}


fun List<Statistic>.findMemory(query: String): BigInteger {
	return this.filter {
		it.name() == query && it.valuesPresent() // valuepresent가 애매함
	}.map {
		it.values().firstOrNull()?.datum()?.toBigInteger()
	}.firstOrNull() ?: BigInteger.ZERO
}


fun List<Statistic>.findBootTime(): Long{
	return this.filter {
		it.name().equals("boot.time")
	}.map { statistic ->
		statistic.values().firstOrNull()?.datum()?.toLong()
	}.firstOrNull() ?: 0L
}

fun List<Statistic>.findVmUpTime(): String {
	val time = this.filter { statistic ->
		statistic.name() == "elapsed.time"
	}.map {
		it.values().firstOrNull()?.datum()?.toLong()
	}.firstOrNull() ?: 0L

	val days = time / (60 * 60 * 24)
	val hours = (time % (60 * 60 * 24)) / (60 * 60)
	val minutes = ((time % (60 * 60 * 24)) % (60 * 60)) / 60

	return if (days > 0)    "${days}일"
	else if (hours > 0)     "${hours}시간"
	else if (minutes > 0)   "${minutes}분"
	else                    ""
}

