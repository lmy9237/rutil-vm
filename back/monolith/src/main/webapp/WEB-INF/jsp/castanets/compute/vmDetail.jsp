<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<div class="cont-wrap" role="main" id="vmDetail">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner long" v-show="!spinnerOn">
        <div class="doc-list-wrap" v-show="lastUpdated != ''">
            <div class="doc-tit">
                <h2 class="tit"><a href="/compute/vms">가상머신</a></h2>
                <p class="location">컴퓨팅 &gt; <a href="/compute/vms">가상머신</a></p>

                    <!-- 아이콘 정리 -->
                    <div class="icoStat-box" v-if="vm.status === 'up'">
                        <span class="icoStat ico-up btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">완료</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'image_locked'">
                        <span class="icoStat ico-locked btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">잠금</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'powering_up'">
                        <span class="icoStat ico-waiting btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">작업 중</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'powering_down'">
                        <span class="icoStat ico-ingdown btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">내려가는 중</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'not_responding'">
                        <span class="icoStat ico-unknown btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">응답 없음</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'unknown'">
                        <span class="icoStat ico-help btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">알수 없음</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'suspended'">
                        <span class="icoStat ico-suspended btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">일시정지</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'down'">
                        <span class="icoStat ico-down btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">내려감</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'reboot_in_progress'">
                        <span class="icoStat ico-reboot btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">재부팅 중</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'wait_for_launch'">
                        <span class="icoStat ico-refresh btn-tooltip"></span>
                        <div class="c-tooltip j-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">기동준비</span>
                        </div>
                    </div>
                    <div class="icoStat-box" v-else-if="vm.status === 'saving_state'">
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



                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-copy btn-tooltip"
                                @click="openModal('updateVm')">편집
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">편집</span>
                        </div>
                    </div>
                </div>
                <div class="changeStatBox">
                    <button class="btn-stat-chg">상태값 변경</button>
                    <div class="target-stat-chg">
                        <button class="btn-chg-stat play" @click="startVm()"
                                :disabled="!(vm.status == 'down' || vm.status == 'paused' || vm.status == 'suspended')">실행
                        </button>
                        <button class="btn-chg-stat pause" @click="suspendVm()"
                                :disabled="!(vm.status == 'up' || vm.status == 'powering_up' || vm.status == 'wait_for_launch' || vm.status == 'not_responding')">일시정지
                        </button>
                        <button class="btn-chg-stat stop" @click="stopVm()"
                                :disabled="!(vm.status == 'up' || vm.status == 'powering_up' || vm.status == 'wait_for_launch' || vm.status == 'not_responding' || vm.status == 'paused' || vm.status == 'suspended')">종료
                        </button>
                        <button @click="rebootVm()"
                                :disabled="!(vm.status == 'up' || vm.status == 'powering_up' || vm.status == 'wait_for_launch' || vm.status == 'not_responding')" class="btn-chg-stat reboot">재부팅
                        </button>
                    </div>
                </div>
                <%--						<button class="btn btn-primary btn-topR"><img src="../../../../images/btn-list.png" alt="" class="icoImg"> 목록</button>--%>
            </div>

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>{{vm.name}}</h3>
                    <p class="detail-updateInfo">{{lastUpdated}}<span class="name">{{vm.name}}</span></p>
                </div>
                <div class="detail-body">
                    <div class="rw-list3-wrap">
                        <ul class="rw-list3">
                            <li>
                                <div class="rdBox">
                                    <div class="blue-ico exp"></div>
                                    <div class="txtBox">
                                        <p class="tit">설명</p>
                                        <p>{{(vm.comment == null || vm.comment == '') ? '-' : vm.comment}}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="rdBox">
                                    <div class="blue-ico time"></div>
                                    <div class="txtBox">
                                        <p class="tit">부팅시간(업타임)</p>
                                        <p>{{changeUptime(vm.startTime)}}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="rdBox">
                                    <div class="blue-ico etime"></div>
                                    <div class="txtBox">
                                        <p class="tit">실행 호스트</p>
                                        <p>{{vm.runHost == null ? '클러스터 내의 호스트' : vm.runHost}}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="rw-chart-wrap">
                        <div class="rdBox donut-rdBox">
                            <div class="donut-tbl" v-show="isHistory" v-if="vm.usageVos !=  null">
                                <div class="donut-tbc">
                                    <p class="donut-tit">CPU</p>
                                    <div class="donut-wrap" id="donut-chart1">
                                        <svg width="124" height="124">
                                            <circle r="31" cx="62" cy="62"/>
                                        </svg>
                                        <div class="donut-inner" v-if="isHistory"><span
                                                class="num">{{vm.usageVos[0].cpuUsages}}</span><span
                                                class="unit">%</span></div>
                                    </div>
                                    <p class="donut-txt" v-if="isHistory">
                                        <span>{{100 - vm.usageVos[0].cpuUsages}}%</span>사용가능</p>
                                </div>
                                <div class="donut-tbc" id="donut-chart2">
                                    <p class="donut-tit">메모리</p>
                                    <div class="donut-wrap">
                                        <svg width="124" height="124">
                                            <circle r="31" cx="62" cy="62"/>
                                        </svg>
                                        <div class="donut-inner" v-if="isHistory"><span class="num">{{vm.usageVos[0].memoryUsages}}</span><span
                                                class="unit">%</span></div>
                                    </div>
                                    <p class="donut-txt" v-if="isHistory">
                                        <span>{{100 - vm.usageVos[0].memoryUsages}}%</span>사용가능</p>
                                </div>
                            </div>
                            <div v-if="!isHistory">
                                <div class="card-wrap">
                                    <div class="card-body">
                                        <div class="card-ing">
                                            <div class="donut-wrap ing">
                                                <svg width="92" height="92">
                                                    <circle r="23" cx="46" cy="46"
                                                            style="stroke-dashoffset: -59; stroke-dasharray: 144;"/>
                                                </svg>
                                                <div class="donut-inner"></div>
                                            </div>
                                            <div class="num">0%</div>
                                            <div class="loader">
                                                <div class="loader_bg">
                                                    <div class="loader_bx">
                                                        <i class="loader_circle"></i>
                                                        <span>조회중...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rdBox">
                            <div class="chartBox" v-show="isHistory" v-if="vm.usageVos.length !== 0">
                                <div class="chart-header">
                                    <p class="tit">CPU, 메모리, 네트워크 이용률</p>
                                    <ul class="chart-labelBox">
                                        <li><span style="background-color: #025cfc;"></span>CPU</li>
                                        <li><span style="background-color: #b620e0;"></span>메모리</li>
                                        <li><span style="background-color: #2231a9;"></span>네트워크</li>
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
                            <div v-if="!isHistory">
                                <div class="card-wrap" style="width: 100%;">
                                    <div class="card-body">
                                        <div class="card-ing">
                                            <div class="donut-wrap ing">
                                                <svg width="92" height="92">
                                                    <circle r="23" cx="46" cy="46"
                                                            style="stroke-dashoffset: -59; stroke-dasharray: 144;"/>
                                                    <!--
                                                        /* 2π × r = 2π × 23 ≈ 144 */
                                                        stroke-dashoffset 의 숫자 : 0일때 -144, 100%일때 0으로 계속 변경해서 들어가야함

                                                        예시]
                                                        10% 일때 : (144 * (100 - 10)) / 100 * -1  ≈  -129
                                                        59% 일때 : (144 * (100 - 59)) / 100 * -1  ≈  -59
                                                     -->
                                                </svg>
                                                <div class="donut-inner"></div>
                                            </div>
                                            <div class="num">0%</div>
                                            <div class="loader">
                                                <div class="loader_bg">
                                                    <div class="loader_bx">
                                                        <i class="loader_circle"></i>
                                                        <span>조회중...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- //detail-unitBox -->

        <div class="detail-unitBox">
            <div class="detail-header">
                <h3>시스템 정보</h3>
            </div>
            <div class="detail-body scrollBodyX">
                <div class="tbl-list-wrap" style="min-width: 1000px;">
                    <table class="tbl-list">
                        <caption></caption>
                        <colgroup>
                            <col style="width: 15.5%; max-width: 155px;">
                            <col style="width: 27.5%; max-width: 275px;">
                            <col style="width: 16%; max-width: 160px;">
                            <col style="width: 23%; max-width: 230px;">
                            <col style="width: auto; max-width: 155px;">
                        </colgroup>
                        <thead>
                        <tr>
                            <th>CPU 코어 수</th>
                            <th>설정된 메모리</th>
                            <th>할당할 실제 메모리</th>
                            <th>OS 정보</th>
                            <th>에이전트 정보</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{vm.vmSystem.totalVirtualCpus}}(
                                {{vm.vmSystem.virtualSockets}}:
                                {{vm.vmSystem.coresPerVirtualSocket}}:
                                {{vm.vmSystem.threadsPerCore}})
                            </td>
                            <td>{{vm.vmSystem.definedMemory}}</td>
                            <td>{{vm.vmSystem.guaranteedMemory}}</td>
                            <td>{{vm.os}}</td>
                            <td>-</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- //detail-unitBox -->

        <div class="detail-unitBox">
            <div class="detail-header">
                <h3>네트워크 인터페이스</h3>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-new btn-tooltip" @click="openModal('createNic')">
                            등록
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">등록</span>
                        </div>
                    </div>
                    <%--                        <div class="btn-box">--%>
                    <%--                            <button type="button" class="btn-icon btn-icon-edit btn-tooltip"--%>
                    <%--                                    @click="openModal('updateNic')">편집--%>
                    <%--                            </button>--%>
                    <%--                            <div class="c-tooltip top-right">--%>
                    <%--                                <span class="c-tooltip-arrow"></span>--%>
                    <%--                                <span class="txt">편집</span>--%>
                    <%--                            </div>--%>
                    <%--                        </div>--%>
                </div>
            </div>
            <div class="detail-body scrollBodyX">
                <div class="tbl-list-wrap" style="min-width: 1000px;">
                    <table class="tbl-list">
                        <caption></caption>
                        <colgroup>
                            <col style="width: 9%; max-width: 90px;">
                            <col style="width: 18%; max-width: 180px;">
                            <col style="width: 17%; max-width: 170px;">
                            <col style="width: 17%; max-width: 170px;">
                            <col style="width: 17%; max-width: 170px;">
                            <col style="width: auto; max-width: 220px;">
                            <col style="width: 6%; min-width: 80px;">
                        </colgroup>
                        <thead>
                        <tr>
                            <th>상태</th>
                            <th>NIC</th>
                            <th>이름</th>
                            <th>IPv4</th>
                            <th>IPv6</th>
                            <th>맥어드레스</th>
                            <th>작업</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="vm.vmNics != null && vm.vmNics.length > 0" v-for="(nic, idx) in vm.vmNics">
                            <td v-if="nic.status === true">
                                <div class="icoStat-box">
                                    <span class="icoStat ico-up btn-tooltip"></span>
                                    <div class="c-tooltip j-right">
                                        <span class="c-tooltip-arrow"></span>
                                        <span class="txt">완료</span>
                                    </div>
                                </div>
                            </td>
                            <td v-else>
                                <div class="icoStat-box">
                                    <span class="icoStat ico-down btn-tooltip"></span>
                                    <div class="c-tooltip j-right">
                                        <span class="c-tooltip-arrow"></span>
                                        <span class="txt">내려감</span>
                                    </div>
                                </div>
                            </td>
                            <td>{{nic.nicName == null ? '-' : nic.nicName}}</td>
                            <td>{{nic.networkName == null ? '-' : nic.networkName}}</td>
                            <td>{{nic.ipv4 == null ? '-' : nic.ipv4}}</td>
                            <td>{{nic.ipv6 == null ? '-' : nic.ipv6}}</td>
                            <td>{{nic.macAddress == null ? '-' : nic.macAddress}}</td>
                            <td>
                                <div class="list-popbtn-wrap">
                                    <button type="button" class="btn-openPop" @click="selectNic(nic, idx)"
                                            id="btnId"></button>
                                    <div class="openPop-target scrollBodyY" id="btnTargetId">
                                        <!-- 아래서부터 3줄만 클래스 last-posBtm 추가 -->
                                        <div class="openPop-target_inner">
                                            <ul>
                                                <li>
                                                    <button @click="openModal('updateNic', nic)">
                                                        <span class="ico ico-edit"></span>편집
                                                    </button>

                                                </li>
                                                <li>
                                                    <button @click="openModal('deleteNic')">
                                                        <span class="ico ico-del"></span>삭제
                                                    </button>
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
            </div>
        </div>
        <!-- //detail-unitBox -->

        <!-- by gtpark VmNic -->
        <div class="modalBox" id="vmNicModel">
            <div class="modalBox-inner">
                <section class="c-modal-wrap c-modal-small" style="!important; height: 620px">
                    <div class="c-modal-inner">
                        <div class="c-modal-header">
                            <h1 v-if="!isUpdate">네트워크 인터페이스 생성</h1>
                            <h1 v-if="isUpdate">네트워크 인터페이스 편집</h1>
                        </div>
                        <div class="c-modal-body scroll-css">
                            <div class="steps-cont-wrap">
                                <div class="c-modal-body_inner pt-30">
                                    <div class="frmSet">
                                        <div class="frm-unit">
                                            <p class="tit">이름</p>
                                            <div class="inputBox">
                                                <input type="text" class="input-custom" v-model="vmNic.nicName">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="frmSet">
                                        <div class="frm-unit">
                                            <p class="tit">프로파일</p>
                                            <selectbox-component :title="'profile'" :selectvo="selectVo.selProfileVo"
                                                                 :index="10000" v-on:setselected="setSelected">
                                            </selectbox-component>
                                        </div>
                                    </div>
                                    <div class="frmSet">
                                        <div class="frm-unit">
                                            <p class="tit" style="margin-bottom: 0px;">
                                                <label class="ui-check">
                                                    <input type="checkbox"
                                                           :disabled="vm.status === 'up' && cardState === 'true'  "
                                                           v-model="checkMac"> 사용자 지정 MAC 주소
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                            <div class="inputBox">
                                                <input type="text" class="input-custom"
                                                       :disabled="!checkMac || (vm.status === 'up' && cardState === 'true') "
                                                       placeholder="" v-model="vmNic.macAddress ">
                                                <!-- 활성화/비활성화 : disabled 추가/삭제 -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="frmSet">
                                        <div class="frm-unit">
                                            <p class="tit">링크 상태</p>
                                            <div class="radio-wrap">
                                                <label class="ui-check">
                                                    <input type="radio" name="radio-linkstat" v-model="linkState"
                                                           value="true">
                                                    <span class="chk-ico"></span>
                                                    <span class="txt">UP</span>
                                                </label>
                                                <label class="ui-check">
                                                    <input type="radio" name="radio-linkstat" v-model="linkState"
                                                           value="false">
                                                    <span class="chk-ico"></span>
                                                    <span class="txt">Down</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="frmSet">
                                        <div class="frm-unit">
                                            <p class="tit">카드 상태</p>
                                            <div class="radio-wrap">
                                                <label class="ui-check">
                                                    <input type="radio" name="radio-cadstat" v-model="cardState"
                                                           value="true">
                                                    <span class="chk-ico"></span>
                                                    <span class="txt">연결됨</span>
                                                </label>
                                                <label class="ui-check">
                                                    <input type="radio" name="radio-cadstat" v-model="cardState"
                                                           value="false">
                                                    <span class="chk-ico"></span>
                                                    <span class="txt">분리</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="c-modal-footer">
                            <div class="buttonSet">
                                <button class="btn-c-modal btn-cancel" @click="closeModal('vmNic')">취소</button>
                                <button class="btn-c-modal" @click="updateNic()">확인</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <!--/ by gtpark update VmNic -->

        <!-- deleteVmNicModal -->
        <div class="alert-dim" id="deleteVmNicModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
            <div class="alertBox">
                <div class="alert-wrap">
                    <div class="alert-body">
                        <p>인터페이스 {{vmNic.nicName}} 를 삭제하시겠습니까?</p>
                    </div>
                    <div class="alert-footer">
                        <div class="alert-btnBox">
                            <button class="btn-alert-foot" @click="closeModal('deleteNic')">취소</button>
                            <button class="btn-alert-foot btn-alert-primary" @click="removeNic()">확인</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- //deleteVmNicModal -->

        <div class="detail-unitBox">
            <div class="detail-header">
                <h3>디스크</h3>
            </div>
            <div class="detail-body scrollBodyX">
                <div class="tbl-list-wrap" style="min-width: 1000px;">
                    <table class="tbl-list">
                        <caption></caption>
                        <colgroup>
                            <col style="width: 9%; max-width: 90px;">
                            <col style="width: 10%; max-width: 100px;">
                            <col style="width: 12%; max-width: 120px;">
                            <col style="width: 16%; max-width: 160px;">
                            <col style="width: 10.5%; max-width: 105px;">
                            <col style="width: 11%; max-width: 110px;">
                            <col style="width: 10.5%; max-width: 105px;">
                            <col style="width: auto; max-width: 200px;">
                        </colgroup>
                        <thead>
                        <tr>
                            <th>상태</th>
                            <th>별칭</th>
                            <th>가상크기</th>
                            <th>연결대상</th>
                            <th>인터페이스</th>
                            <th>정렬</th>
                            <th>유형</th>
                            <th>설명</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="vm.disks.length != 0" v-for="disk in vm.disks">
                            <td v-if="disk.status === 'ok'">
                                <div class="icoStat-box">
                                    <span class="icoStat ico-up btn-tooltip"></span>
                                    <div class="c-tooltip j-right">
                                        <span class="c-tooltip-arrow"></span>
                                        <span class="txt">완료</span>
                                    </div>
                                </div>
                            </td>
                            <td v-else>
                                <div class="icoStat-box">
                                    <span class="icoStat ico-down btn-tooltip"></span>
                                    <div class="c-tooltip j-right">
                                        <span class="c-tooltip-arrow"></span>
                                        <span class="txt">내려감</span>
                                    </div>
                                </div>
                            </td>
                            <td>{{disk.name}}</td>
                            <td>{{disk.virtualSize}}</td>
                            <td>{{disk.attachedTo}}</td>
                            <td>{{disk.diskInterface}}</td>
                            <td>{{disk.alignment}}</td>
                            <td>{{disk.type}}</td>
                            <td>{{disk.description == null ? '-' : disk.description}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- //detail-unitBox -->

        <div class="detail-unitBox">
            <div class="detail-header">
                <h3>스냅샷</h3>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-del btn-tooltip"
                                :disabled="selectedSnapshot.description == 'Active VM' || selectedSnapshot.id == '' || inPreview || !isSnapshot"
                                @click="openModal('deleteSnapshot')">삭제
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">삭제</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-copy btn-tooltip"
                                :disabled="selectedSnapshot.description == 'Active VM' || selectedSnapshot.description == null || selectedSnapshot.description == 'Active VM' || inPreview || locked || !isSnapshot"
                                @click="cloneVm()">복제
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">복제</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-z btn-tooltip"
                                :disabled="selectedSnapshot.description == 'Active VM' || !inPreview || locked || !isSnapshot"
                                @click="undoSnapshot()">되돌리기
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">되돌리기</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-preview btn-tooltip"
                                :disabled="selectedSnapshot.description == 'Active VM' || selectedSnapshot.description == null || inPreview || locked || vm.status != 'down' || !isSnapshot"
                                @click="openModal('preview')">미리보기
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">미리보기</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-commit btn-tooltip"
                                :disabled="selectedSnapshot.description == 'Active VM' || !inPreview || locked || !isSnapshot"
                                @click="commitSnapshot()">커밋
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">커밋</span>
                        </div>
                    </div>
                </div>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-refresh btn-tooltip"
                                @click="retrieveVmSnapshots()">
                            새로고침
                        </button>
                        <div class="c-tooltip top-right">
                            <div class="c-tooltip-inner"></div>
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">새로고침</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-vmmake btn-tooltip"
                                :disabled="inPreview || locked"
                                @click="openModal('snapshotCreate')">생성
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">생성</span>
                        </div>
                    </div>

                </div>
            </div>
            <div class="detail-body">
                <div class="folding-Box">
                    <div class="folding-wrap" v-for="(snapshot, index) in snapshots">
                        <div class="folding-header">
                            <%--                                <p class="tit"><span class="ico-camera"></span> Active VM</p>--%>
                            <p class="tit" v-if="snapshot.status == 'ok'"><span class="ico-camera"></span>
                                {{snapshot.description}}
                            </p>
                            <p class="tit" v-if="snapshot.status == 'in_preview'"><span
                                    class="ico-camera ico-camera-active"></span>
                                {{snapshot.description}}</p>
                            <p class="tit" v-if="snapshot.status == 'locked'"><span
                                    class="ico-camera ico-camera-locked"></span>
                                {{snapshot.description}}</p>
                            <button class="btn-folding" @click="selectSnapshot(snapshot)">펼치기/닫기</button>
                        </div>
                        <div class="folding-body">
                            <div class="tabs">
                                <ul>
                                    <li><a :href="'#tabs-1'+index">일반</a></li>
                                    <li><a :href="'#tabs-2'+index">디스크</a></li>
                                    <li><a :href="'#tabs-3'+index">네트워크 인터페이스</a></li>
                                    <li><a :href="'#tabs-4'+index">설치된 애플리케이션</a></li>
                                </ul>
                                <div :id="'tabs-1'+index">
                                    <%--                                    <div id="tabs-1">--%>
                                    <div class="scrollBodyX">
                                        <div class="tbl-list-wrap" style="min-width: 1000px;">
                                            <table class="tbl-list">
                                                <caption></caption>
                                                <colgroup>
                                                    <col style="width: 9%; max-width: 90px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 19%; max-width: 190px;">
                                                    <col style="width: 15%; max-width: 150px;">
                                                    <col style="width: 17%; max-width: 170px;">
                                                    <col style="width: auto; max-width: 60px;">
                                                </colgroup>
                                                <thead>
                                                <tr>
                                                    <th>생성날짜</th>
                                                    <th>상태</th>
                                                    <th>메모리</th>
                                                    <th class="txt-left">설명</th>
                                                    <th>설정된 메모리</th>
                                                    <th>할당할 실제 메모리</th>
                                                    <th>CPU</th>
                                                </tr>
                                                </thead>
                                                <%--                                                        <tbody v-for="(snapshot, index) in snapshots">--%>
                                                <tbody>
                                                <tr v-if="snapshot != null && snapshot.length != 0">
                                                    <td>{{snapshot.date | date}}</td>
                                                    <td>{{snapshot.status}}</td>
                                                    <td>{{snapshot.memory}}</td>
                                                    <td class="txt-left">{{snapshot.description}}</td>
                                                    <td>{{vm.vmSystem.definedMemory}}</td>
                                                    <td>{{vm.vmSystem.guaranteedMemory}}</td>
                                                    <td> {{vm.vmSystem.totalVirtualCpus}}(
                                                        {{vm.vmSystem.virtualSockets}}:
                                                        {{vm.vmSystem.coresPerVirtualSocket}}:
                                                        {{vm.vmSystem.threadsPerCore}})
                                                    </td>
                                                </tr>
                                                <tr v-else-if="snapshot == null ||  snapshot.length == 0">
                                                    <td colspan="12">스냅샷이 없습니다.</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div :id="'tabs-2'+index">
                                    <%--                                    <div id="tabs-2">--%>
                                    <div class="scrollBodyX">
                                        <div class="tbl-list-wrap" style="min-width: 1000px;">
                                            <table class="tbl-list">
                                                <caption></caption>
                                                <colgroup>
                                                    <col style="width: 9%; max-width: 90px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 19%; max-width: 190px;">
                                                    <col style="width: 15%; max-width: 150px;">
                                                    <col style="width: 17%; max-width: 170px;">
                                                </colgroup>
                                                <thead>
                                                <tr v-if="snapshot.disks.length == 0">
                                                    <th>상태</th>
                                                    <th>별칭</th>
                                                    <th>가상 크기</th>
                                                    <th>실제 크기</th>
                                                    <th>유형</th>
                                                    <th class="txt-left">설명</th>
                                                </tr>
                                                <tr v-if="snapshot.disks.length > 0">
                                                    <th>상태</th>
                                                    <th>별칭</th>
                                                    <th>가상 크기</th>
                                                    <th>실제 크기</th>
                                                    <th>디스크 스냅샷 ID</th>
                                                    <th>유형</th>
                                                    <th class="txt-left">설명</th>
                                                </tr>
                                                </thead>
                                                <%--                                                        <tbody v-for="(snapshot, index) in snapshots">--%>
                                                <tbody>
                                                <tr v-if="snapshot.disks.length == 0"
                                                    v-for="disk in vm.disks">
                                                    <td>{{disk.status}}</td>
                                                    <td>{{disk.name}}</td>
                                                    <td>{{disk.virtualSize}}</td>
                                                    <td>{{disk.actualSize}}</td>
                                                    <td>{{disk.type}}</td>
                                                    <td class="txt-left">{{disk.description}}</td>
                                                </tr>
                                                <tr v-if="snapshot.disks.length > 0"
                                                    v-for="disk in snapshot.disks">
                                                    <td>{{disk.status}}</td>
                                                    <td>{{disk.name}}</td>
                                                    <td>{{disk.virtualSize}}</td>
                                                    <td>{{disk.actualSize}}</td>
                                                    <td>{{disk.snapshotId}}</td>
                                                    <td>{{disk.type}}</td>
                                                    <td class="txt-left">{{disk.description}}</td>
                                                </tr>
                                                <tr v-else>
                                                    <td colspan="12">조회된 디스크가 없습니다.</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div :id="'tabs-3'+index">
                                    <%--                                    <div id="tabs-3">--%>
                                    <div class="scrollBodyX">
                                        <div class="tbl-list-wrap" style="min-width: 1000px;">
                                            <table class="tbl-list">
                                                <caption></caption>
                                                <colgroup>
                                                    <col style="width: 9%; max-width: 90px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 19%; max-width: 190px;">
                                                    <col style="width: 15%; max-width: 150px;">
                                                    <col style="width: 17%; max-width: 170px;">
                                                    <col style="width: auto; max-width: 130px;">
                                                </colgroup>
                                                <thead>
                                                <tr v-if="snapshot.nics.length == 0">
                                                    <th>이름</th>
                                                    <th>네트워크 이름</th>
                                                    <th>프로파일 이름</th>
                                                    <th>유형</th>
                                                    <th>MAC</th>
                                                </tr>
                                                <tr v-if="snapshot.nics.length > 0">
                                                    <th>이름</th>
                                                    <th>유형</th>
                                                    <th>MAC</th>
                                                </tr>
                                                </thead>
                                                <%--                                                        <tbody v-for="(snapshot, index) in snapshots">--%>
                                                <tbody>
                                                <tr v-if="snapshot.nics.length == 0"
                                                    v-for="nic in vm.vmNics">
                                                    <td>{{nic.nicName}}</td>
                                                    <td>{{nic.networkName}}</td>
                                                    <td>{{nic.profileName}}</td>
                                                    <td>{{nic.interfaceType}}</td>
                                                    <td>{{nic.macAddress}}</td>
                                                </tr>
                                                <tr v-if="snapshot.nics.length > 0"
                                                    v-for="nic in snapshot.nics">
                                                    <td>{{nic.nicName}}</td>
                                                    <td>{{nic.interfaceType}}</td>
                                                    <td>{{nic.macAddress}}</td>
                                                </tr>
                                                <tr v-else>
                                                    <td colspan="12">조회된 네트워크 인터페이스가 없습니다.</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div :id="'tabs-4'+index">
                                    <%--                                    <div id="tabs-4">--%>
                                    <div class="scrollBodyX">
                                        <div class="tbl-list-wrap" style="min-width: 1000px;">
                                            <table class="tbl-list">
                                                <caption></caption>
                                                <colgroup>
                                                    <col style="width: 9%; max-width: 90px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 13%; max-width: 130px;">
                                                    <col style="width: 19%; max-width: 190px;">
                                                    <col style="width: 15%; max-width: 150px;">
                                                    <col style="width: 17%; max-width: 170px;">
                                                    <col style="width: auto; max-width: 130px;">
                                                </colgroup>
                                                <thead>
                                                <tr>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td colspan="12">표시할 항목이 없습니다.</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <%--                                </div>--%>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- //detail-unitBox -->

        <div class="detail-unitBox">
            <div class="detail-header">
                <h3>이벤트</h3>
            </div>
            <div class="detail-body">
                <div class="scrollBodyX">
                    <div class="list-tot" style="width: 110%; min-width: 1000px;">
                        <div class="list-fix-wrap">
                            <table class="tbl-list">
                                <caption></caption>
                                <colgroup>
                                    <col style="width: 8.5%; min-width: 120px;">
                                    <!-- 상태아이콘에 해당되는 곳은 min-width: 120px 필수 조정 -->
                                    <col style="width: 25%; min-width: 255px;">
                                    <col style="width: auto;">
                                    <col style="width: 20%; min-width: 100px;">
                                </colgroup>
                                <tbody>
                                <th>타입</th>
                                <th>시간</th>
                                <th class="txt-left">메시지</th>
                                <th></th>
                                </tbody>
                            </table>
                        </div><!-- //list-fix-wrap -->
                        <div class="list-scroll-wrap detail-ms-wrap scrollBodyY">
                            <div class="list-scroll-cont">
                                <table class="tbl-list">
                                    <caption></caption>
                                    <colgroup>
                                        <col style="width: 8.5%; min-width: 120px;">
                                        <col style="width: 25%; min-width: 255px;">
                                        <col style="width: auto;">
                                        <col style="width: 20%; min-width: 100px;">
                                    </colgroup>
                                    <tbody>
                                    <%--                                        <tr v-for="p in paginatedData" v-if="paginatedData.length > 0">--%>
                                    <tr v-for="p in pagingVo.viewList" v-if="paginatedData.length > 0">
                                        <td><i :class="[eventType(p.severity)]"
                                               :title="getEventStatusToKor(p.severity)"></i></td>
                                        <td>{{p.time | date}}</td>
                                        <td class="txt-left">{{p.description}}</td>
                                        <td></td>
                                    </tr>
                                    <tr v-if="paginatedData.length === 0">
                                        <td colspan="12">이벤트가 없습니다.</td>
                                    </tr>
                                     </tbody>
                                </table>
                            </div>
                        </div><!-- //list-scroll-wrap -->
                    </div>
                </div>
            </div>
        </div>
        <!-- //detail-unitBox -->
        <pagination-component :dataList="paginatedData" :size="10"
                              v-on:setViewList="setViewList"></pagination-component>

        <!-- //doc-list-wrap -->


        <!-- create snapshotModal -->
        <div class="modalBox" id="snapshotCreateModal">
            <div class="modalBox-inner">
                <section class="c-modal-wrap c-modal-auto">
                    <div class="c-modal-inner">
                        <div class="c-modal-header">
                            <h1>스냅샷 생성</h1>
                        </div>
                        <div class="c-modal-body">
                            <div class="c-modal-body_inner pt-40">
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">설명</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" placeholder="설명입력"
                                                   v-model="newSnapshot.description">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">포괄할 디스크</p>
                                        <div class="doc-list-wrap">
                                            <div class="doc-list-body">
                                                <div class="doc-list-inner">
                                                    <div class="list-tot">
                                                        <div class="list-fix-wrap">
                                                            <table>
                                                                <caption></caption>
                                                                <colgroup>
                                                                    <col style="width: 50px;">
                                                                    <col style="width: 200px;">
                                                                    <col style="width: auto;">
                                                                </colgroup>
                                                                <tbody>
                                                                <th>
                                                                    <label class="ui-check mr-0">
                                                                        <input type="checkbox" v-model="selectAll">
                                                                        <span class="chk-ico"></span>
                                                                    </label>
                                                                </th>
                                                                <th>별칭</th>
                                                                <th>설명</th>
                                                                </tbody>
                                                            </table>
                                                        </div><!-- //list-fix-wrap -->

                                                        <div class="list-scroll-wrap scrollBodyY">
                                                            <!-- 0. 조회 내역이 없을때 - 시작 -->
                                                            <div class="nodata-wrap"
                                                                 v-if="vm.disks == null || vm.disks.length == 0">
                                                                <p class="nodata">조회된 내용이 없습니다.</p>
                                                            </div>
                                                            <!-- //0. 조회 내역이 없을때 - 끝 -->

                                                            <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                            <div class="list-scroll-cont"
                                                                 v-if="vm.disks != null && vm.disks.length > 0">
                                                                <table>
                                                                    <caption></caption>
                                                                    <colgroup>
                                                                        <col style="width: 50px;">
                                                                        <col style="width: 200px;">
                                                                        <col style="width: auto;">
                                                                    </colgroup>
                                                                    <tbody>
                                                                    <!-- 한줄반복 시작 -->
                                                                    <tr v-for="disk in vm.disks">
                                                                        <td>
                                                                            <label class="ui-check mr-0">
                                                                                <input type="checkbox" :id="disk.name"
                                                                                       :value="disk"
                                                                                       v-model="selectedDisks">
                                                                                <span class="chk-ico"></span>
                                                                            </label>
                                                                        </td>
                                                                        <td class="txt-strong">{{disk.name}}</td>
                                                                        <td> {{disk.description}}</td>
                                                                    </tr>
                                                                    <!-- //한줄반복 끝 -->
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
                            </div>
                        </div> <!-- //c-modal-body -->
                        <div class="c-modal-footer">
                            <div class="buttonSet">
                                <button class="btn-c-modal btn-cancel" @click="closeModal('snapshotCreate')">취소</button>
                                <button class="btn-c-modal" @click="createSnapshot()"
                                        :disabled="selectedDisks.length === 0">확인
                                </button>
                            </div>
                        </div> <!-- //c-modal-footer -->
                    </div>
                </section>
            </div>
        </div>
        <!-- //create snapshotModal -->

        <!-- preview snapshotModal -->
        <div class="modalBox" id="snapshotPreviewModal">
            <div class="modalBox-inner">
                <section class="c-modal-wrap c-modal-auto">
                    <div class="c-modal-inner">
                        <div class="c-modal-header">
                            <h1>스냅샷 미리보기</h1>
                        </div>
                        <div class="c-modal-body">
                            <div class="c-modal-body_inner pt-40">
                                <h2 class="steps-tit steps-tit-m">미리 보기를 위해 선택된 스냅샷에 메모리가 포함되어 있습니다.</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">메모리 복구
                                            <label class="ui-check">
                                                <input type="checkbox" v-model="memoryRestore">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- //c-modal-body -->
                        <div class="c-modal-footer">
                            <div class="buttonSet">
                                <button class="btn-c-modal btn-cancel" @click="closeModal('preview')">취소</button>
                                <button class="btn-c-modal" @click="previewSnapshot()">확인</button>
                            </div>
                        </div> <!-- //c-modal-footer -->
                    </div>
                </section>
            </div>
        </div>
        <!-- //preview snapshotModal -->

        <!-- deleteSnapshotModal -->
        <div class="alert-dim" id="deleteSnapshotModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
            <div class="alertBox">
                <div class="alert-wrap">
                    <div class="alert-body" v-if="selectedSnapshot.id != ''">
                        <p>스냅샷 {{selectedSnapshot.description}} 를 삭제하시겠습니까?</p>
                    </div>
                    <div class="alert-footer">
                        <div class="alert-btnBox">
                            <button class="btn-alert-foot" @click="closeModal('deleteSnapshot')">취소</button>
                            <button class="btn-alert-foot btn-alert-primary" @click="removeSnapshot()">확인</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- //deleteSnapshotModal -->
    </div>

</div>

<!-- cloneVmModal -->
<div class="right_col" role="main" id="vmClone">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox" v-show="!spinnerOn" id="vmCloneModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        <div class="modalBox-inner">
            <section class="c-modal-wrap">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1>스냅샷에서 가상머신 복제</h1>
                        <p class="mustbeTxt">표시 항목( <span class="mustbe"></span> ) 은 필수 입력 항목입니다. </p>
                        <div class="steps-wrap">
                            <ul>
                                <li>
                                    <button type="button" class="btn-step" id="clStep0" @click="clickStep(0)">일반 <span
                                            class="mustbe"></span>
                                    </button>
                                    <!--
                                        * tab 및 단계에 따른 클래스 정리
                                        현재 상태	: button에 클래스 active
                                        작성완료		: button에 클래스 end
                                    -->
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="clStep1" @click="clickStep(1)">부트옵션 <span
                                            class="mustbe"></span></button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="clStep2" @click="clickStep(2)">시스템
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="clStep3" @click="clickStep(3)">호스트
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="clStep4" @click="clickStep(4)">초기실행
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="clStep5" @click="clickStep(5)">리소스 할당
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div><!-- //c-modal-header -->
                    <!-- btn-step 일반 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(0)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">클러스터</p>
                                        <selectbox-component :title="'cluster'" :selectvo="selectVo.selCreClusterVo"
                                                             :index="10001" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">운영시스템</p>
                                        <selectbox-component :title="'os'" :selectvo="selectVo.selCreOsVo"
                                                             :index="10002" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">인스턴스 유형</p>
                                        <selectbox-component :title="'instance'" :selectvo="selectVo.selCreInsVo"
                                                             :index="10003" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">최적화 옵션</p>
                                        <selectbox-component :title="'optimization'" :selectvo="selectVo.selCreOpsVo"
                                                             :index="10004" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">이름 <span class="mustbe"></span></p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmClone.name"
                                                   @input="checkVmName" placeholder="이름" :maxlength="this.$maxName">
                                        </div>
                                        <p class="errTxt" v-if="(vmNameStatus || validVmName)">4~20자 영문, 숫자와
                                            특수기호(_),(-)만 사용 가능합니다.</p>
                                        <!-- 에러없으면 p태그 자체를 삭제 -->
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">템플릿</p>
                                        <selectbox-component :title="'template'" :selectvo="selectVo.selTemplateVo"
                                                             :index="10026" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">설명</p>
                                        <input type="text" class="input-custom" v-model="vmClone.description"
                                               placeholder="설명입력" :maxlength="this.$maxDescription">
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">용도</p>
                                        <selectbox-component :title="'usage'" :selectvo="selectVo.selCreUsageVo"
                                                             :index="10005" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 일반 -->

                    <!--  btn-step 부트옵션 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(1)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit">부트순서</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">첫 번째 장치</p>
                                        <selectbox-component :title="'firstDevice'" :selectvo="selectVo.selFirDevVo"
                                                             :index="10006" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">두 번째 장치</p>
                                        <selectbox-component :title="'secondDevice'" :selectvo="selectVo.selSecDevVo"
                                                             :index="10007" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">CD/DVD 연결
                                            <label class="ui-check">
                                                <input type="checkbox" v-model="bootImageUse">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                        <selectbox-component
                                                :disabled="!vmClone.bootImageUse || selectVo.selBootImgVo.selected.id == 'none'"
                                                :title="'bootImage'"
                                                :selectvo="selectVo.selBootImgVo" :index="10008"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 부트옵션 -->

                    <!--  btn-step 시스템 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(2)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit steps-tit-m">시스템</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">메모리 크기</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" id="memory" v-model="memory"
                                                   @change="memoryChange()">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">최대 메모리</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip bottom-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">메모리 핫 플러그를 실행할 수 있는<br>가상머신 메모리 상환</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="maximumMemory"
                                                   @change="maximumMemoryChange()">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">총 가상 CPU</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">소켓 수를 변경하여 CPU를 핫애드합니다.<br>CPU 핫애드가 올바르게 지원되는지 확인<br>하려면 게스트 운영 체제 관련 문서를 참조<br>하십시오.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="totalCpu">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">가상 소캣</p>
                                        <selectbox-component :title="'virtualSockets'" :selectvo="selectVo.selVirSockVo"
                                                             :index="10009" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet mb-20">
                                    <div class="frm-unit half-left">
                                        <p class="tit">가상 소캣 당 코어</p>
                                        <selectbox-component :title="'coresPerVirtualSocket'"
                                                             :selectvo="selectVo.selPerVirSockVo" :index="10010"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">코어 당 스레드</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">동시 멀티스레딩을 설정합니다. 값을 변경<br>하기 전 호스트 아키텍처를확인합니다. 설<br>정 값이 확실하지 않은 경우 코어당 스레드<br>수를 1로 설정합니다. 다음과 같은 값을 사<br>용할 것을 권장합니다.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <selectbox-component :title="'threadsPerCore'"
                                                             :selectvo="selectVo.selThreadPerCoreVo" :index="10011"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <!-- //시스템 영역 끝 -->

                                <h2 class="steps-tit steps-tit-m">콘솔</h2>
                                <div class="frmSet" style="margin-bottom: 2%;">
                                    <div class="frm-unit half-left">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">헤드리스 모드</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">   가상 머신에서 헤드리스(Headless) 모드를 활성화 <br>   /비활성화합니다. 헤드리스 모드가 설정된 경우 <br>   가상머신이 다음에 시작 시 그래픽 콘솔과 디스플레이 <br>   장치 없이 실행됩니다.</span>
                                                </div>
                                            </div>
                                            <label class="ui-check">
                                                <input type="checkbox" v-model="headlessMode">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="!headlessMode">
                                    <div class="frm-unit half-left">
                                        <p class="tit">그래픽프로토콜</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="VNC" disabled>
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">USB 지원</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="비활성화됨" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="!headlessMode">
                                    <div class="frm-unit half-left">
                                        <p class="tit">콘솔 분리 작업</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="화면 잠금" disabled>
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">모니터</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmClone.monitors"
                                                   disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet mb-20" v-if="!headlessMode">
                                    <div class="frm-unit half-left">
                                        <p class="tit">단일 로그인 방식</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="게스트 에이전트 사용" disabled>
                                        </div>
                                    </div>
                                </div>
                                <!-- //콘솔 영역 끝 -->

                                <h2 class="steps-tit steps-tit-m">고가용성</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">고가용성 사용
                                            <label class="ui-check">
                                                <input type="checkbox" v-model="highAvailability">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">가상머신 임대 대상 스토리지 도메인</p>
                                        <selectbox-component :disabled="!highAvailability" :title="'leaseStorageDomain'"
                                                             :selectvo="selectVo.selLeaseStrgVo" :index="10012"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                        <%--                                        <script>--%>
                                        <%--                                            //select에 disalbed 처리 하고 싶다면?--%>
                                        <%--                                            //$('#testSelect5').find('.custom-select__option--value').attr('disabled', 'disabled');--%>
                                        <%--                                            //select에 disabled를 풀고 싶다면?--%>
                                        <%--                                            //$('#testSelect5').find('.custom-select__option--value').removeAttr('disabled');--%>
                                        <%--                                        </script>--%>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">실행/마이그레이션 큐에서 우선 순위</p>
                                        <selectbox-component :title="'priority'" :selectvo="selectVo.selPriorityVo"
                                                             :index="10013" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">재개 동작</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="KILL" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 시스템 -->

                    <!--  btn-step 호스트 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(3)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit steps-tit-m">실행 호스트</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="radio-wrap">
                                            <label class="ui-check">
                                                <input type="radio" name="radio-eh" v-model="pickHost"
                                                       value="recommendHost">
                                                <span class="chk-ico"></span>
                                                <span class="txt">클러스터 내의 호스트(심포니 추천)</span>
                                            </label>
                                            <label class="ui-check">
                                                <input type="radio" name="radio-eh" v-model="pickHost"
                                                       value="targetHost">
                                                <span class="chk-ico"></span>
                                                <span class="txt">특정 호스트</span>
                                            </label>
                                        </div>
                                        <selectbox-component v-if="pickHost === 'recommendHost'" :title="'recHost'"
                                                             :selectvo="selectVo.selRecHostVo" :index="10014"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                        <selectbox-component v-if="pickHost === 'targetHost'" :title="'tarHost'"
                                                             :selectvo="selectVo.selTarHostVo" :index="10015"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <!-- //실행 호스트 영역 끝 -->
                                <h2 class="steps-tit">마이그레이션 옵션</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">마이그레이션 모드</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">최소 활성화된 하나의 가상 머신 디스크가<br>SCSI 예약을 사용할 경우마이그레이션 옵<br>션이 무시되어 가상 머신을 마이그레이션<br>할 수 없습니다.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <selectbox-component :title="'cusMigration'" :selectvo="selectVo.selMigrationVo"
                                                             :index="10016" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> 사용자 정의 마이그레이션 정책 사용
                                                    <input type="checkbox" v-model="vmClone.customMigrationUsed">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">마이그레이션 수렴을 처리하는 정책을 표<br>시합니다.마이그레이션 정책이 없을 경우<br>하이퍼바이저가 수렴을 처리합니다.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <selectbox-component :disabled="!vmClone.customMigrationUsed"
                                                             :title="'cusMigration'" :selectvo="selectVo.selCustomMigVo"
                                                             :index="10017" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> 사용자 정의 마이그레이션 다운 타임 사용
                                                    <input :disabled="vmClone.customMigration != 'Legacy'"
                                                           type="checkbox"
                                                           v-model="vmClone.customMigrationDowntimeUsed">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center more-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">라이브 마이그레이션 도중 가상 머신이 정<br>지 상태에 있을 수 있는최대 시간을 밀리 초<br>단위로 표시합니다. 값이 0인것은 VDSM<br>기본값이 사용되고 있음을 의미합니다. (현<br>재 engine 전체의 기본값은 0 밀리 초 입니<br>다.)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inputBox">
                                            <input :disabled="!vmClone.customMigrationDowntimeUsed" type="text"
                                                   class="input-custom" v-model="vmClone.customMigrationDowntime">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">마이그레이션 자동 통합 </p>
                                        <selectbox-component
                                                :disabled="!vmClone.customMigrationUsed"
                                                :title="'autoConverge'" :selectvo="selectVo.selAutoConVo" :index="10018"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">마이그레이션 압축 활성화</p>
                                        <selectbox-component
                                                :disabled="!vmClone.customMigrationUsed"
                                                :title="'compressed'" :selectvo="selectVo.selCompVo" :index="10019"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">
                                            <label class="ui-check"> 호스트 CPU 통과
                                                <input type="checkbox" :disabled="vmClone.affinity != 'pinned'">
                                                <!-- 비활성화는 속성 disabled 추가/삭제 -->
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <!-- //마이그레이션 옵션 영역 끝 -->

                                <h2 class="steps-tit">NUMA 설정
                                    <div class="btn-box">
                                        <button class="btn-tooltipm btn-tooltip">i</button>
                                        <div class="c-tooltip top-center">
                                            <div class="c-tooltip-inner"></div>
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">NUMA 설정 마이그레이 모드를 마이그레<br>이션 불가로 활성화하려면 NUMA 토폴로<br>지를 지원하는 호스트에 가상 머신을 고정<br>합니다.</span>
                                        </div>
                                    </div>
                                </h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">NUMA 노드 수</p>
                                        <div class="inputBox">
                                            <input :disabled="!(vmClone.affinity == 'pinned' && pickHost == 'targetHost')"
                                                   type="text" class="input-custom" v-model="node">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">조정 모드</p>
                                        <selectbox-component
                                                :disabled="!(vmClone.affinity == 'pinned' && pickHost == 'targetHost')"
                                                :title="'numa'" :selectvo="selectVo.selNumaVo" :index="10020"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <!-- //NUMA 설정 영역 끝 -->
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 호스트 -->

                    <!--  btn-step 초기실행 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(4)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">
                                            <label class="ui-check"> Cloud-Init/Sysprep 사용
                                                <input type="checkbox" v-model="useCloudInit">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="useCloudInit">
                                    <div class="frm-unit">
                                        <p class="tit">가상머신 호스트 이름</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmClone.hostName">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="useCloudInit">
                                    <div class="frm-unit">
                                        <p class="tit">시간대 설정</p>
                                        <selectbox-component :title="'timezone'" :selectvo="selectVo.selTimezoneVo"
                                                             :index="10021" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="useCloudInit">
                                    <div class="frm-unit">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">사용자 지정 스크립트</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">사용자 지정 스크립트 툴팁내용</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="full-textarea-wrap">
                                            <textarea class="full-textarea scroll-css" v-model="vmClone.customScript"
                                                      placeholder="사용자 지정 스크립트를 입력하세요."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 초기실행 -->

                    <!--  btn-step 리소스할당 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(5)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit">CPU 할당</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">CPU 프로파일</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="cpuProfile" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">CPU 공유</p>
                                        <selectbox-component :title="'cpuShare'" :selectvo="selectVo.selCpuShareVo"
                                                             :index="10022" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">&nbsp;</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmClone.cpuShare"
                                                   disabled>
                                        </div>
                                    </div>
                                </div>
                                <!-- //CPU 할당 영역 끝 -->

                                <h2 class="steps-tit">메모리 할당</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">할당할 실제 메모리</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="physicalMemory"
                                                   @change="physicalMemoryChange()">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">
                                            <label class="ui-check"> 메모리 Balloon 장치 활성화
                                                <input type="checkbox" v-model="vmClone.memoryBalloon">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <!-- //메모리 할당 영역 끝 -->

                                <h2 class="steps-tit">IO 스레드</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">
                                            <label class="ui-check"> IO 스레드 활성화
                                                <input type="checkbox" v-model="ioThreadsEnabled">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <!-- //IO 스레드 영역 끝 -->

                                <h2 class="steps-tit steps-tit-m">스토리지 할당 (템플릿이 선택되었을 경우에만 가능)</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="radio-wrap">
                                            <label class="ui-check">
                                                <input type="radio" name="radio-sh" checked>
                                                <span class="chk-ico"></span>
                                                <span class="txt">씬 프로비저닝</span>
                                            </label>
                                            <label class="ui-check">
                                                <input type="radio" name="radio-sh">
                                                <span class="chk-ico"></span>
                                                <span class="txt">복제</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> VirtlO-SCSI 활성화
                                                    <input type="checkbox" v-model="vmClone.virtioScsiEnabled">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center more-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">메모리 핫 플러그를 실행할 수 있는<br>가상머신 메모리 상환</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 리소스할당 -->

                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('clone')">취소</button>
                            <button class="btn-c-modal" v-show="isUpdateStep(0)" @click="nextStep(1)">다음</button>
                            <button class="btn-c-modal" v-show="!isUpdateStep(0)"
                                    :disabled="(vmNameStatus || validVmName)" @click="cloneVm()"
                                    style="margin-right: 12px;">확인
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
<!-- //cloneVmModal -->

<!-- updateVmModal -->
<div class="right_col" role="main" id="vmUpdateManagement">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox" v-show="!spinnerOn" id="vmUpdateModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        <div class="modalBox-inner">
            <section class="c-modal-wrap">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1>가상머신 편집</h1>
                        <p class="mustbeTxt">표시 항목( <span class="mustbe"></span> ) 은 필수 입력 항목입니다. </p>
                        <div class="steps-wrap">
                            <ul>
                                <li>
                                    <button type="button" class="btn-step" id="upStep0" @click="clickStep(0)">일반 <span
                                            class="mustbe"></span>
                                    </button>
                                    <!--
                                        * tab 및 단계에 따른 클래스 정리
                                        현재 상태	: button에 클래스 active
                                        작성완료		: button에 클래스 end
                                    -->
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="upStep1" @click="clickStep(1)">부트옵션 <span
                                            class="mustbe"></span></button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="upStep2" @click="clickStep(2)">시스템</button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="upStep3" @click="clickStep(3)">호스트</button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="upStep4" @click="clickStep(4)">초기실행
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="upStep5" @click="clickStep(5)">리소스 할당
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div><!-- //c-modal-header -->
                    <!-- btn-step 일반 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(0)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">클러스터</p>
                                        <selectbox-component :title="'cluster'" :selectvo="selectVo.selCreClusterVo"
                                                             :index="10001" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">운영시스템</p>
                                        <selectbox-component :title="'os'" :selectvo="selectVo.selCreOsVo"
                                                             :index="10002" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">인스턴스 유형</p>
                                        <selectbox-component :title="'instance'" :selectvo="selectVo.selCreInsVo"
                                                             :index="10003" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">최적화 옵션</p>
                                        <selectbox-component :title="'optimization'" :selectvo="selectVo.selCreOpsVo"
                                                             :index="10004" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">이름 <span class="mustbe"></span></p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmUpdate.name"
                                                   @input="checkVmName" placeholder="이름" :maxlength="this.$maxName">
                                        </div>
                                        <p class="errTxt" v-if="(vmNameStatus || validVmName)">4~20자 영문, 숫자와
                                            특수기호(_),(-)만 사용 가능합니다.</p>
                                        <!-- 에러없으면 p태그 자체를 삭제 -->
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">설명</p>
                                        <input type="text" class="input-custom" v-model="vmUpdate.description"
                                               placeholder="설명입력" :maxlength="this.$maxDescription">
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">용도</p>
                                        <selectbox-component :title="'usage'" :selectvo="selectVo.selCreUsageVo"
                                                             :index="10005" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="flex-rBtn-wrap">
                                    <p class="tit" style="color: #898f94; margin-bottom: 20px">인스턴스 이미지</p>
                                    <div class="frmSet" v-for="(linkedDisk, index) in linkedDisks">
                                        <div class="flex-leftBox">
                                            <div class="frm-unit">

                                                <input v-if="selectedLun.length == 0" type="text" class="input-custom"
                                                       disabled
                                                       v-model="linkedDisk.linkedDiskName">
                                                <input v-if="selectedLun.length != 0" type="text" class="input-custom"
                                                       disabled
                                                       v-model="linkedDisk.linkedDiskName">

                                            </div>
                                        </div>
                                        <div class="flex-rBtnBox" style="padding-top: 20px;">
                                            <div class="btn-box">
                                                <button v-if="linkedDisk.status == 'linked'"
                                                        class="btn-icon btn-icon-mini btn-icon-editm btn-tooltip" @click="setDiskIndex(index, 'upConnect')">편집
                                                </button>
                                                <div class="c-tooltip top-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">편집</span>
                                                </div>
                                            </div>
                                            <div class="btn-box">
                                                <button v-if="(linkedDisk.status == 'update' || linkedDisk.status == 'create') && linkedDisk.lunId == ''"
                                                        class="btn-icon btn-icon-mini btn-icon-editm btn-tooltip" @click="setDiskIndex(index, 'update')">편집
                                                </button>
                                                <div class="c-tooltip top-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">편집</span>
                                                </div>
                                            </div>
                                            <div class="btn-box">
                                                <button class="btn-square btn-icon-minus btn-tooltip"
                                                        @click="removeDisk(index)">삭제
                                                </button>
                                                <div class="c-tooltip top-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">삭제</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 추가/삭제에 따른 영역 시작 -->
                                    <div class="frmSet">
                                        <div class="flex-leftBox">
                                            <div class="btn-box">
                                                <button
                                                        class="btn-icon btn-icon-mini btn-icon-link btn-tooltip"
                                                        @click="openModal('newConnect')">연결
                                                </button>
                                                <div class="c-tooltip top-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">연결</span>
                                                </div>
                                            </div>
                                            <div class="btn-box">
                                                <button
                                                        class="btn-icon btn-icon-mini btn-icon-maken btn-tooltip"
                                                        @click="openCreateModal()">생성
                                                </button>
                                                <div class="c-tooltip top-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">생성</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- // 추가/삭제에 따른 영역 끝 -->
                                </div><!-- //flex-rBtn-wrap -->

                                <div class="flex-rBtn-wrap">
                                    <p class="tit" style="color: #898f94; margin-bottom: 20px">네트워크</p>
                                    <div class="frmSet" v-for="(nic, index) in tempNics">
                                        <div class="flex-leftBox">
                                            <div class="frm-unit">
                                                <selectbox-component :title="'nic'" :selectvo="nic"
                                                                     :index="10025" v-on:setselected="setSelected">
                                                </selectbox-component>
                                            </div>
                                        </div>
                                        <div class="flex-rBtnBox">
                                            <div class="btn-box">
                                                <button class="btn-square btn-icon-plus btn-tooltip"
                                                        :disabled="tempNics.length != index + 1" @click="addNic(index)">
                                                    추가
                                                </button>
                                                <div class="c-tooltip top-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">추가</span>
                                                </div>
                                            </div>
                                            <div class="btn-box">
                                                <button class="btn-square btn-icon-minus btn-tooltip"
                                                        @click="removeNic(index)">삭제
                                                </button>
                                                <div class="c-tooltip top-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">삭제</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div><!-- //flex-rBtn-wrap -->

                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 일반 -->

                    <!--  btn-step 부트옵션 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(1)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit">부트순서</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">첫 번째 장치</p>
                                        <selectbox-component :title="'firstDevice'" :selectvo="selectVo.selFirDevVo"
                                                             :index="10006" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">두 번째 장치</p>
                                        <selectbox-component :title="'secondDevice'" :selectvo="selectVo.selSecDevVo"
                                                             :index="10007" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">CD/DVD 연결
                                            <label class="ui-check">
                                                <input type="checkbox" v-model="bootImageUse">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                        <selectbox-component :disabled="!vmUpdate.bootImageUse || selectVo.selBootImgVo.selected.id == 'none'" :title="'bootImage'"
                                                             :selectvo="selectVo.selBootImgVo" :index="10008"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 부트옵션 -->

                    <!--  btn-step 시스템 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(2)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit steps-tit-m">시스템</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">메모리 크기</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" id="memory2" v-model="memory"
                                                   @change="memoryChange()">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">최대 메모리</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip bottom-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">메모리 핫 플러그를 실행할 수 있는<br>가상머신 메모리 상환</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="maximumMemory"
                                                   @change="maximumMemoryChange()">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">총 가상 CPU</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">소켓 수를 변경하여 CPU를 핫애드합니다.<br>CPU 핫애드가 올바르게 지원되는지 확인<br>하려면 게스트 운영 체제 관련 문서를 참조<br>하십시오.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="totalCpu">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">가상 소캣</p>
                                        <selectbox-component :title="'virtualSockets'" :selectvo="selectVo.selVirSockVo"
                                                             :index="10009" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet mb-20">
                                    <div class="frm-unit half-left">
                                        <p class="tit">가상 소캣 당 코어</p>
                                        <selectbox-component :title="'coresPerVirtualSocket'"
                                                             :selectvo="selectVo.selPerVirSockVo" :index="10010"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">코어 당 스레드</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">동시 멀티스레딩을 설정합니다. 값을 변경<br>하기 전 호스트 아키텍처를확인합니다. 설<br>정 값이 확실하지 않은 경우 코어당 스레드<br>수를 1로 설정합니다. 다음과 같은 값을 사<br>용할 것을 권장합니다.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <selectbox-component :title="'threadsPerCore'"
                                                             :selectvo="selectVo.selThreadPerCoreVo" :index="10011"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <!-- //시스템 영역 끝 -->

                                <h2 class="steps-tit steps-tit-m">콘솔</h2>
                                <div class="frmSet" style="margin-bottom: 2%;">
                                    <div class="frm-unit half-left">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">헤드리스 모드</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">   가상 머신에서 헤드리스(Headless) 모드를 활성화 <br>   /비활성화합니다. 헤드리스 모드가 설정된 경우 <br>   가상머신이 다음에 시작 시 그래픽 콘솔과 디스플레이 <br>   장치 없이 실행됩니다.</span>
                                                </div>
                                            </div>
                                            <label class="ui-check">
                                                <input type="checkbox" v-model="headlessMode">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="!headlessMode">
                                    <div class="frm-unit half-left">
                                        <p class="tit">그래픽프로토콜</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="VNC" disabled>
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">USB 지원</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="비활성화됨" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="!headlessMode">
                                    <div class="frm-unit half-left">
                                        <p class="tit">콘솔 분리 작업</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="화면 잠금" disabled>
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">모니터</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmUpdate.monitors"
                                                   disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet mb-20" v-if="!headlessMode">
                                    <div class="frm-unit half-left">
                                        <p class="tit">단일 로그인 방식</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="게스트 에이전트 사용" disabled>
                                        </div>
                                    </div>
                                </div>
                                <!-- //콘솔 영역 끝 -->

                                <h2 class="steps-tit steps-tit-m">고가용성</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">고가용성 사용
                                            <label class="ui-check">
                                                <input type="checkbox" v-model="highAvailability">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">가상머신 임대 대상 스토리지 도메인</p>
                                        <selectbox-component :disabled="!highAvailability" :title="'leaseStorageDomain'"
                                                             :selectvo="selectVo.selLeaseStrgVo" :index="10012"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                        <%--                                        <script>--%>
                                        <%--                                            //select에 disalbed 처리 하고 싶다면?--%>
                                        <%--                                            //$('#testSelect5').find('.custom-select__option--value').attr('disabled', 'disabled');--%>
                                        <%--                                            //select에 disabled를 풀고 싶다면?--%>
                                        <%--                                            //$('#testSelect5').find('.custom-select__option--value').removeAttr('disabled');--%>
                                        <%--                                        </script>--%>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">실행/마이그레이션 큐에서 우선 순위</p>
                                        <selectbox-component :title="'priority'" :selectvo="selectVo.selPriorityVo"
                                                             :index="10013" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">재개 동작</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="KILL" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 시스템 -->

                    <!--  btn-step 호스트 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(3)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit steps-tit-m">실행 호스트</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="radio-wrap">
                                            <label class="ui-check">
                                                <input type="radio" name="radio-eh" v-model="pickHost"
                                                       value="recommendHost">
                                                <span class="chk-ico"></span>
                                                <span class="txt">클러스터 내의 호스트(심포니 추천)</span>
                                            </label>
                                            <label class="ui-check">
                                                <input type="radio" name="radio-eh" v-model="pickHost"
                                                       value="targetHost">
                                                <span class="chk-ico"></span>
                                                <span class="txt">특정 호스트</span>
                                            </label>
                                        </div>
                                        <selectbox-component v-if="pickHost === 'recommendHost'" :title="'recHost'"
                                                             :selectvo="selectVo.selRecHostVo" :index="10014"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                        <selectbox-component v-if="pickHost === 'targetHost'" :title="'tarHost'"
                                                             :selectvo="selectVo.selTarHostVo" :index="10015"
                                                             v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <!-- //실행 호스트 영역 끝 -->
                                <h2 class="steps-tit">마이그레이션 옵션</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">마이그레이션 모드</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">최소 활성화된 하나의 가상 머신 디스크가<br>SCSI 예약을 사용할 경우마이그레이션 옵<br>션이 무시되어 가상 머신을 마이그레이션<br>할 수 없습니다.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <selectbox-component :title="'cusMigration'" :selectvo="selectVo.selMigrationVo"
                                                             :index="10016" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> 사용자 정의 마이그레이션 정책 사용
                                                    <input type="checkbox" v-model="vmUpdate.customMigrationUsed">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">마이그레이션 수렴을 처리하는 정책을 표<br>시합니다.마이그레이션 정책이 없을 경우<br>하이퍼바이저가 수렴을 처리합니다.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <selectbox-component :disabled="!vmUpdate.customMigrationUsed"
                                                             :title="'cusMigration'" :selectvo="selectVo.selCustomMigVo"
                                                             :index="10017" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> 사용자 정의 마이그레이션 다운 타임 사용
                                                    <input :disabled="vmUpdate.customMigration != 'Legacy'"
                                                           type="checkbox"
                                                           v-model="vmUpdate.customMigrationDowntimeUsed">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center more-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">라이브 마이그레이션 도중 가상 머신이 정<br>지 상태에 있을 수 있는최대 시간을 밀리 초<br>단위로 표시합니다. 값이 0인것은 VDSM<br>기본값이 사용되고 있음을 의미합니다. (현<br>재 engine 전체의 기본값은 0 밀리 초 입니<br>다.)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inputBox">
                                            <input :disabled="!vmUpdate.customMigrationDowntimeUsed" type="text"
                                                   class="input-custom" v-model="vmUpdate.customMigrationDowntime">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">마이그레이션 자동 통합 </p>
                                        <selectbox-component
                                                :disabled="!vmUpdate.customMigrationUsed"
                                                :title="'autoConverge'" :selectvo="selectVo.selAutoConVo" :index="10018"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">마이그레이션 압축 활성화</p>
                                        <selectbox-component
                                                :disabled="!vmUpdate.customMigrationUsed"
                                                :title="'compressed'" :selectvo="selectVo.selCompVo" :index="10019"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">
                                            <label class="ui-check"> 호스트 CUP 통과
                                                <input type="checkbox" :disabled="vmUpdate.affinity != 'pinned'">
                                                <!-- 비활성화는 속성 disabled 추가/삭제 -->
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <!-- //마이그레이션 옵션 영역 끝 -->

                                <h2 class="steps-tit">NUMA 설정
                                    <div class="btn-box">
                                        <button class="btn-tooltipm btn-tooltip">i</button>
                                        <div class="c-tooltip top-center">
                                            <div class="c-tooltip-inner"></div>
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">NUMA 설정 마이그레이 모드를 마이그레<br>이션 불가로 활성화하려면 NUMA 토폴로<br>지를 지원하는 호스트에 가상 머신을 고정<br>합니다.</span>
                                        </div>
                                    </div>
                                </h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">NUMA 노드 수</p>
                                        <div class="inputBox">
                                            <input :disabled="!(vmUpdate.affinity == 'pinned' && pickHost == 'targetHost')"
                                                   type="text" class="input-custom" v-model="node">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">조정 모드</p>
                                        <selectbox-component
                                                :disabled="!(vmUpdate.affinity == 'pinned' && pickHost == 'targetHost')"
                                                :title="'numa'" :selectvo="selectVo.selNumaVo" :index="10020"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <!-- //NUMA 설정 영역 끝 -->
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 호스트 -->

                    <!--  btn-step 초기실행 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(4)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">
                                            <label class="ui-check"> Cloud-Init/Sysprep 사용
                                                <input type="checkbox" v-model="useCloudInit">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="useCloudInit">
                                    <div class="frm-unit">
                                        <p class="tit">가상머신 호스트 이름</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmUpdate.hostName">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="useCloudInit">
                                    <div class="frm-unit">
                                        <p class="tit">시간대 설정</p>
                                        <selectbox-component :title="'timezone'" :selectvo="selectVo.selTimezoneVo"
                                                             :index="10021" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet" v-if="useCloudInit">
                                    <div class="frm-unit">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">사용자 지정 스크립트</p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">사용자 지정 스크립트 툴팁내용</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="full-textarea-wrap">
                                            <textarea class="full-textarea scroll-css" v-model="vmUpdate.customScript"
                                                      placeholder="사용자 지정 스크립트를 입력하세요."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 초기실행 -->

                    <!--  btn-step 리소스할당 -->
                    <div class="c-modal-body scroll-css" v-show="isUpdateStep(5)">
                        <div class="steps-cont-wrap">
                            <div class="c-modal-body_inner">
                                <h2 class="steps-tit">CPU 할당</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">CPU 프로파일</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="cpuProfile" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">CPU 공유</p>
                                        <selectbox-component :title="'cpuShare'" :selectvo="selectVo.selCpuShareVo"
                                                             :index="10022" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">&nbsp;</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="vmUpdate.cpuShare"
                                                   disabled>
                                        </div>
                                    </div>
                                </div>
                                <!-- //CPU 할당 영역 끝 -->

                                <h2 class="steps-tit">메모리 할당</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">할당할 실제 메모리</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="physicalMemory"
                                                   @change="physicalMemoryChange()">
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">
                                            <label class="ui-check"> 메모리 Balloon 장치 활성화
                                                <input type="checkbox" v-model="vmUpdate.memoryBalloon">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <!-- //메모리 할당 영역 끝 -->

                                <h2 class="steps-tit">IO 스레드</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">
                                            <label class="ui-check"> IO 스레드 활성화
                                                <input type="checkbox" v-model="ioThreadsEnabled">
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <!-- //IO 스레드 영역 끝 -->

                                <h2 class="steps-tit steps-tit-m">스토리지 할당 (템플릿이 선택되었을 경우에만 가능)</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="radio-wrap">
                                            <label class="ui-check">
                                                <input type="radio" name="radio-sh" checked>
                                                <span class="chk-ico"></span>
                                                <span class="txt">씬 프로비저닝</span>
                                            </label>
                                            <label class="ui-check">
                                                <input type="radio" name="radio-sh">
                                                <span class="chk-ico"></span>
                                                <span class="txt">복제</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> VirtlO-SCSI 활성화
                                                    <input type="checkbox" v-model="vmUpdate.virtioScsiEnabled">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                            <div class="btn-box">
                                                <button class="btn-tooltipm btn-tooltip">i</button>
                                                <div class="c-tooltip top-center more-right">
                                                    <div class="c-tooltip-inner"></div>
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">메모리 핫 플러그를 실행할 수 있는<br>가상머신 메모리 상환</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 리소스할당 -->

                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('vm')">취소</button>
                            <button class="btn-c-modal" v-show="isUpdateStep(0)" @click="nextStep(1)">다음</button>
                            <button class="btn-c-modal" v-show="!isUpdateStep(0)"
                                    :disabled="(vmNameStatus || validVmName)" @click="updateVm()"
                                    style="margin-right: 12px;">확인
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>

    <!-- update disk connection modal -->
    <div class="modalBox" id="upDiskConnectModal">
        <div class="modalBox-inner">
            <section class="c-modal-wrap c-modal-big c-modal-auto">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1>가상 디스크 연결</h1>
                    </div>
                    <div class="c-modal-body">
                        <div class="c-modal-body_inner pt-40">
                            <div class="clx mb-20" style="margin-top: -20px;">
                                <div class="searchBox fl-r">
                                    <input type="text" class="input-custom" placeholder="검색어를 입력하세요.">
                                    <button class="btn-search">검색</button>
                                </div>
                            </div>
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
                                                                <col style="width: 25px;">
                                                                <col style="width: 80px;">
            <%--                                                                <col style="width: 120px;">--%>
                                                                <col style="width: 80px;">
                                                                <col style="width: 100px;">
                                                                <col style="width: 120px;">
                                                                <col style="width: auto;">
                                                                <col style="width: 3%; min-width: 70px;">
                                                                <col style="width: 3%; min-width: 120px;">
                                                            </colgroup>
                                                            <tbody>
                                                            <th></th>
                                                            <th>이름</th>
<%--                                                            <th>ID</th>--%>
                                                            <th>가상크기<br>실제크기</th>
                                                            <th>스토리지 도메인</th>
                                                            <th>인터페이스</th>
                                                            <th>설명</th>
                                                            <th>R/O<br>(읽기 전용)</th>
                                                            <th>OS<br>(부팅 가능)</th>
                                                            </tbody>
                                                        </table>
                                                    </div><!-- //list-fix-wrap -->

                                                    <div class="list-scroll-wrap scroll-css" style="max-height: 240px;">
                                                        <!-- 0. 조회 내역이 없을때 - 시작 -->
                                                        <!-- <div class="nodata-wrap">
                                                            <p class="nodata">조회된 내용이 없습니다.</p>
                                                        </div> -->
                                                        <!-- //0. 조회 내역이 없을때 - 끝 -->

                                                        <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                        <div class="list-scroll-cont">
                                                            <table class="tbl-long">
                                                                <caption></caption>
                                                                <colgroup>
                                                                    <col style="width: 25px;">
                                                                    <col style="width: 80px;">
<%--                                                                    <col style="width: 120px;">--%>
                                                                    <col style="width: 80px;">
                                                                    <col style="width: 100px;">
                                                                    <col style="width: 120px;">
                                                                    <col style="width: auto;">
                                                                    <col style="width: 3%; min-width: 80px;">
                                                                    <col style="width: 3%; min-width: 90px;">
                                                                </colgroup>
                                                                <tbody>
                                                                <!-- 한줄반복 시작 -->
                                                                <tr v-if="disks.length == 0">
                                                                    <td colspan="12">연결할 디스크가 없습니다.</td>
                                                                </tr>
                                                                <tr v-if="disks.length > 0" v-for="(disk, idx) in pagingVo.viewList"
                                                                    @click="selectConnectDisk(disk)">
                                                                    <td class="fullTd">
                                                                        <label class="ui-check mr-0 mt-0">
                                                                            <input type="radio" name="link" id="radio2"
                                                                                   :value="disk" v-model="selectDisk">
                                                                            <span class="chk-ico"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td class="txt-left txt-strong">
                                                                        <label for="radio2" class="txt-ellipsis line2">{{disk.name}}</label>
                                                                        <!-- label의 for값은 앞의 radio의 id값과 일치시킬것 -->
                                                                    </td>
<%--                                                                    <td class="txt-left">{{disk.id}}</td>--%>
                                                                    <td><p>{{disk.virtualSize}}GB</p>
                                                                        <p>{{disk.actualSize}}GB</p>
                                                                    </td>
                                                                    <td class="txt-left">{{disk.storageDomainId}}</td>
                                                                    <td>
                                                                        <selectbox-component :title="'connDisk'"
                                                                                             :selectvo="disk.selectVo"
                                                                                             :index="10023"
                                                                                             v-on:setselected="setSelected">
                                                                        </selectbox-component>
                                                                    </td>
                                                                    <td class="txt-left">
                                                                        <p class="txt-ellipsis line2">
                                                                            {{disk.description}}</p>
                                                                    </td>
                                                                    <td>
                                                                        <label class="ui-check">
                                                                            <input type="checkbox"  v-model="disk.readOnly">
                                                                            <span class="chk-ico"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <label class="ui-check">
                                                                            <input type="checkbox" v-model="disk.bootable">
                                                                            <span class="chk-ico"></span>
                                                                        </label>
                                                                    </td>
                                                                </tr>
                                                                <!-- //한줄반복 끝 -->
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
                            <pagination-component :dataList="disks" :size="10" v-on:setViewList="setViewList"></pagination-component>
                            <%--                            <div class="doc-list-btm">--%>
                            <%--                                <div class="page-tbl">--%>
                            <%--                                    <div class="page-td">--%>
                            <%--                                        Rows per page :--%>
                            <%--                                    </div>--%>
                            <%--                                    <div class="page-td">--%>
                            <%--                                        <div class="select-wrap miniWrap">--%>
                            <%--                                            <select name="" id="">--%>
                            <%--                                                <option value="5">5</option>--%>
                            <%--                                                <option value="10">10</option>--%>
                            <%--                                                <option value="15">1500</option>--%>
                            <%--                                            </select>--%>
                            <%--                                        </div>--%>
                            <%--                                    </div>--%>
                            <%--                                    <div class="page-td">--%>
                            <%--                                        1-7 of 100--%>
                            <%--                                    </div>--%>
                            <%--                                    <div class="page-td btn-page-wrap">--%>
                            <%--                                        <button class="btn-page-prev">이전</button>--%>
                            <%--                                        <button class="btn-page-next">다음</button>--%>
                            <%--                                    </div>--%>
                            <%--                                </div>--%>
                            <%--                            </div>--%>
                        </div>
                    </div> <!-- //c-modal-body -->
                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('newConnect')">취소</button>
                            <button :disabled="selectDisk =='' || selectDisk == null " class="btn-c-modal"
                                    @click="connectDisk()">확인
                            </button>
                        </div>
                    </div> <!-- //c-modal-footer -->
                </div>
            </section>
        </div>
    </div>
    <!-- //update disk connection modal -->

    <!-- update disk create modal -->
    <div class="modalBox" id="upDiskCreateModal">
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
                                    <p class="tit">크기<span class="mustbe"></span></p>
                                    <div class="inputBox">
                                        <input type="number" class="input-custom" placeholder="#GBtye"
                                               v-model="disk.virtualSize" @input="checkDiskSize">
                                    </div>
                                    <p class="errTxt" v-if="(validDiskSize)">0 이상의 크기만 가능합니다.</p>
                                    <!-- 에러없으면 p태그 자체를 삭제 -->
                                </div>
                                <div class="frm-unit half-right">
                                    <p class="tit">설명</p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="설명입력"
                                               v-model="disk.description" :maxlength="this.$maxDescription">
                                    </div>
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">이름 <span class="mustbe"></span></p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="이름입력"
                                               @input="checkDiskName" v-model="disk.name">
                                    </div>
                                    <p class="errTxt" v-if="(diskNameStatus || validDiskName)">4~20자 영문, 숫자와
                                        특수기호(_),(-)만 사용 가능합니다.</p><!-- 에러없으면 p태그 자체를 삭제 -->
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit half-left">
                                    <p class="tit">인터페이스</p>
                                    <selectbox-component :title="'interface'" :selectvo="selectVo.selConnDiskVo"
                                                         :index="10023" v-on:setselected="setSelected">
                                    </selectbox-component>
                                </div>
                                <div class="frm-unit half-right">
                                    <p class="tit">&nbsp;</p>
                                    <div class="frm-only-check">
                                        <label class="ui-check" style="margin-right: 15px;">
                                            <input type="checkbox" v-model="disk.bootable">
                                            <span class="chk-ico" ></span> 부팅가능
                                        </label>
                                        <label class="ui-check" style="margin-right: 15px;">
                                            <input type="checkbox" v-model="disk.sharable">
                                            <span class="chk-ico"></span> 공유가능
                                        </label>
                                        <label class="ui-check">
                                            <input type="checkbox" v-model="disk.readOnly">
                                            <span class="chk-ico"></span> 읽기전용
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">스토리지 도메인</p>
                                    <selectbox-component :title="'storageDomain'" :selectvo="selectVo.selStrgDomainVo"
                                                         :index="10024" v-on:setselected="setSelected">
                                    </selectbox-component>
                                </div>
                            </div>
                        </div>
                    </div> <!-- //c-modal-body -->
                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('newDisk')">취소</button>
                            <button class="btn-c-modal" @click="createDisk()"
                                    :disabled="diskNameStatus || validDiskName || validDiskSize">확인
                            </button>
                        </div>
                    </div> <!-- //c-modal-footer -->
                </div>
            </section>
        </div>
    </div>
    <!-- //update disk create modal -->

    <!-- removeDiskModal -->
    <div class="modalBox" id="removeDiskModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        <div class="modalBox-inner">
            <section class="c-modal-wrap c-modal-auto">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1>가상 디스크 삭제</h1>
                    </div>
                    <div class="c-modal-body">
                        <div class="c-modal-body_inner pt-40">
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p>가상 디스크 {{disk.name}} 를 삭제하시겠습니까? <span></span></p>
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p v-if="disk.bootable === true" class="tit">- 부팅 가능</p>
                                    <p v-if="disk.sharable === true" class="tit">- 공유 가능</p>
                                    <p v-if="disk.readOnly === true" class="tit">- 읽기 전용</p>
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit">
                                    <p class="tit">옵션</p>
                                    <div class="frm-only-check">
                                        <label class="ui-check">
                                            <input type="checkbox" v-model="disk.removePermanently">
                                            <span class="chk-ico"></span> 완전 제거
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> <!-- //c-modal-body -->
                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('rmDisk')">취소</button>
                            <button class="btn-c-modal" @click="removeTargetDisk()">확인
                            </button>
                        </div>
                    </div> <!-- //c-modal-footer -->
                </div>
            </section>
        </div>
    </div>
    <!-- //removeDiskModal -->

    <!--by gtpark LUN disk modify modal -->
    <%--	<div class="modal fade modifylundiskmodal" tabindex="-1" role="dialog" aria-hidden="true">--%>
    <%--		<div   style="width: 700px" class="modal-dialog modal-lg">--%>
    <%--			<div class="modal-content">--%>
    <%--				<div class="modal-header">--%>
    <%--&lt;%&ndash;					<button type="button" class="close" data-dismiss="modal">&ndash;%&gt;--%>
    <%--&lt;%&ndash;						<span aria-hidden="true">×</span>&ndash;%&gt;--%>
    <%--&lt;%&ndash;					</button>&ndash;%&gt;--%>
    <%--					<button type="button" class="close" data-dismiss="modal" @click="cancelModifyDisk()">--%>
    <%--						<span aria-hidden="true">×</span>--%>
    <%--					</button>--%>
    <%--					<h4 class="modal-title" id="myModalLabel3">가상 디스크 편집</h4>--%>
    <%--				</div>--%>
    <%--				<div class="modal-body">--%>
    <%--					<br>--%>
    <%--					<div class="row">--%>
    <%--						<div class="form-group">--%>
    <%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>--%>
    <%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
    <%--								<input type="text" class="form-control" v-model="disk.name" @input="checkDiskName" placeholder="이름" :maxlength="this.$maxName">--%>
    <%--								<p class="text-danger" v-if="(diskNameStatus || validDiskName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>--%>
    <%--							</div>--%>
    <%--						</div>--%>
    <%--						<div class="form-group">--%>
    <%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">설명</label>--%>
    <%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
    <%--								<input type="text" class="form-control" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">--%>
    <%--							</div>--%>
    <%--						</div>--%>
    <%--						<div class="form-group">--%>
    <%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">인터페이스</label>--%>
    <%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
    <%--								<select class="form-control" v-model="diskInterface">--%>
    <%--									<option value="ide">IDE</option>--%>
    <%--									<option value="virtio_scsi">VirtIO-SCSI</option>--%>
    <%--									<option value="virtio">VirtIO</option>--%>
    <%--								</select>--%>
    <%--							</div>--%>
    <%--						</div>--%>
    <%--						<div class="form-group">--%>
    <%--							<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3">--%>
    <%--								<div class="checkbox">--%>
    <%--									<label> <input type="checkbox" v-model="disk.bootable"> 부팅 가능</label>--%>
    <%--								</div>--%>
    <%--								<div class="checkbox">--%>
    <%--									<label> <input type="checkbox" v-model="disk.sharable"> 공유 가능</label>--%>
    <%--								</div>--%>
    <%--							</div>--%>
    <%--						</div>--%>
    <%--						<hr>--%>
    <%--						<div class="form-group">--%>
    <%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">사용 호스트<span class="text-danger">*</span></label>--%>
    <%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
    <%--								<select class="form-control"  v-model="disk.lunVos" @change="changeHost()">--%>
    <%--									<option value="">사용 호스트 선택</option>--%>
    <%--									<option  v-for="host in hosts"  :value="host.lunVos">{{host.hostName}}</option>--%>
    <%--								</select>--%>
    <%--							</div>--%>
    <%--						</div>--%>
    <%--						<hr>--%>
    <%--						<div class="form-group">--%>
    <%--							<label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 타입<span class="text-danger">*</span></label>--%>
    <%--							<div class="col-md-9 col-sm-9 col-xs-12">--%>
    <%--								<select class="form-control"  v-model="disk.storageType">--%>
    <%--									<option value="">스토리지 타입 선택</option>--%>
    <%--									<option  value="FCP">파이버 채널</option>--%>
    <%--								</select>--%>
    <%--							</div>--%>
    <%--						</div>--%>
    <%--						<table v-if="disk.lunVos.length > 0 && disk.storageType == 'FCP'" class="table table-striped text-center">--%>

    <%--							<thead>--%>
    <%--							<tr>--%>
    <%--								<th>--%>
    <%--									<input disabled type="checkbox">--%>
    <%--								</th>--%>
    <%--								<th>LUN ID</th>--%>
    <%--								<th>크기</th>--%>
    <%--								<th>경로</th>--%>
    <%--								<th>벤더 ID</th>--%>
    <%--								<th>제품 ID</th>--%>
    <%--								<th>시리얼</th>--%>
    <%--							</tr>--%>
    <%--							</thead>--%>
    <%--							<tbody>--%>
    <%--							<tr  v-for="lun of disk.lunVos" @click="selectLun(lun)">--%>
    <%--								<td class="a-center">--%>
    <%--									<input :disabled="lun.diskId != null" type="checkbox" :id="disk.lun.lunId" :value="lun" v-model="disk.lun">--%>
    <%--								</td>--%>
    <%--								<td>{{lun.lunId}}</td>--%>
    <%--								<td>{{(lun.lunSize / Math.pow(1024, 3)).toFixed(2) }}GB</td>--%>
    <%--								<td>{{lun.lunPath}}</td>--%>
    <%--								<td>{{lun.lunVendor}}</td>--%>
    <%--								<td>{{lun.lunProductId}}</td>--%>
    <%--								<td>{{lun.lunSerial}}</td>--%>
    <%--							</tr>--%>
    <%--							</tbody>--%>
    <%--						</table>--%>
    <%--					</div>--%>
    <%--				</div>--%>
    <%--			<div class="modal-footer">--%>
    <%--				<button type="button" class="btn btn-primary" @click="createDisk()">확인</button>--%>
    <%--				<button type="button" class="btn btn-default" @click="cancelModifyDisk()">취소</button>--%>
    <%--&lt;%&ndash;                <button type="button" class="btn btn-default"data-dismiss="modal">취소</button>&ndash;%&gt;--%>
    <%--			</div>--%>
    <%--			</div>--%>
    <%--		</div>--%>
    <%--		</div>--%>
</div>
<!-- //updateVmModal -->


<script src="/js/castanets/compute/vm.js"></script>
<script src="/js/castanets/compute/cloneVm.js" type="text/javascript"></script>
<script src="/js/castanets/compute/updateVm.js" type="text/javascript"></script>