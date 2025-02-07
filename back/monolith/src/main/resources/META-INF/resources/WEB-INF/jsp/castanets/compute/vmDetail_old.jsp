<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="vmDetail">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>
					컴퓨팅 <small> <a href="/compute/vms">가상머신</a>  {{vm.name}}</small>
				</h3>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>{{vm.name}}</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="row">
							<div class="col-md-5 col-sm-5 col-xs-12">
								<div class="panel-body">
									<table class="table table-bordered">
										<tbody>
											<tr>
												<td>설명</td>
												<td>{{vm.comment == null ? '-' : vm.comment}}</td>
											</tr>
											<tr>
												<td>부팅시간(업타임)</td>
												<td>{{changeUptime(vm.startTime)}}</td>
											</tr>
											<tr>
												<td>실행 호스트</td>
												<td>{{vm.runHost == null ? '클러스터 내의 호스트' : vm.runHost}}</td>
											</tr>
										</tbody>
									</table>
									<!-- Pie charts -->
									<div class="row text-center clname">
										<div class="col-md-6 col-sm-6 col-xs-6" v-if="vm.cpuUsage.length == 0">
											<span class="chart"> <span class="percent">0%
													<chart-doughnut :height="120" :width="120"
														:free="100"
														:used="0"></chart-doughnut>
											</span>
											</span>
											<h4>CPU</h4>
											<h6>
												총 100% 중 <i class="green">100%</i>
												사용가능
											</h6>
										</div>
										<div class="col-md-6 col-sm-6 col-xs-6" v-if="vm.cpuUsage.length > 0">
											<span class="chart"> <span class="percent">{{vm.cpuUsage[0][1]}}%
													<chart-doughnut :height="120" :width="120"
														:free="100 - Number(vm.cpuUsage[0][1])"
														:used="Number(vm.cpuUsage[0][1])"></chart-doughnut>
											</span>
											</span>
											<h4>CPU</h4>
											<h6>
												총 100% 중 <i class="green">{{100 - vm.cpuUsage[0][1]}}%</i>
												사용가능
											</h6>
										</div>
										<div class="col-md-6 col-sm-6 col-xs-6" v-if="vm.memoryUsage.length == 0">
											<span class="chart"> <span class="percent">0%
													<chart-doughnut :height="120" :width="120"
														:free="100"
														:used="0"></chart-doughnut>
											</span>
											</span>
											<h4>메모리</h4>
											<h6>
												총 100% 중 <i class="green">100%</i>
												사용가능
											</h6>
										</div>
										<div class="col-md-6 col-sm-6 col-xs-6" v-if="vm.memoryUsage.length > 0">
											<span class="chart"> <span class="percent">{{vm.memoryUsage[0][1]}}%
													<chart-doughnut :height="120" :width="120"
														:free="100 - Number(vm.memoryUsage[0][1])"
														:used="Number(vm.memoryUsage[0][1])"></chart-doughnut>
											</span>
											</span>
											<h4>메모리</h4>
											<h6>
												총 100% 중 <i class="green">{{100 - vm.memoryUsage[0][1]}}%</i>
												사용가능
											</h6>
										</div>
										<div class="clearfix"></div>
									</div>
								</div>
							</div>
	
							<!-- graph area -->
	
							<div class="col-md-7 col-sm-7 col-xs-12">
								<div class="x_title">
									<h4>CPU, 메모리, 네트워크 이용률</h4>
									<div class="clearfix"></div>
								</div>
								<div class="x_content2">
									<chart-flot-triple style="height: 320px" :data1="vm.memoryUsage" :label1="'메모리'"
										:data2="vm.cpuUsage" :label2="'CPU'" :data3="vm.networkUsage" :label3="'네트워크'"></chart-flot-triple>
								</div>
							</div>
							<!-- /graph area -->
						</div>
					</div>
				</div>
				<div class="col-md-9 col-sm-9 col-xs-9">
					<p>
						<strong>마지막 업데이트 </strong><i
							class="glyphicon glyphicon-calendar fa fa-calendar"></i>
						{{lastUpdated}}
					</p>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-3 listb">
					<button class="btn btn-success btn-sm" type="button" v-on:click="vms()">
						<i class="fa fa-list-ul"></i> 목록
					</button>
				</div>
			</div>
		</div>
	
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>시스템 정보</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>CPU 코어 수</th>
									<th>설정된 메모리</th>
									<th>할당할 실제 메모리</th>
									<th>OS 정보</th>
									<th>에이전트 정보</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{{vm.vmSystem.totalVirtualCpus}}(
										{{vm.vmSystem.virtualSockets}}:
										{{vm.vmSystem.coresPerVirtualSocket}}:
										{{vm.vmSystem.threadsPerCore}})</td>
									<td>{{vm.vmSystem.definedMemory}}</td>
									<td>{{vm.vmSystem.guaranteedMemory}}</td>
									<td>{{vm.os}}</td>
									<td>-</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
	
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="col-md-3 col-sm-3 col-xs-12">
						<h2>네트워크 인터페이스</h2>
						</div>

