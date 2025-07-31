group = "com.itinfo.rutilvm.license"
description = "라이센스 암호화"
version = "${Versions.Project.RUTIL_VM}-${Versions.Project.RUTIL_VM_BUILD_NO}"

val jar: Jar by tasks
jar.enabled = true

dependencies {
    compileOnly(project(":rutil-vm-common"))
    compileOnly(project(":rutil-vm-license-common"))
    compileOnly(Dependencies.kotlinStdlib)
	compileOnly(Dependencies.kotlinCoroutine)
    compileOnly(Dependencies.log4j)
    compileOnly(Dependencies.gson)

    testImplementation(project(":rutil-vm-common"))
	testImplementation(Dependencies.kotlinCoroutineTest)
    testImplementation(Dependencies.log4j)
    testImplementation(Dependencies.junit)
    testImplementation(Dependencies.hamcrest)
}
