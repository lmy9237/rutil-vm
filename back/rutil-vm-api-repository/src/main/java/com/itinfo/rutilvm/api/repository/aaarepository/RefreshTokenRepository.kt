package com.itinfo.rutilvm.api.repository.aaarepository

import com.itinfo.rutilvm.api.repository.aaarepository.entity.RefreshToken

import org.springframework.data.jpa.repository.JpaRepository

interface RefreshTokenRepository: JpaRepository<RefreshToken, Int> {
	fun findByExternalId(externalId: String): RefreshToken?
}