<%--						by gtpark--%>
						<div class="col-md-9 col-sm-9 col-xs-12 text-right" >
							<div class="btn-group2">
								<button type="button" class="btn  btn-success btn-sm" :disabled="inPreview || locked || tempVmNics.id  == ''" data-toggle="modal" data-target=".updatevmnicmodel">
									<i class="fa fa-file-o"></i> 편집
							</button>
							</div>
						</div>


						<div class="clearfix"></div>
					</div>

					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>상태</th>
									<th>NIC</th>
									<th>이름</th>
									<th>IPv4</th>
									<th>IPv6</th>
									<th>맥어드레스</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="vm.vmNics.length > 0" v-for="nic in vm.vmNics">
									<td v-if="nic.status === true"><i
										class="fa fa-arrow-up green"></i></td>
									<td v-else><i class="fa fa-arrow-down red"></i></td>
									<td>{{nic.nicName == null ? '-' : nic.nicName}}</td>
									<td>{{nic.networkName == null ? '-' : nic.networkName}}</td>
									<td>{{nic.ipv4 == null ? '-' : nic.ipv4}}</td>
									<td>{{nic.ipv6 == null ? '-' : nic.ipv6}}</td>
									<td>{{nic.macAddress == null ? '-' : nic.macAddress}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="col-md-3 col-sm-3 col-xs-12">
							<h2>디스크</h2>
						</div>
						<!-- <div class="col-md-9 col-sm-9 col-xs-12 text-right">
							<div class="btn-group">
								<button type="button" class="btn btn-primary btn-sm">
									<i class="fa fa-file-o"></i> 등록
								</button>
								<button type="button" class="btn btn-primary btn-sm">
									<i class="fa fa-chain"></i> 연결
								</button>
								<button type="button" class="btn btn-primary btn-sm">
									<i class="fa fa-edit"></i> 편집
								</button>
								<button type="button" class="btn btn-primary btn-sm">
									<i class="fa fa-trash-o"></i> 삭제
								</button>
							</div>
						</div> -->
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>상태</th>
									<th>별칭</th>
									<th>가상크기</th>
									<th>연결대상</th>
									<th>인터페이스</th>
									<th>정렬</th>
									<th>유형</th>
									<th>설명</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="vm.disks.length != 0" v-for="disk in vm.disks">
									<td v-if="disk.status === 'ok'"><i
										class="fa fa-arrow-up green"></i></td>
									<td v-else><i class="fa fa-arrow-down red"></i></td>
									<td>{{disk.name}}</td>
									<td>{{disk.virtualSize}}</td>
									<td>{{disk.attachedTo}}</td>
									<td>{{disk.diskInterface}}</td>
									<td>{{disk.alignment}}</td>
									<td>{{disk.type}}</td>
									<td>{{disk.description == null ? '-' : disk.description}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
	
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="col-md-3 col-sm-3 col-xs-12">
							<h2>스냅샷</h2>
						</div>
						<div class="col-md-9 col-sm-9 col-xs-12 text-right" >
							<div class="btn-group2">
								<button type="button" class="btn btn-primary btn-sm" :disabled="inPreview || locked" data-toggle="modal" data-target=".createsnapshotmodal">
									<i class="fa fa-file-o"></i> 생성
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedSnapshot.description == null || inPreview || locked" data-toggle="modal" data-target=".previewsnapshotmodal">
									<i class="fa fa-file-text"></i> 미리보기 <i class="fa fa-arrow-down"></i>
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="!inPreview || locked" @click="commitSnapshot()">
									<i class="fa fa-clipboard"></i> 커밋
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="!inPreview || locked" @click="undoSnapshot()">
									<i class="fa fa-rotate-left"></i> 되돌리기
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedSnapshot.description == null || selectedSnapshot.description == 'Active VM' || inPreview || locked" data-toggle="modal" data-target=".removesnapshotmodal">
									<i class="fa fa-trash-o"></i> 삭제
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedSnapshot.description == null || selectedSnapshot.description == 'Active VM' || inPreview || locked" @click="cloneVm()">
									<i class="fa fa-copy"></i> 복제
								</button>
								<!-- <button type="button" class="btn btn-primary btn-sm">
									<i class="fa fa-columns"></i> 템플릿생성
								</button> -->
							</div>
						</div>
						<div class="clearfix"></div>
	
					</div>
					<!-- start accordion -->
					<div class="accordion" :id="'accordion' + index" role="tablist" aria-multiselectable="true" v-for="(snapshot, index) in snapshots">
						<div class="panel">
							<a class="panel-heading" role="tab" id="headingOne" data-toggle="collapse" data-parent="#accordion"
								:href="'#collapseOne' + index" aria-expanded="true" :aria-controls="'collapseOne' + index" @click="selectSnapshot(snapshot)">
								<div class="col-md-11 col-sm-11 col-xs-4" v-if="choice(snapshot.id)">
									<i class="fa fa-camera" v-if="snapshot.status == 'ok'"></i>
									<i class="fa fa-lock" v-if="snapshot.status == 'locked'"></i>
									<i class="fa fa-eye" v-if="snapshot.status == 'in_preview'"></i>
									{{snapshot.description}} 선택
								</div>
								<div class="col-md-11 col-sm-11 col-xs-4" v-if="!choice(snapshot.id)">
									<i class="fa fa-camera" v-if="snapshot.status == 'ok'"></i>
									<i class="fa fa-lock" v-if="snapshot.status == 'locked'"></i>
									<i class="fa fa-eye" v-if="snapshot.status == 'in_preview'"></i>
									{{snapshot.description}}
								</div>
								<div class="clearfix"></div>
							</a>
							<div :id="'collapseOne' + index" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
								<div class="panel-body">
									<div class="col-md-12 col-sm-12 col-xs-12">
										<div class="" role="tabpanel" data-example-id="togglable-tabs">
											<ul id="myTab" class="nav nav-tabs bar_tabs" role="tablist">
												<li role="presentation" class="active">
													<a :href="'#tab_text_1-1' + index" role="tab" id="tab1-1" data-toggle="tab" aria-expanded="true">일반</a>
												</li>
												<li role="presentation" class="">
													<a :href="'#tab_text_1-2' + index" role="tab" id="tab1-2" data-toggle="tab" aria-expanded="false">디스크</a>
												</li>
												<li role="presentation" class="">
													<a :href="'#tab_text_1-3' + index" role="tab" id="tab1-3" data-toggle="tab" aria-expanded="false">네트워크 인터페이스</a>
												</li>
												<li role="presentation" class="">
													<a :href="'#tab_text_1-4' + index" role="tab" id="tab1-4" data-toggle="tab" aria-expanded="false">설치된 애플리케이션</a>
												</li>
											</ul>
											<div id="myTabContent" class="tab-content">
												<div role="tabpanel" class="tab-pane fade active in"
													:id="'tab_text_1-1' + index" aria-labelledby="일반">
													<div class="x_content">
														<div class="table-responsive snpd">
															<table class="table">
																<col width="20">
																<col width="20">
																<col width="10">
																<col width="10">
																<col width="20">
																<col width="20">
																<tbody>
																	<tr>
																		<th>생성 날짜</th>
																		<td>{{snapshot.date | date}}</td>
																		<td></td>
																		<td></td>
																		<td></td>
																		<td></td>
																	</tr>
																	<tr>
																		<th>상태</th>
																		<td>{{snapshot.status}}</td>
																		<td></td>
																		<td></td>
																		<td></td>
																		<td></td>
																	</tr>
																	<tr>
																		<th>메모리</th>
																		<td>{{snapshot.memory}}</td>
																		<td></td>
																		<td></td>
																		<td></td>
																		<td></td>
																	</tr>
																	<tr>
																		<th>설명</th>
																		<td>{{snapshot.description}}</td>
																		<td></td>
																		<td></td>
																		<td></td>
																		<td></td>
																	</tr>
																	<tr>
																		<th>설정된 메모리</th>
																		<td>{{vm.vmSystem.definedMemory}}</td>
																		<td></td>
																		<td></td>
																		<td></td>
																		<td></td>
																	</tr>
																	<tr>
																		<th>할당할 실제 메모리</th>
																		<td>{{vm.vmSystem.guaranteedMemory}}</td>
																		<td></td>
																		<td></td>
																		<td></td>
																		<td></td>
																	</tr>
																	<tr>
																		<th>CPU 코어 수</th>
																		<td>
																			{{vm.vmSystem.totalVirtualCpus}}(
																			{{vm.vmSystem.virtualSockets}}:
																			{{vm.vmSystem.coresPerVirtualSocket}}:
																			{{vm.vmSystem.threadsPerCore}})
																		</td>
																		<td></td>
																		<td></td>
																		<td></td>
																		<td></td>
																	</tr>
																</tbody>
															</table>
														</div>
													</div>
												</div>
												<div role="tabpanel" class="tab-pane fade" :id="'tab_text_1-2' + index" aria-labelledby="디스크">
													<div class="x_content">
														<div class="table-responsive snpd">
															<table class="table">
																<col width="20">
																<col width="20">
																<col width="10">
																<col width="10">
																<col width="20">
																<col width="20">
																<tbody v-if="snapshot.disks.length == 0" v-for="disk in vm.disks">
																	<tr>
																		<th>상태</th>
																		<td>{{disk.status}}</td>
																	</tr>
																	<tr>
																		<th>별칭</th>
																		<td>{{disk.name}}</td>
																	</tr>
																	<tr>
																		<th>가상 크기</th>
																		<td>{{disk.virtualSize}}</td>
																	</tr>
																	<tr>
																		<th>실제 크기</th>
																		<td>{{disk.actualSize}}</td>
																	</tr>
																	<!-- <tr>
																		<th>할당 정책</th>
																		<td>Sparse</td>
																	</tr>
																	<tr>
																		<th>인터페이스</th>
																		<td>{{tempDisk.diskInterface == null ? '해당 없음' : tempDisk.diskInterface}}</td>
																	</tr>
																	<tr>
																		<th>생성 일자</th>
																		<td>2018. 6. 19. 오전 10:13:10</td>
																	</tr>
																	<tr>
																		<th>디스크 스냅샷 ID</th>
																		<td>{{disk.snapshotId}}</td>
																	</tr> -->
																	<tr>
																		<th>유형</th>
																		<td>{{disk.type}}</td>
																	</tr>
																	<tr>
																		<th>설명</th>
																		<td>{{disk.description}}</td>
																	</tr>
																	<tr>
																	</tr>
																</tbody>
																<tbody v-if="snapshot.disks.length > 0" v-for="disk in snapshot.disks">
																	<tr>
																		<th>상태</th>
																		<td>{{disk.status}}</td>
																	</tr>
																	<tr>
																		<th>별칭</th>
																		<td>{{disk.name}}</td>
																	</tr>
																	<tr>
																		<th>가상 크기</th>
																		<td>{{disk.virtualSize}}</td>
																	</tr>
																	<tr>
																		<th>실제 크기</th>
																		<td>{{disk.actualSize}}</td>
																	</tr>
																	<!-- <tr>
																		<th>할당 정책</th>
																		<td>Sparse</td>
																	</tr>
																	<tr>
																		<th>인터페이스</th>
																		<td>{{tempDisk.diskInterface == null ? '해당 없음' : tempDisk.diskInterface}}</td>
																	</tr>
																	<tr>
																		<th>생성 일자</th>
																		<td>2018. 6. 19. 오전 10:13:10</td>
																	</tr> -->
																	<tr>
																		<th>디스크 스냅샷 ID</th>
																		<td>{{disk.snapshotId}}</td>
																	</tr>
																	<tr>
																		<th>유형</th>
																		<td>{{disk.type}}</td>
																	</tr>
																	<tr>
																		<th>설명</th>
																		<td>{{disk.description}}</td>
																	</tr>
																	<tr>
																	</tr>
																</tbody>
															</table>
														</div>
													</div>
												</div>
												<div role="tabpanel" class="tab-pane fade" :id="'tab_text_1-3' + index" aria-labelledby="네트워크 인터페이스">
													<div class="x_content">
														<div class="table-responsive snpd">
															<table class="table">
																<col width="20">
																<col width="20">
																<col width="10">
																<col width="10">
																<col width="20">
																<col width="20">
																<tbody v-if="snapshot.nics.length == 0" v-for="nic in vm.vmNics">
																	<tr>
																		<th>이름</th>
																		<td>{{nic.nicName}}</td>
																	</tr>
																	<tr>
																		<th>네트워크 이름</th>
																		<td>{{nic.networkName}}</td>
																	</tr>
																	<tr>
																		<th>프로파일 이름</th>
																		<td>{{nic.profileName}}</td>
																	</tr>
																	<tr>
																		<th>유형</th>
																		<td>{{nic.interfaceType}}</td>
																	</tr>
																	<tr>
																		<th>MAC</th>
																		<td>{{nic.macAddress}}</td>
																	</tr>
																	<!-- <tr>
																		<th>Rx 속도(Mbps)</th>
																		<td>&lt; 1</td>
																	</tr>
																	<tr>
																		<th>Tx 속도(Mbps)</th>
																		<td>&lt; 1</td>
																	</tr>
																	<tr>
																		<th>중단(Pkts)</th>
																		<td>0</td>
																	</tr> -->
																</tbody>
																<tbody v-if="snapshot.nics.length > 0" v-for="nic in snapshot.nics">
																	<tr>
																		<th>이름</th>
																		<td>{{nic.nicName}}</td>
																	</tr>
																	<!-- <tr>
																		<th>네트워크 이름</th>
																		<td>ovirtmgmt</td>
																	</tr>
																	<tr>
																		<th>프로파일 이름</th>
																		<td>ovirtmgmt</td>
																	</tr> -->
																	<tr>
																		<th>유형</th>
																		<td>{{nic.interfaceType}}</td>
																	</tr>
																	<tr>
																		<th>MAC</th>
																		<td>{{nic.macAddress}}</td>
																	</tr>
																	<!-- <tr>
																		<th>Rx 속도(Mbps)</th>
																		<td>&lt; 1</td>
																	</tr>
																	<tr>
																		<th>Tx 속도(Mbps)</th>
																		<td>&lt; 1</td>
																	</tr>
																	<tr>
																		<th>중단(Pkts)</th>
																		<td>0</td>
																	</tr> -->
																</tbody>
															</table>
														</div>
													</div>
												</div>
												<div role="tabpanel" class="tab-pane fade" :id="'tab_text_1-4' + index" aria-labelledby="설치된 애플리케이션">
													<div class="x_content">
														<div class="table-responsive snpd">
															<table class="table">
																<col width="20">
																<col width="20">
																<col width="10">
																<col width="10">
																<col width="20">
																<col width="20">
																<tbody>
																	<tr>
																		<th>표시할 항목이 없습니다.</th>
																		<td></td>
																	</tr>
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
										</div>
	
									</div>
								</div>
							</div>
						</div>
						<!-- end of accordion -->
					</div>
				</div>
			</div>
	
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>이벤트</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table id="datatable-buttons"
							class="table table-striped dataTable no-footer dtr-inline text-center"
							role="grid" aria-describedby="datatable-buttons_info">
							<thead>
								<tr>
									<th style="width: 10%">타입</th>
									<th style="width: 12%">시간</th>
									<th>메세지</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="p in paginatedData">
									<td><i :class="[eventType(p.severity)]" :title="getEventStatusToKor(p.severity)"></i></td>
									<td>{{p.time | date}}</td>
									<td class="text-left">{{p.description}}</td>
								</tr>
							</tbody>
						</table>
	
						<div class="row text-center">
							<div class="btn-group">
							<div class="btn-group">
								<button class="btn btn-default btn-sm" type="button"
									@click="prevPage" :disabled="pageNumber === 0">Prev</button>
								<button class="btn btn-default btn-sm" type="button"
									@click="movePage(1)" v-if="(0 < pageNumber) && (pageNumber > 2)">1</button>
								<button class="btn btn-default btn-sm" type="button"
									@click="pageNumber = pageNumber > 5 ? pageNumber -5 : 0" v-if="(0 < pageNumber) && (pageNumber > 2)">...</button>
								<button
									:class="[isSelected(number) ? selectedNumber : unSelectedNumber]"
									type="button" @click="movePage(number)"
									v-for="number in pageCount" v-if="(pageNumber - 2 < number) && (number < pageNumber + 4)">{{number}}</button>
								<button class="btn btn-default btn-sm" type="button"
									@click="pageNumber = pageNumber + 5 < pageCount ? pageNumber + 5 : pageCount - 1" v-if="pageCount - pageNumber > 3">...</button>
								<button class="btn btn-default btn-sm" type="button"
									@click="movePage(pageCount)" v-if="pageCount - pageNumber > 3">{{pageCount}}</button>
								<button class="btn btn-default btn-sm" type="button"
									@click="nextPage" :disabled="pageNumber >= pageCount -1">Next</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>
			<div id="datatable-buttons_wrapper"
				class="dataTables_wrapper form-inline dt-bootstrap no-footer">
			</div>
		</div>
	</div>

	<!-- by gtpark update VmNic -->

	<div class="modal fade updatevmnicmodel" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" @click="cancelModifyNic()">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel2">네트워크 인터페이스 편집</h4>
				</div>
				<div class="modal-body">

					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">이름</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" v-model="tempVmNics.nicName">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12"> 프로파일</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control" v-model="tempVmNics.profileId" >
									<option value="none">비어있음</option>
									<option v-for="profile of tempVmNics.profileList" :value="profile.profileId">{{profile.profileName}}</option>
								</select>
							</div>
						</div>

						<div class="form-group">
							<div  class="checkbox">
							<div class="col-md-3 col-sm-9 col-xs-12 " >
									<label>
										<input type="checkbox" class="" :disabled="vm.status === 'up' && cardState === 'true'  " v-model="checkMac"> 사용자지정 MAC주소
									</label>
								</div>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control"  :disabled="!checkMac || (vm.status === 'up' && cardState === 'true') " placeholder="" v-model="tempVmNics.macAddress ">
								</div>
							</div>
						</div>
						<hr>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">링크 상태</label>
								<div class="radio">
									<div class="col-lg-3 col-sm-3 col-xs-3">
										<div class="row" >
											<label> <input type="radio" name="pickLink" v-model="linkState" value="true"> Up
												<%--											<img src="/images/clear_background.gif" style="width:38px;height:21px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAVCAIAAAClsQv6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx1JREFUeNqslbtOG0EUhmcvvtsYcxE3C6UAGlwiK6KBngiJlifgNVLlGfIE6VJTUSAaKGi4WyAcFF+CF7CxWd/Wdj7PBINIhMCb3/Jodmd3/vP/58xZbf5sXvSLw7nDPt4y+W982ciIjOgIocmfEGr4BzrdX1ALlhKlzU+b/QXapcyKbD1WHxoaajabHQm1pmla5xHqEhiGkUln9IDetzemCj0Wi01MTNi27ThOvV6vVCr39/eNRsM0zWAwGAqFmBgSPp/P+mm1RdsVJbFDUyqVbIlCoVAsFuFut9ss6boO6+DgoE8iHA6LjnCDP5TVahWah4eH29vbm5ubgYGBpaWlRCIB8dHR0dbWFqHAyn2Px9Nxx9lNCTpwEjJYGVEcj8e7BloWWVxcXEwmkxWJWq1Gvl+rrzdSPlfJpNVqsfX19fUvCYKYmZlBLqllZFUI18aiEmUqeQrQUy9MFIEq1Kdidp9LwNaI0CWYk05yxlxxRKPRlZWV09NTnhGuIVU6etgfjgajVslCDXKx9+7uDqHqLEI8PDy8vLxMdi8uLpyWo7U1V5SND41YKKZrunFm5DN5dWbK5bLX62WunsNkKnZqamp6etou25fickfs9EepPe+xq99XnTPH0q1cNodWVHIq6BKcRY4mYyQSCQQCfr/fMGgRoXh8kiBoFNx8B2WvvSVSCTVZ/7Z+/uOcQiWXEGO1IgMQeyVYUoUG2ejo6MjICOrDj+h581r59D4LEM8ac3pEq3pqqnyKdrFQLVg1C6uVIEXZezGbzXLJTfyIStCuyQLc6nmOOIb1XnlS+ULr30h+/WhnKtQzxlLPqrjYCBtUqZsSXLIKHxFQdIzQEwf0mMS75ts/gZXPlePj4+3t7ZOTk1wuxx3V5RkVmaJXc5oJNdiUIDtKmIrGfHvaCZzOt7CwQJPa39/f29vjpF5dXbHj03amycicngyZuklYSOSS3MP90tj3gkTu7u6mUim4mfM5UucYD8koZTUpMT4+PjY2hs+YbLpsJWy3trZWk6C+Dg4O0ul0Pp/nGwA3xIzYoBymDv6Dyj7wW4ABAHQF7BtZi8r5AAAAAElFTkSuQmCC) no-repeat 0px 0px;" border="0">--%>
											</label>
										</div>
										<div class="row">
											<label> <input type="radio" name="pickLink" v-model="linkState" value="false"> Down
												<%--											<img src="/images/clear_background.gif" style="width:68px;height:21px;background:url(data:image/png;base64,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) no-repeat 0px 0px;" border="0">--%>
											</label>
										</div>

									</div>
								</div>
						</div>
						<hr>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">카드 상태</label>
							<div class="radio">
<%--								<div class="col-md-5 col-sm-5 col-xs-12">--%>
								<div class="col-lg-3 col-sm-3 col-xs-3">
									<div class="row">
										<label> <input type="radio" name="pickCard" v-model="cardState" value="true"> 연결됨
											<%--										<img src="/images/clear_background.gif" style="width:30px;height:30px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAYAAAARfGZ1AAAD3UlEQVR42rWUbUibVxTHj9ZZFyatbdLERKVKG+MzfCEfopR27TQKlcaulTrEkc2NJtChdlhYaxfqKmGZydyYNCsDC0FoUJw4K9Pih7a4DYSpSCZOLKWDUeg+zG0OBn7579znrbHq2o7uXP4kz+Xe3zn3nHMvud1uzM3N4f8wIhOB8giVJyoxPz//nOGFDBdjhXWJUF1XjYWFhWcGZb9GsoStra2p8CIV7mRNs35ltROOHj+KxcXFpwZ/zcOT2KU7WF1dZbikwKvKq5CdlQ1y8VeCdY91huDxeLC0tPREcPNKEQ7dfBT98vIyw/MVuHW7Fb2f96KpsQmml0ygg4ToSlSHjI+Pyxu2Ap+6b1sHF01ClKOm5U3CyYaTCEfCiEQimJyclBfZ7XZZwqLjUUxMTDwRPDs7q0ZuV+F9rCxC4EIAnZ2dOphuHpIhmgMN3MNjM/D09DSmpqbUnGsF5XY0OozoONeBrq4uHS7AAqQ5ENLAooBbgZVu0QrqrELgYgCtLa1oa2vT4QLQ/Lskq0cdItrHwQMDAxgeHtbBCjypoO3t7QgGgygrK8PMzMw6B+/8USxrM/DV768i70oeMqVMeL3eJHiempa3WETYZ92HcHcYIyMj8jE1B7WzO2To4+DotShoB6f0UyMsDy0oLiveGPnhzw4jx5kDKlecOCUnfKd9cuU1BwK6DjzKYN6f+noqGpsaQekEm9GWBM9gWIQX/J2KV2+54bvkg+WIRS4wpRAKCwpx5/Yd3YEOHmHwu7xGdNsLhAqpAg3BBoga6nDRzyLHVEvYfpew7a80uCdq4D/nh7nZDHpRcRK/Htc3RW8w+G2eD7JeZjWp4sjJmATX/tTU1ODuHOf8A0LafdZKOo7d8GC3fzdMfr6xBpJzS8dZ77E+YvWwHErkImJn0AmX5NoIr6+vRyxGOFVH+GaQcOQaIeVn8ZCl4NhXdfD5fNgT3QN6n+cusHJZHaxSEXWmEjk72WvcuxGeSCRQUlICE7/voRDhCkflf4PQeJs3PSCkPzDA2++F+bIZlhDXxMPzaaxU8XuaIz8DChtABZukJfmBkiQJ+/cT6vgUP87wabgetcLJQ67JL9tw/tvzaAm1IKM7A3RCeaLJc1Bp6dp/gWs2NjYGh8OBcm7NykrCD98RTBbOfYABvxF23tuJ0i9L4Qq5kPVhFuhj9b5UPQVcs9HRUbkFKyoIfX19GBoaQn5hPugyg/4kGH4yoLW3FWe7zyrwV54Brpl4N2KxmP49ODiIXHsu6BMGrvLFWshW4Af+A3wri8fjsBZZQV+oaal+jnDN+vv7YbPZQOZHyH8AqGzPcrFXRmQAAAAASUVORK5CYII=) no-repeat 0px 0px;" border="0">--%>
										</label>
									</div>
									<div  class="row">
										<label> <input type="radio" name="pickCard" v-model="cardState" value="false"> 분리
											<%--										<img src="/images/clear_background.gif" style="width:30px;height:30px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAEgklEQVR42q2V6U+cVRTGBwiGQAPDJi37YNnKvpctpQMMQoDQONAC6piCGNLyAUlDwhYKRq2AbDUxREGqVIZODEpaoKMhKQ0ptIBAYFgCEf6A+oH0C0Efz7mTl8xUa1rlJjfzvpM753fPc55zRgaTFRcXh+npaRznkpm+2NraIsDJCeqEBMzMzBw/wNnZGYbAQPwaFoavIiORd/Ys5ubmjg/g4uIiAP7u7vg2PV2AOiMi8GZSEubn5/8/wNXVVQBSU1PFc4SnJ+4olQJ0nUDK5GQsLi7+d4BcLhcA/uzp6UFJSYl4TvLxwdi5c5gPD8eHoaFQ0vPy8vKrA+zt7QUggm6rVqvR1taG9vZ2lJaWwsHBAdkBAfiF5HoUFYX3g4OhpOxWVlZevcj5+fmwsbFBfX09mpub0dLSgt7eXuTl5YmMLp05g4dkgAfx8VD7+yOd6rWxsfHyRebbent7o7a2Fq2trWhqaoJWq8X6+roAcnbW1ta4npmJ2ZgY3CdbZygUUKlU2NraejFgfHwchs5OJJEMDQ0NGB4eFlobDAasra1hb28PXV1d2NnZQWxsLEKpHqqMDHRkZWGBbK2jrLheOTk52N7eNgIKZDJIO4VuxcGqq6uh0+lE2irK5j3SWxMUhHeoBpubmyKbQMo0JCREyJOWloZcuv0NAiyREUYJGE4K5ObmGgErLk74PTIYd5s/gIZ+ODU1hdHRUZynzt66N4StS29hOMgIYZnq6uoQQ9KYAlgelpinQWFhoZAynGACMCmzFJBvPE7CcOsGLvr6Iv3ECUzcbMWQwhPa0woM+ChQRpJIgOjo6L8BuHc4KNvbysoKbm5uxhpIkF4HezxITcLa4KdYH7uFRxlpGD7ti4+sX0MCndHr9ejr60NHR8cLM7C0tEQU2biqqkoAZQcHB5AgIwS57eGOuSyl2I9pM7DYz09M2crKSsjoXDDVhPc/ZRBGXc+bM2C5RAamEM7kOyc55lTnBeBt8vnq6ioGBwfFrVNSUoRFuU9YDm62LCoqbykDBnFzRpKzjmzKwfHT5/jN1wPfy+0xFhGCu1GhWPnha7xL7mGIjtzD9q2oqEBRURGSaTYxkCcAzy/WXMqAQe40NGXPB+di59L7ZzIL9J96HffjozA7dBMXyd/cC/qBAdReuyZcwjYsKChAAF2AA1pYWIji8x9XJjWho6Oj0UWmwVkiqS+0XJOTLrgT6Iefv/xY1GJpaQlPurvxRXExampq0N/fL1yVnZ2NILJxYmKiAIqxT/IKAPeAaXBT2fi7J16nMPqGt7At9wZ3t5ZgE2Tb7suXxUgpLy+HRqMRoAzqbgYoaHwcNZpp8NnZWezu7ppBeE9R8ZP5fXJSBB27cgV6uuWPVOx2chhPAJausbFRAHxIVrNRIQVnS+7v75u5y/TMyMiIkIXXn4eHuFdWhocEuk36f3L1qoAzwMvLy3zYLSwsHAWXlgT5tzO8/nj2DBPUwY8p8ACNcQb4kYwyPsgjlv8K+fP5H/J6mTPSOnz6FPoLFwTAzs7OPIPjXp00+v8C1Z1TLTxHDkgAAAAASUVORK5CYII=) no-repeat 0px 0px;" border="0">--%>
											<%--									<label> <input type="radio" name="pickCard" v-model="pickCard" value="cardState"> 연결됨--%>
											<%--										<img src="/images/clear_background.gif" style="width:30px;height:30px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAYAAAARfGZ1AAAD3UlEQVR42rWUbUibVxTHj9ZZFyatbdLERKVKG+MzfCEfopR27TQKlcaulTrEkc2NJtChdlhYaxfqKmGZydyYNCsDC0FoUJw4K9Pih7a4DYSpSCZOLKWDUeg+zG0OBn7579znrbHq2o7uXP4kz+Xe3zn3nHMvud1uzM3N4f8wIhOB8giVJyoxPz//nOGFDBdjhXWJUF1XjYWFhWcGZb9GsoStra2p8CIV7mRNs35ltROOHj+KxcXFpwZ/zcOT2KU7WF1dZbikwKvKq5CdlQ1y8VeCdY91huDxeLC0tPREcPNKEQ7dfBT98vIyw/MVuHW7Fb2f96KpsQmml0ygg4ToSlSHjI+Pyxu2Ap+6b1sHF01ClKOm5U3CyYaTCEfCiEQimJyclBfZ7XZZwqLjUUxMTDwRPDs7q0ZuV+F9rCxC4EIAnZ2dOphuHpIhmgMN3MNjM/D09DSmpqbUnGsF5XY0OozoONeBrq4uHS7AAqQ5ENLAooBbgZVu0QrqrELgYgCtLa1oa2vT4QLQ/Lskq0cdItrHwQMDAxgeHtbBCjypoO3t7QgGgygrK8PMzMw6B+/8USxrM/DV768i70oeMqVMeL3eJHiempa3WETYZ92HcHcYIyMj8jE1B7WzO2To4+DotShoB6f0UyMsDy0oLiveGPnhzw4jx5kDKlecOCUnfKd9cuU1BwK6DjzKYN6f+noqGpsaQekEm9GWBM9gWIQX/J2KV2+54bvkg+WIRS4wpRAKCwpx5/Yd3YEOHmHwu7xGdNsLhAqpAg3BBoga6nDRzyLHVEvYfpew7a80uCdq4D/nh7nZDHpRcRK/Htc3RW8w+G2eD7JeZjWp4sjJmATX/tTU1ODuHOf8A0LafdZKOo7d8GC3fzdMfr6xBpJzS8dZ77E+YvWwHErkImJn0AmX5NoIr6+vRyxGOFVH+GaQcOQaIeVn8ZCl4NhXdfD5fNgT3QN6n+cusHJZHaxSEXWmEjk72WvcuxGeSCRQUlICE7/voRDhCkflf4PQeJs3PSCkPzDA2++F+bIZlhDXxMPzaaxU8XuaIz8DChtABZukJfmBkiQJ+/cT6vgUP87wabgetcLJQ67JL9tw/tvzaAm1IKM7A3RCeaLJc1Bp6dp/gWs2NjYGh8OBcm7NykrCD98RTBbOfYABvxF23tuJ0i9L4Qq5kPVhFuhj9b5UPQVcs9HRUbkFKyoIfX19GBoaQn5hPugyg/4kGH4yoLW3FWe7zyrwV54Brpl4N2KxmP49ODiIXHsu6BMGrvLFWshW4Af+A3wri8fjsBZZQV+oaal+jnDN+vv7YbPZQOZHyH8AqGzPcrFXRmQAAAAASUVORK5CYII=) no-repeat 0px 0px;" border="0">--%>
											<%--									</label>--%>
											<%--									<label> <input type="radio" name="pickCard" v-model="pickCard" value="!cardState"> 분리--%>
											<%--										<img src="/images/clear_background.gif" style="width:30px;height:30px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAEgklEQVR42q2V6U+cVRTGBwiGQAPDJi37YNnKvpctpQMMQoDQONAC6piCGNLyAUlDwhYKRq2AbDUxREGqVIZODEpaoKMhKQ0ptIBAYFgCEf6A+oH0C0Efz7mTl8xUa1rlJjfzvpM753fPc55zRgaTFRcXh+npaRznkpm+2NraIsDJCeqEBMzMzBw/wNnZGYbAQPwaFoavIiORd/Ys5ubmjg/g4uIiAP7u7vg2PV2AOiMi8GZSEubn5/8/wNXVVQBSU1PFc4SnJ+4olQJ0nUDK5GQsLi7+d4BcLhcA/uzp6UFJSYl4TvLxwdi5c5gPD8eHoaFQ0vPy8vKrA+zt7QUggm6rVqvR1taG9vZ2lJaWwsHBAdkBAfiF5HoUFYX3g4OhpOxWVlZevcj5+fmwsbFBfX09mpub0dLSgt7eXuTl5YmMLp05g4dkgAfx8VD7+yOd6rWxsfHyRebbent7o7a2Fq2trWhqaoJWq8X6+roAcnbW1ta4npmJ2ZgY3CdbZygUUKlU2NraejFgfHwchs5OJJEMDQ0NGB4eFlobDAasra1hb28PXV1d2NnZQWxsLEKpHqqMDHRkZWGBbK2jrLheOTk52N7eNgIKZDJIO4VuxcGqq6uh0+lE2irK5j3SWxMUhHeoBpubmyKbQMo0JCREyJOWloZcuv0NAiyREUYJGE4K5ObmGgErLk74PTIYd5s/gIZ+ODU1hdHRUZynzt66N4StS29hOMgIYZnq6uoQQ9KYAlgelpinQWFhoZAynGACMCmzFJBvPE7CcOsGLvr6Iv3ECUzcbMWQwhPa0woM+ChQRpJIgOjo6L8BuHc4KNvbysoKbm5uxhpIkF4HezxITcLa4KdYH7uFRxlpGD7ti4+sX0MCndHr9ejr60NHR8cLM7C0tEQU2biqqkoAZQcHB5AgIwS57eGOuSyl2I9pM7DYz09M2crKSsjoXDDVhPc/ZRBGXc+bM2C5RAamEM7kOyc55lTnBeBt8vnq6ioGBwfFrVNSUoRFuU9YDm62LCoqbykDBnFzRpKzjmzKwfHT5/jN1wPfy+0xFhGCu1GhWPnha7xL7mGIjtzD9q2oqEBRURGSaTYxkCcAzy/WXMqAQe40NGXPB+di59L7ZzIL9J96HffjozA7dBMXyd/cC/qBAdReuyZcwjYsKChAAF2AA1pYWIji8x9XJjWho6Oj0UWmwVkiqS+0XJOTLrgT6Iefv/xY1GJpaQlPurvxRXExampq0N/fL1yVnZ2NILJxYmKiAIqxT/IKAPeAaXBT2fi7J16nMPqGt7At9wZ3t5ZgE2Tb7suXxUgpLy+HRqMRoAzqbgYoaHwcNZpp8NnZWezu7ppBeE9R8ZP5fXJSBB27cgV6uuWPVOx2chhPAJausbFRAHxIVrNRIQVnS+7v75u5y/TMyMiIkIXXn4eHuFdWhocEuk36f3L1qoAzwMvLy3zYLSwsHAWXlgT5tzO8/nj2DBPUwY8p8ACNcQb4kYwyPsgjlv8K+fP5H/J6mTPSOnz6FPoLFwTAzs7OPIPjXp00+v8C1Z1TLTxHDkgAAAAASUVORK5CYII=) no-repeat 0px 0px;" border="0">--%>
										</label>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="updateNic()">확인</button>
					<button type="button" class="btn btn-default" @click="cancelUpdateNic()">취소</button>
				</div>
			</div>
		</div>
	</div>




	<!-- create snapshot modal -->
	<div class="modal fade createsnapshotmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" @click="cancelCreateSnapshot()">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel4">스냅샷 생성</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" v-model="newSnapshot.description">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">포함할 디스크</label>
							<div class="x_content">
								<table class="table table-striped text-center">
									<thead>
										<tr>
											<th>
												<input type="checkbox" v-model="selectAll">
											</th>
											<th>별칭</th>
											<th>설명</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="disk in vm.disks">
											<td class="a-center col-md-1 col-sm-1 col-xs-12">
												<input type="checkbox" :id="disk.name" :value="disk" v-model="selectedDisks">
											</td>
											<td class="control-label col-md-5 col-sm-5 col-xs-12">
												{{disk.name}}
											</td>
											<td class="control-label col-md-6 col-sm-6 col-xs-12">
												{{disk.description}}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="createSnapshot()">확인</button>
					<button type="button" class="btn btn-default" @click="cancelCreateSnapshot()">취소</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- preview snapshot modal -->
	<div class="modal fade previewsnapshotmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel5">스냅샷 미리보기</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-12 col-sm-12 col-xs-12">미리 보기를 위해 선택된 스냅샷에 메모리가 포함되어 있습니다.</label>
							<div class="x_content">
								<table class="table table-striped text-center">
									<tbody>
										<tr>
											<td class="a-center col-md-1 col-sm-1 col-xs-12">
												<input type="checkbox" v-model="memoryRestore">
											</td>
											<td class="control-label col-md-3 col-sm-3 col-xs-12">
												메모리 복구
											</td>
											<td class="control-label col-md-8 col-sm-8 col-xs-12">
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="previewSnapshot()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- remove snapshot modal -->
	<div class="modal fade removesnapshotmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel6">스냅샷 삭제</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-12 col-sm-12 col-xs-12">
								{{selectedSnapshot.description}} 스냅샷을 삭제하시겠습니까?
							</label>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="removeSnapshot()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
</div>
</div>

<script src="/js/castanets/compute/vm.js" type="text/javascript"></script>