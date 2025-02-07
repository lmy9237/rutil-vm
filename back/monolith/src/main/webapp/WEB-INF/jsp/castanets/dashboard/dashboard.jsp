<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="cont-wrap" id="dashboard">
	<!-- loading -->
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="cont-inner long" v-show="!spinnerOn">
		<div class="doc-list-wrap">
			<div class="doc-tit mb-0">
				<h2 class="tit" style="color: #000">대시보드</h2>
			</div>
			<div class="dab-stat">
				<ul class="dat-statlist">
					<li><span class="d-stat-per stat-lack"></span>부족</li>
					<li><span class="d-stat-per stat-fitness"></span>적합</li>
					<li><span class="d-stat-per stat-enough"></span>위험</li>
				</ul>
			</div>

			<div class="dab-header">
				<div class="dab-header-box left">
					<div class="dab-header-wrap violet-round">
						<div class="dab-header-item">
							<div class="dhi-header">
								<p class="tit">전체 호스트 상태</p>
							</div>
							<div class="dhi-body">
								<span class="ico up"></span>
								<div>
									<a href="/compute/hosts?status=up" class="num em">{{dataCenter.hostsUp}}</a>
									<span class="num slash">/</span>
									<a href="/compute/hosts?status=down" class="num">{{dataCenter.hostsDown}}</a>
								</div>
								<span class="ico down"></span>
							</div>
						</div>
					</div><!-- //전체 호스트 상태 -->
					<div class="dab-header-wrap violet-round">
						<div class="dab-header-item">
							<div class="dhi-header">
								<p class="tit">전체 가상머신 상태</p>
							</div>
							<div class="dhi-body">
								<span class="ico up"></span>
								<div>
									<a href="/compute/vms?status=up" class="num em">{{dataCenter.vmsUp}}</a>
									<span class="num slash">/</span>
									<a href="/compute/vms?status=down" class="num">{{dataCenter.vmsDown}}</a>
								</div>
								<span class="ico down"></span>
							</div>
						</div>
					</div><!-- //전체 가상머신 상태 -->
				</div>

				<div class="dab-header-box right violet-round">
					<div class="dab-header-item">
						<div class="dhi-header">
							<p class="tit">CPU</p>
							<p class="txt">cores</p>
						</div>
						<div class="dhi-body">
							<div class="dhi-tbl">
								<div class="dhi-tbc">
<%--									<span class="txt">사용량</span>--%>
									<span class="num em">{{dataCenter.usingcpu}}</span>
								</div>
								<div class="dhi-tbc">
									<span class="num slash">/</span>
								</div>
								<div class="dhi-tbc">
									<span class="num">{{dataCenter.totalcpu}}</span>
<%--									<span class="txt">전체</span>--%>
								</div>
							</div>
						</div>
					</div><!-- //CPU -->

					<div class="dab-header-item">
						<div class="dhi-header">
							<p class="tit">메모리</p>
							<p class="txt">GB</p>
						</div>
						<div class="dhi-body">
							<div class="dhi-tbl">
								<div class="dhi-tbc">
<%--									<span class="txt">사용량</span>--%>
									<span class="num em">{{getMemoryTotal() - getMemoryFree()}}</span>
								</div>
								<div class="dhi-tbc">
									<span class="num slash">/</span>
								</div>
								<div class="dhi-tbc">
									<span class="num">{{getMemoryTotal()}}</span>
<%--									<span class="txt">전체</span>--%>
								</div>
							</div>
						</div>
					</div><!-- //메모리 -->

					<div class="dab-header-item">
						<div class="dhi-header">
							<p class="tit">스토리지</p>
							<p class="txt">TB</p>
						</div>
						<div class="dhi-body">
							<div class="dhi-tbl">
								<div class="dhi-tbc">
<%--									<span class="txt">사용량</span>--%>
									<span class="num em">{{ (getStorageTotal() - getStorageFree()).toFixed(1)}}</span>
								</div>
								<div class="dhi-tbc">
									<span class="num slash">/</span>
								</div>
								<div class="dhi-tbc">
									<span class="num">{{getStorageTotal()}}</span>
