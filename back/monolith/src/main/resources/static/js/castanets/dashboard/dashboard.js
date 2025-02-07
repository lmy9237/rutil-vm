new Vue({
    el: '#dashboard',
    data: {
        isHistory : false,
        isChart: false,
        cpuUsage: [],
        memoryUsage: [],
        networkUsage: [],
        storageUsage: [],
        dataCenter: {},
        events: [],
        lastUpdated: '',
        spinnerOn: true,
        vms: [],
        hosts: [],
        vmTop: [],
        hostTop: [],
        status: 'all',
        pagingVo: {
            viewListVm: [],
            viewListHost: [],
        }
    },
    mounted: function () {

        $(document).on('click', ".btn-rotate", function () {
            var _target = $(this).closest('.csb-boxB');
            if ($(this).hasClass('open')) {
                _target.removeClass("backRotate").addClass("cardRotate");
            } else {
                _target.removeClass("cardRotate").addClass("backRotate");
            }

        });

        this.retrieveDashboard();
        this.timer = setInterval(this.retrieveDashboard, 60000);
        this.retrieveVirtualMachine();
        this.retrieveHost();
        this.retrieveVms();
        this.retrieveHosts();


        // this.$EventBus.$on('setViewList', viewList=>{
        //     console.log('### viewList = ', viewList);
        //
        // })
        //paging-component
        // this.$EventBus.$on('getCurrentIndexData', index =>{
        //     //선택한 index값에 따라 보여지는 paging index, 데이터 조절
        //     this.pagingVo.dataListVm = [];
        //     this.pagingVo.dataListHost = [];
        //
        //     //전체 리스트에서 가져올 영역 설정
        //     let start = 0;
        //     let end = 0;
        //
        //     end = ((index+1) * this.pagingVo.pagingNumVm);
        //     start = end - this.pagingVo.pagingNumVm;
        //
        //     //전체 데이터 중에 start부터 end 구간만 보여줌
        //     this.pagingVo.dataListVm = JSON.parse(JSON.stringify(this.vms)).slice(start, end);
        //     this.pagingVo.dataListHost = JSON.parse(JSON.stringify(this.hosts)).slice(start, end);
        // });
    },
    methods: {
        // retrieve dashboard
        retrieveDashboard: function () {

            this.retrieveDataCenterStatus();
            this.retrieveEvents();
            // set last update
            this.lastUpdated = moment(new Date()).format("YYYY년 MM월 DD일 ddd a hh시 mm분 ss초");
        },
        // retrieve data center status
        retrieveDataCenterStatus: function () {
            this.$http.get('/v2/dashboard/dataCenter')
                .then(function (response) {
                    this.dataCenter = response.data.resultKey;
                    this.isHistory = false;
                    this.isChart = false;

                    if(this.dataCenter.usingcpu != null || this.dataCenter.memoryUsed != null || this.dataCenter.storageUsed != null){
                        this.isHistory = true;
                        //  CPU 전체 사용량
                        this.funcDonutChart((this.dataCenter.usingcpu / this.dataCenter.totalcpu * 100).toFixed(1), 'cpu_donut-chart');
                        //  메모리 전체 사용량
                        this.funcDonutChart((this.dataCenter.memoryUsed / this.dataCenter.memoryTotal * 100).toFixed(1), 'memory_donut-chart');
                        //  스토리지 전체 사용량
                        this.funcDonutChart((this.dataCenter.storageUsed / (this.dataCenter.storageAvaliable + this.dataCenter.storageUsed) * 100).toFixed(1), 'storage_donut-chart');
                    }

                    if(this.dataCenter.usageVos.length > 0){
                        this.isChart = true;
                        // cpuUsage_chart
                        this.makeChartData('cpuUsage', [...this.dataCenter.usageVos]);

                        // //  memoryUsage_chart
                        this.makeChartData('memoryUsage', [...this.dataCenter.usageVos]);

                        // //  networkUsage_chart
                        this.makeChartData('networkUsage', [...this.dataCenter.usageVos]);

                        // //  storageUsage_chart
                        this.makeChartData('storageUsage', [...this.dataCenter.usageVos]);
                    }

                }.bind(this))
                .catch( (error)=> {
                    this.spinnerOn = false;
                    console.log(error);
                });
        },
        // retrieve events
        retrieveEvents: function () {
            this.$http.get('/v2/dashboard/events')
                .then(function (response) {
                    this.events = response.data.resultKey;
                }.bind(this))
                .catch((error) => {
                    this.spinnerOn = false;
                    console.log(error);
                });
        },
        getMemoryTotal: function () {
            return (this.dataCenter.memoryTotal / Math.pow(1024, 3)).toFixed(0);
        },
        getMemoryFree: function () {
            return (this.dataCenter.memoryFree / Math.pow(1024, 3)).toFixed(0);
        },
        getStorageTotal: function () {
            return ((this.dataCenter.storageAvaliable + this.dataCenter.storageUsed) / Math.pow(1024, 4)).toFixed(1);
        },
        getStorageFree: function () {
            return (this.dataCenter.storageAvaliable / Math.pow(1024, 4)).toFixed(1);
        },
        getLevelColor: function (val) {
            if (0 <= Number(val) && Number(val) < 25) {
                return "lack";
            } else if (25 <= Number(val) && Number(val) < 85) {
                return "fitness";
            } else {
                return "enough";
            }
        },
        getCardPosition: function (vmIdx){
          if(vmIdx % 2 === 0){
              return "left";
          } else {
              return "right";
          }

        },
        getHostLevelColor: function (cpu, memory, network) {
            let valList = [cpu, memory, network];

            let maxNum = valList.sort((a, b) => {
                return a - b;
            })[2];

            let level = this.getLevelColor(maxNum);

            return level;
        },
        getBarVal: function (val) {

            return {width: val + '%'};
        },
        retrieveVirtualMachine: function () {

            //가상머신 cpu, memory 사용량 큰 순으로 정렬 jh
            // this.$http.get('/compute/vmList?status=all').then(function (response) {
            this.$http.get('/v2/dashboard/vms').then(function (response) {
                this.vmTop = response.data.resultKey;
                // console.log('this.vms = ', this.vms);

            }.bind(this)).catch(function (error) {
                console.log(error);
            });
        },
        retrieveVms: function () {

            this.$http.get('/compute/vmList?status=' + this.status).then(function (response) {
                this.vms = response.data.resultKey;

                for (let vm of this.vms) {
                    if (vm.ipAddress === "") {
                        vm.ipv4 = "-";
                    } else if (vm.ipAddress !== "" && vm.ipAddress.indexOf(':') > -1) {
                        let ip = vm.ipAddress.split('/');
                        vm.ipv4 = ip[0];
                        vm.ipv6 = ip[1];
                    } else {
                        let ip = vm.ipAddress.split('/');
                        vm.ipv4 = ip[0];
                    }
                }

                this.spinnerOn = false;

                // this.pagingVo.flag = 'vm';
                //paging-component list 전달
                // this.$EventBus.$emit('totalList', this.vms, this.pagingVo.pagingNumVm, this.pagingVo.flag);

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },
        retrieveHosts: function (vms) {

            this.$http.get('/compute/hosts/retrieveHostsInfo?status=' + this.status).then(function (response) {
                this.hosts = response.data.resultKey;

                // this.pagingVo.flag = 'host';
                //paging-component list 전달
                // this.$EventBus.$emit('totalList', this.hosts, this.pagingVo.pagingNumHost, this.pagingVo.flag);
            }.bind(this)).catch(function (error) {

            });
        },// end retrieveHosts

        retrieveHost: function () {
            this.$http.get('/v2/dashboard/hosts?status=all').then(function (response) {
                this.hostTop = response.data.resultKey;
                // console.log('hosts = ', this.hosts);

            }.bind(this)).catch( (error)=> {
                this.spinnerOn = false;
                console.log(error);
            });
        },
        totalNicsUsage: function (nicsUsage) {
            var total = 0;
            nicsUsage.forEach(function (nicUsage) {
                total + nicUsage.receiveRatePercent + nicUsage.transmitRatePercent;
            });
            return total;
        },
        makeChartData: function (type, UsageData) {
            //cpu_Usage_chart
            if (type === 'cpuUsage') {
                let sendCpuUsage = [];
                for (let usage of UsageData) {
                    var date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage.usageDate)))));
                    var minute = date.getMinutes();
                    date.setHours(date.getHours() - 9);

                    if (minute === 0 || minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50) {
                        var usageForm = {
                            category: date.getHours()+":" + date.getMinutes(),
                            first: usage.cpuUsages
                        };
                        sendCpuUsage.push(usageForm);
                    }
                }
                sendCpuUsage.reverse();

                if(sendCpuUsage.length > 8){
                    sendCpuUsage = sendCpuUsage.splice(-8, sendCpuUsage.length);
                }

                this.funcClustedChart('cpuUsage_chart', sendCpuUsage);
            }
            //memory_Usage_chart
            else if (type === 'memoryUsage') {
                let sendMemoryUsage = [];
                for (let usage of UsageData) {
                    date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage.usageDate)))));
                    minute = date.getMinutes();
                    date.setHours(date.getHours() - 9);

                    if (minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50) {
                    usageForm = {
                        date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()),
                        value: usage.memoryUsages,
                        hour: date.getHours(),
                        minute: date.getMinutes()
                    };
                    sendMemoryUsage.push(usageForm);
                    }
                }
                sendMemoryUsage.reverse();

                if(sendMemoryUsage.length > 8){
                    sendMemoryUsage = sendMemoryUsage.splice(-8, sendMemoryUsage.length);
                }

                this.funcCurvedChart('memoryUsage_chart', sendMemoryUsage, '#00aac5');
            }
            //network_usage_chart
            else if (type === 'networkUsage') {
                let sendNetworkUsage = [];
                for (let usage of UsageData) {
                    date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage.usageDate)))));
                    minute = date.getMinutes();
                    date.setHours(date.getHours() - 9);

                    if (minute === 10 || minute === 20 || minute === 30 || minute === 40 || minute === 50) {
                        usageForm = {
                            date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()),
                            value: usage.receiveUsages,
                            value2: usage.transitUsages,
                            hour: date.getHours(),
                            minute: date.getMinutes()
                        };
                        sendNetworkUsage.push(usageForm);
                    }
                }
                sendNetworkUsage.reverse();

                if(sendNetworkUsage.length > 8){
                    sendNetworkUsage = sendNetworkUsage.splice(-8, sendNetworkUsage.length);
                }


                this.funcCurvedChart('networkUsage_chart', sendNetworkUsage, '#b620e0', '#2d6afb');
            }
            //storage_usage_chart
            else {
                let sendStorageUsage = [];
                for (let usage of UsageData) {
                    date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage.storageUsageDate)))));
                    minute = date.getMinutes();
                    date.setHours(date.getHours() - 9);

                    if (minute === 0) {
                        usageForm = {
                            date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()),
                            hour: date.getHours(),
                            value: usage.storageUsages,

                        };
                        sendStorageUsage.push(usageForm);
                    }


                    // if (sendStorageUsage.length > 6) {
                    //     break;
                    // }

                }
                sendStorageUsage.reverse();

                if(sendStorageUsage.length > 8){
                    sendStorageUsage = sendStorageUsage.splice(-8, sendStorageUsage.length);
                }


                this.funcCurvedChart('storageUsage_chart', sendStorageUsage, '#795bf2');
            }
        },
        funcClustedChart: (id, datajbj) => {
            am4core.ready(() => {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                var chart = am4core.create(id, am4charts.XYChart)

                chart.data = datajbj;

                var xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
                xAxis.dataFields.category = 'category'
                xAxis.renderer.minGridDistance = 30;
                xAxis.renderer.grid.template.location = 0;
                xAxis.renderer.labels.template.fill = am4core.color("#cacdda");
                xAxis.renderer.minLabelPostion = 0.05;
                xAxis.renderer.maxLabelPostion = 0.95;
                xAxis.tooltip.disabled = true;

                var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
                yAxis.min = 0;
                yAxis.max = 100;
                yAxis.tooltip.disabled = true;
                yAxis.renderer.labels.template.fill = am4core.color("#cacdda");

                function createSeries(value, name, barColor) {
                    var series = chart.series.push(new am4charts.ColumnSeries())
                    series.dataFields.valueY = value
                    series.dataFields.categoryX = 'category'
                    series.fill = am4core.color(barColor);
                    series.name = name

                    series.events.on("hidden", arrangeColumns);
                    series.events.on("shown", arrangeColumns);

                    var columnTemplate = series.columns.template;
                    columnTemplate.width = 6;
                    columnTemplate.column.cornerRadiusTopLeft = 4;
                    columnTemplate.column.cornerRadiusTopRight = 4;
                    columnTemplate.strokeOpacity = 0;

                    return series;
                }

                createSeries('first', 'The First', '#2639cb');
                createSeries('second', 'The Second', '#7d87ff');
                createSeries('third', 'The Third', '#92eaff');

                function arrangeColumns() {

                    var series = chart.series.getIndex(0);

                    var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
                    if (series.dataItems.length > 1) {
                        var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                        var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                        var delta = ((x1 - x0) / chart.series.length) * w;
                        if (am4core.isNumber(delta)) {
                            var middle = chart.series.length / 2;

                            var newIndex = 0;
                            chart.series.each(function (series) {
                                if (!series.isHidden && !series.isHiding) {
                                    series.dummyData = newIndex;
                                    newIndex++;
                                } else {
                                    series.dummyData = chart.series.indexOf(series);
                                }
                            })
                            var visibleCount = newIndex;
                            var newMiddle = visibleCount / 2;

                            chart.series.each(function (series) {
                                var trueIndex = chart.series.indexOf(series);
                                var newIndex = series.dummyData;

                                var dx = (newIndex - trueIndex + middle - newMiddle) * delta

                                series.animate({
                                    property: "dx",
                                    to: dx
                                }, series.interpolationDuration, series.interpolationEasing);
                                series.bulletsContainer.animate({
                                    property: "dx",
                                    to: dx
                                }, series.interpolationDuration, series.interpolationEasing);
                            })
                        }
                    }
                }

                function createGrid(elm, value) {
                    var range = elm.axisRanges.create();
                    range.value = value;
                    range.label.text = "{value}";
                }

                createGrid(yAxis, 10);
                createGrid(yAxis, 30);
                createGrid(yAxis, 50);
                createGrid(yAxis, 70);
                createGrid(yAxis, 90);

            }); // end am4core.ready()
        },
        funcCurvedChart: (id, dataobj, lineColor1, lineColor2) => {
            am4core.ready(() => {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                // Create chart
                var chart = am4core.create(id, am4charts.XYChart);

                // Add data
                chart.data = dataobj;

                // tooltip text
                var tooltipTxt = '';
                if (id == 'networkUsage_chart') {
                    tooltipTxt = "수신\n{value} GB {date}({hour}:{minute})\n송신\n{value2} GB {date}({hour}:{minute})";
                } else if (id == 'memoryUsage_chart') {
                    tooltipTxt = "{value} GB {date}({hour}:{minute})";
                } else if (id == 'storageUsage_chart') {
                    tooltipTxt = "{value} GB {date}({hour}:00)";
                }

                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.minGridDistance = 30;
                dateAxis.startLocation = 0.5;
                dateAxis.endLocation = 0.5;
                dateAxis.renderer.labels.template.fill = am4core.color("#cacdda");
                dateAxis.renderer.minLabelPostion = 0.05;
                dateAxis.renderer.maxLabelPostion = 0.95;
                dateAxis.tooltip.disabled = true;

                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.max = 100;
                valueAxis.tooltip.disabled = true;
                valueAxis.renderer.labels.template.fill = am4core.color("#cacdda");

                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = "date";
                series.dataFields.valueY = "value";
                series.tooltipText = "value: [bold]{valueY}[/]";
                series.stroke = am4core.color(lineColor1);
                series.strokeWidth = 2;
                series.fillOpacity = 1;
                series.tensionX = 0.77;
                series.tensionY = 0.77;
                series.tooltipText = tooltipTxt;
                series.tooltip.pointerOrientation = "down";
                series.tooltip.getFillFromObject = false;
                series.tooltip.background.strokeWidth = 0;
                series.tooltip.background.fill = am4core.color("#000000")
                series.tooltip.background.fillOpacity = 0.7;
                series.tooltip.fontSize = 13;
                series.tooltip.background.cornerRadius = 5;
                series.tooltip.dy = -12;

                var series2 = chart.series.push(new am4charts.LineSeries());
                series2.dataFields.dateX = "date";
                series2.dataFields.valueY = "value2";
                series2.tooltipText = "value: [bold]{valueY}[/]";
                series2.stroke = am4core.color(lineColor2);
                series2.strokeWidth = 2;
                series2.fillOpacity = 1;
                series2.tensionX = 0.77;
                series2.tensionY = 0.77;
                series2.tooltip.disabled = true;

                function funcLineGradient(elm, lineColor) {
                    var gradient = new am4core.LinearGradient();
                    gradient.addColor(am4core.color(lineColor), 0.7);
                    gradient.addColor(am4core.color("#ffffff"), 0);
                    gradient.rotation = 90;
                    elm.fill = gradient;
                }

                funcLineGradient(series, lineColor1)
                funcLineGradient(series2, lineColor2)

                function createGrid(elm, value) {
                    var range = elm.axisRanges.create();
                    range.value = value;
                    range.label.text = "{value}";
                }

                createGrid(valueAxis, 10);
                createGrid(valueAxis, 30);
                createGrid(valueAxis, 50);
                createGrid(valueAxis, 70);
                createGrid(valueAxis, 90);


                chart.cursor = new am4charts.XYCursor();
                chart.cursor.lineY.opacity = 0;

            }); // end am4core.ready()

        },
        funcDonutChart: function (data, elm) {
            var _this = $('#' + elm);
            var _dcNum = (301 * (100 - data)) / 100 * -1;
            _this.find('circle').css({
                "strokeDashoffset": -301,
                "strokeDasharray": 301
            });
            _this.find('circle').stop().delay(300).animate({
                "strokeDashoffset": _dcNum
            }, 500);
        },
        funcLineGradient: function (elm, lineColor) {
            var gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color(lineColor), 0.7);
            gradient.addColor(am4core.color("#ffffff"), 0);
            gradient.rotation = 90;
            elm.fill = gradient;
        },
        createGrid: function (elm, value) {
            var range = elm.axisRanges.create();
            range.value = value;
            range.label.text = "{value}";
        },
        setViewList: function(viewList, flag) {
            if(flag === 'vms'){
                this.pagingVo.viewListVm = viewList;
            }else if(flag === 'hosts'){
                this.pagingVo.viewListHost = viewList;
            }else{

            }
        },
    },

    filters: {
        date: function (value) {
            if (value == undefined || isNaN(value) || value == '' || value == null) {
                return '';
            }

            return moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
    }
})