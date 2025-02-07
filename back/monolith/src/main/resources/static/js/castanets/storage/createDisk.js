var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var createDiskVue = new Vue({
	// el: '#createDiskVue',
	el: '#createModal',
	data: {
		selectedLun: [],
		hosts: [],
		lunVos: [],
		type: '파이버 채널',
		status: 'all',
		spinnerOn: true,
		disk: {
			flag: 1,
			name: '',
			size: '',
			description: '',
			//bootable: true,
			//wipeAfterDelete: true,
			shareable: false,
			storageDomainId: '',
			diskProfileId: '',
			diskProfileName: '',
			hostName: '',
			hostId: '',
			storageType: '',
			lunId: '',
		},
		storageDomains: {
			list: [],
			selected: {
				id: 'choose',
				name: '스토리지 도메인 선택'
			}
		},
		initVal: {
			id: 'choose',
			name: '스토리지 도메인 선택'
		},
		diskNameStatus: false
	},
	mounted: function () {
		this.changeHost();
		this.retrieveStorageDomains();
		this.retrieveHosts();
	},
	methods: {
		flagDisk: function (flag) {
			this.disk = {
				flag: 1,
				name: '',
				size: '',
				description: '',
				//bootable: true,
				//wipeAfterDelete: true,
				shareable: false,
				storageDomainId: '',
				diskProfileId: '',
				diskProfileName: '',
				hostName: '',
				hostId: '',
				storageType: '',
				lunId: '',
			};
			this.disk.flag = flag;
			this.lunVos = '';
		},

		changeHost: function () {
			if (this.lunVos.length == 0) {
				this.lunVos = "";
			}
		},

		selectLun: function (lun) {

			if (lun.diskId != null) {
				alert("선택한 LUN은 이미 디스크에서 사용하고 있습니다!");
			} else if (lun.diskId == null) {
				if (this.selectedLun.length == 0) {
					this.selectedLun.push(lun);
				} else if (this.selectedLun.length >= 1) {
					this.selectedLun.splice(0, 1);
				}
			}

		},// end selectDisk

		retrieveHosts: function () {
			this.$http.get('/compute/hosts/retrieveLunHostsInfo?status=' + this.status).then(function (response) {
				this.hosts = response.data.resultKey;
				this.spinnerOn = false;
				this.selectedHosts = [];

			}.bind(this)).catch(function (error) {
				this.spinnerOn = false;
				console.log(error);

				if (confirm("호스트 정보를 불러오지 못하였습니다. 다시불러오겠습니까?")) {
					createDiskVue.retrieveHosts();
				}
			});
		},// end retrieveHosts

		retrieveStorageDomains: function () {
			this.$http.get('/v2/storage/domains?status=all&domainType=DATA').then(function (response) {
				this.storageDomains.list = response.data.resultKey;

			}.bind(this)).catch(function (error) {
				console.log(error);
			});
		},

		createDisk: function () {
			if (this.disk.flag == 1) {
				if (this.disk.size == '') {
					alert("디스크 크기를 입력해주세요.");
					return;
				}
				if (this.disk.name == '') {
					alert("디스크 이름을 입력해주세요.");
					return;
				}
				if (this.disk.storageDomainId == '') {
					alert("스토리지 도메인을 선택해주세요.");
					return;
				}

				this.$http.post('/v2/storage/disks/create', this.disk).then(function (response) {
					// 성공시 되돌아가기
					location.href = '/storage/disks';
				}.bind(this)).catch(function (error) {
					console.log(error);
				});
			} else if (this.disk.flag == 2) {

				if (this.disk.name == '') {
					alert("디스크 이름을 입력해주세요.");
					return;
				}
				if (this.lunVos == '') {
					alert("호스트를 선택해 주세요.");
					return;
				}

				if (this.disk.storageType == '') {
					alert("스토리지 타입을 선택해 주세요.")
					return;
				}

				if (this.selectedLun.length == 0) {
					alert("LUN을 선택해 주세요.")
					return;
				}

				this.disk.hostId = this.selectedLun[0].lunHostId;
				this.disk.lunId = this.selectedLun[0].lunId;

				this.$http.post('/v2/storage/disks/lun/create', this.disk).then(function (response) {
					// 성공시 되돌아가기
					location.href = '/storage/disks';
				}.bind(this)).catch(function (error) {
					console.log(error);
				});
			}
		},
		setDiskProfileId: function () {
			for (var domain in this.storageDomains) {
				if(domain.id == this.disk.storageDomainId){
					this.disk.diskProfileId = domain.diskProfileId;
					this.disk.diskProfileName = domain.diskProfileName;
				}
			}
		},
		goList: function () {
			location.href = '/storage/disks';
		},
		checkDiskName: function () {
			this.diskNameStatus = this.checkInputName(this.disk.name).result;
		},
		closePop: function (modalType) {
			this.init();
			document.getElementById(modalType).classList.remove('active');
		},
		setSelected: function(selectedItems){
			this.disk.storageDomainId = selectedItems.id;
			this.setDiskProfileId();
		},
		init: function (){
			this.storageDomains.selected = {};
			this.storageDomains.selected.id = this.initVal.id;
			this.storageDomains.selected.name = this.initVal.name;
			this.disk = {
				flag: 1,
				name: '',
				size: '',
				description: '',
				shareable: false,
				storageDomainId: '',
				diskProfileId: '',
				diskProfileName: '',
				hostName: '',
				hostId: '',
				storageType: '',
				lunId: '',
			}
		}
	}
})
