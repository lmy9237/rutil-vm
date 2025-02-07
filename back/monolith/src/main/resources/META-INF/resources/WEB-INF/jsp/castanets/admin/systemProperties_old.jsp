<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="systemProperties">
	<div class="row">
		<div class="col-md-12 col-sm-12 col-xs-12">
			<h4 class="header-title m-t-0">설정</h4>
			
			<div class="clearfix"></div>

			<div class="x_panel">
				<div class="x_title">
					<div>
						<h2 style="margin-right:93%">엔진</h2>
					</div>
					<input type="button" id="menuCtrlBtn" style="opacity:0" value="Details" @click="ctrlDetailMenu">
				</div>
				<div class="x_content">
					<div class="form-horizontal form-label-left">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12" for="id">ID</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" id="id" v-model="systemProperties.id" required placeholder="ID" />
							</div>
						</div>
					</div>
					<div class="form-horizontal form-label-left">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12" for="password">비밀번호</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="password" class="form-control" id="password" v-model="systemProperties.password" required placeholder="비밀번호"/>
							</div>
						</div>
					</div>
					<div class="form-horizontal form-label-left">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12" for="ip">IP</label>
							<div class="col-md-9 col-sm-9 col-xs-12">
								<input type="text" class="form-control" id="ip" v-model="systemProperties.ip" @keyup="syncIPInfo" required placeholder="IP" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<%-- detail IP info div --%>
			<div id="detailDiv" v-if="menuFlag === true">
				<div class="x_panel">
					<div class="x_title">
						<h2>VNC</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" for="vncIp">VNC IP</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" id="vncIP" v-model="systemProperties.vncIp" required placeholder="VNC IP"/>
								</div>
							</div>
						</div>
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" for="vncPort">VNC 포트</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" id="vncPort" v-model="systemProperties.vncPort" required placeholder="VNC 포트"/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="x_panel">
					<div class="x_title">
						<h2>가상머신 메트릭</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" for="grafanaUri">가상머신 메트릭 URI</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" id="grafanaUri" v-model="systemProperties.grafanaUri" required placeholder="가상머신 메트릭 URI"/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="x_panel">
					<div class="x_title">
						<h2>머신러닝</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" for="deepLearningUri">머신러닝 URI</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" id="deepLearningUri" v-model="systemProperties.deepLearningUri" required placeholder="머신러닝 URI"/>
								</div>
							</div>
						</div>
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" for="symphonyPowerControll">가상머신 재배치 후 호스트 전원관리</label>
								<!-- <div class="col-md-9 col-sm-9 col-xs-12">
									<input type="checkbox" id="symphonyPowerControll" v-model="systemProperties.symphonyPowerControll"/>
								</div> -->
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" id="symphonyPowerControll" v-model="systemProperties.symphonyPowerControll">
										<option value="true">사용</option>
										<option value="false">사용안함</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="x_panel">
					<div class="x_title">
						<h2>보안</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" >세션 타임아웃 시간</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" value="30분" required placeholder="타임아웃 시간" readonly/>
								</div>
							</div>
						</div>
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" for="loginLimit">로그인 시도 횟수</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="number" class="form-control" id="loginLimit" v-model="systemProperties.loginLimit" required placeholder="로그인 시도 횟수"/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="x_panel">
					<div class="x_title">
						<h2>버전</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" >프로그램 버전</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									{{programVersion.version}}
								</div>
							</div>
						</div>
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" >빌드 타임</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									{{programVersion.buildTime}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<%--///// detail IP info div --%>

			<div class="form-group text-right m-b-0">
				<div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button type="submit" class="btn btn-success" @click="saveSystemProperties()">저장</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/admin/systemProperties.js" type="text/javascript"></script>
