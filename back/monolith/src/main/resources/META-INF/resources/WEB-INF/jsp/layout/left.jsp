<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<script type="text/javascript">
    $(document).ready(function () {
        var pathName = location.pathname;
        var pathNameMenu = '';
        var pathNameDetailMenu = '';
        var pathNameArr = [];

        pathName = pathName.replace('/', '');
        pathNameArr = pathName.split('/');

        if (pathName === 'dashboard' || pathName === 'symphony') {
            pathNameMenu = pathName + 'Menu';
            document.getElementById(pathNameMenu).classList.add('active');

        }else if(pathName.indexOf('network') > -1 || pathName.indexOf('compute') > -1 || pathName.indexOf('storage') > -1 || pathName.indexOf('admin') > -1){
            pathNameMenu = pathNameArr[0] + 'Menu';
            document.getElementById(pathNameMenu).classList.add('active');

            if(pathName.indexOf('compute') > -1 || pathName.indexOf('storage') > -1 || pathName.indexOf('admin') > -1){
                pathNameDetailMenu = pathNameArr[0] + 'DetailMenu';

                document.getElementById(pathNameDetailMenu).classList.add('opened');
                document.getElementById(pathNameArr[0]+pathNameArr[1]).classList.add('here');
            }
        }
    });

    <%
        String id = (String)session.getAttribute("userId");
    %>

</script>

<!-- websocket vue -->
<div id="wsVue"></div>
<!-- /websocket vue -->

<div class="left-wrap">
    <div class="left-inner">
        <ul class="leftmenu">
            <li><a href="/dashboard" id="dashboardMenu" class="menu-dashboard"><span>대시보드</span></a></li>
            <li><a href="/symphony" id="symphonyMenu" class="menu-symphony"><span>심포니</span></a></li>
            <li>
                <a href="#" id="computeMenu" class="menu-computing hasSub"><span>컴퓨팅</span></a>
                <div class="left-submenu" id="computeDetailMenu">
                    <ul>
                        <li><a href="/compute/vms" id="computevms">가상머신</a></li>
                        <li><a href="/compute/templates" id="computetemplates">템플릿</a></li>
                        <li><a href="/compute/hosts" id="computehosts">호스트</a></li>
                        <li><a href="/compute/clusters" id="computeclusters">클러스터</a></li>
                    </ul>
                </div>
            </li>

            <li><a href="/network/networks" id="networkMenu" class="menu-network"  ><span>네트워크</span></a></li>
            <li><a href="#" class="menu-storage hasSub" id="storageMenu"  ><span>스토리지</span></a>
                <div class="left-submenu" id="storageDetailMenu"  >
                    <ul>
                        <li><a href="/storage/domains" id="storagedomains">도메인</a></li>
                        <li><a href="/storage/disks" id="storagedisks">디스크</a></li>
                    </ul>
                </div>
            </li>
            <li>
                <a href="#" class="menu-manage hasSub" id="adminMenu"><span>관리</span></a>
                <div class="left-submenu" id="adminDetailMenu">
                    <ul>
                        <li><a href="/admin/users" id="adminusers">사용자</a></li>
                        <li><a href="/admin/instanceTypes" id="admininstanceTypes">인스턴스 유형</a></li>
                        <li><a href="/admin/systemProperties" id="adminsystemProperties">설정</a></li>
                        <li><a href="/admin/macAddressPools" id="adminmacAddressPools">맥 주소 풀</a></li>
                        <%--							<li><a href="/admin/license">라이센스</a></li>--%>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
    <button class="btn-leftwrap">접기</button>
</div>
<!-- //left-wrap -->
