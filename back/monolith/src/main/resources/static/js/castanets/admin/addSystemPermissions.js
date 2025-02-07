new Vue({
	el: '#addSystemPermissions',
	data: {
		users: [],
		roles: [],
		spinnerOn: true
	},
	mounted: function() {
		this.retrieveRoles();
		this.retrieveAllUsers();
	}, 
	methods: {
		// retrieve all users
		retrieveAllUsers: function() {
			this.$http.get('/admin/users/retrieveAllUsers').then(function(response) {
				this.users = response.data.resultKey;
				
				// spinner off
				this.spinnerOn = false;
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		},
		// retrieve roles
		retrieveRoles: function() {
			this.$http.get('/admin/systemPermissions/retrieveRoles').then(function(response) {
				this.roles = response.data.resultKey;
			}.bind(this))
			.catch(function(error) {
			    console.log(error);
			});
		},
		// add system permissions
		addSystemPermissions: function() {
			var checked = false;
			
			// check permission setting
			for (var i in this.users) {
				if (this.users[i].roleId !== null) {
					checked = true;
					break;
				}
			}
			
			if (checked) {
				this.$http.post('/admin/systemPermissions/addSystemPermissions', this.users).then(function(response) {
					this.viewSystemPermissions();
				}.bind(this))
				.catch(function(error) {
				    console.log(error);
				});
			} else {
				alert('시스템 권한을 추가할 사용자가 없습니다.');
			}
		},
        viewSystemPermissions: function() {
        	location.href='/admin/systemPermissions';
        }
	}
})