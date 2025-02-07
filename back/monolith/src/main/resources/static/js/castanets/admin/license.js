Vue.prototype.$http = axios;

var router = new VueRouter({
    mode: 'history',
//    routes: []
});

new Vue({
    router: router,
    el: '#license',
    data: {
        systemProperties : {},
        programVersion: {
            version: '',
            buildTime: ''
        }
    },
    mounted: function() {
        this.retrieveSystemProperties();
        this.retrieveProgramVersion();
    },
    methods: {
        // retrieve system properties
        retrieveSystemProperties: function() {
            this.$http.get('/admin/retrieveSystemProperties').then(function(response) {
                this.systemProperties = response.data.resultKey;
            }.bind(this)).catch(function(error) {
                console.log(error);
            });
        },

        saveLicense: function() {
            this.$http.post('/admin/', this.systemProperties).then(function(response) {
                if(response.data.resultKey > 0) {
                    alert("저장완료");
                }
            }.bind(this)).catch(function(error) {
                console.log(error);
            });
        },

        retrieveProgramVersion: function() {
            this.$http.get('/admin/retrieveProgramVersion').then(function(response) {
                var result = response.data.resultKey;
                this.programVersion.version = result[0];
                this.programVersion.buildTime = moment(result[1]).add(9, 'hours').format("YYYY년 MM월 DD일 A hh시 mm분");
            }.bind(this)).catch(function(error) {
                console.log(error);
            });
        }
    }
})