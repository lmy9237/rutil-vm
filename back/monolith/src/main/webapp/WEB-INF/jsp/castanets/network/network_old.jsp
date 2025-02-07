<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

	
<script type="text/javascript">
	$(document).ready(function(){
		let selectNetwork =  sessionStorage.getItem('selectNetwork');
		selectNetwork = decodeURI(selectNetwork);
		selectNetwork = JSON.parse(selectNetwork);
		
		console.log("selectNetwork" , selectNetwork);
		
		if(selectNetwork == null) {
			window.location.href = "/network/networks";
		}
		
		network.networkData = selectNetwork;
		network.onload();
	});

</script>

<!-- page content -->
        <div class="right_col" role="main" id="network" v-cloak>
        <spinner v-show="spinnerOn"></spinner>
          <div v-show="!spinnerOn">

          <div class="page-title">
            <div class="title_left"  v-if="networkData != null">
              <h3>네트워크<small> &#62; {{networkData.name}}</small></h3>
            </div>
          </div>
          <div class="clearfix"></div>


            <div class="row" >
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <div class="col-md-3 col-sm-3 col-xs-12">
                      <h2>일반</h2>
                    </div>
                    <div class="col-md-9 col-sm-9 col-xs-12 text-right">
                        <div class="btn-group">
                        	<button class="btn btn-success btn-sm" type="button" @click="goNetworks()"><i class="fa fa-list-ul"></i> 목록</button>
                       </div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>network</th>
                          <th>ID</th>
                          <th>설명</th>
                          <th>가상머신 네트워크</th>
                          <th>VLAN 태그</th>
                          <th>MTU</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="networkData != null">
                          <td>{{networkData.name}}</td>
                          <td>{{networkData.id}}</td>
                          <td>{{networkData.description}}</td>
                          <td v-if="networkData.usage == 'VM'">true</td>
                          <td v-else>false</td>
                          <td v-if="networkData.vlan != null">{{networkData.vlan}}</td>
                          <td v-else>없음</td>
                          <td v-if="networkData.mtu != 0 && networkData.mtu != 1500 ">{{networkData.mtu}}</td>
                          <td v-else>기본값(1500)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

			  <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <div class="x_title">
						<h2>클러스터</h2>
						<div class="clearfix"></div>
                  	</div>
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>이름</th>
                          <th>호환버전</th>
                          <th>연결된 네트워크</th>
                          <th>필수 네트워크</th>

                          <th>네트워크 상태</th>
						  <th>네트워크 역할</th>
						  <th>설명</th>
						</tr>
                      </thead>
                      <tbody>
                        <tr v-for="clusterData in clusterDatas">
                          <td>{{clusterData.clusterName}}</td>
                          <td>{{clusterData.clusterVersion}}</td>

                          <td v-if="clusterData.connect"><input type="checkbox" name="connect" checked="checked" disabled></td>
                          <td v-else><input type="checkbox" name="connect" disabled></td>

                          <td v-if="clusterData.required"><input type="checkbox" name="required" checked="checked" disabled></td>
                          <td v-else><input type="checkbox" name="required" disabled></td>


                          <!-- <td>{{clusterData.connect}}</td>
                          <td>{{clusterData.required}}</td> -->
                          <td v-if="clusterData.status == 'OPERATIONAL'"><i class="fa fa-arrow-up green"></i></td>
                          <td v-else><i class="fa fa-arrow-down red"></i></td>
                          <td >
							<a href="javascript:void(0)" data-toggle="tooltip" v-for="data in clusterData.usages">
								<i v-if="data.usage == 'MANAGEMENT'" class="fa fa-cog blue" v-bind:title="managementMessage"></i>
								<i v-if="data.usage == 'DISPLAY'" class="fa fa-desktop" v-bind:title="displayMessage"></i>
								<i v-if="data.usage == 'MIGRATION'" class="fa fa-share-square-o green" v-bind:title="migrationMessage"></i>
								<i v-if="data.usage == 'DEFAULT_ROUTE'" class="fa fa-exclamation-triangle purple" v-bind:title="defaultRouteMessage"></i>
							</a>
						  </td>
                          <td>{{clusterData.clusterDescription}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

			  <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <div class="x_title">
						<h2>호스트</h2>
						<div class="clearfix"></div>
                  	</div>
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>상태</th>
                          <th>이름</th>
                          <th>클러스터</th>
                          <th>네트워크 장치 상태</th>
                          <th>비동기</th>
                          <th>네트워크 장치</th>
						  <th>속도(Mbps)</th>
                          <th>Rx(Mbps)</th>
						  <th>Tx(Mbps)</th>
                          <th>총 Rx (바이트)</th>
						  <th>총 Tx (바이트)</th>
						</tr>
                      </thead>
                      <tbody>
                        <tr v-for="hostData in hostDatas">
                          <td v-if="hostData.hostStatus == 'up'"><i class="fa fa-arrow-up green"></i></td>
                          <td v-else><i class="fa fa-arrow-down red"></i></td>
                          <td>{{hostData.hostName}}</td>
                          <td>{{hostData.hostClusterName}}</td>
                          <td v-if="hostData.nicStatus == 'up'"><i class="fa fa-arrow-up green"></i></td>
                          <td v-else><i class="fa fa-arrow down red"></i></td>
                          <td></td>
                          <td>{{hostData.nicName}}</td>
                          <td v-if="hostData.nicSpeed == null">0</td>
                          <td v-else>{{hostData.nicSpeed}}</td>
                          <td v-if="hostData.dataCurrentRxBps &lt; 1">&lsaquo; 1</td>
                          <td v-else>{{hostData.dataCurrentRxBps}}</td>
                          <td v-if="hostData.dataCurrentTxBps &lt; 1">&lsaquo; 1</td>
                          <td v-else>{{hostData.dataCurrentTxBps}}</td>
                          <td>{{hostData.dataTotalRx}}</td>
                          <td>{{hostData.dataTotalTx}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

			  <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <div class="x_title">
						<h2>가상머신</h2>
						<div class="clearfix"></div>
                  	</div>
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>상태</th>
                          <th>이름</th>
                          <th>클러스터</th>
                          <th>IP</th>
                          <th>FQDN</th>
                          <th>vNIC<br>상태</th>
						  <th>vNIC</th>
                          <th>vNIC Rx(Mbps)</th>
						  <th>vNIC Tx(Mbps)</th>
                          <th>총 Rx<br>(바이트)</th>
						  <th>총 Tx<br>(바이트)</th>
						</tr>
                      </thead>
                      <tbody>
                        <tr v-for="vmData in vmDatas">
                          <td v-if="vmData.vmStatus == 'up' "><i class="fa fa-arrow-up green"></i></td>
                          <td v-else><i class="fa fa-arrow-down red"></i></td>
                          <td>{{vmData.vmName}}</td>
                          <td>{{vmData.vmCluster}}</td>
                          <td>{{vmData.ip}}</td>
                          <td>{{vmData.fqdn}}</td>
                          <td v-if="vmData.linked == 'true' "><i class="fa fa-arrow-up green"></i></td>
                          <td v-else><i class="fa fa-arrow-down red"></i></td>
                          <td>{{vmData.nicName}}</td>
                          <td v-if="vmData.dataCurrentRxBps &lt; 1">&lsaquo; 1</td>
                          <td v-else>{{vmData.dataCurrentRxBps}}</td>
                          <td v-if="vmData.dataCurrentTxBps &lt; 1">&lsaquo; 1</td>
                          <td v-else>{{vmData.dataCurrentTxBps}}</td>
                          <td>{{vmData.dataTotalRx}}</td>
                          <td>{{vmData.dataTotalTx}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="clearfix"></div>
              <div id="datatable-buttons_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
            </div>
            </div>
       </div>
  </div>

        <!-- /page content -->





 <script src="/js/castanets/network/network.js" type="text/javascript"></script>