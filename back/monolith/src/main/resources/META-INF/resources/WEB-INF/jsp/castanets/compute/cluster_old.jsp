<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


		<!-- page content -->
		<div class="right_col" role="main" id="clusterVue">

			<spinner v-show="spinnerOn"></spinner>

			<div v-show="!spinnerOn" v-cloak>
				<div class="page-title">
					<div class="title_left">
						<h3>컴퓨팅<small> &#62; <a href="/compute/clusters">클러스터</a> &#62; {{cluster.name}}</small></h3>
					</div>
				</div>
				
				<div class="clearfix"></div>
				
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>{{cluster.name}}</h2>
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
														<td>{{cluster.description}}</td>
													</tr>
													<tr>
														<td>CPU 유형</td>
														<td>{{cluster.cpuType}}</td>
													</tr>
												</tbody>
											</table>
											<!-- Pie charts -->
											<div class="row text-center clname"  v-if="cluster.hostsDetail.length > 0">
												<div class="col-md-6 col-sm-6 col-xs-6">
													<span class="chart">
														<span class="percent">{{chartData.clusterCpuUsagePercent.toFixed(0)}}%
															<chart-doughnut  :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="chartData.clusterCpuIdleUsagePercent" :used="100- chartData.clusterCpuIdleUsagePercent"></chart-doughnut>
														</span>
													</span>
													<h4>CPU</h4>
													<h6>총 100% 중 <i class="green">{{ chartData.clusterCpuIdleUsagePercent }}%</i> 사용가능</h6>
												</div>
												<div class="col-md-6 col-sm-6 col-xs-6">
													<span class="chart"> 
														<span class="percent">{{(chartData.clusterMemoryUsed / chartData.clusterMemoryTotal * 100).toFixed(0)}}%
															<chart-doughnut  :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="chartData.clusterMemoryFree" :used="chartData.clusterMemoryUsed"></chart-doughnut>
														</span>
													</span>
													<h4>메모리</h4>
													<h6>총 {{ (chartData.clusterMemoryTotal / Math.pow(1024, 3)).toFixed(1) }}GB 중 <i class="green">{{ (chartData.clusterMemoryFree / Math.pow(1024, 3)).toFixed(1) }}GB</i> 사용가능</h6>
												</div>
												<div class="clearfix"></div>
											</div>
											<div class="row text-center clname" v-if="cluster.hostsDetail.length == 0">
												<div class="col-md-12 col-sm-12 col-xs-12">
													호스트가 존재하지 않아 데이터가 없습니다.
												</div>
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
					<!-- 호스트 -->
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>호스트</h2>
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
											<th>가상머신 수</th>
											<th>CPU</th>
											<th>메모리</th>
											<th>네트워크</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="hostDetail in cluster.hostsDetail">
											<td>
												<i v-if="hostDetail.status === 'up'" 								class="fa fa-arrow-up green" 			:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'connecting'" 					class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'down'" 						class="fa fa-arrow-down red" 			:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'error'" 						class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'initializing'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'install_failed'" 				class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'installing'" 					class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'installing_os'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'maintenance'" 					class="fa fa-wrench gray" 				:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'preparing_for_maintenance'" 	class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'non_operational'" 				class="fa fa-ban red" 					:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'non_responsive'" 				class="fa fa-ban red" 					:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'unassigned'" 					class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'reboot'" 						class="fa fa-repeat green" 				:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'kdumping'" 					class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else-if="hostDetail.status === 'pending_approval'" 			class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
												<i v-else 															class="fa fa-arrow-down red"></i>
											</td>
											<td><a :href="'/compute/host?id=' + hostDetail.id">{{hostDetail.name}}</a></td>
											<td>{{hostDetail.description}}</td>
											<td>{{hostDetail.address}}</td>
											<td>{{hostDetail.vmsCnt}}</td>
											<!-- <td>{{100 - hostDetail.idleCpuUsagePercent}}%</td> -->
											<td>{{hostDetail.hostLastUsage.cpuUsagePercent}}%</td>
											<td>{{hostDetail.hostLastUsage.memoryUsagePercent}}%</td>
											<td>{{getTotalNicsUsage(hostDetail.hostNicsLastUsage)}}%</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
	
					<!-- 가상머신 -->	
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
										<tr v-for="vmSummary in cluster.vmSummaries">
										
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
											
											<td><a :href="'/compute/vm?id=' + vmSummary.id">{{vmSummary.name}}</a></td>
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
					
					<!-- 관리 네트워크 -->
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>관리 네트워크</h2>
								<div class="clearfix"></div>
							</div>
							<div class="x_content">
								<table class="table table-striped text-center">
									<thead>
										<tr>
											<th>이름</th>
											<th>설명</th>
											<th>ID</th>
										</tr>
									</thead>
									<tbody>
										<tr v-if="cluster.network !== null">
											<td><a :href="'/networks/network?id=' + cluster.network.id">{{cluster.network.name}}</a></td>
											<td>{{cluster.network.description}}</td>
											<td>{{cluster.network.id}}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="clearfix"></div>
						</div>          
					</div>
					
					
				</div>
			</div>
		</div>
        <!-- /page content -->
        
<script src="/js/castanets/compute/cluster.js" type="text/javascript"></script>

