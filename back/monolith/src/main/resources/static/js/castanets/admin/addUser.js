var router = new VueRouter({
	mode: 'history',
//	routes: []
});

new Vue({
	router: router,
	el: '#addUser',
	data: {
		user: {
			username: '',
			lastName: '',
			firstName: '',
			password: '',
			email: '',
			administrative: true
		},
        containsFourCharacters: false,
		containsKorean: false,
		validId: false,
        containsEightCharacters: false,
        containsNumber: false,
        containsSpecialCharacter: false,
		mode: 'create',
		backup: '',
		spinnerOn: false,
		createRoleSelectVo: {
			list: [
				{ id: true, name: '관리자' },
				{ id: false, name: '사용자' }
			],
			selected: { id: true, name: '관리자' }
		},
		initVal: {
			createRoleSelectVo: { id: true, name: '관리자' }
		}
	},
	mounted: function() {
		this.$EventBus.$on('updateUser', id => {
			this.user.username = id;
			this.retrieveUser();
			this.mode = 'update';
		})
	},
	methods: {
		// add user
		addUser: function() {
			// encode
			this.backup = this.user.password;
			this.user.password = btoa(this.user.password);
			this.blank = '';										//eventBus emit 형태를 갖추기 위한 의미없는 변수
			this.backupUser = JSON.parse(JSON.stringify(this.user));

			if (this.mode === 'create') {
				// add user
				this.$http.post('/admin/users/addUser', this.backupUser).then(function(response) {
					var count = response.data.resultKey;
					
					if (count <= 0) {
						alert('사용자를 추가하지 못했습니다. 사용자 중복 여부를 확인하여 주십시오.');
						return;
					}
					this.init();
                    this.$EventBus.$emit('closeAddModal', 'addUser');
                    this.$EventBus.$emit('retrieveList', this.blank);
				}.bind(this)).catch(function(error) {
				    console.log(error);
					alert('요청을 처리하는데 문제가 발생했습니다. 관리자에게 문의해주세요');
				});
			} else {
				// update user
				this.$http.post('/admin/users/updateUser', this.backupUser).then(function(response) {
					this.init();
					this.$EventBus.$emit('closeAddModal', 'addUser');
					this.$EventBus.$emit('retrieveList', this.blank);
				}.bind(this)).catch(function(error) {
				    console.log(error);
					alert('요청을 처리하는데 문제가 발생했습니다. 관리자에게 문의해주세요');
				});
			}

			// revert
			this.user.password = this.backup;
		},
		// check id
		checkId: function() {
            // check length
            this.containsFourCharacters = (this.user.username.length >= 4);

            // check a valid id
			const idFormat = /[ `~!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/;
            this.validId = !idFormat.test(this.user.username);

            // check korean
			const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
			this.containsKorean = !korean.test(this.user.username);
		},
		// check password
		checkPassword: function() {
			const passwordFormat = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

			// check length
			if (this.user.password.length >= 8) {
				this.containsEightCharacters = true;
			} else {
				this.containsEightCharacters = false;
			}

			// check contain number
			this.containsNumber = /\d/.test(this.user.password);

			// check special character
			this.containsSpecialCharacter = passwordFormat.test(this.user.password);
		},
		// retrieve user
		retrieveUser: function() {
			// this.spinnerOn = true;
			this.$http.get('/admin/users/retrieveUser?id=' + this.user.username).then(function(response) {
				this.user = response.data.resultKey;

				// check password
				this.checkPassword();

				// check id
				this.checkId();

				if(this.user.administrative){
					this.createRoleSelectVo.selected = { id: true, name:'관리자' };
				}else{
					this.createRoleSelectVo.selected = { id: false, name:'사용자' };
				}
			}.bind(this)).catch(function(error) {
			    console.log(error);
			});
		},
		setSelected: function (selectedItems){
			this.user.administrative = selectedItems.id;
		},
		closePop: function(modalType){
			document.getElementById(modalType).classList.remove('active');
			this.$EventBus.$emit('closeAddModal', 'addUser');
			this.init();
		},
		init: function (){
			this.user.username = '';
			this.user.lastName = '';
			this.user.firstName = '';
			this.user.password = '';
			this.user.email = '';
			this.user.administrative = true;
			this.createRoleSelectVo.selected = this.initVal.createRoleSelectVo;
			this.mode = 'create';
		},
		openPop: function (modalType){
			document.getElementById(modalType).classList.add('active');
			this.$EventBus.$emit('password', this.user.username);
		}
	}
})