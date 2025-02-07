$(window).load(function(){
    Base.init();

});

var Base = {
    init : function()
    {
        if ($('.main-slide2').length !== 0) {
            $('.main-slide2').bxSlider({
                slideMargin: 0,
                startSlide: 0,
                auto:true,
                autoDelay:3000,
                autoHover:true,
                onSliderLoad: function(){ 
                	$(".main-slide").css("visibility", "visible");
                }
            });
        };
		var width2 = ($(".main-slide_3 .main-slide2 li").length * 17) + ($(".main-slide_3 .main-slide2 li").length * 20);
		$(".main-slide_3 .bx-prev").css({"margin-right" : width2});
    },
    
};


