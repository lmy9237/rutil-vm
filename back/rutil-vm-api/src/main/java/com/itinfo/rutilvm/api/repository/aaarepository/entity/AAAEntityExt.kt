package com.itinfo.rutilvm.api.repository.aaarepository.entity

import com.itinfo.rutilvm.api.model.auth.UserVo
import com.itinfo.rutilvm.api.security.UserDetailsImpl

import org.springframework.security.core.userdetails.UserDetails

fun OvirtUser.toUserVo(userDetail: UserDetail?): UserVo = UserVo.builder {
	username { this@toUserVo.name }
	password { this@toUserVo.password }
	firstName { userDetail?.name }
	lastName { userDetail?.surname }
	namespace { userDetail?.namespace }
	email { userDetail?.email }
	administrative { userDetail?.lastAdminCheckStatus }
	// principal { this@toUserVo.namespace }
}

fun OvirtUser.toUserDetails(): UserDetails = UserDetailsImpl().apply {
	ovirtUser = this@toUserDetails
}


fun List<OvirtUser>.toUserVos(userDetails: List<UserDetail>): List<UserVo> {
	val itemById: Map<String, UserDetail> =
		userDetails.associateBy { it.externalId }
	return this.map { it.toUserVo(itemById[it.uuid]) }
}
