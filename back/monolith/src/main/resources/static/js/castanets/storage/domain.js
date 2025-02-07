Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var domainVue = new Vue({
	router: 	router,
	el: '#domainVue',
	data: {
		domainId: '',
		domain: {},
		events: [],
		lastUpdated: '',
		pageNumber: 0,
		selectedNumber: 'btn btn-success btn-sm',
		unSelectedNumber: 'btn btn-default btn-sm',
		spinnerOn: true,
		pagingVo: {
			viewListDisk: [],
			viewListEvent: [],
			viewListDiskSnapshot: []
		}
	},
	props:{
		size:{
			type:Number,
			required:false,
			default: 10
		}
	},
	mounted: function () {
		// get parameter
		this.domainId = this.$route.query.id;
		
		this.retrieveDomain();
		this.retrieveDomainEvents();
//		this.timer = setInterval(this.retrieveClustersInfo, 60000);
	},
	methods: {
		retrieveDomain: function() {
			this.$http.get('/v2/storage/domains/' + this.domainId)
				.then(function(response) {
					this.domain = response.data.resultKey;
					this.spinnerOn = false;

					//donut chart css효과
					var _dcNum =  (this.domain.diskUsed / (this.domain.diskUsed + this.domain.diskFree) * 100).toFixed(0);
					_dcNum = (195 * (100 - _dcNum)) / 100 * -1;

					document.getElementById('donutCircle').setAttribute('style', 'stroke-dashoffset : -195px; stroke-dasharray : 195px');

					$('#donutCircle').stop().delay(300).animate({
						"strokeDashoffset" : _dcNum
					},500);

					this.funcAmCharts(this.domain.storageDomainUsages);


			}.bind(this)).catch(function(error) {
			    console.log(error);
			});
		},
		retrieveDomainEvents: function() {
			this.$http.get('/v2/storage/domains/'+this.domainId+'/events').then(function(response) {
				this.events = response.data.resultKey;
			}.bind(this)).catch(function(error) {
			    console.log(error);
			});
		},
		goBack: function() {
			history.back();
		},
		// paging
		nextPage: function(){
			this.pageNumber++;
		},
		prevPage: function(){
			this.pageNumber--;
		},
		movePage: function(number){
			this.pageNumber = number - 1;
		},
		isSelected: function(number) {
			if(this.pageNumber == number - 1) {
				return true;
			}
		},
		eventType: function(severity) {
			if (severity == 'normal') {
				return 'fa fa-check green';
			} else if (severity == 'error') {
				return 'fa fa-times red';
			} else if(severity == 'warning') {
				return 'fa fa-exclamation purple';
			}
		},
        goDomains: function(){
            window.location.href = "/storage/domains";
        },
		funcAmCharts: function (storageDomainUsages) {

			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			// Create chart instance
			var chart = am4core.create("chartdiv", am4charts.XYChart);

			// Add data
			for (let usage of storageDomainUsages) {
				var date = new Date(JSON.parse(JSON.stringify(Math.floor(Number(usage[0])))));
				var year = date.getFullYear();
				var month = date.getMonth();
				var day = date.getDate();
				var hour = date.getHours();
				var minute = date.getMinutes();

				var use = year + "년" + month + "월" + day + "일" + hour + "시" + minute + "분";
				// console.log('data = ', use)
				// console.log('data val = ', usage[1]);

				if(minute === 0){
					var usageForm = {date: new Date(year, month, day, hour), value1: usage[1].slice(0, 5)};
					chart.data.push(usageForm);
				}
			}
			// 시간 오름차순으로 안해주면 그래프 이상하게 나옴
			chart.data.reverse();
			// console.log('chart.data =', chart.data);

			// Create axes
			var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.renderer.minGridDistance = 100;
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
			series.tooltipText = "{date}\n스토리지 사용률 {value1}%";
			series.tooltip.pointerOrientation = "down";
			series.tooltip.getFillFromObject = false;
			series.tooltip.background.strokeWidth = 0;
			series.tooltip.background.fill = am4core.color("#000000");
			series.tooltip.background.fillOpacity = 0.7;
			series.tooltip.fontSize = 13;
			series.tooltip.fontFamily = 'NotoSansCJKkr-Bold';
			series.tooltip.background.cornerRadius = 5;
			series.tooltip.dy = -12;

			// Add cursor
			chart.cursor = new am4charts.XYCursor();
			chart.cursor.xAxis = dateAxis;
		},

		setViewList: function(viewList, flag) {
			if(flag === 'disk'){
				this.pagingVo.viewListDisk = viewList;
			}else if(flag === 'event'){
				this.pagingVo.viewListEvent = viewList;
			}else if(flag === 'diskSnapshot'){
				this.pagingVo.viewListDiskSnapshot = viewList;
			}
		}
	},
	computed:{
		pageCount: function(){
			let l = this.events.length,
				s = this.size;
			return Math.floor(l/s);
		},
		paginatedData: function(){
			const start = this.pageNumber * this.size,
					end = start + this.size;
			return this.events.slice(start, end);
		}
	},
	filters: {
		date: function(value){
			if(value == undefined || isNaN(value) || value == '' || value == null){
				return '';
			}
			
			return moment(value).format("YYYY MM DD HH:mm:ss");
		}
	}
})