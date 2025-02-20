package com.itinfo.rutilvm.api.repository.aaarepository.entity

import com.itinfo.rutilvm.common.gson
import org.hibernate.annotations.Type
import java.io.Serializable
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table
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
	@Type(type="pg-uuid")
	@Column(unique = true, nullable = false, columnDefinition = "uuid")
	var userId: UUID = UUID.randomUUID(),
    var name: String = "",
    var surname: String = "",
    var domain: String = DEFAULT_DOMAIN,
    var username: String,
    var department: String = "",
    @Column(nullable=true)
	var email: String? = "",
    @Column(nullable=true)
	var note: String? = "",
    var lastAdminCheckStatus: Boolean = true,
    var externalId: String,
    @Column(name="_create_date")
	var createDate: LocalDateTime = LocalDateTime.now(),
    @Column(name="_update_date", nullable=true)
	var updateDate: LocalDateTime?,
    @Column(nullable=true)
	var namespace: String? = DEFAULT_NAMESPACE,
    @Column(name = "user_and_domain", insertable=false, updatable=false)
	val userAndDomain: String? = "",
	// 불가능... 다른 데이터소스에서 찾을수 있는 엔티티
    /*
    @OneToOne(mappedBy="userDetail")
    var user: OvirtUser
    */
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bUserId: UUID = UUID.randomUUID();fun userId(block: () -> UUID) { bUserId = block() }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bSurname: String = "";fun surname(block: () -> String?) { bSurname = block() ?: "" }
		private var bDomain: String = DEFAULT_DOMAIN;fun domain(block: () -> String?) { bDomain = block() ?: DEFAULT_DOMAIN }
		private var bUsername: String = "";fun username(block: () -> String?) { bUsername = block() ?: "" }
		private var bDepartment: String = "";fun department(block: () -> String?) { bDepartment = block() ?: "" }
		private var bEmail: String? = "${bUsername}@localhost";fun email(block: () -> String?) { bEmail = block() ?: "${bUsername}@localhost" }
		private var bNote: String? = "";fun note(block: () -> String?) { bNote = block() ?: "" }
		private var bLastAdminCheckStatus: Boolean = true;fun lastAdminCheckStatus(block: () -> Boolean?) { bLastAdminCheckStatus = block() ?: true }
		private var bExternalId: String = "";fun externalId(block: () -> String?) { bExternalId = block() ?: "" }
		private var bCreateDate: LocalDateTime = LocalDateTime.now();fun createDate(block: () -> LocalDateTime?) { bCreateDate = block() ?: LocalDateTime.now() }
		private var bUpdateDate: LocalDateTime? = LocalDateTime.now();fun updateDate(block: () -> LocalDateTime?) { bUpdateDate = block() }
		private var bNamespace: String? = DEFAULT_NAMESPACE;fun namespace(block: () -> String?) { bNamespace = block() ?:  DEFAULT_NAMESPACE }
		private var bUserAndDomain: String? = "";fun userAndDomain(block: () -> String?) { bUserAndDomain = block() }
		fun build(): UserDetail = UserDetail(bUserId, bName, bSurname, bDomain, bUsername, bDepartment, bEmail, bNote, bLastAdminCheckStatus, bExternalId, bCreateDate, bUpdateDate, bNamespace, bUserAndDomain)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): UserDetail = Builder().apply(block).build()
		const val DEFAULT_DOMAIN = "internal-authz"
		const val DEFAULT_NAMESPACE = "*"
	}
}