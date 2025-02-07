new Vue({
	el: '#systemPermissions',
	data: {
		permissions: [],
		selectedPermissions: [],
		spinnerOn: true
	},
	mounted: function() {
		this.retrieveSystemPermissions();
	}, 
	methods: {
		// retrieve system permissions
		retrieveSystemPermissions: function() {
			this.$http.get('/admin/systemPermissions/retrieveSystemPermissions').then(function(response) {
				this.permissions = response.data.resultKey;
				
				// spinner off
				this.spinnerOn = false;
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		},
		// remove sysem permissions
		removeSystemPermissions: function() {
			if (this.selectedPermissions.length <= 0) {
				alert('삭제할 권한이 없습니다.');
			}
			else {
				var message = '';
				for (var i in this.selectedPermissions) {
					message = message + this.selectedPermissions[i].user + '의 ' + this.selectedPermissions[i].role + ' 권한\n'
				}
				
				var checked = confirm(message + '을 삭제하시겠습니까?');
				
				if (checked) {
					// console.log(this.selectedPermissions);
					
					this.$http.post('/admin/systemPermissions/removeSystemPermissions', this.selectedPermissions).then(function(response) {
						this.selectedPermissions = [];
						
						// retrieve system permissions
						this.retrieveSystemPermissions();
					}.bind(this))
					.catch(function(error) {
					    console.log(error);
					});
				}
			}
		},
        viewAddSystemPermissions: function() {
        	location.href='/admin/systemPermissions/viewAddSystemPermissions';
        }
	},
	computed: {
        selectAll: {
            get: function () {
                return this.selectedPermissions ? this.selectedPermissions.length == this.permissions.length : false;
            },
            set: function (value) {
                var selected = [];

                if (value) {
                    this.permissions.forEach(function (permission) {
                    	selected.push(permission);
                    });
                }
                
                this.selectedPermissions = selected;
            }
        }
    }
})