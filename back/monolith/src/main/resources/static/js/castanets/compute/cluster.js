Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});


var clusterVue = new Vue({
    router: router,
    el: '#clusterVue',
    data: {
        clusterId: '',
        cluster: {
            network: {},
            hostsDetail: []
        },
        chartData: {
            clusterMemoryTotal: 0,
            clusterMemoryFree: 0,
            clusterMemoryUsed: 0,
            clusterCpuIdleUsagePercent: 0,
            clusterCpuUsagePercent: 0,
            clusterCpuUsage: [0, 0],
            clusterMemoryUsage: [0, 0]
        },
        lastUpdated: '',
        spinnerOn: true,
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        }
    },// end data
    mounted: function () {
        //get parameter
        this.clusterId = this.$route.query.id;

        // 클러스터 상세 조회
        this.retrieveClusterDetail();

        this.timer = setInterval(this.retrieveClusterDetail, 60000);
    },// end mounted
    methods: {
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

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.XYChart);

            // Add data
            for (let usage of vmUsage) {
                var date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage.usageDate)))));
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                date.setHours(date.getHours()-9);
                var hour = date.getHours();
                var minute = date.getMinutes();

                // use = year + "년" + month + "월" + day + "일" + hour + "시" + minute + "분" + second + "초";
                // if (minute === 0) {
                    var usageForm = {
                        date: new Date(year, month, day, hour),
                        value1: usage.cpuUsages,
                        value2: usage.memoryUsages,
                        value3: usage.networkUsages
                    };
                    chart.data.push(usageForm);
                // }
            }
            // 시간 오름차순으로 안해주면 그래프 이상하게 나옴
            chart.data.reverse();

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

        retrieveClusterDetail: function () {
            this.$http.get('/v2/clusters/' + this.clusterId).then(function (response) {
                this.cluster = response.data.resultKey;

                //init chart data
                this.initChartData();


                // set last update
                var d = new Date();
                this.lastUpdated = d.toString();

                this.funcDonutChart(this.cluster.usageVos[0].cpuUsages, "donut-chart1");
                this.funcDonutChart(this.cluster.usageVos[0].memoryUsages, "donut-chart2");
                this.usage = JSON.parse(JSON.stringify(this.cluster.usageVos));
                this.funcAmCharts(this.usage);

                this.spinnerOn = false;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },// end retrieveClusterDetail
        initChartData: function () {
            // console.log(this.cluster);
            var memoryTotal = 0;
            var memoryFree = 0;
            var memoryUsed = 0;
            var idleCpuUsagePercent = 0;
            for (var i = 0; i < this.cluster.hostsDetail.length; i++) {
                var hostDetail = this.cluster.hostsDetail[i];
                memoryTotal = memoryTotal + hostDetail.memoryTotal;
                memoryFree = memoryFree + hostDetail.memoryFree;
                memoryUsed = memoryUsed + hostDetail.memoryUsed;
                if ("up" == hostDetail.status) {
                    idleCpuUsagePercent = idleCpuUsagePercent + hostDetail.idleCpuUsagePercent;
                } else {
                    idleCpuUsagePercent = idleCpuUsagePercent + 100;
                }
            }
//			this.cluster.hostsDetail.forEach(function(hostDetail){
//				memoryTotal = memoryTotal + hostDetail.memoryTotal;
//				memoryFree = memoryFree + hostDetail.memoryFree;
//				memoryUsed = memoryUsed + hostDetail.memoryUsed;
//				if("UP" == hostDetail.status){
//					idleCpuUsagePercent = idleCpuUsagePercent + hostDetail.idleCpuUsagePercent;	
//				}else{
//					idleCpuUsagePercent = idleCpuUsagePercent + 100;
//				}
//			});
            this.chartData.clusterMemoryTotal = memoryTotal;
            this.chartData.clusterMemoryFree = memoryFree;
            this.chartData.clusterMemoryUsed = memoryUsed;
            this.chartData.clusterCpuIdleUsagePercent = parseInt((idleCpuUsagePercent / this.cluster.hostsDetail.length).toFixed(0));
            this.chartData.clusterCpuUsagePercent = 100 - this.chartData.clusterCpuIdleUsagePercent;


            this.chartData.cpuUsage = this.cluster.cpuUsage;
            this.chartData.memoryUsage = this.cluster.memoryUsage;
        },// end initChartData
        getTotalNicsUsage: function (nicsUsage) {
            var total = 0;
            nicsUsage.forEach(function (nicUsage) {
                total = total + parseInt(nicUsage.receiveRatePercent) + parseInt(nicUsage.transmitRatePercent);
            });
            return (total / nicsUsage.length).toFixed(0);
        },// end getTotalNicsUsage
        goList: function () {
            location.href = '/compute/clusters';
        },// end goList
        setViewList: function(viewList) {
            this.pagingVo.viewList = viewList;
        }
    },// end methods
});
