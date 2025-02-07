Vue.prototype.$http = axios;
Vue.prototype.EventBus = new Vue();


var disksVue = new Vue({
	el: '#disksVue',
	data: {
		file:'',
		formatCheck: true,
		check: true,
		dataCenters:[],
		hosts:[],
		uploadDiskFile:[],
		fileSize: '',
		virtualSize:'',
		diskFormat:'',
		uploadDisk:{
			format:'포멧 선택',
			size:'',
			virtualSize:'',
			name:'',
			dataCenterId:'',
			usingHostId:'',
			wipeAfterDelete:false,
			isShareable:false,
			description:''
		},
		disks: [],
		storageDomains: {
			storageDomainInfo:''
		},
		migDisk: {
			migrationType: '',
			sourceStorageDomainId: '',
			targetStorageDomainId: '',
			targetDiskName: '',
			disk: {},
		},
		selectedDisks: [],
		subscription: {},
		statusSubScript:'',
		uploadingDiskId:'',
		spinnerOn: true,
		initVal: {
			diskFormat: { id: 'choose', name: '포멧 선택' },
			dataCenter: {},
			storageDomain: {},
			diskProfile: {},
			host: {},
			mvDisk: {},
			moveCopy: { id: 'choose', name: '대상 스토리지 도메인 선택' }
		},
		selectedDiskInfo: { id: '', name: '' },
		selectVoDiskFormat:{
			list: [
				{ id: 'choose', name: '포멧 선택' },
				{ id: 'qcow2', name: 'qcow2' },
				{ id: 'raw', name: 'raw'}
			],
			selected: { id: 'choose', name: '포멧 선택' }
		},
		selectVoDataCenter: {
			list: [],
			selected: {}
		},
		selectVoStorageDomain: {
			list: [],
			selected: {}
		},
		selectVoDiskProfile: {
			list: [],
			selected: {}
		},
		selectVoHost: {
			list: [],
			selected: {}
		},
		selectVoStorageDomainMove:{
			list: [{ id: '', name: '대상 스토리지 도메인 선택' }],
			selected: { id: '', name: '대상 스토리지 도메인 선택' }
		},
		selectVoStorageDomainCopy:{
			list: [{ id: '', name: '대상 스토리지 도메인 선택' }],
			selected: { id: '', name: '대상 스토리지 도메인 선택' }
		},
		modalType: '',
		pagingVo: {
			viewList: []			//선택한 페이지 클릭시 보여주는 리스트
		},
		beforeType: '',			//같은 th 두번 눌렀을때 orderBy toggle 될 수 있도록 하는 용도
		orderByToggle: 1, 		//orderBy asc/desc toggle용
		sortObject: {},
		dataString: ''
	},

	mounted: function () {
		this.wsSubscription();
		this.init();
		this.retrieveDisks(true);		//처음에 load될때 spinner 필요

		this.timer = setInterval(this.init, 300 * 1000);
	},
	methods: {
		resetUploadDisk: function(){
			var tempStorageDomains = JSON.parse(JSON.stringify(this.storageDomains));
			var tempDataCenters = JSON.parse(JSON.stringify(this.dataCenters));
			var tempHosts = JSON.parse(JSON.stringify(this.hosts));

			this.formatCheck = true;

			this.uploadDisk={
				format:'포멧 선택',
				size:'',
				virtualSize:'',
				name:'',
				dataCenterId:'',
				usingHostId:'',
				wipeAfterDelete:false,
				isShareable:false,
				description:''
			}
			if(this.$refs.diskFile.files.length > 0){
				this.$refs.diskFile.value = null;
			}
			this.uploadDiskFile = [];
			this.formatCheck = true;

			//selectboxComponent init
			this.selectVoDiskFormat.selected = this.initVal.diskFormat;
			this.selectVoDataCenter.selected= this.initVal.dataCenter;
			this.selectVoStorageDomain.selected = this.initVal.storageDomain;
			this.selectVoDiskProfile.selected = this.initVal.diskProfile;
			this.selectVoHost.selected = this.initVal.host;

			tempStorageDomains.some(storageDomain =>{
				if(storageDomain !== null){
					return this.uploadDisk.storageDomainId = storageDomain.id, this.uploadDisk.diskProfileId = storageDomain.diskProfileId;
				}
			})

			tempDataCenters.some(dataCenter =>{
				if(dataCenter !== null){
					return this.uploadDisk.dataCenterId = dataCenter.id;
				}
			})

			tempHosts.some(host =>{
				if(host !== null){
					return this.uploadDisk.usingHostId = host.id;
				}
			})

			// this.formats.some(format =>{
			// 	return this.uploadDisk.format = format.name;
			// })
			// console.log(this.uploadDisk.format)
		},
		//by gtpark 디스크 업로드 파일 사이즈 불러오기
		retrieveDiskSize: function(){
			this.uploadDisk.size = (this.uploadDiskFile.size/Math.pow(1024, 3)).toFixed(2) ;
			// 포맷 형식에 따라 디스크 가상 크기 조절
			if(this.uploadDisk.format === 'qcow2'){
				this.formatCheck = false;
				this.uploadDisk.description = this.uploadDiskFile.name;
			}
			else if(this.uploadDisk.format === 'raw'){
				this.uploadDisk.virtualSize = this.uploadDisk.size;
				this.uploadDisk.description = this.uploadDiskFile.name;
			}
		},

		//by gtpark 디스크 업로드 파일 불러오기
		receiveDiskFile: function() {

			this.formatCheck = true;
			this.uploadDisk.name = '';
			this.uploadDisk.description= '';
			this.uploadDisk.virtualSize = '';
			this.uploadDisk.format = '포멧 선택';
			this.uploadDiskFile = this.$refs.diskFile.files;
			this.uploadDiskFile = this.uploadDiskFile.length > 0 ? this.uploadDiskFile[0] : null;

			//이름에서 포맷 형식 얻기
			// var strArray = this.uploadDiskFile.name.split('.');
			//
			// for(var i = 0; i<strArray.length; i++){
			// 	if(i+1 === strArray.length){
			// 		this.uploadDisk.format = strArray[i];
			// 		break;
			// 	}
			// }

			// 포맷 형식에 따라 디스크 가상 크기 조절
			// if(this.uploadDisk.format === 'qcow2'){
			// 	this.formatCheck = false;
			// 	this.uploadDisk.description = this.uploadDiskFile.name;
			// }
			// else if(this.uploadDisk.format !== 'raw'){
			// 	this.uploadDisk.virtualSize = this.uploadDisk.size;
			// 	this.uploadDisk.description = this.uploadDiskFile.name;
			// }
		},

		wsConnectionWait: function () {
			setTimeout(function() {disksVue.wsSubscription();}, 2000);
		},
		wsSubscription: function () {

			if(wsVue.stompClient != null && wsVue.stompClient.connected){
				this.subscription = wsVue.stompClient.subscribe('/topic/disks/uploadDisk', this.diskMessage);
			}
			if(wsVue.stompClient != null && wsVue.stompClient.connected){
				this.subscription = wsVue.stompClient.subscribe('/topic/disks/reload', this.onMessage);
			}else{
				this.wsConnectionWait();
			}
		},

		diskMessage: function(response){

			var message = JSON.parse(response.body);

			this.uploadingDiskId = message.title;
			this.statusSubScript = message.text;

			if(this.uploadingDiskId !== '' && this.statusSubScript !== '완료' ){
				this.disks.some(disk =>{
					if(disk.id === message.title){
						return disk.status = this.statusSubScript;
					}
				})
			} else if(this.uploadingDiskId !== '' && this.statusSubScript === '완료' ){
				this.init();
			}
		},

		onMessage: function (response) {
			this.init();
		},

		init: function() {
			this.retrieveDataCenter();
			this.retrieveDomains();
			this.retrieveHosts();
			this.retrieveDisks(false);

		},// end init

		retrieveDataCenter: function(){
			this.$http.get('/v2/dataCenters').then(function (response) {
				this.dataCenters = response.data.resultKey;

				this.selectVoDataCenter.list = this.dataCenters;
				this.selectVoDataCenter.selected.name = this.dataCenters[0].name;
				this.selectVoDataCenter.selected.id = this.dataCenters[0].id;

				this.initVal.dataCenter = JSON.parse(JSON.stringify(this.selectVoDataCenter.selected));

			}.bind(this)).catch(function(error){
				console.log(error);
			});
		},

		retrieveDisks: function(isSpinnerOn) {
			this.selectedDisks = [];

			if(isSpinnerOn){
				this.spinnerOn = true;
			}else{
				this.spinnerOn = false;
			}

			this.$http.get('/v2/storage/disks')
				.then(function(response) {
					this.disks = response.data.resultKey;
					this.spinnerOn = false;
					this.selectedDisks = [];

				}.bind(this))
				.catch(function(error) {
					console.log(error);
					this.spinnerOn = false;
				});
		},// end retrieveDisks

		retrieveDomains: function() {
			this.$http.get('/v2/storage/domains?status=all&domainType=DATA').then(function(response) {
				this.storageDomains.storageDomainInfo ='';
				this.selectVoStorageDomain.list = [];
				this.selectVoDiskProfile.list = [];
				this.storageDomains = response.data.resultKey;

				this.storageDomains.forEach(storageDomain =>{
					storageDomain.storageDomainInfo =  storageDomain.name
						+ " ( "
						+((storageDomain.diskFree+storageDomain.diskUsed)/Math.pow(1024, 3))+"GB 중 "
						+(storageDomain.diskFree/Math.pow(1024, 3))+"GB 여유 )";
				})

				//스토리지 도메인은 storageDomains의 id, storageDomainInfo 를 사용
				this.storageDomains.forEach(storageDomain => {
					let arr = {
						id : storageDomain.id,
						name : storageDomain.storageDomainInfo
					};
					this.selectVoStorageDomain.list.push(arr);
				});

				this.selectVoStorageDomain.selected.id = this.storageDomains[0].id;
				this.selectVoStorageDomain.selected.name = this.storageDomains[0].storageDomainInfo;
				this.initVal.storageDomain = JSON.parse(JSON.stringify(this.selectVoStorageDomain.selected));

				//디스크 프로파일은 storageDomains의 diskProfileId, diskProfileName를 사용
				this.storageDomains.forEach(storageDomain => {
					let arr = {
						id : storageDomain.diskProfileId,
						name : storageDomain.diskProfileName
					}
					this.selectVoDiskProfile.list.push(arr);
				});

				this.selectVoDiskProfile.selected.id = this.storageDomains[0].diskProfileId;
				this.selectVoDiskProfile.selected.name = this.storageDomains[0].diskProfileName;
				this.initVal.diskProfile = JSON.parse(JSON.stringify(this.selectVoDiskProfile.selected));

			}.bind(this)).catch(function(error) {
				console.log(error);
			});
		},// end retrieveDomains

		retrieveHosts: function() {
			this.$http.get('/compute/hosts/retrieveHostsInfo?status=all&hostType=DATA' ).then(function(response) {
				this.hosts = response.data.resultKey;
				this.selectVoHost.list = this.hosts;
				this.selectVoHost.selected.id = this.hosts[0].id;
				this.selectVoHost.selected.name = this.hosts[0].name;
				this.initVal.host = JSON.parse(JSON.stringify(this.selectVoHost.selected));

			}.bind(this)).catch(function(error) {
				console.log(error);
				if(confirm("호스트 정보를 불러오지 못하였습니다. 다시불러오겠습니까?")){
					hostsVue.retrieveHosts();
				}
			});
		},// end retrieveHosts

		// goCreateDisk: function() {
		// 	window.location.href = "/storage/createDisk";
		// },// end goCreateDisk

		removeDisk: function() {
			if(this.selectedDisks.length == 0){
				alert("삭제할 디스크를 선택해주세요.");
				return;
			}else if(this.selectedDisks.length != 1){
				alert("삭제할 디스크를 1개만 선택해주세요.");
				return;
			}
			var selectedDiskIds = [];
			selectedDiskIds.push(this.selectedDiskInfo.id);

			// if(confirm('디스크를 삭제하시겠습니까?\n' + this.selectedDisks[0].name)){
			// 	this.$http.post('/storage/disks/removeDisk', this.getSelectedDiskIds() ).then(function(response) {
			this.$http.delete('/storage/disks', selectedDiskIds).then(function(response) {
				this.spinnerOn = true;
				this.init();

				this.closePop('deleteModal');

			}.bind(this)).catch(function(error) {
				console.log(error);
			});
			// }
		},// end removeDisk

		moveDisk: function() {
			if(this.selectedDisks.length == 0){
				alert("이동할 디스크를 선택해주세요.");
				return;
			}else if(this.selectedDisks.length != 1){
				alert("이동할 디스크를 1개만 선택해주세요.");
				return;
			}
			this.migDisk.migrationType = 'move';
			this.migDisk.disk = this.selectedDisks[0];
			this.migDisk.sourceStorageDomainId = this.selectedDisks[0].storageDomainId;
			this.migDisk.targetStorageDomainId = '';

			//selectbox list push
			this.storageDomains.forEach(storageDomain =>{
				if(storageDomain.type == 'DATA' && (this.migDisk.disk.storageDomainId != storageDomain.id)){
					let arr = {
						id: storageDomain.id,
						name: storageDomain.name
					}
					this.selectVoStorageDomainMove.list.push(arr);
				}
			})
		},// end moveDisk

		copyDisk: function() {
			if(this.selectedDisks.length == 0){
				alert("복사할 디스크를 선택해주세요.");
				return;
			}else if(this.selectedDisks.length != 1){
				alert("복사할 디스크를 1개만 선택해주세요.");
				return;
			}
			this.migDisk.migrationType = 'copy';
			this.migDisk.disk = this.selectedDisks[0];
			this.migDisk.targetDiskName = this.selectedDisks[0].name;
			this.migDisk.sourceStorageDomainId = this.selectedDisks[0].storageDomainId;
			this.migDisk.targetStorageDomainId = '';

			//selectbox list push
			this.storageDomains.forEach(storageDomain =>{
				if(storageDomain.type == 'DATA'){
					let arr = {
						id: storageDomain.id,
						name: storageDomain.name
					}
					this.selectVoStorageDomainCopy.list.push(arr);
				}
			})
		},// end copyDisk

		migrationDisk: function() {
			this.$http.post('/storage/disks/migrate', this.migDisk).then(function(response) {
				this.spinnerOn = true;
				this.init();
			}.bind(this)).catch(function(error) {
				console.log(error);
			});

			document.getElementById('moveAndCopyModal').classList.remove('active');
		},// end migrationDisk

		setDiskProfileId: function() {
			for (var domain in this.storageDomains) {
				if(domain.id == this.migDisk.disk.storageDomainId){
//					this.migDisk.diskProfileId = domain.diskProfileId;
//					this.migDisk.diskProfileName = domain.diskProfileName;
				}
			}
		},// end setDiskProfileId

		// getSelectedDiskIds: function() {
		// 	var selectedDiskIds = [];
		// 	for(var i=0; i < this.selectedDisks.length ; i++){
		// 		selectedDiskIds.push( this.selectedDisks[i].id);
		// 	}
		// 	return selectedDiskIds;
		// },// end getSelectedDomainIds

		selectDisk: function(disk) {
			//selectedDisks에 데이터가 있음
			if(this.selectedDisks.length != 0){
				if(this.selectedDisks[0].name == disk.name){
					//1. 똑같은 domain 정보 toggle할 경우
					this.selectedDisks.splice(0, 1);
				}else{
					//2. 다른 disk 정보 클릭한 경우
					this.selectedDisks.splice(0, 1);
					this.selectedDisks.push(disk);
				}
			}else{
				this.selectedDisks.push(disk);
			}

		},// end selectDisk

		makeUploadDisk(){

			if(this.uploadDisk.name === null
				|| this.uploadDisk.name=== ''){
				alert("디스크 이름를 입력해주세요.");
				return;
			}
			if(this.uploadDisk.virtualSize === null
				|| this.uploadDisk.virtualSize=== ''){
				alert("디스크의 가상 크기를 입력해주세요.");
				return;
			}
			var virtualSize = BigInt(Math.floor(String(parseInt(this.uploadDisk.virtualSize)+0.2)*Math.pow(1024, 3)));

			if(this.uploadDisk.wipeAfterDelete == null){
				this.uploadDisk.wipeAfterDelete=false;
			}
			if(this.uploadDisk.isShareable == null){
				this.uploadDisk.isShareable=false;
			}
			//by gtpark upload할 파일과 정보를 formData에 실어서 전달
			var formData = new FormData();

			formData.append('file',this.uploadDiskFile);
			formData.append('name',this.uploadDisk.name);
			formData.append('virtualSize',virtualSize);
			if(this.uploadDisk.description !== null){
				formData.append('description', this.uploadDisk.description);
			}
			formData.append('storageDomainId',this.uploadDisk.storageDomainId);
			formData.append('diskProfileId',this.uploadDisk.diskProfileId);
			formData.append('dataCenterId',this.uploadDisk.dataCenterId);
			formData.append('usingHostId',this.uploadDisk.usingHostId);
			formData.append('wipeAfterDelete',this.uploadDisk.wipeAfterDelete);
			formData.append('shareable',this.uploadDisk.isShareable);
			formData.append('format',this.uploadDisk.format);

			// $(".uploadmodal").modal('hide');

			this.spinnerOn = true;
			axios.post('/storage/disks/uploadDisk', formData, {
				'timeout': 600 * 1000,
				headers: {
					'Context-type': 'multipart/form-data'
				}
			}).then(function(response) {

				var self = this;
				self.init();
				// setTimeout(function() {
				//
				// }, 3000);

			}.bind(this)).catch(function(error) {
				console.log(error);
			});

			document.getElementById("uploadModal").classList.remove('active');
		},
		openPop: function (modalType){
			if(modalType === 'uploadModal' || modalType === 'createModal') {
				document.getElementById(modalType).classList.add('active');

				if(modalType === 'uploadModal'){
					this.resetUploadDisk();
				}else{

				}
			}else{
				this.selectedDiskInfo.name = this.selectedDisks[0].name;
				this.selectedDiskInfo.id = this.selectedDisks[0].id;

				if(modalType === 'deleteModal'){
					document.getElementById('deleteModal').classList.add('active');
				}else if(modalType === 'moveModal'){
					document.getElementById('moveAndCopyModal').classList.add('active');

					this.modalType = 'moveModal';
					this.moveDisk();

				}else if(modalType === 'copyModal') {
					document.getElementById('moveAndCopyModal').classList.add('active');

					this.modalType = 'copyModal';
					this.copyDisk();
				}else{

				}
			}
		},
		closePop: function(modalType){

			this.selectedDisks.splice(0, 1);
			this.selectedDiskInfo.name = '';
			this.selectedDiskInfo.id = '';

			document.getElementById(modalType).classList.remove('active');

			if(modalType === 'deleteModal' || modalType === 'uploadModal'){

			}else if(modalType === 'moveAndCopyModal'){

				this.migDisk.migrationType = '';
				this.migDisk.disk = {};
				this.migDisk.targetDiskName = '';
				this.migDisk.sourceStorageDomainId = '';
				this.migDisk.targetStorageDomainId = '';

				//move and copy selectbox init
				this.selectVoStorageDomainMove.list = [
					{
						id: '',
						name: '대상 스토리지 도메인 선택'
					}
				];
				this.selectVoStorageDomainMove.selected = this.initVal.moveCopy;
				this.selectVoStorageDomainCopy.list = [
					{
						id: '',
						name: '대상 스토리지 도메인 선택'
					}
				];
				this.selectVoStorageDomainCopy.selected = this.initVal.moveCopy;
			}else{

			}

			//toggle css effect
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
		setSelected: function(selected, index){
			if(index === 10000){
				this.uploadDisk.format = selected.name;
				this.retrieveDiskSize();
			}else if(index === 10001){
				this.uploadDisk.dataCenterId = selected.id;
			}else if(index === 10002){
				this.uploadDisk.storageDomainId = selected.id;
			}else if(index === 10003){
				this.uploadDisk.diskProfileId = selected.id;
			}else if(index === 10004){
				this.uploadDisk.usingHostId = selected.id;
			}else if(index === 10005 || index === 10006){
				//move and copy
				this.migDisk.targetStorageDomainId = selected.id;
			}else{

			}
		},
		setViewList: function(viewList) {
			this.pagingVo.viewList = viewList;
		},
		diskListSort: function (type, sortTypeof){
			this.sortObject.orderBy = 'desc';

			if(this.beforeType === type){
				//같은 컬럼 두번 클릭하면 asc/desc toggle
				this.orderByToggle = this.orderByToggle * -1;

				if(this.orderByToggle < 0){
					//this.orderByToggle = -1 이면 asc
					this.sortObject.orderBy = 'asc';
				}else{
					this.sortObject.orderBy = 'desc';
				}
			}
			this.beforeType = type;
			this.sortObject.type = type;
			this.sortObject.sortTypeof = sortTypeof;

			this.dataString = this.sortObject.type + ':' + this.sortObject.sortTypeof + ':' + this.sortObject.orderBy;
		}
	},

	computed: {

		selectAll: {
			get: function () {
				return this.selectedDisks ? this.selectedDisks.length == this.disks.length : false;
			},
			set: function (value) {
				var selected = [];

				if (value) {
					this.disks.forEach(function (disk) {
						selected.push(disk);
					});
				}

				this.selectedDisks = selected;
			}
		},

	},
	watch: {
		//작업 버튼 active 상태에서 retrieveDisk했을때 작업 버튼 active된 효과 바꾸기 위함
		selectedDisks: function(){
			if(this.selectedDisks.length < 1){
				this.togglePop();
			}
		}
	}

})
