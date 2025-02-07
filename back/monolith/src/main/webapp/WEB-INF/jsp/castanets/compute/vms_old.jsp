<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="vms">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>
					컴퓨팅 <small>&#62; 가상머신</small>
				</h3>
			</div>
		</div>
		<div class="clearfix"></div>
		
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="row text-right">
							<div style="float:left;">
								<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveVms()">
									<i class="fa fa-refresh"></i>
								</button>
							</div>
							<div class="btn-group">
								<button type="button" class="btn btn-success btn-sm" v-on:click="createVm()">
									<i class="fa fa-file-o"></i> 등록
								</button>
								<button type="button" class="btn btn-success btn-sm" :disabled="selectedVms.length == 0" v-on:click="updateVm()">
									<i class="fa fa-edit"></i> 편집
								</button>
								<button type="button" class="btn btn-success btn-sm" :disabled="downVms.length == 0" data-toggle="modal" data-target=".removevmmodal">
									<i class="fa fa-trash-o"></i> 삭제
								</button>
							</div>
							<div class="btn-group">
								<button type="button" class="btn btn-primary btn-sm" :disabled="downVms.length == 0 && pausedVms.length == 0" v-on:click="startVm()">
									<i class="fa fa-play"></i> 실행
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedVms.length == 0 || upVms.length == 0" v-on:click="suspendVm()">
									<i class="fa fa-pause"></i> 일시정지
								</button>
<%--								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedVms.length == 0 || (upVms.length == 0 && pausedVms.length == 0) || (upVms.length == 0 && pausedVms.length == 0 && not_respondedVms.length == 0)" v-on:click="stopVm()">--%>
<%--									<i class="fa fa-stop"></i> 종료--%>
<%--								</button>--%>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedVms.length == 0 || (upVms.length == 0 && pausedVms.length == 0 && not_respondedVms.length == 0 ) " v-on:click="stopVm()">
									<i class="fa fa-stop"></i> 종료
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedVms.length == 0 || upVms.length == 0" v-on:click="rebootVm()">
									<i class="fa fa-step-backward"></i> 재부팅
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedVms.length == 0 || upVms.length == 0" v-on:click="console()">
									<i class="fa fa-tasks"></i> 콘솔
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="downVms.length != 1 || selectedVms.length > 1" @click="retrieveTemplateDisks()"
									data-toggle="modal" data-target=".createtemplatemodal">
									<i class="fa fa-suitcase"></i> 템플릿 생성
								</button>
								<!-- <button type="button" class="btn btn-primary btn-sm" @click="createVmWithTemplate()">
									<i class="fa fa-suitcase"></i> 템플릿 기반 가상머신 생성
								</button> -->
								<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target=".createvmwithtemplatemodal">
									<i class="fa fa-suitcase"></i> 템플릿 기반 가상머신 생성
								</button>
								<%-- migration 기능 추가 jh 20200702 --%>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedVms.length != 1 || upVms.length != 1" data-toggle="modal" data-target=".hostModal">
									<i class="fa fa-send"></i> 가상머신 이동
								</button>
								<button type="button" class="btn btn-primary btn-sm" :disabled="selectedVms.length != 1 || upVms.length != 1" @click="changeDiscView()">
									<i class="fa fa-eject"></i> CD 변경
								</button>
								<button type="button" class="btn btn-primary btn-sm" v-if="metricsUri != ''" :disabled="selectedVms.length == 0 || upVms.length == 0" v-on:click="metric()">
									<i class="fa fa-tasks"></i> 메트릭
								</button>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center jambo_table bulk_action">
							<thead>
								<tr>
									<th>
										<input type="checkbox" v-model="selectAll">
									</th>
<%--									<th>상태</th>--%>
<%--									<th>이름</th>--%>
<%--									<th>설명</th>--%>
<%--									<th>용도</th>--%>
<%--									<th>IP</th>--%>
<%--									<th>호스트명</th>--%>
<%--									<th>클러스터</th>--%>
<%--									<th>CPU</th>--%>
<%--									<th>메모리</th>--%>
<%--									<th>네트워크</th>--%>
<%--									<th>그래픽</th>--%>
<%--									<th>가동시간</th>--%>

