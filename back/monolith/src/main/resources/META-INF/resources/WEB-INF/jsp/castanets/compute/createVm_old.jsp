<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="vmCreate">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>새 가상머신</h3>
			</div>

			<div class="text-right">
				<div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" v-on:click="goBack()">취소</button>
						<button type="submit" class="btn btn-success" v-on:click="createVm()">생성</button>
					</div>
				</div>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>일반</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<br />
						<div class="form-horizontal form-label-left">

<%--							by gtpark--%>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">클러스터</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select v-model="cluster" class="form-control" @change="changeCluster">
										<option v-for="cluster in vmCreate.clusters"
											v-bind:value="cluster.id">{{cluster.name}}</option>
									</select>
								</div>
							</div>
							<!-- <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">템플릿</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select v-model="templateId" class="form-control">
										<option v-for="template in vmCreate.templates" :value="template.id">{{template.name}} | {{template.version}}</option>
									</select>
								</div>
							</div> -->
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">운영시스템</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select v-model="vmCreate.operatingSystem" class="form-control">
										<option v-for="operatingSystem in vmCreate.operatingSystems" :value="operatingSystem.name">
											{{operatingSystem.description}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">인스턴스 유형</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="instanceType">
										<option value=null>사용자 정의</option>
										<option v-for="instanceType in vmCreate.instanceTypes" :value="instanceType.id">{{instanceType.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">최적화 옵션</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="vmCreate.type">
										<option value="desktop">데스크탑</option>
										<option value="server">서버</option>
										<option value="high_performance">고성능</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
								<div class="col-md-9 col-sm-9 col-xs-12">
                                    <input type="text" class="form-control" v-model="vmCreate.name" @input="checkVmName" placeholder="이름" :maxlength="this.$maxName" required>
                                    <p class="text-danger" v-if="(vmNameStatus || validVmName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="vmCreate.description" placeholder="설명" :maxlength="this.$maxDescription">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">용도</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select v-model="vmCreate.use" class="form-control">
										<option v-for="use in uses" :value="use.value">{{use.name}}</option>
									</select>
								</div>
							</div>
							<hr>
							<p>
								<strong>인스턴스 이미지</strong>
							</p>
							<!-- <div v-if="template.diskAttachmentSize > 0">
								<div class="form-group">
									<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
										<div class="col-md-12 col-sm-12 col-xs-12 f-right text-right">
											<button class="btn btn-primary btn-sm" disabled>연결</button>
											<button class="btn btn-success btn-sm" disabled>생성</button>
											<button class="btn btn-default btn-round btn-sm" disabled>+</button>
											<button class="btn btn-default btn-round btn-sm" disabled>-</button>
										</div>
									</div>
								</div>
							</div> -->
							<!-- <div v-if="template.diskAttachmentSize == 0"> -->
								<div class="form-group" v-for="(linkedDisk, index) in linkedDisks">
									<label v-if="selectedLun.length == 0" class="control-label col-md-3 col-sm-3 col-xs-12">{{linkedDisk.name}}:({{linkedDisk.virtualSize}}GB) </label>
									<label v-if="selectedLun.length != 0" class="control-label col-md-3 col-sm-3 col-xs-12">{{linkedDisk.name}}:({{(selectedLun[0].lunSize / Math.pow(1024, 3)).toFixed(2)}}GB) </label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right text-right">
											<button class="btn btn-success btn-sm" data-toggle="modal" data-target=".updateconnectiondiskmodal" v-if="linkedDisk.status != 'create'" @click="setDiskIndex(index, 'connect')">편집</button>
											<button class="btn btn-success btn-sm" data-toggle="modal" data-target=".modifydirectdiskmodal" v-if="linkedDisk.status == 'create' && linkedDisk.lunId == ''" @click="setDiskIndex(index, 'create')">편집</button>
<%--											<button class="btn btn-success btn-sm" data-toggle="modal" data-target=".modifylundiskmodal" v-if="linkedDisk.status == 'create' && linkedDisk.lunId != ''" @click="setDiskIndex(index, 'create')">편집</button>--%>
											<button class="btn btn-default btn-round btn-sm" :disabled="linkedDisks.length > index + 1 || instanceImageAdd" @click="addDisk()">+</button>
											<button class="btn btn-default btn-round btn-sm" @click="removeDisk(index)">-</button>
										</div>
									</div>
								</div>
								<div class="form-group">
									<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
										<div class="col-md-12 col-sm-12 col-xs-12 f-right text-right">
											<button class="btn btn-primary btn-sm" v-if="instanceImageAdd" data-toggle="modal" data-target=".connectiondiskmodal" @click="showConnectionDiskModal = true">연결</button>
											<button class="btn btn-success btn-sm" v-if="instanceImageAdd" data-toggle="modal" data-target=".creatediskmodal" @click="resetCreateDisk()" >생성</button>
<%--											<button class="btn btn-success btn-sm" v-if="instanceImageAdd" data-toggle="modal" data-target=".creatediskmodal" @click="showCreateDiskModal = true">생성</button>--%>
											<button class="btn btn-default btn-round btn-sm" v-if="instanceImageAdd" :disabled="linkedDisks.length === 0">+</button>
											<button class="btn btn-default btn-round btn-sm" v-if="instanceImageAdd" :disabled="linkedDisks.length === 0">-</button>
										</div>
									</div>
								</div>
							<!-- </div> -->
							<hr>
							<p>
								<strong>네트워크</strong>
							</p>

	<%--								by gtpark--%>

							<div class="form-group" v-for="(nic, index) in tempNics">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">{{'nic' + (index + 1)}}</label>

								<div class="col-md-5 col-sm-5 col-xs-12">
									<select v-model="tempNics[index]" class="form-control">
										<option value="none">비어있음</option>
										<option v-for="clusterNetwork of clusterNetworkList" :value="clusterNetwork.id">{{clusterNetwork.name}}</option>
									</select>
								</div>
								<div class="col-md-4 col-sm-4 col-xs-12 f-right text-right">
									<div class="col-md-12 col-sm-12 col-xs-12">
										<button class="btn btn-default btn-round btn-sm" type="button" :disabled="clusterNetworkList[index].id == null" v-if="tempNics.length == index + 1" @click="addNic(index)">+</button>
										<button class="btn btn-default btn-round btn-sm" type="button" :disabled="clusterNetworkList[index].id == null" @click="removeNic(index)">-</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="x_panel">
					<div class="x_title">
						<h2>콘솔</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<br />
						<form class="form-horizontal form-label-left">
							<!-- <div class="form-group">
								<div class="checkbox">
									<label> <input type="checkbox" class="flat">헤드리스(headless) 모드</label>
									<a data-toggle="tooltip" title="가상 머신에서 헤드리스(headless) 모드를 활성화/비활성화합니다.
										헤드리스 모드가 설정된 경우 가상 머신이 다음에 다시 시작 시 그래픽 콘솔과 디스플레이 장치 없이 실행됩니다."><i class="fa fa-info-circle"></i></a>
								</div>
							</div>
							<hr>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">비디오유형</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control">
										<option>QXL</option>
										<option>VGA</option>
										<option>CIRRUS</option>
									</select>
								</div>
							</div> -->
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">그래픽프로토콜</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" disabled>
										<option>VNC</option>
										<!-- <option>SPICE</option>
										<option>VNC</option>
										<option>SPICE + VNC</option> -->
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">USB 지원</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" disabled>
										<option>비활성화됨</option>
										<option>활성화됨</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">콘솔
									분리 작업</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									 <select class="form-control" v-model="vmCreate.disconnectAction" disabled>
										<option value="NONE">동작 없음</option>
										<option value="LOCK_SCREEN">화면 잠금</option>
										<option value="LOGOUT">사용자 로그아웃</option>
										<option value="SHUTDOWN">가상 머신 종료</option>
										<option value="REBOOT">가상 머신 재부팅</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">모니터</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="vmCreate.monitors" disabled>
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="4">4</option>
									</select>
								</div>
								<!-- <div class="checkbox col-md-2 col-sm-2 col-xs-4">
									<label> <input type="checkbox" class="flat"> 단일
										PCI
									</label>
								</div> -->
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">단일로그인방식</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" disabled>
										<option>단일 로그인 비활성화</option>
										<option selected>게스트 에이전트 사용</option>
									</select>
								</div>
							</div>
							<!-- <div class="form-group">
								<div class="checkbox">
									<label>
										<input type="checkbox" v-model="vmCreate.smartcard"> 스마트카드 사용
									</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox">
									<label>
										<input type="checkbox" v-model="vmCreate.virtIO"> VirtlO 직렬 콘솔 사용
									</label>
								</div>
							</div> -->
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 시스템 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;시스템&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br />
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">메모리 크기</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" id="memory" v-model="memory" @change="memoryChange()">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">최대 메모리
									<a data-toggle="tooltip" title="메모리 핫 플러그를 실핼할 수 있는 가상머신 메모리 상한"><i class="fa fa-info-circle"></i></a>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="maximumMemory" @change="maximumMemoryChange()">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">
									총 가상 CPU <a data-toggle="tooltip"
									title="소켓 수를 변경하여 CPU를 핫애드합니다. CPU 핫애드가
									올바르게 지원되는지 확인하려면 게스트 운영 체제 관련 문서를 참조하십시오">
										<i class="fa fa-info-circle"></i>
								</a>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="totalCpu">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">가상
									소켓 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="virtualSockets" @change="selectVirtualSockets()">
										<option v-for="divisor in divisors" :value="divisor">{{divisor}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">가상
									소켓 당 코어 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="coresPerVirtualSocket" @change="selectCoresPerVirtualSocket()">
										<option v-for="divisor in divisors" :value="divisor">{{divisor}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">
									코어 당 스레드
									<a data-toggle="tooltip" title="동시 멀티스레딩을 설정합니다. 값을 변경하기 전 호스트 아키텍처를
									확인합니다. 설정 값이 확실하지 않은 경우 코어당 스레드 수를 1로 설정합니다. 다음과 같은 값을 사용할 것을 권장합니다.
									- x86: 1 - power8: 1..8(높은 로드의 가상 머신의 경우 8)"><i class="fa fa-info-circle"></i></a>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="threadsPerCore" @change="selectThreadsPerCore()">
										<option v-for="divisor in divisors" :value="divisor">{{divisor}}</option>
									</select>
								</div>
							</div>
							<!-- <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">사용자
									정의 에뮬레이션 시스템 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control">
										<option>Choose option</option>
										<option>Option one</option>
										<option>Option two</option>
										<option>Option three</option>
										<option>Option four</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">사용자
									정의 CPU 유형 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control">
										<option>Choose option</option>
										<option>Option one</option>
										<option>Option two</option>
										<option>Option three</option>
										<option>Option four</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">사용자
									정의 호환 버전 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control">
										<option>Choose option</option>
										<option>Option one</option>
										<option>Option two</option>
										<option>Option three</option>
										<option>Option four</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">
									하드웨어 클럭의 시간 오프셋
									<a data-toggle="tooltip" title="이 옵션은 게스트 하드웨어 클럭의 표준 시대 오프셋을 설정합니다.
									 Windows OS의 경우 이는 (설치 중 또는 설치 후에) 게스트에 설정되어 있는 시간대입니다. 대부분의 기본 Linux 설치에서는
									 하드웨어 클럭이 GMT+00:00으로 되어 있습니다."><i class="fa fa-info-circle"></i></a>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control">
										<option>Choose option</option>
										<option>Option one</option>
										<option>Option two</option>
										<option>Option three</option>
										<option>Option four</option>
									</select>
								</div>
							</div> -->
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 호스트 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;호스트&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br/>
						<p>
							<strong>실행 호스트</strong>
						</p>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<div class="radio">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label> <input type="radio" name="pickHost" v-model="pickHost" value="recommendHost"> 클러스터 내의 호스트(심포니 추천) </label>
									</div>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" v-model="vmCreate.recommendHost" :disabled="pickHost === 'targetHost'">
											<option v-for="host in recommendHosts" v-bind:value="host[0]">{{host[1]}}</option>
										</select>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="radio">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label> <input type="radio" name="pickHost" v-model="pickHost" value="targetHost"> 특정 호스트 </label>
									</div>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" v-model="vmCreate.targetHost" :disabled="pickHost === 'recommendHost'">
											<option v-for="host in vmCreate.hosts" v-if="vmCreate.cluster == host.clusterId" v-bind:value="host.hostId">{{host.hostName}}</option>
										</select>
									</div>
								</div>
							</div>
							<hr>
							<p>
								<strong>마이그레이션 옵션 </strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션 모드
									<a data-toggle="tooltip" title="최소 활성화된 하나의 가상 머신 디스크가 SCSI 예약을 사용할 경우
										마이그레이션 옵션이 무시되어 가상 머신을 마이그레이션 할 수 없습니다."><i class="fa fa-info-circle"></i></a></label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" v-model="vmCreate.affinity">
											<option value="migratable">수동 및 자동 마이그레이션 허용</option>
											<option value="user_migratable">수동 마이그레이션만 허용</option>
											<option value="pinned">마이그레이션을 허용하지 않음</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<div class="checkbox">
										<div class="col-md-5 col-sm-5 col-xs-12">
											<label>
												<input type="checkbox" v-model="vmCreate.customMigrationUsed">
												사용자 정의 마이그레이션 정책 사용
											</label>
											<a data-toggle="tooltip" title="마이그레이션 수렴을 처리하는 정책을 표시합니다.
												마이그레이션 정책이 없을 경우 하이퍼바이저가 수렴을 처리합니다."><i class="fa fa-info-circle"></i></a>
										</div>
										<div class="col-md-7 col-sm-7 col-xs-12">
											<select class="form-control" :disabled="!vmCreate.customMigrationUsed" v-model="vmCreate.customMigration">
												<option>Legacy</option>
												<option>Minimal downtime</option>
												<option>Post-copy migration</option>
												<option>Suspend workload if needed</option>
											</select>
										</div>
									</div>
								</div>

								<div class="form-group">
									<div class="checkbox">
										<div class="col-md-5 col-sm-5 col-xs-12">
											<label><input type="checkbox"
												:disabled="vmCreate.customMigration != 'Legacy'"
												v-model="vmCreate.customMigrationDowntimeUsed"> 사용자 정의 마이그레이션 다운 타임
												사용</label> <a data-toggle="tooltip"
												title="라이브 마이그레이션 도중 가상 머신이 정지 상태에 있을 수 있는
												최대 시간을 밀리 초 단위로 표시합니다. 값이 0인것은 VDSM 기본값이 사용되고 있음을 의미합니다. (현재 engine 전체의 
												기본값은 0 밀리 초 입니다.)"><i
												class="fa fa-info-circle"></i></a>
										</div>
										<div class="col-md-7 col-sm-7 col-xs-12">
											<input type="text" class="form-control" placeholder=""
												:disabled="!vmCreate.customMigrationDowntimeUsed || !vmCreate.customMigrationUsed"
												v-model="vmCreate.customMigrationDowntime">
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션
										자동 통합 </label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" :disabled="vmCreate.customMigration != 'Legacy'" v-model="vmCreate.autoConverge">
											<option value="inherit" selected>클러스터 설정에서 가져오기</option>
											<option value="true">자동 통합</option>
											<option value="false">자동 통합 해제</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션
										압축 활성화 </label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" :disabled="vmCreate.customMigration != 'Legacy'" v-model="vmCreate.compressed">
											<option value="inherit" selected>클러스터 설정에서 가져오기</option>
											<option value="true">압축</option>
											<option value="false">압축 해제</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<div class="checkbox">
										<div class="col-md-5 col-sm-5 col-xs-12">
											<label> <input type="checkbox" class="flat" :disabled="vmCreate.affinity != 'pinned'">
												호스트 CPU 통과
											</label>
										</div>
									</div>
								</div>
							</form>
							<hr>
							<p>
								<strong>NUMA 설정</strong>
								<a data-toggle="tooltip" title="NUMA 설정 마이그레이 모드를 마이그레이션 불가로 활성화하려면 NUMA 토폴로지를 지원하는 호스트에 가상 머신을 고정합니다.">
								<i class="fa fa-info-circle"></i></a>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">NUMA 노드 수</label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<input type="text" class="form-control" placeholder="" :disabled="!(vmCreate.affinity == 'pinned' && pickHost == 'targetHost')">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">조정
										모드</label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" :disabled="!(vmCreate.affinity == 'pinned' && pickHost == 'targetHost')">
											<option>제한</option>
											<option>기본 설정</option>
											<option>인터리브</option>
										</select>
									</div>
								</div>
							</form>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 초기실행 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;초기실행&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br/>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<div class="checkbox">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label> <input type="checkbox" v-model="useCloudInit">
											Cloud-Init/Sysprep 사용
										</label>
									</div>
								</div>
							</div>
						</form>
						<form class="form-horizontal form-label-left" v-show="vmCreate.useCloudInit">
							<hr>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">가상 머신의 호스트 이름 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<input type="text" class="form-control" v-model="vmCreate.hostName">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">시간대 설정</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="vmCreate.timezone" disabled>
										<option value="Asia/Seoul">(GMT+09:00) Korea Standard Time</option>
										<!-- <option>Choose option</option>
										<option>Option one</option>
										<option>Option two</option>
										<option>Option three</option>
										<option>Option four</option> -->
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">사용자 지정 스크립트
									<a data-toggle="tooltip" title="가상 머신 시작 시 가상 머신에서 실행되는 사용자 정의 스크립트입니다.
										이 필드에 입력되는 스크립트는 사용자 정의 YAML 섹션으로 관리자에 의해 생성된 스크립트에 추가되며 사용자 및 파일 생성, yum 
										리포지터리 설정, 명령 실행과 같은 작업을 자동화할 수 있습니다."><i class="fa fa-info-circle"></i>
									</a>
								</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<textarea class="form-control" rows="5" v-model="vmCreate.customScript"></textarea>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 고가용성 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;고가용성&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br />
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<div class="checkbox">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label>
											<input type="checkbox" v-model="highAvailability">고가용성 사용
										</label>
									</div>
								</div>
							</div>
						</form>
						<hr>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">가상머신 임대 대상 스토리지 도메인</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="leaseStorageDomain" :disabled="!highAvailability">
										<option value="">가상 머신 임대 없음</option>
										<option v-for="storageDomain in vmCreate.leaseStorageDomains" :value="storageDomain.id">{{storageDomain.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">재개 동작</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="vmCreate.resumeBehaviour" disabled>
										<%--<option value="auto_resume">AUTO_RESUME</option>--%>
										<%--<option value="leave_paused">LEAVE_PAUSED</option>--%>
										<option value="kill">KILL</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">실행/마이그레이션 큐에서 우선 순위</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="vmCreate.priority">
										<option value="1">낮음</option>
										<option value="50">중간</option>
										<option value="100">높음</option>
									</select>
								</div>
							</div>
							<%--<div class="form-group">--%>
								<%--<label class="control-label col-md-5 col-sm-5 col-xs-12">워치독--%>
									<%--모델 </label>--%>
								<%--<div class="col-md-7 col-sm-7 col-xs-12">--%>
									<%--<select class="form-control" v-model="vmCreate.watchdogModel">--%>
										<%--<option value="">감시 장치 없음</option>--%>
										<%--<option value="i6300esb">i6300esb</option>--%>
									<%--</select>--%>
								<%--</div>--%>
							<%--</div>--%>
							<%--<div class="form-group">--%>
								<%--<label class="control-label col-md-5 col-sm-5 col-xs-12">워치독--%>
									<%--작업 </label>--%>
								<%--<div class="col-md-7 col-sm-7 col-xs-12">--%>
									<%--<select class="form-control" v-model="vmCreate.watchdogAction" :disabled="vmCreate.watchdogModel == ''">--%>
										<%--<option value="none">없음</option>--%>
										<%--<option value="reset">재설정</option>--%>
										<%--<option value="poweroff">전원 끄기</option>--%>
										<%--<option value="dump">덤프</option>--%>
										<%--<option value="pause">일시중지</option>--%>
									<%--</select>--%>
								<%--</div>--%>
							<%--</div>--%>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 부트옵션 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;부트옵션&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br />
						<p>
							<strong>부트순서</strong>
						</p>
						<hr>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">첫
									번째 장치 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="firstDevice">
										<option v-for="device in firstDevices" :value="device.value">{{device.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">두
									번째 장치 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="secondDevice">
										<option v-for="device in secondDevices" :value="device.value"
										v-if="firstDevice != device.value">{{device.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox">
									<div class="col-md-3 col-sm-3 col-xs-12">
										<label> <input type="checkbox" v-model="vmCreate.bootImageUse" :disabled="vmCreate.bootImages == null">CD/DVD 연결</label>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<select class="form-control" v-model="vmCreate.bootImage" :disabled="!vmCreate.bootImageUse">
											<option v-for="image in vmCreate.bootImages" :value="image.id">{{image.name}}</option>
										</select>
									</div>
								</div>
							</div>
							<!-- <div class="form-group">
								<div class="checkbox">
									<div class="col-md-12 col-sm-12 col-xs-12">
										<label> <input type="checkbox" class="flat">
											부팅 메뉴를 활성화
										</label>
									</div>
								</div>
							</div> -->
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 리소스 할당 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;리소스 할당&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none">
						<br />
						<p>
							<strong>CPU 할당 </strong>
						</p>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">CPU 프로파일</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<input class="form-control" v-model="cpuProfile" disabled>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">CPU 공유</label>
								<div class="col-md-4 col-sm-4 col-xs-12">
									<select class="form-control" v-model="cpuShare">
										<option value="">비활성화됨</option>
										<option value="512">낮음</option>
										<option value="1024">중간</option>
										<option value="2048">높음</option>
									</select>
								</div>
								<div class="col-md-3 col-sm-3 col-xs-12">
									<input class="form-control" v-model="vmCreate.cpuShare" disabled>
								</div>
							</div>
							<!-- <div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">
									<a href="#" data-toggle="tooltip" title="현 항목에 대한 설명">CPU
										피닝 토폴로지 <i class="fa fa-info-circle"></i>
								</a>
								</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<input class="form-control">
								</div>
							</div> -->
							<hr>
							<p>
								<strong>메모리 할당 </strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">할당할
										실제 메모리 </label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<input class="form-control" v-model="physicalMemory" @change="physicalMemoryChange()">
									</div>
								</div>
								<div class="form-group">
									<div class="checkbox">
										<label> <input type="checkbox" v-model="vmCreate.memoryBalloon">
											메모리 Balloon 장치 활성화
										</label>
									</div>
								</div>
							</form>
							<hr>
							<p>
								<strong>IO 스레드</strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label> <input type="checkbox" v-model="ioThreadsEnabled">
											IO 스레드 활성화
										</label>
									</div>
								</div>
							</form>
							<hr>
							<p>
								<strong>스토리지 할당(템플릿이 선택되었을 때만 가능) </strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="radio">
										<label> <input type="radio" class="flat" checked
											name="iCheck"> 씬 프로비저닝
										</label>
									</div>
									<div class="radio">
										<label> <input type="radio" class="flat" checked
											name="iCheck"> 복제
										</label>
									</div>
								</div>
							</form>
							<hr>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label>
											<input type="checkbox" v-model="vmCreate.virtioScsiEnabled">
											VirtlO-SCSI 활성화
											<a data-toggle="tooltip" title="가상 머신 실행 시 VirtIO-SCSI 컨트롤러를 연결합니다."><i class="fa fa-info-circle"></i></a>
										</label>
									</div>
								</div>
							</form>
						</form>
					</div>
				</div>
			</div>
		</div>
		<!-- 난수 생성기 -->
		<!-- <div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;난수 생성기&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none">
						<br />
						<form class="form-horizontal form-label-left">
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label><input type="checkbox" class="flat" v-model="rngEnabled">난수 생성기 활성화</label>
										<a data-toggle="tooltip" title="난수 생성기 장치를 활성화/비활성화합니다. '기간' 및 '바이트'값이 비어 있는 경우 기본값이 사용됩니다. '기간'을 지정한 경우 '바이트'도 지정해야 합니다."><i class="fa fa-info-circle"></i></a>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">기간(밀리초)
									</label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<input class="form-control" v-model="vmCreate.periodDuration">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">시간
										당 바이트 수 </label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<input class="form-control" v-model="vmCreate.bytesPerPeriod">
									</div>
								</div>
							</form>
							<hr>
							<p>
								<strong>장치 소스</strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="radio">
										<label><input type="radio" class="flat" name="deviceSource" v-model="deviceSource" value="urandom">/dev/urandom 소스</label>
										<a data-toggle="tooltip" title="클러스터 버전에 따라 다릅니다. 4.1 이상의 경우 '/dev/unrandom', 4.0 이하의 경우 '/dev/random'"><i class="fa fa-info-circle"></i></a>
									</div>
									<div class="radio">
										<label>
											<input type="radio" class="flat" disabled name="deviceSource" v-model="deviceSource" value="hwrng">/dev/hwrng 소스
										</label>
									</div>
								</div>
							</form>
						</form>
					</div>
				</div>
			</div>
		</div> -->
	</div>

	<!-- disk connection modal -->
	<div class="modal fade connectiondiskmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg" style="min-width: 1024px">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">가상 디스크 연결</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="x_content">
							<table class="table table-striped text-center">
								<thead>
									<tr>
										<th></th>
										<th>이름</th>
										<th style="width: 15%">ID</th>
										<th>가상크기</th>
										<th>실제크기</th>
										<th>스토리지 도메인</th>
										<th>인터페이스</th>
										<th>설명</th>
										<!-- <th>R/O</th>
										<th>OS</th> -->
									</tr>
								</thead>
								<tbody>
									<tr v-if="disks.length == 0">
										<td colspan="12">연결할 디스크가 없습니다.</td>
									</tr>
									<tr v-if="disks.length > 0" v-for="disk in disks" @click="selectConnectDisk(disk)">
										<td class="a-center">
											<input type="radio" class="flat" :value="disk" v-model="selectDisk">
										</td>
										<td>{{disk.name}}</td>
										<td>{{disk.id}}</td>
										<td>{{disk.virtualSize}}GB</td>
										<td>{{disk.actualSize}}GB</td>
										<td>{{disk.storageDomainId}}</td>
										<td>
											<select class="form-control" @change="changeDiskInterface">
												<option value="ide">IDE</option>
												<option value="virtio_scsi" selected>VirtIO-SCSI</option>
												<option value="virtio">VirtIO</option>
											</select>
										</td>
										<td>{{disk.description}}</td>
										<!-- <td>{{disk.readOnly}}</td>
										<td>{{disk.os}}</td> -->
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="selectDisk.id == null" @click="connectDisk()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>

	<!-- disk update connection modal -->
	<div class="modal fade updateconnectiondiskmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg" style="min-width: 1024px">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">가상 디스크 연결</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="x_content">
							<table class="table table-striped text-center">
								<thead>
									<tr>
										<th></th>
										<th>이름</th>
										<th style="width: 15%">ID</th>
										<th>가상크기</th>
										<th>실제크기</th>
										<th>스토리지 도메인</th>
										<th>인터페이스</th>
										<th>설명</th>
										<!-- <th>R/O</th>
										<th>OS</th> -->
									</tr>
								</thead>
								<tbody>
									<tr v-for="disk in disks" @click="selectConnectDisk(disk)">
										<td class="a-center">
											<input type="radio" class="flat" :value="disk" v-model="selectDisk">
										</td>
										<td>{{disk.name}}</td>
										<td>{{disk.id}}</td>
										<td>{{disk.virtualSize}}GB</td>
										<td>{{disk.actualSize}}GB</td>
										<td>{{disk.storageDomainId}}</td>
										<td>
											<select class="form-control" @change="changeDiskInterface">
												<option value="ide">IDE</option>
												<option value="virtio_scsi" selected>VirtIO-SCSI</option>
												<option value="virtio">VirtIO</option>
											</select>
										</td>
										<td>{{disk.description}}</td>
										<!-- <td>{{disk.readOnly}}</td>
										<td>{{disk.os}}</td> -->
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="updateConnectDisk()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>

	<!--by gtpark disk create modal -->
	<div class="modal fade creatediskmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div   style="width: 700px" class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" @click="cancelCreateDisk()">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">새 가상 디스크</h4>
				</div>
				<div class="modal-body">
					<div role="tabpanel">

						<!-- Nav tabs -->
						<div class="row">
							<ul class="nav nav-tabs" role="tablist">
								<li @click="flagDisk(1)" role="presentation" class="active"><a data-value="direct" href="#imageDisk" aria-controls="imageDisk" role="tab" data-toggle="tab">이미지</a></li>
								<%--												<li role="presentation"><a href="#IPv6Tab" aria-controls="IPv6Tab" role="tab" data-toggle="tab">IPv6</a></li>--%>
<%--								<li @click="flagDisk(2)" role="presentation"><a href="#LUNDisk" data-value="LUN" aria-controls="LUNDisk" role="tab" data-toggle="tab">직접 LUN</a></li>--%>
							</ul>
						</div>

                        <div class="tab-content">

					<div role="tabpanel" class="tab-pane active" id="imageDisk">
					<br>
						<div class="row">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">크기(GByte)</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="number" class="form-control" placeholder="#GByte" v-model="disk.virtualSize">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="disk.name" @input="checkDiskName" placeholder="이름" :maxlength="this.$maxName">
									<p class="text-danger" v-if="(diskNameStatus || validDiskName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">인터페이스</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="diskInterface">
										<option value="ide">IDE</option>
										<option value="virtio_scsi">VirtIO-SCSI</option>
										<option value="virtio">VirtIO</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
									<!-- <div class="checkbox">
										<label> <input type="checkbox" v-model="disk.wipeAfterDelete"> 삭제 후 초기화</label>
									</div> -->
									<div class="checkbox">
										<label> <input type="checkbox" v-model="disk.bootable"> 부팅 가능</label>
									</div>
									<div class="checkbox">
										<label> <input type="checkbox" v-model="disk.sharable"> 공유 가능</label>
									</div>
									<!-- <div class="checkbox">
										<label> <input type="checkbox" v-model="disk.readOnly"> 읽기전용</label>
									</div>
									<div class="checkbox">
										<label> <input type="checkbox" v-model="disk.passDiscard"> 취소 활성화</label>
									</div> -->
								</div>
							</div>
							<hr>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 도메인</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="storageDomainId">
										<option v-for="storageDomain in storageDomains" v-if="storageDomain.type == 'DATA'"
											v-bind:value="storageDomain.id">{{storageDomain.name}}</option>
									</select>
								</div>
							</div>
								<!-- <div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">할당 정책</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<select class="form-control">
											<option>Choose option</option>
											<option>Option one</option>
											<option>Option two</option>
											<option>Option three</option>
											<option>Option four</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">디스크 프로파일</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<select class="form-control"
											v-model="disk.diskProfileId">
											<option v-bind:value="disk.diskProfileId">{{disk.diskProfileName}}</option>
										</select>
									</div>
								</div> -->
										</div>
									</div>

							<div role="tabpanel" class="tab-pane" id="LUNDisk">
							<br>
								<div class="row">
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<input type="text" class="form-control" v-model="disk.name" @input="checkDiskName" placeholder="이름" :maxlength="this.$maxName">
											<p class="text-danger" v-if="(diskNameStatus || validDiskName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<input type="text" class="form-control" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">인터페이스</label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<select class="form-control" v-model="diskInterface">
												<option value="ide">IDE</option>
												<option value="virtio_scsi">VirtIO-SCSI</option>
												<option value="virtio">VirtIO</option>
											</select>
										</div>
									</div>
									<div class="form-group">
										<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
											<div class="checkbox">
												<label> <input type="checkbox" v-model="disk.bootable"> 부팅 가능</label>
											</div>
											<div class="checkbox">
												<label> <input type="checkbox" v-model="disk.sharable"> 공유 가능</label>
											</div>
										</div>
									</div>
									<hr>
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">사용 호스트<span class="text-danger">*</span></label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<select class="form-control"  v-model="lunVos" @change="changeHost()">
												<option value="">사용 호스트 선택</option>
												<option  v-for="host in hosts"  :value="host.lunVos">{{host.hostName}}</option>
											</select>
										</div>
									</div>
									<hr>
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 타입<span class="text-danger">*</span></label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<select class="form-control"  v-model="disk.storageType">
												<option value="">스토리지 타입 선택</option>
												<option  value="FCP">파이버 채널</option>
											</select>
										</div>
									</div>
									<table v-if="lunVos.length > 0 && disk.storageType == 'FCP'" class="table table-striped text-center">

										<thead>
										<tr>
											<th>
												<input disabled type="checkbox">
											</th>
											<th>LUN ID</th>
											<th>크기</th>
											<th>경로</th>
											<th>벤더 ID</th>
											<th>제품 ID</th>
											<th>시리얼</th>
										</tr>
										</thead>
										<tbody>
										<tr  v-for="lun of lunVos" @click="selectLun(lun)">
											<td class="a-center">
												<input :disabled="lun.diskId != null" type="checkbox" :id="lun.lunId" :value="lun" v-model="selectedLun">
											</td>
											<td>{{lun.lunId}}</td>
											<td>{{(lun.lunSize / Math.pow(1024, 3)).toFixed(2) }}GB</td>
											<td>{{lun.lunPath}}</td>
											<td>{{lun.lunVendor}}</td>
											<td>{{lun.lunProductId}}</td>
											<td>{{lun.lunSerial}}</td>
										</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="createDisk()">확인</button>
						<button type="button" class="btn btn-default" @click="cancelCreateDisk()">취소</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--by gtpark direct disk modify modal -->
	<div class="modal fade modifydirectdiskmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div   style="width: 700px" class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
<%--					<button type="button" class="close" data-dismiss="modal">--%>
<%--						<span aria-hidden="true">×</span>--%>
<%--					</button>--%>
					<button type="button" class="close" data-dismiss="modal" @click="cancelModifyDisk()">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel2">가상 디스크 편집</h4>
				</div>
				<div class="modal-body">
					<br>
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">크기(GByte)</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="number" class="form-control" placeholder="#GByte" v-model="disk.virtualSize">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" v-model="disk.name" @input="checkDiskName" placeholder="이름" :maxlength="this.$maxName">
								<p class="text-danger" v-if="(diskNameStatus || validDiskName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">인터페이스</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control" v-model="diskInterface">
									<option value="ide">IDE</option>
									<option value="virtio_scsi">VirtIO-SCSI</option>
									<option value="virtio">VirtIO</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
								<!-- <div class="checkbox">
									<label> <input type="checkbox" v-model="disk.wipeAfterDelete"> 삭제 후 초기화</label>
								</div> -->
								<div class="checkbox">
									<label> <input type="checkbox" v-model="disk.bootable"> 부팅 가능</label>
								</div>
								<div class="checkbox">
									<label> <input type="checkbox" v-model="disk.sharable"> 공유 가능</label>
								</div>
								<!-- <div class="checkbox">
									<label> <input type="checkbox" v-model="disk.readOnly"> 읽기전용</label>
								</div>
								<div class="checkbox">
									<label> <input type="checkbox" v-model="disk.passDiscard"> 취소 활성화</label>
								</div> -->
							</div>
						</div>
						<hr>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 도메인</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control" v-model="storageDomainId">
									<option v-for="storageDomain in storageDomains" v-if="storageDomain.type == 'DATA'"
											v-bind:value="storageDomain.id">{{storageDomain.name}}</option>
								</select>
							</div>
						</div>
						<!-- <div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">할당 정책</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control">
									<option>Choose option</option>
									<option>Option one</option>
									<option>Option two</option>
									<option>Option three</option>
									<option>Option four</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">디스크 프로파일</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control"
									v-model="disk.diskProfileId">
									<option v-bind:value="disk.diskProfileId">{{disk.diskProfileName}}</option>
								</select>
							</div>
						</div> -->
			</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-primary" @click="createDisk()">확인</button>
			<button type="button" class="btn btn-default" @click="cancelModifyDisk()">취소</button>
<%--            <button type="button" class="btn btn-default"data-dismiss="modal">취소</button>--%>

		</div>
			</div>
		</div>
	</div>

	<!--by gtpark LUN disk modify modal -->
<%--	<div class="modal fade modifylundiskmodal" tabindex="-1" role="dialog" aria-hidden="true">--%>
<%--		<div   style="width: 700px" class="modal-dialog modal-lg">--%>
<%--			<div class="modal-content">--%>
<%--				<div class="modal-header">--%>
<%--&lt;%&ndash;					<button type="button" class="close" data-dismiss="modal">&ndash;%&gt;--%>
<%--&lt;%&ndash;						<span aria-hidden="true">×</span>&ndash;%&gt;--%>
<%--&lt;%&ndash;					</button>&ndash;%&gt;--%>
<%--					<button type="button" class="close" data-dismiss="modal" @click="cancelModifyDisk()">--%>
<%--						<span aria-hidden="true">×</span>--%>
<%--					</button>--%>
<%--					<h4 class="modal-title" id="myModalLabel3">가상 디스크 편집</h4>--%>
<%--				</div>--%>
<%--				<div class="modal-body">--%>
<%--					<br>--%>
<%--					<div class="row">--%>
<%--						<div class="form-group">--%>
<%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
<%--								<input type="text" class="form-control" v-model="disk.name" @input="checkDiskName" placeholder="이름" :maxlength="this.$maxName">--%>
<%--								<p class="text-danger" v-if="(diskNameStatus || validDiskName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>--%>
<%--							</div>--%>
<%--						</div>--%>
<%--						<div class="form-group">--%>
<%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
<%--								<input type="text" class="form-control" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">--%>
<%--							</div>--%>
<%--						</div>--%>
<%--						<div class="form-group">--%>
<%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">인터페이스</label>--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
<%--								<select class="form-control" v-model="diskInterface">--%>
<%--									<option value="ide">IDE</option>--%>
<%--									<option value="virtio_scsi">VirtIO-SCSI</option>--%>
<%--									<option value="virtio">VirtIO</option>--%>
<%--								</select>--%>
<%--							</div>--%>
<%--						</div>--%>
<%--						<div class="form-group">--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">--%>
<%--								<div class="checkbox">--%>
<%--									<label> <input type="checkbox" v-model="disk.bootable"> 부팅 가능</label>--%>
<%--								</div>--%>
<%--								<div class="checkbox">--%>
<%--									<label> <input type="checkbox" v-model="disk.sharable"> 공유 가능</label>--%>
<%--								</div>--%>
<%--							</div>--%>
<%--						</div>--%>
<%--						<hr>--%>
<%--						<div class="form-group">--%>
<%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">사용 호스트<span class="text-danger">*</span></label>--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
<%--								<select class="form-control"  v-model="disk.lunVos" @change="changeHost()">--%>
<%--									<option value="">사용 호스트 선택</option>--%>
<%--									<option  v-for="host in hosts"  :value="host.lunVos">{{host.hostName}}</option>--%>
<%--								</select>--%>
<%--							</div>--%>
<%--						</div>--%>
<%--						<hr>--%>
<%--						<div class="form-group">--%>
<%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 타입<span class="text-danger">*</span></label>--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
<%--								<select class="form-control"  v-model="disk.storageType">--%>
<%--									<option value="">스토리지 타입 선택</option>--%>
<%--									<option  value="FCP">파이버 채널</option>--%>
<%--								</select>--%>
<%--							</div>--%>
<%--						</div>--%>
<%--						<table v-if="disk.lunVos.length > 0 && disk.storageType == 'FCP'" class="table table-striped text-center">--%>

<%--							<thead>--%>
<%--							<tr>--%>
<%--								<th>--%>
<%--									<input disabled type="checkbox">--%>
<%--								</th>--%>
<%--								<th>LUN ID</th>--%>
<%--								<th>크기</th>--%>
<%--								<th>경로</th>--%>
<%--								<th>벤더 ID</th>--%>
<%--								<th>제품 ID</th>--%>
<%--								<th>시리얼</th>--%>
<%--							</tr>--%>
<%--							</thead>--%>
<%--							<tbody>--%>
<%--							<tr  v-for="lun of disk.lunVos" @click="selectLun(lun)">--%>
<%--								<td class="a-center">--%>
<%--									<input :disabled="lun.diskId != null" type="checkbox" :id="disk.lun.lunId" :value="lun" v-model="disk.lun">--%>
<%--								</td>--%>
<%--								<td>{{lun.lunId}}</td>--%>
<%--								<td>{{(lun.lunSize / Math.pow(1024, 3)).toFixed(2) }}GB</td>--%>
<%--								<td>{{lun.lunPath}}</td>--%>
<%--								<td>{{lun.lunVendor}}</td>--%>
<%--								<td>{{lun.lunProductId}}</td>--%>
<%--								<td>{{lun.lunSerial}}</td>--%>
<%--							</tr>--%>
<%--							</tbody>--%>
<%--						</table>--%>
<%--					</div>--%>
<%--				</div>--%>
<%--			<div class="modal-footer">--%>
<%--				<button type="button" class="btn btn-primary" @click="createDisk()">확인</button>--%>
<%--				<button type="button" class="btn btn-default" @click="cancelModifyDisk()">취소</button>--%>
<%--&lt;%&ndash;                <button type="button" class="btn btn-default"data-dismiss="modal">취소</button>&ndash;%&gt;--%>
<%--			</div>--%>
<%--			</div>--%>
<%--		</div>--%>
<%--		</div>--%>
	</div>





<script src="/js/castanets/compute/createVm.js" type="text/javascript"></script>