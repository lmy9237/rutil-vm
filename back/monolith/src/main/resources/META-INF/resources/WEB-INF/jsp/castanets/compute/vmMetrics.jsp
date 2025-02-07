<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="right_col" role="main" id="vmMetrics">
	<div class="page-title">
		<div class="title_left">
			<h3>
				컴퓨팅 <small> &#62; <a href="/compute/vms">가상머신</a> &#62; {{name}} - 메트릭</small>
			</h3>
		</div>
	</div>
	<div class="clearfix"></div>
	<div class="title row">
		<div class="col-md-12 col-sm-12 col-xs-12 ">
			<p class="text-right"><strong>마지막 업데이트 </strong><i class="glyphicon glyphicon-calendar fa fa-calendar"></i> {{lastUpdated}}</p>
		</div>
	</div>
	<!-- cpu -->
	<div class="row">
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('cpu_usage')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('cpu_average')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
	</div>
	<!-- memory -->
	<div class="row">
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('memory_usage')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('memory_distribution')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
	</div>
	<div class="row">
		<!-- disk -->
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('disk_space')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
		<!-- process -->
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('process')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
	</div>
	<!-- network -->
	<div class="row">
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('network_utilization')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-6">
			<div class="x_panel">
				<iframe :src="getPanel('network_traffic')" width="100%" height="300" frameborder="0"></iframe>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/compute/vmMetrics.js" type="text/javascript"></script>
