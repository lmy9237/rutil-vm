group = "com.itinfo.rutilvm.util"
description = "유틸 (ovirt)"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true
dependencies {
	compileOnly(project(":rutil-vm-common"))
	compileOnly(project(":rutil-vm-api-ovirt-business"))
    compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)
    compileOnly(Dependencies.ovirt)
	compileOnly(Dependencies.retrofit2)
	compileOnly(Dependencies.jsch)

	testImplementation(Dependencies.retrofit2)
}
