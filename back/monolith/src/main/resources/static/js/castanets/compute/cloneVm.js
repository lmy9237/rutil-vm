Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
    router: router,
    el: '#vmClone',
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
                selected: {name: "none", id: "none"}
            },
            selTemplateVo: {
                size: "",
                list: [
                    {name: "", id: ""}],
                index: 10026,
                listIdx: 0,
                selected: {name: "none", id: "none"}
            }

        },
        vmClone: {
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
        node: "",
        numa: "",
        status: '',
        orgNicsSize: '',
        existBootDisk: false,
        instanceType: null,
        cluster: '',
        storageDomainId: '',
        diskInterface: 'virtio_scsi',
        disk: {},
        disks: [],
        selectDisk: '',
        diskIndex: '',
        addDiskIndex: '',
        linkedDisks: [],
        selectNics: [],
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
        diskNameStatus: false,
        validDiskName: false,
        step: 0
    },
    mounted: function () {
        // get parameter
        // this.vmId = this.$route.query.vmId;
        // this.snapshotId = this.$route.query.snapshotId;
        // this.retrieveVmCloneInfo();
        // // this.retrieveStorageDomains();
        // // this.retrieveDisks();

        // get parameter
        this.$EventBus.$on('vmCloneModal', data => {
            this.spinnerOn = true;
            this.vmId = data.vmId;
            this.snapshotId = data.snapshotId;
            this.step = 0;
            this.retrieveVmCloneInfo();
        });
    },
    methods: {
        setSelected: function (selectData, index) {
            if (index === 10001) {
                this.cluster = selectData.id;
            } else if (index === 10002) {
                this.vmClone.operatingSystem = selectData.id;
            } else if (index === 10003) {
                this.instanceType = selectData.id;
            } else if (index === 10004) {
                this.vmClone.type = selectData.id;
            } else if (index === 10005) {
                this.vmClone.use = selectData.id;
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
                this.vmClone.priority = selectData.id;
            } else if (index === 10014) {
                this.recommendHost = selectData.id;
            } else if (index === 10015) {
                this.targetHost = selectData.id;
            } else if (index === 10016) {
                this.vmClone.affinity = selectData.id;
            } else if (index === 10017) {
                this.vmClone.customMigration = selectData.id;
            } else if (index === 10018) {
                this.vmClone.autoConverge = selectData.id;
            } else if (index === 10019) {
                this.vmClone.compressed = selectData.id;
            } else if (index === 10020) {
                this.numa = selectData.id;
            } else if (index === 10021) {
                this.vmClone.timezone = selectData.id;
            } else if (index === 10022) {
                this.cpuShare = selectData.id;
            } else if (index === 10023) {
                this.selectDisk.diskInterface = selectData.id;
            } else if (index === 10024) {
                this.storageDomainId = selectData.id;
            } else if (index === 10026) {
                this.vmClone.template = selectData.id;
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
                $("#clStep0").addClass('active');
            } else if (step === 1) {
                $("#clStep1").addClass('active');
            } else if (step === 2) {
                $("#clStep2").addClass('active');
            } else if (step === 3) {
                $("#clStep3").addClass('active');
            } else if (step === 4) {
                $("#clStep4").addClass('active');
            } else {
                $("#clStep5").addClass('active');
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
        }
        ,
        closeModal: function (type) {
            if (type === 'clone') {
                $("#vmCloneModal").removeClass('active');
            }
        }
        ,
        // retrieve clone info
        retrieveVmCloneInfo: function () {
            this.$http.get('/compute/cloneVm/info?vmId=' + this.vmId + "&snapshotId=" + this.snapshotId).then(function (response) {

                this.vmClone = response.data.resultKey;

                // console.log('vmClone', this.vmClone);

                // if(this.vmClone.selectNics != null && this.vmClone.selectNics.length > 0) {
                // 	this.nics = this.vmClone.selectNics;
                // } else {
                // 	this.nics.push('none');
                // }

                // this.orgNicsSize = this.nics.length;

                // for(var i=0; i<this.vmClone.disks.length; i++) {
                // 	if(this.vmClone.disks[i].bootable === true) {
                // 		this.existBootDisk = true;
                // 	}
                // }

                this.status = this.vmClone.status;
                this.cluster = this.vmClone.cluster;
                this.orgName = this.vmClone.name;
                this.instanceType = this.vmClone.instanceType;
                this.orgInstanceType = this.vmClone.instanceType;
                this.linkedDisks = this.vmClone.disks;
                this.totalCpu = this.vmClone.virtualSockets * this.vmClone.coresPerVirtualSocket * this.vmClone.threadsPerCore;
                this.orgTotalCpu = this.totalCpu;
                this.virtualSockets = this.vmClone.virtualSockets;
                this.coresPerVirtualSocket = this.vmClone.coresPerVirtualSocket;
                this.threadsPerCore = this.vmClone.threadsPerCore;
                this.memory = this.vmClone.memory / 1024 / 1024 + " MB";
                this.maximumMemory = this.vmClone.maximumMemory / 1024 / 1024 + " MB";
                this.physicalMemory = this.vmClone.physicalMemory / 1024 / 1024 + " MB";
                // this.targetHost = this.vmClone.targetHost;
                this.cpuProfile = this.vmClone.clusters[0].name;
                this.cpuShare = this.vmClone.cpuShare;
                this.ioThreadsEnabled = this.vmClone.ioThreadsEnabled;
                this.highAvailability = this.vmClone.highAvailability;
                this.headlessMode = this.vmClone.headlessMode;
                this.leaseStorageDomain = this.vmClone.leaseStorageDomain == null ? '' : this.vmClone.leaseStorageDomain;
                this.vmClone.virtioScsiEnabled = true; // 어디서 가져와야되나?
                this.bootImageUse = this.vmClone.bootImageUse;
                this.bootImage = this.bootImageUse ? this.vmClone.bootImage : ((this.vmClone.bootImages != null && this.vmClone.bootImages.length > 0) ? this.vmClone.bootImages[0].id : '');
                this.vmClone.monitors = '1'; // 임시
                this.vmClone.singleSignOn = this.vmClone.isSingleSignOn;
                this.useCloudInit = this.vmClone.useCloudInit;
                this.firstDevice = this.vmClone.firstDevice;
                this.secondDevice = this.vmClone.secondDevice;

                if (this.vmClone.use == null || this.vmClone.use == '') {
                    this.vmClone.use = 'systemManagement';
                }

                this.$nextTick(function () {
                    this.pickHost = "targetHost";
                });

//				if(this.vmClone.bootImage == '') {
//					this.vmClone.bootImage = this.vmClone.bootImages[0];
//				}

                // selectBox list mapping
                this.selectVo.selCreClusterVo.list = JSON.parse(JSON.stringify(this.vmClone.clusters));
                this.initData.creCluster = {
                    name: JSON.parse(JSON.stringify(this.vmClone.clusters[0].name)),
                    id: JSON.parse(JSON.stringify(this.vmClone.clusters[0].id))
                };
                this.selectVo.selCreClusterVo.selected = this.initData.creCluster;

                this.selectVo.selCreOsVo.list = JSON.parse(JSON.stringify(this.vmClone.operatingSystems));
                for (let os of this.selectVo.selCreOsVo.list) {
                    if (this.vmClone.operatingSystem == os.id) {
                        this.selectVo.selCreOpsVo.selected = {name: os.name, id: os.id};
                        break;
                    }
                }

                this.selectVo.selCreInsVo.list = JSON.parse(JSON.stringify(this.vmClone.instanceTypes));
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
                    if (this.vmClone.type == ops.id) {
                        this.selectVo.selCreOpsVo.selected = {name: ops.name, id: ops.id};
                        break;
                    }
                }

                for (let usage of this.selectVo.selCreUsageVo.list) {
                    if (this.vmClone.use == usage.id) {
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
                if (this.vmClone.bootImages != null && this.vmClone.bootImages.length > 0) {

                    this.selectVo.selBootImgVo.list = JSON.parse(JSON.stringify(this.vmClone.bootImages));

                    if (this.vmClone.bootImageUse && this.vmClone.bootImage !== null) {
                        for (let bootImg of this.selectVo.selBootImgVo.list) {

                            if (this.vmClone.bootImage == bootImg.id) {
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

                this.selectVo.selLeaseStrgVo.list = JSON.parse(JSON.stringify(this.vmClone.leaseStorageDomains));
                if (this.vmClone.leaseStorageDomain == null || this.selectVo.selLeaseStrgVo.list[0].name !== "가상 머신 임대 없음") {
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
                    if (this.vmClone.priority == 1) {
                        this.selectVo.selPriorityVo.selected = {name: "낮음", id: 0};
                        break;
                    }

                    if (this.vmClone.priority == priority.id) {
                        this.selectVo.selPriorityVo.selected = {name: priority.name, id: priority.id};
                        break;
                    }
                }

                this.selectVo.selTarHostVo.list = [];
                for (let host of this.vmClone.hosts) {
                    this.selectVo.selTarHostVo.list.push({
                        name: JSON.parse(JSON.stringify(host.hostName)),
                        id: JSON.parse(JSON.stringify(host.hostId))
                    });
                }
                if (this.vmClone.recommendHost == null) {
                    for (let targetHost of this.selectVo.selTarHostVo.list) {
                        if (targetHost.id === this.vmClone.targetHost) {
                            this.selectVo.selTarHostVo.selected = {name: targetHost.name, id: targetHost.id};
                            ;
                            break;
                        }
                    }

                }

                for (let migration of this.selectVo.selMigrationVo.list) {
                    if (migration.id === this.vmClone.affinity) {
                        this.selectVo.selMigrationVo.selected = {name: migration.name, id: migration.id}
                        break;
                    }
                }

                if (this.vmClone.customMigrationUsed) {
                    for (let cusMig of this.selectVo.selCustomMigVo.list) {
                        if (this.vmClone.customMigration != null && this.vmClone.customMigration == cusMig.id) {
                            this.selectVo.selCustomMigVo.selected = {name: cusMig.name, id: cusMig.id};
                        }

                    }
                } else {
                    this.selectVo.selCustomMigVo.selected = {name: "정책 선택", id: "null"};
                }

                for (let autoCon of this.selectVo.selAutoConVo.list) {
                    if (autoCon.id === this.vmClone.autoConverge) {
                        this.selectVo.selAutoConVo.selected = {name: autoCon.name, id: autoCon.id};
                        break;
                    }

                }

                for (let comp of this.selectVo.selCompVo.list) {
                    if (comp.id === this.vmClone.compressed) {
                        this.selectVo.selCompVo.selected = {name: comp.name, id: comp.id};
                        break;
                    }

                }

                this.selectVo.selNumaVo.selected = this.initData.creNuma;

                for (let cpuShare of this.selectVo.selCpuShareVo.list) {
                    if (cpuShare.id === this.vmClone.cpuShare) {
                        this.selectVo.selCpuShareVo.selected = {name: cpuShare.name, id: cpuShare.id};
                        break;
                    }
                }

                this.selectVo.selTemplateVo.list = [...this.vmClone.templates];
                for(let template of this.selectVo.selTemplateVo.list){
                    if(template.id === this.vmClone.template){
                        this.selectVo.selTemplateVo.selected = template;
                        break;
                    }
                }
                // selectBox list mapping

                this.clearStep();
                $("#clStep0").addClass('active');
                $("#vmCloneModal").addClass('active');
                this.spinnerOn = false;



                this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // // 디스크 연결 목록
        // retrieveDisks: function() {
        // 	this.$http.get('/compute/createVm/disks').then(function(response) {
        // 		this.disks = response.data.resultKey;
        // 	}.bind(this)).catch(function(error) {
        // 	     console.log(error);
        // 	});
        // },
        //
        // setDiskIndex: function(index, status) {
        // 	this.diskIndex = index;
        //
        // 	if(status == 'create' || status == 'update') {
        // 		this.disk = this.linkedDisks[index];
        // 		this.disk.status = status;
        // 	}
        // },
        //
        // connectDisk: function() {
        // 	this.selectDisk.status = 'linked';
        // 	this.selectDisk.diskInterface = this.selectDisk.diskInterface == null ? 'virtio_scsi' : this.selectDisk.diskInterface;
        // 	this.linkedDisks.push(this.selectDisk);
        // 	this.disks.splice(this.disks.indexOf(this.selectDisk), 1);
        // 	this.instanceImageAdd = false;
        // 	$(".connectiondiskmodal").modal('hide');
        // },
        //
        // updateConnectDisk: function() {
        // 	this.selectDisk.status = 'linked';
        // 	this.selectDisk.diskInterface = this.selectDisk.diskInterface == null ? 'virtio_scsi' : this.selectDisk.diskInterface;
        // 	this.disks.push(this.linkedDisks[this.diskIndex]);
        // 	this.linkedDisks[this.diskIndex] = this.selectDisk;
        // 	this.disks.splice(this.disks.indexOf(this.selectDisk), 1);
        // 	$(".updateconnectiondiskmodal").modal('hide');
        // },

        changeDiskInterface: function (event) {
            this.selectDisk.diskInterface = event.srcElement.value;
        },

        // addDisk: function(index) {
        // 	this.instanceImageAdd = true;
        // },

// 		removeDisk: function(index) {
//
// 			if(this.linkedDisks[index].status === 'linked') {
// 				this.disks.push(this.linkedDisks[index]);
// 				this.linkedDisks.splice(index, 1);
//
// 				if(this.linkedDisks.length === 0) {
// 					this.instanceImageAdd = true;
// 				}
// 			} else if(this.linkedDisks[index].status === 'create') {
// 				this.linkedDisks.splice(index, 1);
// 			} else {
// 				$(".removediskmodal").modal('show');
// 				this.disk = this.linkedDisks[index];
// 				this.disk.index = index;
// 			}
// 		},
//
// 		removeTargetDisk: function() {
// 			var index = this.disk.index;
//
// 			if(this.disk.removePermanently) {
// 				this.disk.status = 'remove';
// 			} else {
// 				this.disk.status = 'disconnect';
// 			}
//
// 			this.linkedDisks[index] = this.disk;
// 			this.disk = {};
// 			$(".removediskmodal").modal('hide');
// 		},
//
// 		// 디스크 생성 화면
// 		retrieveStorageDomains: function() {
// 			this.$http.get('/v2/storage/domains?status=active&domainType=DATA').then(function(response) {
// 				this.storageDomains = response.data.resultKey;
//
// 				for(var i=0; i<this.storageDomains.length; i++) {
// 					// if(this.storageDomains[i].type == 'DATA') {
// 						this.storageDomainId = this.storageDomains[i].id;
// 						// break;
// 					// }
// 				}
// 			}.bind(this)).catch(function(error) {
// 			    // console.log(error);
// 			});
// 		},
//
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
//
// 		cancelCreateDisk: function() {
// 			this.disk = {};
// 			$(".creatediskmodal").modal('hide');
// 		},
//
// 		checkDiskName: function() {
// 			if (this.disk.name.length >= 4) {
// 				this.validDiskName = false;
// 			} else {
// 				this.validDiskName = true;
// 			}
//
// 			this.diskNameStatus = this.checkInputName(this.disk.name).result;
// 		},
//
// 		updateDisk: function() {
//
// 			if(this.validDiskName) {
// 				alert("디스크 이름은 4글자 이상 입력해야 합니다.");
// 			} else if(this.diskNameStatus) {
//
// 				var checkResult = this.checkInputName(this.disk.name);
//
// 				alert("디스크 이름은 " + checkResult.msg);
// 			} else {
// 				this.disk.storageDomainId = this.storageDomainId;
// 				this.disk.status = 'update';
// 				this.disk.virtualSizeExtend = this.disk.virtualSizeExtend == null ? 0 : this.disk.virtualSizeExtend;
// 				this.disk.virtualSize = Number(this.disk.virtualSize) + Number(this.disk.virtualSizeExtend);
// 				this.linkedDisks[this.diskIndex] = this.disk;
// 				this.disk = {};
// 				$(".updatediskmodal").modal('hide');
// 			}
// 		},
//
// 		cancelUpdateDisk: function() {
// 			this.disk = {};
// 			$(".updatediskmodal").modal('hide');
// 		},

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

            if (this.memory != this.vmClone.memory / 1024 / 1024) {
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
            this.selectVo.selPerVirSockVo.selected = {name: this.coresPerVirtualSocket.toString(), id: this.coresPerVirtualSocket};
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
            this.selectVo.selPerVirSockVo.selected = {name: this.coresPerVirtualSocket.toString(), id: this.coresPerVirtualSocket};
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
            this.selectVo.selPerVirSockVo.selected = {name: this.coresPerVirtualSocket.toString(), id: this.coresPerVirtualSocket};
            this.selectVo.selThreadPerCoreVo.selected = {name: this.threadsPerCore.toString(), id: this.threadsPerCore};
        },
        checkVmName: function () {
            if (this.vmClone.name.length >= 4) {
                this.validVmName = false;
            } else {
                this.validVmName = true;
            }

            this.vmNameStatus = this.checkInputName(this.vmClone.name).result;
        },
        cloneVm: function () {

            this.vmClone.id = this.vmId;
            this.vmClone.snapshotId = this.snapshotId;

            if (this.validVmName) {
                alert("가상머신 이름은 4글자 이상 입력해야 합니다.");
            } else {
                var checkResult = this.checkInputName(this.vmClone.name);

                if (checkResult.result) {
                    alert("가상머신 이름은 " + checkResult.msg);
                } else {
                    if (this.orgName !== this.vmClone.name) { // 가상머신 이름 변경 시 중복체크
                        this.$http.post('/compute/vm/checkDuplicateName?name=' + this.vmClone.name).then(function (response) {
                            if (response.data.resultKey) {
                                alert("중복된 이름입니다.");
                            } else {
                                this.sendCloneVm();
                            }
                        }.bind(this)).catch(function (error) {
                            // console.log(error);
                        });
                    } else {
                        this.sendCloneVm();
                    }
                }
            }
        },

        sendCloneVm: function () {
            if ((this.pickHost === 'targetHost' && this.targetHost === null) ||
                (this.pickHost === 'recommendHost' && this.recommendHost === null)) {
                alert("실행 호스트를 선택해야 합니다.");
            } else {
                this.vmClone.cluster = this.cluster;
                this.vmClone.instanceType = this.instanceType;
                this.vmClone.memory = this.memory == 0 ? 1024 : this.memory.replace(/[^0-9]/g, '') * 1024 * 1024;
                this.vmClone.maximumMemory = this.maximumMemory == 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                this.vmClone.physicalMemory = this.physicalMemory == 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                this.vmClone.coresPerVirtualSocket = this.coresPerVirtualSocket;
                this.vmClone.virtualSockets = this.virtualSockets;
                this.vmClone.threadsPerCore = this.threadsPerCore;
                this.vmClone.firstDevice = this.firstDevice;
                this.vmClone.secondDevice = this.secondDevice;
                this.vmClone.ioThreadsEnabled = this.ioThreadsEnabled ? 1 : 0;
                this.vmClone.rngEnabled = this.rngEnabled;
                this.vmClone.deviceSource = this.deviceSource;

                this.vmClone.highAvailability = this.highAvailability;
                this.vmClone.leaseStorageDomain = this.leaseStorageDomain;
                this.vmClone.headlessMode = this.headlessMode;

                this.vmClone.selectNics = [];

                if (this.nics.length > 0) {
                    for (var i = 0; i < this.nics.length; i++) {
                        if (this.nics[i] == 'none') {
                            this.nics.splice(i, 1);
                        }
                    }

                    this.vmClone.selectNics = this.nics;
                }

                if (this.bootImageUse) {
                    this.vmClone.bootImage = this.bootImage;
                }

                if (this.pickHost === 'targetHost') {
                    this.vmClone.recommendHost = null;
                    this.vmClone.targetHost = this.targetHost;
                } else {
                    this.vmClone.recommendHost = this.recommendHost;
                    this.vmClone.targetHost = null;
                }

                this.$http.post('/compute/cloneVm', this.vmClone).then(function (response) {
                    location.href = '/compute/vms';
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },

        symphonyRecommend: _.debounce(function () {
            this.vmClone.cluster = this.cluster;
            this.vmClone.memory = this.memory === 0 ? 1024 : this.memory.replace(/[^0-9]/g, '');
            this.vmClone.maximumMemory = this.maximumMemory === 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '');
            this.vmClone.physicalMemory = this.physicalMemory === 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '');

            this.$http.post('/compute/createVm/recommendHosts', this.vmClone).then(function (response) {
                this.recommendHosts = response.data.resultKey;

                if (this.recommendHosts.length == 0) {
                    for (var i = 0; i < this.vmClone.hosts.length; i++) {
                        if (this.vmClone.cluster == this.vmClone.hosts[i].clusterId) {
                            this.recommendHosts.push([this.vmClone.hosts[i].hostId, this.vmClone.hosts[i].hostName]);
                        }
                    }
                }

                this.recommendHost = this.recommendHosts[0][0];
            }.bind(this)).catch(function (error) {
                // console.log(error);
            })
        }, 1000),

        setHost: function (value) {
            if (value == 'recommendHost') {
                this.targetHost = null;
                this.recommendHost = this.recommendHosts[0][0]; // 심포니 추천과 특정 호스트 변수 나눠야됨
            } else {
                this.recommendHost = null;

                if (this.vmClone.targetHost != null) {
                    this.targetHost = this.vmClone.targetHost;
                } else {
                    this.targetHost = this.vmClone.hosts[0].hostId;
                }
            }
        },
        goBack: function () {
            history.back();
        },
        selectConnectDisk: function (disk) {
            this.selectDisk = disk;
        },
        addNic: function (index) {
            this.nics.push('none');
        },
        // removeNic: function(index) {
        // 	if(this.status == 'up' && index < this.orgNicsSize) {
        // 		alert("기동중인 가상머신은 연결된 네트워크를 제거할 수 없습니다.");
        // 	} else {
        // 		this.nics.splice(index, 1);
        //
        // 		if(this.nics.length == 0) {
        // 			this.nics.push('none');
        // 		}
        // 	}
        // },
        changeBootable: function (bootable) {
            this.existBootDisk = bootable;
        }
    },
    watch: {
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
                //     if (this.vmClone.virtualSockets != 1 || this.vmClone.coresPerVirtualSocket != 1 || this.vmClone.threadsPerCore != 1) {
                //         this.virtualSockets = this.vmClone.virtualSockets;
                //         this.coresPerVirtualSocket = this.vmClone.coresPerVirtualSocket;
                //         this.threadsPerCore = this.vmClone.threadsPerCore;
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
            this.vmClone.cluster = this.cluster;

            for (var i = 0; i < this.vmClone.clusters.length; i++) {

                if (this.vmClone.clusters[i].id == this.cluster) {
                    this.cpuProfile = this.vmClone.clusters[i].name;
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
            }
        },
        cpuShare: function (value) {
            this.vmClone.cpuShare = value;
        },
        showCreateDiskModal: function () {
            this.disk = {};
            this.diskNameStatus = true;
            this.validDiskName = true;
        },
        showConnectionDiskModal: function () {
            this.selectDisk = '';
            this.showConnectionDiskModal = false;
        },
        bootImageUse: function () {
            this.vmClone.bootImageUse = this.bootImageUse;
            this.vmClone.bootImage = this.vmClone.bootImages[0].id;
        },
        useCloudInit: function () {
            this.vmClone.useCloudInit = this.useCloudInit;

            if (this.useCloudInit == true) {
                this.vmClone.timezone = this.vmClone.timezone == null ? 'Asia/Seoul' : this.vmClone.timezone;
            }
        },
        instanceType: function () {

            var instanceTypeId = this.instanceType;

            this.vmClone.instanceTypes.forEach(function (instanceType) {
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