/*
 * Developed by p a d o on 2019-03-12.
 * Last modified 2019-03-12 16:21:54.
 * Copyright (c) 2019 OKESTRO. All rights reserved.
 */

var router = new VueRouter({
	mode: 'history',
//	routes: []
});

new Vue({
	router: router,
	el: '#password',
	data: {
		user: {
			id: '',
			password: '',
			newPassword: '',
			confPassword: ''
		},
		containsEightCharacters: false,
		containsNumber: false,
		containsSpecialCharacter: false,
		backupPassword: '',
		backupNewPassword: '',
		spinnerOn: false
	},
	mounted: function() {
		this.$EventBus.$on('password', id =>{
			this.user.id = id;
			this.user.password = '';
			this.user.newPassword = '';
			this.user.confPassword = '';
		})
	},
	methods: {
		// update password
		updatePassword: function() {
			// check confirm password
			if (this.user.newPassword !== this.user.confPassword) {
				alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
				this.$refs.confPassword.focus();
				return false;
			}

			// encode
			this.backupPassword = this.user.password;
			this.user.password = btoa(this.user.password);

			this.backupNewPassword = this.user.newPassword;
			this.user.newPassword = btoa(this.user.newPassword);
			this.spinnerOn = true;
			// update password
			this.$http.post('/admin/users/updatePassword', this.user).then(function(response) {
				var result = response.data.resultKey;

				if (typeof result == 'number') {
					if (result > 0) {
						alert('비밀번호가 변경되었습니다.');
						document.getElementById('password').classList.remove('active');
					}
				} else {
					alert(result);
				}
			}.bind(this))
			.catch(function(error) {
				console.log(error);
			});

			// revert
			this.user.password = this.backupPassword;
			this.user.newPassword = this.backupNewPassword;
			this.spinnerOn = false;
		},
		// check password
		checkPassword: function() {
			const passwordFormat = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

			// check length
			if (this.user.newPassword.length >= 8) {
				this.containsEightCharacters = true;
			} else {
				this.containsEightCharacters = false;
			}

			// check contain number
			this.containsNumber = /\d/.test(this.user.newPassword);

			// check special character
			this.containsSpecialCharacter = passwordFormat.test(this.user.newPassword);
		},
		closePop: function(modalType){
			document.getElementById('password').classList.remove('active');
			this.user.id = '';
			this.user.password = '';
			this.user.newPassword = '';
			this.user.confPassword = '';
		}
	}
});