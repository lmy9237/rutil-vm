<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<script type="text/javascript">
$(document).ready(function() {	
});
</script>


<div class="col-md-3 left_col">
	<div class="left_col scroll-view">
		<div class="navbar nav_title" style="border: 0;">
			<a href="/dashboard" class="site_title"><img src="/images/logo-white_01.png"><span><img src="/images/logo-white_02.png"></span></a>
		</div>

		<div class="clearfix"></div>

		<!-- left menu -->
		<div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
			<div class="menu_section">
				<br>
				<ul class="nav side-menu" id="leftMenu">
					<li><a href="/dashboard"><i class="fa fa-bar-chart-o"></i>대시보드</a></li>
					<li><a href="/symphony"><i class="fa fa-music"></i> 심포니</a></li>
					<li><a><i class="fa fa-list-alt"></i> 컴퓨팅 <span
							class="fa fa-chevron-down"></span></a>
						<ul class="nav child_menu" >
							<li><a href="/compute/vms">가상머신</a></li>
							<li><a href="/compute/templates">템플릿</a></li>
							<li><a href="/compute/hosts">호스트</a></li>
							<li><a href="/compute/clusters">클러스터</a></li>
						</ul></li>
					<li><a href="/network/networks"><i class="fa fa-link"></i> 네트워크</a></li>
					<li><a><i class="fa fa-inbox"></i> 스토리지 <span
							class="fa fa-chevron-down"></span></a>
						<ul class="nav child_menu">
							<li><a href="/storage/domains">도메인</a></li>
							<li><a href="/storage/disks">디스크</a></li>
						</ul></li>
					<li><a><i class="fa fa-gear"></i> 관리 <span
							class="fa fa-chevron-down"></span></a>
						<ul class="nav child_menu">
							<li><a href="/admin/users">사용자</a></li>
							<li><a href="/admin/instanceTypes">인스턴스 유형</a></li>
							<li><a href="/admin/systemProperties">설정</a></li>
<%--							<li><a href="/admin/license">라이센스</a></li>--%>
						</ul></li>
				</ul>
			</div>
		</div>
		<!-- left menu -->
	</div>
</div>
