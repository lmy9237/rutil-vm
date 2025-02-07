<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.io.StringWriter" %> 

<%
	String a = "TEST 중입니다";
	System.out.println(a);

 	Throwable throwable = (Throwable)request.getAttribute("exception");
 	String message = null;
 	String errorCode = null;
 	String returnMessage = null;
 	
 	if (throwable != null) {
  		StringWriter sw = new StringWriter();
		throwable.printStackTrace(new PrintWriter(sw));
		message = sw.toString();
		System.out.println("컨트롤러 : "+ message);
 	}
%>