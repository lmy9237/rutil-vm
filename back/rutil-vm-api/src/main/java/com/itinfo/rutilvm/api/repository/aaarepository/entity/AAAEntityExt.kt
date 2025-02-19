package com.itinfo.rutilvm.api.repository.aaarepository.entity

import com.itinfo.rutilvm.api.model.auth.UserVo
import com.itinfo.rutilvm.api.security.UserDetailsImpl

import org.springframework.security.core.userdetails.UserDetails

fun OvirtUser.toUserVo(userDetail: UserDetail? = null, exposeDetail: Boolean = false): UserVo = UserVo.builder {
	username { this@toUserVo.name }
	password { if (exposeDetail) this@toUserVo.password else "" }
	firstName { if (exposeDetail) userDetail?.name else "" }
	lastName { if (exposeDetail) userDetail?.surname else "" }
	namespace { if (exposeDetail) userDetail?.namespace else "" }
	email { if (exposeDetail) userDetail?.email else "" }
	administrative { if (exposeDetail) userDetail?.lastAdminCheckStatus else false }
	disabled { this@toUserVo.disabled != 0 }
	createDate { if (exposeDetail) userDetail?.createDate else null }
	// principal { this@toUserVo.namespace }
}

fun OvirtUser.toUserDetails(): UserDetails = UserDetailsImpl().apply {
	ovirtUser = this@toUserDetails
}


fun List<OvirtUser>.toUserVos(userDetails: List<UserDetail>): List<UserVo> {
	val itemById: Map<String, UserDetail> =
		userDetails.associateBy { it.externalId }
	return this.map { it.toUserVo(itemById[it.uuid], true) }
}
