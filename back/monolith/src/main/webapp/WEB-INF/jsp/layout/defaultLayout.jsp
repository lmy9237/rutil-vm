<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="tiles"   uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c"       uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="kr">
<head>
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="description" content="Okestro contrabass">
    <meta name="keywords" content="Okestro contrabass">
    <meta name="title" content="Okestro contrabass">

    <link rel="stylesheet" type="text/css" href="../../../css/reset.css">
    <link rel="stylesheet" type="text/css" href="../../../css/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="../../../css/mCustomScrollbar.css">
    <link rel="stylesheet" type="text/css" href="../../../css/customSelect.css">
    <link rel="stylesheet" type="text/css" href="../../../css/style.css">
    <title>Okestro contrabass</title>

    <tiles:insertAttribute name="includejsBefore" ignore="true"/>
</head>

<%
    // 쿠키값 가져오기
    Cookie[] cookies = request.getCookies();
    String cValue = null;
    if (cookies != null) {

        for (int i = 0; i < cookies.length; i++) {
            Cookie c = cookies[i];

            // 저장된 쿠키 이름을 가져온다
            String cName = c.getName();

            // 쿠키값을 가져온다
            if (cName.equalsIgnoreCase("userConvenienceCookie")) {
                cValue = c.getValue();
            }
        }
    }
%>
<body>
<div class="wrap">
    <tiles:insertAttribute name="top" ignore="true"/>
    <div class="container">
        <div class="containnerBox">
            <tiles:insertAttribute name="left" ignore="true"/>
            <tiles:insertAttribute name="body" ignore="true"/>
            <%-- <tiles:insertAttribute name="footer" ignore="true"/> --%>
        </div>
    </div>
    <tiles:insertAttribute name="includejsAfter" ignore="true"/>
    <!-- top.js (include websocket vue) -->
    <script src="/js/castanets/top.js"></script>
</div>

<%--<script type="text/javascript" src="../../../js/lib/core.js"></script>--%>
<%--<script type="text/javascript" src="../../../js/lib/charts.js"></script>--%>
<%--<script type="text/javascript" src="../../../js/lib/animated.js"></script>--%>

<%--<script type="text/javascript" src="../../../js/lib/jquery-ui.min.js"></script>--%>
<%--<script type="text/javascript" src="../../../js/lib/mCustomScrollbar.min.js"></script>--%>
<%--<script type="text/javascript" src="../../../js/lib/jquery.custom-select.js"></script>--%>
<%--<script type="text/javascript" src="../../../js/lib/pub_ui.js"></script>--%>
</body>
</html>
