group = "com.itinfo.rutilvm.common"
description = "공통"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true
dependencies {
    compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)
}