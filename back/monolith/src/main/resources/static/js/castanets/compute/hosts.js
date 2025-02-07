Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var hostsVue = new Vue({
    router: router,
    el: '#hostsVue',
    data: {
        hosts: [],
        sendForm: {id: "", type: ""},
        selectedHosts: [],
        consolidations: [],
        consolidationStopVms: [],
        isNotConsolidateVm: false,
        subscription: {},
        spinnerOn: true,
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        },
        selTargetHost:""
    },// end data
    mounted: function () {
        // get parameter
        this.status = this.$route.query.status == null ? 'all' : this.$route.query.status;

        this.wsSubscription();
        this.retrieveHosts();
        this.timer = setInterval(this.retrieveHosts, 60000 * 5);

    },// end mounted
    methods: {
        wsConnectionWait: function () {
            this.timer = setTimeout(function () {
                hostsVue.wsSubscription();
            }, 2000);
        },
        wsSubscription: function () {
            if (wsVue.stompClient != null && wsVue.stompClient.connected) {
                this.subscription = wsVue.stompClient.subscribe('/topic/hosts/reload', this.onMessage);
            } else {
                this.wsConnectionWait();
            }
        },
        onMessage: function (res) {
            this.spinnerOn = false;
            this.retrieveHosts();
        },
        openModal: function (type) {
            this.closeBtn();
            if (type === 'create') {
                this.sendForm.id = "";
                this.sendForm.type = "create";
                this.$EventBus.$emit('hostModal', this.sendForm);
            } else if (type === 'update') {
                this.sendForm.id = this.selTargetHost.id;
                this.sendForm.type = "update";
                this.$EventBus.$emit('hostModal', this.sendForm);

                // if(type === 'update' && this.selectedHosts.length >0){
                //     this.selectHost(this.selectedHosts[0]);
                // }
            } else if (type === 'delete') {
                $("#deleteHostModal").addClass('active');
            }
        },
        closeModal: function (type) {
            if (type === 'delete') {
                // this.selectHost(this.selectedHosts[0]);
                $("#deleteHostModal").removeClass('active');
            }
        },
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

        retrieveHosts: function (type) {
            if(type === 'update'){
                this.spinnerOn = true;
            }
            this.$http.get('/compute/hosts/retrieveHostsInfo?status=' + this.status).then(function (response) {
                this.hosts = response.data.resultKey;
                // console.log("hosts", this.hosts);
                this.spinnerOn = false;
                this.selectedHosts = [];

            }.bind(this)).catch(function (error) {
                setTimeout(()=>{
                    this.spinnerOn = false;
                },1000);

                // console.log(error);
                if (confirm("호스트 정보를 불러오지 못하였습니다. 다시불러오겠습니까?")) {
                    hostsVue.retrieveHosts();
                }
            });
        },// end retrieveHosts

        totalNicsUsage: function (nicsUsage) {
            var total = 0;
            nicsUsage.forEach(function (nicUsage) {
                total + nicUsage.receiveRatePercent + nicUsage.transmitRatePercent;
            });
            return total;
        },// end totalNicsUsage
        goDetail: function (host) {
            window.location.href = "/compute/host?id=" + host.id;
        },// end goDetail
        goCreateHost: function () {
            window.location.href = "/compute/createHost";
        },// end goCreateHost
        goUpdateHost: function () {
            if (this.selectedHosts.length == 0) {
                alert("편집할 호스트를 선택해주세요.");
                return;
            } else if (this.selectedHosts.length != 1) {
                alert("편집할 호스트를 1개만 선택해주세요.");
                return;
            }
            window.location.href = "/compute/updateHost?id=" + this.selectedHosts[0].id;
        },// end goUpdateHost
        removeHost: function () {
            // if (this.selectedHosts.length == 0) {
            //     alert("삭제할 호스트를 선택해주세요.");
            //     return;
            // } else if (this.selectedHosts.length != 1) {
            //     alert("삭제할 호스트를 1개만 선택해주세요.");
            //     return;
            // }
            this.spinnerOn = true;
            $("#deleteHostModal").removeClass('active');
            this.closeBtn();
            // this.$http.post('/compute/hosts/removeHost', this.getSelectedHostIds()).then(function (response) {
            this.$http.post('/compute/hosts/removeHost', [this.selTargetHost.id]).then(function (response) {

                this.timer = setTimeout(() =>  {
                    this.retrieveHosts();
                }, 1000);
//					setTimeout(() => {this.retrieveHosts();}, 1000);

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });

        },// end removeHost
        // relocate virtual machines
        relocateVms: function () {
            // hide modal
            $(".consolidateModal").modal('hide');

            this.$http.post('/karajan/relocateVms', this.consolidations).then(function (response) {
                //@ignore
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },// end relocateVms
        maintenanceStart: function () {
            // if (this.selectedHosts.length == 0) {
            //     alert("유지보수 모드로 전환할 호스트를 선택해주세요.");
            //     return;
            // } else if (this.selectedHosts.length != 1) {
            //     alert("유지보수 모드로 전환할 호스트를 1개만 선택해주세요.");
            //     return;
            // }
            // if (this.selectedHosts[0].vmsCnt > 0) {
            if (this.selTargetHost.vmsCnt > 0) {
                // if (confirm(this.selectedHosts[0].name + " 에 가상머신이 " + this.selectedHosts[0].vmsCnt + "개가 존재합니다.\n유지보수 모드로 전환하시려면 재배치가 먼저 필요합니다.\n재배치 하시겠습니까?")) {
                if (confirm(this.selTargetHost.name + " 에 가상머신이 " + this.selTargetHost.vmsCnt + "개가 존재합니다.\n유지보수 모드로 전환하시려면 재배치가 먼저 필요합니다.\n재배치 하시겠습니까?")) {
                    this.consolidationStopVms = [];
                    this.closeBtn();
                    // this.$http.post('/compute/hosts/consolidateVms', this.getSelectedHostIds()).then(function (response) {
                    this.$http.post('/compute/hosts/consolidateVms', [this.selTargetHost.id]).then(function (response) {
                        this.consolidations = response.data.resultKey;
                        if (this.consolidations.length > 0) {
                            for (var i = 0; i < this.consolidations.length; i++) {
//								 console.log("this.consolidations[i].hostName", this.consolidations[i].hostName);
                                if (this.consolidations[i].hostName == null) {
                                    this.isNotConsolidateVm = true;
                                    var vm = {id: ''};
                                    vm.id = this.consolidations[i].vmId;
                                    this.consolidationStopVms.push(vm);
                                }
                            }

                            // show modal
                            $(".consolidateModal").modal('show');
                        } else {
                            alert('재배치 할 가상머신이 없습니다.');
//							this.maintenanceStart();
                        }
//						 console.log("this.consolidationStopVms", this.consolidationStopVms);
                    }.bind(this)).catch(function (error) {
                        // console.log(error);
                    });
                } else {
                    alert("가상머신을 재배치 후 실행하시기 바랍니다.");
                }
//				alert(this.selectedHosts[0].name + " 에 가상머신이 " + this.selectedHosts[0].vmsCnt + "개가 존재합니다.");
            } else {
                // if (confirm('호스트를 유지보수 모드로 전환하시겠습니까?\n' + this.selectedHosts[0].name)) {
                if (confirm('호스트를 유지보수 모드로 전환하시겠습니까?\n' + this.selTargetHost.name)) {
                    this.closeBtn();
                    // this.$http.post('/compute/hosts/maintenanceStart', this.getSelectedHostIds()).then(function (response) {
                    this.$http.post('/compute/hosts/maintenanceStart', [this.selTargetHost.id]).then(function (response) {
                        this.spinnerOn = true;
                        this.retrieveHosts();
                    }.bind(this)).catch(function (error) {
                        // console.log(error);
                    });
                }
            }
        },// end maintenanceStart
        maintenanceStop: function () {
            // if (this.selectedHosts.length == 0) {
            //     alert("유지보수 모드로 해제하여 활성화할 호스트를 선택해주세요.");
            //     return;
            // } else if (this.selectedHosts.length != 1) {
            //     alert("유지보수 모드로 해제하여 활성화할 호스트를 1개만 선택해주세요.");
            //     return;
            // }

            // if (confirm('호스트의 유지보수 모드를 해제하여 활성화 하시겠습니까?\n' + this.selectedHosts[0].name)) {
            if (confirm('호스트의 유지보수 모드를 해제하여 활성화 하시겠습니까?\n' + this.selTargetHost.name)) {
                this.closeBtn();
                this.$http.post('/compute/hosts/maintenanceStop', [this.selTargetHost.id]).then(function (response) {
                    this.spinnerOn = true;
                    this.retrieveHosts();
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },// end maintenanceStop
        restartHost: function () {
//			 console.log(this.selectedHosts[0].powerManagementEnabled);
            if (!this.isPowerManagementEnabled()) {
                alert("전원관리를 활성화 해주세요.");
                return;
            }

            if (this.selectedHosts.length == 0) {
                alert("재시작 할 호스트를 선택해주세요.");
                return;
            } else if (this.selectedHosts.length != 1) {
                alert("재시작할 호스트를 1개만 선택해주세요.");
                return;
            }

            if (confirm('호스트를 재시작 하시겠습니까?\n' + this.selectedHosts[0].name)) {
                this.$http.post('/compute/hosts/restartHost', this.getSelectedHostIds()).then(function (response) {
                    this.spinnerOn = true;
                    this.retrieveHosts();
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },// end restartHost
        startHost: function () {
//			 console.log(this.selectedHosts[0].powerManagementEnabled);
            if (!this.isPowerManagementEnabled()) {
                alert("전원관리를 활성화 해주세요.");
                return;
            }

            if (this.selectedHosts.length == 0) {
                alert("시작 시킬 호스트를 선택해주세요.");
                return;
            } else if (this.selectedHosts.length != 1) {
                alert("시작 시킬 호스트를 1개만 선택해주세요.");
                return;
            }

            if (confirm('호스트를 시작 시키겠습니까?\n' + this.selectedHosts[0].name)) {
                this.$http.post('/compute/hosts/startHost', this.getSelectedHostIds()).then(function (response) {
                    this.spinnerOn = true;
                    this.retrieveHosts();
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },// end startHost
        stopHost: function () {
//			 console.log(this.selectedHosts[0].powerManagementEnabled);
            if (!this.isPowerManagementEnabled()) {
                alert("전원관리를 활성화 해주세요.");
                return;
            }

            if (this.selectedHosts.length == 0) {
                alert("중지 시킬 호스트를 선택해주세요.");
                return;
            } else if (this.selectedHosts.length != 1) {
                alert("중지 시킬 호스트를 1개만 선택해주세요.");
                return;
            }

            if (confirm('호스트를 중지 시키겠습니까?\n' + this.selectedHosts[0].name)) {
                this.$http.post('/compute/hosts/stopHost', this.getSelectedHostIds()).then(function (response) {
                    this.spinnerOn = true;
                    this.retrieveHosts();
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            }
        },// end stopHost
        goHostConsole: function () {
            // if (this.selectedHosts.length == 0) {
            //     alert("호스트를 선택해주세요.");
            //     return;
            // } else if (this.selectedHosts.length != 1) {
            //     alert("호스트를 1개만 선택해주세요.");
            //     return;
            // }

            window.open("https://" + this.selTargetHost.address + ":9090");
        },
        getSelectedHostIds: function () {
            var selectedHostIds = [];
            for (var i = 0; i < this.selectedHosts.length; i++) {
                selectedHostIds.push(this.selectedHosts[i].id);
            }
            return selectedHostIds;
        },// end selectCluster
        isPowerManagementEnabled: function () {
            if (this.selectedHosts.length == 1 && this.selectedHosts[0].powerManagementEnabled === true) {
                return true;
            }
            return false;
        },// end isPowerManagementEnabled
//		'up'
//		'connecting'
//		'down'
//		'error'
//		'initializing'
//		'install_failed'
//		'installing'
//		'installing_os'
//		'maintenance'
//		'preparing_for_maintenance'
//		'non_operational'
//		'non_responsive'
//		'unassigned'
//		'reboot'
//		'kdumping'
//		'pending_approval'
        isPosibleActive: function () {
            if (this.selectedHosts.length == 1) {
                var status = this.selectedHosts[0].status;
                if (status == 'maintenance') {
                    return true;
                }
            }
            return false;
        },// end isPosibleActive
        isPosibleMaintenance: function () {
            if (this.selectedHosts.length == 1) {
                var status = this.selectedHosts[0].status;
                if (status == 'up' || status == 'install_failed' || status == 'non_operational' || status == 'non_responsive') {
                    return true;
                }
            }
            return false;
        },// end isPosibleMaintenance
        isPosibleDelete: function () {
            if (this.selectedHosts.length == 1) {
                var status = this.selectedHosts[0].status;
                if (status == 'maintenance' || status == 'install_failed' || status == 'non_operational' || status == 'non_responsive') {
                    return true;
                }
            }
            return false;
        },// end isPosibleDelete
        isPosibleRestart: function () {
            if (this.selectedHosts.length == 1) {
                var status = this.selectedHosts[0].status;
                if (status == 'up') {
                    return true;
                }
            }
            return false;
        },// end isPosibleDelete
        isPosibleStart: function () {
            if (this.selectedHosts.length == 1) {
                var status = this.selectedHosts[0].status;
                if (status == 'down') {
                    return true;
                }
            }
            return false;
        },// end isPosibleDelete
        isPosibleStop: function () {
            if (this.selectedHosts.length == 1) {
                var status = this.selectedHosts[0].status;
                if (status == 'up') {
                    return true;
                }
            }
            return false;
        },// end isPosibleDelete
        targetHostFun:function (host){
            this.selTargetHost = host;

        },
        selectHost: function (host) {
            var index = this.selectedHosts.indexOf(host);

            if (index != -1) {
                this.selectedHosts.splice(index, 1);
            } else {
                this.selectedHosts.push(host);
            }
        },// end selectHost
        setViewList: function(viewList) {
            this.pagingVo.viewList = viewList;
        }
    },// end method
    computed: {
        selectAll: {
            get: function () {
                return this.selectedHosts ? this.selectedHosts.length == this.hosts.length : false;
            },
            set: function (value) {
                var selected = [];

                if (value) {
                    this.hosts.forEach(function (host) {
                        selected.push(host);
                    });
                }

                this.selectedHosts = selected;
            }
        }
    },// end computed
})
