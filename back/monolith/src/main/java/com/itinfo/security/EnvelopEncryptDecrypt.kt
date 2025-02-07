package com.itinfo.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.type.TypeFactory
import org.apache.commons.codec.binary.Base64
import java.io.IOException
import java.nio.charset.StandardCharsets
import java.security.*
import java.security.cert.Certificate
import java.util.*
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.spec.IvParameterSpec


object EnvelopeEncryptDecrypt {
	private val ARTIFACT: String = "EnvelopeEncryptDecrypt"
	private val VERSION: String = "1"
	private val PUBKEY_DIGEST_ALGO: String = "SHA-1"
	private val PKEY_MODE_PADDING: String = "ECB/PKCS1Padding"

	private val CONTENT_KEY: String = "content"
	private val RANDOM_KEY: String = "random"

	private val ARTIFACT_KEY: String = "artifact"
	private val VERSION_KEY: String = "version"
	private val CIPHER_ALGO_KEY: String = "cipherAlgo"
	private val ENCRYPTED_CONTENT_KEY: String = "encryptedContent"
	private val IV_KEY: String = "iv"
	private val WRAPPED_KEY_KEY: String = "wrappedKey"
	private val WRAP_ALGO_KEY: String = "wrapAlgo"
	private val WRAP_KEY_DIGEST_ALGO_KEY: String = "wrapKeyDigestAlgo"
	private val WRAP_KEY_DIGEST_KEY: String = "wrapKeyDigest"

	private val random: Random = SecureRandom()

	/**
	 * Encrypt a content using envelope.
	 *
	 * @param algo
	 * Cipher algorithm to use.
	 * @param bits
	 * Size of cipher key.
	 * @param cert
	 * Certificate to encrypt to (wrap key using public key).
	 * @param blockSize
	 * Adjust the size of content to blockSize.
	 * @param content
	 * Content to encrypt.
	 * @return Base64 value of envelope.
	 *
	 *
	 * The blockSize is used in order to hide actual content size.
	 */
	@Throws(GeneralSecurityException::class, IOException::class)
	fun encrypt(
		content: ByteArray,
		cert: Certificate = PKIResources.getEngineCertificate().cert,
		algo: String = "AES/OFB/PKCS5Padding",
		bits: Int = 256,
		blockSize: Int = 100,
	): String {
		val wrapAlgo: String = cert.publicKey.algorithm + "/" + PKEY_MODE_PADDING
		val base64 = Base64(0)
		val map: MutableMap<String, String> = hashMapOf()
		val env: MutableMap<String, String> = hashMapOf()

		env[CONTENT_KEY] = base64.encodeToString(content)
		val r = ByteArray(((content.size / blockSize) + 1) * blockSize - content.size)
		random.nextBytes(r)
		env[RANDOM_KEY] = base64.encodeToString(r)

		val gen: KeyGenerator = KeyGenerator.getInstance(algo.split("/".toRegex(), limit = 2).toTypedArray()[0])
		gen.init(bits)
		val key: Key = gen.generateKey()
		val cipher: Cipher = Cipher.getInstance(algo)
		cipher.init(Cipher.ENCRYPT_MODE, key)
		val wrap: Cipher = Cipher.getInstance(wrapAlgo)
		wrap.init(Cipher.WRAP_MODE, cert)

		map[ARTIFACT_KEY] = ARTIFACT
		map[VERSION_KEY] = VERSION
		map[WRAP_ALGO_KEY] = wrapAlgo
		map[CIPHER_ALGO_KEY] = algo
		map[ENCRYPTED_CONTENT_KEY] =
			base64.encodeToString(
				cipher.doFinal(
					ObjectMapper().writeValueAsString(env).toByteArray(StandardCharsets.UTF_8)
				)
			)
		map[IV_KEY] = base64.encodeToString(cipher.iv)
		map[WRAPPED_KEY_KEY] = base64.encodeToString(wrap.wrap(key))
		map[WRAP_KEY_DIGEST_ALGO_KEY] = PUBKEY_DIGEST_ALGO
		map[WRAP_KEY_DIGEST_KEY] = base64.encodeToString(
			MessageDigest.getInstance(PUBKEY_DIGEST_ALGO).digest(cert.publicKey.encoded)
		)
		return base64.encodeToString(ObjectMapper().writeValueAsString(map).toByteArray(StandardCharsets.UTF_8))
	}

	/**
	 * Decrypt a content using envelope.
	 *
	 * @param pkeyEntry
	 * A private key entry (key and certificate) to use for decryption.
	 * @param blob
	 * value of envelope.
	 * @return content.
	 */
	@Throws(GeneralSecurityException::class, IOException::class)
	fun decrypt(
		pkeyEntry: KeyStore.PrivateKeyEntry,
		blob: String
	): ByteArray {
		val map: Map<String, String> = ObjectMapper().readValue(
			Base64.decodeBase64(blob),
			TypeFactory.defaultInstance().constructMapType(
				HashMap::class.java,
				String::class.java,
				String::class.java
			)
		)

		if (!(ARTIFACT == map.get(ARTIFACT_KEY))) {
			throw IllegalArgumentException(String.format("Invalid artifact '%s'", map.get(ARTIFACT_KEY)))
		}
		if (!(VERSION == map.get(VERSION_KEY))) {
			throw IllegalArgumentException(String.format("Invalid version '%s'", map.get(VERSION_KEY)))
		}

		if (pkeyEntry.certificate != null) {
			if (!MessageDigest.isEqual(
					Base64.decodeBase64(map.get(WRAP_KEY_DIGEST_KEY)),
					MessageDigest.getInstance(map.get(WRAP_KEY_DIGEST_ALGO_KEY))
						.digest(pkeyEntry.certificate.publicKey.encoded)
				)
			) {
				throw KeyException("Private key entry mismatch")
			}
		}

		val wrap: Cipher = Cipher.getInstance(map.get(WRAP_ALGO_KEY))
		wrap.init(Cipher.UNWRAP_MODE, pkeyEntry.privateKey)
		val cipher: Cipher = Cipher.getInstance(map.get(CIPHER_ALGO_KEY))
		cipher.init(
			Cipher.DECRYPT_MODE,
			wrap.unwrap(
				Base64.decodeBase64(map.get(WRAPPED_KEY_KEY)),
				cipher.algorithm.split("/".toRegex(), limit = 2).toTypedArray().get(0),
				Cipher.SECRET_KEY
			),
			IvParameterSpec(Base64.decodeBase64(map.get(IV_KEY)))
		)

		val env: Map<String, String> = ObjectMapper().readValue(
			cipher.doFinal(Base64.decodeBase64(map.get(ENCRYPTED_CONTENT_KEY))),
			TypeFactory.defaultInstance().constructMapType(
				HashMap::class.java,
				String::class.java,
				String::class.java
			)
		)
		return Base64.decodeBase64(env.get(CONTENT_KEY))
	}
}