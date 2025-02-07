Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
    router: router,
    el: '#template',
    data: {
//		vm: {
//			vmNic: {
//				ipv4: null
//			},
//			vmSystem: {
//				totalVirtualCpus: 0
//			},
//			cpuUsage: [
//				[0, 0]
//			],
//			memoryUsage: [
//				[0, 0]
//			],
//			events: []
//		},
//		lastUpdated: '',
        pageNumber: 0,
        selectedNumber: 'btn btn-success btn-sm',
        unSelectedNumber: 'btn btn-default btn-sm',
//		tempDisk: {},
        template: {
            vm: {
                status: ''
            },
            cluster: {
                name: ''
            },
            vms:[],
            nics: [],
            templateDisks:[],
            systemInfo: {
                totalVirtualCpus: 0
            },
            events: []
        },
        spinnerOn: true,
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        }
    },
    props: {
        size: {
            type: Number,
            required: false,
            default: 10
        }
    },
    mounted: function () {
        // get parameter
        this.templateId = this.$route.query.id;

        this.retrieveTemplate();
    },
    methods: {
        // retrieve template
        retrieveTemplate: function () {
            this.$http.get('/compute/template/retrieveTemplate?id=' + this.templateId)
                .then(function (response) {
                    this.template = response.data.resultKey;

                    // set last update
//				var d = new Date();
//				this.lastUpdated = moment(d).format("YYYY년 MM월 DD일 ddd a hh시 mm분 ss초");

                    //  console.log("template", this.template);
                    this.spinnerOn = false;

//				this.retrieveVmDisks();
//				this.retrieveVmSnapshots();
//				this.retrieveVmDevices();
                }.bind(this)).catch(function (error) {
                //  console.log(error);
            });
        },

        // retrieve vm disks
//		retrieveVmDisks: function() {
//			this.$http.get('/compute/vm/disks?id=' + this.vmId).then(function(response) {
//				this.vm.disks = response.data.resultKey;
//				this.tempDisk = response.data.resultKey[0];
//			}.bind(this)).catch(function(error) {
//	             console.log(error);
//	        });
//		},

        // retrieve vm events
//		retrieveVmEvents: function() {
//			this.$http.get('/compute/vm/events?id=' + this.vmId).then(function(response) {
//				this.vm.events = response.data.resultKey;
//			}.bind(this)).catch(function(error) {
//	             console.log(error);
//	        });
//		},

        // paging
        nextPage: function () {
            this.pageNumber++;
        },
        prevPage: function () {
            this.pageNumber--;
        },
        movePage: function (number) {
            this.pageNumber = number - 1;
        },
        isSelected: function (number) {
            if (this.pageNumber == number - 1) {
                return true;
            }
        },
        eventType: function (severity) {
            if (severity == 'normal') {
                return 'fa fa-check green';
            } else if (severity == 'error') {
                return 'fa fa-times red';
            } else if (severity == 'warning') {
                return 'fa fa-exclamation purple';
            }
        },
        // go to templates
        goTemplates: function () {
            location.href = '/compute/templates';
        },
        setViewList: function(viewList) {
            this.pagingVo.viewList = viewList;
        }
    },
    computed: {
        pageCount: function () {
            let l = this.template.events.length,
                s = this.size;
            return Math.floor(l / s);
        },
        paginatedData: function () {
            const start = this.pageNumber * this.size,
                end = start + this.size;
            return this.template.events.slice(start, end);
        }
    },
    filters: {
        date: function (value) {
            if (value == undefined || isNaN(value) || value == '' || value == null) {
                return '';
            }

            var result = moment(value).format("YYYY. MM. DD. a hh:mm:ss");
            result = result.replace('am', '오전');
            result = result.replace('pm', '오후');
            return result;
        }
    }
});