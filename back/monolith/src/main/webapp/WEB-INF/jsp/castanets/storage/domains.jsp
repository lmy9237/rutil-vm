<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="cont-wrap" id="domainsVue">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner" v-show="!spinnerOn" v-cloak>
        <div class="doc-list-wrap">
            <div class="doc-tit">
                <h2 class="tit"><a href="/storage/domains">도메인</a></h2>
                <p class="location">스토리지 &gt; <a href="/storage/domains">도메인</a></p>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-refresh btn-tooltip" @click="retrieveDomains">새로고침</button>
                        <div class="c-tooltip top-right">
                            <div class="c-tooltip-inner"></div>
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">새로고침</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-new btn-tooltip" @click="showDomainModal('createDomainVue')">등록</button>
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
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 102px;">
                                </colgroup>
                                <tbody>
                                    <th>상태</th>
                                    <th>이름</th>
                                    <th>설명</th>
                                    <th>도메인 유형</th>
                                    <th>스토리지 유형</th>
                                    <th>포맷</th>
                                    <th>전체공간</th>
                                    <th>여유공간</th>
                                    <th>작업</th>
                                </tbody>
                            </table>
                        </div><!-- //list-fix-wrap -->
                        <div class="list-scroll-wrap scrollBodyY">
                            <!-- 0. 조회 내역이 없을때 - 시작 -->
                            <div class="nodata-wrap" v-if="domains.length === 0">
                                <p class="nodata">생성된 가상머신이 없습니다.</p>
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
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 102px;">
                                    </colgroup>
                                    <tbody>
                                    <!-- 한줄반복 시작 -->
                                        <tr v-for="(domain, index) in pagingVo.viewList">
                                            <td>
                                                <div class="icoStat-box" v-if="domain.status === 'active'">
                                                    <span class="icoStat ico-up btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">완료</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'activating'">
                                                    <span class="icoStat ico-waiting btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">활성화 중</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'detaching'">
                                                    <span class="icoStat ico-detach btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">분리중</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'inactive'">
                                                    <span class="icoStat ico-suspended btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">일시정지</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'locked'">
                                                    <span class="icoStat ico-locked btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">잠금</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'mixed'">
                                                    <span class="icoStat ico-mixed btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">mixed</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'maintenance'">
                                                    <span class="icoStat ico-management btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">MANAGEMENT</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'preparing_for_maintenance'">
                                                    <span class="icoStat ico-sming btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">유지보수 준비중</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'unattached'">
                                                    <span class="icoStat ico-unlink btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">연결해제</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else-if="domain.status === 'unknown'">
                                                    <span class="icoStat ico-noinfo btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">알수없음</span>
                                                    </div>
                                                </div>
                                                <div class="icoStat-box" v-else>
                                                    <span class="icoStat ico-noinfo btn-tooltip"></span>
                                                    <div class="c-tooltip j-right">
                                                        <span class="c-tooltip-arrow"></span>
                                                        <span class="txt">알수없음</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><a :href="'/storage/domain?id=' + domain.id">{{domain.name}}</a></td>
                                            <td>{{domain.description}}</td>
                                            <td>{{domain.type}}</td>
                                            <td>{{domain.storageType}}</td>
                                            <td>{{domain.storageFormat}}</td>
                                            <td>{{ ((domain.diskFree + domain.diskUsed) / Math.pow(1024, 3)).toFixed(1) }}GB</td>
                                            <td>{{ (domain.diskFree / Math.pow(1024, 3)).toFixed(1) }}GB</td>
                                            <td>
                                                <div class="list-popbtn-wrap">
                                                    <button type="button" class="btn-openPop" @click="selectDomain(domain)"></button>
                                                    <div class="openPop-target scrollBodyY long">
                                                        <div class="openPop-target_inner">
                                                            <ul>
                                                                <li>
                                                                    <button @click="showDomainModal('update')"><span class="ico ico-edit"></span>편집</button>
                                                                </li>
                                                                <li>
                                                                    <button @click="showDomainModal('domainDeleteModal')" :disabled="!isPosibleDelete()"><span class="ico ico-del"></span>삭제</button>
                                                                </li>
                                                                <li>
                                                                    <button @click="showDomainModal('domainMaintenanceModal')" :disabled="!isPosibleMaintenance()"><span class="ico ico-sm"></span>유지보수</button>
                                                                </li>
                                                                <li>
                                                                    <button @click="showDomainModal('domainMaintenanceStopModal')" disabled="!isPosibleActive()"><span class="ico ico-activation"></span>활성</button>
                                                                </li>
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
            <pagination-component :dataList="domains" :size="10" v-on:setViewList="setViewList"></pagination-component>
        </div>
        <!-- //doc-list-wrap -->
    </div>

    <%-- 삭제 modal --%>
    <div class="alert-dim" id="domainDeleteModal">
        <div class="alertBox">
            <div class="alert-wrap">
                <div class="alert-body">
                    <p>스토리지 도메인을 삭제 하시겠습니까?<br>
                        - {{ selectedDomainInfo.name }}
                    </p>
                </div>
                <div class="alert-footer">
                    <div class="alert-btnBox">
                        <button class="btn-alert-foot" @click="closeDomainModal('domainDeleteModal')">취소</button>
                        <button class="btn-alert-foot btn-alert-primary" @click="removeDomain()">확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%--/// 삭제 modal --%>

    <%-- 유지보수 modal --%>
    <div class="alert-dim" id="domainMaintenanceModal">
        <div class="alertBox">
            <div class="alert-wrap">
                <div class="alert-body">
                    <p>유지보수 모드로 전환하시겠습니까?<br>
                        - {{ selectedDomainInfo.name }}
                    </p>
                </div>
                <div class="alert-footer">
                    <div class="alert-btnBox">
                        <button class="btn-alert-foot" @click="closeDomainModal('domainMaintenanceModal')">취소</button>
                        <button class="btn-alert-foot btn-alert-primary" @click="maintenanceStart">확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%--/// 유지보수 modal --%>

    <%-- 활성 modal --%>
    <div class="alert-dim" id="domainMaintenanceStopModal">
        <div class="alertBox">
            <div class="alert-wrap">
                <div class="alert-body">
                    <p>유지보수 모드를 해제하여 활성화 하시겠습니까?<br>
                        - {{ selectedDomainInfo.name }}
                    </p>
                </div>
                <div class="alert-footer">
                    <div class="alert-btnBox">
                        <button class="btn-alert-foot" @click="closeDomainModal('domainMaintenanceStopModal')">취소</button>
                        <button class="btn-alert-foot btn-alert-primary" @click="maintenanceStop">확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%--/// 활성 modal --%>
