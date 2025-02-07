var router = new VueRouter({
    mode: 'history',
    scrollBehavior: function (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0};
        }
    },
//	routes: []
});

var overviewVue = new Vue({
    router: router,
    el: '#vmMetrics',
    data: {
        dashboardUri: '',
        name: '',
        from: '',
        to: '',
        lastUpdated: '',
        machineName: ''
    },
    mounted: function () {
        // get grafana uri
        this.getGrafanaUri();

        // get parameter
        this.name = this.$route.query.name == null ? 'undefined' : this.$route.query.name;

        // get from time(midnight)
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        this.from = Math.floor(d.getTime());

        // get to time(current)
        this.getCurrent();
        this.timer = setInterval(this.getCurrent, 300000);	// 5 minutes

        this.machineName = this.$route.query.machineName;
    },
    methods: {

        // get current
        getCurrent: function () {
            this.to = Math.floor(new Date().getTime());

            // set last update
            this.lastUpdated = moment(new Date()).format("YYYY년 MM월 DD일 ddd a hh시 mm분 ss초");
        },
        // get grafana uri
        getGrafanaUri: function () {
            this.$http.get('/compute/vm/metrics/uri').then(function (response) {
                this.dashboardUri = response.data.resultKey;
            }.bind(this))
                .catch(function (error) {
                    // console.log(error);
                });
        },
        // get grafana panel
        getPanel: function (type) {
            if (this.dashboardUri.length > 0) {
                if (type === 'cpu_usage') {
                    // return this.dashboardUri + '?orgId=1&panelId=1&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=1&theme=light&from=' + this.from + '&to=' + this.to;
                } else if (type === 'cpu_average') {
                    // return this.dashboardUri + '?orgId=1&panelId=2&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=2&theme=light&from=' + this.from + '&to=' + this.to;
                } else if (type === 'memory_usage') {
                    // return this.dashboardUri + '?orgId=1&panelId=3&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=3&theme=light&from=' + this.from + '&to=' + this.to;
                } else if (type === 'memory_distribution') {
                    // return this.dashboardUri + '?orgId=1&panelId=4&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=4&theme=light&from=' + this.from + '&to=' + this.to;
                } else if (type === 'network_utilization') {
                    // return this.dashboardUri + '?orgId=1&panelId=5&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=5&theme=light&from=' + this.from + '&to=' + this.to;
                } else if (type === 'network_traffic') {
                    // return this.dashboardUri + '?orgId=1&panelId=6&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=6&theme=light&from=' + this.from + '&to=' + this.to;
                } else if (type === 'disk_space') {
                    // return this.dashboardUri + '?orgId=1&panelId=7&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=7&theme=light&from=' + this.from + '&to=' + this.to;
                } else if (type === 'process') {
                    // return this.dashboardUri + '?orgId=1&panelId=8&theme=light&from=' + this.from + '&to=' + this.to + '&var-host=' + this.name;
                    return this.dashboardUri + '?orgId=1&var-host=' + this.machineName + '&panelId=8&theme=light&from=' + this.from + '&to=' + this.to;
                }
            } else {
                return '';
            }
        }
    }
});

