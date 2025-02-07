package com.itinfo.rutilvm.api.security

import com.itinfo.rutilvm.api.repository.aaarepository.entity.OvirtUser

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserDetailsImpl: UserDetails {
	var ovirtUser: OvirtUser? = null

	override fun getAuthorities(): MutableCollection<out GrantedAuthority> = mutableListOf()
	override fun getUsername(): String? = null
	override fun getPassword(): String? = null
	override fun isAccountNonExpired(): Boolean = false
	override fun isAccountNonLocked(): Boolean = false
	override fun isCredentialsNonExpired(): Boolean = false
	override fun isEnabled(): Boolean = false
}

