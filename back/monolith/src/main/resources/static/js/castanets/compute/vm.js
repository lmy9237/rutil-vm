Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
    router: router,
    el: '#vmDetail',
    data: {
        initData: {
            profile: {name: "비어있음", id: "none"}
        },
        selectVo: {
            selProfileVo: {
                size: "large",
                list: [{name: "", id: ""}],
                index: 10000,
                selected: {name: "전체", id: "selectAll"}
            }
        },
        isHistory: false,
        isSnapshot: false,
        isOpenBtn: false,
        isUpdate: false,
        checkMac: false,
        snapNmStatus: "",
        updateNetworkStatus: "",
        vmNicOrigin: {
            profileList: [],
            profileId: "none",
            nicName: "",
            nicId: "",
            macAddress: "",
            ipv4: "",
            ipv6: "",
            id: ""
        },
        vmNic: {
            profileList: [],
            profileId: "none",
            nicName: "",
            nicId: "",
            macAddress: "",
            ipv4: "",
            ipv6: "",
            id: ""
        },
        // pickLink: 'linkState',
        linkState: '',
        // pickCard: 'cardState',
        cardState: '',
        spinnerOn: true,
        profile: {},
        nicCreate: {},
        nicUpdate: {
            ipv4: "",
            ipv6: "",
            linked: "",
            plugged: "",
            nicName: "",
            nicId: "",
            macAddress: "",
            id: "",
            profileId: "",
            profileName: ""
        },
        usage: {
            date: [],
            cpuUsage: [],
            memoryUsage: [],
            networkUsage: []
        },
        vm: {
            vmNics: {
                nicName: "",
                macAddress: ""
            },
            vmSystem: {
                totalVirtualCpus: 0
            },
            cpuUsage: [
                [0, 0]
            ],
            memoryUsage: [
                [0, 0]
            ],
            events: [],
            usageVos: [
                {
                    cpuUsages: 0,
                    memoryUsages: 0

                }
            ]
        },
        lastUpdated: '',
        pageNumber: 0,
        selectedNumber: 'btn btn-success btn-sm',
        unSelectedNumber: 'btn btn-default btn-sm',
//		tempDisk: {},
        newSnapshot: {},
        selectedDisks: [],
        selectedSnapshot: {id: ""},
        snapshots: [
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            },
            {
                "vmId": "",
                "memoryRestore": false,
                "id": "",
                "date": 0,
                "status": "",
                "memory": false,
                "description": "",
                "disks": [],
                "nics": []
            }
        ],
        inPreview: false,
        locked: false,
        memoryRestore: true,
        vmClone: {
            operatingSystem: '',
            clusters: [],
            operatingSystems: []
        },
        instanceType: null,
        cluster: '',
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
        pagingVo: {
            viewList: []
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
        let self = this;

        // get parameter
        self.vmId = self.$route.query.id;
        self.newSnapshot.vmId = self.vmId;

        self.retrieveVm();
        $('.tabs').tabs();
        self.timer = setInterval(self.retrieveVm, 60000);

        this.$EventBus.$on("vmDetail", msg => {
            location.href = '/compute/vm?id=' + msg.id;
        });

    },
    methods: {
        setSelected: function (selectData, index) {
            if (index === 10000) {
                this.vmNic.profileId = selectData.id;
            }
        },

        openModal: function (type, data) {
            this.closeBtn();
            if (type === "createNic") {
                this.checkMac = false;
                this.isUpdate = false;
                this.vmNic = {...this.vmNicOrigin};
                this.linkState = "true";
                this.cardState = "true";
                this.selectVo.selProfileVo.selected = {...this.initData.profile};
                $("#vmNicModel").addClass("active");
            } else if (type === "updateNic") {
                this.checkMac = false;
                this.vmNic = {...data};
                if (this.vmNic.profileId != null && this.vmNic.profileId !== '') {
                    this.selectVo.selProfileVo.selected = this.selectVo.selProfileVo.list.filter((e, i) => {
                        return e.id === this.vmNic.profileId;
                    })[0];
                } else {
                    this.selectVo.selProfileVo.selected = {...this.initData.profile};
                }

                this.isUpdate = true;
                this.checkMac = false;
                this.linkState = this.vmNic.linked;
                this.cardState = this.vmNic.plugged;
                this.BooleanToChar();
                $("#vmNicModel").addClass("active");
            } else if (type === "deleteNic") {
                $("#deleteVmNicModal").addClass("active");
            } else if (type === "snapshotCreate") {
                $("#snapshotCreateModal").addClass("active");
            } else if (type === "preview") {
                $("#snapshotPreviewModal").addClass("active");
            } else if (type === "deleteSnapshot") {
                $("#deleteSnapshotModal").addClass("active");
            } else if(type === "updateVm"){
                this.$EventBus.$emit('openVmUpdateModal', this.vm.id, "vm");
            }
        },

        closeModal: function (type) {
            if (type === "vmNic") {
                $("#vmNicModel").removeClass("active");
            } else if (type === "deleteNic") {
                $("#deleteVmNicModal").removeClass("active");
            } else if (type === "snapshotCreate") {
                $("#snapshotCreateModal").removeClass("active");
            } else if (type === "preview") {
                this.memoryRestore = true;
                $("#snapshotPreviewModal").removeClass("active");
            } else if (type === "deleteSnapshot") {
                $("#deleteSnapshotModal").removeClass("active");
            }

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
        openFolder: function () {
            // document.getElementsByClassName('folding-body');
            $(".folding-body").addClass('active');
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
                    value2: vmUsage[0].memoryUsages,
                    value3: vmUsage[0].networkUsages
                });
            }


            // Add data
            for (let usage of vmUsage) {
                var date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage.usageDate)))));
                // var year = date.getFullYear();
                // var month = date.getMonth();
                // var day = date.getDate();
                date.setHours(date.getHours() - 9);
                // var hour = date.getHours();
                var minute = date.getMinutes();


                // use = year + "년" + month + "월" + day + "일" + hour + "시" + minute + "분" + second + "초";
                if (minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50) {
                    var usageForm = {
                        date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()),
                        hour: date.getHours(),
                        value1: usage.cpuUsages,
                        value2: usage.memoryUsages,
                        value3: usage.networkUsages
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
                    value2: chart.data[chartLen - 1].value2,
                    value3: chart.data[chartLen - 1].value3
                });
            }


            var liveDate = new Date(JSON.parse(JSON.stringify(Math.floor(Number(vmUsage[vmUsage.length - 1].usageDate)))));
            liveDate.setHours(liveDate.getHours() - 9);
            chart.data.push({
                date: new Date(liveDate.getFullYear(), liveDate.getMonth(), liveDate.getDate(), liveDate.getHours(), liveDate.getMinutes()),
                hour: liveDate.getHours(),
                value1: vmUsage[vmUsage.length - 1].cpuUsages,
                value2: vmUsage[vmUsage.length - 1].memoryUsages,
                value3: vmUsage[vmUsage.length - 1].networkUsages
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
                "메모리 이용률 {value2}%\n" +
                "네트워크 이용률 {value3}%";
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
            var series3 = chart.series.push(new am4charts.LineSeries());
            series3.dataFields.valueY = "value3";
            series3.dataFields.dateX = "date";
            series3.strokeWidth = 2;
            series3.stroke = am4core.color("#2231a9");

            // Add cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = dateAxis;
        },
        selectNic: function (nic, idx) {
            let btnActiveList = document.getElementsByClassName('btn-openPop active');

            if (btnActiveList.length > 0) {
                this.isOpenBtn = true;
            } else {
                this.isOpenBtn = false;
            }

            this.closeBtn();
            // if(nic.nicId !== this.vmNic.nicId){
            if (!this.isOpenBtn || nic.nicId !== this.vmNic.nicId) {
                let btnList = document.getElementsByClassName('btn-openPop');
                let btnTargetList = document.getElementsByClassName('openPop-target');
                for (let btn in btnList) {
                    btnList[idx].classList.add('active');
                    break;

                }
                for (let box in btnTargetList) {
                    btnTargetList[idx].classList.add('active');
                    break;
                }
            }

            this.vmNic = {...nic};
            this.isUpdate = true;
            this.checkMac = false;
            this.linkState = this.vmNic.linked;
            this.cardState = this.vmNic.plugged;
            this.BooleanToChar();


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

        // retrieve vm
        retrieveVm: function () {
            let self = this;
            this.$http.get('/compute/vmDetail?id=' + this.vmId).then(function (response) {
                self.vm = JSON.parse(JSON.stringify(response.data.resultKey));
                self.isHistory = false;
                // if (self.vm.vmNics.length > 0) {
                //     self.tempVmNics = JSON.parse(JSON.stringify(self.vm.vmNics[0]));
                //
                //     self.selectVo.selProfileVo.list = JSON.parse(JSON.stringify(self.tempVmNics.profileList));
                //     self.initData.profile = {name:JSON.parse(JSON.stringify(self.tempVmNics.profileName)), id:JSON.parse(JSON.stringify(self.tempVmNics.profileId))};
                //     self.selectVo.selProfileVo.selected = self.initData.profile;
                //
                //     if(self.selectVo.selProfileVo.list[0].name !== "비어있음"){
                //         self.selectVo.selProfileVo.list.unshift({id: "none", name: "비어있음"});
                //     }
                //
                // }
                self.selectVo.selProfileVo.list = [];
                for (let profile of self.vm.profileList) {
                    self.selectVo.selProfileVo.list.push({name: profile.profileName, id: profile.profileId});
                }

                self.selectVo.selProfileVo.selected = {...self.initData.profile};

                if (self.selectVo.selProfileVo.list[0].name !== "비어있음") {
                    self.selectVo.selProfileVo.list.unshift({...self.initData.profile});
                }

                self.nicCreate = {...self.nicUpdate};


                self.isSnapshot = false;
                self.checkMac = false;
                self.linkState = "true";
                self.cardState = "true";
                // this.BooleanToChar();

                if (self.vm.usageVos != null && self.vm.usageVos.length > 0) {
                    self.isHistory = true;
                } else {
                    self.isHistory = false;
                }


                if (self.isHistory) {
                    self.funcDonutChart(self.vm.usageVos[0].cpuUsages, "donut-chart1");
                    self.funcDonutChart(self.vm.usageVos[0].memoryUsages, "donut-chart2");
                    self.usage = JSON.parse(JSON.stringify(self.vm.usageVos));
                    self.funcAmCharts(self.usage);
                }
                // set last update
                self.lastUpdated = moment(new Date()).format("YYYY년 MM월 DD일 ddd a hh시 mm분 ss초");
                // console.log("vm", this.vm);
                self.retrieveVmDisks();
                self.retrieveVmSnapshots();

                // console.log(this.linkState);
                // console.log(this.cardState);
//				this.retrieveVmDevices();
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        // retrieve vm disks
        retrieveVmDisks: function () {
            this.$http.get('/compute/vm/disks?id=' + this.vmId).then(function (response) {
                this.vm.disks = response.data.resultKey;
                // console.log("disks",this.vm.disks)
//				this.tempDisk = response.data.resultKey[0];
                this.selectedDisks = this.vm.disks;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        // retrieve vm snapshots
        retrieveVmSnapshots: function () {
            this.$http.get('/compute/vm/snapshots?id=' + this.vmId).then(function (response) {

                this.selectedSnapshot = {id: ''};
                this.inPreview = false;
                this.locked = false;

                this.snapshots = response.data.resultKey;
                // console.log('snapshots',this.snapshots);
                // this.snapshots.push(this.snapshots[0]);

                for (let i = 0; i < this.snapshots.length; i++) {
                    if (this.snapshots[i].description === 'Active VM before the preview') {
                        this.snapshots = [...this.snapshots.filter((e, i) => {
                            return e.description !== 'Active VM'
                        })];
                        break;
                    }
                }
                this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        // retrieve vm devices
        retrieveVmDevices: function () {
            this.$http.get('/compute/vm/devices?id=' + this.vmId).then(function (response) {
                this.vm.devices = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        // retrieve vm events
        retrieveVmEvents: function () {
            this.$http.get('/compute/vm/events?id=' + this.vmId).then(function (response) {
                this.vm.events = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        // change upTime
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
        // go to vms
        vms: function () {
            location.href = '/compute/vms';
        },
        choice: function (id) {
            if (this.selectedSnapshot.id == id) {
                return true;
            } else {
                return false;
            }
        },
        selectSnapshot: function (snapshot) {
            if (!this.isSnapshot) {
                this.selectedSnapshot = snapshot;
                this.isSnapshot = true;
            } else {
                this.selectedSnapshot = {};
                this.isSnapshot = false;
            }


            // console.log("selectedSnapshot", this.selectedSnapshot);
        },

        BooleanToChar: function () {
            if (this.cardState === true) {
                this.cardState = "true"
            } else if (this.cardState === false) {
                this.cardState = "false"
            }
        },

        charToBoolean: function () {
            if (this.linkState === "true" && this.cardState === "true") {
                this.linkState = true;
                this.cardState = true;
            } else if (this.linkState === "true" && this.cardState === "false") {
                this.linkState = true;
                this.cardState = false;
            } else if (this.linkState === "false" && this.cardState === "true") {
                this.linkState = false;
                this.cardState = true;
            } else if (this.linkState === "false" && this.cardState === "false") {
                this.linkState = false;
                this.cardState = false;
            }
        },

        //by gtpark 가상머신 내 네트워크인터페이스 편집
        updateNic: function () {
            if (this.updateNetworkStatus === "ok") {
                this.nicUpdate.ipv4 = this.vmNic.ipv4;
                this.nicUpdate.ipv6 = this.vmNic.ipv6;
                this.nicUpdate.nicName = this.vmNic.nicName;
                this.nicUpdate.nicId = this.vmNic.nicId;
                if (this.checkMac && !this.isUpdate) {
                    this.nicUpdate.macAddress = this.vmNic.macAddress;
                } else {
                    this.nicUpdate.macAddress = this.vmNic.macAddress;
                }
                this.nicUpdate.id = this.vm.id;
                this.nicUpdate.profileId = this.vmNic.profileId;
                this.charToBoolean();
                this.nicUpdate.linked = this.linkState;
                this.nicUpdate.plugged = this.cardState;
                this.updateNetworkStatus = "";

                $("#vmNicModel").removeClass('active');
                this.spinnerOn = true;

                if (this.isUpdate) {
                    this.$http.post('/compute/vm/updateVmNic', this.nicUpdate).then(function (response) {
                        // console.log(response.data.resultKey);
                        this.retrieveVm();
                    }.bind(this)).catch(function (error) {
                        // console.log(error);
                    });
                } else {
                    this.$http.post('/compute/vm/createVmNic', this.nicUpdate).then(function (response) {
                        // console.log(response.data.resultKey);
                        this.retrieveVm();
                    }.bind(this)).catch(function (error) {
                        // console.log(error);
                    });
                    console.log("ggg")
                }

            } else {

                let checkNicName = this.vm.vmNics.filter((e, i) => {
                    return e.nicName === this.vmNic.nicName
                });

                if (checkNicName.length > 0 && !this.isUpdate) {
                    alert("네트워크 인터페이스 이름을 이미 사용 중입니다.");
                } else if (this.vmNic.nicName === "") {
                    alert("이름을 입력해주세요!");
                } else if (!this.isUpdate && !this.checkMac) {
                    this.updateNetworkStatus = "ok"
                    this.updateNic()
                } else if (!this.isUpdate && this.checkMac && this.vmNic.macAddress !== "" && this.checkMacAddress() === true) {
                    this.updateNetworkStatus = "ok"
                    this.updateNic()
                } else if (this.checkMacAddress() === false) {
                    alert("올바른 mac 주소 형식을 입력해 주세요!");
                } else if (this.checkMacAddress() === true) {
                    this.updateNetworkStatus = "ok"
                    this.updateNic()
                }
            }
        },
        removeNic: function () {
            $("#deleteVmNicModal").removeClass("active");
            this.spinnerOn = true;
            this.$http.post('/compute/vm/removeVmNic', this.vmNic).then(function (response) {
                // console.log(response.data.resultKey);
                this.retrieveVm();
            }.bind(this)).catch(() => {
                this.spinnerOn = false;
                // console.log(error);
            });

        },

        checkMacAddress: function () {
            var regExp = /^([0-9a-fA-F][0-9a-fA-F](?::|-*)){5}.[0-9a-fA-F]$/;
            return regExp.test(this.vmNic.macAddress);
        },

        createSnapshot: function () {
            if (this.snapNmStatus == 'ok') {
                this.newSnapshot.disks = this.selectedDisks;
                this.snapNmStatus = "";
                // $(".createsnapshotmodal").modal('hide');
                $("#snapshotCreateModal").removeClass("active");
                // this.spinnerOn = true;
                this.$http.post('/compute/vm/createSnapshot', this.newSnapshot).then(function (response) {
                    // console.log(response.data.resultKey);
                    let message = {};
                    message.title = "vmDetail";
                    message.id = this.vm.id;
                    message.body = JSON.stringify({
                        style: "success",
                        text: "스냅샷" + this.newSnapshot.description + "생성이 완료되었습니다."
                    });
                    this.selectedSnapshot = {};
                    this.$EventBus.$emit('message', message);
                    // location.href = '/compute/vm?id=' + this.vm.id;
                    // this.retrieveVmSnapshots();
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            } else {
                if (this.newSnapshot.description == undefined || this.newSnapshot.description === "") {
                    alert("설명을 입력해 주세요.");
                } else {
                    this.snapNmStatus = 'ok';
                    this.createSnapshot();
                }
            }
        },

        previewSnapshot: function () {
            // console.log("called previewSnapshot", this.selectedSnapshot);
            this.selectedSnapshot.vmId = this.vmId;
            this.selectedSnapshot.memoryRestore = this.memoryRestore;
            // $(".previewsnapshotmodal").modal('hide');
            $("#snapshotPreviewModal").removeClass("active");

            for (var i = 0; i < this.snapshots.length; i++) {
                if (this.selectedSnapshot.id == this.snapshots[i].id) {
                    this.snapshots[i].status = 'in_preview';
                }
            }

            this.$http.post('/compute/vm/previewSnapshot', this.selectedSnapshot).then(function (response) {
                // console.log("previewSnapshot", response.data.resultKey);

                // this.retrieveVmSnapshots();
                let message = {};
                message.title = "vmDetail";
                message.id = this.vm.id;
                message.body = JSON.stringify({
                    style: "success",
                    text: "스냅샷" + this.selectedSnapshot.description + "미리보기 전환이 완료되었습니다."
                });
                this.selectedSnapshot = {};
                this.$EventBus.$emit('message', message);
                // location.href = '/compute/vm?id=' + this.vm.id;


            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        commitSnapshot: function () {
            this.$http.get('/compute/vm/commitSnapshot?vmId=' + this.vmId).then(function (response) {
                // console.log("commitSnapshot", response.data.resultKey);
                // this.retrieveVmSnapshots();
                let message = {};
                message.title = "vmDetail";
                message.id = this.vm.id;
                message.body = JSON.stringify({style: "success", text: "스냅샷 커밋이 완료되었습니다."});
                this.selectedSnapshot = {};
                this.$EventBus.$emit('message', message);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        undoSnapshot: function () {
            this.$http.get('/compute/vm/undoSnapshot?vmId=' + this.vmId).then(function (response) {
                // console.log("undoSnapshot", response.data.resultKey);
                // this.retrieveVmSnapshots();
                let message = {};
                message.title = "vmDetail";
                message.id = this.vm.id;
                message.body = JSON.stringify({style: "success", text: "스냅샷 되돌리기가 완료되었습니다."});
                this.selectedSnapshot = {};
                this.$EventBus.$emit('message', message);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        removeSnapshot: function () {
            this.selectedSnapshot.vmId = this.vmId;
            // $(".removesnapshotmodal").modal('hide');
            $("#deleteSnapshotModal").removeClass("active");

            this.$http.post('/compute/vm/removeSnapshot', this.selectedSnapshot).then(function (response) {
                // console.log("removeSnapshot", response.data.resultKey);
                let message = {};
                message.title = "vmDetail";
                message.id = this.vm.id;
                message.body = JSON.stringify({
                    style: "success",
                    text: "스냅샷" + this.selectedSnapshot.description + " 삭제가 완료되었습니다."
                });
                this.selectedSnapshot = {};
                this.$EventBus.$emit('message', message);
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        closeDrop: function (){
            let curActiveBtnList = document.getElementsByClassName('btn-stat-chg');
            let curActiveBoxList = document.getElementsByClassName('target-stat-chg');

            for (let btn of curActiveBtnList) {
                btn.classList.remove('active');
            }

            for (let box of curActiveBoxList) {
                box.classList.remove('active');
            }

        },
        // start vm
        startVm: function () {
            this.closeDrop();
            var message = this.vm.name;
            let result = confirm('다음의 가상머신을 기동합니까?\n' + message);
            if(result){
                this.$http.post('/compute/startVm', [this.vm]).then(function (response) {
                    location.href = '/compute/vm?id='+this.vm.id;
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                    location.href = '/compute/vm?id='+this.vm.id;
                });
            }
        },

        // stop vm
        stopVm: function () {
            // console.log("vm stop", this.upVms);
            this.closeDrop();
            var message = this.vm.name;
            let result = confirm('다음의 가상머신을 정지시킵니까?\n' + message);
            if(result){
                this.$http.post('/compute/stopVm', [this.vm]).then(function (response) {
                    location.href = '/compute/vm?id='+this.vm.id;
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                    location.href = '/compute/vm?id='+this.vm.id;
                });
            }
        },

        // reboot vm
        rebootVm: function () {
            // console.log("vm reboot", this.upVms);
            this.closeDrop();
            var message = this.vm.name;
            let result = confirm('다음의 가상머신을 재부팅하시겠습니까?\n' + message);
            if(result){
                this.$http.post('/compute/rebootVm', [this.vm]).then(function (response) {
                    location.href = '/compute/vm?id='+this.vm.id;
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                    location.href = '/compute/vm?id='+this.vm.id;
                });
            }
        },

        // suspend vm
        suspendVm: function () {
            this.closeDrop();
            // console.log("vm suspend", this.upVms);
            var message = this.vm.name;
            let result = confirm('다음의 가상머신을 일시정지시킵니까?\n' + message);
            if(result){
                this.$http.post('/compute/suspendVm', [this.vm]).then(function (response) {
                    location.href = '/compute/vm?id='+this.vm.id;
                }.bind(this)).catch(function (error) {
                    location.href = '/compute/vm?id='+this.vm.id;
                    // console.log(error);
                });
            }
        },

        cloneVm: function () {
            // console.log('vmId:' + this.vmId + ", snapshotId:" + this.selectedSnapshot.id);

            // location.href = '/compute/cloneVmInfo?vmId=' + this.vmId + '&snapshotId=' + this.selectedSnapshot.id;
            let sendData = {vmId: this.vmId, snapshotId: this.selectedSnapshot.id};
            this.$EventBus.$emit('vmCloneModal', sendData);
        },
        setViewList: function (viewList) {
            this.pagingVo.viewList = viewList;
        }
    },
    computed: {
        pageCount: function () {
            let l = this.vm.events.length,
                s = this.size;
            return Math.floor(l / s);
        }
        ,
        paginatedData: function () {
            const start = this.pageNumber * this.size,
                end = start + this.size;
            return this.vm.events.slice(start, end);
        }
        ,
        selectAll: {
            get: function () {
                return this.selectedDisks ? (this.vm.disks != null && this.vm.disks.length > 0) && (this.selectedDisks.length == this.vm.disks.length) : false;
            }
            ,
            set: function (value) {

                var selected = [];

                if (value) {
                    this.vm.disks.forEach(function (disk) {
                        selected.push(disk);
                    });
                }

                this.selectedDisks = selected;

                // console.log("this.selectedDisks", this.selectedDisks);
            }
        }
    }
    ,
    watch: {
        snapshots: function () {
            for (var i = 0; i < this.snapshots.length; i++) {
                if (this.snapshots[i].status == 'in_preview') {
                    this.inPreview = true;
                } else if (this.snapshots[i].status == 'locked') {
                    this.locked = true;
                }
            }
        }
    }
    ,
    filters: {
        date: function (value) {
            if (value == undefined || isNaN(value) || value == '' || value == null) {
                return '';
            }

            return moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
    }
})
;