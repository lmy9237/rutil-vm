Vue.prototype.$http = axios;
Vue.prototype.EventBus = new Vue();

var createNetwork = new Vue({
	el: '#createNetwork',
	data: {
		networkName: ""
		,networkDescription : ""
		,networkLable : ""
		,networkVlan : ""
		,networkVlanAt : false
		,networkVm : true
		,networkMtu : ""
		,networkMtuRadio : "default"
		,qoss : null
		,dnss : null
		,dnssSize : null
		,clusters : null
		,networkNames : null
		,qos : ""
		,spinnerOn : false
		,validationNames : true
		,validationName : false
		,validationLabel : true
		,validationVlan : true
		,validationMtu : true
	},
	mounted: function(){
		this.$EventBus.$on('openCreateModal', data =>{
			this.onload();
		})
	},
	methods: {
		addNetwork : function() {

			var networkVm = "true";
			if(!createNetwork.networkVm) {
				networkVm = "false";
			}

			//validation 체크
			if(!createNetwork.validationNames) {
				alert("입력한 네트워크 이름은 이미 등록되어 있습니다.");
				return false;
			}

			if(!createNetwork.validationName) {
				alert("네트워크명은 4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.");
				return false;
			}

			if(!createNetwork.validationLabel) {
				return false;
			}

			if(createNetwork.networkVlanAt) {
				if(!createNetwork.validationVlan) {
					return false;
				}
			}

			if(createNetwork.networkMtuRadio != 'default') {
				if(!createNetwork.validationMtu) {
					return false;
				}
			}

			this.clusterCheck();
			// 네트워크 추가값 셋팅
			let param = {
				name : createNetwork.networkName
				,description : createNetwork.networkDescription
				,mtu : createNetwork.networkMtu
				,vlan : createNetwork.networkVlan
				,label : createNetwork.networkLable
				,qos : createNetwork.qos
				,dnss : createNetwork.dnss
				,clusters : createNetwork.clusters
				,usage : createNetwork.networkVm
			}

			this.$http.post('/network/addNetwork',param,{
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(function (response) {
					window.location.href = "/network/networks";
				})
				.catch(function (error) {
					console.log(error);
					window.location.href = "/network/networks";

				})
				.then(function () {
					// always executed
				});
		},
		onload : function() {
			this.$http.post('/network/createNetworkDeatil',{
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(function (response) {
					createNetwork.qoss = response.data.resultData.qoss;
					createNetwork.clusters = response.data.resultData.clusters;
					createNetwork.networkNames = response.data.resultData.networkName;

					var dnss = [{dnsIp : ""}];
					createNetwork.dnss = dnss;
					createNetwork.dnssSize = dnss.length;

					createNetwork.spinnerOn = false;

				})
				.catch(function (error) {
					console.log(error);
				})
				.then(function () {
					// always executed
				});
		},
		dnsPlus : function() {
			var dns = {dnsIp : ""};
			createNetwork.dnss.push(dns);
			createNetwork.dnssSize = createNetwork.dnss.length;
		},
		dnsMinus : function(index) {

			createNetwork.dnss.splice(index,1);
			createNetwork.dnssSize = createNetwork.dnss.length;
		},
		cancel : function() {
			window.location.href = "/network/networks";
		},
		clusterCheck : function() {
			$.each(createNetwork.clusters , function(i, cluster) {
				if(!cluster.connect) {
					cluster.required = false;
				}
			})
		},
		closePop: function (modalType){
			document.getElementById('createNetwork').classList.remove('active');
			this.init();
		},
		init: function () {
			this.networkName = '';
			this.networkDescription = '';
			this.networkMtu = '';
			this.networkVlan = '';
			this.networkLable = '';
			this.qos = null;
			this.dnss = null;
			// this.clusters = null;
			this.networkVm = true;
			this.networkVlanAt = false;
			this.networkMtuRadio = 'default';
		}
	},
	watch: {
		networkVlanAt: function (val) {
			if(!val) {
				createNetwork.networkVlan = "";
			}
		},
		networkMtuRadio : function(val) {
			if(val == "default") {
				createNetwork.networkMtu = "1500";
			}else {
				createNetwork.networkMtu = "";
			}
		},
		networkName : function(val) {

			if(this.checkInputName(val).result) {
				createNetwork.validationName = false;
			}else {
				if(val.length >= 4) {
					var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
					if(check.test(val)) {
						createNetwork.validationName = false;
					}else {
						createNetwork.validationName = true;
					}
				}else {
					createNetwork.validationName = false;
				}
			}

			$.each(createNetwork.networkNames , function(i , name){
				if(name == val) {
					createNetwork.validationNames = false;
					return false;
				}
				createNetwork.validationNames = true;
			})
		},
		networkLable : function(val) {

			if(val.length == 0) {
				createNetwork.validationLabel = true;
			}else {
				if(this.checkInputName(val).result) {
					createNetwork.validationLabel = false;
				}else {
					if(val.length >= 4) {
						var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
						if(check.test(val)) {
							createNetwork.validationLabel = false;
						}else {
							createNetwork.validationLabel = true;
						}
					}else {
						createNetwork.validationLabel = false;
					}
				}
			}
		},
		networkVlan : function (val) {
			var regNumber = /^[0-9]*$/;
			if(regNumber.test(val)) {
				if(val.length >= 1 && val.length <= 4) {
					var str = val.substr(0,1);
					if(str == 0) {
						// console.log("첫번쨰 값이 0으로 입력되었습니다 ",str);
						createNetwork.validationVlan = false;
					}else {
						// console.log("제대로 입력되었습니다 ", str);
						if(val <= 4094) {
							createNetwork.validationVlan = true;
						}else {
							createNetwork.validationVlan = false;
						}
					}
				}
			}else {
				createNetwork.validationVlan = false;
			}
			if(val == "") {
				createNetwork.validationVlan = true;
			}
		},
		networkMtu : function (val) {
			var regNumber = /^[0-9]*$/;

			if(regNumber.test(val)) {
				if(val.length >= 1 && val.length <= 10) {
					var str = val.substr(0,1);
					if(str == 0) {
						// console.log("첫번쨰 값이 0으로 입력되었습니다 ",str);
						createNetwork.validationMtu = false;
					}else {
						// console.log("제대로 입력되었습니다 ", str);

						if(val <= 2147483647) {
							createNetwork.validationMtu = true;
						}else {

							createNetwork.validationMtu = false;
						}
					}
				}
			}else {
				createNetwork.validationMtu = false;
			}

			if(val == "") {
				createNetwork.validationMtu = true;
			}
		}
	}
});