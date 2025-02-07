<%--
  ~ Developed by p a d o on 2019-03-12.
  ~ Last modified 2019-03-12 16:17:04.
  ~ Copyright (c) 2019 OKESTRO. All rights reserved.
  --%>

<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="password">
    <div v-cloak>
        <div class="page-title">
            <div class="title_left">
                <h3>비밀번호 편집</h3>
            </div>
        </div>
        <div class="clearfix"></div>
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <div class="x_content">
                        <br />
                        <form class="form-horizontal form-label-left" id="frmPassword" v-on:submit.prevent="updatePassword">
                            <div class="form-group">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12">현재 비밀번호</label>
                                <div class="col-md-9 col-sm-9 col-xs-12">
                                    <input type="password" class="form-control" placeholder="현재 비밀번호" v-model="user.password" :maxlength="this.$maxPassword" required>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12">새 비밀번호</label>
                                <div class="col-md-9 col-sm-9 col-xs-12">
                                    <input type="password" class="form-control" placeholder="새 비밀번호" @input="checkPassword" v-model="user.newPassword" :maxlength="this.$maxPassword" required>
                                    <p class="text-danger" v-if="!containsEightCharacters || !containsNumber || !containsSpecialCharacter">8~16자 영문, 숫자, 특수문자를 사용하십시오.</p>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12">새 비밀번호 확인</label>
                                <div class="col-md-9 col-sm-9 col-xs-12">
                                    <input type="password" class="form-control" placeholder="새 비밀번호 확인" v-model="user.confPassword" ref="confPassword" :maxlength="this.$maxPassword" required>
                                </div>
                            </div>
                            <div class="form-group text-right">
                                <button class="btn btn-primary waves-effect waves-light m-l-5" type="reset" @click="updateUser()">취소</button>
                                <button class="btn btn-success waves-effect waves-light" type="submit">등록</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/js/castanets/admin/password.js" type="text/javascript"></script>
