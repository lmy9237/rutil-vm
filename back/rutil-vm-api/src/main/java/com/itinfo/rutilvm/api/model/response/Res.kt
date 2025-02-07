package com.itinfo.rutilvm.api.model.response

import com.itinfo.rutilvm.common.LoggerDelegate

import org.springframework.http.HttpStatus
import java.io.Serializable

data class Res<T>(
    val head: Head = Head(),
    val body: T? = null,
) : Serializable {
	class Builder<T> {
        private var bHead: Head = Head();fun head(block: () -> Head?) { bHead = block() ?: Head() }
        private var bBody: T? = null;fun body(block: () -> T?) { bBody = block() }
        fun build(): Res<T> = Res(bHead, bBody)
	}
    companion object {
		private val log by LoggerDelegate()
		inline fun <reified T> builder(block: Res.Builder<T>.() -> Unit): Res<T> = Res.Builder<T>().apply(block).build()
		inline fun <reified T> success(block: () -> T): Res<T> = builder {

		}
		inline fun <reified T> fail(code: Int = 400, message: String? = ""): Res<T> = builder {
			head { Head.fail(code ,message) }
		}
		inline fun <reified T> fail(e: Throwable?): Res<T> = builder {
			head { Head.fail(400, e?.localizedMessage) }
		}
		inline fun <reified T: Any?> safely(crossinline block: () -> T): Res<T> = try {
			builder {
				head { Head.success() }
				body { block() }
			}
		} catch (e: Exception) {
			builder {
				head { Head.fail(400, e.localizedMessage) }
			}
		}

        fun createResponse(): Res<Boolean> {
            val head = Head(201, "생성 성공")
            return Res(head, true)
        }

        fun successResponse(): Res<Boolean> {
            val head = Head.success()
            return Res(head, true)
        }
    }
}

fun HttpStatus.toRes(msg: String = ""): Res<Any?> =
	Res.builder {
		head { Head.fail(this@toRes.value(), msg)  }
	}