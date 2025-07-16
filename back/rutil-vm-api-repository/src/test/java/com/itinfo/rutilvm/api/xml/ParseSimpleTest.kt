package com.itinfo.rutilvm.api.xml

import com.itinfo.rutilvm.api.configuration.XmlMarshallConfig
import com.itinfo.rutilvm.common.LoggerDelegate
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration

/**
 * [ParseSimpleTest]
 * [ParseSimpleTest] JPA 테스트
 *
 * @author 이찬희 (@chanhi2000)
 * @since 2025-02-27
 */

@ContextConfiguration(classes=[
	XmlMarshallConfig::class,
	PersonXmlProcessor::class,
])
@SpringBootTest
class ParseSimpleTest {
	@Autowired private lateinit var personXmlProcessor: PersonXmlProcessor
	private lateinit var personXml: String
	private lateinit var bookXml: String

	@BeforeEach
	fun setup() {
		log.info("setup ... ")
		personXml = "<?xml version='1.0' encoding='UTF-8'?><person><name><firstName>TeenaMeena</firstName><lastName>Teekka</lastName></name><age>16</age><dateOfBirth>2002-02-10</dateOfBirth><sex>Male</sex><addressHistory><address startDate='2002-02-10' endDate='2005-12-31'>Congo Main Road, Congo - 24680</address><address startDate='2006-01-01' endDate='2017-03-31'>Nigeria Main Road, Nigeira - 13579</address></addressHistory></person>"
	}

	@Test
	fun `should parse Ok`() {
		log.info("should parse Ok ... ")
		// val p = personXmlProcessor.parse(personXml)
		// assertThat(p, `is`(notNullValue()))
		// log.info("should parse Ok ... p: {}", p)
		val doc = personXml.toXmlElement()
		val firstName: String = doc.findValueBy("firstName")
		val lastName: String = doc.findValueBy("lastName")
		val age: String = doc.findValueBy("age")
		val dateOfBirth: String = doc.findValueBy("dateOfBirth")
		val sex: String = doc.findValueBy("sex")
		val address: String = doc.findValueBy("address")
		val startDate: String = doc.findAttrBy("startDate", "address")
		val endDate: String = doc.findAttrBy("endDate", "address")
		val address2: String = doc.findValueBy("address", 1)
		val startDate2: String = doc.findAttrBy("startDate", "address", 1)
		val endDate2: String = doc.findAttrBy("endDate", "address", 1)
		log.debug("should parse Ok ... person.firstName: {}", firstName)
		log.debug("should parse Ok ... person.lastName: {}", lastName)
		log.debug("should parse Ok ... person.age: {}", age)
		log.debug("should parse Ok ... person.dateOfBirth: {}", dateOfBirth)
		log.debug("should parse Ok ... person.sex: {}", sex)
		log.debug("should parse Ok ... person.address: {}", address)
		log.debug("should parse Ok ... person.startDate: {}", startDate)
		log.debug("should parse Ok ... person.endDate: {}", endDate)
		log.debug("should parse Ok ... person.address2: {}", address2)
		log.debug("should parse Ok ... person.startDate2: {}", startDate2)
		log.debug("should parse Ok ... person.endDate2: {}", endDate2)
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
