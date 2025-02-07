<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


         <!-- page content -->
        <div class="right_col" role="main" id="createDomainVue" id="clustersVue">
        
			<spinner v-show="spinnerOn"></spinner>
		
			<div class="" v-show="!spinnerOn" v-cloak>
            <div class="page-title">
              <div class="title_left">
                <h3>{{isUpdate ? domain.name : "새 스토리지 도메인"}}</h3>
              </div>

              <div class="text-right">
                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" @click="goList()">취소</button>
						<button type="submit" class="btn btn-success" v-if="!isUpdate" @click="createDomain()">생성</button>
						<button type="submit" class="btn btn-success" v-if="isUpdate" @click="updateDomain()">편집</button>
					</div>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_content">
                    <br />
                    <form class="form-horizontal form-label-left">
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">도메인 기능<span class="text-danger">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control"  v-model="domain.domainType" :disabled="isUpdate">
                            <option  v-for="domainType in domainTypes" v-if=" !(isExistIso && domainType.name == 'ISO')"  v-bind:value="domainType.type">{{domainType.name}}</option>
                          </select>
                        </div>
                      </div>
                      <div v-if="!isUpdate" class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 유형<span class="text-danger">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control"  v-model="domain.storageType" :disabled="isUpdate" @change="domain.storageType=='ISCSI' ? iscsiRetrieve() : ''">
                            <option  v-for="storageType in storageTypes" v-bind:value="storageType">{{storageType}}</option>
                          </select>
                        </div>
                      </div>
                        <div v-if="isUpdate" class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 유형<span class="text-danger">*</span></label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <select class="form-control"  v-model="domain.storageType" :disabled="isUpdate" >
                                    <option>{{domain.storageType}}</option>
                                </select>
                            </div>
                        </div>
                      <div class="form-group" v-if="!isUpdate">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">사용할 호스트<span class="text-danger">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select class="form-control"  v-model="domain.hostId" :disabled="isUpdate">
                         	<option value="">호스트 선택</option>
                            <option  v-for="host in hosts"  v-bind:value="host.id">{{host.name}}</option>
                          </select>
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="이름" v-model="domain.name" @input="checkDomainName" :maxlength="this.$maxName">
                          <p class="text-danger" v-if="domainNameStatus || domain.name == ''">기호는 '-', '_'만 사용가능합니다. 공백도 허용하지 않습니다.</p>
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">설명 </label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="설명" v-model="domain.description" :maxlength="this.$maxDescription">
                        </div>
                      </div>
                      
                      <hr>
                      
                      <!-- NFS Type S -->
					  <div class="form-group" v-if="domain.storageType == 'NFS'">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">내보내기 경로<span class="text-danger">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="내보내기 경로" v-model="domain.path" :disabled="isUpdate">
						  <p>ex) myserver.mydomain.com:/my/local/path</p>
                        </div>
                      </div>
                      <!-- NFS Type E -->
                      
                      <!-- ISCSI Type S -->
                      <div v-if="domain.storageType == 'ISCSI'">
                      	<div class="form-group">
	                        <label class="control-label col-md-3 col-sm-3 col-xs-12">주소<span class="text-danger">*</span></label>
	                        <div class="col-md-9 col-sm-9 col-xs-12">
	                          <input type="text" class="form-control" placeholder="주소"  v-model="domain.iscsi.address" :disabled="isUpdate">
	                        </div>
	                    </div>
	                    <div class="form-group">
	                        <label class="control-label col-md-3 col-sm-3 col-xs-12">포트<span class="text-danger">*</span></label>
	                        <div class="col-md-9 col-sm-9 col-xs-12">
	                          <input type="text" class="form-control" placeholder="포트"  v-model="domain.iscsi.port" :disabled="isUpdate">
	                        </div>
	                    </div>
                        <div class="form-group">
	                        <label class="control-label col-md-3 col-sm-3 col-xs-12">사용자이름</label>
	                        <div class="col-md-9 col-sm-9 col-xs-12">
	                          <input type="text" class="form-control" placeholder="사용자이름"  v-model="domain.iscsi.id" :disabled="isUpdate">
	                        </div>
	                    </div>
	                    <div class="form-group">
	                        <label class="control-label col-md-3 col-sm-3 col-xs-12">암호</label>
	                        <div class="col-md-9 col-sm-9 col-xs-12">
	                          <input type="password" class="form-control" placeholder="암호"  v-model="domain.iscsi.password" :disabled="isUpdate">
	                        </div>
	                    </div>
                        <div class="text-right">
			                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
								<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3 f-right">
									<button type="button" class="btn btn-success" @click="iscsiDiscover()" :disabled="isUpdate">검색</button>
								</div>
			                </div>
                        </div>
		                  <div class="x_content" v-if="iscsis.length!=0 || isUpdate">
		                    <table class="table table-striped text-center">
		                      <thead>
		                        <tr>
		                          <th>대상이름</th>
		                          <th>주소</th>
		                          <th>포트</th>
		                          <th>연결</th>
		                        </tr>
		                      </thead>
		                      <tbody>
		                        <tr v-for="iscsi in iscsis" v-if="!isUpdate">
		                          <td>{{iscsi.target}}</td>
		                          <td>{{iscsi.address}}</td>
		                          <td>{{iscsi.port}}</td>
		                          <td><button type="button" class="btn btn-success" @click="iscsiLogin(iscsi)" :disabled="domain.iscsi.loginAt == true || isUpdate">연결</button></td>
		                        </tr>
                                <tr v-if="isUpdate">
                                    <td>{{domain.iscsi.target}}</td>
                                    <td>{{domain.iscsi.address}}</td>
                                    <td>{{domain.iscsi.port}}</td>
                                    <td><button type="button" class="btn btn-success" :disabled="isUpdate">연결</button></td>
                                </tr>
		                      </tbody>
		                    </table>
		                  </div>
	                  </div>
	                  <!-- ISCSI Type E -->

                      <!-- 
					  <p><strong>사용자 정의 연결 매개 변수</strong></p><br>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">NFS 버전 </label>
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
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">재전송</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="">
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">제한시간(데시세컨드)</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="">
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">추가 마운트 옵션</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="">
                        </div>
                      </div><hr>
                       -->
                       
					  <!--  
					  <p><strong>고급 매개 변수 </strong></p><br>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">디스크 공간 부족 경고 표시(%)</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="">
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">심각히 부족한 디스크 공간의 동작차단(GByte)</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="">
                        </div>
                      </div>
                       -->
                      
                      <!-- 
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">포맷 </label>
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
                       -->
                       
                      <!--  
                      <div class="form-group">
                        <div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3" >
                          <div class="checkbox">
                            <label>
                              <input type="checkbox" class="" checked="checked"> 삭제 후 초기화
                            </label>
                          </div>
                          <div class="checkbox">
                            <label>
                              <input type="checkbox" class=""> 백업 
                            </label>
                          </div>
                        </div>
                      </div><hr>
                       -->

