var option = {
QtyChange: function (type, sign, cnt, obj) {
	var calcPrice = 0;
	var price = $("#"+type+"OrgPrice_"+cnt).val();
	var qty = $("#"+type+"Qty_"+cnt).val();

	if (sign == "minus"){
		if (qty >= 9999) {
			$(obj).closest("span").find(".button--plus").prop("disabled", false);
		} else if (qty == 2) {
			$(obj).prop("disabled", true);
		}

		if (qty > 1){
			qty--;
		}
		$("#"+type+"Qty_"+cnt).val(qty);
	}else if(sign == "plus"){
		if (qty <= 1)
		{
			$(obj).closest("span").find(".button--minus").prop("disabled", false);
		}else if (qty == 9998){
			$(obj).prop("disabled", true);
		}

		if (qty < 9999){
			qty++;
		}
		$("#"+type+"Qty_"+cnt).val(qty);
	}else{
		if (qty <= 1)
		{
			$("#"+type+"Qty_"+cnt).val(1);
			$(obj).closest("span").find(".button--minus").prop("disabled", true);
			//alert("수량은 1 이상 입력해주세요.");
		}else if (qty >= 9999)
		{
			$("#"+type+"Qty_"+cnt).val(9999);
			$(obj).closest("span").find(".button--plus").prop("disabled", true);
			//alert("수량은 9999 이하로 입력해주세요.");
		}else{
			$(obj).closest("span").find(".button--minus").prop("disabled", false);
			$(obj).closest("span").find(".button--plus").prop("disabled", false);
		}
	}
	//다시 한번 가져오기(text 땜에)
	qty = $("#"+type+"Qty_"+cnt).val();

	calcPrice = parseInt(price) * parseInt(qty);
	$("#"+type+"Price_"+cnt).val(calcPrice);

	
},
}; //option 끝
