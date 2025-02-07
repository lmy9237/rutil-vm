<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<script type="text/javascript">
    /*
	if (document.location.protocol == 'http:') {
	    if (window.location.hostname == 'demo.okestro.com') {
			document.location.href = "https://"+window.location.hostname;
		} else {
			document.location.href = "https://"+window.location.hostname+":8443";
		}
	}
	*/

var loginBtnBoolean = true;

function login() {
	 let usr = $("#usr").val();
	 let pwd = $("#pwd").val();
	 
	  data = {
			  userid : usr,
			  passwd : btoa(pwd),
	  };
	 
	 if(loginBtnBoolean) {
		 loginBtnBoolean = false;
		 $("#usr").attr("disabled", true);
		 $("#pwd").attr("disabled", true);
		 $("#loginBtn").attr("disabled", true);
		 
		 $.ajax({
	         type : 'POST',
	         url  : '/login',
	         cache: false,
	         async: true,
	         dataType: 'json',
	         data : data,
	 		 success: function(responseData,status) {
	 			if(responseData.resultKey === "OK") {
	 				sessionStorage.setItem('loginUserId',usr);
	 				window.location.href = responseData.redirect;
	 			}
	 			
			 },
			 error : function(error){
				 console.log("error", error);
				 console.log("status", error.status);
				 if(error.status == 300) {
					 alert("네트워크 상태를 확인해 주세요"); //connection time out 
				 }else if(error.status == 301) {
					 alert("네트워크 상태를 확인해 주세요"); //read time out	
				 }else if(error.status == 302) {
					 alert("ID/PW 를 확인해주세요");	// user password 
				 }else if(error.status == 303) {
					 alert("계정이 비활성화 되어있습니다. 관리자에게 문의해 주세요");	// user lock
				 }else if(error.status == 429) {
			 		 // alert("로그인 시도 횟수가 초과되었습니다. 관리자에게 문의해 주세요");	// user lock
					 alert("로그인 시도 횟수가 초과되었습니다. 10분 뒤에 다시 시도해 주세요.");	// user lock
				 }
				 else 
				 {
					 alert("서버에 접속할 수 없습니다. 관리자에게 문의하세요");
				 }
				 loginBtnBoolean = true;
				 $("#usr").attr("disabled", false);
				 $("#pwd").attr("disabled", false);
				 $("#loginBtn").attr("disabled", false);
			 }
	     });
	 }
}

function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
    	login();
        return false;
    }
}

$(document).ready(function() {
	$("#loginBtn").click(function(){
		login();
	});

	/*
	let url = window.location.protocol;
	if(url == "http:") {
		console.log("http로 접속했습니다. ");
		window.location.href = "https://"+window.location.hostname+":8443";
	}
	*/
});

//LoginCount 초기화 jh 20200630
function resetAdminLoginCount(){
	$.ajax({
		type : 'GET',
		url  : '/login/resetLoginCount',
		contentType : 'application/json',
		dataType: 'json',
		data : {
			userId : 'admin'
		},
		success: function(data) {
			alert('admin account unlocked!');
		},
		error : function(error){
			alert('fail');
		}
	});
}
</script>

<div>
	<div class="login_wrapper">
		<div class="login_panel">
			<input type="button" id="resetBtn" style="opacity: 0; float: left;" value="reset" onclick="resetAdminLoginCount()">

			<div class="animate form login_form">


				<div>
					<img src="/images/logo-blue_01.png" alt="logo">
				</div>
				<section class="login_content">
					<form>
						<h2>아이티정보기술1111</h2>
						<div>
							<input type="text" class="form-control" placeholder="아이디"
								id="usr" onkeypress="return runScript(event)" required />
						</div>
						<div>
							<input type="password" class="form-control" placeholder="비밀번호"
								id="pwd" onkeypress="return runScript(event)" required />
						</div>
						<div class="text-right">
							<a id="loginBtn" class="btn btn-default submit">로그인</a>
						</div>
						<div class="clearfix"></div>
						<div class="separator">
							<br />
							<div>
								<p>©2023 All Rights Reserved. <a href="http://www.okestro.com" target="_blank">OKESTRO</a></p>
							</div>
						</div>
					</form>
				</section>
			</div>
		</div>
	</div>
</div>