</div>

<%-- create/update modal --%>
<div class="modalBox" id="createDomainVue">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox-inner">
        <section class="c-modal-wrap c-modal-small">
            <div class="c-modal-inner">
                <div class="c-modal-header">
                    <h1>{{ isUpdate ? domain.name : "새 스토리지 도메인" }}</h1>
                </div>
                <div class="c-modal-body">
                    <div class="c-modal-body_inner pt-40">
                        <div class="frmSet">
                            <div class="frm-unit half-left">
                                <p class="tit">도메인 기능 <span class="mustbe"></span></p>
                                <selectbox-component :selectvo="selectVo.domainTypes" :disabled="isUpdate" :index="10001" v-on:setSelected="setSelected"></selectbox-component>
                            </div>
                            <div class="frm-unit half-right">
                                <p class="tit">스토리지 유형 <span class="mustbe"></span></p>
                                <selectbox-component :selectvo="selectVo.storageTypes" :disabled="isUpdate" :index="10002" v-on:setSelected="setSelected"></selectbox-component>
                            </div>
                        </div>
                        <div class="frmSet">
                            <div class="frm-unit half-left">
                                <p class="tit">사용할 호스트 <span class="mustbe"></span></p>
                                <selectbox-component :selectvo="selectVo.hosts" :disabled="isUpdate" :index="10003" v-on:setSelected="setSelected"></selectbox-component>
                            </div>
                            <div class="frm-unit half-right">
                                <p class="tit">설명</p>
                                <div class="inputBox">
                                    <input type="text" class="input-custom" v-model="domain.description" :maxlength="this.$maxDescription">
                                </div>
                            </div>
                        </div>
                        <div class="frmSet">
                            <div class="frm-unit">
                                <p class="tit">이름 <span class="mustbe"></span></p>
                                <div class="inputBox">
                                    <input type="text" class="input-custom"  placeholder="이름" v-model="domain.name" @input="checkDomainName" :maxlength="this.$maxName">
                                    <p class="errTxt" v-if="domainNameStatus || domain.name == ''">기호는 '-', '_'만 사용가능합니다. 공백도 허용하지 않습니다.</p>
                                </div>
                            </div>
                        </div>

                        <%-- NFS only --%>
                        <div class="frmSet" v-if="domain.storageType == 'NFS'">
                            <div class="frm-unit">
                                <p class="tit">내보내기 경로 <span class="mustbe"></span></p>
                                <div class="inputBox">
                                    <input type="text" class="input-custom" placeholder="내보내기 경로" v-model="domain.path" :disabled="isUpdate">
                                    <p>ex) myserver.mydomain.com:/my/local/path</p>
                                </div>
                            </div>
                        </div>
                        <%--/// NFS only --%>

                        <%-- ISCSI only --%>
                        <div class="frmSet" v-if="domain.storageType == 'ISCSI'">
                            <div class="frm-unit">
                                <p class="tit">주소 <span class="mustbe"></span></p>
                                <div class="inputBox">
                                    <input type="text" class="input-custom" placeholder="주소" v-model="domain.iscsi.address" :disabled="isUpdate">
                                </div>
                            </div>
                        </div>
                        <div class="frmSet" v-if="domain.storageType == 'ISCSI'">
                            <div class="frm-unit half-left">
                                <p class="tit">포트 <span class="mustbe"></span></p>
                                <div class="inputBox">
                                    <input type="text" class="input-custom" placeholder="포트" v-model="domain.iscsi.port" :disabled="isUpdate">
                                </div>
                            </div>
                            <div class="frm-unit half-right">
                                <p class="tit">사용자이름 <span class="mustbe"></span></p>
                                <div class="inputBox">
                                    <input type="text" class="input-custom" placeholder="사용자이름" v-model="domain.iscsi.id" :disabled="isUpdate">
                                </div>
                            </div>
                        </div>
