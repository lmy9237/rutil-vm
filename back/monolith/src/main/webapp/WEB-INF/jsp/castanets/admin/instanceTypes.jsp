<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="cont-wrap" id="instanceTypes">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="cont-inner">
		<div class="doc-list-wrap">
			<div class="doc-tit">
				<h2 class="tit"><a href="/admin/instanceTypes">인스턴스 유형</a></h2>
				<p class="location">관리 &gt; <a href="/admin/instanceTypes">인스턴스 유형</a></p>
				<div class="btnSet-right">
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-refresh btn-tooltip" @click="retrieveInstanceTypes()">새로고침</button>
						<div class="c-tooltip top-right">
							<div class="c-tooltip-inner"></div>
							<span class="c-tooltip-arrow"></span>
							<span class="txt">새로고침</span>
						</div>
					</div>
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-new btn-tooltip" @click="openPop('newInstanceType')">등록</button>
						<div class="c-tooltip top-right">
							<span class="c-tooltip-arrow"></span>
							<span class="txt">등록</span>
						</div>
					</div>
				</div>
			</div>
			<div class="doc-list-body scrollBodyX">
				<div class="doc-list-inner">
					<div class="list-tot">
						<div class="list-fix-wrap">
							<table>
								<caption></caption>
								<colgroup>
									<col style="width: 10%;">
									<col style="width: 20%;">
									<col style="width: 10%;">
								</colgroup>
								<tbody>
									<th>이름</th>
									<th>설명</th>
									<th>작업</th>
								</tbody>
							</table>
						</div><!-- //list-fix-wrap -->

						<div class="list-scroll-wrap scrollBodyY">
							<div class="nodata-wrap" v-if="instanceTypes.length == 0">
								<p class="nodata">생성된 인스턴스 정보가 없습니다.</p>
							</div>
							<div class="list-scroll-cont"v-else>
								<table>
									<caption></caption>
									<colgroup>
										<col style="width: 10%;">
										<col style="width: 20%;">
										<col style="width: 10%;">
									</colgroup>
									<tbody>
										<tr v-for="instanceType in pagingVo.viewList">
											<td>{{instanceType.name}}</td>
											<td>{{instanceType.description}}</td>
											<td>
												<div class="list-popbtn-wrap">
													<button type="button" class="btn-openPop" @click="selectInstanceType(instanceType)"></button>
													<div class="openPop-target scrollBodyY long">
														<div class="openPop-target_inner">
															<ul>
																<li><button type="button" class="active" @click="openPop('targetInstanceType')"><span class="ico ico-edit"></span>편집</button></li>
																<li><button type="button" class="active" @click="openPop('deleteModal')"><span class="ico ico-del"></span>삭제</button></li>
															</ul>
														</div>
													</div><!-- //openPop-target -->
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div><!-- //list-scroll-wrap -->
					</div>
				</div>
			</div>
			<!-- //doc-list-body -->
			<pagination-component :dataList="instanceTypes" :size="10" v-on:setViewList="setViewList"></pagination-component>

		</div>
		<!-- //doc-list-wrap -->

		<%-- delete modal --%>
		<div class="alert-dim" id="deleteModal">
			<div class="alertBox">
				<div class="alert-wrap">
					<div class="alert-body" v-for="selectedInstanceType in selectedInstanceTypes">
						<p>다음의 인스턴스 유형을 삭제하시겠습니까?<br>
							- {{selectedInstanceType.name}}
						</p>
					</div>
					<div class="alert-footer">
						<div class="alert-btnBox">
							<button class="btn-alert-foot" @click="closePop('deleteModal')">취소</button>
							<button class="btn-alert-foot btn-alert-primary" @click="removeInstanceType()">확인</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<%--/// delete modal --%>
	</div>
</div>
<!-- //cont-wrap -->

