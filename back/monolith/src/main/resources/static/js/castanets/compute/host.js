Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history'
});

var hostVue = new Vue({
    router: router,
    el: '#hostVue',

    data: {
        initData: {
            creNetwork: {name: "", id: ""}
        },
        selectVo: {
            selNetworkVo: {
                size: "",
                list: [{name: "", id: ""}],
                index: 10000,
                selected: {name: "비어있음", id: "none"}
            },
            selBondingVo: {
                size: "",
                list: [{name: "(Mode 0) Round-robin", id: "Round-robin"},
                    {name: "(Mode 1) Active-Backup", id: "Active-Backup"},
                    {name: "(Mode 2) Load balance(balance-xor)", id: "Load balance(balance-xor)"},
                    {name: "(Mode 3) Broadcast", id: "Broadcast"},
                    {name: "(Mode 4) Dynamic link aggregation (802.3ad)", id: "Dynamic link aggregation (802.3ad)"},
                    {name: "(Mode 5) Adaptive transmit load balancing", id: "Adaptive transmit load balancing"},
                    {name: "(Mode 6) Adaptive load balancing", id: "Adaptive load balancing"},
                    {name: "사용자 정의 모드", id: "사용자 정의 모드"}],
                index: 10001,
                selected: {
                    name: "(Mode 4) Dynamic link aggregation (802.3ad)",
                    id: "Dynamic link aggregation (802.3ad)"
                }
            }
        },
        tabNum: 1,
        //네트워크가 필수인지 아닌지 판별(true이면 필수, false이면 필수 아님)
        requiredFlag: false,
        //	할당된 네트워크에 올라가 있는 가상머신이 하나라도 돌아가고 있는지 아닌지 판별(하나라도 up되어 있으면 true, 다 꺼져 있으면 false)
        usingVmNetwork: false,
        //네트워크를 미할당에서 -> 할당으로 옮길 때 호스트 네트워크에 vlan이 있는지 판별
        vlanFlag: false,
        //네트워크를 미할당에서 -> 할당으로 옮길 때 호스트 네트워크에 논리네트워크가 있는지 판별
        logicalNetFlag: false,
        //네트워크를 미할당에서 -> 할당으로 옮길 때 호스트 네트워크가 논리네트워크인지 vlan인지 판별
        checkNetState: false,
        //본딩에 슬레이브를 추가할 때 판별
        insertSlave: false,
        checkDns: false,
        netIdx: '',
        nicExNetExist: false,
        netAttachmentStatus: '',
        exSendNetAttachment: {

            hostNicName: '',
            hostNicId: '',
            netHostName: '',
            netHostId: '',
            nicNetworkName: '',
            nicNetworkId: 'none',
            bootProtocol: 'none',
            nicAddress: '',
            nicGateway: '',
            nicNetmask: '',
            dnsServer: [''],
            vlanNetworkList: []
        },

        sendNetAttachment: {

            hostNicName: '',
            hostNicId: '',
            netHostName: '',
            netHostId: '',
            nicNetworkName: '',
            nicNetworkId: 'none',
            bootProtocol: 'none',
            nicAddress: '',
            nicGateway: '',
            nicNetmask: '',
            dnsServer: [''],
            vlanNetworkList: []

        },

        data: {activetab: 1},
        bondingNetID: '',
        bondingVlanNetID: [],
        tempNicID: '',
        tempDeleteBonding: [],
        resetUsingNetwork: [],
        resetUnUsingNetwork: [],
        vlanNetworkList: [],
        usingNetList: [],
        unUsingNetList: [],
        usingNetwork: {},
        hostId: '',
        bondingModeName: "",
        makeNicBonding: {
            bondingMode: '',
            bondingModeName: 'Dynamic link aggregation (802.3ad)',
            bondingName: 'bond1',
            bondingCustomizing: '',
        },

        bonding: [],
        opened: [],
        host: {
            hostSw: {},
            hostNicsUsageApi: {},
        },

        hostNicsModifyBonding: [],
        exHostNicsModifyBonding: [],
        sendHostNicsModifyBonding: [],
        tempHostNic: [],

        tempbondingHost: {
            bonding: [],
            dataCurrentRx: '',
            dataCurrentRxBps: '',
            dataCurrentTx: '',
            dataCurrentTxBps: '',
            dataTotalRx: '',
            dataTotalTx: '',
            id: '',
            ipAddress: '',
            macAddress: '',
            name: '',
            networkId: '',
            networkName: '',
            bondingMode: '',
            bondingModeName: '',
            status: '',
            hostId: ''
        },

        newbonding: {
            bonding: [],
            dataCurrentRx: '',
            dataCurrentRxBps: '',
            dataCurrentTx: '',
            dataCurrentTxBps: '',
            dataTotalRx: '',
            dataTotalTx: '',
            id: '',
            ipAddress: '',
            macAddress: '',
            name: '',
            networkId: '',
            networkName: '',
            bondingMode: '',
            bondingModeName: '',
            status: '',
            hostId: '',
            base: '',
            nicExNetExist: false,
            vlanNetworkList: []
        },

        events: [],
        chartData: {
            memoryTotal: 0,
            memoryFree: 0,
            memoryUsed: 0,
            cpuIdleUsagePercent: 0,
            cpuUsagePercent: 0,
            cpuUsage: [0, 0],
            memoryUsage: [0, 0]
        },
        lastUpdated: '',
        pageNumber: 0,
        selectedNumber: 'btn btn-success btn-sm',
        unSelectedNumber: 'btn btn-default btn-sm',
        spinnerOn: true,
        pagingVo: {
            viewListVm: [],
            viewListEvent: []
        }
    },
    props: {
        size: {
            type: Number,
            required: false,
            default: 10
        }
    },
    mounted: function () {

//		 console.log(moment.locale());         // ko
//		 console.log(moment().format('LT'));   // 오후 7:28

        // get parameter
        this.hostId = this.$route.query.id;
//		 console.log('clusterDetail param id' +  this.$route.query.id);
        this.retrieveHostDetail();
        this.retrieveHostEvents();
        // this.timer = setInterval(this.retrieveHostDetail, 60000);
        this.timer = setInterval(this.retrieveHostDetail, 600000);
        // this.getNetworkList();
    },

    methods: {
        resetBtnCss: function () {
            let btnCssList = document.getElementsByClassName('ui-tab');


            btnCssList[1].classList.remove('ui-state-active');
            btnCssList[1].classList.remove('ui-tabs-active');

            btnCssList[0].classList.add('ui-tabs-active');
            btnCssList[0].classList.add('ui-state-active');


        },
        tabClick: function (num) {
            if (num === 1) {
                this.tabNum = 1;
            } else {
                this.tabNum = 2;
            }
        },
        setSelected: function (selectData, index) {
            if (index === 10000) {
                this.sendNetAttachment.nicNetworkId = selectData.id;
                this.checkNicNetwork();
            } else if (index === 10001) {
                this.bondingModeName = selectData.name;
                this.makeNicBonding.bondingModeName = selectData.id;
            }
        },

        openModal: function (type) {
            if (type === "assignedNetwork") {
                this.checkNicNetwork();
                $("#assignedNetworkModal").addClass("active");
            } else if (type === "hostNetwork") {
                $("#setupHostNetworkModal").addClass("active");
            } else if (type === "bonding") {
                $("#bondingCreateModal").addClass("active");
            }
        },

        closeModal: function (type) {
            if (type === "assignedNetwork") {
                this.sendNetAttachment = {
                    hostNicName: '',
                    hostNicId: '',
                    netHostName: '',
                    netHostId: '',
                    nicNetworkName: '',
                    nicNetworkId: 'none',
                    bootProtocol: 'none',
                    nicAddress: '',
                    nicGateway: '',
                    nicNetmask: '',
                    dnsServer: ['']
                };
                this.tabNum = 1;
                this.checkDns = false;
                this.selectVo.selNetworkVo.selected = this.initData.creNetwork;
                this.resetBtnCss();
                $("#assignedNetworkModal").removeClass("active");
                // this.selectVo.selProfileVo.selected = this.initData.profile;
            } else if (type === "hostNetwork") {
                this.resetHostNic();
                $("#setupHostNetworkModal").removeClass("active");
            } else if (type === "bonding") {
                $("#bondingCreateModal").removeClass("active");
            }

        },

        checkNicNetwork: function () {
            this.netIdx = '';
            this.checkDns = false;

            if (this.sendNetAttachment.nicNetworkId != 'none') {

                for (var netAttachmentIdx in this.host.netAttachment) {

                    if (this.sendNetAttachment.nicNetworkId == this.host.netAttachment[netAttachmentIdx].nicNetworkId) {

                        this.netIdx = netAttachmentIdx;
                        if (this.host.netAttachment[netAttachmentIdx].dnsServer == null) {
                            this.host.netAttachment[netAttachmentIdx].dnsServer = this.sendNetAttachment.dnsServer;
                        }
                        this.exSendNetAttachment = JSON.parse(JSON.stringify(this.host.netAttachment[netAttachmentIdx]));
                        this.sendNetAttachment = JSON.parse(JSON.stringify(this.host.netAttachment[netAttachmentIdx]));

                        break;
                    }
                }
            }

        },

        cancelNicNetwork: function () {

            $(".modifynetworkmodel").modal('hide');

            this.sendNetAttachment = {

                hostNicName: '',
                hostNicId: '',
                netHostName: '',
                netHostId: '',
                nicNetworkName: '',
                nicNetworkId: 'name',
                bootProtocol: 'none',
                nicAddress: '',
                nicGateway: '',
                nicNetmask: '',
                dnsServer: ['']

            };

            this.checkDns = false;

        },

        addDns: function () {
            if (this.sendNetAttachment.dnsServer.length < 2) {
                this.sendNetAttachment.dnsServer.push("");

            }
        },

        removeDns: function (dnsIdx) {
            if (this.sendNetAttachment.dnsServer.length > 1) {
                this.sendNetAttachment.dnsServer.splice(dnsIdx, 1)
            }

        },

        modifyNicNetwork: function () {

            // if(this.exSendNetAttachment == this.sendNetAttachment){
            // 	alert("변경사항이 없습니다.");
            //
            // }

            if (this.exSendNetAttachment.bootProtocol == this.sendNetAttachment.bootProtocol && this.exSendNetAttachment.nicAddress == this.sendNetAttachment.nicAddress
                && this.exSendNetAttachment.nicNetmask == this.sendNetAttachment.nicNetmask && this.exSendNetAttachment.nicGateway == this.sendNetAttachment.nicGateway &&
                this.exSendNetAttachment.dnsServer == this.sendNetAttachment.dnsServer) {

                alert("변경사항이 없습니다.");

            } else if (this.exSendNetAttachment.bootProtocol != this.sendNetAttachment.bootProtocol || this.exSendNetAttachment.nicAddress != this.sendNetAttachment.nicAddress
                || this.exSendNetAttachment.nicNetmask != this.sendNetAttachment.nicNetmask || this.exSendNetAttachment.nicGateway != this.sendNetAttachment.nicGateway ||
                this.exSendNetAttachment.dnsServer != this.sendNetAttachment.dnsServer) {

                if (this.netAttachmentStatus == "ok") {
                    let sendNetAttach = {...this.sendNetAttachment};

                    this.closeModal("assignedNetwork");
                    this.netAttachmentStatus = '';
                    this.spinnerOn = true;
                    this.$http.post('/compute/hosts/modifyNicNetwork', sendNetAttach).then(function (response) {
                        // console.log(response.data.resultKey);

                        this.retrieveHostDetail();
                    }.bind(this)).catch((error) => {
                        let message = {};
                        message.body = JSON.stringify({style: "error", text: "네트워크가 현재 사용중입니다."});
                        this.$EventBus.$emit('message', message);
                        this.spinnerOn = false;

                        // console.log(error);
                    });

                } else {
                    if (this.sendNetAttachment.bootProtocol == "static") {
                        if (this.checkModifyNicNetwork(this.sendNetAttachment.nicAddress) == true) {
                            if (this.checkModifyNicNetwork(this.sendNetAttachment.nicNetmask) == true) {
                                if (this.checkModifyNicNetwork(this.sendNetAttachment.nicGateway) == true) {

                                    this.netAttachmentStatus = "ok";
                                    this.modifyNicNetwork();
                                } else if (this.checkModifyNicNetwork(this.sendNetAttachment.nicGateway) == false) {
                                    alert("올바른 게이트웨이를 입력해 주세요!!");
                                }
                            } else if (this.checkModifyNicNetwork(this.sendNetAttachment.nicNetmask) == false) {
                                alert("올바른 넷마스크를 입력해 주세요!!");
                            }
                        } else if (this.checkModifyNicNetwork() == false) {

                            alert("올바른 IP주소를 입력해 주세요!!");
                        }
                    } else {

                        this.netAttachmentStatus = "ok";
                        this.modifyNicNetwork();
                    }

                }

            }
        },

        checkModifyNicNetwork: function (check) {
            var regExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            return regExp.test(check);
        },

        addIMage: function (index) {

            alert("addImage: " + index);

            $('#myModal .save').click(function (e) {
                e.preventDefault();
                addImage(5);
                $('#myModal').modal('hide');
                //$(this).tab('show')
                return false;

            });
        },

        deleteSlave: function (deleteSlaveId, slaveList) {

            slaveList.forEach(slave => {
                if (slave.id == deleteSlaveId) {
                    this.hostNicsModifyBonding.push(slave);
                    slaveList.splice(slaveList.indexOf(slave), 1);
                }
            })

            // for(var slave of slaveList){
            // 	if(slave.id == deleteSlaveId){
            // 		this.hostNicsModifyBonding.push(slave);
            // 		slaveList.splice(slaveList.indexOf(slave),1);
            // 	}
            // }
        },

        retrieveNetwork: function () {

            //retrieve network info
            var self = this;
            self.usingNetList = [];
            self.unUsingNetList = [];

            this.$http.post('/network/getNetworkList', null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    // console.log('network', response.data.list)

                    hostVue.hostNicsModifyBonding.forEach(hostNic => {
                        if (hostNic.networkId != null) {
                            for (var NetworkIdx in response.data.list) {
                                if (hostNic.networkId == response.data.list[NetworkIdx].id) {
                                    self.usingNetList.push(JSON.parse(JSON.stringify(response.data.list[NetworkIdx])));
                                    response.data.list.splice(NetworkIdx, 1);
                                    break;
                                }
                            }
                        }
                    })

                    // for(var hostNic of hostVue.hostNicsModifyBonding){
                    // 	if(hostNic.networkId != null){
                    // 		for(var NetworkIdx in response.data.list){
                    // 			// if(hostNic.networkId == Network.id){
                    // 			if(hostNic.networkId == response.data.list[NetworkIdx].id){
                    // 				self.usingNetList.push(JSON.parse(JSON.stringify(response.data.list[NetworkIdx])));
                    // 				response.data.list.splice(NetworkIdx, 1);
                    // 				break;
                    // 			}
                    // 		}
                    // 	}
                    // }

                    response.data.list.forEach(unUsingNetwork => {
                        self.unUsingNetList.push(JSON.parse(JSON.stringify(unUsingNetwork)))
                    })

                    // for(var unUsingNetwork of response.data.list){
                    // 	self.unUsingNetList.push(JSON.parse(JSON.stringify(unUsingNetwork)));
                    // }
                })
                .catch(function (error) {
                    // console.log(error);
                })

            // console.log("usingNetwork", self.usingNetList);
            // console.log("unUsingNetwork",self.unUsingNetList);

        },

        resetHostNic: function () {
            this.exHostNicsModifyBonding = [];
            this.hostNicsModifyBonding = [];
            this.usingNetList = this.resetUsingNetwork;
            this.unUsingNetList = this.resetUnUsingNetwork;

            this.makeNicBonding = {
                bondingMode: '',
                bondingModeName: 'Dynamic link aggregation (802.3ad)',
                bondingName: 'bond1',
                bondingCustomizing: '',
            },

                this.newbonding = {
                    bonding: [],
                    dataCurrentRx: '',
                    dataCurrentRxBps: '',
                    dataCurrentTx: '',
                    dataCurrentTxBps: '',
                    dataTotalRx: '',
                    dataTotalTx: '',
                    id: '',
                    ipAddress: '',
                    macAddress: '',
                    name: '',
                    networkId: '',
                    bondingMode: '',
                    bondingModeName: '',
                    status: '',
                    base: '',
                    vlanNetworkList: []
                },

                this.tempbondingHost = {
                    bonding: [],
                    dataCurrentRx: '',
                    dataCurrentRxBps: '',
                    dataCurrentTx: '',
                    dataCurrentTxBps: '',
                    dataTotalRx: '',
                    dataTotalTx: '',
                    id: '',
                    ipAddress: '',
                    macAddress: '',
                    name: '',
                    networkId: '',
                    networkName: '',
                    bondingMode: '',
                    bondingModeName: '',
                    status: '',
                    hostId: ''
                },

                this.sendNetAttachment = {
                    hostNicName: '',
                    hostNicId: '',
                    netHostName: '',
                    netHostId: '',
                    nicNetworkName: '',
                    nicNetworkId: 'none',
                    bootProtocol: 'none',
                    nicAddress: '',
                    nicGateway: '',
                    nicNetmask: '',
                    dnsServer: ['']
                },

                this.host.hostNicsUsageApi.forEach(tempNicBonding => {
                    this.hostNicsModifyBonding.push(JSON.parse(JSON.stringify(tempNicBonding)));
                    this.exHostNicsModifyBonding.push(JSON.parse(JSON.stringify(tempNicBonding)));
                })
        },

        nicStartDrag: (evt, guest) => {
            hostVue.vlanNetworkList = [];

            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            //nicID
            evt.dataTransfer.setData('guestID', guest.id);

            // guest host쪽에 vlan이 있을 경우
            hostVue.hostNicsModifyBonding.forEach(hostNic => {
                if (guest.name === hostNic.base) {
                    //vlan networkIDList
                    if (hostNic.vlanNetworkList) {
                        hostVue.vlanNetworkList.push(hostNic.vlanNetworkList[0]);
                    }
                    //networkID
                    else if (guest.networkId) {
                        evt.dataTransfer.setData('guestNetID', guest.networkId);
                    }
                }
            })
            //vlan networkIDList 정의
            evt.dataTransfer.setData('vlanNetList', hostVue.vlanNetworkList);

        },

        nicOnDrop(evt, bondingHost) {
            if (!evt.dataTransfer.getData('netID') || evt.dataTransfer.getData('netID') == null) {
                if (bondingHost.id != evt.dataTransfer.getData('guestID')) {
                    //기존에 본딩이 된 곳에 인터페이스를 추가하는 경우.
                    if (bondingHost.bonding != null) {

                        const nicID = evt.dataTransfer.getData('guestID')
                        this.hostNicsModifyBonding.forEach(hostNic => {
                            if (hostNic.id == nicID) {

                                hostNic.insertSlave = true;
                                bondingHost.bonding.push(hostNic);
                                this.hostNicsModifyBonding.splice(this.hostNicsModifyBonding.indexOf(hostNic), 1);
                            }
                        })
                    }

                    //새롭게 본딩을 만드는 경우
                    else if (bondingHost.bonding == null) {
                        this.newbonding.name = null;
                        //tempNicID는 나중에 본딩 할때 hostNicsModifyBonding에서 비교하여 네트워크 인터페이스를 빼줄 때 사용
                        this.tempNicID = '';
                        //본딩할 때 논리 네트워크 아이디
                        this.bondingNetID = '';
                        //본딩할 때 vlan network 리스트 담고 있음
                        this.bondingVlanNetID = [];

                        //본딩 호스트쪽이 vlan이 있을 경우
                        hostVue.hostNicsModifyBonding.forEach(hostNic => {
                            if (bondingHost.name === hostNic.base) {
                                //vlan networkIDList
                                if (hostNic.vlanNetworkList) {
                                    hostVue.vlanNetworkList.push(hostNic.vlanNetworkList[0]);
                                }
                                //networkID
                                else if (bondingHost.networkId) {
                                    evt.dataTransfer.setData('guestNetID', bondingHost.networkId);
                                }
                            }
                        })

                        this.bondingVlanNetID = hostVue.vlanNetworkList;

                        // if(evt.dataTransfer.getData('vlanNetList') !== ""){
                        // 	var tempVlan = evt.dataTransfer.getData('vlanNetList');
                        // 	var tempVlanArray = tempVlan.split(',')
                        //
                        // 	tempVlanArray.forEach( vlanNetwork =>{
                        // 		this.bondingVlanNetID.push(vlanNetwork)
                        // 	})
                        // }

                        //새롭게 본딩을 만들 때 이전 인터페이스에 네트워크가 할당 되어있지 않을 때
                        if ((this.newbonding.name == null || this.newbonding.name == "")
                            && (evt.dataTransfer.getData('guestNetID') == "" && bondingHost.networkId == null && this.bondingVlanNetID.length === 0)) {

                            this.tempNicID = evt.dataTransfer.getData('guestID');
                            this.bondingModal(bondingHost);
                        }

                        //새롭게 본딩을 만들 때 두 개의 인터페이스 중 하나라도 논리 네트워크가 할당되어 있을 때
                        else if ((this.newbonding.name == null || this.newbonding.name === "")
                            && ((evt.dataTransfer.getData('guestNetID') !== "" && bondingHost.networkId === null && this.bondingVlanNetID.length === 0)
                                || (evt.dataTransfer.getData('guestNetID') === "" && bondingHost.networkId !== null && this.bondingVlanNetID.length === 0))) {

                            this.tempNicID = evt.dataTransfer.getData('guestID');

                            if (bondingHost.networkId === null
                                || bondingHost.networkId === '') {
                                this.bondingNetID = evt.dataTransfer.getData('guestNetID');
                            } else if (evt.dataTransfer.getData('guestNetID') === null
                                || evt.dataTransfer.getData('guestNetID') === '') {
                                this.bondingNetID = bondingHost.networkId;
                            }
                            this.nicExNetExist = true;
                            this.bondingModal(bondingHost);

                        }
                        //새롭게 본딩을 만들 때 두 개의 인터페이스 중 하나라도 논리 네트워크가 할당되어 있으면서 vlan도 포함이 되어 있을 때
                        else if ((this.newbonding.name == null || this.newbonding.name === "")
                            && ((evt.dataTransfer.getData('guestNetID') !== "" && bondingHost.networkId === null && this.bondingVlanNetID.length > 0)
                                || (evt.dataTransfer.getData('guestNetID') === "" && bondingHost.networkId !== null && this.bondingVlanNetID.length > 0))) {

                            this.tempNicID = evt.dataTransfer.getData('guestID');

                            if (bondingHost.networkId === null
                                || bondingHost.networkId === '') {
                                this.bondingNetID = evt.dataTransfer.getData('guestNetID');
                            } else if (evt.dataTransfer.getData('guestNetID') === null
                                || evt.dataTransfer.getData('guestNetID') === '') {
                                this.bondingNetID = bondingHost.networkId;
                            }
                            this.nicExNetExist = true;
                            this.bondingModal(bondingHost);
                        }
                        //vlan으로만 이뤄져 있는 인터페이스인 경우
                        else if ((this.newbonding.name == null || this.newbonding.name === "")
                            && (evt.dataTransfer.getData('guestNetID') == "" && this.bondingVlanNetID.length > 0)) {
                            this.tempNicID = evt.dataTransfer.getData('guestID');
                            this.nicExNetExist = true;
                            this.bondingModal(bondingHost);
                        }
                        //논리 네트워크가 2개 이상 있을 경우
                        else {
                            alert("본딩하기 위해서는 2개 이상의 논리네트워크를 가질 수 없습니다!")
                        }
                    }
                }
            }
        },

        netStartDrag: (evt, net, hostNic) => {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('netID', net.id);
            evt.dataTransfer.setData('netName', net.name);
            if (hostNic != null) {
                evt.dataTransfer.setData('nicID', hostNic.name);
            }
        },

        NetOnDrop(evt, netList1, netList2, nic) {

            // console.log("netOnDrop")
            // 할당 -> 할당 or 미할당
            if (evt.dataTransfer.getData('netID')) {

                // netID는 할당하는 네트워크의 ID, netName은 할당하고자하는 네트워크의 이름
                const netID = evt.dataTransfer.getData('netID');
                const netName = evt.dataTransfer.getData('netName');
                this.usingVmNetwork = false;

                netList1 = JSON.parse(JSON.stringify(this.unUsingNetList));
                netList2 = JSON.parse(JSON.stringify(this.usingNetList));

                //flag를 써서 호스트에 논리네트워크나 vlan이 있으면 true값으로 변경
                this.vlanFlag = false;
                this.logicalNetFlag = false;

                if (nic) {
                    //flag를 통해 호스트에 논리네트워크가 하나라도 있는지 판별
                    this.usingNetList.some(usingNetwork => {
                        if (nic.base === usingNetwork.baseInterface) {
                            if (nic.vlan == null && nic.networkId === usingNetwork.id) {
                                return this.logicalNetFlag = true;
                            }
                        }
                    })
                    //flag를 통해 호스트에 vlan이 하나라도 있는지 판별
                    this.hostNicsModifyBonding.some(hostNic => {
                        if (hostNic.base === nic.base && hostNic.vlanNetworkList !== null) {
                            if (hostNic.networkId == null && hostNic.vlanNetworkList.length > 0) {
                                return this.vlanFlag = true;
                            }
                        }
                    })
                }

                if (evt.dataTransfer.getData('nicID') != "") {

                    // 할당 -> 할당(네트워크가 빈 곳으로)
                    if (nic) {
                        if (!nic.networkId) {

                            // this.usingVmNetwork = false;

                            netList2.forEach(usingNetwork => {
                                if (netID === usingNetwork.id) {
                                    if (usingNetwork.usingVmNetwork === true) {
                                        this.usingVmNetwork = true;
                                    }
                                }
                            })

                            if (this.usingVmNetwork === true) {
                                alert("네트워크에 할당된 가상머신을 종료한 후에 시도해 주세요!!");
                            } else if (this.usingVmNetwork === false) {

                                this.hostNicsModifyBonding.some(hostNic => {
                                    if (hostNic.networkId == netID) {
                                        return hostNic.networkId = null;
                                    }
                                })

                                netList2.some(usingNetwork => {
                                    if (usingNetwork.id === netID) {
                                        return usingNetwork.baseInterface = nic.name;
                                    }
                                })

                                nic.networkId = netID;
                                nic.networkName = netName;
                                this.unUsingNetList = netList1;
                                this.usingNetList = netList2;
                            }
                        }
                        //할당 -> 할당으로 네트워크 옮기는데 네트워크가 맵핑 된 곳으로 옮길 경우
                        else if (nic.networkId) {
                            var count = 0;
                            if (nic.networkId !== evt.dataTransfer.getData('netID')) {
                                this.usingNetList.some(usingNet => {
                                    if (usingNet.id === nic.networkId) {
                                        if (usingNet.vlan == null) {
                                            count++
                                        }
                                        return count;
                                    }
                                })
                                this.usingNetList.some(usingNet => {
                                    if (usingNet.id === evt.dataTransfer.getData('netID')) {
                                        if (usingNet.vlan == null) {
                                            count++
                                        }
                                        return count;
                                    }
                                })
                            }

                            if (count >= 2) {
                                alert("하나의 인터페이스에 2개 이상의 논리네트워크를 사용하실 수 없습니다.")
                            }
                            // else {
                            // }
                        }
                    }

                    //  할당 -> 미할당
                    else if (!nic) {
                        if (this.unUsingNetList.length != null) {

                            // this.usingVmNetwork = false;
                            // const netID = evt.dataTransfer.getData('netID');
                            //
                            // netList1 = JSON.parse(JSON.stringify(this.unUsingNetList));
                            // netList2 = JSON.parse(JSON.stringify(this.usingNetList));

                            netList2.forEach(usingNetwork => {
                                if (netID === usingNetwork.id) {
                                    if (usingNetwork.usingVmNetwork === true) {
                                        this.usingVmNetwork = true;
                                    }
                                }
                            })

                            if (this.usingVmNetwork === true) {
                                alert("네트워크에 할당된 가상머신을 종료한 후에 시도해 주세요!!");
                            } else if (this.usingVmNetwork === false) {

                                this.hostNicsModifyBonding.some(hostNic => {
                                    //옮기려는 네트워크가 논리네트워크일때!!
                                    if (hostNic.networkId && hostNic.vlanNetworkList == null) {
                                        if (hostNic.networkId === netID) {
                                            return hostNic.networkId = null;
                                        }
                                    }
                                    //옮기려는 네트워크가 VLAN네트워크일때!!
                                    else if (!hostNic.networkId && hostNic.vlanNetworkList !== null) {
                                        if (hostNic.vlanNetworkList[0] === netID) {
                                            return hostNic.vlanNetworkList[0] = '';
                                        }
                                    }
                                })

                                netList2.some(usingNetwork => {
                                    if (usingNetwork.id === netID) {
                                        return netList1.push(usingNetwork);
                                    }
                                })

                                for (var net2Idx in netList2) {
                                    if (netList2[net2Idx].id === netID) {
                                        netList2.splice(net2Idx, 1);
                                        break;
                                    }
                                }
                                this.unUsingNetList = netList1;
                                this.usingNetList = netList2;
                            }
                        }
                    }
                }
                // 미할당 -> 할당(네트워크가 빈 곳으로)
                else if ((nic.networkId == null || nic.networkId == '') && this.vlanFlag === false && this.logicalNetFlag === false) {
                    this.checkNetState = false;
                    // const netID = evt.dataTransfer.getData('netID');
                    // 들어오는 네트워크가 논리인지 아닌지 판별하는 flag
                    this.unUsingNetList.some(UnUsingNet => {
                        if (UnUsingNet.id === evt.dataTransfer.getData('netID')) {
                            if (UnUsingNet.vlan === null) {
                                return this.checkNetState = true;
                            }
                        }
                    })
                    //들어오는 네트워크가 논리 네트워크일 경우
                    if (this.checkNetState === true) {
                        nic.networkId = netID

                        var tempNetwork = netList1.find(network => network.id === netID)
                        tempNetwork.baseInterface = nic.name;
                        netList2.push(tempNetwork);

                        for (var net1Idx in netList1) {
                            if (netList1[net1Idx].id === nic.networkId) {
                                netList1.splice(net1Idx, 1);
                                break;
                            }
                        }
                        this.unUsingNetList = netList1;
                        this.usingNetList = netList2;
                    }
                    //들어오는 네트워크가 vlan 네트워크일 경우
                    else if (this.checkNetState === false) {
                        if (nic.vlanNetworkList == null) {
                            nic.vlanNetworkList = [];
                        }
                        nic.vlanNetworkList.push(netID);

                        var tempVlanNetwork = netList1.find(vlanNet => vlanNet.id === netID)
                        tempVlanNetwork.baseInterface = nic.name;
                        netList2.push(tempVlanNetwork);

                        for (var net1Idx in netList1) {
                            if (netList1[net1Idx].id === netID) {
                                netList1.splice(net1Idx, 1);
                                break;
                            }
                        }
                        this.unUsingNetList = netList1;
                        this.usingNetList = netList2;
                    }
                }

                // 미할당 -> 할당(네트워크가 있는 곳으로)
                else if (this.vlanFlag === true || this.logicalNetFlag === true) {

                    // netID는 할당하는 네트워크의 ID, netName은 할당하고자하는 네트워크의 이름
                    // const netID = evt.dataTransfer.getData('netID');
                    // const netName = evt.dataTransfer.getData('netName');

                    // netList1 = JSON.parse(JSON.stringify(this.unUsingNetList));
                    // netList2 = JSON.parse(JSON.stringify(this.usingNetList));

                    //호스트가 논리네트워크가 0개이고 vlan이 1개 이상일 때
                    if (this.logicalNetFlag === false && this.vlanFlag === true) {

                        if (nic.vlanNetworkList == null) {
                            nic.vlanNetworkList = [];
                        }
                        this.unUsingNetList.some(unUsingNet => {
                            if (unUsingNet.id === netID) {
                                //넣는 네트워크(게스트 네트워크)가 논리 네트워크일 때
                                if (unUsingNet.vlan == null) {
                                    //호스트에 네트워크 정보 집어넣기
                                    nic.networkId = netID

                                    //usingNetList로 네트워크 집어넣기
                                    var tempNetwork = netList1.find(network => network.id === netID)
                                    tempNetwork.baseInterface = nic.name;
                                    netList2.push(tempNetwork);

                                    //unUsingNetList에서 네트워크 빼주기
                                    for (var net1Idx in netList1) {
                                        if (netList1[net1Idx].id === netID) {
                                            netList1.splice(net1Idx, 1);
                                            break;
                                        }
                                    }
                                    this.unUsingNetList = netList1;
                                    this.usingNetList = netList2;
                                }
                                //넣는 네트워크(게스트 네트워크)가 vlan 네트워크일 때
                                else if (unUsingNet.vlan != null) {
                                    //호스트에 네트워크 정보 집어넣기(vlan)
                                    nic.vlanNetworkList.push(netID);

                                    //usingNetList로 네트워크 집어넣기
                                    var tempNetwork = netList1.find(network => network.id === netID)
                                    tempNetwork.baseInterface = nic.name;
                                    netList2.push(tempNetwork);

                                    //unUsingNetList에서 네트워크 빼주기
                                    for (var net1Idx in netList1) {
                                        if (netList1[net1Idx].id === netID) {
                                            netList1.splice(net1Idx, 1);
                                            break;
                                        }
                                    }
                                    this.unUsingNetList = netList1;
                                    this.usingNetList = netList2;
                                }
                            }
                        })
                    }

                    //호스트가 논리네트워크가 1개이고 vlan이 1개 이상일 때
                    else if (this.logicalNetFlag === true && this.vlanFlag === true) {
                        //checkLogicNet == true이면 게스트 네트워크가 논리 네트워크이다.
                        var checkLogicNet = false;

                        //게스트 네트워크가 논리 네트워크인지 아닌지 확인이 필요!!
                        this.unUsingNetList.some(unUsingNet => {
                            if (unUsingNet.vlan == null && unUsingNet.id === netID) {
                                alert("하나의 인터페이스에 둘 이상의 논리 네트워크를 사용할 수 없습니다!")
                                return checkLogicNet = true;
                            }
                        })

                        if (checkLogicNet === false) {
                            if (nic.vlanNetworkList == null) {
                                nic.vlanNetworkList = [];
                            }
                            //호스트에 네트워크 정보 집어넣기(vlan)
                            nic.vlanNetworkList.push(netID);

                            //usingNetList로 네트워크 집어넣기
                            var tempNetwork = netList1.find(network => network.id === netID)
                            tempNetwork.baseInterface = nic.name;
                            netList2.push(tempNetwork);

                            //unUsingNetList에서 네트워크 빼주기
                            for (var net1Idx in netList1) {
                                if (netList1[net1Idx].id === netID) {
                                    netList1.splice(net1Idx, 1);
                                    break;
                                }
                            }
                            this.unUsingNetList = netList1;
                            this.usingNetList = netList2;
                        }
                    }

                    //호스트가 논리네트워크가 1개이고 vlan이 0개 일 때
                    else if (this.logicalNetFlag === true && this.vlanFlag === false) {

                        //checkLogicNet == true이면 게스트 네트워크가 논리 네트워크이다.
                        var checkLogicNet = false;

                        //게스트 네트워크가 논리 네트워크인지 아닌지 확인이 필요!!
                        this.unUsingNetList.some(unUsingNet => {
                            if (unUsingNet.vlan == null && unUsingNet.id === netID) {
                                alert("하나의 인터페이스에 둘 이상의 논리 네트워크를 사용할 수 없습니다!")
                                return checkLogicNet = true;
                            }
                        })
                        if (checkLogicNet === false) {

                            if (nic.vlanNetworkList == null) {
                                nic.vlanNetworkList = [];
                            }
                            //호스트에 네트워크 정보 집어넣기(vlan)
                            nic.vlanNetworkList.push(netID);

                            //usingNetList로 네트워크 집어넣기
                            var tempNetwork = netList1.find(network => network.id === netID)
                            tempNetwork.baseInterface = nic.name;
                            netList2.push(tempNetwork);

                            //unUsingNetList에서 네트워크 빼주기
                            for (var net1Idx in netList1) {
                                if (netList1[net1Idx].id === netID) {
                                    netList1.splice(net1Idx, 1);
                                    break;
                                }
                            }
                            this.unUsingNetList = netList1;
                            this.usingNetList = netList2;
                        }
                    }
                }
            }
        },

        breakBonding: function (hostNic) {

            hostNic.bonding.forEach(bondingNic => {
                this.hostNicsModifyBonding.push(bondingNic)
            })

            this.usingNetList.some(usingNetwork => {
                if (usingNetwork.id == hostNic.networkId) {
                    return this.unUsingNetList.push(usingNetwork)
                }
            })

            for (var usingNetworkIdx in this.usingNetList) {
                if (this.usingNetList[usingNetworkIdx].id == hostNic.networkId) {
                    this.usingNetList.splice(usingNetworkIdx, 1)
                    break;
                }
            }

            for (var deleteHostNicIdx in this.hostNicsModifyBonding) {
                if (this.hostNicsModifyBonding[deleteHostNicIdx].id == hostNic.id) {
                    this.hostNicsModifyBonding.splice(deleteHostNicIdx, 1)
                    break;
                }
            }
        },

        //본딩 모달 창 띄우기
        bondingModal: function (bondingHost) {
            this.tempbondingHost = bondingHost;
            $("#bondingCreateModal").addClass("active");
            // $(".makebondingmodal").modal('show');

        },

        //본딩 만들때 벨리데이션
        checkbonding: function () {
            var checkbondingList = [];
            checkbondingList = JSON.parse(JSON.stringify(this.hostNicsModifyBonding))
            var flag = true;
            checkbondingList.forEach(checkBondingNic => {
                if (checkBondingNic.bonding != null) {
                    if (checkBondingNic.name == this.makeNicBonding.bondingName) {
                        flag = false;
                    }
                }
            })

            if (flag) {
                this.makeBonding();
            } else {
                alert("본딩 이름을 확인해 주세요!")
            }
        },

        //본딩 만들기
        makeBonding: function () {

            this.newbonding.name = this.makeNicBonding.bondingName;
            this.newbonding.bondingModeName = this.makeNicBonding.bondingModeName;
            this.newbonding.hostId = this.hostId;
            this.newbonding.base = this.newbonding.name;
            this.newbonding.networkId = this.bondingNetID;
            //nicExNetExist == true 이면 본딩 할때 이전에 network가 있었다는것을 의미
            this.newbonding.nicExNetExist = this.nicExNetExist;
            if (this.bondingVlanNetID.length > 0) {
                this.bondingVlanNetID.forEach(vlan => {
                    this.newbonding.vlanNetworkList.push(vlan);
                })
            }

            //새로 만드는 본딩에 slave로 인터페이스들을 집어넣는 과정
            for (var idx = 0; idx < this.hostNicsModifyBonding.length; idx++) {
                if (this.hostNicsModifyBonding[idx].id == this.tempNicID) {
                    this.newbonding.bonding.push(this.hostNicsModifyBonding[idx]);
                    this.hostNicsModifyBonding.splice(idx, 1);
                    idx--
                } else if (this.hostNicsModifyBonding[idx].id == this.tempbondingHost.id) {
                    this.newbonding.bonding.push(this.hostNicsModifyBonding[idx]);
                    this.hostNicsModifyBonding.splice(idx, 1);
                    idx--
                }
            }

            if (this.newbonding.networkId !== '') {
                this.usingNetList.some(usingNet => {
                    if (usingNet.id === this.newbonding.networkId) {
                        return usingNet.baseInterface = this.newbonding.name;
                    }
                })
            }

            this.usingNetList.forEach(usingNetwork => {
                this.newbonding.vlanNetworkList.forEach(vlan => {
                    if (usingNetwork.id === vlan) {
                        usingNetwork.baseInterface = this.newbonding.name;
                    }
                })
            })

            this.hostNicsModifyBonding.push(this.newbonding);
            this.resetBonding();
            // $(".makebondingmodal").modal('hide');
            $("#bondingCreateModal").removeClass("active");
        },

        cancelMakeBonding: function () {

            this.resetBonding();
            // this.tempbondingHost = '';
            // this.tempNicID = '';
            $("#bondingCreateModal").removeClass("active");
            // $(".makebondingmodal").modal('hide');
        },

        toggle: function (bonding) {

            const index = this.opened.indexOf(bonding);
            if (index > -1) {
                this.opened.splice(index, 1)
            } else {
                this.opened.push(bonding)
            }
        },

        SetupHostNetwork: function () {

            this.requiredFlag = false;

            // this.unUsingNetList.some(unUsingNetwork => {
            //     if (unUsingNetwork.required == true) {
            //         return alert("필수 네트워크" + unUsingNetwork.name + "를 삭제할 수 없습니다. 다시 인터페이스에 맵핑시켜주세요!"), this.requiredFlag = true;
            //     }
            // })

            if (this.requiredFlag === false) {

                this.sendHostNicsModifyBonding = [];

                this.hostNicsModifyBonding.forEach(nowHostNic => {
                    this.exHostNicsModifyBonding.forEach(exHostNic => {
                        //이전과 현재 리스트에 nic id가 같을 때
                        if (nowHostNic.id == exHostNic.id) {
                            //이전과 현재 리스트 둘 다 본딩 있을 때
                            if (nowHostNic.bonding && exHostNic.bonding) {
                                if (nowHostNic.networkId != exHostNic.networkId
                                    && (nowHostNic.vlanNetworkList == null && exHostNic.vlanNetworkList == null)) {
                                    this.sendHostNicsModifyBonding.push(nowHostNic);
                                } else if (nowHostNic.networkId === exHostNic.networkId
                                    && (nowHostNic.vlanNetworkList != null && exHostNic.vlanNetworkList != null)) {

                                    if (nowHostNic.vlanNetworkList.length !== exHostNic.vlanNetworkList.length) {
                                        this.sendHostNicsModifyBonding.push(nowHostNic);
                                    }

                                    var tempVlanList = JSON.parse(JSON.stringify(nowHostNic.vlanNetworkList));

                                    for (var nowIdx in tempVlanList) {
                                        for (var exIdx in exHostNic.vlanNetworkList) {
                                            if (tempVlanList[nowIdx] === exHostNic.vlanNetworkList[exIdx]) {
                                                tempVlanList.splice(nowIdx);
                                            }
                                        }
                                    }

                                    if (tempVlanList.length !== 0) {
                                        this.sendHostNicsModifyBonding.push(nowHostNic);
                                    }
                                } else if (nowHostNic.networkId === exHostNic.networkId
                                    && ((nowHostNic.vlanNetworkList == null && exHostNic.vlanNetworkList != null) ||
                                        (nowHostNic.vlanNetworkList != null && exHostNic.vlanNetworkList == null))) {

                                    this.sendHostNicsModifyBonding.push(nowHostNic);
                                } else if (nowHostNic.bonding.length != exHostNic.bonding.length) {
                                    this.sendHostNicsModifyBonding.push(nowHostNic);
                                }
                            }
                            //이전과 현재 nic이 본딩이 아닐 때
                            else {
                                if (nowHostNic.networkId !== exHostNic.networkId
                                    && (nowHostNic.vlanNetworkList == null && exHostNic.vlanNetworkList == null)) {
                                    this.sendHostNicsModifyBonding.push(nowHostNic);
                                } else if (nowHostNic.networkId === exHostNic.networkId
                                    && (nowHostNic.vlanNetworkList != null && exHostNic.vlanNetworkList != null)) {

                                    if (nowHostNic.vlanNetworkList.length !== exHostNic.vlanNetworkList.length) {
                                        this.sendHostNicsModifyBonding.push(nowHostNic);
                                    }

                                    var tempVlanList = JSON.parse(JSON.stringify(nowHostNic.vlanNetworkList));

                                    for (var nowIdx in tempVlanList) {
                                        for (var exIdx in exHostNic.vlanNetworkList) {
                                            if (tempVlanList[nowIdx] === exHostNic.vlanNetworkList[exIdx]) {
                                                tempVlanList.splice(nowIdx);
                                            }
                                        }
                                    }

                                    if (tempVlanList.length !== 0) {
                                        this.sendHostNicsModifyBonding.push(nowHostNic);
                                    }
                                } else if (nowHostNic.networkId === exHostNic.networkId
                                    && ((nowHostNic.vlanNetworkList == null && exHostNic.vlanNetworkList != null) ||
                                        (nowHostNic.vlanNetworkList != null && exHostNic.vlanNetworkList == null))) {

                                    this.sendHostNicsModifyBonding.push(nowHostNic);
                                } else if (nowHostNic.networkId !== exHostNic.networkId) {

                                    this.sendHostNicsModifyBonding.push(nowHostNic);
                                }
                            }
                        }

                        // 변경된(현재) 리스트에 본딩이 있으면
                        else if (nowHostNic.bonding) {

                            var exTempHostList = JSON.parse(JSON.stringify(this.exHostNicsModifyBonding))
                            var checkExBonding = false;

                            exTempHostList.forEach(exHost => {
                                if (exHost.id === nowHostNic.id) {
                                    if (exHost.bonding) {
                                        if (exHost.vlanNetworkList != null && nowHostNic.vlanNetworkList != null) {
                                            if ((exHost.bonding.length === nowHostNic.bonding.length)
                                                && (exHost.networkId === nowHostNic.networkId)
                                                && (exHost.vlanNetworkList.length === nowHostNic.vlanNetworkList.length)) {
                                                checkExBonding = true;
                                            }
                                        } else if ((exHost.bonding.length === nowHostNic.bonding.length)
                                            && (exHost.networkId === nowHostNic.networkId)
                                            && (exHost.vlanNetworkList == null && nowHostNic.vlanNetworkList == null)) {
                                            checkExBonding = true;
                                        }
                                    }
                                }
                            })

                            // flag를 새로 본딩된 녀석이 있으면 true로 바꿔줌!! 새로 본딩되는 녀석이 없거나 본딩이 해제 될때는 항상 false!!
                            if ((this.exHostNicsModifyBonding.indexOf(exHostNic) === this.exHostNicsModifyBonding.length - 1)
                                && (checkExBonding === false)) {
                                nowHostNic.checkbonding = true;
                                this.sendHostNicsModifyBonding.push(nowHostNic);
                            }
                        }

                        //변경된(현재) 리스트에 본딩이 없으면
                        else if (!nowHostNic.bonding) {
                            if (exHostNic.bonding) {
                                if (exHostNic.bonding.length > 2) {
                                } else {
                                    if (this.hostNicsModifyBonding.length > this.exHostNicsModifyBonding.length) {
                                        if (this.hostNicsModifyBonding.indexOf(nowHostNic) == this.hostNicsModifyBonding.length - 1) {

                                            var checkBondingNameList = JSON.parse(JSON.stringify(this.exHostNicsModifyBonding))

                                            checkBondingNameList.some(exHostNic => {
                                                if (exHostNic.bonding) {
                                                    exHostNic.bonding.some(bonding => {
                                                        if (bonding.id === nowHostNic.id) {
                                                            nowHostNic.unBondName = exHostNic.base;
                                                            nowHostNic.checkbonding = false;
                                                            return this.sendHostNicsModifyBonding.push(nowHostNic);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    })
                })

                if (this.sendHostNicsModifyBonding.length == 0) {
                    alert("변경사항이 없습니다")
                } else if (this.sendHostNicsModifyBonding.length != 0) {
                    this.sendHostNicsModifyBonding.some(sendHostNic => {
                        if (sendHostNic.bonding
                            || sendHostNic.bonding != null) {
                            if (sendHostNic.bondingMode == null
                                || sendHostNic.bondingMode == "") {
                                if (sendHostNic.bondingModeName == "Round-robin") {
                                    return sendHostNic.bondingMode = 0;
                                } else if (sendHostNic.bondingModeName == "Active-Backup") {
                                    return sendHostNic.bondingMode = 1;
                                } else if (sendHostNic.bondingModeName == "Load balance(balance-xor)") {
                                    return sendHostNic.bondingMode = 2;
                                } else if (sendHostNic.bondingModeName == "Broadcast") {
                                    return sendHostNic.bondingMode = 3;
                                } else if (sendHostNic.bondingModeName == "Dynamic link aggregation (802.3ad)") {
                                    return sendHostNic.bondingMode = 4;
                                } else if (sendHostNic.bondingModeName == "Adaptive transmit load balancing") {
                                    return sendHostNic.bondingMode = 5;
                                } else if (sendHostNic.bondingModeName == "Adaptive load balancing") {
                                    return sendHostNic.bondingMode = 6;
                                } else if (sendHostNic.bondingModeName == "사용자 정의 모드") {
                                    return sendHostNic.bondingMode = 4;
                                }
                            }
                        }
                    })

                    for (var deleteNicIdx in this.sendHostNicsModifyBonding) {
                        if (deleteNicIdx < this.sendHostNicsModifyBonding.length - 1) {
                            if (this.sendHostNicsModifyBonding[deleteNicIdx].id == "" || this.sendHostNicsModifyBonding[deleteNicIdx].id == null) {
                                if (this.sendHostNicsModifyBonding[deleteNicIdx].id == this.sendHostNicsModifyBonding[parseInt(deleteNicIdx) + 1].id) {
                                    this.sendHostNicsModifyBonding.splice(deleteNicIdx, 1)
                                }
                                break;
                            } else if (this.sendHostNicsModifyBonding[deleteNicIdx].id != "" || this.sendHostNicsModifyBonding[deleteNicIdx].id != null) {
                                if (this.sendHostNicsModifyBonding[deleteNicIdx].id == this.sendHostNicsModifyBonding[parseInt(deleteNicIdx) + 1].id) {
                                    this.sendHostNicsModifyBonding.splice(deleteNicIdx, 1)
                                }
                            }
                        }
                    }
                    $("#setupHostNetworkModal").removeClass("active");
                    // $(".setuphostnetworkmodel").modal('hide');
                    this.spinnerOn = true;
                    this.$http.post('/compute/hosts/setupHostNetwork', this.sendHostNicsModifyBonding).then(function (response) {
                        // console.log(response.data.resultKey);
                        this.spinnerOn = true;
                        this.retrieveHostDetail();
                    }.bind(this)).catch(function (error) {
                        // console.log(error);
                        this.retrieveHostDetail();
                    });
                }

            }
        },

        cancelSetupHostNetwork: function () {
            this.resetHostNic();
            $(".setuphostnetworkmodel").modal('hide');

        },

        resetBonding: function () {

            this.makeNicBonding = {
                bondingMode: '',
                bondingModeName: 'Dynamic link aggregation (802.3ad)',
                bondingName: 'bond1',
                bondingCustomizing: '',

            },
                this.selectVo.selBondingVo.selected = {
                    name: "(Mode 4) Dynamic link aggregation (802.3ad)",
                    id: "Dynamic link aggregation (802.3ad)"
                }
            this.newbonding = {
                bonding: [],
                dataCurrentRx: '',
                dataCurrentRxBps: '',
                dataCurrentTx: '',
                dataCurrentTxBps: '',
                dataTotalRx: '',
                dataTotalTx: '',
                id: '',
                ipAddress: '',
                macAddress: '',
                name: '',
                networkId: '',
                networkName: '',
                bondingMode: '',
                bondingModeName: '',
                status: '',
                hostId: '',
                base: '',
                nicExNetExist: false,
                vlanNetworkList: []
            },

                this.tempbondingHost = {
                    bonding: [],
                    dataCurrentRx: '',
                    dataCurrentRxBps: '',
                    dataCurrentTx: '',
                    dataCurrentTxBps: '',
                    dataTotalRx: '',
                    dataTotalTx: '',
                    id: '',
                    ipAddress: '',
                    macAddress: '',
                    name: '',
                    networkId: '',
                    networkName: '',
                    bondingMode: '',
                    bondingModeName: '',
                    status: '',
                    hostId: ''
                }
            this.sel
        },

        // cpu, memory donutChart function
        /* 2π × r = 2π × 31 ≈ 195 */
        funcDonutChart: function (data, elm) {
            var _this = $('#' + elm);
            var _dcNum = (195 * (100 - data)) / 100 * -1;
            _this.find('circle').css({
                "strokeDashoffset": -195,
                "strokeDasharray": 195
            });
            _this.find('circle').stop().delay(300).animate({
                "strokeDashoffset": _dcNum
            }, 500);
        },

        // amChart function
        funcAmCharts: function (vmUsage) {

            vmUsage = vmUsage.reverse();

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.XYChart);

            //initData set
            if (vmUsage.length < 11) {
                var initDate = new Date(JSON.parse(JSON.stringify(Math.floor(Number(vmUsage[0].usageDate)))));
                initDate.setHours(initDate.getHours() - 9);
                chart.data.push({
                    date: new Date(initDate.getFullYear(), initDate.getMonth(), initDate.getDate(), initDate.getHours(), initDate.getMinutes()),
                    value1: vmUsage[0].cpuUsages,
                    value2: vmUsage[0].memoryUsages
                });
            }

            // Add data
            for (let usage of vmUsage) {
                var date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage.usageDate)))));
                date.setHours(date.getHours() - 9);
                var minute = date.getMinutes();

                // use = year + "년" + month + "월" + day + "일" + hour + "시" + minute + "분" + second + "초";
                if (minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50) {
                    var usageForm = {
                        date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()),
                        hour: date.getHours(),
                        value1: usage.cpuUsages,
                        value2: usage.memoryUsages
                    };
                    chart.data.push(usageForm);
                }
            }

            let chartLen = chart.data.length;
            if (chart.data[0].hour === chart.data[chartLen - 1].hour) {
                chart.data.unshift({
                    date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 1),
                    hour: date.getHours(),
                    value1: chart.data[chartLen - 1].value1,
                    value2: chart.data[chartLen - 1].value2
                });
            }

            var liveDate = new Date(JSON.parse(JSON.stringify(Math.floor(Number(vmUsage[vmUsage.length - 1].usageDate)))));
            liveDate.setHours(liveDate.getHours() - 9);
            chart.data.push({
                date: new Date(liveDate.getFullYear(), liveDate.getMonth(), liveDate.getDate(), liveDate.getHours(), liveDate.getMinutes()),
                hour: liveDate.getHours(),
                value1: vmUsage[vmUsage.length - 1].cpuUsages,
                value2: vmUsage[vmUsage.length - 1].memoryUsages
            });

            if (chart.data.length > 7) {
                chart.data = chart.data.splice(-7, chart.data.length);

            }


            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 20;
            dateAxis.renderer.grid.template.stroke = am4core.color("#cccccc");
            dateAxis.renderer.labels.template.fill = am4core.color("#cccccc");
            dateAxis.renderer.grid.template.location = 0.5;
            dateAxis.startLocation = 0.5;
            dateAxis.endLocation = 0.5;
            dateAxis.renderer.minLabelPosition = 0.05;
            dateAxis.renderer.maxLabelPosition = 0.95;
            dateAxis.tooltip.disabled = true;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.renderer.grid.template.stroke = am4core.color("#cccccc");
            valueAxis.renderer.labels.template.fill = am4core.color("#cccccc");
            valueAxis.strictMinMax = true;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis.tooltip.disabled = true;

            function createGrid(value) {
                var range = valueAxis.axisRanges.create();
                range.value = value;
                range.label.text = "{value}";
            }

            createGrid(0);
            createGrid(10);
            createGrid(20);
            createGrid(30);
            createGrid(40);
            createGrid(50);
            createGrid(60);
            createGrid(70);
            createGrid(80);
            createGrid(90);
            createGrid(100);

            // Create series
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value1";
            series.dataFields.dateX = "date";
            series.strokeWidth = 2;
            series.stroke = am4core.color("#025cfc");

            series.minBulletDistance = 10;
            series.tooltipText = "{date}\ncpu 이용률 {value1}%\n" +
                "메모리 이용률 {value2}%"
            series.tooltip.pointerOrientation = "down";
            series.tooltip.getFillFromObject = false;
            series.tooltip.background.strokeWidth = 0;
            series.tooltip.background.fill = am4core.color("#000000");
            series.tooltip.background.fillOpacity = 0.7;
            series.tooltip.fontSize = 13;
            series.tooltip.fontFamily = 'NotoSansCJKkr-Bold';
            series.tooltip.background.cornerRadius = 5;
            series.tooltip.dy = -12;

            // Create series
            var series2 = chart.series.push(new am4charts.LineSeries());
            series2.dataFields.valueY = "value2";
            series2.dataFields.dateX = "date";
            series2.strokeWidth = 2;
            series2.stroke = am4core.color("#b620e0");

            // Create series
            // var series3 = chart.series.push(new am4charts.LineSeries());
            // series3.dataFields.valueY = "value3";
            // series3.dataFields.dateX = "date";
            // series3.strokeWidth = 2;
            // series3.stroke = am4core.color("#2231a9");

            // Add cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = dateAxis;
        },

        retrieveHostDetail: function () {

            this.$http.get('/compute/hosts/retrieveHostDetail?id=' + this.hostId).then(function (response) {
                // this.host = response.data.resultKey;
                this.host = JSON.parse(JSON.stringify(response.data.resultKey));
                // console.log('host:', this.host);

                // init chart data
                this.initChartData();

                this.funcDonutChart(this.host.usageVos[0].cpuUsages, "donut-chart1");
                this.funcDonutChart(this.host.usageVos[0].memoryUsages, "donut-chart2");
                this.usage = JSON.parse(JSON.stringify(this.host.usageVos));
                this.funcAmCharts(this.usage);

                this.sendNetAttachment = {
                    hostNicName: '',
                    hostNicId: '',
                    netHostName: '',
                    netHostId: '',
                    nicNetworkName: '',
                    nicNetworkId: 'none',
                    bootProtocol: 'none',
                    nicAddress: '',
                    nicGateway: '',
                    nicNetmask: '',
                    dnsServer: ['']
                },
                    this.exHostNicsModifyBonding = [];
                this.hostNicsModifyBonding = [];

                this.host.hostNicsUsageApi.forEach(tempNicBonding => {
                    this.hostNicsModifyBonding.push(JSON.parse(JSON.stringify(tempNicBonding)));
                    this.exHostNicsModifyBonding.push(JSON.parse(JSON.stringify(tempNicBonding)));
                })

                // selectBox list mapping
                this.selectVo.selNetworkVo.list = [];
                for (let netAttach of this.host.netAttachment) {
                    this.selectVo.selNetworkVo.list.push({name: netAttach.nicNetworkName, id: netAttach.nicNetworkId});
                }
                this.selectVo.selNetworkVo.list.unshift({name: "비어있음", id: "none"});


                this.initData.creNetwork = {
                    name: this.selectVo.selNetworkVo.list[0].name,
                    id: this.selectVo.selNetworkVo.list[0].id
                };
                this.selectVo.selNetworkVo.selected = this.initData.creNetwork;
                // selectBox list mapping

                this.spinnerOn = false;

                // console.log('hostNicsModifyBonding:',this.hostNicsModifyBonding)
                // console.log('exHostNicsModifyBonding:',this.exHostNicsModifyBonding)


                // set last update
//				var d = new Date();
//				this.lastUpdated = d.toString();
                this.lastUpdated = moment(new Date()).format("YYYY년 MM월 DD일 ddd a hh시 mm분 ss초");

                //retrieve network info
                var self = this;
                self.usingNetList = [];
                self.unUsingNetList = [];

                this.$http.get('/network/getHostNetworkList?id=' + this.hostId).then(function (response) {

                    hostVue.hostNicsModifyBonding.forEach(hostNic => {
                        if (hostNic.networkId != null) {
                            for (var NetworkIdx in response.data.list) {
                                if (hostNic.networkId == response.data.list[NetworkIdx].id) {
                                    self.usingNetList.push(JSON.parse(JSON.stringify(response.data.list[NetworkIdx])));
                                    response.data.list.splice(NetworkIdx, 1);
                                    break;
                                }
                            }
                        }
                    })

                    hostVue.hostNicsModifyBonding.forEach(hostNic => {
                        if (hostNic.vlanNetworkList != null) {
                            for (var NetworkIdx in response.data.list) {
                                for (var vlanNetworkIdx in hostNic.vlanNetworkList) {
                                    if (hostNic.vlanNetworkList[vlanNetworkIdx] == response.data.list[NetworkIdx].id) {
                                        self.usingNetList.push(JSON.parse(JSON.stringify(response.data.list[NetworkIdx])));
                                        response.data.list.splice(NetworkIdx, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    })
                    self.resetUsingNetwork = JSON.parse(JSON.stringify(self.usingNetList));

                    response.data.list.forEach(unUsingNetwork => {
                        self.unUsingNetList.push(JSON.parse(JSON.stringify(unUsingNetwork)));
                    })

                    self.resetUnUsingNetwork = JSON.parse(JSON.stringify(self.unUsingNetList));
                })
                    .catch(function (error) {
                        // console.log(error);
                    })

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        retrieveHostEvents: function (pHostId) {
            this.$http.get('/compute/hosts/retrieveHostEvents?id=' + this.hostId).then(function (response) {
                this.events = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        initChartData: function () {
            //  console.log('host:',this.host);
            this.chartData.memoryTotal = this.host.memoryTotal;
            this.chartData.memoryFree = this.host.memoryFree;
            this.chartData.memoryUsed = this.host.memoryUsed;

            if ("up" == this.host.status) {
                this.chartData.cpuIdleUsagePercent = this.host.idleCpuUsagePercent;
            } else {
                this.chartData.cpuIdleUsagePercent = 100;
            }

            if (this.chartData.memoryFree == 0) {
                this.chartData.memoryTotal = 100;
                this.chartData.memoryFree = 100;
                this.chartData.memoryUsed = 0;
            }

            this.chartData.cpuUsagePercent = 100 - this.chartData.cpuIdleUsagePercent;

            // 시계열 차트
            this.chartData.cpuUsage = this.host.cpuUsage;
            this.chartData.memoryUsage = this.host.memoryUsage;
        },
        getTotalNicsUsage: function (nicsUsage) {
            var total = 0;
            nicsUsage.forEach(function (nicUsage) {
                total = total + parseInt(nicUsage.receiveRatePercent) + parseInt(nicUsage.transmitRatePercent);
            });
            return (total / nicsUsage.length).toFixed(0);
        },
        goDetail: function (cluster) {
            // console.log("goDetail gogo");
            window.location.href = "/compute/clusterDetail?id=" + cluster.id;
        },
        goList: function () {
            location.href = '/compute/hosts';
        },
        // paging
        nextPage: function () {
            this.pageNumber++;
        },
        prevPage: function () {
            this.pageNumber--;
        },
        movePage: function (number) {
            this.pageNumber = number - 1;
        },
        isSelected: function (number) {
            if (this.pageNumber == number - 1) {
                return true;
            }
        },
        eventType: function (severity) {
            if (severity == 'normal') {
                return 'fa fa-check green';
            } else if (severity == 'error') {
                return 'fa fa-times red';
            } else if (severity == 'warning') {
                return 'fa fa-exclamation purple';
            }
        },
        setViewList: function (viewList, flag) {
            if (flag === 'vm') {
                this.pagingVo.viewListVm = viewList;
            } else if (flag === 'event') {
                this.pagingVo.viewListEvent = viewList;
            }
        }
    },
    computed: {

        pageCount: function () {
            let l = this.events.length,
                s = this.size;
            return Math.floor(l / s);
        },
        paginatedData: function () {
            const start = this.pageNumber * this.size,
                end = start + this.size;
            return this.events.slice(start, end);
        }
    },

    filters: {
        date: function (value) {
            if (value == undefined || isNaN(value) || value == '' || value == null) {
                return '';
            }

            return moment(value).format("YYYY-MM-DD HH:mm:ss");
//			return moment(value).format('LT');
        }
    },
})
