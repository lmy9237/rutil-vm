Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
	router: router,
	el: '#systemProperties',
	data: {
		systemProperties: {},
		programVersion: {
			version: '',
			buildTime: ''
		},
		menuFlag: false,
		symphonyPowerControlVo: {
			list: [
				{
					id: "true",
					name: '사용안함'
				},
				{
					id: "false",
					name: '사용함'
				}
			],
			selected: {}
		}
	},
	mounted: function() {
		this.retrieveSystemProperties();
		this.retrieveProgramVersion();
	},
	methods: {
		// retrieve system properties
		retrieveSystemProperties: function() {
			this.$http.get('/admin/retrieveSystemProperties').then(function(response) {
				this.systemProperties = response.data.resultKey;

				if(this.systemProperties.id == null || this.systemProperties.id == '') {
					this.systemProperties.password = 'admin';
				}
				if(this.systemProperties.vncPort == null || this.systemProperties.vncPort == ''){
					this.systemProperties.vncPort = '9999';
				}
				if(this.systemProperties.grafanaUri == null || this.systemProperties.grafanaUri == ''){
					this.systemProperties.grafanaUri = 'https://:3000/d-solo/8CzwBk1mk/vm-metrics';
				}
				if(this.systemProperties.deepLearningUri == null || this.systemProperties.deepLearningUri == ''){
					this.systemProperties.deepLearningUri = 'https://:25000/symphony/makeLearning';
				}

				if(this.systemProperties.symphonyPowerControll == null || this.systemProperties.symphonyPowerControll.toString() == ''){
					this.symphonyPowerControlVo.selected.id = "true";
					this.symphonyPowerControlVo.selected.name = "사용안함";
				}else{
					this.symphonyPowerControlVo.selected.id = this.systemProperties.symphonyPowerControll.toString();

					if(this.systemProperties.symphonyPowerControll){
						this.symphonyPowerControlVo.selected.name = "사용안함";
					}else{
						this.symphonyPowerControlVo.selected.name = "사용함";
					}
				}
			}.bind(this)).catch(function(error) {
	            console.log(error);
	        });
		},

		saveSystemProperties: function() {
    		this.$http.post('/admin/saveSystemProperties', this.systemProperties).then(function(response) {
    			if(response.data.resultKey > 0) {
    				alert("저장완료");
    			}
			}.bind(this)).catch(function(error) {
	            console.log(error);
	        });
		},

		syncIPInfo : function(){
			this.tempIP = this.systemProperties.ip;
			this.systemProperties.vncIp = this.tempIP;
			this.systemProperties.grafanaUri = 'https://'+this.tempIP+':3000/d-solo/8CzwBk1mk/vm-metrics';
			this.systemProperties.deepLearningUri = 'https://'+this.tempIP+':25000/symphony/makeLearning';
		},

		ctrlDetailMenu : function(){
			// menuFlag == false : display none
			// menuFlag == true : display show
			if(this.menuFlag == false){
				this.menuFlag = true;
			}else{
				this.menuFlag = false;
			}
		},

		retrieveProgramVersion: function() {
			this.$http.get('/admin/retrieveProgramVersion').then(function(response) {
				var result = response.data.resultKey;
				this.programVersion.version = result[0];
				this.programVersion.buildTime = moment(result[1]).add(9, 'hours').format("YYYY년 MM월 DD일 A hh시 mm분");
			}.bind(this)).catch(function(error) {
				console.log(error);
			});
		},

		setSelected: function (selected){
			this.symphonyPowerControlVo.selected.id = selected.id;
			this.symphonyPowerControlVo.selected.name = selected.name;

			if(selected.id === 'true'){
				//this.systemProperties.symphonyPowerControll = true (사용안함)
				this.systemProperties.symphonyPowerControll = true;
			}else{
				//this.systemProperties.symphonyPowerControll = false (사용함)
				this.systemProperties.symphonyPowerControll = false;
			}
		}
	}
})