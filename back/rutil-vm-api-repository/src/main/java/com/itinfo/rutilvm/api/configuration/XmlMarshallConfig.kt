package com.itinfo.rutilvm.api.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.oxm.xstream.XStreamMarshaller

@Configuration
open class XmlMarshallConfig {

	@Bean
	open fun xtreamMarshaller(): XStreamMarshaller =
		XStreamMarshaller().apply {
			setAliases(mapOf(
				"fileServiceXml" to "com.itinfo.rutilvm.api.xml.Person",
				// "bookLookupXml" to "com.itinfo.rutilvm.api.xml.BookLookup"
			))
			setAutodetectAnnotations(true)
		}
}
