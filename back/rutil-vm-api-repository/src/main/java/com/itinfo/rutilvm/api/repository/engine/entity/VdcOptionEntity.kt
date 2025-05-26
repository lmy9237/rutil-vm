package com.itinfo.rutilvm.api.repository.engine.entity

import com.itinfo.rutilvm.common.gson
import org.slf4j.LoggerFactory
import java.io.Serializable
// Or jakarta.persistence.* for newer Spring Boot
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.SequenceGenerator
import javax.persistence.Table

private val log = LoggerFactory.getLogger(VdcOptionEntity::class.java)

/**
 *
 * [VdcOptionEntity]
 * 호스트 네트워크 인터페이스 (NIC) 정보
 *
 * @property optionId [Int]
 * @property optionName [String]
 * @property optionValue [String]
 * @property version [String]
 * @property defaultValue [String]
 *
 * @see DnsResolverConfigurationEntity
 */
@Entity
@Table(name = "vdc_options")
class VdcOptionEntity(
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vdc_options_seq_generator")
	@SequenceGenerator(
		name="vdc_options_seq_generator",
		sequenceName="vdc_options_seq", // Matches your DDL
		allocationSize=1 // Standard for PostgreSQL sequences with Hibernate
	)
	val optionId: Int? = null, // Nullable because it's generated, Int for int4
	val optionName: String? = "",
	val optionValue: String? = "",
	val version: String? = "general", // Reflects the DB default 'general'
	val defaultValue: String? = "",
): Serializable {
	override fun toString(): String =
		gson.toJson(this)

	class Builder {
		private var bOptionId: Int? = null;fun optionId(block: () -> Int?) { bOptionId = block() }
		private var bOptionName: String? = "";fun optionName(block: () -> String?) { bOptionName = block() ?: "" }
		private var bOptionValue: String? = "";fun optionValue(block: () -> String?) { bOptionValue = block() ?: "" }
		private var bVersion: String? = "";fun version(block: () -> String?) { bVersion = block() ?: "" }
		private var bDefaultValue: String? = "";fun defaultValue(block: () -> String?) { bDefaultValue = block() ?: "" }
		fun build(): VdcOptionEntity = VdcOptionEntity(bOptionId, bOptionName, bOptionValue, bVersion, bDefaultValue)
	}

	companion object {
		inline fun builder(block: Builder.() -> Unit): VdcOptionEntity = Builder().apply(block).build()
	}
}
