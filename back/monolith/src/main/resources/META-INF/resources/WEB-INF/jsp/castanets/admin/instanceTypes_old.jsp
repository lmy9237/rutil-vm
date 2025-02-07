<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    
<div class="right_col" role="main" id="instanceTypes">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>
					관리 <small>&#62; 인스턴스 유형</small>
				</h3>
			</div>
		</div>
		<div class="clearfix"></div>
	
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<div class="row text-right">
							<div style="float:left;">
								<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveInstanceTypes()">
									<i class="fa fa-refresh"></i>
								</button>
							</div>
							<div class="btn-group">
								<button type="button" class="btn btn-success btn-sm" v-on:click="createInstanceType()">
									<i class="fa fa-file-o"></i> 등록
								</button>
								<button type="button" class="btn btn-success btn-sm" v-on:click="updateInstanceType()">
									<i class="fa fa-edit"></i> 편집
								</button>
								<button type="button" class="btn btn-success btn-sm" v-on:click="removeInstanceType()">
									<i class="fa fa-trash-o"></i> 삭제
								</button>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center jambo_table bulk_action">
							<thead>
								<tr>
									<th></th>
									<th>이름</th>
									<th>설명</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="instanceType in instanceTypes" @click="selectInstanceType(instanceType)">
									<td class="a-center">
										<input type="checkbox" :id="instanceType.id" :value="instanceType" v-model="selectedInstanceTypes">
									</td>
									<td>{{instanceType.name}}</td>
									<td>{{instanceType.description}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
	
		<div id="datatable-buttons_wrapper"
			class="dataTables_wrapper form-inline dt-bootstrap no-footer"></div>
	</div>
</div>

<script src="/js/castanets/admin/instanceTypes.js" type="text/javascript"></script>