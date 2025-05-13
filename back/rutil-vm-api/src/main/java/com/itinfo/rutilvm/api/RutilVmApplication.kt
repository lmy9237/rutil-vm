package com.itinfo.rutilvm.api

import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.runApplication
import org.springframework.boot.web.servlet.ServletComponentScan
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.context.annotation.ComponentScan
import org.springframework.core.SpringVersion
import org.springframework.scheduling.annotation.EnableScheduling
import java.text.SimpleDateFormat
import java.util.*

private val log = LoggerFactory.getLogger(RutilVmApplication::class.java)

@SpringBootApplication()
@ComponentScan(basePackages = [
	"com.itinfo.rutilvm.api.configuration",
	// "com.itinfo.rutilvm.api.security",
	"com.itinfo.rutilvm.api.service",
	"com.itinfo.rutilvm.api.repository",
])
@ServletComponentScan
@EnableScheduling
class RutilVmApplication: SpringBootServletInitializer() {
	override fun configure(builder: SpringApplicationBuilder?): SpringApplicationBuilder {
		log.info("configure ...")
		return builder!!.sources(RutilVmApplication::class.java)
	}

	companion object {
		@JvmStatic lateinit var ctx: ConfigurableApplicationContext

		@JvmStatic
		fun main(args: Array<String>) {
			log.info("SPRING VERSION: ${SpringVersion.getVersion()}")
			ctx = runApplication<RutilVmApplication>(*args)
		}

		@JvmStatic
		fun shutdown() {
			log.info("shutdown ...")
			ctx.close()
		}

		@JvmStatic
		fun reboot() {
			log.info("reboot ...")
			val t = Thread {
				val args: ApplicationArguments = ctx.getBean(ApplicationArguments::class.java)
				log.info("reboot ... separate thread launched")
				ctx.close()
				ctx = runApplication<RutilVmApplication>(*args.sourceArgs)
			}
			t.isDaemon = false
			t.start()
			log.info("reboot ... STARTED")
		}
	}
}

const val GB = 1073741824.0 // gb 변환

private const val DEFAULT_TIME_SLEEP_IN_MILLI = 500L
private const val DEFAULT_TIME_LONG_SLEEP_IN_MILLI = 5000L

fun doSleep(timeInMilli: Long = DEFAULT_TIME_SLEEP_IN_MILLI) {
	log.info("... doSleep($timeInMilli)")
	try { Thread.sleep(timeInMilli) } catch (e: InterruptedException) { log.error(e.localizedMessage) }
}

fun doLongSleep() =
	doSleep(DEFAULT_TIME_LONG_SLEEP_IN_MILLI)

data class ItCloudOutput(val o: String = "")
