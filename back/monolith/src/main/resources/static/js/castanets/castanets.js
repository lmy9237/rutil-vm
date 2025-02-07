Vue.prototype.$http = axios;
Vue.prototype.$EventBus = new Vue();

Vue.component('chart-doughnut', {
    extends: VueChartJs.Doughnut,
    props: [
        'used',
        'free'
    ],
    data: function () {
        return {
            options: {
                legend: false,
                responsive: false,
                maintainAspectRatio: false
            }
        }
    },
    watch: {
        free: function () {
            // destroy chart
            if (this.$data._chart) {
                this.$data._chart.destroy();
            }

            this.initChartDoughnut();
        }
    },
    mounted: function () {
        this.initChartDoughnut();
    },
    methods: {
        initChartDoughnut: function () {
            if (typeof (Chart) === 'undefined') {
                return;
            }

            if ($(this.$el).length) {
                this.renderChart({
                    labels: [
                        'Used',
                        'Free'
                    ],
                    datasets: [{
                        data: [(this.used / (this.free + this.used) * 100).toFixed(1), (this.free / (this.free + this.used) * 100).toFixed(1)],
                        backgroundColor: [
                            '#26B99A',
                            '#BDC3C7'
                        ],
                        hoverBackgroundColor: [
                            '#36CAAB',
                            '#CFD4D8'
                        ]
                    }]
                }, this.options);
            }
        }
    }
});

// custom-select 컴퍼넌트화 by gtpark
Vue.component('selectbox-component', {

    //셀렉박스 옵션값은 title 로 제어 by gtpark
    template:
        '<div class="custom-select" :class="{ \'custom-select--active\' : isActive}" :style="[setSize(size)]" v-click-outside="outside">' +
        '<button v-if="selectvo != null" class="custom-select__option custom-select__option--value" @click="setIsActive(true,selectItem)" :style="[setSelBtnSize(title)]" :disabled="disabled">{{selectvo.selected.name}}</button>' +
        '<div class="custom-select__dropdown mCustomScrollbar" :style="{\'display\' : isShow}">' +
        // '<div class="mCustomScrollBox mCS-dark-thin mCSB_vertical mCSB_inside" style="max-height: 150px; overflow: auto">' +
        '<div class="mCustomScrollBox mCS-dark-thin mCSB_vertical mCSB_inside" style="max-height: 150px; overflow: auto" :style="[setSelDirection(title)]">' +
        '<button v-if="selectvo != null && selectvo.list != null" class="custom-select__option" :class="{\'custom-select__option--selected\' : selectvo.selected.id == data.id}"  v-for="(data, index) in selectvo.list" @click="setHide(false, data)">{{data.name}}</button>' +
        '</div>' +
        '</div>' +
        '</div>',

    props: [
        'disabled',
        'size',
        'selectvo',
        'index',
        'searchSelect',
        'flag',
        'title'],

    data: function () {
        return {
            isShow: "none",
            isClick: true,
            initTitle: "",
            cnt: 0,
            selectedData: "",
            initData: 0,
            isActive: false,
            selectItem: {
                name: "전체",
                id: "all"
            }
        }
    },

    methods: {
        setSelBtnSize: function (title) {
            if (title === undefined || title === null || title === "") {
                return "";
            } else if (title === "symphony") {
                return {paddingTop: '14px', paddingBottom: '14px'};
            }
        },
        setSize: function (size) {
            if (size === undefined || size === null || size === "") {
                return "";
            } else if(size === "large"){
                return {width: '650px', height: '37px'};
            }
            else if (size === "mid") {
                return {width: '150px', height: '44px'};
            } else if (size === "small") {
                return {width: '70px', margin: '15px'};
            }
        },
        setSelDirection:function (title){
            if (title !== "priority") {
                return {maxHeight: '150px'};
            } else if (title === "priority") {
                return {maxHeight: 'none'};
            }
        },
        setIsActive: function (at, value) {
            if (this.isClick) {
                this.selectItem = value;
                if (at) {
                    if (this.isActive) {
                        this.isShow = "none";
                        this.isActive = false;
                    } else {
                        this.isActive = at;
                        this.isShow = "";
                    }
                }
            }
        },
        setHide: function (at, value) {
            this.isActive = at;
            this.isShow = "none";
            this.selectItem = value;
            this.selectvo.selected = value;
            if(this.title === 'nic'){
                this.callback(value, this.selectvo.listIdx);
            } else {
                this.callback(value);
            }

        },

        callback: function (selectedData, listIdx) {
            this.$emit('setselected', selectedData, this.index, listIdx);
        },
        outside: function () {
            this.isActive = false;
            this.isShow = "none";
        }
    },
    directives: {
        'click-outside': {
            bind: function (el, binding, vNode) {
                // Provided expression must evaluate to a function.
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name
                    let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
                    if (compName) {
                        warn += `Found in component '${compName}'`
                    }
                    console.warn(warn)
                }
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e)
                    }
                }
                el.__vueClickOutside__ = handler

                // add Event Listeners
                document.addEventListener('click', handler)
            },

            unbind: function (el, binding) {
                // Remove Event Listeners
                document.removeEventListener('click', el.__vueClickOutside__)
                el.__vueClickOutside__ = null

            }
        }
    }
});

