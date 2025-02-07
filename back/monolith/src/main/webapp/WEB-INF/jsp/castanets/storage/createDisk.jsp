<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


         <!-- page content -->
        <div class="right_col" role="main" id="createDiskVue">
        
          <spinner v-show="spinnerOn"></spinner>
		
		  <div class="" v-show="!spinnerOn" v-cloak>
            <div class="page-title">
              <div class="title_left">
                <h3>새 가상 디스크</h3>
              </div>
              <div class="text-right">
                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3 f-right">
						<button class="btn btn-primary" type="reset" @click="goList()">취소</button>
						<button type="submit" class="btn btn-success" @click="createDisk()">생성</button>
					</div>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">

                  <div class="x_content">
                  <div role="tabpanel">

                    <div class="row">
                      <!-- Nav tabs -->
                      <ul class="nav nav-tabs" role="tablist">
                        <li @click="flagDisk(1)" role="presentation" class="active"><a data-value="direct" href="#imageDisk" aria-controls="imageDisk" role="tab" data-toggle="tab">이미지</a></li>
                        <%--												<li role="presentation"><a href="#IPv6Tab" aria-controls="IPv6Tab" role="tab" data-toggle="tab">IPv6</a></li>--%>
                        <li @click="flagDisk(2)" role="presentation"><a href="#LUNDisk" data-value="LUN" aria-controls="LUNDisk" role="tab" data-toggle="tab">직접 LUN</a></li>
                      </ul>
                    </div>

                    <div class="tab-content">

                      <div role="tabpanel" class="tab-pane active" id="imageDisk">
                      <br />
                      <form class="form-horizontal form-label-left">
                        <div class="form-group">
                          <label class="control-label col-md-3 col-sm-3 col-xs-12">크기(GByte)<span class="text-danger"></span></label>
                          <div class="col-md-9 col-sm-9 col-xs-12">
                            <input type="text" class="form-control" placeholder="#GByte" v-model="disk.size">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
                          <div class="col-md-9 col-sm-9 col-xs-12">
                            <input type="text" class="form-control" placeholder="이름" v-model="disk.name" @input="checkDiskName" :maxlength="this.$maxName">
                            <p class="text-danger" v-if="diskNameStatus || disk.name == ''">기호는 '-', '_'만 사용가능합니다. 공백도 허용하지 않습니다.</p>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="control-label col-md-3 col-sm-3 col-xs-12">설명 </label>
                          <div class="col-md-9 col-sm-9 col-xs-12">
                            <input type="text" class="form-control" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">
                          </div>
                        </div>


                        <div class="form-group">
                          <div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3" >
                            <!--
                            <div class="checkbox">
                              <label>
                                <input type="checkbox" class="" checked="checked" v-model="disk.bootable"> 부팅 가능
                              </label>
                            </div>


                            <div class="checkbox">
                              <label>
                                <input type="checkbox" class="" checked="checked" v-model="disk.wipeAfterDelete"> 삭제 후 초기화
                              </label>
                            </div>
                             -->

                            <div class="checkbox">
                              <label>
                                <input type="checkbox" class="" checked="checked" v-model="disk.shareable"> 공유 가능
                              </label>
                            </div>

                          </div>
                        </div>


                        <hr>
                        <div class="form-group">
                          <label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 도메인<span class="text-danger">*</span></label>
                          <div class="col-md-9 col-sm-9 col-xs-12">
                            <select class="form-control"  v-model="disk.storageDomainId" @change="setDiskProfileId()">
                              <option value="">스토리지 도메인 선택</option>
                              <option  v-for="storageDomain in storageDomains" v-if="storageDomain.type == 'DATA'" v-bind:value="storageDomain.id">{{storageDomain.name}}</option>
                            </select>
                          </div>
                        </div>
                        <!--
                        <div class="form-group">
                          <label class="control-label col-md-3 col-sm-3 col-xs-12">할당 정책 </label>
                          <div class="col-md-9 col-sm-9 col-xs-12">
                            <select class="form-control">
                              <option>Choose option</option>
                              <option>Option one</option>
                              <option>Option two</option>
                              <option>Option three</option>
                              <option>Option four</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="control-label col-md-3 col-sm-3 col-xs-12">디스크 프로파일 </label>
                          <div class="col-md-9 col-sm-9 col-xs-12">
                            <select class="form-control" v-model="disk.diskProfileId">
                              <option v-bind:value="disk.diskProfileId">{{disk.diskProfileName}}</option>
                            </select>
                          </div>
                        </div>
                         -->
                       </form>
                      </div>

                      <div role="tabpanel" class="tab-pane" id="LUNDisk">
                        <br />
                        <form class="form-horizontal form-label-left">
                          <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">이름<span class="text-danger">*</span></label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                              <input type="text" class="form-control" placeholder="이름" v-model="disk.name" @input="checkDiskName" :maxlength="this.$maxName">
                              <p class="text-danger" v-if="diskNameStatus || disk.name == ''">기호는 '-', '_'만 사용가능합니다. 공백도 허용하지 않습니다.</p>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">설명 </label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                              <input type="text" class="form-control" placeholder="설명" v-model="disk.description" :maxlength="this.$maxDescription">
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3 col-sm-offset-3" >
                              <div class="checkbox">
                                <label>
                                  <input type="checkbox" class="" checked="checked" v-model="disk.shareable"> 공유 가능
                                </label>
                              </div>
                            </div>
                          </div>
                          <hr>
                          <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">사용 호스트<span class="text-danger">*</span></label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                              <select class="form-control"  v-model="lunVos" @change="changeHost()">
                                <option value="">사용 호스트 선택</option>
                                <option  v-for="host in hosts"  :value="host.lunVos">{{host.name}}</option>
                              </select>
                            </div>
                          </div>
                          <hr>
                          <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">스토리지 타입<span class="text-danger">*</span></label>
                            <div class="col-md-9 col-sm-9 col-xs-12">
                              <select class="form-control"  v-model="disk.storageType">
                                <option value="">스토리지 타입 선택</option>
                                <option  value="FCP">파이버 채널</option>
                              </select>
                            </div>
                          </div>
                        </form>
                        <hr>
                        <table v-if="lunVos.length > 0 && disk.storageType == 'FCP'" class="table table-striped text-center">
                          <thead>
                          <tr>
                            <th>
                              <input disabled type="checkbox">
                            </th>
                            <th>LUN ID</th>
                            <th>크기</th>
                            <th>경로</th>
                            <th>벤더 ID</th>
                            <th>제품 ID</th>
                            <th>시리얼</th>
                          </tr>
                          </thead>
                          <tbody>
                              <tr  v-for="lun of lunVos" @click="selectLun(lun)">
                                <td class="a-center">
                                  <input :disabled="lun.diskId != null" type="checkbox" :id="lun.lunId" :value="lun" v-model="selectedLun">
                                </td>
                                <td>{{lun.lunId}}</td>
                                <td>{{(lun.lunSize / Math.pow(1024, 3)).toFixed(2) }}GB</td>
                                <td>{{lun.lunPath}}</td>
                                <td>{{lun.lunVendor}}</td>
                                <td>{{lun.lunProductId}}</td>
                                <td>{{lun.lunSerial}}</td>
                              </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                   </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /page content -->

<script src="/js/castanets/storage/createDisk.js" type="text/javascript"></script>