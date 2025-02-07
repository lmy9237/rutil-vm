<%--
  Created by IntelliJ IDEA.
  User: gtpark
  Date: 2020/05/11
  Time: 3:42 오후
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="license">
    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <h4 class="header-title m-t-0">라이선스</h4>

            <div class="clearfix"></div>

            <div class="x_panel">
<%--                <div class="x_title">--%>
<%--                    <h2>엔진</h2>--%>
<%--                    <div class="clearfix"></div>--%>
<%--                </div>--%>
                <div class="x_content">
                    <div class="form-horizontal form-label-left">
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="id">고객코드</label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <input type="text" class="form-control" id="id" v-model="systemProperties.id" required placeholder="ID"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-horizontal form-label-left">
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="password">라이선스 만료일</label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <input type="password" class="form-control" id="password" v-model="systemProperties.id" required placeholder="비밀번호"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-horizontal form-label-left">
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="ip">라이선스 키</label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <input type="text" class="form-control" id="ip" v-model="systemProperties.id" required placeholder="IP"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-horizontal form-label-left">
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="ip">제품</label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <input type="text" class="form-control" id="ip" v-model="systemProperties.id" required placeholder="IP"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-horizontal form-label-left">
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="ip">사용 호스트 수</label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                                <input type="text" class="form-control" id="ip" v-model="systemProperties.id" required placeholder="IP"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="form-group text-right m-b-0">
                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
                    <div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
                        <button type="submit" class="btn btn-success" @click="saveLicense()">등록</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/js/castanets/admin/license.js" type="text/javascript"></script>
