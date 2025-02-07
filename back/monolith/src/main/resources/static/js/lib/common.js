
$(function() {

	//Slide
	$(".flexslider").flexslider({
		animation: "slide",
		slideshow: true,
		slideshowSpeed:5000
	});
	$(".flexsliderPage").flexslider({
		animation: "slide",
		animationLoop: true,
		itemWidth: 180,
		itemMargin: 0
	});
	$(".flex-play").click(function(e){
		$(this).parent().flexslider("play");
		$(this).hide();
		$(this).parent().children(".flex-stop").show();
		e.preventDefault();
	});
	$(".flex-stop").click(function(e){
		$(this).parent().flexslider("stop");
		$(this).hide();
		$(this).parent().children(".flex-play").show();
		e.preventDefault();
	});

	//Lnb
	$("#lnb > ul > li > a").click(function(e){
		var parentLi = $(this).parent("li");
		$("#lnb > ul > li").removeClass("on");
		parentLi.addClass("on");
		e.preventDefault();
	});
	$("#btn_lnbControl").click(function(e){
		if($("#lnb").width() < 10){
			$(this).css("left","240px");
			$("#lnb").css("width","240px");
			$("#content").css("margin-left","270px");
		}else{
			$(this).css("left","-8px");
			$("#lnb").css("width","0px");
			$("#content").css("margin-left","0px");
		}
		e.preventDefault();
	});

	pageEvent();
	viewSizeGet();
});

$(window).resize(function(){
	viewSizeGet();
});

/*Libary*/
function viewSizeGet(){
	var maxHeight = 0;
	$("#contentHolder").css("height","auto");
	contentHeight = $("#contentHolder").height();
	if(maxHeight < $("#contentHolder").height()) maxHeight = $("#contentHolder").height();
	if(maxHeight < $("#lnb").height()) maxHeight = $("#lnb").height();
	$("#contentHolder").height(maxHeight);
}
function pageEvent(){
	useDatepicker();
	useFileBtn();
	useTab();
	//useTree();
}
function useTab(){
	$(".tabBtn").unbind().click(function(e){
		var tabId = $(this).attr("data-target");
		$(this).parent().parent().find("li").removeClass("on");
		$(this).parent().addClass("on");
		$(this).parent().parent().parent().children(".tabPage").removeClass("on");
		$(this).parent().parent().parent().children("#tabPage_"+tabId).addClass("on");
		e.preventDefault();
	});
	$(".btn_tabClose").unbind().click(function(e){
		var tabId = $(this).parent().children(".tabBtn").attr("data-target");
		var tabUl = $(this).parent().parent();
		$(this).parent().remove();
		tabUl.parent().children("#tabPage_"+tabId).remove();
		tabUl.find(".tabBtn").eq(0).click();
		e.preventDefault();
	});
}
function useFileBtn(){
	$("input.fileBtn").each(function(){
		var file_name = $(this).attr("id");
		$(this).after('<span id="for_'+file_name+'"><input type="text" class="w120" value=""> <a href="#" class="btn_inline for_fileBtn">파일추가</a></span>');
		$(this).hide();
		$(this).change(function(){
			$("#for_"+file_name+" input[type='text']").val($(this).val());
		});
	});
	$(".for_fileBtn").click(function(){
		var id = $(this).parent().attr("id").replace("for_","");
		$("#"+id).click();
	});
	$(".btn-multiFile").click(function(e){
		var fileCnt = $(this).parent().find("input[type='file']").length;
		$(this).parent().find("input[type='file']").eq((fileCnt-1)).click();
		e.preventDefault();
	});
}

function useDatepicker(){
	var holidayData = [
		{"mmdd":"1-1","title":"신정"},
		{"mmdd":"3-1","title":"3.1절"},
		{"mmdd":"5-5","title":"어린이날"},
		{"mmdd":"6-6","title":"현충일"},
		{"mmdd":"8-15","title":"광복절"},
		{"mmdd":"10-3","title":"개천절"},
		{"mmdd":"10-9","title":"한글날"},
		{"mmdd":"12-25","title":"크리스마스"}
	];

	$(".useDatepicker").each(function(){
		if(!$(this).hasClass("hasDatepicker")){
			var name = $(this).attr("name");
			var minDate = $(this).attr("data-minDate");
			var maxDate = $(this).attr("data-maxDate");
			var dateFormat = "yy-mm-dd";
			if($(this).attr("data-format")) dateFormat = $(this).attr("data-format");
			var btn_calendarOpen = $("<a/>", {
				href: "#",
				class: "btn_calendarOpen",
				"data-name": name
			});
			$(this).after(btn_calendarOpen);
			$(this).datepicker({
				prevText: "이전 달",
				nextText: "다음 달",
				monthNames: ["01","02","03","04","05","06","07","08","09","10","11","12"],
				monthNamesShort: ["01","02","03","04","05","06","07","08","09","10","11","12"],
				dayNames: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
				dayNamesShort: ["일","월","화","수","목","금","토"],
				dayNamesMin: ["일","월","화","수","목","금","토"],
				dateFormat: dateFormat,
				showMonthAfterYear: true,
				yearSuffix: "/",
				minDate: minDate,
				maxDate: maxDate,
				beforeShowDay: function(date){
					var holidayCheck = false;
					var mmdd = (date.getMonth() + 1)+"-"+date.getDate();
					for(var i=0; i<holidayData.length; i++){
						if(holidayData[i].mmdd == mmdd){
							holidayCheck = true;
							return [true, "date-holiday", holidayData[i].title];
							break;
						}
					}
					if(holidayCheck == false){
						return [true, ""];
					}
				},
				onSelect: function(selectedDate){
				},
				onClose: function(selectedDate){
					if(this.id == "dateFrom" ) {
						if(selectedDate != "" && $("#dateTo").val() != ""){
							if(selectedDate >= $("#dateTo").val()){
								alert("시작날짜는 종료날짜보다 작아야 합니다.");
								$("#dateFrom").val("");
								return;
							}
						}
					}else if(this.id == "dateTo" ) {
						if(selectedDate != "" && $("#dataFrom").val() != ""){
							if($("#dateFrom").val() >= selectedDate){
								alert("종료날짜는 시작날짜보다 커야 합니다.");
								$("#dateTo").val("");
								return;
							}
						}
					}
				}
			});
			btn_calendarOpen.click(function(){
				$(this).datepicker("show");
			});
		}
	});
}
	