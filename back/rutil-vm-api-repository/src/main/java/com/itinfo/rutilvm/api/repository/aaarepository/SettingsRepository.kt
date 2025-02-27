package com.itinfo.rutilvm.api.repository.aaarepository

import com.itinfo.rutilvm.api.repository.aaarepository.entity.Settings

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SettingsRepository: JpaRepository<Settings, Int> {
}
