package com.itinfo.rutilvm.api.repository.aaarepository.entity

import com.itinfo.rutilvm.common.gson

import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.Month
import javax.persistence.*

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
	@SequenceGenerator(name="users_id_seq", sequenceName="users_id_seq", allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="users_id_seq")
	@Column(name="id",updatable=false)
	var id:	Int? = null,
    @Column(unique = true, nullable = false, columnDefinition = "uuid")
	var uuid: String = "",
    var name: String = "",
    var password: String = "",
    var passwordValidTo: LocalDateTime? = LocalDateTime.now().plusYears(10),
    var loginAllowed: String,
    var nopasswd: Int,
    var disabled: Int,
    var unlockTime: LocalDateTime,
    var lastSuccessfulLogin: LocalDateTime,
    var lastUnsuccessfulLogin: LocalDateTime = DEFAULT_TIME_LOWEST,
    var consecutiveFailures: Int = DEFAULT_CONSECUTIVE_FAILURE,
    val validFrom: LocalDateTime? = DEFAULT_TIME_LOWEST,
    val validTo: LocalDateTime? = LocalDateTime.now().plusYears(10),
	// 불가능... 다른 데이터소스에서 찾을수 있는 엔티티
    /*
    @OneToOne
    @JoinColumn(name="externalId")
    var userDetail: UserDetail
    */
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bId: Int? = null;fun id(block: () -> Int?) { bId = block() }
		private var bUuid: String = "";fun uuid(block: () -> String?) { bUuid = block() ?: "" }
		private var bName: String = "";fun name(block: () -> String?) { bName = block() ?: "" }
		private var bPassword: String = "";fun password(block: () -> String?) { bPassword = block() ?: "" }
		private var bPasswordValidTo: LocalDateTime? = LocalDateTime.now().plusYears(10);fun passwordValidTo(block: () -> LocalDateTime?) { bPasswordValidTo = block() ?: LocalDateTime.now().plusYears(10) }
		private var bLoginAllowed: String = DEFAULT_LOGIN_ALLOWED;fun loginAllowed(block: () -> String?) { bLoginAllowed = block() ?: DEFAULT_LOGIN_ALLOWED }
		private var bNopasswd: Int = DEFAULT_NOPASSWD;fun nopasswd(block: () -> Int?) { bNopasswd = block() ?: DEFAULT_NOPASSWD }
		private var bDisabled: Int = DEFAULT_DISABLED;fun disabled(block: () -> Int?) { bDisabled = block() ?: DEFAULT_DISABLED }
		private var bUnlockTime: LocalDateTime = DEFAULT_TIME_LOWEST;fun unlockTime(block: () -> LocalDateTime?) { bUnlockTime = block() ?: DEFAULT_TIME_LOWEST }
		private var bLastSuccessfulLogin: LocalDateTime = DEFAULT_TIME_LOWEST;fun lastSuccessfulLogin(block: () -> LocalDateTime?) { bLastSuccessfulLogin = block() ?: DEFAULT_TIME_LOWEST }
		private var bLastUnsuccessfulLogin: LocalDateTime = DEFAULT_TIME_LOWEST;fun lastUnsuccessfulLogin(block: () -> LocalDateTime?) { bLastUnsuccessfulLogin = block() ?: DEFAULT_TIME_LOWEST }
		private var bConsecutiveFailures: Int = DEFAULT_CONSECUTIVE_FAILURE;fun consecutiveFailures(block: () -> Int?) { bConsecutiveFailures = block() ?: DEFAULT_CONSECUTIVE_FAILURE }
		private var bValidFrom: LocalDateTime = DEFAULT_TIME_LOWEST;fun validFrom(block: () -> LocalDateTime?) { bValidFrom = block() ?: DEFAULT_TIME_LOWEST }
		private var bValidTo: LocalDateTime = LocalDateTime.now().plusYears(10);fun validTo(block: () -> LocalDateTime?) { bValidTo = block() ?: LocalDateTime.now().plusYears(10) }
		fun build(): OvirtUser = OvirtUser(bId, bUuid, bName, bPassword, bPasswordValidTo, bLoginAllowed, bNopasswd, bDisabled, bUnlockTime, bLastSuccessfulLogin, bLastUnsuccessfulLogin, bConsecutiveFailures, bValidFrom, bValidTo)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): OvirtUser = Builder().apply(block).build()
		const val DEFAULT_LOGIN_ALLOWED = "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
		const val DEFAULT_NOPASSWD = 0
		const val DEFAULT_DISABLED = 0
		const val DEFAULT_CONSECUTIVE_FAILURE = 0
		val DEFAULT_TIME_LOWEST: LocalDateTime = LocalDate.of(1970, Month.JANUARY, 1).atStartOfDay()
	}
}
