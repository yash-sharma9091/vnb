'use strict';
mimicTrading.controller('userEditCtrl', ['$scope', '$state','user', 'Upload','appSvr',
	function($scope, $state, user, Upload, appSvr){
		$scope.$on('$viewContentLoaded', function() {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});

		$scope.user = user.record;
		/**
		 * Check if form is valid and send the data to server
		 * @param  {isValid} isValid [form.valid]
		 * @return {redirect to user listing on successful insertion}
		 */
		$scope.edit_user = function (isValid) {

			if( !isValid ){
				App.scrollTop();
				return;
			}

			var user = {};
			if( !angular.isObject($scope.user.profile_image) ){
				angular.copy($scope.user, user);
				delete user.profile_image;
			} else {
				user = $scope.user;
			}
			
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl(`user/edit/${user._id}`),
				data: user,
				method: 'PUT'
			})
			.then(function (response) {
				$state.go('users');
			})
			.catch(function (error) {
				if( error.data ) {
					angular.forEach(error.data, function (value, prop) {
						$scope.editUserForm[prop].$setValidity('unique', false);
					});
					App.scrollTop();
				}
			})
			.finally(function () {
				$scope.isLoading = false;
			});
		};

		/**
		 * this will clear the form error
		 * @param  input name attr
		 */
		$scope.clear = function (name, form) {
			form[name].$setValidity('unique', true);
		};
	}
]);
