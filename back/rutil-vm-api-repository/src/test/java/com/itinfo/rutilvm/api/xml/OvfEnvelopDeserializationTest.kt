package com.itinfo.rutilvm.api.xml

import com.fasterxml.jackson.databind.ObjectMapper
import com.itinfo.rutilvm.api.repository.engine.entity.UnregisteredOvfOfEntities
import com.itinfo.rutilvm.common.LoggerDelegate
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import java.io.FileNotFoundException
import java.io.InputStream

class OvfEnvelopDeserializationTest {

	private lateinit var xmlMapper: ObjectMapper
	private lateinit var ovfXmlContent: String

	@BeforeEach
	fun setup() {
		log.info("setup ...")

		val inputStream: InputStream = Thread.currentThread().contextClassLoader.getResourceAsStream(OVFDATA_TEST_FILENAME) ?: throw FileNotFoundException(
			"Cannot find OVF sample file: $OVFDATA_TEST_FILENAME in resources. " +
					"Ensure it's in src/test/resources and the path is correct."
		)
		ovfXmlContent = inputStream.bufferedReader().use { it.readText() }
	}

	@Test
	fun `should parse OVF Envelope correctly from file`() = assertDoesNotThrow("Parsing OVF from file should not throw an exception") {
		log.info("Attempting to parse OVF XML from file: $OVFDATA_TEST_FILENAME")
		val envelope = xmlMapper.readValue(ovfXmlContent, OvfEnvelope::class.java)
		log.info("OVF XML from file parsed successfully")

		Assertions.assertNotNull(envelope, "Envelope should not be null")
		Assertions.assertNotNull(envelope.virtualSystemSection, "VirtualSystem (Content) should not be null")

		val content = envelope.virtualSystemSection!!
		Assertions.assertEquals("test-20250414", content.name, "VM Name mismatch")

		// Check References
		Assertions.assertNotNull(envelope.references?.files)
		Assertions.assertEquals(8, envelope.references?.files?.size, "Should be 8 files in References")

		// Check DiskSection (top level)
		Assertions.assertNotNull(envelope.diskSection?.disks)
		Assertions.assertEquals(8, envelope.diskSection?.disks?.size, "Should be 8 disks in top-level DiskSection")
		// Make sure the <Disk> elements in DiskSection are correctly namespaced
		// Example assertion for the first disk in DiskSection:
		val firstDiskInSection = envelope.diskSection?.disks?.firstOrNull()
		Assertions.assertNotNull(firstDiskInSection, "First disk in DiskSection should exist")
		Assertions.assertEquals("d00a5b23-c8d5-4f85-af8f-017483a83cb1", firstDiskInSection?.diskId)


		// Check Content Sections (polymorphic)
		Assertions.assertNotNull(content.snapshotsSection, "Content sections list should not be null")
		// Assertions.assertFalse(content.snapshotsSection.isNullOrEmpty(), "Content sections list should not be empty")
		// assertEquals(3, content.sections?.size, "Should be 3 sections in Content (OS, HW, Snapshots)")

		val osSection = content.operatingSystemSection
		Assertions.assertNotNull(osSection, "OperatingSystemSection should be present")
		Assertions.assertEquals("other", osSection?.description)
		// assertEquals("ecf7826f-957f-43e0-bd6e-d8cb23729198", osSection?.ovfId) // Check common base property

		val hardwareSection = content.virtualHardwareSection
		Assertions.assertNotNull(hardwareSection, "VirtualHardwareSection should be present")
		Assertions.assertEquals("8 CPU, 4096 Memory", hardwareSection?.info)
		Assertions.assertNotNull(hardwareSection?.system)
		Assertions.assertEquals("ENGINE 4.4.0.0", hardwareSection?.system?.virtualSystemType)

		/*
		assertNotNull(hardwareSection?.items, "Hardware items list should not be null")
		assertFalse(hardwareSection?.items.isNullOrEmpty(), "Hardware items list should not be empty")

		val firstItem = hardwareSection?.items?.firstOrNull()
		assertNotNull(firstItem, "First hardware item should exist")
		assertEquals("8 virtual cpu", firstItem?.caption, "First item (CPU) caption mismatch")
		assertEquals(3, firstItem?.resourceType, "First item (CPU) resource type mismatch")
		*/

		/*
		val snapshotsSection = content.snapshotsSection
		assertNotNull(snapshotsSection, "SnapshotsSection should be present")
		assertNotNull(snapshotsSection?.snapshots)
		assertFalse(snapshotsSection?.snapshots.isNullOrEmpty(), "Snapshots list should not be empty")
		val activeSnapshot = snapshotsSection?.snapshots?.find { it.type == "ACTIVE" }
		assertNotNull(activeSnapshot, "Active snapshot should exist")
		assertEquals("18f0255e-7dea-4e74-b85f-23cc6688f27a", activeSnapshot?.id)
		*/
		log.info("Basic OVF structure from file seems correct.")

	}

