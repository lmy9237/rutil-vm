package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.AffinityLabelService
import org.ovirt.engine.sdk4.services.AffinityLabelVmService
import org.ovirt.engine.sdk4.services.AffinityLabelVmsService
import org.ovirt.engine.sdk4.services.AffinityLabelsService
import org.ovirt.engine.sdk4.services.AffinityLabelHostsService
import org.ovirt.engine.sdk4.services.AffinityLabelHostService
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.types.AffinityLabel
import org.ovirt.engine.sdk4.types.Vm
import org.ovirt.engine.sdk4.types.Host

fun Connection.srvAffinityLabels(): AffinityLabelsService =
	this@srvAffinityLabels.systemService.affinityLabelsService()

fun Connection.findAllAffinityLabels(): Result<List<AffinityLabel>> = runCatching {
	this@findAllAffinityLabels.srvAffinityLabels().list().send().labels()
}.onSuccess {
	Term.AFFINITY_LABEL.logSuccess("목록조회")
}.onFailure {
	Term.AFFINITY_LABEL.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException(Term.AFFINITY_LABEL, "목록조회") else it
}

fun Connection.srvAffinityLabel(alId: String): AffinityLabelService =
	this@srvAffinityLabel.srvAffinityLabels().labelService(alId)

fun Connection.findAffinityLabel(alId: String): Result<AffinityLabel?> = runCatching {
	this@findAffinityLabel.srvAffinityLabel(alId).get().send().label()
}.onSuccess {
	Term.AFFINITY_LABEL.logSuccess("상세조회")
}.onFailure {
	Term.AFFINITY_LABEL.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException(Term.AFFINITY_LABEL, "상세조회", alId) else it
}

fun Connection.srvVmsFromAffinityLabel(alId: String): AffinityLabelVmsService =
	this@srvVmsFromAffinityLabel.srvAffinityLabel(alId).vmsService()

fun Connection.findAllVmsFromAffinityLabel(alId: String): Result<List<Vm>> = runCatching {
	this@findAllVmsFromAffinityLabel.srvVmsFromAffinityLabel(alId).list().send().vms()
}.onSuccess {
	Term.AFFINITY_LABEL.logSuccessWithin(Term.VM, "목록조회")
}.onFailure {
	Term.AFFINITY_LABEL.logFailWithin(Term.VM, "목록조회", it)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.AFFINITY_LABEL, Term.VM,"목록조회", alId) else it
}

fun Connection.srvVmFromAffinityLabel(alId: String, vmId: String): AffinityLabelVmService =
	this@srvVmFromAffinityLabel.srvVmFromAffinityLabel(alId, vmId)

fun Connection.findVmFromAffinityLabel(alId: String, vmId: String): Result<Vm?> = runCatching {
	this@findVmFromAffinityLabel.srvVmFromAffinityLabel(alId, vmId).get().send().vm()
}.onSuccess {
	Term.AFFINITY_LABEL.logSuccessWithin(Term.VM, "상세조회")
}.onFailure {
	Term.AFFINITY_LABEL.logFailWithin(Term.VM, "상세조회", it)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.AFFINITY_LABEL, Term.VM,"상세조회", alId, vmId) else it
}

fun Connection.srvHostsFromAffinityLabel(alId: String): AffinityLabelHostsService =
	this@srvHostsFromAffinityLabel.srvAffinityLabel(alId).hostsService()

fun Connection.findAllHostsFromAffinityLabel(alId: String): Result<List<Host>> = runCatching {
	this@findAllHostsFromAffinityLabel.srvHostsFromAffinityLabel(alId).list().send().hosts()
}.onSuccess {
	Term.AFFINITY_LABEL.logSuccessWithin(Term.HOST, "목록조회")
}.onFailure {
	Term.AFFINITY_LABEL.logFailWithin(Term.HOST, "목록조회", it)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.AFFINITY_LABEL, Term.HOST,"목록조회", alId) else it
}

fun Connection.srvHostFromAffinityLabel(alId: String, hostId: String): AffinityLabelHostService =
	this@srvHostFromAffinityLabel.srvHostsFromAffinityLabel(alId).hostService(hostId)

fun Connection.findHostFromAffinityLabel(alId: String, hostId: String): Result<Host?> = runCatching {
	this@findHostFromAffinityLabel.srvHostFromAffinityLabel(alId, hostId).get().send().host()
}.onSuccess {
	Term.AFFINITY_LABEL.logSuccessWithin(Term.HOST, "상세조회")
}.onFailure {
	Term.AFFINITY_LABEL.logFailWithin(Term.HOST, "상세조회", it)
	throw if (it is Error) it.toItCloudExceptionWithin(Term.AFFINITY_LABEL, Term.HOST,"상세조회", alId, hostId) else it
}



