<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="cont-wrap" id="networks" v-cloak>
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner">
        <div class="doc-list-wrap">
            <div class="doc-tit">
                <h2 class="tit"><a href="/network/networks">네트워크</a></h2>
                <p class="location"> > <a href="/network/networks">네트워크</a></p>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-refresh" @click="getNetworkList()">새로고침</button>
                        <div class="c-tooltip top-right">
                            <div class="c-tooltip-inner"></div>
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">새로고침</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-new btn-tooltip" @click="openPop('createNetwork')">네트워크 등록</button>
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
<%--                                    <col style="width: 3%; min-width: 40px;">--%>
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                </colgroup>
                                <tbody>
<%--                                    <th>선택</th>--%>
                                    <th>이름</th>
                                    <th>설명</th>
                                    <th>역할</th>
                                    <th>VLAN 태그</th>
                                    <!-- <th>QoS 이름</th> -->
                                    <th>레이블</th>
                                    <!-- <th>공급자</th> -->
                                    <th>MTU</th>
                                    <th>작업</th>
                                </tbody>
                            </table>
                        </div><!-- //list-fix-wrap -->
                        <div class="list-scroll-wrap scrollBodyY">
                            <div class="nodata-wrap" v-if="networkList.length == 0">
                                <p class="nodata">생성된 네트워크 정보가 없습니다.</p>
                            </div>
                            <div class="list-scroll-cont" v-else>
                                <table>
                                    <caption></caption>
                                    <colgroup>
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 102px;">
                                    </colgroup>
                                    <tbody>
                                        <tr v-for="(data, index) in pagingVo.viewList">
<%--                                            <td><a  href="#" :id="index" v-on:click="goNetworkDetail(index)">{{data.name}}</a></td>--%>
                                            <td><a  href="#" :id="index" @click="goNetworkDetail(data)">{{data.name}}</a></td>
                                            <td>{{data.description}}</td>

                                            <td v-if="data.usage =='VM'">가상머신</td>
                                            <td v-else>{{data.usage}}</td>

                                            <td>{{data.vlan}}</td>
                                            <!-- <td>{{data.qos}}</td> -->
                                            <td>{{data.label}}</td>
                                            <!-- <td>{{data.provider}}</td> -->

                                            <td v-if="data.mtu != 0 && data.mtu !=1500">{{data.mtu}}</td>
                                            <td v-else>기본값(1500)</td>
                                            <td>
                                                <div class="list-popbtn-wrap">
                                                    <button type="button" class="btn-openPop" ></button>
                                                    <div class="openPop-target scrollBodyY long">
                                                        <div class="openPop-target_inner">
                                                            <ul>
                                                                <li><button @click="updateNetwork(index)"><span class="ico ico-edit" ></span>편집</button></li>
                                                                <li><button @click="deleteNetworkSet(index)"><span class="ico ico-del" ></span>삭제</button></li>
                                                            </ul>
                                                        </div>
                                                    </div><!-- //openPop-target -->
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div><!-- //list-scroll-wrap -->
                    </div>
                </div>
            </div>
            <!-- //doc-list-body -->
            <pagination-component :dataList="networkList" :size="10" v-on:setViewList="setViewList"></pagination-component>
        </div>
        <!-- //doc-list-wrap -->
    </div>
    <div class="alert-dim" id="deleteModal">
        <div class="alertBox">
            <div class="alert-wrap">
                <div class="alert-body">
                    <p>다음 항목을 삭제하시겠습니까?<br>
                        - {{ deleteNetworksNames }}
                    </p>
                </div>
                <div class="alert-footer">
                    <div class="alert-btnBox">
                        <button class="btn-alert-foot" @click="closePop('deleteModal')">취소</button>
                        <button class="btn-alert-foot btn-alert-primary" @click="deleteNetwork()">확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- //cont-wrap -->

