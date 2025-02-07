package com.itinfo.dao.engine

import com.itinfo.dao.aaa.OvirtUser
import com.itinfo.dao.gson

import java.io.Serializable
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

/**
 * [OvirtUser]
 * engine 엔티티: USERS
 *
 * @see com.itinfo.dao.aaa.OvirtUser
 */
@Entity
@Table(name = "users", schema = "public")
class UserDetail(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@org.hibernate.annotations.Type(type="org.hibernate.type.PostgresUUIDType")
	var userId: UUID,

	var name: String,
	var surname: String,
	var domain: String,
	var username: String,
	var department: String,
	@Column(nullable=true)
	var email: String? = "",
	@Column(nullable=true)
	var note: String? = "",
	var lastAdminCheckStatus: Boolean = false,
	var externalId: String,
	@Column(name="_create_date")
	var createDate: LocalDateTime,
	@Column(name="_update_date", nullable=true)
	var updateDate: LocalDateTime? = null,
	@Column(nullable=true)
	var namespace: String? = "*",
	@Column(nullable=true)
	var userAndDomain: String? = "",
	// 불가능... 다른 데이터소스에서 찾을수 있는 엔티티
	/*
	@OneToOne(mappedBy="userDetail")
	var user: OvirtUser
	*/
): Serializable {
	override fun toString(): String = gson.toJson(this)
}