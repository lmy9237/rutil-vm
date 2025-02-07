Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});


var clusterVue = new Vue({
    router: router,
    el: '#createClusterVue',
    data: {
        initData: {
            creNetwork: {name: "", id: ""},
            creCpuArc: {name: "", id: ""},
            creCpuType: {name: "CPU 유형 없음", id: ""},
            creSwitchType: {name: "", id: ""},
            creFireType: {name: "", id: ""},
            creNetProvider: {name: "", id: ""},
        },
        selectVo: {
            selNetworkVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10001,
                selected: {name: "전체", id: "selectAll"}
            },
            selCpuArcVo: {
                size: "",
                list: [{name: "x86_64", id: "x86_64"},
                    // {name: "ppc64", id: "ppc64"},
                    // {name: "s390x", id: "s390x"}
                ],
                index: 10002,
                selected: {name: "x86_64", id: "x86_64"}
            },
            selCpuTypeVo: {
                size: "",
                list: [
                    {name: "CPU 유형 없음", id: ""},
                    {name: "Intel Conroe Family", id: "Intel Conroe Family"},
                    {name: "Intel Penryn Family", id: "Intel Penryn Family"},
                    {name: "Intel Nehalem Family", id: "Intel Nehalem Family"},
                    {name: "Intel Nehalem IBRS Family", id: "Intel Nehalem IBRS Family"},
                    {name: "Intel Westmere Family", id: "Intel Westmere Family"},
                    {name: "Intel Westmere IBRS Family", id: "Intel Westmere IBRS Family"},
                    {name: "Intel SandyBridge Family", id: "Intel SandyBridge Family"},
                    {name: "Intel SandyBridge IBRS Family", id: "Intel SandyBridge IBRS Family"},
                    {name: "Intel Haswell-noTSX Family", id: "Intel Haswell-noTSX Family"},
                    {name: "Intel Haswell-noTSX IBRS Family", id: "Intel Haswell-noTSX IBRS Family"},
                    {name: "Intel Haswell Family", id: "Intel Haswell Family"},
                    {name: "Intel Haswell IBRS Family", id: "Intel Haswell IBRS Family"},
                    {name: "Intel Broadwell-noTSX Family", id: "Intel Broadwell-noTSX Family"},
                    {name: "Intel Broadwell-noTSX IBRS Family", id: "Intel Broadwell-noTSX IBRS Family"},
                    {name: "Intel Broadwell Family", id: "Intel Broadwell Family"},
                    {name: "Intel Broadwell IBRS Family", id: "Intel Broadwell IBRS Family"},
                    {name: "Intel Skylake Client Family", id: "Intel Skylake Client Family"},
                    {name: "Intel Skylake Client IBRS Family", id: "Intel Skylake Client IBRS Family"},
                    {name: "Intel Skylake Client IBRS SSBD Family", id: "Intel Skylake Client IBRS SSBD Family"},
                    {name: "AMD Opteron G1", id: "AMD Opteron G1"},
                    {name: "AMD Opteron G2", id: "AMD Opteron G2"},
                    {name: "AMD Opteron G3", id: "AMD Opteron G3"},
                    {name: "AMD Opteron G4", id: "AMD Opteron G4"},
                    {name: "AMD Opteron G5", id: "AMD Opteron G5"},
                    {name: "IBM POWER8", id: "IBM POWER8"},
                    {name: "IBM POWER9", id: "IBM POWER9"},
                    {name: "IBM z114, z196", id: "IBM z114, z196"},
                    {name: "IBM zBC12, zEC12", id: "IBM zBC12, zEC12"},
                    {name: "IBM z13s, z13", id: "IBM z13s, z13"},
                    {name: "IBM z14", id: "IBM z14"}],
                index: 10003,
                selected: {name: "CPU 유형 없음", id: ""},
            },
            selSwitchTypeVo: {
                size: "",
                list: [{name: "legacy", id: "legacy"}
                    // {name: "ovs", id: "ovs"}
                ],
                index: 10004,
                selected: {name: "legacy", id: "legacy"}
            },
            selFireTypeVo: {
                size: "",
                list: [{name: "firewalld", id: "firewalld"}
                    // {name: "iptables", id: "iptables"}
                    ],
                index: 10005,
                selected: {name: "firewalld", id: "firewalld"}
            },
            selNetProviderVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10006,
                selected: {name: "전체", id: "selectAll"}
            }
        },
        spinnerOn: false,
        clusterId: '',
        clusterName: '',
        isUpdate: false,
        cluster: {
            id: '',
            name: '',
            description: '',
            comment: '',
            networkId: '',
            cpuArchitecture: 'x86_64',
            cpuType: '',
            switchType: 'legacy',
            firewallType: 'firewalld',
            networkProviderId: ''
        },
        clusterNameStatus: false,
        returnCluster: {},
        networks: [],
        networkProviders: [],

    },// end data
    mounted: function () {

        // this.clusterId = this.$route.query.id;
        // if (this.clusterId === undefined) {
        //     this.isUpdate = false;
        // } else {
        //     this.isUpdate = true;
        // }
        //
        // // 관리네트워크 조회
        // this.retrieveNetworks();
        // // 네트워크 공급자 조회
        // this.retrieveNetworkProviders();
        //
        // // 편집화면일 경우 클러스터 정보 조회
        // if (this.isUpdate) {
        //     this.retrieveCreateClusterInfo();
        // }

        // get parameter
        this.$EventBus.$on('clusterModal', data => {
            this.spinnerOn = true;

            if (data.type === "create") {
                this.isUpdate = false;
                this.retrieveNetworks();
                this.retrieveNetworkProviders();
            } else if (data.type === "update") {
                this.isUpdate = true;
                this.clusterId = data.id;
                this.retrieveNetworks();
                this.retrieveNetworkProviders();
                this.retrieveUpdateClusterInfo();
            }
            this.spinnerOn = false;
        });

    },// end mounted
    methods: {
        setSelected: function (selectData, index, listIdx) {
            if (index === 10001) {
                this.cluster.networkId = selectData.id;
            } else if (index === 10002) {
                this.cluster.cpuArchitecture = selectData.id;
            } else if (index === 10003) {
                this.cluster.cpuType = selectData.id;
            } else if (index === 10004) {
                this.cluster.switchType = selectData.id;
            } else if (index === 10005) {
                this.cluster.firewallType = selectData.id;
            } else if (index === 10006) {
                this.cluster.networkProviderId = selectData.id;
            }
        },
        closeModal:function (type){
            if(type === 'cluster'){
                if(!this.isUpdate){
                    this.cluster =  { id: '', name: '', description: '', comment: '', networkId: '', cpuArchitecture: 'x86_64', cpuType: '', switchType: 'legacy', firewallType: 'firewalld', networkProviderId: ''};
                    this.selectVo.selCpuTypeVo.selected = this.initData.creCpuType;

                }
                $("#clusterModal").removeClass('active');
            }
        },
        createCluster: function () {
            if (this.cluster.name == '') {
                alert("클러스터 이름을 입력해주세요.");
                return;
            }
            if (this.cluster.networkId == '') {
                alert("관리 네트워크를 선택해주세요.");
                return;
            }

            // if (confirm('클러스터를 생성하시겠습니까?')) {
            this.$http.post('/v2/clusters/createCluster', this.cluster).then(function (response) {
                this.returnCluster = response.data.resultKey;
                location.href = '/compute/clusters';
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
            // }
        },// end createCluster
        updateCluster: function () {
            if (this.cluster.name == '') {
                alert("클러스터 이름을 입력해주세요.");
                return;
            } else if (this.cluster.networkId == '') {
                alert("관리 네트워크를 선택해주세요.");
                return;
            }

            // if (confirm('클러스터를 편집하시겠습니까?')) {
                this.$http.put('/v2/clusters/'+this.clusterId, this.cluster).then(function (response) {
                    this.returnCluster = response.data.resultKey;
                    location.href = '/compute/clusters';
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            // }
        },// end updateCluster
        retrieveUpdateClusterInfo: function () {
            this.$http.get('/v2/clusters/'+this.clusterId+'/create').then(function (response) {
                this.cluster = response.data.resultKey;
                this.clusterName = this.cluster.name;

                this.selectVo.selCpuTypeVo.selected = this.selectVo.selCpuTypeVo.list.filter((e,i)=>{
                    return this.cluster.cpuType === e.id;
                })[0];

                this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },// end retrieveCreateClusterInfo
        retrieveNetworks: function () {
            this.$http.get('/v2/clusters/networks').then(function (response) {
                this.networks = response.data.resultKey;
                // this.cluster.networkId = this.networks[0].id;

                // selectBox list mapping
                this.selectVo.selNetworkVo.list = [...this.networks];
                this.selectVo.selNetworkVo.selected = this.selectVo.selNetworkVo.list[0];
                this.cluster.networkId = this.selectVo.selNetworkVo.list[0].id;

                $("#step0").addClass('active');
                $("#clusterModal").addClass('active');
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },// end retrieveNetworks

        retrieveNetworkProviders: function () {
            this.$http.get('/v2/clusters/networkProviders').then(function (response) {
                this.networkProviders = response.data.resultKey;
                // 기본값 셋팅
                // this.cluster.networkProviderId = this.networkProviders[0].id;
                // if (!this.isUpdate) {
                //     this.spinnerOn = false;
                // }

                // selectBox list mapping
                this.selectVo.selNetProviderVo.list = [...this.networkProviders];
                // this.selectVo.selNetProviderVo.selected = this.initData.creCluster;
                this.selectVo.selNetProviderVo.selected = this.selectVo.selNetProviderVo.list[0];
                this.cluster.networkProviderId = this.selectVo.selNetProviderVo.list[0].id;

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },// end retrieveNetworkProviders
        goList: function () {
            location.href = '/compute/clusters';
        },// end goList
        checkClusterName: function () {
            this.clusterNameStatus = this.checkInputName(this.cluster.name).result;
        },
    },// end methods
})
