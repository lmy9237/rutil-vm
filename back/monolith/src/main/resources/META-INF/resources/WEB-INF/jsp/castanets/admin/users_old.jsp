<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<div class="right_col" role="main" id="users">
	<!-- loading -->
	<spinner v-show="spinnerOn"></spinner>

	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>
					관리 <small>&#62; 사용자</small>
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
						        <button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveUsers()">
						            <i class="fa fa-refresh"></i>
						        </button>
						    </div>
							<div class="btn-group">
								<button type="button" class="btn btn-success btn-sm" @click="viewAddUser()">
									<i class="fa fa-file-o"></i> 등록
								</button>
								<button type="button" class="btn btn-success btn-sm" :disabled="selectedUsers.length <= 0" @click="updateUser()">
									<i class="fa fa-trash-o"></i> 편집
								</button>
								<button type="button" class="btn btn-success btn-sm" :disabled="selectedUsers.length <= 0" @click="removeUsers()">
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
									<th>ID</th>
									<th>성</th>
									<th>이름</th>
									<th>이메일</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="user in users">
									<td class="a-center">
										<input type="checkbox" :id="user.id" :value="user" v-model="selectedUsers">
									</td>
									<td v-if="user.administrative === true">관리자</td>
									<td v-else>사용자</td>
									<td>{{user.id}}</td>
									<td>{{user.lastName}}</td>
									<td>{{user.name}}</td>
									<td>{{user.email}}</td>
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

<script src="/js/castanets/admin/users.js" type="text/javascript"></script>