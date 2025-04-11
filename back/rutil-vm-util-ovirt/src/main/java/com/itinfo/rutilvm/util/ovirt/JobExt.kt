package com.itinfo.rutilvm.util.ovirt

import com.itinfo.rutilvm.util.ovirt.error.toItCloudException
import org.ovirt.engine.sdk4.Connection
import org.ovirt.engine.sdk4.Error
import org.ovirt.engine.sdk4.services.JobService
import org.ovirt.engine.sdk4.services.JobsService
import org.ovirt.engine.sdk4.services.StepService
import org.ovirt.engine.sdk4.services.StepsService
import org.ovirt.engine.sdk4.types.Job
import org.ovirt.engine.sdk4.types.Step

private fun Connection.srvJobs(): JobsService =
	this.systemService.jobsService()

fun Connection.findAllJobs(searchQuery: String = "", follow: String = ""): Result<List<Job>> = runCatching {
	this.srvJobs().list().apply {
		if (searchQuery.isNotEmpty()) search(searchQuery)
		if (follow.isNotEmpty()) follow(follow)
	}.send().jobs()

}.onSuccess {
	Term.JOB.logSuccess("목록조회")
}.onFailure {
	Term.JOB.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvJob(jobId: String): JobService =
	this.srvJobs().jobService(jobId)

fun Connection.findJob(jobId: String, follow: String = ""): Result<Job?> = runCatching {
	this.srvJob(jobId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().job()

}.onSuccess {
	Term.JOB.logSuccess("상세조회")
}.onFailure {
	Term.JOB.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.addJob(job: Job): Result<Job?> = runCatching {
	this.srvJobs().add().job(job).send().job()
}.onSuccess {
	Term.JOB.logSuccess("생성")
}.onFailure {
	Term.JOB.logFail("생성", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.endJob(jobId: String): Result<Boolean?> = runCatching {
	this.srvJob(jobId).end().send()
	true
}.onSuccess {
	Term.JOB.logSuccess("종료")
}.onFailure {
	Term.JOB.logFail("종료", it)
	throw if (it is Error) it.toItCloudException() else it
}

fun Connection.clearJob(jobId: String): Result<Boolean?> = runCatching {
	this.srvJob(jobId).clear().send()
	true
}.onSuccess {
	Term.JOB.logSuccess("지우기")
}.onFailure {
	Term.JOB.logFail("지우기", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvSteps(jobId: String): StepsService =
	this.srvJob(jobId).stepsService()

fun Connection.findAllSteps(jobId: String, follow: String = ""): Result<List<Step>> = runCatching {
	this.srvSteps(jobId).list().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().steps()
}.onSuccess {
	Term.STEP.logSuccess("목록조회")
}.onFailure {
	Term.STEP.logFail("목록조회", it)
	throw if (it is Error) it.toItCloudException() else it
}

private fun Connection.srvStep(jobId: String, stepId: String): StepService =
	this.srvSteps(jobId).stepService(stepId)

fun Connection.srvStep(jobId: String, stepId: String, follow: String = ""): Result<Step?> = runCatching {
	this.srvStep(jobId, stepId).get().apply {
		if (follow.isNotEmpty()) follow(follow)
	}.send().step()
}.onSuccess {
	Term.STEP.logSuccess("상세조회")
}.onFailure {
	Term.STEP.logFail("상세조회", it)
	throw if (it is Error) it.toItCloudException() else it
}
