<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

        <!-- page content -->
        <div class="right_col" role="main" id="createClusterVue">
        
        	<spinner v-show="spinnerOn"></spinner>
		<div class="" v-show="!spinnerOn" v-cloak>
            <div class="page-title">
              <div class="title_left">
                <h3>{{isUpdate ? '클러스터 편집 [' + clusterName + ']' : '새 클러스터'}}</h3>
              </div>

              <div class="text-right">
                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" @click="goList()">취소</button>
						<button type="submit" class="btn btn-success" v-if="!isUpdate" @click="createCluster()">생성</button>
						<button type="submit" class="btn btn-success" v-if="isUpdate" @click="updateCluster()">편집</button>
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
                    <br />
                    <form class="form-horizontal form-label-left">
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" v-model="cluster.name" placeholder="이름" @input="checkClusterName" :maxlength="this.$maxName">
                          <p class="text-danger" v-if="clusterNameStatus || cluster.name == ''">기호는 '-', '_'만 사용가능합니다. 공백도 허용하지 않습니다.</p>
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control"  v-model="cluster.description" placeholder="설명" :maxlength="this.$maxDescription">
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">코멘트</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" v-model="cluster.comment" placeholder="코멘트" :maxlength="this.$maxDescription">
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">관리 네트워크 *</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control" v-model="cluster.networkId" :disabled="isUpdate">
                            <option value="">관리 네트워크 선택</option>
                            <option  v-for="network in networks"  v-bind:value="network.id">{{network.name}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">CPU 아키텍처</label>
                        <div class="col-md-9 col-sm-9 col-xs-12" >
                          <select class="form-control"  v-model="cluster.cpuArchitecture" :disabled="isUpdate">
                         	<!-- <option value="">CPU 아키텍처 선택</option> -->
                            <option  v-for="cpuArchitecture in cpuArchitectures"  v-bind:value="cpuArchitecture">{{cpuArchitecture}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">CPU 유형</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control"  v-model="cluster.cpuType">
                          	<option value="">CPU 유형 선택</option>
                          	<option  v-for="cpuType in cpuTypes"  v-bind:value="cpuType">{{cpuType}}</option>
                          </select>
                        </div>
                      </div>
                      <!-- <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">호환 버전</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control">
                            <option>Choose option</option>
                            <option>Option one</option>
                            <option>Option two</option>
                            <option>Option three</option>
                            <option>Option four</option>
                          </select>
                        </div>
                      </div> -->
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">스위치 유형</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control"  v-model="cluster.switchType" :disabled="isUpdate">
							<!-- <option value="">스위치 유형 선택</option> -->
                          	<option  v-for="switchType in switchTypes"  v-bind:value="switchType">{{switchType}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">방화벽 유형</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control"  v-model="cluster.firewallType">
							<!-- <option value="">방화벽 유형 선택</option> -->
                          	<option  v-for="firewallType in firewallTypes"  v-bind:value="firewallType">{{firewallType}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">기본 네트워크 공급자</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control"  v-model="cluster.networkProviderId">
							<!-- <option value="">기본 네트워크 공급자 선택</option> -->
                          	<option  v-for="networkProvider in networkProviders"  v-bind:value="networkProvider.id">{{networkProvider.name}}</option>
                          </select>
                        </div>
                      </div>
                      <!-- 
                      <div class="form-group">
                        <div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3" >
                          <div class="checkbox">
                            <label>
                              <input type="checkbox" class="flat" checked="checked"> Virt 서비스 활성화
                            </label>
                          </div>
                          <div class="checkbox">
                            <label>
                              <input type="checkbox" class="flat"> 가상머신 유지보수 이유 설정을 활성화 
                            </label>
                          </div>
							<hr>
							<p><strong>추가 난수 생성기 소스</strong></p>
                          <div class="radio">
                            <label>
                              <input type="radio" class="flat" checked name="iCheck"> /dev/hwrng 소스 
                            </label>
                          </div>
                        </div>
                      </div>
                      -->
                    </form>
                  </div>
                </div>
              </div>
              
			  <!-- 	
			  <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
					  <h2>
						  <a href="#" data-toggle="tooltip" title="메모리 최적화에 대한 설명">최적화 <i class="fa fa-info-circle"></i></a>
					  </h2>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <br />
                    <form class="form-horizontal form-label-left">
                      <div class="form-group">
                        <div class="col-md-12 col-sm-12 col-xs-12">
							<p><strong>메모리 최적화 </strong></p>
							<div class="radio">
								<label>
								  <input type="radio" class="flat" checked name="iCheck"> 없음 - 메모리 오버커밋 비활성화  
								</label>
							  </div>
							<div class="radio">
								<label>
								  <input type="radio" class="flat" checked name="iCheck"> 서버용로드 - 실제 메모리의 150%의 스케줄링을 허용 
								</label>
							</div>
							<div class="radio">
								<label>
								  <input type="radio" class="flat" checked name="iCheck"> 데스크탑용 로드 - 실제 메모리의 200%의 스케줄링을 허용 
								</label>
                          	</div>
							<hr>
							<p><strong>CPU 스레드 </strong></p>
                          	<div class="checkbox">
                            	<label>
                             		<input type="checkbox" class="flat" checked="checked"> 스레드를 코어로 계산 
                            	</label>
                         	 </div>
							<hr>
							<p><strong>메모리 Balloon </strong></p>
                          	<div class="checkbox">
                            	<label>
                             		<input type="checkbox" class="flat" checked="checked"> 메모리 Balloon 최적화 사용 
                            	</label>
                         	 </div>
							<hr>
							<p><strong>KSM 컨트롤 </strong></p>						
							<div class="checkbox">
								<label>
								  <input type="checkbox" class="flat"> KSM 활성화
								</label>
							</div>
                          	<div class="radio">
                            	<label>
                              		<input type="radio" class="flat" checked name="iCheck"> 사용 가능한 모든 메모리에서 메모리 페이지 공유(KSM 효과 최적화)
                            	</label>
                        	</div>
							<div class="radio">
                            <label>
                              <input type="radio" class="flat" checked name="iCheck"> NUMA 노드 내에서 메모리 페이지 공유(NUMA 성능 최적화)
                            </label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
				<div class="x_panel">
                  <div class="x_title">
					  <h2>마이크레이션 정책</h2>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <br />
                    <form class="form-horizontal form-label-left">
						<div class="form-group">
							<label class="control-label col-md-4 col-sm-4 col-xs-12">
								<a href="#" data-toggle="tooltip" title="마이크레이션 정책에 대한 설명">마이그레이션 정책 <i class="fa fa-info-circle"></i></a>
							</label>
							<div class="col-md-8 col-sm-8 col-xs-12">
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
							<label class="control-label col-md-4 col-sm-4 col-xs-12">
								<a href="#" data-toggle="tooltip" title="마이크레이션 대역폭 제한에 대한 설명">마이그레이션 대역폭 제한(Mbps) <i class="fa fa-info-circle"></i></a>
							</label>
							<div class="col-md-5 col-sm-5 col-xs-8">
							  <select class="form-control">
								<option>Choose option</option>
								<option>Option one</option>
								<option>Option two</option>
								<option>Option three</option>
								<option>Option four</option>
							  </select>
							</div>
							<div class="col-md-3 col-sm-3 col-xs-4">
							  <input type="text" class="form-control" placeholder="">
							</div>
						</div>
						<hr>
						<p><strong><a href="#" data-toggle="tooltip" title="복구정책에 대한 설명">복구정책 <i class="fa fa-info-circle"></i></a></strong></p>
                      <div class="form-group">
                        <div class="col-md-12 col-sm-12 col-xs-12">
							<p><strong>
						  </strong></p>
							<div class="radio">
								<label>
								  <input type="radio" class="flat" checked name="iCheck"> 가상머신을 마이그레이션 함  
								</label>
							  </div>
							<div class="radio">
								<label>
								  <input type="radio" class="flat" checked name="iCheck"> 고가용성 가상머신만 마이그레이션  
								</label>
							</div>
							<div class="radio">
								<label>
								  <input type="radio" class="flat" checked name="iCheck"> 가상머신은 마이그레이션 하지 않음
								</label>
                          	</div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>	
				<div class="x_panel">
                  <div class="x_title">
					  <h2>펜싱 정책 </h2>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <br />
                    <form class="form-horizontal form-label-left">
						<div class="form-group col-md-12 col-sm-12 col-xs-12">
							<div class="checkbox">
								<label>
								  <input type="checkbox" class="flat">
									<a href="#" data-toggle="tooltip" title="펜싱 사용에 대한 설명">펜싱 사용 <i class="fa fa-info-circle"></i></a>
								</label>
							</div>
						</div>
						<div class="form-group col-md-12 col-sm-12 col-xs-12">
							<div class="checkbox">
								<label>
								  <input type="checkbox" class="flat">
									<a href="#" data-toggle="tooltip" title="현 항목에 대한 설명"> 호스트가 스토리지에서 유효한 임개를 가지고 있을 경우 펜싱 건너뛰기 <i class="fa fa-info-circle"></i></a>
								</label>
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-6 col-sm-6 col-xs-12">
								<div class="checkbox">
									<label>
									  <input type="checkbox" class="flat">
										<a href="#" data-toggle="tooltip" title="현 항목에 대한 설명">클러스터 연결에 문제가 있는 경우 펜싱 건너뛰기 <i class="fa fa-info-circle"></i></a>
									</label>
								</div>
							</div>
							<div class="col-md-6 col-sm-6 col-xs-12">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">
								임계값
								</label>
								<div class="col-md-9 col-sm-9 col-xs-8">
								  <select class="form-control">
									<option>Choose option</option>
									<option>Option one</option>
									<option>Option two</option>
									<option>Option three</option>
									<option>Option four</option>
								  </select>
								</div>
							</div>
						</div>
                    </form>
                  </div>
                </div>
                
				<div class="x_panel">
                  <div class="x_title">
					  <h2>스케줄링 정책 </h2>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <br />
                    <form class="form-horizontal form-label-left  col-md-12 col-sm-12 col-xs-12">
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">
								정책 선택 
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
						<hr>
						<p><strong>속성</strong></p>
						<div class="form-group">
							<div class="col-md-5 col-sm-5 col-xs-12">
								<div class="checkbox">
									<label>
									  <input type="checkbox" class="flat">
										HighUtilization
									</label>
								</div>
							</div>
							<div class="col-md-7 col-sm-7 col-xs-12">
								<input type="text" class="form-control" placeholder="Explanation">
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-5 col-sm-5 col-xs-12">
								<div class="checkbox">
									<label>
									  <input type="checkbox" class="flat">
										LowUtilization
									</label>
								</div>
							</div>
							<div class="col-md-7 col-sm-7 col-xs-12">
								<input type="text" class="form-control" placeholder="Explanation">
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-5 col-sm-5 col-xs-12">
								<div class="checkbox">
									<label>
									  <input type="checkbox" class="flat">
										HeSparesCount
									</label>
								</div>
							</div>
							<div class="col-md-7 col-sm-7 col-xs-12">
								<input type="text" class="form-control" placeholder="Explanation">
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-5 col-sm-5 col-xs-12">
								<div class="checkbox">
									<label>
									  <input type="checkbox" class="flat">
										CpuOverCommitDurationMinutes
									</label>
								</div>
							</div>
							<div class="col-md-7 col-sm-7 col-xs-12">
								<input type="text" class="form-control" placeholder="Explanation">
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-5 col-sm-5 col-xs-12">
								<div class="checkbox">
									<label>
									  <input type="checkbox" class="flat">
										MaximumAllowedSwapUsage
									</label>
								</div>
							</div>
							<div class="col-md-7 col-sm-7 col-xs-12">
								<input type="text" class="form-control" placeholder="Explanation">
							</div>
						</div>
						<hr>
						<p><strong>스케줄러 최적화</strong></p>
						<div class="radio">
                            <label>
                              <input type="radio" class="flat" checked name="iCheck"> 사용 최적화 
                        	</label>
                        </div>
						<div class="radio">
                            <label>
                              <input type="radio" class="flat" checked name="iCheck"> 속도 최적화 
                        	</label>
                        </div>
						
						<hr>
						<p><strong>추가 속성</strong></p>
						<div class="checkbox">
							<label>
							  <input type="checkbox" class="flat">
								신뢰할 수 있는 서비스 용
							</label>
						</div>
						<div class="checkbox">
							<label>
							  <input type="checkbox" class="flat">
								HA 예약을 활성화
							</label>
						</div>
					</form>
                  </div>
                </div>					  
				
              </div>
               -->
              
            </div>
          </div>
        </div>
        <!-- /page content -->

<script src="/js/castanets/compute/createCluster.js" type="text/javascript"></script>