<%--									<span class="txt">전체</span>--%>
								</div>
							</div>
						</div>
					</div><!-- //스토리지 -->
					<div class=" etc_tit">전체 / 사용량</div>

				</div>
			</div>
			<!-- //전체 호스트 상태 + 전체 가상머신 상태 + CPU + 메모리 + 스토리지 -->

			<div class="dab-body">
				<div class="dab-cont-wrap dc-left">
					<h2 class="doc-tit-m">전체 사용량</h2>
					<div class="dab-donut-wrap violet-round">
						<div class="dab-donut-item">
							<div class="donut-tbl"  v-show="isHistory">
								<div class="donut-tbc">
									<p class="donut-tit">CPU</p>
									<div class="donut-wrap lack" id="cpu_donut-chart">
										<!-- donut-wrap 클래스 정리
                                            부족 : lack
                                            적합 : fitness
                                            위험 : enough
                                        -->
										<svg width="96" height="96">
											<circle r="48" cx="48" cy="48" />
										</svg>
										<div class="donut-inner"><span><span class="num" data-num="20">{{(dataCenter.usingcpu / dataCenter.totalcpu *100).toFixed()}}</span><span class="unit">%</span></span><span class="reUnit">{{dataCenter.totalcpu}} cores</span></div>
									</div>
								</div>
							</div>
							<div v-if="isHistory" class="donut-btm-txt">사용가능 <span class="em">{{(dataCenter.totalcpu != null && dataCenter.usingcpu != null) ? (dataCenter.totalcpu - dataCenter.usingcpu) : '-'}} cores</span></div>
							<div v-if="!isHistory">
								<div class="card-wrap" style="width : 100%;" h>
									<div class="card-body">
										<div class="card-ing">
											<div class="donut-wrap ing">
												<svg width="92" height="92">
													<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />
												</svg>
												<div class="donut-inner"></div>
											</div>
											<div class="num">0%</div>
											<div class="loader">
												<div class="loader_bg">
													<div class="loader_bx">
														<i class="loader_circle"></i>
														<span>조회중...</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- //CPU -->

						<div class="dab-donut-item">
							<div class="donut-tbl" v-show="isHistory">
								<div class="donut-tbc">
									<p class="donut-tit">메모리</p>
									<div class="donut-wrap fitness" id="memory_donut-chart">
										<!-- donut-wrap 클래스 정리
                                            부족 : lack
                                            적합 : fitness
                                            위험 : enough
                                        -->
										<svg width="96" height="96">
											<circle r="48" cx="48" cy="48" />
										</svg>
										<div class="donut-inner"><span><span class="num" data-num="38">{{(dataCenter.memoryUsed / dataCenter.memoryTotal * 100).toFixed()}}</span><span class="unit">%</span></span><span class="reUnit">{{getMemoryTotal()}} GB</span></div>
									</div>
								</div>
							</div>
							<div  v-if="isHistory" class="donut-btm-txt">사용가능 <span class="em">{{getMemoryFree()}} GB</span></div>
							<div v-if="!isHistory">
								<div class="card-wrap" style="width : 100%;" h>
									<div class="card-body">
										<div class="card-ing">
											<div class="donut-wrap ing">
												<svg width="92" height="92">
													<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />
												</svg>
												<div class="donut-inner"></div>
											</div>
											<div class="num">0%</div>
											<div class="loader">
												<div class="loader_bg">
													<div class="loader_bx">
														<i class="loader_circle"></i>
														<span>조회중...</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- //메모리 -->

						<div class="dab-donut-item">
							<div class="donut-tbl"  v-show="isHistory">
								<div class="donut-tbc">
									<p class="donut-tit">스토리지</p>
									<div class="donut-wrap enough" id="storage_donut-chart">
										<!-- donut-wrap 클래스 정리
                                            부족 : lack
                                            적합 : fitness
                                            위험 : enough
                                        -->
										<svg width="96" height="96">
											<circle r="48" cx="48" cy="48" />
										</svg>
										<div class="donut-inner"><span><span class="num" data-num="75">{{(dataCenter.storageUsed / (dataCenter.storageAvaliable + dataCenter.storageUsed) * 100).toFixed()}}</span><span class="unit">%</span></span><span class="reUnit">{{getStorageTotal()}} TB</span></div>
									</div>
								</div>
							</div>
							<div v-if="isHistory" class="donut-btm-txt">사용가능 <span class="em">{{getStorageFree()}} TB</span></div>
							<div v-if="!isHistory">
								<div class="card-wrap" style="width : 100%;" h>
									<div class="card-body">
										<div class="card-ing">
											<div class="donut-wrap ing">
												<svg width="92" height="92">
													<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />
												</svg>
												<div class="donut-inner"></div>
											</div>
											<div class="num">0%</div>
											<div class="loader">
												<div class="loader_bg">
													<div class="loader_bx">
														<i class="loader_circle"></i>
														<span>조회중...</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- //스토리지 -->

					</div>
				</div>
				<!-- //전체 사용량 -->

				<div class="dab-cont-wrap dc-right">
					<h2 class="doc-tit-m">사용량 TOP3</h2>
					<div class="csb-h-wrap">
						<div class="csb-box left">
							<div class="csb-head">
								<p>가상머신<span class="em">CPU</span></p>
							</div>
							<ul class="chart-style-bar" v-for="vm in vmTop">
								<li style="opacity: 1; transition-delay: 50ms;">
									<%-- 이름 --%>
									<div class="yAxis"><span>{{vm.vmCpuKey[0]}}</span></div>
									<%-- bgBar --%>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(vm.vmCpuVal[0])" :style="getBarVal(vm.vmCpuVal[0])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
										<%-- 사용량 --%>
									<div class="valPer"><span class="num">{{vm.vmCpuVal[0]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 100ms;">
									<%-- 이름 --%>
									<div class="yAxis"><span>{{vm.vmCpuKey[1]}}</span></div>
									<%-- bgBar --%>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(vm.vmCpuVal[1])" :style="getBarVal(vm.vmCpuVal[1])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<%-- 사용량 --%>
									<div class="valPer"><span class="num">{{vm.vmCpuVal[1]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 150ms;">
									<%-- 이름 --%>
									<div class="yAxis"><span>{{vm.vmCpuKey[2]}}</span></div>
									<%-- bgBar --%>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(vm.vmCpuVal[2])" :style="getBarVal(vm.vmCpuVal[2])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<%-- 사용량 --%>
									<div class="valPer"><span class="num">{{vm.vmCpuVal[2]}}</span>%</div>
								</li>

							</ul>
						</div>
						<div class="csb-box right">
							<div class="csb-head">
								<p>가상머신<span class="em">메모리</span></p>
							</div>
							<ul class="chart-style-bar" v-for="vm in vmTop">
								<li style="opacity: 1; transition-delay: 200ms;">
									<div class="yAxis"><span>{{vm.vmMemoryKey[0]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(vm.vmMemoryVal[0])" :style="getBarVal(vm.vmMemoryVal[0])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{vm.vmMemoryVal[0]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 250ms;">
									<div class="yAxis"><span>{{vm.vmMemoryKey[1]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(vm.vmMemoryVal[1])" :style="getBarVal(vm.vmMemoryVal[1])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{vm.vmMemoryVal[1]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 300ms;">
									<div class="yAxis"><span>{{vm.vmMemoryKey[2]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(vm.vmMemoryVal[2])" :style="getBarVal(vm.vmMemoryVal[2])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{vm.vmMemoryVal[2]}}</span>%</div>
								</li>
							</ul>
						</div>
						<div class="csb-box left">
							<div class="csb-head">
								<p>호스트<span class="em">CPU</span></p>
							</div>
							<ul class="chart-style-bar" v-for="host in hostTop">
								<li style="opacity: 1; transition-delay: 350ms;">
									<div class="yAxis"><span>{{host.hostCpuKey[0]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(host.hostCpuVal[0])" :style="getBarVal(host.hostCpuVal[0])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{host.hostCpuVal[0]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 400ms;">
									<div class="yAxis"><span>{{host.hostCpuKey[1]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(host.hostCpuVal[1])" :style="getBarVal(host.hostCpuVal[1])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{host.hostCpuVal[1]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 450ms;">
									<div class="yAxis"><span>{{host.hostCpuKey[2]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(host.hostCpuVal[2])" :style="getBarVal(host.hostCpuVal[2])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{host.hostCpuVal[2]}}</span>%</div>
								</li>
							</ul>
						</div>
						<div class="csb-box right">
							<div class="csb-head">
								<p>호스트<span class="em">메모리</span></p>
							</div>
							<ul class="chart-style-bar" v-for="host in hostTop">
								<li style="opacity: 1; transition-delay: 500ms;">
									<div class="yAxis"><span>{{host.hostMemoryKey[0]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(host.hostMemoryVal[0])" :style="getBarVal(host.hostMemoryVal[0])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{host.hostMemoryVal[0]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 550ms;">
									<div class="yAxis"><span>{{host.hostMemoryKey[1]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(host.hostMemoryVal[1])" :style="getBarVal(host.hostMemoryVal[1])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{host.hostMemoryVal[1]}}</span>%</div>
								</li>
								<li style="opacity: 1; transition-delay: 600ms;">
									<div class="yAxis"><span>{{host.hostMemoryKey[2]}}</span></div>
									<div class="canvasWrap">
													<span class="bgBar">
														<span class="gaugebar" :class="getLevelColor(host.hostMemoryVal[2])" :style="getBarVal(host.hostMemoryVal[2])"></span>
														<!-- gaugebar 클래스 정리
															부족 : lack
															적합 : fitness
															충분 : enough
														-->
													</span>
									</div>
									<div class="valPer"><span class="num">{{host.hostMemoryVal[2]}}</span>%</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!-- //사용량 TOP3 -->

				<div class="dab-cont-wrap dc-left">
					<h2 class="doc-tit-m">가상머신</h2>
					<div class="csb-h-wrap">
						<!-- 카드반복 시작 : 왼쪽은 클래스 left, 오른쪽은 클래스 right -->
<%--						<div class="csb-boxB left" v-for="(vm, idx) in vms">--%>
						<div class="csb-boxB" :class="getCardPosition(idx)" v-for="(vm, idx) in pagingVo.viewListVm">
<%--						<div class="csb-boxB left" v-for="(vm, idx) in pagingVo.dataListVm">--%>
							<div class="frontBox">
								<div class="csb-header">
									<div class="csb-header-tbc">
										<span class="csb-statIco" :class="getHostLevelColor((vm.cpuUsage == null ? 0 : (vm.cpuUsage.length == 0 ? 0 :vm.cpuUsage[0][1])) , (vm.memoryUsage == null ? 0 : (vm.memoryUsage.length == 0 ? 0 :vm.memoryUsage[0][1])) , (vm.networkUsage == null ? 0 : (vm.networkUsage.length == 0 ? 0 :vm.networkUsage[0][1])) )"></span>
										<!-- csb-statIco 클래스 정리
                                            부족 : lack
                                            적합 : fitness
                                            충분 : enough
                                        -->
										<p class="tit">{{vm.name}}</p>

									</div>
									<div class="csb-header-tbc btnHas">
										<button class="btn-rotate open"></button>
									</div>
								</div>
								<div class="csb-body">
									<div class="csb-body-list">
										<ul class="chart-style-bar">
											<li style="opacity: 1;">
												<div class="yAxis"><span>CPU</span></div>
												<div class="canvasWrap">
																<span class="bgBar">
																	<span class="gaugebar" :class="getLevelColor(vm.cpuUsage == null ? 0 : (vm.cpuUsage.length == 0 ? 0 :vm.cpuUsage[0][1]))" :style="getBarVal(vm.cpuUsage == null ? 0 : (vm.cpuUsage.length == 0 ? 0 :vm.cpuUsage[0][1]))"></span>
																	<!-- gaugebar 클래스 정리
																		부족 : lack
																		적합 : fitness
																		충분 : enough
																	-->
																</span>
												</div>
												<div class="valPer"><span class="num">{{vm.cpuUsage == null ? 0 : (vm.cpuUsage.length == 0 ? 0 :vm.cpuUsage[0][1])}}</span>%</div>
											</li>
											<li style="opacity: 1;">
												<div class="yAxis"><span>메모리</span></div>
												<div class="canvasWrap">
																<span class="bgBar">
																	<span class="gaugebar" :class="getLevelColor(vm.memoryUsage == null ? 0 : (vm.memoryUsage.length == 0 ? 0 :vm.memoryUsage[0][1]))" :style="getBarVal(vm.memoryUsage == null ? 0 : (vm.memoryUsage.length == 0 ? 0 :vm.memoryUsage[0][1]))"></span>
																	<!-- gaugebar 클래스 정리
																		부족 : lack
																		적합 : fitness
																		충분 : enough
																	-->
																</span>
												</div>
												<div class="valPer"><span class="num">{{vm.memoryUsage == null ? 0 : (vm.memoryUsage.length == 0 ? 0 :vm.memoryUsage[0][1])}}</span>%</div>
											</li>
											<li style="opacity: 1;">
												<div class="yAxis"><span>네트워크</span></div>
												<div class="canvasWrap">
																<span class="bgBar">
																	<span class="gaugebar" :class="getLevelColor(vm.networkUsage == null ? 0 : (vm.networkUsage.length == 0 ? 0 :vm.networkUsage[0][1]))" :style="getBarVal(vm.networkUsage == null ? 0 : (vm.networkUsage.length == 0 ? 0 :vm.networkUsage[0][1]))"></span>
																	<!-- gaugebar 클래스 정리
																		부족 : lack
																		적합 : fitness
																		충분 : enough
																	-->
																</span>
												</div>
												<div class="valPer"><span class="num">{{vm.networkUsage == null ? 0 : (vm.networkUsage.length == 0 ? 0 :vm.networkUsage[0][1])}}</span>%</div>
											</li>
										</ul>
									</div>
									<div class="csb-body-btm" >
										<div class="csb-body-btmItem">
											<p class="tit">호스트</p>
											<p class="txt">{{vm.hostName == null? '-' : (vm.hostName)}}</p>
										</div>
										<div class="csb-body-btmItem">
											<p class="tit">IP 주소</p>
											<p class="txt">{{vm.ipv4}}</p>
										</div>
									</div>
								</div>
							</div>
							<div class="backBox">
								<div class="csb-header">
									<div class="csb-header-tbc">
										<span class="csb-statIco lack"></span>
										<!-- csb-statIco 클래스 정리
                                            부족 : lack
                                            적합 : fitness
                                            충분 : enough
                                        -->
										<p class="tit">{{vm.name}}</p>

									</div>
									<div class="csb-header-tbc btnHas">
										<button class="btn-rotate close"></button>
									</div>
								</div>
								<div class="csb-body">
									<div class="csb-body-sec">
										<div class="csb-body-flex">
											<div class="csb-body-fitem">
												<p class="tit">할당할 실제 메모리</p>
												<p class="txt">{{vm.vmSystem.guaranteedMemory}}</p>
											</div>
											<div class="csb-body-fitem">
												<p class="tit">설정된 메모리</p>
												<p class="txt">{{vm.vmSystem.definedMemory}}</p>
											</div>
											<div class="csb-body-fitem">
												<p class="tit">CUP 코어 수</p>
												<p class="txt">{{vm.vmSystem.totalVirtualCpus}}(
													{{vm.vmSystem.virtualSockets}}:
													{{vm.vmSystem.coresPerVirtualSocket}}:
													{{vm.vmSystem.threadsPerCore}})</p>
											</div>
										</div>
										<div class="csb-body-flex">
											<div class="csb-body-fitem full">
												<p class="tit">OS 정보</p>
												<p class="txt">{{vm.os == null ? '-' : vm.os}}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- //카드반복 끝 -->
						<pagination-component :flag="'vms'" :dataList="vms" :size="4" v-on:setviewlist="setViewList"></pagination-component>
					</div>
				</div>
				<!-- //가상머신 -->

				<div class="dab-cont-wrap dc-right">
					<h2 class="doc-tit-m">호스트</h2>
					<div class="csb-h-wrap">
						<!-- 카드반복 시작 : 왼쪽은 클래스 left, 오른쪽은 클래스 right -->
						<div class="csb-boxB" :class="getCardPosition(idx)" v-for="(host, idx) in pagingVo.viewListHost">
<%--						<div class="csb-boxB left" v-for="(host, idx) in hosts">--%>
<%--						<div class="csb-boxB left" v-for="(host, idx) in pagingVo.dataListHost">--%>
							<div class="frontBox">
								<div class="csb-header">
									<div class="csb-header-tbc">
										<span class="csb-statIco" :class="getHostLevelColor( ((host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.cpuUsagePercent == null ) ? '0' :
																						host.hostLastUsage.cpuUsagePercent), ((host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.memoryUsagePercent == null ) ? '0' :
																						host.hostLastUsage.memoryUsagePercent), (totalNicsUsage(host.hostNicsLastUsage)) )"></span>
										<!-- csb-statIco 클래스 정리
                                            부족 : lack
                                            적합 : fitness
                                            충분 : enough
                                        -->
										<p class="tit">{{host.name}}</p>

									</div>
									<div class="csb-header-tbc btnHas">
										<button class="btn-rotate open"></button>
									</div>
								</div>
								<div class="csb-body">
									<div class="csb-body-list">
										<ul class="chart-style-bar">
											<li style="opacity: 1;">
												<div class="yAxis"><span>CPU</span></div>
												<div class="canvasWrap">
																<span class="bgBar">
																	<span class="gaugebar" :class="getLevelColor((host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.cpuUsagePercent == null ) ? '0' :
																						host.hostLastUsage.cpuUsagePercent)" :style="getBarVal((host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.cpuUsagePercent == null ) ? '0' :
																						host.hostLastUsage.cpuUsagePercent)"></span>
																	<!-- gaugebar 클래스 정리
																		부족 : lack
																		적합 : fitness
																		충분 : enough
																	-->
																</span>
												</div>
												<div class="valPer"><span class="num">{{ (host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.cpuUsagePercent == null ) ? '0' :
																						host.hostLastUsage.cpuUsagePercent}}</span>%</div>
											</li>
											<li  style="opacity: 1;">
												<div class="yAxis"><span>메모리</span></div>
												<div class="canvasWrap">
																<span class="bgBar">
																	<span class="gaugebar" :class="getLevelColor((host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.memoryUsagePercent == null ) ? '0' :
																						host.hostLastUsage.memoryUsagePercent)" :style="getBarVal((host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.memoryUsagePercent == null ) ? '0' :
																						host.hostLastUsage.memoryUsagePercent)"></span>
																	<!-- gaugebar 클래스 정리
																		부족 : lack
																		적합 : fitness
																		충분 : enough
																	-->
																</span>
												</div>
												<div class="valPer"><span class="num">{{ (host.hostLastUsage == null || host.hostLastUsage == undefined ||
																						host.hostLastUsage.memoryUsagePercent == null ) ? '0' :
																						host.hostLastUsage.memoryUsagePercent}}</span>%</div>
											</li>
											<li  style="opacity: 1;">
												<div class="yAxis"><span>네트워크</span></div>
												<div class="canvasWrap">
																<span class="bgBar">
																	<span class="gaugebar" :class="getLevelColor(totalNicsUsage(host.hostNicsLastUsage))" :style="getBarVal(totalNicsUsage(host.hostNicsLastUsage))"></span>
																	<!-- gaugebar 클래스 정리
																		부족 : lack
																		적합 : fitness
																		충분 : enough
																	-->
																</span>
												</div>
												<div class="valPer"><span class="num">{{totalNicsUsage(host.hostNicsLastUsage)}}</span>%</div>
											</li>
										</ul>
									</div>
									<div class="csb-body-btm">
										<div class="csb-body-btmItem">
											<p class="tit">호스트 상태</p>
											<p class="txt">{{host.status}}</p>
										</div>
										<div class="csb-body-btmItem">
											<p class="tit">IP 주소</p>
											<p class="txt">{{host.address}}</p>
										</div>
									</div>
								</div>
							</div>
							<div class="backBox">
								<div class="csb-header">
									<div class="csb-header-tbc">
										<span class="csb-statIco lack"></span>
										<!-- csb-statIco 클래스 정리
                                            부족 : lack
                                            적합 : fitness
                                            충분 : enough
                                        -->
										<p class="tit">{{host.name}}</p>

									</div>
									<div class="csb-header-tbc btnHas">
										<button class="btn-rotate close"></button>
									</div>
								</div>
								<div class="csb-body">
									<div class="csb-body-sec">
										<div class="csb-body-flex">
											<div class="csb-body-fitem">
												<p class="tit">물리적 메모리</p>
												<p class="txt">{{ (host.memoryTotal / Math.pow(1024, 3)).toFixed(1) }}GB</p>
											</div>
											<div class="csb-body-fitem">
												<p class="tit">스왑 메모리</p>
												<p class="txt">{{ (host.swapTotal / Math.pow(1024, 3)).toFixed(1) }}GB</p>
											</div>
											<div class="csb-body-fitem">
												<p class="tit">CUP 코어 수</p>
												<p class="txt">{{host.cpuSockets * host.cpuCores * host.cpuThreads}} ( {{host.cpuSockets}} :
													{{host.cpuCores}} : {{host.cpuThreads}} )</p>
											</div>
										</div>
										<div class="csb-body-flex">
											<div class="csb-body-fitem full">
												<p class="tit">OS 정보</p>
												<p class="txt">{{ (host.hostSw == null || host.hostSw.hostOs == null) ? '' : host.hostSw.hostOs}}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- //카드반복 끝 -->
						<pagination-component :flag="'hosts'" :dataList="hosts" :size="4" v-on:setViewList="setViewList"></pagination-component>
					</div>
				</div>
				<!-- //호스트 -->

				<div class="dab-cont-wrap dc-left">
					<div class="dab-chart-sec">
						<h2 class="doc-tit-m">CPU 사용률</h2>
						<ul class="dab-chart-label">
							<li><span class="labelColor" style="background-color: #2231a9;"></span>CPU</li>
<%--							<li><span class="labelColor" style="background-color: #7d87ff;"></span>CPU2</li>--%>
<%--							<li><span class="labelColor" style="background-color: #a6e6ff;"></span>CPU3</li>--%>
						</ul>
						<div class="dab-chart-wrap" v-show= "isChart">
							<div class="dab-chart-inner">
								<div class="dab-chart-cont" id="cpuUsage_chart"></div>
							</div>
						</div>
						<div v-if="!isChart">
							<div class="card-wrap" style="width : 100%;" h>
								<div class="card-body">
									<div class="card-ing">
										<div class="donut-wrap ing">
											<svg width="92" height="92">
												<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />
											</svg>
											<div class="donut-inner"></div>
										</div>
										<div class="num">0%</div>
										<div class="loader">
											<div class="loader_bg">
												<div class="loader_bx">
													<i class="loader_circle"></i>
													<span>조회중...</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="dab-chart-sec">
						<h2 class="doc-tit-m">메모리 사용률</h2>
						<div class="dab-chart-wrap" v-show= "isChart">
							<div class="dab-chart-inner">
								<div class="dab-chart-cont" id="memoryUsage_chart"></div>
							</div>
							<div v-if="!isChart">
								<div class="card-wrap" style="width : 100%;" h>
									<div class="card-body">
										<div class="card-ing">
											<div class="donut-wrap ing">
												<svg width="92" height="92">
													<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />
												</svg>
												<div class="donut-inner"></div>
											</div>
											<div class="num">0%</div>
											<div class="loader">
												<div class="loader_bg">
													<div class="loader_bx">
														<i class="loader_circle"></i>
														<span>조회중...</span>
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

				<div class="dab-cont-wrap dc-right">
					<div class="dab-chart-sec">
						<h2 class="doc-tit-m">네트워크 사용률</h2>
						<ul class="dab-chart-label">
							<li><span class="labelColor" style="background-color: #447bfe;"></span>수신</li>
							<li><span class="labelColor" style="background-color: #eab4ff;"></span>송신</li>
						</ul>
						<div class="dab-chart-wrap" v-show= "isChart">
							<div class="dab-chart-inner">
								<div class="dab-chart-cont" id="networkUsage_chart"></div>
							</div>
						</div>
						<div v-if="!isChart">
							<div class="card-wrap" style="width : 100%;" h>
								<div class="card-body">
									<div class="card-ing">
										<div class="donut-wrap ing">
											<svg width="92" height="92">
												<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />
											</svg>
											<div class="donut-inner"></div>
										</div>
										<div class="num">0%</div>
										<div class="loader">
											<div class="loader_bg">
												<div class="loader_bx">
													<i class="loader_circle"></i>
													<span>조회중...</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="dab-chart-sec">
						<h2 class="doc-tit-m">스토리지 사용률</h2>
						<div class="dab-chart-wrap" v-show= "isChart">
							<div class="dab-chart-inner">
								<div class="dab-chart-cont" id="storageUsage_chart"></div>
							</div>
						</div>
						<div v-if="!isChart">
							<div class="card-wrap" style="width : 100%;" h>
								<div class="card-body">
									<div class="card-ing">
										<div class="donut-wrap ing">
											<svg width="92" height="92">
												<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />
											</svg>
											<div class="donut-inner"></div>
										</div>
										<div class="num">0%</div>
										<div class="loader">
											<div class="loader_bg">
												<div class="loader_bx">
													<i class="loader_circle"></i>
													<span>조회중...</span>
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


		</div>
	</div>
</div>

<script src="/js/castanets/dashboard/dashboard.js" type="text/javascript"></script>
	