var head = {
	init : function(){
		this.action();
	},
	action : function(){
		var win = $(window);
		var a = $('#header');
		var aa = a.find('.sch');
		var aaa = $('.sch_input');
		var bb = $('.reser_btn1');
		var ab = a.find('.menu');
		var b = $('#mnav');
		var close = b.find('._close');
		var gnb = $('._gnb > li > a');
		var left = $('#left');		
		var sh = win.scrollTop();
		var btn_m = $('.btn_map');
		var btn_h = $('.btn_home');
		var btn_f = $('.btn_filter');
		var btn_close = $('.sub1_box1_3 .contain .close');
		var wrap = $('#wrap');
		var ok = $('.btn_ok');
		var ok2 = $('.ok_msg .con .close');
		var tab_b = $('.use_box3 span');
		var tab_s = $('.use_box4 .list dl dt');

		

		function headFix(){
			if(sh > 0){
				a.addClass('fix');
				left.addClass('fix');
			}else{
				a.removeClass('fix');
				left.removeClass('fix');
			}
		}
		headFix();

		function viewArea(a){
			b.find('.'+a+'').addClass('active').siblings('.area').removeClass('active');
		}

		win.on('scroll',function(){
			sh = $(this).scrollTop();
			headFix();
		});

		aa.on('click',function(){
			b.addClass('active');
			viewArea('search');
			$("#mnav .top").show();
			$("#mnav.active").css({"margin-top" : 0});
		});

		bb.on('click',function(){
			b.addClass('active');
			viewArea('reserve_area');
			
			$("#mnav .top").hide();
			$("#mnav.active").css({"margin-top" : 51});
		});


		aaa.on('click',function(){
			b.addClass('active');
			viewArea('search');
		});

		ab.on('click',function(){
			b.addClass('active');
			viewArea('menu');
			wrap.addClass("left_hide");
		});

		close.on('click',function(){
			b.removeClass('active');
			wrap.removeClass("left_hide");
		});

		gnb.on('click',function(){
			var $this = $(this);
			var par = $this.closest('li');
			if($this.next('ul').length > 0){
				par.toggleClass('active').siblings().removeClass('active');
				return false;
			}
		});

		


		btn_f.on('click',function(){
			$(".sub1_box1_3").slideDown();
		});

		btn_close.on('click',function(){
			$(".sub1_box1_3").slideUp();
		});

		btn_m.on('click',function(){
			$('.sub1_box1 .sub1_box1_1').hide();
			$('.sub1_box1 .sub1_box1_2').show();
			$('.btn_home').show();
			$('.btn_map').hide();
		});

		btn_h.on('click',function(){
			$('.sub1_box1 .sub1_box1_1').show();
			$('.sub1_box1 .sub1_box1_2').hide();
			$('.btn_home').hide();
			$('.btn_map').show();
		});

		ok.on('click',function(){
			$(".ok_msg").fadeIn();
			setTimeout("fnDivHidden()", 3000);
		});

		ok2.on('click',function(){
			$(".ok_msg").fadeOut();
		});

		tab_b.on('click',function(){
			$(".use_box3 span").removeClass("on");
			$(this).addClass("on");
			$(this).parent().parent().find(".use_box4 .list").hide();
			$(this).parent().parent().find(".use_box4 .list").eq($(this).index()).show();
		});

		tab_s.on('click',function(){
			if($(this).parent().hasClass("on")) {
				$(this).parent().removeClass("on");
				$(this).parent().find("dd").slideUp();
			}else {
				$(".use_box4 .list dl").removeClass("on");
				$(this).parent().addClass("on");
				$(".use_box4 .list dl dd").slideUp();
				$(this).parent().find("dd").slideDown();
			}
			
		});

	}
}

function fnDivHidden() {
   document.getElementById('ok_msg').style.display = 'none';
  }
