<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="template">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>
					컴퓨팅 <small> &#62; <a href="/compute/templates">템플릿</a> &#62; {{template.name}} </small>
				</h3>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>{{template.name}}</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<div class="row">
							<div class="col-md-12 col-sm-12 col-xs-12">
								<div class="panel-body">
									<table class="table table-bordered">
										<tbody>
											<tr>
												<td>설명</td>
												<td>{{template.description == null ? '-' : template.description}}</td>
											</tr>
											<tr>
												<td>호스트 클러스터</td>
												<td>{{template.cluster.name}}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12 col-sm-12 col-xs-12 listb">
					<button class="btn btn-success btn-sm" type="button" v-on:click="goTemplates()">
						<i class="fa fa-list-ul"></i> 목록
					</button>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>시스템 정보</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>CPU 코어 수</th>
									<th>설정된 메모리</th>
									<th>할당할 실제 메모리</th>
									<th>OS 정보</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{{template.systemInfo.totalVirtualCpus}}(
										{{template.systemInfo.virtualSockets}}:
										{{template.systemInfo.coresPerVirtualSocket}}:
										{{template.systemInfo.threadsPerCore}})</td>
									<td>{{template.systemInfo.definedMemory}}</td>
									<td>{{template.systemInfo.guaranteedMemory}}</td>
									<td>{{template.os}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>가상머신</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>상태</th>
									<th>이름</th>
									<th>최적화 옵션</th>
									<th>호스트</th>
									<th>IP 주소</th>
									<th>FQDN</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="vm in template.vms">
									<td v-if="vm.status === 'up'" ><i class="fa fa-arrow-up green"></i></td>
									<td v-else><i class="fa fa-arrow-down red"></i></td>
									<td>{{vm.name}}</td>
									<td>{{vm.type}}</td>
									<td><a :href="'/compute/host?id=' + vm.hostId">{{vm.host}}</a></td>
									<td>{{vm.ipAddress}}</td>
									<td>{{vm.fqdn}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>네트워크 인터페이스</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>상태</th>
									<th>NIC</th>
									<th>연결됨</th>
									<th>네트워크 이름</th>
									<th>프로파일 이름</th>
									<th>유형</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="nic in template.nics">
									<td v-if="nic.status === true"><i class="fa fa-arrow-up green"></i></td>
									<td v-else><i class="fa fa-arrow-down red"></i></td>
									<td>{{nic.nicName == null ? '-' : nic.nicName}}</td>
									<td v-if="nic.plugged"><i class="fa fa-link green"></i></td>
									<td v-else><i class="fa fa-chain-broken red"></i></td>
									<td>{{nic.networkName == null ? '-' : nic.networkName}}</td>
									<td>{{nic.profileName == null ? '-' : nic.profileName}}</td>
									<td>{{nic.interfaceType == null ? '-' : nic.interfaceType}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>

		<!-- <div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="col-md-3 col-sm-3 col-xs-12">
							<h2>디스크</h2>
						</div>
						<div class="col-md-9 col-sm-9 col-xs-12 text-right">
							<div class="btn-group">
								<button type="button" class="btn btn-primary btn-sm" disabled>
									<i class="fa fa-trash-o"></i> 복사
								</button>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center stdomin table-hover">
							<thead>
								<tr>
									<th>별칭</th>
									<th>가상 크기</th>
									<th>실제 크기</th>
									<th>상태</th>
									<th>유형</th>
									<th>생성일자</th>
								</tr>
							</thead>
							<tbody v-for="templateDisk in template.templateDisks">
								<tr data-toggle="collapse" data-target="#accordion" class="clickable">
									<td><i class="fa fa-caret-down"></i> {{templateDisk.name}}</td>
									<td>{{templateDisk.virtualSize}}</td>
									<td>{{templateDisk.actualSize}}</td>
									<td>{{templateDisk.status}}</td>
									<td>{{templateDisk.type}}</td>
									<td>2018.05.22 오전 11:36:11</td>
								</tr>
								<tr id="accordion" class="collapse" v-for="storageDomain in templateDisk.storageDomains">
									<td>{{storageDomain.name}}</td>
									<td>{{storageDomain.type}}</td>
									<td>{{storageDomain.status}}</td>
									<td>{{(storageDomain.diskFree / Math.pow(1024, 3)).toFixed(1) }} GiB</td>
									<td>{{(storageDomain.diskUsed / Math.pow(1024, 3)).toFixed(1) }} GiB</td>
									<td>{{((storageDomain.diskFree + storageDomain.diskUsed) / Math.pow(1024, 3)).toFixed(1) }} GiB</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div> -->

		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="col-md-3 col-sm-3 col-xs-12">
							<h2>디스크</h2>
						</div>
						<div class="col-md-9 col-sm-9 col-xs-12 text-right">
							<div class="btn-group">
								<button type="button" class="btn btn-primary btn-sm" disabled>
									<i class="fa fa-trash-o"></i> 복사
								</button>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center stdomin">
							<thead>
								<tr>
									<th>별칭</th>
									<th>가상 크기</th>
									<th>실제 크기</th>
									<th>상태</th>
									<!-- <th>할당 정책</th>
									<th>인터페이스</th> -->
									<th>유형</th>
									<th>생성일자</th>
								</tr>
							</thead>
							<tbody v-for="templateDisk in template.templateDisks">
								<tr>
									<td><i class="fa fa-caret-down"></i> {{templateDisk.name}}</td>
									<td>{{templateDisk.virtualSize}}</td>
									<td>{{templateDisk.actualSize}}</td>
									<td>{{templateDisk.status}}</td>
									<td>{{templateDisk.type}}</td>
									<td>2018.05.22 오전 11:36:11</td>
								</tr>
								<tr v-for="storageDomain in templateDisk.storageDomains">
									<td>{{storageDomain.name}}</td>
									<td>{{storageDomain.type}}</td>
									<td>{{storageDomain.status}}</td>
									<td>{{(storageDomain.diskFree / Math.pow(1024, 3)).toFixed(1) }} GiB</td>
									<td>{{(storageDomain.diskUsed / Math.pow(1024, 3)).toFixed(1) }} GiB</td>
									<td>{{((storageDomain.diskFree + storageDomain.diskUsed) / Math.pow(1024, 3)).toFixed(1) }} GiB</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>이벤트</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table id="datatable-buttons"
							class="table table-striped dataTable no-footer dtr-inline text-center"
							role="grid" aria-describedby="datatable-buttons_info">
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
			<div class="clearfix"></div>
			<div id="datatable-buttons_wrapper"
				class="dataTables_wrapper form-inline dt-bootstrap no-footer">
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/compute/template.js" type="text/javascript"></script>
