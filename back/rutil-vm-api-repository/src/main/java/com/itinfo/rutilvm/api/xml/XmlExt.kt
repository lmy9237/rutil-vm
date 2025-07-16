package com.itinfo.rutilvm.api.xml

import org.w3c.dom.Document
import org.w3c.dom.Element
import org.w3c.dom.Node
import org.w3c.dom.NodeList
import java.io.ByteArrayInputStream
import java.io.InputStream
import javax.xml.parsers.DocumentBuilderFactory

fun String.toXmlElement(): Element {
	val `is`: InputStream = ByteArrayInputStream(this@toXmlElement.toByteArray())
	val doc: Document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(`is`)
	return doc.documentElement
}

fun NodeList?.toList(): List<Node> = (0 until (this@toList?.length ?: 0)).mapNotNull { i ->
	this@toList?.item(i)
}

private fun Element.findNodeList(tagName: String, namespace: String = ""): NodeList? = if (namespace.isNotEmpty())
	this@findNodeList.getElementsByTagNameNS(namespace, tagName)
else
	this@findNodeList.getElementsByTagName(tagName)

fun Element.findAllNodesBy(tagName: String, attrKey: String = "", attrVal: String = ""): List<Node> =
	this@findAllNodesBy.findNodeList(tagName).toList().filter {
		if (attrKey.isNotEmpty() && attrVal.isNotEmpty()) {
			it.hasAttributes() &&
			it.attributes.getNamedItem(attrKey).textContent == attrVal
		} else true
	}

fun Element.findValueBy(tagName: String, at: Int = 0, namespace: String = ""): String =
	this@findValueBy.findAllNodesBy(tagName, namespace)[at].textContent ?: ""

fun Element.findAttrBy(attr: String, tagName: String, at: Int = 0, namespace: String = ""): String =
	this@findAttrBy.findNodeList(tagName, namespace)?.item(at)?.attributes?.getNamedItem(attr)?.textContent ?: ""
