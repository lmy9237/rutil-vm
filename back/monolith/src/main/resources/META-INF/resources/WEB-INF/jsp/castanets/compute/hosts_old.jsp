<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


        <!-- page content -->
        <div class="right_col" role="main" id="hostsVue">
	       
	       <spinner v-show="spinnerOn"></spinner>
	       
		   <div class="" v-show="!spinnerOn" v-cloak>
            <div class="page-title">
              <div class="title_left">
                <h3>컴퓨팅 <small>&#62; 호스트</small></h3>
              </div>
            </div>
            <div class="clearfix"></div>

            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <div class="row text-right">
                    	<div style="float:left;">
							<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveHosts()">
								<i class="fa fa-refresh"></i>
							</button>
						</div>
                        <div class="btn-group">
                            <button type="button" class="btn btn-success btn-sm" @click="goCreateHost()"><i class="fa fa-file-o"></i> 등록</button>
                            <button type="button" class="btn btn-success btn-sm" @click="goUpdateHost()" :disabled="selectedHosts.length!=1"><i class="fa fa-edit"></i> 편집</button>
                            <button type="button" class="btn btn-success btn-sm" @click="removeHost()" :disabled="!isPosibleDelete()"><i class="fa fa-trash-o"></i> 삭제</button>
                            <button type="button" data-toggle="dropdown" class="btn btn-success dropdown-toggle btn-sm" type="button"><i class="fa fa-gear"></i> 관리 <span class="caret"></span></button>
                            	<ul role="menu" class="dropdown-menu">
	                              <li :class="{disabled : !isPosibleMaintenance()}"><a href="#" @click="!isPosibleMaintenance() ? '' : maintenanceStart()">유지보수</a></li>
	                              <li :class="{disabled : !isPosibleActive()}"><a href="#" @click="!isPosibleActive() ? '' : maintenanceStop()">활성</a></li>
		                          <li><a href="#">전원관리</a></li>
		                          <li :class="{disabled : !isPosibleRestart()}"><a href="#" @click="!isPosibleRestart() ? '' : restartHost()">재시작</a></li>
		                          <li :class="{disabled : !isPosibleStart()}"><a href="#" @click="!isPosibleStart() ? '' : startHost()">시작</a></li>
		                          <li :class="{disabled : !isPosibleStop()}"><a href="#" @click="!isPosibleStop() ? '' : stopHost()">중지</a></li>
		                        </ul>
             	       	 	<button class="btn btn-success btn-sm" @click="goHostConsole()" :disabled="selectedHosts.length!=1"><i class="fa fa-cube"></i> 호스트콘솔</button>
                       </div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
							<th>
								<input type="checkbox" v-model="selectAll">
							</th>
                          <th>상태</th>
                          <th>이름</th>
                          <th>설명</th>
                          <th>IP</th>
                          <th>클러스터</th>
                          <th>가상머신 수</th>
                          <th>CPU</th>
                          <th>메모리</th>
                          <th>네트워크</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="host in hosts" @click="selectHost(host)">
							<td class="a-center">
								<input type="checkbox" class="" :id="host.name" :value="host" v-model="selectedHosts">
							</td>
							
							<td>
								<i v-if="host.status === 'up'" 								class="fa fa-arrow-up green" 			:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'connecting'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'down'" 						class="fa fa-arrow-down red" 			:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'error'" 						class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'initializing'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'install_failed'" 			class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'installing'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'installing_os'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'maintenance'" 				class="fa fa-wrench gray" 				:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'preparing_for_maintenance'" 	class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'non_operational'" 			class="fa fa-ban red" 					:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'non_responsive'" 			class="fa fa-ban red" 					:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'unassigned'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'reboot'" 					class="fa fa-repeat green" 				:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'kdumping'" 					class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else-if="host.status === 'pending_approval'" 			class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(host.status)"></i>
								<i v-else 													class="fa fa-arrow-down red"></i>
								<!-- 전원관리 -->
								<!-- <i v-if="!host.powerManagementEnabled" class="fa fa-bolt red" title="전원관리가 비활성화되어 있습니다."></i> -->
								<!-- HA -->
								<i v-if="host.haConfigured" class="fa fa-star-o green" title="호스트 엔진"></i>
							</td>
							
							<td><a :href="'/compute/host?id=' + host.id">{{host.name}}</a></td>
							<td>{{host.comment}}</td>
							<td>{{host.address}}</td>
							<td>{{host.clusterName}}</td>
							<td>{{host.vmsCnt}}</td>
							<td>{{ (host.hostLastUsage == null ||  host.hostLastUsage == undefined || host.hostLastUsage.cpuUsagePercent == null ) ? '0' : host.hostLastUsage.cpuUsagePercent}}%</td>
							<td>{{ (host.hostLastUsage == null ||  host.hostLastUsage == undefined || host.hostLastUsage.memoryUsagePercent == null ) ? '0' : host.hostLastUsage.memoryUsagePercent}}%</td>
							 <td>{{totalNicsUsage(host.hostNicsLastUsage)}}%</td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
              <div class="clearfix"></div>

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
											<th>대상 가상머신</th>
											<th>목적 호스트</th>
											<th>설명</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(consolidation, index) in consolidations">
											<td>{{index + 1}}</td>
											<td>{{consolidation.vmName}}</td>
											<td>{{consolidation.hostName}}</td>
											<td>{{consolidation.description}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<p v-if="!isNotConsolidateVm">가상머신을 이동하는데 약 {{consolidations.length * 20}}초 이상 소요될 것으로 예상합니다.</p>
						<p v-if="isNotConsolidateVm">
							<b>목적 호스트가 없는 가상머신이 존재합니다.</b> 설명과 같은 사유로 이동 되지 않으며, 해당 가상머신은 정지됩니다.<br>
							그래도 진행하실 경우 확인을 눌러주시기 바랍니다.<br>
							가상머신을 이동 및 정지 하는데 약 {{consolidations.length * 20}}초 이상 소요될 것으로 예상합니다.
						</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="relocateVms()">확인</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
					</div>
				</div>
			</div>
		</div>
	
        </div>
        <!-- /page content -->

<script src="/js/castanets/compute/hosts.js" type="text/javascript"></script>