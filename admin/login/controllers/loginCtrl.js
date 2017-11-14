'use strict';
mimicTrading.controller('loginCtrl', ['$scope','$rootScope','$state','$http','RestSvr', 'loginSrv',
	($scope,$rootScope,$state,$http, RestSvr, loginSrv) => {

		/**
		 * login function will authenticate user 
		 * and redirect to specific dashboard
		 * @param  {Boolean} isValid [Check if form is valid]
		 * @return {none}   [User will redirect to dashboard]
		 */
		$scope.login = (isValid) => {
			if( !isValid ){
				return;
			}
			$scope.isLoading = true;
			RestSvr.login('login', $scope.user)
			.then(response => {
				/* loginSrv will initialize user session
				 * and store user data into localStorage
				 * $rootScope.admin assign a globle variable
				 */
				loginSrv.initAdminSession(response.user, response.token);
				$state.go('dashboard');	
			})
			.catch(errors => {
				$scope.message = errors.message;
			})
			.then(() => {
				$scope.isLoading = false;
			});
		};

	   $scope.forgotpassword= ()=> {
	   	    $scope.isLoading = true;
	   	     let inputjson={email:$scope.email};
			$http.post('adminapi/forgotpassword', inputjson)
			.then(response => {
               App.alert({type: ('info'), icon: ( 'info'), message: response.data.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
	           setTimeout(function(){
                 $scope.showForgetPasswordForm=false;
               },3000);
			   //$state.go('login');	
			})
			.catch(errors => {
				$scope.message = errors.message;
			})
			.then(() => {
				$scope.isLoading = false;
			});
	  };
	}
]);