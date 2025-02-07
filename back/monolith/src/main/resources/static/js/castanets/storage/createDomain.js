var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var createDomainVue = new Vue({
	router: router,
	el: '#createDomainVue',
	data: {
		spinnerOn: true,
		domainId: '',
		isUpdate: false,
		isExistIso: true,
		domain:{
			name: '',
			description: '',
			domainType: 'data',
			storageType: 'NFS',
			hostId: '',
			path: '',
			iscsi: {
				address: '',
				port: '3260',
				authAt: false,
				id: '',
				password: '',
				target: '',
				loginAt: false
			},
			importAt: false,
			lunVos: []
		},
		iscsis: [],
		hosts: [],
		domainTypes: [
			{ id: 'export', name: '내보내기' },
			{ id: 'data', name: '데이터' },
			{ id: 'iso', name: 'ISO' }
		],
		domainNameStatus: false,
		selectVo: {
			domainTypes: {
				list: [],
				selected: { id:'data', name:'데이터' }
			},
			storageTypes: {
				list: [
					{ id: 'NFS', name: 'NFS' },
					{ id: 'ISCSI', name: 'ISCSI' },
					// { id: 'FCP', name: '파이버채널' }
				],
				selected: { id: 'NFS', name: 'NFS' }
			},
			hosts: {
				list: [],
				selected: {}
			}
		},
		initVal: {
			domainTypes: { id:'data', name:'데이터' },
			storageTypes: { id: 'NFS', name: 'NFS' },
			hosts: {}
		},
		retrieveLunVosHosts: {},				//host정보안에 lun 정보 담겨있는 response 받는 용도
		lunVosHosts: [],						//retrieveLunVosHosts에서 list 형식으로 던져주는 lun 정보 받는 용도
		lunVos: []								//선택한 host 값에 따라 lunHostId가 동일한 값만 보여주기 위한 용도
	},
	watch: {
		'domain.storageType': function (){
			if(this.domain.storageType === 'FCP'){
				this.retrieveLunVos();
			}
		},
		'domain.hostId': function(){
			if(this.domain.storageType === 'FCP'){
				this.retrieveLunVos();
			}
		}
	},
	mounted: function () {
		// get parameter
		// this.domainId = this.$route.query.id;
		this.domain.importAt = this.$route.query.isImport;
		
		if(this.domain.isImport === undefined){
			this.domain.importAt = false;
		}
		
		this.$EventBus.$on('getUpdateDomainId', id =>{
			this.domainId = id;
			this.isUpdate = true;
			this.retrieveCreateDomainInfo();
		});

		if(this.domainId === undefined || this.domainId === ''){
			this.isUpdate = false;
		}else{
			this.isUpdate = true;
		}

		this.retrieveDomainMeta();
		this.retrieveHosts();

		//selectVo.domainTypes.list에서 isExistIso && domainType.name == 'ISO' 조건 만족하면 리스트에서 제거
		this.$EventBus.$on('retrieveDomainTypeList', data =>{
			let arr = [];

			this.domainTypes.forEach(domainType =>{
				if(domainType.name === 'ISO' && this.isExistIso){

				}else{
					arr.push(domainType);
				}
			})
			this.selectVo.domainTypes.list = arr;
		})
	},
	methods: {
		retrieveDomainMeta: function() {
			this.$http.get('/storage/domains/retrieveDomainMeta').then(function(response) {
//				this.clusters = response.data.domainTypeList;
//				console.log('domainTypeList' ,  response.data.domainTypeList);
//				console.log('storageTypeList' ,  response.data.storageTypeList);
//				console.log('isExistIso' ,  response.data.isExistIso);
				this.isExistIso = response.data.isExistIso;
			}.bind(this)).catch(function(error) {
			    console.log(error);
			});
		}, // end retrieveDomainMeta
		retrieveDomainISO: function() {
			this.$http.get('/storage/domains/retrieveDomainMeta').then(function(response) {
//				this.clusters = response.data.domainTypeList;
//				console.log('domainTypeList' ,  response.data.domainTypeList);
//				console.log('storageTypeList' ,  response.data.storageTypeList);
			}.bind(this)).catch(function(error) {
			    console.log(error);
			});
		}, // end retrieveDomainISO
		retrieveCreateDomainInfo: function() {
			this.$http.get('/v2/storage/domains/'+this.domainId+'/create').then(function(response) {
				this.domain = response.data.resultKey;
				// if (this.domain.storageType == "FCP") {
				// 	this.domain.storageType = "파이버 채널";
				// }

				this.spinnerOn = false;
			}.bind(this)).catch(function(error) {
				console.log(error);
			});
		}, // end retrieveCreateDomainInfo
		iscsiDiscover: function() {
			if(this.domain.hostId==''){
				alert("호스트를 선택해주세요.");
				return
			}
			
			if(this.domain.iscsi.address==''){
				alert("ISCSI 주소를 입력해주세요.");
				return
			}
			if(this.domain.iscsi.port==''){
				alert("ISCSI 포트를 입력해주세요.");
				return
			}
			
			this.$http.post('/storage/domains/iscsiDiscover', this.domain).then(function(response) {
//				console.log('result' ,  response.data.resultKey);
				this.iscsis = response.data.resultKey;
			}.bind(this)).catch(function(error) {
				console.log(error);
				alert("검색에 실패하였습니다.");
			});
		}, // end iscsiDiscover
		iscsiLogin: function(iscsi) {
			this.domain.iscsi.target = iscsi.target;
			this.domain.iscsi.address = iscsi.address;
			this.domain.iscsi.port = iscsi.port;
			this.$http.post('/storage/domains/iscsiLogin', this.domain).then(function(response) {
//				console.log('result' ,  response.data.resultKey);
				this.domain.iscsi.loginAt = response.data.resultKey;
				alert("연결되었습니다."); 
			}.bind(this)).catch(function(error) {
				alert("연결에 실패하였습니다.");
				console.log(error);
			});
		}, // end iscsiLogin
		iscsiRetrieve: function() {
//			console.log('result' ,  this.domain.storageType);
			
//			this.$http.post('/storage/domains/iscsiRetrieve', this.domain).then(function(response) {
//				console.log('result' ,  response.data.resultKey);
//			}.bind(this)).catch(function(error) {
//				console.log(error);
//			});
		}, // end iscsiRetrieve
		retrieveHosts: function() {
			this.$http.get('/storage/domains/retrieveHosts').then(function(response) {
				this.hosts = response.data.resultKey;
//				console.log('hosts' ,  this.hosts);
				
				if(this.hosts == null || this.hosts.length == 0){
					alert("스토리지 도메인을 생성하려면 호스트를 먼저 등록해주시기 바랍니다.");
					location.href = '/storage/domains';
				}
				if(!this.isUpdate){
					this.spinnerOn = false;
				}

				//host selectvo init
				let arr = [];
				this.hosts.forEach(host =>{
					arr.push({ id: host.id, name: host.name });
				})
				this.selectVo.hosts.list = JSON.parse(JSON.stringify(arr));
				this.selectVo.hosts.selected = JSON.parse(JSON.stringify(arr[0]));
				this.initVal.hosts = JSON.parse(JSON.stringify(arr[0]));

				this.domain.hostId = JSON.parse(JSON.stringify(arr[0].id));
			}.bind(this)).catch(function(error) {
			    console.log(error);
			});
		}, // end retrieveHosts
		createDomain: function(){
			if(this.domain.hostId == ''){
				alert("사용할 호스트를 선택해주세요.");
				return;
			}
			if(this.domain.name == ''){
				alert("스토리지 도메인 이름을 입력해주세요.");
				return;
			}
			if(this.domain.storageType == 'NFS' && this.domain.path == ''){
				alert("내보내기 경로를 입력해주세요.");
				return;
			}
			
			if(this.domain.storageType == 'ISCSI' && this.domain.iscsi.loginAt == false){
				alert("ISCSI 연결해주세요.");
				return;
			}

			if(this.domain.storageType === 'FCP' && !($("input:checkbox[name='lunChkbox']").is(":checked"))){
				alert('lun 정보를 선택해주세요.');
				return;
			}else{
				// this.domain.lunVos = [];
				//
				// $.each($("input[name='lunChkbox']:checked"), function(){
				// 	this.domain.lunVos.push(lun);
				// 	console.log('this.domain.lunVos = ', this.domain.lunVos);
				// });
			}

			this.spinnerOn = true;
			this.$http.post('/v2/storage/domains', this.domain).then(function(response) {
				this.spinnerOn = false;
				this.$EventBus.$emit('retrieveDomains');
				this.init();
				this.closePop('createDomainVue');
			}.bind(this)).catch(function(error) {
				alert('에러가 발생했습니다.');
				this.spinnerOn = false;
				this.init();
				this.closePop('createDomainVue');
			});

			// this.timer = setTimeout(function() {this.spinnerOn = true;}, 1000);
//			setTimeout(() => {this.spinnerOn = true;}, 1000);
		}, // end createDomain
		updateDomain: function(){
			this.$http.put('/storage/domains/'+this.domainId, this.domain).then(function(response) {
				// location.href='/storage/domains';
			}.bind(this)).catch(function(error) {
				console.log(error);
			});
			// this.timer = setTimeout(function() {this.spinnerOn = true;}, 1000);
//			setTimeout(() => {this.spinnerOn = true;}, 1000);
		}, // end updateDomain
		goList: function() {
			location.href='/storage/domains';
		}, // end goList
		checkDomainName: function() {
			this.domainNameStatus = this.checkInputName(this.domain.name).result;
		},
		setSelected: function (selectedItems, index){
			if(index === 10001){
				this.domain.domainType = selectedItems.id;
			}else if(index === 10002){
				this.domain.storageType = selectedItems.id;
			}else if(index === 10003){
				this.domain.hostId = selectedItems.id;
			}
		},
		closePop: function(modalType){
			this.init();
			this.$EventBus.$emit('closeUpdateModal');
		},
		init: function (){
			this.isUpdate = false;
			this.domain.name = '';
			this.domain.description = '';
			this.domain.domainType = 'data';
			this.domain.storageType = 'NFS';
			this.domain.hostId = '';
			this.domain.path = '';

			if(this.domain.iscsi != null || this.domain.iscsi != undefined){
				this.domain.iscsi.address = '';
				this.domain.iscsi.port = '3260';
				this.domain.iscsi.authAt = false;
				this.domain.iscsi.id = '';
				this.domain.iscsi.password = '';
				this.domain.iscsi.target = '';
				this.domain.iscsi.loginAt = false;
			}
			this.domain.importAt = false;

			this.selectVo.domainTypes.selected = this.initVal.domainTypes;
			this.selectVo.storageTypes.selected = this.initVal.storageTypes;
			this.selectVo.hosts.selected = this.initVal.hosts;
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
		retrieveLunVos: function (){
			var self = this;
			this.$http.get('/compute/hosts/retrieveLunHostsInfo?status=all').then(function (response) {
				if(response.data.resultKey !== null && response.data.resultKey !== undefined){
					self.retrieveLunVosHosts = response.data.resultKey;

					for(var i=0; i<self.retrieveLunVosHosts.length; i++){
						self.lunVosHosts = self.retrieveLunVosHosts[i].lunVos;
					}

					self.lunVos = [];
					self.lunVosHosts.forEach(data=>{
						if(data.lunHostId === self.selectVo.hosts.selected.id){
							self.lunVos.push(data);
						}
					})
				}
			});
		},
		setLunId: function (lun){
			let self = this;
			var index = self.domain.lunVos.indexOf(lun);

			if(index < 0){
				//일치하는게 없으면
				self.domain.lunVos.push(lun);
			}else{
				self.domain.lunVos.splice(index, 1);
			}
		}
	}, // end methods
})
