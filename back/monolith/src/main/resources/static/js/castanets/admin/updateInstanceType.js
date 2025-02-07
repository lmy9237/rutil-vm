Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
	router: router,
	el: '#targetInstanceType',
	data: {
		targetInstanceType: {
			nics: [],
			memoryBalloon: true
		},
		selectNics: [],
		instanceImageAdd: true,
		nic: '',
		memory: '',
		maximumMemory: '1024 MB',
		physicalMemory: '256 MB',
		totalCpu: 1,
		divisors: [1],
		virtualSockets: 1,
		coresPerVirtualSocket: 1,
		threadsPerCore: 1,
		// highAvailability: false,
		spinnerOn: true,
		firstDevice: '',
		secondDevice: '',
		// firstDevices: [
		// 	{name: '하드 디스크', value: 'hd'},
		// 	{name: 'CD-ROM', value: 'cdrom'},
		// 	{name: '네트워크(PXE)', value: 'network'}
		// ],
		// secondDevices: [
		// 	{name: '없음', value: 'none'},
		// 	{name: '하드 디스크', value: 'hd'},
		// 	{name: 'CD-ROM', value: 'cdrom'},
		// 	{name: '네트워크(PXE)', value: 'network'}
		// ],
		ioThreadsEnabled: false,
		instanceNameStatus: false,
		validInstanceName: false,
		isActiveGeneral: true,						//일반 tab active check
		isActiveBootOption: false,					//부트옵션 tab active check
		isActiveSystem: false,						//시스템 tab active check
		isActiveHost: false,						//호스트 tab active check
		isActiveResourceAssign: false,				//리소스 할당 tab active check
		id: '',
		updateSelectVo: {
			nicSelectVo: { list: [], selected: {} },
			firstDevicesVo: {
				list: [
					{ id: 'hd', name: '하드 디스크' },
					{ id: 'cdrom', name: 'CD-ROM' },
					{ id: 'network', name: '네트워크(PXE)' }
				],
				selected: {}
			},
			secondDevicesVo: {
				list: [
					{ id: 'none', name: '없음'},
				 	{ id: 'hd', name: '하드 디스크' },
					{ id: 'cdrom', name: 'CD-ROM' },
					{ id: 'network', name: '네트워크(PXE)'}
				],
				selected: {}
			},
			divisorVoVirtualSockets: {
				list: [],
				selected: {}
			},
			divisorVoCoresPerVirtualSocket: {
				list: [],
				selected: {}
			},
			divisorVoThreadsPerCore: {
				list: [],
				selected: {}
			},
			updateSelectVo: {
				list: [{id: 'VNC', name: 'VNC'}],
				selected: {id: 'VNC', name: 'VNC'}
			},
			monitor: {
				list: [{id: 1, name: 1}],
				selected: {id: 1, name: 1}
			},
			priority: {
				list: [
					{id: 1, name: '낮음'},
					{id: 50, name: '중간'},
					{id: 100, name: '높음'}
				],
				selected: {}
			},
			affinity: {
				list: [
					{id: "migratable", name: "수동 및 자동 마이그레이션 허용"},
					{id: "user_migratable", name: "수동 마이그레이션만 허용"},
					{id: "pinned", name: "마이그레이션을 허용하지 않음"}
				],
				selected: {}
			},
			customMigrationUsed: {
				list: [
					{ id: "Legacy", name: "Legacy" },
					{ id: "Minimal downtime", name: "Minimal downtime" },
					{ id: "Post-copy migration", name: "Post-copy migration" },
					{ id: "Suspend workload if needed", name: "Suspend workload if needed" }
				],
				selected: {}
			},
			autoConverge: {
				list: [
					{ id: "inherit", name: "클러스터 설정에서 가져오기" },
					{ id: "true", name: "자동 통합" },
					{ id: "false", name: "자동 통합 해제" }
				],
				selected: {}
			},
			compressed: {
				list: [
					{ id: "inherit", name: "클러스터 설정에서 가져오기" },
					{ id: "true", name: "압축" },
					{ id: "false", name: "압축 해제" }
				],
				selected: {}
			}

		}
	},
	mounted: function() {
		// get parameter
		// this.id = this.$route.query.instanceTypeId;
		this.spinnerOn = false;

		this.$EventBus.$on('openUpdateModal', id =>{
			this.id = id;
			this.retrieveInstanceTypeUpdateInfo();
			this.systemSelectboxSelected();
			this.resetCpu();
		})
	}, 
	methods: {
		// retrieve instance type update info
		retrieveInstanceTypeUpdateInfo: function() {
			this.$http.get('/admin/retrieveInstanceTypeUpdateInfo?id=' + this.id).then(function(response) {
				
				this.targetInstanceType = response.data.resultKey;
				
				// 시스템
				this.memory = this.targetInstanceType.memory/1024/1024 + " MB";
				this.maximumMemory = this.targetInstanceType.maximumMemory/1024/1024 + " MB";
				this.physicalMemory = this.targetInstanceType.physicalMemory/1024/1024 + " MB";
				this.totalCpu = this.targetInstanceType.virtualSockets * this.targetInstanceType.coresPerVirtualSocket * this.targetInstanceType.threadsPerCore;
				
				// totalCpu watch 때문에 따로 세팅
				var self = this;
				
				setTimeout(function() { 
					self.virtualSockets = self.targetInstanceType.virtualSockets;
					self.coresPerVirtualSocket = self.targetInstanceType.coresPerVirtualSocket;
					self.threadsPerCore = self.targetInstanceType.threadsPerCore;
				}, 500);
				
				// 부트옵션
				this.firstDevice = this.targetInstanceType.firstDevice;
				this.secondDevice = this.targetInstanceType.secondDevice;
				
				// 고가용성
				// this.highAvailability = this.targetInstanceType.highAvailability;
				
				// 리소스 할당
				this.ioThreadsEnabled = this.targetInstanceType.ioThreadsEnabled;
				this.targetInstanceType.virtioScsiEnabled = true; // 어디서 가져와야되나?

				this.retrieveSelectbox();

				this.spinnerOn = false;
			}.bind(this)).catch(function(error) {
	            console.log(error);
	        });
		},
		memoryChange: function() {
			if (this.memory.includes("GB") || this.memory.includes("gb")) {
				this.memory = this.memory.replace(/[^0-9]/g, '');
				this.memory = this.memory * 1024;
				this.maximumMemory = this.memory * 4;
			} else if (this.memory.includes("MB") || this.memory.includes("mb")) {
				this.memory = this.memory.replace(/[^0-9]/g, '');
				this.maximumMemory = this.memory * 4;
			} else {
				this.maximumMemory = this.memory * 4;
			}

			this.memory = this.memory + " MB";
			this.maximumMemory = this.maximumMemory + " MB";
			this.physicalMemory = this.memory;
		},
		maximumMemoryChange: function() {
			if (this.maximumMemory.includes("GB") || this.maximumMemory.includes("gb")) {
				this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
				this.maximumMemory = this.maximumMemory * 1024;
			} else if (this.maximumMemory.includes("MB") || this.maximumMemory.includes("mb")) {
				this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
			}

			this.maximumMemory = this.maximumMemory + " MB";
		},
		physicalMemoryChange: function() {
			if(parseInt(this.physicalMemory.replace(/[^0-9]/g,'')) > parseInt(this.memory.replace(/[^0-9]/g,''))) {
				alert("시스템 항목의 메모리 크기보다 클 수 없습니다.");
				this.physicalMemory = this.memory;
			}

			if(this.physicalMemory.includes("GB") || this.physicalMemory.includes("gb")) {
				this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g,'');
				this.physicalMemory = this.physicalMemory*1024;
			} else if(this.physicalMemory.includes("MB") || this.physicalMemory.includes("mb")) {
				this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g,'');
			}

			this.physicalMemory = this.physicalMemory + " MB";
		},
		selectVirtualSockets: function() {

			var value = this.totalCpu/this.virtualSockets;
			
			if(this.threadsPerCore == value) {
				this.coresPerVirtualSocket = 1;
			} else {
				this.coresPerVirtualSocket = value;
				this.threadsPerCore = 1;
			}

		},
		selectCoresPerVirtualSocket: function() {

			var result = this.virtualSockets*this.coresPerVirtualSocket;
			
			if(this.totalCpu > result) {
				if(this.virtualSockets == 1) {
					this.virtualSockets = this.totalCpu/result;
					this.threadsPerCore = 1;
				} else {
					if(result%2 === 1) {
						this.virtualSockets = this.totalCpu/this.coresPerVirtualSocket;
						this.threadsPerCore = 1;
					} else {
						this.threadsPerCore = this.totalCpu/(result);
					}
				}
			} else {
				this.virtualSockets = this.totalCpu/this.coresPerVirtualSocket;
				this.threadsPerCore = 1;
			}
		},
		selectThreadsPerCore: function() {

			var result = this.virtualSockets*this.threadsPerCore;
			
			if(this.totalCpu > result) {
				if(this.virtualSockets == 1) {
					if(result%2 == 1) {
						this.virtualSockets = this.totalCpu/this.threadsPerCore;
						this.coresPerVirtualSocket = 1;
					} else {
						this.coresPerVirtualSocket = this.totalCpu/result;
					}
				} else {
					if(result%2 == 1) {
						this.virtualSockets = this.totalCpu/this.threadsPerCore;
						this.coresPerVirtualSocket = 1;
					} else {
						this.coresPerVirtualSocket = this.totalCpu/result;
					}
				}
			} else {
				this.virtualSockets = this.totalCpu/this.threadsPerCore;
				this.coresPerVirtualSocket = 1;
			}
		},
		checkInstanceName: function() {
			if (this.targetInstanceType.name.length >= 4) {
				this.validInstanceName = false;
			} else {
				this.validInstanceName = true;
			}

			this.instanceNameStatus = this.checkInputName(this.targetInstanceType.name).result;
		},
		updateInstanceType :function() {

			if(this.validInstanceName) {
				alert("인스턴스 유형의 이름은 4글자 이상 입력해야 합니다.");
			} else {
				var checkResult = this.checkInputName(this.targetInstanceType.name);

				if (checkResult.result) {
					alert("인스턴스 유형의 이름은 " + checkResult.msg);
				} else {
					this.targetInstanceType.selectNics = [];

					if (this.nic !== '') {
						this.targetInstanceType.selectNics.push(this.nic);
					}

					// 시스템
					this.targetInstanceType.memory = this.memory === 0 ? 1024 : this.memory.replace(/[^0-9]/g, '') * 1024 * 1024;
					this.targetInstanceType.maximumMemory = this.maximumMemory === 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
					this.targetInstanceType.physicalMemory = this.physicalMemory === 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
					this.targetInstanceType.coresPerVirtualSocket = this.coresPerVirtualSocket;
					this.targetInstanceType.virtualSockets = this.virtualSockets;
					this.targetInstanceType.threadsPerCore = this.threadsPerCore;

					// 부트옵션
					this.targetInstanceType.firstDevice = this.firstDevice;
					this.targetInstanceType.secondDevice = this.secondDevice;

					// 리소스 할당
					this.targetInstanceType.ioThreadsEnabled = this.ioThreadsEnabled ? 1 : 0;

					this.$http.post('/admin/instanceType/updateInstanceType', this.targetInstanceType).then(function (response) {
						location.href = '/admin/instanceTypes';
					}.bind(this)).catch(function (error) {
						console.log(error);
					});
				}
			}
		},
		goBack: function() {
			history.back();
		},
		closePop: function(){
			document.getElementById('targetInstanceType').classList.remove('active');

			this.isActiveGeneral = true;
			this.isActiveBootOption = false;
			this.isActiveSystem = false;
			this.isActiveHost = false;
			this.isActiveResourceAssign = false;

		},
		retrieveSelectbox: function (){
			//nic1
			this.targetInstanceType.nics.forEach(nic =>{
				this.updateSelectVo.nicSelectVo.list.push({id: nic, name: nic.networkName});
			})
			this.updateSelectVo.nicSelectVo.selected = { id: this.nic, name: '비어있음' };

			//firstDevice
			for(var i of this.updateSelectVo.firstDevicesVo.list){
				if(this.firstDevice === i.id){
					this.updateSelectVo.firstDevicesVo.selected = { id: i.id, name: i.name };
					break;
				}
			}

			//secondDevice
			for(var i of this.updateSelectVo.secondDevicesVo.list){
				if(this.secondDevice === i.id){
					this.updateSelectVo.secondDevicesVo.selected = { id: i.id, name: i.name };
					break;
				}
			}

			//실행/마이그레이션 큐에서 우선 순위
			for(var i of this.updateSelectVo.priority.list){
				if(this.targetInstanceType.priority === i.id){
					this.updateSelectVo.priority.selected = { id: i.id, name: i.name};
					break;
				}
			}

			//마이크레이션 모드
			for(var i of this.updateSelectVo.affinity.list){
				if(this.targetInstanceType.affinity === i.id){
					this.updateSelectVo.affinity.selected = { id: i.id, name: i.name};
					break;
				}
			}

			//사용자 정의 마이그레이션 정책 사용
			for(var i of this.updateSelectVo.customMigrationUsed.list){
				if(this.targetInstanceType.customMigration === i.id){
					this.updateSelectVo.customMigrationUsed.selected = { id: i.id, name: i.name};
					break;
				}
			}

			//마이그레이션 자동 통합
			for(var i of this.updateSelectVo.autoConverge.list){
				if(this.targetInstanceType.autoConverge === i.id){
					this.updateSelectVo.autoConverge.selected = { id: i.id, name: i.name};
					break;
				}
			}

			//마이그레이션 압축 활성화
			for(var i of this.updateSelectVo.compressed.list){
				if(this.targetInstanceType.compressed === i.id){
					this.updateSelectVo.compressed.selected = { id: i.id, name: i.name};
					break;
				}
			}
		},
		toggleTabActive: function (tabType){
			this.isActiveGeneral = false;
			this.isActiveBootOption = false;
			this.isActiveSystem = false;
			this.isActiveHost = false;
			this.isActiveInitialExecute = false;
			this.isActiveResourceAssign = false;

			if(tabType === 'isActiveGeneral'){
				this.isActiveGeneral = true;
			}else if(tabType === 'isActiveBootOption'){
				this.isActiveBootOption = true;
			}else if(tabType === 'isActiveSystem'){
				this.isActiveSystem = true;
			}else if(tabType === 'isActiveHost'){
				this.isActiveHost = true;
			}else if(tabType === 'isActiveInitialExecute'){
				this.isActiveInitialExecute = true;
			}else if(tabType === 'isActiveResourceAssign'){
				this.isActiveResourceAssign = true;
			}
		},
		setSelected: function(selectItems, index){
			if(index === 10001){
				this.nic = selectItems;
			}else if(index === 10002){
				this.firstDevice = selectItems.id;
			}else if(index === 10003){
				this.secondDevice = selectItems.id;
			}else if(index === 10004){
				this.virtualSockets = selectItems.id;
				this.selectVirtualSockets();
				this.systemSelectboxSelected();
				this.resetCpu();
			}else if(index === 10005){
				this.coresPerVirtualSocket = selectItems.id;
				this.selectCoresPerVirtualSocket();
				this.systemSelectboxSelected();
				this.resetCpu();
			}else if(index === 10006){
				this.threadsPerCore = selectItems.id;
				this.selectThreadsPerCore();
				this.systemSelectboxSelected();
				this.resetCpu();
			}else if(index === 10007){
				//그래픽프로토콜/모니터는 딱히 액션이 없음 -> 차후 제거 예정
			}else if(index === 10008){
				//그래픽프로토콜/모니터는 딱히 액션이 없음 -> 차후 제거 예정
			}else if(index === 10009){
				this.targetInstanceType.priority = selectItems.id;
			}else if(index === 10010){
				this.targetInstanceType.affinity = selectItems.id;
			}else if(index === 10011){
				this.targetInstanceType.customMigration = selectItems.id;
			}else if(index === 10012){
				this.targetInstanceType.autoConverge = selectItems.id;
			}else if(index === 10013){
				this.targetInstanceType.compressed = selectItems.id;
			}else {

			}
		},
		systemSelectboxSelected: function (){
			this.updateSelectVo.divisorVoVirtualSockets.selected.id = this.virtualSockets;
			this.updateSelectVo.divisorVoVirtualSockets.selected.name = this.virtualSockets.toString();

			this.updateSelectVo.divisorVoCoresPerVirtualSocket.selected.id = this.coresPerVirtualSocket;
			this.updateSelectVo.divisorVoCoresPerVirtualSocket.selected.name = this.coresPerVirtualSocket.toString();

			this.updateSelectVo.divisorVoThreadsPerCore.selected.id = this.threadsPerCore;
			this.updateSelectVo.divisorVoThreadsPerCore.selected.name = this.threadsPerCore.toString();
		},
		resetCpu: function (){
			//list가 동적으로 변하면서 custom-select list값이 오류가 나서 list 재선언
			this.updateSelectVo.divisorVoVirtualSockets.list = [];
			this.updateSelectVo.divisorVoCoresPerVirtualSocket.list = [];
			this.updateSelectVo.divisorVoThreadsPerCore.list = [];

			for (var i = 1; i <= this.totalCpu; i++) {
				if (this.totalCpu % i == 0) {
					this.updateSelectVo.divisorVoVirtualSockets.list.push({id: i, name: i.toString()});
					this.updateSelectVo.divisorVoCoresPerVirtualSocket.list.push({id: i, name: i.toString()});
					this.updateSelectVo.divisorVoThreadsPerCore.list.push({id: i, name: i.toString()});
				}
			}
		}

	},
	watch: {
		nic: function() {
			this.nic.nicName = 'nic1';
		},
		totalCpu: function(value) {
			if(!this.spinnerOn) {
				this.resetCpu();

				this.virtualSockets = parseInt(value);
				this.coresPerVirtualSocket = 1;
				this.threadsPerCore = 1;

				this.updateSelectVo.divisorVoVirtualSockets.selected = {id: parseInt(value), name: value.toString()};
				this.updateSelectVo.divisorVoCoresPerVirtualSocket.selected = {
					id: this.coresPerVirtualSocket,
					name: this.coresPerVirtualSocket.toString()
				};
				this.updateSelectVo.divisorVoThreadsPerCore.selected = {
					id: this.threadsPerCore,
					name: this.threadsPerCore.toString()
				};

				// this.systemSelectboxSelected();
			}
		},
		firstDevice: function(value) {
			if(value === 'hd'){
				this.updateSelectVo.secondDevicesVo.list = [
					{ id: 'none', name: '없음' },
					{ id: 'cdrom', name: 'CD-ROM' },
					{ id: 'network', name: '네트워크(PXE)' }
				];
			}else if(value === 'cdrom'){
				this.updateSelectVo.secondDevicesVo.list = [
					{ id: 'none', name: '없음' },
					{ id: 'hd', name: '하드 디스크' },
					{ id: 'network', name: '네트워크(PXE)' }
				];
			}else if(value === 'network'){
				this.updateSelectVo.secondDevicesVo.list = [
					{ id: 'none', name: '없음' },
					{ id: 'hd', name: '하드 디스크' },
					{ id: 'cdrom', name: 'CD-ROM' }
				];
			}else{

			}

			if(value == this.secondDevice) {
				this.secondDevice = 'none';
				this.updateSelectVo.secondDevicesVo.selected = { id: 'none', name: '없음' };
			}
		},

	},
	filters: {
		date: function(value){
			if(value == undefined || isNaN(value) || value == '' || value == null){
				return '';
			}
			
			return moment(value).format("YYYY MM DD HH:mm:ss");
		}
	}
});