Vue.component('chart-flot', {
    template: '<div class="demo-placeholder" style="width:100%; height:280px;"></div>',
    props: [
        'data'
    ],
    watch: {
        data: function () {
            this.initChartFlot();
        }
    },
    methods: {
        initChartFlot: function () {
            if (typeof ($.plot) === 'undefined') {
                return;
            }

            var settings = {
                series: {
                    curvedLines: {
                        apply: true,
                        active: true,
                        monotonicFit: true
                    }
                },
                colors: ['#26B99A'],
                grid: {
                    borderWidth: {
                        top: 0,
                        right: 0,
                        bottom: 1,
                        left: 1
                    },
                    borderColor: {
                        bottom: '#7F8790',
                        left: '#7F8790'
                    },
                    clickable: true,
                    hoverable: true
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    mode: 'time',
                    timezone: 'Asia/Seoul',
                    timeformat: '%H:%M'
                }
            };

            if ($(this.$el).length) {
                $.plot($(this.$el), [{
                    data: this.data,
                    lines: {
                        fillColor: 'rgba(150, 202, 89, 0.12)'
                    },
                    points: {
                        fillColor: '#fff'
                    }
                }], settings);
            }
            ;
        }
    }
});

Vue.component('chart-flot-double', {
    template: '<div class="demo-placeholder" style="width:100%; height:280px;"></div>',
    props: [
        'data1',
        'label1',
        'data2',
        'label2'
    ],
    watch: {
        data1: function () {
            this.initChartFlot();
        }
    },
    methods: {
        initChartFlot: function () {
            if (typeof ($.plot) === 'undefined') {
                return;
            }

            var settings = {
                series: {
                    lines: {
                        show: false,
                        fill: true
                    },
                    splines: {
                        show: true,
                        tension: 0.4,
                        lineWidth: 1,
                        fill: 0.4
                    },
                    points: {
                        radius: 0,
                        show: true
                    },
                    shadowSize: 2
                },
                legend: {
                    position: 'ne',
                    margin: [0, -25],
                    noColumns: 0,
                    labelBoxBorderColor: null,
                    labelFormatter: function (label, series) {
                        return label + '&nbsp;&nbsp;';
                    },
                    width: 40,
                    height: 1
                },
                grid: {
                    show: true,
                    aboveData: true,
                    color: '#3f3f3f',
                    labelMargin: 10,
                    axisMargin: 0,
                    borderWidth: 0,
                    borderColor: null,
                    minBorderMargin: 5,
                    clickable: true,
                    hoverable: true,
                    autoHighlight: true,
                    mouseActiveRadius: 100
                },
                colors: ['rgba(38, 185, 154, 0.38)', 'rgba(3, 88, 106, 0.38)'],
                xaxis: {
                    mode: 'time',
                    timezone: 'Asia/Seoul',
                    timeformat: '%H:%M'
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    ticks: 8,
                    tickColor: 'rgba(51, 51, 51, 0.06)',
                },
            };

            if ($(this.$el).length) {
                $.plot($(this.$el),
                    [{
                        label: this.label1,
                        data: this.data1
                    },
                        {
                            label: this.label2,
                            data: this.data2
                        }], settings);
            }
            ;
        }
    }
});

