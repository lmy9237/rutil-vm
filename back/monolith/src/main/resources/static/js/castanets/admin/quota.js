Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var quotasVue = new Vue({
	router,
	el: '#quotaVue',
	data: {
		quotaId:'',
		quota: {},
		events:[],
		pageNumber: 0,
		selectedNumber: 'btn btn-success btn-sm',
		unSelectedNumber: 'btn btn-default btn-sm',
		spinnerOn: true
	},
	props:{
		size:{
			type:Number,
			required:false,
			default: 10
		}
	},
	mounted: function () {
		// console.log('quotasVue mounted');
		this.quotaId = this.$route.query.id;
		// console.log('quotasVue mounted: ' + this.quotaId);
		this.retrieveQuotaDetail();
		this.retrieveQuotaEvent();
		this.timer = setInterval(this.retrieveHostDetail, 60000);
	},
	methods: {
		retrieveQuotaDetail: function() {
			this.$http.get('/admin/quotas/retrieveQuotaDetail?id=' + this.quotaId)
			.then(function(response) {
				this.quota = response.data.resultKey;
				this.spinnerOn = false;
				
				// console.log("this.quota",this.quota);
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
			this.spinnerOn = false;
		},
		retrieveQuotaEvent: function() {
			this.$http.get('/admin/quotas/retrieveQuotaEvents?id=' + this.quotaId)
			.then(function(response) {
				this.events = response.data.resultKey;
				// console.log("this.events",this.events);
			}.bind(this))
			.catch(function(error) {
				console.log(error);
			});
			this.spinnerOn = false;
		},
		goList: function() {
			location.href='/admin/quotas';
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
//			return moment(value).format('LT');
		},
		toFixed: function(value, num){
			if(value == undefined || isNaN(value) || value == '' || value == null){
				return '';
			}
			if(num == undefined){
				num = 0;
			}
			
			return value.toFixed(num);
		}
	},
})
