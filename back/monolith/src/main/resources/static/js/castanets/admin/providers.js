new Vue({
	el: '#providers',
	data: {
		providers: [],
		selectedProviders: [],
		spinnerOn: true
	},
	mounted: function() {
		this.retrieveProviders();
	}, 
	methods: {
		// retrieve providers
		retrieveProviders: function() {
			this.$http.get('/admin/retrieveProviders').then(function(response) {
				this.providers = response.data.resultKey;
				
				// spinner off
				this.spinnerOn = false;
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		}
	},
	computed: {
        selectAll: {
            get: function () {
                return this.selectedProviders ? this.selectedProviders.length == this.providers.length : false;
            },
            set: function (value) {
                var selected = [];
                if (value) {
                    this.providers.forEach(function (provider) {
                    	selected.push(provider);
                    });
                }
                this.selectedProviders = selected;
            }
        }
    }
})