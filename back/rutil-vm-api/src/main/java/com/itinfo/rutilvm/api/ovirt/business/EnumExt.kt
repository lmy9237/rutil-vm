package com.itinfo.rutilvm.api.ovirt.business

import org.ovirt.engine.sdk4.types.LogSeverity
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmAffinity
import org.ovirt.engine.sdk4.types.VmStatus

fun LogSeverity?.toAuditLogSeverity(): AuditLogSeverity =
	AuditLogSeverity.forCode(this@toAuditLogSeverity?.value())

fun VmStatus?.toVmStatusB(): VmStatusB =
	VmStatusB.forCode(this@toVmStatusB?.value())

fun Vm.findStatus(): VmStatusB =
	this@findStatus.status().toVmStatusB()

fun VmAffinity?.toMigrationSupport(): MigrationSupport =
	MigrationSupport.forCode(this@toMigrationSupport?.value())

fun Vm.findMigrationSupport(): MigrationSupport =
	this@findMigrationSupport.placementPolicy().affinity().toMigrationSupport()

fun MigrationSupport.toVmAffinity(): VmAffinity =
	VmAffinity.fromValue(this@toVmAffinity.code)
