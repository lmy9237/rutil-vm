var wsVue = new Vue({
	el: '#wsVue',
	data: {
		url: "/websocket/karajan",
		stompClient: null,
		subscription: {}
	},
	mounted: function () {
		this.connect();
		this.$EventBus.$on("message", msg=>{
			this.onMessage(msg);
		});
	},
	methods: {
		connect: function() {
			this.stompClient = Stomp.over(new SockJS(this.url, {heartbeat: false}));
//			this.stompClient = webstomp.over(new SockJS(this.url, {heartbeat: false}));
			this.stompClient.debug = () => {};
			this.stompClient.connect({}, this.stompSuccessCallback, this.stompFailureCallback)
		},
		stompSuccessCallback (frame) {
			// console.log("success", this.stompClient);
			this.wsSubcribe();
		},
		stompFailureCallback (error) {
		     // console.log('STOMP close: Connected: ',  this.stompClient.connected);
		     // console.log('STOMP close: Connected: ',  this.stompClient);
//		     setTimeout( this.connect(), 2000);
//		     console.log('STOMP: Reconecting in 2 seconds');
		},
		wsSubcribe: function () {
			this.subscription = this.stompClient.subscribe('/topic/notify', this.onMessage);
			this.spinnerOn = false;
		},
//		wsUnsubscribe: function () {
//			this.subscription.unsubscribe();
//			this.subscription = {};
//		},
		// global notify
		onMessage: function (response) {
			if(response.title !=="undefined" || response.title !=null || response.title !== ""){
				setTimeout(()=>{
					this.$EventBus.$emit(response.title, response)
				},2000);
			}

			var message = JSON.parse(response.body);
			var image = '';
			
			// set image
			if (message.style === 'info') {
				image = "<i class='fa fa-question'></i>";
			} else if (message.style === 'success') {
				image = "<i class='fa fa-check'></i>";
			} else if (message.style === 'error') {
				image = "<i class='fa fa-exclamation'></i>";
			} else if (message.style === 'warning') {
				image = "<i class='fa fa-warning'></i>";
			}
			
			$.notify({
	            title: message.title,
	            text: message.text,
	            image: image
	        }, {
	            style: 'metro',
	            className: message.style,
	            autoHide: true
	        });


		}
	},
})


