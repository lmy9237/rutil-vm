group = "com.itinfo.rutilvm.api.vmware"
description = "RutilVM 백엔드 VMWare API 연동"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true
dependencies {
	implementation(fileTree(mapOf("dir" to "lib", "include" to listOf("*.jar"))))
	compileOnly(project(":rutil-vm-common"))
	compileOnly(project(":rutil-vm-util"))
	compileOnly(Dependencies.springBootWeb)
	compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
	compileOnly(Dependencies.commonsVMWare)
	compileOnly(Dependencies.wsVMWare)
	compileOnly(Dependencies.bindVMWare)
    compileOnly(Dependencies.gson)
}
