<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<div class="cont-wrap" id="templates">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner" v-show="!spinnerOn">
        <div class="doc-list-wrap">
            <div class="doc-tit">
                <h2 class="tit"><a href="/compute/templates">템플릿</a></h2>
                <p class="location">컴퓨팅 &gt; <a href="/compute/templates">템플릿</a></p>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-refresh btn-tooltip"
                                @click="retrieveTemplates('update')">
                            새로고침
                        </button>
                        <div class="c-tooltip top-right">
                            <div class="c-tooltip-inner"></div>
                            <span class="c-tooltip-arrow"></span>
                            <span class="txt">새로고침</span>
                        </div>
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
                                    <col style="width: 6%; min-width: 120px;">
                                    <col style="width: 6%; min-width: 100px;">
                                    <col style="width: 9%; min-width: 121px;">
                                    <col style="width: 8%; min-width: 102px;">
                                    <col style="width: 5%; min-width: 102px;">
                                    <col style="width: 6%; min-width: 80px;">
                                </colgroup>
                                <tbody>
                                <th>상태</th>
                                <th class="txt-left" style="padding-left:3.5%;">이름</th>
                                <th>버전</th>
                                <th>설명</th>
                                <th>생성일자</th>
                                <th>클러스터</th>
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
                                        <col style="width: 6%; min-width: 120px;">
                                        <col style="width: 6%; min-width: 100px;">
                                        <col style="width: 9%; min-width: 121px;">
                                        <col style="width: 8%; min-width: 102px;">
                                        <col style="width: 5%; min-width: 102px;">
                                        <col style="width: 6%; min-width: 80px;">
                                    </colgroup>
                                    <tbody>
                                    <tr v-if="templates.length === 0">
                                        <td colspan="12">생성된 템플릿이 없습니다.</td>
                                    </tr>
                                    <tr v-if="templates.length > 0" v-for="(template, idx) in pagingVo.viewList">
                                        <td>
                                            <!-- 아이콘 정리 -->
                                            <div class="icoStat-box" v-if="template.status === 'ok'">
                                                <span class="icoStat ico-up btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">OK</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'locked'">
                                                <span class="icoStat ico-locked btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">잠금</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'powering_up'">
                                                <span class="icoStat ico-waiting btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">작업 중</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'powering_down'">
                                                <span class="icoStat ico-ingdown btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">내려가는 중</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'not_responding'">
                                                <span class="icoStat ico-unknown btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">응답 없음</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'unknown'">
                                                <span class="icoStat ico-help btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">알수 없음</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'suspended'">
                                                <span class="icoStat ico-suspended btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">일시정지</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'down'">
                                                <span class="icoStat ico-down btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">내려감</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box"
                                                 v-else-if="template.status === 'reboot_in_progress'">
                                                <span class="icoStat ico-reboot btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">재부팅 중</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'wait_for_launch'">
                                                <span class="icoStat ico-refresh btn-tooltip"></span>
                                                <div class="c-tooltip j-right">
                                                    <span class="c-tooltip-arrow"></span>
                                                    <span class="txt">기동준비</span>
                                                </div>
                                            </div>
                                            <div class="icoStat-box" v-else-if="template.status === 'saving_state'">
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
                                        <td class="txt-left"><a :href="'/compute/template?id=' + template.id">{{template.name}}</a>
                                        </td>
                                        <td>{{template.version}}</td>
                                        <td>{{template.description | truncate(20)}}</td>
                                        <td>{{template.creationTime}}</td>
                                        <td><a :href="'/compute/cluster?id=' + template.cluster.id"
                                               v-if="template.cluster != null">{{template.cluster.name |
                                            truncate(20)}}</a></td>
                                        <td>
                                            <div class="list-popbtn-wrap">
                                                <button type="button" class="btn-openPop"
                                                        @click="selectTemplate(template)"></button>
                                                <div class="openPop-target scrollBodyY"
                                                     :class="{ 'last-posBtm' : template.idxFlag}">
                                                    <!-- 아래서부터 3줄만 클래스 last-posBtm 추가 -->
                                                    <div class="openPop-target_inner">
                                                        <ul>
                                                            <li>
                                                                <button @click="openModal('update')"
                                                                        :disabled="selectedTemplates.length == 0">
                                                                    <span class="ico ico-edit"></span>편집
                                                                </button>

                                                            </li>
                                                            <li>
                                                                <button @click="openModal('delete')"
                                                                        :disabled="selectedTemplates.length == 0">
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
                        </div><!-- //list-scroll-wrap -->
                    </div>
                </div>
            </div>
            <!-- //doc-list-body -->
            <pagination-component :dataList="templates" :size="10" v-on:setViewList="setViewList"></pagination-component>
        </div>
        <!-- //doc-list-wrap -->

        <!-- deleteTempalteModal -->
        <div class="alert-dim" id="deleteTemplateModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
            <div class="alertBox">
                <div class="alert-wrap">
                    <div class="alert-body" v-if="selectedTemplates.length != 0">
                        <p>템플릿 {{selectedTemplates[0].name }} 를 삭제하시겠습니까?</p>
                    </div>
                    <div class="alert-footer">
                        <div class="alert-btnBox">
                            <button class="btn-alert-foot" @click="closeModal('delete')">취소</button>
                            <button class="btn-alert-foot btn-alert-primary" @click="removeTemplate()">확인</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- //deleteTempalteModal -->

        <!-- template export modal -->
        <%--        <div class="modal fade exporttemplatemodal" tabindex="-1" role="dialog" aria-hidden="true">--%>
        <%--            <div class="modal-dialog modal-lg" style="max-width: 512px">--%>
        <%--                <div class="modal-content">--%>
        <%--                    <div class="modal-header">--%>
        <%--                        <button type="button" class="close" data-dismiss="modal">--%>
        <%--                            <span aria-hidden="true">×</span>--%>
        <%--                        </button>--%>
        <%--                        <h4 class="modal-title" id="myModalLabel">템플릿 내보내기</h4>--%>
        <%--                    </div>--%>
        <%--                    <div class="modal-body">--%>
        <%--                        <div class="row">--%>
        <%--                            <div class="form-group">--%>
        <%--                                <div class="col-md-12 col-sm-12 col-xs-12">--%>
        <%--                                    <div class="checkbox">--%>
        <%--                                        <label> <input type="checkbox" v-model="forceOverride"> 강제 적용</label>--%>
        <%--                                    </div>--%>
        <%--                                </div>--%>
        <%--                            </div>--%>
        <%--                            <div class="form-group" v-if="template.exist">--%>
        <%--                                <div class="col-md-12 col-sm-12 col-xs-12">--%>
        <%--                                    템플릿 {{template.name}} 은/는 이미 내보내기 도메인에 존재합니다.<br/>--%>
        <%--                                    덮어쓰기하려면, '강제 적용' 체크박스에 표시하십시오.--%>
        <%--                                </div>--%>
        <%--                            </div>--%>
        <%--                        </div>--%>
        <%--                    </div>--%>
        <%--                    <div class="modal-footer">--%>
        <%--                        <button type="button" class="btn btn-primary"--%>
        <%--                                :disabled="template.exist == true && forceOverride == false" @click="exportTemplate()">--%>
        <%--                            확인--%>
        <%--                        </button>--%>
        <%--                        <button type="button" class="btn btn-default" data-dismiss="modal">취소</button>--%>
        <%--                    </div>--%>
        <%--                </div>--%>
        <%--            </div>--%>
        <%--        </div>--%>

    </div>
    <!-- //cont-wrap -->
