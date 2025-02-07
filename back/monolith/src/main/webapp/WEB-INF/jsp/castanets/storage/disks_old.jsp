<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


        <!-- page content -->
        <div class="right_col" role="main" id="disksVue">
        
          <spinner v-show="spinnerOn"></spinner>
		
		  <div class="" v-show="!spinnerOn" v-cloak>
            <div class="page-title">
              <div class="title_left">
                <h3> 스토리지 <small>&#62; 디스크</small></h3>
              </div>
            </div>
            <div class="clearfix"></div>

            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
<!--                     <h2>디스크</h2> -->
                    <div class="row text-right">
                    	<div style="float:left;">
							<button type="button" class="btn btn-default btn-round btn-sm" v-on:click="retrieveDisks()">
								<i class="fa fa-refresh"></i>
							</button>
						</div>
                        <div class="btn-group">
                            <button type="button" class="btn btn-success btn-sm" @click="goCreateDisk()"><i class="fa fa-file-o"></i> 등록</button>
                            <button type="button" class="btn btn-success btn-sm" @click="removeDisk()" :disabled="selectedDisks.length!=1"><i class="fa fa-trash-o"></i> 삭제</button>
<!--                             <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target=".migrationmodal" @click="moveDisk()"><i class="fa fa-arrows"></i> 이동</button> -->
                            <button type="button" class="btn btn-primary btn-sm" @click="moveDisk()" :disabled="selectedDisks.length!=1"><i class="fa fa-arrows"></i> 이동</button>
						    <button type="button" class="btn btn-primary btn-sm" @click="copyDisk()" :disabled="selectedDisks.length!=1"><i class="fa fa-copy"></i> 복사</button>

							<button type="button" class="btn btn-primary btn-sm" @click="uploadCreateDisk" ><i class="fa fa-upload"></i> 업로드 </button>

						<%--							<button type="button" class="btn btn-primary dropdown-toggle btn-sm" @click="uploadCreateDisk" data-toggle="dropdown"><i class="fa fa-upload"></i> 업로드 <span class="caret"></span></button>--%>
