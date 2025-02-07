<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<div class="right_col" role="main" id="providers">
	<!-- loading -->
	<spinner v-show="spinnerOn"></spinner>

	<div v-show="!spinnerOn">
		<div class="page-title">
			<div class="title_left">
				<h3>
					관리 <small>&#62; 공급자</small>
				</h3>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>공급자</h2>
						<div class="row text-right">
							<div class="btn-group">
							<!-- 	<button type="button" class="btn btn-success btn-sm">
									<i class="fa fa-trash-o"></i> 추가
								</button>
								<button type="button" class="btn btn-success btn-sm">
									<i class="fa fa-trash-o"></i> 편집
								</button>
								<button type="button" class="btn btn-success btn-sm">
									<i class="fa fa-trash-o"></i> 삭제
								</button> -->
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>
										<input type="checkbox" v-model="selectAll">
									</th>
									<th>이름</th>
									<th>유형</th>
									<th>설명</th>
									<th>공급자URL</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="provider in providers">
									<td class="a-center">
										<input type="checkbox" class="flat" :id="provider.id" :value="provider" v-model="selectedProviders">
									</td>
									<td>{{provider.name}}</td>
									<td>{{provider.providerType}}</td>
									<td>{{provider.description}}</td>
									<td>{{provider.providerUrl}}</td>
								</tr>
							</tbody>
						</table>

					</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
	</div>
</div>

<script src="/js/castanets/admin/providers.js" type="text/javascript"></script>