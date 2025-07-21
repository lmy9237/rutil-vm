group = "com.itinfo.rutilvm.api"
description = "RutilVM 백엔드 (Socket) 모듈"
version = "${Versions.Project.RUTIL_VM}-${Versions.Project.RUTIL_VM_BUILD_NO}"

val jar: Jar by tasks
jar.enabled = true
dependencies {
    compileOnly(project(":rutil-vm-common"))
	compileOnly(project(":rutil-vm-api-common"))
    compileOnly(Dependencies.springBootWebsocket)
    compileOnly(Dependencies.springBootWeb)
    compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)
}