<%--									by gtpark 한눈에 보기 어렵다 해서 좀 더 세부사항들을 추가 함.--%>
									<th>상태</th>
									<th>이름</th>
									<th>설명</th>
									<th>용도</th>
									<th>IP</th>
									<th>호스트명</th>
									<th>CPU 사용률</th>
									<th>CPU 할당량</th>
									<th>메모리 사용률</th>
									<th>메모리 할당량</th>
									<th>네트워크</th>
									<th>가동시간</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="vms.length === 0">
									<td colspan="12">생성된 가상머신이 없습니다.</td>
								</tr>
<%--								<tr v-if="vms.length > 0" v-for="vm in vms" @click="selectVm(vm)">--%>
<%--									<td class="a-center">--%>
<%--										<input type="checkbox" :id="vm.id" :value="vm" v-model="selectedVms">--%>
<%--									</td>--%>
<%--									<td v-if="vm.status === 'up'" ><i class="fa fa-arrow-up green" :title="getVmStatusToKor(vm.status)"></i>--%>
<%--									<i class="fa fa-exclamation-triangle" :title="getVmStatusToKor('newConfig')" v-if="vm.nextRunConfigurationExists"></i></td>--%>
<%--									<td v-else-if="vm.status === 'wait_for_launch'"><i class="fa fa-arrow-up blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'powering_up'"><i class="fa fa-arrow-up blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'powering_down'"><i class="fa fa-arrow-down blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'down'"><i class="fa fa-arrow-down red" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'migrating'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'suspended'"><i class="fa fa-moon-o blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'saving_state'"><i class="fa fa-floppy-o blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'reboot_in_progress'"><i class="fa fa-repeat green" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'image_locked'"><i class="fa fa-lock blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'not_responding'"><i class="fa fa-question black" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'paused'"><i class="fa fa-pause red" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else><i class="fa fa-arrow-down red"></i></td>--%>
<%--									<td><a :href="'/compute/vm?id=' + vm.id">{{vm.name}}</a></td>--%>
<%--									<td :title="vm.comment">{{vm.comment | truncate(20)}}</td>--%>
<%--									<td :title="vm.use">{{changeUseName(vm.use)}}</td>--%>
<%--									<td :title="vm.ipAddress">{{vm.ipAddress | truncate(15)}}</td>--%>
<%--									<td><a :href="'/compute/host?id=' + vm.hostId">{{vm.host}}</a></td>--%>
<%--									<td><a :href="'/compute/cluster?id=' + vm.clusterId">{{vm.cluster | truncate(20)}}</a></td>--%>
<%--									<td>{{vm.cpuUsage == null ? 0 : (vm.cpuUsage.length == 0 ? 0 : vm.cpuUsage[0][1])}}%</td>--%>
<%--									<td>{{vm.memoryUsage == null ? 0 : (vm.memoryUsage.length == 0 ? 0 : vm.memoryUsage[0][1])}}%</td>--%>
<%--									<td>{{vm.networkUsage == null ? 0 : (vm.networkUsage.length == 0 ? 0 : vm.networkUsage[0][1])}}%</td>--%>
<%--									<td>{{vm.graphicProtocol}}</td>--%>
<%--									<td>{{changeUptime(vm.startTime)}}</td>--%>
<%--								</tr>--%>

								<%--by gtpark 가상머신 상태가 구별이 잘 안 간다고 해서 상태 아이콘들을 조금 편집 함--%>
								<tr v-if="vms.length > 0" v-for="vm in vms" @click="selectVm(vm)">
									<td class="a-center">
										<input type="checkbox" :id="vm.id" :value="vm" v-model="selectedVms">
									</td>
