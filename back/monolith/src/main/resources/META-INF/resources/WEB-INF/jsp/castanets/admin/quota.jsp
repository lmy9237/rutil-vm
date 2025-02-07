<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


	<!-- page content -->
	<div class="right_col" role="main" id="quotaVue">
		<div class="page-title">
			<div class="title_left">
				<h3> 관리 <small>&#62; <a href="/admin/quotas">쿼터</a></small> &#62; {{quota.name}}</small></h3>
			</div>
		</div>
		<div class="clearfix"></div>
          
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="col-md-3 col-sm-3 col-xs-12">
							<h2> {{quota.name}} </h2>
						</div>
						<div class="col-md-9 col-sm-9 col-xs-12 text-right">
							<div class="btn-group">
								<button type="button" class="btn btn-primary btn-sm" @click="goList()"><i class="fa fa-list-ul"></i> 목록</button>
							</div>
						</div>
						<div class="clearfix"></div>			        
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>이름</th>
									<th>사용된 메모리 총계</th>
									<th>실행중인 vCPU 총계</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="quota.quotaClusterList == null">
									<td>모든 클러스터</td>
									<td v-if="quota.memoryLimitTotal == -1">무제한 {{ quota.memoryUsageTotal * 1024 }}  MB 사용중</td>
									<td v-if="quota.memoryLimitTotal != -1">{{ quota.memoryLimitTotal * 1024 }} MB 중  {{ quota.memoryUsageTotal * 1024 }}  MB 사용중</td>
									<td v-if="quota.vCpuLimitTotal == -1">무제한 {{ quota.vCpuUsageTotal }} vCPUs 사용중</td>
									<td v-if="quota.vCpuLimitTotal != -1"> {{ quota.vCpuLimitTotal }} vCPUs 중 {{ quota.vCpuUsageTotal }} vCPUs 사용중</td>
								</tr>
								<tr v-for="quotaCluster in quota.quotaClusterList">
									<td>{{  quotaCluster.clusterId == null ? '모든 클러스터' : quotaCluster.clusterName }}</td>
									<td v-if="quotaCluster.memoryLimit == -1">무제한 {{ quotaCluster.memoryUsage * 1024 }} MB 사용중</td>
									<td v-if="quotaCluster.memoryLimit != -1">{{ quotaCluster.memoryLimit * 1024 }} MB 중 {{ quotaCluster.memoryUsage }} MB 사용중</td>
									<td v-if="quotaCluster.vCpuLimit == -1">무제한 {{ quotaCluster.vCpuUsage }} vCPUs 사용중</td>
									<td v-if="quotaCluster.vCpuLimit != -1"> {{ quotaCluster.vCpuLimit }} vCPUs 중 {{ quotaCluster.vCpuUsage }} vCPUs 사용중 </td>
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
							<h2>스토리지</h2>
							<div class="clearfix"></div>
						</div>
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>이름</th>
									<th>사용된 스토리지 총계 </th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="quota.quotaStorageDomainList == null">
									<td>모든 스토리지 도메인</td>
									<td v-if="quota.storageLimitTotal == -1">무제한 {{ quota.storageUsageTotal | toFixed }} GB 사용중</td>
									<td v-if="quota.storageLimitTotal != -1">{{ quota.storageLimitTotal | toFixed(0) }} GB 중 {{ quota.storageUsageTotal | toFixed(0) }} GB 사용중</td>
								</tr>
								<tr v-for="quotaStorageDomain in quota.quotaStorageDomainList">
									<td>{{  quotaStorageDomain.storageDomainId == null ? '모든 스토리지 도메인' : quotaStorageDomain.storageDomainName }}</td>
									<td v-if="quotaStorageDomain.storageLimit == -1">무제한 {{ quotaStorageDomain.storageUsage | toFixed(0) }} GB 사용중</td>
									<td v-if="quotaStorageDomain.storageLimit != -1">{{ quotaStorageDomain.storageLimit | toFixed(0) }} GB 중 {{ quotaStorageDomain.storageUsage | toFixed(0) }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>  
				
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
									<td></td>
									<td></td>
									<td>100GByte</td>
									<td>10GByte</td>
									<td>2018.05.22 오전 11:36:11</td>
								</tr>
								<tr>
									<td><i class="fa fa-caret-down"></i> active vm</td>
									<td></td>
									<td></td>
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
									<td>1GByte</td>
									<td>2018.05.22 오전 11:36:11</td>
								</tr>
								<tr>
									<td><i class="fa fa-caret-down"></i> vm-1-disk</td>
									<td></td>
									<td></td>
									<td>20GByte</td>
									<td>1GByte</td>
									<td>2018.05.22 오전 11:36:11</td>
								</tr>
								<tr>
									<td><i class="fa fa-caret-down"></i> active vm</td>
									<td></td>
									<td></td>
									<td>20GByte</td>
									<td>1GByte</td>
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
									<td><i :class="[eventType(p.severity)]"></i></td>
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
	<!-- /page content -->

<script src="/js/castanets/admin/quota.js" type="text/javascript"></script>