<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="addSystemPermissions">
	<!-- loading -->
	<spinner v-show="spinnerOn"></spinner>

	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>사용자에게 시스템 권한 추가</h3>
			</div>
			<div class="text-right">
				<div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" @click="viewSystemPermissions()">취소</button>
						<button class="btn btn-success" @click="addSystemPermissions()">추가</button>
					</div>
				</div>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12">
				<div class="x_panel">
					<div class="x_content">
						<table class="table table-striped text-center">
							<thead>
								<tr>
									<th>성</th>
									<th>이름</th>
									<th>ID</th>
									<th>역할</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="user in users">
									<td>{{user.lastName}}</td>
									<td>{{user.name}}</td>
									<td>{{user.principal}}</td>
									<td>
										<select class="form-control" v-model="user.roleId">
											<option disabled value="null">권한 선택</option>
											<option v-for="role in roles" v-bind:value="role.id">{{role.name}}</option>
										</select>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/admin/addSystemPermissions.js" type="text/javascript"></script>