<%--                        <div class="frmSet" v-if="domain.storageType == 'ISCSI'">--%>
<%--                            <div class="frm-unit">--%>
<%--                                <p class="tit">사용자이름 <span class="mustbe"></span></p>--%>
<%--                                <div class="inputBox">--%>
<%--                                    <input type="text" class="input-custom" placeholder="사용자이름" v-model="domain.iscsi.id" :disabled="isUpdate">--%>
<%--                                </div>--%>
<%--                            </div>--%>
<%--                        </div>--%>
                        <div class="frmSet pb-30" v-if="domain.storageType == 'ISCSI'">
                            <div class="frm-unit half-left">
                                <p class="tit">암호 <span class="mustbe"></span></p>
                                <div class="search-complex-wrap">
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="암호" v-model="domain.iscsi.password" :disabled="isUpdate">
                                    </div>
                                    <div class="search-complex-btn">
                                        <button class="btn-search-mini" @click="iscsiDiscover()" :disabled="isUpdate">검색</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="frmSet pb-0" v-if="domain.storageType == 'ISCSI'">
                            <div class="frm-unit">
                                <div class="doc-list-wrap">
                                    <div class="doc-list-body">
                                        <div class="doc-list-inner">
                                            <div class="list-tot">
                                                <div class="list-fix-wrap">
                                                    <table>
                                                        <caption></caption>
                                                        <colgroup>
                                                            <col style="width: 170px;">
                                                            <col style="width: auto;">
                                                            <col style="width: 130px;">
                                                            <col style="width: 110px;">
                                                        </colgroup>
                                                        <tbody>
                                                            <th>대상이름</th>
                                                            <th>주소</th>
                                                            <th>포트</th>
                                                            <th>연결</th>
                                                        </tbody>
                                                    </table>
                                                </div><!-- //list-fix-wrap -->
                                                <div class="list-scroll-wrap scrollBodyY" style="max-height: 330px;">
                                                    <!-- 0. 조회 내역이 없을때 - 시작 -->
                                                    <div class="nodata-wrap" v-if="iscsis.length == 0">
                                                        <p class="nodata">조회된 내용이 없습니다.</p>
                                                    </div>
                                                    <!-- //0. 조회 내역이 없을때 - 끝 -->

                                                    <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                    <div class="list-scroll-cont" v-else>
                                                        <table class="tbl-long tbl-radio">
                                                            <caption></caption>
                                                            <colgroup>
                                                                <col style="width: 170px;">
                                                                <col style="width: auto;">
                                                                <col style="width: 130px;">
                                                                <col style="width: 110px;">
                                                            </colgroup>
                                                            <tbody>
                                                            <!-- 한줄반복 시작 -->
                                                                <tr v-for="iscsi in iscsis" v-if="!isUpdate">
                                                                    <td>{{iscsi.target}}</td>
                                                                    <td>{{iscsi.address}}</td>
                                                                    <td>{{iscsi.port}}</td>
                                                                    <td><button type="button" class="btn-icon btn-icon-commit btn-tooltip" @click="iscsiLogin(iscsi)" :disabled="domain.iscsi.loginAt == true || isUpdate">연결</button></td>
                                                                </tr>
                                                                <tr v-if="isUpdate">
                                                                    <td>{{domain.iscsi.target}}</td>
                                                                    <td>{{domain.iscsi.address}}</td>
                                                                    <td>{{domain.iscsi.port}}</td>
                                                                    <td><button type="button" class="btn-icon btn-icon-commit btn-tooltip" :disabled="isUpdate">연결</button></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <!-- //1. 조회 내역이 있을때 - 끝 -->

                                                </div><!-- //list-scroll-wrap -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <%--/// ISCSI only --%>

                        <%-- FCP only --%>
                        <div class="frmSet pb-0" v-if="domain.storageType == 'FCP'">
                            <div class="frm-unit">
                                <div class="doc-list-wrap">
                                    <div class="doc-list-body">
                                        <div class="doc-list-inner">
                                            <div class="list-tot">
                                                <div class="list-fix-wrap">
                                                    <table>
                                                        <caption></caption>
                                                        <colgroup>
                                                            <col style="width: 30%">
                                                            <col style="width: 10%">
                                                            <col style="width: 10%">
                                                            <col style="width: 20%">
                                                            <col style="width: 20%">
                                                            <col style="width: 20%">
                                                        </colgroup>
                                                        <tbody>
                                                        <th>LUN ID</th>
                                                        <th>크기</th>
                                                        <th>경로</th>
