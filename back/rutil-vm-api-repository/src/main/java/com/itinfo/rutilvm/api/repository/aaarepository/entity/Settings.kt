package com.itinfo.rutilvm.api.repository.aaarepository.entity

import com.itinfo.rutilvm.common.gson

import java.io.Serializable
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

/**
 * [Settings]
 * engine 엔티티: SETTINGS
 *
 */
@Entity
@Table(name = "settings", schema = "aaa_jdbc")
class Settings(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Int,

	val uuid: String,
	val name: String,
	val description: String,
	val value: String,
): Serializable {
	override fun toString(): String =
		gson.toJson(this)
	companion object {
		const val NAME_PBE_ALGORITHM = "PBKDF2WithHmacSHA1"
		const val NAME_PBE_KEY_SIZE	= 256
		const val NAME_PBE_ITERATIONS =	2000
	}
}