Vue.component('chart-flot-triple', {
    template: '<div class="demo-placeholder" style="width:100%; height:280px;"></div>',
    props: [
        'data1',
        'label1',
        'data2',
        'label2',
        'data3',
        'label3'
    ],
    watch: {
        data1: function () {
            this.initChartFlot();
        }
    },
    methods: {
        initChartFlot: function () {
            if (typeof ($.plot) === 'undefined') {
                return;
            }

            var settings = {
                series: {
                    lines: {
                        show: false,
                        fill: true
                    },
                    splines: {
                        show: true,
                        tension: 0.4,
                        lineWidth: 1,
                        fill: 0.4
                    },
                    points: {
                        radius: 0,
                        show: true
                    },
                    shadowSize: 2
                },
                legend: {
                    position: 'ne',
                    margin: [0, -25],
                    noColumns: 0,
                    labelBoxBorderColor: null,
                    labelFormatter: function (label, series) {
                        return label + '&nbsp;&nbsp;';
                    },
                    width: 40,
                    height: 1
                },
                grid: {
                    show: true,
                    aboveData: true,
                    color: '#3f3f3f',
                    labelMargin: 10,
                    axisMargin: 0,
                    borderWidth: 0,
                    borderColor: null,
                    minBorderMargin: 5,
                    clickable: true,
                    hoverable: true,
                    autoHighlight: true,
                    mouseActiveRadius: 100
                },
                // colors: ['rgba(38, 185, 154, 0.38)': memory, 'rgba(3, 88, 106, 0.38)': cpu ],

                //by gtpark 가상머신에서 메모리,cpu,network 색깔 조절 하는 곳.
                colors: ['rgba(154, 191, 17, 0.38)', 'rgba(17, 156, 86, 0.38)', 'rgba(242, 190, 34, 0.38)'],
                xaxis: {
                    mode: 'time',
                    timezone: 'Asia/Seoul',
                    timeformat: '%H:%M'
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    ticks: 8,
                    tickColor: 'rgba(51, 51, 51, 0.06)',
                },
            };

            if ($(this.$el).length) {
                $.plot($(this.$el),
                    [{
                        label: this.label1,
                        data: this.data1
                    },
                        {
                            label: this.label2,
                            data: this.data2
                        },
                        {
                            label: this.label3,
                            data: this.data3
                        }], settings);
            }
            ;
        }
    }
});

Vue.component('chart-flot-polyline', {
    template: '<div class="demo-placeholder"></div>	',
    props: [
        'data'
    ],
    watch: {
        data: function () {
            this.initChartFlot();
        }
    },
    methods: {
        initChartFlot: function () {
            if (typeof ($.plot) === 'undefined') {
                return;
            }

            var settings = {
                grid: {
                    show: true,
                    aboveData: true,
                    color: '#3f3f3f',
                    labelMargin: 10,
                    axisMargin: 0,
                    borderWidth: 0,
                    borderColor: null,
                    minBorderMargin: 5,
                    clickable: true,
                    hoverable: true,
                    autoHighlight: true,
                    mouseActiveRadius: 100
                },
                series: {
                    lines: {
                        show: true,
                        fill: true,
                        lineWidth: 2,
                        steps: false
                    },
                    points: {
                        show: true,
                        radius: 4.5,
                        symbol: 'circle',
                        lineWidth: 3.0
                    }
                },
                legend: {
                    position: 'ne',
                    margin: [0, -25],
                    noColumns: 0,
                    labelBoxBorderColor: null,
                    labelFormatter: function (label, series) {
                        return label + '&nbsp;&nbsp;';
                    },
                    width: 40,
                    height: 1
                },
                colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
                shadowSize: 0,
                tooltip: true,
                tooltipOpts: {
                    content: '%s: %y.0',
                    xDateFormat: '%d/%m',
                    shifts: {
                        x: -30,
                        y: -50
                    },
                    defaultTheme: false
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    mode: 'time',
                    minTickSize: [1, 'day'],
                    timezone: 'Asia/Seoul',
                    timeformat: '%m/%d %HH'
                }
            };

            if ($(this.$el).length) {
                $.plot($(this.$el), [{
                    label: '사용률',
                    data: this.data,
                    lines: {
                        fillColor: 'rgba(150, 202, 89, 0.12)'
                    },
                    points: {
                        fillColor: '#fff'
                    }
                }], settings);
            }
            ;
        }
    }
});