<%-- create modal --%>
<div class="modalBox" id="createNetwork">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox-inner">
        <section class="c-modal-wrap c-modal-auto">
            <div class="c-modal-inner">
                <div class="c-modal-header">
                    <h1>새 논리 네트워크</h1>
                </div>
                <div class="c-modal-body scroll-css">
                    <div class="steps-cont-wrap">
                        <div class="c-modal-body_inner">
                            <h2 class="steps-tit">일반</h2>
                            <div class="frmSet">
                                <div class="frm-unit half-left">
                                    <p class="tit">이름 <span class="mustbe"></span></p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="이름"  v-model="networkName" :maxlength="this.$maxId" required>
                                        <p class="errTxt" v-if="!validationName">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
                                    </div>
                                </div>
                                <div class="frm-unit half-right">
                                    <p class="tit">설명 </p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="설명" v-model="networkDescription">
                                    </div>
                                </div>
                            </div>

                            <p class="tit">네트워크 최대 전송 단위</p>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">VLAN 태깅 활성화
                                        <label class="ui-check">
                                            <input type="checkbox" v-model="networkVlanAt">
                                            <span class="chk-ico"></span>
                                        </label>
                                    </p>
                                    <div class="inputBox">
                                        <input type="text" v-if="networkVlanAt" class="input-custom"  placeholder="" v-model="networkVlan" :maxlength="4">
                                        <input type="text" v-else class="input-custom" readonly>
                                        <p class="errTxt" v-if="networkVlanAt && !validationVlan">1~4094 숫자만 사용 가능합니다.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">MTU</p>
                                    <div class="radio-wrap">
                                        <label class="ui-check">
                                            <input type="radio" value="default" v-model="networkMtuRadio">
                                            <span class="chk-ico"></span>
                                            <span class="txt">기본값(1500)</span>
                                        </label>
                                        <label class="ui-check">
                                            <input type="radio" value="customize" v-model="networkMtuRadio">
                                            <span class="chk-ico"></span>
                                            <span class="txt">사용자정의</span>
                                        </label>
                                    </div>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" v-if="networkMtuRadio == 'default'" placeholder="" readonly>
                                        <input type="text" v-else class="input-custom" v-model="networkMtu" placeholder="" :maxlength="10">
                                        <p class="errTxt" v-if="!(networkMtuRadio == 'default') && !validationMtu">1~2,147,483,647 숫자만 사용 가능합니다. ( , 없이 입력해주세요 예 : 10000)</p>
                                    </div>
                                </div>
                            </div>

                            <%-- 클러스터 --%>
                            <h2 class="steps-tit">클러스터</h2>
                            <div class="frmSet pb-0">
                                <div class="frm-unit">
                                    <div class="doc-list-wrap">
                                        <div class="doc-list-body">
                                            <div class="doc-list-inner">
                                                <div class="list-tot">
                                                    <div class="list-fix-wrap">
                                                        <table>
                                                            <caption></caption>
                                                            <colgroup>
                                                                <col style="width: auto;">
                                                                <col style="width: auto;">
                                                                <col style="width: auto;">
                                                            </colgroup>
                                                            <tbody>
                                                            <th>이름</th>
                                                            <th>연결</th>
                                                            <th>필수</th>
                                                            </tbody>
                                                        </table>
                                                    </div><!-- //list-fix-wrap -->

                                                    <div class="list-scroll-wrap scrollBodyY" style="max-height: 330px;">
                                                        <!-- 0. 조회 내역이 없을때 - 시작 -->
                                                        <!-- <div class="nodata-wrap">
                                                            <p class="nodata">조회된 내용이 없습니다.</p>
                                                        </div> -->
                                                        <!-- //0. 조회 내역이 없을때 - 끝 -->

                                                        <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                        <div class="list-scroll-cont">
                                                            <table class="tbl-long tbl-radio">
                                                                <caption></caption>
                                                                <colgroup>
                                                                    <col style="width: auto;">
                                                                    <col style="width: 260px;">
                                                                    <col style="width: 180px;">
                                                                </colgroup>
                                                                <tbody>
                                                                <tr v-for="(cluster, index) in clusters">
                                                                    <td class="txt-strong">{{cluster.clusterName}}</td>
                                                                    <td>
                                                                        <label class="ui-check">
                                                                            <input type="checkbox" v-model="cluster.connect">
                                                                            <span class="chk-ico"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <label class="ui-check">
                                                                            <input type="checkbox" v-model="cluster.required">
                                                                            <span class="chk-ico"></span>
                                                                        </label>
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
                                    </div>
                                </div>
                            </div>
                            <%--/// 클러스터 --%>

                        </div><!-- //c-modal-body_inner -->
                    </div><!-- //steps-cont-wrap -->
                </div><!-- //c-modal-body -->
                <div class="c-modal-footer">
                    <div class="buttonSet">
                        <button class="btn-c-modal btn-cancel" @click="closePop('createNetwork')">취소</button>
                        <button class="btn-c-modal" @click="addNetwork()">생성</button>
                    </div>
                </div> <!-- //c-modal-footer -->
            </div>
        </section>
    </div>
</div>
<%--/// create modal --%>


