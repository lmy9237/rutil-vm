package com.itinfo.dao.aaa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OvirtUserRepository: JpaRepository<OvirtUser, Int> {
	fun findByName(name: String): OvirtUser?
}