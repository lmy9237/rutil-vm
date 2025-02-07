var karajanVue = new Vue({
    el: '#karajan',
    data: {
        initData:{
            cluster:{name: "", id:""}
        },
        selectVo: {
            selClusterVo: {
                size: "mid",
                list: [{name: "", id: ""}],
                index: 10000,
                selected: {name: "전체", id: "selectAll"}
            }
        },
        karajan: {},
        consolidations: [],
        search: '',
        lastUpdated: '',
        selectedClusterId: '',
        selectedCluster: {},
        subscription: {},
        systemProperties: {},
        spinnerOn: true
    },
    watch: {
        selectedClusterId: function (id) {
            // do not use foreach
            for (var i = 0; i < this.karajan.clusters.length; i++) {
                if (this.karajan.clusters[i].id === id) {
                    this.selectedCluster = this.karajan.clusters[i];
                }
            }
        }
    },
    filters: {
        truncate: function (string, limit) {
            var ellipsis;

            if (string.length > limit) {
                ellipsis = string.substring(0, limit) + '...'
            } else {
                ellipsis = string
            }

            return ellipsis;
        }
    },
    mounted: function () {
        // subscribe
        this.wsSubscribe();

        // retrieve data center status
        this.retrieveDataCenterStatus();
        this.timer = setInterval(this.retrieveDataCenterStatus, 300000);	// 5 minutes

        // add event listener
        this.$el.addEventListener('click', this.onClick);
    },
    updated: function () {
        setCollapse();
    },
    beforeDestroy: function () {
        // remove event listener
        this.$el.removeEventListener('click', this.onClick)
    },
    methods: {
        openModal:function (){

        },
        closeModal:function (type){
            if(type==='reorderVm'){
                $("#vmReorderModal").removeClass('active');
            }
        },
        setSelected: function (selectData, index) {
            if (index === 10000) {
                this.selectedClusterId = selectData.id;
            }
        },
        // retrieve data center status
        retrieveDataCenterStatus: function (type) {
            if(type === 'update'){
                this.spinnerOn = true;
            }

            this.$EventBus.$emit('resetSelBox', 'symphony');
            this.$http.get('/symphony/retrieveDataCenterStatus').then(function (response) {
                this.karajan = response.data.resultKey;
                this.selectVo.selClusterVo.list = JSON.parse(JSON.stringify(this.karajan.clusters));

                // set selected cluster
                if (this.karajan.clusters.length > 0) {
                    if (this.selectedClusterId == '') {
                        this.initData.cluster = {name:JSON.parse(JSON.stringify(this.karajan.clusters[0].name)), id:JSON.parse(JSON.stringify(this.karajan.clusters[0].id))};
                        this.selectedClusterId = this.karajan.clusters[0].id;
                        this.selectVo.selClusterVo.selected = this.initData.cluster;
                    } else {
                        // do not use foreach
                        for (var i = 0; i < this.karajan.clusters.length; i++) {
                            if (this.karajan.clusters[i].id === this.selectedClusterId) {
                                this.selectedCluster = this.karajan.clusters[i];
                            }
                        }
                    }
                }


                // set last update
                var d = new Date();
                this.lastUpdated = d.toString();

                // spinner off
                this.spinnerOn = false;

                //init selectBox
                setTimeout(data => {
                    this.$EventBus.$emit('initSelectBox', 'symphony', this.karajan.clusters[0].name);
                }, 10);
            }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        },
        // migrate virtual machine
        migrateVm: function (hostName, vmName, hostId, vmId, hostIndex, vmIndex) {
            var checked = confirm(vmName + '을 ' + hostName + '으로 이동하시겠습니까?');

            if (checked) {
                this.$http.get('/symphony/migrateVm?hostId=' + hostId + '&vmId=' + vmId).then(function (response) {
                    // set status
                    if (response.data.resultKey.toLowerCase() == 'migrating') {
                        this.selectedCluster.hosts[hostIndex].vms[vmIndex].status = response.data.resultKey.toLowerCase();
                    } else {
                        alert(response.data.resultKey);
                    }
                }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        // consolidate virtual machines
        consolidateVms: function (clusterId) {
            this.spinnerOn = true;
            // retrieve system properties
            this.$http.get('/admin/retrieveSystemProperties').then(function (response) {
                this.systemProperties = response.data.resultKey;
            }.bind(this)).catch(function (error) {
                console.log(error);
            });

            // consolidate
            this.$http.get('/symphony/consolidateVm?clusterId=' + clusterId).then(function (response) {
                this.consolidations = response.data.resultKey;

                if (this.consolidations.length > 0) {
                    // show modal
                    // $(".consolidateModal").modal('show');
                    this.spinnerOn = false;
                    $("#vmReorderModal").addClass('active');
                } else {
                    alert('재배치 할 가상머신이 없습니다.');
                    this.spinnerOn = false;
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
                this.spinnerOn = false;
            });
        },
        // relocate virtual machines
        relocateVms: function () {
            // hide modal
            // $(".consolidateModal").modal('hide');
            this.spinnerOn = true;
            $("#vmReorderModal").removeClass('active');

            this.$http.post('/symphony/relocateVms', this.consolidations).then(function (response) {
                setTimeout(()=>{
                    this.spinnerOn = false;
                    },3000);

                //@ ignore
            }.bind(this)).catch(function (error) {
                console.log(error);
                setTimeout(()=>{
                    this.spinnerOn = false;
                },2000);
            });
        },
        // search for virtual machine name
        filteredVms: function (vms) {
            var name = this.search;

            return vms.filter(function (vm) {
                return (vm.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
            })
        },
        onClick: function (event) {
            if (!event.target.matches('.dropbtn')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");

                for (var i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];

                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        },
        showMenu: function (name, status) {
            // remove show all
            var dropdowns = document.getElementsByClassName("dropdown-content");

            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];

                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }

            if (status == 'up') {
                document.getElementById(name).classList.toggle('show');
            }
        },
        setHostIcon: function (value) {
            if (value === 'up') {
                return 'fa fa-arrow-up green';
            } else if (value === 'connecting') {
                return 'fa fa-spinner gray';
            } else if (value === 'down') {
                return 'fa fa-arrow-down red';
            } else if (value === 'error') {
                return 'fa fa-arrow-down red';
            } else if (value === 'initializing') {
                return 'fa fa-arrow-up gray';
            } else if (value === 'install_failed') {
                return 'fa fa-exclamation-triangle red';
            } else if (value === 'installing') {
                return 'fa fa-hdd-o gray';
            } else if (value === 'installing_os') {
                return 'fa fa-hdd-o gray';
            } else if (value === 'maintenance') {
                return 'fa fa-wrench gray';
            } else if (value === 'preparing_for_maintenance') {
                return 'fa fa-wrench blue';
            } else if (value === 'non_operational') {
                return 'fa fa-ban red';
            } else if (value === 'non_responsive') {
                return 'fa fa-ban red';
            } else if (value === 'unassigned') {
                return 'fa fa-arrow-up blue';
            } else if (value === 'reboot') {
                return 'fa fa-repeat green';
            } else if (value === 'kdumping') {
                return 'fa fa-arrow-up gray';
            } else if (value === 'pending_approval') {
                return 'fa fa-arrow-up gray';
            } else {
                return 'fa fa-arrow-down red';
            }
        },
        setVmIcon: function (status, placementPolicy) {
            if (status === 'up') {
                if (placementPolicy === 'pinned') {
                    return 'fa fa-ban text-danger';
                }

                return 'fa fa-desktop';
            } else if (status === 'powering_up') {
                return 'fa fa-arrow-up blue';
            } else if (status === 'powering_down') {
                return 'fa fa-arrow-down blue';
            } else if (status === 'suspended') {
                return 'fa fa-moon-o blue';
            } else if (status === 'saving_state') {
                return 'fa fa-floppy-o blue';
            } else if (status === 'reboot_in_progress') {
                return 'fa fa-repeat green';
            } else if (status === 'migrating') {
                return 'fa fa-spinner fa-spin green';
            } else {
                return 'fa fa-question-circle-o text-danger';
            }
        },
        setProgressBar: function () {

        },

        setUsageColor: function (value, type) {
            let result = "", color = "";

            if (type === "host") {
                result = 'stat-per ';
                // set color
                if (value <= 20) {
                    color = 'stat-enhancement';
                } else if (value > 20 && value <= 40) {
                    color = 'stat-minor';
                } else if (value > 40 && value <= 60) {
                    color = 'stat-average';
                } else if (value > 60 && value <= 80) {
                    color = 'stat-major';
                } else if (value > 80) {
                    color = 'stat-critical';
                }
            } else if (type === "vm") {
                result = 'bar ';
                // set color
                if (value <= 20) {
                    color = 'bar-enhancement';
                } else if (value > 20 && value <= 40) {
                    color = 'bar-minor';
                } else if (value > 40 && value <= 60) {
                    color = 'bar-average';
                } else if (value > 60 && value <= 80) {
                    color = 'bar-major';
                } else if (value > 80) {
                    color = 'bar-critical';
                }
            }
            // console.log(result + color);
            return result + color;

        },
        setAppboxBgColor: function (value) {
            if (value <= 20) {
                return 'appbox bg-gray';
            } else if (value > 20 && value <= 40) {
                return 'appbox bg-green';
            } else if (value > 40 && value <= 60) {
                return 'appbox bg-blue';
            } else if (value > 60 && value <= 80) {
                return 'appbox bg-orange';
            } else if (value > 80) {
                return 'appbox bg-red';
            }
        },
        wsConnectionWait: function () {
            setTimeout(function () {
                karajanVue.wsSubscribe();
            }, 2000);
        },
        wsSubscribe: function () {
            if (wsVue.stompClient != null && wsVue.stompClient.connected) {
                this.subscription = wsVue.stompClient.subscribe('/topic/migrateVm', this.onMessage);
            } else {
                this.wsConnectionWait();
            }
        },
        onMessage: function (response) {
            // console.log('body', response.body);

            if (JSON.parse(response.body).style == 'success') {
                // retrieve data center status
                this.retrieveDataCenterStatus();
            } else {
                // on error message
                alert(response.body);
            }
        },
    }
});

// set collapse
function setCollapse() {
    // remove event
    $('.collapse-link').off('click');

    // add event
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });
}