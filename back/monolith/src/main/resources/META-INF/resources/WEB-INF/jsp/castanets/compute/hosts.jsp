<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>


<!-- page content -->
<div class="cont-wrap" id="hostsVue">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner" v-show="!spinnerOn">
        <div class="doc-list-wrap">
            <div class="doc-tit">
                <h2 class="tit"><a href="/compute/hosts">호스트</a></h2>
                <p class="location">컴퓨팅 &gt; <a href="/compute/hosts">호스트</a></p>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-refresh btn-tooltip"
                                @click="retrieveHosts('update')">
                            새로고침
                        </button>
                        <div class="c-tooltip top-right">
                            <div class="c-tooltip-inner"></div>
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">새로고침</span>
                        </div>
                    </div>
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-new btn-tooltip" @click="openModal('create')">등록
                        </button>
                        <div class="c-tooltip top-right">
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">등록</span>
                        </div>
                    </div>
                </div>
                <div class="changeStatBox">
                    <button class="btn-stat-chg">상태값 변경</button>
                    <div class="target-stat-chg">
                        <button :disabled = "!isPosibleStart()" @click="!isPosibleStart() ? '' : startHost()" class="btn-chg-stat play">실행</button>
                        <button :disabled = "!isPosibleStop()" @click="!isPosibleStop() ? '' : stopHost()" class="btn-chg-stat stop">종료</button>
                        <button :disabled ="!isPosibleRestart()" @click="!isPosibleRestart() ? '' : restartHost()" class="btn-chg-stat reboot">재부팅</button>
                    </div>
                </div>
            </div>
            <div class="doc-list-body scrollBodyX">
                <div class="doc-list-inner">
                    <div class="list-tot" style="min-width: 1240px;">
                        <div class="list-fix-wrap">
                            <table>
                                <caption></caption>
                                <colgroup>
                                    <col style="width: 3%; min-width: 40px;">
                                    <col style="width: 3%; min-width: 110px;">
                                    <col style="width: 9%; min-width: 120px;">
                                    <col style="width: 7.5%; min-width: 100px;">
                                    <col style="width: 9%; min-width: 121px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 8%; min-width: 101px;">
                                    <col style="width: 6%; min-width: 80px;">
                                    <col style="width: 6%; min-width: 103px;">
                                    <col style="width: 8%; min-width: 100px;">
                                    <col style="width: 9%; min-width: 120px;">
                                </colgroup>
                                <tbody>
                                    <th>
                                        <label class="ui-check">
                                            <input type="checkbox" v-model="selectAll">
                                            <span class="chk-ico"></span>
                                        </label>
                                    </th>
                                    <th>상태</th>
                                    <th>이름</th>
                                    <th>설명</th>
                                    <th>IP</th>
                                    <th>클러스터</th>
                                    <th>가상머신 수</th>
                                    <th>CPU</th>
                                    <th>메모리</th>
                                    <th>네트워크</th>
                                    <th>작업</th>
                                </tbody>
                            </table>
                        </div><!-- //list-fix-wrap -->
                        <div class="list-scroll-wrap scrollBodyY">
                            <div class="list-scroll-cont">
                                <table>
                                    <caption></caption>
                                    <colgroup>
                                        <col style="width: 3%; min-width: 40px;">
                                        <col style="width: 3%; min-width: 110px;">
                                        <col style="width: 9%; min-width: 120px;">
                                        <col style="width: 7.5%; min-width: 100px;">
                                        <col style="width: 9%; min-width: 121px;">
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 8%; min-width: 101px;">
                                        <col style="width: 6%; min-width: 80px;">
                                        <col style="width: 6%; min-width: 103px;">
                                        <col style="width: 8%; min-width: 100px;">
                                        <col style="width: 9%; min-width: 120px;">
                                    </colgroup>
                                    <tbody>
                                    <tr v-if="hosts.length === 0">
                                        <td colspan="12">생성된 호스트가 없습니다.</td>
                                    </tr>
                                    <tr v-if="hosts.length > 0" v-for="(host, idx) in pagingVo.viewList">
                                        <td>
                                            <label class="ui-check">
                                                <input type="checkbox" :id="host.name" :value="host" v-model="selectedHosts">
                                                <span class="chk-ico"  @click="selectHost(host, idx)"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div class="icoStat-box" v-if="host.status === 'up'">
                                                <span class="icoStat ico-up btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">완료</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'connecting'">
                                                <span class="icoStat ico_connect btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">연결</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'down'">
                                                <span class="icoStat ico-down btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">내려감</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'initializing'">
                                                <span class="icoStat ico-initializ btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">초기화 중</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'install_failed'">
                                                <span class="icoStat ico-install-fail btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">설치 실패</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'installing'">
                                                <span class="icoStat ico-install btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">설치 중</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'installing_os'">
                                                <span class="icoStat ico-install btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">os 설치 중</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'maintenance'">
                                                <span class="icoStat ico-sm btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">유지보수</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'preparing_for_maintenance'">
                                                <span class="icoStat ico-sming btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">유지보수 준비</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'non_operational'">
                                                <span class="icoStat ico-suspended btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">작동 중지</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'non_responsive'">
                                                <span class="icoStat ico-unknown btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">응답 없음</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'unassigned'">
                                                <span class="icoStat ico-defaultroot btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">할당되지 않음</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'reboot'">
                                                <span class="icoStat ico-reboot btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">재부팅 중</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'kdumping'">
                                                <span class="icoStat ico-defaultroot btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">커널 충돌</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="host.status === 'pending_approval'">
                                                <span class="icoStat ico-defaultroot btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">승인 불가</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else>
                                                <span class="icoStat ico-noinfo btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">에러</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-if="host.haConfigured">
                                                <span class="icoStat ico-crown btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">호스트 엔진</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td><a :href="'/compute/host?id=' + host.id">{{host.name}}</a></td>
                                        <td>{{host.comment}}</td>
                                        <td>{{host.address}}</td>
                                        <td>{{host.clusterName}}</td>
                                        <td>{{host.vmsCnt}}</td>
                                        <td>{{ (host.hostLastUsage == null || host.hostLastUsage == undefined ||
                                            host.hostLastUsage.cpuUsagePercent == null ) ? '0' :
                                            host.hostLastUsage.cpuUsagePercent}}%
                                        </td>
                                        <td>{{ (host.hostLastUsage == null || host.hostLastUsage == undefined ||
                                            host.hostLastUsage.memoryUsagePercent == null ) ? '0' :
                                            host.hostLastUsage.memoryUsagePercent}}%
                                        </td>
                                        <td>{{totalNicsUsage(host.hostNicsLastUsage)}}%</td>
                                        <td>
                                            <div class="list-popbtn-wrap">
                                                <button type="button" class="btn-openPop"
                                                        @click="targetHostFun(host)"></button>
                                                <div class="openPop-target scrollBodyY"
                                                     >
                                                    <!-- 아래서부터 3줄만 클래스 last-posBtm 추가 -->
                                                    <div class="openPop-target_inner">
                                                        <ul class="first">
                                                            <li>
                                                                <button @click="openModal('update')">
                                                                    <span class="ico ico-edit"></span>편집
                                                                </button>

                                                            </li>
                                                            <li>
                                                                <button @click="openModal('delete')"
