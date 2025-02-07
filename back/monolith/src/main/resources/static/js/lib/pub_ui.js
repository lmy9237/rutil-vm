$(document).ready(function(){

	//우측상단 아이디버튼 클릭하면 로그아웃 버튼 나오도록 설정
	$(document).on('click', '.btn-logined', function(){
		$(this).toggleClass('active');
		$('.btn-logout').toggleClass('active');
	});

	//leftmenu 좌측으로 접었다 펼치기
	$(document).on('click', '.btn-leftwrap', function(){
		$('.left-wrap').toggleClass('left-closed');
	});


	//leftmenu 설정 : 2depth가 있다면(hasSub), 해당 left-submenu 영역 열리도록 처리
	$('.leftmenu > li > a').on({
		click : function(e){
			var _this = $(this);
			if(!($('.left-wrap').hasClass('left-closed'))){
				func_leftmenu(_this, e);
			}
		},
		mouseenter : function(e){
			var _this = $(this);
			if($('.left-wrap').hasClass('left-closed')){
				func_leftmenu(_this, e);
			}
		}
	});
	$('.left-submenu').on({
		mouseleave : function(e){
			var _this = $(this);
			if($('.left-wrap').hasClass('left-closed')){
				_this.prev('.hasSub').removeClass('active');
				_this.removeClass('opened');
			}
		}
	});


	//tabs
	$('.tabs').tabs();

	//동적 생성을 위해 별도의 함수화처리
	// funcSelect();
	funcScroll($(".scrollBodyX"), 'x'); //스크롤 원할때 이런식으로 호출
	funcScroll($(".scrollBodyY"), 'y');

	// 리스트 테이블 - 작업 드롭다운
	$(document).on('click', '.list-scroll-wrap .btn-openPop',function(){
		var _this = $(this);
		var _target = _this.next('.openPop-target');
		var _thisTable = _this.closest('table');
		var _lenghTr = _thisTable.find('tr').length;
		var _thisTR = _thisTable.find('tr').index(_this.closest('tr'));
		var _marginTop = _target.outerHeight() - ((_lenghTr - _thisTR - 1) * _this.closest('tr').height());

		$('.list-scroll-wrap .openPop-target').not(_target).removeClass('active');
		$('.list-scroll-wrap .btn-openPop').not(_this).removeClass('active');

		if(_target.hasClass('active')){
			_this.removeClass('active');
			_target.removeClass('active');
			if( _marginTop > 0 ){
				_thisTable.css('margin-bottom', '0');
			}
		}else{
			_this.addClass('active');
			_target.addClass('active');
			if( _marginTop > 0 ){
				_thisTable.css('margin-bottom', _marginTop+'px');
			}
		}
	});

	$(document).on('click', '.btn-folding', function(){
		var _this = $(this);
		var _parent = _this.closest('.folding-Box');
		var _target = _this.closest('.folding-wrap').find('.folding-body');
		if( !(_parent.hasClass('folding-multi')) ){
			_parent.find('.btn-folding').not(_this).removeClass('active');
			$('.folding-body').not($(_target)).slideUp();
		}
		if(_this.hasClass('active')){
			_this.removeClass('active');
			$(_target).slideUp();
		}else{
			_this.addClass('active');
			$(_target).slideDown();
		}
	});

	//dropdown
	$(document).on('click', '.btn-dropdown' , function(){
		var _this = $(this);
		var _parent = _this.closest('.dropdown-parent');
		var _target = _this.next('.dropdown-list-wrap');
		_parent.find('.btn-dropdown').not(_this).removeClass('active');
		_parent.find('.dropdown-list-wrap').not(_target).removeClass('active');
		if(_this.hasClass('active')){
			_this.removeClass('active');
			_target.removeClass('active');
		}else{
			_this.addClass('active');
			_target.addClass('active');
		}
	});

	//열고닫기 + 툴팁 변경
	$(document).on('click', '.btn-toggle' , function(){
		var _this = $(this);
		var _thisDef = _this.attr('data-def');
		var _thisActive = _this.attr('data-active');
		var _target = _this.attr('data-target');
		var _tooltipTxtElm = _this.next('.c-tooltip').find('.txt');
		var _tooltipTxtDef = _tooltipTxtElm.attr('data-def');
		var _tooltipTxtActive = _tooltipTxtElm.attr('data-active');

		if(_this.hasClass('active')){
			_this.removeClass('active');
			_this.removeClass(_thisActive);
			_this.addClass(_thisDef);
			$(_target).slideUp();
			if(_tooltipTxtElm.length > 0){
				_tooltipTxtElm.text(_tooltipTxtDef);
			}
		}else{
			_this.addClass('active');
			_this.addClass(_thisActive);
			_this.removeClass(_thisDef);
			$(_target).slideDown();
			if(_tooltipTxtElm.length > 0){
				_tooltipTxtElm.text(_tooltipTxtActive);
			}
		}
	});

	//table - radio
	$(document).on('click', '.tbl-radio tr', function(){
		var _targetinput = $(this).find('.ui-check input[type="radio"]');
		$(this).closest('.tbl-radio').find('.ui-check input[type="radio"]').not($(_targetinput)).prop("checked", false);
		$(_targetinput).prop("checked", true);
	});

	//상태값 변경
	$(document).on('click', '.btn-stat-chg', function(){
		var _this = $(this);
		var _target = _this.next('.target-stat-chg');
		if(_this.hasClass('active')){
			_this.removeClass('active');
			_target.removeClass('active');
		}else{
			_this.addClass('active');
			_target.addClass('active');
		}


	});


});

function func_leftmenu(_this, e) {
	$('.leftmenu > li > a').not(_this).removeClass('active');
	_this.addClass('active');
	if( _this.hasClass('hasSub') ){
		e.preventDefault();
		var _target = _this.next('.left-submenu');
		$('.left-submenu').not(_target).removeClass('opened');
		if( _target.hasClass('opened') ){
			_target.removeClass('opened');
			_this.removeClass('active');
		}else{
			_target.addClass('opened');
		}
	}else{
		$('.left-submenu').removeClass('opened');
	}

}

function optScroll(_elm){
	_elm.find('.custom-select__dropdown').mCustomScrollbar({
		axis:"y",
		theme:"dark-thin",
		autoExpandScrollbar:false,
		advanced:{autoExpandHorizontalScroll:true}
	});

}

//selectmenu
function funcSelect(){
	if($('.select-wrap select').length > 0){
		$('.select-wrap select').customSelect({ 
			includeValue: true,
			modifier: 'miniOpt',
			showCallback: function () {
				optScroll($('.miniWrap'));
			}
		});
		$('.miniWrap').find('.custom-select').addClass('miniOpt');
	}

	if($('.fullselect-wrap select').length > 0){
		$('.fullselect-wrap select').customSelect({ 
			includeValue: true,
			showCallback: function () {
				optScroll($('.fullselect-wrap'));
			}
		});
	}
}

//scroll
function funcScroll(elm , xy){
	var _bool = (xy=='y')? true: false;
	elm.mCustomScrollbar({
		axis:xy,
		theme:"dark-thin",
		autoExpandScrollbar:false,
		mouseWheel: {enable: _bool},
		advanced:{autoExpandHorizontalScroll:true}
	});
}

