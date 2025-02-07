Vue.prototype.$http = axios;

var templatesVue = new Vue({
    el: '#templates',
    data: {
        templates: [],
        selectedTemplates: [],
        spinnerOn: true,
        forceOverride: false,
        template: {
            name: '',
            exist: false
        },
        pagingVo: {
            viewList: []			//선택한 페이지 클릭시 보여주는 리스트
        }
    },
    mounted: function () {
        // subscribe
        this.wsSubscription();

        // get parameter
        this.retrieveTemplates();
        this.timer = setInterval(this.retrieveTemplates, 60000*5);
    },
    methods: {
        openModal: function (type) {
            this.closeBtn();
            if (type === "delete") {
                $("#deleteTemplateModal").addClass("active");
            } else if(type === "update"){
                this.$EventBus.$emit('openTemplateUpdateModal', this.selectedTemplates[0].id);

                if(type === 'update' && this.selectedTemplates.length >0){
                    this.selectTemplate(this.selectedTemplates[0]);
                }
            }
        },

        closeModal: function (type) {
            if (type === "delete") {
                this.selectTemplate(this.selectedTemplates[0]);
                $("#deleteTemplateModal").removeClass("active");
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


        // retrieve templates
        retrieveTemplates: function (type) {
            if(type === 'update'){
                this.spinnerOn = true;
            }
            this.$http.get('/compute/template/retrieveTemplates').then(function (response) {
                this.templates = response.data.resultKey;

                for (var templateIdx in this.templates) {

                    if (this.templates[templateIdx].name == "Blank") {
                        this.templates.splice(templateIdx, 1);
                        break;
                    }
                }

                for (let i = 0; i < this.templates.length; i++) {
                    if (i > 1) {
                        this.templates[i].idxFlag = true;
                    } else {
                        this.templates[i].idxFlag = false;
                    }
                }

                for (var i = 0; i < this.templates.length; i++) {
                    this.templates[i].creationTime = moment(this.templates[i].creationTime).format("YYYY년 MM월 DD일 a hh시 mm분 ss초");
                    this.templates[i].creationTime = this.templates[i].creationTime.replace('am', '오전');
                    this.templates[i].creationTime = this.templates[i].creationTime.replace('pm', '오후');
                }

                // console.log("templates", this.templates);
                setTimeout(()=>{
                    this.spinnerOn = false;
                },1000);

            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        selectTemplate: function (template) {

            var index = this.selectedTemplates.indexOf(template);

            if (index != -1) {
                this.selectedTemplates = [];
            } else {
                this.selectedTemplates = [];
                this.selectedTemplates.push(template);
            }
        },

        // create vm
        createVm: function () {
            if (this.selectedTemplates.length != 1) {
                alert("템플릿을 하나만 선택해 주세요.");
            } else {
                location.href = '/compute/createVmInfo?template=' + this.selectedTemplates[0].id;
            }
        },

        // update template
        updateTemplate: function () {
            if (this.selectedTemplates.length != 1) {
                alert("템플릿을 하나만 선택해 주세요.");
            } else {
                location.href = '/compute/updateTemplateInfo?id=' + this.selectedTemplates[0].id;
            }
        },

        // remove template
        removeTemplate: function () {
            this.spinnerOn = true;
            $("#deleteTemplateModal").removeClass("active");

            // console.log("remove selectedTemplates", this.selectedTemplates);

            if (this.selectedTemplates.length != 1) {
                alert("템플릿을 하나만 선택해 주세요.");
            } else {
                if (this.selectedTemplates[0].status == 'locked') {
                    alert("템플릿이 잠겨있습니다.");
                } else {
                    this.selectedTemplates[0].status = 'locked';

                    this.$http.post('/compute/removeTemplate?id=' + this.selectedTemplates[0].id).then(function (response) {
                        this.selectedTemplates = [];
                    }.bind(this)).catch(function (error) {
                        // console.log(error);
                    });
                }
            }
        },

        // check export template
        checkExportTemplate: function () {

            this.template.id = this.selectedTemplates[0].id;
            this.template.name = this.selectedTemplates[0].name;

            this.$http.post('/compute/checkExportTemplate?id=' + this.template.id).then(function (response) {
                this.template.exist = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });
        },

        // export template
        exportTemplate: function () {

            this.template.forceOverride = this.forceOverride;

            this.$http.post('/compute/exportTemplate', this.template).then(function (response) {
                this.selectedTemplates = [];
            }.bind(this)).catch(function (error) {
                // console.log(error);
            });

            this.template = {};
            this.forceOverride = false;

            $(".exporttemplatemodal").modal('hide');
        },

        // websocket
        wsConnectionWait: function () {
            setTimeout(function () {
                templatesVue.wsSubscription();
            }, 2000);
        },
        wsSubscription: function () {
            if (wsVue.stompClient != null && wsVue.stompClient.connected) {
                this.subscription = wsVue.stompClient.subscribe('/topic/templates', this.onMessage);
            } else {
                this.wsConnectionWait();
            }
        },
        onMessage: function (response) {
            var receive = JSON.parse(response.body);
            this.spinnerOn = false;
            // console.log("receive", receive);

            for (var i = 0; i < this.templates.length; i++) {
                if (this.templates[i].id == receive[0]) {
                    if (receive[1] == "removed") {
                        delete this.templates.splice(i, 1);
                        this.spinnerOn = false;
                    } else if (receive[1] == "failed") {
                        this.templates[i].status = 'ok';
                        this.spinnerOn = false;
                    }
                }
            }
        },
        setViewList: function(viewList) {
            this.pagingVo.viewList = viewList;
        }
    },
    filters: {
        truncate: function (string, limit) {
            var ellipsis;

            if (string != null && string.length > limit) {
                ellipsis = string.substring(0, limit) + '...'
            } else {
                ellipsis = string
            }

            return ellipsis;
        }
    }
})