new Vue({
	el: '#macAddressPools',
	data: {
		spinnerOn: true,
		macAddressPools: [],
		pagingVo: {
			viewList: []			//선택한 페이지 클릭시 보여주는 리스트
		}
	},
	mounted: function() {
		this.retrieveMacAddressPools();
	},
	methods: {
		retrieveMacAddressPools: function (){
			this.spinnerOn = true;
			this.$http.get('/admin/retrieveMacAddressPools').then(function (response){
				this.spinnerOn = false;
				this.macAddressPools = response.data.resultKey;

				}.bind(this)).catch(function (error){
					console.log(error);
				});
			},
		setViewList: function(viewList) {
			this.pagingVo.viewList = viewList;
		}
	}
})