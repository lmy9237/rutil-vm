<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="templateEditInfo">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>템플릿 편집</h3>
			</div>

			<div class="text-right">
				<div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" v-on:click="goBack()">취소</button>
						<button type="submit" class="btn btn-success" v-on:click="updateTemplate()">편집</button>
					</div>
				</div>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>일반</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<br />
						<div class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">클러스터</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select v-model="cluster" class="form-control">
										<option v-for="cluster in templateEditInfo.clusters"
											v-bind:value="cluster.id">{{cluster.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">기반 템플릿</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select disabled class="form-control">
										<option >
											{{templateEditInfo.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">운영시스템</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select v-model="templateEditInfo.operatingSystem" class="form-control">
										<option v-for="operatingSystem in templateEditInfo.operatingSystems"
											v-bind:value="operatingSystem.name">
											{{operatingSystem.description}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">최적화 옵션</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.type">
										<option value="desktop">데스크탑</option>
										<option value="server">서버</option>
										<option value="high_performance">고성능</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">이름</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" :disabled="templateEditInfo.subName != 'base version'" @input="checkTemplateName" v-model="templateEditInfo.name" placeholder="이름" :maxlength="this.$maxName">
									<p class="text-danger" v-if="(templateNameStatus || validTemplateName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">하위 버전 이름</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-if="templateEditInfo.subName != 'base version'" @input="checkSubTemplateName" v-model="templateEditInfo.subName" :maxlength="this.$maxName">
									<input type="text" class="form-control" v-if="templateEditInfo.subName == 'base version'" value="base version" disabled>
									<p class="text-danger" v-if="(subTemplateNameStatus || validSubTemplateName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="templateEditInfo.description" placeholder="설명" :maxlength="this.$maxDescription">
								</div>
							</div>
							<%--<hr>--%>
							<%--<div class="form-group">--%>
								<%--<div class="checkbox">--%>
									<%--<label> <input type="checkbox" v-model="templateEditInfo.stateless"> 상태 비저장</label>--%>
								<%--</div>--%>
								<%--<div class="checkbox">--%>
									<%--<label> <input type="checkbox" v-model="templateEditInfo.startInPause"> 일시정지 모드에서 시작</label>--%>
								<%--</div>--%>
								<%--<div class="checkbox">--%>
									<%--<label> <input type="checkbox" v-model="templateEditInfo.deleteProtection"> 삭제 방지</label>--%>
								<%--</div>--%>
							<%--</div>--%>
						</div>
					</div>
				</div>
				<div class="x_panel">
					<div class="x_title">
						<h2>콘솔</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<br />
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">그래픽프로토콜</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" disabled>
										<option>VNC</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">USB 지원</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" disabled>
										<option>비활성화됨</option>
										<option>활성화됨</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">콘솔
									분리 작업</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.disconnectAction" disabled>
										<option value="NONE">동작 없음</option>
										<option value="LOCK_SCREEN">화면 잠금</option>
										<option value="LOGOUT">사용자 로그아웃</option>
										<option value="SHUTDOWN">가상 머신 종료</option>
										<option value="REBOOT">가상 머신 재부팅</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">모니터</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.monitors" disabled>
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="4">4</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">단일로그인방식</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" disabled>
										<option>단일 로그인 비활성화</option>
										<option selected>게스트 에이전트 사용</option>
									</select>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 시스템 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;시스템&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br />
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">메모리 크기</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="memory" @change="memoryChange()">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">최대 메모리
									<a data-toggle="tooltip" title="메모리 핫 플러그를 실핼할 수 있는 가상머신 메모리 상한"><i class="fa fa-info-circle"></i></a>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control"
										v-model="maximumMemory"
										@change="maximumMemoryChange()">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">
									총 가상 CPU <a data-toggle="tooltip"
									title="소켓 수를 변경하여 CPU를 핫애드합니다. CPU 핫애드가
									올바르게 지원되는지 확인하려면 게스트 운영 체제 관련 문서를 참조하십시오">
										<i class="fa fa-info-circle"></i>
								</a>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="totalCpu">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">가상
									소켓 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="virtualSockets" @change="selectVirtualSockets()">
										<option v-for="divisor in divisors" :value="divisor">{{divisor}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">가상
									소켓 당 코어 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="coresPerVirtualSocket" @change="selectCoresPerVirtualSocket()">
										<option v-for="divisor in divisors" :value="divisor">{{divisor}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">
									코어 당 스레드
									<a data-toggle="tooltip" title="동시 멀티스레딩을 설정합니다. 값을 변경하기 전 호스트 아키텍처를
									확인합니다. 설정 값이 확실하지 않은 경우 코어당 스레드 수를 1로 설정합니다. 다음과 같은 값을 사용할 것을 권장합니다.
									- x86: 1 - power8: 1..8(높은 로드의 가상 머신의 경우 8)"><i class="fa fa-info-circle"></i></a>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="threadsPerCore" @change="selectThreadsPerCore()">
										<option v-for="divisor in divisors" :value="divisor">{{divisor}}</option>
									</select>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 호스트 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;호스트&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br/>
						<p>
							<strong>실행 호스트</strong>
						</p>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<div class="radio">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label> <input type="radio" name="pickHost" v-model="pickHost" value="recommendHost"> 클러스터 내의 호스트(심포니 추천) </label>
									</div>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" v-model="recommendHost" :disabled="pickHost === 'targetHost'">
											<option v-for="host in recommendHosts" v-bind:value="host[0]">{{host[1]}}</option>
										</select>
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="radio">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label> <input type="radio" name="pickHost" v-model="pickHost" value="targetHost"> 특정 호스트 </label>
									</div>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" v-model="targetHost" :disabled="pickHost === 'recommendHost'">
											<option v-for="host in templateEditInfo.hosts" v-if="host.clusterId === cluster" v-bind:value="host.hostId">{{host.hostName}}</option>
										</select>
									</div>
								</div>
							</div>
							<hr>
							<p>
								<strong>마이그레이션 옵션 </strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션 모드
									<a data-toggle="tooltip" title="최소 활성화된 하나의 가상 머신 디스크가 SCSI 예약을 사용할 경우
										마이그레이션 옵션이 무시되어 가상 머신을 마이그레이션 할 수 없습니다."><i class="fa fa-info-circle"></i></a></label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" v-model="templateEditInfo.affinity">
											<option value="migratable">수동 및 자동 마이그레이션 허용</option>
											<option value="user_migratable">수동 마이그레이션만 허용</option>
											<option value="pinned">마이그레이션을 허용하지 않음</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<div class="checkbox">
										<div class="col-md-5 col-sm-5 col-xs-12">
											<label>
												<input type="checkbox" v-model="templateEditInfo.customMigrationUsed">
												사용자 정의 마이그레이션 정책 사용
											</label>
											<a data-toggle="tooltip" title="마이그레이션 수렴을 처리하는 정책을 표시합니다. 
												마이그레이션 정책이 없을 경우 하이퍼바이저가 수렴을 처리합니다."><i class="fa fa-info-circle"></i></a>
										</div>
										<div class="col-md-7 col-sm-7 col-xs-12">
											<select class="form-control" :disabled="!templateEditInfo.customMigrationUsed" v-model="templateEditInfo.customMigration">
												<option>Legacy</option>
												<option>Minimal downtime</option>
												<option>Post-copy migration</option>
												<option>Suspend workload if needed</option>
											</select>
										</div>
									</div>
								</div>

								<div class="form-group">
									<div class="checkbox">
										<div class="col-md-5 col-sm-5 col-xs-12">
											<label><input type="checkbox"
												:disabled="!templateEditInfo.customMigrationUsed"
												v-model="templateEditInfo.customMigrationDowntimeUsed"> 사용자 정의 마이그레이션 다운 타임
												사용</label> <a data-toggle="tooltip"
												title="라이브 마이그레이션 도중 가상 머신이 정지 상태에 있을 수 있는 
												최대 시간을 밀리 초 단위로 표시합니다. 값이 0인것은 VDSM 기본값이 사용되고 있음을 의미합니다. (현재 engine 전체의 
												기본값은 0 밀리 초 입니다.)"><i
												class="fa fa-info-circle"></i></a>
										</div>
										<div class="col-md-7 col-sm-7 col-xs-12">
											<input type="text" class="form-control" placeholder=""
												:disabled="!templateEditInfo.customMigrationDowntimeUsed || !templateEditInfo.customMigrationUsed"
												v-model="templateEditInfo.customMigrationDowntime">
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션
										자동 통합 </label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" :disabled="!templateEditInfo.customMigrationUsed" v-model="templateEditInfo.autoConverge">
											<option value="inherit" selected>클러스터 설정에서 가져오기</option>
											<option value="true">자동 통합</option>
											<option value="false">자동 통합 해제</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션
										압축 활성화 </label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" :disabled="!templateEditInfo.customMigrationUsed" v-model="templateEditInfo.compressed">
											<option value="inherit" selected>클러스터 설정에서 가져오기</option>
											<option value="true">압축</option>
											<option value="false">압축 해제</option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<div class="checkbox">
										<div class="col-md-5 col-sm-5 col-xs-12">
											<label> <input type="checkbox" class="flat" :disabled="templateEditInfo.affinity != 'pinned'">
												호스트 CPU 통과
											</label>
										</div>
									</div>
								</div>
							</form>
						</form>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 초기실행 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;초기실행&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br/>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<div class="checkbox">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label> <input type="checkbox" v-model="useCloudInit">
											Cloud-Init/Sysprep 사용
										</label>
									</div>
								</div>
							</div>
						</form>
						<form class="form-horizontal form-label-left" v-show="templateEditInfo.useCloudInit">
							<hr>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">가상 머신의 호스트 이름 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<input type="text" class="form-control" v-model="templateEditInfo.hostName">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">시간대
									설정 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.timezone" disabled>
										<option value="Asia/Seoul">(GMT+09:00) Korea Standard Time</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">사용자 지정 스크립트
									<a data-toggle="tooltip" title="가상 머신 시작 시 가상 머신에서 실행되는 사용자 정의 스크립트입니다. 
										이 필드에 입력되는 스크립트는 사용자 정의 YAML 섹션으로 관리자에 의해 생성된 스크립트에 추가되며 사용자 및 파일 생성, yum 
										리포지터리 설정, 명령 실행과 같은 작업을 자동화할 수 있습니다."><i class="fa fa-info-circle"></i>
									</a>
								</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<textarea class="form-control" rows="5" v-model="templateEditInfo.customScript"></textarea>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 고가용성 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;고가용성&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br />
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<div class="checkbox">
									<div class="col-md-5 col-sm-5 col-xs-12">
										<label> <input type="checkbox" v-model="highAvailability">
											고가용성 사용
										</label>
									</div>
								</div>
							</div>
						</form>
						<hr>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">가상머신
									임대 대상 스토리지 도메인 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.leaseStorageDomain" :disabled="!highAvailability">
										<option value="">가상 머신 임대 없음</option>
										<option v-for="storageDomain in templateEditInfo.leaseStorageDomains" :value="storageDomain.id">{{storageDomain.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">재개
									동작 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.resumeBehaviour">
										<option value="auto_resume">AUTO_RESUME</option>
										<option value="leave_paused">LEAVE_PAUSED</option>
										<option value="kill">KILL</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">실행/마이그레이션
									큐에서 우선 순위 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.priority">
										<option value="1">낮음</option>
										<option value="50">중간</option>
										<option value="100">높음</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">워치독
									모델 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.watchdogModel">
										<option value="">감시 장치 없음</option>
										<option value="i6300esb">i6300esb</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">워치독
									작업 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="templateEditInfo.watchdogAction" :disabled="templateEditInfo.watchdogModel == ''">
										<option value="none">없음</option>
										<option value="reset">재설정</option>
										<option value="poweroff">전원 끄기</option>
										<option value="dump">덤프</option>
										<option value="pause">일시중지</option>
									</select>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 부트옵션 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;부트옵션&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none;">
						<br />
						<p>
							<strong>부트순서</strong>
						</p>
						<hr>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">첫
									번째 장치 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="firstDevice">
										<option v-for="device in firstDevices" :value="device.value">{{device.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">두
									번째 장치 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="secondDevice">
										<option v-for="device in secondDevices" :value="device.value"
										v-if="firstDevice != device.value">{{device.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox">
									<div class="col-md-3 col-sm-3 col-xs-12">
										<label> <input type="checkbox" v-model="bootImageUse">CD/DVD
											연결
										</label>
									</div>
									<div class="col-md-9 col-sm-9 col-xs-12">
										<select class="form-control" v-model="templateEditInfo.bootImage" :disabled="!templateEditInfo.bootImageUse">
											<option v-for="image in templateEditInfo.bootImages" :value="image.id">{{image.name}}</option>
										</select>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 리소스 할당 -->
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<a class="collapse-link">
						<div class="text-center">
							<h2>
								<strong>&#91;리소스 할당&#93;</strong>
							</h2>
							<div class="clearfix"></div>
						</div>
					</a>
					<div class="x_content" style="display: none">
						<br />
						<p>
							<strong>CPU 할당 </strong>
						</p>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">CPU 프로파일</label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<input class="form-control" v-model="cpuProfile" disabled>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">CPU 공유</label>
								<div class="col-md-4 col-sm-4 col-xs-12">
									<select class="form-control" v-model="cpuShare">
										<option value="0">비활성화됨</option>
										<option value="512">낮음</option>
										<option value="1024">중간</option>
										<option value="2048">높음</option>
									</select>
								</div>
								<div class="col-md-3 col-sm-3 col-xs-12">
									<input class="form-control" v-model="templateEditInfo.cpuShare" disabled>
								</div>
							</div>
							<hr>
							<p>
								<strong>메모리 할당 </strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<label class="control-label col-md-5 col-sm-5 col-xs-12">할당할
										실제 메모리 </label>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<input class="form-control" v-model="physicalMemory" @change="physicalMemoryChange()">
									</div>
								</div>
								<div class="form-group">
									<div class="checkbox">
										<label> <input type="checkbox" v-model="templateEditInfo.memoryBalloon">
											메모리 Balloon 장치 활성화
										</label>
									</div>
								</div>
							</form>
							<hr>
							<p>
								<strong>IO 스레드</strong>
							</p>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label> <input type="checkbox" v-model="ioThreadsEnabled">
											IO 스레드 활성화
										</label>
									</div>
								</div>
							</form>
							<hr>
							<form class="form-horizontal form-label-left">
								<div class="form-group">
									<div class="checkbox">
										<label>
											<input type="checkbox" v-model="templateEditInfo.virtioScsiEnabled">
											VirtlO-SCSI 활성화
											<a data-toggle="tooltip" title="가상 머신 실행 시 VirtIO-SCSI 컨트롤러를 연결합니다."><i class="fa fa-info-circle"></i></a>
										</label>
									</div>
								</div>
							</form>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/compute/updateTemplate.js" type="text/javascript"></script>