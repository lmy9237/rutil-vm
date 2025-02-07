<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="cont-wrap" id="domainVue">
	<spinner v-show="spinnerOn"></spinner>
	<div class="cont-inner long" v-show="!spinnerOn" v-cloak>
		<div class="doc-list-wrap">
			<div class="doc-tit">
				<h2 class="tit"><a href="/storage/domains">도메인</a></h2>
				<p class="location">스토리지 &gt; <a href="/storage/domains">도메인</a></p>
				<button class="btn btn-primary btn-topR" @click="goDomains"><img src="../../../../images/btn-list.png" alt="" class="icoImg">목록</button>
			</div>

			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>{{domain.name}}</h3>
<%--					<p class="detail-updateInfo">마지막 업데이트 2021.03.05 02:25:44 <span class="name"></span></p>--%>
				</div>
				<div class="detail-body">
					<div class="rw-list3-wrap">
						<ul class="rw-list3">
							<li>
								<div class="rdBox">
									<div class="blue-ico exp"></div>
									<div class="txtBox">
										<p class="tit">설명</p>
										<p>{{domain.description}}</p>
									</div>
								</div>
							</li>
							<li>
								<div class="rdBox">
									<div class="blue-ico etime"></div>
									<div class="txtBox">
										<p class="tit">경로</p>
										<p>{{domain.storageAddress}}:{{domain.storagePath}}</p>
									</div>
								</div>
							</li>
<%--							<li>--%>
<%--								<div class="rdBox">--%>
<%--									<div class="blue-ico etime"></div>--%>
<%--									<div class="txtBox">--%>
<%--										<p class="tit">실행 호스트</p>--%>
<%--										<p>클러스트 내의 호스트</p>--%>
<%--									</div>--%>
<%--								</div>--%>
<%--							</li>--%>
						</ul>
					</div>
					<div class="rw-chart-wrap">
						<div class="rdBox donut-rdBox">
							<div class="donut-tbl">
								<div class="donut-tbc">
									<p class="donut-tit">스토리지</p>
									<div class="donut-wrap">
										<svg width="124" height="124">
											<circle r="31" cx="62" cy="62" id="donutCircle"/>
										</svg>
										<div class="donut-inner"><span class="num" data-num="50" id="donutNum">{{(domain.diskUsed / (domain.diskUsed + domain.diskFree) * 100).toFixed(0)}}</span><span class="unit">%</span></div>
									</div>
									<p class="donut-txt"><span>총 {{ ( (domain.diskFree + domain.diskUsed) / Math.pow(1024, 3)).toFixed(1) }}GB 중 </span> {{ (domain.diskFree / Math.pow(1024, 3)).toFixed(1) }}GB 사용가능</p>
								</div>
							</div>
						</div>
						<div class="rdBox">
							<div class="chartBox">
								<div class="chart-header">
									<p class="tit">스토리지 사용률</p>
									<ul class="chart-labelBox">
										<li><span style="background-color: #025cfc;"></span>사용률</li>
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

			<!-- 디스크 -->
			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>디스크</h3>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
							<colgroup>
								<col style="width: 8.5%; min-width: 120px;"><!-- 상태아이콘에 해당되는 곳은 min-width: 120px 필수 조정 -->
								<col style="width: 18%; min-width: 180px;">
								<col style="width: 13%; min-width: 170px;">
								<col style="width: 13%; min-width: 170px;">
								<col style="width: 15%; min-width: 170px;">
								<col style="width: 10%; min-width: 170px;">
								<col style="width: 30%; min-width: 220px;">
							</colgroup>
							<thead>
							<tr>
								<th>상태</th>
								<th>이름</th>
								<th>가상 크기</th>
								<th>실제 크기</th>
								<th>연결 대상</th>
								<th>유형</th>
								<th>설명</th>
							</tr>
							</thead>
							<tbody>
<%--								<tr v-for="disk in domain.diskVoList">--%>
								<tr v-for="disk in pagingVo.viewListDisk">
									<td>
										<div v-if="disk.status == 'ok'" class="icoStat-box">
											<span class="icoStat ico-up btn-tooltip"></span>
											<div class="c-tooltip j-right">
												<span class="c-tooltip-arrow"></span>
												<span class="txt">완료</span>
											</div>
										</div>
										<div v-else class="icoStat-box">
											<span class="icoStat ico-down btn-tooltip"></span>
											<div class="c-tooltip j-right">
												<span class="c-tooltip-arrow"></span>
												<span class="txt">완료</span>
											</div>
										</div>