	@Test
	fun `should parse OVF Envelop correctly from file using document`() = assertDoesNotThrow("Parsing OVF from file should not throw an exception") {
		log.info("should parse OVF Envelop correctly from file using document ... data : $OVFDATA_TEST_FILENAME")
		val ovfEnvelope = ovfXmlContent.toOvfEnvelope()
		Assertions.assertNotNull(ovfEnvelope, "Envelope should not be null")
		log.info("files({}): {}", ovfEnvelope.references?.files?.size, ovfEnvelope.references?.files)
		Assertions.assertNotNull(ovfEnvelope.references, "References should not be null")
		Assertions.assertNotNull(ovfEnvelope.references?.files, "Files should not be null")
		// Assertions.assertNotNull(ovfEnvelope.references?.files?.size, "Files should not be null")
		Assertions.assertNotNull(ovfEnvelope.references?.files, "Files should not be null")
		log.info("networks({}): {}", ovfEnvelope.networkSection?.networks?.size, ovfEnvelope.networkSection?.networks)
		Assertions.assertNotNull(ovfEnvelope.networkSection, "NetworkSection should not be null")
		log.info("disks({}): {}", ovfEnvelope.diskSection?.disks?.size, ovfEnvelope.diskSection?.disks)
		Assertions.assertNotNull(ovfEnvelope.diskSection, "DiskSection should not be null")
		log.info("vmSection: {}", ovfEnvelope.virtualSystemSection)
		Assertions.assertNotNull(ovfEnvelope.virtualSystemSection, "VirtualSystemSection should not be null")
		log.info("vmSection.operatingSystemSection: {}", ovfEnvelope.virtualSystemSection?.operatingSystemSection)
		Assertions.assertNotNull(ovfEnvelope.virtualSystemSection?.operatingSystemSection, "OperatingSystemSection should not be null")
		log.info("vmSection.virtualHardwareSection: {}", ovfEnvelope.virtualSystemSection?.virtualHardwareSection)
		Assertions.assertNotNull(ovfEnvelope.virtualSystemSection?.virtualHardwareSection, "VirtualHardwareSection should not be null")
		log.info("vmSection.virtualHardwareSection.items({}): {}", ovfEnvelope.virtualSystemSection?.virtualHardwareSection?.items?.size ?: 0, ovfEnvelope.virtualSystemSection?.virtualHardwareSection?.items?.mapNotNull { it.instanceId })
		Assertions.assertNotNull(ovfEnvelope.virtualSystemSection?.snapshotsSection, "SnapshotSection should not be null")
		log.info("vmSection.snapshotSection.snapshots({}): {}", ovfEnvelope.virtualSystemSection?.snapshotsSection?.snapshots?.size ?: 0, ovfEnvelope.virtualSystemSection?.snapshotsSection?.snapshots?.mapNotNull { it.description })
	}

	companion object {
		private val log by LoggerDelegate()
		private const val OVFDATA_TEST_FILENAME = "./ovfdata-ecf7826f-957f-43e0-bd6e-d8cb23729198.xml"
	}
}
