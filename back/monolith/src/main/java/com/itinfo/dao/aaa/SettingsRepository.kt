package com.itinfo.dao.aaa

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import java.util.UUID

@Repository
interface SettingsRepository: JpaRepository<Settings, Int> {
}