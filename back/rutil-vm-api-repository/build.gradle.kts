group = "com.itinfo.rutilvm.api"
description = "RutilVM 백엔드 (Repository)"
version = Versions.Project.RUTIL_VM

val jar: Jar by tasks
jar.enabled = true

plugins {
    id("org.jetbrains.kotlin.plugin.jpa")
    id("org.jetbrains.kotlin.plugin.allopen")
    id("org.jetbrains.kotlin.plugin.noarg")
}

dependencies {
    compileOnly(project(":rutil-vm-common"))
    compileOnly(project(":rutil-vm-api-ovirt-business"))
	compileOnly(Dependencies.springBootJpa)
    compileOnly(Dependencies.springBootWeb)
	compileOnly(Dependencies.spring)
    compileOnly(Dependencies.kotlinStdlib)
    compileOnly(Dependencies.log4j)
	compileOnly(Dependencies.jackson)
	compileOnly(Dependencies.xml)
    compileOnly(Dependencies.gson)
    runtimeOnly(Dependencies.jdbc)

    testImplementation(project(":rutil-vm-common"))
    testImplementation(project(":rutil-vm-api-ovirt-business"))
	testImplementation(Dependencies.springTest)
	testImplementation(Dependencies.springBootTest)
    testImplementation(Dependencies.springBootJpa)
	testImplementation(Dependencies.spring)
	testImplementation(Dependencies.kotlinStdlib)
    // testImplementation(Dependencies.springBootWeb)
    testImplementation(Dependencies.log4j)
	testImplementation(Dependencies.jackson)
	testImplementation(Dependencies.xml)
    testImplementation(Dependencies.junit)
    testImplementation(Dependencies.hamcrest)
	testRuntimeOnly(Dependencies.jdbc)
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

allOpen {
    annotation("javax.persistence.Entity")
    annotation("javax.persistence.Embeddable")
	annotation("javax.persistence.MappedSuperclass")
	annotation("com.thoughtworks.xstream.annotations.XStreamAlias")
	annotation("com.thoughtworks.xstream.annotations.XStreamAsAttribute")
	annotation("com.thoughtworks.xstream.annotations.XStreamConverter")
	annotation("com.thoughtworks.xstream.annotations.XStreamImplicit")
}

noArg {
    annotation("javax.persistence.Entity") // @Entity가 붙은 클래스에 한해서만 no arg 플러그인을 적용
    annotation("javax.persistence.Embeddable")
    annotation("javax.persistence.MappedSuperclass")
	annotation("com.thoughtworks.xstream.annotations.XStreamAlias")
	annotation("com.thoughtworks.xstream.annotations.XStreamAsAttribute")
	annotation("com.thoughtworks.xstream.annotations.XStreamConverter")
	annotation("com.thoughtworks.xstream.annotations.XStreamImplicit")
}
