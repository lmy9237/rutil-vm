
group = "com.itinfo.rutilvm.api"
description = "RutilVM 백엔드 (VMWare)"
version = "${Versions.Project.RUTIL_VM}-${Versions.Project.RUTIL_VM_BUILD_NO}"

val jar: Jar by tasks
jar.enabled = true

dependencies {
	implementation(fileTree(mapOf("dir" to "lib", "include" to listOf("*.jar"))))
	compileOnly(project(":rutil-vm-common"))
	compileOnly(project(":rutil-vm-util"))
	compileOnly(project(":rutil-vm-api-common"))
	compileOnly(Dependencies.springBootWeb)
	compileOnly(Dependencies.swagger3)
	compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
	compileOnly(Dependencies.commonsVMWare)
	compileOnly(Dependencies.wsVMWare)
	compileOnly(Dependencies.bindVMWare)
	compileOnly(Dependencies.retrofit2)
    compileOnly(Dependencies.gson)

	testImplementation(project(":rutil-vm-common"))
	testImplementation(project(":rutil-vm-util"))
	testImplementation(project(":rutil-vm-api-common"))
	testImplementation(Dependencies.log4j)
	testImplementation(Dependencies.retrofit2)
	testImplementation(Dependencies.junit)
	testImplementation(Dependencies.hamcrest)
}
