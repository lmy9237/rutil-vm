<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<script type="text/javascript">
    $(document).ready(function(){
        let selectNetwork =  sessionStorage.getItem('selectNetwork');
        selectNetwork = decodeURI(selectNetwork);
        selectNetwork = JSON.parse(selectNetwork);

        // console.log("selectNetwork" , selectNetwork);

        if(selectNetwork == null) {
            window.location.href = "/network/networks";
        }

        network.networkData = selectNetwork;
        network.onload();
    });

</script>
<!-- /page content -->
<div class="cont-wrap" id="network" v-cloak>
    <div class="cont-inner long">
        <div class="doc-list-wrap">
            <div class="doc-tit">
                <h2 class="tit" v-if="networkData != null"> <a href="/network/networks">{{ networkData.name }}</a></h2>
                <p class="location"> > <a href="/network/networks">네트워크</a></p>
                <button class="btn btn-primary btn-topR" @click="goNetworks"><img src="../../../../images/btn-list.png" alt="" class="icoImg"> 목록</button>
            </div>
            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>일반</h3>
                </div>
                <div class="detail-body scrollBodyX">
                    <div class="tbl-list-wrap">
                        <table class="tbl-list">
                            <caption></caption>
<%--                            <colgroup>--%>
<%--                                <col style="width: 15.5%; max-width: 155px;">--%>
<%--                                <col style="width: 27.5%; max-width: 275px;">--%>
<%--                                <col style="width: 16%; max-width: 160px;">--%>
<%--                                <col style="width: 23%; max-width: 230px;">--%>
<%--                                <col style="width: auto; max-width: 155px;">--%>
<%--                            </colgroup>--%>
                            <thead>
                            <tr>
                                <th>network</th>
                                <th>ID</th>
                                <th>설명</th>
                                <th>가상머신 네트워크</th>
                                <th>VLAN 태그</th>
                                <th>MTU</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-if="networkData != null">
                                <td>{{networkData.name}}</td>
                                <td>{{networkData.id}}</td>
                                <td>{{networkData.description}}</td>
                                <td v-if="networkData.usage == 'VM'">true</td>
                                <td v-else>false</td>
                                <td v-if="networkData.vlan != null">{{networkData.vlan}}</td>
                                <td v-else>없음</td>
                                <td v-if="networkData.mtu != 0 && networkData.mtu != 1500 ">{{networkData.mtu}}</td>
                                <td v-else>기본값(1500)</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- //detail-unitBox -->

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>클러스터</h3>
                </div>
                <div class="detail-body scrollBodyX">
                    <div class="tbl-list-wrap" style="min-width: 1000px;">
                        <table class="tbl-list">
                            <caption></caption>
                            <thead>
                            <tr>
                                <th>이름</th>
                                <th>호환버전</th>
                                <th>연결된 네트워크</th>
                                <th>필수 네트워크</th>
                                <th>네트워크 상태</th>
                                <th>네트워크 역할</th>
                                <th>설명</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="clusterData in clusterDatas">
                                <td>{{clusterData.clusterName}}</td>
                                <td>{{clusterData.clusterVersion}}</td>

                                <td v-if="clusterData.connect"><input type="checkbox" name="connect" checked="checked" disabled></td>
                                <td v-else><input type="checkbox" name="connect" disabled></td>

                                <td v-if="clusterData.required"><input type="checkbox" name="required" checked="checked" disabled></td>
                                <td v-else><input type="checkbox" name="required" disabled></td>

                                <td v-if="clusterData.status == 'OPERATIONAL'">
                                    <div class="icoStat-box">
                                        <span class="icoStat ico-up btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">up</span>
                                        </div>
                                    </div>
                                </td>
                                <td v-else>
                                    <div class="icoStat-box">
                                        <span class="icoStat ico-down btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">down</span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <a href="javascript:void(0)" data-toggle="tooltip" v-for="data in clusterData.usages">
                                        <div class="icoStat-box" v-if="data.usage == 'MANAGEMENT'" v-bind:title="managementMessage">
                                            <span class="icoStat ico-management btn-tooltip"></span>
                                            <div class="c-tooltip j-right">
                                                <span class="c-tooltip-arrow"></span>
                                                <span class="txt">MANAGEMENT</span>
                                            </div>
                                        </div>
                                        <div class="icoStat-box" v-if="data.usage == 'DISPLAY'" v-bind:title="displayMessage">
                                            <span class="icoStat ico-display btn-tooltip"></span>
                                            <div class="c-tooltip j-right">
                                                <span class="c-tooltip-arrow"></span>
                                                <span class="txt">DISPLAY</span>
                                            </div>
                                        </div>
                                        <div class="icoStat-box" v-if="data.usage == 'MIGRATION'" v-bind:title="migrationMessage">
                                            <span class="icoStat ico-migration btn-tooltip"></span>
                                            <div class="c-tooltip j-right">
                                                <span class="c-tooltip-arrow"></span>
                                                <span class="txt">MIGRATION</span>
                                            </div>
                                        </div>
                                        <div class="icoStat-box" v-if="data.usage == 'DEFAULT_ROUTE'" v-bind:title="defaultRouteMessage">
                                            <span class="icoStat ico-defaultroot btn-tooltip"></span>
                                            <div class="c-tooltip j-right">
                                                <span class="c-tooltip-arrow"></span>
                                                <span class="txt">DEFAULT ROUTE</span>
                                            </div>
                                        </div>
                                    </a>
                                </td>
                                <td>{{clusterData.clusterDescription}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- //detail-unitBox -->

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>호스트</h3>
                </div>
                <div class="detail-body scrollBodyX">
                    <div class="tbl-list-wrap">
                        <table class="tbl-list">
                            <caption></caption>
                            <colgroup>
                                <col style="width: 5%; min-width: 120px;">
                                <col style="width: 10%; max-width: 100px;">
                                <col style="width: 12%; max-width: 120px;">
                                <col style="width: 16%; max-width: 160px;">
                                <col style="width: 10.5%; max-width: 105px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 15%; max-width: 200px;">
                                <col style="width: 15%; max-width: 200px;">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>상태</th>
                                <th>이름</th>
                                <th>클러스터</th>
                                <th>네트워크 장치 상태</th>
                                <th>비동기</th>
                                <th>네트워크 장치</th>
                                <th>속도(Mbps)</th>
                                <th>Rx(Mbps)</th>
                                <th>Tx(Mbps)</th>
                                <th>총 Rx (바이트)</th>
                                <th>총 Tx (바이트)</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="hostData in hostDatas">
                                <td>
                                    <div class="icoStat-box">
                                        <span v-if="hostData.hostStatus == 'up'" class="icoStat ico-up btn-tooltip"></span>
                                        <span v-else class="icoStat ico-down btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">{{hostData.hostStatus}}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{{hostData.hostName}}</td>
                                <td>{{hostData.hostClusterName}}</td>
                                <td >
                                    <div class="icoStat-box">
                                        <span v-if="hostData.nicStatus == 'up'" class="icoStat ico-up btn-tooltip"></span>
                                        <span v-else class="icoStat ico-down btn-tooltip"></span>
                                        <div class="c-tooltip j-right">
                                            <span class="c-tooltip-arrow"></span>
                                            <span class="txt">{{hostData.nicStatus}}</span>
                                        </div>
                                    </div>
                                </td>
                                <td></td>
                                <td>{{hostData.nicName}}</td>
                                <td v-if="hostData.nicSpeed == null">0</td>
                                <td v-else>{{hostData.nicSpeed}}</td>

                                <td v-if="hostData.dataCurrentRxBps &lt; 1">&lsaquo; 1</td>
                                <td v-else>{{hostData.dataCurrentRxBps}}</td>

                                <td v-if="hostData.dataCurrentTxBps &lt; 1">&lsaquo; 1</td>
                                <td v-else>{{hostData.dataCurrentTxBps}}</td>

                                <td>{{hostData.dataTotalRx}}</td>
                                <td>{{hostData.dataTotalTx}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- //detail-unitBox -->

            <div class="detail-unitBox">
                <div class="detail-header">
                    <h3>가상머신</h3>
                </div>
                <div class="detail-body scrollBodyX">
                    <div class="tbl-list-wrap">
                        <table class="tbl-list">
                            <caption></caption>
                            <colgroup>
                                <col style="width: 5%; min-width: 120px;">
                                <col style="width: 10%; max-width: 100px;">
                                <col style="width: 12%; max-width: 120px;">
                                <col style="width: 16%; max-width: 160px;">
                                <col style="width: 16%; max-width: 160px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 5%; max-width: 120px;">
                                <col style="width: 15%; max-width: 200px;">
                                <col style="width: 15%; max-width: 200px;">
                            </colgroup>
                            <thead>
                            <tr>
                                <th>상태</th>
                                <th>이름</th>
                                <th>클러스터</th>
                                <th>IP</th>
                                <th>FQDN</th>
                                <th>vNIC<br>상태</th>
                                <th>vNIC</th>
                                <th>vNIC Rx(Mbps)</th>
                                <th>vNIC Tx(Mbps)</th>
                                <th>총 Rx<br>(바이트)</th>
                                <th>총 Tx<br>(바이트)</th>
                            </tr>
                            </thead>
                            <tbody>
<%--                                <tr v-for="vmData in vmDatas">--%>
                                <tr v-for="vmData in pagingVo.viewList">
                                    <td>
                                        <div class="icoStat-box">
                                            <span v-if="vmData.vmStatus == 'up'" class="icoStat ico-up btn-tooltip"></span>
                                            <span v-else class="icoStat ico-down btn-tooltip"></span>
                                            <div class="c-tooltip j-right">
                                                <span class="c-tooltip-arrow"></span>
                                                <span class="txt">{{vmData.vmStatus}}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{vmData.vmName}}</td>
                                    <td>{{vmData.vmCluster}}</td>
                                    <td>{{vmData.ip}}</td>
                                    <td>{{vmData.fqdn}}</td>
                                    <td>
                                        <div class="icoStat-box">
                                            <span v-if="vmData.linked == 'true'" class="icoStat ico-up btn-tooltip"></span>
                                            <span v-else class="icoStat ico-down btn-tooltip"></span>
                                            <div class="c-tooltip j-right">
                                                <span class="c-tooltip-arrow"></span>
                                                <span class="txt">{{vmData.linked == 'true' ? '연결' : '연결해제'}}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{vmData.nicName}}</td>
                                    <td v-if="vmData.dataCurrentRxBps &lt; 1">&lsaquo; 1</td>
                                    <td v-else>{{vmData.dataCurrentRxBps}}</td>
                                    <td v-if="vmData.dataCurrentTxBps &lt; 1">&lsaquo; 1</td>
                                    <td v-else>{{vmData.dataCurrentTxBps}}</td>
                                    <td>{{vmData.dataTotalRx}}</td>
                                    <td>{{vmData.dataTotalTx}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <pagination-component :dataList="vmDatas" :size="10" v-on:setViewList="setViewList"></pagination-component>
            </div>
        </div>
        <!-- //doc-list-wrap -->
    </div>
</div>

<script src="/js/castanets/network/network.js" type="text/javascript"></script>