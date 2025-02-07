<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="cont-wrap" id="users">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="cont-inner" v-show="!spinnerOn" v-cloak>
		<div class="doc-list-wrap">
			<div class="doc-tit">
				<h2 class="tit"><a href="/admin/users">사용자</a></h2>
				<p class="location">관리 &gt; <a href="/admin/users">사용자</a></p>
				<div class="btnSet-right">
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-refresh btn-tooltip" @click="retrieveUsers()">새로고침</button>
						<div class="c-tooltip top-right">
							<div class="c-tooltip-inner"></div>
							<span class="c-tooltip-arrow"></span>
							<span class="txt">새로고침</span>
						</div>
					</div>
					<div class="btn-box">
						<button type="button" class="btn-icon btn-icon-new btn-tooltip" @click="openPop('addUser')">등록</button>
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
						<div class="list-fix-wrap" >
							<table>
								<caption></caption>
								<colgroup>
									<col style="width: 10%;">
									<col style="width: 15%;">
									<col style="width: 10%;">
									<col style="width: 10%;">
									<col style="width: 15%;">
									<col style="width: 10%;">
								</colgroup>
								<tbody>
								<th>역할</th>
								<th>ID</th>
								<th>성</th>
								<th>이름</th>
								<th>이메일</th>
								<th>작업</th>
								</tbody>
							</table>
						</div><!-- //list-fix-wrap -->

						<div class="list-scroll-wrap scrollBodyY">
							<!-- 0. 조회 내역이 없을때 - 시작 -->
							<div class="nodata-wrap" v-if="users.length == 0">
								<p class="nodata">생성된 사용자 정보가 없습니다.</p>
							</div>
							<!-- //0. 조회 내역이 없을때 - 끝 -->

							<!-- 1. 조회 내역이 있을때 - 시작 -->
							<div class="list-scroll-cont" v-else>
								<table>
									<caption></caption>
									<colgroup>
										<col style="width: 10%;">
										<col style="width: 15%;">
										<col style="width: 10%;">
										<col style="width: 10%;">
										<col style="width: 15%;">
										<col style="width: 10%;">
									</colgroup>
									<tbody>
										<tr v-for="user in pagingVo.viewList">
<%--											<td class="a-center">--%>
<%--												<input type="checkbox" :id="user.id" :value="user" v-model="selectedUsers">--%>
<%--											</td>--%>
											<td v-if="user.administrative === true">관리자</td>
											<td v-else>사용자</td>
											<td>{{user.username}}</td>
											<td>{{user.surName}}</td>
											<td>{{user.firstName}}</td>
											<td>{{user.email}}</td>
											<td>
												<div class="list-popbtn-wrap">
													<button type="button" class="btn-openPop" @click="setSelectUser(user)"></button>
													<div class="openPop-target scrollBodyY long">
														<div class="openPop-target_inner">
															<ul>
																<li><button type="button" :disabled="selectedUsers.length <= 0" @click="openPop('updateUser')"><span class="ico ico-edit"></span>편집</button></li>
																<li><button type="button" :disabled="selectedUsers.length <= 0" @click="openPop('deleteModal')"><span class="ico ico-del"></span>삭제</button></li>
															</ul>
														</div>
													</div><!-- //openPop-target -->
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
			<pagination-component :dataList="users" :size="10" v-on:setViewList="setViewList"></pagination-component>
		</div>
		<!-- //doc-list-wrap -->

		<%-- delete modal --%>
		<div class="alert-dim" id="deleteModal">
			<div class="alertBox">
				<div class="alert-wrap">
					<div class="alert-body">
						<p>다음 사용자를 삭제하시겠습니까?<br>
							- {{selectedUserInfo.id}}
						</p>
					</div>
					<div class="alert-footer">
						<div class="alert-btnBox">
							<button class="btn-alert-foot" @click="closePop('deleteModal')">취소</button>
							<button class="btn-alert-foot btn-alert-primary" @click="removeUsers()">확인</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<%--/// delete modal --%>
	</div>
</div>
<!-- //cont-wrap -->

