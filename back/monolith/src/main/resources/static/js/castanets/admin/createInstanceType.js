Vue.prototype.$http = axios;

new Vue({
	el: '#newInstanceType',
	data: {
		newInstanceType: {
			nics: [],
			memoryBalloon: true,
			name: ''
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
		highAvailability: false,
		spinnerOn: true,
		firstDevice: 'hd',
		secondDevice: 'cdrom',
		// firstDevices: [
		// 	{name:'하드 디스크' , value:'hd'},
		// 	{name:'CD-ROM' , value:'cdrom'},
		// 	{name:'네트워크(PXE)' , value:'network'}
		// ],
		// secondDevices: [
		// 	{name:'없음' , value:'none'},
		// 	{name:'하드 디스크' , value:'hd'},
		// 	{name:'CD-ROM' , value:'cdrom'},
		// 	{name:'네트워크(PXE)' , value:'network'}
		// ],
		cpuShare: '',
		cpuShareCustomUse: false,
		ioThreadsEnabled: false,
		rngEnabled: true,
		deviceSource: 'urandom',
		showConnectionDiskModal: false,
		showCreateDiskModal: false,
		updateConnectionDiskModal: false,
		instanceNameStatus: true,
		validInstanceName: true,
		isActiveGeneral: true,						//일반 tab active check
		isActiveBootOption: false,					//부트옵션 tab active check
		isActiveSystem: false,						//시스템 tab active check
		isActiveHost: false,						//호스트 tab active check
		isActiveResourceAssign: false,				//리소스 할당 tab active check
		initVal: {
			nicSelectVo: { id: '', name: '비어있음' },
			bootFirstDevice: { id: 'hd', name: '하드 디스크' },
			bootSecondDevice: { id: 'cdrom', name: 'CD-ROM' },
			divisorVoVirtualSockets: { id: 1, name: "1" },
			divisorVoCoresPerVirtualSocket: { id: 1, name: "1" },
			divisorVoThreadsPerCore: { id: 1, name: "1" },
            priority: { id: 1, name: "낮음" },
            affinity: { id: "migratable", name: "수동 및 자동 마이그레이션 허용" },
            customMigrationUsed: { id: "Legacy", name: "Legacy" },
            autoConverge: { id: "inherit", name: "클러스터 설정에서 가져오기" },
            compressed: { id: "inherit", name: "클러스터 설정에서 가져오기" }
		},
		createSelectVo: {
			nicSelectVo: {
				list: [],
				selected: { id: '', name: '비어있음' }
			},
			bootFirstDevice: {
				list: [
				    { id: 'hd', name: '하드 디스크' },
					{ id: 'cdrom', name: 'CD-ROM' },
					{ id: 'network', name: '네트워크(PXE)' }
				],
				selected: { id: 'hd', name: '하드 디스크' }
			},
			bootSecondDevice: {	//firstDevice의 기본 selected값이 hd라서 초기화 시 hd list에 안넣음
				list: [
				    { id: 'none', name: '없음' },
					{ id: 'cdrom', name: 'CD-ROM' },
					{ id: 'network', name: '네트워크(PXE)' }
				],
				selected: { id: 'cdrom', name: 'CD-ROM' }
			},
			divisorVoVirtualSockets: {
				list: [{ id: 1, name: "1" }],
				selected: { id: 1, name: "1" }
			},
			divisorVoCoresPerVirtualSocket: {
				list: [{ id: 1, name: "1" }],
				selected: { id: 1, name: "1" }
			},
			divisorVoThreadsPerCore: {
				list: [{ id: 1, name: "1" }],
				selected:{ id: 1, name: "1" }
			},
			graphicProtocol: {
				list: [{ id: "VNC", name: "VNC" }],
				selected: { id: "VNC", name: "VNC" }
			},
			monitor: {
				list: [{ id: 1, name: "1" }],
				selected: { id: 1, name: "1" }
			},
            priority: {
			    list: [
			        { id: 1, name: "낮음"},
			        { id: 50, name: "중간"},
			        { id: 100, name: "높음"}
                ],
                selected: { id: 1, name: "낮음"}
            },
            affinity: {
                list: [
                    {id: "migratable", name: "수동 및 자동 마이그레이션 허용"},
                    {id: "user_migratable", name: "수동 마이그레이션만 허용"},
                    {id: "pinned", name: "마이그레이션을 허용하지 않음"}
                ],
                selected: {id: "migratable", name: "수동 및 자동 마이그레이션 허용"}
			},
			customMigrationUsed: {
			    list: [
                    { id: "Legacy", name: "Legacy" },
                    { id: "Minimal downtime", name: "Minimal downtime" },
                    { id: "Post-copy migration", name: "Post-copy migration" },
                    { id: "Suspend workload if needed", name: "Suspend workload if needed" }
                ],
                selected: { id: "Legacy", name: "Legacy" }
            },
            autoConverge: {
			    list: [
			        { id: "inherit", name: "클러스터 설정에서 가져오기" },
			        { id: "true", name: "자동 통합" },
			        { id: "false", name: "자동 통합 해제" }
                ],
                selected: { id: "inherit", name: "클러스터 설정에서 가져오기" }
            },
            compressed: {
                list: [
                    { id: "inherit", name: "클러스터 설정에서 가져오기" },
                    { id: "true", name: "압축" },
                    { id: "false", name: "압축 해제" }
                ],
                selected: { id: "inherit", name: "클러스터 설정에서 가져오기" }
            }
        }
	},
	mounted: function() {
		this.retrieveInstanceTypeCreateInfo();
		this.spinnerOn = false;
	},
	methods: {
		// retrieve instance type create info
		retrieveInstanceTypeCreateInfo: function() {
			this.$http.get('/admin/retrieveInstanceTypeCreateInfo').then(function(response) {
				this.newInstanceType = response.data.resultKey;
				this.memory = '256 MB';
				this.newInstanceType.virtioScsiEnabled = true;
				this.newInstanceType.singleSignOn = true;
				
				// 고가용성 초기설정
				this.newInstanceType.priority = 1;
				// this.newInstanceType.watchdogModel = '';
				// this.newInstanceType.watchdogAction = 'none';
				
				//selectboxComponent init
				this.createSelectVo.nicSelectVo.list = JSON.parse(JSON.stringify(this.newInstanceType.nics));

				//selectboxComponent에서 option 값은 list의 name 값 인데 현재 list에서 name=null이고 networkName을 displayName으로 설정해줘야함 jh
				this.createSelectVo.nicSelectVo.list.forEach(index =>{
					index.name = index.networkName;
				})
				this.spinnerOn = false;
			}.bind(this)).catch(function(error) {
	            console.log(error);
	        });
		},
		memoryChange: function() {
			if(this.memory.includes("GB")) {
				this.memory = this.memory.replace(/[^0-9]/g,'');
				this.memory = this.memory*1024;
				this.maximumMemory = this.newInstanceType.memory * 4;
			} else if(this.memory.includes("MB")) {
				this.memory = this.memory.replace(/[^0-9]/g,'');
				this.maximumMemory = this.memory * 4;
			} else {
				this.maximumMemory = this.memory * 4;
			}
			
			this.memory = this.memory + " MB";
			this.maximumMemory = this.maximumMemory + " MB";
			this.physicalMemory = this.memory;
		},
		maximumMemoryChange: function() {
			if(this.maximumMemory.includes("GB")) {
				this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g,'');
				this.maximumMemory = this.maximumMemory*1024;
			} else if(this.maximumMemory.includes("MB")) {
				this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g,'');
			}
			
			this.maximumMemory = this.maximumMemory + " MB";
		},
		physicalMemoryChange: function() {
			if(parseInt(this.physicalMemory.replace(/[^0-9]/g,'')) > parseInt(this.memory.replace(/[^0-9]/g,''))) {
				alert("시스템 항목의 메모리 크기보다 클 수 없습니다.");
				this.physicalMemory = this.memory;
			}
			
			if(this.physicalMemory.includes("GB")) {
				this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g,'');
				this.physicalMemory = this.physicalMemory*1024;
			} else if(this.physicalMemory.includes("MB")) {
				this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g,'');
			}
			
			this.physicalMemory = this.physicalMemory + " MB";
		},
		selectVirtualSockets: function() {
			var value = this.totalCpu/this.virtualSockets;

			if(this.threadsPerCore === value) {
				this.coresPerVirtualSocket = 1;
			} else {
				this.coresPerVirtualSocket = value;
				this.threadsPerCore = 1;
			}
		},
		selectCoresPerVirtualSocket: function() {
			
			var result = this.virtualSockets*this.coresPerVirtualSocket;
			
			if(this.totalCpu > result) {
				if(this.virtualSockets === 1) {
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
			
			// if(this.totalCpu > result) {
			if(parseInt(this.totalCpu) === result) {
				if(this.virtualSockets === 1) {
					if(result%2 === 1) {
						this.virtualSockets = this.totalCpu/this.threadsPerCore;
						this.coresPerVirtualSocket = 1;
					} else {
						this.coresPerVirtualSocket = this.totalCpu/result;
					}
				} else {
					if(result%2 === 1) {
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
			if (this.newInstanceType.name.length >= 4) {
				this.validInstanceName = false;
			} else {
				this.validInstanceName = true;
			}

			this.instanceNameStatus = this.checkInputName(this.newInstanceType.name).result;
		},
		createInstanceType :function() {

			if(this.validInstanceName) {
				alert("인스턴스 유형의 이름은 4글자 이상 입력해야 합니다.");
			} else {
				var checkResult = this.checkInputName(this.newInstanceType.name);

				if(checkResult.result) {
					alert("인스턴스 유형의 이름은 " + checkResult.msg);
				} else {
					this.spinnerOn = true;
					this.newInstanceType.selectNics = [];

					if (this.nic !== '') {
						this.newInstanceType.selectNics.push(this.nic);
					}

					this.newInstanceType.memory = this.memory === 0 ? 1024 : this.memory.replace(/[^0-9]/g, '') * 1024 * 1024;
					this.newInstanceType.maximumMemory = this.maximumMemory === 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
					this.newInstanceType.physicalMemory = this.physicalMemory === 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
					this.newInstanceType.coresPerVirtualSocket = this.coresPerVirtualSocket;
					this.newInstanceType.virtualSockets = this.virtualSockets;
					this.newInstanceType.threadsPerCore = this.threadsPerCore;
					this.newInstanceType.highAvailability = this.highAvailability;
					this.newInstanceType.firstDevice = this.firstDevice;
					this.newInstanceType.secondDevice = this.secondDevice;
					this.newInstanceType.ioThreadsEnabled = this.ioThreadsEnabled ? 1 : 0;
					this.newInstanceType.rngEnabled = this.rngEnabled;
					this.newInstanceType.deviceSource = this.deviceSource;

					this.$http.post('/admin/instanceType/createInstanceType', this.newInstanceType).then(function (response) {
						this.spinnerOn = false;
						// console.log(response.data.resultKey);
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
		setSelected: function (selectItems, index){
			if(index === 10001){
				this.nic = selectItems;
			}else if(index === 10002){
				this.firstDevice = selectItems.id;
			}else if(index === 10003){
				this.secondDevice = selectItems.id;
			}else if(index === 10004){
				this.virtualSockets = selectItems.id;
				this.selectVirtualSockets();
				this.resetCpu();
				this.systemSelectboxSelected();
			}else if(index === 10005){
				this.coresPerVirtualSocket = selectItems.id;
				this.selectCoresPerVirtualSocket();
				this.resetCpu();
				this.systemSelectboxSelected();
			}else if(index === 10006){
				this.threadsPerCore = selectItems.id;
				this.selectThreadsPerCore();
				this.resetCpu();
				this.systemSelectboxSelected();
			}else if(index === 10007){
			    //그래픽프로토콜/모니터는 딱히 액션이 없음 -> 차후 제거 예정
            }else if(index === 10008){
                //그래픽프로토콜/모니터는 딱히 액션이 없음 -> 차후 제거 예정
            }else if(index === 10009){
                this.newInstanceType.priority = selectItems.id;
            }else if(index === 10010){
                this.newInstanceType.affinity = selectItems.id;
            }else if(index === 10011){
                this.newInstanceType.customMigration = selectItems.id;
            }else if(index === 10012){
                this.newInstanceType.autoConverge = selectItems.id;
            }else if(index === 10013){
				this.newInstanceType.compressed = selectItems.id;
            }else {

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
		closePop: function(){
			document.getElementById('newInstanceType').classList.remove('active');
			this.init();
		},
		init: function (){
			this.isActiveGeneral = true;
			this.isActiveBootOption = false;
			this.isActiveSystem = false;
			this.isActiveHost = false;
			this.isActiveResourceAssign = false;
			this.newInstanceType.name = '';
			this.newInstanceType.description = '';
			this.createSelectVo.nicSelectVo.selected = this.initVal.nicSelectVo;
			this.createSelectVo.bootFirstDevice.selected = this.initVal.bootFirstDevice;
			this.createSelectVo.bootFirstDevice.list = [
				{ id: 'hd', name: '하드 디스크' },
				{ id: 'cdrom', name: 'CD-ROM' },
				{ id: 'network', name: '네트워크(PXE)' }
			];

			this.createSelectVo.bootSecondDevice.selected = this.initVal.bootSecondDevice;
			this.createSelectVo.bootSecondDevice.list = [
				{ id: 'none', name: '없음' },
				{ id: 'cdrom', name: 'CD-ROM' },
				{ id: 'network', name: '네트워크(PXE)' }
			],

			this.memory = '256 MB';
			this.maximumMemory = '1024 MB';
			this.totalCpu = 1;
			this.virtualSockets = 1;
			this.coresPerVirtualSocket = 1;
			this.threadsPerCore = 1;
			this.highAvailability = false;
			this.createSelectVo.priority.selected = this.initVal.priority;
			this.createSelectVo.affinity.selected = this.initVal.affinity;
			this.newInstanceType.customMigrationUsed = false;
			this.createSelectVo.customMigrationUsed.selected = this.initVal.customMigrationUsed;
			this.newInstanceType.customMigrationDowntimeUsed = false;
			this.newInstanceType.customMigrationDowntime = '';
			this.createSelectVo.autoConverge.selected = this.initVal.autoConverge;
			this.createSelectVo.compressed.selected = this.initVal.compressed;
			this.physicalMemory = '256 MB';
			this.newInstanceType.memoryBalloon = false;
			this.ioThreadsEnabled = false;
			this.newInstanceType.virtioScsiEnabled = true;
		},
		systemSelectboxSelected: function (){
			this.createSelectVo.divisorVoVirtualSockets.selected.id = this.virtualSockets;
			this.createSelectVo.divisorVoVirtualSockets.selected.name = this.virtualSockets.toString();

			this.createSelectVo.divisorVoCoresPerVirtualSocket.selected.id = this.coresPerVirtualSocket;
			this.createSelectVo.divisorVoCoresPerVirtualSocket.selected.name = this.coresPerVirtualSocket.toString();

			this.createSelectVo.divisorVoThreadsPerCore.selected.id = this.threadsPerCore;
			this.createSelectVo.divisorVoThreadsPerCore.selected.name = this.threadsPerCore.toString();
		},
		resetCpu: function (){
			//list가 동적으로 변하면서 custom-select list값이 오류가 나서 list 재선언
			this.createSelectVo.divisorVoVirtualSockets.list = [];
			this.createSelectVo.divisorVoCoresPerVirtualSocket.list = [];
			this.createSelectVo.divisorVoThreadsPerCore.list = [];

			for (var i = 1; i <= this.totalCpu; i++) {
				if (this.totalCpu % i == 0) {
					this.createSelectVo.divisorVoVirtualSockets.list.push({id: i, name: i.toString()});
					this.createSelectVo.divisorVoCoresPerVirtualSocket.list.push({id: i, name: i.toString()});
					this.createSelectVo.divisorVoThreadsPerCore.list.push({id: i, name: i.toString()});
				}
			}
		}
	},
	watch: {
		nic: function() {
			this.nic.nicName = 'nic1';
		},
		totalCpu: function(value) {
			
			this.resetCpu();

			this.virtualSockets = value;
			this.coresPerVirtualSocket = 1;
			this.threadsPerCore = 1;

			this.createSelectVo.divisorVoVirtualSockets.selected = { id: value, name: value.toString()};
			this.createSelectVo.divisorVoCoresPerVirtualSocket.selected = this.initVal.divisorVoVirtualSockets;
			this.createSelectVo.divisorVoThreadsPerCore.selected = this.initVal.divisorVoVirtualSockets;
		},
		firstDevice: function(id) {
			if(id === 'hd'){
				this.createSelectVo.bootSecondDevice.list = [
					{ id: 'none', name: '없음' },
					{ id: 'cdrom', name: 'CD-ROM' },
					{ id: 'network', name: '네트워크(PXE)' }
				];
			}else if(id === 'cdrom'){
				this.createSelectVo.bootSecondDevice.list = [
					{ id: 'none', name: '없음' },
					{ id: 'hd', name: '하드 디스크' },
					{ id: 'network', name: '네트워크(PXE)' }
				];
			}else if(id === 'network'){
				this.createSelectVo.bootSecondDevice.list = [
					{ id: 'none', name: '없음' },
					{ id: 'hd', name: '하드 디스크' },
					{ id: 'cdrom', name: 'CD-ROM' },
				];
			}
			if(id === this.secondDevice) {
				this.secondDevice = 'none';
				this.createSelectVo.bootSecondDevice.selected.id = 'none';
				this.createSelectVo.bootSecondDevice.selected.name = '없음';
			}
		}
	},
	filters: {
		date: function(value){
			if(value === undefined || isNaN(value) || value === '' || value === null){
				return '';
			}
			
			return moment(value).format("YYYY MM DD HH:mm:ss");
		}
	}
});