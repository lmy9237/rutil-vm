new Vue({
	el: '#users',
	data: {
		users: [],
		selectedUsers: [],
		spinnerOn: true,
		selectedUserInfo: {
			name: ''
		},
		pagingVo: {
			viewList: []			//선택한 페이지 클릭시 보여주는 리스트
		}
	},
	mounted: function() {
		this.retrieveUsers();

		this.$EventBus.$on('retrieveList', blank =>{
			this.retrieveUsers();
		})

		this.$EventBus.$on('closeAddModal', modalType =>{
			this.closePop(modalType);
		})
	},
	methods: {
		// retrieve users
		retrieveUsers: function() {
			this.spinnerOn = true;
			this.$http.get('/admin/users/retrieveUsers').then(function(response) {
				this.users = response.data.resultKey;
				this.spinnerOn = false;
			}.bind(this)).catch(function(error) {
			    console.log(error);
				this.spinnerOn = false;
			});
		},
		// remove users
		removeUsers: function() {
			if (this.selectedUsers.length <= 0) {
				alert('삭제할 사용자를 선택해 주십시오.');
			} else {
				if(this.selectedUserInfo.id === 'admin'){
					alert('admin 계정은 삭제할 수 없습니다.');
					return false;
				}else{
					this.spinnerOn = true;
					let removeIndex = [];
					removeIndex.push({ no: this.selectedUsers[0].no });

					this.$http.post('/admin/users/removeUsers', removeIndex).then(function(response) {
						this.selectedUsers = [];

						// retrieve users
						this.retrieveUsers();
					}.bind(this)).catch(function(error) {
						console.log(error);
					});
					this.spinnerOn = false;
				}
			}
			this.closePop('deleteModal');
		},
		setSelectUser: function(user){
			// this.selectedUsers = user;

			//selectedUsers 데이터가 있음
			if(this.selectedUsers.length != 0){
				if(this.selectedUsers[0].name == user.name){
					//1. 똑같은 정보를 누른 경우
					this.selectedUsers.splice(0, 1);
				}else{
					//2. 다른 정보 클릭한 경우
					this.selectedUsers.splice(0, 1);
					this.selectedUsers.push(user);
				}
			}else{
				this.selectedUsers.push(user);
			}
		},
		openPop: function (modalType){
			if(modalType === 'deleteModal'){
				this.selectedUserInfo = this.selectedUsers[0];
				document.getElementById('deleteModal').classList.add('active');
			}else if(modalType === 'addUser' || modalType === 'updateUser'){
				document.getElementById('addUser').classList.add('active');

				if(modalType === 'updateUser'){
					this.$EventBus.$emit('updateUser', this.selectedUsers[0].username);
				}
			}
		},
		closePop: function(modalType){

			this.selectedUsers.splice(0, 1);
			this.selectedUserInfo = [];

			document.getElementById(modalType).classList.remove('active');

			this.togglePop();
		},
		togglePop: function(){
			//list의 작업 컬럼 toggle
			var _this = $(this);
			var _target = _this.next('.openPop-target');
			$('.list-scroll-wrap .openPop-target').not(_target).removeClass('active');
			$('.list-scroll-wrap .btn-openPop').not(_this).removeClass('active');
			if(_target.hasClass('active')){
				_this.removeClass('active');
				_target.removeClass('active');
			}else{
				_this.addClass('active');
				_target.addClass('active');
			}
		},
		setViewList: function(viewList) {
			this.pagingVo.viewList = viewList;
		}
	},
	computed: {
        selectAll: {
            get: function () {
                return this.selectedUsers ? this.selectedUsers.length == this.users.length : false;
            },
            set: function (value) {
                var selected = [];

                if (value) {
                    this.users.forEach(function (user) {
                    	selected.push(user);
                    });
                }
                
                this.selectedUsers = selected;
            }
        }
    }
})