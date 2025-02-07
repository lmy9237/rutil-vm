<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="cont-wrap" id="disksVue">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="cont-inner" v-show="!spinnerOn" v-cloak>
		<div class="doc-list-wrap">
			<div class="doc-tit">
				<h2 class="tit"><a href="/storage/disks">디스크</a></h2>
				<p class="location">스토리지 &gt; <a href="/storage/disks">디스크</a></p>
				<div class="btnSet-right">
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-refresh btn-tooltip" @click="retrieveDisks(true)">새로고침</button>
						<div class="c-tooltip top-right">
							<div class="c-tooltip-inner"></div>
							<span class="c-tooltip-arrow"></span>
							<span class="txt">새로고침</span>
						</div>
					</div>
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-vmmake btn-tooltip" @click="openPop('uploadModal')">업로드</button>
						<div class="c-tooltip top-right">
							<span class="c-tooltip-arrow"></span>
							<span class="txt">업로드</span>
						</div>
					</div>
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-new btn-tooltip" @click="openPop('createModal')">등록</button>
						<div class="c-tooltip top-right">
							<span class="c-tooltip-arrow"></span>
							<span class="txt">등록</span>
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
									<col style="width: 4%;">
									<col style="width: 9%;">
									<col style="width: 15%;">
									<col style="width: 5%;">
									<col style="width: 4%;">
									<col style="width: 7%;">
									<col style="width: 7%;">
									<col style="width: 5%;">
									<col style="width: 15%;">
									<col style="width: 9%;">
								</colgroup>
								<tbody >
                                <th @click="diskListSort('status', 'string')" style="cursor: pointer;">상태</th>
								<th @click="diskListSort('name', 'string')" style="cursor: pointer;">이름</th>
								<th @click="diskListSort('id', 'string')" style="cursor: pointer;">ID</th>
								<th @click="diskListSort('virtualSize', 'number')" style="cursor: pointer;">가상크기</th>
								<th @click="diskListSort('sharable', 'boolean')" style="cursor: pointer;">공유</th>
								<th @click="diskListSort('attachedTo', 'string')" style="cursor: pointer;">연결 대상</th>
								<th @click="diskListSort('storageDomainName', 'string')" style="cursor: pointer;">스토리지 도메인</th>
								<th @click="diskListSort('type', 'string')" style="cursor: pointer;">유형</th>
								<th @click="diskListSort('description', 'string')" style="cursor: pointer;">설명</th>
								<th>작업</th>
								</tbody>
							</table>
						</div><!-- //list-fix-wrap -->

						<div class="list-scroll-wrap scrollBodyY">
							<!-- 0. 조회 내역이 없을때 - 시작 -->
							<div class="nodata-wrap" v-if="disks.length == 0">
								<p class="nodata">생성된 가상머신이 없습니다.</p>
							</div>
							<!-- //0. 조회 내역이 없을때 - 끝 -->

							<!-- 1. 조회 내역이 있을때 - 시작 -->
							<div class="list-scroll-cont">
								<table>
									<caption></caption>
									<colgroup>
										<col style="width: 4%;">
										<col style="width: 9%;">
										<col style="width: 15%;">
										<col style="width: 5%;">
										<col style="width: 4%;">
										<col style="width: 7%;">
										<col style="width: 7%;">
										<col style="width: 5%;">
										<col style="width: 15%;">
										<col style="width: 9%;">
									</colgroup>
									<tbody>
									<!-- 한줄반복 시작 -->
									<tr v-for="disk in pagingVo.viewList">
										<td>
											<!-- 아이콘 정리 -->
											<div class="icoStat-box" v-if="disk.status === 'ok'">
												<span class="icoStat ico-up btn-tooltip"></span>
												<div class="c-tooltip j-right">
													<span class="c-tooltip-arrow"></span>
													<span class="txt">정상</span>
												</div>
											</div>
											<div class="icoStat-box" v-if="disk.status === 'locked'">
												<span class="icoStat ico-locked btn-tooltip"></span>
												<div class="c-tooltip j-right">
													<span class="c-tooltip-arrow"></span>
													<span class="txt">잠김</span>
												</div>
											</div>
											<div class="icoStat-box" v-if="disk.status === 'illegal'">
												<span class="icoStat ico-unknown btn-tooltip"></span>
												<div class="c-tooltip j-right">
													<span class="c-tooltip-arrow"></span>
													<span class="txt">액세스 실패</span>
												</div>
											</div>
											<div class="icoStat-box" v-if="disk.status !== 'ok' && disk.status !== 'locked' && disk.status !== 'illegal'">
												<span class="icoStat ico-reboot btn-tooltip"></span>
												<div class="c-tooltip j-right">
													<span class="c-tooltip-arrow"></span>
													<span class="txt">업로드 중</span>
												</div>
											</div>
										</td>
										<td>{{disk.name}}</td>
										<td>{{disk.id}}</td>
										<td>{{(disk.virtualSize / Math.pow(1024, 3)).toFixed(2) }}GB</td>
										<td>{{disk.sharable ? 'O' : 'X'}}</td>
										<td>{{disk.attachedTo}}</td>
										<td>{{disk.storageDomainName}}</td>
										<td>{{disk.type}}</td>
										<td>{{disk.description}}</td>
										<td >
											<div class="list-popbtn-wrap">
												<button type="button" class="btn-openPop" @click="selectDisk(disk)"></button>
												<div class="openPop-target scrollBodyY long">
													<div class="openPop-target_inner">
														<ul>
															<li><button @click="openPop('deleteModal')" :disabled="selectedDisks.length != 1"><span class="ico ico-del"></span>삭제</button></li>
															<li><button @click="openPop('moveModal')" :disabled="selectedDisks.length != 1"><span class="ico ico-govm"></span>이동</button></li>
															<li><button @click="openPop('copyModal')" :disabled="selectedDisks.length != 1"><span class="ico ico-new"></span>복사</button></li>
														</ul>
													</div>
												</div>
											</div>
										</td>
									</tr>
									</tbody>
								</table>
							</div>
							<!-- //1. 조회 내역이 있을때 - 끝 -->
						</div><!-- //list-scroll-wrap -->
					</div>
				</div>
			</div>
			<!-- //doc-list-body -->
			<pagination-component :dataList="disks" :size="10" v-on:setViewList="setViewList"></pagination-component>
            <sort-component :dataList="disks" :dataString="dataString" v-on:setViewList="setViewList"></sort-component>

			<%-- delete modal --%>
			<div class="alert-dim" id="deleteModal">
				<div class="alertBox">
					<div class="alert-wrap">
						<div class="alert-body">
							<p>디스크를 삭제하시겠습니까?<br>
								- {{selectedDiskInfo.name}}
							</p>
						</div>
						<div class="alert-footer">
							<div class="alert-btnBox">
								<button class="btn-alert-foot" @click="closePop('deleteModal')">취소</button>
								<button class="btn-alert-foot btn-alert-primary" @click="removeDisk">확인</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<%--/// delete modal --%>

			<%-- 이등/복사 modal --%>
			<div class="modalBox" id="moveAndCopyModal">
				<div class="modalBox-inner">
					<section class="c-modal-wrap c-modal-small">
						<div class="c-modal-inner">
							<div class="c-modal-header">
								<h1>{{migDisk.migrationType=='move' ? '디스크 이동' : '디스크 복사'}}</h1>
							</div>
							<div class="c-modal-body scroll-css">
								<div class="steps-cont-wrap">
									<div class="c-modal-body_inner pt-30">
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">이름</p>
												<div class="inputBox" v-if="migDisk.migrationType=='move'">
													{{migDisk.disk.name}}
												</div>
												<div class="inputBox" v-if="migDisk.migrationType=='copy'">
													<input type="text" class="input-custom" v-model="migDisk.targetDiskName">
												</div>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">가상 크기</p>
												<div class="inputBox">
													{{(migDisk.disk.virtualSize / Math.pow(1024, 3)).toFixed(2) }}GB
												</div>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">소스</p>
												<div class="inputBox">
													<div class="inputBox">
														{{migDisk.disk.storageDomainName}}
													</div>
												</div>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">대상</p>
												<selectbox-component v-show="modalType == 'moveModal' ? true : false" :selectvo="selectVoStorageDomainMove" :index="10005" v-on:setSelected="setSelected"></selectbox-component>
												<selectbox-component v-show="modalType == 'copyModal' ? true : false" :selectvo="selectVoStorageDomainCopy" :index="10006" v-on:setSelected="setSelected"></selectbox-component>
												대상 스토리지 도메인을 선택해야 합니다. 이동은 대상 스토리지가 같을 수 없습니다.
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="c-modal-footer">
								<div class="buttonSet">
									<button class="btn-c-modal btn-cancel" @click="closePop('moveAndCopyModal')">취소</button>
									<button class="btn-c-modal" :disabled="migDisk.targetStorageDomainId == '' " @click="migrationDisk()">확인</button>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
			<%--/// 디스크 이등/복사 modal --%>

			<%-- upload modal --%>
			<div class="modalBox" id="uploadModal">
				<div class="modalBox-inner">
					<section class="c-modal-wrap c-modal-small">
						<div class="c-modal-inner">
							<div class="c-modal-header">
								<h1>이미지 업로드</h1>
							</div>
							<div class="c-modal-body scroll-css">
								<div class="steps-cont-wrap">
									<div class="c-modal-body_inner">
										<div class="frmSet">
											<div class="frm-unit half-left">
												<p class="tit">이미지 업로드</p>
												<div class="inputBox">
													<form action="/storage/disks/retrieveDiskImage" method="post" name="file">
														<input @change="receiveDiskFile" ref="diskFile" type="file" value="파일 선택" name="file"/>
													</form>
												</div>
											</div>
											<div class="frm-unit half-right">
												<p class="tit">디스크 포멧</p>
												<selectbox-component :selectvo="selectVoDiskFormat" :index="10000" v-on:setSelected="setSelected" :disabled="this.uploadDiskFile.length == 0 ? true : false"></selectbox-component>
											</div>
										</div>

										<div class="frmSet" v-if="uploadDisk.format !== '포멧 선택'">
											<div class="frm-unit">
												<p class="tit">크기(GByte)</p>
												<div class="inputBox">
													<input type="text" class="input-custom" :disabled="true" v-model="uploadDisk.size">
												</div>
											</div>
										</div>
										<div class="frmSet" v-if="uploadDisk.format !== '포멧 선택'">
											<div class="frm-unit">
												<p class="tit">가상 크기(GByte)</p>
												<div class="inputBox">
													<input type="text" class="input-custom" :disabled="uploadDisk.format !== 'qcow2'" v-model="uploadDisk.virtualSize">
												</div>
											</div>
										</div>

										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">이름</p>
												<div class="inputBox">
													<input type="text" class="input-custom" v-model="uploadDisk.name">
												</div>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">설명</p>
												<div class="inputBox">
													<input type="text" class="input-custom" v-model="uploadDisk.description">
												</div>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">
													<label class="ui-check">
														삭제 후 초기화
														<input type="checkbox" v-model="uploadDisk.wipeAfterDelete">
														<span class="chk-ico"></span>
													</label>
												</p>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">
													<label class="ui-check">
														공유 가능
														<input type="checkbox" v-model="uploadDisk.isShareable">
														<span class="chk-ico"></span>
													</label>
												</p>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">데이터 센터</p>
												<selectbox-component :selectvo="selectVoDataCenter" :index="10001" v-on:setSelected="setSelected"></selectbox-component>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">스토리지 도메인</p>
												<selectbox-component :selectvo="selectVoStorageDomain" :index="10002" v-on:setSelected="setSelected"></selectbox-component>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">디스크 프로파일</p>
												<selectbox-component :selectvo="selectVoDiskProfile" :index="10003" v-on:setSelected="setSelected"></selectbox-component>
											</div>
										</div>
										<div class="frmSet">
											<div class="frm-unit">
												<p class="tit">사용 호스트</p>
												<selectbox-component :selectvo="selectVoHost" :index="10004" v-on:setSelected="setSelected"></selectbox-component>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="c-modal-footer">
								<div class="buttonSet">
									<button class="btn-c-modal btn-cancel" @click="closePop('uploadModal')">취소</button>
									<button class="btn-c-modal" :disabled="uploadDisk.format == '포멧 선택'" @click="makeUploadDisk" >확인</button>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
			<%--/// upload modal --%>
		</div>
		<!-- //doc-list-wrap -->
	</div>
