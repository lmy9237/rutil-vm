import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version Versions.kotlin
    kotlin("plugin.spring") version Versions.kotlin
    kotlin("plugin.jpa") version Versions.kotlin
    id("org.springframework.boot") version Versions.springBoot
    id("org.jetbrains.dokka") version Versions.kotlin
    id("io.spring.dependency-management") version "1.1.4"

    id("org.jlleitschuh.gradle.ktlint") version Versions.ktlint
    id("org.jlleitschuh.gradle.ktlint-idea") version Versions.ktlint
}

allprojects {
    apply {
        plugin("kotlin-jpa")
    }

    group = "com.itinfo.rutilvm"
    version = "${Versions.Project.RUTIL_VM}-${Versions.Project.RUTIL_VM_BUILD_NO}"

    repositories {
        mavenCentral()
        maven {
            url = uri("https://plugins.gradle.org/m2/")
        }
    }

    tasks.withType<KotlinCompile> {
        sourceCompatibility = Versions.java
        targetCompatibility = Versions.java

        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict")
        }
    }
}

subprojects {
    afterEvaluate {
        println("name: ${this.name}\tversion: ${this.version}\tdescription: ${this.description}")
    }

    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "org.jetbrains.dokka")

    tasks.withType<JavaCompile> {
        sourceCompatibility = Versions.java
        targetCompatibility = Versions.java
        options.encoding = "UTF-8"
        options.isIncremental = true
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }

    configurations {
        all {
            exclude("org.springframework.boot", "spring-boot-starter-logging")
        }
        compileOnly {
            extendsFrom(configurations.annotationProcessor.get())
        }
    }

    val profile: String = if (project.hasProperty("profile")) project.property("profile") as? String ?: "local" else "local"
    sourceSets {
        main {
            java.srcDirs(listOf("src/main/java", "src/main/kotlin"))
            resources {
                srcDirs("src/main/resources", "src/main/resources-$profile")
            }
            resources.srcDirs(listOf("src/main/resources"))
        }
        test {
            java.srcDirs(listOf("src/test/java", "src/test/kotlin"))
            resources.srcDirs(listOf("src/test/resources"))
        }
    }
    tasks.compileJava { dependsOn(tasks.clean) }
    tasks.compileKotlin { dependsOn(tasks.clean) }
    tasks.processResources {
        duplicatesStrategy = DuplicatesStrategy.INCLUDE
    }
    tasks.processTestResources {
        duplicatesStrategy = DuplicatesStrategy.INCLUDE
    }

    tasks.dokkaHtml {
        dokkaSourceSets {
            named("main") {
                noAndroidSdkLink.set(false)
            }
        }
        outputDirectory.set(file("../${this@subprojects.name}-dokka"))
        suppressInheritedMembers.set(true)
    }

    val cleanDokkaModuleDocs by tasks.register<Copy>("cleanDokkaModuleDocs") {
        delete(file("${this@subprojects.name}-dokka"))
    }
}
/*
project("common") {
    val jar: Jar by tasks
    val bootJar: BootJar by tasks

    bootJar.enabled = false
    jar.enabled = true
}
*/
