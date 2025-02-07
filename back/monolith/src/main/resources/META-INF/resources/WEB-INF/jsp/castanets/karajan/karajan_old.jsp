<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="karajan">
	<!-- loading -->
	<spinner v-show="spinnerOn"></spinner>

	<div v-show="!spinnerOn" v-cloak>
		<div class="title row">
			<div class="col-md-7 col-sm-7 col-xs-12 form-group top_search">
				<div class="col-md-1 col-sm-1 col-xs-1">
					<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveDataCenterStatus()">
						<i class="fa fa-refresh"></i>
					</button>
				</div>
 				<div class="input-group col-md-5 col-sm-5 col-xs-12">
					<input type="text" class="form-control" placeholder="가상머신 이름으로 검색" v-model="search" :maxlength="this.$maxName">
 					<span class="input-group-btn">
						<button class="btn btn-default" type="button">검색</button>
					</span>
				</div>
				<div class=" col-md-6 col-sm-6 col-xs-12">
					<button class="btn-sm bg-gray" style="cursor:default">20</button>
					<button class="btn-sm bg-green" style="cursor:default">40</button>
					<button class="btn-sm bg-blue" style="cursor:default">60</button>
					<button class="btn-sm bg-orange" style="cursor:default">80</button>
					<button class="btn-sm bg-red" style="cursor:default">100</button>
				</div>
			</div>
			<div class="form-group col-md-5 col-sm-5 col-xs-12">
				<label class="control-label col-md-2 col-sm-2 col-xs-2">클러스터</label>
				<div class="col-md-7 col-sm-7 col-xs-7">
					<select class="form-control" v-model="selectedClusterId">
						<option v-for="cluster in karajan.clusters" v-bind:value="cluster.id">{{cluster.name}}</option>
					</select>
				</div>
				<button type="submit" class="btn btn-success col-md-2 col-sm-2 col-xs-2" v-on:click="consolidateVms(selectedCluster.id)">재배치</button>
			</div>
		</div>
		<div class="row" v-for="(host, hostIndex) in selectedCluster.hosts" v-show="selectedCluster.hosts.length > 0">
			<!-- panel_box css 삭제 -->
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>
							<i :class="[setHostIcon(host.status)]" :title="getHostStatusToKor(host.status)"></i> <a :href="'/compute/host?id=' + host.id">{{host.name}}</a>
							<small>CPU <i class="green">{{(host.cpuCurrentUser + host.cpuCurrentSystem).toFixed(0)}}%</i>,
								메모리 <i class="green" v-if="host.memoryTotal > 0">{{(host.memoryUsed / host.memoryTotal * 100).toFixed(0)}}%</i><i class="green" v-else>0%</i>,
								가상머신 <i class="green">{{host.vms.length}}대 </i></small>
						</h2>
						<ul class="nav navbar-right panel_toolbox">
							<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
							</li>
						</ul>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="row">
							<div class="panel_padding col-md-3 col-sm-3 col-xs-6">
								<div class="x_panel3">
									<div class="col-md-12 gauge_box x_content">
 										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 9)]"></div>
 										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 9)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 8)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 8)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 7)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 7)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 6)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 6)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 5)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 5)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 4)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 4)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 3)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 3)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 2)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 2)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 1)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 1)]"></div>
										<div :class="[setProgressBarColor(host.cpuCurrentUser + host.cpuCurrentSystem, 0)]"></div>
										<div :class="[setProgressBarColor(host.memoryUsed / host.memoryTotal * 100, 0)]"></div>
										<div class="col-md-6 gauge">CPU</div>
										<div class="col-md-6 gauge">메모리</div>
										<div class="clearfix"></div>
									</div>
								</div>
							</div>
							<!-- virtual machine -->
							<div class="panel_padding col-md-3 col-sm-3 col-xs-6" v-for="(vm, vmIndex) in filteredVms(host.vms)">
								<div class="x_panel2 x_appbox">
									<div class="x_content dropdown" v-on:click="showMenu(vm.name, vm.status)">
										<h5 class="dropbtn">
											<i :class="[setVmIcon(vm.status, vm.placementPolicy)]" :title="getVmStatusToKor(vm.status)"></i> {{vm.name | truncate(18)}}
										</h5>
										<div :class="[setAppboxBgColor(vm.cpuCurrentTotal / (vm.cores * vm.sockets * vm.threads))]">
											CPU<br> {{(vm.cpuCurrentTotal / (vm.cores * vm.sockets * vm.threads)).toFixed(0)}}%
										</div>
										<div :class="[setAppboxBgColor(vm.memoryUsed / vm.memoryInstalled * 100)]">
											메모리<br>{{(vm.memoryUsed / vm.memoryInstalled *	100).toFixed(0)}}%
										</div>
									</div>
									<div :id="vm.name" class="dropdown-content text-left" v-if="vm.status == 'up' && vm.placementPolicy =='migratable'">
										<a href="#"><i class="fa fa-send"></i>&nbsp;가상머신 이동</a>
										<a href="#" v-for="otherHost in selectedCluster.hosts" v-if="host.id != otherHost.id && otherHost.status == 'up'"
											v-on:click="migrateVm(otherHost.name, vm.name, otherHost.id, vm.id, hostIndex, vmIndex)">{{otherHost.name}}</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row" v-show="selectedCluster.hosts == ''">
			<div class="panel_box col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_content text-center">
						<h1 class="icon-main text-primary m-b-25">
							<i class="fa fa-power-off"></i>
						</h1>
						<h4 class="home-text text-uppercase">등록된 호스트가 없습니다</h4>
						<h6 class="mt-3">
							<a href="/compute/createHost">호스트 등록하러 가기</a>
						</h6>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- modal karayan consolidation -->
	<div class="modal fade consolidateModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">가상머신 재배치(심포니 추천)</h4>
				</div>
				<div class="modal-body">
					<div class="x_panel">
						<div class="x_content">
							<table class="table table-striped text-center">
								<thead>
									<tr>
										<th>순서</th>
										<th>대상 호스트</th>
										<th>대상 가상머신</th>
										<th>목적 호스트</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(consolidation, index) in consolidations">
										<td>{{index + 1}}</td>
										<td>{{consolidation.fromHostName}}</td>
										<td>{{consolidation.vmName}}</td>
										<td>{{consolidation.hostName}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<p>가상머신은 순서대로 이동됩니다.</p>
					<p v-if="systemProperties.symphonyPowerControll === true">심포니 호스트 전원관리가 활성화 되어 있습니다. 가상머신이 없는 호스트는 전원 관리됩니다.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="relocateVms()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/karajan/karajan.js" type="text/javascript"></script>