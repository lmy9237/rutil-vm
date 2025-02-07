package com.itinfo.security

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.itinfo.dao.aaa.Settings

import org.apache.commons.codec.binary.Base64

import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.io.IOException
import java.math.BigInteger
import java.nio.charset.Charset
import java.security.GeneralSecurityException
import java.security.NoSuchAlgorithmException
import java.security.SecureRandom
import java.security.spec.InvalidKeySpecException
import java.util.*
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec


private val log: Logger
	get() = LoggerFactory.getLogger("com.itinfo.security.SecurityUtilsKt")

private const val SALT_BYTES = 24
private const val HASH_BYTES = 24
private const val PBKDF2_ITERATIONS = 1000
private const val ITERATION_INDEX = 0
private const val SALT_INDEX = 1
private const val PBKDF2_INDEX = 2
/**
 * [String.decodeBase64]
 * (로그인 에서) js함수 btoa로 값이 Base64 난독화 된 값을 복호화 한다.
 */
fun String.decodeBase64(): String {
	log.debug("... decodeBase64('$this')")
	val result = try {
		val decoder = java.util.Base64.getDecoder()
		String(decoder.decode(this), charset("UTF-8"))
	} catch (e: java.lang.Exception) {
		log.error(e.localizedMessage)
		""
	}
	log.debug("... decodeBase64('$this')=$result")
	return result
}
fun String.validatePassword(encrypted: String): Boolean {
	log.debug("... validatePassword('$this', '$encrypted')")
	// val pwEncrypted = EnvelopePBE.encode(this).also { log.debug("pwEncrypted: $it") }
	// val result: Boolean = pwEncrypted.toCharArray().validatePassword(encrypted)
	val result: Boolean = EnvelopePBE.check(encrypted, this)
	log.debug("... validatePassword('$this', '$encrypted')=$result")
	/*
	val result = try {
		this.toCharArray().validatePassword(goodHash)
	} catch (e: Exception) {
		e.printStackTrace()
		log.error(e.localizedMessage)
		false
	}
	log.debug("... validatePassword('$this', '$goodHash')=$result")
	*/
	return result
}

@Throws(NoSuchAlgorithmException::class, InvalidKeySpecException::class)
	fun CharArray.validatePassword(goodHash: String): Boolean {
	log.debug("... validatePassword('$this', '$goodHash')")
	val params = goodHash.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
	val iterations = params[ITERATION_INDEX].toInt()
	val salt = params[SALT_INDEX].fromHex()
	val hash = params[PBKDF2_INDEX].fromHex()
	val testHash = this.pbkdf2(salt, iterations, hash.size)
	return hash.slowEquals(testHash)
}

private fun ByteArray.slowEquals(b: ByteArray): Boolean {
	log.debug("... slowEquals")
	var diff = this.size xor b.size
	var i = 0
	while (i < this.size && i < b.size) {
		diff = diff or (this[i].toInt() xor b[i].toInt())
		i++
	}
	return (diff == 0)
}


fun String.createHash(): String {
	log.info("createHash('$this') ...")
	val result: String = try {
		this.toCharArray().createHash()
	} catch (e: Exception) {
		log.error(e.localizedMessage)
		""
	}
	return result
}

@Throws(NoSuchAlgorithmException::class, InvalidKeySpecException::class)
fun CharArray.createHash(): String {
	log.info("... createHash('$this')")
	val random = SecureRandom()
	val salt = ByteArray(SALT_BYTES)
	random.nextBytes(salt)
	val hash = this.pbkdf2(salt, 1000, HASH_BYTES)
	return "${PBKDF2_ITERATIONS}:${salt.toHex()}:${hash.toHex()}"

}

@Throws(NoSuchAlgorithmException::class, InvalidKeySpecException::class)
private fun CharArray.pbkdf2(salt: ByteArray, iterations: Int, bytes: Int): ByteArray {
	log.info("... pbkdf2('$this')")
	val spec = PBEKeySpec(this, salt, iterations, bytes * 8)
	val skf = SecretKeyFactory.getInstance(Settings.NAME_PBE_ALGORITHM)
	return skf.generateSecret(spec).encoded
}