var elementRoll = {
	init : function(){
		this.action();
	},
	action : function(){
		var win = $(window);
		var a = $('#element .roll');
		var wW = win.width();
		var count = [4,3,2,1];
		var mar = [30,20,10,0];

		function resizeVar(){
			wW = win.width();
			if(wW > 1100) {
				aa = 0;
			}else if(wW > 900){
				aa = 1;
			}else if(wW > 700){
				aa = 2;
			}else{
				aa = 3;
			}
		}
		resizeVar();

		var slideOption = function(aa){
			var option = {
				auto: false,
				pager: false,
				speed: 500,
				slideWidth: 600,
				touchEnabled: true,
				moveSlides: 1,
				minSlides: count[aa],
				maxSlides: count[aa],
				slideMargin: mar[aa],
				adaptiveHeight : true,
				nextText: '',
				prevText: ''
			}
			return option;
		}
		
		var slidefunc = function(){
			slider.reloadSlider(slideOption(aa));
		}
		var slider = a.bxSlider(slideOption(aa));

		win.on('resize',function(){
			resizeVar();
			slidefunc();
		});


	}
}


var ajaxbtn = {
	init : function(){
		if($('._ajax-btn').length > 0){
			this.action();
		}
	},
	action : function(){
		var spd = 500;

		$(document).on('click','._ajax-btn',function(){
			var href = $(this).attr('href');
			var idx = $(this).data('idx');
			var type = $(this).data('type');

			if(type == undefined){
				type = 'GET';
			}

			$.ajax({
				type: type,
				url: href,
				data : idx,
				success : function(data) {
					$('body').find('._pop-ajax').remove().end().append(data).find('._pop-ajax').fadeIn(spd);
				}
			});
			return false;
		});

		$(document).on('click','._pop-ajax ._bg, ._pop-ajax ._close',function(){
			$('._pop-ajax').fadeOut(spd,function(){$(this).remove()});
			return false;
		});

	}
}


//GOTOP
var gotop = {
	init : function(){
		this.action();
	},
	action : function(){
		var set = {
			hb : $('html,body'),
			win : $(window),
			btn : $('#gotop'),
		};
		var spd = 300;

		set.btn.on({
			'click' : function(){
				$.scrollTo($('#wrap'),spd);
			}
		});

	}
}

$(document).ready(function(){
	ajaxbtn.init();
	head.init();
	gotop.init();
});


function sticky_relocate() {
    var window_top = $(window).scrollTop() + 103;
    var div_anchor = $('#sticky-anchor');
    var div_anchor2 = $('.anchor1');
	var div_top,div_top2;

	// 스크립트 offset 오류 잡기
	if(div_anchor.length){
		div_top = div_anchor.offset().top;
	}
	if(div_anchor2.length){
		div_top2 = div_anchor.offset().top;
	}
	
    if (window_top > div_top) {
        $('#sticky').addClass('stick');
    }
	else {
        $('#sticky').removeClass('stick');
    }

	var window_top2 = $(window).scrollTop() + window.innerHeight;
	if (window_top2 > div_top2) {
		$('#sticky').addClass('stick2');
    } else {
		$('#sticky').removeClass('stick2');
	}
}

$(function () {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
	
	// 20170324 모바일 전용 메뉴 추가
	$(".left_open").on("click",function(){
		if($(this).hasClass("close")){
			$(this).removeClass("close");
			$(".left_m").removeClass("open");
			return false;
		}
		$(this).addClass("close");
		$(".left_m").addClass("open");
	});

	var page_name = $(".left_m li.on").children("a").text();
	$(".page_name").html(page_name);

	$(".home_box3 .home_box3_1 span").click(function() {
		$(".home_box3 .home_box3_1 span").removeClass("on");
		$(this).addClass("on");
		$(this).parent().parent().find(".home_box3_2_con .home_box3_2").hide();
		$(this).parent().parent().find(".home_box3_2_con .home_box3_2").eq($(this).index()).show();
	});

	$(".s_chk1 span").click(function() {
		$(this).parent().find("span").removeClass("on");
		$(this).addClass("on");
	});
	
	/* 170428 추가 */
	var arr = [];
	function ance_view_dd_size(){
		$(".home_list .list li").each(function(e){
			$(".home_list .list li:eq("+e+") .img").each(function(i){
			arr[i] = $(this).height();
			});
		});
		$(".home_list .list li .img").css("height", Math.max.apply(0, arr));
	}
	ance_view_dd_size();

	$(window).resize(function(){
		$(".home_list .list li .img").css('height','auto');
		ance_view_dd_size();
	});

});



