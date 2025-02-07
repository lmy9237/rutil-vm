<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


       <!-- page content -->
        <div class="right_col" role="main" id="createQuotaVue">
          <div class="">
            <div class="page-title">
              <div class="title_left">
                <h3>새 쿼터</h3>
              </div>

              <div class="text-right">
                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" @click="test()">취소</button>
						<!-- <button class="btn btn-primary" type="reset" @click="goList()">취소</button> -->
						<button class="btn btn-success" @click="createQuota()">생성</button>
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
                        <label class="control-label col-md-2 col-sm-2 col-xs-12">이름 </label>
                        <div class="col-md-10 col-sm-10 col-xs-12">
                          <input type="text" class="form-control" placeholder="Name" v-model="quota.name">
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-2 col-sm-2 col-xs-12">설명 </label>
                        <div class="col-md-10 col-sm-10 col-xs-12">
                          <input type="text" class="form-control" placeholder="Explanation" v-model="quota.desccription">
                        </div>
                      </div>
					  <hr>
					  
					  <p><strong>CPU, 메모리</strong></p>
					
					  <div class="col-md-12 col-sm-12 col-xs-12 q-range">
                        <input type="text" id="range_quota_cluster" value="" name="range" />
                      </div>
					
					  <div class="form-group">
						<div class="col-md-3 col-sm-12 col-xs-12">
							<div class="radio">
								<label>
								  <input type="radio" class="" checked name="quotaClusterType" value="all" v-model="quotaClusterLimitType"> 모든 클러스터 
								</label>
								<label>
								  <input type="radio" class=""  name="quotaClusterType" value="select" v-model="quotaClusterLimitType"> 특정 클러스터
								</label>
							</div>
						</div>
					  </div>
					  
					  <table class="table table-striped text-center table-bordered">
						  <thead>
							<tr>
							  <td></td>
							  <th>클러스터</th>
							  <th>메모리</th>
							  <th>vCPU</th>
							  <th>편집</th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-if="quotaClusterLimitType == 'all'">
							  <td><input type="checkbox" class="" :disabled='true'></td>
							  <td>모든 클러스터</td>
							  <td>무제한 0MByte 사용 중</td>
							  <td>무제 vCPU 중 0</td>
							  <td><div class="btn btn-primary" @click="openModalCluster()">편집</div></td>
							</tr>
							<tr v-if="quotaClusterLimitType == 'select'" v-for="cluster in clusters">
							  <td><input type="checkbox" class=""></td>
							  <td>{{cluster.name}}</td>
						      <td>무제한 0MByte 사용 중</td>
							  <td>무제 vCPU 중 0</td>
							  <td><div class="btn btn-primary"  @click="openModalCluster()">편집</div></td>
							  </tr>
						  </tbody>
					  </table>
						
					  <hr>
					  <p><strong>스토리지</strong></p>
					
					  <div class="col-md-12 col-sm-12 col-xs-12 q-range">
                        <input type="text" id="range_quota_storage" value="" name="range"/>
                      </div>
                      
						<div class="col-md-3 col-sm-12 col-xs-12">
							<div class="radio">
								<label>
								  <input type="radio" class="" checked name="quotaStorageType" value="all" v-model="quotaStorageLimitType"> 모든 스토리지 도메인 
								</label>
								<label>
								  <input type="radio" class=""  name="quotaStorageType" value="select" v-model="quotaStorageLimitType"> 특정 스토리지 도메인
								</label>
							</div>
						</div>
					  </div>
					
					  <table class="table table-striped text-center table-bordered">
						  <thead>
							<tr>
							  <th><input type="checkbox" class=""></th>
							  <th>스토리지</th>
							  <th>쿼터</th>
							</tr>
						  </thead>
						  <tbody>
							<tr>
							  <td><input type="checkbox" class=""></td>
							  <td>Storage-1</td>
							  <td>무제한 0MByte 사용 중</td>
							</tr>
							<tr>
							  <td><input type="checkbox" class=""></td>
							  <td>Storage-2</td>
							  <td>2GByte 중 0</td>
							</tr>
						  </tbody>
					  </table>
                    </form>
                  </div>
                </div>		  
              </div>
            </div>
			  
			<!-- 고급옵션 -->
			  
			
				<!-- quota cluster limit modal -->
				<div class="modal fade quotaclustermodal" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">
									<span aria-hidden="true">×</span>
								</button>
								<h4 class="modal-title" id="myModalLabel">쿼터 편집</h4>
							</div>
							<div class="modal-body">
								<div class="row">
									<div class="x_content">
										<div class="col-md-12 col-sm-12 col-xs-12">
											메모리 : 
										</div>
										<div class="col-md-6 col-sm-6 col-xs-12">
											<div class="radio">
												<label>
												  <input type="radio" class="" checked name="cputype" value="-1" v-model="quota.quotaClusterMemoryType"> 제한 없음
												</label>
												<label>
												  <input type="radio" class=""  name="cputype" value="0" v-model="quota.quotaClusterMemoryType">제한
												</label>
											</div>
										</div>
										<div class="col-md-6 col-sm-6 col-xs-12">
											<input type="number">MB
										</div>
									</div>
								</div>
								<div class="row">
									<div class="x_content">
										<div class="col-md-12 col-sm-12 col-xs-12">
											CPU : 
										</div>
										<div class="col-md-6 col-sm-6 col-xs-12">
											<div class="radio">
												<label>
												  <input type="radio" class="" checked name="memorytype" value="-1" v-model="quota.quotaClusterCpuType"> 제한 없음
												</label>
												<label>
												  <input type="radio" class=""  name="memorytype" value="0" v-model="quota.quotaClusterCpuType">제한
												</label>
											</div>
										</div>
										<div class="col-md-6 col-sm-6 col-xs-12">
											<input type="number">vCPU 
										</div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-primary" @click="test()">확인</button>
								<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
							</div>
						</div>
					</div>
				</div>
			
			
        </div>
        <!-- /page content -->

<script src="/js/castanets/admin/createQuota.js" type="text/javascript"></script>