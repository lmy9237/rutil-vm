<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!-- page content -->
<div class="cont-wrap" role="main" id="hostVue">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner long" v-show="!spinnerOn">
        <div class="doc-list-wrap" v-show="lastUpdated != ''">
            <div class="doc-tit">
                <h2 class="tit"><a href="/compute/hosts">호스트</a></h2>
                <p class="location">컴퓨팅 &gt; <a href="/compute/hosts">호스트</a></p>
                <%--						<button class="btn btn-primary btn-topR"><img src="../../../../images/btn-list.png" alt="" class="icoImg"> 목록</button>--%>
            </div>

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>{{host.name}}</h3>
                    <p class="detail-updateInfo">{{lastUpdated}}<span class="name">{{host.name}}</span></p>
                </div>
                <div class="detail-body">
                    <div class="rw-list3-wrap">
                        <ul class="rw-list3">
                            <li>
                                <div class="rdBox">
                                    <div class="blue-ico exp"></div>
                                    <div class="txtBox">
                                        <p class="tit">설명</p>
                                        <p>{{host.description == null ? '-' : host.description}}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="rdBox">
                                    <div class="blue-ico time"></div>
                                    <div class="txtBox">
                                        <p class="tit">부팅시간(업타임)</p>
                                        <p>{{host.bootTime * 1000 | date}}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="rdBox">
                                    <div class="blue-ico etime"></div>
                                    <div class="txtBox">
                                        <p class="tit">IP</p>
                                        <p>{{host.address}}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="rw-chart-wrap">
                        <div class="rdBox donut-rdBox">
                            <div class="donut-tbl">
                                <div class="donut-tbc">
                                    <p class="donut-tit">CPU</p>
                                    <div class="donut-wrap" id="donut-chart1">
                                        <svg width="124" height="124">
                                            <circle r="31" cx="62" cy="62"/>
                                        </svg>
                                        <div class="donut-inner"><span
                                                class="num">{{chartData.cpuUsagePercent}}</span><span
                                                class="unit">%</span></div>
                                    </div>
                                    <p class="donut-txt"><span>{{chartData.cpuIdleUsagePercent}}%</span>사용가능</p>
                                </div>
                                <div class="donut-tbc" id="donut-chart2">
                                    <p class="donut-tit">메모리</p>
                                    <div class="donut-wrap">
                                        <svg width="124" height="124">
                                            <circle r="31" cx="62" cy="62"/>
                                        </svg>
                                        <div class="donut-inner"><span class="num">{{(chartData.memoryUsed / chartData.memoryTotal * 100).toFixed(0)}}</span><span
                                                class="unit">%</span></div>
                                    </div>
                                    <p class="donut-txt"><span>{{ chartData.memoryFree == 0 ? 0 : (chartData.memoryFree / Math.pow(1024, 3)).toFixed(1) }}GB</span>사용가능
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="rdBox">
                            <div class="chartBox">
                                <div class="chart-header">
                                    <p class="tit">CPU, 메모리</p>
                                    <ul class="chart-labelBox">
                                        <li><span style="background-color: #025cfc;"></span>CPU</li>
                                        <li><span style="background-color: #b620e0;"></span>메모리</li>
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

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>하드웨어</h3>
                </div>
                <div class="detail-body scrollBodyX">
                    <div class="tbl-list-wrap" style="min-width: 1000px;">
                        <table class="tbl-list">
                            <caption></caption>
                            <colgroup>
                                <col style="width: 9%; max-width: 90px;">
                                <col style="width: 12%; max-width: 100px;">
                                <col style="width: 12%; max-width: 120px;">
                                <col style="width: 16%; max-width: 160px;">
                                <col style="width: 10.5%; max-width: 105px;">
                                <col style="width: 15%; max-width: 110px;">
                                <col style="width: 14%; max-width: 105px;">
                                <col style="width: auto; max-width: 200px;">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>생산자</th>
                                <th>제품이름</th>
                                <th>CPU유형</th>
                                <th>물리적메모리</th>
                                <th>스왑메모</th>
                                <th>CPU모델</th>
                                <th>CPU코어수<br>코어수 (소켓/소켓당코어/쓰레드)</th>
                                <th>전원관리</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{{host.hwManufacturer}}</td>
                                <td>{{host.hwProductName}}</td>
                                <td>{{host.cpuType}}</td>
                                <td>{{ (host.memoryTotal / Math.pow(1024, 3)).toFixed(1) }}GB</td>
                                <td>{{ (host.swapTotal / Math.pow(1024, 3)).toFixed(1) }}GB</td>
                                <td>{{host.cpuName}}</td>
                                <td>{{host.cpuSockets * host.cpuCores * host.cpuThreads}} ( {{host.cpuSockets}} :
                                    {{host.cpuCores}} : {{host.cpuThreads}} )
                                </td>
                                <td>{{host.powerManagementEnabled ? '활성화' : '비활성화'}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- //detail-unitBox -->

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>소프트웨어</h3>
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
                            </colgroup>
                            <thead>
                            <tr>
                                <th>OS 버전</th>
                                <th>KVM 버전</th>
                                <th>커널 버전</th>
                                <th>호스트 에이전트 버전</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{{ (host.hostSw == null || host.hostSw.hostOs == null) ? '' : host.hostSw.hostOs}}
                                </td>
                                <td>{{ (host.hostSw == null || host.hostSw.kvmVersion == null) ? '' :
                                    host.hostSw.kvmVersion}}
                                </td>
                                <td>{{ (host.hostSw == null || host.hostSw.kernelVersion == null) ? '' :
                                    host.hostSw.kernelVersion}}
                                </td>
                                <td>{{ (host.hostSw == null || host.hostSw.vdsmVersion == null) ? '' :
                                    host.hostSw.vdsmVersion}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>가상머신</h3>
                </div>
                <div class="detail-body scrollBodyX">
                    <div class="tbl-list-wrap" style="min-width: 1000px;">
                        <table class="tbl-list">
                            <caption></caption>
                            <colgroup>
                                <col style="width: 9%; max-width: 90px;">
                                <col style="width: 15%; max-width: 100px;">
                                <col style="width: 15%; max-width: 120px;">
                                <col style="width: 16%; max-width: 160px;">
                                <col style="width: 10.5%; max-width: 105px;">
                                <col style="width: 11%; max-width: 110px;">
                                <col style="width: 10.5%; max-width: 105px;">
                                <col style="width: auto; max-width: 200px;">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>상태</th>
                                <th>이름</th>
                                <th>설명</th>
                                <th>IP</th>
                                <th>호스트명</th>
                                <th>CPU</th>
                                <th>메모리</th>
                                <th>네트워크</th>
                            </tr>
                            </thead>
                            <tbody>
                            <%--                            <tr v-for="vmSummary in host.vmSummaries">--%>
                            <tr v-for="vmSummary in pagingVo.viewListVm">
                                <td>
                                    <!-- 아이콘 정리 -->
                                    <div class="icoStat-box" v-if="vmSummary.status === 'up'">
                                        <span class="icoStat ico-up btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">완료</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'image_locked'">
                                        <span class="icoStat ico-locked btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">잠금</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'powering_up'">
                                        <span class="icoStat ico-waiting btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">작업 중</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'powering_down'">
                                        <span class="icoStat ico-ingdown btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">내려가는 중</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'not_responding'">
                                        <span class="icoStat ico-unknown btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">응답 없음</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'unknown'">
                                        <span class="icoStat ico-help btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">알수 없음</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'suspended'">
                                        <span class="icoStat ico-suspended btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">일시정지</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'down'">
                                        <span class="icoStat ico-down btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">내려감</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'reboot_in_progress'">
                                        <span class="icoStat ico-reboot btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">재부팅 중</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'wait_for_launch'">
                                        <span class="icoStat ico-refresh btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">기동준비</span>
                                        </div>
                                    </div>
                                    <div class="icoStat-box" v-else-if="vmSummary.status === 'saving_state'">
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
                                </td>
                                <td>{{vmSummary.name}}</td>
                                <td>{{vmSummary.description}}</td>
                                <td>{{vmSummary.address}}</td>
                                <td>{{vmSummary.hostName}}</td>
                                <td>{{vmSummary.vmLastUsage.cpuUsagePercent}}%</td>
                                <td>{{vmSummary.vmLastUsage.memoryUsagePercent}}%</td>
                                <td>{{getTotalNicsUsage(vmSummary.vmNicsLastUsage)}}%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <pagination-component :dataList="host.vmSummaries" :size="10" :flag="'vm'"
                                      v-on:setViewList="setViewList"></pagination-component>
            </div>

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>네트워크 인터페이스</h3>
                    <div class="btnSet-right">
                        <div class="btn-box">
                            <button type="button" class="btn-icon btn-icon-refresh btn-tooltip"
                                    @click="retrieveHostDetail()">
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
                                    @click="openModal('assignedNetwork')">할당된 네트워크 설정
                            </button>
                            <div class="c-tooltip top-right">
                                <span class="c-tooltip-arrow"></span>
                                <span class="txt">할당된 네트워크 설정</span>
                            </div>
                        </div>
                        <div class="btn-box">
                            <button type="button" class="btn-icon btn-icon-new btn-tooltip" :disabled="(((usingNetList.length == 0 && unUsingNetList.length == 0) && host.hostNicsUsageApi.length == 0)
															|| (usingNetList.length == 0 && unUsingNetList.length == 0))"
                                    @click="openModal('hostNetwork')">호스트
                                네트워크 설정
                            </button>
                            <div class="c-tooltip top-right">
                                <span class="c-tooltip-arrow"></span>
                                <span class="txt">호스트 네트워크 설정</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detail-body scrollBodyX">
                    <div class="tbl-list-wrap" style="min-width: 1000px;">
                        <table class="tbl-list">
                            <caption></caption>
                            <colgroup>
                                <col style="width: 9%; max-width: 90px;">
                                <col style="width: 15%; max-width: 180px;">
                                <col style="width: 10%; max-width: 120px;">
                                <col style="width: 10%; max-width: 120px;">
                                <col style="width: 15%; max-width: 120px;">
                                <col style="width: 15%; max-width: 120px;">
                                <col style="width: 15%; max-width: 120px;">
                                <col style="width: auto; max-width: 150px;">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>이름</th>
                                <th>맥어드레스</th>
                                <th>수신데이터</th>
                                <th>전송데이터</th>
                                <th>토탈 수신데이터</th>
                                <th>토탈 전송데이터</th>
                                <th>할당 IP</th>
                                <th>본딩</th>
                            </tr>
                            </thead>
                            <tbody v-for="hostNic in host.hostNicsUsageApi">
                            <tr v-if="hostNic.vlan == null" @click="toggle(hostNic.bonding)"
                                :class="{ opened: opened.includes(hostNic.bonding) }">
                                <td>
                                    <div class="icoStat-box" v-if="hostNic.bonding != null && hostNic.bonding.length > 0">
                                        <span class="icoStat ico_connect btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">본딩</span>
                                        </div>
                                    </div>
                                    {{hostNic.name}}
                                </td>
                                <td>{{hostNic.macAddress}}</td>
                                <td>{{hostNic.dataCurrentRx}}</td>
                                <td>{{hostNic.dataCurrentTx}}</td>
                                <td>{{hostNic.dataTotalRx}}</td>
                                <td>{{hostNic.dataTotalTx}}</td>
                                <td>{{(hostNic.ipAddress == null || hostNic.ipAddress == '' )? '-' : hostNic.ipAddress }}</td>
                                <td></td>
                            </tr>
                            <tr v-if="bonding.vlan == null && opened.includes(hostNic.bonding)"
                                style="background-color: aliceblue" v-for="bonding of hostNic.bonding">
                                <td>{{bonding.name}}</td>
                                <td>{{bonding.macAddress}}</td>
                                <td>{{bonding.dataCurrentRx}}</td>
                                <td>{{bonding.dataCurrentTx}}</td>
                                <td>{{bonding.dataTotalRx}}</td>
                                <td>{{bonding.dataTotalTx}}</td>
                                <td>{{(bonding.ipAddress == null || bonding.ipAddress == '' )? '-' : bonding.ipAddress }}</td>
                                <td>{{hostNic.name}}의 슬레이브</td>
                            </tr>
                            </tbody>
                        </table>
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
                        <div class="list-tot" style="width: 110% ; min-width: 1000px;">
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
                                        <tr v-for="p in pagingVo.viewListEvent" v-if="paginatedData.length > 0">
                                            <td><i :class="[eventType(p.severity)]"
                                                   :title="getEventStatusToKor(p.severity)"></i></td>
                                            <td>{{p.time | date}}</td>
                                            <td class="txt-left">
                                                {{p.description}}
                                            </td>
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
            <pagination-component :dataList="paginatedData" :size="10" :flag="'event'"
                                  v-on:setViewList="setViewList"></pagination-component>
        </div>
        <!-- //doc-list-wrap -->

        <!-- assignedNetworkModal -->
        <div class="modalBox" id="assignedNetworkModal">
            <div class="modalBox-inner">
                <section class="c-modal-wrap">
                    <div class="c-modal-inner">
                        <div class="c-modal-header">
                            <h1>호스트 {{host.name}}의 할당된 네트워크 설정</h1>
                        </div>
                        <div class="c-modal-body scroll-css">
                            <div class="steps-cont-wrap">
                                <div class="c-modal-body_inner pt-30">
                                    <div class="frmSet">
                                        <div class="frm-unit">
                                            <p class="tit">할당된 네트워크 선택</p>
                                            <div class="fullselect-wrap">
                                                <selectbox-component :title="'assignedNetwork'"
                                                                     :selectvo="selectVo.selNetworkVo" :index="10000"
                                                                     v-on:setselected="setSelected">
                                                </selectbox-component>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 탭 시작 -->
                                    <div class="pop_tabsBox">
                                        <div class="tabs" v-show="sendNetAttachment.nicNetworkId !== 'none'">
                                            <ul>
                                                <li @click="tabClick(1)"><a href="#tabs-1">IPv4</a></li>
                                                <li @click="tabClick(2)"><a href="#tabs-2">DNS설정</a></li>
                                            </ul>
                                            <div id="tabs-1" v-if="index == netIdx && tabNum == 1"
                                                 v-for="(netAttachment, index) in host.netAttachment">
                                                <div class="frmSet">
                                                    <div class="frm-unit">
                                                        <p class="tit" style="margin-top: 20px;">부트 프로토콜</p>
                                                        <div class="radio-wrap">
                                                            <label class="ui-check w90">
                                                                <input type="radio" name="radio-bootpt"
                                                                       v-model="sendNetAttachment.bootProtocol"
                                                                       value="none">
                                                                <span class="chk-ico"></span>
                                                                <span class="txt">없음</span>
                                                            </label>
                                                            <label class="ui-check w90">
                                                                <input type="radio" name="radio-bootpt"
                                                                       v-model="sendNetAttachment.bootProtocol"
                                                                       value="dhcp">
                                                                <span class="chk-ico"></span>
                                                                <span class="txt">DHCP</span>
                                                            </label>
                                                            <label class="ui-check w90">
                                                                <input type="radio" name="radio-bootpt"
                                                                       v-model="sendNetAttachment.bootProtocol"
                                                                       value="static">
                                                                <span class="chk-ico"></span>
                                                                <span class="txt">정적</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="frmSet">
                                                    <div class="frm-unit half-left">
                                                        <p class="tit">IP</p>
                                                        <div class="inputBox">
                                                            <input :disabled="sendNetAttachment.bootProtocol != 'static'"
                                                                   type="text" class="input-custom"
                                                                   v-model="sendNetAttachment.nicAddress">
                                                        </div>
                                                    </div>
                                                    <div class="frm-unit half-right">
                                                        <p class="tit">넷마스크/라우팅</p>
                                                        <div class="inputBox">
                                                            <input :disabled="sendNetAttachment.bootProtocol != 'static'"
                                                                   type="text" class="input-custom"
                                                                   v-model="sendNetAttachment.nicNetmask">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="frmSet">
                                                    <div class="frm-unit half-left">
                                                        <p class="tit">게이트웨이</p>
                                                        <div class="inputBox">
                                                            <input :disabled="sendNetAttachment.bootProtocol != 'static'"
                                                                   type="text" class="input-custom"
                                                                   v-model="sendNetAttachment.nicGateway">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="tabs-2" v-if="attachmentIdx == netIdx && tabNum == 2"
                                                 v-for="(netAttachment, attachmentIdx) in host.netAttachment">
                                                <div class="frmSet">
                                                    <div class="frm-unit">
                                                        <p class="tit" style="margin-top: 30px;">
                                                            <label class="ui-check">DNS 설정
                                                                <input type="checkbox" v-model="checkDns">
                                                                <span class="chk-ico"></span>
                                                            </label>
                                                        </p>
                                                    </div>
                                                </div>
                                                <p class="tit">DNS 서버</p>
                                                <!-- 추가/삭제에 따른 영역 시작 -->
                                                <div class="flex-rBtn-wrap"
                                                     v-for="(dnsServer, dnsIdx) in sendNetAttachment.dnsServer">
                                                    <div class="frmSet">
                                                        <div class="flex-leftBox">
                                                            <div class="frm-unit">

                                                                <input type="text" class="input-custom"
                                                                       :disabled="!checkDns"
                                                                       v-model="sendNetAttachment.dnsServer[dnsIdx]">
                                                            </div>
                                                        </div>
                                                        <div class="flex-rBtnBox" style="padding-top: 20px;">
                                                            <div class="btn-box">
                                                                <button class="btn-square btn-icon-plus btn-tooltip"
                                                                        :disabled="sendNetAttachment.dnsServer.length == 2"
                                                                        @click="addDns(dnsIdx)">추가
                                                                </button>
                                                                <div class="c-tooltip top-right">
                                                                    <div class="c-tooltip-inner"></div>
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">추가</span>
                                                                </div>
                                                            </div>
                                                            <div class="btn-box">
                                                                <button class="btn-square btn-icon-minus btn-tooltip"
                                                                        @click="removeDns(dnsIdx)">삭제
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
                                                <!-- //추가/삭제에 따른 영역 끝 -->

                                            </div>
                                        </div>
                                    </div>
                                    <!-- //탭 끝 -->

                                </div>
                            </div>
                        </div>
                        <div class="c-modal-footer">
                            <div class="buttonSet">
                                <button class="btn-c-modal btn-cancel" @click="closeModal('assignedNetwork')">취소
                                </button>
                                <button class="btn-c-modal"
                                        :disabled="(sendNetAttachment.bootProtocol == 'static' && (sendNetAttachment.nicAddress == null || sendNetAttachment.nicNetmask == null || sendNetAttachment.nicGateway == null)) || (sendNetAttachment.bootProtocol == 'static' && (sendNetAttachment.nicAddress == '' || sendNetAttachment.nicNetmask == '' || sendNetAttachment.nicGateway == ''))"
                                        @click="modifyNicNetwork()">확인
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <!-- //assignedNetworkModal -->

        <%-- setupHostNetworkModal  --%>
        <div class="modalBox" id="setupHostNetworkModal">
            <div class="modalBox-inner">
                <section class="c-modal-wrap c-modal-big">
                    <div class="c-modal-inner">
                        <div class="c-modal-header">
                            <h1>호스트 {{host.name}}의 네트워크 설정</h1>
                            <div class="btn-posRT">
                                <div class="btn-box">
                                    <button class="btn-icon btn-icon-refresh btn-tooltip" @click="resetHostNic()">초기화
                                    </button>
                                    <div class="c-tooltip bottom-center">
                                        <div class="c-tooltip-inner"></div>
                                        <span class="c-tooltip-arrow"></span>
                                        <span class="txt">초기화</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="c-modal-body scroll-css">
                            <div class="c-modal-body_inner pt-30">
                                <div class="pop-dndBox mini">
                                    <div class="pop-dndBox-item">
                                        <h2 class="pop-dndBox-tit">인터페이스</h2>
                                    </div>
                                    <div class="pop-dndBox-item">
                                        <h2 class="pop-dndBox-tit">할당된 네트워크</h2>
                                    </div>
                                    <div class="pop-dndBox-item">
                                        <h2 class="pop-dndBox-tit">미 할당된 네트워크</h2>
                                    </div>
                                </div>
                                <div class="pop-dndBox">
                                    <div class="pop-dndBox-item double scroll-css">

                                        <!-- 회색박스 시작 -->
                                        <div v-for="hostNic in hostNicsModifyBonding">
                                            <%--							bonding이 있는 애들 설정--%>
                                            <div class="pop-dndBox-line" v-if="hostNic.bonding && hostNic.vlan == null"
                                                 style="margin-bottom: 2%;">
                                                <div class='pdl-item-left bonding drop-zone'
                                                     @drop='nicOnDrop($event, hostNic)'>
                                                    <div class="pdl-header">
                                                        <p class="tit">{{hostNic.name}}</p>
                                                        <button class="btn-pdl-unbond" @click="breakBonding(hostNic)">
                                                            본딩해제
                                                        </button>
                                                    </div>

                                                    <div style="margin-bottom: 10px;padding: 5px;" class='drag-el'
                                                         v-for="bonding in hostNic.bonding" :key='bonding.id'
                                                         @dragover.prevent @dragenter.prevent
                                                         @dragstart='nicStartDrag($event, bonding)'>

                                                        <div class="pop-dnd-list-line">
                                                            <div class="btn-dnd">
                                                                <div class="icoStat-box left">
                                                                    <span v-if="bonding.status === 'UP'"
                                                                          class="icoStat ico-up"></span>
                                                                    <span v-else-if="bonding.status === 'DOWN'"
                                                                          class="icoStat ico-down"></span>
                                                                </div>
                                                                <span class="txt">{{ bonding.name }}</span>
                                                            </div>
                                                            <button v-if="hostNic.bonding.length > 2"
                                                                    class="btn-dnd-right"
                                                                    @click="deleteSlave(bonding.id, hostNic.bonding)"></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 회색박스안 - 가운데 버튼영역 시작 -->
                                                <div class="pdl-item-center">
                                                    <button class="btn-pd left"></button>
                                                    <button class="btn-pd right"></button>
                                                </div>
                                                <!-- //회색박스안 - 가운데 버튼영역 끝 -->

                                                <!-- 회색박스안 - 오른쪽 영역 시작 네트워크 할당 되어 있는 애들 설정--->
                                                <div style="display: block; width: 100%; height: 37px; border: 1px dotted #979797; padding: 0; margin: 0; background: url('../images/btn_newdnd.png') center center no-repeat transparent; border-radius: 5px; "
                                                     class='pdl-item-right drop-zone' @dragenter.prevent
                                                     @dragover.prevent
                                                     @drop='NetOnDrop($event, null, null, hostNic)'
                                                     v-if="hostNic.baseInterface == null">
                                                    <div class='btn-dnd drag-el' v-for="(data, index) in usingNetList"
                                                         v-if="hostNic.base === data.baseInterface" :key='data.id'
                                                         draggable @dragover.prevent
                                                         @dragenter.prevent
                                                         @dragstart='netStartDrag($event, data, hostNic)'>
                                                        <div class="icoStat-box left">
                                                            <span v-if="data.status == 'operational'"
                                                                  class="icoStat ico-up"></span>
                                                            <span v-else-if="data.status !== 'operational'"
                                                                  class="icoStat ico-down"></span>
                                                        </div>
                                                        <span v-if="data.vlan == null"
                                                              class="txt"> {{ data.name }}</span>
                                                        <span v-if="data.vlan !== null" class="txt">(VLAN :{{(data.vlan)}})</span>

                                                        <div class="icoRightBox">
                                                            <div class="icoStat-box"
                                                                 v-for="(usage, idx) in data.usages">
                                                                <span v-if="usage.usage == 'DISPLAY'"
                                                                      class="icoStat ico-display btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">DISPLAY</span>
                                                                </div>
                                                                <span v-if="usage.usage == 'MIGRATION'"
                                                                      class="icoStat ico-migration btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">MIGRATION</span>
                                                                </div>
                                                                <span v-if="usage.usage == 'MANAGEMENT'"
                                                                      class="icoStat ico-management btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">MANAGEMENT</span>
                                                                </div>
                                                                <span v-if="usage.usage == 'DEFAULT_ROUTE'"
                                                                      class="icoStat ico-defaultroot btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">DEFAULT ROUTE</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- //회색박스안 - 오른쪽 영역 끝 -->
                                            </div>

                                            <%--							bonding이 없는 애들 설정--%>
                                            <div class="pop-dndBox-line" v-if="!hostNic.bonding && hostNic.vlan == null"
                                                 style="margin-bottom: 2%;">
                                                <div class='pdl-item-left drop-zone' @drop='nicOnDrop($event, hostNic)'>
                                                    <div class='drag-el' :key='hostNic.id' @dragover.prevent
                                                         @dragenter.prevent draggable
                                                         @dragstart='nicStartDrag($event, hostNic)'>
                                                        <div class="pdl-item-left" v-if="hostNic.status === 'UP'">
                                                            <div class="btn-dnd">
                                                                <div class="icoStat-box left">
                                                                    <li class="icoStat ico-up"></li>
                                                                </div>
                                                                <span class="txt">{{ hostNic.name }}</span>
                                                            </div>
                                                        </div>

                                                        <div class="pdl-item-left"
                                                             v-else-if="hostNic.status === 'DOWN'">
                                                            <div class="btn-dnd">
                                                                <div class="icoStat-box left">
                                                                    <li class="icoStat ico-down"></li>
                                                                </div>
                                                                <span class="txt">{{ hostNic.name }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 회색박스안 - 가운데 버튼영역 시작 -->
                                                <div class="pdl-item-center">
                                                    <button class="btn-pd left"></button>
                                                    <button class="btn-pd right"></button>
                                                </div>
                                                <!-- //회색박스안 - 가운데 버튼영역 끝 -->

                                                <!-- 회색박스안 - 오른쪽 영역 시작 네트워크 할당 되어 있는 애들 설정--->
                                                <div style=" display: block; width: 100%; height: 37px; border: 1px dotted #979797; padding: 0; margin: 0; background: url('../images/btn_newdnd.png') center center no-repeat transparent; border-radius: 5px; "
                                                     class='pdl-item-right drop-zone' @dragenter.prevent
                                                     @dragover.prevent
                                                     @drop='NetOnDrop($event, null, null, hostNic)'
                                                     v-if="hostNic.baseInterface == null">
                                                    <div class='btn-dnd drag-el' v-for="(data, index) in usingNetList"
                                                         v-if="hostNic.base === data.baseInterface" :key='data.id'
                                                         draggable @dragover.prevent
                                                         @dragenter.prevent
                                                         @dragstart='netStartDrag($event, data, hostNic)'>
                                                        <div class="icoStat-box left">
                                                            <span v-if="data.status == 'operational'"
                                                                  class="icoStat ico-up"></span>
                                                            <span v-else-if="data.status !== 'operational'"
                                                                  class="icoStat ico-down"></span>
                                                        </div>
                                                        <span v-if="data.vlan == null"
                                                              class="txt"> {{ data.name }}</span>
                                                        <span v-if="data.vlan !== null" class="txt">(VLAN :{{(data.vlan)}})</span>

                                                        <div class="icoRightBox">
                                                            <div class="icoStat-box"
                                                                 v-for="(usage, idx) in data.usages">
                                                                <span v-if="usage.usage == 'DISPLAY'"
                                                                      class="icoStat ico-display btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">DISPLAY</span>
                                                                </div>
                                                                <span v-if="usage.usage == 'MIGRATION'"
                                                                      class="icoStat ico-migration btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">MIGRATION</span>
                                                                </div>
                                                                <span v-if="usage.usage == 'MANAGEMENT'"
                                                                      class="icoStat ico-management btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">MANAGEMENT</span>
                                                                </div>
                                                                <span v-if="usage.usage == 'DEFAULT_ROUTE'"
                                                                      class="icoStat ico-defaultroot btn-tooltip"></span>
                                                                <div class="c-tooltip j-right">
                                                                    <span class="c-tooltip-arrow"></span>
                                                                    <span class="txt">DEFAULT ROUTE</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- //회색박스안 - 오른쪽 영역 끝 -->
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 미 할당된 네트워크 영역 시작 -->
                                    <div class="pop-dndBox-item">
                                        <div class="pop-dndBox-cont">
                                            <div class="scroll-css" @drop='NetOnDrop($event, null, null, null)'>

                                                <div v-for="(data, index) in unUsingNetList"
                                                     class='btn-dnd drag-el'
                                                     :key='data.id'
                                                     draggable
                                                     @dragover.prevent
                                                     @dragenter.prevent
                                                     @dragstart='netStartDrag($event, data, null)'
                                                >
                                                    <div class="icoStat-box left">
                                                        <span v-if="data.status == 'operational'"
                                                              class="icoStat ico-up"></span>
                                                        <span v-else-if="data.status !== 'operational'"
                                                              class="icoStat ico-down"></span>
                                                    </div>
                                                    <span v-if="data.vlan == null" class="txt"> {{ data.name }}</span>
                                                    <span v-if="data.vlan !== null"
                                                          class="txt"> (VLAN :{{(data.vlan)}})</span>
                                                </div>
                                                <div style="width: 100px; height: 100px;"
                                                     @dragover.prevent v-if="!(unUsingNetList.length > 0)"
                                                     @dragenter.prevent>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('hostNetwork')">취소</button>
                            <button class="btn-c-modal" :disabled="usingNetList.length == 0"
                                    @click="SetupHostNetwork()">확인
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <%-- // setupHostNetworkModal  --%>

        <!-- bonding create modal -->
        <div class="modalBox" id="bondingCreateModal">
            <div class="modalBox-inner">
                <section class="c-modal-wrap c-modal-auto">
                    <div class="c-modal-inner">
                        <div class="c-modal-header">
                            <h1>새로운 본딩 생성</h1>
                        </div>
                        <div class="c-modal-body">
                            <div class="c-modal-body_inner pt-40">
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">본딩 이름</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" placeholder="이름 입력"
                                                   v-model="makeNicBonding.bondingName">
                                        </div>
                                        <%--                                        <p class="errTxt" v-if="(validDiskSize)">0 이상의 크기만 가능합니다.</p>--%>

                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">본딩 모드</p>
                                        <selectbox-component :title="'bondingMode'" :selectvo="selectVo.selBondingVo"
                                                             :index="10001" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">사용자 정의 모드</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom"
                                                   :disabled="makeNicBonding.bondingModeName !== '사용자 정의 모드'"
                                                   v-model="makeNicBonding.bondingCustomizing">
                                        </div>
                                        <%--                                        <p class="errTxt" v-if="(diskNameStatus || validDiskName)">4~20자 영문, 숫자와--%>
                                        <%--                                            특수기호(_),(-)만 사용 가능합니다.</p>--%>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- //c-modal-body -->
                        <div class="c-modal-footer">
                            <div class="buttonSet">
                                <button class="btn-c-modal btn-cancel" @click="cancelMakeBonding()">취소</button>
                                <button class="btn-c-modal" @click="checkbonding()">확인
                                </button>
                            </div>
                        </div> <!-- //c-modal-footer -->
                    </div>
                </section>
            </div>
        </div>
        <!-- //bonding create modal -->

    </div>
</div>


<!-- /page content -->

<script src="/js/castanets/compute/host.js" type="text/javascript"></script>

