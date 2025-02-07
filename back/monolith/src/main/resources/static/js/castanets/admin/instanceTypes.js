Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
	router: router,
	el: '#instanceTypes',
	data: { 
		instanceTypes: [],
		selectedInstanceTypes: [],
		spinnerOn: true,
		pagingVo: {
			viewList: []			//선택한 페이지 클릭시 보여주는 리스트
		}
	},
	mounted: function() {
		// get parameter
		this.retrieveInstanceTypes();
	},
	methods: {
		// retrieve instance types
		retrieveInstanceTypes: function() {
			this.$http.get('/admin/retrieveInstanceTypes').then(function(response) {
				this.instanceTypes = response.data.resultKey;
				this.spinnerOn = false;

			}.bind(this)).catch(function(error) {
	            console.log(error);
	        });
		},
		
		selectInstanceType: function(instanceType) {
			if(this.selectedInstanceTypes.length == 0) {
				this.selectedInstanceTypes.push(instanceType);
			}else{
				if(this.selectedInstanceTypes[0].id === instanceType.id){
					//같은 작업 버튼 두번 클릭
					this.selectedInstanceTypes.splice(0, 1);
				}else{
					//다른 작업 버튼 클릭 시
					this.selectedInstanceTypes.splice(0, 1);
					this.selectedInstanceTypes.push(instanceType);
				}
			}
		},
		
		// create instance type
		// createInstanceType: function() {
		// 	location.href='/admin/createInstanceType';
		// },
		
		// update instance type
		// updateInstanceType: function() {
		// 	location.href='/admin/updateInstanceType?instanceTypeId=' + this.selectedInstanceTypes[0].id;
		// },
		
		// remove instance type
		removeInstanceType: function() {
			this.spinnerOn = true;
			this.$http.post('/admin/instanceType/removeInstanceType', this.selectedInstanceTypes[0])
				.then(function(response) {
					// alert(response.data.resultKey);
					location.href='/admin/instanceTypes';
				}.bind(this)).catch(function(error) {
					console.log(error);
				});

			this.spinnerOn = false;
		},

		openPop: function(modalType){
			if(modalType === 'targetInstanceType'){
				this.$EventBus.$emit('openUpdateModal', this.selectedInstanceTypes[0].id);
				document.getElementById(modalType).classList.add('active');

			}else {
				document.getElementById(modalType).classList.add('active');
			}
		},

		closePop: function (modalType){
			this.selectedInstanceTypes.splice(0, 1);
			this.togglePop();

			document.getElementById(modalType).classList.remove('active');
		},

		togglePop: function (){
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
	}
})
