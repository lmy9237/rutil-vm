<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


        <!-- page content -->
        <div class="right_col" role="main" id="domainsVue">
        
        	<spinner v-show="spinnerOn"></spinner>
		
		   <div class="" v-show="!spinnerOn" v-cloak>
            <div class="page-title">
              <div class="title_left">
                <h3> 스토리지 <small>&#62; 도메인</small></h3>
              </div>
            </div>
            <div class="clearfix"></div>

            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <div class="row text-right">
                    	<div style="float:left;">
							<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveDomains()">
								<i class="fa fa-refresh"></i>
							</button>
						</div>
                        <div class="btn-group">
                            <button type="button" class="btn btn-success btn-sm" @click="goCreateDomain()"><i class="fa fa-file-o"></i> 등록</button>
                            <!-- <button type="button" class="btn btn-success btn-sm" @click="goImportDomain()"><i class="fa fa-file-o"></i> 가져오기</button> -->
                            <button type="button" class="btn btn-success btn-sm" @click="goUpdateDomain()" :disabled="selectedDomains.length!=1"><i class="fa fa-edit"></i> 편집</button>
                            <button type="button" class="btn btn-success btn-sm" @click="removeDomainShowModal()" :disabled="!isPosibleDelete()"><i class="fa fa-trash-o"></i> 삭제</button>
                            <button type="button" data-toggle="dropdown" class="btn btn-success dropdown-toggle btn-sm" type="button"><i class="fa fa-gear"></i> 관리 <span class="caret"></span></button>
                            	<ul role="menu" class="dropdown-menu">
                              <li :class="{disabled : !isPosibleMaintenance()}"><a href="#" @click="!isPosibleMaintenance() ? '' : maintenanceStart()">유지보수</a></li>
                              <li :class="{disabled : !isPosibleActive()}"><a href="#" @click="!isPosibleActive() ? '' : maintenanceStop()">활성</a></li>
	                        </ul>
                       </div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                        	<th>
								<input type="checkbox" v-model="selectAll">
							</th>
                          <th>상태</th>
                          <th>이름</th>
                          <th>설명</th>
                          <th>도메인 유형</th>
                          <th>스토리지 유형</th>
                          <th>포맷</th>
                          <th>전체공간</th>
                          <th>여유공간</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="domain in domains">
                        		<td class="a-center">
								<input type="checkbox" class="" :id="domain.name" :value="domain" v-model="selectedDomains">
							</td>
                          <!-- <td><i class="fa " v-bind:class="{ 'fa-arrow-up green': null==domain.status, 'fa-arrow-down red': null != domain.status }"></i></td> -->
						  <td>
							<i v-if="domain.status === 'active'" 							class="fa fa-arrow-up green" 		title="실행중"></i>
							<i v-else-if="domain.status === 'activating'"					class="fa fa-spinner fa-spin gray" 	title="활성화중"></i>
							<i v-else-if="domain.status === 'detaching'"					class="fa fa-spinner fa-spin gray" 	title="분리중"></i>
							<i v-else-if="domain.status === 'inactive'"						class="fa fa-arrow-down red" 		title="정지"></i>
							<i v-else-if="domain.status === 'locked'"						class="fa fa-lock blue" 			title="잠김"></i>
							<i v-else-if="domain.status === 'mixed'"						class="fa fa-arrow-up red" 			title="mixed"></i>
							<i v-else-if="domain.status === 'maintenance'"					class="fa fa-wrench gray" 			title="유지보수"></i>
							<i v-else-if="domain.status === 'preparing_for_maintenance'"	class="fa fa-spinner fa-spin gray" 	title="유지보수 준비중"></i>
							<i v-else-if="domain.status === 'unattached'"					class="fa fa-chain-broken green" 	title="연결해제"></i>
							<i v-else-if="domain.status === 'unknown'"						class="fa fa-arrow-down red" 		title="알수없음"></i>
							<i v-else 														class="fa fa-arrow-down red" 		title="알수없음"></i>
    					  </td>
                          <td><a :href="'/storage/domain?id=' + domain.id">{{domain.name}}</a></td>
                          <td>{{domain.description}}</td>
                          <td>{{domain.type}}</td>
                          <td>{{domain.storageType}}</td>
                          <td>{{domain.storageFormat}}</td>
                          <td>{{ ((domain.diskFree + domain.diskUsed) / Math.pow(1024, 3)).toFixed(1) }}GB</td>
                          <td>{{ (domain.diskFree / Math.pow(1024, 3)).toFixed(1) }}GB</td>
                        </tr>
                        <!-- <tr>
                          <td><i class="fa fa-arrow-down red"></i></td>
                          <td>ISO-Domain</td>
                          <td></td>
                          <td>ISO</td>
                          <td>NFS</td>
                          <td>V1</td>
                          <td>778 GByte</td>
                          <td>752 GByte</td>
                        </tr>
						<tr>
                          <td></td>
                          <td>Storage</td>
                          <td></td>
                          <td>데이터(마스터)</td>
                          <td>NFS</td>
                          <td>V4</td>
                          <td>778 GByte</td>
                          <td>752 GByte</td>
                        </tr> -->

                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
              <div class="clearfix"></div>

              
            </div>
            
            <!-- modal domain remove -->
			<div class="modal fade removeDomainModal" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true">×</span>
							</button>
							<h4 class="modal-title" id="myModalLabel">스토리지 도메인 삭제</h4>
						</div>
						<div class="modal-body">
							<div class="x_panel">
								<div class="x_content">
									<p>
										스토리지 도메인을 삭제 하시겠습니까?<br>{{removeDomainInfo.name}}
									</p>
									<!-- 
									<div class="checkbox">
										<label>
											<input type="checkbox" class="" checked="checked" v-model="removeDomainInfo.format"> 포맷 여부
										</label>
										<br>
										도메인을 포맷합니다. 즉 스토리지 컨텐츠를 모두 손실하게 됩니다.
									</div>
									 -->
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" @click="removeDomain()">확인</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
						</div>
					</div>
				</div>
			</div>
		
          </div>
        </div>
        <!-- /page content -->

<script src="/js/castanets/storage/domains.js" type="text/javascript"></script>