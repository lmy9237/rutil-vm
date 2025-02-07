<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link rel="stylesheet" type="text/css" href="<c:url value = '/css/import.css' />" />

<!-- vue -->
<script src="/js/lib/vue.js"></script>
<script src="/js/lib/axios.js"></script>
<script src="/js/lib/vue-router.js"></script>
<script src="/js/lib/lodash.min.js"></script>

<!-- jquery -->
<script src="/vendors/jquery/dist/jquery.min.js"></script>

<!-- flot -->
<script src="/vendors/Flot/jquery.flot.js"></script>
<script src="/vendors/Flot/jquery.flot.pie.js"></script>
<script src="/vendors/Flot/jquery.flot.time.js"></script>
<script src="/vendors/Flot/jquery.flot.stack.js"></script>
<script src="/vendors/Flot/jquery.flot.resize.js"></script>

<!-- flot plugins -->
<script src="/vendors/flot.orderbars/js/jquery.flot.orderBars.js"></script>
<script src="/vendors/flot-spline/js/jquery.flot.spline.min.js"></script>
<script src="/vendors/flot.curvedlines/curvedLines.js"></script>

<!-- chart.js -->
<script src="/js/lib/Chart.min.js"></script>
<script src="/js/lib/vue-chartjs.min.js"></script>

<!-- moment.js -->
<script src="/vendors/moment/moment.js"></script>
<script src="/vendors/moment/locale/ko.js"></script>

<script type="text/javascript" src="/js/lib/jquery-ui.min.js"></script>
<script type="text/javascript" src="/js/lib/mCustomScrollbar.min.js"></script>
<script type="text/javascript" src="/js/lib/jquery.custom-select.js"></script>
<script type="text/javascript" src="/js/lib/pub_ui.js"></script>


<!-- castanets -->
<script src="/js/castanets/castanets.js"></script>
<script src="../../../js/lib/core.js"></script>
<script src="../../../js/lib/charts.js"></script>
<script src="../../../js/lib/animated.js"></script>

<%-- remove amCharts branding --%>
<script>
    am4core.options.commercialLicense = true;
</script>
