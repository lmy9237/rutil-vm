<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


    
      <!-- page content -->
        <div class="right_col" role="main" id="networks" v-cloak>
        <spinner v-show="spinnerOn"></spinner>
          <div v-show="!spinnerOn">
            <div class="page-title">
              <div class="title_left">
                <h3> 네트워크 </h3>
              </div>
            </div>
            <div class="clearfix"></div>

            <div class="row" >
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <div class="row text-right">
                    	<div style="float:left;">
							<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="getNetworkList()">
								<i class="fa fa-refresh"></i>
							</button>
						</div>
                        <div class="btn-group">
                            <button type="button" class="btn btn-success btn-sm" v-on:click="createNetwork"><i class="fa fa-file-o"></i> 등록</button>
                            <button type="button" class="btn btn-success btn-sm" v-on:click="updateNetwork" v-bind:disabled="selectNetworks.length == 0 || networkList == null || selectNetworks.length >1" ><i class="fa fa-edit"></i> 편집</button>
                            <!-- <button type="button" class="btn btn-success btn-sm" v-on:click="deleteNetwork" v-bind:disabled="selectNetworks.length == 0"><i class="fa fa-trash-o"></i> 삭제</button> -->
                            <button type="button" class="btn btn-success btn-sm" v-on:click="deleteNetwokSet" v-bind:disabled="selectNetworks.length == 0 || selectNetworks.length >1 || networkList == null" data-toggle="modal" data-target=".removevmmodal"><i class="fa fa-trash-o"></i> 삭제</button>
                       </div>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <table class="table table-striped text-center">
                      <thead>
                        <tr>
                          <th>선택</th>
                          <th>이름</th>
                          <th>설명</th>
                          <th>역할</th>
                          <th>VLAN 태그</th>
                          <!-- <th>QoS 이름</th> -->
                          <th>레이블</th>
                          <!-- <th>공급자</th> -->
						  <th>MTU</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(data, index) in networkList" v-on:click="mouseOnClick(index)">

                          <td><input type="checkbox" id="jack" v-bind:value="index" v-model="selectNetworks"></td>
                          <td><a  href="#" v-on:click="goNetworkDetail(index)">{{data.name}}</a></td>
                          <td>{{data.description}}</td>

                          <td v-if="data.usage =='VM'">가상머신</td>
                          <td v-else>{{data.usage}}</td>

                          <td>{{data.vlan}}</td>
                          <!-- <td>{{data.qos}}</td> -->
                          <td>{{data.label}}</td>
                          <!-- <td>{{data.provider}}</td> -->

                          <td v-if="data.mtu != 0 && data.mtu !=1500">{{data.mtu}}</td>
                          <td v-else>기본값(1500)</td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
              <div class="clearfix"></div>


            </div>
          </div>
          <!-- vm remove modal -->
	<div class="modal fade removevmmodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">네트워크 삭제</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-12 col-sm-12 col-xs-12">
								다음 항목을 삭제하시겠습니까?
							</label>
						</div>
						<div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12" style="margin-top:10px">
									- {{deleteNetworksNames}}
							</label>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="deleteNetwork()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>

        </div>
        <!-- /page content -->


 <script src="/js/castanets/network/networks.js" type="text/javascript"></script>