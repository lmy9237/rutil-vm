<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="kr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>OKESTRO</title>
    <script src="/js/lib/es6-promise.min.js"></script>
    <script src="/js/lib/es6-promise.auto.min.js"></script>
    
     <tiles:insertAttribute name="includejsBefore" />
     
</head>

<%
 
    // 쿠키값 가져오기
    Cookie[] cookies = request.getCookies() ;
    String cValue = null; 
    if(cookies != null){
         
        for(int i=0; i < cookies.length; i++){
            Cookie c = cookies[i] ;
             
            // 저장된 쿠키 이름을 가져온다
            String cName = c.getName();
             
            // 쿠키값을 가져온다
            if(cName.equalsIgnoreCase("userConvenienceCookie")) {
            	 cValue = c.getValue() ;
            }
           
             
        }
    }
 
%>
	<body class="<%=cValue%>">
		<div class="container body">
			<div class="main_container">
				<tiles:insertAttribute name="left" />
				<tiles:insertAttribute name="top" />
				<tiles:insertAttribute name="body" />
				<tiles:insertAttribute name="footer" />
			</div>
		</div>
      	
		<tiles:insertAttribute name="includejsAfter" />
	
		<!-- top.js (include websocket vue) -->
		<script src="/js/castanets/top.js"></script>
	
	</body>
</html>
