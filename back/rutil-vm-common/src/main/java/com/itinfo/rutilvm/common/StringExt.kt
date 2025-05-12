package com.itinfo.rutilvm.common

import java.util.UUID

fun String.toUUID(): UUID = UUID.fromString(this)
