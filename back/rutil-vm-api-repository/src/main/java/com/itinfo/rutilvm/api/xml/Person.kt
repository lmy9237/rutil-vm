package com.itinfo.rutilvm.api.xml

import com.thoughtworks.xstream.annotations.XStreamAlias
import com.thoughtworks.xstream.annotations.XStreamAsAttribute
import com.thoughtworks.xstream.annotations.XStreamConverter
import com.thoughtworks.xstream.annotations.XStreamImplicit
import com.thoughtworks.xstream.converters.extended.ToAttributedValueConverter
import com.thoughtworks.xstream.io.xml.CompactWriter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.oxm.xstream.XStreamMarshaller
import org.springframework.stereotype.Component
import java.io.Serializable
import java.io.StringWriter

/**
 * [Person]
 * Pojo equivalent of the person xml
 *
 * @author 이찬희 (@chanhi2000)
 */
@XStreamAlias("person")
open class Person(
	val name: String = "",
	val age: String = "",
	val dateOfBirth: String = "",
	val sex: String = "",
	val addressHistory: AddressHistory? = null,
): Serializable {
	companion object {
		class Name(
			val firstName: String,
			val lastName: String,
		): Serializable {

		}

		class AddressHistory (
			@XStreamImplicit(itemFieldName = "address")
			val addressHistory: MutableList<Address> = mutableListOf()
		): Serializable {
			companion object {
				@XStreamConverter(value = ToAttributedValueConverter::class, strings = ["postalAddress"])
				class Address(
					@XStreamAsAttribute
					val startDate: String,
					@XStreamAsAttribute
					val endDate: String,
					val postalAddress: String,
				): Serializable {

				}
			}
		}
	}
}

/**
 * [PersonXmlProcessor]
 * Class to marshal and unmarshall Person Xml
 *
 * @author 이찬희 (@chanhi2000)
 */
@Component
open class PersonXmlProcessor  {
	@Autowired private lateinit var xstreamMarshaller: XStreamMarshaller

	/**
	 * Parse the Xml file to Person object
	 *

	fun parse(personXmlFile: File): Person? {
	try {
	return parse(org.apache.commons.io.FileUtils.readFileToString(personXmlFile))
	} catch (e: IOException) {
	e.printStackTrace()
	return null
	}
	}
	 */

	/**
	 * [PersonXmlProcessor.parse]
	 * Parse the Xml string to Person object
	 *
	 * @param xml [String]
	 * @return
	 */
	fun parse(xml: String): Person? {
		return try {
			 xstreamMarshaller.xStream.fromXML(
				xml.replace("\n".toRegex(), "")
			) as Person?
		} catch (e: Exception) {
			e.printStackTrace()
			null
		}
	}

	/**
	 * [PersonXmlProcessor.generate]
	 * Generate the Xml string from Person object
	 *
	 * @param person [Person]
	 * @return
	 */
	fun generate(person: Person?): String {
		val stringWriter = StringWriter()
		xstreamMarshaller.xStream.marshal(person, CompactWriter(stringWriter))
		val xmlMessageStr = stringWriter.toString()
		return XML_HEADER + xmlMessageStr
	}

	companion object {
		private const val XML_HEADER = """<?xml version="1.0" encoding="UTF-8"?>"""
	}
}
