Vue.prototype.$http = axios;


$(document).ready(function() {
	
	init_IonRange();

});

/* ION RANGE SLIDER */

function init_IonRange() {
	
	if( typeof ($.fn.ionRangeSlider) === 'undefined'){ return; }
	// console.log('init_IonRangeSlider');
	$("#range_quota_cluster").ionRangeSlider({
		  type: "double",
		  min: 1,
		  max: 200,
		  from: 80,
		  to: 120,
		  from_max: 100,
		  to_min: 101,
		    onStart: function (data) {
		        createQuotaVue.quota.clusterSoftLimitPct = data.from;
		        createQuotaVue.quota.clusterHardLimitPct = data.to - 100;
		    },
		    onChange: function (data) {
		        createQuotaVue.quota.clusterSoftLimitPct = data.from;
		        createQuotaVue.quota.clusterHardLimitPct = data.to - 100;
		    },
		    onFinish: function (data) {
		        createQuotaVue.quota.clusterSoftLimitPct = data.from;
		        createQuotaVue.quota.clusterHardLimitPct = data.to - 100;
		    },
		    onUpdate: function (data) {
		        createQuotaVue.quota.clusterSoftLimitPct = data.from;
		        createQuotaVue.quota.clusterHardLimitPct = data.to - 100;
		    }
		  
	});
	$("#range_quota_storage").ionRangeSlider({
		  type: "double",
		  min: 1,
		  max: 200,
		  from: 80,
		  to: 120,
		  from_max: 100,
		  to_min: 101,
		    onStart: function (data) {
		        createQuotaVue.quota.storageSoftLimitPct = data.from;
		    		createQuotaVue.quota.storageHardLimitPct = data.to - 100;
		    },
		    onChange: function (data) {
		        createQuotaVue.quota.storageSoftLimitPct = data.from;
		        createQuotaVue.quota.storageHardLimitPct = data.to - 100;
		    },
		    onFinish: function (data) {
		        createQuotaVue.quota.storageSoftLimitPct = data.from;
		        createQuotaVue.quota.storageHardLimitPct = data.to - 100;
		    },
		    onUpdate: function (data) {
		        createQuotaVue.quota.storageSoftLimitPct = data.from;
		        createQuotaVue.quota.storageHardLimitPct = data.to - 100;
		    }
	});
}
 
var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var createQuotaVue = new Vue({
	router,
	el: '#createQuotaVue',
	data: {
		quotaId: '',
		isUpdate: false,
		quotaClusterLimitType: 'all',
		quotaStorageLimitType: 'all',
		quotaClusterLimitAll:{
			memoryLimit: -1,
			cpuLimit: -1
		},
		quotaClusterLimitSelect:[],
		quotaStorageLimitAll:{
			storageLimit: -1
		},
		quotaStorageLimitSelect:[],
		quota: {
			quotaClusterLimitList: [],
			quotaStorageLimitList: []
		},
		clusters: [],
		storageDomains: [],
		clusterModalData: {},
		sotrageModalData: {},
		spinnerOn: true
	},
	mounted: function () {
		// console.log('createQuotaVue mounted');
		this.quotaId = this.$route.query.id;
		if(this.quotaId === undefined){
			this.isUpdate=false;
		}else{
			this.isUpdate=true;
		}
		
		this.retrieveClusters();
		this.retrieveStorageDomains();
		if(this.isUpdate){
			this.retrieveCreateQuotaInfo();
		}
	},
	methods: {
		test: function() {
			// console.log(this.quota);
		},
		createQuota: function() {
			this.$http.post('/admin/quotas/createQuota', this.quota)
			.then(function(response) {
//				this.quota = response.data.resultKey;
// 				console.log("response.data.resultKey",response.data.resultKey);
//				location.href='/admin/quotas';
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		},
		updateQuota: function() {
			this.$http.post('/admin/quotas/updateQuota', this.quota)
			.then(function(response) {
//				this.quota = response.data.resultKey;
// 				console.log("response.data.resultKey",response.data.resultKey);
//				location.href='/admin/quotas';
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		},
		retrieveCreateQuotaInfo: function() {
			this.$http.get('/admin/quotas/retrieveCreateQuotaInfo?')
			.then(function(response) {
				this.quota = response.data.resultKey;
				// console.log("this.quota",this.quota);

				this.spinnerOn = false;
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		},
		retrieveClusters: function() {
			this.$http.get('/admin/quotas/retrieveClusters')
			.then(function(response) {
				this.clusters = response.data.resultKey;
				// console.log("this.clusters",this.clusters);
			}.bind(this))
			.catch(function(error) {
				console.log(error);
			});
		},
		retrieveStorageDomains: function() {
			this.$http.get('/admin/quotas/retrieveStorageDomains')
			.then(function(response) {
				this.storageDomains = response.data.resultKey;
				// console.log("this.storageDomains",this.storageDomains);
				if(!this.isUpdate){
					this.spinnerOn = false;
				}
			}.bind(this))
			.catch(function(error) {
				console.log(error);
			});
		},
		openModalCluster: function() {
			// show modal
			$(".quotaclustermodal").modal('show');
		},// enb openModalCpuMemory
		openModalStorage: function() {
			// show modal
			$(".quotastoragemodal").modal('show');
		},
		goList: function() {
			location.href='/admin/quotas';
		},
	},
	watch: {
		rangeStorage: function (val) {
	    		// console.log(this.rangeStorage);
	    		// console.log(val);
	    },
	    clusterType: function (val) {
	    		// console.log(val);
	    },
	},
	computed: {
        selectAll: {
            get: function () {
                return this.selectedQuotas ? this.selectedQuotas.length == this.quotas.length : false;
            },
            set: function (value) {
                var selected = [];

                if (value) {
                    this.quotas.forEach(function (quota) {
                    		selected.push(quota.id);
                    });
                }

                this.selectedQuotas = selected;
            }
        }
    },
})



