<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="right_col" role="main" id="dashboard">
	<!-- loading -->
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<!-- top tiles -->
		<div class="col-md-12">
			<p class="text-right"><strong>마지막 업데이트 </strong><i class="glyphicon glyphicon-calendar fa fa-calendar"></i> {{lastUpdated}}</p>
		</div>
		<div class="col-md-12">
			<div class="col-md-8">
				<div class="col-md-12">
					<div class="row tile_count text-center x_panel">
						<div class="col-md-3 col-sm-3 col-xs-3 tile_stats_count">
							<span class="count_top"><a href="/compute/clusters">클러스터</a></span>
							<div class="count">{{dataCenter.clusters}}</div>
						</div>
						<div class="col-md-3 col-sm-3 col-xs-3 tile_stats_count">
							<span class="count_top"><a href="/compute/hosts">호스트</a></span>
							<div class="count"><i class="fa fa-arrow-up green"></i><a href="/compute/hosts?status=up">{{dataCenter.hostsUp}}</a> / <a href="/compute/hosts?status=down">{{dataCenter.hostsDown}}</a><i class="red fa fa-arrow-down"></i></div>
						</div>
						<div class="col-md-3 col-sm-3 col-xs-3 tile_stats_count">
							<span class="count_top"><a href="/storage/domains">데이터 스토리지 도메인</a></span>
							<div class="count"><i class="fa fa-arrow-up green"></i><a href="/storage/domains?status=up&domainType=data">{{dataCenter.storagesActive}}</a> / <a href="/storage/domains?status=unattached&domainType=data">{{dataCenter.storagesUnattached}}</a><i class="red fa fa-arrow-down"></i></div>
						</div>
						<div class="col-md-3 col-sm-3 col-xs-3 tile_stats_count">
							<span class="count_top"><a href="/compute/vms">가상머신</a></span>
							<div class="count"><i class="fa fa-arrow-up green"></i><a href="/compute/vms?status=up">{{dataCenter.vmsUp}}</a> / <a href="/compute/vms?status=down">{{dataCenter.vmsDown}}</a><i class="red fa fa-arrow-down"></i></div>
						</div>
					</div>
				</div>
				<!-- 사용량 -->
				<div class="col-md-12">
					<div class="x_panel">
						<div class="x_title">
							<h2>전체 사용량 <small>CPU / 메모리 / 스토리지</small></h2>
							<div class="clearfix"></div>
						</div>
						<div class="row x_content text-center">
							<div class="col-md-3 col-sm-3 col-xs-3">
							<span class="chart">
								<!-- CPU 유휴 자원으로만 계산 -->
								<span class="percent" v-if="dataCenter.hostsUp > 0">{{(100 - (dataCenter.cpuCurrentIdle / dataCenter.hostsUp)).toFixed(1)}}%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="dataCenter.cpuCurrentIdle / dataCenter.hostsUp"
													:used="100 - (dataCenter.cpuCurrentIdle / dataCenter.hostsUp)"></chart-doughnut>
								</span>
								<span class="percent" v-else>0%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="100" :used="0"></chart-doughnut>
								</span>
							</span>
								<h4>CPU 사용률</h4>
								<h6 v-if="dataCenter.hostsUp > 0">총 100% 중 <i class="green">{{(dataCenter.cpuCurrentIdle / dataCenter.hostsUp).toFixed(1)}}%</i> 사용가능</h6>
								<h6 v-else>총 100% 중 <i class="green">100%</i> 사용가능</h6>
							</div>

							<%-- by gtpark CPU 사용량이 궁금하다고 해서 넣음 						--%>
							<div class="col-md-3 col-sm-3 col-xs-3">
							<span class="chart">
								<span class="percent" v-if="dataCenter.hostsUp > 0">{{(dataCenter.usingcpu / dataCenter.totalcpu *100).toFixed(1)}}%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="100 - (dataCenter.usingcpu / dataCenter.totalcpu *100)"
													:used="dataCenter.usingcpu / dataCenter.totalcpu *100"></chart-doughnut>
								</span>
								<span class="percent" v-else>0%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="100" :used="0"></chart-doughnut>
								</span>
							</span>
								<h4>CPU 할댱량</h4>
								<h6 v-if="dataCenter.hostsUp > 0">총 {{dataCenter.totalcpu}}개의 CPU 중 <i class="green">{{dataCenter.usingcpu}}개 </i> 사용 중</h6>
							</div>

							<div class="col-md-3 col-sm-3 col-xs-3">
							<span class="chart">
								<span class="percent" v-if="dataCenter.memoryTotal !== null">{{(dataCenter.memoryUsed / dataCenter.memoryTotal * 100).toFixed(1)}}%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="dataCenter.memoryFree" :used="dataCenter.memoryUsed"></chart-doughnut>
								</span>
								<span class="percent" v-else>0%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="100" :used="0"></chart-doughnut>
								</span>
							</span>
								<h4>메모리</h4>
								<h6>총 {{getMemoryTotal()}}GB 중 <i class="green">{{getMemoryFree()}}GB</i> 사용가능</h6>
							</div>
							<div class="col-md-3 col-sm-3 col-xs-3">
							<span class="chart">
								<span class="percent" v-if="dataCenter.storageAvaliable !== null && dataCenter.storageUsed !== null">{{(dataCenter.storageUsed / (dataCenter.storageAvaliable + dataCenter.storageUsed) * 100).toFixed(1)}}%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="dataCenter.storageAvaliable" :used="dataCenter.storageUsed"></chart-doughnut>
								</span>
								<span class="percent" v-else>0%
									<chart-doughnut :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="100" :used="0"></chart-doughnut>
								</span>
							</span>
								<h4>스토리지</h4>
								<h6>총 {{getStorageTotal()}}TB 중 <i class="green">{{getStorageFree()}}TB</i> 사용가능</h6>
							</div>
						</div>
					</div>
				</div>
				<!-- //사용량 -->

				<!-- TOP jh add -->
				<div class="col-md-12">
					<div class="col-md-3" style="padding-left: 0px">
						<div class="x_panel topDiv">
							<div class="x_title">
								<h2 style="float:inherit">가상머신 CPU 사용량 TOP3</h2>
								<div class="clearfix"></div>
							</div>
							<div style="overflow: auto;">
								<table class="usageTable" v-for="vm in vms">
									<thead>
										<tr>
											<th style="width: 15%; padding: 10px 10px;">순위</th>
											<th style="width: 60%; padding: 10px 20px;">이름</th>
											<th style="padding: 10px 10px;">사용량</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td style="padding: 10px 10px;">1</td>
											<td style="padding: 10px 10px;">{{vm.vmCpuKey[0]}}</td>
											<td style="padding: 10px 10px;">{{vm.vmCpuVal[0]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">2</td>
											<td style="padding: 10px 10px;">{{vm.vmCpuKey[1]}}</td>
											<td style="padding: 10px 10px;">{{vm.vmCpuVal[1]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">3</td>
											<td style="padding: 10px 10px;">{{vm.vmCpuKey[2]}}</td>
											<td style="padding: 10px 10px;">{{vm.vmCpuVal[2]}}%</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<div class="x_panel topDiv">
							<div class="x_title">
								<h2 style="float:inherit">가상머신 메모리 사용량 TOP3</h2>
								<div class="clearfix"></div>
							</div>
							<div style="overflow: auto;">
								<table class="usageTable" v-for="vm in vms">
									<thead>
										<tr>
											<th style="width: 15%; padding: 10px 10px;">순위</th>
											<th style="width: 60%; padding: 10px 20px;">이름</th>
											<th style="padding: 10px 10px;">사용량</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td style="padding: 10px 10px;">1</td>
											<td style="padding: 10px 10px;">{{vm.vmMemoryKey[0]}}</td>
											<td style="padding: 10px 10px;">{{vm.vmMemoryVal[0]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">2</td>
											<td style="padding: 10px 10px;">{{vm.vmMemoryKey[1]}}</td>
											<td style="padding: 10px 10px;">{{vm.vmMemoryVal[1]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">3</td>
											<td style="padding: 10px 10px;">{{vm.vmMemoryKey[2]}}</td>
											<td style="padding: 10px 10px;">{{vm.vmMemoryVal[2]}}%</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<div class="x_panel topDiv">
							<div class="x_title">
								<h2 style="float:inherit">호스트 CPU 사용량 TOP3</h2>
								<div class="clearfix"></div>
							</div>
							<div style="overflow: auto;">
								<table class="usageTable" v-for="host in hosts">
									<thead>
										<tr>
											<th style="width: 15%; padding: 10px 10px;">순위</th>
											<th style="width: 60%; padding: 10px 20px;">이름</th>
											<th style="padding: 10px 10px;">사용량</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td style="padding: 10px 10px;">1</td>
											<td style="padding: 10px 10px;">{{host.hostCpuKey[0]}}</td>
											<td style="padding: 10px 10px;">{{host.hostCpuVal[0]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">2</td>
											<td style="padding: 10px 10px;">{{host.hostCpuKey[1]}}</td>
											<td style="padding: 10px 10px;">{{host.hostCpuVal[1]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">3</td>
											<td style="padding: 10px 10px;">{{host.hostCpuKey[2]}}</td>
											<td style="padding: 10px 10px;">{{host.hostCpuVal[2]}}%</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="col-md-3" style="padding-right: 0px">
						<div class="x_panel topDiv">
							<div class="x_title">
								<h2 style="float:inherit">호스트 메모리 사용량 TOP3</h2>
								<div class="clearfix"></div>
							</div>
							<div style="overflow: auto;">
								<table class="usageTable" v-for="host in hosts">
									<thead>
										<tr>
											<th style="width: 15%; padding: 10px 10px;">순위</th>
											<th style="width: 60%; padding: 10px 20px;">이름</th>
											<th style="padding: 10px 10px;">사용량</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td style="padding: 10px 10px;">1</td>
											<td style="padding: 10px 10px;">{{host.hostMemoryKey[0]}}</td>
											<td style="padding: 10px 10px;">{{host.hostMemoryVal[0]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">2</td>
											<td style="padding: 10px 10px;">{{host.hostMemoryKey[1]}}</td>
											<td style="padding: 10px 10px;">{{host.hostMemoryVal[1]}}%</td>
										</tr>
										<tr>
											<td style="padding: 10px 10px;">3</td>
											<td style="padding: 10px 10px;">{{host.hostMemoryKey[2]}}</td>
											<td style="padding: 10px 10px;">{{host.hostMemoryVal[2]}}%</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<!-- //TOP -->

				<!-- 사용량 chart -->
				<div class="col-md-12" style="padding-left: 0px; padding-right: 0px">
					<div class="col-md-6" style="padding-left: 0px; padding-right: 0px;">
						<div class="col-md-12 col-sm-8 col-xs-12">
							<div class="x_panel">
								<div class="x_title">
									<h2>CPU 사용률</h2>
									<div class="clearfix"></div>
								</div>
								<div class="x_content2">
									<chart-flot :data="dataCenter.cpuUsage"></chart-flot>
								</div>
							</div>
							<div class="x_panel">
								<div class="x_title">
									<h2>메모리 사용률</h2>
									<div class="clearfix"></div>
								</div>
								<div class="x_content2">
									<chart-flot :data="dataCenter.memoryUsage"></chart-flot>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-6" style="padding-left: 0px; padding-right: 0px;">
						<div class="col-md-12 col-sm-8 col-xs-12">
							<div class="x_panel">
								<div class="x_title">
									<h2>네트워크 사용률</h2>
									<div class="clearfix"></div>
								</div>
								<div class="x_content2">
									<chart-flot-double :data1="dataCenter.receiveRate" :label1="'수신'" :data2="dataCenter.transmitRate" :label2="'송신'"></chart-flot-double>
								</div>
							</div>
							<!-- 스토리지 사용량 -->
							<div class="x_panel">
								<div class="x_title">
									<h2>스토리지 사용률</h2>
									<div class="clearfix"></div>
								</div>
								<div class="x_content2">
									<chart-flot-polyline :data="dataCenter.disks"></chart-flot-polyline>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- //사용량 chart -->
			</div>
			<div class="col-md-4">
				<div class="col-md-12">
					<div class="x_panel" >
						<div class="x_title">
							<h2>알림 <small>오늘({{events.length}})</small></h2>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<div class="dashboard-widget-content">
								<ul class="list-unstyled timeline widget">
									<li v-for="event in events">
										<div class="block">
											<div class="block_content">
												<h2 class="title"><a>{{event.severity}}</a> <small>{{event.id}}</small></h2>
												<div class="byline">
													<span>{{event.time | date}}</span></a>
												</div>
												<p class="excerpt">{{event.description}}</p>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/dashboard/dashboard.js" type="text/javascript"></script>
	