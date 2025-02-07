package com.itinfo.rutilvm.api.repository.history.entity

import com.itinfo.rutilvm.api.model.computing.HostSwVo
import com.itinfo.rutilvm.common.gson

import org.slf4j.LoggerFactory
import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import org.hibernate.annotations.Type

private val log = LoggerFactory.getLogger(HostConfigurationEntity::class.java)

fun HostConfigurationEntity.toHostSwVo(): HostSwVo {
	return HostSwVo.builder {
		osVersion { hostOs }
		osInfo { "oVirt Node 4.5.5 (임의로 넣은값)" }
		kernalVersion { kernelVersion }
		kvmVersion { kvmVersion }
	}
}