Vue.component('spinner', {
    template: '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
});

Vue.component('v-spinner', {
    template: '<div class="loading-wrap"><div class="spinners__box"><div class="dot-loader"></div><div class="dot-loader"></div><div class="dot-loader"></div> </div><div class="loading-inner"> </div></div>'
});

Vue.component('pagination-component', {
    template: '<div class="doc-list-btm">' +
                '<div class="paging-wrap">' +
                    '<button class="btn-page goFirst" @click="goFirst">맨 처음으로</button>' +
                    '<button class="btn-page goPrev" @click="goPrev">이전 페이지로</button>' +
                    '<button class="btn-go-page" :class="{ \'here\' : index == activeIndex }" v-for="index in listIndex" :id="index" @click="goPage(index)">{{index + 1}}</button>' +
                    '<button class="btn-page goNext" @click="goNext">다음 페이지로</button>' +
                    '<button class="btn-page goLast" @click="goLast">맨 마지막으로</button>' +
                '</div>' +
              '</div>',
    props: {
        flag: String,
        datalist: Array,
        size: Number
    },
    data: function(){
        return{
            activeIndex: 0,
            currentStartIndex: 0,                  //페이지 갯수에 따라 달라지는 시작 페이징 번호(1~5일때 1에 해당)
            currentEndIndex: 0,                    //페이지 갯수에 따라 달라지는 끝 페이징 번호(1~5일때 5에 해당)
            totalStartIndex: 0,                    //맨 처음으로 버튼 눌렀을때 페이지
            totalEndIndex: 0,                      //맨 마지막으로 버튼 눌렀을때 페이지
            listIndex: [],
            viewList: []                           //paging 하여 보여줄 리스트
        }
    },
    mounted: function(){
    },
    watch: {
        datalist: function (){
            if(this.datalist != null && this.datalist.length != 0){
                if((this.datalist.length % this.size) != 0){
                    this.totalEndIndex = parseInt(this.datalist.length / this.size);
                }else{
                    this.totalEndIndex = parseInt(this.datalist.length / this.size) - 1;
                }
                this.goPage(this.activeIndex);
            }
        }
    },
    methods: {
        getIndexRange: function (){
            this.currentStartIndex = parseInt(this.activeIndex/5) * 5;          //ex)현재 페이지가 13이면 보여지는 페이지는 10 ~ 15여야 함

            if(this.totalEndIndex < this.currentStartIndex + 4){
                this.currentEndIndex = this.totalEndIndex;
            }else{
                this.currentEndIndex = this.currentStartIndex + 4;
            }
        },
        goFirst: function(){
            //1번째 페이지 이동
            this.activeIndex = 0;
            this.goPage(this.activeIndex);
        },
        goLast: function (){
            //마지막 페이지로 이동
            this.activeIndex = this.totalEndIndex;
            this.goPage(this.activeIndex);
        },
        goPage: function(index){
            this.activeIndex = index;
            this.getIndexRange();
            this.getPagingNum();
            this.getCurrentIndexData(index);
        },
        // goPrev: function(){
        //     if(this.activeIndex > 0){
        //         if((this.currentStartIndex - 5) >= this.totalStartIndex){
        //             this.activeIndex = this.currentStartIndex - 5;
        //         }
        //         this.goPage(this.activeIndex);
        //     }else{
        //
        //     }
        // },
        // goNext: function(){
        //     if(this.activeIndex < this.totalEndIndex){
        //         if((this.currentStartIndex + 5) <= this.totalEndIndex){
        //             this.activeIndex = this.currentStartIndex + 5;
        //         }else{
        //
        //         }
        //         this.goPage(this.activeIndex);
        //     }else{
        //
        //     }
        // },
        goPrev: function(){
            if(this.activeIndex > 0){
                this.activeIndex--;
                this.goPage(this.activeIndex);
            }else{

            }
        },
        goNext: function(){
            if(this.activeIndex < this.totalEndIndex){
                this.activeIndex++;
                this.goPage(this.activeIndex);
            }else{

            }
        },
        getPagingNum: function(){
            this.listIndex = [];
            for(var i=this.currentStartIndex; i<=this.currentEndIndex; i++){
                this.listIndex.push(i);
            }
        },
        getCurrentIndexData: function (index){
            //전체 리스트에서 가져올 영역 설정
            let start = 0;
            let end = 0;

            end = ((index+1) * this.size);
            start = end - this.size;

            this.viewList = this.datalist.slice(start, end);
            this.callback(this.viewList);
        },
        callback: function (viewList){
            //한 페이지에 여러개 들어가면 flag prop로 컨트롤
            this.$emit("setviewlist", viewList, this.flag);
        }
    }

})

