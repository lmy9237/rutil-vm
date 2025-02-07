<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>


<script type="text/javascript">
	var wsUri = "ws://localhost:8080/websocket/castanets";

	var websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) {
		onOpen(evt)
	};
	websocket.onmessage = function(evt) {
		onMessage(evt)
	};
	websocket.onerror = function(evt) {
		onError(evt)
	};

	function init() {
		output = document.getElementById("output");
	}
	function send_message() {
		doSend(textID.value);
	}

	function onOpen(evt) {
		//writeToScreen("Connected to Endpoint! : " + wsUri);
		doSend(textID.value);
	}
	function onMessage(evt) {
		//	var rcvMsg = JSON.parse(evt.data);
		var rcvMsg = evt.data;
		console.log(rcvMsg);
		writeToScreen("Message Received: " + rcvMsg);
		/*                 writeToScreen("Message Received: " + rcvMsg.message); */

	}
	function onError(evt) {
		writeToScreen('ERROR: ' + evt.data);
	}
	function doSend(message) {
		var msg = {
			"msgId" : "id-1",
			"msg" : message,
			"etc=" : "etc1"
		};
		var myJSON = JSON.stringify(msg);
		console.log(myJSON);
		writeToScreen("Message Sent: " + message);
		websocket.send(myJSON);
		//websocket.close();
	}
	function writeToScreen(message) {
		var pre = document.createElement("p");
		pre.style.wordWrap = "break-word";
		pre.innerHTML = message;

		output.appendChild(pre);
	}
	window.addEventListener("load", init, false);
</script>


<h1 style="text-align: center;">Hello World WebSocket Client</h1>
<br>
<div style="text-align: center;">
	<form action="">
		<input onclick="send_message()" value="Send" type="button"> <input
			id="textID" name="message" value="Hello WebSocket!" type="text"><br>
	</form>
</div>
<div id="output"></div>
