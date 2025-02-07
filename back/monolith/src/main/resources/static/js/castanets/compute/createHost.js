Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var createHostVue = new Vue({
    router: router,
    el: '#createHostVue',
    data: {
        initData: {
            creCluster: {name: "", id: ""},
        },
        selectVo: {
            selCreClusterVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10001,
                selected: {name: "전체", id: "selectAll"}
            },
            selFenceTypeVo:{
                size: "",
                list: [{name: "ilo4", id: "ilo4"},
                        {name: "drac7", id: "drac7"}],
                index: 10002,
                selected: {name: "ilo4", id: "ilo4"}
            }
        },
        powerManagementEnabled: false,
        spinnerOn: false,
        hostId: '',
        isUpdate: false,
        sshType: 'password',
        defaultNetworkYn: true,
        clusters: [],
        networks: [],
        networkProviders: [],
        host: {
            clusterId: '',
            name: '',
            description: '',
            comment: '',
            status: '',
            networkProviderId: '',
            powerManagementEnabled: false,
            hostEngineEnabled: false,
            ssh: {
                address: '',
                port: '',
                id: 'root',
                password: '',
                publicKey: ''
            },
            fenceAgent: {
                address: '',
                username: '',
                password: '',
                type: 'ilo4',
                option: ''
            },
        },
        fenceAgent: {
            address: '',
            username: '',
            password: '',
            type: 'ilo4',
            option: ''
        },
        returnHost: {},
        validHostName: true,
        hostNameStatus: true,
        validPwd: true,
        pwdStatus: true,
        addressStatus: true,
        step: 0
    },
    mounted: function () {

        // get parameter
        this.$EventBus.$on('hostModal', data => {
            this.spinnerOn = true;

            if(data.type === "create"){
                this.isUpdate = false;
                this.retrieveClusters();
                this.retrieveNetworks();
                this.retrieveNetworkProviders();
            }
            else if(data.type === "update"){
                this.isUpdate = true;
                this.hostId = data.id;
                this.retrieveClusters();
                this.retrieveNetworks();
                this.retrieveNetworkProviders();

            }
        });

    },
    watch: {
        powerManagementEnabled: function () {
            this.host.powerManagementEnabled = this.powerManagementEnabled;
            if(!this.isUpdate){
                this.host.fenceAgent = {address: '', username: '', password: '', type: 'ilo4', option: ''};
            }
        }
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
        openModal:function (type){
          if(type === 'agent'){
              $("#fenceAgentModal").addClass('active');
          }
        },
        closeModal: function (type) {
            if (type === 'host') {
                this.closeBtn();
                $("#hostModal").removeClass('active');
            } else if(type === 'agent'){
                $("#fenceAgentModal").removeClass('active');
            }
        },
        setSelected: function (selectData, index) {
            if (index === 10001) {
                this.host.clusterId = selectData.id;
            } else if(index === 10002){
                this.fenceAgent.type = selectData.id;
            }
        },
        retrieveUpdateHostInfo: function () {
            this.$http.get('/compute/hosts/retrieveCreateHostInfo?id=' + this.hostId).then(function (response) {
                // console.log(response.data.resultKey);
                this.host = response.data.resultKey;

                for(let cluster of this.selectVo.selCreClusterVo.list){
                    if(this.host.clusterId === cluster.id){
                        this.initData.creCluster = {name: cluster.name, id: cluster.id};
                        this.selectVo.selCreClusterVo.selected = this.initData.creCluster;
                        break;
                    }
                }

                this.powerManagementEnabled = this.host.powerManagementEnabled;
                this.validHostName = false;
                this.hostNameStatus = false;
                this.validPwd = false;
                this.pwdStatus = false;
                this.addressStatus = false;
                $("#step0").addClass('active');
                $("#hostModal").addClass("active");
                this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        retrieveClusters: function () {
            this.$http.get('/compute/hosts/retrieveClusters').then(function (response) {
                this.clusters = response.data.resultKey;
                this.selectVo.selCreClusterVo.list = JSON.parse(JSON.stringify(this.clusters));

                if(!this.isUpdate){
                    this.host =   {
                        clusterId: '',
                        name: '',
                        description: '',
                        comment: '',
                        status: '',
                        networkProviderId: '',
                        powerManagementEnabled: false,
                        hostEngineEnabled: false,
                        ssh: {
                            address: '',
                            port: '',
                            id: 'root',
                            password: '',
                            publicKey: ''
                        },
                        fenceAgent: {
                            address: '',
                            username: '',
                            password: '',
                            type: '',
                            option: ''
                        },
                    };

                    this.fenceAgent = {
                            address: '',
                            username: '',
                            password: '',
                            type: 'ilo4',
                            option: ''
                    };

                    this.initData.creCluster = {name: JSON.parse(JSON.stringify(this.clusters[0].name)), id: JSON.parse(JSON.stringify(this.clusters[0].id))};
                    this.selectVo.selCreClusterVo.selected = this.initData.creCluster;

                    this.selectVo.selFenceTypeVo.selected = {name: "ilo4", id: "ilo4"};

                    this.host.clusterId = this.initData.creCluster.id;
                    this.validHostName = true;
                    this.hostNameStatus = true;
                    this.validPwd = true;
                    this.pwdStatus = true;
                    this.addressStatus = true;
                    $("#step0").addClass('active');
                    $("#hostModal").addClass("active");
                    this.spinnerOn = false;
                } else {
                    this.retrieveUpdateHostInfo();
                }


            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        retrieveNetworks: function () {
            this.$http.get('/v2/clusters/networks').then(function (response) {
                this.networks = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        retrieveNetworkProviders: function () {
            this.$http.get('/v2/clusters/etworkProviders').then(function (response) {
                this.networkProviders = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        createHost: function () {

            if (this.host.clusterId == null || this.host.clusterId == "") {
                alert("클러스터를 선택해주세요.");
                return;
            }
            if (this.host.name == null || this.host.name == "") {
                alert("호스트 이름을 입력해주세요.");
                return;
            }
            if (this.host.ssh.address == null || this.host.ssh.address == "") {
                alert("호스트 주소를 입력해주세요.");
                return;
            }
            if (this.host.ssh.port == null || this.host.ssh.port == "") {
                alert("호스트 포트를 입력해주세요.");
                return;
            }
            if (this.host.ssh.password == null || this.host.ssh.password == "") {
                alert("호스트 패스워드를 입력해주세요.");
                return;
            }

            if (this.host.powerManagementEnabled) {
                if (this.host.fenceAgent.address == null || this.host.fenceAgent.address == "") {
                    alert("전원 관리 활성 시 전원관리 주소를 입력해주세요.");
                    return;
                }
                if (this.host.fenceAgent.username == null || this.host.fenceAgent.username == "") {
                    alert("전원 관리 활성 시 전원관리 사용자이름을 입력해주세요.");
                    return;
                }
                if (this.host.fenceAgent.password == null || this.host.fenceAgent.password == "") {
                    alert("전원 관리 활성 시 전원관리 패스워드를 입력해주세요.");
                    return;
                }
            }
            $("#hostModal").removeClass('active');
            this.$http.post('/compute/hosts/createHost', this.host).then(function (response) {
                this.returnHost = response.data.resultKey;
                // location.href = '/compute/hosts';
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
            this.timer = setTimeout(function () {
                this.spinnerOn = true;
            }, 1000);
        },
        updateHost: function () {
            if (this.host.name == null || this.host.name == "") {
                alert("호스트 이름을 입력해주세요.");
                return;
            }

            if (this.host.powerManagementEnabled) {
                if (this.host.fenceAgent.address == null || this.host.fenceAgent.address == "") {
                    alert("전원 관리 활성 시 전원관리 주소를 입력해주세요.");
                    return;
                }
                if (this.host.fenceAgent.username == null || this.host.fenceAgent.username == "") {
                    alert("전원 관리 활성 시 전원관리 사용자이름을 입력해주세요.");
                    return;
                }
                if (this.host.fenceAgent.password == null || this.host.fenceAgent.password == "") {
                    alert("전원 관리 활성 시 전원관리 패스워드를 입력해주세요.");
                    return;
                }
            }

            $("#hostModal").removeClass('active');
            this.$http.post('/compute/hosts/updateHost', this.host).then(function (response) {
                // location.href = '/compute/hosts';

                // this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });

            this.timer = setTimeout(function () {
                this.spinnerOn = true;
            }, 1000);
        },
        viewModalFanceAgent: function () {
            // show modal
            $(".fenceagentmodal").modal('show');
        },
        connectTestFenceAgent: function () {
            this.$http.post('/compute/hosts/connectTestFenceAgent', this.fenceAgent).then(function (response) {
                // console.log(response.data.resultKey);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        addFenceAgent: function () {
            this.host.fenceAgent = this.fenceAgent;
            this.fenceAgent = {
                address: '',
                username: '',
                password: '',
                type: 'ilo4',
                option: ''
            };
            $("#fenceAgentModal").removeClass('active');
            // $(".fenceagentmodal").modal('hide');
//			this.$http.post('/compute/hosts/addFanceAgent', this.host)
//			.then(function(response) {
////				 console.log(response);
//			}.bind(this))
//			.catch(function(error) {
//			     console.log(error);
//			});
        },
        removeFanceAgent: function () {
            this.host.fenceAgent = {
                address: '',
                username: '',
                password: '',
                type: '',
                option: ''
            };
        },
        goList: function () {
            location.href = '/compute/hosts';
        },
        checkHostName: function () {
            if (this.host.name.length >= 4) {
                this.validHostName = false;
            } else {
                this.validHostName = true;
            }
            this.hostNameStatus = this.checkInputName(this.host.name).result;
        },
        checkHostAddress: function (){
            this.addressStatus = this.checkInputName(this.host.name).result;
        },
        checkHostPassword: function () {
            if (this.host.ssh.password.length >= 8) {
                this.validPwd = false;
            } else {
                this.validPwd = true;
            }
            this.pwdStatus = this.checkPassword(this.host.ssh.password).result;

        }
    },
})
