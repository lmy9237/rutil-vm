<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


        <!-- page content -->
        <div class="right_col" role="main" id="quotasVue">
			<spinner v-show="spinnerOn"></spinner>
			<div class="" v-show="!spinnerOn">
            <div class="page-title">
              <div class="title_left">
                <h3> 관리 <small>&#62; 쿼터</small></h3>
              </div>
            </div>
            <div class="clearfix"></div>

            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <h2>쿼터</h2>
                    <div class="row text-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-success btn-sm" @click="goCreateQuota()"><i class="fa fa-file-o"></i> 등록</button>
                            <button type="button" class="btn btn-success btn-sm" @click="goUpdateQuota()"><i class="fa fa-edit"></i> 편집</button>
                            <button type="button" class="btn btn-success btn-sm" @click="removeQuota()"><i class="fa fa-trash-o"></i> 삭제</button>
                       </div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content quotas-table">
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>
                          	<input type="checkbox" v-model="selectAll">
                          </th>
                          <th>이름</th>
                          <th>설명</th>
                          <th>메모리 사용량</th>
                          <th>여유 메모리</th>
                          <th>vCPU 사용률</th>
                          <th>여유 vCPU</th>
						  <th>스토리지 사용량</th>
                          <th>여유 스토리지</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="quota in quotas">
                          <td class="a-center">
                          	<input type="checkbox" class="flat" :id="quota.name" :value="quota.id" v-model="selectedQuotas">
                          </td>
                          <td><a :href="'/admin/quota?id=' + quota.id">{{quota.name}}</td>
						  <td>{{quota.description}}</td>
						  <td>
							  <div class="widget_summary">
								  <div class="w_left w_55">
									  <div class="qt-progress">
										  <div class="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemin="100" aria-valuemax="100" style="width: 66%;"></div>
									  </div>
								  </div>
								  <div class="w_right w_35">
									  <span>{{ quota.memoryLimitTotal < 0 ? '제한없음' : quota.memoryUsageTotal }}</span>
								  </div>
							  </div>
						  </td>
						  <td>{{ quota.memoryLimitTotal < 0 ? '제한없음' : (quota.memoryLimitTotal * 1024) + ' MB' }} </td>
						  <td>
							  <div class="widget_summary">
								  <div class="w_left w_55">
									  <div class="qt-progress">
										  <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="100" aria-valuemax="100" style="width: 66%;">
										 </div>
									  </div>
								  </div>
								  <div class="w_right w_35">
									  <span>{{ quota.vCpuLimitTotal < 0 ? '제한없음' : quota.vCpuUsageTotal }}</span>
								  </div>
							  </div>
						  </td>
						  <td>{{ quota.vCpuLimitTotal < 0 ? '제한없음' : quota.vCpuLimitTotal }}</td>
						  <td>
							  <div class="widget_summary">
								  <div class="w_left w_55">
									  <div class="qt-progress">
										  <div class="progress-bar bg-purple" role="progressbar" aria-valuenow="60" aria-valuemin="100" aria-valuemax="100" style="width: 66%;">
										 </div>
									  </div>
								  </div>
								  <div class="w_right w_35">
									  <span>{{ quota.storageLimitTotal < 0 ? '제한없음' : quota.storageUsageTotal }}</span>
								  </div>
							  </div>
						  </td>
						  <td>{{ quota.storageLimitTotal < 0 ? '제한없음' : quota.storageLimitTotal + ' GB' }}</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
		  </div>
        </div>
        <!-- /page content -->

<script src="/js/castanets/admin/quotas.js" type="text/javascript"></script>