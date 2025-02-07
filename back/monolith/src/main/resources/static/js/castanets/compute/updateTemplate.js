Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
    router: router,
    el: '#templateEditInfo',
    data: {
        initData: {
            creCluster: {name: "", id: ""},
            creOs: {name: "Other OS", id: "other"},
            // creIns: {name: "사용자 정의", id: "null"},
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
            // selCreInsVo: {
            //     size: "",
            //     list: [{name: "", id: ""}],
            //     index: 10003,
            //     selected: {name: "사용자 정의", id: "null"}
            // },
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
            }

        },
        templateEditInfo: {
            cluster: '',
            host: '',
            operatingSystem: '',
            clusters: [],
            operatingSystems: [],
            bootImageUse: false,
            memoryBalloon: true
        },
        cluster: '',
        memory: '',
        maximumMemory: '4096 MB',
        physicalMemory: '1024 MB',
        totalCpu: 1,
        divisors: [1],
        virtualSockets: 1,
        coresPerVirtualSocket: 1,
        threadsPerCore: 1,
        pickHost: 'targetHost',
        targetHost: '',
        cpuProfile: '',
        highAvailability: false,
        spinnerOn: false,
        recommendHost: '',
        recommendHosts: [],
        useCloudInit: false,
        firstDevice: 'hd',
        secondDevice: 'cdrom',
        cpuShare: '',
        cpuShareCustomUse: false,
        ioThreadsEnabled: false,
        rngEnabled: true,
        deviceSource: 'urandom',
        bootImageUse: false,
        templateNameStatus: false,
        validTemplateName: false,
        subTemplateNameStatus: false,
        validSubTemplateName: false,
        step: 0
    },
    mounted: function () {
        // get parameter
        // this.id = this.$route.query.id;
        // this.retrievetemplateEditInfoInfo();

        // get parameter
        this.$EventBus.$on('openTemplateUpdateModal', id => {
            this.id = id;
            this.spinnerOn = true;
            this.step = 0;
            this.retrievetemplateEditInfoInfo();
        });
    },
    methods: {

        setSelected: function (selectData, index) {
            if (index === 10001) {
                this.cluster = selectData.id;
            } else if (index === 10002) {
                this.templateEditInfo.operatingSystem = selectData.id;
            }
            // else if (index === 10003) {
            //     this.instanceType = selectData.id;
            // }
            else if (index === 10004) {
                this.templateEditInfo.type = selectData.id;
            } else if (index === 10005) {
                this.templateEditInfo.use = selectData.id;
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
                this.templateEditInfo.priority = selectData.id;
            } else if (index === 10014) {
                this.recommendHost = selectData.id;
            } else if (index === 10015) {
                this.targetHost = selectData.id;
            } else if (index === 10016) {
                this.templateEditInfo.affinity = selectData.id;
            } else if (index === 10017) {
                this.templateEditInfo.customMigration = selectData.id;
            } else if (index === 10018) {
                this.templateEditInfo.autoConverge = selectData.id;
            } else if (index === 10019) {
                this.templateEditInfo.compressed = selectData.id;
            } else if (index === 10020) {
                this.numa = selectData.id;
            } else if (index === 10021) {
                this.templateEditInfo.timezone = selectData.id;
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
        closeModal:function (type){
            if (type === "update") {
                $("#templateUpdateModal").removeClass("active");
            }
        },
        // retrieve template info
        retrievetemplateEditInfoInfo: function () {
            this.$http.get('/compute/retrieveTemplateEditInfo?id=' + this.id).then(function (response) {
                this.templateEditInfo = response.data.resultKey;
                this.cluster = this.templateEditInfo.cluster;
                this.memory = this.templateEditInfo.memory / 1024 / 1024 + " MB";
                this.maximumMemory = this.templateEditInfo.maximumMemory / 1024 / 1024 + " MB";
                this.physicalMemory = this.templateEditInfo.physicalMemory / 1024 / 1024 + " MB";
                this.totalCpu = this.templateEditInfo.virtualSockets * this.templateEditInfo.coresPerVirtualSocket * this.templateEditInfo.threadsPerCore;
                this.virtualSockets = this.templateEditInfo.virtualSockets;
                this.coresPerVirtualSocket = this.templateEditInfo.coresPerVirtualSocket;
                this.threadsPerCore = this.templateEditInfo.threadsPerCore;
                this.cpuProfile = this.templateEditInfo.clusters[0].name;
                this.cpuShare = this.templateEditInfo.cpuShare;
                this.ioThreadsEnabled = this.templateEditInfo.ioThreadsEnabled;
                this.highAvailability = this.templateEditInfo.highAvailability;
                this.templateEditInfo.virtioScsiEnabled = true; // 어디서 가져와야되나?
                this.bootImageUse = this.templateEditInfo.bootImageUse;
                this.templateEditInfo.monitors = '1'; // 임시
                this.templateEditInfo.singleSignOn = this.templateEditInfo.isSingleSignOn;
                this.useCloudInit = this.templateEditInfo.useCloudInit;
                this.firstDevice = this.templateEditInfo.firstDevice;
                this.secondDevice = this.templateEditInfo.secondDevice;

                if (this.templateEditInfo.bootImage === '') {
                    this.templateEditInfo.bootImage = this.templateEditInfo.bootImages[0];
                }

                this.$nextTick(function () {
                    this.targetHost = this.templateEditInfo.targetHost;
                });

                //this.secondDevice value가 null일때 select option 걸기 위함 jh 20200629
                if (this.secondDevice === null) {
                    this.secondDevice = 'none';
                }

                // selectBox list mapping
                this.selectVo.selCreClusterVo.list = JSON.parse(JSON.stringify(this.templateEditInfo.clusters));
                this.initData.creCluster = {
                    name: JSON.parse(JSON.stringify(this.templateEditInfo.clusters[0].name)),
                    id: JSON.parse(JSON.stringify(this.templateEditInfo.clusters[0].id))
                };
                this.selectVo.selCreClusterVo.selected = this.initData.creCluster;

                this.selectVo.selCreOsVo.list = JSON.parse(JSON.stringify(this.templateEditInfo.operatingSystems));
                for (let os of this.selectVo.selCreOsVo.list) {
                    if (this.templateEditInfo.operatingSystem == os.id) {
                        this.selectVo.selCreOpsVo.selected = {name: os.name, id: os.id};
                        break;
                    }
                }

                // this.selectVo.selCreInsVo.list = JSON.parse(JSON.stringify(this.templateEditInfo.instanceTypes));
                // if (this.selectVo.selCreInsVo.list[0].name !== "사용자 정의") {
                //     this.selectVo.selCreInsVo.list.unshift(this.initData.creIns);
                // }
                // for (let instance of this.selectVo.selCreInsVo.list) {
                //     if (this.instanceType === instance.id) {
                //         this.selectVo.selCreInsVo.selected = {name: instance.name, id: instance.id};
                //         break;
                //     }
                // }

                for (let ops of this.selectVo.selCreOpsVo.list) {
                    if (this.templateEditInfo.type == ops.id) {
                        this.selectVo.selCreOpsVo.selected = {name: ops.name, id: ops.id};
                        break;
                    }
                }

                for (let usage of this.selectVo.selCreUsageVo.list) {
                    if (this.templateEditInfo.use == usage.id) {
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
                if (this.templateEditInfo.bootImages != null && this.templateEditInfo.bootImages.length > 0) {

                    this.selectVo.selBootImgVo.list = JSON.parse(JSON.stringify(this.templateEditInfo.bootImages));

                    if (this.templateEditInfo.bootImageUse && this.templateEditInfo.bootImage !== null) {
                        for (let bootImg of this.selectVo.selBootImgVo.list) {

                            if (this.templateEditInfo.bootImage == bootImg.id) {
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

                this.selectVo.selLeaseStrgVo.list = JSON.parse(JSON.stringify(this.templateEditInfo.leaseStorageDomains));
                if (this.templateEditInfo.leaseStorageDomain == null || this.selectVo.selLeaseStrgVo.list[0].name !== "가상 머신 임대 없음") {
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
                    if (this.templateEditInfo.priority == 1) {
                        this.selectVo.selPriorityVo.selected = {name: "낮음", id: 0};
                        break;
                    }

                    if (this.templateEditInfo.priority == priority.id) {
                        this.selectVo.selPriorityVo.selected = {name: priority.name, id: priority.id};
                        break;
                    }
                }

                this.selectVo.selTarHostVo.list = [];
                for (let host of this.templateEditInfo.hosts) {
                    this.selectVo.selTarHostVo.list.push({
                        name: JSON.parse(JSON.stringify(host.hostName)),
                        id: JSON.parse(JSON.stringify(host.hostId))
                    });
                }
                if (this.templateEditInfo.recommendHost == null) {
                    for (let targetHost of this.selectVo.selTarHostVo.list) {
                        if (targetHost.id === this.templateEditInfo.targetHost) {
                            this.selectVo.selTarHostVo.selected = {name: targetHost.name, id: targetHost.id};
                            ;
                            break;
                        }
                    }

                }

                for (let migration of this.selectVo.selMigrationVo.list) {
                    if (migration.id === this.templateEditInfo.affinity) {
                        this.selectVo.selMigrationVo.selected = {name: migration.name, id: migration.id}
                        break;
                    }
                }

                if (this.templateEditInfo.customMigrationUsed) {
                    for (let cusMig of this.selectVo.selCustomMigVo.list) {
                        if (this.templateEditInfo.customMigration != null && this.templateEditInfo.customMigration == cusMig.id) {
                            this.selectVo.selCustomMigVo.selected = {name: cusMig.name, id: cusMig.id};
                        }

                    }
                } else {
                    this.selectVo.selCustomMigVo.selected = {name: "정책 선택", id: "null"};
                }

                for (let autoCon of this.selectVo.selAutoConVo.list) {
                    if (autoCon.id === this.templateEditInfo.autoConverge) {
                        this.selectVo.selAutoConVo.selected = {name: autoCon.name, id: autoCon.id};
                        break;
                    }

                }

                for (let comp of this.selectVo.selCompVo.list) {
                    if (comp.id === this.templateEditInfo.compressed) {
                        this.selectVo.selCompVo.selected = {name: comp.name, id: comp.id};
                        break;
                    }

                }

                this.selectVo.selNumaVo.selected = this.initData.creNuma;

                for (let cpuShare of this.selectVo.selCpuShareVo.list) {
                    if (cpuShare.id === this.templateEditInfo.cpuShare) {
                        this.selectVo.selCpuShareVo.selected = {name: cpuShare.name, id: cpuShare.id};
                        break;
                    }
                }
                // selectBox list mapping
                
                // console.log("response.data.resultKey", response.data.resultKey);

                this.clearStep();
                $("#upStep0").addClass('active');
                $("#templateUpdateModal").addClass('active');
                this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        memoryChange: function () {
            if (this.memory.includes("GB")) {
                this.memory = this.memory.replace(/[^0-9]/g, '');
                this.memory = this.memory * 1024;
                this.maximumMemory = this.templateEditInfo.memory * 4;
            } else if (this.memory.includes("MB")) {
                this.memory = this.memory.replace(/[^0-9]/g, '');
                this.maximumMemory = this.memory * 4;
            } else {
                this.maximumMemory = this.memory * 4;
            }

            this.memory = this.memory + " MB";
            this.maximumMemory = this.maximumMemory + " MB";
            this.physicalMemory = this.memory;
        },

        maximumMemoryChange: function () {
            if (this.maximumMemory.includes("GB")) {
                this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
                this.maximumMemory = this.maximumMemory * 1024;
            } else if (this.maximumMemory.includes("MB")) {
                this.maximumMemory = this.maximumMemory.replace(/[^0-9]/g, '');
            }

            this.maximumMemory = this.maximumMemory + " MB";
        },

        physicalMemoryChange: function () {
            if (parseInt(this.physicalMemory.replace(/[^0-9]/g, '')) > parseInt(this.memory.replace(/[^0-9]/g, ''))) {
                alert("시스템 항목의 메모리 크기보다 클 수 없습니다.");
                this.physicalMemory = this.memory;
            }

            if (this.physicalMemory.includes("GB")) {
                this.physicalMemory = this.physicalMemory.replace(/[^0-9]/g, '');
                this.physicalMemory = this.physicalMemory * 1024;
            } else if (this.physicalMemory.includes("MB")) {
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

        checkTemplateName: function () {
            if (this.templateEditInfo.name.length >= 4) {
                this.validTemplateName = false;
            } else {
                this.validTemplateName = true;
            }

            this.templateNameStatus = this.checkInputName(this.templateEditInfo.name).result;
        },

        checkSubTemplateName: function () {
            if (this.templateEditInfo.subName.length >= 4) {
                this.validSubTemplateName = false;
            } else {
                this.validSubTemplateName = true;
            }

            this.subTemplateNameStatus = this.checkInputName(this.templateEditInfo.subName).result;
        },

        updateTemplate: function () {

            var checkResult = false;

            if (this.templateEditInfo.subName == 'base version') {
                checkResult = this.checkInputName(this.templateEditInfo.name);
            } else {
                checkResult = this.checkInputName(this.templateEditInfo.subName);
            }

            if (checkResult.result) {
                alert("템플릿 이름은 " + checkResult.msg);
            } else {

                var isDuplication = false;

                this.$http.post('/compute/template/checkDuplicateName?name=' + this.templateEditInfo.name).then(function (response) {
                    isDuplication = response.data.resultKey;

                    // 하위 버전 템플릿 편집 시, 기반 템플릿 이름이 중복될 수 있음
                    if (this.templateEditInfo.subName != null) {
                        isDuplication = false;
                    }

                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });

                // console.log('this.pickHost = ' + this.pickHost);

                if (isDuplication) {
                    alert("중복된 이름입니다.");
                } else if ((this.pickHost === 'targetHost' && this.targetHost === null) ||
                    (this.pickHost === 'recommendHost' && this.recommendHost === null)) {
                    alert("실행 호스트를 선택해야 합니다.");
                } else {
                    this.templateEditInfo.cluster = this.cluster;
                    this.templateEditInfo.memory = this.memory == 0 ? 1024 : this.memory.replace(/[^0-9]/g, '') * 1024 * 1024;
                    this.templateEditInfo.maximumMemory = this.maximumMemory == 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                    this.templateEditInfo.physicalMemory = this.physicalMemory == 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '') * 1024 * 1024;
                    this.templateEditInfo.coresPerVirtualSocket = this.coresPerVirtualSocket;
                    this.templateEditInfo.virtualSockets = this.virtualSockets;
                    this.templateEditInfo.threadsPerCore = this.threadsPerCore;
                    this.templateEditInfo.firstDevice = this.firstDevice;
                    this.templateEditInfo.secondDevice = this.secondDevice;
                    this.templateEditInfo.ioThreadsEnabled = this.ioThreadsEnabled ? 1 : 0;
                    this.templateEditInfo.rngEnabled = this.rngEnabled;
                    this.templateEditInfo.deviceSource = this.deviceSource;

                    if (this.pickHost === 'targetHost') {
                        this.templateEditInfo.recommendHost = null;
                        this.templateEditInfo.targetHost = this.targetHost;
                    } else {
                        this.templateEditInfo.recommendHost = this.recommendHost;
                    }

                    // console.log("templateEditInfo", this.templateEditInfo);

                    this.$http.post('/compute/updateTemplate', this.templateEditInfo).then(function (response) {
                        // console.log(response.data.resultKey);
                        location.href = '/compute/templates';
                    }.bind(this)).catch(function (error) {
                        // console.log(error);
                    });
                }
            }
        },

        symphonyRecommend: _.debounce(function () {
            this.templateEditInfo.cluster = this.cluster;
            this.templateEditInfo.memory = this.memory === 0 ? 1024 : this.memory.replace(/[^0-9]/g, '');
            this.templateEditInfo.maximumMemory = this.maximumMemory === 0 ? 4096 : this.maximumMemory.replace(/[^0-9]/g, '');
            this.templateEditInfo.physicalMemory = this.physicalMemory === 0 ? 1024 : this.physicalMemory.replace(/[^0-9]/g, '');

            this.$http.post('/compute/createVm/recommendHosts', this.templateEditInfo).then(function (response) {
                this.recommendHosts = response.data.resultKey;
                this.selectVo.selRecHostVo.list = [];

                if (this.recommendHosts.length == 0) {
                    for (var i = 0; i < this.templateEditInfo.hosts.length; i++) {
                        this.recommendHosts.push([this.templateEditInfo.hosts[i].hostId, this.templateEditInfo.hosts[i].hostName]);
                        this.selectVo.selRecHostVo.list.push({name: this.templateEditInfo.hosts[i].hostId, id: this.templateEditInfo.hosts[i].hostName});
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
            if (value === 'recommendHost') {
                this.targetHost = null;
                this.recommendHost = this.recommendHosts[0][0]; // 심포니 추천과 특정 호스트 변수 나눠야됨
            } else {
                this.recommendHost = null;
                this.targetHost = this.templateEditInfo.hosts[0].hostId;
            }
        },

        goBack: function () {
            history.back();
        },
    },
    watch: {
        totalCpu: function (value) {

            // this.divisors = [];
            //
            // for (i = 1; i <= value; i++) {
            //     if (value % i === 0) {
            //         this.divisors.push(i);
            //     }
            // }
            //
            // this.virtualSockets = value;
            // this.coresPerVirtualSocket = 1;
            // this.threadsPerCore = 1;

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
        pickHost: function (value) {
            this.setHost(value);
        },
        cluster: function () {
            this.recommendHost = null;
            this.targetHost = null;
            this.templateEditInfo.cluster = this.cluster;

            for (var i = 0; i < this.templateEditInfo.clusters.length; i++) {

                if (this.templateEditInfo.clusters[i].id === this.cluster) {
                    this.cpuProfile = this.templateEditInfo.clusters[i].name;
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
            if (value === this.secondDevice) {
                this.secondDevice = 'none';
            }
        },
        cpuShare: function (value) {
            if (value === 'custom') {
                this.templateEditInfo.cpuShare = '';
                this.cpuShareCustomUse = true;
            } else {
                this.templateEditInfo.cpuShare = value;
            }
        },
        bootImageUse: function () {
            this.templateEditInfo.bootImageUse = this.bootImageUse;

            if(this.templateEditInfo.bootImages.length > 0){
                this.templateEditInfo.bootImage = this.templateEditInfo.bootImages[0].id;
            } else {
                this.templateEditInfo.bootImage = "none";
            }

        },
        useCloudInit: function () {
            this.templateEditInfo.useCloudInit = this.useCloudInit;

            if (this.useCloudInit == true) {
                this.templateEditInfo.timezone = this.templateEditInfo.timezone == null ? 'Asia/Seoul' : this.templateEditInfo.timezone;
            }
        }
    },
    filters: {
        date: function (value) {
            if (value == undefined || isNaN(value) || value === '' || value === null) {
                return '';
            }

            return moment(value).format("YYYY MM DD HH:mm:ss");
        }
    }
});