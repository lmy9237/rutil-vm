<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="newInstanceType">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>새 인스턴스 유형</h3>
			</div>

			<div class="text-right">
				<div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" v-on:click="goBack()">취소</button>
						<button class="btn btn-success" type="submit" v-on:click="createInstanceType()">생성</button>
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
								<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="newInstanceType.name" @input="checkInstanceName" placeholder="이름" :maxlength="this.$maxName" required>
									<p class="text-danger" v-if="(instanceNameStatus || validInstanceName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" v-model="newInstanceType.description" placeholder="설명">
								</div>
							</div>
							<hr>
							<p>
								<strong>vNIC 프로파일을 선택하여 가상 머신 네트워크 인터페이스를 인스턴스화합니다.</strong>
							</p>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">nic1</label>
								<div class="col-md-5 col-sm-5 col-xs-12">
									<select class="form-control" v-model="nic" disabled>
										<option value="">비어있음</option>
										<option v-for="nic in newInstanceType.nics" v-bind:value="nic">{{nic.networkName}}</option>
									</select>
								</div>
							</div>
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
								<label class="control-label col-md-3 col-sm-3 col-xs-12">모니터</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" disabled>
										<option>1</option>
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
									<input type="text" class="form-control" v-model="maximumMemory" @change="maximumMemoryChange()">
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
						<p>
							<strong>마이그레이션 옵션 </strong>
						</p>
						<hr>
						<form class="form-horizontal form-label-left">
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션 모드
								<a data-toggle="tooltip" title="최소 활성화된 하나의 가상 머신 디스크가 SCSI 예약을 사용할 경우
									마이그레이션 옵션이 무시되어 가상 머신을 마이그레이션 할 수 없습니다."><i class="fa fa-info-circle"></i></a></label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="newInstanceType.affinity">
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
											<input type="checkbox" v-model="newInstanceType.customMigrationUsed">
											사용자 정의 마이그레이션 정책 사용
										</label>
										<a data-toggle="tooltip" title="마이그레이션 수렴을 처리하는 정책을 표시합니다. 
											마이그레이션 정책이 없을 경우 하이퍼바이저가 수렴을 처리합니다."><i class="fa fa-info-circle"></i></a>
									</div>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<select class="form-control" :disabled="!newInstanceType.customMigrationUsed" v-model="newInstanceType.customMigration">
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
											:disabled="!newInstanceType.customMigrationUsed"
											v-model="newInstanceType.customMigrationDowntimeUsed"> 사용자 정의 마이그레이션 다운 타임
											사용</label> <a data-toggle="tooltip"
											title="라이브 마이그레이션 도중 가상 머신이 정지 상태에 있을 수 있는 
											최대 시간을 밀리 초 단위로 표시합니다. 값이 0인것은 VDSM 기본값이 사용되고 있음을 의미합니다. (현재 engine 전체의 
											기본값은 0 밀리 초 입니다.)"><i
											class="fa fa-info-circle"></i></a>
									</div>
									<div class="col-md-7 col-sm-7 col-xs-12">
										<input type="text" class="form-control" placeholder=""
											:disabled="!newInstanceType.customMigrationDowntimeUsed || !newInstanceType.customMigrationUsed"
											v-model="newInstanceType.customMigrationDowntime">
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-5 col-sm-5 col-xs-12">마이그레이션
									자동 통합 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" :disabled="!newInstanceType.customMigrationUsed" v-model="newInstanceType.autoConverge">
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
									<select class="form-control" :disabled="!newInstanceType.customMigrationUsed" v-model="newInstanceType.compressed">
										<option value="inherit" selected>클러스터 설정에서 가져오기</option>
										<option value="true">압축</option>
										<option value="false">압축 해제</option>
									</select>
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
								<label class="control-label col-md-5 col-sm-5 col-xs-12">실행/마이그레이션 큐에서 우선 순위 </label>
								<div class="col-md-7 col-sm-7 col-xs-12">
									<select class="form-control" v-model="newInstanceType.priority">
										<option value="1">낮음</option>
										<option value="50">중간</option>
										<option value="100">높음</option>
									</select>
								</div>
							</div>
							<%--<div class="form-group">--%>
								<%--<label class="control-label col-md-5 col-sm-5 col-xs-12">워치독--%>
									<%--모델 </label>--%>
								<%--<div class="col-md-7 col-sm-7 col-xs-12">--%>
									<%--<select class="form-control" v-model="newInstanceType.watchdogModel">--%>
										<%--<option value="none">감시 장치 없음</option>--%>
										<%--<option value="i6300esb">i6300esb</option>--%>
									<%--</select>--%>
								<%--</div>--%>
							<%--</div>--%>
							<%--<div class="form-group">--%>
								<%--<label class="control-label col-md-5 col-sm-5 col-xs-12">워치독 작업</label>--%>
								<%--<div class="col-md-7 col-sm-7 col-xs-12">--%>
									<%--<select class="form-control" v-model="newInstanceType.watchdogAction" :disabled="newInstanceType.watchdogModel == ''">--%>
										<%--<option value="none">없음</option>--%>
										<%--<option value="reset">재설정</option>--%>
										<%--<option value="poweroff">전원 끄기</option>--%>
										<%--<option value="dump">덤프</option>--%>
										<%--<option value="pause">일시중지</option>--%>
									<%--</select>--%>
								<%--</div>--%>
							<%--</div>--%>
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
						<form class="form-horizontal form-label-left">
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
										<label> <input type="checkbox" v-model="newInstanceType.memoryBalloon">
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
											<input type="checkbox" v-model="newInstanceType.virtioScsiEnabled">
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

<script src="/js/castanets/admin/createInstanceType.js" type="text/javascript"></script>