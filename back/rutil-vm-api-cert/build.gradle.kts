group = "com.itinfo.rutilvm.api"
description = "RutilVM 백엔드 (인증서관리) 모듈"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true
dependencies {
    compileOnly(project(":rutil-vm-common"))
    compileOnly(project(":rutil-vm-util"))
	compileOnly(project(":rutil-vm-util-cert"))
	compileOnly(project(":rutil-vm-util-ssh"))
    compileOnly(Dependencies.springBootWeb)
	compileOnly(Dependencies.kotlinStdlib)
	compileOnly(Dependencies.retrofit2)
	compileOnly(Dependencies.jsch)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)

	testImplementation(project(":rutil-vm-common"))
	testImplementation(project(":rutil-vm-util"))
	testImplementation(project(":rutil-vm-util-cert"))
	testImplementation(project(":rutil-vm-util-ssh"))
	testImplementation(Dependencies.log4j)
	testImplementation(Dependencies.retrofit2)
	testImplementation(Dependencies.jsch)
	testImplementation(Dependencies.junit)
	testImplementation(Dependencies.hamcrest)
}
