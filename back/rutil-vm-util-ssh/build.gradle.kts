group = "com.itinfo.rutilvm.util"
description = "유틸 (ssh)"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true

dependencies {
	compileOnly(project(":rutil-vm-common"))
	compileOnly(project(":rutil-vm-util"))
    compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)
	compileOnly(Dependencies.jsch)

	testImplementation(project(":rutil-vm-common"))
	testImplementation(project(":rutil-vm-util"))
	testImplementation(Dependencies.log4j)
	testImplementation(Dependencies.gson)
	testImplementation(Dependencies.jsch)
	testImplementation(Dependencies.junit)
	testImplementation(Dependencies.hamcrest)
}
