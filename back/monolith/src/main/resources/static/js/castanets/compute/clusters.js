Vue.prototype.$http = axios;

var clustersVue = new Vue({
    el: '#clustersVue',
    data: {
        clusters: [],
        selectedClusters: [],
        subscription: {},
        sendForm: {id: "", type: ""},
        spinnerOn: true,
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        }
    },// end data
    mounted: function () {
        this.retrieveClusters();

        // websocket subscription
        this.wsSubscription();

        this.timer = setInterval(this.retrieveClusters, 60000 * 5 );
    },// end mounted
    methods: {
        openModal:function (type){
            this.closeBtn();
            if (type === 'create') {
                this.sendForm.id = "";
                this.sendForm.type = "create";
                this.$EventBus.$emit('clusterModal', this.sendForm);
            } else if (type === 'update') {
                this.sendForm.id = this.selectedClusters[0].id;
                this.sendForm.type = "update";
                this.$EventBus.$emit('clusterModal', this.sendForm);

                if(type === 'update' && this.selectedClusters.length >0){
                    this.selectCluster(this.selectedClusters[0]);
                }
            } else if (type === 'delete') {
                $("#deleteClusterModal").addClass('active');
            }

        },
        closeModal: function (type){
            if(type === 'delete'){
                this.selectCluster(this.selectedClusters[0]);
                $("#deleteClusterModal").removeClass('active');
            }
        },
        closeBtn: function () {
            let curActiveBtnList = document.getElementsByClassName('btn-openPop');
            let curActiveBoxList = document.getElementsByClassName('openPop-target');

            for (let btn of curActiveBtnList) {
                btn.classList.remove('active');
            }

            for (let box of curActiveBoxList) {
                box.classList.remove('active');
            }
        },
        wsConnectionWait: function () {
            setTimeout(function () {
                clustersVue.wsSubscription();
            }, 2000);
        },
        wsSubscription: function () {
            if (wsVue.stompClient != null && wsVue.stompClient.connected) {
                this.subscription = wsVue.stompClient.subscribe('/topic/clusters/reload', this.onMessage);
            } else {
                this.wsConnectionWait();
            }
        },
        onMessage: function (res) {
            this.retrieveClusters();
        },
        retrieveClusters: function (type) {
            if(type === 'update'){
                this.spinnerOn = true;
            }
            this.$http.get('/v2/clusters').then(function (response) {
                this.clusters = response.data.resultKey;
                this.selectedClusters = [];

                setTimeout(()=>{
                    this.spinnerOn = false;
                },1000);

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },// end retrieveClusters
        goCreateCluster: function () {
            window.location.href = "/compute/createCluster";
        },// end goCreateCluster
        goUpdateCluster: function () {
            if (this.selectedClusters.length == 0) {
                alert("편집할 클러스터를 선택해주세요.");
            } else if (this.selectedClusters.length != 1) {
                alert("편집할 클러스터를 1개만 선택해주세요.");
            } else {
                window.location.href = "/compute/updateCluster?id=" + this.selectedClusters[0].id;
            }// end if
        },// end goUpdateCluster
        removeCluster: function () {
            if (this.selectedClusters.length == 0) {
                alert("삭제할 클러스터를 선택해주세요.");
                return;
            } else if (this.selectedClusters.length != 1) {
                alert("삭제할 클러스터를 1개만 선택해주세요.");
                return;
            }
            $("#deleteClusterModal").removeClass('active');
            // if (confirm('다음의 클러스터를 삭제하시겠습니까?\n' + this.selectedClusters[0].name)) {
                this.$http.delete('/v2/clusters/'+this.selectedClusters[0].id).then(function (response) {
                    this.spinnerOn = true;
                    this.retrieveClusters();
                    // selectedClusters 초기화
                    this.selectedClusters = [];
                }.bind(this)).catch(function (error) {
                    // console.log(error);
                });
            // }
        },// end removeCluster
        selectCluster: function (cluster) {
            var index = this.selectedClusters.indexOf(cluster);

            if (index != -1) {
                this.selectedClusters.splice(index, 1);
            } else {
                this.selectedClusters.push(cluster);
            }
        },// end selectCluster
        setViewList: function(viewList) {
            this.pagingVo.viewList = viewList;
        }
    },// end methods
    computed: {
        selectAll: {
            get: function () {
                return this.selectedClusters ? this.selectedClusters.length == this.clusters.length : false;
            },
            set: function (value) {
                var selected = [];

                if (value) {
                    this.clusters.forEach(function (cluster) {
                        selected.push(cluster);
                    });
                }

                this.selectedClusters = selected;
            }
        }
    },// end computed
})
