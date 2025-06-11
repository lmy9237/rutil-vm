package com.itinfo.rutilvm.api.ovirt.business

import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.VmStatus

fun VmStatus?.toVmStatusB(): VmStatusB =
	VmStatusB.forCode(this@toVmStatusB?.value()?.uppercase())

fun Vm.findStatus(): VmStatusB =
	this@findStatus.status().toVmStatusB()
