package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.api.ovirt.business.model.Term
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccess
import com.itinfo.rutilvm.api.ovirt.business.model.logSuccessWithin
import com.itinfo.rutilvm.api.ovirt.business.model.logFail
import com.itinfo.rutilvm.api.ovirt.business.model.logFailWithin

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.EventService
import org.ovirt.engine.sdk4.services.EventsService
import org.ovirt.engine.sdk4.types.Event

private fun Connection.srvEvents(): EventsService =
	systemService.eventsService()

fun Connection.findAllEvents(searchQuery: String = "", follow: String = "", max: String = "", from: String = ""): Result<List<Event>> = runCatching {
	this.srvEvents().list().apply {
		if (max.isNotEmpty()) max(max.toInt())
		if (from.isNotEmpty()) from(from.toInt())
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.caseSensitive(false).send().events()

}.onSuccess {
	Term.EVENT.logSuccess("목록조회")
}.onFailure {
	Term.EVENT.logFail("목록조회")
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvEvent(eventId: String): EventService =
	this.srvEvents().eventService(eventId)

fun Connection.findEvent(eventId: String): Result<Event?> = runCatching {
	this.srvEvent(eventId).get().send().event()
}.onSuccess {
	Term.EVENT.logSuccess("상세조회")
}.onFailure {
	Term.EVENT.logFail("상세조회")
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.removeEvent(eventId: String): Result<Boolean?> = runCatching {
	this.srvEvent(eventId).remove().send()
	true
}.onSuccess {
	Term.EVENT.logSuccess("삭제")
}.onFailure {
	Term.EVENT.logFail("삭제")
	throw if (it is Error) it.toItCloudException() else it
}

