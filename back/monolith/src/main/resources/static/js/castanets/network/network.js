
var network = new Vue({
	
	el: '#network',
	data: {
		networkData : null
		,clusterDatas : null
		,hostDatas : null
		,vmDatas : null
		,spinnerOn: true
		,managementMessage : '관리'
		,displayMessage : '출력(display)'
		,migrationMessage : '마이그레이션'
		,defaultRouteMessage : '기본 라우팅'
		,pagingVo: {
			viewList: []
		}
	},
	methods: {
		goNetworks : function() {
			window.location.href = "/network/networks";
		},
		onload : function() {
	
			// console.log("network onload");
			let param = network.networkData;
			this.$http.post('/network/getNetworkDetail',param,{
				headers: {
			        'Content-Type': 'application/json'
			    }
			})
			  .then(function (response) {
				  // console.log("response", response);
				  network.networkData = response.data.resultData.network;
				  network.clusterDatas = response.data.resultData.clusters;
				  network.hostDatas = response.data.resultData.hosts;
				  network.vmDatas = response.data.resultData.vms;
				  network.spinnerOn = false;
				  
			  })
			  .catch(function (error) {
			    console.log(error);
			  })
			  .then(function () {
			    // always executed
			  });  
		},
		setViewList: function(viewList) {
			this.pagingVo.viewList = viewList;
		}
	}
});