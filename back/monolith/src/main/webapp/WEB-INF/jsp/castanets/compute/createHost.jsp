<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

	<!-- page content -->
	<div class="right_col" role="main" id="createHostVue">
	
		<spinner v-show="spinnerOn"></spinner>
		
		<div class="" v-show="!spinnerOn" v-cloak>
			<div class="page-title">
				<div class="title_left">
					<h3>{{ isUpdate ? host.name : "새 호스트"}} </h3>
				</div>
	
				<div class="text-right">
					<div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
						<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3 f-right">
							<button class="btn btn-primary" type="reset" @click="goList()">취소</button>
							<button type="submit" class="btn btn-success" v-if="!isUpdate" @click="createHost()">생성</button>
							<button type="submit" class="btn btn-success" v-if="isUpdate" @click="updateHost()">편집</button>
						</div>
					</div>
				</div>
			</div>
			
			<div class="clearfix"></div>
			
			<div class="row">
				<div class="col-md-12 col-sm-12 col-xs-12">
					<div class="x_panel">
						<div class="x_title">
							<h2>일반 </h2>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<br/>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">호스트 클러스터<span class="text-danger">*</span></label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<select class="form-control" v-model="host.clusterId" :disabled=" !(host.status === 'maintenance' || host.status === '') ">
											<option value="">호스트 클러스터 선택</option>
											<option v-for="cluster in clusters" v-bind:value="cluster.id">{{cluster.name}}</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="이름" v-model="host.name" @input="checkHostName" :maxlength="this.$maxName">
                          				<p class="text-danger" v-if="hostNameStatus || host.name ==''">기호는 '-', '_'만 사용가능합니다. 공백도 허용하지 않습니다.</p>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">코멘트</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="코멘트" v-model="host.comment" :maxlength="this.$maxDescription">
									</div>
								</div>
								<!--  
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">설명 </label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="설명" v-model="host.description">
									</div>
								</div>
								-->
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">호스트 주소<span class="text-danger">*</span></label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="호스트 주소" v-model="host.ssh.address" :disabled="isUpdate">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">SSH 포트</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="SSH 포트" v-model="host.ssh.port">
									</div>
								</div>

								<hr>
								<p><strong>인증</strong></p>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">사용자 ID</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="사용자 ID" v-model="host.ssh.id" disabled>
									</div>
								</div>
								<div class="form-group" v-if="!isUpdate">
									<label class="control-label col-md-3 col-sm-3 col-xs-12">암호<span class="text-danger">*</span></label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="password" class="form-control" placeholder="사용자 암호" v-model="host.ssh.password">
									</div>
								</div>
								<!-- 
								<div class="form-group" v-if="!isUpdate">
									<div class="col-md-3 col-sm-3 col-xs-12">
										<div class="radio">
											<label>
												<input type="radio" class="flat" checked name="iCheck" value="password" v-model="sshType"> 암호 
											</label>
										</div>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="password" class="form-control" placeholder="사용자 암호" v-model="host.ssh.password">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12"  v-if="isUpdate">SSH 공개 키 </label>
									<div class="col-md-3 col-sm-3 col-xs-12"  v-if="!isUpdate">
										<div class="radio">
											<label>
												<input type="radio" class="flat" name="iCheck" value="key" v-model="sshType"> SSH 공개 키 
											</label>
										</div>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<textarea class="form-control" rows="5" placeholder="SSH 공개키" v-model="host.ssh.publicKey" disabled></textarea>
									</div>
								</div>
								-->
							</form>
						</div>
					</div>
               
               
               		<!-- 호스트 엔진 S -->
               		
					<div class="x_panel" v-if="!isUpdate">
						<div class="x_title">
							<h2>호스트 엔진 </h2>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<br/>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label>
											<input type="checkbox" class="" v-model="host.hostEngineEnabled">호스트 엔진 여부
										</label>
									</div>
								</div>
							</form>
						</div>
					</div>
					
					<!-- 호스트 엔진 E -->	
					
					
					<!-- 전원 관리 S -->
					
					<div class="x_panel">
						<div class="x_title">
							<h2>전원 관리 </h2>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<br/>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label>
											<input type="checkbox" class="" v-model="host.powerManagementEnabled">전원 관리 활성
										</label>
									</div>
								</div>
								<hr>
								<div v-if="host.powerManagementEnabled">
									<table class="table table-striped text-center">
										<thead>
											<th>타입</th>
											<th>주소</th>
											<th>사용자명</th>
											<th>삭제</th>
										</thead>
										<tbody>
											<tr v-if="host.fenceAgent != null && host.fenceAgent.address != ''">
												<td>{{host.fenceAgent.type}}</td>
												<td>{{host.fenceAgent.address}}</td>
												<td>{{host.fenceAgent.username}}</td>
												<!-- <td>
													<button type="button" class="btn btn-success">위로</button>
													<button type="button" class="btn btn-success">아래로</button>
												</td> -->
												<td><button type="button" class="btn btn-success" @click="removeFanceAgent()">삭제</button></td>
											</tr>
										</tbody>
									</table>
									
									<hr>
									<button type="button" class="btn btn-success" @click="viewModalFanceAgent()">전원관리 에이전트 추가</button>
									
								</div>
							</form>
						</div>
					</div>
					
					<!-- 전원 관리 E -->	



					<!-- 네트워크 공급자 S -->
					<!--
					<div class="x_panel">
						<div class="x_title">
							<h2>네트워크 공급자 </h2>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<br/>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label>
											<input type="checkbox" class="" v-model="defaultNetworkYn">클러스터의 기본 네트워크 공급자 사용
										</label>
									</div>
								</div>
								<hr>

								<div class="form-group">
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">
											<a href="#" data-toggle="tooltip" title="외부 네트워크 공급자에 대한 설명">외부 네트워크 공급자 <i class="fa fa-info-circle"></i></a>
										</label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<select class="form-control"  v-model="host.networkProviderId" :disabled="defaultNetworkYn">
												<option value="">기본 네트워크 공급자 선택</option>
												<option  v-for="networkProvider in networkProviders"  v-bind:value="networkProvider.id">{{networkProvider.name}}</option>
											</select>
										</div>
									</div>

									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">
											<a href="#" data-toggle="tooltip" title="유형에 대한 설명">유형 <i class="fa fa-info-circle"></i></a>
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
									</div>
									<div class="form-group">
										<label class="control-label col-md-3 col-sm-3 col-xs-12">네트워킹 플러그인 </label>
										<div class="col-md-9 col-sm-9 col-xs-12">
											<input type="text" class="form-control" placeholder="user name">
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
					-->
					<!-- 네트워크 공급자 E -->	

				</div>
			</div>
			
			
			
			
			<!-- move/ copy modal -->
			<div class="modal fade fenceagentmodal" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
	
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
							<h4 class="modal-title" id="myModalLabel">전원관리 에이전트 추가</h4>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12"> 주소 *</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="" v-model="fenceAgent.address">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12"> 사용자 이름 *</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="" v-model="fenceAgent.username">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12"> 암호 *</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="password" class="form-control" placeholder="" v-model="fenceAgent.password">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12"> 유형 *</label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<select class="form-control" v-model="fenceAgent.type">
											<option v-for="fenceType in fenceTypes" v-bind:value="fenceType">{{fenceType}}</option>
										</select>
									</div>
								</div>
								<!-- 
								<div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12"> 옵션 </label>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<input type="text" class="form-control" placeholder="콤마로 구분된 'key=value' 목록을 사용하십시오." v-model="fenceAgent.option">
									</div>
								</div>
								 -->
							</div>
							<!-- 
							<div class="row">
								<button type="button" class="btn btn-default" @click="connectTestFenceAgent()">연결테스트</button>
							</div>
							 -->
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" @click="addFenceAgent()">확인</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
						</div>
					</div>
				</div>
			</div>
		
		</div>
	</div>
	<!-- /page content -->

<script src="/js/castanets/compute/createHost.js" type="text/javascript"></script>