<%--                                                                        :disabled="!isPosibleDelete()">--%>
                                                                        :disabled="!(selTargetHost.status == 'maintenance' || selTargetHost.status == 'install_failed' || selTargetHost.status == 'non_operational' || selTargetHost.status == 'non_responsive')">
                                                                    <span class="ico ico-del"></span>삭제
                                                                </button>
                                                            </li>
                                                        </ul>
                                                        <ul>
                                                            <li>
                                                                <button @click="maintenanceStart()"
<%--                                                                        :disabled ="!isPosibleMaintenance()">--%>
                                                                        :disabled ="!(selTargetHost.status == 'up' || selTargetHost.status == 'install_failed' || selTargetHost.status == 'non_operational' || selTargetHost.status == 'non_responsive')">
                                                                    <span class="ico ico-sm"></span>유지보수
                                                                </button>
                                                            </li><!-- 버튼 비활성화(클릭막기) : 속성 disabled -->
                                                            <li>
                                                                <button @click="maintenanceStop()"
<%--                                                                        :disabled=" !isPosibleActive()">--%>
                                                                        :disabled=" selTargetHost.status !== 'maintenance'">
                                                                    <span class="ico ico-activation"></span>활성
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button @click="goHostConsole()">
                                                                    <span class="ico ico-hostconsole"></span>호스트콘솔
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
                        </div><!-- //list-scroll-wrap -->
                    </div>
                </div>
            </div>
            <!-- //doc-list-body -->
            <pagination-component :dataList="hosts" :size="10" v-on:setViewList="setViewList"></pagination-component>
        </div>
        <!-- //doc-list-wrap -->

        <!-- deleteHostModal -->
        		<div class="alert-dim" id="deleteHostModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        			<div class="alertBox">
        				<div class="alert-wrap">
        					<div class="alert-body" v-if="selTargetHost !== ''">
        						<p>호스트 {{selTargetHost.name}} 를 삭제하시겠습니까?</p>
        					</div>
        					<div class="alert-footer">
        						<div class="alert-btnBox">
        							<button class="btn-alert-foot" @click="closeModal('delete')">취소</button>
        							<button class="btn-alert-foot btn-alert-primary" @click="removeHost()">확인</button>
        						</div>
        					</div>
        				</div>
        			</div>
        		</div>
        <!-- //deleteHostModal -->
    </div>
    <!-- //cont-wrap -->
