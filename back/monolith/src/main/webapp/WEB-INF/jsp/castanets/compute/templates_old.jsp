<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div class="right_col" role="main" id="templates">
	<spinner v-show="spinnerOn"></spinner>
	<div v-show="!spinnerOn" v-cloak>
		<div class="page-title">
			<div class="title_left">
				<h3>
					컴퓨팅 <small>&#62; 템플릿</small>
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
								<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveTemplates()">
									<i class="fa fa-refresh"></i>
								</button>
							</div>
							<div class="btn-group">
<%--								<button type="button" class="btn btn-success btn-sm" :disabled="selectedTemplates.length == 0 || selectedTemplates[0].name === 'Blank'" @click="updateTemplate()">--%>
								<button type="button" class="btn btn-success btn-sm" :disabled="selectedTemplates.length == 0 " @click="updateTemplate()">

									<i class="fa fa-edit"></i> 편집
								</button>
<%--								<button type="button" class="btn btn-success btn-sm" :disabled="selectedTemplates.length == 0 || selectedTemplates[0].name === 'Blank'"--%>
								<button type="button" class="btn btn-success btn-sm" :disabled="selectedTemplates.length == 0 "

											data-toggle="modal" data-target=".removetemplatemodal">
									<i class="fa fa-trash-o"></i> 삭제
								</button>
								<%--<button type="button" class="btn btn-success btn-sm" :disabled="selectedTemplates.length == 0 || selectedTemplates[0].name === 'Blank'"--%>
									<%--data-toggle="modal" data-target=".exporttemplatemodal" @click="checkExportTemplate()">--%>
									<%--<i class="fa fa-file-o"></i> 내보내기--%>
								<%--</button>--%>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<table class="table table-striped text-center">
<%--							<table class="table table-striped text-center jambo_table bulk_action">--%>
							<thead>
								<tr>
									<th>
									</th>
									<th>이름</th>
									<th>버전</th>
									<th>설명</th>
									<th>생성일자</th>
									<th>상태</th>
									<th>클러스터</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="template in templates" @click="selectTemplate(template)">
									<td class="a-center" v-if="template.status == 'ok'">
										<input type="checkbox" class="flat" :id="template.name" :value="template" v-model="selectedTemplates">
									</td>
									<td class="a-center" v-if="template.status == 'locked'">
										<i class="fa fa-spinner fa-spin green" title="잠김"></i>
									</td>
									<td><a :href="'/compute/template?id=' + template.id">{{template.name}}</a></td>
									<td>{{template.version}}</td>
									<td>{{template.description | truncate(20)}}</td>
									<td>{{template.creationTime}}</td>
									<td v-if="template.status == 'ok'">OK</td>
									<td v-if="template.status == 'locked'">잠김</td>
									<td><a :href="'/compute/cluster?id=' + template.cluster.id" v-if="template.cluster != null">{{template.cluster.name | truncate(20)}}</a></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
	</div>
	
	<!-- template remove modal -->
	<div class="modal fade removetemplatemodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">템플릿 삭제</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<label class="control-label col-md-12 col-sm-12 col-xs-12">
								다음 항목을 삭제하시겠습니까?
							</label>
						</div>
						<div class="form-group" v-for="template in selectedTemplates">
							<label class="control-label col-md-12 col-sm-12 col-xs-12" style="margin-top:10px" v-if="template.version == null">
								- {{template.name}}
							</label>
							<label class="control-label col-md-12 col-sm-12 col-xs-12" style="margin-top:10px" v-if="template.version != null">
								- {{template.name}} (버전: {{template.version}})
							</label>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="removeTemplate()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- template export modal -->
	<div class="modal fade exporttemplatemodal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg" style="max-width: 512px">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">템플릿 내보내기</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="form-group">
							<div class="col-md-12 col-sm-12 col-xs-12">
								<div class="checkbox">
									<label> <input type="checkbox" v-model="forceOverride"> 강제 적용</label>
								</div>
							</div>
						</div>
						<div class="form-group" v-if="template.exist">
							<div class="col-md-12 col-sm-12 col-xs-12">
								템플릿 {{template.name}} 은/는 이미 내보내기 도메인에 존재합니다.<br/>
								덮어쓰기하려면, '강제 적용' 체크박스에 표시하십시오.
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="template.exist == true && forceOverride == false" @click="exportTemplate()">확인</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/js/castanets/compute/templates.js" type="text/javascript"></script>