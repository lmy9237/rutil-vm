<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="systemPermissions">
	<!-- loading -->
	<spinner v-show="spinnerOn"></spinner>
	
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>
					관리 <small>&#62; 시스템 권한</small>
				</h3>
			</div>
		</div>
		<div class="clearfix"></div>
	
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>시스템 권한</h2>
						<div class="row text-right">
							<div class="btn-group">
								<button type="button" class="btn btn-success btn-sm" @click="viewAddSystemPermissions()">
									<i class="fa fa-file-o"></i> 추가
								</button>
								<button type="button" class="btn btn-success btn-sm" :disabled="selectedPermissions.length <= 0" @click="removeSystemPermissions()">
									<i class="fa fa-trash-o"></i> 삭제
								</button>
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
									<th>역할</th>
									<th>사용자</th>
									<th>인증 공급자</th>
									<th>네임 스페이스</th>
									<th>권한</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="permission in permissions">
									<td class="a-center">
										<input type="checkbox" :id="permission.id" :value="permission" v-model="selectedPermissions">
									</td>
									<td v-if="permission.administrative === true">관리자</td>
									<td v-else>사용자</td>
									<td>{{permission.user}}</td>
									<td>{{permission.authProvider}}</td>
									<td>{{permission.namespace}}</td>
									<td>{{permission.role}}</td>
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

<script src="/js/castanets/admin/systemPermissions.js" type="text/javascript"></script>