</div>
<!-- /page content -->

<!-- createHostModal -->
<div class="right_col" role="main" id="createHostVue">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox" v-show="!spinnerOn" id="hostModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        <div class="modalBox-inner">
            <section class="c-modal-wrap">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1 v-if="!isUpdate">새 호스트</h1>
                        <h1 v-if="isUpdate">호스트 편집</h1>
                        <p class="mustbeTxt">표시 항목( <span class="mustbe"></span> ) 은 필수 입력 항목입니다. </p>
                        <div class="steps-wrap">
                            <ul>
                                <li>
                                    <button type="button" class="btn-step" id="step0">일반 <span
                                            class="mustbe"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div><!-- //c-modal-header -->
                    <!-- btn-step 일반 -->
                    <div class="c-modal-body scroll-css">
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
                                        <p class="tit">이름 <span class="mustbe"></span></p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" placeholder="이름" v-model="host.name" @input="checkHostName" :maxlength="this.$maxName">
                                        </div>
                                        <p class="errTxt" v-if="(hostNameStatus || validHostName)">4~20자 영문, 숫자와
                                            특수기호(_),(-)만 사용 가능합니다.</p>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">호스트 주소 <span class="mustbe"></span></p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="host.ssh.address" :disabled="isUpdate" @input="checkHostAddress"
                                                   placeholder="호스트 주소" >
                                            <p class="errTxt" v-if="addressStatus">호스트 주소를 입력해 주시기 바랍니다.</p>
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">SSH 포트</p>
                                        <div class="inputBox">
                                            <input type="number" class="input-custom" placeholder="SSH 포트" v-model="host.ssh.port" :disabled="isUpdate" >
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">설명</p>
                                        <input type="text" class="input-custom" v-model="host.comment" placeholder="설명입력">
                                    </div>
                                </div>
                                <h2 class="steps-tit steps-tit-m">인증</h2>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">사용자 ID</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" placeholder="사용자 ID" v-model="host.ssh.id" disabled>
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right" v-if="!isUpdate">
                                        <p class="tit">암호 <span class="mustbe"></span></p>
                                        <div class="inputBox">
                                            <input type="password" class="input-custom" placeholder="사용자 암호" v-model="host.ssh.password" @input="checkHostPassword">
