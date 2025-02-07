<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div class="cont-wrap" role="main" id="macAddressPools">
	<!-- loading -->
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="cont-inner">
		<div class="doc-list-wrap">
			<div class="doc-tit">
				<h2 class="tit"><a href="/admin/macAddressPools">맥 주소 풀</a></h2>
				<p class="location">관리 &gt; <a href="/admin/macAddressPools">맥 주소 풀</a></p>
				<div class="btnSet-right">
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-refresh btn-tooltip" @click="retrieveMacAddressPools">새로고침</button>
						<div class="c-tooltip top-right">
							<div class="c-tooltip-inner"></div>
							<span class="c-tooltip-arrow"></span>
							<span class="txt">새로고침</span>
						</div>
					</div>
				</div>
			</div>
			<div class="doc-list-body scrollBodyX">
				<div class="doc-list-inner">
					<div class="list-tot">
						<div class="list-fix-wrap">
							<table>
								<caption></caption>
								<colgroup>
									<col style="width: 10%;">
									<col style="width: 20%;">
									<col style="width: 10%;">
									<col style="width: 10%;">
									<col style="width: 10%;">
								</colgroup>
								<tbody>
									<th>이름</th>
									<th>MAC 주소 범위 시작</th>
									<th>MAC 주소 범위 끝</th>
									<th>중복 허용</th>
									<th>설명</th>
								</tbody>
							</table>
						</div><!-- //list-fix-wrap -->

						<div class="list-scroll-wrap scrollBodyY">
							<div class="nodata-wrap" v-if="macAddressPools.length == 0">
								<p class="nodata">생성된 맥 주소 풀 정보가 없습니다.</p>
							</div>
							<div class="list-scroll-cont" v-else>
								<table>
									<caption></caption>
									<colgroup>
										<col style="width: 10%;">
										<col style="width: 20%;">
										<col style="width: 10%;">
										<col style="width: 10%;">
										<col style="width: 10%;">
									</colgroup>
									<tbody>
									<tr v-for="macAddressPool in macAddressPools">
										<td>{{macAddressPool.name}}</td>
										<td>{{macAddressPool.from}}</td>
										<td>{{macAddressPool.to}}</td>
										<td>{{macAddressPool.allowDuplicates ? 'O' : 'X'}}</td>
										<td>{{macAddressPool.description}}</td>
									</tr>
									</tbody>
								</table>
							</div>
						</div><!-- //list-scroll-wrap -->
					</div>
				</div>
			</div>
			<!-- //doc-list-body -->
			<pagination-component :size="10" :dataList="macAddressPools" v-on:setViewList="setViewList"></pagination-component>

		</div>
		<!-- //doc-list-wrap -->

	</div>

</div>

<script src="/js/castanets/admin/macAddressPools.js" type="text/javascript"></script>