private fun String.fromHex(): ByteArray {
	log.info("... fromHex('$this'")
	val binary = ByteArray(this.length / 2)
	for (i in binary.indices)
		binary[i] = this.substring(2 * i, 2 * i + 2).toInt(16).toByte()
	return binary
}

private fun ByteArray.toHex(): String {
	log.info("... toHex")
	val bi = BigInteger(1, this)
	val hex = bi.toString(16)
	val paddingLength = this.size * 2 - hex.length
	if (paddingLength > 0)
		return String.format("%0${paddingLength}d", 0) + hex
	return hex
}

object EnvelopePBE {
	private const val ARTIFACT_KEY: String = "artifact"
	private const val VERSION_KEY: String = "version"
	private const val ALGORITHM_KEY: String = "algorithm"
	private const val SALT_KEY: String = "salt"
	private const val ITERATIONS_KEY: String = "iterations"
	private const val SECRET_KEY: String = "secret"

	private const val ARTIFACT: String = "EnvelopePBE"
	private const val VERSION: String = "1"

	@Throws(IOException::class, GeneralSecurityException::class)
	fun check(blob: String, password: String): Boolean {
		val map: Map<String, String> = getEncryptionMap(blob)
		if (map.isEmpty()) {
			log.warn("Invalid format of previous password. Cannot check equality of previous and new password.")
			return false
		}
		if (ARTIFACT != map[ARTIFACT_KEY])
			throw IllegalArgumentException(String.format("Invalid artifact '${map[ARTIFACT_KEY]}'"))

		if (VERSION != map[VERSION_KEY])
			throw IllegalArgumentException(String.format("Invalid version '${map[VERSION_KEY]}'"))

		val salt: ByteArray = Base64.decodeBase64(map[SALT_KEY])
		return Base64.decodeBase64(map[SECRET_KEY]).contentEquals(
			SecretKeyFactory.getInstance(map[ALGORITHM_KEY]).generateSecret(
				PBEKeySpec(
					password.toCharArray(),
					salt,
					map[ITERATIONS_KEY]!!.toInt(),
					salt.size * 8
				)
			).encoded
		)
	}

	@Throws(IOException::class, GeneralSecurityException::class)
	fun encode(password: String,
			   algorithm: String = Settings.NAME_PBE_ALGORITHM,
			   keySize: Int = Settings.NAME_PBE_KEY_SIZE,
			   iterations: Int = Settings.NAME_PBE_ITERATIONS,
			   randomProvider: String? = "NativePRNG"): String {
		log.debug("encode ... \npassword: $password, \nalgorithm: $algorithm, \nkeySize: $keySize, \niterations: $iterations, \nrandomProvider: $randomProvider")
		val base64 = Base64(0)
		val map: MutableMap<String, String> = hashMapOf()
		val salt = ByteArray(keySize / 8)
		SecureRandom.getInstance(randomProvider).nextBytes(salt)
		map[ARTIFACT_KEY] = ARTIFACT
		map[VERSION_KEY] = VERSION
		map[ALGORITHM_KEY] = algorithm
		map[SALT_KEY] = base64.encodeToString(salt).also { log.debug("encode ... map['$SALT_KEY']=$it") }
		map[ITERATIONS_KEY] = "$iterations"
		map[SECRET_KEY] = base64.encodeToString(
			SecretKeyFactory.getInstance(algorithm)
				.generateSecret(PBEKeySpec(password.toCharArray(), salt, iterations, salt.size * 8))
				.encoded
		).also { log.debug("encode ... map['$SECRET_KEY']=$it") }
		return base64.encodeToString(
			ObjectMapper().writeValueAsString(map).toByteArray(Charset.forName("UTF-8"))
		)
	}

	@Throws(IOException::class)
	fun isFormatCorrect(blob: String): Boolean {
		val map: Map<String, String> = getEncryptionMap(blob)
		return (ARTIFACT == map[ARTIFACT_KEY]) && (VERSION == map[VERSION_KEY])
	}

	@Throws(IOException::class)
	private fun getEncryptionMap(blob: String): Map<String, String> {
		val map: Map<String, String> = try {
			ObjectMapper().readValue(Base64.decodeBase64(blob), object : TypeReference<Map<String,String>>() {})
		} catch (e: IOException) {
			log.error(e.localizedMessage)
			mapOf<String,String>()
		}
		return map
	}
}