</div>

<%-- create modal --%>
<div class="modalBox" id="createModal">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="modalBox-inner">
		<section class="c-modal-wrap c-modal-auto">
			<div class="c-modal-inner">
				<div class="c-modal-header">
					<h1>새 가상 디스크</h1>
				</div>
				<div class="c-modal-body">
					<div class="c-modal-body_inner pt-40">
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">크기(GByte)</p>
								<div class="inputBox">
									<input type="text" class="input-custom" placeholder="#GBtye" v-model="disk.size">
								</div>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">설명</p>
								<div class="inputBox">
									<input type="text" class="input-custom" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">
								</div>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit">
								<p class="tit">이름 <span class="mustbe"></span></p>
								<div class="inputBox">
									<input type="text" class="input-custom" placeholder="이름" v-model="disk.name" @input="checkDiskName" :maxlength="this.$maxName">
								</div>
								<p class="errTxt" v-if="diskNameStatus || disk.name == ''">기호는 '-', '_'만 사용가능합니다. 공백도 허용하지 않습니다.</p>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">스토리지 도메인</p>
								<selectbox-component :selectvo="storageDomains" v-on:setSelected="setSelected"></selectbox-component>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">&nbsp;</p>
								<div class="frm-only-check">
									<label class="ui-check">
										<input type="checkbox" v-model="disk.shareable">
										<span class="chk-ico"></span> 공유 가능
									</label>
								</div>
							</div>
						</div>
					</div>
				</div> <!-- //c-modal-body -->
				<div class="c-modal-footer">
					<div class="buttonSet">
						<button class="btn-c-modal btn-cancel" @click="closePop('createModal')">취소</button>
						<button class="btn-c-modal" @click="createDisk()">생성</button>
					</div>
				</div> <!-- //c-modal-footer -->
			</div>
		</section>
	</div>
</div>
<%--/// create modal --%>
<script src="/js/castanets/storage/disks.js" type="text/javascript"></script>
<script src="/js/castanets/storage/createDisk.js" type="text/javascript"></script>