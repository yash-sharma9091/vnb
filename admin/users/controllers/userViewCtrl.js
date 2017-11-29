'use strict';
mimicTrading.controller('userViewCtrl', ['$scope', '$state','user','appSvr','userSvr',
	($scope, $state, user, appSvr,userSvr) => {
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

           if(userdata.request_status=="Approve" || userdata.request_status=="Reject"){
   			 let inputJson={};
			    inputJson._id=userdata._id;
			    inputJson.status=userdata.request_status;

			bootbox.confirm({ 
			  size: "small",
			  message: `Are you sure You want to ${inputJson.status}?`, 
			  callback: function(result){ 
  	            if(result===true){
	     			userSvr.approveReject(inputJson).then((result) =>{
						console.log("res-------"+JSON.stringify(result));
					}).catch((err) => {
		              console.log(err);
					});	
                }
                else{
                   return;
                }
			   }
			});  
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
