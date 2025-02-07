Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});
new Vue({
    router: router,
    el: '#vmCreateManagement',
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
                    {name: "낮음", id: 1},
                    {name: "중간", id: 50},
                    {name: "높음", id: 100}],
                index: 10013,
                selected: {name: "낮음", id: 1}
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
        headlessMode: false,
        connDiskFlag: true,
        node: "",
        numa: "",
        selectedLun: [],
        lunVos: [],
        hosts: [],
        step: 0,
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

        //tempNics는 클러스터에 있는 네트워크 정보를 create vm을 할때 잠깐 nics부분에 물려주기 위해 만들었음. 나중에 create 할때는 nics정보랑 교체되어 vm생성
        tempNics: [],
        clusterNetwork: "",
        clusterNetworkList: [],
        selnetworkname: [],

        vmCreate: {
            name:'',
            host: '',
            operatingSystem: '',
            clusters: [],
            operatingSystems: [],
            nics: [],
            bootImageUse: false,
            memoryBalloon: true,
            bootImages: [],
            leaseStorageDomains: []
        },
        networkId: '',
        instanceType: null,
        cluster: '',
        storageDomainId: '',
        diskInterface: 'virtio_scsi',
        disks: [],
        selectDisk: '',
        diskIndex: '',
        addDiskIndex: '',
        // linkedDiskName:'',
        linkedDisks: [],
        tempLinkedDisks: [],
        selectNics: [],
        leaseStorageDomain: '',
        storageDomains: [],
        instanceImageAdd: true,
        nic: '',
        nics: [],
        memory: '',
        maximumMemory: '4096 MB',
        physicalMemory: '1024 MB',
        totalCpu: 1,
        divisors: [1],
        virtualSockets: 1,
        coresPerVirtualSocket: 1,
        threadsPerCore: 1,
        pickHost: 'recommendHost',
        highAvailability: false,
        spinnerOn: false,
        recommendHosts: [],
        useCloudInit: false,
        firstDevice: 'hd',
        secondDevice: 'cdrom',
        cpuProfile: '',
        cpuShare: '',
        ioThreadsEnabled: false,
        rngEnabled: true,
        deviceSource: 'urandom',
        showConnectionDiskModal: false,
        showCreateDiskModal: false,
        updateConnectionDiskModal: false,
        vmNameStatus: true,
        validVmName: true,
        diskNameStatus: true,
        validDiskName: true,
        validDiskSize: true,
        bootPossible: true,
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        }
    },
    mounted: function () {

        // get parameter
//		this.templateId = this.$route.query.template == null ? '' : this.$route.query.template;

        this.$EventBus.$on('openVmCreateModal', data => {
            this.spinnerOn = true;
            this.step = 0;
            this.retrieveVmCreateInfo();
            this.retrieveStorageDomains();
            this.retrieveDisks();
        });
    },
    // 클러스터에 따른 네트워크 필터(by gtpark)

    created() {
    },

    methods: {
        setSelected: function (selectData, index, listIdx) {
            if (index === 10001) {
                this.cluster = selectData.id;
            } else if (index === 10002) {
                this.vmCreate.operatingSystem = selectData.id;
            } else if (index === 10003) {
                this.instanceType = selectData.id;
            } else if (index === 10004) {
                this.vmCreate.type = selectData.id;
            } else if (index === 10005) {
                this.vmCreate.use = selectData.id;
            } else if (index === 10006) {
                this.firstDevice = selectData.id;
            } else if (index === 10007) {
                this.secondDevice = selectData.id;
            } else if (index === 10008) {
                this.vmCreate.bootImage = selectData.id;
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
                this.vmCreate.priority = selectData.id;
            } else if (index === 10014) {
                this.vmCreate.recommendHost = selectData.id;
            } else if (index === 10015) {
                this.vmCreate.targetHost = selectData.id;
            } else if (index === 10016) {
                this.vmCreate.affinity = selectData.id;
            } else if (index === 10017) {
                this.vmCreate.customMigration = selectData.id;
            } else if (index === 10018) {
                this.vmCreate.autoConverge = selectData.id;
            } else if (index === 10019) {
                this.vmCreate.compressed = selectData.id;
            } else if (index === 10020) {
                this.numa = selectData.id;
            } else if (index === 10021) {
                this.vmCreate.timezone = selectData.id;
            } else if (index === 10022) {
                this.vmCreate.cpuShare = selectData.id;
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
                $("#step0").addClass('active');
            } else if (step === 1) {
                $("#step1").addClass('active');
            } else if (step === 2) {
                $("#step2").addClass('active');
            } else if (step === 3) {
                $("#step3").addClass('active');
            } else if (step === 4) {
                $("#step4").addClass('active');
            } else {
                $("#step5").addClass('active');
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
        isCreateStep(step) {
            return this.step === step;
        }
        ,
        openModal: function (type) {
            if (type === 'newDisk') {
                $("#diskCreateModal").addClass('active');
            } else if (type === 'newConnect') {
                this.pagingVo.viewList.filter((e)=>{e.readOnly = false; e.bootable = false;});
                $("#diskConnectModal").addClass('active');

            }
        },

        closeModal: function (type) {
            if (type === 'vm') {
                $("#vmCreateModal").removeClass('active');
                this.resetSelBox(type);
            } else if (type === 'newDisk') {
                this.resetDisk();

                var cnt = 0;
                if(this.linkedDisks.length >0){
                    cnt = this.linkedDisks.filter((e)=>{
                        return e.bootable === true;
                    }).length
                }

                if(cnt > 0){
                    this.bootPossible = false;
                }
                $("#diskCreateModal").removeClass('active');

            } else if (type === 'newConnect') {
                this.selectDisk = "";
                $("#diskConnectModal").removeClass('active');

            } else if (type === 'upConnect') {
                $("#diskConnectModal").removeClass('active');

            }
        },
        setViewList: function(viewList) {
            this.pagingVo.viewList = viewList;
        },
        selectConDisk:function (disk, idx){

        },

        resetDisk: function () {

            this.disk.name = '';
            this.disk.description = '';
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
            this.selectVo.selConnDiskVo.selected = this.initData.creConnDisk;
            this.selectVo.selStrgDomainVo.selected = this.initData.creStrgDomain;
            this.checkDiskName();
        }
        ,

        resetCreateDisk: function () {
            this.resetDisk();
            this.disk.lunVos = [];
            this.disk.lun = [];
        }
        ,

        flagDisk: function (flag) {
            this.resetDisk();
            this.disk.flag = flag;
        }
        ,

        changeHost: function () {
            if (this.lunVos.length == 0) {
                this.lunVos = '';
            }
        }
        ,

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
        }
        ,

        // selectLun: function(lun) {
        //
        // 	if(lun.diskId != null){
        // 		alert("선택한 LUN은 이미 디스크에서 사용하고 있습니다!");
        // 	}
        //
        // 	else if(lun.diskId == null){
        // 		if(this.selectedLun.length == 0){
        // 			this.selectedLun.push(lun);
        // 		}
        //
        // 		else if(this.selectedLun.length >= 1){
        // 			this.selectedLun.splice(0, 1);
        // 		}
        // 	}
        //
        // },

        // by gtpark change cluster
        changeCluster: function () {
            this.vmCreate.clusters.some(clusters => {
                if (this.cluster === clusters.id) {
                    return this.clusterNetworkList = clusters.clusterNetworkList;
                    ;
                }
            })
        }
        ,
        // retrieve vm create info
        retrieveVmCreateInfo: function () {
            this.$http.get('/compute/createVm/info').then(function (response) {
                this.vmCreate = response.data.resultKey;

                // selectBox list mapping
                this.selectVo.selCreClusterVo.list = JSON.parse(JSON.stringify(this.vmCreate.clusters));
                this.initData.creCluster = {
                    name: JSON.parse(JSON.stringify(this.vmCreate.clusters[0].name)),
                    id: JSON.parse(JSON.stringify(this.vmCreate.clusters[0].id))
                };
                this.selectVo.selCreClusterVo.selected = this.initData.creCluster;

                this.selectVo.selCreOsVo.list = JSON.parse(JSON.stringify(this.vmCreate.operatingSystems));

                this.selectVo.selCreInsVo.list = JSON.parse(JSON.stringify(this.vmCreate.instanceTypes));
                if (this.selectVo.selCreInsVo.list[0].name !== "사용자 정의") {
                    this.selectVo.selCreInsVo.list.unshift(this.initData.creIns);
                }

                if (this.vmCreate.bootImages != null && this.vmCreate.bootImages.length > 0) {
                    this.selectVo.selBootImgVo.list = JSON.parse(JSON.stringify(this.vmCreate.bootImages));
                    this.initData.creBootImg = {
                        name: JSON.parse(JSON.stringify(this.vmCreate.bootImages[0].name)),
                        id: JSON.parse(JSON.stringify(this.vmCreate.bootImages[0].id))
                    };
                    this.selectVo.selBootImgVo.selected = this.initData.creBootImg;
                    this.vmCreate.bootImage = this.initData.creBootImg.id;
                } else {
                    this.selectVo.selBootImgVo.list = {name: "없음", id: "none"};
                    this.selectVo.selBootImgVo.selected = {name: "없음", id: "none"};
                    this.vmCreate.bootImage = "none";
                }

                this.selectVo.selLeaseStrgVo.list = JSON.parse(JSON.stringify(this.vmCreate.leaseStorageDomains));
                if (this.selectVo.selLeaseStrgVo.list[0].name !== "가상 머신 임대 없음") {
                    this.selectVo.selLeaseStrgVo.list.unshift(this.initData.creLeaseStrg);
                }

                this.selectVo.selTarHostVo.list = [];
                for (let host of this.vmCreate.hosts) {
                    this.selectVo.selTarHostVo.list.push({
                        name: JSON.parse(JSON.stringify(host.hostName)),
                        id: JSON.parse(JSON.stringify(host.hostId))
                    });
                }
                this.selectVo.selTarHostVo.selected = this.selectVo.selTarHostVo.list[0];
                // selectBox list mapping

                this.hosts = this.vmCreate.hosts
                this.bootPossible = true;
                this.firstDevice = 'hd';
                this.secondDevice ='cdrom';
                this.vmCreate.operatingSystem = "other";
                this.vmCreate.type = 'server';
                this.vmCreate.use = "systemManagement";
                this.cluster = this.vmCreate.clusters[0].id;
                this.cpuProfile = this.vmCreate.clusters[0].name;
                this.memory = '1024 MB'; // 심포니 추천 호스트 호출하기 위해 사용
                this.memoryChange();

                // this.tempNics.push('none');

                // this.vmCreate.use = 'systemManagement';
                this.tempNics = [];
                this.changeCluster();

                if(this.clusterNetworkList != null && this.clusterNetworkList.length > 0){
                    this.selectVo.selNicVo.list = JSON.parse(JSON.stringify(this.clusterNetworkList));
                }

                this.selectVo.selNicVo.list.unshift({name: "빈 인테페이스", id: "empty"});
                this.selectVo.selNicVo.list.unshift({name: "없음", id: "none"});

                this.tempNics.push(JSON.parse(JSON.stringify(this.selectVo.selNicVo)));

                // if (this.vmCreate.bootImages != null && this.vmCreate.bootImages.length > 0) {
                //     this.vmCreate.bootImage = this.vmCreate.bootImages[0].id;
                // }

                // if(this.vmCreate.cpuProfiles.length > 0) {
                // 	this.vmCreate.cpuProfile = this.vmCreate.cpuProfiles[0].id;
                // }

//				if(this.templateId == '') {
                for (var i = 0; i < this.vmCreate.templates.length; i++) {
                    if (this.vmCreate.templates[i].version.indexOf('0') > 0) {
                        this.vmCreate.template = this.vmCreate.templates[i].id;
                        break;
                    }
                }
//				}

                this.vmCreate.virtioScsiEnabled = true;
                this.vmCreate.disconnectAction = 'LOCK_SCREEN';
                this.vmCreate.monitors = '1';
                this.vmCreate.singleSignOn = true;
                this.vmCreate.useCloudInit = false;

                // 고가용성 초기설정
                this.vmCreate.resumeBehaviour = 'kill';
                this.vmCreate.priority = 1;
                // this.vmCreate.watchdogModel = '';
                // this.vmCreate.watchdogAction = 'none';

                // modal step 초기화
                this.clearStep();
                $("#step0").addClass('active');
                $("#vmCreateModal").addClass('active');
                this.spinnerOn = false;

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        resetSelBox: function (type) {
            if (type === 'vm') {
                this.selectVo.selCreOsVo.selected = this.initData.creOs;
                this.selectVo.selCreInsVo.selected = this.initData.creIns;
                this.selectVo.selCreOpsVo.selected = this.initData.creOps;
                this.selectVo.selCreUsageVo.selected = this.initData.creUsage;
                this.selectVo.selFirDevVo.selected = this.initData.creFirDev;
                this.selectVo.selSecDevVo.selected = this.initData.creSecDev;
                this.selectVo.selVirSockVo.list = [];
                this.selectVo.selVirSockVo.list.push(this.initData.creSystems);
                this.selectVo.selPerVirSockVo.list = [];
                this.selectVo.selPerVirSockVo.list.push(this.initData.creSystems);
                this.selectVo.selThreadPerCoreVo.list = [];
                this.selectVo.selThreadPerCoreVo.list.push(this.initData.creSystems);
                this.totalCpu = 1;
                this.selectVo.selLeaseStrgVo.selected = this.initData.creLeaseStrg;
                this.selectVo.selPriorityVo.selected = this.initData.crePriority;
                this.pickHost = 'recommendHost';
                this.selectVo.selRecHostVo.selected = this.initData.creRecHost;
                this.vmCreate.customMigrationUsed = false;
                this.vmCreate.customMigrationDowntimeUsed = false;
                this.selectVo.selMigrationVo.selected = this.initData.creMigration;
                this.selectVo.selCustomMigVo.selected = this.initData.creCustomMig;
                this.selectVo.selAutoConVo.selected = this.initData.creAutoCon;
                this.selectVo.selCompVo.selected = this.initData.creComp;
                this.node = "";
                this.selectVo.selNumaVo.selected = this.initData.creNuma;
                this.useCloudInit = false;
                this.vmCreate.timezone = null;
                this.selectVo.selCpuShareVo.selected = this.initData.creCpuShare;
                this.vmCreate.bootImageUse = false;
                this.headlessMode = false;
                this.highAvailability = false;
                this.ioThreadsEnabled = false;
                this.selectVo.selConnDiskVo.selected = this.initData.creConnDisk;
                this.selectVo.selStrgDomainVo.selected = this.initData.creStrgDomain;
                this.selectVo.selNicVo.selected = {name: "없음", id: "none"};
                this.linkedDisks = [];
                this.vmNameStatus = true;
                this.validVmName = true;
            }
        },

        // 디스크 연결 목록
        retrieveDisks: function () {
            this.$http.get('/compute/createVm/disks').then(function (response) {
                this.disks = response.data.resultKey;
                for (let disk of this.disks) {
                    disk.selectVo = JSON.parse(JSON.stringify(this.selectVo.selConnDiskVo));
                    // console.log(disk.selectVo);
                }
                // console.log("연결용 디스크 목록", this.disks);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        }
        ,

        // setDiskIndex: function(index, status) {
        // 	this.diskIndex = index;
        //
        // 	if(status == 'create') {
        // 		this.disk = this.linkedDisks[index];
        // 	}
        // },

        setDiskIndex: function (index, status, nowStatus) {
            this.diskIndex = index;
            this.connDiskFlag = true;

            if (status == 'create') {
                this.disk = JSON.parse(JSON.stringify(this.linkedDisks[index]));
                this.diskNameStatus = false;
                this.validDiskName = false;

                if(nowStatus === 'update' && this.disk.bootable){
                    this.bootPossible = true;
                } else if(nowStatus === 'update' && !this.disk.bootable){
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
                // $("#diskCreateModal").addClass('active');

                if (this.disk.flag === 2) {
                    this.selectedLun.push(JSON.parse(JSON.stringify(this.disk.lun[0])));
                    this.lunVos = JSON.parse(JSON.stringify(this.disk.lunVos))
                }
            } else if (status == 'upConnect') {
                this.connDiskFlag = false;
                this.openModal('newConnect');
            }
        }
        ,

        connectDisk: function () {
            if (this.connDiskFlag) {
                this.selectDisk.diskInterface = this.selectDisk.diskInterface == null ? 'virtio_scsi' : this.selectDisk.diskInterface;
                this.selectDisk.linkedDiskName = this.selectDisk.name + " : " + this.selectDisk.virtualSize + "GB";
                this.linkedDisks.push(this.selectDisk);
                this.disks.splice(this.disks.indexOf(this.selectDisk), 1);
                this.instanceImageAdd = false;
                this.closeModal('newConnect');
            } else {
                this.updateConnectDisk();
            }
        }
        ,

        updateConnectDisk: function () {
            this.selectDisk.diskInterface = this.selectDisk.diskInterface == null ? 'virtio_scsi' : this.selectDisk.diskInterface;
            this.selectDisk.linkedDiskName = this.selectDisk.name + " : " + this.selectDisk.virtualSize + "GB";
            this.disks.push(this.linkedDisks[this.diskIndex]);
            this.linkedDisks[this.diskIndex] = this.selectDisk;
            this.disks.splice(this.disks.indexOf(this.selectDisk), 1);
            // this.closeModal('newConnect');
            $("#diskConnectModal").removeClass('active');

        }
        ,

        changeDiskInterface: function (event) {
            this.selectDisk.diskInterface = event.srcElement.value;
        }
        ,

        addDisk: function (index) {
            this.instanceImageAdd = true;
        }
        ,

        removeDisk: function (index) {

            if(this.linkedDisks[index].bootable){
                this.bootPossible = true;
            }

            if (this.linkedDisks[index].passDiscard === true
                || this.linkedDisks[index].passDiscard === false) {

                this.linkedDisks[index].bootable = false;
                this.linkedDisks[index].readOnly = false;
                this.linkedDisks[index].linkedDiskName = null;

                this.disks.push(this.linkedDisks[index]);
            }
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

            if (this.linkedDisks.length == 0) {
                this.instanceImageAdd = true;
            }
        }
        ,

        // 디스크 생성 화면
        retrieveStorageDomains: function () {
            "use strict";
            this.$http.get('/v2/storage/domains?status=active&domainType=DATA').then(function (response) {
                this.storageDomains = response.data.resultKey;
                this.selectVo.selStrgDomainVo.list = JSON.parse(JSON.stringify(this.storageDomains));

                for (var i = 0; i < this.storageDomains.length; i++) {
                    // if(this.storageDomains[i].type == 'DATA') {
//						this.disk.storageDomainId = this.storageDomains[i].id;
//						this.disk.diskProfileName = this.storageDomains[i].diskProfileName;
//						// console.log("disk", this.disk);
                    this.storageDomainId = this.storageDomains[i].id;
                    this.initData.creStrgDomain = {
                        name: JSON.parse(JSON.stringify(this.storageDomains[i].name)),
                        id: JSON.parse(JSON.stringify(this.storageDomains[i].id))
                    };
                    this.selectVo.selStrgDomainVo.selected = this.initData.creStrgDomain;
                    break;
                    // }
                }
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        }
        ,

// 		createDisk: function() {
//
// 			this.disk.storageDomainId = this.storageDomainId;
// 			this.disk.diskInterface = this.diskInterface;
//
// 			if(this.disk.status === 'create') {
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

        //by gtpark create disk
        createDisk: function () {
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

                    if(this.disk.bootable){
                        this.bootPossible = false;
                    }

                    this.linkedDisks[this.diskIndex] = JSON.parse(JSON.stringify(this.disk));
                    // this.instanceImageAdd = false;
                    this.resetDisk();
                    this.closeModal('newDisk');
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
                // 	if(this.disk.lunVos === ''){
                // 		alert("호스트를 선택해 주세요.");
                // 		return;
                // 	}
                //
                // 	if(this.disk.storageType === ''){
                // 		alert("스토리지 타입을 선택해 주세요.")
                // 		return;
                // 	}
                //
                // 	if(this.disk.lun.length === 0){
                // 		alert("LUN을 선택해 주세요.")
                // 		return;
                // 	}
                // 	this.disk.storageDomainId = this.storageDomainId;
                // 	this.disk.diskInterface = this.diskInterface;
                // 	this.disk.lunId = this.selectedLun[0].lunId;
                // 	this.disk.hostId = this.selectedLun[0].lunHostId;
                // 	this.disk.virtualSize = (this.selectedLun[0].lunSize / Math.pow(1024, 3).toFixed(2));
                // 	this.linkedDisks[this.diskIndex] = JSON.parse(JSON.stringify(this.disk));
                // 	this.selectedLun = [];
                // 	this.lunVos = '';
                // 	this.instanceImageAdd = false;
                // 	this.resetDisk();
                // 	$(".modifylundiskmodal").modal('hide');
                // }
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
                        this.disk.status = 'create';
                        this.instanceImageAdd = false;

                        this.disk.linkedDiskName = this.disk.name + " : " + this.disk.virtualSize + "GB";
                        this.linkedDisks.push(JSON.parse(JSON.stringify(this.disk)));
                        this.resetDisk()
                        // $(".creatediskmodal").modal('hide');
                        this.closeModal('newDisk');
                    }
                } else if (this.disk.flag === 2) {
                    if (this.validDiskName) {
                        alert("디스크 이름은 4글자 이상 입력해야 합니다.");
                        return;
                    } else if (this.diskNameStatus) {
                        var checkResult = this.checkInputName(this.disk.name);
                        alert("디스크 이름은 " + checkResult.msg);
                        return;
                    }
                    if (this.lunVos === '') {
                        alert("호스트를 선택해 주세요.");
                        return;
                    }

                    if (this.disk.storageType === '') {
                        alert("스토리지 타입을 선택해 주세요.")
                        return;
                    }

                    if (this.selectedLun.length === 0) {
                        alert("LUN을 선택해 주세요.")
                        return;
                    }
                    if (this.selectedLun[0].diskId == null) {
                        this.selectedLun[0].diskId = "temp";
                        this.disk.diskId = "temp";
                    }
                    this.hosts.some(host => {
                        host.lunVos.some(lunVo => {
                            if (lunVo.lunId === this.selectedLun[0].lunId
                                && this.selectedLun[0].diskId === "temp") {
                                return lunVo.diskId = "temp";
                            }
                        })
                    })

                    this.disk.storageDomainId = this.storageDomainId;
                    this.disk.diskInterface = this.diskInterface;
                    this.disk.lunId = this.selectedLun[0].lunId;
                    // this.disk.lun.push(JSON.parse(JSON.stringify(this.selectedLun[0])));
                    // this.disk.lunVos = JSON.parse(JSON.stringify(this.lunVos));
                    this.disk.hostId = this.selectedLun[0].lunHostId;
                    this.disk.virtualSize = (this.selectedLun[0].lunSize / Math.pow(1024, 3).toFixed(2));
                    this.disk.status = 'create';
                    this.instanceImageAdd = false;
                    this.linkedDisks.push(JSON.parse(JSON.stringify(this.disk)));
                    this.resetDisk()
                    this.selectedLun = [];
                    this.lunVos = '';
                    $(".creatediskmodal").modal('hide');
                }
            }
        }
        ,

        cancelModifyDisk: function () {

            // this.disk =this.linkedDisks[this.diskIndex];
            this.disk = {};
            this.lunVos = '';
            if (this.linkedDisks[this.diskIndex].lunId !== '') {
                $(".modifylundiskmodal").modal('hide');
            } else {
                $(".modifydirectdiskmodal").modal('hide');
            }
        }
        ,

        cancelCreateDisk: function () {
            this.resetDisk()
            $(".creatediskmodal").modal('hide');
        }
        ,
        checkDiskSize: function () {
            if (this.disk.virtualSize > 0) {
                this.validDiskSize = false;
            } else if (this.disk.virtualSize < 0) {
                this.validDiskSize = true;
            } else {
                this.validDiskSize = true;
            }
        },

        checkDiskName: function () {
            if (this.disk.name.length >= 4) {
                this.validDiskName = false;
            } else if (this.disk.name.length == 0) {
                this.validDiskName = true;
            } else {
                this.validDiskName = true;
            }

            this.diskNameStatus = this.checkInputName(this.disk.name).result;
        }
        ,
//		setDiskProfileId: function() {
//			for (var domain of this.storageDomains) {
//				if(domain.id == this.disk.storageDomainId){
//					this.disk.diskProfileId = domain.diskProfileId;
//					this.disk.diskProfileName = domain.diskProfileName;
//				}
//			}
//			 console.log(this.disk.diskProfileId);
//		},
        memoryChange: function () {
            "use strict";
            if (this.memory.includes("GB")) {
                this.memory = this.memory.replace(/[^0-9]/g, '');
                this.memory = this.memory * 1024;
                this.maximumMemory = this.memory * 4;
            } else if (this.memory.includes("MB")) {
                this.memory = this.memory.replace(/[^0-9]/g, '');
                this.maximumMemory = this.memory * 4;
            } else {
                this.maximumMemory = this.memory * 4;
            }

            this.memory = this.memory + " MB";
            this.maximumMemory = this.maximumMemory + " MB";
            this.physicalMemory = this.memory;
        }
        ,
        maximumMemoryChange: function () {
            "use strict";
            if (this.maximumMemory.includes("GB")) {
                this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
                this.maximumMemory = this.maximumMemory * 1024;
            } else if (this.maximumMemory.includes("MB")) {
                this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
            }

            this.maximumMemory = this.maximumMemory + " MB";
        }
        ,
        physicalMemoryChange: function () {
            "use strict";
            if (parseInt(this.physicalMemory.replace(/[^0-9]/g, '')) > parseInt(this.memory.replace(/[^0-9]/g, ''))) {
                alert("시스템 항목의 메모리 크기보다 클 수 없습니다.");
                this.physicalMemory = this.memory;
            }
            "use strict";
            if (this.physicalMemory.includes("GB")) {
                this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g, '');
                this.physicalMemory = this.physicalMemory * 1024;
            } else if (this.physicalMemory.includes("MB")) {
                this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g, '');
            }
            "use strict";
            this.physicalMemory = this.physicalMemory + " MB";
        }
        ,
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
        }
        ,
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
        }
        ,
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

        }
        ,
        checkVmName: function () {

            if (this.vmCreate.name.length >= 4) {
                this.validVmName = false;
            } else {
                this.validVmName = true;
            }
            this.vmNameStatus = this.checkInputName(this.vmCreate.name).result;
        },

        createVm: function () {
            // createVm :function(index) {
            if (this.validVmName) {
                alert("가상머신 이름은 4글자 이상 입력해야 합니다.");
            } else {
                var checkResult = this.checkInputName(this.vmCreate.name);

                if (checkResult.result) {
                    alert("가상머신 이름은 " + checkResult.msg);
                } else {
                    this.$http.post('/compute/vm/checkDuplicateName?name=' + this.vmCreate.name).then(function (response) {
                        if (response.data.resultKey) {
                            alert("중복된 이름입니다.");
                        } else {
                            this.spinnerOn = true;
                            $("#vmCreateModal").removeClass('active');
                            this.vmCreate.selectNics = [];
                            if (this.tempNics.length > 0) {

                                // for (var i = 0; i < this.tempNics.length; i++) {
                                //     if (this.tempNics[i] == 'none') {
                                //         this.tempNics.splice(i, 1);
                                //     }
                                // }

                                // this.vmCreate.nics.forEach(nic => {
                                //     this.tempNics.forEach(tempNicsId => {
                                //         if (tempNicsId == nic.networkId) {
                                //             this.vmCreate.selectNics.push(nic);
                                //         }
                                //     })
                                // })

                                for (var i = 0; i < this.tempNics.length; i++) {
                                    if (this.tempNics[i].selected.id == 'empty') {
                                        // this.tempNics.splice(i, 1);
                                        this.vmCreate.selectNics.push({id: this.tempNics[i].selected.id});
                                    }
                                }

                                this.vmCreate.nics.forEach(nic => {
                                    this.tempNics.forEach(tempNic => {
                                        if (tempNic.selected.id == nic.networkId) {
                                            this.vmCreate.selectNics.push(nic);
                                        }
                                    })
                                })


                            }

                            this.vmCreate.cluster = this.cluster;
                            this.vmCreate.instanceType = this.instanceType;
                            this.vmCreate.memory = this.memory === 0 ? 1024 : this.memory.replace(/[^0-9]/g, '') * 1024 * 1024;
                            this.vmCreate.maximumMemory = this.maximumMemory === 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                            this.vmCreate.physicalMemory = this.physicalMemory === 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                            this.vmCreate.coresPerVirtualSocket = this.coresPerVirtualSocket;
                            this.vmCreate.virtualSockets = this.virtualSockets;
                            this.vmCreate.threadsPerCore = this.threadsPerCore;
                            this.vmCreate.firstDevice = this.firstDevice;
                            this.vmCreate.secondDevice = this.secondDevice;
                            this.vmCreate.ioThreadsEnabled = this.ioThreadsEnabled ? 1 : 0;
                            this.vmCreate.rngEnabled = this.rngEnabled;
                            this.vmCreate.deviceSource = this.deviceSource;
                            this.vmCreate.disks = this.linkedDisks;
                            this.vmCreate.headlessMode = this.headlessMode;
                            this.vmCreate.highAvailability = this.highAvailability;
                            this.vmCreate.leaseStorageDomain = this.leaseStorageDomain;

                            if (this.vmCreate.bootImageUse == true && this.vmCreate.bootImage == 'none') {
                                this.vmCreate.bootImageUse = false;
                            }
//						this.vmCreate.template = this.templateId;

                            // if(this.vmCreate.recommendHost == null) {
                            // 	this.setHost('targetHost');
                            // }

                            if (this.pickHost === 'recommendHost') {
                                this.vmCreate.targetHost = null;
                            }
                            "use strict";
                            // console.log("vmCreate", this.vmCreate);


                            this.$http.post('/compute/createVm', this.vmCreate).then(function (response) {
                                // console.log(response.data.resultKey);
                                // location.href = '/compute/vms';
                                // this.spinnerOn = false;
                                this.resetSelBox('vm');
                                this.$EventBus.$on('created', data => {
                                    this.spinnerOn = false;
                                    this.resetSelBox('vm');
                                });

                            }.bind(this)).catch(function (error) {
                                this.spinnerOn = false;
                                this.resetSelBox('vm');
                                // console.log(error);
                            });
                        }
                    }.bind(this)).catch(function (error) {
                        this.spinnerOn = false;
                        this.resetSelBox('vm');
                        // console.log(error);
                    });
                }
            }
        }
        ,
        symphonyRecommend: _.debounce(function () {
            "use strict";
            this.vmCreate.cluster = this.cluster;
            this.vmCreate.memory = this.memory == 0 ? 1024 : this.memory.replace(/[^0-9]/g, '');
            this.vmCreate.maximumMemory = this.maximumMemory == 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '');
            this.vmCreate.physicalMemory = this.physicalMemory == 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '');

            this.$http.post('/compute/createVm/recommendHosts', this.vmCreate).then(function (response) {

                this.recommendHosts = [];
                this.selectVo.selRecHostVo.list = [];
                var symphonyHosts = response.data.resultKey;

                if (symphonyHosts.length > 0) {
                    for (var i = 0; i < symphonyHosts.length; i++) {
                        for (var j = 0; j < this.vmCreate.hosts.length; j++) {
                            if (this.vmCreate.cluster == this.vmCreate.hosts[j].clusterId) {
                                if (this.vmCreate.hosts[j].hostId == symphonyHosts[i][0]) {
                                    this.recommendHosts.push(symphonyHosts[i]);

                                    this.selectVo.selRecHostVo.list.push({
                                        name: symphonyHosts[i][1],
                                        id: symphonyHosts[i][0]
                                    });
                                }
                            }
                        }
                    }
                } else { // 추천 호스트가 비어있을 경우
                    for (var i = 0; i < this.vmCreate.hosts.length; i++) {
                        if (this.vmCreate.cluster == this.vmCreate.hosts[i].clusterId) {
                            this.recommendHosts.push([this.vmCreate.hosts[i].hostId, this.vmCreate.hosts[i].hostName]);

                            this.selectVo.selRecHostVo.list.push({
                                name: this.vmCreate.hosts[i].hostName,
                                id: this.vmCreate.hosts[i].hostId
                            });
                        }
                    }
                }

                if (this.recommendHosts.length > 0) {
                    this.vmCreate.recommendHost = this.recommendHosts[0][0];

                    this.initData.creRecHost = {
                        name: JSON.parse(JSON.stringify(this.selectVo.selRecHostVo.list[0].name)),
                        id: {name: JSON.parse(JSON.stringify(this.selectVo.selRecHostVo.list[0].id))}
                    };
                    this.selectVo.selRecHostVo.selected = this.initData.creRecHost;
                }
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        }, 1000),
        setHost: function (value) {

            if (value == 'recommendHost') {
                this.vmCreate.targetHost = null;
                this.vmCreate.recommendHost = this.recommendHosts[0][0]; // 심포니 추천과 특정 호스트 변수 나눠야됨
            } else {
                this.vmCreate.recommendHost = null;

                for (var i = 0; i < this.vmCreate.hosts.length; i++) {
                    if (this.vmCreate.cluster == this.vmCreate.hosts[i].clusterId) {
                        this.vmCreate.targetHost = this.vmCreate.hosts[i].hostId;

                        this.selectVo.selTarHostVo.selected = {
                            name: this.vmCreate.hosts[i].hostName,
                            id: this.vmCreate.hosts[i].hostId
                        }
                        break;
                    }
                }
            }
        }

        ,
        goBack: function () {
            "use strict";
            history.back();
        }
        ,
        selectConnectDisk: function (disk) {
            "use strict";
            this.selectDisk = disk;
        }
        ,
        addNic: function (index) {
            // addNic: function(index) {

            // if (this.clusterNetworkList.length == this.tempNics.length) {
            //     alert('네트워크 갯수만큼만 추가 할 수 있습니다.');
            // } else {
                // this.tempNics.push('none');
                this.tempNics.push(JSON.parse(JSON.stringify(this.selectVo.selNicVo)));
                this.tempNics[index + 1].listIdx = index + 1;
            // }

        }
        ,
        removeNic: function (index) {

            this.tempNics.splice(index, 1);

            if (this.tempNics.length == 0) {
                this.tempNics.push(JSON.parse(JSON.stringify(this.selectVo.selNicVo)));
            }
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
        },

        // totalCpu: function (value) {
        //     this.divisors = [];
        //
        //     for (var i = 1; i <= value; i++) {
        //         if (value % i == 0) {
        //             this.divisors.push(i);
        //         }
        //     }
        //
        //     this.virtualSockets = value;
        //     this.coresPerVirtualSocket = 1;
        //     this.threadsPerCore = 1;
        // },

        pickHost: function (value) {
            "use strict";
            this.setHost(value);
        }
        ,
        cluster: function () {
            "use strict";
            this.vmCreate.recommendHost = null;
            this.vmCreate.targetHost = null;

            for (var i = 0; i < this.vmCreate.clusters.length; i++) {

                if (this.vmCreate.clusters[i].id == this.cluster) {
                    this.cpuProfile = this.vmCreate.clusters[i].name;
                }
            }

            this.symphonyRecommend();
        }
        ,
        memory: function () {
            "use strict";
            this.symphonyRecommend();
        }
        ,
        maximumMemory: function () {
            "use strict";
            this.symphonyRecommend();
        }
        ,
        firstDevice: function (value) {
            "use strict";
            if (value == this.secondDevice) {
                this.secondDevice = 'none';
            }
        }
        ,
        cpuShare: function (value) {
            this.vmCreate.cpuShare = value;
        }
        ,
        showCreateDiskModal: function () {
            this.disk = {
                bootable: true
            };
        }
        ,
        showConnectionDiskModal: function () {
            this.selectDisk = '';
            this.showConnectionDiskModal = false;
        }
        ,
        useCloudInit: function () {
            "use strict";
            this.vmCreate.useCloudInit = this.useCloudInit;
            this.vmCreate.timezone = null;

            if (this.useCloudInit == true) {
                this.vmCreate.hostName = this.vmCreate.hostName == null ? this.vmCreate.name : this.vmCreate.hostName;
                this.vmCreate.timezone = this.vmCreate.timezone == null ? 'Asia/Seoul' : this.vmCreate.timezone;
            }
        }
        ,
        instanceType: function () {
            "use strict";

            var instanceTypeId = this.instanceType;

//			for(var i=0; i<this.vmCreate.instanceTypes.length; i++) {
//				if(instanceTypeId === this.vmCreate.instanceTypes[i].id) {
//					this.memory = this.vmCreate.instanceTypes[i].memory/1024/1024 + " MB";
//					this.maximumMemory = this.vmCreate.instanceTypes[i].maximumMemory/1024/1024 + " MB";
//				}
//			}

            this.vmCreate.instanceTypes.forEach(function (instanceType) {
                if (instanceTypeId === instanceType.id) {
                    this.memory = instanceType.memory / 1024 / 1024 + " MB";
                    this.maximumMemory = instanceType.maximumMemory / 1024 / 1024 + " MB";
                }
            }, this);
        }
        ,
        highAvailability: function () {
            if (!this.highAvailability) {
                this.leaseStorageDomain = "";
            }
        }
//		templateId: function() {
//			for(var i=0; i<this.vmCreate.templates.length; i++) {
//				if(this.vmCreate.templates[i].id == this.templateId) {
//					this.template = this.vmCreate.templates[i];
//					
//					if(this.vmCreate.templates[i].nics.length > 0) {
//						this.nic = this.vmCreate.templates[i].nics[0].id;
//					}
//				}
//			}
//		}
    }
    ,
    filters: {
        date: function (value) {
            "use strict";
            if (value == undefined || isNaN(value) || value == '' || value == null) {
                return '';
            }

            return moment(value).format("YYYY MM DD HH:mm:ss");
        }
    }
})
;