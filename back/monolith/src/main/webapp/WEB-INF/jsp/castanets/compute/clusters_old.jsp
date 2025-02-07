<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


		<!-- page content -->
		<div class="right_col" role="main" id="clustersVue">
		
			<spinner v-show="spinnerOn"></spinner>
		
			<div class="" v-show="!spinnerOn" v-cloak>
				<div class="page-title">
					<div class="title_left">
						<h3>컴퓨팅 <small>&#62; 클러스터</small></h3>
					</div>
				</div>
				<div class="clearfix"></div>

				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<div class="row text-right">
									<div style="float:left;">
										<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveClusters()">
											<i class="fa fa-refresh"></i>
										</button>
									</div>
									<div class="btn-group">
										<button type="button" class="btn btn-success btn-sm" @click="goCreateCluster()"><i class="fa fa-file-o"></i> 등록</button>
										<button type="button" class="btn btn-success btn-sm" @click="goUpdateCluster()" :disabled="selectedClusters.length!=1"><i class="fa fa-edit"></i> 편집</button>
										<button type="button" class="btn btn-success btn-sm" @click="removeCluster()" :disabled="selectedClusters.length!=1"><i class="fa fa-trash-o"></i> 삭제</button>
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
											<th>이름</th>
											<th>설명</th>
											<th>CPU 유형</th>
											<th>호스트</th>
											<th>가상머신 수</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="cluster in clusters" @click="selectCluster(cluster)">
											<td class="a-center">
												<input type="checkbox" class="" :id="cluster.name" :value="cluster" v-model="selectedClusters">
											</td>
											<td><a :href="'/compute/cluster?id=' + cluster.id">{{cluster.name}}</a></td>
											<td>{{cluster.description}}</td>
											<td>{{cluster.cpuType}}</td>
											<td>{{cluster.hostCnt}}</td>
											<td>{{cluster.vmCnt}}</td>
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

<script src="/js/castanets/compute/clusters.js" type="text/javascript"></script>