<%--							<ul role="menu" class="dropdown-menu">--%>
<%--								<li :class="{disabled : false}"><a href="#" @click="uploadCreateDisk">시작</a></li>--%>
<%--								<li :class="{disabled : false}"><a href="#" data-toggle="modal" data-target=".uploadmodal">취소</a></li>--%>
<%--								<li :class="{disabled : false}"><a href="#" data-toggle="modal" data-target=".uploadmodal">일시중지</a></li>--%>
<%--								<li :class="{disabled : false}"><a href="#" data-toggle="modal" data-target=".uploadmodal">다시시작</a></li>--%>
<%--							</ul>--%>
<%--							<button type="button" class="btn btn-primary btn-sm" @click="downloadDisk"><i class="fa fa-download"> </i> 다운로드</button>--%>

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
                          <th style="width: 10%">상태</th>
                          <th style="width: 10%">이름</th>
                          <th style="width: 15%">ID</th>
                          <th>가상크기</th>
                          <th>공유</th>
                          <th style="width: 10%">연결 대상</th>
                          <th>스토리지 도메인</th>
                          <th>유형</th>
                          <th style="width: 10%">설명</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="disk in disks" @click="selectDisk(disk)">
                             <td class="a-center">
								<input type="checkbox" class="" :id="disk.name" :value="disk" v-model="selectedDisks">
							</td>
                          <!-- <td><i class="fa fa-circle-o green" v-bind:class="{ 'fa-circle-o green': 'OK'==disk.status, 'fa-close red': 'OK' !=disk.status }"></i></td> -->
                          <td v-if="disk.status === 'ok'" ><i class="fa fa-arrow-up green" title="정상"></i></td>
                          <td v-if="disk.status === 'locked'" ><i class="fa fa-lock blue" title="잠김"></i></td>
                          <td v-if="disk.status === 'illegal'" ><i class="fa fa-arrow-down red" title="액세스 실패"></i></td>
						  <td v-if="disk.status !== 'ok' && disk.status !== 'locked' && disk.status !== 'illegal'" >
							  <i class="fa fa-spinner fa-spin green" title="업로드 중"></i>&nbsp;&nbsp;{{disk.status}}</td>
                          <td>{{disk.name}}</td>
                          <td>{{disk.id}}</td>
                          <td>{{(disk.virtualSize / Math.pow(1024, 3)).toFixed(2) }}GB</td>
                          <td>{{disk.sharable ? 'O' : 'X'}}</td>
                          <td>{{disk.attachedTo}}</td>
                          <td>{{disk.storageDomainName}}</td>
                          <td>{{disk.type}}</td>
                          <td>{{disk.description}}</td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
              <div class="clearfix"></div>

			  <!-- move/ copy modal -->
			  <div class="modal fade migrationmodal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                      <div class="modal-content">

                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span>
                          </button>
                          <h4 class="modal-title" id="myModalLabel">{{migDisk.migrationType=='move' ? '디스크 이동' : '디스크 복사'}}</h4>
                        </div>
                        <div class="modal-body">
						  <div class="row">
							  <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12"> 이름 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
								  <div v-if="migDisk.migrationType=='move'">{{migDisk.disk.name}}</div>
								  <div v-if="migDisk.migrationType=='copy'">
								  	<input type="text" class="form-control" placeholder="" v-model="migDisk.targetDiskName">
								  </div>
								</div>
							  </div>
							  <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12"> 가상 크기 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
								  {{(migDisk.disk.virtualSize / Math.pow(1024, 3)).toFixed(2) }}GB
								  <!-- <input type="text" class="form-control" placeholder="" :disabled="migDisk.migrationType=='move'"> -->
								</div>
							  </div>
							  <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12"> 소스 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
								  <input type="text" class="form-control" placeholder="" :disabled="true" v-model="migDisk.disk.storageDomainName">
								</div>
							  </div>
							  <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12"> 대상 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
								  <select class="form-control" v-model="migDisk.targetStorageDomainId" @change="setDiskProfileId()">
									<option value="">대상 스토리지 도메인 선택</option>
									<!-- 스토리지 타입이 DATA만 보임. move이면 domainId가 같은것은 안보임-->
									<option v-for="domain in storageDomains" v-if="domain.type == 'DATA' && (migDisk.migrationType=='copy' || migDisk.disk.storageDomainId != domain.id)" v-bind:value="domain.id">{{domain.name}}</option>
								  </select>
									&nbsp대상 스토리지 도메인을 선택해야 합니다. 이동은 대상 스토리지가 같을 수 없습니다.
								</div>
							  </div>

							</div>
						  </div>
                        <div class="modal-footer">
						  <button type="button" class="btn btn-primary" :disabled="migDisk.targetStorageDomainId == '' " @click="migrationDisk()">확인</button>
                          <button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
                        </div>

                      </div>
                    </div>
                  </div>



			  <!--by gtpark upload modal -->
			  <div class="modal fade uploadmodal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                      <div class="modal-content">

                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" @click="resetUploadDisk()"><span aria-hidden="true">×</span>
                          </button>
                          <h4 class="modal-title" id="myModalLabel2">이미지 업로드</h4>
                        </div>
                        <div class="modal-body">
						  <div class="row">
							  <div class="btn-group">
								  <form action="/storage/disks/retrieveDiskImage" method="post" name="file">
								<input @change="receiveDiskFile"  ref="diskFile" type="file" value="파일 선택" name="file"/>
								  </form>
							  </div>
							  <div class="btn-group">
								<label>디스크 포멧</label>
							  </div>
							  <div class="btn-group" style="padding-left: 5%;">
								  <select @change="retrieveDiskSize" class="form-control" :disabled="this.uploadDiskFile.length == 0"  v-model="uploadDisk.format">
									 <option  v-for="format of formats">{{format.name}}</option>
								 </select>
							  </div><hr>
							  <div v-if="uploadDisk.format !== '포멧 선택'">
								  <div class="form-group">
									<label class="control-label col-md-3 col-sm-3 col-xs-12"> 크기(GByte) </label>
									<div class="col-md-9 col-sm-9 col-xs-12" >
									  <input type="text" class="form-control"  placeholder="" :disabled="true"  v-model="uploadDisk.size">
									</div>
								  </div>
								  <div class="form-group">
									  <label class="control-label col-md-3 col-sm-3 col-xs-12"> 가상 크기(GByte) </label>
									  <div class="col-md-9 col-sm-9 col-xs-12">
										  <input type="text" class="form-control" placeholder="" :disabled="uploadDisk.format !== 'qcow2'"  v-model="uploadDisk.virtualSize">
									  </div>
								  </div>
							  </div>

							  <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12" > 이름 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
								  <input type="text" class="form-control" placeholder="" v-model="uploadDisk.name">
								</div>
							  </div>
							  <div class="form-group">
								<label class="control-label col-md-3 col-sm-3 col-xs-12"> 설명 </label>
								<div class="col-md-9 col-sm-9 col-xs-12">
								  <input type="text" class="form-control" placeholder="" v-model="uploadDisk.description">
								</div>
							  </div>

						<table>
							<tr>
								<td>
									<div class="form-group">
										<div style="margin-left: 132%; width:100%" class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3" >
											<div class="checkbox">
												<label>
													<input type="checkbox" class="" v-model="uploadDisk.wipeAfterDelete"> 삭제 후 초기화
												</label>
											</div>
										</div>
									</div>
								</td>

								<td>
									<div class="form-group">
										<div style="margin-left: 200%; width:100%" class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3" >
											<div class="checkbox">
												<label>
													<input type="checkbox" class="" v-model="uploadDisk.isShareable"> 공유 가능
												</label>
											</div>
										</div>
									</div>
								</td>
							</tr>
						</table>

						  <div class="form-group">
							  <label class="control-label col-md-3 col-sm-3 col-xs-12"> 데이터 센터 </label>
							  <div class="col-md-9 col-sm-9 col-xs-12">
								  <select class="form-control" v-model="uploadDisk.dataCenterId" >
									  <option v-for="dataCenter of dataCenters" :value="dataCenter.id">{{dataCenter.name}}</option>
								  </select>
							  </div>
						  </div>
						  <div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12"> 스토리지 도메인 </label>
							<div class="col-md-9 col-sm-9 col-xs-12">
							  <select class="form-control" v-model="uploadDisk.storageDomainId">
								<option v-for="storageDomain of storageDomains" :value="storageDomain.id">{{storageDomain.storageDomainInfo}}</option>
							  </select>
							</div>
						  </div>
						  <div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12"> 디스크 프로파일 </label>
							<div class="col-md-9 col-sm-9 col-xs-12">
							  <select class="form-control" v-model="uploadDisk.diskProfileId">
								<option v-for="diskProfile of storageDomains" :value="diskProfile.diskProfileId">{{diskProfile.diskProfileName}}</option>
							  </select>
							</div>
						  </div>
						  <div class="form-group">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">사용 호스트 </label>
							<div class="col-md-9 col-sm-9 col-xs-12">
							  <select class="form-control" v-model="uploadDisk.usingHostId">
								<option v-for="host of hosts" :value="host.id">{{host.name}}</option>
							  </select>
							</div>
						  </div>
<%--						  <button style="margin-left: 1%;" type="button" class="btn btn-success left">연결테스트</button>--%>
						</div>
					  </div>
					<div class="modal-footer">
					  <button type="button" class="btn btn-primary" :disabled="uploadDisk.format == '포멧 선택'"  @click="makeUploadDisk">확인</button>
					  <button type="button" class="btn btn-default" data-dismiss="modal" @click="resetUploadDisk()">취소</button>
					</div>

				  </div>
				</div>
			  </div>
			</div>
		  </div>
        </div>
        <!-- /page content -->

<script src="/js/castanets/storage/disks.js" type="text/javascript"></script>