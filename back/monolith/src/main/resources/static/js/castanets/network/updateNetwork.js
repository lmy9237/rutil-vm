
var updateNetwork = new Vue({
	el: '#updateNetwork',
	data: {
		networkName: null
		,orgNetworkName : ""
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
        ,networkData : null
        ,spinnerOn : false
		,validationNames : true
		,validationName : false
		,validationLabel : true
		,validationVlan : true
		,validationMtu : true
	},
	mounted: function(){

		this.$EventBus.$on('openUpdate', selectNetwork =>{
			this.networkData = selectNetwork;
			this.onload();
		})
	},
	methods: {
		updateNetwork : function() {
			var networkVm = "true";
			if(!updateNetwork.networkVm) {
				networkVm = "false";
			}

			//validation 체크
			if(!updateNetwork.validationNames) {
				return false;
			}

			if(!updateNetwork.validationName) {
				return false;
			}

			if(!updateNetwork.validationLabel) {
				return false;
			}

			if(updateNetwork.networkVlanAt) {
				if(!updateNetwork.validationVlan) {
					return false;
				}
			}

			if(updateNetwork.networkMtuRadio != 'default') {
				if(!updateNetwork.validationMtu) {
					return false;
				}
			}

			this.clusterCheck();

			// 네트워크 추가값 셋팅 
			let param = {
					name : updateNetwork.networkName
					,description : updateNetwork.networkDescription
					,mtu : updateNetwork.networkMtu
					,vlan : updateNetwork.networkVlan
					,label : updateNetwork.networkLable
					,qos : updateNetwork.qos
					,dnss : updateNetwork.dnss
					,clusters : updateNetwork.clusters
					,usage : updateNetwork.networkVm
					,id : updateNetwork.networkData.id
			} 
			
			this.$http.post('/network/modifiedNetwork',param,{
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
				  // qos 목록, 네트워크 이름을 가져온다
				  updateNetwork.qoss = response.data.resultData.qoss;
				  updateNetwork.networkNames = response.data.resultData.networkName;

				  var dnss = [{dnsIp : ""}];
				  updateNetwork.dnss = dnss;
				  updateNetwork.dnssSize = dnss.length;
				  updateNetwork.setting();

			  })
			  .catch(function (error) {
			    console.log(error);
			  })
			  .then(function () {
			    // always executed
			  });

			let param = {id : updateNetwork.networkData.id};
			this.$http.post('/network/clusters',param,{
				headers: {
			        'Content-Type': 'application/json'
			    }
			  })
			  .then(function (response) {
				  //편집되는 네트워크의 클러스터 연결 여부를 가져온다
				  // console.log("response.data.clusters" ,response.data.clusters);
				  updateNetwork.clusters = response.data.clusters;

			  })
			  .catch(function (error) {
			    console.log(error);
			  })
			  .then(function () {
			    // always executed
			  });
		},
		setting : function() {
			updateNetwork.networkName = updateNetwork.networkData.name;
			updateNetwork.orgNetworkName = updateNetwork.networkData.name;
			updateNetwork.networkDescription = updateNetwork.networkData.description;
			updateNetwork.networkLable = updateNetwork.networkData.label;
			if(updateNetwork.networkData.vlan != null) {
				updateNetwork.networkVlanAt = true;
			}
			updateNetwork.networkVlan = updateNetwork.networkData.vlan;

			if(updateNetwork.networkData.mtu != null && updateNetwork.networkData.mtu !="1500" && updateNetwork.networkData.mtu !="0") {
				updateNetwork.networkMtuRadio = "customize";
			}
			updateNetwork.networkMtu = updateNetwork.networkData.mtu;

			if(updateNetwork.networkData.usage == "VM") {
				updateNetwork.networkVm = true;
			}else {
				updateNetwork.networkVm = false;
			}
			if(updateNetwork.networkData.qosId != null) {
				updateNetwork.qos = updateNetwork.networkData.qosId;
			}else {
				updateNetwork.qos = "";
			}

			updateNetwork.spinnerOn = false;


		},
		dnsPlus : function() {
			var dns = {dnsIp : ""};
			updateNetwork.dnss.push(dns);
			updateNetwork.dnssSize = updateNetwork.dnss.length;
		},
		dnsMinus : function(index) {

			updateNetwork.dnss.splice(index,1);
			updateNetwork.dnssSize = updateNetwork.dnss.length;
		},
		cancel : function() {
			window.location.href = "/network/networks";
		},
		clusterCheck : function() {
			$.each(updateNetwork.clusters , function(i, cluster) {
				if(!cluster.connect) {
					cluster.required = false;
				}
			})
		},
		closePop: function (modalType){
			document.getElementById(modalType).classList.remove('active');
		}
	},
	 watch: {
		 networkVlanAt: function (val) {
	      if(!val) {
	    	  updateNetwork.networkVlan = "";
	      }
	    },
	    networkMtuRadio : function(val) {
	    	if(val == "default") {
	    		updateNetwork.networkMtu = "1500";
	    	}else {
	    		updateNetwork.networkMtu = updateNetwork.networkMtu;
	    	}
	    },
		 networkName : function(val) {

			 if(this.checkInputName(val).result) {
				 updateNetwork.validationName = false;
			 }else {
				 if(val.length >= 4) {
					 var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
					 if(check.test(val)) {
						 updateNetwork.validationName = false;
					 }else {
						 updateNetwork.validationName = true;
					 }


				 }else {
					 updateNetwork.validationName = false;
				 }
			 }

			 $.each(updateNetwork.networkNames , function(i , name){
				 if(name == val) {
				 	// console.log(name);
					//  console.log("org",updateNetwork.orgNetworkName);

				 	if(name == updateNetwork.orgNetworkName) {
						updateNetwork.validationNames = true;
					}else {
						updateNetwork.validationNames = false;
						// console.log("중복" , updateNetwork.orgNetworkName + " : " + name);
						return false;
					}

				 }
				 updateNetwork.validationNames = true;
			 })

		 },
		 networkLable : function(val) {

		 	if(val != null){
				if(val.length == 0) {
					updateNetwork.validationLabel = true;
				}else {
					if(this.checkInputName(val).result) {
						updateNetwork.validationLabel = false;
					}else {
						if(val.length >= 4) {
							var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
							if(check.test(val)) {
								updateNetwork.validationLabel = false;
							}else {
								updateNetwork.validationLabel = true;
							}


						}else {
							updateNetwork.validationLabel = false;
						}

					}
				}
			}else {
				updateNetwork.validationLabel = true;
			}


		 },
		 networkVlan : function (val) {
			 var regNumber = /^[0-9]*$/;
			 if(regNumber.test(val)) {
				 if(val.length >= 1 && val.length <= 4) {
					 var str = val.substr(0,1);
					 if(str == 0) {
						 // console.log("첫번쨰 값이 0으로 입력되었습니다 ",str);
						 updateNetwork.validationVlan = false;
					 }else {
						 // console.log("제대로 입력되었습니다 ", str);
						 if(val <= 4094) {
							 updateNetwork.validationVlan = true;
						 }else {
							 updateNetwork.validationVlan = false;
						 }

					 }

				 }

			 }else {
				 updateNetwork.validationVlan = false;
			 }

			 if(val == "") {
				 updateNetwork.validationVlan = true;
			 }

			 if(val == null) {
				 updateNetwork.validationVlan = true;
			 }

		 },
		 networkMtu : function (val) {
			 var regNumber = /^[0-9]*$/;

			 if(regNumber.test(val)) {
				 if(val.length >= 1 && val.length <= 10) {
					 var str = val.substr(0,1);
					 if(str == 0) {
						 // console.log("첫번쨰 값이 0으로 입력되었습니다 ",str);
						 updateNetwork.validationMtu = false;
					 }else {
						 // console.log("제대로 입력되었습니다 ", str);

						 if(val <= 2147483647) {
							 updateNetwork.validationMtu = true;
						 }else {

							 updateNetwork.validationMtu = false;
						 }

					 }

				 }

			 }else {
				 updateNetwork.validationMtu = false;
			 }


			 if(val == "") {
				 updateNetwork.validationMtu = true;
			 }
		 }
	}
});