<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c"     uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head lang="kr">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>OKESTRO</title>
    <tiles:insertAttribute name="includejsBefore" ignore="true"/>
 
    <script type="text/javascript">
        // get random image
        $(document).ready(function() {
            var random= Math.floor(Math.random() * 2) + 0;
            var images = ["url(/images/coffee-1276778_1920.jpg)",
                "url(/images/technology-792180_1920.jpg)"];

            document.getElementById("login").style.backgroundImage=images[random];
        });
    </script>
 
</head>
	 <body id="login" class="login">
		<tiles:insertAttribute name="body" ignore="true"/>
		<tiles:insertAttribute name="includejsAfter" ignore="true"/>
	 </body>
</html>