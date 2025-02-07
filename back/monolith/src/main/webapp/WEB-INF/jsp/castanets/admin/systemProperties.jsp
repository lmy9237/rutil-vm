<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="cont-wrap" id="systemProperties">
	<div class="cont-inner long">
		<div class="doc-list-wrap">
			<div class="doc-tit">
				<h2 class="tit"><a href="/admin/systemProperties">설정</a></h2>
				<p class="location">관리 &gt; <a href="/admin/systemProperties">설정</a></p>
			</div>
			<div class="doc-list-body full">
				<div class="doc-list-inner">
					<h3 class="doc-tit-m">엔진</h3>
					<input type="button" id="menuCtrlBtn" style="opacity:0" value="Details" @click="ctrlDetailMenu">
					<div class="frmSet-outer">
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">ID</p>
								<div class="inputBox">
									<input type="text" class="input-custom" id="id" v-model="systemProperties.id" required placeholder="ID">
								</div>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">비밀번호</p>
								<div class="inputBox">
									<input type="password" class="input-custom" id="password" v-model="systemProperties.password" required placeholder="비밀번호">
								</div>
							</div>
						</div>
						<div class="frmSet doc-frmSet">
							<div class="frm-unit">
								<p class="tit">IP</p>
								<div class="inputBox">
									<input type="text" class="input-custom" id="ip" v-model="systemProperties.ip" @keyup="syncIPInfo" required placeholder="IP">
								</div>
							</div>
						</div>
					</div>

					<%-- detail IP info div --%>
					<div class="foldingCont" id="detailDiv" v-if="menuFlag === true">
						<h3 class="doc-tit-m">VNC</h3>
						<div class="frmSet-outer">
							<div class="frmSet">
								<div class="frm-unit half-left">
									<p class="tit">VNC IP</p>
									<div class="inputBox">
										<input type="text" class="input-custom" id="vncIP" v-model="systemProperties.vncIp" required placeholder="VNC IP">
									</div>
								</div>
								<div class="frm-unit half-right">
									<p class="tit">VNC 포트</p>
									<div class="inputBox">
										<input type="text" class="input-custom" id="vncPort" v-model="systemProperties.vncPort" required placeholder="VNC 포트">
									</div>
								</div>
							</div>
						</div>
						<h3 class="doc-tit-m">가상머신 메트릭</h3>
						<div class="frmSet-outer">
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">가상머신 메트릭 URI</p>
									<div class="inputBox">
										<input type="text" class="input-custom" id="grafanaUri" v-model="systemProperties.grafanaUri" required placeholder="가상머신 메트릭 URI">
									</div>
								</div>
							</div>
						</div>
						<h3 class="doc-tit-m">머신러닝</h3>
						<div class="frmSet-outer">
							<div class="frmSet">
								<div class="frm-unit half-left">
									<p class="tit">머신러닝 URI</p>
									<div class="inputBox">
										<input type="text" class="input-custom" id="deepLearningUri" v-model="systemProperties.deepLearningUri" required placeholder="머신러닝 URI">
									</div>
								</div>
								<div class="frm-unit half-right">
									<p class="tit">가상머신 재배치 후 호스트 전원관리</p>
									<div class="fullselect-wrap">
										<selectbox-component :selectvo="symphonyPowerControlVo" v-on:setSelected="setSelected"></selectbox-component>
									</div>
								</div>
							</div>
						</div>
						<h3 class="doc-tit-m">보안</h3>
						<div class="frmSet-outer">
							<div class="frmSet">
								<div class="frm-unit half-left">
									<p class="tit">세션 타임아웃 시간</p>
									<div class="inputBox">
										<input type="text" class="input-custom" value="30분" required placeholder="타임아웃 시간" readonly>
									</div>
								</div>
								<div class="frm-unit half-right">
									<p class="tit">로그인 시도 횟수</p>
									<div class="fullselect-wrap">
										<input type="number" class="input-custom" id="loginLimit" v-model="systemProperties.loginLimit" required placeholder="로그인 시도 횟수">
									</div>
								</div>
							</div>
						</div>
						<h3 class="doc-tit-m">버전</h3>
						<div class="frmSet-outer">
							<div class="frmSet">
								<div class="frm-unit half-left">
									<p class="tit">프로그램 버전</p>
									<div class="inputBox">
										<input type="text" class="input-custom" v-model="programVersion.version" readonly>
									</div>
								</div>
								<div class="frm-unit half-right">
									<p class="tit">빌드 타임</p>
									<div class="inputBox">
										<input type="text" class="input-custom" v-model="programVersion.buildTime" readonly>
									</div>
								</div>
							</div>
						</div>
					</div>
					<%--// detail IP info div --%>

<%--					<div class="btnSet" style="margin-top: -7px;">--%>
<%--						<div class="btnSet-left">--%>
<%--							<div class="btn-box ml-0">--%>
<%--								<button type="button" class="btn-icon btn-icon-plus btn-tooltip btn-toggle" data-def="btn-icon-plus" data-active="btn-icon-minus" data-target="#foldingCont1">더보기/접기</button>--%>
<%--								<div class="c-tooltip top-right">--%>
<%--									<span class="c-tooltip-arrow"></span>--%>
<%--									<span class="txt" data-def="더보기" data-active="접기">더보기</span>--%>
<%--								</div>--%>
<%--							</div>--%>
<%--						</div>--%>
<%--					</div>--%>
				</div>
				<!-- //doc-list-body -->
				<div class="doc-list-btm">
					<div class="btnSet">
						<div class="btnSet-right">
							<button class="btn btn-blue" @click="saveSystemProperties()">저장</button>
						</div>
					</div>
				</div>
				<!-- //doc-list-btm -->
			</div>
			<!-- //doc-list-wrap -->
		</div>
	</div>
</div>

<script src="/js/castanets/admin/systemProperties.js" type="text/javascript"></script>
