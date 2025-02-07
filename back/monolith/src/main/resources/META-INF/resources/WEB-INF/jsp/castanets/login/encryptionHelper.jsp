<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

	
<script type="text/javascript">

var encryption;
	$(document).ready(function(){
		encryption = new Vue({
			el: '#encryption',
			data: {
				resultStr : null
				,inputStr : ""
			},
			methods: {
				getEncryption : function() {
			
					console.log("getEncryptionHelper");
					let param = {
							inputStr : encryption.inputStr
					}
					this.$http.post('/login/getEncryptionHelper',param,{
						headers: {
					        'Content-Type': 'application/json'
					    }
					})
					  .then(function (response) {
						  console.log("response", response);
						  encryption.resultStr = response.data.result;
						  
					  })
					  .catch(function (error) {
					    console.log(error);
					  })
					  .then(function () {
					    // always executed
					  });  
				}
			}
			
		});
	});

</script>

<!-- page content --> 
        <div class="right_col" role="main" id="encryption">
            <div class="page-title">
              <div class="title_left">
                <h3>karajan.properties</h3>
              </div>

              <div class="text-right">
                <div class="col-md-6 col-sm-6 col-xs-12 form-group pull-right">
					<div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3 f-right">
						<button type="submit" class="btn btn-success" v-on:click="getEncryption">생성</button>
					</div>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                    <h2>일반 </h2>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <br />
                    <form class="form-horizontal form-label-left">
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">입력 </label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="inputString" v-model="inputStr">
                        </div>
                      </div>
					  <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">출력 </label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" class="form-control" placeholder="encryption" v-model="resultStr">
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
			  
			<!-- 고급옵션 -->
        </div>
        <!-- /page content -->