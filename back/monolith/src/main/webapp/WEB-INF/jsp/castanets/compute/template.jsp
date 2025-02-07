<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="cont-wrap" role="main" id="template">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="cont-inner long" v-show="!spinnerOn">
		<div class="doc-list-wrap">
			<div class="doc-tit">
				<h2 class="tit"><a href="/compute/templates">템플릿</a></h2>
				<p class="location">컴퓨팅 &gt; <a href="/compute/templates">템플릿</a></p>
				<%--						<button class="btn btn-primary btn-topR"><img src="../../../../images/btn-list.png" alt="" class="icoImg"> 목록</button>--%>
			</div>

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>{{template.name}}</h3>
				</div>
				<div class="detail-body">
					<div class="rw-list3-wrap">
						<ul class="rw-list3">
							<li>
								<div class="rdBox">
									<div class="blue-ico exp"></div>
									<div class="txtBox">
										<p class="tit">설명</p>
										<p>{{template.description == null ? '-' : template.description}}</p>
									</div>
								</div>
							</li>
							<li>
								<div class="rdBox">
									<div class="blue-ico etime"></div>
									<div class="txtBox">
										<p class="tit">호스트 클러스터</p>
										<p>{{template.cluster.name}}</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- //detail-unitBox -->

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>시스템 정보</h3>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
							<colgroup>
								<col style="width: 15.5%; max-width: 155px;">
								<col style="width: 27.5%; max-width: 275px;">
								<col style="width: 16%; max-width: 160px;">
								<col style="width: 23%; max-width: 230px;">
							</colgroup>
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
			<!-- //detail-unitBox -->

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>가상머신</h3>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
							<colgroup>
								<col style="width: 9%; max-width: 90px;">
								<col style="width: 18%; max-width: 180px;">
								<col style="width: 17%; max-width: 170px;">
								<col style="width: 17%; max-width: 170px;">
								<col style="width: 17%; max-width: 170px;">
								<col style="width: auto; max-width: 220px;">
							</colgroup>
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
								<tr v-if="template.vms.length == 0">
									<td colspan="12">생성된 가상머신이 없습니다.</td>
								</tr>
								<tr v-for="vm in template.vms" v-if="template.vms.length > 0">
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
				</div>
			</div>
			<!-- //detail-unitBox -->

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>네트워크 인터페이스</h3>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
							<colgroup>
								<col style="width: 9%; max-width: 90px;">
								<col style="width: 18%; max-width: 180px;">
								<col style="width: 17%; max-width: 170px;">
								<col style="width: 17%; max-width: 170px;">
								<col style="width: 17%; max-width: 170px;">
								<col style="width: auto; max-width: 220px;">
							</colgroup>
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
								<tr v-if="template.nics.length == 0">
									<td colspan="12">생성된 네트워크 인터페이스가 없습니다.</td>
								</tr>
								<tr v-for="nic in template.nics" v-if="template.nics.length > 0">
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
				</div>
			</div>

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>디스크</h3>
					<div class="btnSet-right">
						<div class="btn-box">
							<button type="button" class="btn-icon btn-icon-edit btn-tooltip" disabled>복사
							</button>
							<div class="c-tooltip top-right">
								<span class="c-tooltip-arrow"></span>
								<span class="txt">복사</span>
							</div>
						</div>
						<!-- 해당 팝업 ( pop_ifedit.html ) 의 내용은 wrap 바로 다음에 위치 -->
					</div>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
							<colgroup>
								<col style="width: 12%; max-width: 90px;">
								<col style="width: 12%; max-width: 100px;">
								<col style="width: 12%; max-width: 120px;">
								<col style="width: 11%; max-width: 110px;">
								<col style="width: 10.5%; max-width: 105px;">
								<col style="width: 12%; max-width: 150px;">
							</colgroup>
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
							<tbody v-if="template.templateDisks.length === 0">
							<tr>
								<td colspan="12">생성된 디스크가 없습니다.</td>
							</tr>
							</tbody>
							<tbody v-for="templateDisk in template.templateDisks" v-if="template.templateDisks.length > 0">
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
			<!-- //detail-unitBox -->

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>이벤트</h3>
				</div>
				<div class="detail-body">
					<div class="scrollBodyX">
						<div class="list-tot" style="min-width: 1000px;">
							<div class="list-fix-wrap">
								<table class="tbl-list">
									<caption></caption>
									<colgroup>
										<col style="width: 8.5%; min-width: 120px;">
										<col style="width: 25%; min-width: 255px;">
										<col style="width: auto;">
										<col style="width: 20%; min-width: 100px;">
									</colgroup>
									<tbody>
									<th>타입</th>
									<th>시간</th>
									<th class="txt-left">메시지</th>
									<th></th>
									</tbody>
								</table>
							</div><!-- //list-fix-wrap -->
							<div class="list-scroll-wrap detail-ms-wrap scrollBodyY">
								<div class="list-scroll-cont">
									<table class="tbl-list">
										<caption></caption>
										<colgroup>
											<col style="width: 8.5%; min-width: 120px;">
											<col style="width: 25%; min-width: 255px;">
											<col style="width: auto;">
											<col style="width: 20%; min-width: 100px;">
										</colgroup>
										<tbody>
<%--										<tr v-for="p in paginatedData" v-if="paginatedData.length > 0">--%>
										<tr v-for="p in pagingVo.viewList" v-if="paginatedData.length > 0">
											<td><i :class="[eventType(p.severity)]"
												   :title="getEventStatusToKor(p.severity)"></i></td>
											<td>{{p.time | date}}</td>
											<td class="text-left" style="text-align: left; padding-left: 22px;">{{p.description}}</td>
											<td></td>
										</tr>
										<tr v-if="paginatedData.length === 0">
											<td colspan="12">이벤트가 없습니다.</td>
										</tr>
										</tbody>
									</table>
								</div>
							</div><!-- //list-scroll-wrap -->
						</div>
					</div>
				</div>
			</div>
			<!-- //detail-unitBox -->
			<pagination-component :dataList="paginatedData" :size="10" v-on:setViewList="setViewList"></pagination-component>
		</div>
		<!-- //doc-list-wrap -->
	</div>
</div>


<script src="/js/castanets/compute/template.js" type="text/javascript"></script>
