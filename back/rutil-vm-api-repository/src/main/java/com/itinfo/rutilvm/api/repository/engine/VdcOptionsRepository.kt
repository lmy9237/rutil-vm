package com.itinfo.rutilvm.api.repository.engine

import com.itinfo.rutilvm.api.repository.engine.entity.VdcOptionEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VdcOptionsRepository : JpaRepository<VdcOptionEntity, Int> {

	// Find an option by its name and version.
	// While (option_name, version) is not a unique constraint in the DB,
	// in oVirt's logic, it usually refers to a unique configuration.
	// If duplicates are possible and you only want one, consider:
	// findTopByOptionNameAndVersionOrderByOptionIdDesc(optionName: String, version: String): VdcOption?
	fun findByOptionNameAndVersion(
		optionName: String,
		version: String
	): VdcOptionEntity?

	// Find all versions of an option by its name
	fun findByOptionName(optionName: String): List<VdcOptionEntity>

	// Example: Find all options with a specific default value
	fun findByDefaultValue(defaultValue: String): List<VdcOptionEntity>
}
