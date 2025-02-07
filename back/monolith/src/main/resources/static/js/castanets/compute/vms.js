Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var vmsVue = new Vue({

    router: router,
    el: '#vms',
    data: {
        initData: {
            moveHost: {name: "", id: ""},
            tempCluster: {name: "", id: ""},
            tempDiskFor: {name: "QCOW2", id: "cow"},
            tempDiskStrg: {name: "", id: ""},
            tempDiskPro: {name: "", id: ""},
            rootTemplate: {name: "", id: ""},
            changeDisk: {name: "꺼내기", id: "eject"},
        },
        selectVo: {
            selPagingVo: {
                size: "small",
                list: [{name: "5", id: 5}, {name: "10", id: 10}, {name: "15", id: 15}],
                index: 10000,
                selected: {name: "5", id: 5}
            },
            selMoveHostVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10001,
                selected: {name: "전체", id: "selectAll"}
            },
            selClusterVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10002,
                selected: {name: "전체", id: "selectAll"}
            },
            selTempClusterVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10003,
                selected: {name: "전체", id: "selectAll"}
            },
            selTempDiskForVo: {
                size: "",
                list: [{name: "QCOW2", id: "cow"},
                    {name: "Raw", id: "raw"}],
                index: 10004,
                selected: {name: "QCOW2", id: "cow"}
            },
            selTempDiskstrgVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10005,
                selected: {name: "전체", id: "selectAll"}
            },
            selTempDiskProVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10006,
                selected: {name: "전체", id: "selectAll"}
            },
            selRootTempVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10007,
                selected: {name: "전체", id: "selectAll"}
            },
            selChaDiskVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10008,
                selected: {name: "전체", id: "selectAll"}
            }
        },
        isActive: false,
        paging: 5,
        isShow: "none",
        step: 0,
        createTemplateCluster: [],
        selectedTemplatesCluster: [],
        templateClusterName: "",
        vms: [],
        selectedVms: [],
        upVms: [],
        downVms: [],
        pausedVms: [],
        not_respondedVms: [],
        targetVm: {},
        templateDisks: [],
        clusters: [],
        cpuProfiles: [],
        rootTemplates: [],
        rootTemplate: {},
        quotas: [],
        storageDomains: [],
        diskProfiles: [],
        tempStorageDomains: [],
        tempDiskProfiles: [],
        newTemplate: {},
        isSubTemplate: false,
        spinnerOn: true,
        hostList: [],
        clusterList: [],
        newVmWithTemplate: {},
        templates: [],
        selectedTemplates: [],
        instanceTypes: [],
        selectedInstanceTypes: [],
        selectedMenu: 'templateListTitle',
        nics: [],
        discs: [],
        targetDisc: '',
        engineIp: '',
        metricsUri: '',
        uses: [
            {name: '시스템 관리', value: 'systemManagement'},
            {name: 'ERP', value: 'erp'},
            {name: 'CRM', value: 'crm'},
            {name: 'DBMS', value: 'dbms'},
            {name: '미들웨어', value: 'middleware'},
            {name: '테스팅', value: 'testing'},
            {name: '협업용(Office)', value: 'coop'},
            {name: '기타', value: 'other'}
        ],
        nic: {
            ipAddress: "",
            netmask: "",
            gateway: "",
            dns: ""
        },
        vmNameStatus: true,
        validVmName: true,
        templateNameStatus: true,
        validTemplateName: true,
        subTemplateNameStatus: true,
        validSubTemplateName: true,
        checkedHostId: '',
        selectedHostId: '',
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        },
        selTargetVm: ""
    },

    mounted: function () {

        // this.paging = 5;
        this.step = 0;
        this.spinnerOn = true;

        // subscribe
        this.wsSubscription();
        // get parameter
        this.status = this.$route.query.status == null ? 'all' : this.$route.query.status;
        // this.nics.push([]);
        // this.nics.push(JSON.parse(JSON.stringify(this.nic)));
        this.retrieveHostList();
        this.retrieveClusterList();
        this.retrieveVms();
        this.retrieveClusters();
//		this.retrieveCpuProfiles();
        this.retrieveRootTemplates();
//		this.retrieveQoutas();
        this.retrieveTemplates();
        this.retrieveInstanceTypes();
        this.retrieveDiscs();
        this.retrieveEngineIp();
        this.retrieveMetricsUri();
        this.timer = setInterval(this.retrieveVms, 60000 * 5);

    },
    created: function () {

    },
    methods: {
        closeBtn: function () {
            let curActiveBtnList = document.getElementsByClassName('btn-openPop');
            let curActiveBoxList = document.getElementsByClassName('openPop-target');

            for (let btn of curActiveBtnList) {
                btn.classList.remove('active');
            }

            for (let box of curActiveBoxList) {
                box.classList.remove('active');
            }
        },
        closeDrop: function () {
            let curActiveBtnList = document.getElementsByClassName('btn-stat-chg');
            let curActiveBoxList = document.getElementsByClassName('target-stat-chg');

            for (let btn of curActiveBtnList) {
                btn.classList.remove('active');
            }

            for (let box of curActiveBoxList) {
                box.classList.remove('active');
            }

        },
        setSelected: function (selectData, index) {
            if (index === 10000) {
                // this.paging = selectData.id;
            } else if (index === 10001) {
                this.selectedHostId = selectData.id;
            } else if (index === 10002) {
                this.newVmWithTemplate.cluster = selectData.id;
            } else if (index === 10003) {
                this.newTemplate.clusterId = selectData.id;
            } else if (index === 10004) {
                this.templateDisks[0].format = selectData.id;
            } else if (index === 10005) {
                this.templateDisks[0].storageDomainId = selectData.id;
            } else if (index === 10006) {
                this.templateDisks[0].diskProfileId = selectData.id;
            } else if (index === 10007) {
                this.rootTemplate = selectData.id;
            } else if (index === 10008) {
                this.targetDisc = selectData.id;
            }
        },

        showSwitch: function () {
            if (this.isShow === "none") {
                this.isShow = "block";
            } else if (this.isShow === "block") {
                this.isShow = "none";
            }
        },

        clearStep: function () {
            let currentStepList = document.getElementsByClassName('btn-step');

            for (let step of currentStepList) {
                step.classList.remove('active');
            }
        },

        isCreateStep: function (step) {
            return this.step === step;
        },
        stepCss: function (step) {
            if (step === 0) {
                $("#vmTpStep0").addClass('active');
            } else if (step === 1) {
                $("#vmTpStep1").addClass('active');
            } else if (step === 2) {
                $("#vmTpStep2").addClass('active');
            }
        },

        clickStep: function (step) {
            this.clearStep();
            this.step = step;
            this.stepCss(step);
        },
        nextStep: function (step) {
            this.clearStep();
            this.step = step;
            this.stepCss(step);
        },

        openModal: function (type) {
            this.closeBtn();
            if (type === "update") {
                this.$EventBus.$emit('openVmUpdateModal', this.selTargetVm.id, "vms");
            } else if (type === "delete") {
                $('#deleteVmModal').addClass('active');
            } else if (type === "vmWithTemplate") {
                this.step = 0;
                this.clearStep();
                $("#vmTpStep0").addClass('active');
                $('#createVmWithTemplateModal').addClass('active');
            } else if (type === "template") {
                $("#mySwitch").removeAttr('checked');
                this.retrieveTemplateDisks();
                $('#createTemplateModal').addClass('active');
            } else if (type === "migrateVm") {
                $('#migrateVmModal').addClass('active');
            } else if (type === "changeDisk") {
                $('#diskChangeModal').addClass('active');
            }

        },

        closeModal: function (type) {
            if (type === "vm") {
                $('#deleteVmModal').removeClass('active');
            } else if (type === "vmWithTemplate") {
                this.resetData('vmWithTemplate');
                $('#createVmWithTemplateModal').removeClass('active');
            } else if (type === "template") {
                this.isShow = "none";
                this.resetData('template');
                $('#createTemplateModal').removeClass('active');
            } else if (type === "migrateVm") {
                this.selectVo.selMoveHostVo.selected = this.initData.moveHost;
                $('#migrateVmModal').removeClass('active');
            } else if (type === "changeDisk") {
                if (this.discs.length > 0) {
                    this.selectVo.selChaDiskVo.selected = this.initData.changeDisk;
                }
                $('#diskChangeModal').removeClass('active');
            }

        },
        resetData: function (type) {
            if (type == 'vmWithTemplate') {
                this.selectedTemplates = [];
                this.selectedTemplatesCluster = {};
                this.selectedInstanceTypes = [];
                this.nics = [];
                this.newVmWithTemplate.name = "";
                this.newVmWithTemplate.hostName = "";
                this.newVmWithTemplate.password = "";
            } else if (type == 'template') {
                this.newTemplate.name = "";
                this.validTemplateName = true;
                this.selectVo.selTempDiskForVo.selected = this.initData.tempDiskFor;


            }

        },
        openCreateVm: function () {
            this.$EventBus.$emit('openVmCreateModal');

        },
        // retrieve vms
        retrieveVms: function (type) {
            if (type === 'update') {
                this.spinnerOn = true;
            }

            this.$http.get('/compute/vmList?status=' + this.status).then(function (response) {
                this.vms = response.data.resultKey;
                // console.log("vms", this.vms);
                // this.vms.forEach(vm =>{
                // 	if(vm.status === "unknown"){
                // 		vm.status = "not_responding"
                // 	}
                // })

                // for (let i = 0; i < this.vms.length; i++) {
                //     if (i > 1) {
                //         this.vms[i].idxFlag = true;
                //     } else {
                //         this.vms[i].idxFlag = false;
                //     }
                // }

                for (var i = 0; i < this.vms.length; i++) {
                    for (var j = 0; j < this.hostList.length; j++) {
                        if (this.vms[i].hostId != null && this.vms[i].hostId === this.hostList[j].hostId) {
                            this.vms[i].host = this.hostList[j].hostName;
                        }
                    }

                    for (var j = 0; j < this.clusterList.length; j++) {
                        if (this.vms[i].clusterId === this.clusterList[j].id) {
                            this.vms[i].cluster = this.clusterList[j].name;
                        }
                    }
                }

                this.selectedVms = [];
                this.upVms = [];
                this.downVms = [];
                this.pausedVms = [];

                //paging-component list 전달
                // this.$EventBus.$emit('totalList', this.vms, this.pagingVo.pagingNum);

                this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // 템플릿 생성에서 클러스터 목록 필터 by gtpark
        filterTempClusterList: function () {
            this.selectVo.selTempClusterVo.list = [];
            this.vms.some(vm => {
                if (vm.clusterId === this.targetVm.clusterId) {
                    if (this.createTemplateCluster.length === 0) {
                        return this.initData.tempCluster = {name: vm.cluster, id: vm.clusterId};
                    }
                }
            });
            this.selectVo.selTempClusterVo.list.push(this.initData.tempCluster);
            this.selectVo.selTempClusterVo.selected = this.initData.tempCluster;
            this.templateClusterName = this.initData.tempCluster.name;

            // for(var vm of this.vms){
            // 	if(vm.clusterId === this.targetVm.clusterId){
            // 		if(this.createTemplateCluster.length === 0){
            // 			this.createTemplateCluster.push(vm);
            // 			break;
            // 		}
            // 		this.templateClusterName = i.cluster;
            // 	}
            // }
        },

        // 호스트 목록 조회
        retrieveHostList: function () {
            this.$http.get('/compute/vmList/hosts').then(function (response) {
                this.hostList = response.data.resultKey;
                // console.log("hostList",this.hostList)
                // this.selectVo.selMoveHostVo.list = [];
                //
                // if(this.hostList.length > 1){
                //     for(let host of this.hostList){
                //         if(host.hostStatus === 'up'){
                //             this.selectVo.selMoveHostVo.list.push({name:host.hostName, id:host.hostId});
                //         }
                //     }
                // } else  {
                //     this.selectVo.selMoveHostVo.selected = {name:"이동할 호스트가 없습니다." ,id:"none"};
                //     this.selectVo.selMoveHostVo.list.push({name:"이동할 호스트가 없습니다." ,id:"none"});
                // }


            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // 클러스터 목록 조회
        retrieveClusterList: function () {
            this.$http.get('/compute/vmList/clusters').then(function (response) {
                this.clusterList = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // retrieve clusters
        retrieveClusters: function () {
            this.$http.get('/v2/clusters').then(function (response) {
                this.clusters = response.data.resultKey;
                this.newTemplate.clusterId = this.clusters[0].id;
                this.newVmWithTemplate.cluster = this.clusters[0].id;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // retrieve root templates
        retrieveRootTemplates: function () {
            this.$http.get('/compute/template/rootTemplates').then(function (response) {
                this.selectVo.selRootTempVo.list = [];
                this.rootTemplates = response.data.resultKey;
                for (let template of this.rootTemplates) {
                    this.selectVo.selRootTempVo.list.push({name: template.name, id: template.id});
                }
                this.initData.rootTemplate = JSON.parse(JSON.stringify(this.selectVo.selRootTempVo.list[0]));
                this.selectVo.selRootTempVo.selected = this.initData.rootTemplate;
//				this.newTemplate.cpuProfileId = this.cpuProfiles[0].id;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // retrieve template disks
        retrieveTemplateDisks: function () {
            this.filterTempClusterList();
            this.$http.get('/compute/template/retrieveDisks?id=' + this.targetVm.id).then(function (response) {
//				for(var i=0; i<result.length; i++) {
//					if(result[i].type == 'DATA') {
//						this.storageDomains.push(result[i]);
//					}
//				}
                this.newTemplate.orgVmId = this.targetVm.id;
                this.newTemplate.allUserAccess = true;
                this.newTemplate.clonePermissions = false;
                this.newTemplate.isSeal = false;
                this.templateDisks = response.data.resultKey;

                for (var i = 0; i < this.templateDisks.length; i++) {
                    this.templateDisks[i].storageDomainId = this.templateDisks[i].storageDomains[0].id;
                    this.templateDisks[i].diskProfileId = this.templateDisks[i].diskProfiles[0].id;
                    this.templateDisks[i].quotaId = this.templateDisks[i].quotas[0].id;

                    this.selectVo.selTempDiskstrgVo.list = [];
                    this.selectVo.selTempDiskProVo.list = [];
                    this.tempStorageDomains = JSON.parse(JSON.stringify(this.templateDisks[i].storageDomains));
                    this.tempDiskProfiles = JSON.parse(JSON.stringify(this.templateDisks[i].diskProfiles));

                    for (let storageDomain of this.templateDisks[i].storageDomains) {
                        this.selectVo.selTempDiskstrgVo.list.push({name: storageDomain.name, id: storageDomain.id});
                    }

                    for (let diskProfile of this.templateDisks[i].diskProfiles) {
                        this.selectVo.selTempDiskProVo.list.push({name: diskProfile.name, id: diskProfile.id});

                    }

                    this.selectVo.selTempDiskstrgVo.selected = JSON.parse(JSON.stringify(this.selectVo.selTempDiskstrgVo.list[0]));
                    this.selectVo.selTempDiskProVo.selected = JSON.parse(JSON.stringify(this.selectVo.selTempDiskProVo.list[0]));

                    this.templateDisks[i].diskFormats = JSON.parse(JSON.stringify(this.selectVo.selTempDiskForVo));
                    this.templateDisks[i].storageDomains = this.selectVo.selTempDiskstrgVo;
                    this.templateDisks[i].diskProfiles = this.selectVo.selTempDiskProVo;
                }


                // console.log("templateDisks", this.templateDisks);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // retrieve disk profiles
//		retrieveDiskProfiles: function() {
//			this.$http.get('/compute/retrieveDiskProfiles').then(function(response) {
//				this.diskProfiles = response.data.resultKey;
//				 console.log("diskProfiles", this.diskProfiles);
//			}.bind(this)).catch(function(error) {
//			     console.log(error);
//			});
//		},

        // retrieve cpu profiles
//		retrieveCpuProfiles: function() {
//			this.$http.get('/compute/template/cpuProfiles').then(function(response) {
//				this.cpuProfiles = response.data.resultKey;
//				this.newTemplate.cpuProfileId = this.cpuProfiles[0].id;
//			}.bind(this)).catch(function(error) {
//	             console.log(error);
//	        });
//		},

        // retrieve quotas
//		retrieveQoutas: function() {
//			this.$http.get('/admin/quotas/retrieveQuotasInfo').then(function(response) {
//				this.quotas = response.data.resultKey;
//				this.newTemplate.quotaId = this.quotas[0].id;
//			}.bind(this)).catch(function(error) {
//			     console.log(error);
//			});
//		},

        // create vm
        createVm: function () {
            location.href = '/compute/createVmView';
        },

        createVmWithTemplate: function () {
            this.vmNameStatus = true;
            location.href = '/compute/createVmWithTemplateView';
        },

        checkTemplateName: function () {
            if (this.newTemplate.name.length >= 4) {
                this.validTemplateName = false;
            } else {
                this.validTemplateName = true;
            }

            this.templateNameStatus = this.checkInputName(this.newTemplate.name).result;
        },

        checkSubTemplateName: function () {
            if (this.newTemplate.subVersionName.length >= 4) {
                this.validSubTemplateName = false;
            } else {
                this.validSubTemplateName = true;
            }

            this.subTemplateNameStatus = this.checkInputName(this.newTemplate.subVersionName).result;
        },

        // create template
        createTemplate: function () {

            var isDuplication = false;

            var checkResult = this.checkInputName(this.newTemplate.name);

            if (checkResult.result) {
                alert("템플릿 이름은 " + checkResult.msg);
            } else {
                this.$http.post('/compute/template/checkDuplicateName?name=' + this.newTemplate.name).then(function (response) {
                    if (response.data.resultKey && !this.isSubTemplate) {
                        alert("중복된 이름입니다.");
                    } else {
                        if (this.isSubTemplate) {
                            this.newTemplate.rootTemplateId = this.rootTemplate.id;
                        }
                        // this.newTemplate.templateDisks = this.templateDisks;

                        this.targetVm.status = 'image_locked';

                        if (this.templateDisks.length > 0) {

                            for (let storage of this.templateDisks[0].storageDomains.list) {
                                for (let storage2 of this.tempStorageDomains) {
                                    if (storage.id === storage2.id) {
                                        this.templateDisks[0].storageDomains = storage2;
                                        // sendTemplateDisks[0].storageDomains = [];
                                        // sendTemplateDisks[0].storageDomains.push(storage2);
                                        break;
                                    }
                                }
                            }

                            for (let profile of this.templateDisks[0].diskProfiles.list) {
                                for (let profile2 of this.tempDiskProfiles) {
                                    if (profile.id === profile2.id) {
                                        this.templateDisks[0].diskProfiles = profile2;
                                        // sendTemplateDisks[0].diskProfiles = profile2;
                                        break;
                                    }
                                }
                            }

                            let sendTemplateDisks = [];
                            sendTemplateDisks.push({
                                id: this.templateDisks[0].id,
                                name: this.templateDisks[0].name,
                                description: this.templateDisks[0].description,
                                virtualSize: this.templateDisks[0].virtualSize,
                                actualSize: this.templateDisks[0].actualSize,
                                status: this.templateDisks[0].status,
                                format: this.templateDisks[0].format,
                                type: this.templateDisks[0].type,
                                storageDomainId: this.templateDisks[0].storageDomainId,
                                diskProfileId: this.templateDisks[0].diskProfileId,
                                quotaId: this.templateDisks[0].quotaId,
                                storageDomains: [this.templateDisks[0].storageDomains],
                                diskProfiles: [this.templateDisks[0].diskProfiles],
                                quotas: this.templateDisks[0].quotas
                            });

                            this.newTemplate.templateDisks = sendTemplateDisks;

                        } else {
                            this.newTemplate.templateDisks = this.templateDisks;
                        }

                        // setTimeout(function () {this.spinnerOn = false;}, 3000);
                        this.$http.post('/compute/createTemplate', this.newTemplate).then(function (response) {
                            // console.log(response.data.resultKey);
                            this.closeModal('template');

                            this.newTemplate = {};
                        }.bind(this)).catch(function (error) {
                            // console.log(error);
                        });
                    }
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },

        // update vm
        updateVm: function () {
            if (this.selectedVms.length == 0) {
                alert("편집할 가상머신을 선택해 주세요.");
            } else if (this.selectedVms.length != 1) {
                alert("가상머신을 하나만 선택해 주세요.");
            } else {
                location.href = '/compute/updateVmInfo?vmId=' + this.selectedVms[0].id;
            }
        },

        // start vm
        startVm: function () {
            this.closeBtn();
            this.closeDrop();
            var message = '';

            for (var i = 0; i < this.downVms.length; i++) {
                message += this.downVms[i].name + "\n"
            }

            for (var i = 0; i < this.pausedVms.length; i++) {
                message += this.pausedVms[i].name + "\n"
            }

            if (this.downVms.length === 0 && this.pausedVms.length === 0) {
                alert("기동할 가상머신을 선택해 주세요.");
            } else if (confirm('다음의 가상머신을 기동합니까?\n' + message)) {

                var targetVms = [];

                for (var i = 0; i < this.vms.length; i++) {
                    for (var j = 0; j < this.downVms.length; j++) {
                        if (this.vms[i].id === this.downVms[j].id) {
                            if (this.vms[i].status === "wait_for_launch" || this.vms[i].status === "powering_up" || this.vms[i].status === "up") {
                                alert("기동중입니다.");
                            } else {
                                this.vms[i].status = "wait_for_launch"; // 시작 대기 중
                                //							this.vms[i].status = "powering_up"; // 전원을 켜는 중

                                targetVms.push(this.vms[i]);
                            }
                        }
                    }
                    for (var j = 0; j < this.pausedVms.length; j++) {
                        if (this.vms[i].id === this.pausedVms[j].id) {
                            if (this.vms[i].status === "wait_for_launch" || this.vms[i].status === "powering_up" || this.vms[i].status === "up") {
                                alert("기동중입니다.");
                            } else {
                                this.vms[i].status = "wait_for_launch"; // 시작 대기 중
                                //this.vms[i].status = "powering_up"; // 전원을 켜는 중

                                targetVms.push(this.vms[i]);
                            }
                        }
                    }
                }

                this.$http.post('/compute/startVm', targetVms).then(function (response) {
                    this.selectedVms = [];
                    this.downVms = [];
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },

        // stop vm
        stopVm: function () {
            // console.log("vm stop", this.upVms);
            this.closeBtn();
            this.closeDrop();
            var message = '';

            for (var i = 0; i < this.upVms.length; i++) {
                message += this.upVms[i].name + "\n"
            }

            if (this.upVms.length == 0) {
                alert("정지시킬 가상머신을 선택해 주세요.");
            } else if (confirm('다음의 가상머신을 정지시킵니까?\n' + message)) {
                for (var i = 0; i < this.vms.length; i++) {
                    for (var j = 0; j < this.upVms.length; j++) {
                        if (this.vms[i].id == this.upVms[j].id) {
                            if (this.vms[i].status == "powering_down") {
                                alert("전원을 끄는 중입니다.");
                            }
                            if (this.vms[i].status == "down") {
                                alert("전원이 꺼져있습니다.");
                            } else {
                                this.vms[i].status = "powering_down"; // 전원을 끄는 중
                            }
                        }
                    }
                }

                this.$http.post('/compute/stopVm', this.upVms).then(function (response) {
                    this.selectedVms = [];
                    this.upVms = [];
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },

        // reboot vm
        rebootVm: function () {
            // console.log("vm reboot", this.upVms);
            this.closeBtn();
            this.closeDrop();
            var message = '';

            for (var i = 0; i < this.upVms.length; i++) {
                message += this.upVms[i].name + "\n"
            }
            if (this.upVms.length == 0) {
                alert("재부팅할 가상머신을 선택해 주세요.");
            } else if (confirm('다음의 가상머신을 재부팅하시겠습니까?\n' + message)) {
                for (var i = 0; i < this.vms.length; i++) {
                    for (var j = 0; j < this.upVms.length; j++) {
                        if (this.vms[i].id == this.upVms[j].id) {
                            if (this.vms[i].status == "reboot_in_progress") {
                                alert("재부팅 중입니다.");
                            } else {
                                this.vms[i].status = "reboot_in_progress"; // 재부팅 중
                            }
                        }
                    }
                }

                this.$http.post('/compute/rebootVm', this.upVms).then(function (response) {
                    this.selectedVms = [];
                    this.upVms = [];
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },

        // suspend vm
        suspendVm: function () {
            this.closeBtn();
            this.closeDrop();
            // console.log("vm suspend", this.upVms);

            var message = '';

            for (var i = 0; i < this.upVms.length; i++) {
                message += this.upVms[i].name + "\n"
            }

            if (this.upVms.length === 0) {
                alert("일시정지시킬 가상머신을 선택해 주세요.");
            } else if (confirm('다음의 가상머신을 일시정지시킵니까?\n' + message)) {
                for (var i = 0; i < this.vms.length; i++) {
                    for (var j = 0; j < this.upVms.length; j++) {
                        if (this.vms[i].id == this.upVms[j].id) {
                            if (this.vms[i].status == "saving_state") {
                                alert("일시중지 중입니다.");
                            } else if (this.vms[i].status == "suspended") {
                                alert("일시중지 상태입니다.");
                            } else {
                                this.vms[i].status = "saving_state"; // 일시중지 중
                            }
                        }
                    }
                }

                this.$http.post('/compute/suspendVm', this.selectedVms).then(function (response) {
                    this.selectedVms = [];
                    this.upVms = [];
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },

        // remove vm
        removeVm: function () {
            this.spinnerOn = true;
            $('#deleteVmModal').removeClass('active');

            // console.log("down vms", this.downVms);

            // for (var i = 0; i < this.downVms.length; i++) {
            //     this.downVms[i].status = 'image_locked';
            // }
            this.selTargetVm.status = 'image_locked';

            this.$http.post('/compute/removeVm', [this.selTargetVm]).then(function (response) {
                this.selectedVms = [];
                this.downVms = [];
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // console
        console: function () {
            this.closeBtn();
            // if (this.selectedVms.length == 0) {
            //     alert("가상머신을 선택해 주세요.");
            // } else if (this.selectedVms.length > 1) {
            //     alert("가상머신을 하나만 선택해 주세요.");
            // } else if (this.selectedVms[0].status == "wait_for_launch") {
            //     alert("VNC에 접근할 수 없습니다.");
            // } else {
            //     var vmName = this.getVmName(this.selectedVms[0]);
            //     vncConsole.connect(vmName, "vnc");
            // }
            if (this.selTargetVm.status  === "wait_for_launch") {
                alert("VNC에 접근할 수 없습니다.");
            }  else {
                // var vmName = this.getVmName(this.selectedVms[0]);
                var vmName = this.selTargetVm.name;
                vncConsole.connect(vmName, "vnc");
            }
        },

        // metric
        metric: function () {
            this.closeBtn();
            // if (this.selectedVms.length > 1) {
            //     alert("가상머신을 하나만 선택해 주세요.");
            // } else {
            //     location.href = '/compute/vm/metrics?name=' + this.selectedVms[0].host + '&machineName=' + this.selectedVms[0].name;
            // }
            location.href = '/compute/vm/metrics?name=' + this.selTargetVm.host + '&machineName=' + this.selTargetVm.name;
        },

        // getVmName: function (id) {
        //     for (var i = 0; i < this.vms.length; i++) {
        //         if (this.vms[i].id == id.id) {
        //             return this.vms[i].name;
        //         }
        //     }
        // },
        targetVmFun: function (vm) {

            this.selTargetVm = vm;
            this.selTargetVm.diskDetach = true;

            //체크된 가상머신의 hostId값 저장 jh
            if (this.selectedVms != null && this.selectedVms != '') {
                this.checkedHostId = this.selectedVms[0].hostId;
            }

            this.selectVo.selMoveHostVo.list = [];

            if (vm.status === 'up') {
                if (this.hostList.length > 1) {
                    for (let host of this.hostList) {
                        if (host.hostStatus === 'up') {
                            this.selectVo.selMoveHostVo.list.push({name: host.hostName, id: host.hostId});
                        }
                    }

                    for (let idx in this.selectVo.selMoveHostVo.list) {
                        if (this.checkedHostId === this.selectVo.selMoveHostVo.list[idx].id) {
                            this.selectVo.selMoveHostVo.list.splice(idx, 1);
                            break;
                        }
                    }

                    this.initData.moveHost = {
                        name: this.selectVo.selMoveHostVo.list[0].name,
                        id: this.selectVo.selMoveHostVo.list[0].id
                    };

                    if (this.initData.moveHost.id != "none") {
                        this.selectedHostId = this.initData.moveHost.id;
                        this.selectVo.selMoveHostVo.selected = this.initData.moveHost;
                    }
                } else {
                    this.selectVo.selMoveHostVo.selected = {name: "이동할 호스트가 없습니다.", id: "none"};
                    this.selectVo.selMoveHostVo.list.push({name: "이동할 호스트가 없습니다.", id: "none"});
                }
            }

        },

        selectVm: function (vm, idx) {

            var vmIndex = this.selectedVms.indexOf(vm);

            if (vmIndex !== -1) {
                this.selectedVms.splice(vmIndex, 1);
            } else {
                this.selectedVms.push(vm);
            }

            // this.selectedVms = [];
            // this.selectedVms.push(vm);

            if (vm.status === 'up' || vm.status === 'powering_up' || vm.status === 'wait_for_launch' || vm.status === 'not_responding') {
                var upVmIndex = this.upVms.indexOf(vm);

                if (upVmIndex != -1) {
                    this.upVms.splice(upVmIndex, 1);
                    this.not_respondedVms.splice(upVmIndex, 1);
                } else {
                    vm.diskDetach = true;
                    this.upVms.push(vm);
                    this.not_respondedVms.push(vm)
                }
            }

            if (vm.status === 'down') {
                var downVmIndex = this.downVms.indexOf(vm);

                if (downVmIndex != -1) {
                    this.downVms.splice(downVmIndex, 1);
                } else {
                    vm.diskDetach = true;
                    this.downVms.push(vm);
                }
            }

            if (vm.status === 'paused' || vm.status === 'suspended') {
                var pausedVmIndex = this.pausedVms.indexOf(vm);

                if (pausedVmIndex != -1) {
                    this.pausedVms.splice(pausedVmIndex, 1);
                } else {
                    vm.diskDetach = true;
                    this.pausedVms.push(vm);
                }
            }

            // //체크된 가상머신의 hostId값 저장 jh
            // if (this.selectedVms != null && this.selectedVms != '') {
            //     this.checkedHostId = this.selectedVms[0].hostId;
            // }
            //
            // this.selectVo.selMoveHostVo.list = [];
            //
            // if (vm.status === 'up') {
            //     if (this.hostList.length > 1) {
            //         for (let host of this.hostList) {
            //             if (host.hostStatus === 'up') {
            //                 this.selectVo.selMoveHostVo.list.push({name: host.hostName, id: host.hostId});
            //             }
            //         }
            //
            //         for (let idx in this.selectVo.selMoveHostVo.list) {
            //             if (this.checkedHostId === this.selectVo.selMoveHostVo.list[idx].id) {
            //                 this.selectVo.selMoveHostVo.list.splice(idx, 1);
            //                 break;
            //             }
            //         }
            //
            //         this.initData.moveHost = {
            //             name: this.selectVo.selMoveHostVo.list[0].name,
            //             id: this.selectVo.selMoveHostVo.list[0].id
            //         };
            //
            //         if (this.initData.moveHost.id != "none") {
            //             this.selectedHostId = this.initData.moveHost.id;
            //             this.selectVo.selMoveHostVo.selected = this.initData.moveHost;
            //         }
            //     } else {
            //         this.selectVo.selMoveHostVo.selected = {name: "이동할 호스트가 없습니다.", id: "none"};
            //         this.selectVo.selMoveHostVo.list.push({name: "이동할 호스트가 없습니다.", id: "none"});
            //     }
            // }

        },

        changeUptime: function (time) {
            var hour = time / 60;

            if (time == null) {
                return "-";
            } else if (hour > 24) {
                return Math.floor(hour / 24) + " 일";
            } else if (1 < hour && hour < 24) {
                return Math.floor(hour) + " 시간";
            } else {
                return time + " 분";
            }
        },

        changeUseName: function (value) {
            for (var i = 0; i < this.uses.length; i++) {
                if (this.uses[i].value == value) {
                    return this.uses[i].name;
                }
            }
        },

        // retrieve templates
        retrieveTemplates: function () {
            this.$http.get('/compute/template/retrieveTemplates').then(function (response) {
                this.templates = response.data.resultKey;

                // 기본 생성되는 템플릿은 안보여줌
                for (var i = 0; i < this.templates.length; i++) {
                    if (this.templates[i].version == null) {
                        this.templates.splice(i, 1);
                    }
                }

                // console.log("templates", this.templates);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // 선택한 템플릿에 따른 클러스터 정보 넣기 by gtpark
        selectTemplate: function (template) {
            this.selectedTemplates = template;

            // var index = this.selectedTemplates.indexOf(template);
            //
            // if (index != -1) {
            //     this.selectedTemplates = [];
            //     this.selectedTemplatesCluster = [];
            // } else {
            //     this.selectedTemplates = [];
            //     this.selectedTemplates.push(template);

            // if (this.selectedTemplatesCluster.length == 0) {
            //     // 선택한 템플릿에 따른 클러스터 정보 넣기 by gtpark
            //     this.selectedTemplatesCluster.push(this.selectedTemplates[0].cluster)
            // } else {
            //     this.selectedTemplatesCluster = [];
            //     this.selectedTemplatesCluster.push(this.selectedTemplates[0].cluster)
            // }

            // }


            // if (index != -1) {
            // 	this.selectedTemplates = [];
            // } else {
            // 	this.selectedTemplates = [];
            // 	this.selectedTemplates.push(template);
            //
            // 	// 선택한 템플릿에 따른 클러스터 정보 넣기 by gtpark
            // 	this.selectedTemplatesCluster.push(this.selectedTemplates[0].cluster)
            // }
        },

        // retrieve instanceTypes
        retrieveInstanceTypes: function () {
            this.$http.get('/admin/retrieveInstanceTypes').then(function (response) {
                this.instanceTypes = response.data.resultKey;
                // console.log("instanceTypes", this.instanceTypes);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        selectInstanceType: function (instanceType) {

            this.selectedInstanceTypes = instanceType;

            // var index = this.selectedInstanceTypes.indexOf(instanceType);
            //
            // if (index != -1) {
            //     this.selectedInstanceTypes = [];
            // } else {
            //     this.selectedInstanceTypes = [];
            //     this.selectedInstanceTypes.push(instanceType);
            // }
        },

        modalNext: function (id) {
            this.selectedMenu = id;
        },

        modalPrevious: function (id) {
            this.selectedMenu = id;
            this.nics = [];
            this.nics.push([]);
        },

        checkVmName: function () {
            if (this.newVmWithTemplate.name.length >= 4) {
                this.validVmName = false;
            } else {
                this.validVmName = true;
            }

            this.vmNameStatus = this.checkInputName(this.newVmWithTemplate.name).result;
        },

        createVmWithTemplateDone: function () {

            if (this.nics.length === 0) {
                this.nics.push([]);
                this.newVmWithTemplate.nics = this.nics;
            } else {
                this.newVmWithTemplate.nics = this.nics;
            }
            this.newVmWithTemplate.cluster = this.clusters[0].id;

            var checkResult = this.checkInputName(this.newVmWithTemplate.name);

            if (checkResult.result) {
                alert("가상머신 이름은 " + checkResult.msg);
            } else {
                this.$http.post('/compute/vm/checkDuplicateName?name=' + this.newVmWithTemplate.name).then(function (response) {
                    if (response.data.resultKey) {
                        alert("중복된 이름입니다.");
                    } else {
                        this.spinnerOn = true;

                        // this.newVmWithTemplate.memory = this.selectedInstanceTypes[0].memory;
                        // this.newVmWithTemplate.guaranteedMemory = this.selectedInstanceTypes[0].maximumMemory;
                        // this.newVmWithTemplate.maximumMemory = this.selectedInstanceTypes[0].memory * 4;
                        // this.newVmWithTemplate.coresPerVirtualSocket = this.selectedInstanceTypes[0].coresPerVirtualSocket;
                        // this.newVmWithTemplate.virtualSockets = this.selectedInstanceTypes[0].virtualSockets;
                        // this.newVmWithTemplate.threadsPerCore = this.selectedInstanceTypes[0].threadsPerCore;
                        // this.newVmWithTemplate.template = this.selectedTemplates[0].id;
                        // this.newVmWithTemplate.instanceType = this.selectedInstanceTypes[0].id;
                        this.newVmWithTemplate.memory = this.selectedInstanceTypes.memory;
                        this.newVmWithTemplate.guaranteedMemory = this.selectedInstanceTypes.maximumMemory;
                        this.newVmWithTemplate.maximumMemory = this.selectedInstanceTypes.memory * 4;
                        this.newVmWithTemplate.coresPerVirtualSocket = this.selectedInstanceTypes.coresPerVirtualSocket;
                        this.newVmWithTemplate.virtualSockets = this.selectedInstanceTypes.virtualSockets;
                        this.newVmWithTemplate.threadsPerCore = this.selectedInstanceTypes.threadsPerCore;
                        this.newVmWithTemplate.template = this.selectedTemplates.id;
                        this.newVmWithTemplate.instanceType = this.selectedInstanceTypes.id;

                        this.newVmWithTemplate.useCloudInit = true;
                        this.newVmWithTemplate.timezone = 'Asia/Seoul';
                        this.newVmWithTemplate.virtioScsiEnabled = true; // 기본설정
                        // 고가용성 기본값
                        this.newVmWithTemplate.highAvailability = false;
                        this.newVmWithTemplate.leaseStorageDomain = '';
                        this.newVmWithTemplate.resumeBehaviour = 'kill';
                        this.newVmWithTemplate.priority = 1;

                        // this.newVmWithTemplate.customScript =
                        // 	"# cloud-config\r\r" +
                        // 	"## meta-data - system config\r" +
                        // 	"users :\r" +
                        // 	" - default\r\r" +
                        // 	"# user\r" +
                        // 	"chpasswd:\r" +
                        // 	"  list: |\r" +
                        // 	"    root:" + this.newVmWithTemplate.password + "\r" +
                        // 	"  expire: False\r" +
                        // 	"ssh_pwauth: True\r\r" +
                        // 	"# Hostname Management\r" +
                        // 	"hostname : " + this.newVmWithTemplate.hostName + "\r" +
                        // 	"fqdn : " + this.newVmWithTemplate.hostName + "\r\r";
                        //
                        // if (this.newVmWithTemplate.nics.length > 0) {
                        // 	this.newVmWithTemplate.customScript +=
                        // 		"# BOOT CMD\r" +
                        // 		"bootcmd :\r";
                        // 	for (var i = 0; i < this.newVmWithTemplate.nics.length; i++) {
                        // 		this.newVmWithTemplate.customScript +=
                        // 			" - set -x; echo '#user-data/bootcmd:' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - set -x; sed -i -e '/^BOOTPROTO/ s/dhcp/static/g' -e '/PERSISTENT_DHCLIENT/d' /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - set -x; echo 'IPADDR=" + this.newVmWithTemplate.nics[i].ipAddress + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - set -x; echo 'NETMASK=" + this.newVmWithTemplate.nics[i].netmask + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - set -x; echo 'GATEWAY=" + this.newVmWithTemplate.nics[i].gateway + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - set -x; echo 'DNS1=" + this.newVmWithTemplate.nics[i].dns + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - set -x; echo 'ONBOOT=yes' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - set -x; echo '' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                        // 			" - ifdown eth" + i + "\r" +
                        // 			" - ifup eth" + i + "\r\r";
                        // 	}
                        // }
                        //
                        // this.newVmWithTemplate.customScript +=
                        // 	"# RUN CMD\r" +
                        // 	"runcmd :\r" +
                        // 	"  - systemctl disable NetworkManager\r" +
                        // 	"  - timedatectl set-timezone Asia/Seoul\r" +
                        // 	"  - yum -y install http://resources.ovirt.org/pub/yum-repo/ovirt-release42.rpm\r" +
                        // 	"  - yum -y install epel-release\r" +
                        // 	"  - yum -y install update\r" +
                        // 	"  - yum -y install ovirt-guest-agent-common\r" +
                        // 	"  - yum -y install centos-release-ovirt42\r" +
                        // 	"  - yum -y install net-tools wget collectd\r" +
                        // 	"  - mv /etc/collectd.conf /etc/collectd.conf.backup\r" +
                        // 	"  - touch /etc/collectd.conf\r" +
                        // 	"  - echo 'Hostname    " + this.newVmWithTemplate.hostName + "' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'BaseDir     \"/var/lib/collectd\"' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'PIDFile     \"/var/run/collectd.pid\"' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'PluginDir   \"/usr/lib64/collectd\"' >> /etc/collectd.conf\r" +
                        // 	"  - echo '' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'Interval     60' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'LoadPlugin df' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'LoadPlugin network' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'LoadPlugin processes' >> /etc/collectd.conf\r" +
                        // 	"  - echo '' >> /etc/collectd.conf\r" +
                        // 	"  - echo '<Plugin df>' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'IgnoreSelected true' >> /etc/collectd.conf\r" +
                        // 	"  - echo '</Plugin>' >> /etc/collectd.conf\r" +
                        // 	"  - echo '' >> /etc/collectd.conf\r" +
                        // 	"  - echo '<Plugin network>' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'Server " + this.engineIp + " \"25826\"' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'MaxPacketSize 1452' >> /etc/collectd.conf\r" +
                        // 	"  - echo '</Plugin>' >> /etc/collectd.conf\r" +
                        // 	"  - echo '' >> /etc/collectd.conf\r" +
                        // 	"  - echo '<Plugin processes>' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'CollectFileDescriptor true' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'CollectContextSwitch true' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'CollectMemoryMaps true' >> /etc/collectd.conf\r" +
                        // 	"  - echo '</Plugin>' >> /etc/collectd.conf\r" +
                        // 	"  - echo '' >> /etc/collectd.conf\r" +
                        // 	"  - echo 'Include \"/etc/collectd.d\"' >> /etc/collectd.conf\r" +
                        // 	"  - systemctl enable --now collectd\r" +
                        // 	"  - touch /etc/cloud/cloud-init.disabled\r" +
                        // 	"  - systemctl disable cloud-init cloud-init-local cloud-config cloud-final\r\r" +
                        // 	"# Configure where output will go\r" +
                        // 	"output:\r" +
                        // 	"  all: \">> /var/log/cloud-init.log\"\r" +
                        // 	"final_message: \"The system is finally up, after $UPTIME seconds\"";

                        this.newVmWithTemplate.customScript =
                            "# cloud-config\r\r" +
                            "## meta-data - system config\r" +
                            "users :\r" +
                            " - default\r\r" +
                            "# user\r" +
                            "chpasswd:\r" +
                            "  list: |\r" +
                            "    root:" + this.newVmWithTemplate.password + "\r" +
                            "  expire: False\r" +
                            "ssh_pwauth: True\r\r" +
                            "# Hostname Management\r" +
                            "hostname : " + this.newVmWithTemplate.hostName + "\r" +
                            "fqdn : " + this.newVmWithTemplate.hostName + "\r\r";

                        if (this.newVmWithTemplate.nics.length > 0) {
                            this.newVmWithTemplate.customScript +=
                                "# RUN CMD\r" +
                                "runcmd :\r";
                            for (var i = 0; i < this.newVmWithTemplate.nics.length; i++) {
                                this.newVmWithTemplate.customScript +=
                                    " - set -x; echo '#user-data/bootcmd:' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; sed -i -e '/^BOOTPROTO/ s/dhcp/static/g' -e '/PERSISTENT_DHCLIENT/d' /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; sed -i -e '/^ONBOOT/ s/no/yes/g' -e '/PERSISTENT_DHCLIENT/d' /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; echo 'IPADDR=" + this.newVmWithTemplate.nics[i].ipAddress + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; echo 'NETMASK=" + this.newVmWithTemplate.nics[i].netmask + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; echo 'GATEWAY=" + this.newVmWithTemplate.nics[i].gateway + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; echo 'DNS1=" + this.newVmWithTemplate.nics[i].dns + "' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; echo 'NM_CONTROLLED=no' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r" +
                                    " - set -x; echo '' >> /etc/sysconfig/network-scripts/ifcfg-eth" + i + "\r\r";
                            }
                        }

                        this.newVmWithTemplate.customScript +=
                            " - printf 'hostname  \"%s\"\\n' " + this.newVmWithTemplate.hostName + " > /etc/collectd.conf\r" +
                            " - printf 'BaseDir   \"/var/lib/collectd\"\\n' >> /etc/collectd.conf\r" +
                            " - printf 'PluginDir \"/usr/lib64/collectd\"\\n' >> /etc/collectd.conf\r" +
                            " - printf '\\n' >> /etc/collectd.conf\r" +
                            " - printf 'Interval  60\\n' >> /etc/collectd.conf\r" +
                            " - printf '\\n' >> /etc/collectd.conf\r" +
                            " - printf 'LoadPlugin cpu\\n' >> /etc/collectd.conf\r" +
                            " - printf 'LoadPlugin memory\\n' >> /etc/collectd.conf\r" +
                            " - printf 'LoadPlugin df\\n' >> /etc/collectd.conf\r" +
                            " - printf 'LoadPlugin network\\n' >> /etc/collectd.conf\r" +
                            " - printf 'LoadPlugin processes\\n' >> /etc/collectd.conf\r" +
                            " - printf 'LoadPlugin logfile\\n' >> /etc/collectd.conf\r" +
                            " - printf '\\n' >> /etc/collectd.conf\r" +
                            " - printf '<Plugin cpu>\\n' >> /etc/collectd.conf\r" +
                            " - printf '    ReportByCpu true\\n' >> /etc/collectd.conf\r" +
                            " - printf '    ReportByState true\\n' >> /etc/collectd.conf\r" +
                            " - printf '    ValuesPercentage true\\n' >> /etc/collectd.conf\r" +
                            " - printf '</Plugin>\\n' >> /etc/collectd.conf\r" +
                            " - printf '<Plugin memory>\\n' >> /etc/collectd.conf\r" +
                            " - printf '    ValuesAbsolute true\\n' >> /etc/collectd.conf\r" +
                            " - printf '    ValuesPercentage false\\n' >> /etc/collectd.conf\r" +
                            " - printf '</Plugin>\\n' >> /etc/collectd.conf\r" +
                            " - printf '<Plugin df>\\n' >> /etc/collectd.conf\r" +
                            " - printf '    IgnoreSelected true\\n' >> /etc/collectd.conf\r" +
                            " - printf '</Plugin>\\n' >> /etc/collectd.conf\r" +
                            " - printf '<Plugin network>\\n' >> /etc/collectd.conf\r" +
                            " - printf '    Server \"%s\" \"25826\"\\n' " + this.engineIp + " >> /etc/collectd.conf\r" +
                            " - printf '    MaxPacketSize 1452\\n' >> /etc/collectd.conf\r" +
                            " - printf '</Plugin>\\n' >> /etc/collectd.conf\r" +
                            " - printf '<Plugin processes>\\n' >> /etc/collectd.conf\r" +
                            " - printf '    CollectFileDescriptor true\\n' >> /etc/collectd.conf\r" +
                            " - printf '    CollectContextSwitch true\\n' >> /etc/collectd.conf\r" +
                            " - printf '    CollectMemoryMaps true\\n' >> /etc/collectd.conf\r" +
                            " - printf '</Plugin>\\n' >> /etc/collectd.conf\r" +
                            " - printf '<Plugin logfile>\\n' >> /etc/collectd.conf\r" +
                            " - printf '    LogLevel \"info\"\\n' >> /etc/collectd.conf\r" +
                            " - printf '    File \"/var/log/collectd.log\"\\n' >> /etc/collectd.conf\r" +
                            " - printf '    Timestamp true\\n' >> /etc/collectd.conf\r" +
                            " - printf '</Plugin>\\n' >> /etc/collectd.conf\r" +
                            " - printf '\\n' >> /etc/collectd.conf\r" +
                            " - printf 'Include \"/etc/collectd.d\"\\n' >> /etc/collectd.conf\r" +
                            " - touch /etc/cloud/cloud-init.disabled\r" +
                            " - systemctl start ovirt-guest-agent collectd\r" +
                            " - systemctl enable ovirt-guest-agent collectd\r" +
                            " - systemctl restart network\r";

                        // 스크립트용으로 만든 키 삭제
                        delete this.newVmWithTemplate.nics;

                        // console.log("newVmWithTemplate", this.newVmWithTemplate);

                        this.$http.post('/compute/createVm', this.newVmWithTemplate).then(function (response) {
                            this.cancelCreateVmWithTemplate();
                            this.closeModal("vmWithTemplate");
                        }.bind(this)).catch(function (error) {
                            // console.log(error);
                        });
                    }
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },

        cancelCreateVmWithTemplate: function () {
            this.selectedTemplates = [];
            this.selectedInstanceTypes = [];
            this.newVmWithTemplate = {};
            this.selectedMenu = 'templateListTitle';

            // $(".createvmwithtemplatemodal").modal('hide');
        },

        addNic: function () {
            // this.nics.push([]);
            this.nics.push(JSON.parse(JSON.stringify(this.nic)));
        },
        removeNic: function (index) {
            if (this.nics.length === 0) {

            } else {
                this.nics.splice(this.nics.length - 1, 1);
            }


        },

        // retrieve discs
        retrieveDiscs: function () {
            this.$http.get('/compute/discs').then(function (response) {
                this.discs = response.data.resultKey;
                this.selectVo.selChaDiskVo.list = [];

                if (this.discs.length > 0) {
                    for (let disk of this.discs) {
                        this.selectVo.selChaDiskVo.list.push({name: disk.name, id: disk.id});
                    }
                    this.selectVo.selChaDiskVo.list.unshift({name: "꺼내기", id: "eject"});
                    // this.initData.changeDisk = JSON.parse(JSON.stringify(this.selectVo.selChaDiskVo.list[0]));
                    // this.selectVo.selChaDiskVo.selected = this.initData.changeDisk;
                } else {
                    this.selectVo.selChaDiskVo.list.push({name: "없음", id: "eject"});
                    this.selectVo.selChaDiskVo.selected = {name: "없음", id: "eject"};
                }

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // change disc view
        changeDiscView: function () {
            this.closeBtn();

            // if (this.upVms[0].disc != null) {
            //     this.targetDisc = this.upVms[0].disc;
            //
            //     if (this.discs.length > 0) {
            //         for (let disk of this.discs) {
            //             if (disk.id == this.upVms[0].disc) {
            //                 this.initData.changeDisk = {name: disk.name, id: disk.id};
            //                 break;
            //             }
            //         }
            //         this.selectVo.selChaDiskVo.selected = this.initData.changeDisk;
            //     }
            // } else {
            //     this.selectVo.selChaDiskVo.selected = {name: "꺼내기", id: "eject"};
            //     this.targetDisc = 'eject';
            // }
            if (this.selTargetVm.disc != null) {
                this.targetDisc = this.selTargetVm.disc;

                if (this.discs.length > 0) {
                    for (let disk of this.discs) {
                        if (disk.id == this.selTargetVm.disc) {
                            this.initData.changeDisk = {name: disk.name, id: disk.id};
                            break;
                        }
                    }
                    this.selectVo.selChaDiskVo.selected = this.initData.changeDisk;
                }
            } else {
                this.selectVo.selChaDiskVo.selected = {name: "꺼내기", id: "eject"};
                this.targetDisc = 'eject';
            }

            this.openModal('changeDisk');
        },

        // change disc
        changeDisc: function () {
            // var vm = this.selectedVms[0];
            var vm = this.selTargetVm;
            vm.disc = this.targetDisc;
            this.spinnerOn = true;
            this.$http.post('/compute/changeDisc', vm).then(function (response) {
                this.retrieveVms();

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
            this.closeModal('changeDisk');

        },

        // get engine ip address
        retrieveEngineIp: function () {
            this.$http.get('/compute/retrieveEngineIp').then(function (response) {
                this.engineIp = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // get metrics uri
        retrieveMetricsUri: function () {
            this.$http.get('/compute/vm/metrics/uri').then(function (response) {
                this.metricsUri = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

//		checkAddress: function(address, index) {
//		    var expUrl = /^(1|2)?\d?\d([.](1|2)?\d?\d){3}$/;
//		    
//		    if(!expUrl.test(address)) {
//		    	
//		    }
//		    
//		    return expUrl.test(address);
//		},

        // websocket
        wsConnectionWait: function () {
            setTimeout(function () {
                vmsVue.wsSubscription();
            }, 2000);
        },
        wsSubscription: function () {
            if (wsVue.stompClient != null && wsVue.stompClient.connected) {
                this.subscription = wsVue.stompClient.subscribe('/topic/vms', this.onMessage);
            } else {
                this.wsConnectionWait();
            }
        },
        onMessage: function (response) {
            var vm = JSON.parse(response.body);
            this.spinnerOn = false;
            // console.log("vm", vm);

            if (vm.status == "created") {
                this.$EventBus.$emit('created');
                this.spinnerOn = false;
                var exist = false;
                vm.status = "down";

                for (var i = 0; i < this.vms.length; i++) {
                    if (this.vms[i].id == vm.id) {
                        exist = true;
                        this.vms[i].status = vm.status;
                    }
                }

                if (!exist) {
                    this.vms.push(vm);
                }
                this.retrieveVms();
            } else {
                for (var i = 0; i < this.vms.length; i++) {
                    if (this.vms[i].id == vm.id) {
                        if (vm.status == "removed") {
                            delete this.vms.splice(i, 1);
                            this.spinnerOn = false;
                        } else if (vm.status == "down") {
                            this.vms[i].host = null;
                            this.vms[i].hostId = null;
                            this.vms[i].status = vm.status;
                        } else {
                            this.vms[i].status = vm.status;
                            this.vms[i].nextRunConfigurationExists = vm.nextRunConfigurationExists;
                        }
                    }
                }
                this.retrieveVms();
            }
        },

        // migrate virtual machine jh
        migrateVm: function () {
            var hostId = this.selectedHostId;
            var hostName = '';
            // var vmName = this.selectedVms[0].name;
            // var vmId = this.selectedVms[0].id;
            var vmName = this.selTargetVm.name;
            var vmId = this.selTargetVm.id;

            for (var i = 0; i < this.hostList.length; i++) {
                if (this.hostList[i].hostId == this.selectedHostId) {
                    hostName = this.hostList[i].hostName;
                }
            }

            if (hostId == null || hostId == '') {
                alert('host를 선택해주세요');
            } else {
                // var checked = confirm(vmName + '을 ' + hostName + '으로 이동하시겠습니까?');

                // if (checked) {
                this.closeModal('migrateVm');
                this.$http.get('/symphony/migrateVm?hostId=' + hostId + '&vmId=' + vmId).then(function (response) {
                    // set status
                    if (response.data.resultKey.toLowerCase() == 'migrating') {
                        // $(".hostModal").modal('hide');
                        this.retrieveVms();
                    } else {

                        alert(response.data.resultKey);
                    }
                }.bind(this))
                    .catch(function (error) {
                        // console.log(error);
                    });
                // }
            }
        },
        setViewList: function (viewList) {
            this.pagingVo.viewList = viewList;
        }
    },
    computed: {
        selectAll: {
            get: function () {
                return this.selectedVms ? (this.vms.length > 0) && (this.selectedVms.length == this.vms.length) : false;
            },
            set: function (value) {
                var selected = [];
                var up = [];
                var down = [];
                var pause = [];
                var not_responding = [];

                if (value) {
                    this.vms.forEach(function (vm) {
                        selected.push(vm);

                        if (vm.status === 'up') {
                            up.push(vm);
                        }

                        if (vm.status === 'down') {
                            down.push(vm);
                        }

                        if (vm.status === 'pause') {
                            pause.push(vm);
                        }
                        if (vm.status === 'not_responding') {
                            not_responding.push(vm);
                        }
                    });
                }

                this.selectedVms = selected;
                this.upVms = up;
                this.downVms = down;
                this.pausedVms = pause;
                this.not_respondedVms = not_responding;
            }
        },

        templateListTitleClass: function () {
            return {
                'nav-item': true,
                active: this.selectedMenu == 'templateListTitle' ? true : false
            }
        },

        instanceTypeListTitleClass: function () {
            return {
                'nav-item': true,
                active: this.selectedMenu == 'instanceTypeListTitle' ? true : false
            }
        },

        createVmInfoTitleClass: function () {
            return {
                'nav-item': true,
                active: this.selectedMenu == 'createVmInfoTitle' ? true : false
            }
        },

        templateListClass: function () {
            return {
                'tab-pane fade': true,
                'fade': true,
                'active in': this.selectedMenu == 'templateListTitle' ? true : false
            }
        },

        instanceTypeListClass: function () {
            return {
                'tab-pane fade': true,
                'fade': true,
                'active in': this.selectedMenu == 'instanceTypeListTitle' ? true : false
            }
        },

        createVmInfoClass: function () {
            return {
                'tab-pane fade': true,
                'fade': true,
                'active in': this.selectedMenu == 'createVmInfoTitle' ? true : false
            }
        },
    },
    watch: {
        // selectedVms: function (vm){
        //     this.selectVm(vm);
        // },
        downVms: function () {
            if (this.downVms.length > 0) {
                this.targetVm = this.downVms[0];
            }
        },
        isSubTemplate: function () {
            if (this.isSubTemplate) {
                this.newTemplate.rootTemplateId = this.rootTemplates[0].id;
                this.rootTemplate = this.rootTemplates[0];

                if (this.rootTemplates[0].name.indexOf('.') > -1) {
                    let strArr = JSON.parse(JSON.stringify(this.rootTemplates[0].name.split('.')));
                    this.newTemplate.subVersionName = strArr[0];
                } else {
                    this.newTemplate.subVersionName = this.rootTemplates[0].name;
                }

                this.templateNameStatus = false;
                this.validTemplateName = false;
                this.checkSubTemplateName();
            }
        },
        rootTemplate: function () {
            this.newTemplate.name = this.rootTemplate.name;
        },
        selectedTemplates: function () {
            this.selectVo.selClusterVo.list = [];

            // if (this.selectedTemplatesCluster = undefined ) {
            //     // 선택한 템플릿에 따른 클러스터 정보 넣기 by gtpark
            //     this.selectedTemplatesCluster = this.selectedTemplates.cluster
            //
            //     this.selectVo.selClusterVo.list.push(this.selectedTemplatesCluster);
            //     this.selectVo.selClusterVo.selected = {name:this.selectedTemplatesCluster.name ,id:this.selectedTemplatesCluster.id};
            // } else {
            //     this.selectedTemplatesCluster = {};
            //     this.selectedTemplatesCluster = this.selectedTemplates.cluster
            // }

            this.selectedTemplatesCluster = {};
            this.selectedTemplatesCluster = this.selectedTemplates.cluster


            if (this.selectedTemplatesCluster === undefined) {
                this.selectVo.selClusterVo.selected = {name: "전체", id: "selectAll"};
            } else {
                this.selectVo.selClusterVo.list.push(this.selectedTemplatesCluster);
                this.selectVo.selClusterVo.selected = {
                    name: this.selectedTemplatesCluster.name,
                    id: this.selectedTemplatesCluster.id
                };
            }

        }
    },
    filters: {
        truncate: function (string, limit) {
            var ellipsis;

            if (string != null && string.length > limit) {
                ellipsis = string.substring(0, limit) + '...'
            } else {
                ellipsis = string
            }

            return ellipsis;
        }
    }
})