<%--                                                        <th>벤더 ID</th>--%>
                                                        <th>제품 ID</th>
                                                        <th>시리얼</th>
                                                        <th>추가</th>
                                                        </tbody>
                                                    </table>
                                                </div><!-- //list-fix-wrap -->
                                                <div class="list-scroll-wrap scrollBodyY" style="max-height: 330px;">
                                                    <!-- 0. 조회 내역이 없을때 - 시작 -->
                                                    <div class="nodata-wrap" v-if="lunVos.length == 0">
                                                        <p class="nodata">조회된 내용이 없습니다.</p>
                                                    </div>
                                                    <!-- //0. 조회 내역이 없을때 - 끝 -->

                                                    <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                    <div class="list-scroll-cont" v-else>
                                                        <table class="tbl-long tbl-radio">
                                                            <caption></caption>
                                                            <colgroup>
                                                                <col style="width: 30%">
                                                                <col style="width: 10%">
                                                                <col style="width: 10%">
                                                                <col style="width: 20%">
                                                                <col style="width: 20%">
                                                                <col style="width: 20%">
                                                            </colgroup>
                                                            <tbody>
                                                            <!-- 한줄반복 시작 -->
                                                            <tr v-for="lun in lunVos">
                                                                <td>{{lun.lunId}}</td>
                                                                <td>{{ (lun.lunSize / Math.pow(1024, 3)).toFixed(0) }}GB</td>
                                                                <td>{{lun.lunPath}}</td>
                                                                <td>{{lun.lunProductId}}</td>
                                                                <td>{{lun.lunSerial}}</td>
                                                                <td><input type="checkbox" :value="lun" name="lunChkbox" @click="setLunId(lun)"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <!-- //1. 조회 내역이 있을때 - 끝 -->

                                                </div><!-- //list-scroll-wrap -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <%--/// FCP only --%>
                    </div>
                </div> <!-- //c-modal-body -->
                <div class="c-modal-footer">
                    <div class="buttonSet">
                        <button class="btn-c-modal btn-cancel" @click="closePop('createDomainVue')">취소</button>
                        <button class="btn-c-modal" v-show="!isUpdate" @click="createDomain()">생성</button>
                        <button class="btn-c-modal" v-show="isUpdate" @click="updateDomain()">편집</button>
                    </div>
                </div> <!-- //c-modal-footer -->
            </div>
        </section>
    </div>
</div>
<%--/// create/update modal --%>
<script src="/js/castanets/storage/domains.js" type="text/javascript"></script>
<script src="/js/castanets/storage/createDomain.js" type="text/javascript"></script>