package com.itinfo

import com.itinfo.rutilvm.common.LoggerDelegate
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.runApplication
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer
import org.springframework.context.annotation.ComponentScan
import org.springframework.core.SpringVersion

@SpringBootApplication(scanBasePackages = ["com.itinfo.jsp"])
@ComponentScan(basePackages = [
	"com.itinfo.configuration",
	"com.itinfo.security",
	"com.itinfo.service",
	"com.itinfo.dao"
])
class BootApplication: SpringBootServletInitializer() {
	override fun configure(builder: SpringApplicationBuilder?): SpringApplicationBuilder {
		return builder!!.sources(BootApplication::class.java)
	}

	companion object {
		val log by LoggerDelegate()
	}
}

fun main(args: Array<String>) {
	BootApplication.log.info("SPRING VERSION: ${SpringVersion.getVersion()}")
	runApplication<BootApplication>(*args)
}
