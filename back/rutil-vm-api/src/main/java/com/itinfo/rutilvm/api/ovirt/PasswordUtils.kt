package com.itinfo.rutilvm.api.ovirt

import com.itinfo.rutilvm.api.repository.aaarepository.entity.Settings

import org.apache.commons.codec.binary.Base64
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import java.io.IOException
import java.nio.charset.Charset
import java.security.GeneralSecurityException
import java.security.SecureRandom
import java.util.*
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

private val log: Logger = LoggerFactory.getLogger("com.itinfo.rutilvm.api.security.PasswordUtilsKt")

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

/**
 * [String.validatePassword]
 */
fun String.validatePassword(encrypted: String): Boolean {
	val result: Boolean = EnvelopePBE.check(encrypted, this)
	log.debug("... validatePassword('$this', '$encrypted')=$result")
	return result
}

// Function to generate a random salt
private const val SALT_BYTES = 24
fun generateSalt(): String {
	val salt = ByteArray(SALT_BYTES)
	val secureRandom = SecureRandom()
	secureRandom.nextBytes(salt)
	return Base64.encodeBase64String(salt)
}

// Function to hash a password using PBKDF2 with HMAC-SHA-256
fun String.hashPassword(salt: String = generateSalt()): String = EnvelopePBE.encode(this)

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
		// blob= 암호화된 비밀번호, password= 입력된 비밀번호
		val map: Map<String, String> = getEncryptionMap(blob) // 받아온 비밀번호를 디코딩한 후에 map에 가져오기
		if (map.isEmpty()) {
			log.warn("Invalid format of previous password. Cannot check equality of previous and new password.")
			return false
		}
		if (ARTIFACT != map[ARTIFACT_KEY])
			throw IllegalArgumentException(String.format("Invalid artifact '${map[ARTIFACT_KEY]}'"))

		if (VERSION != map[VERSION_KEY])
			throw IllegalArgumentException(String.format("Invalid version '${map[VERSION_KEY]}'"))

		val salt: ByteArray = Base64.decodeBase64(map[SALT_KEY])
		val secretGenerated: SecretKey = SecretKeyFactory.getInstance(map[ALGORITHM_KEY]).generateSecret(
			PBEKeySpec(
				password.toCharArray(), salt, map[ITERATIONS_KEY]!!.toInt(), salt.size * 8
			)
		)
		// DB에 저장된 비번을 decode, secret에 있는 값과 새 비번을 변경하고 암호화된 값과 비교 ?
		return Base64.decodeBase64(map[SECRET_KEY]).contentEquals(secretGenerated.encoded)
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
		// SecureRandom.getInstance(randomProvider).nextBytes(salt)
		SecureRandom.getInstanceStrong().nextBytes(salt)
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