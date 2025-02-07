package com.itinfo.dao.aaa

import com.itinfo.dao.engine.UserDetail
import com.itinfo.dao.gson
import com.itinfo.model.UserVo

import java.io.Serializable
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

/**
 * [OvirtUser]
 * aaa 엔티티: USERS
 *
 * @see com.itinfo.model.UserVo
 */
@Entity
@Table(name = "users", schema = "aaa_jdbc")
class OvirtUser(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id:	Int,

	val uuid: String,
	val name: String,
	val password: String,
	val passwordValidTo: LocalDateTime,
	val loginAllowed: String,
	val nopasswd: Int,
	val disabled: Int,
	val unlockTime: LocalDateTime,
	val lastSuccessfulLogin: LocalDateTime,
	val lastUnsuccessfulLogin: LocalDateTime,
	val consecutiveFailures: Int,
	val validFrom: LocalDateTime,
	val validTo: LocalDateTime,
	// 불가능... 다른 데이터소스에서 찾을수 있는 엔티티
	/*
	@OneToOne
	@JoinColumn(name="externalId")
	var userDetail: UserDetail
	*/
): Serializable {
	override fun toString(): String = gson.toJson(this)
}

fun OvirtUser.toUserVo(userDetail: UserDetail?): UserVo = UserVo.userVo {
	usename { this@toUserVo.name }
	password { this@toUserVo.password }
	firstName { userDetail?.name }
	lastName { userDetail?.surname }
	email { userDetail?.email }
	administrative { userDetail?.lastAdminCheckStatus }
	// principal { this@toUserVo.namespace }
}

fun List<OvirtUser>.toUserVos(userDetails: List<UserDetail>): List<UserVo> {
	val itemById: Map<String, UserDetail> =
		userDetails.associateBy { it.externalId }
	return this.map { it.toUserVo(itemById[it.uuid]) }
}