</div>

<!-- updateTemplateModal -->
<div class="right_col" role="main" id="templateEditInfo">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox" v-show="!spinnerOn" id="templateUpdateModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        <div class="modalBox-inner">
            <section class="c-modal-wrap">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1>템플릿 편집</h1>
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
                                    <button type="button" class="btn-step" id="upStep2" @click="clickStep(2)">시스템
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="btn-step" id="upStep3" @click="clickStep(3)">호스트
                                    </button>
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
                                        <p class="tit">기반 템플릿 </p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="templateEditInfo.name" disabled>
                                        </div>
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
                                            <input type="text" class="input-custom" v-model="templateEditInfo.name" :disabled="templateEditInfo.subName != 'base version'"
                                                   @input="checkTemplateName" placeholder="이름" :maxlength="this.$maxName">
                                        </div>
                                        <p class="errTxt" v-if="(templateNameStatus || validTemplateName)">4~20자 영문, 숫자와
                                            특수기호(_),(-)만 사용 가능합니다.</p>
                                        <!-- 에러없으면 p태그 자체를 삭제 -->
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">하위 버전 이름</p>
                                        <input type="text" class="input-custom" v-if="templateEditInfo.subName != 'base version'" @input="checkSubTemplateName" v-model="templateEditInfo.subName" :maxlength="this.$maxName">
                                        <input type="text" class="input-custom" v-if="templateEditInfo.subName == 'base version'" value="base version" disabled>
                                        <p class="errTxt" v-if="(subTemplateNameStatus || validSubTemplateName)">4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">설명</p>
                                        <input type="text" class="input-custom" v-model="templateEditInfo.description"
                                               placeholder="설명입력" :maxlength="this.$maxDescription">
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
                                                :disabled="!templateEditInfo.bootImageUse || selectVo.selBootImgVo.selected.id == 'none'"
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
                                <div class="frmSet">
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
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">콘솔 분리 작업</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" value="화면 잠금" disabled>
                                        </div>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">모니터</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="templateEditInfo.monitors"
                                                   disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet mb-20">
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
                                                    <input type="checkbox" v-model="templateEditInfo.customMigrationUsed">
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
                                        <selectbox-component :disabled="!templateEditInfo.customMigrationUsed"
                                                             :title="'cusMigration'" :selectvo="selectVo.selCustomMigVo"
                                                             :index="10017" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <div class="tooltipM-wrap">
                                            <p class="tit">
                                                <label class="ui-check mr-0"> 사용자 정의 마이그레이션 다운 타임 사용
                                                    <input :disabled="!templateEditInfo.customMigrationUsed"
                                                           type="checkbox"
                                                           v-model="templateEditInfo.customMigrationDowntimeUsed">
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
                                            <input :disabled="!templateEditInfo.customMigrationDowntimeUsed || !templateEditInfo.customMigrationUsed" type="text"
                                                   class="input-custom" v-model="templateEditInfo.customMigrationDowntime">
                                        </div>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">마이그레이션 자동 통합 </p>
                                        <selectbox-component
                                                :disabled="!templateEditInfo.customMigrationUsed"
                                                :title="'autoConverge'" :selectvo="selectVo.selAutoConVo" :index="10018"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">마이그레이션 압축 활성화</p>
                                        <selectbox-component
                                                :disabled="!templateEditInfo.customMigrationUsed"
                                                :title="'compressed'" :selectvo="selectVo.selCompVo" :index="10019"
                                                v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit">
                                        <p class="tit">
                                            <label class="ui-check"> 호스트 CUP 통과
                                                <input type="checkbox" :disabled="templateEditInfo.affinity != 'pinned'">
                                                <!-- 비활성화는 속성 disabled 추가/삭제 -->
                                                <span class="chk-ico"></span>
                                            </label>
                                        </p>
                                    </div>
                                </div>
                                <!-- //마이그레이션 옵션 영역 끝 -->
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
                                <div class="frmSet" v-if="templateEditInfo.useCloudInit">
                                    <div class="frm-unit">
                                        <p class="tit">가상머신 호스트 이름</p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" v-model="templateEditInfo.hostName">
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
                                            <textarea class="full-textarea scroll-css" v-model="templateEditInfo.customScript"
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
                                            <input type="text" class="input-custom" v-model="templateEditInfo.cpuShare"
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
                                                <input type="checkbox" v-model="templateEditInfo.memoryBalloon">
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
                                                    <input type="checkbox" v-model="templateEditInfo.virtioScsiEnabled">
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
                            <button class="btn-c-modal btn-cancel" @click="closeModal('update')">취소</button>
                            <button class="btn-c-modal" v-show="isUpdateStep(0)" @click="nextStep(1)">다음</button>
                            <button class="btn-c-modal" v-show="!isUpdateStep(0)"
                                    :disabled="(templateNameStatus || validTemplateName)" @click="updateTemplate()"
                                    style="margin-right: 12px;">확인
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
<!-- //updateTemplateModal -->

<script src="/js/castanets/compute/templates.js" type="text/javascript"></script>
<script src="/js/castanets/compute/updateTemplate.js" type="text/javascript"></script>