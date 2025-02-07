package com.itinfo.security;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SecurityUtils {
	public static final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA1";
	public static final int SALT_BYTES = 24;
	public static final int HASH_BYTES = 24;
	public static final int PBKDF2_ITERATIONS = 1000;
	public static final int ITERATION_INDEX = 0;
	public static final int SALT_INDEX = 1;
	public static final int PBKDF2_INDEX = 2;

	public static String createHash(String password) {
		log.info("... createHash");
		String result = null;
		try {
			result = createHash(password.toCharArray());
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return result;
	}

	public static String createHash(char[] password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		log.info("... createHash");
		SecureRandom random = new SecureRandom();
		byte[] salt = new byte[SALT_BYTES];
		random.nextBytes(salt);
		byte[] hash = pbkdf2(password, salt, 1000, HASH_BYTES);
		return PBKDF2_ITERATIONS + ":" + toHex(salt) + ":" + toHex(hash);
	}

	public static boolean validatePassword(String password, String goodHash) {
		log.info("... validatePassword");
		boolean result = false;
		try {
			result = validatePassword(password.toCharArray(), goodHash);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return result;
	}

	public static boolean validatePassword(char[] password, String goodHash) throws NoSuchAlgorithmException, InvalidKeySpecException {
		log.info("... validatePassword");
		String[] params = goodHash.split(":");
		int iterations = Integer.parseInt(params[ITERATION_INDEX]);
		byte[] salt = fromHex(params[SALT_INDEX]);
		byte[] hash = fromHex(params[PBKDF2_INDEX]);
		byte[] testHash = pbkdf2(password, salt, iterations, hash.length);
		return slowEquals(hash, testHash);
	}

	private static boolean slowEquals(byte[] a, byte[] b) {
		int diff = a.length ^ b.length;
		for (int i = 0; i < a.length && i < b.length; i++)
			diff |= a[i] ^ b[i];
		return (diff == 0);
	}

	private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int bytes) throws NoSuchAlgorithmException, InvalidKeySpecException {
		log.info("... pbkdf2");
		PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes * 8);
		SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
		return skf.generateSecret(spec).getEncoded();
	}

	private static byte[] fromHex(String hex) {
		log.info("... fromHex");
		byte[] binary = new byte[hex.length() / 2];
		for (int i = 0; i < binary.length; i++)
			binary[i] = (byte)Integer.parseInt(hex.substring(2*i, 2*i + 2), 16);
		return binary;
	}

	private static String toHex(byte[] array) {
		log.info("... toHex");
		BigInteger bi = new BigInteger(1, array);
		String hex = bi.toString(16);
		int paddingLength = array.length * 2 - hex.length();
		if (paddingLength > 0)
			return String.format("%0" + paddingLength + "d", 0) + hex;
		return hex;
	}

	public String encryptSHA256(String str) {
		String result = "";
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
			messageDigest.update(str.getBytes());
			byte[] byteData = messageDigest.digest();
			StringBuffer stringBuffer = new StringBuffer();
			for (int i = 0; i < byteData.length; i++)
				stringBuffer.append(Integer.toString((byteData[i] & 0xFF) + 256, 16).substring(1));
			result = stringBuffer.toString();
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			result = null;
		}
		return result;
	}

	public String encodeBase64(String str) {
		String result = "";
		try {
			Base64.Encoder encoder = Base64.getEncoder();
			result = new String(encoder.encode(str.getBytes("UTF-8")));
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			result = null;
		}
		return result;
	}

	public String decodeBase64(String str) {
		log.info("... decodeBase64");
		String result = "";
		try {
			Base64.Decoder decoder = Base64.getDecoder();
			result = new String(decoder.decode(str), "UTF-8");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			result = null;
		}
		return result;
	}

	public static boolean compareTime(String time) {
		log.info("... compareTime");
		boolean result = false;
		try {
			SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmmss");
			result = ((new Date()).getTime() > sf.parse(time).getTime());
		} catch (ParseException parseException) {
			log.error(parseException.getLocalizedMessage());
		}
		return result;
	}
}