<%-- create/update modal --%>
<div class="modalBox" id="addUser">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="modalBox-inner">
		<section class="c-modal-wrap c-modal-auto">
			<div class="c-modal-inner">
				<div class="c-modal-header">
					<h1 v-if="mode == 'create'">사용자 등록</h1>
					<h1 v-else-if="mode == 'update'">사용자 편집</h1>
				</div>
				<div class="c-modal-body">
					<div class="c-modal-body_inner pt-40">
						<div class="frmSet">
							<div class="frm-unit">
								<p class="tit">ID<span class="mustbe"></span></p>
								<div class="inputBox">
									<input type="text" 
									  class="input-custom" 
									  placeholder="ID" 
									  parsley-trigger="change" 
									  :disabled="mode == 'update'" 
									  @input="checkId" 
									  v-model="user.username" 
									  :maxlength="this.$maxId" 
									  required
									>
								</div>
								<p class="errTxt" 
								  v-if="(!containsFourCharacters || !validId || !containsKorean) && mode == 'create'"
								>
									4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.
								</p>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">성</p>
								<div class="inputBox">
									<input type="text" 
									  class="input-custom" 
									  placeholder="성" 
									  v-model="user.surName" 
									  :maxlength="this.$maxName"
									>
								</div>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">이름</p>
								<div class="inputBox">
									<input type="text" 
									  class="input-custom" 
									  placeholder="이름" 
									  v-model="user.firstName"
									  :maxlength="this.$maxName"
									>
								</div>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">비밀번호<span class="mustbe"></span></p>
								<div class="inputBox">
									<input type="password" 
									  class="input-custom" 
									  placeholder="비밀번호" 
									  data-parsley-maxlength="6" 
									  :disabled="mode == 'update'" 
									  @input="checkPassword" 
									  v-model="user.password" 
									  :maxlength="this.$maxPassword" 
									  required
									>
								</div>
								<p class="errTxt" 
								  v-if="!containsEightCharacters || !containsNumber || !containsSpecialCharacter"
								>
									8~16자 자 영문, 숫자, 특수문자를 사용하십시오.
								</p>
							</div>
							<div class="frm-unit half-right">
								<p class="tit"></p>
								<div class="inputBox">
									<h2 class="steps-tit" 
									  v-if="mode == 'update'" 
									  @click="openPop('password')"
								    >
								    	<a>변경하기</a>
									</h2>
								</div>
							</div>
						</div>

						<div class="frmSet">
							<div class="frm-unit half-left">
								<p class="tit">이메일</p>
								<div class="inputBox">
									<input type="text" 
									  class="input-custom" 
									  placeholder="이메일" 
									  parsley-type="email" 
									  v-model="user.email" 
									  :maxlength="this.$maxEmail"
									>
								</div>
							</div>
							<div class="frm-unit half-right">
								<p class="tit">역할</p>
								<selectbox-component 
									:selectvo="createRoleSelectVo" 
									v-on:setSelected="setSelected"
								>
								</selectbox-component>
							</div>
						</div>
					</div>
				</div> <!-- //c-modal-body -->
				<div class="c-modal-footer">
					<div class="buttonSet">
						<button class="btn-c-modal btn-cancel" @click="closePop('addUser')">취소</button>
						<button class="btn-c-modal" @click="addUser" :disabled="!this.containsFourCharacters || !this.validId || !this.containsKorean || !this.containsEightCharacters || !this.containsNumber || !this.containsSpecialCharacter">확인</button>
					</div>
				</div> <!-- //c-modal-footer -->
			</div>
		</section>
	</div>
</div>
<%--/// create/update modal --%>

<%-- 비밀번호 변경 --%>
<div class="modalBox" id="password">
	<v-spinner v-show="spinnerOn"></v-spinner>
	<div class="modalBox-inner">
		<section class="c-modal-wrap c-modal-auto">
			<div class="c-modal-inner">
				<div class="c-modal-header">
					<h1>비밀번호 편집</h1>
				</div>
				<div class="c-modal-body">
					<div class="c-modal-body_inner pt-40">
						<div class="frmSet">
							<div class="frm-unit">
								<p class="tit">현재 비밀번호<span class="mustbe"></span></p>
								<div class="inputBox">
									<input type="password" class="input-custom" placeholder="현재 비밀번호" v-model="user.password" :maxlength="this.$maxPassword" required>
								</div>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit">
								<p class="tit">새 비밀번호<span class="mustbe"></span></p>
								<div class="inputBox">
									<input type="password" class="input-custom" placeholder="새 비밀번호" @input="checkPassword" v-model="user.newPassword" :maxlength="this.$maxPassword" required>
									<p class="errTxt" v-if="!containsEightCharacters || !containsNumber || !containsSpecialCharacter">8~16자 영문, 숫자, 특수문자를 사용하십시오.</p>
								</div>
							</div>
						</div>
						<div class="frmSet">
							<div class="frm-unit">
								<p class="tit">새 비밀번호 확인<span class="mustbe"></span></p>
								<div class="inputBox">
									<input type="password" class="input-custom" placeholder="새 비밀번호 확인" v-model="user.confPassword" ref="confPassword" :maxlength="this.$maxPassword" required>
								</div>
							</div>
						</div>
					</div>
				</div> <!-- //c-modal-body -->
				<div class="c-modal-footer">
					<div class="buttonSet">
						<button class="btn-c-modal btn-cancel" @click="closePop('password')">취소</button>
						<button class="btn-c-modal" @click="updatePassword" :disabled="!this.containsEightCharacters || !this.containsNumber || !this.containsSpecialCharacter">확인</button>
					</div>
				</div> <!-- //c-modal-footer -->
			</div>
		</section>
	</div>
</div>
<%--/// 비밀번호 변경 --%>


<script src="/js/castanets/admin/users.js" type="text/javascript"></script>
<script src="/js/castanets/admin/addUser.js" type="text/javascript"></script>
<script src="/js/castanets/admin/password.js" type="text/javascript"></script>