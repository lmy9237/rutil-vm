package com.itinfo.rutilvm.api.service.storage

import com.itinfo.rutilvm.api.error.toException
import com.itinfo.rutilvm.api.model.common.JobVo
import com.itinfo.rutilvm.api.service.BaseService
import com.itinfo.rutilvm.api.service.common.ItJobService
import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.util.ovirt.error.ErrorPattern
import com.itinfo.rutilvm.util.ovirt.srvImageTransfer

import io.netty.handler.ssl.SslContextBuilder
import io.netty.handler.ssl.util.InsecureTrustManagerFactory
import org.ovirt.engine.sdk4.services.ImageTransferService
import org.ovirt.engine.sdk4.types.ImageTransfer
import org.ovirt.engine.sdk4.types.ImageTransferPhase
import org.ovirt.engine.sdk4.types.JobStatus
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers
import reactor.netty.http.client.HttpClient as ReactorNettyHttpClient
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.IOException
import java.io.InputStream
import java.net.URI
import java.net.URL
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.time.Duration
import javax.net.ssl.HostnameVerifier
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

interface ItImageTransferService {
	/**
	 * [ItImageTransferService.uploadFile]
	 * 파일을 업로드
	 *
	 * @param file [MultipartFile] 스토리지 도메인 Id
	 * @param imageTransferId [String] 이미지 이송 ID
	 *
	 * @return List<[DataCenterVo]> 데이터센터 목록
	 */
	@Throws(Error::class, IOException::class)
	fun uploadFile(
		file: MultipartFile,
		imageTransferId: String
	): Boolean

	/**
	 * [ItImageTransferService.downloadFile]
	 * 파일을 다운로드
	 *
	 * @param imageTransferId [String] 이미지 이송 ID
	 *
	 * @return Mono<[ResponseEntity]<[Flux]<DataBuffer>>> 다운로드 Flux처리
	 */
	@Throws(Error::class, IOException::class)
	fun downloadFile(
		imageTransferId: String,
		filename: String?,
//		disk: Disk,
	): Mono<ResponseEntity<Flux<DataBuffer>>>
}

