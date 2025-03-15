package com.itinfo.rutilvm.api.service.computing

import com.itinfo.rutilvm.common.LoggerDelegate
import com.itinfo.rutilvm.api.model.IdentifiedVo
import com.itinfo.rutilvm.api.model.computing.*
import com.itinfo.rutilvm.api.model.network.VnicProfileVo
import com.itinfo.rutilvm.api.model.setting.PermissionVo
import com.itinfo.rutilvm.api.model.storage.DiskAttachmentVo
import com.itinfo.rutilvm.api.model.storage.DiskImageVo
import org.junit.jupiter.api.Test
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.not
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.BeforeEach
import org.ovirt.engine.sdk4.types.DiskInterface
import org.ovirt.engine.sdk4.types.InheritableBoolean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.math.BigInteger
import java.util.Arrays

/**
 * [ItVmServiceTest]
 * [ItVmService]에 대한 단위테스트
 *
 * @author chanhi2000
 * @author deh22
 * @since 2024.09.25
 */
@SpringBootTest
class  ItVmServiceTest {
	@Autowired private lateinit var service: ItVmService

	private lateinit var dataCenterId: String
	private lateinit var clusterId: String // Default
	private lateinit var networkId: String // ovirtmgmt(dc: Default)
	private lateinit var host01: String // host01
	private lateinit var host02: String // host02.ititinfo.local
	private lateinit var hostVm: String // hostVm
	private lateinit var apm: String // hostVm
	private lateinit var storageDomain: String
	private lateinit var vmid: String


	@BeforeEach
	fun setup() {
		dataCenterId = "c0ff403a-87b5-11ef-85da-00163e7dd2d4"
		clusterId = "c100a93e-87b5-11ef-bd58-00163e7dd2d4"
		networkId = "00000000-0000-0000-0000-000000000009"
		host01 = "1d3a2fdb-0873-4837-8eaa-28cca20ffb12"
//		host02 = "0d7ba24e-452f-47fe-a006-f4702aa9b37f"
		hostVm = "d427e182-cfd7-44a8-8b63-ce3841fe7c47"
//		apm = "fceb0fe4-2927-4340-a970-401fe55781e6"
		storageDomain = "789b0566-39da-42c5-b5d2-bf6a6e3662cf"
        vmid="b0773990-844c-45d1-895d-7bcd1c42f6f8"
	}


	/**
	 * [should_findAll]
	 * [ItVmService.findAll]에 대한 단위테스트
	 *
	 * @see [ItVmService.findAll]
	 */
	@Test
	fun should_findAll() {
		log.debug("should_findAll ...")
		val start = System.currentTimeMillis()
		val result: List<VmViewVo> =
			service.findAll()
		val end = System.currentTimeMillis()

		log.info("수행시간: {}", end-start)
		assertThat(result, `is`(not(nullValue())))
//		assertThat(result.size, `is`(4))

		result.forEach { println(it) }
	}

	/**
	 * [should_findOne]
	 * [ItVmService.findOne]에 대한 단위테스트
	 *
	 * @see ItVmService.findOne
	 */
	@Test
	fun  should_findOne() {
		log.debug("should_findOne ... ")
		val result: VmViewVo? =
			service.findOne(vmid)
		assertThat(result, `is`(not(nullValue())))
		assertThat(result?.id, `is`(not(nullValue())))
		// print(result)
	}


