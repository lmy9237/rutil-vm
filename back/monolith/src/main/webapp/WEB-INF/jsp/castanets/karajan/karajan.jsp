<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%--<div class="right_col" role="main" id="karajan">--%>
<div class="cont-wrap" id="karajan">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner long" v-show="!spinnerOn">
        <div class="doc-list-wrap">
            <div class="doc-tit">
                <h2 class="tit"><a href="/symphony">심포니</a></h2>
                <p class="location">심포니</p>
                <div class="fl-r">
                    <ul class="statGrp">
                        <li><span class="stat-per stat-enhancement">정상</span></li>
                        <li><span class="stat-per stat-minor">관심</span></li>
                        <li><span class="stat-per stat-average">주의</span></li>
                        <li><span class="stat-per stat-major">경계</span></li>
                        <li><span class="stat-per stat-critical">심각</span></li>
                    </ul>
                </div>
            </div>
            <div class="clx" style="margin-bottom: -10px;">
                <div class="fl-l">
                        <selectbox-component :size="'mid'" :title="'symphony'" :selectvo="selectVo.selClusterVo" :index="10000" v-on:setselected="setSelected">
                        </selectbox-component>
                </div>
                <div class="btn-box">
                    <button type="button" class="btn-icon btn-icon-replace btn-tooltip"
                            v-on:click="consolidateVms(selectedCluster.id)">재배치
                    </button>
                    <div class="c-tooltip top-right">
                        <span class="c-tooltip-arrow"></span>
                        <span class="txt">재배치</span>
                    </div>
                </div>
                <div class="fl-r">
                    <div class="searchBox fl-l">
                        <input type="text" class="input-custom" placeholder="가상머신 명 검색"
                               style="width: 188px; height: 41px; line-height: 41px;">
                        <button class="btn-search">검색</button>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-refresh btn-tooltip"
                                v-on:click="retrieveDataCenterStatus('update')">새로고침
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">새로고침</span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="detail-unitBox">
                <div class="detail-body">
                    <div class="folding-Box folding-multi">
                        <!-- 접기 영역 반복 시작 -->
                        <div class="folding-wrap" v-for="(host, hostIndex) in selectedCluster.hosts"
                             v-show="selectedCluster.hosts.length > 0">
                            <div class="folding-header">
                                <div class="symphony-tit">
                                    <p class="tit"><span class="icos ico-symphony"></span><a
                                            :href="'/compute/host?id=' + host.id">{{host.name}}</a>
                                    </p>
                                    <ul class="statGrp">
                                        <li>
                                            <span class="txt">CPU사용량</span>
                                            <span :class="[setUsageColor((host.cpuCurrentUser + host.cpuCurrentSystem).toFixed(0), 'host')]"><span>
                                                {{(host.cpuCurrentUser + host.cpuCurrentSystem).toFixed(0)}}
                                            </span>
                                                %
                                            </span>
                                        </li>
                                        <li>
                                            <span class="txt">메모리 사용량</span>
                                            <%--                                            <span class="stat-per stat-enhancement">--%>
                                            <span :class="[setUsageColor((host.memoryUsed / host.memoryTotal * 100).toFixed(0), 'host')]"><span>
                                                {{(host.memoryUsed / host.memoryTotal * 100).toFixed(0)}}
                                                </span>
                                                %</span>
                                        </li>
                                        <li>
                                            <span class="txt">가상머신</span>
                                            <span class="stat-per stat-normal"><span>{{host.vms.length}}</span></span>
                                            <span class="txt">대</span>
                                        </li>
                                        <!-- stat-per의 클래스 정리
                                            0   ~ 20% : stat-enhancement
                                            21% ~ 40% : stat-minor
                                            41% ~ 60% : stat-average
                                            61% ~ 80% : stat-major
                                            81% ~100% : stat-critical
                                            no-style  : stat-normal
                                         -->
                                    </ul>
                                </div>
                                <button class="btn-folding active">펼치기/닫기</button>
                                <!-- 디폴트 펼침 : 클래스 active 추가 (닫힘: 클래스 active 삭제) -->
                            </div>
                            <div class="folding-body" style="display: block;"><!-- 디폴트 펼침 : 클래스 active 추가 (닫힘: 클래스 active 삭제) -->
                                <div class="cart-list-wrap dropdown-parent">
                                    <!-- 카드영역 반복 시작 -->
                                    <div class="card-wrap" v-for="(vm, vmIndex) in filteredVms(host.vms)">
                                        <div class="card-header">
                                            <p class="tit">{{vm.name}}</p>
                                            <div class="dropdown-wrap">
                                                <button class="btn-dropdown">열기/닫기</button>
                                                <div class="dropdown-list-wrap">
                                                    <div class="dropdown-list-header">
                                                        <p class="tit">가상머신 이동</p>
                                                    </div>
                                                    <div class="dropdown-list-body">
                                                        <ul class="dropdown-list scroll-css">
                                                            <li v-for="otherHost in selectedCluster.hosts"
                                                                v-if="host.id != otherHost.id && otherHost.status == 'up'">
                                                                <button class="btn-govm"
                                                                        @click="migrateVm(otherHost.name, vm.name, otherHost.id, vm.id, hostIndex, vmIndex)">
                                                                    {{otherHost.name}}
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- //dropdown-wrap  -->
                                        </div>
                                        <div class="card-body">
                                            <!-- 0. 생성 중일때 -->
                                            <div class="card-ing" style="display: none;">
                                                <!-- ( 생성 끝나면 display:none; )  -->
                                                <%--												<div class="donut-wrap ing">--%>
                                                <%--													<svg width="92" height="92">--%>
                                                <%--														<circle r="23" cx="46" cy="46" style="stroke-dashoffset: -59; stroke-dasharray: 144;" />--%>
                                                <%--														<!----%>
                                                <%--                                                            /* 2π × r = 2π × 23 ≈ 144 */--%>
                                                <%--                                                            stroke-dashoffset 의 숫자 : 0일때 -144, 100%일때 0으로 계속 변경해서 들어가야함--%>

                                                <%--                                                            예시]--%>
                                                <%--                                                            10% 일때 : (144 * (100 - 10)) / 100 * -1  ≈  -129--%>
                                                <%--                                                            59% 일때 : (144 * (100 - 59)) / 100 * -1  ≈  -59--%>
                                                <%--                                                         -->--%>
                                                <%--													</svg>--%>
                                                <%--													<div class="donut-inner"></div>--%>
                                                <%--												</div>--%>
                                                <%--												<div class="num">59%</div>--%>
                                                <div class="loader">
                                                    <div class="loader_bg">
                                                        <div class="loader_bx">
                                                            <i class="loader_circle"></i>
                                                            <span>올라가는 중...</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- 1. 생성완료일때 : 임시로 가린상태 (card-ing의 상태가 끝나면 등장)  -->
                                            <ul class="bar-list">
                                                <li>
                                                    <p class="num"><span>{{(vm.cpuCurrentTotal / (vm.cores * vm.sockets * vm.threads)).toFixed(0) > 99 ? 100: (vm.cpuCurrentTotal / (vm.cores * vm.sockets * vm.threads)).toFixed(0)}}</span>%
                                                    </p>
                                                    <div class="bar-box">
                                                        <span :class="[setUsageColor((vm.cpuCurrentTotal / (vm.cores * vm.sockets * vm.threads)).toFixed(0), 'vm')]"
                                                              :style="'height: ' + ((vm.cpuCurrentTotal / (vm.cores * vm.sockets * vm.threads)).toFixed(0) > 99 ? 100 : ((vm.cpuCurrentTotal / (vm.cores * vm.sockets * vm.threads)).toFixed(0))) + '%'"></span>
                                                    </div>
                                                    <p class="tit">CPU</p>
                                                </li>
                                                <li>
                                                    <p class="num"><span>{{(vm.memoryUsed / vm.memoryInstalled * 100).toFixed(0) > 99 ? 100 : (vm.memoryUsed / vm.memoryInstalled * 100).toFixed(0)}}</span>%
                                                    </p>
                                                    <div class="bar-box">
                                                        <span :class="[setUsageColor((vm.memoryUsed / vm.memoryInstalled * 100).toFixed(0), 'vm')]"
                                                              :style="'height: ' + ((vm.memoryUsed / vm.memoryInstalled * 100).toFixed(0) > 99 ? 100 : (vm.memoryUsed / vm.memoryInstalled * 100).toFixed(0)) + '%'"></span>
                                                    </div>
                                                    <p class="tit">메모리</p>
                                                </li>
                                                <!-- bar의 클래스 정리
                                                    0   ~ 20% : bar-enhancement
                                                    21% ~ 40% : bar-minor
                                                    41% ~ 60% : bar-average
                                                    61% ~ 80% : bar-major
                                                    81% ~100% : bar-critical
                                                -->
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- //카드영역 반복 끝 -->
                                </div>
                            </div>
                        </div>
                        <!-- //folding-wrap -- 접기 영역 반복 끝 -->
                    </div>
                    <!-- //folding-Box -->
                </div>
            </div>
            <!-- //detail-unitBox -->

        </div>
        <!-- //doc-list-wrap -->

        <!-- reorder karayanModal -->
        <div class="modalBox" id="vmReorderModal" >
            <div class="modalBox-inner">
                <section class="c-modal-wrap c-modal-auto">
                    <div class="c-modal-inner">
                        <div class="c-modal-header">
                            <h1>가상머신 재배치(심포니 추천)</h1>
                        </div>
                        <div class="c-modal-body">
                            <div class="c-modal-body_inner pt-40">
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="doc-list-wrap">
                                            <div class="doc-list-body">
                                                <div class="doc-list-inner">
                                                    <div class="list-tot">
                                                        <div class="list-fix-wrap">
                                                            <table>
                                                                <caption></caption>
                                                                <colgroup>
                                                                    <col style="width: 50px;">
                                                                    <col style="width: 150px;">
                                                                    <col style="width: 150px;">
                                                                    <col style="width: auto;">
                                                                </colgroup>
                                                                <tbody>
                                                                <th>순서</th>
                                                                <th>대상 호스트</th>
                                                                <th>대상 가상머신</th>
                                                                <th>목적 호스트</th>
                                                                </tbody>
                                                            </table>
                                                        </div><!-- //list-fix-wrap -->

                                                        <div class="list-scroll-wrap scrollBodyY">
                                                            <!-- 0. 조회 내역이 없을때 - 시작 -->
                                                            <div class="nodata-wrap" v-if="consolidations == null || consolidations.length == 0">
                                                                <p class="nodata">재배치할 가상머신이 없습니다.</p>
                                                            </div>
                                                            <!-- //0. 조회 내역이 없을때 - 끝 -->

                                                            <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                            <div class="list-scroll-cont" v-if="consolidations != null && consolidations.length > 0">
                                                                <table>
                                                                    <caption></caption>
                                                                    <colgroup>
                                                                        <col style="width: 50px;">
                                                                        <col style="width: 150px;">
                                                                        <col style="width: 150px;">
                                                                        <col style="width: auto;">
                                                                    </colgroup>
                                                                    <tbody>
                                                                    <!-- 한줄반복 시작 -->
                                                                    <tr v-for="(consolidation, index) in consolidations">
                                                                        <td>{{index + 1}}</td>
                                                                        <td>{{consolidation.fromHostName}}</td>
                                                                        <td>{{consolidation.vmName}}</td>
                                                                        <td>{{consolidation.hostName}}</td>
                                                                    </tr>
                                                                    <!-- //한줄반복 끝 -->
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <!-- //1. 조회 내역이 있을때 - 끝 -->
                                                        </div><!-- //list-scroll-wrap -->
                                                        <h2 class="steps-tit steps-tit-m">가상머신은 순서대로 이동됩니다.</h2>
                                                        <h2 class="steps-tit steps-tit-m" v-if="systemProperties.symphonyPowerControll === true">심포니 호스트 전원관리가 활성화 되어 있습니다. 가상머신이 없는 호스트는 전원 관리됩니다.</h2>
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
                                <button class="btn-c-modal btn-cancel" @click="closeModal('reorderVm')">취소</button>
                                <button class="btn-c-modal" @click="relocateVms()">확인</button>
                            </div>
                        </div> <!-- //c-modal-footer -->
                    </div>
                </section>
            </div>
        </div>
        <!-- //reorder karayanModal -->
    </div>
</div>
<!-- //cont-wrap -->

<script src="/js/castanets/karajan/karajan.js" type="text/javascript"></script>