<%--                                            <p class="errTxt" v-if="(validPwd || pwdStatus)">최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수문자를 포함해주시기 바랍니다.</p>--%>
                                        </div>
                                    </div>
                                </div>
                                <h2 class="steps-tit steps-tit-m"  v-if="!isUpdate">호스트 엔진</h2>
                                <div class="frmSet">
                                    <div class="frm-unit" v-if="!isUpdate">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> 호스트 엔진 여부
                                                    <input type="checkbox" v-model="host.hostEngineEnabled">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <h2 class="steps-tit steps-tit-m">전원관리</h2>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> 전원 관리 활성
                                                    <input type="checkbox" v-model="powerManagementEnabled">
                                                    <span class="chk-ico"></span>
                                                </label>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="frmSet" v-if="host.powerManagementEnabled">
                                    <h2 class="steps-tit steps-tit-m">전원관리 에이전트</h2>
                                    <div class="flex-rBtnBox">
                                        <div class="btn-box">
                                            <button class="btn-square btn-icon-plus btn-tooltip" @click="openModal('agent')">
                                                추가
                                            </button>
                                            <div class="c-tooltip top-right">
                                                <div class="c-tooltip-inner"></div>
                                                <span class="c-tooltip-arrow"></span>
                                                <span class="txt">추가</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="frm-unit">
                                        <div class="doc-list-wrap">
                                            <div class="doc-list-body">
                                                <div class="doc-list-inner">
                                                    <div class="list-tot">
                                                        <div class="list-fix-wrap">
                                                            <table>
                                                                <caption></caption>
                                                                <colgroup>
                                                                    <col style="width: 100px;">
                                                                    <col style="width: 200px;">
                                                                    <col style="width: 200px;">
                                                                    <col style="width: auto;">
                                                                </colgroup>
                                                                <tbody>
                                                                <th>타입</th>
                                                                <th>주소</th>
                                                                <th>사용자명</th>
                                                                <th>삭제</th>
                                                                </tbody>
                                                            </table>
                                                        </div><!-- //list-fix-wrap -->

                                                        <div class="list-scroll-wrap scrollBodyY">
                                                            <!-- 1. 조회 내역이 있을때 - 시작 -->
                                                            <div class="list-scroll-cont">
                                                                <table>
                                                                    <caption></caption>
                                                                    <colgroup>
                                                                        <col style="width: 100px;">
                                                                        <col style="width: 200px;">
                                                                        <col style="width: 200px;">
                                                                        <col style="width: auto;">
                                                                    </colgroup>
                                                                    <tbody>
                                                                    <!-- 한줄반복 시작 -->
                                                                    <tr v-if="host.fenceAgent != null && host.fenceAgent.address != ''">
                                                                        <td>{{host.fenceAgent.type}}</td>
                                                                        <td>{{host.fenceAgent.address}}</td>
                                                                        <td>{{host.fenceAgent.username}}</td>
                                                                        <td>
                                                                            <div class="btn-box" style="margin-left: 45px;">
                                                                                <button class="btn-square btn-icon-minus btn-tooltip"
                                                                                        @click="removeFanceAgent(index)">삭제
                                                                                </button>
                                                                                <div class="c-tooltip top-right">
                                                                                    <div class="c-tooltip-inner"></div>
                                                                                    <span class="c-tooltip-arrow"></span>
                                                                                    <span class="txt">삭제</span>
                                                                                </div>
                                                                            </div>
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

                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 일반 -->

                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('host')">취소</button>
                            <button class="btn-c-modal" v-if="!isUpdate" :disabled="(hostNameStatus || validHostName || addressStatus )" @click="createHost()">확인
                            </button>
                            <button class="btn-c-modal" v-if="isUpdate" :disabled="(hostNameStatus || validHostName || addressStatus )" @click="updateHost()"
                                    style="margin-right: 12px;">확인
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>

    <!-- fenceAgentModal -->
    <div class="modalBox" id="fenceAgentModal">
        <div class="modalBox-inner">
            <section class="c-modal-wrap c-modal-auto">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1>전원관리 에이전트 추가</h1>
                    </div>
                    <div class="c-modal-body">
                        <div class="c-modal-body_inner pt-40">
                            <div class="frmSet">
                                <div class="frm-unit half-left">
                                    <p class="tit">주소<span class="mustbe"></span></p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="주소 입력"
                                               v-model="fenceAgent.address" >
                                    </div>
                                    <p class="errTxt" >주소를 입력해주세요.</p>
                                    <!-- 에러없으면 p태그 자체를 삭제 -->
                                </div>
                                <div class="frm-unit half-right">
                                    <p class="tit">사용자 이름<span class="mustbe"></span></p>
                                    <div class="inputBox">
                                        <input type="text" class="input-custom" placeholder="이름 입력"
                                               v-model="fenceAgent.username" >
                                    </div>
                                    <p class="errTxt" >사용자이름을 입력해주세요.</p>
                                    <!-- 에러없으면 p태그 자체를 삭제 -->
                                </div>
                            </div>
                            <div class="frmSet">
                                <div class="frm-unit half-left">
                                    <p class="tit">암호 <span class="mustbe"></span></p>
                                    <div class="inputBox">
                                        <input type="password" class="input-custom" placeholder="사용자 암호" v-model="fenceAgent.password" >
                                        <%--                                            <p class="errTxt" v-if="(validPwd || pwdStatus)">최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수문자를 포함해주시기 바랍니다.</p>--%>
                                    </div>
                                </div>
                                <div class="frm-unit half-right">
                                    <p class="tit">유형 <span class="mustbe"></span></p>
                                    <selectbox-component :title="'fenceType'" :selectvo="selectVo.selFenceTypeVo"
                                                         :index="10002" v-on:setselected="setSelected">
                                    </selectbox-component>
                                </div>
                            </div>
                        </div>
                    </div> <!-- //c-modal-body -->
                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('agent')">취소</button>
                            <button class="btn-c-modal" @click="addFenceAgent()">확인
                            </button>
                        </div>
                    </div> <!-- //c-modal-footer -->
                </div>
            </section>
        </div>
    </div>
    <!-- //fenceAgentModal -->
</div>
<!-- //createHostModal -->

<script src="/js/castanets/compute/hosts.js" type="text/javascript"></script>
<script src="/js/castanets/compute/createHost.js" type="text/javascript"></script>
