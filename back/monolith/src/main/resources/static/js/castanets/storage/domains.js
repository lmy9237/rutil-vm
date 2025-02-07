Vue.prototype.$http = axios;

var router = new VueRouter({
	mode: 'history',
//    routes: []
});

var domainsVue = new Vue({
	router: router,
	el: '#domainsVue',
	data: {
		domains: [],
		selectedDomains: [],
		selectedDomainInfo: {
			id: '',
			name: '',
			format: false
		},
		subscription: {},
		spinnerOn: true,
		pagingVo: {
			viewList: []			//선택한 페이지 클릭시 보여주는 리스트
		}
	},
	mounted: function () {
		// get parameter
		this.status = this.$route.query.status == null ? 'all' : this.$route.query.status;
		this.domainType = this.$route.query.domainType == null ? 'all' : this.$route.query.domainType;

		// up or !up 만 처리
		if(this.status == 'up'){
			this.status = 'active';
		}

		this.retrieveDomains(true);
		this.wsSubscription();
		this.timer = setInterval(this.retrieveDomains(false), 300 * 1000);

		this.$EventBus.$on('retrieveDomains', data =>{
			this.retrieveDomains(true);
		})

		this.$EventBus.$on('closeUpdateModal', data =>{
			this.closeDomainModal('createDomainVue');
		})

	},
	methods: {
		wsConnectionWait: function () {
			setTimeout(function() {domainsVue.wsSubscription();}, 2000);
		},
		wsSubscription: function () {
			if(wsVue.stompClient != null && wsVue.stompClient.connected){
				this.subscription = wsVue.stompClient.subscribe('/topic/domains/reload', this.onMessage);
			}else{
				this.wsConnectionWait();
			}
		},
		onMessage: function (res) {
			this.retrieveDomains();
		},
		retrieveDomains: function(isSpinnerOn) {
			if(isSpinnerOn){
				this.spinnerOn = true;
			}else{
				this.spinnerOn = false;
			}

			this.$http.get('/v2/storage/domains?status='+this.status+'&domainType='+this.domainType).then(function(response) {
				this.domains = response.data.resultKey;

				this.selectedDomains = [];
				this.domains.forEach(domain => {
					if (domain.storageType == "FCP") {
						domain.storageType = "파이버 채널";
					}
				});

				this.spinnerOn = false;
			}.bind(this)).catch(function(error) {
			    console.log(error);
				this.spinnerOn = false;
			});

		},// end retrieveDomains
		// goCreateDomain: function() {
		// 	window.location.href = "/storage/createDomain";
		// },// end goCreateDomain
		goImportDomain: function() {
			window.location.href = "/storage/importDomain?isImport=true";
		},// end goCreateDomain
		goUpdateDomain: function() {
			window.location.href = "/storage/updateDomain?id="+this.selectedDomains[0].id;
		},// end goUpdateDomain
		// removeDomainShowModal: function(index) {
		// 	this.removeDomainInfo.id = this.selectedDomains[0].id;
		// 	this.removeDomainInfo.name = this.selectedDomains[0].name;
		// 	// $(".removeDomainModal").modal('show');
		//
		// 	document.getElementById('domainDeleteModal').classList.add('active');
		// },
		removeDomain: function() {
			document.getElementById('domainDeleteModal').classList.remove('active');

			// $(".removeDomainModal").modal('hide');
			this.$http.post('/storage/domains/removeDomain', this.selectedDomainInfo).then(function(response) {
				this.spinnerOn = true;
				this.retrieveDomains(true);
			}.bind(this)).catch(function(error) {
			    console.log(error);
			});				
//			console.log("selectedDomains", this.selectedDomains);
//			if(confirm('스토리지 도메인을 삭제 하시겠습니까?\n' + this.selectedDomains[0].name)){
//				this.$http.post('/storage/domains/removeDomain', this.getSelectedDomainIds()).then(function(response) {
////					console.log(response);
//					this.spinnerOn = true;
//					this.retrieveDomains();
//				}.bind(this)).catch(function(error) {
//				    console.log(error);
//				});				
//			}
		},// end removeDomain
		maintenanceStart: function() {
			if(this.selectedDomains.length == 0){
				alert("유지보수 모드로 전환할 스토리지 도메인을 선택해주세요.");
				return;
			}else if(this.selectedDomains.length != 1){
				alert("유지보수 모드로 전환할 스토리지 도메인을 1개만 선택해주세요.");
				return;
			}
			
// 			if(confirm('스토리지 도메인을 유지보수 모드로 전환하시겠습니까?\n' + this.selectedDomains[0].name)){
// 				this.$http.post('/storage/domains/maintenanceStart', this.getSelectedDomainIds() ).then(function(response) {
// //					console.log("response", response);
// 					this.spinnerOn = true;
// 					this.retrieveDomains();
// 				}.bind(this)).catch(function(error) {
// 				    console.log(error);
// 				});
// 			}

			this.$http.post('/storage/domains/maintenanceStart', this.getSelectedDomainIds() ).then(function(response) {
				this.spinnerOn = true;
				this.retrieveDomains(true);
			});

		},// end maintenanceStart
		maintenanceStop: function() {
			if(this.selectedDomains.length == 0){
				alert("유지보수 모드를 해제할 스토리지 도메인을 선택해주세요.");
				return;
			}else if(this.selectedDomains.length != 1){
				alert("유지보수 모드를 해제할 스토리지 도메인을 1개만 선택해주세요.");
				return;
			}
			
// 			if(confirm('스토리지 도메인의 유지보수 모드를 해제하여 활성화 하시겠습니까?\n' + this.selectedDomains[0].name)){
// 				this.$http.post('/storage/domains/maintenanceStop', this.getSelectedDomainIds() ).then(function(response) {
// //					console.log("response", response);
// 					this.spinnerOn = true;
// 					this.retrieveDomains();
// 				}.bind(this)).catch(function(error) {
// 				    console.log(error);
// 				});
// 			}

			this.$http.post('/storage/domains/maintenanceStop', this.getSelectedDomainIds() ).then(function(response) {
			this.spinnerOn = true;
			this.retrieveDomains(true);
			});

		},// end maintenanceStop
		getSelectedDomainIds: function() {
			var selectedDomainIds = [];
			for(var i=0; i < this.selectedDomains.length ; i++){
				selectedDomainIds.push( this.selectedDomains[i].id);
			}
			return selectedDomainIds;
		},// end getSelectedDomainIds
		isPosibleActive: function() {
			if(this.selectedDomains.length == 1){
				var status = this.selectedDomains[0].status;
				if(status == 'maintenance' || status == 'preparing_for_maintenance'){
					return true;
				}
			}
			return false;
		},// end isPosibleActive
		isPosibleMaintenance: function() {
			if(this.selectedDomains.length == 1){
				var status = this.selectedDomains[0].status;
				if(status == 'active' || status == 'unknown'){
					return true;
				}
			}
			return false;
		},// end isPosibleMaintenance
		isPosibleDelete: function() {
			if(this.selectedDomains.length == 1){
				var status = this.selectedDomains[0].status;
				if(status == 'maintenance' || status == 'unattached'){
					return true;
				}
			}
			return false;
		},// end isPosibleDelete
		getSelectedDomainIds: function() {
			var selectedDomainIds = [];
			for(var i=0; i < this.selectedDomains.length ; i++){
				selectedDomainIds.push( this.selectedDomains[i].id);
			}
			return selectedDomainIds;
		},// end getSelectedDomainIds
		selectDomain: function(domain) {
			// var index = this.selectedDomains.indexOf(domain);

			//selectedDomains에 domain 정보가 있음
			if(this.selectedDomains.length != 0){
				if(domain.name == this.selectedDomains[0].name) {
					//1. 똑같은 domain 정보 toggle할 경우
					this.selectedDomains.splice(0, 1);
				}else{
					//2. 다른 domain 정보 클릭한 경우
					this.selectedDomains.splice(0, 1);
					this.selectedDomains.push(domain);
				}
			}else{
				this.selectedDomains.push(domain);
			}

		},// end selectHost
		showDomainModal: function(modalType) {
			if(modalType === 'createDomainVue' || modalType === 'update'){
				this.$EventBus.$emit('retrieveDomainTypeList');

				if(modalType === 'update') {
					modalType = 'createDomainVue';
					this.selectedDomainInfo.id = this.selectedDomains[0].id;
					this.selectedDomainInfo.name = this.selectedDomains[0].name;

					this.$EventBus.$emit('getUpdateDomainId', this.selectedDomains[0].id);
				}
			}else{
				this.selectedDomainInfo.id = this.selectedDomains[0].id;
				this.selectedDomainInfo.name = this.selectedDomains[0].name;
			}
			document.getElementById(modalType).classList.add('active');
		},
		closeDomainModal: function(modalType){

			document.getElementById(modalType).classList.remove('active');
			this.selectedDomains.splice(0, 1);
			this.togglePop();
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
	},
	computed: {
        selectAll: {
            get: function () {
                return this.selectedDomains ? this.selectedDomains.length == this.domains.length : false;
            },
            set: function (value) {
                var selected = [];

                if (value) {
                    this.domains.forEach(function (domain) {
						selected.push(domain);
                    });
                }

                this.selectedDomains = selected;
            }
        }
    },
})
