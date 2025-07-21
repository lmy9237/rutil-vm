group = "com.itinfo.rutilvm.api.ovirt.business"
description = "RutilVM 백엔드 oVirt 비지니스 객체"
version = "${Versions.Project.RUTIL_VM}-${Versions.Project.RUTIL_VM_BUILD_NO}"

val jar: Jar by tasks
jar.enabled = true
dependencies {
	compileOnly(project(":rutil-vm-common"))
	compileOnly(project(":rutil-vm-util"))
    compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)
	compileOnly(Dependencies.jsch)
}