<%--									<td v-if="vm.status === 'up'" ><i class="fa fa-arrow-up green" :title="getVmStatusToKor(vm.status)"></i>--%>
<%--										<i class="fa fa-exclamation-triangle" :title="getVmStatusToKor('newConfig')" v-if="vm.nextRunConfigurationExists"></i></td>--%>
<%--									<td v-else-if="vm.status === 'wait_for_launch'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'powering_up'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'powering_down'"><i class="fa fa-spinner fa-spin red" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'down'"><i class="fa fa-arrow-down red" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'migrating'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'suspended'"><i class="fa fa-moon-o blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'saving_state'"><i class="fa fa-floppy-o blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'reboot_in_progress'"><i class="fa fa-repeat green" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'image_locked'"><i class="fa fa-lock blue" :title="getVmStatusToKor(vm.status)"></i>--%>
<%--										<i class="fa fa-spinner fa-spin blue" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'not_responding'"><i class="fa fa-question black" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else-if="vm.status === 'paused'"><i class="fa fa-pause red" :title="getVmStatusToKor(vm.status)"></i></td>--%>
<%--									<td v-else><i class="fa fa-arrow-down red"></i></td>--%>
<%--									<td><a :href="'/compute/vm?id=' + vm.id">{{vm.name}}</a></td>--%>
<%--									<td :title="vm.comment">{{vm.comment | truncate(20)}}</td>--%>
<%--									<td :title="vm.use">{{changeUseName(vm.use)}}</td>--%>
<%--									<td :title="vm.ipAddress">{{vm.ipAddress | truncate(15)}}</td>--%>
<%--									<td><a :href="'/compute/host?id=' + vm.hostId">{{vm.host}}</a></td>--%>
<%--									<td><a :href="'/compute/cluster?id=' + vm.clusterId">{{vm.cluster | truncate(20)}}</a></td>--%>
<%--									<td>{{vm.cpuUsage == null ? 0 : (vm.cpuUsage.length == 0 ? 0 : vm.cpuUsage[0][1])}}%</td>--%>
<%--									<td>{{vm.memoryUsage == null ? 0 : (vm.memoryUsage.length == 0 ? 0 : vm.memoryUsage[0][1])}}%</td>--%>
<%--									<td>{{vm.networkUsage == null ? 0 : (vm.networkUsage.length == 0 ? 0 : vm.networkUsage[0][1])}}%</td>--%>
<%--									<td>{{vm.graphicProtocol}}</td>--%>
<%--									<td>{{changeUptime(vm.startTime)}}</td>--%>
                                    <td v-if="vm.status === 'up'" ><i class="fa fa-arrow-up green" :title="getVmStatusToKor(vm.status)"></i>
                                        <i class="fa fa-exclamation-triangle" :title="getVmStatusToKor('newConfig')" v-if="vm.nextRunConfigurationExists"></i></td>
                                    <td v-else-if="vm.status === 'wait_for_launch'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'powering_up'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'powering_down'"><i class="fa fa-spinner fa-spin red" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'down'"><i class="fa fa-arrow-down red" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'migrating'"><i class="fa fa-spinner fa-spin green" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'suspended'"><i class="fa fa-moon-o blue" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'saving_state'"><i class="fa fa-floppy-o blue" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'reboot_in_progress'"><i class="fa fa-repeat green" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'image_locked'"><i class="fa fa-lock blue" :title="getVmStatusToKor(vm.status)"></i>
                                        <i class="fa fa-spinner fa-spin blue" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'not_responding'"><i class="fa fa-question black" :title="getVmStatusToKor(vm.status)"></i></td>
									<td v-else-if="vm.status === 'unknown'"><i class="fa fa-question black" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else-if="vm.status === 'paused'"><i class="fa fa-pause red" :title="getVmStatusToKor(vm.status)"></i></td>
                                    <td v-else><i class="fa fa-arrow-down red"></i></td>
                                    <td><a :href="'/compute/vm?id=' + vm.id">{{vm.name}}</a></td>
                                    <td :title="vm.comment">{{vm.comment | truncate(20)}}</td>
                                    <td :title="vm.use">{{changeUseName(vm.use)}}</td>
                                    <td :title="vm.ipAddress">{{vm.ipAddress | truncate(15)}}</td>
                                    <td><a :href="'/compute/host?id=' + vm.hostId">{{vm.host}}</a></td>
                                    <td>{{vm.cpuUsage == null ? 0 : (vm.cpuUsage.length == 0 ? 0 : vm.cpuUsage[0][1])}}%</td>
									<td>{{(vm.vmSystem != null && vm.vmSystem.totalVirtualCpus != null) ? vm.vmSystem.totalVirtualCpus : 0}}</td>
                                    <td>{{vm.memoryUsage == null ? 0 : (vm.memoryUsage.length == 0 ? 0 : vm.memoryUsage[0][1])}}%</td>
									<td>{{(vm.vmSystem != null && vm.vmSystem.definedMemory) ? vm.vmSystem.definedMemory : 0}}</td>
                                    <td>{{vm.networkUsage == null ? 0 : (vm.networkUsage.length == 0 ? 0 : vm.networkUsage[0][1])}}%</td>

                                    <td>{{changeUptime(vm.startTime)}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
	</div>
	
	<!-- vm remove modal -->
	<div class="modal fade removevmmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">가상머신 삭제</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-12 col-sm-12 col-xs-12">
								다음 항목을 삭제하시겠습니까?
							</label>
						</div>
						<div class="form-group" v-for="vm in selectedVms" v-if="vm.status == 'down'">
							<label class="control-label col-md-3 col-sm-3 col-xs-12" style="margin-top:10px">
								- {{vm.name}}
							</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<div class="checkbox" style="text-align:right">
									<label> <input type="checkbox" v-model="vm.diskDetach" :disabled="vm.diskSize < 1">디스크 삭제</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="removeVm()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- template create modal -->
	<div class="modal fade createtemplatemodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">새 템플릿</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" v-model="newTemplate.name" :disabled="isSubTemplate" @input="checkTemplateName" placeholder="이름" :maxlength="this.$maxName" required>
								<p class="text-danger" v-if="(templateNameStatus || validTemplateName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" v-model="newTemplate.description" placeholder="설명" :maxlength="this.$maxDescription">
							</div>
						</div>

<%--						<div class="form-group">--%>
<%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">클러스터</label>--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
<%--								<select class="form-control" v-model="newTemplate.clusterId">--%>
<%--									<option v-for="clustername of templateDisks.quotas"	:value="clustername.id">{{clustername.name}}</option>--%>
<%--								</select>--%>
<%--							</div>--%>
<%--						</div>--%>

<%--by gtpark						--%>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">클러스터</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control" v-model="newTemplate.clusterId">
									<option v-for="cluster of createTemplateCluster" :value="cluster.clusterId">{{cluster.cluster}}</option>
								</select>
							</div>
						</div>

<%--						<div class="form-group">--%>
<%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">클러스터</label>--%>
<%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
<%--								<select class="form-control" v-model="newTemplate.clusterId">--%>
<%--									<option v-for="cluster in clusters"	:value="cluster.id">{{cluster.name}}</option>--%>
<%--								</select>--%>
<%--							</div>--%>
<%--						</div>--%>
						<!-- <div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">CPU 프로파일</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control" v-model="newTemplate.cpuProfileId">
									<option v-for="cpuProfile in cpuProfiles" :value="cpuProfile.id">{{cpuProfile.name}}</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">쿼터</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control" v-model="newTemplate.quotaId">
									<option v-for="quota in quotas" :value="quota.id">{{quota.name}}</option>
								</select>
							</div>
						</div> -->
						<div class="form-group">
							<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
								<div class="checkbox">
									<label> <input type="checkbox" v-model="isSubTemplate">서브 템플릿 버전으로 생성</label>
								</div>
							</div>
						</div>
						<div class="form-group" v-if="isSubTemplate">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">Root 템플릿</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<select class="form-control" v-model="rootTemplate">
									<option v-for="rootTemplate in rootTemplates" :value="rootTemplate">{{rootTemplate.name}} | {{rootTemplate.description}}</option>
								</select>
							</div>
						</div>
						<div class="form-group"  v-if="isSubTemplate">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">하위 버전 이름</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" v-model="newTemplate.subVersionName" @input="checkSubTemplateName" :maxlength="this.$maxName">
								<p class="text-danger" v-if="(subTemplateNameStatus || validSubTemplateName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">디스크 할당</label>
							<div class="x_content">
								<table class="table table-striped text-center">
									<thead>
										<tr>
											<th>별칭</th>
											<th>가상크기</th>
											<th>포맷</th>
											<th>대상</th>
											<th>디스크 프로파일</th>
											<!-- <th>쿼터</th> -->
										</tr>
									</thead>
									<tbody>
										<tr v-for="(templateDisk, index) in templateDisks">
											<td>
												<input type="text" class="form-control" v-model="templateDisk.name">
											</td>
											<td>
												{{templateDisk.virtualSize}}
											</td>
											<td>
												<select class="form-control" v-model="templateDisk.format">
													<option value="cow">QCOW2</option>
													<option value="raw">Raw</option>
												</select>
											</td>
											<td>
												<select class="form-control" v-model="templateDisk.storageDomainId">
													<option v-for="storageDomain in templateDisk.storageDomains" :value="storageDomain.id">{{storageDomain.name}}</option>
												</select>
											</td>
											<td>
												<select class="form-control" v-model="templateDisk.diskProfileId">
													<option v-for="diskProfile in templateDisk.diskProfiles" :value="diskProfile.id">{{diskProfile.name}}</option>
												</select>
											</td>
											<!-- <td>
												<select class="form-control" v-model="templateDisk.quotaId">
													<option v-for="quota in templateDisk.quotas" :value="quota.id">{{quota.name}}</option>
												</select>
											</td> -->
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
								<div class="checkbox">
									<label> <input type="checkbox" v-model="newTemplate.allUserAccess">모든 사용자에게 이 템플릿 접근을 허용</label>
								</div>
								<div class="checkbox">
									<label> <input type="checkbox" v-model="newTemplate.clonePermissions">가상 머신 권한 복사</label>
								</div>
								<div class="checkbox">
									<label> <input type="checkbox" v-model="newTemplate.seal">템플릿 봉인 (Linux만 해당)</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="createTemplate()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- vm create with template modal -->
	<div class="modal fade createvmwithtemplatemodal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" @click="cancelCreateVmWithTemplate()">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">새 가상머신</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12">
							<div class="card-box">
								<ul class="nav nav-pills navtab-bg nav-justified">
									<li :class="templateListTitleClass" id="templateListTitle">
										<a aria-expanded="false" class="nav-link"> 템플릿 이미지 선택 </a>
									</li>
									<li :class="instanceTypeListTitleClass" id="instanceTypeListTitle">
										<a aria-expanded="false" class="nav-link"> 인스턴스 사이즈 선택 </a>
									</li>
									<li :class="createVmInfoTitleClass" id="createVmInfoTitle">
										<a aria-expanded="false" class="nav-link"> 추가정보 입력 </a>
									</li>
								</ul>
								<div class="tab-content">
									<div :class="templateListClass" id="templateList">
										<br>
										<div class="card-box">
											<table class="table table-striped text-center jambo_table bulk_action">
												<thead>
													<tr>
														<th></th>
														<th>이름</th>
														<th>설명</th>
														<th>OS</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="template in templates" @click="selectTemplate(template)">
														<td class="a-center">
															<input type="checkbox" :id="template.id" :value="template" v-model="selectedTemplates">
														</td>
														<td>{{template.name}}</td>
														<td>{{template.description}}</td>
														<td>{{template.os}}</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div class="modal-footer" style="text-align:center;">
											<button type="button" class="btn btn-default" @click="cancelCreateVmWithTemplate()">취소</button>
											<button type="button" class="btn btn-primary" :disabled="selectedTemplates.length == 0" @click="modalNext('instanceTypeListTitle')">다음</button>
										</div>
									</div>
									<div :class="instanceTypeListClass" id="instanceTypeList">
										<br>
										<div class="card-box">
											<div class="card-box">
												<table class="table table-striped text-center jambo_table bulk_action">
													<thead>
														<tr>
															<th></th>
															<th>이름</th>
															<th>설명</th>
															<th>CPU</th>
															<th>메모리</th>
														</tr>
													</thead>
													<tbody>
														<tr v-for="instanceType in instanceTypes" @click="selectInstanceType(instanceType)">
															<td class="a-center">
																<input type="checkbox" :id="instanceType.id" :value="instanceType" v-model="selectedInstanceTypes">
															</td>
															<td>{{instanceType.name}}</td>
															<td>{{instanceType.description}}</td>
															<td>{{instanceType.virtualSockets * instanceType.coresPerVirtualSocket * instanceType.threadsPerCore}} Cores</td>
															<td>{{instanceType.memory/1024/1024/1024}} GB</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
										<div class="modal-footer" style="text-align:center;">
											<button type="button" class="btn btn-default" @click="modalPrevious('templateListTitle')">이전</button>
											<button type="button" class="btn btn-primary" :disabled="selectedInstanceTypes.length == 0" @click="modalNext('createVmInfoTitle')">다음</button>
										</div>
									</div>
									<div :class="createVmInfoClass" id="createVmInfo">
										<br>
<%--										by gtpark--%>
										<div class="x_panel">
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">클러스터</label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<select class="form-control" v-model="newVmWithTemplate.cluster">
														<option v-for="cluster of selectedTemplatesCluster" :value="cluster.id">{{cluster.name}}</option>
													</select>
												</div>
											</div>
<%--											<div class="form-group">--%>
<%--												<label class="control-label col-md-4 col-sm-4 col-xs-4">클러스터</label>--%>
<%--												<div class="col-md-8 col-sm-8 col-xs-8">--%>
<%--													<select class="form-control" v-model="newVmWithTemplate.cluster">--%>
<%--														<option v-for="cluster in clusters" :value="cluster.id">{{cluster.name}}</option>--%>
<%--													</select>--%>
<%--												</div>--%>
<%--											</div>--%>
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">가상머신 이름<span class="text-danger">*</span></label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<input type="text" class="form-control" placeholder="이름" @input="checkVmName" v-model="newVmWithTemplate.name" :maxlength="this.$maxName" required>
													<p class="text-danger" v-if="(vmNameStatus || validVmName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">호스트명</label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<input type="text" class="form-control" placeholder="호스트명" v-model="newVmWithTemplate.hostName">
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">Root 패스워드</label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<input type="password" class="form-control" placeholder="패스워드" v-model="newVmWithTemplate.password">
												</div>
											</div>
										</div>
										
										<div class="row text-right">
											<button type="button" class="btn btn-success btn-sm" v-on:click="addNic()">
												<i class="fa fa-plug"></i> vNIC 추가
											</button>
										</div>
										
										<div class="x_panel" v-for="(nic, index) in nics">
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">IP 주소</label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<input type="text" class="form-control" placeholder="ip 주소" v-model="nic.ipAddress">
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">서브넷 마스크</label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<input type="text" class="form-control" placeholder="서브넷 마스크" v-model="nic.netmask">
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">게이트웨이</label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<input type="text" class="form-control" placeholder="게이트웨이" v-model="nic.gateway">
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-md-4 col-sm-4 col-xs-4">DNS</label>
												<div class="col-md-8 col-sm-8 col-xs-8">
													<input type="text" class="form-control" placeholder="dns" v-model="nic.dns">
												</div>
											</div>
										</div>
										<div class="modal-footer" style="text-align:center;">
											<button type="button" class="btn btn-default" @click="modalPrevious('instanceTypeListTitle')">이전</button>
											<button type="button" class="btn btn-primary" :disabled="newVmWithTemplate.name == null" @click="createVmWithTemplateDone()">확인</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>
	
	<!-- change cd modal -->
	<div class="modal fade changediscmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">CD 변경</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<div class="col-md-12 col-sm-12 col-xs-12">
								<select class="form-control" v-model="targetDisc">
									<option value="eject">[꺼내기]</option>>
									<option v-for="disc in discs" :value="disc.id">{{disc.name}} - {{disc.type}}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="changeDisc()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>

	<%-- active상태인 hostList display modal jh --%>
	<div class="modal fade hostModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title">Host List</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<div class="col-md-2 col-sm-6 col-xs-6">
								<label style="font-size: 16px;">Host 선택</label>
							</div>
							<div class="col-md-6 col-sm-6 col-xs-6">
								<%-- 이동 할 가상머신 정보가 없을때 selectbox & button disabled 추가 jh --%>
								<select v-if="this.selectedHostId === null || this.selectedHostId === ''" style="width:300px; height:25px; font-size:15px">
									<option>이동할 가상머신이 없습니다.</option>
								</select>

								<%-- 이동 할 가상머신 정보가 있을때 selectbox --%>
								<select v-model="selectedHostId" v-if="this.selectedHostId !== null && this.selectedHostId !== ''" style="width:300px; height:25px; font-size:15px">
									<option v-for="host in hostList" v-if="(checkedHostId !== host.hostId) && host.hostStatus === 'up'" :value="host.hostId">{{ host.hostName }}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="migrateVm()" :disabled="this.selectedHostId === null || this.selectedHostId === ''">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/compute/vms.js" type="text/javascript"></script>