@Service
class ImageTransferServiceImpl(

): BaseService(), ItImageTransferService {
	@Autowired private lateinit var iJob: ItJobService

	@Throws(Error::class, IOException::class)
	override fun uploadFile(
		file: MultipartFile,
		imageTransferId: String
	): Boolean {
		log.info("uploadFile ... ")
		val jobAdded = iJob.add(JobVo.builder {
			name { "디스크 파일 업로드" }
			description { "(RutilVM에서) 디스크 파일 업로드 <${imageTransferId}>" }
			status { JobStatus.STARTED }
			autoCleared { true }
		})
		val imageTransferService: ImageTransferService = conn.srvImageTransfer(imageTransferId)
		val transferUrl = imageTransferService.get().send().imageTransfer().transferUrl()
		log.debug("uploadFile ... transferUrl: $transferUrl")

		disableSSLVerification()
		val url = URL(transferUrl)
		(url.openConnection() as? HttpsURLConnection)?.apply {
			allowUserInteraction = true
			setRequestMethod("PUT")
			setRequestProperty("PUT", url.path)
			setRequestProperty("Content-Length", file.size.toString())
			setFixedLengthStreamingMode(file.size)
			setDoOutput(true)
		}?.also { http ->
			http.connect()
			val bufferSize = calculateOptimalBufferSize(file.size)
			val buffer = ByteArray(bufferSize)
			val insBuffered: InputStream = BufferedInputStream(file.inputStream, bufferSize)
			BufferedOutputStream(http.outputStream, bufferSize).use { outsBuffered ->
				var bytesRead: Int
				while (insBuffered.read(buffer).also { bytesRead = it } != -1) {
					outsBuffered.write(buffer, 0, bytesRead)
				}
				outsBuffered.flush()
			}.runCatching {

			}
			imageTransferService.finalize_().send()
			http.disconnect()
			jobAdded?.id?.let { id ->
				log.info("uploadFile ... 최근작업 ({}) 종료처리!", id)
				iJob.end(id)
			}
			log.info("uploadFile ... 완료!")
		}
		return true
	}

	@Throws(Error::class, IOException::class)
	override fun downloadFile(
		imageTransferId: String,
	 	filename: String?,
	): Mono<ResponseEntity<Flux<DataBuffer>>> {
		var imageTransferService: ImageTransferService? = null // To hold the specific transfer service
		log.info("downloadFile ... imageTransferId: {}", imageTransferId)
		return Mono.fromCallable {
			val _imageTransferService: ImageTransferService = conn.srvImageTransfer(imageTransferId).also {
				imageTransferService = it
			}
			val imageTransfer: ImageTransfer = _imageTransferService.get().send().imageTransfer()
			imageTransfer
		}
		.subscribeOn(Schedulers.boundedElastic())
		.flatMap { readyTransfer ->
			val url = readyTransfer.transferUrl() ?: readyTransfer.proxyUrl()
			val dataBufferFlux: Flux<DataBuffer> = this@ImageTransferServiceImpl.webClient.get()
				.uri(URI(url))
				.retrieve()
				.onStatus({ status ->
					status.isError
				}, { clientResponse ->
					clientResponse.bodyToMono(String::class.java)
						.defaultIfEmpty("EMPTY NO SUCH FILE FOUND")
						.flatMap { errBody -> Mono.error(ErrorPattern.IMAGE_TRANSFER_NOT_FOUND.toException()) }
				})
				.bodyToFlux(DataBuffer::class.java)
				.doOnSubscribe { s -> log.info("Subscribed to WebClient download stream from $url") }
				.doOnComplete { log.info("WebClient download stream from $url completed.") }
				.doOnError { e -> log.error("WebClient download error from $url: ${e.message}", e) }

			val contentLength: Long? = readyTransfer.transferred().toLong() // This is total size for download transfer
			log.info("Filename: $filename, Announced content length for transfer: $contentLength")

			val responseEntityBuilder = ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header(
					HttpHeaders.CONTENT_DISPOSITION,
					ContentDisposition.attachment()
						.filename(filename ?: "rutilvm-image")
						.build()
						.toString()
				)

			if (contentLength != null && contentLength > 0L) {
				responseEntityBuilder.header(HttpHeaders.CONTENT_LENGTH, contentLength.toString())
			} else {
				log.warn("Content length for transfer ${readyTransfer.id()} is $contentLength. Progress bar might not be accurate.")
				// Fallback if original disk format matches desired and actual size is available
				/*
			val originalDisk = sdkDisk ?: disk
			if (originalDisk.format() == desiredFormat && originalDisk.actualSize() != null && originalDisk.actualSize()!! > 0L) {
				log.info("Using disk.actualSize() (${originalDisk.actualSize()}) as fallback Content-Length.")
				responseEntityBuilder.header(HttpHeaders.CONTENT_LENGTH, originalDisk.actualSize().toString())
			}
			*/
			}
			Mono.just(responseEntityBuilder.body(dataBufferFlux))
		}
		.doOnError { e -> log.error("Error during image download process for disk: {}", e.message) }
		.doFinally { signalType -> // This runs on completion, error, or cancellation
			val finalImageTransferService = imageTransferService

			Mono.fromRunnable<Runnable> {
				if (finalImageTransferService != null) {
					try {
						val transferIdToFinalize = imageTransferId // Get ID before potential null
						log.info("Attempting to finalize image transfer: $transferIdToFinalize, Signal: $signalType")
						// Check current state before finalizing, avoid finalizing if already failed/cancelled
						val currentTransferState = finalImageTransferService.get().send().imageTransfer().phase()
						if (currentTransferState != ImageTransferPhase.CANCELLED &&
							currentTransferState != ImageTransferPhase.FINISHED_FAILURE
						) {
							finalImageTransferService.finalize_().send() // blocking SDK call
							log.info("Image transfer finalized: $transferIdToFinalize")
						} else {
							log.warn("Skipping finalization for transfer $transferIdToFinalize, already in state: $currentTransferState")
						}
					} catch (e: Exception) {
						log.error("Error finalizing image transfer ${imageTransferId}: ${e.message}", e)
						// If finalization fails, image transfer might be stuck on engine side.
					}
				}
			}
			.subscribeOn(Schedulers.boundedElastic())
			.subscribe() // Ensure finalization runs on a suitable thread
		}
	}

private val webClient: WebClient by lazy {
		var reactorNettyHttpClient: ReactorNettyHttpClient
		val nettySslContextBuilder = SslContextBuilder.forClient()

		if (true) {
			log.warn("Creating WebClient with INSECURE SSL settings for image download.")
			nettySslContextBuilder.trustManager(InsecureTrustManagerFactory.INSTANCE)
			reactorNettyHttpClient = ReactorNettyHttpClient.create()
				.secure { sslProvider ->
					sslProvider.sslContext(nettySslContextBuilder.build())
				}
				.responseTimeout(Duration.ofSeconds(DOWNLOAD_TIMEOUT_SECONDS)) // Timeout for the download itself
		} else {
			reactorNettyHttpClient = ReactorNettyHttpClient.create()
				.responseTimeout(Duration.ofSeconds(DOWNLOAD_TIMEOUT_SECONDS))
		}

		WebClient.builder()
			.clientConnector(ReactorClientHttpConnector(reactorNettyHttpClient))
			.build()
	}

private fun calculateOptimalBufferSize(fileSize: Long): Int = when {
		fileSize > 5L * 1024 * 1024 * 1024 -> 4 * 1024 * 1024  // 4MB for files larger than 5GB
		fileSize > 500L * 1024 * 1024 -> 2 * 1024 * 1024       // 2MB for files larger than 500MB
		else -> 512 * 1024                                     // 512KB for smaller files
	}

	@Throws(Error::class)
	private fun disableSSLVerification() {
		log.info("disableSSLVerification ...")
		val hostnameVerifier = HostnameVerifier { _, _ -> true }
		val trustAllCerts = arrayOf<TrustManager>(
			object : X509TrustManager {
				override fun getAcceptedIssuers(): Array<X509Certificate>? {
					return null
				}
				override fun checkClientTrusted(certs: Array<X509Certificate>, authType: String) {}
				override fun checkServerTrusted(certs: Array<X509Certificate>, authType: String) {}
			}
		)

		val sc = SSLContext.getInstance("TLS")
		sc.init(null, trustAllCerts, SecureRandom())
		HttpsURLConnection.setDefaultHostnameVerifier(hostnameVerifier)
		HttpsURLConnection.setDefaultSSLSocketFactory(sc.socketFactory)
	}

	companion object {
		private val log by LoggerDelegate()
		private const val TRANSFER_POLL_INTERVAL_MS = 2000L
		private const val TRANSFER_TIMEOUT_MS = 300_000L // 5 minutes
		private const val DOWNLOAD_TIMEOUT_SECONDS = 3600L // 1 hour for the actual download via WebClient
	}

}
