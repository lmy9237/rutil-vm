<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


	<!-- page content -->
	<div class="right_col" role="main" id="domainVue">
	
		<spinner v-show="spinnerOn"></spinner>
	
		<div v-show="!spinnerOn" v-cloak>
          <div class="page-title">
            <div class="title_left">
              <h3>스토리지<small> &#62; <a href="/storage/domains">도메인</a> &#62; {{domain.name}}</small></h3>
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="row">
            <div class="col-md-12">
              <div class="x_panel">
                <div class="x_title">
                  <h2>{{domain.name}}</h2>
                  <div class="clearfix"></div>
                </div>
                <div class="x_content">
                  <div class="row">
                    <div class="col-md-5 col-sm-5 col-xs-12">
                      <div class="panel-body">
                        <table class="table table-bordered">
                          <tbody>
                            <tr>
                              <td>설명</td>
                              <td>{{domain.description}}</td>
                            </tr>
                            <tr>
                              <td>경로</td>
                              <td>{{domain.storageAddress}}:{{domain.storagePath}}</td>
                            </tr>
                          </tbody>
                        </table>
						<!-- Pie charts -->
                        <div class="row text-center clname">
						  <div class="col-md-12 col-sm-12 col-xs-12">
						  	<span class="chart">
								<span class="percent">{{(domain.diskUsed / (domain.diskUsed + domain.diskFree) * 100).toFixed(0)}}%
									<chart-doughnut  :height="120" :width="120" :styles="{margin: '-6px 10px 10px -6px'}" :free="domain.diskFree" :used="domain.diskUsed"></chart-doughnut>
								</span>
							</span>
							<h4>스토리지</h4>
							<h6>총 {{ ( (domain.diskFree + domain.diskUsed) / Math.pow(1024, 3)).toFixed(1) }}GB 중 <i class="green">{{ (domain.diskFree / Math.pow(1024, 3)).toFixed(1) }}GB</i> 사용가능</h6>
						  </div>
						  <!-- <p class="text-center">총 <i class="green"> {{ ( (domain.diskFree + domain.diskUsed) / Math.pow(1024, 3)).toFixed(1) }}GB</i> 중 <i class="green">{{ (domain.diskFree / Math.pow(1024, 3)).toFixed(1) }}GB</i> 사용가능</p> -->
						  <div class="clearfix"></div>
                        </div>
                      </div>
                    </div>

                    <!-- graph area -->

                    <div class="col-md-7 col-sm-7 col-xs-12">
                      <div class="x_title">
                        <h4>스토리지 이용률</h4>
                        <div class="clearfix"></div>
                      </div>
                      <div class="x_content2">
                      	<chart-flot-polyline :data="domain.storageDomainUsages"></chart-flot-polyline>
					  </div>
                    </div>
                    <!-- /graph area -->
                  </div>
              	</div>
              </div>
              <div class="col-md-9 col-sm-9 col-xs-9">
				  <p><strong>마지막 업데이트 </strong><i class="glyphicon glyphicon-calendar fa fa-calendar"></i> May-14-2018 [mon] 18:32:18 GMT +0900 (대한민국 표준시)</p>
			  </div>
			  <div class="col-md-3 col-sm-3 col-xs-3 listb">
              	<button class="btn btn-success btn-sm" type="button" @click="goBack()"><i class="fa fa-list-ul"></i> 목록</button>
              </div>
			</div>
		  </div>
				  
  <!--           <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <h2>가상머신</h2>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <table class="table table-striped text-center stdomin">
                      <thead>
                        <tr>
                          <th>이름</th>
                          <th>디스크</th>
                          <th>템플릿</th>
                          <th>가상 크기</th>
                          <th>실제 크기</th>
						  <th>생성 일자</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><i class="fa fa-caret-down"></i> metric-store-test</td>
                          <td>1</td>
                          <td>-</td>
                          <td>100GByte</td>
                          <td>10GByte</td>
						  <td>2018.05.22 오전 11:36:11</td>							
                        </tr>
                        <tr>
                          <td><i class="fa fa-caret-down"></i> metric-store-test-disk</td>
                          <td>1</td>
                          <td>-</td>
                          <td>100GByte</td>
                          <td>10GByte</td>
						  <td>2018.05.22 오전 11:36:11</td>							
                        </tr>
                        <tr>
                          <td><i class="fa fa-caret-down"></i> active vm</td>
                          <td>1</td>
                          <td>-</td>
                          <td>100GByte</td>
                          <td>10GByte</td>
						  <td>2018.05.22 오전 11:36:11</td>							
                        </tr>
                      </tbody>
					  <tbody>
                        <tr>
                          <td><i class="fa fa-caret-down"></i> VM-1</td>
                          <td>1</td>
                          <td>-</td>
                          <td>20GByte</td>
                          <td>11GByte</td>
						  <td>2018.05.22 오전 11:36:11</td>							
                        </tr>
                        <tr>
                          <td><i class="fa fa-caret-down"></i> vm-1-disk</td>
                          <td>1</td>
                          <td>-</td>
                          <td>20GByte</td>
                          <td>11GByte</td>
						  <td>2018.05.22 오전 11:36:11</td>							
                        </tr>
                        <tr>
                          <td><i class="fa fa-caret-down"></i> active vm</td>
                          <td>1</td>
                          <td>-</td>
                          <td>20GByte</td>
                          <td>11GByte</td>
						  <td>2018.05.22 오전 11:36:11</td>							
                        </tr>
                      </tbody>						
                    </table>
                  </div>
                </div>
              </div>
          
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <h2>템플릿</h2>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>이름</th>
                          <th>디스크</th>
                          <th>가상 크기</th>
                          <th>실제 크기</th>
                          <th>생성 일자</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="clearfix"></div>
                </div>          
              </div>
            </div>
 -->
				<!-- 디스크 -->
	            <div class="row" v-if="domain.type != 'ISO'">
	              <div class="col-md-12 col-sm-12 col-xs-12">
	                <div class="x_panel">
	                  <div class="x_title">
	                    <div class="col-md-3 col-sm-3 col-xs-12">
	                      <h2>디스크</h2>
	                    </div>
	                    <!-- 버튼 일단 주석-->
	                    <!--
	                    <div class="col-md-9 col-sm-9 col-xs-12 text-right">
	                        <div class="btn-group">
	                            <button type="button" class="btn btn-primary btn-sm"><i class="fa fa-trash-o"></i> 제거</button>
	                            <button type="button" class="btn btn-primary btn-sm"><i class="fa fa-upload"></i> 업로드</button>
	                            <button type="button" class="btn btn-primary btn-sm"><i class="fa fa-download"> </i> 다운로드</button>
	                       </div>
	                    </div>
	                     -->
	                    <div class="clearfix"></div>                    
	                  </div>
	                  <div class="x_content">
	                    <table class="table table-striped text-center">
	                      <thead>
	                        <tr>
	                          <th>상태</th>
	                          <th>이름</th>
	                          <th>가상 크기</th>
	                          <th>실제 크기</th>
	                          <!-- <th>할당 정책</th> -->
	                          <!-- <th>생성 일자</th> -->
	                          <th>연결 대상</th>
	                          <th>유형</th>
							  <th>설명</th>
							</tr>
	                      </thead>
	                      <tbody>
	                        <tr v-for="disk in domain.diskVoList">
	                          <td><i class="fa fa-circle-o green" v-bind:class="{ 'fa-circle-o green': 'ok'==disk.status, 'fa-close red': 'ok' !=disk.status }"></i></td>
	                          <td>{{disk.name}}</td>
	                          <td>{{ (disk.virtualSize / Math.pow(1024, 3)).toFixed(2) }}GB </td>
	                          <td>{{ (disk.actualSize / Math.pow(1024, 3)).toFixed(2) }}GB </td>
	                          <!-- <td></td> -->
	                          <!-- <td></td> -->
	                          <td>{{disk.attachedTo}}</td>
	                          <td>{{disk.type}}</td>
	                          <td>{{disk.description}}</td>
	                        </tr>
	                      </tbody>
	                    </table>
	                  </div>
	                </div>
	              </div>
	            </div>
	            
	            
	            <!-- 이미지 파일 -->
	            <div class="row" v-if="domain.type == 'ISO'">
	              <div class="col-md-12 col-sm-12 col-xs-12">
	                <div class="x_panel">
	                  <div class="x_title">
	                    <div class="col-md-3 col-sm-3 col-xs-12">
	                      <h2>이미지</h2>
	                    </div>
	                    <div class="clearfix"></div>                    
	                  </div>
	                  <div class="x_content">
	                    <table class="table table-striped text-center">
	                      <thead>
	                        <tr>
	                          <th>이름</th>
							</tr>
	                      </thead>
	                      <tbody>
	                        <tr v-for="imageFile in domain.imageFileList">
	                          <td>{{imageFile.name}}</td>
	                        </tr>
	                      </tbody>
	                    </table>
	                  </div>
	                </div>
	              </div>
	            </div>
	
	<!-- 
				<div class="row">
				  <div class="col-md-12 col-sm-12 col-xs-12">
	                <div class="x_panel">
	                  <div class="x_title">
	                    <div class="x_title">
							<h2>스냅샷</h2>
							<div class="clearfix"></div>
	                  	</div>
	                    <table class="table table-striped text-center">
	                      <thead>
	                        <tr>
	                          <th>상태</th>
	                          <th>이름</th>
	                          <th>크기</th>
	                          <th>생성 일자</th>
	                          <th>연결 대상</th>
	                          <th>스냅샷 ID</th>
							  <th>설명</th>
							</tr>
	                      </thead>
	                      <tbody>
	                        <tr>
	                          <td></td>
	                          <td>metric-store-test-disk1</td>
	                          <td>1GByte</td>
	                          <td>2018.05.22 오전 11:36:11</td>
	                          <td>metric-store-test</td>
	                          <td>f507fb57-076a-41e7-b56b-3394f8788da2</td>
	                          <td></td>
	                        </tr>
	                      </tbody>
	                    </table>
	                  </div>
	                </div>
	              </div>
	            </div>              
	 -->
	 		<div class="row">
				<div class="col-md-12 col-sm-12 col-xs-12">
					<div class="x_panel">
						<div class="x_title">
							<h2>이벤트</h2>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<table id="datatable-buttons" class="table table-striped dataTable no-footer dtr-inline text-center" role="grid" aria-describedby="datatable-buttons_info">
								<thead>
									<tr>
										<th style="width: 10%">타입</th>
										<th style="width: 12%">시간</th>
										<th>메세지</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="p in paginatedData">
										<td><i :class="[eventType(p.severity)]" :title="getEventStatusToKor(p.severity)"></i></td>
										<td>{{p.time | date}}</td>
										<td class="text-left">{{p.description}}</td>
									</tr>
								</tbody>
							</table>
		
							<div class="row text-center">
								<div class="btn-group">
									<button class="btn btn-default btn-sm" type="button"
										@click="prevPage" :disabled="pageNumber === 0">Prev</button>
									<button class="btn btn-default btn-sm" type="button"
										@click="movePage(1)" v-if="(0 < pageNumber) && (pageNumber > 2)">1</button>
									<button class="btn btn-default btn-sm" type="button"
										@click="pageNumber = pageNumber > 5 ? pageNumber -5 : 0" v-if="(0 < pageNumber) && (pageNumber > 2)">...</button>
									<button
										:class="[isSelected(number) ? selectedNumber : unSelectedNumber]"
										type="button" @click="movePage(number)"
										v-for="number in pageCount" v-if="(pageNumber - 2 < number) && (number < pageNumber + 4)">{{number}}</button>
									<button class="btn btn-default btn-sm" type="button"
										@click="pageNumber = pageNumber + 5 < pageCount ? pageNumber + 5 : pageCount - 1" v-if="pageCount - pageNumber > 3">...</button>
									<button class="btn btn-default btn-sm" type="button"
										@click="movePage(pageCount)" v-if="pageCount - pageNumber > 3">{{pageCount}}</button>
									<button class="btn btn-default btn-sm" type="button"
										@click="nextPage" :disabled="pageNumber >= pageCount -1">Next</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
	        <div class="clearfix"></div>
	         <div id="datatable-buttons_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"> 
	         </div>
	       </div>
         </div>
        <!-- /page content -->

<script src="/js/castanets/storage/domain.js" type="text/javascript"></script>