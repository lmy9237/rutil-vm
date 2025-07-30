package com.itinfo.rutilvm.common

fun ByteArray.startsWith(prefix: ByteArray): Boolean {
	if (this.size < prefix.size) return false
	for (i in prefix.indices) {
		if (this[i] != prefix[i]) return false
	}
	return true
}

fun ByteArray.isPng(): Boolean =
	this@isPng.startsWith(byteArrayOf(-119, 80, 78, 71))
