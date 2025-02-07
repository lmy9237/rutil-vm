<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>


<!-- page content -->
<div class="cont-wrap" id="clustersVue">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="cont-inner" v-show="!spinnerOn">
        <div class="doc-list-wrap">
            <div class="doc-tit">
                <h2 class="tit"><a href="/compute/clusters">클러스터</a></h2>
                <p class="location">컴퓨팅 &gt; <a href="/compute/clusters">클러스터</a></p>
                <div class="btnSet-right">
                    <div class="btn-box">
                        <button type="button" class="btn-icon btn-icon-refresh btn-tooltip"
                                @click="retrieveClusters('update')">
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
            </div>
            <div class="doc-list-body scrollBodyX">
                <div class="doc-list-inner">
                    <div class="list-tot" style="min-width: 1240px;">
                        <div class="list-fix-wrap">
                            <table>
                                <caption></caption>
                                <colgroup>
                                    <col style="width: 3%; min-width: 40px;">
                                    <col style="width: 9%; min-width: 120px;">
                                    <col style="width: 7.5%; min-width: 100px;">
                                    <col style="width: 5%; min-width: 121px;">
                                    <col style="width: 5%; min-width: 102px;">
                                    <col style="width: 6%; min-width: 80px;">
                                </colgroup>
                                <tbody>
                                <th>이름</th>
                                <th>설명</th>
                                <th>CPU 유형</th>
                                <th>호스트</th>
                                <th>가상머신 수</th>
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
                                        <col style="width: 9%; min-width: 120px;">
                                        <col style="width: 7.5%; min-width: 100px;">
                                        <col style="width: 5%; min-width: 121px;">
                                        <col style="width: 5%; min-width: 102px;">
                                        <col style="width: 6%; min-width: 80px;">
                                    </colgroup>
                                    <tbody>
                                    <tr v-if="clusters.length === 0">
                                        <td colspan="12">생성된 클러스터가 없습니다.</td>
                                    </tr>
                                    <tr v-if="clusters.length > 0" v-for="(cluster, idx) in pagingVo.viewList">
                                        <td><a :href="'/compute/cluster?id=' + cluster.id">{{cluster.name}}</a></td>
                                        <td>{{cluster.description}}</td>
                                        <td>{{cluster.cpuType}}</td>
                                        <td>{{cluster.hostCnt}}</td>
                                        <td>{{cluster.vmCnt}}</td>
                                        <td>
                                            <div class="list-popbtn-wrap">
                                                <button type="button" class="btn-openPop"
                                                        @click="selectCluster(cluster, idx)"></button>
                                                <div class="openPop-target scrollBodyY"
                                                >
                                                    <!-- 아래서부터 3줄만 클래스 last-posBtm 추가 -->
                                                    <div class="openPop-target_inner">
                                                        <ul>
                                                            <li>
                                                                <button @click="openModal('update')"
                                                                        :disabled="selectedClusters.length!=1">
                                                                    <span class="ico ico-edit"></span>편집
                                                                </button>

                                                            </li>
                                                            <li>
                                                                <button @click="openModal('delete')"
                                                                        :disabled="selectedClusters.length!=1">
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
            <pagination-component :dataList="clusters" :size="10" v-on:setViewList="setViewList"></pagination-component>
        </div>
        <!-- //doc-list-wrap -->

        <!-- deleteVmModal -->
        		<div class="alert-dim" id="deleteClusterModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        			<div class="alertBox">
        				<div class="alert-wrap">
        					<div class="alert-body" v-if="selectedClusters.length != 0">
        						<p>클러스터 {{selectedClusters[0].name}} 를 삭제하시겠습니까?</p>
        					</div>
        					<div class="alert-footer">
        						<div class="alert-btnBox">
        							<button class="btn-alert-foot" @click="closeModal('delete')">취소</button>
        							<button class="btn-alert-foot btn-alert-primary" @click="removeCluster()">확인</button>
        						</div>
        					</div>
        				</div>
        			</div>
        		</div>
        <!-- //deleteVmModal -->


    </div>
    <!-- //cont-wrap -->


</div>
<!-- /page content -->

<!-- createClusterModal -->
<div class="right_col" role="main" id="createClusterVue">
    <v-spinner v-show="spinnerOn"></v-spinner>
    <div class="modalBox" v-show="!spinnerOn" id="clusterModal"> <!-- 보이기/안보이기 : 클래스 active 추가/삭제 -->
        <div class="modalBox-inner">
            <section class="c-modal-wrap">
                <div class="c-modal-inner">
                    <div class="c-modal-header">
                        <h1 v-if="!isUpdate">새 클러스터</h1>
                        <h1 v-if="isUpdate">클러스터 편집</h1>
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
                                        <p class="tit">이름 <span class="mustbe"></span></p>
                                        <div class="inputBox">
                                            <input type="text" class="input-custom" placeholder="이름" v-model="cluster.name" @input="checkClusterName" :maxlength="this.$maxName">
                                        </div>
                                        <p class="errTxt" v-if="(clusterNameStatus || cluster.name == '')">4~20자 영문, 숫자와
                                            특수기호(_),(-)만 사용 가능합니다.</p>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">설명</p>
                                        <input type="text" class="input-custom" v-model="cluster.description" placeholder="설명입력">
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">CPU 아키텍처</p>
                                        <selectbox-component :title="'cpuArc'" :selectvo="selectVo.selCpuArcVo" :disabled="isUpdate"
                                                             :index="10002" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">CPU 유형</p>
                                        <selectbox-component :title="'cpuType'" :selectvo="selectVo.selCpuTypeVo"
                                                             :index="10003" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">스위치 유형</p>
                                        <selectbox-component :title="'switchType'" :selectvo="selectVo.selSwitchTypeVo" :disabled="isUpdate"
                                                             :index="10004" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">방화벽 유형</p>
                                        <selectbox-component :title="'firewall'" :selectvo="selectVo.selFireTypeVo"
                                                             :index="10005" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                                <div class="frmSet">
                                    <div class="frm-unit half-left">
                                        <p class="tit">관리 네트워크</p>
                                        <selectbox-component :title="'network'" :selectvo="selectVo.selNetworkVo" :disabled="isUpdate"
                                                             :index="10001" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                    <div class="frm-unit half-right">
                                        <p class="tit">기본 네트워크 공급자</p>
                                        <selectbox-component :title="'networkProvider'" :selectvo="selectVo.selNetProviderVo"
                                                             :index="10006" v-on:setselected="setSelected">
                                        </selectbox-component>
                                    </div>
                                </div>
                            </div><!-- //c-modal-body_inner -->
                        </div><!-- //steps-cont-wrap -->
                    </div><!-- //c-modal-body -->
                    <!--  //btn-step 일반 -->

                    <div class="c-modal-footer">
                        <div class="buttonSet">
                            <button class="btn-c-modal btn-cancel" @click="closeModal('cluster')">취소</button>
                            <button class="btn-c-modal" v-if="!isUpdate" :disabled="(clusterNameStatus || cluster.name == '')" @click="createCluster()">확인
                            </button>
                            <button class="btn-c-modal" v-if="isUpdate" :disabled="(clusterNameStatus || cluster.name == '')" @click="updateCluster()"
                                    style="margin-right: 12px;">확인
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
<!-- //createHostModal -->

<script src="/js/castanets/compute/clusters.js" type="text/javascript"></script>
<script src="/js/castanets/compute/createCluster.js" type="text/javascript"></script>