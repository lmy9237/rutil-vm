<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="addUser">
	<div v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3 v-if="mode == 'create'">사용자 등록</h3>
				<h3 v-if="mode == 'update'">사용자 편집</h3>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_content">
						<br />
						<form class="form-horizontal form-label-left" id="frmUser" v-on:submit.prevent="addUser">
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">ID<span class="text-danger">*</span></label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" placeholder="ID" parsley-trigger="change" :disabled="mode == 'update'" @input="checkId" v-model="user.id" :maxlength="this.$maxId" required>
									<p class="text-danger" v-if="(!containsFourCharacters || !validId || !containsKorean) && mode == 'create'">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">성</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" placeholder="성" v-model="user.lastName" :maxlength="this.$maxName">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">이름</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" placeholder="이름" v-model="user.name" :maxlength="this.$maxName">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">비밀번호<span class="text-danger">*</span>
									&nbsp;&nbsp;<span class="align-middle" v-if="mode == 'update'"><a href="#" class="text-primary" @click="viewPassword()">변경하기</a></span>
								</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="password" class="form-control" placeholder="비밀번호" data-parsley-maxlength="6" :disabled="mode == 'update'" @input="checkPassword" v-model="user.password" :maxlength="this.$maxPassword" required>
									<p class="text-danger" v-if="!containsEightCharacters || !containsNumber || !containsSpecialCharacter">8~16자 영문, 숫자, 특수문자를 사용하십시오.</p>
								</div>
							</div>
							<hr>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">이메일</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<input type="text" class="form-control" placeholder="이메일" parsley-type="email" v-model="user.email" :maxlength="this.$maxEmail">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12">역할</label>
								<div class="col-md-9 col-sm-9 col-xs-12">
									<select class="form-control" v-model="user.administrative">
										<option value="true">관리자</option>
										<option value="false">사용자</option>
									</select>
								</div>
							</div>
							<div class="form-group text-right">
								<button class="btn btn-primary waves-effect waves-light m-l-5" type="reset" @click="viewUsers()">취소</button>
								<button class="btn btn-success waves-effect waves-light" type="submit">등록</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/admin/addUser.js" type="text/javascript"></script>