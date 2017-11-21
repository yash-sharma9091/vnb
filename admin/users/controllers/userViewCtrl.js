'use strict';
mimicTrading.controller('userViewCtrl', ['$scope', '$state','user','appSvr','userSvr',
	($scope, $state, user, appSvr,userSvr) => {
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});

		/**
		 * Request would only sent if state params has id
		 * @param  {integer} $state.params.id [user id]
		 * @return {Object}                  [user data]
		 */
		 
        $scope.userinfo = user.record;

		/**
		 * it would take you to the edit page
		 * 
		 */
		$scope.approveSingleReq = (userdata) => {
			let inputJson={};
			    inputJson._id=userdata._id;
			    inputJson.status="Approve";
			bootbox.confirm({ 
			  size: "small",
			  message: "Are you sure You want to approve?", 
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
			})    
		};

		$scope.rejectSingleReq = (userdata) => {
			let inputJson={};
			    inputJson._id=userdata._id;
			    inputJson.status="Reject";

			bootbox.confirm({ 
			  size: "small",
			  message: "Are you sure You want to reject?", 
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
			})      

		};

		$scope.goBack = () => {
			$state.go('users');
			// var queryString = $location.search();
			// $state.go((queryString) ? ((queryString.back === 'strategies') ? 'strategies':'users'):'users');
		};
	}
]);
