<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="cont-wrap" role="main" id="clusterVue">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="cont-inner long" v-show="!spinnerOn">
		<div class="doc-list-wrap" v-show="lastUpdated != ''">
			<div class="doc-tit">
				<h2 class="tit"><a href="/compute/clusters">클러스터</a></h2>
				<p class="location">컴퓨팅 &gt; <a href="/compute/clusters">클러스터</a></p>
				<%--						<button class="btn btn-primary btn-topR"><img src="../../../../images/btn-list.png" alt="" class="icoImg"> 목록</button>--%>
			</div>

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>{{cluster.name}}</h3>
					<p class="detail-updateInfo">{{lastUpdated}}<span class="name">{{cluster.name}}</span></p>
				</div>
				<div class="detail-body">
					<div class="rw-list3-wrap">
						<ul class="rw-list3">
							<li>
								<div class="rdBox">
									<div class="blue-ico exp"></div>
									<div class="txtBox">
										<p class="tit">설명</p>
										<p>{{cluster.description}}</p>
									</div>
								</div>
							</li>
							<li>
								<div class="rdBox">
									<div class="blue-ico etime"></div>
									<div class="txtBox">
										<p class="tit">CPU 유형</p>
										<p>{{cluster.cpuType}}</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="rw-chart-wrap">
						<div class="rdBox donut-rdBox">
							<div class="donut-tbl">
								<div class="donut-tbc">
									<p class="donut-tit">CPU</p>
									<div class="donut-wrap" id="donut-chart1">
										<svg width="124" height="124">
											<circle r="31" cx="62" cy="62"/>
										</svg>
										<div class="donut-inner"><span
												class="num">{{chartData.clusterCpuUsagePercent.toFixed(0)}}</span><span
												class="unit">%</span></div>
									</div>
									<p class="donut-txt"><span>{{chartData.clusterCpuIdleUsagePercent}}%</span>사용가능</p>
								</div>
								<div class="donut-tbc" id="donut-chart2">
									<p class="donut-tit">메모리</p>
									<div class="donut-wrap">
										<svg width="124" height="124">
											<circle r="31" cx="62" cy="62"/>
										</svg>
										<div class="donut-inner"><span class="num">{{(chartData.clusterMemoryUsed / chartData.clusterMemoryTotal * 100).toFixed(0)}}</span><span
												class="unit">%</span></div>
									</div>
									<p class="donut-txt"><span>{{ chartData.clusterMemoryFree == 0 ? 0 : (chartData.clusterMemoryFree / Math.pow(1024, 3)).toFixed(1) }}GB</span>사용가능</p>
								</div>
							</div>
						</div>
						<div class="rdBox">
							<div class="chartBox">
								<div class="chart-header">
									<p class="tit">CPU, 메모리</p>
									<ul class="chart-labelBox">
										<li><span style="background-color: #025cfc;"></span>CPU</li>
										<li><span style="background-color: #b620e0;"></span>메모리</li>
									</ul>
								</div>
								<div id="chartdiv">
									<!--
										1. 마우스 오버할때 들어가야할 불릿 정리
											<span class="chartbullet bul-memory"></span>
											<span class="chartbullet bul-cpu"></span>
											<span class="chartbullet bul-network"></span>
										2. 마우스 오버할때 x좌표의 폰트 색상 변화
											- 메모리		: #025cfc
											- CPU			: #b620e0
											- 네트워크	: #2231a9
									 -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //detail-unitBox -->

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>호스트</h3>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
							<colgroup>
								<col style="width: 9%; max-width: 90px;">
								<col style="width: 12%; max-width: 100px;">
								<col style="width: 12%; max-width: 120px;">
								<col style="width: 16%; max-width: 160px;">
								<col style="width: 10.5%; max-width: 105px;">
								<col style="width: 15%; max-width: 110px;">
								<col style="width: 14%; max-width: 105px;">
								<col style="width: auto; max-width: 200px;">
							</colgroup>
							<thead>
								<tr>
									<th>상태</th>
									<th>이름</th>
									<th>설명</th>
									<th>IP</th>
									<th>가상머신 수</th>
									<th>CPU</th>
									<th>메모리</th>
									<th>네트워크</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="hostDetail in cluster.hostsDetail">
									<td>
										<i v-if="hostDetail.status === 'up'" 								class="fa fa-arrow-up green" 			:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'connecting'" 					class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'down'" 						class="fa fa-arrow-down red" 			:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'error'" 						class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'initializing'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'install_failed'" 				class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'installing'" 					class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'installing_os'" 				class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'maintenance'" 					class="fa fa-wrench gray" 				:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'preparing_for_maintenance'" 	class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'non_operational'" 				class="fa fa-ban red" 					:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'non_responsive'" 				class="fa fa-ban red" 					:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'unassigned'" 					class="fa fa-spinner fa-spin green" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'reboot'" 						class="fa fa-repeat green" 				:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'kdumping'" 					class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else-if="hostDetail.status === 'pending_approval'" 			class="fa fa-exclamation-triangle red" 	:title="getHostStatusToKor(hostDetail.status)"></i>
										<i v-else 															class="fa fa-arrow-down red"></i>
									</td>
									<td><a :href="'/compute/host?id=' + hostDetail.id">{{hostDetail.name}}</a></td>
									<td>{{hostDetail.description}}</td>
									<td>{{hostDetail.address}}</td>
									<td>{{hostDetail.vmsCnt}}</td>
									<!-- <td>{{100 - hostDetail.idleCpuUsagePercent}}%</td> -->
									<td>{{hostDetail.hostLastUsage.cpuUsagePercent}}%</td>
									<td>{{hostDetail.hostLastUsage.memoryUsagePercent}}%</td>
									<td>{{getTotalNicsUsage(hostDetail.hostNicsLastUsage)}}%</td>
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
								<col style="width: 15%; max-width: 100px;">
								<col style="width: 15%; max-width: 120px;">
								<col style="width: 16%; max-width: 160px;">
								<col style="width: 10.5%; max-width: 105px;">
								<col style="width: 11%; max-width: 110px;">
								<col style="width: 10.5%; max-width: 105px;">
								<col style="width: auto; max-width: 200px;">
							</colgroup>
							<thead>
							<tr>
								<th>상태</th>
								<th>이름</th>
								<th>설명</th>
								<th>IP</th>
								<th>호스트명</th>
								<th>CPU</th>
								<th>메모리</th>
								<th>네트워크</th>
							</tr>
							</thead>
							<tbody>