<%-- update modal --%>
<div class="modalBox" id="updateNetwork">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox-inner">
        <section class="c-modal-wrap c-modal-auto">
            <div class="c-modal-inner">
                <div class="c-modal-header" v-if="networkNames != null">
                    <h1>네트워크 편집 > {{orgNetworkName}}</h1>
                </div>
                <div class="c-modal-body scroll-css">
                    <div class="steps-cont-wrap">
                        <div class="c-modal-body_inner">
                            <h2 class="steps-tit">일반</h2>
                            <div class="frmSet">
                                <div class="frm-unit half-left">
                                    <p class="tit">이름 <span class="mustbe"></span></p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="이름" v-model="networkName" :maxlength="this.$maxId" required>
                                        <p class="errTxt" v-if="!validationName">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
                                        <p class="errTxt" v-if="!validationNames">이미 등록된 네트워크 이름 입니다.</p>
                                    </div>
                                </div>
                                <div class="frm-unit half-right">
                                    <p class="tit">설명 </p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="설명" v-model="networkDescription">
                                    </div>
                                </div>
                            </div>

                            <p class="tit">네트워크 최대 전송 단위</p>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">VLAN 태깅 활성화
                                        <label class="ui-check">
                                            <input type="checkbox" v-model="networkVlanAt">
                                            <span class="chk-ico"></span>
                                        </label>
                                    </p>
                                    <div class="inputBox">
                                        <input type="text" v-if="networkVlanAt" class="input-custom"  placeholder="" v-model="networkVlan" :maxlength="4">
                                        <input type="text" v-else class="input-custom" placeholder="" readonly>
                                        <p class="errTxt" v-if="networkVlanAt && !validationVlan">1~4094 숫자만 사용 가능합니다.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">가상머신 네트워크
                                        <label class="ui-check">
                                            <input type="checkbox" v-model="networkVm">
                                            <span class="chk-ico"></span>
                                        </label>
                                    </p>
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">MTU</p>
                                    <div class="radio-wrap">
                                        <label class="ui-check">
                                            <input type="radio" id="radio1" value="default" v-model="networkMtuRadio">
                                            <span class="chk-ico"></span>
                                            <span class="txt">기본값(1500)</span>
                                        </label>
                                        <label class="ui-check">
                                            <input type="radio" id="radio2" value="customize" v-model="networkMtuRadio">
                                            <span class="chk-ico"></span>
                                            <span class="txt">사용자정의</span>
                                        </label>
                                    </div>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" v-if="networkMtuRadio == 'default'" placeholder="" readonly>
                                        <input type="text" v-else class="input-custom" v-model="networkMtu" placeholder="" :maxlength="10">
                                        <p class="errTxt" v-if="!(networkMtuRadio == 'default') && !validationMtu">1~2,147,483,647 숫자만 사용 가능합니다. ( , 없이 입력해주세요 예 : 10000)</p>
                                    </div>
                                </div>
                            </div>

                            <%-- 클러스터 --%>
                            <h2 class="steps-tit">클러스터</h2>
                            <div class="frmSet pb-0">
                                <div class="frm-unit">
                                    <div class="doc-list-wrap">
                                        <div class="doc-list-body">
                                            <div class="doc-list-inner">
                                                <div class="list-tot">
                                                    <div class="list-fix-wrap">
                                                        <table>
                                                            <caption></caption>
                                                            <colgroup>
                                                                <col style="width: auto;">
                                                                <col style="width: auto;">
                                                                <col style="width: auto;">
                                                            </colgroup>
                                                            <tbody>
                                                            <th>이름</th>
                                                            <th>연결</th>
                                                            <th>필수</th>
                                                            </tbody>
                                                        </table>
                                                    </div><!-- //list-fix-wrap -->

                                                    <div class="list-scroll-wrap scrollBodyY" style="max-height: 330px;">
                                                        <!-- 0. 조회 내역이 없을때 - 시작 -->
                                                        <!-- <div class="nodata-wrap">
                                                            <p class="nodata">조회된 내용이 없습니다.</p>
                                                        </div> -->
                                                        <!-- //0. 조회 내역이 없을때 - 끝 -->

                                                        <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                        <div class="list-scroll-cont">
                                                            <table class="tbl-long tbl-radio">
                                                                <caption></caption>
                                                                <colgroup>
                                                                    <col style="width: auto;">
                                                                    <col style="width: 260px;">
                                                                    <col style="width: 180px;">
                                                                </colgroup>
                                                                <tbody>
                                                                <tr v-for="(cluster, index) in clusters">
                                                                    <td class="txt-strong">{{cluster.clusterName}}</td>
                                                                    <td>
                                                                        <label class="ui-check">
                                                                            <input type="checkbox" v-model="cluster.connect">
                                                                            <span class="chk-ico"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <label class="ui-check">
                                                                            <input type="checkbox" v-model="cluster.required">
                                                                            <span class="chk-ico"></span>
                                                                        </label>
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
                                    </div>
                                </div>
                            </div>
                            <%--/// 클러스터 --%>

                        </div><!-- //c-modal-body_inner -->
                    </div><!-- //steps-cont-wrap -->
                </div><!-- //c-modal-body -->
                <div class="c-modal-footer">
                    <div class="buttonSet">
                        <button class="btn-c-modal btn-cancel" @click="closePop('updateNetwork')">취소</button>
                        <button class="btn-c-modal" @click="updateNetwork">편집</button>
                    </div>
                </div> <!-- //c-modal-footer -->
            </div>
        </section>
    </div>
</div>
<%--/// update modal --%>





 <script src="/js/castanets/network/networks.js" type="text/javascript"></script>
 <script src="/js/castanets/network/createNetwork.js" type="text/javascript"></script>
 <script src="/js/castanets/network/updateNetwork.js" type="text/javascript"></script>