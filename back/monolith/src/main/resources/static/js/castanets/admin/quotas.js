Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

var quotasVue = new Vue({
	router,
	el: '#quotasVue',
	data: {
		quotas: [],
		selectedQuotas: [],
		spinnerOn: true
	},
	mounted: function () {
		// console.log('quotasVue mounted');
		this.retrieveQuotas();
	},
	methods: {
		retrieveQuotas: function() {
			this.$http.get('/admin/quotas/retrieveQuotasInfo?')
			.then(function(response) {
				this.quotas = response.data.resultKey;
				// console.log("this.quotas",this.quotas);

				this.spinnerOn = false;
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		},
		removeQuota: function() {
			// console.log("selectedQuotas", this.selectedQuotas);
//			this.$http.get('/admin/quotas/removeQuota?id=' + this.selectedQuotas[0])
//			.then(function(response) {
//				this.retrieveClustersInfo();
//			}.bind(this))
//			.catch(function(error) {
//			    console.log(error);
//			});
		},
		goCreateQuota: function() {
			window.location.href = "/admin/createQuota";
		},
		goUpdateQuota: function() {
			window.location.href = "/admin/updateQuota?id=" + this.selectedClusters[0];
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
