package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.*

import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.services.EventService
import org.ovirt.engine.sdk4.services.EventsService
import org.ovirt.engine.sdk4.types.Event

private fun Connection.srvEvents(): EventsService =
	systemService.eventsService()

fun Connection.findAllEvents(searchQuery: String = "", follow: String = "", max: String = ""): Result<List<Event>> = runCatching {
	if (searchQuery.isNotEmpty() && follow.isNotEmpty() && max.isNotEmpty())
		this.srvEvents().list().max(max.toInt()).search(searchQuery).follow(follow).caseSensitive(false).send().events()
	else if (searchQuery.isNotEmpty())
		this.srvEvents().list().search(searchQuery).caseSensitive(false).send().events()
	else if (follow.isNotEmpty())
		this.srvEvents().list().follow(follow).caseSensitive(false).send().events()
	else if (max.isNotEmpty())
		this.srvEvents().list().max(max.toInt()).send().events()
	else
		this.srvEvents().list().send().events()
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