<%-- create modal --%>
<div class="modalBox" id="newInstanceType">
	<div class="modalBox-inner">
		<section class="c-modal-wrap">
			<div class="c-modal-inner">
				<div class="c-modal-header">
					<h1>새 인스턴스 유형</h1>
					<p class="mustbeTxt">표시 항목( <span class="mustbe"></span> ) 은 필수 입력 항목입니다. </p>
					<div class="steps-wrap">
						<ul>
							<li>
								<button type="button" class="btn-step" :class="isActiveGeneral ? 'active' : ''" @click="toggleTabActive('isActiveGeneral')">일반 <span class="mustbe"></span></button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveBootOption ? 'active' : ''" @click="toggleTabActive('isActiveBootOption')">부트옵션 <span class="mustbe"></span></button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveSystem ? 'active' : ''" @click="toggleTabActive('isActiveSystem')">시스템</button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveHost ? 'active' : ''" @click="toggleTabActive('isActiveHost')">호스트</button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveResourceAssign ? 'active' : ''" @click="toggleTabActive('isActiveResourceAssign')">리소스 할당</button>
							</li>
						</ul>
					</div>
				</div><!-- //c-modal-header -->
				<div class="c-modal-body scroll-css">
					<!-- 일반 -->
					<div class="steps-cont-wrap" v-show="isActiveGeneral">
						<div class="c-modal-body_inner">
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">이름 <span class="mustbe"></span></p>
									<div class="inputBox">
										<input type="text" class="input-custom" v-model="newInstanceType.name" @input="checkInstanceName" placeholder="이름" :maxlength="this.$maxName" required>
									</div>
									<p class="errTxt" v-if="(instanceNameStatus || validInstanceName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">설명</p>
									<div class="inputBox">
										<input type="text" class="input-custom" v-model="newInstanceType.description" placeholder="설명">
									</div>
								</div>
							</div>

							<h2 class="steps-tit steps-tit-m">vNIC 프로파일을 선택하여 가상 머신 네트워크 인터페이스를 인스턴스화합니다.</h2>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">nic1</p>
									<selectbox-component :selectvo="createSelectVo.nicSelectVo" :index="10001" v-on:setSelected="setSelected" :disabled="true"></selectbox-component>
								</div>
							</div>
						</div><!-- //c-modal-body_inner -->
					</div>
					<!-- ///일반 -->

					<!-- 부트옵션 -->
					<div class="steps-cont-wrap" v-show="isActiveBootOption">
						<div class="c-modal-body_inner">
							<h2 class="steps-tit">부트순서</h2>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">첫 번째 장치</p>
									<selectbox-component :selectvo="createSelectVo.bootFirstDevice" :index="10002" v-on:setSelected="setSelected"></selectbox-component>
								</div>
							</div>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">두 번째 장치</p>
									<selectbox-component :selectvo="createSelectVo.bootSecondDevice" :index="10003" v-on:setSelected="setSelected"></selectbox-component>
								</div>
							</div>
						</div><!-- //c-modal-body_inner -->
					</div>
					<!-- ///부트옵션 -->

					<!-- 시스템 -->
					<div class="steps-cont-wrap" v-show="isActiveSystem">
						<div class="c-modal-body scroll-css">
							<div class="steps-cont-wrap">
								<div class="c-modal-body_inner">
									<h2 class="steps-tit step-tit-black">시스템</h2>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">메모리 크기</p>
											<div class="inputBox">
												<input type="text" class="input-custom" v-model="memory" @change="memoryChange()">
											</div>
										</div>
										<div class="frm-unit half-right">
											<div class="tooltipM-wrap">
												<p class="tit">최대 메모리</p>
												<div class="btn-box">
													<button class="btn-tooltipm btn-tooltip">i</button>
													<div class="c-tooltip bottom-center">
														<div class="c-tooltip-inner"></div>
														<span class="c-tooltip-arrow"></span>
														<span class="txt">메모리 핫 플러그를 실행할 수 있는<br>가상머신 메모리 상환</span>
													</div>
												</div>
											</div>
											<div class="inputBox">
												<input type="text" class="input-custom" v-model="maximumMemory" @change="maximumMemoryChange()">
											</div>
										</div>
									</div>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<div class="tooltipM-wrap">
												<p class="tit">총 가상 CPU</p>
												<div class="btn-box">
													<button class="btn-tooltipm btn-tooltip">i</button>
													<div class="c-tooltip top-center">
														<div class="c-tooltip-inner"></div>
														<span class="c-tooltip-arrow"></span>
														<span class="txt">소켓 수를 변경하여 CPU를 핫애드합니다.<br>CPU 핫애드가 올바르게 지원되는지 확인<br>하려면 게스트 운영 체제 관련 문서를 참조<br>하십시오.</span>
													</div>
												</div>
											</div>
											<div class="inputBox">
												<input type="text" class="input-custom" v-model="totalCpu">
											</div>
										</div>
										<div class="frm-unit half-right">
											<p class="tit">가상 소켓</p>
											<selectbox-component :selectvo="createSelectVo.divisorVoVirtualSockets" :index="10004" v-on:setSelected="setSelected"></selectbox-component>
										</div>
									</div>
									<div class="frmSet mb-20">
										<div class="frm-unit half-left">
											<p class="tit">가상 소켓 당 코어</p>
											<selectbox-component :selectvo="createSelectVo.divisorVoCoresPerVirtualSocket" :index="10005" v-on:setSelected="setSelected"></selectbox-component>
										</div>
										<div class="frm-unit half-right">
											<div class="tooltipM-wrap">
												<p class="tit">코어 당 스레드</p>
												<div class="btn-box">
													<button class="btn-tooltipm btn-tooltip">i</button>
													<div class="c-tooltip top-center">
														<div class="c-tooltip-inner"></div>
														<span class="c-tooltip-arrow"></span>
														<span class="txt">동시 멀티스레딩을 설정합니다. 값을 변경<br>하기 전 호스트 아키텍처를확인합니다. 설<br>정 값이 확실하지 않은 경우 코어당 스레드<br>수를 1로 설정합니다. 다음과 같은 값을 사<br>용할 것을 권장합니다.</span>
													</div>
												</div>
											</div>
											<selectbox-component :selectvo="createSelectVo.divisorVoThreadsPerCore" :index="10006" v-on:setSelected="setSelected"></selectbox-component>
										</div>
									</div>
									<!-- //시스템 영역 끝 -->

									<h2 class="steps-tit step-tit-black">콘솔</h2>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">그래픽프로토콜</p>
											<selectbox-component :selectvo="createSelectVo.graphicProtocol" :index="10007" :disabled="true"></selectbox-component>
										</div>
										<div class="frm-unit half-right">
											<p class="tit">모니터</p>
											<selectbox-component :selectvo="createSelectVo.monitor" :index="10008" :disabled="true"></selectbox-component>
										</div>
									</div>

									<h2 class="steps-tit step-tit-black">고가용성</h2>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">고가용성 사용
												<label class="ui-check">
													<input type="checkbox" v-model="highAvailability">
													<span class="chk-ico"></span>
												</label>
											</p>
										</div>
									</div>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">실행/마이그레이션 큐에서 우선 순위</p>
											<selectbox-component :selectvo="createSelectVo.priority" :index="10009" v-on:setSelected="setSelected"></selectbox-component>
										</div>
									</div>
								</div><!-- //c-modal-body_inner -->
							</div><!-- //steps-cont-wrap -->
						</div><!-- //c-modal-body -->
					</div>
				</div><!-- //c-modal-body -->
				<!--/// 시스템 -->

				<!-- 호스트 -->
				<div class="steps-cont-wrap" v-show="isActiveHost">
					<div class="c-modal-body_inner">
						<h2 class="steps-tit">마이그레이션 옵션</h2>
						<div class="frmSet">
							<div class="frm-unit">
								<div class="tooltipM-wrap">
									<p class="tit">마이그레이션 모드</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">최소 활성화된 하나의 가상 머신 디스크가<br>SCSI 예약을 사용할 경우마이그레이션 옵<br>션이 무시되어 가상 머신을 마이그레이션<br>할 수 없습니다.</span>
										</div>
									</div>
								</div>
								<selectbox-component :selectvo="createSelectVo.affinity" :index="10010" v-on:setSelected="setSelected"></selectbox-component>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<div class="tooltipM-wrap">
									<p class="tit">
										<label class="ui-check mr-0"> 사용자 정의 마이그레이션 정책 사용
											<input type="checkbox" v-model="newInstanceType.customMigrationUsed">
											<span class="chk-ico"></span>
										</label>
									</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">마이그레이션 수렴을 처리하는 정책을 표<br>시합니다.마이그레이션 정책이 없을 경우<br>하이퍼바이저가 수렴을 처리합니다.</span>
										</div>
									</div>
								</div>
								<selectbox-component :selectvo="createSelectVo.customMigrationUsed" :index="10011" v-on:setSelected="setSelected" :disabled="!newInstanceType.customMigrationUsed"></selectbox-component>
							</div>
							<div class="frm-unit half-right">
								<div class="tooltipM-wrap">
									<p class="tit">
										<label class="ui-check mr-0"> 사용자 정의 마이그레이션 다운 타임 사용
											<input type="checkbox" :disabled="!newInstanceType.customMigrationUsed" v-model="newInstanceType.customMigrationDowntimeUsed">
											<span class="chk-ico"></span>
										</label>
									</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center more-right">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">라이브 마이그레이션 도중 가상 머신이 정<br>지 상태에 있을 수 있는최대 시간을 밀리 초<br>단위로 표시합니다. 값이 0인것은 VDSM<br>기본값이 사용되고 있음을 의미합니다. (현<br>재 engine 전체의 기본값은 0 밀리 초 입니<br>다.)</span>
										</div>
									</div>
								</div>
								<div class="inputBox">
									<input type="text" class="input-custom" :disabled="!newInstanceType.customMigrationDowntimeUsed || !newInstanceType.customMigrationUsed" v-model="newInstanceType.customMigrationDowntime">
								</div>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">마이그레이션 자동 통합 </p>
								<selectbox-component :selectvo="createSelectVo.autoConverge" :index="10012" v-on:setSelected="setSelected" :disabled="!newInstanceType.customMigrationUsed"></selectbox-component>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">마이그레이션 압축 활성화</p>
								<selectbox-component :selectvo="createSelectVo.compressed" :index="10013" v-on:setSelected="setSelected" :disabled="!newInstanceType.customMigrationUsed"></selectbox-component>
							</div>
						</div>
					</div><!-- //c-modal-body_inner -->
				</div><!-- //steps-cont-wrap -->
				<!--/// 호스트 -->

				<!-- 리소스 할당 -->
				<div class="steps-cont-wrap" v-show="isActiveResourceAssign">
					<div class="c-modal-body_inner">
						<h2 class="steps-tit">메모리 할당</h2>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">할당할 실제 메모리</p>
								<div class="inputBox">
									<input type="text" class="input-custom" v-model="physicalMemory" @change="physicalMemoryChange()" >
								</div>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">
									<label class="ui-check"> 메모리 Balloon 장치 활성화
										<input type="checkbox" v-model="newInstanceType.memoryBalloon">
										<span class="chk-ico"></span>
									</label>
								</p>
							</div>
						</div>
						<!-- //메모리 할당 영역 끝 -->

						<h2 class="steps-tit">IO 스레드</h2>
						<div class="frmSet">
							<div class="frm-unit">
								<p class="tit">
									<label class="ui-check"> IO 스레드 활성화
										<input type="checkbox" v-model="ioThreadsEnabled">
										<span class="chk-ico"></span>
									</label>
								</p>
							</div>
						</div>
						<!-- //IO 스레드 영역 끝 -->

						<div class="frmSet">
							<div class="frm-unit">
								<div class="tooltipM-wrap">
									<p class="tit">
										<label class="ui-check mr-0"> VirtlO-SCSI 활성화
											<input type="checkbox" v-model="newInstanceType.virtioScsiEnabled">
											<span class="chk-ico"></span>
										</label>
									</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center more-right">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">가상 머신 실행 시 <br>VirtIO-SCSI 컨트롤러를 연결합니다.</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div><!-- //c-modal-body_inner -->
				</div><!-- //steps-cont-wrap -->

				<!--/// 리소스 할당 -->


				<div class="c-modal-footer">
					<div class="buttonSet">
						<button class="btn-c-modal btn-cancel" @click="closePop">취소</button>
						<button class="btn-c-modal" @click="createInstanceType">생성</button><!-- 비활성화일때(필수값 입력안했을때) 속성 disabled 추가 : 아랫줄 참조 -->
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
<%--/// create modal --%>

