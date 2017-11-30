'use strict';
mimicTrading.controller('userViewCtrl', ['$scope','$rootScope', '$state','user','appSvr','userSvr',
	($scope, $rootScope, $state, user, appSvr,userSvr) => {
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
        
        $scope.userinfo = user.record;
		/**
		 * Request send for approve or reject (single user)
		 * @json  {_id,status}
		 * @return {Object} 
		*/

		$scope.approveRejectRequest=function(isValid,userdata) {
            if( !isValid ){
				return;
			}
            let inputJson={};
			     inputJson._id=userdata._id;
			     inputJson.status=userdata.request_status;
           if(userdata.request_status=="Approve"){
           	  if(userdata.pilot_request=="Approved"){
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Your request is already Approved.',
                    container: $rootScope.settings.errorContainer,
                    place: 'prepend'
                });    
           	  }
           	  else{
				 bootbox.confirm({ 
				   size: "small",
				   message: `Are you sure You want to ${inputJson.status}?`, 
				   callback: function(result){ 
	  	            if(result===true){
		     			userSvr.approveReject(inputJson).then((result) =>{
							console.log("res-------"+JSON.stringify(result));
						}).catch((err) => {
	                 	 App.alert({
	                        type: 'danger',
	                        icon: 'warning',
	                        message: err.message,
	                        container: $rootScope.settings.errorContainer,
	                        place: 'prepend'
                         });
						});	
	                }
	                else{
	                  return;
	                }
				   }
				 });  
           	  }
            }
            else{
                if(userdata.pilot_request=="Approved" || userdata.pilot_request=="Rejected"){
            	 App.alert({
                        type: 'danger',
                        icon: 'warning',
                        message: 'You can Reject only pending request.',
                        container: $rootScope.settings.errorContainer,
                        place: 'prepend'
                 });
                }
                else{
                  bootbox.dialog({
                    title:'Are you sure you want to Reject ?',
                    message: `<form>
                                 <div class="form-group">
                                  <select class="form-control target">
                                     <option value="">Select Reason</option>
                                     <option>I want to reject</option>
                                     <option>Other</option>
                                  </select>
                                 </div>
                                 <div class="form-group">
                                  <input type="text" class="form-control" style="display:none;" placeholder="Enter reason" id="reason" required>
                                </div>
                              </form>`,
                    buttons: {
                       cancel: {
                            label: '<i class="fa fa-times"></i> Cancel'
                        },
                       confirm: {
                         label: `<i class="fa fa-check"></i> ${inputJson.status}`,
                         callback:function(){
                            let selectedReason=$(".target option:selected").text();
                            let enteredReason=$("#reason").val();
                            if(selectedReason=="Other"){
                            	inputJson.reject_reason=enteredReason;
                            }
                            else{
                            	inputJson.reject_reason=selectedReason;
                            }
                        	userSvr.approveReject(inputJson).then((result) =>{
								  console.log("res-------"+JSON.stringify(result));
							}).catch((err) => {
				                App.alert({
			                        type: 'danger',
			                        icon: 'warning',
			                        message: err.message,
			                        container: $rootScope.settings.errorContainer,
			                        place: 'prepend'
		                        });
							}); 
                        
                          }
                        }
                     },
                     size:"small"
                   });

                    $( ".target" ).change(function() {
                         if(this.value == 'Other'){
                          $('#reason').show();
                         }
                         else{
                          $('#reason').hide();
                         }
                    });
                }	
            }
		};

	    /**
		 * it would take you to the edit page
		 * 
		 */
		$scope.goBack = () => {
			$state.go('users');
			// var queryString = $location.search();
			// $state.go((queryString) ? ((queryString.back === 'strategies') ? 'strategies':'users'):'users');
		};
	}
]);