	/**
	 * [should_add_Vm]
	 * [ItVmService.add]에 대한 단위테스트
	 *
	 * @see ItVmService.add
	 */
// 	@Test
// 	fun should_add_Vm() {
// 		log.debug("should_add_Vm ... {}", clusterId)
// 		val addVm: VmVo = VmVo.builder {
// 			clusterVo {
// 				IdentifiedVo.builder {
// 					id { clusterId }
// 				}
// 			}
// 			templateVo {
// 				// front 기본지정
// 				IdentifiedVo.builder {
// 					id { "00000000-0000-0000-0000-000000000000" }
// 				}
// 			}
// 			osSystem { "other_linux" }
// 			chipsetFirmwareType { "Q35_SEA_BIOS" }  // String.valueOf(BiosType.Q35_OVMF }
// 			optimizeOption { "SERVER" }  // String.valueOf(VmType.SERVER
// 			name { "random1" }
// 			description { "" }
// 			comment { "" }
// 			stateless { false }
// 			startPaused { false }
// 			deleteProtected { false }
// 			vnicProfileVos {
// 				Arrays.asList(
// 					VnicProfileVo.builder { id { "0000000a-000a-000a-000a-000000000398" } },
// 					VnicProfileVo.builder { id { "61c1ddbc-310b-45d0-9ebd-9802c6e5036b" } },
// 				)
// 			}
// 			diskAttachmentVos {
// 				Arrays.asList(
// 					DiskAttachmentVo.builder {
// 						bootable { true }
// 						active { true }
// 						interface_ { DiskInterface.VIRTIO_SCSI }
// 						readOnly { false }
// 						diskImageVo {
// 							DiskImageVo.builder {
// //								size { 1 }
// 								alias { "random1_disk" }
// 								description { "" }
// 								storageDomainVo {
// 									IdentifiedVo.builder { id { storageDomain } }
// 								}
// 								sparse { true } // 할당정책: 씬
// 								diskProfileVo {
// 									IdentifiedVo.builder { id { "f6cf9462-98d9-4a06-939f-0c174089a1d0" } }
// 								}
// 								wipeAfterDelete { false }
// 								sharable { false }
// 								backup { true } // 증분백업 기본값 t
// 							}
// 						}
// 					},
// 					/*DiskAttachmentVo.builder { // 연결
// 						bootable { false }
// 						active { true }
// 						interface_ { DiskInterface.VIRTIO_SCSI }
// 						readOnly { false }
// 						diskImageVo {
// 							DiskImageVo.builder {
// 								id { "2489c507-35ec-4aa2-99c4-5f131f4bfc11" }
// 							}
// 						}
// 					}*/
// 				)
// 			}
// 			instanceType { "none" } //tiny 안됨 ( none,small, medium, xlarge)
// 			memorySize { BigInteger.valueOf(2048) }
// 			memoryMax { BigInteger.valueOf(8192) }
// 			memoryActual { BigInteger.valueOf(2048) }
// 			memoryBalloon { true }
// 			cpuTopologySocket { 2 }
// 			cpuTopologyCore { 1 }
// 			cpuTopologyThread { 1 }
// 			timeOffset { "Asia/Seoul"}  // Asia/Seoul , Etc/GMT
// 			cloudInit { false }   // 일단 안됨
// 			hostInCluster { true }  // 특정 호스트(false)
// //			hostInCluster { false }  // 특정 호스트(false)
// //			hostVos {
// //				Arrays.asList(
// //					IdentifiedVo.builder{ id { "722096d3-4cb2-43b0-bf41-dd69c3a70779" } }
// //				)
// //				null
// //			}
// 			migrationEncrypt { InheritableBoolean.INHERIT }
// 			migrationMode {"MIGRATABLE" }  // 마이그레이션
// 			ha { false } // 기본 false
// 			priority { 1 }  // 우선순위: 기본 1(낮음)
// 			cpuProfileVo { IdentifiedVo.builder { id { "58ca604e-01a7-003f-01de-000000000250" } }  } // 클러스터 밑에 있는 cpu profile
// 			cpuShare  { 0 } // 비활성화됨 0
// 			cpuPinningPolicy  { "NONE" }
// 			memoryBalloon  { true }    // 메모리 balloon 활성화
// 			multiQue  { false } // 멀티 큐 사용
// 			virtSCSIEnable  { true }  // virtIO-SCSI 활성화
// 			firstDevice  { "HD" }
// //			connVo  { IdentifiedVo.builder { id { "5f76f8cd-3213-4559-8738-224750ce4867" } } }
// 		}
//
// 		val addResult: VmVo? =
// 			service.add(addVm)
//
// 		assertThat(addResult, `is`(not(nullValue())))
// 		assertThat(addResult?.id, `is`(not(nullValue())))
// 		assertThat(addResult?.name, `is`(addVm.name))
// 		assertThat(addResult?.clusterVo?.id, `is`(addVm.clusterVo.id))
// 	}