Vue.component('sort-component', {
    template: '<div></div>',
    props: {
        datalist: Array,
        datastring: String
    },
    data: function() {
        return {
            dataSortObject: {}
        }
    },
    mounted: function (){
    },
    methods: {
        sort: function (){
            var fa;
            var fb;

            if (this.datalist === null) {
                return this.datalist;
            } else{
                this.datalist.sort((a, b) => {
                    if(this.dataSortObject.sortTypeof === 'string'){
                        //1.string 비교
                        if(a[this.dataSortObject.type] === null || a[this.dataSortObject.type] === undefined){
                            a[this.dataSortObject.type] = '';
                            b[this.dataSortObject.type] = '';
                        }
                        fa = a[this.dataSortObject.type].toLowerCase();
                        fb = b[this.dataSortObject.type].toLowerCase();

                    }else if(this.dataSortObject.sortTypeof === 'number' || this.dataSortObject.sortTypeof === 'boolean'){
                        //2.number/boolean 비교
                        //2-1. number인데 type이 string으로 들어온 경우
                        if(typeof(a[this.dataSortObject.type]) === 'string'){
                            fa = Number(a[this.dataSortObject.type]);
                            fb = Number(b[this.dataSortObject.type]);
                        }else{
                            //2-2. 숫자로 들어온 경우 && boolean
                            fa = a[this.dataSortObject.type];
                            fb = b[this.dataSortObject.type];
                        }
                    }

                    if(this.dataSortObject.orderBy === 'asc'){
                        if(fa < fb){
                            return -1;
                        }else if(fa > fb){
                            return 1;
                        }else{
                            return 0;
                        }
                    }else{
                        if(fa > fb){
                            return -1;
                        }else if(fa < fb){
                            return 1;
                        }else{
                            return 0;
                        }
                    }
                })
            }
        }
    },
    watch:{
        datastring: function(){
            this.dataSortObject.type = this.datastring.split(':')[0];
            this.dataSortObject.sortTypeof = this.datastring.split(':')[1];
            this.dataSortObject.orderBy = this.datastring.split(':')[2];

            this.sort();
        }
    },

    callback: function (){
        this.$emit("setviewlist", this.datalist);
    }
})
var vncConsole = new Vue({
    methods: {
        connect: function (vmName, type) {
            this.$http.post('/vmConsole/ticket', {vmName: vmName, type: type}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    // console.log("response", response);
                    let data = response.data;
                    //let url = window.location.protocol + "//" + window.location.host + "/vmConsole/vncView?host="+data.vmConsoleVo.hostAddress+"&port="+data.vmConsoleVo.hostPort+"&path="+data.vmConsoleVo.address+":"+data.vmConsoleVo.port+"&password="+data.vmConsoleVo.passwd+"&autoconnect=1";
                    let url = "http://" + window.location.hostname + ":8080/vmConsole/vncView?host=" + data.vmConsoleVo.hostAddress + "&port=" + data.vmConsoleVo.hostPort + "&path=" + data.vmConsoleVo.address + ":" + data.vmConsoleVo.port + "&password=" + data.vmConsoleVo.passwd + "&autoconnect=1";
                    if (window.location.hostname == 'demo.okestro.com') {
                        url = "http://" + window.location.hostname + "/vmConsole/vncView?host=" + data.vmConsoleVo.hostAddress + "&port=" + data.vmConsoleVo.hostPort + "&path=" + data.vmConsoleVo.address + ":" + data.vmConsoleVo.port + "&password=" + data.vmConsoleVo.passwd + "&autoconnect=1";
                    }

                    window.open(url, "_blank");
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });

        }
    }

})

