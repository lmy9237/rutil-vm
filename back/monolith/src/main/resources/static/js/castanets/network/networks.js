Vue.prototype.$http = axios;
Vue.prototype.EventBus = new Vue();

var networks = new Vue({

	el: '#networks',
	data: {
		networkList : []
		,selectNetworks : []
		,deleteNetworks : []
		,deleteNetworksNames : ''
		,spinnerOn: true
		,pagingVo: {
			viewList: []			//선택한 페이지 클릭시 보여주는 리스트
		}
	},
	mounted: function () {
		this.getNetworkList();
	},
	methods: {
		getNetworkList: function() {
			this.spinnerOn = true;
			this.$http.post('/network/getNetworkList', null,{
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {
				networks.networkList = response.data.list;
				networks.spinnerOn = false;
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
				networks.spinnerOn = false;
			});

			//작업 toggle버튼 active 제거
			this.togglePop();
		},
		createNetwork : function() {
			window.location.href = "/network/createNetwork";
		},
		goNetworkDetail: function(val) {
			// console.log("select network",networks.networkList[val]);

			// let selectNetwork = networks.networkList[val];
			let selectNetwork = val;
			selectNetwork = JSON.stringify(selectNetwork);
			selectNetwork = encodeURI(selectNetwork);

			sessionStorage.setItem('selectNetwork',selectNetwork);

			window.location.href = "/network/network";
		},
		deleteNetworkSet : function(index) {

			if(this.selectNetworks.length > 0){
				this.selectNetworks.splice(0, 1);
			}
			this.selectNetworks.push(index);

			networks.deleteNetworks = [];
			networks.deleteNetworksNames = "";

			$.each(networks.selectNetworks, function(index, item){
				networks.deleteNetworks.push(networks.networkList[item]);
				networks.deleteNetworksNames = networks.deleteNetworksNames + networks.networkList[item].name + '\n ';
			});

			this.openPop('deleteModal');
		},
		deleteNetwork : function() {
			// if(networks.deleteNetworks.length != 1) {
			// 	alert('삭제할 네트워크를 1개만 선택해주세요.');
			// 	return;
			// }

//			if(confirm('다음의 네트워크를 삭제하시겠습니까?\n' + "선택된 네트워크 : " + networks.deleteNetworksNames)){
			this.$http.post('/network/deleteNetwork', networks.deleteNetworks,{
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {
				networks.networkList.splice(networks.selectNetworks[0],1);
				networks.selectNetworks = [];
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
			this.closePop('deleteModal');
			this.getNetworkList();
		},
		updateNetwork : function(index) {

			if(this.selectNetworks.length > 0){
				this.selectNetworks.splice(0, 1);
			}
			this.selectNetworks.push(index);

			let selectNetwork = networks.networkList[networks.selectNetworks[0]];
			// selectNetwork = JSON.stringify(selectNetwork);
			// selectNetwork = encodeURI(selectNetwork);

			// sessionStorage.setItem('updateNetwork',selectNetwork);
			// window.location.href = '/network/updateNetwork';

			//selected network info param 전달
			this.$EventBus.$emit('openUpdate', selectNetwork);
			this.openPop('updateNetwork');
		},
		mouseOnClick : function(index) {
			if(networks.selectNetworks.length > 0) {
				var selectAt = true;
				var selectNetworksIndex;

				$.each(networks.selectNetworks, function(rowIndex, item){
					if(index == item) {
						selectAt = false;
						selectNetworksIndex = rowIndex;
					}
				});

				if(selectAt) {
					networks.selectNetworks.push(index);
				}else {
					networks.selectNetworks.splice(selectNetworksIndex,1);
				}

			}else {
				networks.selectNetworks.push(index);
			}
		},
		closePop: function (modalType){
			document.getElementById(modalType).classList.remove('active');
		},
		openPop: function (modalType){

			document.getElementById(modalType).classList.add('active');
			this.togglePop();

			if(modalType === 'createNetwork'){
				this.$EventBus.$emit('openCreateModal');
			}
		},
		togglePop: function(){
			//list의 작업 컬럼 toggle
			var _this = $(this);
			var _target = _this.next('.openPop-target');

			$('.list-scroll-wrap .openPop-target').not(_target).removeClass('active');
			$('.list-scroll-wrap .btn-openPop').not(_this).removeClass('active');

			if(_target.hasClass('active')){
				_this.removeClass('active');
				_target.removeClass('active');
			}else{
				_this.addClass('active');
				_target.addClass('active');
			}
		},
		setViewList: function(viewList) {
			this.pagingVo.viewList = viewList;
		}
	}
});

