<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

	
<script type="text/javascript">
	$(document).ready(function(){
		let selectNetwork =  sessionStorage.getItem('updateNetwork');
		selectNetwork = decodeURI(selectNetwork);
		selectNetwork = JSON.parse(selectNetwork);
		
		console.log("selectNetwork" , selectNetwork);
		
		if(selectNetwork == null) {
			window.location.href = "/network/networks";
		}
		
		updateNetwork.networkData = selectNetwork;
		updateNetwork.onload();
	});

</script>

<!-- page content --> 
        <div class="right_col" role="main" id="updateNetwork" v-cloak>
        <spinner v-show="spinnerOn"></spinner>
          <div v-show="!spinnerOn">
            <div class="page-title">
              <div class="title_left"  v-if="networkNames != null">
                <h3>네트워크 편집 > {{orgNetworkName}}</h3>
              </div>

              <div class="text-right">
                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" v-on:click="cancel">취소</button>
						<button type="submit" class="btn btn-success" v-on:click="updateNetwork">편집</button>
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
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">이름 </label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="이름"  v-model="networkName" :maxlength="this.$maxId" required>
                          <p class="text-danger" v-if="!validationName">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p> <p class="text-danger" v-if="!validationNames">이미 등록된 네트워크 이름 입니다.</p>
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">설명 </label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="설명" v-model="networkDescription">
                        </div>
                      </div>
					  <hr>
					<p><strong>네트워크 최대 전송 단위</strong></p>
					<%--<div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">네트워크 레이블 </label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                            <input type="text" class="form-control" placeholder="" v-model="networkLable" :maxlength="this.$maxId">
                            <p class="text-danger" v-if="!validationLabel">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
                        </div>
                    </div>--%>
					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">
							<input type="checkbox" v-model="networkVlanAt">
							VLAN 태깅 활성화
						</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                            <input v-if="networkVlanAt" type="text" class="form-control" placeholder="" v-model="networkVlan" :maxlength="4">
                            <input v-else type="text" class="form-control" placeholder=""  readonly>

                            <p v-if="networkVlanAt && !validationVlan" class="text-danger">1~4094 숫자만 사용 가능합니다.</p>
                        </div>
                    </div>
					<div class="form-group">
						<label class="control-label col-md-12 col-sm-12 col-xs-12">
							<input type="checkbox" v-model="networkVm">
							가상머신 네트워크
						</label>
                    </div>
					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">
							MTU
						</label>
                        <div class="col-md-9 col-sm-9 col-xs-12 m-bottom">
                          <input type="radio" id="radio1" value="default" v-model="networkMtuRadio"> 기본값(1500)  &nbsp;
                          <input type="radio" id="radio2" value="customize" v-model="networkMtuRadio"> 사용자정의
                        </div>
						<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">
                            <input v-if="networkMtuRadio == 'default'" type="text" class="form-control" placeholder="" readonly>
                            <input v-else type="text" class="form-control" v-model="networkMtu" placeholder="" :maxlength="10">
                            <p v-if="!(networkMtuRadio == 'default') && !validationMtu" class="text-danger">1~2,147,483,647 숫자만 사용 가능합니다. ( , 없이 입력해주세요 예 : 10000)</p>
                        </div>
                    </div>
					
					<!-- <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">호스트 네트워크 QoS</label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                        
	                        <select class="form-control" v-model="qos">
							   <option value="">QoS 선택</option>
							   <option v-for="qos in qoss" v-bind:value="qos.id">
							    {{ qos.name }}
							  </option>
							</select>
                          
                        </div>
                    </div> -->
					
					<!-- <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">DNS 서버</label>
                        <div v-for="(dns, index) in dnss">
	                        
	                        <div v-if="index == 0" class="col-md-6 col-sm-6 col-xs-12 ">
	                          <input type="text" class="form-control" placeholder="" v-model="dns.dnsIp">
	                        </div>
	                        <div v-else class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3 col-sm-offset-3">
	                          <input type="text" class="form-control" placeholder="" v-model="dns.dnsIp">
	                        </div>
	                        
							<div class="col-md-3 col-sm-3 col-xs-12 f-right text-right">
								<div class="col-md-12 col-sm-12 col-xs-12">
									<button v-if="dnssSize &lt; 2 " class="btn btn-default btn-round btn-sm" type="button" v-on:click="dnsPlus"> + </button>
									<button v-if="dnssSize == 1" class="btn btn-default btn-round btn-sm" type="button" disabled> - </button>
									<button v-else class="btn btn-default btn-round btn-sm" type="button" v-on:click="dnsMinus(index)"> - </button>
								</div>
							</div>
                        </div>
                    </div> -->
                    </form>
                  </div>
                </div>
              </div>
			  <div class="col-md-12 col-sm-12 col-xs-12">
					<div class="x_panel">
					  <div class="x_title">
						<h2>클러스터</h2>
						<div class="clearfix"></div>
					  </div>
					  <div class="x_content">
						<table class="table table-striped text-center">
						  <thead>
							<tr>
							  <th>이름</th>
							  <th>연결</th>
							  <th>필수</th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-for="(cluster, index) in clusters">
							  <td>{{cluster.clusterName}}</td>
							  <td><input type="checkbox" v-model="cluster.connect"></td>
							  <td><input type="checkbox" v-model="cluster.required"></td>
							</tr>
						  </tbody>
						</table>

					  </div>
				  </div>
            </div>
			  
			<!-- 고급옵션 -->
			 </div> 
			</div>
        </div>
        <!-- /page content -->
        
        
        
<script src="/js/castanets/network/updateNetwork.js" type="text/javascript"></script>