// define maxlength
Vue.prototype.$maxName = '20';
Vue.prototype.$maxDescription = '100';

Vue.prototype.$maxId = '20';
Vue.prototype.$maxPassword = '16';
Vue.prototype.$maxEmail = '50';

Vue.mixin({
    methods: {
        getVmStatusToKor: function (status) {
            switch (status) {
                case 'up':
                    return '실행 중'
                case 'wait_for_launch':
                    return '시작 대기 중'
                case 'powering_up':
                    return '전원을 켜는 중'
                case 'powering_down':
                    return '전원을 끄는 중'
                case 'down':
                    return '정지'
                case 'migrating':
                    return '이동 중'
                case 'suspended':
                    return '일시정지'
                case 'saving_state':
                    return '상태를 저장하는 중'
                case 'reboot_in_progress':
                    return '재기동 중'
                case 'image_locked':
                    return '잠김'
                case 'not_responding':
                    return '응답없음'
                case 'paused':
                    return '일시정지됨'
                case 'newConfig':
                    return '다음 실행 시 새로운 설정이 적용됨'
            }
        },
        getHostStatusToKor: function (status) {
            switch (status) {
                case 'up':
                    return '실행 중'
                case 'connecting':
                    return '연결중'
                case 'down':
                    return '정지'
                case 'error':
                    return '에러'
                case 'initializing':
                    return '초기화중'
                case 'install_failed':
                    return '설치실패'
                case 'installing':
                    return '설치중'
                case 'installing_os':
                    return '설치중'
                case 'maintenance':
                    return '유지보수'
                case 'preparing_for_maintenance':
                    return '유지보수 준비중'
                case 'non_operational':
                    return '작동하지 않음'
                case 'non_responsive':
                    return '응답없음'
                case 'unassigned':
                    return 'unassigned'
                case 'reboot':
                    return '재시작'
                case 'kdumping':
                    return 'kdumping'
                case 'pending_approval':
                    return 'pending_approval'
            }
        },
        getEventStatusToKor: function (status) {
            switch (status) {
                case 'normal':
                    return '정상';
                case 'error':
                    return '오류'
                case 'warning':
                    return '경고'
            }
        },
        checkInputName: function (name) {
            var response = {
                result: true
            };

            var namePattern = /[ `~!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?^(가-힣)]/;

            if (name == "" || name == null) {
                response.msg = "비워둘 수 없습니다.";
            } else if (namePattern.test(name)) {
                response.msg = "4~20자 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.";
            } else {
                response.result = false;
            }

            return response;
        },
        checkPassword: function (pwd) {
            var response = {
                result: false
            };

            var namePattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

            if (pwd == "" || pwd == null) {
                response.pwd = "비워둘 수 없습니다.";
            } else if (namePattern.test(pwd)) {
                response.msg = "4~20자 영문, 숫자와 특수기호만 사용 가능합니다.";
            } else {
                response.result = true;
            }

            return response;
        }
    }
})
