Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
    router: router,
    el: '#vmUpdateManagement',
    data: {
        initData: {
            creCluster: {name: "", id: ""},
            creOs: {name: "Other OS", id: "other"},
            creIns: {name: "사용자 정의", id: "null"},
            creOps: {name: "서버", id: "server"},
            creUsage: {name: "시스템 관리", id: "systemManagement"},
            creFirDev: {name: "하드 디스크", id: "hd"},
            creSecDev: {name: "CD-ROM", id: "cdrom"},
            creBootImg: {name: "", id: ""},
            creSystems: {name: "1", id: 1},
            creLeaseStrg: {name: "가상 머신 임대 없음", id: ""},
            crePriority: {name: "낮음", id: 1},
            creRecHost: {name: "", id: ""},
            creTarHost: {name: "", id: ""},
            creMigration: {name: "수동 및 자동 마이그레이션 허용", id: "migratable"},
            creCustomMig: {name: "정책 선택", id: "null"},
            creAutoCon: {name: "클러스터 설정에서 가져오기", id: "inherit"},
            creComp: {name: "클러스터 설정에서 가져오기", id: "inherit"},
            creNuma: {name: "제한", id: "limit"},
            creCpuShare: {name: "비활성화됨", id: ""},
            creConnDisk: {name: "VirtIO-SCSI", id: "virtio_scsi"},
            creStrgDomain: {name: "", id: ""}
        },
        selectVo: {
            selCreClusterVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10001,
                selected: {name: "전체", id: "selectAll"}
            },
            selCreOsVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10002,
                selected: {name: "Other OS", id: "other"}
            },
            selCreInsVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10003,
                selected: {name: "사용자 정의", id: "null"}
            },
            selCreOpsVo: {
                size: "",
                list: [
                    {name: "데스크탑", id: "desktop"},
                    {name: "서버", id: "server"},
                    {name: "고성능", id: "high_performance"}],
                index: 10004,
                selected: {name: "서버", id: "server"}
            },
            selCreUsageVo: {
                size: "",
                list: [
                    {name: '시스템 관리', id: 'systemManagement'},
                    {name: 'ERP', id: 'erp'},
                    {name: 'CRM', id: 'crm'},
                    {name: 'DBMS', id: 'dbms'},
                    {name: '미들웨어', id: 'middleware'},
                    {name: '테스팅', id: 'testing'},
                    {name: '협업용(Office)', id: 'coop'},
                    {name: '기타', id: 'other'}],
                index: 10005,
                selected: {name: "시스템 관리", id: "systemManagement"}
            },
            selFirDevVo: {
                size: "",
                list: [
                    {name: '하드 디스크', id: 'hd'},
                    {name: 'CD-ROM', id: 'cdrom'},
                    {name: '네트워크', id: 'network'}],
                index: 10006,
                selected: {name: "하드 디스크", id: "hd"}
            },
            selSecDevVo: {
                size: "",
                list: [
                    {name: '없음', id: 'none'},
                    {name: '하드 디스크', id: 'hd'},
                    {name: 'CD-ROM', id: 'cdrom'},
                    {name: '네트워크', id: 'network'}],
                index: 10007,
                selected: {name: "CD-ROM", id: "cdrom"}
            },
            selBootImgVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10008,
                selected: {name: "전체", id: "selectAll"}
            },
            selVirSockVo: {
                size: "",
                list: [{name: "1", id: 1}],
                index: 10009,
                selected: {name: "1", id: 1}
            },
            selPerVirSockVo: {
                size: "",
                list: [{name: "1", id: 1}],
                index: 10010,
                selected: {name: "1", id: 1}
            },
            selThreadPerCoreVo: {
                size: "",
                list: [{name: "1", id: 1}],
                index: 10011,
                selected: {name: "1", id: 1}
            },
            selLeaseStrgVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10012,
                selected: {name: "가상 머신 임대 없음", id: ""},
            },
            selPriorityVo: {
                size: "",
                list: [
                    {name: "낮음", id: 0},
                    {name: "중간", id: 50},
                    {name: "높음", id: 100}],
                index: 10013,
                selected: {name: "낮음", id: 0}
            },
            selRecHostVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10014,
                selected: {name: "전체", id: "selectAll"}
            },
            selTarHostVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10015,
                selected: {name: "전체", id: "selectAll"}
            },
            selMigrationVo: {
                size: "",
                list: [
                    {name: "수동 및 자동 마이그레이션 허용", id: "migratable"},
                    {name: "수동 마이그레이션만 허용", id: "user_migratable"},
                    {name: "마이그레이션을 허용하지 않음", id: "pinned"}],
                index: 10016,
                selected: {name: "수동 및 자동 마이그레이션 허용", id: "migratable"}
            },
            selCustomMigVo: {
                size: "",
                list: [
                    {name: "정책 선택", id: "null"},
                    {name: "Legacy", id: "Legacy"},
                    {name: "Minimal downtime", id: "Minimal downtime"},
                    {name: "Post-copy migration", id: "Post-copy migration"},
                    {name: "Suspend workload if needed", id: "Suspend workload if needed"}],
                index: 10017,
                selected: {name: "정책 선택", id: "null"}
            },
            selAutoConVo: {
                size: "",
                list: [
                    {name: "클러스터 설정에서 가져오기", id: "inherit"},
                    {name: "자동 통합", id: "true"},
                    {name: "자동 통합 해제", id: "false"}],
                index: 10018,
                selected: {name: "클러스터 설정에서 가져오기", id: "inherit"}
            },
            selCompVo: {
                size: "",
                list: [
                    {name: "클러스터 설정에서 가져오기", id: "inherit"},
                    {name: "압축", id: "true"},
                    {name: "압축 해제", id: "false"}],
                index: 10019,
                selected: {name: "클러스터 설정에서 가져오기", id: "inherit"}
            },
            selNumaVo: {
                size: "",
                list: [
                    {name: "제한", id: "limit"},
                    {name: "기본 설정", id: "base"},
                    {name: "인터리브", id: "interleave"}],
                index: 10020,
                selected: {name: "제한", id: "limit"}
            },
            selTimezoneVo: {
                size: "",
                list: [
                    {name: "(GMT+09:00) Korea Standard Time", id: "Asia/Seoul"}],
                index: 10021,
                selected: {name: "(GMT+09:00) Korea Standard Time", id: "Asia/Seoul"}
            },
            selCpuShareVo: {
                size: "",
                list: [
                    {name: "비활성화됨", id: 0},
                    {name: "낮음", id: 512},
                    {name: "중간", id: 1024},
                    {name: "높음", id: 2048}],
                index: 10022,
                selected: {name: "비활성화됨", id: ""}
            },
            selConnDiskVo: {
                size: "",
                list: [
                    {name: "IDE", id: "ide"},
                    {name: "VirtIO-SCSI", id: "virtio_scsi"},
                    {name: "VirtIO", id: "virtio"}],
                index: 10023,
                selected: {name: "VirtIO-SCSI", id: "virtio_scsi"}
            },
            selStrgDomainVo: {
                size: "",
                list: [
                    {name: "", id: ""},],
                index: 10024,
                selected: {name: "", id: ""}
            },
            selNicVo: {
                size: "",
                list: [
                    {name: "", id: ""}],
                index: 10025,
                listIdx: 0,
                selected: {name: "없음", id: "none"}
            }

        },
        nicList: {},
        baseNic: {
            id: "empty",
            networkId: ""
        },
        //tempNics는 클러스터에 있는 네트워크 정보를 create vm을 할때 잠깐 nics부분에 물려주기 위해 만들었음. 나중에 create 할때는 nics정보랑 교체되어 vm생성
        tempNics: [],
        clusterNetworkList: [],
        clusterNetwork: "",
        selnetworkname: [],
        lunVos: [],
        hosts: [],
        selectedLun: [],
        disk: {
            diskId: '',
            flag: 1,
            name: '',
            description: '',
            //bootable: true,
            //wipeAfterDelete: true,
            bootable: false,
            sharable: false,
            storageDomainId: '',
            diskProfileId: '',
            diskProfileName: '',
            hostName: '',
            hostId: '',
            storageType: '',
            lunId: '',
            virtualSize: '',
            lun: [],
            lunVos: []
        },

        vmUpdate: {
            cluster: '',
            host: '',
            operatingSystem: '',
            nic: '',
            clusters: [],
            operatingSystems: [],
            nics: [],
            memoryBalloon: true,
            use: ''
        },
        hostStatus: 'all',
        status: '',
        orgNicsSize: '',
        existBootDisk: false,
        instanceType: null,
        cluster: '',
        storageDomainId: '',
        diskInterface: 'virtio_scsi',
        disks: [],
        selectDisk: '',
        diskIndex: '',
        addDiskIndex: '',
        linkedDisks: [],
        upLinkedDisks: [],
        selectNics: [],
        exSelectNics: [],
        leaseStorageDomain: '',
        storageDomains: [],
        instanceImageAdd: true,
        nics: [],
        nic: '',
        memory: '',
        maximumMemory: '4096 MB',
        physicalMemory: '1024 MB',
        totalCpu: 1,
        divisors: [1],
        virtualSockets: 1,
        coresPerVirtualSocket: 1,
        threadsPerCore: 1,
        pickHost: '',
        headlessMode: false,
        highAvailability: false,
        spinnerOn: false,
        recommendHost: '',
        recommendHosts: [],
        useCloudInit: false,
        firstDevice: 'hd',
        secondDevice: 'cdrom',
        node: "",
        numa: "",
        targetHost: '',
        cpuProfile: '',
        cpuShare: '',
        ioThreadsEnabled: false,
        rngEnabled: true,
        deviceSource: 'urandom',
        showConnectionDiskModal: false,
        showCreateDiskModal: false,
        updateConnectionDiskModal: false,
        bootImageUse: false,
        bootImage: '',
        orgName: '',
        vmNameStatus: false,
        validVmName: false,
        diskNameStatus: true,
        validDiskName: true,
        validDiskSize: true,
        step: 0,
        connDiskFlag: true,
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        },
        type: "",
        bootPossible: true
    },
    mounted: function () {
        // this.id = this.$route.query.vmId;
        // this.retrieveVmUpdateInfo();
        // this.retrieveStorageDomains();
        // this.retrieveDisks();

        // get parameter
        this.$EventBus.$on('openVmUpdateModal', (id,type) => {
            this.id = id;
            this.type = type;
            this.spinnerOn = true;
            this.step = 0;
            this.retrieveVmUpdateInfo();
            this.retrieveStorageDomains();
            this.retrieveDisks();
        });


    },

    methods: {

        setSelected: function (selectData, index) {
            if (index === 10001) {
                this.cluster = selectData.id;
            } else if (index === 10002) {
                this.vmUpdate.operatingSystem = selectData.id;
            } else if (index === 10003) {
                this.instanceType = selectData.id;
            } else if (index === 10004) {
                this.vmUpdate.type = selectData.id;
            } else if (index === 10005) {
                this.vmUpdate.use = selectData.id;
            } else if (index === 10006) {
                this.firstDevice = selectData.id;
            } else if (index === 10007) {
                this.secondDevice = selectData.id;
            } else if (index === 10008) {
                this.bootImage = selectData.id;
            } else if (index === 10009) {
                this.virtualSockets = selectData.id;
                this.selectVirtualSockets();
            } else if (index === 10010) {
                this.coresPerVirtualSocket = selectData.id;
                this.selectCoresPerVirtualSocket();
            } else if (index === 10011) {
                this.threadsPerCore = selectData.id;
                this.selectThreadsPerCore();
            } else if (index === 10012) {
                this.leaseStorageDomain = selectData.id;
            } else if (index === 10013) {
                this.vmUpdate.priority = selectData.id;
            } else if (index === 10014) {
                this.recommendHost = selectData.id;
            } else if (index === 10015) {
                this.targetHost = selectData.id;
            } else if (index === 10016) {
                this.vmUpdate.affinity = selectData.id;
            } else if (index === 10017) {
                this.vmUpdate.customMigration = selectData.id;
            } else if (index === 10018) {
                this.vmUpdate.autoConverge = selectData.id;
            } else if (index === 10019) {
                this.vmUpdate.compressed = selectData.id;
            } else if (index === 10020) {
                this.numa = selectData.id;
            } else if (index === 10021) {
                this.vmUpdate.timezone = selectData.id;
            } else if (index === 10022) {
                this.cpuShare = selectData.id;
            } else if (index === 10023) {
                this.selectDisk.diskInterface = selectData.id;
            } else if (index === 10024) {
                this.storageDomainId = selectData.id;
            }
        },
        clearStep: function () {
            let currentStepList = document.getElementsByClassName('btn-step');

            for (let step of currentStepList) {
                step.classList.remove('active')

            }
        },
        stepCss(step) {
            if (step === 0) {
                $("#upStep0").addClass('active');
            } else if (step === 1) {
                $("#upStep1").addClass('active');
            } else if (step === 2) {
                $("#upStep2").addClass('active');
            } else if (step === 3) {
                $("#upStep3").addClass('active');
            } else if (step === 4) {
                $("#upStep4").addClass('active');
            } else {
                $("#upStep5").addClass('active');
            }
        },
        clickStep: function (step) {
            this.clearStep();
            this.step = step;
            this.stepCss(step);
        },

        nextStep: function () {
            this.clearStep();
            this.step = 1;
            this.stepCss(1);
        },
        isUpdateStep(step) {
            return this.step === step;
        },
        openModal: function (type) {
            if (type === 'newDisk') {
                $("#upDiskCreateModal").addClass('active');
            } else if (type === 'newConnect') {
                this.pagingVo.viewList.filter((e)=>{e.readOnly = false; e.bootable = false;});
                $("#upDiskConnectModal").addClass('active');
            } else if (type === 'rmDisk') {
                $("#removeDiskModal").addClass('active');
            }
        },
        openCreateModal: function () {
            this.disk.status = 'create';
            this.openModal('newDisk');
        },

        closeModal: function (type) {
            if (type === 'vm') {
                $("#vmUpdateModal").removeClass('active');
                // this.resetSelBox(type);
            } else if (type === 'newDisk') {
                this.resetCreateDisk();

                var cnt = 0;
                if(this.linkedDisks.length >0){
                    cnt = this.linkedDisks.filter((e)=>{
                        return e.bootable === true;
                    }).length
                }

                if(cnt > 0){
                    this.bootPossible = false;
                }
                $("#upDiskCreateModal").removeClass('active');

            } else if (type === 'newConnect') {
                this.selectDisk = "";
                $("#upDiskConnectModal").removeClass('active');

            } else if (type === 'upConnect') {
                $("#upDiskConnectModal").removeClass('active');

            } else if (type === 'rmDisk') {
                this.resetCreateDisk();
                $("#removeDiskModal").removeClass('active');
            }
        },
        setViewList: function(viewList) {
            this.pagingVo.viewList = viewList;
        },
        checkDiskSize: function () {
            if (this.disk.virtualSize > 0) {
                this.validDiskSize = false;
            } else if (this.disk.virtualSize < 0) {
                this.validDiskSize = true;
            } else {
                this.validDiskSize = true;
            }
        },


        resetDisk: function () {
            this.disk.flag = 1;
            this.disk.name = '';
            this.disk.description = '';
            this.disk.removePermanently = false;
            this.disk.bootable = false;
            this.disk.sharable = false;
            this.disk.readOnly = false;
            this.disk.storageDomainId = '';
            this.disk.diskProfileId = '';
            this.diskProfileName = '';
            this.disk.hostName = '';
            this.disk.hostId = '';
            this.disk.storageType = '';
            this.disk.lunId = '';
            this.disk.virtualSize = '';
            this.disk.diskId = '';
            this.lunVos = '';
            this.disk.status = '';
            this.selectedLun = [];
        },

        resetCreateDisk: function () {
            this.resetDisk();
            this.validDiskSize = true;
            this.diskNameStatus = true;
            this.validDiskName = true;
            this.disk.lunVos = [];
            this.disk.lun = [];
        },

        flagDisk: function (flag) {
            this.resetDisk();
            this.disk.flag = flag;
        },

        selectLun: function (lun) {

            if (lun.diskId != null) {
                alert("선택한 LUN은 이미 디스크에서 사용하고 있습니다!");
            }

            if (this.disk.lun.length === 0) {
                if (lun.diskId == null) {
                    if (this.selectedLun.length == 0) {
                        this.selectedLun.push(lun);
                    } else if (this.selectedLun.length >= 1) {
                        this.selectedLun.splice(0, 1);
                    }
                }
            } else if (this.disk.lun.length !== 0) {
                if (this.disk.lun.diskId == null) {
                    if (this.disk.lun.length === 0) {
                        this.disk.lun.push(lun);
                    } else if (this.disk.lun.length >= 1) {
                        this.disk.lun.splice(0, 1);
                    }
                }

            }
        },
        // by gtpark change host
        changeHost: function () {
            if (this.lunVos.length == 0) {
                this.lunVos = '';
            }
        },

        // by gtpark change cluster
        changeCluster: function () {
            this.vmUpdate.clusters.some(clusters => {
                if (this.cluster === clusters.id) {
                    return this.clusterNetworkList = clusters.clusterNetworkList;
                }
            });
            // for (var clusters of this.vmUpdate.clusters) {
            // 	if (this.cluster === clusters.id) {
            // 		this.clusterNetworkList = clusters.clusterNetworkList;
            // 		break;
            // 	}
            // }
        },

        // retrieve update info
        retrieveVmUpdateInfo: function () {
            this.$http.get('/compute/updateVm/info?id=' + this.id).then(function (response) {

                this.vmUpdate = response.data.resultKey;
                this.hosts = this.vmUpdate.hosts;


                if (this.vmUpdate.selectNics != null && this.vmUpdate.selectNics.length > 0) {
                    this.nics = this.vmUpdate.selectNics;
                } else {
                    // this.nics.push('none');
                    this.nics.push({name: "없음", id: "none"});
                }

                this.orgNicsSize = this.nics.length;

                for (var i = 0; i < this.vmUpdate.disks.length; i++) {
                    if (this.vmUpdate.disks[i].bootable === true) {
                        this.existBootDisk = true;
                    }
                }

                this.status = this.vmUpdate.status;
                this.cluster = this.vmUpdate.clusters[0].id;
                // this.cluster = this.vmUpdate.cluster;
                this.orgName = this.vmUpdate.name;
                this.instanceType = this.vmUpdate.instanceType;
                this.orgInstanceType = this.vmUpdate.instanceType;
                this.linkedDisks = this.vmUpdate.disks;
                for (let disk of this.linkedDisks) {
                    disk.linkedDiskName = disk.name + " : " + disk.virtualSize + "GB";
                }

                var cnt = this.linkedDisks.filter((e)=>{
                    return e.bootable == true;
                }).length;

                if(cnt > 0){
                    this.bootPossible = false;
                }
                this.totalCpu = this.vmUpdate.virtualSockets * this.vmUpdate.coresPerVirtualSocket * this.vmUpdate.threadsPerCore;
                this.orgTotalCpu = this.totalCpu;
                this.virtualSockets = this.vmUpdate.virtualSockets;
                this.coresPerVirtualSocket = this.vmUpdate.coresPerVirtualSocket;
                this.threadsPerCore = this.vmUpdate.threadsPerCore;
                this.memory = this.vmUpdate.memory / 1024 / 1024 + " MB";
                this.maximumMemory = this.vmUpdate.maximumMemory / 1024 / 1024 + " MB";
                this.physicalMemory = this.vmUpdate.physicalMemory / 1024 / 1024 + " MB";
                // this.targetHost = this.vmUpdate.targetHost;
                this.cpuProfile = this.vmUpdate.clusters[0].name;
                this.cpuShare = this.vmUpdate.cpuShare;
                this.ioThreadsEnabled = this.vmUpdate.ioThreadsEnabled;
                this.headlessMode = this.vmUpdate.headlessMode;
                this.highAvailability = this.vmUpdate.highAvailability;
                this.leaseStorageDomain = this.vmUpdate.leaseStorageDomain == null ? '' : this.vmUpdate.leaseStorageDomain;
                this.vmUpdate.virtioScsiEnabled = true; // 어디서 가져와야되나?
                this.bootImageUse = this.vmUpdate.bootImageUse;
                this.bootImage = this.bootImageUse ? this.vmUpdate.bootImage : ((this.vmUpdate.bootImages != null && this.vmUpdate.bootImages.length > 0) ? this.vmUpdate.bootImages[0].id : '');
                this.vmUpdate.monitors = '1'; // 임시
                this.vmUpdate.singleSignOn = this.vmUpdate.isSingleSignOn;
                this.useCloudInit = this.vmUpdate.useCloudInit;
                this.firstDevice = this.vmUpdate.firstDevice;
                this.secondDevice = this.vmUpdate.secondDevice;
                this.vmNameStatus = false;
                this.validVmName = false;
                this.diskNameStatus = true;
                this.validDiskName = true;

                this.changeCluster();

                this.selectVo.selNicVo.list = [];
                this.tempNics = [];
                this.exSelectNics = [];
                this.upLinkedDisks = [];

                if (this.clusterNetworkList != null && this.clusterNetworkList.length > 0
                    && this.vmUpdate.selectNics != null && this.vmUpdate.selectNics.length > 0) {

                    this.selectVo.selNicVo.list = this.clusterNetworkList;

                    let tempSelNicVo = JSON.parse(JSON.stringify(this.selectVo.selNicVo));
                    tempSelNicVo.list.unshift({name: "빈 인테페이스", id: "empty"});
                    tempSelNicVo.list.unshift({name: "없음", id: "none"});

                    let selectNics = [...this.vmUpdate.selectNics];
                    let networkList = [...this.selectVo.selNicVo.list];

                    for (var i=0; i<selectNics.length; i++) {
                        for (var j=0; j<networkList.length; j++) {
                            if (selectNics[i].networkId == null && selectNics[i].id != null
                                && (this.tempNics.length < this.vmUpdate.selectNics.length)) {

                                tempSelNicVo.selected = tempSelNicVo.list[1];
                                this.tempNics.push(JSON.parse(JSON.stringify(tempSelNicVo)));
                                break;

                            } else if (selectNics[i].networkId != null && selectNics[i].networkId === networkList[j].id
                                && (this.tempNics.length < this.vmUpdate.selectNics.length)) {

                                tempSelNicVo.selected = {name: selectNics[i].networkName, id: selectNics[i].networkId};
                                this.tempNics.push(JSON.parse(JSON.stringify(tempSelNicVo)));
                                selectNics.splice(i, 1);
                                networkList.splice(j, 1);
                                i=-1; j=0;
                                break;
                            } else if(this.tempNics.length < this.vmUpdate.selectNics.length) {
                                let isExist = this.selectVo.selNicVo.list.filter((e,idx)=>{
                                    return e.id === selectNics[i].networkId
                                }).length;

                                if(isExist === 0){
                                    tempSelNicVo.selected = {name: "없음", id: "none"};
                                    this.tempNics.push(JSON.parse(JSON.stringify(tempSelNicVo)));
                                    break;
                                }
                            }


                        }
                    }
                    for (let selectNic of this.vmUpdate.selectNics) {
                        for (let network of this.selectVo.selNicVo.list) {
                            if (selectNic.id == null) {
                                selectNic.id = "none";
                                this.exSelectNics.push(selectNic);
                                break;
                            } else {
                                this.exSelectNics.push(selectNic);
                                break;
                            }
                        }
                    }
                    // this.selectVo.selNicVo.list.unshift({name: "none", id: ""});

                    this.selectVo.selNicVo.list.unshift({name: "빈 인테페이스", id: "empty"});
                    this.selectVo.selNicVo.list.unshift({name: "없음", id: "none"});

                }
                // else {
                //     this.selectVo.selNicVo.list.unshift({name: "none", id: "none"});
                //     this.tempNics.push(JSON.parse(JSON.stringify(this.selectVo.selNicVo)));
                // }

                if (this.vmUpdate.use == null || this.vmUpdate.use == '') {
                    this.vmUpdate.use = 'systemManagement';
                }

                this.$nextTick(function () {
                    // this.pickHost = "targetHost";

                    if (this.vmUpdate.pickHost === "targetHost") {
                        this.pickHost = "targetHost";
                    } else {
                        this.pickHost = "recommendHost";
                    }

                    this.setHost();
                });

//				if(this.vmUpdate.bootImage == '') {
//					this.vmUpdate.bootImage = this.vmUpdate.bootImages[0];
//				}

                // selectBox list mapping
                this.selectVo.selCreClusterVo.list = JSON.parse(JSON.stringify(this.vmUpdate.clusters));
                this.initData.creCluster = {
                    name: JSON.parse(JSON.stringify(this.vmUpdate.clusters[0].name)),
                    id: JSON.parse(JSON.stringify(this.vmUpdate.clusters[0].id))
                };
                this.selectVo.selCreClusterVo.selected = this.initData.creCluster;

                this.selectVo.selCreOsVo.list = JSON.parse(JSON.stringify(this.vmUpdate.operatingSystems));
                for (let os of this.selectVo.selCreOsVo.list) {
                    if (this.vmUpdate.operatingSystem == os.id) {
                        this.selectVo.selCreOpsVo.selected = {name: os.name, id: os.id};
                        break;
                    }
                }

                this.selectVo.selCreInsVo.list = JSON.parse(JSON.stringify(this.vmUpdate.instanceTypes));
                if (this.selectVo.selCreInsVo.list[0].name !== "사용자 정의") {
                    this.selectVo.selCreInsVo.list.unshift(this.initData.creIns);
                }
                for (let instance of this.selectVo.selCreInsVo.list) {
                    if (this.instanceType === instance.id) {
                        this.selectVo.selCreInsVo.selected = {name: instance.name, id: instance.id};
                        break;
                    }
                }

                for (let ops of this.selectVo.selCreOpsVo.list) {
                    if (this.vmUpdate.type == ops.id) {
                        this.selectVo.selCreOpsVo.selected = {name: ops.name, id: ops.id};
                        break;
                    }
                }

                for (let usage of this.selectVo.selCreUsageVo.list) {
                    if (this.vmUpdate.use == usage.id) {
                        this.selectVo.selCreUsageVo.selected = {name: usage.name, id: usage.id};
                        break;
                    }
                }

                for (let firDev of this.selectVo.selFirDevVo.list) {
                    if (this.firstDevice == firDev.id) {
                        this.selectVo.selFirDevVo.selected = {name: firDev.name, id: firDev.id};
                        break;
                    }
                }

                for (let secDev of this.selectVo.selSecDevVo.list) {
                    if (this.secondDevice == secDev.id) {
                        this.selectVo.selSecDevVo.selected = {name: secDev.name, id: secDev.id};
                        break;
                    }
                }

                this.selectVo.selBootImgVo.list = [];
                if (this.vmUpdate.bootImages != null && this.vmUpdate.bootImages.length > 0) {

                    this.selectVo.selBootImgVo.list = JSON.parse(JSON.stringify(this.vmUpdate.bootImages));

                    if (this.vmUpdate.bootImageUse && this.vmUpdate.bootImage !== null) {
                        for (let bootImg of this.selectVo.selBootImgVo.list) {

                            if (this.vmUpdate.bootImage == bootImg.id) {
                                this.selectVo.selBootImgVo.selected = {name: bootImg.name, id: bootImg.id};
                                break;
                            }
                        }
                    } else {
                        this.selectVo.selBootImgVo.selected = {
                            name: this.selectVo.selBootImgVo.list[0].name,
                            id: this.selectVo.selBootImgVo.list[0].id
                        };
                    }

                } else {
                    this.selectVo.selBootImgVo.list.push({name: "없음", id: "none"});
                    this.selectVo.selBootImgVo.selected = {name: "없음", id: "none"};

                }

                this.selectVo.selLeaseStrgVo.list = JSON.parse(JSON.stringify(this.vmUpdate.leaseStorageDomains));
                if (this.vmUpdate.leaseStorageDomain == null || this.selectVo.selLeaseStrgVo.list[0].name !== "가상 머신 임대 없음") {
                    this.selectVo.selLeaseStrgVo.list.unshift(this.initData.creLeaseStrg);
                }
                for (let storage of this.selectVo.selLeaseStrgVo.list) {
                    if (this.leaseStorageDomain == null) {
                        this.selectVo.selLeaseStrgVo.selected = this.selectVo.selLeaseStrgVo.list[0];

                    } else if (this.leaseStorageDomain != null && storage.id == this.leaseStorageDomain) {
                        this.selectVo.selLeaseStrgVo.selected = {name: storage.name, id: storage.id};
                    }
                }

                for (let priority of this.selectVo.selPriorityVo.list) {
                    if (this.vmUpdate.priority == 1) {
                        this.selectVo.selPriorityVo.selected = {name: "낮음", id: 0};
                        break;
                    }

                    if (this.vmUpdate.priority == priority.id) {
                        this.selectVo.selPriorityVo.selected = {name: priority.name, id: priority.id};
                        break;
                    }
                }

                this.selectVo.selTarHostVo.list = [];
                for (let host of this.vmUpdate.hosts) {
                    this.selectVo.selTarHostVo.list.push({
                        name: JSON.parse(JSON.stringify(host.hostName)),
                        id: JSON.parse(JSON.stringify(host.hostId))
                    });
                }
                if (this.vmUpdate.recommendHost == null) {
                    for (let targetHost of this.selectVo.selTarHostVo.list) {
                        if (targetHost.id === this.vmUpdate.targetHost) {
                            this.selectVo.selTarHostVo.selected = {name: targetHost.name, id: targetHost.id};
                            ;
                            break;
                        }
                    }

                }

                for (let migration of this.selectVo.selMigrationVo.list) {
                    if (migration.id === this.vmUpdate.affinity) {
                        this.selectVo.selMigrationVo.selected = {name: migration.name, id: migration.id}
                        break;
                    }
                }

                if (this.vmUpdate.customMigrationUsed) {
                    for (let cusMig of this.selectVo.selCustomMigVo.list) {
                        if (this.vmUpdate.customMigration != null && this.vmUpdate.customMigration == cusMig.id) {
                            this.selectVo.selCustomMigVo.selected = {name: cusMig.name, id: cusMig.id};
                        }

                    }
                } else {
                    this.selectVo.selCustomMigVo.selected = {name: "정책 선택", id: "null"};
                }

                for (let autoCon of this.selectVo.selAutoConVo.list) {
                    if (autoCon.id === this.vmUpdate.autoConverge) {
                        this.selectVo.selAutoConVo.selected = {name: autoCon.name, id: autoCon.id};
                        break;
                    }

                }

                for (let comp of this.selectVo.selCompVo.list) {
                    if (comp.id === this.vmUpdate.compressed) {
                        this.selectVo.selCompVo.selected = {name: comp.name, id: comp.id};
                        break;
                    }

                }

                this.selectVo.selNumaVo.selected = this.initData.creNuma;

                for (let cpuShare of this.selectVo.selCpuShareVo.list) {
                    if (cpuShare.id === this.vmUpdate.cpuShare) {
                        this.selectVo.selCpuShareVo.selected = {name: cpuShare.name, id: cpuShare.id};
                        break;
                    }
                }
                // selectBox list mapping

                this.clearStep();
                $("#upStep0").addClass('active');
                $("#vmUpdateModal").addClass('active');
                this.spinnerOn = false;

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // 디스크 연결 목록
        retrieveDisks: function () {
            this.$http.get('/compute/createVm/disks').then(function (response) {
                this.disks = response.data.resultKey;

                for (let disk of this.disks) {
                    disk.selectVo = JSON.parse(JSON.stringify(this.selectVo.selConnDiskVo));
                    // console.log(disk.selectVo);
                }
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        setDiskIndex: function (index, status) {
            this.diskIndex = index;
            this.connDiskFlag = true;

            if (status == 'create' || status == 'update') {
                this.disk = JSON.parse(JSON.stringify(this.linkedDisks[index]));
                this.disk.status = status;
                this.disk.flag = 1;
                this.validDiskName = false;
                this.diskNameStatus = false;
                this.validDiskSize = false;
                if(this.disk.bootable){
                    this.bootPossible = true;
                } else {
                    this.bootPossible = false;
                }

                var cnt = 0;
                if(this.linkedDisks.length >0){
                    cnt = this.linkedDisks.filter((e)=>{
                        return e.bootable === true;
                    }).length
                }

                if(cnt === 0){
                    this.bootPossible = true;
                }


                this.openModal('newDisk');

                if (this.disk.status == 'update') {
                    this.disk.virtualSizeExtend = null;
                }
            } else if (status == 'upConnect') {
                this.connDiskFlag = false;
                this.openModal('newConnect');
            }
        },

        connectDisk: function () {
            if (this.connDiskFlag) {
                this.selectDisk.status = 'linked';
                this.selectDisk.diskInterface = this.selectDisk.diskInterface == null ? 'virtio_scsi' : this.selectDisk.diskInterface;
                this.selectDisk.linkedDiskName = this.selectDisk.name + " : " + this.selectDisk.virtualSize + "GB";
                this.linkedDisks.push(this.selectDisk);
                this.disks.splice(this.disks.indexOf(this.selectDisk), 1);
                this.instanceImageAdd = false;
                this.closeModal('newConnect');
            } else {
                this.updateConnectDisk();
            }
        },

        updateConnectDisk: function () {
            this.selectDisk.status = 'linked';
            this.selectDisk.diskInterface = this.selectDisk.diskInterface == null ? 'virtio_scsi' : this.selectDisk.diskInterface;
            this.selectDisk.linkedDiskName = this.selectDisk.name + " : " + this.selectDisk.virtualSize + "GB";
            this.disks.push(this.linkedDisks[this.diskIndex]);
            this.linkedDisks[this.diskIndex] = this.selectDisk;
            this.disks.splice(this.disks.indexOf(this.selectDisk), 1);
            $("#upDiskConnectModal").removeClass('active');
        },

        changeDiskInterface: function (event) {
            this.selectDisk.diskInterface = event.srcElement.value;
        },

        addDisk: function (index) {
            this.instanceImageAdd = true;
        },

        removeDisk: function (index) {

            if(this.linkedDisks[index].bootable){
                this.bootPossible = true;
            }

            if (this.linkedDisks[index].status === 'linked') {

                this.disks.push(this.linkedDisks[index]);
                this.linkedDisks.splice(index, 1);

                if (this.linkedDisks.length === 0) {
                    this.instanceImageAdd = true;
                }
            } else if (this.linkedDisks[index].status === 'create') {
                if (this.linkedDisks[index].lunId !== ""
                    && this.linkedDisks[index].diskId === "temp") {
                    this.hosts.some(host => {
                        host.lunVos.some(lunVo => {
                            if (lunVo.lunId === this.linkedDisks[index].lunId
                                && this.linkedDisks[index].diskId === "temp") {
                                return lunVo.diskId = null;
                            }
                        })
                    })
                }
                this.linkedDisks.splice(index, 1);
            } else {
                this.openModal('rmDisk');
                this.disk = JSON.parse(JSON.stringify(this.linkedDisks[index]));
                this.disk.index = JSON.parse(JSON.stringify(index));
            }
        },

        removeTargetDisk: function () {
            // var index = this.disk.index;
            //
            // if (this.disk.removePermanently) {
            //     this.disk.status = 'remove';
            // } else {
            //     this.disk.status = 'disconnect';
            // }
            //
            // this.linkedDisks[index] = JSON.parse(JSON.stringify(this.disk));
            // // this.disk = {};
            // this.resetDisk();
            // $(".removediskmodal").modal('hide');

            var index = this.disk.index;

            if (this.disk.removePermanently) {
                this.disk.status = 'remove';
            } else {
                this.disk.status = 'disconnect';
            }
            this.upLinkedDisks.push(JSON.parse(JSON.stringify(this.disk)));
            this.linkedDisks.splice(index, 1);
            this.resetDisk();
            this.closeModal('rmDisk');

        },

        // 디스크 생성 화면
        retrieveStorageDomains: function () {
            this.$http.get('/v2/storage/domains?status=active&domainType=DATA').then(function (response) {
                this.storageDomains = response.data.resultKey;
                this.selectVo.selStrgDomainVo.list = JSON.parse(JSON.stringify(this.storageDomains));

                for (var i = 0; i < this.storageDomains.length; i++) {
                    // if(this.storageDomains[i].type == 'DATA') {
                    this.storageDomainId = this.storageDomains[i].id;
                    // break;
                    // }
                    this.initData.creStrgDomain = {
                        name: JSON.parse(JSON.stringify(this.storageDomains[i].name)),
                        id: JSON.parse(JSON.stringify(this.storageDomains[i].id))
                    };
                    this.selectVo.selStrgDomainVo.selected = this.initData.creStrgDomain;
                    break;

                }
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        createDisk: function () {
            var checkResult = this.checkInputName(this.disk.name);

            // flag == 1이면 이미지 디스크 직접 만들기 탭 , flag == 2이면 파이버 채널로 디스크 만드는 탭
            if (this.disk.status === 'create') {
                if (this.disk.flag === 1) {
                    this.disk.storageDomainId = this.storageDomainId;
                    this.disk.diskInterface = this.diskInterface;

                    if (this.disk.virtualSize == null) {
                        alert("디스크 크기를 입력해야 합니다.");
                        return;
                    } else if (this.validDiskName) {
                        alert("디스크 이름은 4글자 이상 입력해야 합니다.");
                        return;
                    } else if (this.diskNameStatus) {
                        var checkResult = this.checkInputName(this.disk.name);
                        alert("디스크 이름은 " + checkResult.msg);
                        return;
                    }

                    this.disk.linkedDiskName = this.disk.name + " : " + this.disk.virtualSize + "GB";
                    // this.linkedDisks[this.diskIndex] = JSON.parse(JSON.stringify(this.disk));
                    this.linkedDisks.push(JSON.parse(JSON.stringify(this.disk)));
                    this.instanceImageAdd = false;
                    this.resetDisk();
                    this.closeModal('newDisk');
                }
            } else {
                if (this.disk.flag === 1) {
                    this.disk.storageDomainId = this.storageDomainId;
                    this.disk.diskInterface = this.diskInterface;

                    if (this.disk.virtualSize == null) {
                        alert("디스크 크기를 입력해야 합니다.");
                        return;
                    } else if (this.validDiskName) {
                        alert("디스크 이름은 4글자 이상 입력해야 합니다.");
                        return;
                    } else if (this.diskNameStatus) {
                        var checkResult = this.checkInputName(this.disk.name);
                        alert("디스크 이름은 " + checkResult.msg);
                        return;
                    } else {
                        this.disk.status = 'update';
                        this.instanceImageAdd = false;

                        this.disk.linkedDiskName = this.disk.name + " : " + this.disk.virtualSize + "GB";
                        this.linkedDisks[this.diskIndex] = JSON.parse(JSON.stringify(this.disk));
                        // this.linkedDisks.push(JSON.parse(JSON.stringify(this.disk)));
                        this.resetDisk();
                        this.closeModal('newDisk');
                    }
                }
                // else if(this.disk.flag === 2){
                // 	if(this.validDiskName){
                // 		alert("디스크 이름은 4글자 이상 입력해야 합니다.");
                // 		return;
                // 	} else if(this.diskNameStatus) {
                // 		var checkResult = this.checkInputName(this.disk.name);
                // 		alert("디스크 이름은 " + checkResult.msg);
                // 		return;
                // 	}
                // 	if(this.lunVos === ''){
                // 		alert("호스트를 선택해 주세요.");
                // 		return;
                // 	}
                //
                // 	if(this.disk.storageType === ''){
                // 		alert("스토리지 타입을 선택해 주세요.")
                // 		return;
                // 	}
                //
                // 	if(this.selectedLun.length === 0){
                // 		alert("LUN을 선택해 주세요.")
                // 		return;
                // 	}
                // 	if(this.selectedLun[0].diskId == null){
                // 		this.selectedLun[0].diskId = "temp";
                // 		this.disk.diskId = "temp";
                // 	}
                // 	this.hosts.some(host =>{
                // 		host.lunVos.some(lunVo =>{
                // 			if(lunVo.lunId === this.selectedLun[0].lunId
                // 				&& this.selectedLun[0].diskId === "temp"){
                // 				return lunVo.diskId = "temp";
                // 			}
                // 		})
                // 	})
                //
                // 	this.disk.storageDomainId = this.storageDomainId;
                // 	this.disk.diskInterface = this.diskInterface;
                // 	this.disk.lunId = this.selectedLun[0].lunId;
                // 	// this.disk.lun.push(JSON.parse(JSON.stringify(this.selectedLun[0])));
                // 	// this.disk.lunVos = JSON.parse(JSON.stringify(this.lunVos));
                // 	this.disk.hostId = this.selectedLun[0].lunHostId;
                // 	this.disk.virtualSize = (this.selectedLun[0].lunSize / Math.pow(1024, 3).toFixed(2));
                // 	this.disk.status = 'create';
                // 	this.instanceImageAdd = false;
                // 	this.linkedDisks.push(JSON.parse(JSON.stringify(this.disk)));
                // 	this.resetDisk()
                // 	this.selectedLun = [];
                // 	this.lunVos = '';
                // 	$(".creatediskmodal").modal('hide');
                // }
            }
        },

// 		createDisk: function() {
// 			var checkResult = this.checkInputName(this.disk.name);
// 			this.disk.storageDomainId = this.storageDomainId;
// 			this.disk.diskInterface = this.diskInterface;
//
// 			// if(this.disk.status == 'create') {
// 			// 	 console.log("index:" + this.linkedDisks.indexOf(this.disk));
// 			// 	this.linkedDisks[this.diskIndex] = this.disk;
// 			// } else {
// 			// 	this.disk.status = 'create';
// 			// 	this.instanceImageAdd = false;
// 			// 	this.linkedDisks.push(this.disk);
// 			// }
// 			//
// 			// this.disk = {};
// 			// $(".creatediskmodal").modal('hide');
//
// 			if(this.disk.status == 'create') {
// 				this.linkedDisks[this.diskIndex] = this.disk;
// 				this.disk = {};
// 				$(".creatediskmodal").modal('hide');
// 			} else {
// 				if(this.disk.virtualSize == null) {
// 					alert("디스크 크기를 입력해야 합니다.");
// 				} else if(this.validDiskName) {
// 					alert("디스크 이름은 4글자 이상 입력해야 합니다.");
// 				} else if(this.diskNameStatus) {
// 					var checkResult = this.checkInputName(this.disk.name);
// 					alert("디스크 이름은 " + checkResult.msg);
// 				} else {
// 					// 디스크 이름 중복 확인
// //					var isDuplication = false;
// //
// //					this.$http.post('/compute/createVm/checkDuplicateDiskName', this.disk).then(function(response) {
// //						isDuplication = response.data.resultKey;
// //					}.bind(this)).catch(function(error) {
// //			             console.log(error);
// //			        });
// //
// //					if(isDuplication) {
// //						alert("중복된 디스크 이름입니다.");
// //					} else {
// 					this.disk.status = 'create';
// 					this.instanceImageAdd = false;
// 					this.linkedDisks.push(this.disk);
//
// 					this.disk = {};
// 					$(".creatediskmodal").modal('hide');
// //					}
// 				}
// 			}
// 		},


        checkDiskName: function () {
            if (this.disk.name.length >= 4) {
                this.validDiskName = false;
            } else {
                this.validDiskName = true;
            }

            this.diskNameStatus = this.checkInputName(this.disk.name).result;
        },

        memoryChange: function () {
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

            if (this.memory != this.vmUpdate.memory / 1024 / 1024) {
                this.instanceType = null;
            }
        },

        maximumMemoryChange: function () {
            if (this.maximumMemory.includes("GB") || this.maximumMemory.includes("gb")) {
                this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
                this.maximumMemory = this.maximumMemory * 1024;
            } else if (this.maximumMemory.includes("MB") || this.maximumMemory.includes("mb")) {
                this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
            }

            this.maximumMemory = this.maximumMemory + " MB";
        },

        physicalMemoryChange: function () {
            if (parseInt(this.physicalMemory.replace(/[^0-9]/g, '')) > parseInt(this.memory.replace(/[^0-9]/g, ''))) {
                alert("시스템 항목의 메모리 크기보다 클 수 없습니다.");
                this.physicalMemory = this.memory;
            }

            if (this.physicalMemory.includes("GB") || this.physicalMemory.includes("gb")) {
                this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g, '');
                this.physicalMemory = this.physicalMemory * 1024;
            } else if (this.physicalMemory.includes("MB") || this.physicalMemory.includes("mb")) {
                this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g, '');
            }

            this.physicalMemory = this.physicalMemory + " MB";
        },

        selectVirtualSockets: function () {
            var value = this.totalCpu / this.virtualSockets;

            if (this.threadsPerCore == value) {
                this.coresPerVirtualSocket = 1;
            } else {
                this.coresPerVirtualSocket = value;
                this.threadsPerCore = 1;
            }

            this.selectVo.selVirSockVo.selected = {name: this.virtualSockets.toString(), id: this.virtualSockets};
            this.selectVo.selPerVirSockVo.selected = {
                name: this.coresPerVirtualSocket.toString(),
                id: this.coresPerVirtualSocket
            };
            this.selectVo.selThreadPerCoreVo.selected = {name: this.threadsPerCore.toString(), id: this.threadsPerCore};


        },

        selectCoresPerVirtualSocket: function () {

            var result = this.virtualSockets * this.coresPerVirtualSocket;

            if (this.totalCpu > result) {
                if (this.virtualSockets == 1) {
                    this.virtualSockets = this.totalCpu / result;
                    this.threadsPerCore = 1;
                } else {
                    if (result % 2 === 1) {
                        this.virtualSockets = this.totalCpu / this.coresPerVirtualSocket;
                        this.threadsPerCore = 1;
                    } else {
                        this.threadsPerCore = this.totalCpu / (result);
                    }
                }
            } else {
                this.virtualSockets = this.totalCpu / this.coresPerVirtualSocket;
                this.threadsPerCore = 1;
            }
            this.selectVo.selVirSockVo.selected = {name: this.virtualSockets.toString(), id: this.virtualSockets};
            this.selectVo.selPerVirSockVo.selected = {
                name: this.coresPerVirtualSocket.toString(),
                id: this.coresPerVirtualSocket
            };
            this.selectVo.selThreadPerCoreVo.selected = {name: this.threadsPerCore.toString(), id: this.threadsPerCore};
        },

        selectThreadsPerCore: function () {

            var result = this.virtualSockets * this.threadsPerCore;

            if (this.totalCpu > result) {
                if (this.virtualSockets == 1) {
                    if (result % 2 == 1) {
                        this.virtualSockets = this.totalCpu / this.threadsPerCore;
                        this.coresPerVirtualSocket = 1;
                    } else {
                        this.coresPerVirtualSocket = this.totalCpu / result;
                    }
                } else {
                    if (result % 2 == 1) {
                        this.virtualSockets = this.totalCpu / this.threadsPerCore;
                        this.coresPerVirtualSocket = 1;
                    } else {
                        this.coresPerVirtualSocket = this.totalCpu / result;
                    }
                }
            } else {
                this.virtualSockets = this.totalCpu / this.threadsPerCore;
                this.coresPerVirtualSocket = 1;
            }

            this.selectVo.selVirSockVo.selected = {name: this.virtualSockets.toString(), id: this.virtualSockets};
            this.selectVo.selPerVirSockVo.selected = {
                name: this.coresPerVirtualSocket.toString(),
                id: this.coresPerVirtualSocket
            };
            this.selectVo.selThreadPerCoreVo.selected = {name: this.threadsPerCore.toString(), id: this.threadsPerCore};
        },

        checkVmName: function () {
            if (this.vmUpdate.name.length >= 4) {
                this.validVmName = false;
            } else {
                this.validVmName = true;
            }

            this.vmNameStatus = this.checkInputName(this.vmUpdate.name).result;
        },
        updateVm: function () {
            if (this.validVmName) {
                alert("가상머신 이름은 4글자 이상 입력해야 합니다.");
            } else {
                var checkResult = this.checkInputName(this.vmUpdate.name);

                if (checkResult.result) {
                    alert("가상머신 이름은 " + checkResult.msg);
                } else {
                    if (this.orgName !== this.vmUpdate.name) { // 가상머신 이름 변경 시 중복체크
                        this.$http.post('/compute/vm/checkDuplicateName?name=' + this.vmUpdate.name).then(function (response) {
                            if (response.data.resultKey) {
                                alert("중복된 이름입니다.");
                            } else {
                                this.sendUpdateVm();
                            }
                        }.bind(this)).catch(function (error) {
                            // console.log(error);
                        });
                    } else {
                        this.sendUpdateVm();
                    }
                }
            }
        },

        sendUpdateVm: function () {
            if ((this.pickHost === 'targetHost' && this.targetHost === null) ||
                (this.pickHost === 'recommendHost' && this.recommendHost === null)) {
                alert("실행 호스트를 선택해야 합니다.");
            } else {
                this.vmUpdate.cluster = this.cluster;
                this.vmUpdate.instanceType = this.instanceType;
                this.vmUpdate.memory = this.memory == 0 ? 1024 : this.memory.replace(/[^0-9]/g, '') * 1024 * 1024;
                this.vmUpdate.maximumMemory = this.maximumMemory == 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                this.vmUpdate.physicalMemory = this.physicalMemory == 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                this.vmUpdate.coresPerVirtualSocket = this.coresPerVirtualSocket;
                this.vmUpdate.virtualSockets = this.virtualSockets;
                this.vmUpdate.threadsPerCore = this.threadsPerCore;
                this.vmUpdate.firstDevice = this.firstDevice;
                this.vmUpdate.secondDevice = this.secondDevice;
                this.vmUpdate.ioThreadsEnabled = this.ioThreadsEnabled ? 1 : 0;
                this.vmUpdate.rngEnabled = this.rngEnabled;
                this.vmUpdate.deviceSource = this.deviceSource;
                this.vmUpdate.exSelectNics = this.exSelectNics;

                // 부팅가능 옵션 편집 시 부팅 디스크를 제일 나중에 업데이트해야 충돌이 나지 않는다
                var disks = [];

                if (this.linkedDisks.length > 0) {
                    for (var i = 0; i < this.linkedDisks.length; i++) {
                        // if (!this.linkedDisks[i].bootable) {
                            disks.push(this.linkedDisks[i]);
                        // }
                    }
                }

                if (this.upLinkedDisks.length > 0) {
                    for (var i = 0; i < this.upLinkedDisks.length; i++) {
                        disks.push(this.upLinkedDisks[i]);
                    }
                }

                this.vmUpdate.disks = disks;
                this.vmUpdate.headlessMode = this.headlessMode;
                this.vmUpdate.highAvailability = this.highAvailability;
                this.vmUpdate.leaseStorageDomain = this.leaseStorageDomain;

                this.vmUpdate.selectNics = [];

                // // by gtpark
                this.tempNics.forEach(tempNic => {
                    this.vmUpdate.nics.some(nic => {
                        if (tempNic.selected.id == nic.networkId) {
                            return this.vmUpdate.selectNics.push(nic);
                        } else if (tempNic.selected.id == 'empty') {
                            return this.vmUpdate.selectNics.push(this.baseNic);
                        }
                    })
                })

                if (this.bootImageUse) {
                    this.vmUpdate.bootImage = this.bootImage;
                }

                this.vmUpdate.pickHost = this.pickHost;

                if (this.pickHost === 'targetHost') {
                    this.vmUpdate.recommendHost = null;
                    this.vmUpdate.targetHost = this.targetHost;
                } else {
                    this.vmUpdate.recommendHost = this.recommendHost;
                    this.vmUpdate.targetHost = null;
                }

                let selectNicCnt = 0;
                let nicFlag = true;
                let netAttachmentFlag = true;
                let selectNicList = JSON.parse(JSON.stringify(this.vmUpdate.selectNics));
                let targetHost = (this.vmUpdate.recommendHost != null && this.vmUpdate.targetHost == null) ? this.vmUpdate.recommendHost : this.vmUpdate.targetHost;

                if (this.vmUpdate.status == "up") {
                    for (let host of this.vmUpdate.hosts) {
                        if (host.hostId == targetHost) {
                            let originNetAttachmentList = JSON.parse(JSON.stringify(host.netAttachment));
                            for (let attachmentIdx in originNetAttachmentList) {
                                for (let selectNicIdx in selectNicList) {
                                    if (originNetAttachmentList[attachmentIdx].nicNetworkId == selectNicList[selectNicIdx].networkId
                                        && selectNicList[selectNicIdx].networkId != "") {
                                        selectNicCnt = 0;
                                        for (let selectNicIndex = 0; selectNicIndex < selectNicList.length; selectNicIndex++) {
                                            if (selectNicList[selectNicIndex].networkId == selectNicList[selectNicList.length - 1].networkId) {
                                                selectNicCnt = ++selectNicCnt;
                                            }
                                        }
                                        selectNicList.splice(selectNicIdx, selectNicCnt);
                                    }
                                }
                            }
                            if (selectNicList.length != 0 && selectNicList[0].id != "") {
                                nicFlag = false;
                                netAttachmentFlag = false;
                                alert('가상머신이 실행 중인 호스트에 ' + selectNicList[0].networkName + ' 네트워크가 존재하지 않습니다.' +
                                    '호스트에 네트워크를 추가하가나 이 네트워크가 있는' +
                                    '호스트에 가상머신을 마이그레이션하거나 vNic을 언플러그로 추가하십시오.');
                            }
                        }
                    }
                }

                // if (this.vmUpdate.status == "up") {
                //     if (this.vmUpdate.recommendHost != null && this.vmUpdate.targetHost == null) {
                //         for (let host of this.vmUpdate.hosts) {
                //             if (host.hostId == this.vmUpdate.recommendHost) {
                //                 let originNetAttachmentList = JSON.parse(JSON.stringify(host.netAttachment));
                //                 for (let attachmentIdx in originNetAttachmentList) {
                //                     for (let selectNicIdx in selectNicList) {
                //                         if (originNetAttachmentList[attachmentIdx].nicNetworkId == selectNicList[selectNicIdx].networkId
                //                             && selectNicList[selectNicIdx].networkId != "") {
                //                             selectNicCnt = 0;
                //                             for (let selectNicIndex = 0; selectNicIndex < selectNicList.length; selectNicIndex++) {
                //                                 if (selectNicList[selectNicIndex].networkId == selectNicList[selectNicList.length - 1].networkId) {
                //                                     selectNicCnt = ++selectNicCnt;
                //                                 }
                //                             }
                //                             selectNicList.splice(selectNicIdx, selectNicCnt);
                //                         }
                //                     }
                //                 }
                //                 if (selectNicList.length != 0 && selectNicList[0].id != "") {
                //                     nicFlag = false;
                //                     netAttachmentFlag = false;
                //                     alert('가상머신이 실행 중인 호스트에 ' + selectNicList[0].networkName + ' 네트워크가 존재하지 않습니다.' +
                //                         '호스트에 네트워크를 추가하가나 이 네트워크가 있는' +
                //                         '호스트에 가상머신을 마이그레이션하거나 vNic을 언플러그로 추가하십시오.');
                //                 }
                //             }
                //         }
                //     } else if (this.vmUpdate.recommendHost == null && this.vmUpdate.targetHost != null) {
                //         for (let host of this.vmUpdate.hosts) {
                //             if (host.hostId == this.vmUpdate.targetHost) {
                //                 let originNetAttachmentList = JSON.parse(JSON.stringify(host.netAttachment));
                //                 for (let attachmentIdx in originNetAttachmentList) {
                //                     for (let selectNicIdx in selectNicList) {
                //                         if (originNetAttachmentList[attachmentIdx].nicNetworkId == selectNicList[selectNicIdx].networkId
                //                             && selectNicList[selectNicIdx].networkId != "") {
                //                             selectNicCnt = 0;
                //                             for (let selectNicIndex = 0; selectNicIndex < selectNicList.length; selectNicIndex++) {
                //                                 if (selectNicList[selectNicIndex].networkId == selectNicList[selectNicList.length - 1].networkId) {
                //                                     selectNicCnt = ++selectNicCnt;
                //                                 }
                //                             }
                //                             selectNicList.splice(selectNicIdx, selectNicCnt);
                //                         }
                //                     }
                //                 }
                //                 if (selectNicList.length != 0 && selectNicList[0].id != "") {
                //                     nicFlag = false;
                //                     netAttachmentFlag = false;
                //                     alert('가상머신이 실행 중인 호스트에 ' + selectNicList[0].networkName + ' 네트워크가 존재하지 않습니다.' +
                //                         '호스트에 네트워크를 추가하가나 이 네트워크가 있는' +
                //                         '호스트에 가상머신을 마이그레이션하거나 vNic을 언플러그로 추가하십시오.');
                //
                //                 }
                //             }
                //         }
                //     }
                // }

                if (nicFlag) {
                    this.$http.post('/compute/updateVm', this.vmUpdate).then(function (response) {
                        if(this.type === 'vms'){
                            location.href = '/compute/vms';
                        } else {
                            location.href = '/compute/vm?id='+this.id;
                        }

                    }.bind(this)).catch(function (error) {
                        if(this.type === 'vms'){
                            location.href = '/compute/vms';
                        } else {
                            location.href = '/compute/vm?id='+this.id;
                        }
                        // console.log(error);
                    });
                }
            }
        },

        symphonyRecommend: _.debounce(function () {
            this.vmUpdate.cluster = this.cluster;
            this.vmUpdate.memory = this.memory === 0 ? 1024 : this.memory.replace(/[^0-9]/g, '');
            this.vmUpdate.maximumMemory = this.maximumMemory === 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '');
            this.vmUpdate.physicalMemory = this.physicalMemory === 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '');

            this.$http.post('/compute/createVm/recommendHosts', this.vmUpdate).then(function (response) {
                this.recommendHosts = response.data.resultKey;
                this.selectVo.selRecHostVo.list = [];

                if (this.recommendHosts.length == 0) {
                    for (var i = 0; i < this.vmUpdate.hosts.length; i++) {
                        if (this.vmUpdate.cluster == this.vmUpdate.hosts[i].clusterId) {
                            this.recommendHosts.push([this.vmUpdate.hosts[i].hostId, this.vmUpdate.hosts[i].hostName]);
                            this.selectVo.selRecHostVo.list.push({
                                name: this.vmUpdate.hosts[i].hostId,
                                id: this.vmUpdate.hosts[i].hostName
                            });
                        }
                    }
                } else {
                    for (let recHost of this.recommendHosts) {
                        this.selectVo.selRecHostVo.list.push({name: recHost[1], id: recHost[0]});
                    }
                }

                this.recommendHost = this.recommendHosts[0][0];
                this.selectVo.selRecHostVo.selected = {name: this.recommendHosts[0][1], id: this.recommendHosts[0][0]}

            }.bind(this)).catch(function (error) {
                // console.log(error);
            })
        }, 1000),

        setHost: function (value) {
            if (value == 'recommendHost') {
                this.targetHost = null;

                if (this.recommendHosts.length != 0) {
                    this.recommendHost = this.recommendHosts[0][0]; // 심포니 추천과 특정 호스트 변수 나눠야됨
                }
            } else {

            }

            if (this.vmUpdate.targetHost != null) {
                this.targetHost = this.vmUpdate.targetHost;
            } else {
                this.targetHost = this.vmUpdate.hosts[0].hostId;
            }
        },
        goBack: function () {
            history.back();
        },
        selectConnectDisk: function (disk) {
            this.selectDisk = disk;
        },
        addNic: function (index) {
            //네트워크
            if (this.tempNics.length == this.clusterNetworkList.length) {
                alert('네트워크 갯수만큼만 추가 할 수 있습니다.');
            } else {
                this.tempNics.push(JSON.parse(JSON.stringify(this.selectVo.selNicVo)));
                this.tempNics[index + 1].listIdx = index + 1;
                // this.tempNics.push('none');
            }
            // this.nics.push('none');
        },
        removeNic: function (index) {
            if (this.status == 'up' && index < this.orgNicsSize) {
                alert("기동중인 가상머신은 연결된 네트워크를 제거할 수 없습니다.");
            } else {
                // this.nics.splice(index, 1);
                this.tempNics.splice(index, 1);

                if (this.tempNics.length == 0) {
                    // this.tempNics.push('none');
                    // this.nics.push('none');
                    let tempSelectVo = JSON.parse(JSON.stringify(this.selectVo.selNicVo));
                    // tempSelectVo.list.unshift({name: "없음", id: "none"});
                    tempSelectVo.selected = tempSelectVo.list[0];

                    this.tempNics.push(tempSelectVo);
                }
            }
        },
        changeBootable: function (bootable) {
            this.existBootDisk = bootable;
        }
    },
    watch: {
        linkedDisks: function (){
            if(this.linkedDisks.length > 0){
                for(let disk of this.linkedDisks){
                    if(disk.bootable){
                        this.bootPossible = false;
                        break;
                    }
                }
            } else if(this.linkedDisks.length === 0){
                this.bootPossible = true;

            }
        },
        totalCpu: function (value) {

            if (value < 1) {
                alert("총 가상 CPU 개수를 확인해주십시오.");
                this.totalCpu = this.orgTotalCpu;
            } else {

                // this.divisors = [];
                //
                // for (i = 1; i <= value; i++) {
                //     if (value % i == 0) {
                //         this.divisors.push(i);
                //     }
                // }
                //
                // if (this.totalCpu != this.orgTotalCpu) {
                //     this.instanceType = null;
                //
                //     this.virtualSockets = value;
                //     this.coresPerVirtualSocket = 1;
                //     this.threadsPerCore = 1;
                // } else {
                //     this.instanceType = this.orgInstanceType;
                //
                //     if (this.vmUpdate.virtualSockets != 1 || this.vmUpdate.coresPerVirtualSocket != 1 || this.vmUpdate.threadsPerCore != 1) {
                //         this.virtualSockets = this.vmUpdate.virtualSockets;
                //         this.coresPerVirtualSocket = this.vmUpdate.coresPerVirtualSocket;
                //         this.threadsPerCore = this.vmUpdate.threadsPerCore;
                //     }
                // }

                this.selectVo.selVirSockVo.list = [];
                this.selectVo.selPerVirSockVo.list = [];
                this.selectVo.selThreadPerCoreVo.list = [];

                for (var i = 1; i <= value; i++) {
                    if (value % i == 0) {
                        this.selectVo.selVirSockVo.list.push({name: i.toString(), id: i});
                        this.selectVo.selPerVirSockVo.list.push({name: i.toString(), id: i});
                        this.selectVo.selThreadPerCoreVo.list.push({name: i.toString(), id: i});
                    }
                }
                this.virtualSockets = value;
                this.coresPerVirtualSocket = 1;
                this.threadsPerCore = 1;

                this.selectVo.selVirSockVo.selected = {name: value.toString(), id: value};
                this.selectVo.selPerVirSockVo.selected = this.initData.creSystems;
                this.selectVo.selThreadPerCoreVo.selected = this.initData.creSystems;

            }
        },
        pickHost: function (value) {
            this.setHost(value);
        },
        cluster: function () {
            this.recommendHost = null;
            this.targetHost = null;
            this.vmUpdate.cluster = this.cluster;

            for (var i = 0; i < this.vmUpdate.clusters.length; i++) {

                if (this.vmUpdate.clusters[i].id == this.cluster) {
                    this.cpuProfile = this.vmUpdate.clusters[i].name;
                }
            }

            this.symphonyRecommend();
        },
        memory: function () {
            this.symphonyRecommend();
        },
        maximumMemory: function () {
            this.symphonyRecommend();
        },
        firstDevice: function (value) {
            if (value == this.secondDevice) {
                this.secondDevice = 'none';
                this.selectVo.selSecDevVo.selected= {name: '없음', id: 'none'};

            }
        },
        cpuShare: function (value) {
            this.vmUpdate.cpuShare = value;
        },
        // showCreateDiskModal: function() {
        // 	this.disk = {};
        // 	this.diskNameStatus = true;
        // 	this.validDiskName = true;
        // },
        showConnectionDiskModal: function () {
            this.selectDisk = '';
            this.showConnectionDiskModal = false;
        },
        bootImageUse: function () {
            this.vmUpdate.bootImageUse = this.bootImageUse;

            if (this.vmUpdate.bootImages.length > 0) {
                this.vmUpdate.bootImage = this.vmUpdate.bootImages[0].id;
            } else {
                this.vmUpdate.bootImage = "none";
            }
        },
        useCloudInit: function () {
            this.vmUpdate.useCloudInit = this.useCloudInit;

            if (this.useCloudInit == true) {
                this.vmUpdate.timezone = this.vmUpdate.timezone == null ? 'Asia/Seoul' : this.vmUpdate.timezone;
            }
        },
        instanceType: function () {

            var instanceTypeId = this.instanceType;

            this.vmUpdate.instanceTypes.forEach(function (instanceType) {
                if (instanceTypeId === instanceType.id) {
                    this.memory = instanceType.memory / 1024 / 1024 + " MB";
                    this.maximumMemory = instanceType.maximumMemory / 1024 / 1024 + " MB";
                }
            }, this);
        },
        highAvailability: function () {
            if (!this.highAvailability) {
                this.leaseStorageDomain = "";
            }
        }
    },
    filters: {
        date: function (value) {
            if (value == undefined || isNaN(value) || value == '' || value == null) {
                return '';
            }

            return moment(value).format("YYYY MM DD HH:mm:ss");
        }
    }
});