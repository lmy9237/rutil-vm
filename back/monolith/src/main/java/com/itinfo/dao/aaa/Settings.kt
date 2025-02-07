package com.itinfo.dao.aaa

import com.itinfo.dao.gson
import com.itinfo.model.UserVo

import java.io.Serializable
import java.time.LocalDateTime
import javax.persistence.Column
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
@Table(name = "aaa_jdbc.settings")
class Settings(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Int,

	val uuid: String,
	val name: String,
	val description: String,
	val value: String,
): Serializable {
	override fun toString(): String = gson.toJson(this)
	companion object {
		const val NAME_PBE_ALGORITHM = "PBKDF2WithHmacSHA1"
		const val NAME_PBE_KEY_SIZE	= 256
		const val NAME_PBE_ITERATIONS =	2000
	}
}


