<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
<%
	String id = (String)session.getAttribute("userId");
%>
</script>

<!-- websocket vue -->
<div id="wsVue"></div>
<!-- /websocket vue -->

<div class="header">
	<h1 class="logo"><img src="../../../images/logo.png" alt="Okestro contrabass"></h1>
	<div class="loginInfo">
		아이티정보기술&nbsp;&nbsp;&nbsp;&nbsp;
		<button type="button" class="btn-logined"><%=id%></button>
		<button type="button" class="btn-logout" ><a href="/logout">로그아웃</a></button>
	</div>
</div>
<!-- //header -->