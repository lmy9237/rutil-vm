package com.itinfo.dao.engine

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserDetailRepository: JpaRepository<UserDetail, UUID> {
	fun findByExternalId(externalId: String): UserDetail?
}