<%--										<i class="fa fa-circle-o green" ></i>--%>
									</td>
									<td>{{disk.name}}</td>
									<td>{{ (disk.virtualSize / Math.pow(1024, 3)).toFixed(2) }}GB </td>
									<td>{{ (disk.actualSize / Math.pow(1024, 3)).toFixed(2) }}GB </td>
									<td>{{disk.attachedTo}}</td>
									<td>{{disk.type}}</td>
									<td>{{disk.description}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<pagination-component :dataList="domain.diskVoList" :size="10" :flag="'disk'" v-on:setViewList="setViewList"></pagination-component>
			</div>
			<!-- //디스크 -->

			<!-- 디스크 스냅샷 -->
			<div class="detail-unitBox">
				<div class="detail-header">
					<h3>디스크 스냅샷</h3>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption>
								<col style="width: 8.5%;">
								<col style="width: 10%;">
								<col style="width: 15%;">
								<col style="width: 8.5%;">
								<col style="width: 10%;">
								<col style="width: 10%;">
								<col style="width: 20%;">
								<col style="width: 20%;">
							</caption>
							<thead>
							<tr>
								<th>상태</th>
								<th>이름</th>
								<th>ID</th>
								<th>크기</th>
								<th>연결 대상</th>
								<th>유형</th>
								<th>설명</th>
								<th>생성일</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="diskSnapshot in pagingVo.viewListDiskSnapshot">
								<td>
									<div v-if="diskSnapshot.status == 'OK'" class="icoStat-box">
										<span class="icoStat ico-up btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">완료</span>
										</div>
									</div>
									<div v-else class="icoStat-box">
										<span class="icoStat ico-suspended btn-tooltip"></span>
										<div class="c-tooltip j-right">
											<span class="c-tooltip-arrow"></span>
											<span class="txt">일시정지</span>
										</div>
									</div>
								</td>
								<td>{{diskSnapshot.name}}</td>
								<td>{{diskSnapshot.id}}</td>
								<td>{{ (diskSnapshot.actualSize / Math.pow(1024, 3)).toFixed(2) }}GB </td>
								<td>{{diskSnapshot.attachedTo}}</td>
								<td>{{diskSnapshot.type}}</td>
								<td>{{diskSnapshot.description}}</td>
								<td>{{diskSnapshot.cdate}}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<pagination-component :dataList="domain.diskSnapshotVoList" :size="10" :flag="'diskSnapshot'" v-on:setViewList="setViewList"></pagination-component>
			</div>
			<!-- //디스크 스냅샷 -->

			<!-- 이미지 파일 -->
			<div class="detail-unitBox" v-if="domain.type == 'ISO'">
				<div class="detail-header">
					<h3>이미지</h3>
					<div class="btnSet-right">
						<div class="btn-box">
							<div class="c-tooltip top-right">
								<span class="c-tooltip-arrow"></span>
								<span class="txt">편집</span>
							</div>
						</div>
					</div>
				</div>
				<div class="detail-body scrollBodyX">
					<div class="tbl-list-wrap" style="min-width: 1000px;">
						<table class="tbl-list">
							<caption></caption>
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
			<!--/// 이미지 파일 -->

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
										<col style="width: 8.5%; min-width: 120px">
										<col style="width: 25%; min-width: 255px">
										<col style="width: auto;">
										<col style="width: 20%; min-width: 100px">
									</colgroup>
									<tbody>
									<th>타입</th>
									<th>시간</th>
									<th class="text-left">메시지</th>
									<th></th>
									</tbody>
								</table>
							</div><!-- //list-fix-wrap -->
							<div class="list-scroll-wrap detail-ms-wrap scrollBodyY">
								<div class="list-scroll-cont">
									<table class="tbl-list">
										<caption></caption>
										<colgroup>
											<col style="width: 8.5%; min-width: 85px;">
											<col style="width: 25%; min-width: 255px;">
											<col style="width: auto;">
										</colgroup>
										<tbody>
<%--											<tr v-for="p in paginatedData">--%>
											<tr v-for="p in pagingVo.viewListEvent">
												<td>
													<div class="icoStat-box">
														<span v-if="p.severity == 'normal'" class="icoStat ico-up btn-tooltip"></span>
														<span v-else-if="p.severity == 'warning'" class="icoStat ico-unknown btn-tooltip"></span>
														<span v-else class="icoStat ico-suspended btn-tooltip"></span>
														<div class="c-tooltip j-right">
															<span class="c-tooltip-arrow"></span>
															<span class="txt">{{getEventStatusToKor(p.severity)}}</span>
														</div>
													</div>
												</td>
												<td>{{p.time | date}}</td>
												<td class="txt-left">{{p.description}}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //detail-unitBox -->
			<pagination-component :dataList="paginatedData" :size="10" :flag="'event'" v-on:setViewList="setViewList"></pagination-component>
		</div>
		<!-- //doc-list-wrap -->
	</div>
</div>
<!-- //cont-wrap -->
<script src="/js/castanets/storage/domain.js" type="text/javascript"></script>