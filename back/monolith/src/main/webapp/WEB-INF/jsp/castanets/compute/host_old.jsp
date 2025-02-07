<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

        <!-- page content -->
		<div class="right_col" role="main" id="hostVue">
		
			<spinner v-show="spinnerOn"></spinner>

			<div v-show="!spinnerOn" v-cloak>			
				<div class="page-title">
					<div class="title_left">
						<h3>컴퓨팅<small> &#62; <a href="/compute/hosts">호스트</a> &#62; {{host.name}}</small></h3>
					</div>
				</div>
				
				<div class="clearfix"></div>
			
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>{{host.name}}</h2>
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
														<td>{{host.description}}</td>
													</tr>
													<tr>
														<td>IP</td>
														<td>{{host.address}}</td>
													</tr>
													<tr>
														<td>부팅시간(업타임)</td>
														<td>{{host.bootTime * 1000 | date}}</td>
													</tr>
												</tbody>
											</table>
							<!-- <td>{{ (host.hostLastUsage == null ||  host.hostLastUsage == undefined || host.hostLastUsage.cpuUsagePercent == null ) ? '0' : host.hostLastUsage.cpuUsagePercent}}%</td>
							<td>{{ (host.hostLastUsage == null ||  host.hostLastUsage == undefined || host.hostLastUsage.memoryUsagePercent == null ) ? '0' : host.hostLastUsage.memoryUsagePercent}}%</td> -->
							
											<!-- Pie charts -->
											<div class="row text-center clname">
												<div class="col-md-6 col-sm-6 col-xs-6">
													<span class="chart">
														<span class="percent">{{chartData.cpuUsagePercent}}%
															<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="chartData.cpuIdleUsagePercent" :used="100 - chartData.cpuIdleUsagePercent"></chart-doughnut>
														</span>
													</span>
													<h4>CPU</h4>
													<h6>총 100% 중 <i class="green">{{ chartData.cpuIdleUsagePercent }}%</i> 사용가능</h6>
												</div>
												<div class="col-md-6 col-sm-6 col-xs-6">
													<span class="chart">
														<span class="percent">{{ (chartData.memoryUsed / chartData.memoryTotal * 100).toFixed(0) }}%
															<chart-doughnut  :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="chartData.memoryFree" :used="chartData.memoryUsed"></chart-doughnut>
														</span>
													</span>
													<h4>메모리</h4>
													<h6>총 {{ chartData.memoryTotal == 0 ? 0 : (chartData.memoryTotal / Math.pow(1024, 3)).toFixed(1) }}GB 중 <i class="green">{{ chartData.memoryFree == 0 ? 0 : (chartData.memoryFree / Math.pow(1024, 3)).toFixed(1) }}GB</i> 사용가능</h6>
												</div>
												<div class="clearfix"></div>
											</div>
										</div>
									</div>
	
									<!-- graph area -->
									<div class="col-md-7 col-sm-7 col-xs-12">
										<div class="x_title">
											<h4>CPU, 메모리 이용률</h4>
											<div class="clearfix"></div>
										</div>
										<div class="x_content2">
											<chart-flot-double :data1="chartData.memoryUsage" :label1="'메모리'" :data2="chartData.cpuUsage" :label2="'CPU'"></chart-flot-double>
										</div>
									</div>
									<!-- /graph area -->
								</div>
							</div>
						</div>
					</div>
				</div>
				
				
				<div class="col-md-9 col-sm-9 col-xs-9">
					<p><strong>마지막 업데이트 </strong><i class="glyphicon glyphicon-calendar fa fa-calendar"></i> {{lastUpdated}}</p>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-3 listb">
					<button class="btn btn-success btn-sm" type="button" @click="goList()"><i class="fa fa-list-ul"></i> 목록</button>
				</div>
	
	
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>하드웨어</h2>
								<div class="clearfix"></div>
							</div>
							<div class="x_content">
								<table class="table table-striped text-center">
									<thead>
										<tr>
											<th>생산자</th>
											<th>제품이름</th>
											<th>CPU유형</th>
											<th>물리적메모리</th>
											<th>스왑메모</th>
											<th>CPU모델</th>
											<th>CPU코어수<br>코어수 (소켓/소켓당코어/쓰레드)</th>
											<th>전원관리</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{{host.hwManufacturer}}</td>
											<td>{{host.hwProductName}}</td>
											<td>{{host.cpuType}}</td>
											<td>{{ (host.memoryTotal / Math.pow(1024, 3)).toFixed(1) }}GB</td>
											<td>{{ (host.swapTotal / Math.pow(1024, 3)).toFixed(1) }}GB</td>
											<td>{{host.cpuName}}</td>
											<td>{{host.cpuSockets * host.cpuCores * host.cpuThreads}} ( {{host.cpuSockets}} : {{host.cpuCores}} : {{host.cpuThreads}} )</td>
											<td>{{host.powerManagementEnabled ? '활성화' : '비활성화'}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
	
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>소프트웨어</h2>
								<div class="clearfix"></div>
							</div>
							<div class="x_content">
								<table class="table table-striped text-center">
									<thead>
										<tr>
											<th>OS 버전</th>
											<th>KVM 버전</th>
											<th>커널 버전</th>
											<th>호스트 에이전트 버전</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{{ (host.hostSw == null || host.hostSw.hostOs == null) ? '' : host.hostSw.hostOs}}</td>
											<td>{{ (host.hostSw == null || host.hostSw.kvmVersion == null) ? '' : host.hostSw.kvmVersion}}</td>
											<td>{{ (host.hostSw == null || host.hostSw.kernelVersion == null) ? '' :  host.hostSw.kernelVersion}}</td>
											<td>{{ (host.hostSw == null || host.hostSw.vdsmVersion == null) ? '' : host.hostSw.vdsmVersion}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
	
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>가상머신</h2>
								<div class="clearfix"></div>
							</div>
							<div class="x_content">
								<table class="table table-striped text-center">
									<thead>
										<tr>
											<th>상태</th>
											<th>이름</th>
											<th>설명</th>
											<th>IP</th>
											<!-- <th>OS 호스트명</th> -->
											<th>호스트명</th>
											<th>CPU</th>
											<th>메모리</th>
											<th>네트워크</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="vmSummary in host.vmSummaries" >

											<td v-if="vmSummary.status === 'up'" ><i class="fa fa-arrow-up green" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'wait_for_launch'"><i class="fa fa-arrow-up blue" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'powering_up'"><i class="fa fa-arrow-up blue" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'powering_down'"><i class="fa fa-arrow-down blue" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'down'"><i class="fa fa-arrow-down red" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'migrating'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'suspended'"><i class="fa fa-moon-o blue" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'saving_state'"><i class="fa fa-floppy-o blue" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'reboot_in_progress'"><i class="fa fa-repeat green" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'image_locked'"><i class="fa fa-lock blue" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'not_responding'"><i class="fa fa-question black" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else-if="vmSummary.status === 'paused'"><i class="fa fa-pause red" :title="getVmStatusToKor(vmSummary.status)"></i></td>
											<td v-else><i class="fa fa-arrow-down red"></i></td>
											
											<td>{{vmSummary.name}}</td>
											<td>{{vmSummary.description}}</td>
											<td>{{vmSummary.address}}</td>
											<!-- <td>-</td> -->
											<td>{{vmSummary.hostName}}</td>
											<td>{{vmSummary.vmLastUsage.cpuUsagePercent}}%</td>
											<td>{{vmSummary.vmLastUsage.memoryUsagePercent}}%</td>
											<td>{{getTotalNicsUsage(vmSummary.vmNicsLastUsage)}}%</td>
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
                                <div style="float:left;">
                                    <button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveHostDetail()">
                                        <i class="fa fa-refresh"></i>
                                    </button>
                                </div>
								<div class="col-md-3 col-sm-3 col-xs-12">
								<h2>네트워크 인터페이스</h2>
								</div>
								<%--						by gtpark--%>
								<div class="text-right" >
									<div class="btn-group2">
										<button type="button" class="btn  btn-primary btn-sm" data-toggle="modal" data-target=".modifynetworkmodel">
											<i class="fa fa-edit"></i> 할당된 네트워크 설정
										</button>
										<button :disabled="(((usingNetList.length == 0 && unUsingNetList.length == 0) && host.hostNicsUsageApi.length == 0)
															|| (usingNetList.length == 0 && unUsingNetList.length == 0))" type="button" class="btn  btn-success btn-sm" data-toggle="modal" data-target=".setuphostnetworkmodel">
											<i class="fa fa-file-o"></i> 호스트 네트워크 설정
										</button>
									</div>
								</div>
								<div class="clearfix"></div>                    
							</div>


							<div class="x_content">
								<table class="table table-striped text-center">
									<thead>
										<tr>
											<th>이름</th>
											<th>맥어드레스</th>
											<th>수신데이터</th>
											<th>전송데이터</th>
											<th>토탈 수신데이터</th>
											<th>토탈 전송데이터</th>
											<th>본딩</th>
										</tr>
									</thead>
									<tbody>

										<template v-for="hostNic in host.hostNicsUsageApi">
											<tr v-if="hostNic.vlan == null"  @click="toggle(hostNic.bonding)" :class="{ opened: opened.includes(hostNic.bonding) }">
												<td>{{hostNic.name}}</td>
												<td>{{hostNic.macAddress}}</td>
												<td>{{hostNic.dataCurrentRx}}</td>
												<td>{{hostNic.dataCurrentTx}}</td>
												<td>{{hostNic.dataTotalRx}}</td>
												<td>{{hostNic.dataTotalTx}}</td>
												<td></td>
											</tr>
											<template v-if="opened.includes(hostNic.bonding)">
												<tr v-if="bonding.vlan == null" style="background-color: aliceblue"  v-for="bonding of hostNic.bonding" >
														<td>{{bonding.name}}</td>
														<td>{{bonding.macAddress}}</td>
														<td>{{bonding.dataCurrentRx}}</td>
														<td>{{bonding.dataCurrentTx}}</td>
														<td>{{bonding.dataTotalRx}}</td>
														<td>{{bonding.dataTotalTx}}</td>
														<td>{{hostNic.name}}의 슬레이브</td>
												</tr>
											</template>
										</template>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- by gtpark modify host network -->

					<div class="modal fade modifynetworkmodel" tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-lg">
							<div class="modal-content" >
								<div class="modal-header">
									<button type="button" class="close" @click="cancelNicNetwork()">
										<span aria-hidden="true">×</span>
									</button>
									<h4 class="modal-title" id="myModalLabel">호스트 {{host.name}}의 할당된 네트워크 설정</h4>
								</div>
								<div class="modal-body">
									<div role="tabpanel">

										<div class="row">
											<div class="form-group">
												<label class="control-label col-md-4 col-sm4 col-xs-12">할당된 네트워크 선택</label>
												<div class="col-md-8 col-sm-8 col-xs-8 text-right">
													<select class="form-control" v-model="sendNetAttachment.nicNetworkName" @change="checkNicNetwork()" >
														<option value="none">비어있음</option>
														<option v-for="attachment of host.netAttachment" :value="attachment.nicNetworkName">
															{{attachment.nicNetworkName}}</option>
													</select>
												</div>
											</div>
											<hr>
										</div>

										<div v-if="sendNetAttachment.nicNetworkName != 'none'" class="row">
										<!-- Nav tabs -->
											<ul class="nav nav-tabs" role="tablist">
												<li role="presentation" class="active"><a href="#IPv4Tab" aria-controls="IPv4Tab" role="tab" data-toggle="tab">IPv4</a></li>
<%--												<li role="presentation"><a href="#IPv6Tab" aria-controls="IPv6Tab" role="tab" data-toggle="tab">IPv6</a></li>--%>
												<li role="presentation"><a href="#DNSTab" aria-controls="DNSTab" role="tab" data-toggle="tab">DNS설정</a></li>
											</ul>
										</div>
										<!-- Tab panes -->

										<div v-if="sendNetAttachment.nicNetworkName != 'none'" class="row">
											<div class="tab-content">
												<%--											Ipv4에 대한 탭 내용	--%>
												<div role="tabpanel" class="tab-pane active" id="IPv4Tab">
													<div v-if="index == netIdx" v-for="(netAttachment, index) in host.netAttachment">
														<div class="form-group">
															<label class="control-label col-md-4 col-sm-3 col-xs-12">부트 프로토콜</label>
															<div class="radio">
																<div class="col-lg-2 col-sm-2 col-xs-2">
																	<label>
																		<input type="radio" name="pickBootProtocol" v-model="sendNetAttachment.bootProtocol" value="none"> 없음
																	</label>
																	<label>
																		<input type="radio" name="pickBootProtocol" v-model="sendNetAttachment.bootProtocol" value="dhcp"> DHCP
																	</label>
																	<label>
																		<input type="radio" name="pickBootProtocol" v-model="sendNetAttachment.bootProtocol" value="static"> 정적
																	</label>
																</div>
															</div>
														</div>
													<hr>
														<div class="form-group">
															<label class="control-label col-md-4 col-sm4 col-xs-12">IP</label>
															<div class="col-md-8 col-sm-8 col-xs-8">
																<input :disabled="sendNetAttachment.bootProtocol != 'static'" type="text" class="form-control" v-model="sendNetAttachment.nicAddress">

															</div>
														</div>
														<div class="form-group">
															<label class="control-label col-md-4 col-sm4 col-xs-12">넷마스크/라우팅</label>
															<div class="col-md-8 col-sm-8 col-xs-8">
																<input :disabled="sendNetAttachment.bootProtocol != 'static'" type="text" class="form-control" v-model="sendNetAttachment.nicNetmask">

															</div>
														</div>
														<div class="form-group">
															<label class="control-label col-md-4 col-sm4 col-xs-12">게이트웨이</label>
															<div class="col-md-8 col-sm-8 col-xs-8">
																<input :disabled="sendNetAttachment.bootProtocol != 'static'" type="text" class="form-control" v-model="sendNetAttachment.nicGateway">

															</div>
														</div>
													</div>
												</div>

<%--												<div role="tabpanel" class="tab-pane" id="IPv6Tab">IPv6Tab</div>--%>

												<%--										DNS 설정에 대한 탭 내용	--%>
												<div role="tabpanel" class="tab-pane" id="DNSTab">
													<div v-if="attachmentIdx == netIdx" v-for="(netAttachment, attachmentIdx) in host.netAttachment">
														<div class="row">
															<div class="form-group">
																<div  class="checkbox">
																	<div class="col-md-3 col-sm-9 col-xs-12 " >
																		<label>
																			<input type="checkbox"  v-model="checkDns"> DNS 설정
																		</label>
																	</div>
																</div>
															</div>
														</div>
														<div class="row" v-for="(dnsServer, dnsIdx) in sendNetAttachment.dnsServer">
															<label class="control-label col-md-2 col-sm4 col-xs-12">dns 서버</label>
															<div class="col-md-6 col-sm-9 col-xs-12" >
																<input type="text" class="form-control"  :disabled="!checkDns"  v-model="sendNetAttachment.dnsServer[dnsIdx]">
															</div>
															<div class="col-md-4 col-sm-4 col-xs-12 f-right text-right">
																	<button :disabled="sendNetAttachment.dnsServer.length == 2" class="btn btn-default btn-round btn-sm" type="button" @click="addDns(dnsIdx)">+</button>
																	<button class="btn btn-default btn-round btn-sm" type="button" @click="removeDns(dnsIdx)">-</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							<div class="modal-footer">
								<button type="button" :disabled="(sendNetAttachment.bootProtocol == 'static' && (sendNetAttachment.nicAddress == null || sendNetAttachment.nicNetmask == null || sendNetAttachment.nicGateway == null)) || (sendNetAttachment.bootProtocol == 'static' && (sendNetAttachment.nicAddress == '' || sendNetAttachment.nicNetmask == '' || sendNetAttachment.nicGateway == ''))" class="btn btn-primary" @click="modifyNicNetwork()">확인</button>
								<button type="button" class="btn btn-default" @click="cancelNicNetwork()">취소</button>
							</div>
						</div>
					</div>
				</div>


					<!-- by gtpark setup host network -->

					<div class="modal fade setuphostnetworkmodel" tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog modal-lg">
							<div class="modal-content">
								<div class="modal-header">
									<button type="button" class="close" @click="cancelSetupHostNetwork()">
										<span aria-hidden="true">×</span>
									</button>
									<h4 class="modal-title" id="myModalLabel2">호스트 {{host.name}}의 네트워크 설정</h4>
								</div>
								<div class="modal-body">
									<div class="row">

							<%--																	인터페이스 부분--%>
										<div class="col-md-4 col-sm-9 col-xs-12 text-center" >
											<h5>인터페이스</h5>

												<template v-for="hostNic in hostNicsModifyBonding">
												<%--							bonding이 있는 애들 설정--%>
														<div style=" background-color: #eee;margin-bottom: 10px;padding: 10px;"
															 class='drop-zone text-left'

															 v-if="hostNic.bonding && hostNic.vlan == null"

															 @drop='nicOnDrop($event, hostNic)'

														>
															<div class="row">
																<div class="col-md-6 col-sm-9 col-xs-12">
																	<h5><{{hostNic.name}}></h5>
																</div>
																	<div class="col-md-6 col-sm-9 col-xs-12">
																	<button type="button" class="btn-small; btn-dark" @click="breakBonding(hostNic)">본딩 해제</button>
																</div>
															</div>

														<div style="  background-color: #fff;margin-bottom: 10px;padding: 5px;"
															 class='drag-el'

															 v-for="bonding in hostNic.bonding"
															 :key='bonding.id'

															 @dragover.prevent
															 @dragenter.prevent
															 @dragstart='nicStartDrag($event, bonding)'
														>
															<div v-if="bonding.status === 'UP'" >
																<i class="fa fa-arrow-up green"></i>
																{{ bonding.name }}
															<button v-if="hostNic.bonding.length > 2" style="width: 40px; font-size: small" type="button" class="btn btn-default btn-round btn-sm" @click="deleteSlave(bonding.id, hostNic.bonding)">-</button></div>

															<div v-else-if="bonding.status === 'DOWN'" >
																<i class="fa fa-arrow-down red">
																</i> {{ bonding.name }}
																<button v-if="hostNic.bonding.length > 2" style="width: 40px;font-size: small" type="button" class="btn btn-default btn-round btn-sm" @click="deleteSlave(bonding.id, hostNic.bonding)">-</button></div>
														</div>
													</div>

												<%--							bonding이 없는 애들 설정--%>
													<div style=" background-color: #eee;margin-bottom: 10px;padding: 10px;"
														 class='drop-zone text-left'

														 v-if="!hostNic.bonding && hostNic.vlan == null"

														 @drop='nicOnDrop($event, hostNic)'

													>
														<div style="  background-color: #fff;margin-bottom: 10px;padding: 5px;"
															 class='drag-el'

															 :key='hostNic.id'
															 @dragover.prevent
															 @dragenter.prevent
															 draggable
															 @dragstart='nicStartDrag($event, hostNic)'

														>
															<div v-if="hostNic.status === 'UP'" ><i class="fa fa-arrow-up green"></i> {{ hostNic.name }}</div>
															<div v-else-if="hostNic.status === 'DOWN'" ><i class="fa fa-arrow-down red"></i> {{ hostNic.name }}</div>

														</div>
													</div>
											</template>
										</div>

						<%--																할당된 네트워크 부분--%>
										<div style="border-left: 1px solid; border-right: 1px solid;" class="col-md-4 col-sm-9 col-xs-12 text-center" >
											<h5>할당된 네트워크</h5>
											<template v-for="hostNic in hostNicsModifyBonding">
												<%--							네트워크 할당 되어 있는 애들 설정--%>
												<div style=" background-color: #eee;margin-bottom: 10px;padding: 10px;"
													 class='drop-zone text-left'
													 @dragenter.prevent
													 @dragover.prevent
													 @drop='NetOnDrop($event, null, null, hostNic)'
													 v-if="hostNic.baseInterface == null"
												>
													<h5><{{hostNic.name}}></h5>
														<template v-for="(data, index) in usingNetList">

															<div style="  background-color: #fff;margin-bottom: 10px;padding: 5px;"
																 class='drag-el'
<%--																 v-if="hostNic.networkId === data.id"--%>
																	v-if="hostNic.base === data.baseInterface"
																 :key='data.id'
																 draggable
																 @dragover.prevent
																 @dragenter.prevent
																 @dragstart='netStartDrag($event, data, hostNic)'
															>
																{{ data.name }}
																<div v-if="data.vlan !== null">
																	(VLAN :{{(data.vlan)}})
																</div>
															</div>
													</template>
												</div>
											</template>
										</div>

							<%--															미 할당된 네트워크 부분--%>
									<div  class="col-md-4 col-sm-9 col-xs-12 text-center" >
										<h5>미 할당된 네트워크</h5>

												<%--							bonding이 있는 애들 설정--%>
										<div style="background-color: #eee;margin-bottom: 10px;padding: 10px;"

											 class='drop-zone text-left'
											 @drop='NetOnDrop($event, null, null, null)'
										>
													<template v-for="(data, index) in unUsingNetList">
														<div style="  background-color: #fff;margin-bottom: 10px;padding: 5px;"
															 class='drag-el'
															 :key='data.id'
															 draggable
															 @dragover.prevent
															 @dragenter.prevent
															 @dragstart='netStartDrag($event, data, null)'
														>
																{{ data.name }}
															<div v-if="data.vlan !== null">
																(VLAN :{{(data.vlan)}})
															</div>
														</div>
													</template>
												<template v-if="!(unUsingNetList.length > 0)">
													<div style="width: 100px; height: 100px;"
														 @dragover.prevent
														 @dragenter.prevent>
													</div>
												</template>
											</div>
										</div>
									</div>
								</div>

								<div class="modal-footer">
									<button type="button" class="btn btn-dark" @click="resetHostNic()">초기화</button>
									<button type="button" :disabled="usingNetList.length == 0" class="btn btn-primary" @click="SetupHostNetwork()">확인</button>
									<button type="button" class="btn btn-default" @click="cancelSetupHostNetwork()">취소</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<%--										 본딩 새로 만들 때 옵션 모달 창 --%>
				<div class="modal fade makebondingmodal" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" @click="cancelMakeBonding()">
									<span aria-hidden="true">×</span>
								</button>
								<h4 class="modal-title" >새로운 본딩 생성</h4>
							</div>
							<div class="modal-body">
								<div class="row">
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">본딩 이름</label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<input type="text" class="form-control" v-model="makeNicBonding.bondingName">

										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">본딩 모드</label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<select class="form-control" v-model="makeNicBonding.bondingModeName" >
												<option v-for="bondOption of bondOptionList" :value="bondOption.value">mode {{bondOption.mode}}:{{bondOption.value}}</option>
											</select>
										</div>
									</div>

									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">사용자 정의 모드</label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<input type="text" class="form-control" v-model="makeNicBonding.bondingCustomizing" :disabled="makeNicBonding.bondingModeName !== '사용자 정의 모드'"  v-model="makeNicBonding.bondingCustomizing">
										</div>
									</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-primary" @click="checkbonding()">확인</button>
									<button type="button" class="btn btn-default" @click="cancelMakeBonding()">취소</button>
								</div>
							</div>
						</div>
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
								<table id="datatable-buttons" class="table table-striped dataTable no-footer dtr-inline text-center" role="grid" aria-describedby="datatable-buttons_info">
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
				</div>
			</div>
		</div>
        <!-- /page content -->
 
<script src="/js/castanets/compute/host.js" type="text/javascript"></script>