<%--							<tr v-for="vmSummary in cluster.vmSummaries">--%>
							<tr v-for="vmSummary in pagingVo.viewList">
								<td>
									<!-- 아이콘 정리 -->
									<div class="icoStat-box" v-if="vmSummary.status === 'up'">
										<span class="icoStat ico-up btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">완료</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'image_locked'">
										<span class="icoStat ico-locked btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">잠금</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'powering_up'">
										<span class="icoStat ico-waiting btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">작업 중</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'powering_down'">
										<span class="icoStat ico-ingdown btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">내려가는 중</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'not_responding'">
										<span class="icoStat ico-unknown btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">응답 없음</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'unknown'">
										<span class="icoStat ico-help btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">알수 없음</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'suspended'">
										<span class="icoStat ico-suspended btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">일시정지</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'down'">
										<span class="icoStat ico-down btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">내려감</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'reboot_in_progress'">
										<span class="icoStat ico-reboot btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">재부팅 중</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'wait_for_launch'">
										<span class="icoStat ico-refresh btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">기동준비</span>
										</div>
									</div>
									<div class="icoStat-box" v-else-if="vmSummary.status === 'saving_state'">
										<span class="icoStat ico-save btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">저장중</span>
										</div>
									</div>
									<div class="icoStat-box" v-else>
										<span class="icoStat ico-down btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">에러</span>
										</div>
									</div>
								</td>
								<td><a :href="'/compute/vm?id=' + vmSummary.id">{{vmSummary.name}}</a></td>
								<td>{{vmSummary.description}}</td>
								<td>{{vmSummary.address}}</td>
								<td>{{vmSummary.hostName}}</td>
								<td>{{vmSummary.vmLastUsage.cpuUsagePercent}}%</td>
								<td>{{vmSummary.vmLastUsage.memoryUsagePercent}}%</td>
								<td>{{getTotalNicsUsage(vmSummary.vmNicsLastUsage)}}%</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<pagination-component :dataList="cluster.vmSummaries" :size="10" v-on:setViewList="setViewList"></pagination-component>
			</div>

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>관리 네트워크</h3>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
							<colgroup>
								<col style="width: 9%; max-width: 90px;">
								<col style="width: 18%; max-width: 180px;">
								<col style="width: 17%; max-width: 170px;">
							</colgroup>
							<thead>
								<tr>
									<th>이름</th>
									<th>설명</th>
									<th>ID</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="cluster.network !== null">
									<td><a :href="'/networks/network?id=' + cluster.network.id">{{cluster.network.name}}</a></td>
									<td>{{cluster.network.description}}</td>
									<td>{{cluster.network.id}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<!-- //detail-unitBox -->

		</div>
		<!-- //doc-list-wrap -->
	</div>
</div>
</div>
        
<script src="/js/castanets/compute/cluster.js" type="text/javascript"></script>