<%-- modify modal --%>
<div class="modalBox" id="targetInstanceType">
	<div class="modalBox-inner">
		<section class="c-modal-wrap">
			<div class="c-modal-inner">
				<div class="c-modal-header">
					<h1>인스턴스 유형 편집</h1>
					<p class="mustbeTxt">표시 항목( <span class="mustbe"></span> ) 은 필수 입력 항목입니다. </p>
					<div class="steps-wrap">
						<ul>
							<li>
								<button type="button" class="btn-step" :class="isActiveGeneral ? 'active' : ''" @click="toggleTabActive('isActiveGeneral')">일반 <span class="mustbe"></span></button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveBootOption ? 'active' : ''" @click="toggleTabActive('isActiveBootOption')">부트옵션 <span class="mustbe"></span></button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveSystem ? 'active' : ''" @click="toggleTabActive('isActiveSystem')">시스템</button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveHost ? 'active' : ''" @click="toggleTabActive('isActiveHost')">호스트</button>
							</li>
							<li>
								<button type="button" class="btn-step" :class="isActiveResourceAssign ? 'active' : ''" @click="toggleTabActive('isActiveResourceAssign')">리소스 할당</button>
							</li>
						</ul>
					</div>
				</div><!-- //c-modal-header -->
				<div class="c-modal-body scroll-css">
					<!-- 일반 -->
					<div class="steps-cont-wrap" v-show="isActiveGeneral">
						<div class="c-modal-body_inner">
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">이름 <span class="mustbe"></span></p>
									<div class="inputBox">
										<input type="text" class="input-custom" v-model="targetInstanceType.name" @input="checkInstanceName" placeholder="이름" :maxlength="this.$maxName" required>
									</div>
									<p class="errTxt" v-if="(instanceNameStatus || validInstanceName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">설명</p>
									<div class="inputBox">
										<input type="text" class="input-custom" v-model="targetInstanceType.description" placeholder="설명">
									</div>
								</div>
							</div>

							<h2 class="steps-tit steps-tit-m">vNIC 프로파일을 선택하여 가상 머신 네트워크 인터페이스를 인스턴스화합니다.</h2>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">nic1</p>
									<selectbox-component :selectvo="updateSelectVo.nicSelectVo" :index="10001" v-on:setSelected="setSelected" :disabled="true"></selectbox-component>
								</div>
							</div>
						</div><!-- //c-modal-body_inner -->
					</div>
					<!-- ///일반 -->

					<!-- 부트옵션 -->
					<div class="steps-cont-wrap" v-show="isActiveBootOption">
						<div class="c-modal-body_inner">
							<h2 class="steps-tit">부트순서</h2>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">첫 번째 장치</p>
									<selectbox-component :selectvo="updateSelectVo.firstDevicesVo" :index="10002" v-on:setSelected="setSelected"></selectbox-component>
								</div>
							</div>
							<div class="frmSet">
								<div class="frm-unit">
									<p class="tit">두 번째 장치</p>
									<selectbox-component :selectvo="updateSelectVo.secondDevicesVo" :index="10003" v-on:setSelected="setSelected"></selectbox-component>
								</div>
							</div>
						</div><!-- //c-modal-body_inner -->
					</div>
					<!-- ///부트옵션 -->

					<!-- 시스템 -->
					<div class="steps-cont-wrap" v-show="isActiveSystem">
						<div class="c-modal-body scroll-css">
							<div class="steps-cont-wrap">
								<div class="c-modal-body_inner">
									<h2 class="steps-tit step-tit-black">시스템</h2>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">메모리 크기</p>
											<div class="inputBox">
												<input type="text" class="input-custom" v-model="memory" @change="memoryChange()">
											</div>
										</div>
										<div class="frm-unit half-right">
											<div class="tooltipM-wrap">
												<p class="tit">최대 메모리</p>
												<div class="btn-box">
													<button class="btn-tooltipm btn-tooltip">i</button>
													<div class="c-tooltip bottom-center">
														<div class="c-tooltip-inner"></div>
														<span class="c-tooltip-arrow"></span>
														<span class="txt">메모리 핫 플러그를 실행할 수 있는<br>가상머신 메모리 상환</span>
													</div>
												</div>
											</div>
											<div class="inputBox">
												<input type="text" class="input-custom" v-model="maximumMemory" @change="maximumMemoryChange()">
											</div>
										</div>
									</div>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<div class="tooltipM-wrap">
												<p class="tit">총 가상 CPU</p>
												<div class="btn-box">
													<button class="btn-tooltipm btn-tooltip">i</button>
													<div class="c-tooltip top-center">
														<div class="c-tooltip-inner"></div>
														<span class="c-tooltip-arrow"></span>
														<span class="txt">소켓 수를 변경하여 CPU를 핫애드합니다.<br>CPU 핫애드가 올바르게 지원되는지 확인<br>하려면 게스트 운영 체제 관련 문서를 참조<br>하십시오.</span>
													</div>
												</div>
											</div>
											<div class="inputBox">
												<input type="text" class="input-custom" v-model="totalCpu">
											</div>
										</div>
										<div class="frm-unit half-right">
											<p class="tit">가상 소켓</p>
											<selectbox-component :selectvo="updateSelectVo.divisorVoVirtualSockets" :index="10004" v-on:setSelected="setSelected"></selectbox-component>
										</div>
									</div>
									<div class="frmSet mb-20">
										<div class="frm-unit half-left">
											<p class="tit">가상 소켓 당 코어</p>
											<selectbox-component :selectvo="updateSelectVo.divisorVoCoresPerVirtualSocket" :index="10005" v-on:setSelected="setSelected"></selectbox-component>
										</div>
										<div class="frm-unit half-right">
											<div class="tooltipM-wrap">
												<p class="tit">코어 당 스레드</p>
												<div class="btn-box">
													<button class="btn-tooltipm btn-tooltip">i</button>
													<div class="c-tooltip top-center">
														<div class="c-tooltip-inner"></div>
														<span class="c-tooltip-arrow"></span>
														<span class="txt">동시 멀티스레딩을 설정합니다. 값을 변경<br>하기 전 호스트 아키텍처를확인합니다. 설<br>정 값이 확실하지 않은 경우 코어당 스레드<br>수를 1로 설정합니다. 다음과 같은 값을 사<br>용할 것을 권장합니다.</span>
													</div>
												</div>
											</div>
											<selectbox-component :selectvo="updateSelectVo.divisorVoThreadsPerCore" :index="10006" v-on:setSelected="setSelected"></selectbox-component>
										</div>
									</div>
									<!-- //시스템 영역 끝 -->

									<h2 class="steps-tit step-tit-black">콘솔</h2>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">그래픽프로토콜</p>
											<selectbox-component :selectvo="updateSelectVo.updateSelectVo" :index="10007" :disabled="true"></selectbox-component>
										</div>
										<div class="frm-unit half-right">
											<p class="tit">모니터</p>
											<selectbox-component :selectvo="updateSelectVo.monitor" :index="10008" :disabled="true"></selectbox-component>
										</div>
									</div>

									<h2 class="steps-tit step-tit-black">고가용성</h2>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">고가용성 사용
												<label class="ui-check">
													<input type="checkbox" v-model="targetInstanceType.highAvailability">
													<span class="chk-ico"></span>
												</label>
											</p>
										</div>
									</div>
									<div class="frmSet">
										<div class="frm-unit half-left">
											<p class="tit">실행/마이그레이션 큐에서 우선 순위</p>
											<selectbox-component :selectvo="updateSelectVo.priority" :index="10009" v-on:setSelected="setSelected"></selectbox-component>
										</div>
									</div>
								</div><!-- //c-modal-body_inner -->
							</div><!-- //steps-cont-wrap -->
						</div><!-- //c-modal-body -->
					</div>
				</div><!-- //c-modal-body -->
				<!--/// 시스템 -->

				<!-- 호스트 -->
				<div class="steps-cont-wrap" v-show="isActiveHost">
					<div class="c-modal-body_inner">
						<h2 class="steps-tit">마이그레이션 옵션</h2>
						<div class="frmSet">
							<div class="frm-unit">
								<div class="tooltipM-wrap">
									<p class="tit">마이그레이션 모드</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">최소 활성화된 하나의 가상 머신 디스크가<br>SCSI 예약을 사용할 경우마이그레이션 옵<br>션이 무시되어 가상 머신을 마이그레이션<br>할 수 없습니다.</span>
										</div>
									</div>
								</div>
								<selectbox-component :selectvo="updateSelectVo.affinity" :index="10010" v-on:setSelected="setSelected"></selectbox-component>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<div class="tooltipM-wrap">
									<p class="tit">
										<label class="ui-check mr-0"> 사용자 정의 마이그레이션 정책 사용
											<input type="checkbox" v-model="targetInstanceType.customMigrationUsed">
											<span class="chk-ico"></span>
										</label>
									</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">마이그레이션 수렴을 처리하는 정책을 표<br>시합니다.마이그레이션 정책이 없을 경우<br>하이퍼바이저가 수렴을 처리합니다.</span>
										</div>
									</div>
								</div>
								<selectbox-component :selectvo="updateSelectVo.customMigrationUsed" :index="10011" v-on:setSelected="setSelected" :disabled="!targetInstanceType.customMigrationUsed"></selectbox-component>
							</div>
							<div class="frm-unit half-right">
								<div class="tooltipM-wrap">
									<p class="tit">
										<label class="ui-check mr-0"> 사용자 정의 마이그레이션 다운 타임 사용
											<input type="checkbox" v-model="targetInstanceType.customMigrationDowntimeUsed" :disabled="!targetInstanceType.customMigrationUsed">
											<span class="chk-ico"></span>
										</label>
									</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center more-right">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">라이브 마이그레이션 도중 가상 머신이 정<br>지 상태에 있을 수 있는최대 시간을 밀리 초<br>단위로 표시합니다. 값이 0인것은 VDSM<br>기본값이 사용되고 있음을 의미합니다. (현<br>재 engine 전체의 기본값은 0 밀리 초 입니<br>다.)</span>
										</div>
									</div>
								</div>
								<div class="inputBox">
									<input type="text" class="input-custom" :disabled="!targetInstanceType.customMigrationDowntimeUsed || !targetInstanceType.customMigrationUsed"
										   v-model="targetInstanceType.customMigrationDowntime">
								</div>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">마이그레이션 자동 통합 </p>
								<selectbox-component :selectvo="updateSelectVo.autoConverge" :index="10012" v-on:setSelected="setSelected" :disabled="!targetInstanceType.customMigrationUsed"></selectbox-component>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">마이그레이션 압축 활성화</p>
								<selectbox-component :selectvo="updateSelectVo.compressed" :index="10013" v-on:setSelected="setSelected" :disabled="!targetInstanceType.customMigrationUsed"></selectbox-component>
							</div>
						</div>
					</div><!-- //c-modal-body_inner -->
				</div><!-- //steps-cont-wrap -->
				<!--/// 호스트 -->

				<!-- 리소스 할당 -->
				<div class="steps-cont-wrap" v-show="isActiveResourceAssign">
					<div class="c-modal-body_inner">
						<h2 class="steps-tit">메모리 할당</h2>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">할당할 실제 메모리</p>
								<div class="inputBox">
									<input type="text" class="input-custom" v-model="physicalMemory" @change="physicalMemoryChange()" >
								</div>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">
									<label class="ui-check"> 메모리 Balloon 장치 활성화
										<input type="checkbox" v-model="targetInstanceType.memoryBalloon">
										<span class="chk-ico"></span>
									</label>
								</p>
							</div>
						</div>
						<!-- //메모리 할당 영역 끝 -->

						<h2 class="steps-tit">IO 스레드</h2>
						<div class="frmSet">
							<div class="frm-unit">
								<p class="tit">
									<label class="ui-check"> IO 스레드 활성화
										<input type="checkbox" v-model="ioThreadsEnabled" >
										<span class="chk-ico"></span>
									</label>
								</p>
							</div>
						</div>
						<!-- //IO 스레드 영역 끝 -->

						<div class="frmSet">
							<div class="frm-unit">
								<div class="tooltipM-wrap">
									<p class="tit">
										<label class="ui-check mr-0"> VirtlO-SCSI 활성화
											<input type="checkbox" v-model="targetInstanceType.virtioScsiEnabled">
											<span class="chk-ico"></span>
										</label>
									</p>
									<div class="btn-box">
										<button class="btn-tooltipm btn-tooltip">i</button>
										<div class="c-tooltip top-center more-right">
											<div class="c-tooltip-inner"></div>
											<span class="c-tooltip-arrow"></span>
											<span class="txt">가상 머신 실행 시 <br>VirtIO-SCSI 컨트롤러를 연결합니다.</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div><!-- //c-modal-body_inner -->
				</div><!-- //steps-cont-wrap -->

				<!--/// 리소스 할당 -->


				<div class="c-modal-footer">
					<div class="buttonSet">
						<button class="btn-c-modal btn-cancel" @click="closePop">취소</button>
						<button class="btn-c-modal" @click="updateInstanceType()">편집</button>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
<%--/// modify modal --%>

<script src="/js/castanets/admin/instanceTypes.js" type="text/javascript"></script>
<script src="/js/castanets/admin/createInstanceType.js" type="text/javascript"></script>
<script src="/js/castanets/admin/updateInstanceType.js" type="text/javascript"></script>