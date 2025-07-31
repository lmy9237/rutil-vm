group = "com.itinfo.rutilvm.license"
description = "라이센스 공통"
version = "${Versions.Project.RUTIL_VM}-${Versions.Project.RUTIL_VM_BUILD_NO}"

val jar: Jar by tasks
jar.enabled = true

dependencies {
    compileOnly(project(":rutil-vm-common"))
    compileOnly(project(":rutil-vm-util"))
    compileOnly(Dependencies.kotlinStdlib)
	compileOnly(Dependencies.kotlinCoroutine)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)

    testImplementation(project(":rutil-vm-common"))
    testImplementation(project(":rutil-vm-util"))
	testImplementation(Dependencies.kotlinCoroutineTest)
    testImplementation(Dependencies.log4j)
    testImplementation(Dependencies.junit)
    testImplementation(Dependencies.hamcrest)
}