	/**
	 * [should_update_Vm]
	 * [ItVmService.update]에 대한 단위테스트
	 *
	 * @see ItVmService.update
	 */
// 	@Test
// 	fun should_update_Vm() {
// 		log.debug("should_update_Vm ... ")
// 		val updateVm: VmVo = VmVo.builder {
// 			id { "46560fd8-97c4-41d2-a362-7773b0065261" } // 유일하게 추가되는 점
// 			clusterVo {
// 				IdentifiedVo.builder {
// 					id { clusterId }
// 				}
// 			}
// 			templateVo {
// 				IdentifiedVo.builder {
// 					id { "00000000-0000-0000-0000-000000000000" }
// 				}
// 			} // front 에서 막음
// 			osSystem { "other_linux" }
// 			chipsetFirmwareType { "Q35_SEA_BIOS" }  // String.valueOf(BiosType.Q35_OVMF }
// 			optimizeOption { "SERVER" }  // String.valueOf(VmType.SERVER
// 			name { "random2" }
// 			description { "" }
// 			comment { "" }
// 			stateless { false }
// 			startPaused { false }
// 			deleteProtected { false }
// 			vnicProfileVos {
// 				Arrays.asList(
// 					VnicProfileVo.builder { id { "0000000a-000a-000a-000a-000000000398" } },
// 					VnicProfileVo.builder { id { "0000000a-000a-000a-000a-000000000398" } },
// 				)
// 			}
// 			diskAttachmentVos {
// 				Arrays.asList(
// 					DiskAttachmentVo.builder {
// 						bootable { false }
// 						interface_ { DiskInterface.VIRTIO_SCSI }
// 						readOnly { false }
// 						diskImageVo {
// 							DiskImageVo.builder {
// //								size { 1 }
// 								alias { "random1_disk" }
// 								description { "" }
// 								storageDomainVo {
// 									IdentifiedVo.builder { id { storageDomain } }
// 								}
// 								sparse { true } // 할당정책: 씬
// 								diskProfileVo {
// 									IdentifiedVo.builder { id { "3b68642f-425a-4d0d-aa2f-0fef3a1a20d5" } }
// 								}
// 								wipeAfterDelete { false }
// 								sharable { false }
// 								backup { true } // 증분백업 기본값 t
// 							}
// 						} // 기존
// 					},
// //					DiskAttachmentVo.builder {
// //						bootable { false }
// //						interface_ { DiskInterface.VIRTIO }
// //						readOnly { false }
// //						diskImageVo {
// //							DiskImageVo.builder {
// //								id { "2c73c9c0-6552-4ddc-9727-8b2de7f54267" } // 추가 attach
// //							}
// //						}
// //					}
// 				)
// 			}
// 			instanceType { "none" } //tiny 안됨 ( none,small, medium, xlarge)
// 			memorySize { BigInteger.valueOf(2048) }
// 			memoryMax { BigInteger.valueOf(4096) }
// 			memoryActual { BigInteger.valueOf(2048) }
// 			memoryBalloon { true }
// 			cpuTopologySocket { 2 }
// 			cpuTopologyCore { 2 }
// 			cpuTopologyThread { 1 }
// 			timeOffset { "Asia/Seoul"}  // Asia/Seoul , Etc/GMT
// 			cloudInit { false }   // 일단 안됨
// 			hostInCluster { true }  // 특정 호스트(false)
// 			hostVos { null }
// 			migrationEncrypt { InheritableBoolean.INHERIT }
// 			migrationMode {"MIGRATABLE" }  // 마이그레이션
// 			ha { false } // 기본 false
// 			priority { 1 }  // 우선순위: 기본 1(낮음)
// 			cpuProfileVo { IdentifiedVo.builder { id { "58ca604e-01a7-003f-01de-000000000250" } }  } // 클러스터 밑에 있는 cpu profile
// 			cpuShare  { 0 } // 비활성화됨 0
// 			cpuPinningPolicy  { "NONE" }
// 			memoryBalloon  { true }    // 메모리 balloon 활성화
// 			multiQue  { false } // 멀티 큐 사용
// 			virtSCSIEnable  { true }  // virtIO-SCSI 활성화
// 			firstDevice  { "HD" }
// 			connVo  { IdentifiedVo.builder { id { "30f0c1cf-763a-479c-a1b6-b3d255902998" } } }
// 		}
//
// 		val updateResult: VmVo? =
// 			service.update(updateVm)
//
// 		assertThat(updateResult, `is`(not(nullValue())))
// 		assertThat(updateResult?.id, `is`(not(nullValue())))
// 		assertThat(updateResult?.id, `is`(updateVm.id))
// 	}

	/**
	 * [should_remove_Vm]
	 * [ItVmService.remove]에 대한 단위테스트
	 *
	 * @see ItVmService.remove
	 */
	@Test
	fun should_remove_Vm() {
		log.debug("should_remove_Vm ... ")
		// val vmId = "008bd86c-9010-419d-83ce-0c7e5ecad38d"
		val diskDelete = false
		val removeResult: Boolean =
			service.remove(vmid, diskDelete)

		assertThat(removeResult, `is`(not(nullValue())))
		assertThat(removeResult, `is`(true))
	}


	/**
	 * [should_findAllApplicationsFromVm]
	 * [ItVmService.findAllApplicationsFromVm]에 대한 단위테스트
	 *
	 * @see ItVmService.findAllApplicationsFromVm
	 */
	@Test
	fun should_findAllApplicationsFromVm() {
		log.debug("should_findAllApplicationsByVm ... ")
		val result: List<IdentifiedVo> =
			service.findAllApplicationsFromVm(hostVm)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(2))
	}

	/**
	 * [should_findAllHostDevicesFromVm]
	 * [ItVmService.findAllHostDevicesFromVm]에 대한 단위테스트
	 *
	 * @see ItVmService.findAllHostDevicesFromVm
	 */
	@Test
	fun should_findAllHostDevicesFromVm() {
		log.debug("should_findAllHostDevicesFromVm ... ")
		val result: List<HostDeviceVo> =
			service.findAllHostDevicesFromVm(hostVm)

		assertThat(result, `is`(not(nullValue())))
		result.forEach { println(it) }
		assertThat(result.size, `is`(0))
	}

	/**
	 * [should_findAllEventsFromVm]
	 * [ItVmService.findAllEventsFromVm]에 대한 단위테스트
	 *
	 * @see ItVmService.findAllEventsFromVm
	 */
	@Test
	fun should_findAllEventsFromVm() {
		log.debug("should_findAllEventsFromVm ... ")
		val result: List<EventVo> =
			service.findAllEventsFromVm(hostVm)

		assertThat(result, `is`(not(nullValue())))
		assertThat(result.size, `is`(6))
	}

	companion object {
		private val log by LoggerDelegate()
	}
}