<%-- by gtpark 나중에 도메인에 파이버채널로 만들 수 있게 할거면 쓰기 --%>
<%--                    <table v-if="domain.storageType == '파이버 채널'" class="table table-striped text-center">--%>
<%--                        <thead>--%>
<%--                        <tr>--%>
<%--                            <th>--%>
<%--                                <input disabled type="checkbox" v-model="selectAll">--%>
<%--                            </th>--%>
<%--                            <th>LUN ID</th>--%>
<%--                            <th>크기</th>--%>
<%--                            <th>경로</th>--%>
<%--                            <th>벤더 ID</th>--%>
<%--                            <th>제품 ID</th>--%>
<%--                            <th>시리얼</th>--%>
<%--                        </tr>--%>
<%--                        </thead>--%>
<%--                        <tbody>--%>
<%--                        <tr v-for="disk in disks" @click="selectDisk(disk)">--%>
<%--                            <td class="a-center">--%>
<%--                                <input type="checkbox" class="" :id="disk.name" :value="disk" v-model="selectedDisks">--%>
<%--                            </td>--%>
<%--                            <td>{{disk.name}}</td>--%>
<%--                            <td>{{disk.id}}</td>--%>
<%--                            <td>{{(disk.virtualSize / Math.pow(1024, 3)).toFixed(2) }}GB</td>--%>
<%--                            <td>{{disk.sharable ? 'O' : 'X'}}</td>--%>
<%--                            <td>{{disk.attachedTo}}</td>--%>
<%--                            <td>{{disk.storageDomainName}}</td>--%>
<%--                        </tr>--%>
<%--                        </tbody>--%>
<%--                    </table>--%>
<%--                      --%>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /page content -->

<script src="/js/castanets/storage/createDomain.js" type="text/javascript"></script>