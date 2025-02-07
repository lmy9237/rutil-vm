package com.itinfo.rutilvm.api.security

import com.itinfo.rutilvm.common.gson
import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(
	val userid: String = "",
	val passwd: String = "",
	val url: String = "",
) : UserDetails {
	override fun getAuthorities(): Collection<GrantedAuthority> {
		log.info("... getAuthorities")
		return listOf(SimpleGrantedAuthority("USER"))
	}

	override fun getPassword(): String = passwd
	override fun getUsername(): String = userid
	override fun isAccountNonExpired(): Boolean = true
	override fun isAccountNonLocked(): Boolean = true
	override fun isCredentialsNonExpired(): Boolean = true
	override fun isEnabled(): Boolean = true

	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bUserid: String = "";fun userid(block: () -> String?) { bUserid = block() ?: "" }
		private var bPasswd: String = "";fun passwd(block: () -> String?) { bPasswd = block() ?: "" }
	//  private var bAuthorities: Collection<GrantedAuthority> = setOf();fun authorities(block: () -> Collection<GrantedAuthority>?) { bAuthorities = block() ?: setOf() }
		private var bUrl: String = "";fun url(block: () -> String?) { bUrl = block() ?: "" }
		fun build(): CustomUserDetails = CustomUserDetails(bUserid, bPasswd, bUrl)
	}
	companion object {
		@JvmStatic inline fun custerUserDetails(block: Builder.() -> Unit): CustomUserDetails = Builder().apply(block).build()
		private val log by LoggerDelegate()
	}
}